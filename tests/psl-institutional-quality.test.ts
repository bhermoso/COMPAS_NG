/**
 * tests/psl-institutional-quality.test.ts
 *
 * Verifica que el Perfil Local de Salud no exponga lenguaje interno del pipeline,
 * que el Informe de Salud se presente como fuente íntegra y no como material
 * extraído, y que los huecos analíticos no se presenten como áreas de intervención.
 *
 * Reglas fijadas:
 *  - El Perfil no habla del pipeline, ni de EvidenceAtom, ni de heurísticas internas.
 *  - El Informe de Salud no se describe como "analizado" o "extraído" por el sistema.
 *  - Las carencias de información no son áreas de intervención territorial.
 *  - Las limitaciones diagnósticas no escalan a áreas de intervención (vía ningún camino).
 *  - Si no hay áreas reales, hasTechnicalCandidatures = false y candidaturasTecnicas = [].
 *  - Cap. V y VI no afirman la existencia de áreas preferentes si solo hay gaps.
 *  - Cap. VI no usa "propuestas del sistema".
 *  - isAnalyticalGap = true en OIT gaps; false en áreas reales.
 *  - Las limitaciones metodológicas van a limitacionesDiagnosticas, no a areasDeIntervencion.
 */

import { describe, it, expect } from "vitest";
import { generateOIT } from "../src/application/oit";
import { buildLocalHealthProfile } from "../src/application/health-profile";
import { runEvidenceStoreIntegrityGuard } from "../src/application/evidence";
import { createEstadoTerritorialEvolutivo } from "../src/application/territorial-interpretation";
import { runReconciliacionInterpretativa } from "../src/application/reconciliation";
import { createEvidenceStore, createEvidenceAtom } from "../src/domain/evidence";
import { createCompleteMunicipalityWorkspace } from "../src/application/workspace";
import type { LocalHealthProfile } from "../src/domain/health-profile";

// ── Helpers ───────────────────────────────────────────────────────────────────

const MUN_ID = "test-mun-quality";

function makeAtom(
  kind: "indicator" | "determinant" | "asset" | "qualitative-observation" | "participation" | "methodological-caution",
  index: number
) {
  return createEvidenceAtom({
    id: `atom-quality-${kind}-${index}`,
    municipalityId: MUN_ID,
    kind,
    title: `${kind} ${index}`,
    content: `Contenido de prueba para ${kind} ${index}.`,
    provenance: {
      origin: "territorial-documentation",
      extractedAt: new Date().toISOString(),
    },
  });
}

function buildFullPipeline(atoms: ReturnType<typeof makeAtom>[], historial: Parameters<typeof runReconciliacionInterpretativa>[1] = []) {
  const workspace = createCompleteMunicipalityWorkspace({ id: MUN_ID, name: "Test" });
  const store = { ...createEvidenceStore(MUN_ID), atoms };
  const integrityResult = runEvidenceStoreIntegrityGuard(store);
  const sanitizedStore = integrityResult.sanitizedStore;
  const mit = createEstadoTerritorialEvolutivo({ evidenceStore: sanitizedStore, strategicFrameworks: [] });
  const reconciliacion = runReconciliacionInterpretativa(mit, historial);
  const oitParaDecision =
    reconciliacion.areasIntervencionEscaladas.length > 0
      ? {
          opportunities: reconciliacion.areasIntervencionEscaladas,
          sourceSummary: `${reconciliacion.areasIntervencionEscaladas.length} área(s) escalada(s).`,
          requiresHumanValidation: true as const,
        }
      : mit.areasDeIntervencion;
  const psl = buildLocalHealthProfile({
    sanitizedStore,
    integrityResult,
    mit,
    reconciliacion,
    oitParaDecision,
    workspace,
  });
  return { psl, mit, reconciliacion };
}

function buildPSL(atoms: ReturnType<typeof makeAtom>[]) {
  return buildFullPipeline(atoms).psl;
}

// ── 1. Lenguaje interno prohibido en el PSL ───────────────────────────────────

describe("PSL — ausencia de lenguaje interno del pipeline", () => {
  const FORBIDDEN = [
    "generado automáticamente",
    "Borrador generado",
    "tensión escalada",
    "Filtro de Relevancia",
    "Criterios de Escalado",
    "heurísticamente",
    "0 evidencia(s) relacionada(s)",
    "conflicto ha sido resuelto por el sistema",
    "EvidenceAtom",
    "pipeline",
    "candidaturas técnicas del sistema",
    "propuestas del sistema",
  ];

  function collectPSLText(psl: LocalHealthProfile) {
    return [
      psl.conclusiones.content,
      psl.cierreInterpretativo.content,
      ...psl.areasDeIntervencion.map((a) => `${a.title} ${a.rationale} ${a.cautions.join(" ")}`),
    ].join("\n");
  }

  it("no contiene términos prohibidos con base documental completa", () => {
    const psl = buildPSL([
      makeAtom("determinant", 1),
      makeAtom("asset", 1),
      makeAtom("indicator", 1),
      makeAtom("qualitative-observation", 1),
    ]);
    const violations = FORBIDDEN.filter((t) => collectPSLText(psl).includes(t));
    expect(violations).toHaveLength(0);
  });

  it("no contiene términos prohibidos con solo cautelas metodológicas", () => {
    const psl = buildPSL([makeAtom("methodological-caution", 1)]);
    const violations = FORBIDDEN.filter((t) => collectPSLText(psl).includes(t));
    expect(violations).toHaveLength(0);
  });

  it("no contiene términos prohibidos en caso vacío (sin átomos)", () => {
    const psl = buildPSL([]);
    const violations = FORBIDDEN.filter((t) => collectPSLText(psl).includes(t));
    expect(violations).toHaveLength(0);
  });
});

// ── 2. Las limitaciones metodológicas NO escalan a áreas de intervención ──────

describe("Limitaciones diagnósticas — nunca se convierten en áreas de intervención", () => {
  /**
   * Escenario exacto reportado en el bug:
   * - Solo cautelas metodológicas + activos (sin determinantes).
   * - MIT genera limitaciones ("Base documental con cautelas...", "Activos sin determinantes...").
   * - ReconciliacionEngine NO debe escalar estas limitaciones a áreas.
   * - El PSL NO debe tener áreas de intervención reales.
   * - Cap. V y VI no deben hablar de "áreas preferentes".
   * - Cap. VII: hasTechnicalCandidatures = false, candidaturasTecnicas = [].
   */
  it("cautelas + activos sin determinantes → 0 áreas reales en PSL", () => {
    const atoms = [
      makeAtom("methodological-caution", 1),
      makeAtom("asset", 1),
    ];
    const psl = buildPSL(atoms);
    const realAreas = psl.areasDeIntervencion.filter((a) => !a.isAnalyticalGap);
    expect(realAreas).toHaveLength(0);
  });

  it("cautelas + activos sin determinantes → hasTechnicalCandidatures = false", () => {
    const atoms = [makeAtom("methodological-caution", 1), makeAtom("asset", 1)];
    const psl = buildPSL(atoms);
    expect(psl.priorizacion.hasTechnicalCandidatures).toBe(false);
  });

  it("cautelas + activos sin determinantes → candidaturasTecnicas = []", () => {
    const atoms = [makeAtom("methodological-caution", 1), makeAtom("asset", 1)];
    const psl = buildPSL(atoms);
    expect(psl.priorizacion.candidaturasTecnicas).toHaveLength(0);
  });

  it("cautelas + activos sin determinantes → limitacionesDiagnosticas contiene las observaciones", () => {
    const atoms = [makeAtom("methodological-caution", 1), makeAtom("asset", 1)];
    const psl = buildPSL(atoms);
    const lims = psl.limitacionesDiagnosticas ?? [];
    // Las observaciones metodológicas deben estar aquí, no en areasDeIntervencion
    expect(lims.length).toBeGreaterThan(0);
  });

  it("cautelas + activos sin determinantes → MIT produce tensionesEstructurales vacías", () => {
    const atoms = [makeAtom("methodological-caution", 1), makeAtom("asset", 1)];
    const { mit } = buildFullPipeline(atoms);
    expect(mit.tensionesEstructurales).toHaveLength(0);
  });

  it("cautelas + activos sin determinantes → ReconciliacionEngine NO escala ninguna tensión a área", () => {
    const atoms = [makeAtom("methodological-caution", 1), makeAtom("asset", 1)];
    const { reconciliacion } = buildFullPipeline(atoms);
    expect(reconciliacion.areasIntervencionEscaladas).toHaveLength(0);
  });

  it("Cap. V no dice 'áreas que merecen atención preferente' cuando solo hay gaps", () => {
    const atoms = [makeAtom("methodological-caution", 1), makeAtom("asset", 1)];
    const psl = buildPSL(atoms);
    expect(psl.conclusiones.content).not.toContain("áreas que merecen atención preferente");
    expect(psl.conclusiones.content).not.toContain("apunta a");
  });

  it("Cap. V no dice 'La información disponible apunta a N área(s)' cuando solo hay gaps", () => {
    const atoms = [makeAtom("methodological-caution", 1), makeAtom("asset", 1)];
    const psl = buildPSL(atoms);
    expect(psl.conclusiones.content).not.toMatch(/apunta a \d+ área/);
  });

  it("Cap. VI no dice 'El Perfil deja preparadas N área(s)' cuando solo hay gaps", () => {
    const atoms = [makeAtom("methodological-caution", 1), makeAtom("asset", 1)];
    const psl = buildPSL(atoms);
    expect(psl.cierreInterpretativo.content).not.toMatch(/deja preparadas \d+ área/);
  });

  it("solo cautelas metodológicas (sin activos) → 0 áreas reales", () => {
    const atoms = [makeAtom("methodological-caution", 1)];
    const psl = buildPSL(atoms);
    const realAreas = psl.areasDeIntervencion.filter((a) => !a.isAnalyticalGap);
    expect(realAreas).toHaveLength(0);
    expect(psl.priorizacion.hasTechnicalCandidatures).toBe(false);
    expect(psl.priorizacion.candidaturasTecnicas).toHaveLength(0);
  });

  it("sin átomos → 0 áreas reales y candidaturasTecnicas vacío", () => {
    const psl = buildPSL([]);
    const realAreas = psl.areasDeIntervencion.filter((a) => !a.isAnalyticalGap);
    expect(realAreas).toHaveLength(0);
    expect(psl.priorizacion.hasTechnicalCandidatures).toBe(false);
    expect(psl.priorizacion.candidaturasTecnicas).toHaveLength(0);
  });
});

// ── 3. isAnalyticalGap correctamente asignado ────────────────────────────────

describe("PSL — isAnalyticalGap asignado correctamente", () => {
  it("oit-expand-evidence-base se marca como isAnalyticalGap", () => {
    const psl = buildPSL([]);
    const expandGap = psl.areasDeIntervencion.find((a) => a.id === "oit-expand-evidence-base");
    expect(expandGap).toBeDefined();
    expect(expandGap?.isAnalyticalGap).toBe(true);
  });

  it("oit-methodological-review se marca como isAnalyticalGap", () => {
    const atoms = [makeAtom("methodological-caution", 1)];
    const psl = buildPSL(atoms);
    const methGap = psl.areasDeIntervencion.find((a) => a.id === "oit-methodological-review");
    if (methGap !== undefined) {
      expect(methGap.isAnalyticalGap).toBe(true);
    }
  });

  it("oit-determinants-assets NO es un vacío analítico", () => {
    const atoms = [makeAtom("determinant", 1), makeAtom("asset", 1)];
    const psl = buildPSL(atoms);
    const realArea = psl.areasDeIntervencion.find((a) => a.id === "oit-determinants-assets");
    if (realArea !== undefined) {
      expect(realArea.isAnalyticalGap).toBeFalsy();
    }
  });

  it("con determinantes + activos: hasTechnicalCandidatures = true y candidaturas contiene el área real", () => {
    const atoms = [makeAtom("determinant", 1), makeAtom("asset", 1)];
    const psl = buildPSL(atoms);
    expect(psl.priorizacion.hasTechnicalCandidatures).toBe(true);
    expect(psl.priorizacion.candidaturasTecnicas.length).toBeGreaterThan(0);
    expect(
      psl.priorizacion.candidaturasTecnicas.every(
        (c) => c.id !== "oit-expand-evidence-base" && c.id !== "oit-methodological-review"
      )
    ).toBe(true);
  });
});

// ── 4. Áreas escaladas (ReconciliacionEngine) — sin lenguaje interno ──────────

describe("Áreas escaladas — sin terminología interna de reconciliación", () => {
  it("rationale no menciona Filtro de Relevancia ni Criterios de Escalado", () => {
    const atoms = [makeAtom("determinant", 1), makeAtom("asset", 1)];
    const psl = buildPSL(atoms);
    const areasText = psl.areasDeIntervencion.map((a) => a.rationale).join("\n");
    expect(areasText).not.toContain("Filtro de Relevancia");
    expect(areasText).not.toContain("Criterios de Escalado");
    expect(areasText).not.toContain("heurísticamente");
  });

  it("cautions no contienen 'escalada heurísticamente'", () => {
    const atoms = [makeAtom("determinant", 1), makeAtom("asset", 1)];
    const psl = buildPSL(atoms);
    const cautionsText = psl.areasDeIntervencion.flatMap((a) => a.cautions).join("\n");
    expect(cautionsText).not.toContain("escalada heurísticamente");
    expect(cautionsText).not.toContain("Área escalada heurísticamente");
  });
});

// ── 5. '0 evidencia(s) relacionada(s)' ausente ──────────────────────────────

describe("PSL — metadato '0 evidencia(s) relacionada(s)' ausente", () => {
  it("el texto de rationale y cautions no dice '0 evidencia(s) relacionada(s)'", () => {
    const psl = buildPSL([]);
    const allText = psl.areasDeIntervencion
      .map((a) => `${a.rationale} ${a.cautions.join(" ")}`)
      .join("\n");
    expect(allText).not.toContain("0 evidencia(s) relacionada(s)");
  });
});

// ── 6. MIT: tensionesEstructurales siempre vacías (ninguna detectada aún) ─────

describe("MIT — tensionesEstructurales vacías cuando solo hay limitaciones metodológicas", () => {
  it("solo cautelas metodológicas → tensionesEstructurales = []", () => {
    const atoms = [makeAtom("methodological-caution", 1)];
    const { mit } = buildFullPipeline(atoms);
    expect(mit.tensionesEstructurales).toHaveLength(0);
  });

  it("activos + cautelas → tensionesEstructurales = []", () => {
    const atoms = [makeAtom("asset", 1), makeAtom("methodological-caution", 1)];
    const { mit } = buildFullPipeline(atoms);
    expect(mit.tensionesEstructurales).toHaveLength(0);
  });

  it("base completa → tensionesEstructurales = [] (no hay tensiones territoriales detectadas)", () => {
    const atoms = [
      makeAtom("determinant", 1),
      makeAtom("asset", 1),
      makeAtom("indicator", 1),
    ];
    const { mit } = buildFullPipeline(atoms);
    expect(mit.tensionesEstructurales).toHaveLength(0);
  });

  it("con cautelas: limitacionesDiagnosticas contiene observaciones, tensionesEstructurales vacías", () => {
    const atoms = [makeAtom("methodological-caution", 1)];
    const { mit } = buildFullPipeline(atoms);
    expect(mit.tensionesEstructurales).toHaveLength(0);
    expect(mit.limitacionesDiagnosticas.length).toBeGreaterThan(0);
  });
});
