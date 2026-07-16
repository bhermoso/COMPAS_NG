/**
 * Expediente canónico de Atarfe — validación e hidratación.
 *
 * Verifica que el export canónico (Informe de Salud + IBSE municipal) es válido,
 * rehidratable, honesto (sin datos provinciales ni sintéticos atribuidos a Atarfe)
 * y que su seed desplegable migra un placeholder vacío sin sobrescribir contenido.
 */

import { describe, it, expect, beforeEach } from "vitest";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { parseWorkspaceJSON } from "../src/infrastructure/persistence/local-storage";
import {
  loadMunicipalitySeed,
  municipalitySeedUrl,
  hasMunicipalitySeed,
  MUNICIPALITY_SEEDS,
} from "../src/infrastructure/seeds";
import {
  loadOrCreateMunicipalityWorkspace,
  shouldReplaceWithSeed,
} from "../src/appWorkspaceHydration";
import {
  saveWorkspaceToLocalStorage,
  buildWorkspaceStorageKey,
} from "../src/infrastructure/persistence/local-storage";
import {
  createCompleteMunicipalityWorkspace,
  isEmptyWorkspaceForPersistenceGuard,
} from "../src/application/workspace";
import { createMunicipalityRuntime } from "../src/application/runtime";
import { validateCompilationPreconditions } from "../src/application/health-profile-compiler";
import {
  IBSE_MIXED_SAMPLE_SENTENCE,
  IBSE_PARTICIPANT_SAMPLE_CAUTION,
  IBSE_PARTICIPANT_MEAN_LABEL,
} from "../src/domain/ibse";
import { toAsciiSafeJson } from "../scripts/demo/asciiSafeJson";
import {
  buildAtarfeWorkspace,
  ATARFE_INPUT_SHA256,
  CANONICAL_TIMESTAMP,
  HEALTH_REPORT_ID,
  HEALTH_REPORT_DOCUMENT_ID,
  IBSE_STUDY_ID,
  HEALTH_REPORT_DOCX_PATH,
  IBSE_CSV_PATH,
} from "../scripts/demo/buildAtarfeWorkspace";

// ── localStorage mínimo ───────────────────────────────────────────────────────
const store = new Map<string, string>();
(globalThis as { localStorage?: unknown }).localStorage = {
  getItem: (k: string) => store.get(k) ?? null,
  setItem: (k: string, v: string) => {
    store.set(k, v);
  },
  removeItem: (k: string) => {
    store.delete(k);
  },
  clear: () => store.clear(),
  key: (i: number) => [...store.keys()][i] ?? null,
  get length() {
    return store.size;
  },
};

const _dir = dirname(fileURLToPath(import.meta.url));
const EXPORT_PATH = resolve(
  _dir,
  "../municipalities/atarfe/exports/compas-ng-workspace-atarfe.json"
);
const SEED_PATH = resolve(_dir, "../public/seeds/compas-ng-workspace-atarfe.json");

const EXPORT_RAW = readFileSync(EXPORT_PATH, "utf8");
const SEED_RAW = readFileSync(SEED_PATH, "utf8");

const ATARFE_INPUT = {
  id: "atarfe",
  name: "Atarfe",
  province: "Granada",
  ineCode: "18022",
  createdBy: "test",
};

// Estudios provinciales EAS y sintéticos que NUNCA deben aparecer como Atarfe.
const PROVINCIAL_STUDY_FIELDS = [
  "dukeStudy",
  "predimedStudy",
  "sf12Study",
  "suenoStudy",
  "cageStudy",
  "ipaqStudy",
];
const SYNTHETIC_STUDY_FIELDS = [
  "auditcStudy",
  "ghq12Study",
  "phq9Study",
  "psqiStudy",
  "fagerstromStudy",
  "sbqStudy",
];
const PROVINCIAL_TAGS = ["duke-eas", "predimed-eas", "sf12-eas", "sueno-eas", "cage-eas", "ipaq-eas"];
const SYNTHETIC_TAGS = ["auditc", "ghq12", "phq9", "psqi", "fagerstrom", "sbq"];

function okFetch(body: string, onUrl?: (url: string) => void): typeof fetch {
  return (async (url: string) => {
    onUrl?.(url);
    return { ok: true, status: 200, text: async () => body };
  }) as unknown as typeof fetch;
}

beforeEach(() => {
  store.clear();
});

describe("expediente canónico de Atarfe", () => {
  it("1. export canónico válido y rehidratable", () => {
    const ws = parseWorkspaceJSON(EXPORT_RAW);
    expect(ws).not.toBeNull();
    expect(ws!.schemaVersion).toBe("1.0.0");
    expect(ws!.healthReport).toBeDefined();
    expect(ws!.ibseStudy).toBeDefined();
  });

  it("2. identidad Atarfe e INE 18022", () => {
    const ws = parseWorkspaceJSON(EXPORT_RAW)!;
    expect(ws.municipality.identity.id).toBe("atarfe");
    expect(ws.municipality.identity.name).toBe("Atarfe");
    expect(ws.municipality.identity.province).toBe("Granada");
    expect(ws.municipality.identity.ineCode).toBe("18022");
  });

  it("3. recuentos exactos y deterministas (2 documentos, 6 evidencias, 1 estudio IBSE)", () => {
    const ws = parseWorkspaceJSON(EXPORT_RAW)!;
    expect(ws.repository.documents).toHaveLength(2);
    expect(ws.evidenceStore.atoms).toHaveLength(6);
    const kinds = ws.repository.documents.map((d) => d.kind).sort();
    expect(kinds).toEqual(["health-report", "redcap-export"]);
    expect(ws.ibseStudy?.aggregates.n).toBe(909);
    expect(ws.ibseStudy?.aggregates.nValid).toBe(811);
  });

  it("4. seed público byte a byte igual al export canónico", () => {
    const exportBuf = readFileSync(EXPORT_PATH);
    const seedBuf = readFileSync(SEED_PATH);
    expect(exportBuf.equals(seedBuf)).toBe(true);
  });

  it("5. el seed desplegable existe en public/ (Vite lo copia a dist) y es válido", () => {
    const ws = parseWorkspaceJSON(SEED_RAW);
    expect(ws).not.toBeNull();
    expect(ws!.municipality.identity.id).toBe("atarfe");
    expect(ws!.repository.documents).toHaveLength(2);
    expect(ws!.evidenceStore.atoms).toHaveLength(6);
    expect(MUNICIPALITY_SEEDS["atarfe"].path).toBe("seeds/compas-ng-workspace-atarfe.json");
  });

  it("6. placeholder vacío de Atarfe → migra al seed (2 docs / 6 evidencias)", async () => {
    const placeholder = createCompleteMunicipalityWorkspace(ATARFE_INPUT);
    expect(isEmptyWorkspaceForPersistenceGuard(placeholder)).toBe(true);
    expect(saveWorkspaceToLocalStorage(placeholder)).toBe(true);

    const result = loadOrCreateMunicipalityWorkspace("atarfe", ATARFE_INPUT);
    expect(result.seedPending).toBe(true);
    expect(shouldReplaceWithSeed(result.workspace, "atarfe")).toBe(true);

    const seed = await loadMunicipalitySeed("atarfe", {
      baseUrl: "/",
      fetchImpl: okFetch(SEED_RAW),
    });
    const hydrated = shouldReplaceWithSeed(result.workspace, "atarfe") ? seed : result.workspace;
    expect(hydrated?.repository.documents).toHaveLength(2);
    expect(hydrated?.evidenceStore.atoms).toHaveLength(6);
  });

  it("7. workspace local no vacío de Atarfe → preservado (no se sustituye)", () => {
    const local = parseWorkspaceJSON(EXPORT_RAW)!; // 2 docs, 6 atoms (contenido real)
    expect(saveWorkspaceToLocalStorage(local)).toBe(true);
    const result = loadOrCreateMunicipalityWorkspace("atarfe", ATARFE_INPUT);
    expect(result.seedPending).toBe(false);
    expect(shouldReplaceWithSeed(result.workspace, "atarfe")).toBe(false);
    expect(result.workspace.repository.documents).toHaveLength(2);
  });

  it("8. ningún fixture synthetic-validation entra en el expediente", () => {
    const ws = parseWorkspaceJSON(EXPORT_RAW)!;
    for (const field of SYNTHETIC_STUDY_FIELDS) {
      expect((ws as unknown as Record<string, unknown>)[field]).toBeUndefined();
    }
    const allTags = [
      ...ws.repository.documents.flatMap((d) => d.tags),
      ...ws.evidenceStore.atoms.flatMap((a) => a.tags),
    ];
    for (const tag of SYNTHETIC_TAGS) {
      expect(allTags).not.toContain(tag);
    }
  });

  it("9. no hay evidencia provincial atribuida a Atarfe (solo IBSE municipal)", () => {
    const ws = parseWorkspaceJSON(EXPORT_RAW)!;
    for (const field of PROVINCIAL_STUDY_FIELDS) {
      expect((ws as unknown as Record<string, unknown>)[field]).toBeUndefined();
    }
    const allTags = [
      ...ws.repository.documents.flatMap((d) => d.tags),
      ...ws.evidenceStore.atoms.flatMap((a) => a.tags),
    ];
    for (const tag of PROVINCIAL_TAGS) {
      expect(allTags).not.toContain(tag);
    }
    // Toda evidencia es municipal de Atarfe (origen IBSE).
    expect(ws.evidenceStore.atoms.every((a) => a.municipalityId === "atarfe")).toBe(true);
    expect([...new Set(ws.evidenceStore.atoms.map((a) => a.provenance.origin))]).toEqual(["ibse"]);
  });

  it("10. no hay átomos huérfanos y todos los documentId referenciados existen", () => {
    const ws = parseWorkspaceJSON(EXPORT_RAW)!;
    const docIds = new Set(ws.repository.documents.map((d) => d.id));
    const orphans = ws.evidenceStore.atoms.filter(
      (a) => a.provenance.documentId !== undefined && !docIds.has(a.provenance.documentId)
    );
    expect(orphans).toHaveLength(0);
    // Cada átomo IBSE está enlazado a un documento existente.
    expect(ws.evidenceStore.atoms.every((a) => a.provenance.documentId !== undefined)).toBe(true);
  });

  it("11. la carga funciona bajo el BASE_URL de GitHub Pages /COMPAS_NG/", async () => {
    expect(hasMunicipalitySeed("atarfe")).toBe(true);
    expect(municipalitySeedUrl(MUNICIPALITY_SEEDS["atarfe"], "/COMPAS_NG/")).toBe(
      "/COMPAS_NG/seeds/compas-ng-workspace-atarfe.json"
    );
    let requested = "";
    const ws = await loadMunicipalitySeed("atarfe", {
      baseUrl: "/COMPAS_NG/",
      fetchImpl: okFetch(SEED_RAW, (u) => {
        requested = u;
      }),
    });
    expect(requested).toBe("/COMPAS_NG/seeds/compas-ng-workspace-atarfe.json");
    expect(ws?.municipality.identity.id).toBe("atarfe");
    expect(ws?.evidenceStore.atoms).toHaveLength(6);
  });

  it("12. el builder real, serializado por la capa de persistencia, reproduce el export byte a byte", async () => {
    // No basta validar el JSON estático: se ejecuta buildAtarfeWorkspace, se
    // serializa con el servicio real (saveWorkspaceToLocalStorage) y se aplica el
    // mismo escape ASCII del generador. El resultado debe ser el export vigente.
    const { workspace } = await buildAtarfeWorkspace();
    expect(saveWorkspaceToLocalStorage(workspace)).toBe(true);
    const raw = store.get(buildWorkspaceStorageKey("atarfe"))!;
    const rebuilt = toAsciiSafeJson(raw);

    // Export canónico == seed público == resultado reconstruido (byte a byte).
    expect(rebuilt).toBe(EXPORT_RAW);
    expect(rebuilt).toBe(SEED_RAW);
    expect(Buffer.from(rebuilt, "utf8").equals(readFileSync(EXPORT_PATH))).toBe(true);
    expect(Buffer.from(rebuilt, "utf8").equals(readFileSync(SEED_PATH))).toBe(true);
  });

  it("13. las dos fuentes de entrada coinciden con el SHA-256 documentado", () => {
    const sha = (p: string) => createHash("sha256").update(readFileSync(p)).digest("hex");
    expect(sha(HEALTH_REPORT_DOCX_PATH)).toBe(ATARFE_INPUT_SHA256.healthReportDocx);
    expect(sha(IBSE_CSV_PATH)).toBe(ATARFE_INPUT_SHA256.ibseCsv);
  });

  it("14. la construcción es determinista (mismos bytes, IDs estables y sello temporal fijo)", async () => {
    const a = await buildAtarfeWorkspace();
    const b = await buildAtarfeWorkspace();

    // Dos construcciones sin cambiar las fuentes → serialización idéntica.
    expect(saveWorkspaceToLocalStorage(a.workspace)).toBe(true);
    const rawA = store.get(buildWorkspaceStorageKey("atarfe"))!;
    store.clear();
    expect(saveWorkspaceToLocalStorage(b.workspace)).toBe(true);
    const rawB = store.get(buildWorkspaceStorageKey("atarfe"))!;
    expect(toAsciiSafeJson(rawA)).toBe(toAsciiSafeJson(rawB));

    // Identificadores estables (no crypto.randomUUID).
    const ws = a.workspace;
    expect(ws.healthReport!.id).toBe(HEALTH_REPORT_ID);
    expect(ws.healthReport!.linkedDocumentId).toBe(HEALTH_REPORT_DOCUMENT_ID);
    expect(ws.ibseStudy!.id).toBe(IBSE_STUDY_ID);

    // Todo timestamp del expediente == CANONICAL_TIMESTAMP (no new Date()).
    const stamps = [
      ws.createdAt,
      ws.updatedAt,
      ws.municipality.metadata.createdAt,
      ws.municipality.metadata.updatedAt,
      ws.repository.createdAt,
      ws.repository.updatedAt,
      ws.evidenceStore.createdAt,
      ws.evidenceStore.updatedAt,
      ws.healthReport!.createdAt,
      ws.healthReport!.updatedAt,
      ws.ibseStudy!.createdAt,
      ws.ibseStudy!.updatedAt,
      ...ws.repository.documents.flatMap((d) => [d.createdAt, d.updatedAt]),
      ...ws.evidenceStore.atoms.flatMap((x) => [
        x.createdAt,
        x.updatedAt,
        x.provenance.extractedAt,
      ]),
    ];
    expect([...new Set(stamps)]).toEqual([CANONICAL_TIMESTAMP]);
  });

  it("15. el IBSE de Atarfe es muestra MIXTA, no escolar (estudio, cada átomo y documento)", async () => {
    const { workspace } = await buildAtarfeWorkspace();
    const study = workspace.ibseStudy!;

    // Discriminador de muestra explícito: mixta, sin desglose por estrato.
    expect(study.sampleScope).toBe("mixed");
    expect(study.strataCounts).toBeUndefined();

    // Las cautelas de muestra mixta y de "muestra participante" viajan con el estudio…
    expect(study.methodologicalCautions).toContain(IBSE_MIXED_SAMPLE_SENTENCE);
    expect(study.methodologicalCautions).toContain(IBSE_PARTICIPANT_SAMPLE_CAUTION);
    // …y con CADA átomo IBSE (methodology.limitations).
    expect(
      workspace.evidenceStore.atoms.every(
        (a) =>
          a.methodology.limitations.includes(IBSE_MIXED_SAMPLE_SENTENCE) &&
          a.methodology.limitations.includes(IBSE_PARTICIPANT_SAMPLE_CAUTION)
      )
    ).toBe(true);

    // Ningún átomo dice "Media municipal:"; los cuantitativos dicen "muestra participante".
    expect(workspace.evidenceStore.atoms.some((a) => /Media municipal:/.test(a.content))).toBe(false);
    expect(
      workspace.evidenceStore.atoms.filter((a) => a.content.includes(IBSE_PARTICIPANT_MEAN_LABEL))
    ).toHaveLength(5);

    // El documento IBSE ya NO se titula "escolar"; declara muestra mixta.
    const ibseDoc = workspace.repository.documents.find((d) => d.id === "doc-ibse-atarfe")!;
    expect(ibseDoc.title).toContain("muestra mixta");
    expect(/escolar/i.test(ibseDoc.title)).toBe(false);
    expect(/escolar/i.test(ibseDoc.source.system ?? "")).toBe(false);
  });

  it("16. el Informe de Salud conserva su autoría (dos firmantes con rol y organización)", async () => {
    const { workspace } = await buildAtarfeWorkspace();
    const authors = workspace.healthReport!.authors;
    expect(authors).toHaveLength(2);
    expect(authors.map((a) => a.name)).toEqual([
      "Carlos del Moral Campaña",
      "María José Molina Rueda",
    ]);
    for (const a of authors) {
      expect(a.role && a.role.length).toBeGreaterThan(0);
      expect(a.organisation && a.organisation.length).toBeGreaterThan(0);
    }
    expect(authors.map((a) => a.signatureOrder).sort()).toEqual([1, 2]);
  });

  it("17. regresión del Perfil: IBSE satisface el +1 (N+1) y no dispara G-LHC-8", async () => {
    const { workspace } = await buildAtarfeWorkspace();
    const runtime = createMunicipalityRuntime({ workspace });

    // El IBSE municipal es el único estudio complementario (+1).
    expect(runtime.psl.complementaryStudyCount).toBe(1);
    expect(runtime.psl.ibsePresent).toBe(true);

    // Con el +1 presente, la regla N+1 NO bloquea la compilación.
    const violations = validateCompilationPreconditions(runtime.psl);
    expect(violations.some((v) => v.gate === "G-LHC-8")).toBe(false);

    // Control (falsabilidad): sin el estudio IBSE desaparece el +1 y G-LHC-8 aparece.
    // El bloqueo depende de la PRESENCIA del +1, no del recuento de átomos.
    const sinIbse = { ...workspace, ibseStudy: undefined };
    const rtSinIbse = createMunicipalityRuntime({ workspace: sinIbse });
    expect(rtSinIbse.psl.complementaryStudyCount).toBe(0);
    const violationsSinIbse = validateCompilationPreconditions(rtSinIbse.psl);
    expect(violationsSinIbse.some((v) => v.gate === "G-LHC-8")).toBe(true);
  });

  it("18. normalización legacy: sampleScope ausente → 'unknown'; strataCounts corrupto → descartado", () => {
    // Partimos del export real (mixed, sin strataCounts) y fabricamos variantes legacy.
    const base = JSON.parse(EXPORT_RAW) as Record<string, unknown>;

    // (a) Sin sampleScope → se carga como "unknown".
    const legacy = JSON.parse(EXPORT_RAW) as { ibseStudy: Record<string, unknown> };
    delete legacy.ibseStudy.sampleScope;
    const wsLegacy = parseWorkspaceJSON(JSON.stringify(legacy))!;
    expect(wsLegacy.ibseStudy!.sampleScope).toBe("unknown");

    // (a bis) sampleScope inválido persistido (p. ej. "school") → normalizado a "unknown".
    const invalidScope = JSON.parse(EXPORT_RAW) as { ibseStudy: Record<string, unknown> };
    invalidScope.ibseStudy.sampleScope = "school";
    const wsInvalid = parseWorkspaceJSON(JSON.stringify(invalidScope))!;
    expect(wsInvalid.ibseStudy!.sampleScope).toBe("unknown");

    // (b) strataCounts corrupto (nValid > n) → se descarta al cargar.
    const corrupt = JSON.parse(EXPORT_RAW) as { ibseStudy: Record<string, unknown> };
    corrupt.ibseStudy.strataCounts = { under16: { n: 10, nValid: 99 } };
    const wsCorrupt = parseWorkspaceJSON(JSON.stringify(corrupt))!;
    expect(wsCorrupt.ibseStudy!.strataCounts).toBeUndefined();

    // (c) strataCounts estructuralmente sano → se conserva al cargar.
    const sane = JSON.parse(EXPORT_RAW) as { ibseStudy: Record<string, unknown> };
    sane.ibseStudy.strataCounts = {
      under16: { n: 520, nValid: 470 },
      plus16: { n: 389, nValid: 341 },
    };
    const wsSane = parseWorkspaceJSON(JSON.stringify(sane))!;
    expect(wsSane.ibseStudy!.strataCounts).toEqual({
      under16: { n: 520, nValid: 470 },
      plus16: { n: 389, nValid: 341 },
    });

    // El export real de Atarfe no trae strataCounts (muestra mixta sin desglose).
    expect((base.ibseStudy as Record<string, unknown>).strataCounts).toBeUndefined();
  });
});
