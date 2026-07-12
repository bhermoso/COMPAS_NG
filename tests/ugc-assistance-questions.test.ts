/**
 * tests/ugc-assistance-questions.test.ts
 *
 * Incremento 5C — N1b entra en N3 SOLO como preguntas de contraste.
 *
 * Verifica que N3 consume N1b a través de una capa intermedia pura
 * (`buildUGCAssistanceQuestions`), que solo produce preguntas abiertas trazadas
 * (nunca hechos, magnitudes, determinantes ni señales N2), que respeta la
 * densidad (≤1 pregunta y ≤3 señales por unidad, ≤8 en total), que conserva la
 * trazabilidad y la validación humana, que 'A mejorar' sigue siendo autoría
 * documental, que no se afirman diferencias internas entre UGC, y que N1a, N2,
 * la primacía local, la cobertura parcial y 56/92 permanecen intactos.
 */

import { describe, it, expect, beforeAll } from "vitest";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { loadWorkspaceFromLocalStorage } from "../src/infrastructure/persistence/local-storage";
import {
  buildDiagnosticAnswers,
  buildIntegratedInterpretation,
  buildProfileIntegratedEditorialView,
} from "../src/application/health-profile";
import type {
  DiagnosticAnswers,
  IntegratedInterpretation,
} from "../src/application/health-profile";
import {
  buildUGCClinicalAssistanceReading,
  buildUGCAssistanceQuestions,
  MAX_QUESTIONS_TOTAL,
  MAX_SIGNALS_PER_UNIT,
} from "../src/application/ugc-clinical-assistance";
import type { MunicipalityWorkspace } from "../src/domain/workspace";

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

const ROOT = dirname(fileURLToPath(import.meta.url));
const EXPORT_PATH = resolve(
  ROOT,
  "../municipalities/granada-zaidin/exports/compas-ng-workspace-granada-zaidin.json"
);
const N3_SOURCE = readFileSync(
  resolve(ROOT, "../src/application/health-profile/integratedInterpretation.ts"),
  "utf8"
);

let ws: MunicipalityWorkspace;
let answers: DiagnosticAnswers;
let interp: IntegratedInterpretation;

beforeAll(() => {
  store.set("compas-ng:workspace:granada-zaidin", readFileSync(EXPORT_PATH, "utf8"));
  const loaded = loadWorkspaceFromLocalStorage("granada-zaidin");
  if (loaded === null) throw new Error("El export vigente no rehidrata");
  ws = loaded;
  answers = buildDiagnosticAnswers({
    workspace: ws,
    determinantTitles: [],
    assets: ws.evidenceStore.atoms
      .filter((a) => a.kind === "asset")
      .map((a) => ({ title: a.title, content: a.content })),
  });
  interp = buildIntegratedInterpretation(answers);
}, 60000);

describe("5C — N3 consume N1b vía capa intermedia (estructural)", () => {
  it("1-2. N3 no recorre las 384 señales: no construye ni itera N1b", () => {
    // Solo importa el TIPO de pregunta; no el builder de la lectura ni las señales.
    expect(N3_SOURCE).not.toContain("buildUGCClinicalAssistanceReading");
    expect(N3_SOURCE).not.toContain("buildUGCAssistanceQuestions");
    expect(N3_SOURCE).not.toMatch(/\.signals\b/);
    // Consume las preguntas pre-construidas.
    expect(N3_SOURCE).toContain("answers.ugcAssistanceQuestions");
    expect(answers.ugcAssistanceQuestions.length).toBeGreaterThan(0);
  });

  it("3. la capa intermedia solo produce preguntas abiertas", () => {
    const qs = buildUGCAssistanceQuestions(buildUGCClinicalAssistanceReading(ws));
    expect(qs.length).toBeGreaterThan(0);
    for (const q of qs) {
      expect(q.epistemicStatus).toBe("open-question");
      expect(q.question.trim().endsWith("?")).toBe(true);
      const raw = q as unknown as Record<string, unknown>;
      for (const forbidden of ["value", "magnitude", "prevalence", "rate", "direction", "ranking"]) {
        expect(forbidden in raw).toBe(false);
      }
    }
  });
});

describe("5C — las señales UGC no entran como epidemiología", () => {
  it("4-7. no entran como hecho / magnitud / determinante / señal N2", () => {
    for (const unit of interp.units) {
      const names = unit.clinicalAssistanceQuestions.flatMap((q) => q.indicatorNames);
      if (names.length === 0) continue;
      const agenda = JSON.stringify(unit.sanitaryAgenda);
      const determinants = JSON.stringify(unit.plausibleDeterminants);
      const localIds = unit.localSignals.map((s) => s.id).join(" ");
      const corrIds = unit.corroboratingSignals.map((s) => s.id).join(" ");
      const ctxIds = unit.contextualSignals.map((s) => s.id).join(" ");
      const ugcIds = unit.clinicalAssistanceQuestions.flatMap((q) => q.sourceSignalIds);
      for (const name of names) {
        expect(agenda.includes(name), `agenda: ${name}`).toBe(false);
        expect(determinants.includes(name), `determinante: ${name}`).toBe(false);
      }
      for (const id of ugcIds) {
        expect(localIds.includes(id)).toBe(false);
        expect(corrIds.includes(id)).toBe(false);
        expect(ctxIds.includes(id)).toBe(false);
      }
      // magnitudeNote nunca contiene una señal UGC.
      const note = unit.sanitaryAgenda.magnitudeNote ?? "";
      for (const name of names) expect(note.includes(name)).toBe(false);
    }
  });

  it("8. 'A mejorar' conserva autoría documental en las limitaciones de la pregunta", () => {
    for (const q of answers.ugcAssistanceQuestions) {
      expect(q.limitations.some((l) => /'A mejorar' es autor[ií]a del documento/i.test(l))).toBe(true);
    }
  });

  it("9-12. no infiere dirección ni peor salud/atención ni diferencia entre UGC", () => {
    const forbidden = [
      "peor salud",
      "peor atención",
      "mejor atención",
      "más enferm",
      "déficit demostrado",
      "incumplimiento",
      "Centro-Este y Sur tienen",
      "una está mejor",
      "una está peor",
      "diferencias entre las ugc",
      "desigualdad interna",
      "problema común",
    ];
    for (const q of answers.ugcAssistanceQuestions) {
      const text = `${q.question} ${q.rationale} ${q.topic}`.toLowerCase();
      for (const f of forbidden) expect(text.includes(f.toLowerCase()), `${q.unitId}: ${f}`).toBe(false);
    }
  });
});

describe("5C — coincidencias nominales y densidad", () => {
  it("13. coincidencias nominales deduplicadas: una pregunta, no dos por UGC", () => {
    for (const q of answers.ugcAssistanceQuestions) {
      // Los nombres no se repiten aunque aparezcan en ambas UGC.
      expect(new Set(q.indicatorNames).size).toBe(q.indicatorNames.length);
      // La pregunta cubre ambas UGC con un único enunciado.
      expect(q.ugcs.sort()).toEqual(["Zaidín Centro-Este", "Zaidín Sur"]);
    }
    // No hay dos preguntas para la misma unidad.
    const unitIds = answers.ugcAssistanceQuestions.map((q) => q.unitId);
    expect(new Set(unitIds).size).toBe(unitIds.length);
  });

  it("14-16. ≤1 pregunta por unidad, ≤3 señales por unidad, ≤8 en total", () => {
    for (const unit of interp.units) {
      expect(unit.clinicalAssistanceQuestions.length).toBeLessThanOrEqual(1);
    }
    for (const q of answers.ugcAssistanceQuestions) {
      expect(q.indicatorNames.length).toBeLessThanOrEqual(MAX_SIGNALS_PER_UNIT);
    }
    expect(answers.ugcAssistanceQuestions.length).toBeLessThanOrEqual(MAX_QUESTIONS_TOTAL);
  });
});

describe("5C — trazabilidad y validación humana", () => {
  it("17-20. conserva ids de señal, documentos, UGC y declara validación", () => {
    const validations = new Set([
      "health-professionals",
      "data-owners",
      "motor-group",
      "mixed",
    ]);
    for (const q of answers.ugcAssistanceQuestions) {
      expect(q.sourceSignalIds.length).toBeGreaterThan(0);
      expect(q.documentIds.length).toBeGreaterThan(0);
      expect(q.ugcs.length).toBeGreaterThan(0);
      expect(validations.has(q.requiredValidation)).toBe(true);
      // Los ids referencian señales N1b reales.
      const reading = buildUGCClinicalAssistanceReading(ws);
      const allIds = new Set(reading.signals.map((s) => s.id));
      for (const id of q.sourceSignalIds) expect(allIds.has(id)).toBe(true);
    }
  });

  it("21. solo entran preguntas con convergencia: unitId es una unidad N3 existente", () => {
    const unitIds = new Set(interp.units.map((u) => u.id));
    for (const q of answers.ugcAssistanceQuestions) {
      expect(unitIds.has(q.unitId), q.unitId).toBe(true);
    }
    // Salud mental no recibe pregunta (no se fuerza sin convergencia UGC).
    const mental = interp.units.find((u) => u.id === "salud-mental-señal-local");
    expect(mental?.clinicalAssistanceQuestions.length ?? 0).toBe(0);
  });

  it("22. las señales no seleccionadas quedan fuera sin perder N1b (siguen 384)", () => {
    const reading = buildUGCClinicalAssistanceReading(ws);
    expect(reading.signals.length).toBe(384);
    const usedIds = new Set(
      answers.ugcAssistanceQuestions.flatMap((q) => q.sourceSignalIds)
    );
    expect(usedIds.size).toBeLessThan(reading.signals.length);
  });
});

describe("5C — N1a/N2/primacía/cobertura/56-92 intactos", () => {
  it("23. N1a: la base epidemiológica no incorpora nombres UGC", () => {
    const baseText = JSON.stringify(answers.sanitaria.baseEpidemiologica ?? {});
    for (const token of [
      "% Usuarios hiperfrecuentadores de Pediatría",
      "Cobertura Enfermería de Familia >74 (UGC)",
    ]) {
      expect(baseText.includes(token)).toBe(false);
    }
  });

  it("24-25. N2 y primacía local intactas: la señal local sigue siendo primaria", () => {
    const conLocal = interp.units.filter((u) => u.localSignals.length > 0);
    expect(conLocal.length).toBeGreaterThan(0);
    for (const u of conLocal) {
      // Las preguntas UGC no desplazan ni contaminan las señales locales.
      const ugcIds = u.clinicalAssistanceQuestions.flatMap((q) => q.sourceSignalIds);
      for (const s of u.localSignals) expect(ugcIds).not.toContain(s.id);
    }
  });

  it("26. la cobertura parcial del Informe sigue visible (partial)", () => {
    expect(interp.coverage.completeness).toBe("partial");
    expect(interp.nonExhaustiveNotice.length).toBeGreaterThan(0);
  });

  it("29-30. no se crean EvidenceAtoms; 20/92/56 intacto", () => {
    expect(ws.repository.documents.length).toBe(20);
    expect(ws.evidenceStore.atoms.length).toBe(92);
    expect(
      ws.evidenceStore.atoms.filter((a) => a.provenance.origin === "localiza-salud").length
    ).toBe(56);
    // Ninguna evidencia procede de los documentos territoriales.
    const tdIds = new Set(
      ws.repository.documents
        .filter((d) => d.kind === "territorial-documentation")
        .map((d) => d.id)
    );
    expect(
      ws.evidenceStore.atoms.filter(
        (a) => a.provenance.documentId !== undefined && tdIds.has(a.provenance.documentId)
      ).length
    ).toBe(0);
  });
});

describe("5C — Perfil visible contenido (N4)", () => {
  it("27-28. el Perfil no muestra los 384 indicadores ni un ranking", () => {
    const view = buildProfileIntegratedEditorialView(answers, {
      territory: ws.municipality.identity.name,
      status: "Documento de trabajo",
      informeTitulo: "Informe de salud de El Zaidín",
    });
    const serialized = JSON.stringify(view);
    // Un indicador NO seleccionado por ninguna pregunta no aparece en la vista.
    for (const notShown of ["Índice de sobre-envejecimiento", "Centros Educativos Primaria", "Nº Alumnos 1º EPO"]) {
      expect(serialized.includes(notShown), notShown).toBe(false);
    }
    const raw = view as unknown as Record<string, unknown>;
    for (const forbidden of ["ranking", "prevalence", "score"]) {
      expect(forbidden in raw).toBe(false);
    }
  });

  it("máximo una pregunta de contraste por hilo, en forma de pregunta", () => {
    const view = buildProfileIntegratedEditorialView(answers, {
      territory: ws.municipality.identity.name,
      status: "Documento de trabajo",
      informeTitulo: "Informe de salud de El Zaidín",
    });
    const conContraste = view.territorialReadings.filter(
      (b) => b.clinicalAssistanceQuestion !== undefined
    );
    expect(conContraste.length).toBeGreaterThan(0);
    for (const b of conContraste) {
      expect(b.clinicalAssistanceQuestion!.length).toBeGreaterThan(0);
      // No despliega listas de indicadores (sin viñetas ni saltos de lista).
      expect(b.clinicalAssistanceQuestion!.includes("Indicador:")).toBe(false);
    }
  });
});
