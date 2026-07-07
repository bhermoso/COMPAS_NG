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
