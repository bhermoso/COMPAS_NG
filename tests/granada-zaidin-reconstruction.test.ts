/**
 * tests/granada-zaidin-reconstruction.test.ts
 *
 * Verificación del expediente demo reconstruible de Granada-Zaidín
 * (scripts/demo/buildGranadaZaidinWorkspace.ts, ejecutable con
 * `npm run rebuild:zaidin`).
 *
 * NOTA SOBRE LOS NÚMEROS DE REFERENCIA:
 * El expediente perdido declaraba 56 activos Localiza Salud (92 evidencias
 * totales). Esos 56 procedían de un copia-pega directo de la web de Localiza
 * Salud que NO quedó preservado. La única fuente preservada y auditada
 * (MapaDeActivo_PLS_Zaidin.csv → GRANADA-ZAIDIN-ACTIVOS-LOCALIZA-AUDIT.md §8)
 * produce 15 activos normalizados sin datos personales. Estos tests fijan los
 * números REALES y reproducibles: 36 evidencias de estudios (emergentes de los
 * 13 fixtures, coincide con el objetivo) + 15 activos = 51 totales.
 * Si el equipo reincorpora los 56 activos desde la web, el cargador
 * localiza-salud los admite y estos números deberán revisarse deliberadamente.
 */

import { describe, it, expect, beforeAll } from "vitest";
import {
  buildGranadaZaidinWorkspace,
  LOCALIZA_ASSET_COUNT,
  PROXY_CAUTION,
  type GranadaZaidinBuildResult,
} from "../scripts/demo/buildGranadaZaidinWorkspace";
import { isEmptyWorkspaceForPersistenceGuard } from "../src/application/workspace";
import {
  saveWorkspaceToLocalStorage,
  loadWorkspaceFromLocalStorage,
} from "../src/infrastructure/persistence/local-storage";
import { createMunicipalityRuntime } from "../src/application/runtime";
import type { MunicipalityWorkspace } from "../src/domain/workspace";

// Simulación de localStorage para la ida y vuelta de persistencia.
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

const STUDY_KEYS = [
  "ibseStudy",
  "dukeStudy",
  "predimedStudy",
  "sf12Study",
  "suenoStudy",
  "cageStudy",
  "auditcStudy",
  "ipaqStudy",
  "ghq12Study",
  "phq9Study",
  "psqiStudy",
  "fagerstromStudy",
  "sbqStudy",
] as const;

const EXPECTED_STUDY_ATOMS = 36;
const EXPECTED_TOTAL_ATOMS = EXPECTED_STUDY_ATOMS + LOCALIZA_ASSET_COUNT; // 51

let result: GranadaZaidinBuildResult;
let ws: MunicipalityWorkspace;

beforeAll(async () => {
  result = await buildGranadaZaidinWorkspace();
  ws = result.workspace;
}, 180000);

describe("Granada-Zaidín reconstruido — identidad territorial", () => {
  it("es un distrito de Granada, sin código INE propio", () => {
    expect(ws.municipality.identity.id).toBe("granada-zaidin");
    expect(ws.municipality.identity.name).toBe("Granada-Zaidín");
    expect(ws.municipality.identity.province).toBe("Granada");
    expect(ws.municipality.identity.territorialType).toBe("distrito");
    expect(ws.municipality.identity.ineCode).toBeUndefined();
  });
});

describe("Granada-Zaidín reconstruido — Informe de Salud (D-HR-01)", () => {
  it("el Informe de Salud está presente y preservado como fuente primaria", () => {
    expect(ws.healthReport).toBeDefined();
    expect(ws.healthReport!.body.originalText.length).toBeGreaterThan(1000);
    const hrDoc = ws.repository.documents.find((d) => d.kind === "health-report");
    expect(hrDoc).toBeDefined();
    expect(hrDoc!.canGenerateEvidence).toBe(false);
    expect(hrDoc!.tags).toContain("primary-source");
  });

  it("el Informe de Salud NO genera EvidenceAtoms", () => {
    expect(result.counts.healthReportAtoms).toBe(0);
    expect(
      ws.evidenceStore.atoms.some((a) => a.provenance.origin === "health-report")
    ).toBe(false);
  });
});

describe("Granada-Zaidín reconstruido — 13 estudios complementarios", () => {
  it("los 13 estudios están definidos en el workspace", () => {
    for (const key of STUDY_KEYS) {
      expect(ws[key], key).toBeDefined();
    }
  });

  it(`los estudios producen exactamente ${EXPECTED_STUDY_ATOMS} evidencias`, () => {
    expect(result.counts.studyAtoms).toBe(EXPECTED_STUDY_ATOMS);
  });

  it("cada estudio lleva la cautela metodológica de proxy provincial/externo", () => {
    for (const key of STUDY_KEYS) {
      const study = ws[key] as { methodologicalCautions: string[] };
      expect(study.methodologicalCautions, key).toContain(PROXY_CAUTION);
    }
  });
});

describe("Granada-Zaidín reconstruido — activos Localiza Salud", () => {
  it(`incorpora ${LOCALIZA_ASSET_COUNT} activos auditados (fuente preservada; los 56 originales no lo están)`, () => {
    const localiza = ws.evidenceStore.atoms.filter(
      (a) => a.provenance.origin === "localiza-salud"
    );
    expect(localiza.length).toBe(LOCALIZA_ASSET_COUNT);
    // Títulos reales de activo, no genéricos, y sin datos personales
    for (const atom of localiza) {
      expect(atom.kind).toBe("asset");
      expect(atom.title).not.toMatch(/^Activo detectado \d+$/);
      expect(atom.content).not.toMatch(/@|\d{9}/); // sin emails ni teléfonos
    }
  });

  it("la cautela territorial inframunicipal se propaga al Perfil generado", () => {
    const runtime = createMunicipalityRuntime({ workspace: ws });
    expect(runtime.psl.cierreInterpretativo.content).toContain("inframunicipal");
  });
});

describe("Granada-Zaidín reconstruido — totales y persistencia", () => {
  it(`el expediente contiene ${EXPECTED_TOTAL_ATOMS} evidencias derivadas totales`, () => {
    expect(result.counts.totalAtoms).toBe(EXPECTED_TOTAL_ATOMS);
  });

  it("los Informes Vigía quedan registrados como referencia territorial sin atomizar", () => {
    const vigia = ws.repository.documents.filter(
      (d) => d.kind === "territorial-documentation"
    );
    expect(vigia.length).toBe(2);
    for (const doc of vigia) {
      expect(doc.canGenerateEvidence).toBe(false);
    }
    expect(
      ws.evidenceStore.atoms.some(
        (a) => a.provenance.origin === "territorial-documentation"
      )
    ).toBe(false);
  });

  it("el guard de persistencia lo reconoce como no vacío", () => {
    expect(isEmptyWorkspaceForPersistenceGuard(ws)).toBe(false);
  });

  it("guardar y cargar con los servicios reales preserva el expediente íntegro", () => {
    store.clear();
    expect(saveWorkspaceToLocalStorage(ws)).toBe(true);
    const loaded = loadWorkspaceFromLocalStorage("granada-zaidin");
    expect(loaded).not.toBeNull();
    expect(loaded!.municipality.identity.territorialType).toBe("distrito");
    expect(loaded!.healthReport).toBeDefined();
    for (const key of STUDY_KEYS) {
      expect(loaded![key], key).toBeDefined();
    }
    expect(loaded!.evidenceStore.atoms.length).toBe(EXPECTED_TOTAL_ATOMS);
    expect(
      loaded!.evidenceStore.atoms.filter(
        (a) => a.provenance.origin === "localiza-salud"
      ).length
    ).toBe(LOCALIZA_ASSET_COUNT);
    expect(loaded!.repository.documents.length).toBe(result.counts.documents);
  });
});

// ── Codificación de los artefactos exportados (incidente mojibake 2026-07-07) ──
// Los ficheros de municipalities/granada-zaidin/exports/ deben ser 100 % ASCII
// (acentos como escapes JSON) para sobrevivir a cualquier canal de copia
// (cmd CP850, PowerShell 5.1 CP1252), y su contenido parseado debe conservar
// las tildes correctas.

import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const exportsDir = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../municipalities/granada-zaidin/exports"
);

describe("Granada-Zaidín — codificación de los artefactos exportados", () => {
  const jsonPath = resolve(exportsDir, "compas-ng-workspace-granada-zaidin.json");
  const consolePath = resolve(exportsDir, "restore-granada-zaidin.console.js");

  it("el JSON exportado es 100 % ASCII (inmune a CP850/CP1252)", () => {
    const raw = readFileSync(jsonPath, "utf8");
    const nonAscii = raw.match(/[^\x20-\x7E\r\n\t]/g) ?? [];
    expect(nonAscii, `caracteres no ASCII: ${nonAscii.slice(0, 5).join(" ")}`).toHaveLength(0);
  });

  it("el fragmento de consola es 100 % ASCII", () => {
    const raw = readFileSync(consolePath, "utf8");
    const nonAscii = raw.match(/[^\x20-\x7E\r\n\t]/g) ?? [];
    expect(nonAscii).toHaveLength(0);
  });

  it("el contenido parseado conserva los acentos correctos, sin mojibake", () => {
    const raw = readFileSync(jsonPath, "utf8");
    const parsed = JSON.stringify(JSON.parse(raw));
    for (const literal of [
      "Granada-Zaidín",
      "Andalucía",
      "COMPÁS",
      "reconstrucción",
      "ámbito",
      "—",
    ]) {
      expect(parsed, `debe contener «${literal}»`).toContain(literal);
    }
    for (const mojibake of ["├¡", "Ã­", "ÔÇö"]) {
      expect(parsed, `no debe contener «${mojibake}»`).not.toContain(mojibake);
    }
  });
});

// ── Marcos estratégicos y normativos (EPVSA, ESCA, Plan de Mayores) ──────────

import {
  STRATEGIC_FRAMEWORK_KEYS,
  strategicFrameworkDocumentId,
  buildStrategicFrameworkSpecs,
  upsertStrategicFrameworkDocuments,
} from "../scripts/demo/buildGranadaZaidinWorkspace";

describe("Granada-Zaidín reconstruido — marcos estratégicos y normativos", () => {
  it("contiene exactamente tres documentos strategic-framework, con las claves esperadas", () => {
    const marcos = ws.repository.documents.filter((d) => d.kind === "strategic-framework");
    expect(marcos.length).toBe(3);
    for (const key of STRATEGIC_FRAMEWORK_KEYS) {
      const withKey = marcos.filter((d) => d.tags.includes(`framework:${key}`));
      expect(withKey.length, key).toBe(1);
      expect(withKey[0].id).toBe(strategicFrameworkDocumentId("granada-zaidin", key));
      expect(withKey[0].canGenerateEvidence).toBe(false);
    }
  });

  it("no hay duplicados por municipalityId + kind + frameworkKey", () => {
    const marcos = ws.repository.documents.filter((d) => d.kind === "strategic-framework");
    const keys = marcos.map((d) => d.id);
    expect(new Set(keys).size).toBe(keys.length);
    const titles = marcos.map((d) => d.title);
    expect(titles.join(" ")).toContain("EPVSA");
    expect(titles.join(" ")).toContain("ESCA");
    expect(titles.join(" ")).toContain("Personas Mayores en Andalucía 2020-2023");
  });

  it("aplicar la carga dos veces no duplica ningún marco (idempotencia)", () => {
    const specs = buildStrategicFrameworkSpecs(process.cwd());
    const once = upsertStrategicFrameworkDocuments(ws.repository, "granada-zaidin", specs);
    const twice = upsertStrategicFrameworkDocuments(once, "granada-zaidin", specs);
    const count = (r: typeof ws.repository) =>
      r.documents.filter((d) => d.kind === "strategic-framework").length;
    expect(count(once)).toBe(3);
    expect(count(twice)).toBe(3);
    expect(twice.documents.length).toBe(once.documents.length);
  });

  it("un duplicado previo del mismo marco se normaliza a una sola entrada", () => {
    const specs = buildStrategicFrameworkSpecs(process.cwd());
    // Simula el duplicado observado en la UI: dos cargas manuales del Plan de Mayores
    let repo = ws.repository;
    repo = {
      ...repo,
      documents: [
        ...repo.documents,
        {
          ...repo.documents.find((d) => d.tags.includes("framework:plan-mayores-andalucia-2020-2023"))!,
          id: "uuid-duplicado-manual",
          tags: ["strategic-framework", "framework:plan-mayores-andalucia-2020-2023"],
        },
      ],
    };
    const normalized = upsertStrategicFrameworkDocuments(repo, "granada-zaidin", specs);
    const planDocs = normalized.documents.filter((d) =>
      d.tags.includes("framework:plan-mayores-andalucia-2020-2023")
    );
    expect(planDocs.length).toBe(1);
    expect(planDocs[0].id).toBe(
      strategicFrameworkDocumentId("granada-zaidin", "plan-mayores-andalucia-2020-2023")
    );
  });

  it("si falta una fuente obligatoria, la carga falla explícitamente", () => {
    expect(() => buildStrategicFrameworkSpecs("C:/ruta/inexistente")).toThrow(
      /Fuente obligatoria ausente/
    );
  });

  it("los marcos no generan evidencias: los totales auditados no cambian", () => {
    expect(result.counts.studyAtoms).toBe(36);
    expect(result.counts.localizaAtoms).toBe(15);
    expect(result.counts.totalAtoms).toBe(51);
    expect(
      ws.evidenceStore.atoms.some((a) => a.provenance.origin === "strategic-framework")
    ).toBe(false);
  });
});

// ── Separación producto: marcos estratégicos ≠ evidencia diagnóstica ─────────
// Los marcos (EPVSA, ESCA, Plan de Mayores) están cargados y trazados como
// strategic-framework, pero son insumo del Plan de Acción: no computan como
// fuente diagnóstica del Perfil, no generan átomos y no alimentan conclusiones.

import { getCategory } from "../src/ui/components/DocumentRepositoryPanel";
import { generateLT1 } from "../src/application/lt1";
import { createEvidenceStore, createEvidenceAtom } from "../src/domain/evidence";

describe("Granada-Zaidín — los marcos estratégicos no son evidencia diagnóstica", () => {
  it("los tres marcos clasifican como insumo estratégico, no como fuente diagnóstica", () => {
    const marcos = ws.repository.documents.filter((d) => d.kind === "strategic-framework");
    expect(marcos.length).toBe(3);
    for (const doc of marcos) {
      expect(getCategory(doc), doc.title).toBe("strategic-input");
    }
  });

  it("el listado diagnóstico (other-source) contiene solo los dos Vigía", () => {
    const diagnosticos = ws.repository.documents.filter(
      (d) => getCategory(d) === "other-source"
    );
    expect(diagnosticos.length).toBe(2);
    const titles = diagnosticos.map((d) => d.title).join(" ");
    expect(titles).toContain("Informe Zaidin Centro Este");
    expect(titles).toContain("Informe Zaidin Sur");
    expect(titles).not.toContain("EPVSA");
    expect(titles).not.toContain("ESCA");
    expect(titles).not.toContain("Mayores");
  });

  it("el motor LT1 no clasifica átomos strategic-priority en ningún grupo diagnóstico", () => {
    // Garantía de motor: aunque un marco llegara a atomizarse (vía texto pegado),
    // sus átomos strategic-priority no alimentan determinantes, activos,
    // indicadores, hallazgos ni cautelas — no pueden formular conclusiones.
    let store = createEvidenceStore({ municipalityId: "granada-zaidin" });
    store = {
      ...store,
      atoms: [
        createEvidenceAtom({
          id: "sp-1",
          municipalityId: "granada-zaidin",
          kind: "strategic-priority",
          title: "Línea EPVSA de prueba",
          content: "LE1 — Alimentación saludable y vida activa.",
          provenance: { origin: "strategic-framework", extractedAt: "2026-07-07T00:00:00.000Z" },
          tags: ["strategic-framework"],
        }),
      ],
    };
    const lt1 = generateLT1(store);
    expect(lt1.determinants).toHaveLength(0);
    expect(lt1.assets).toHaveLength(0);
    expect(lt1.indicators).toHaveLength(0);
    expect(lt1.qualitativeFindings).toHaveLength(0);
    expect(lt1.methodologicalCautions).toHaveLength(0);
  });

  it("las conclusiones y el cierre del Perfil no citan EPVSA, ESCA ni el Plan de Mayores", () => {
    const runtime = createMunicipalityRuntime({ workspace: ws });
    const texto =
      runtime.psl.conclusiones.content + "\n" + runtime.psl.cierreInterpretativo.content;
    expect(texto).not.toContain("EPVSA");
    expect(texto).not.toContain("ESCA");
    expect(texto).not.toContain("Personas Mayores");
    // El Perfil no tiene capítulo de recomendaciones: el cierre lo declara.
    expect(runtime.psl.cierreInterpretativo.content).toContain(
      "No formula actuaciones ni recomendaciones"
    );
  });
});

// ── Marcos estratégicos desde PDF reales (corrección 2026-07-07 noche) ───────

import { existsSync } from "node:fs";
import { resolve as resolvePath } from "node:path";

describe("Granada-Zaidín — marcos estratégicos cargados desde PDF reales", () => {
  it("los tres PDF fuente existen en el repositorio activo", () => {
    const specs = buildStrategicFrameworkSpecs(process.cwd());
    expect(specs.length).toBe(3);
    for (const spec of specs) {
      expect(
        existsSync(resolvePath(process.cwd(), spec.pdfRepoPath)),
        spec.pdfRepoPath
      ).toBe(true);
      expect(spec.pdfFileName.toLowerCase().endsWith(".pdf")).toBe(true);
    }
  });

  it("los tres marcos del workspace referencian su PDF real y no generan evidencias", () => {
    const marcos = ws.repository.documents.filter((d) => d.kind === "strategic-framework");
    expect(marcos.length).toBe(3);
    for (const doc of marcos) {
      expect(doc.sourceFileName, doc.title).toMatch(/\.pdf$/i);
      expect(doc.source.url, doc.title).toBeDefined();
      expect(
        existsSync(resolvePath(process.cwd(), doc.source.url!)),
        `${doc.title} → ${doc.source.url}`
      ).toBe(true);
      expect(doc.canGenerateEvidence).toBe(false);
    }
  });

  it("dedup por título/fichero: un duplicado manual heredado del Plan de Mayores se normaliza", () => {
    const specs = buildStrategicFrameworkSpecs(process.cwd());
    // Duplicado tal como lo creaba la UI: UUID propio, sin clave de marco,
    // título derivado del nombre del fichero y sourceFileName del PDF.
    const conBasura = {
      ...ws.repository,
      documents: [
        ...ws.repository.documents,
        {
          id: "uuid-manual-1",
          municipalityId: "granada-zaidin",
          kind: "strategic-framework" as const,
          title: "Plan de mayores 2020 23",
          status: "uploaded" as const,
          source: { system: "Archivo PDF — referencia documental" },
          sourceFileName: "Plan de mayores 2020-23.pdf",
          canGenerateEvidence: false,
          tags: ["strategic-framework"],
          createdAt: "2026-07-07T19:00:00.000Z",
          updatedAt: "2026-07-07T19:00:00.000Z",
        },
      ],
    };
    const normalizado = upsertStrategicFrameworkDocuments(conBasura, "granada-zaidin", specs);
    const planes = normalizado.documents.filter(
      (d) =>
        d.kind === "strategic-framework" &&
        (d.sourceFileName ?? "").toLowerCase().includes("mayores")
    );
    expect(planes.length).toBe(1);
    expect(planes[0].id).toBe(
      strategicFrameworkDocumentId("granada-zaidin", "plan-mayores-andalucia-2020-2023")
    );
    // Y el conjunto sigue siendo exactamente de tres marcos
    expect(
      normalizado.documents.filter((d) => d.kind === "strategic-framework").length
    ).toBe(3);
  });
});
