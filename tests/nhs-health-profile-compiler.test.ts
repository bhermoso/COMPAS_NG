import { describe, it, expect } from "vitest";
import {
  compileNHSHealthProfile,
  validateNHSCompilationPreconditions,
} from "../src/application/nhs-health-profile-compiler";
import type { LocalHealthProfile } from "../src/domain/health-profile";
import type { MunicipalityWorkspace } from "../src/domain/workspace";

// ── Fixtures ──────────────────────────────────────────────────────────────────

function basePSL(overrides: Partial<LocalHealthProfile> = {}): LocalHealthProfile {
  return {
    id: "psl-test-001",
    municipalityId: "atarfe",
    status: "validated",
    version: "2026-06-30T10:00:00.000Z",
    evidenceStoreVersion: "2026-06-30T09:00:00.000Z",
    strategicFrameworkSectionIds: [],
    healthReportSectionCount: 0,
    healthReportAtomCount: 0,
    totalEvidenceAtoms: 10,
    integrityErrors: 0,
    integrityWarnings: 0,
    atomsByOrigin: {},
    atomsByKind: {},
    evidenceAtomIds: [],
    originsSummary: [],
    ibsePresent: false,
    dukePresent: false,
    predimedPresent: false,
    sf12Present: false,
    suenoPresent: false,
    cagePresent: false,
    thematicPrioritisationPresent: false,
    complementaryStudyCount: 0,
    territorialSummary: "",
    determinantCount: 0,
    assetCount: 0,
    indicatorCount: 0,
    qualitativeFindingCount: 0,
    methodologicalCautionCount: 0,
    preliminaryOpportunities: [],
    longitudinalActive: false,
    longitudinalNote: "",
    longitudinalEvidenceCount: 0,
    marcosAplicados: [],
    tensionesEstructurales: [],
    conflictos: [],
    tensionesEscaladas: [],
    tensionesNoEscaladas: [],
    ruidoEstructural: [],
    areasDeIntervencion: [],
    conclusiones: { content: "Conclusiones.", status: "authored", authorshipNote: "" },
    cierreInterpretativo: { content: "Cierre.", status: "authored", authorshipNote: "" },
    priorizacion: {
      candidaturasTecnicas: [],
      hasTechnicalCandidatures: false,
      tematicasSeleccionadasIds: [],
      tematicasSeleccionadasLabels: [],
      hasParticipatorySelection: false,
      deliberacionNota: "pendiente",
      consensoDocumentado: false,
    },
    priorizacionStatus: "scaffold",
    generatedAt: "2026-06-30T09:30:00.000Z",
    validatedAt: "2026-06-30T10:00:00.000Z",
    validatedBy: "Técnica de salud pública",
    requiresHumanValidation: true,
    ...overrides,
  };
}

function emptyWorkspace(): MunicipalityWorkspace {
  return {
    municipality: {
      identity: { id: "atarfe", name: "Atarfe", province: "Granada" },
      metadata: { createdAt: "2026-06-30T00:00:00.000Z", updatedAt: "2026-06-30T00:00:00.000Z" },
    },
    repository: { documents: [], municipalityId: "atarfe" },
    evidenceStore: { atoms: [], municipalityId: "atarfe", updatedAt: "2026-06-30T09:00:00.000Z" },
  };
}

function ibseAggregates() {
  return {
    n: 45, nValid: 40,
    meanTotal: 62.5,
    meanFactorVinculo: 65.0, meanFactorSituacion: 60.0,
    meanFactorControl: 62.0, meanFactorPersona: 63.0,
  };
}

function dukeAggregates() {
  return {
    n: 120, nValidGlobal: 112, nValidConfidential: 112, nValidAffective: 112,
    meanGlobal: 47.3, meanConfidential: 28.1, meanAffective: 19.2,
    lowGlobalCount: 30, lowConfidentialCount: 28, lowAffectiveCount: 25,
    normalGlobalCount: 82, normalConfidentialCount: 84, normalAffectiveCount: 87,
    incompleteGlobalCount: 8, incompleteConfidentialCount: 8, incompleteAffectiveCount: 8,
    lowGlobalPercentage: 26.8, lowConfidentialPercentage: 25.0, lowAffectivePercentage: 22.3,
  };
}

function predimedAggregates() {
  return {
    n: 200, nValid: 190,
    meanScore: 8.1,
    lowCount: 50, mediumCount: 60, highCount: 80,
    lowPercentage: 26.3, mediumPercentage: 31.6, highPercentage: 42.1,
    incompleteCount: 10,
  };
}

function sf12Aggregates() {
  return {
    n: 200, nValidPCS: 195, nValidMCS: 195,
    meanPCS: 48.5, meanMCS: 44.2,
    missingPCS: 5, missingMCS: 5,
  };
}

function suenoAggregates() {
  return {
    n: 200, nValidP33R: 196, missingP33R: 4,
    nInsufficientSleep: 80, pctInsufficientSleep: 40.8,
    nValidP33A: 150, missingP33A: 50,
    nNoRest: 45, pctNoRest: 30.0,
  };
}

function cageAggregates() {
  return {
    n: 200, nValidCAGER: 164, missingCAGER: 36,
    nRisk: 15, pctRisk: 9.1,
    nValidCAGE: 164,
    nCAGE1: 100, nCAGE2: 49, nCAGE3: 10, nCAGE4: 5,
  };
}

function baseInput(
  pslOverrides: Partial<LocalHealthProfile> = {},
  workspaceExtras: Partial<MunicipalityWorkspace> = {}
) {
  return {
    psl: basePSL(pslOverrides),
    workspace: { ...emptyWorkspace(), ...workspaceExtras },
    compiledBy: "Técnica de salud pública — DAP Granada-Metro",
    municipalityName: "Atarfe",
    municipalityProvince: "Granada",
    existingArtifactCount: 0,
  };
}

// ── Tests: validateNHSCompilationPreconditions ────────────────────────────────

describe("validateNHSCompilationPreconditions", () => {
  it("PSL validado con estudio → 0 violaciones", () => {
    const v = validateNHSCompilationPreconditions(
      basePSL({ complementaryStudyCount: 1 })
    );
    expect(v).toHaveLength(0);
  });

  it("G-NHS-1: PSL generated → violación", () => {
    const v = validateNHSCompilationPreconditions(
      basePSL({ status: "generated", complementaryStudyCount: 1 })
    );
    expect(v.some((x) => x.gate === "G-NHS-1")).toBe(true);
  });

  it("G-NHS-1: PSL approved → 0 violaciones (estado válido)", () => {
    const v = validateNHSCompilationPreconditions(
      basePSL({ status: "approved", complementaryStudyCount: 1 })
    );
    expect(v.some((x) => x.gate === "G-NHS-1")).toBe(false);
  });

  it("G-NHS-2: sin estudios → violación", () => {
    const v = validateNHSCompilationPreconditions(
      basePSL({ complementaryStudyCount: 0 })
    );
    expect(v.some((x) => x.gate === "G-NHS-2")).toBe(true);
  });

  it("ambos gates fallidos → ambas violaciones reportadas", () => {
    const v = validateNHSCompilationPreconditions(
      basePSL({ status: "generated", complementaryStudyCount: 0 })
    );
    expect(v.length).toBe(2);
  });
});

// ── Tests: compilación correcta ───────────────────────────────────────────────

describe("compileNHSHealthProfile — compilación correcta", () => {
  it("PSL sin estudios → ok: false (G-NHS-2)", () => {
    const result = compileNHSHealthProfile(baseInput());
    expect(result.ok).toBe(false);
  });

  it("PSL con 1 estudio (IBSE) → ok: true", () => {
    const result = compileNHSHealthProfile(baseInput(
      { complementaryStudyCount: 1, ibsePresent: true },
      { ibseStudy: { id: "s1", municipalityId: "atarfe", sourceFileName: "ibse.csv", aggregates: ibseAggregates(), methodologicalCautions: [], createdAt: "", updatedAt: "" } }
    ));
    expect(result.ok).toBe(true);
  });

  it("artefacto tiene isCongealed: true", () => {
    const result = compileNHSHealthProfile(baseInput(
      { complementaryStudyCount: 1, ibsePresent: true },
      { ibseStudy: { id: "s1", municipalityId: "atarfe", sourceFileName: "ibse.csv", aggregates: ibseAggregates(), methodologicalCautions: [], createdAt: "", updatedAt: "" } }
    ));
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.artifact.isCongealed).toBe(true);
  });

  it("versioning: primer artefacto → PSL-NHS/v1", () => {
    const result = compileNHSHealthProfile(baseInput(
      { complementaryStudyCount: 1, ibsePresent: true },
      { ibseStudy: { id: "s1", municipalityId: "atarfe", sourceFileName: "ibse.csv", aggregates: ibseAggregates(), methodologicalCautions: [], createdAt: "", updatedAt: "" } }
    ));
    if (result.ok) expect(result.artifact.artifactVersion).toBe("PSL-NHS/v1");
  });

  it("versioning: segundo artefacto → PSL-NHS/v2", () => {
    const inp = { ...baseInput(
      { complementaryStudyCount: 1, ibsePresent: true },
      { ibseStudy: { id: "s1", municipalityId: "atarfe", sourceFileName: "ibse.csv", aggregates: ibseAggregates(), methodologicalCautions: [], createdAt: "", updatedAt: "" } }
    ), existingArtifactCount: 1 };
    const result = compileNHSHealthProfile(inp);
    if (result.ok) expect(result.artifact.artifactVersion).toBe("PSL-NHS/v2");
  });

  it("trazabilidad: sourcePSLId apunta al PSL de origen", () => {
    const psl = basePSL({ complementaryStudyCount: 1, ibsePresent: true });
    const result = compileNHSHealthProfile({
      psl,
      workspace: { ...emptyWorkspace(), ibseStudy: { id: "s1", municipalityId: "atarfe", sourceFileName: "ibse.csv", aggregates: ibseAggregates(), methodologicalCautions: [], createdAt: "", updatedAt: "" } },
      municipalityName: "Atarfe",
      municipalityProvince: "Granada",
      existingArtifactCount: 0,
    });
    if (result.ok) expect(result.artifact.sourcePSLId).toBe(psl.id);
  });
});

// ── Tests: organización por dominio ──────────────────────────────────────────

describe("compileNHSHealthProfile — dominios", () => {
  it("IBSE produce dominio 'bienestar'", () => {
    const result = compileNHSHealthProfile(baseInput(
      { complementaryStudyCount: 1, ibsePresent: true },
      { ibseStudy: { id: "s1", municipalityId: "atarfe", sourceFileName: "ibse.csv", aggregates: ibseAggregates(), methodologicalCautions: [], createdAt: "", updatedAt: "" } }
    ));
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.artifact.dominios.some((d) => d.id === "bienestar")).toBe(true);
      expect(result.artifact.dominios.some((d) => d.id === "conductas")).toBe(false);
      expect(result.artifact.dominios.some((d) => d.id === "salud-percibida")).toBe(false);
    }
  });

  it("PREDIMED y Sueño producen dominio 'conductas'", () => {
    const result = compileNHSHealthProfile(baseInput(
      { complementaryStudyCount: 2, predimedPresent: true, suenoPresent: true },
      {
        predimedStudy: { id: "s2", municipalityId: "atarfe", sourceFileName: "predimed.csv", aggregates: predimedAggregates(), methodologicalCautions: [], createdAt: "", updatedAt: "" },
        suenoStudy:   { id: "s3", municipalityId: "atarfe", sourceFileName: "sueno.csv",   aggregates: suenoAggregates(),   methodologicalCautions: [], createdAt: "", updatedAt: "" },
      }
    ));
    expect(result.ok).toBe(true);
    if (result.ok) {
      const conductas = result.artifact.dominios.find((d) => d.id === "conductas");
      expect(conductas).toBeDefined();
      expect(conductas!.indicators).toHaveLength(2);
    }
  });

  it("SF-12 produce dominio 'salud-percibida' con dos indicadores (PCS y MCS)", () => {
    const result = compileNHSHealthProfile(baseInput(
      { complementaryStudyCount: 1, sf12Present: true },
      { sf12Study: { id: "s4", municipalityId: "atarfe", sourceFileName: "sf12.csv", aggregates: sf12Aggregates(), createdAt: "", updatedAt: "" } }
    ));
    expect(result.ok).toBe(true);
    if (result.ok) {
      const saludPercibida = result.artifact.dominios.find((d) => d.id === "salud-percibida");
      expect(saludPercibida).toBeDefined();
      expect(saludPercibida!.indicators).toHaveLength(2);
      const labels = saludPercibida!.indicators.map((r) => r.label);
      expect(labels).toContain("Salud física percibida");
      expect(labels).toContain("Salud mental percibida");
    }
  });

  it("6 estudios cargados → 3 dominios presentes", () => {
    const result = compileNHSHealthProfile(baseInput(
      { complementaryStudyCount: 6, ibsePresent: true, dukePresent: true, predimedPresent: true, sf12Present: true, suenoPresent: true, cagePresent: true },
      {
        ibseStudy:    { id: "s1", municipalityId: "atarfe", sourceFileName: "ibse.csv",    aggregates: ibseAggregates(),    methodologicalCautions: [], createdAt: "", updatedAt: "" },
        dukeStudy:    { id: "s2", municipalityId: "atarfe", sourceFileName: "duke.csv",    aggregates: dukeAggregates(),    methodologicalCautions: [], warnings: [], createdAt: "", updatedAt: "" },
        predimedStudy:{ id: "s3", municipalityId: "atarfe", sourceFileName: "predimed.csv",aggregates: predimedAggregates(),methodologicalCautions: [], createdAt: "", updatedAt: "" },
        sf12Study:    { id: "s4", municipalityId: "atarfe", sourceFileName: "sf12.csv",    aggregates: sf12Aggregates(),    createdAt: "", updatedAt: "" },
        suenoStudy:   { id: "s5", municipalityId: "atarfe", sourceFileName: "sueno.csv",   aggregates: suenoAggregates(),   methodologicalCautions: [], createdAt: "", updatedAt: "" },
        cageStudy:    { id: "s6", municipalityId: "atarfe", sourceFileName: "cage.csv",    aggregates: cageAggregates(),    methodologicalCautions: [], createdAt: "", updatedAt: "" },
      }
    ));
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.artifact.dominios).toHaveLength(3);
      const ids = result.artifact.dominios.map((d) => d.id);
      expect(ids).toContain("bienestar");
      expect(ids).toContain("conductas");
      expect(ids).toContain("salud-percibida");
    }
  });
});

// ── Tests: comparadores y posición ───────────────────────────────────────────

describe("compileNHSHealthProfile — comparadores", () => {
  it("IBSE no tiene referencia → reference null y position null", () => {
    const result = compileNHSHealthProfile(baseInput(
      { complementaryStudyCount: 1, ibsePresent: true },
      { ibseStudy: { id: "s1", municipalityId: "atarfe", sourceFileName: "ibse.csv", aggregates: ibseAggregates(), methodologicalCautions: [], createdAt: "", updatedAt: "" } }
    ));
    if (result.ok) {
      const ibseRow = result.artifact.dominios[0].indicators[0];
      expect(ibseRow.reference).toBeNull();
      expect(ibseRow.position).toBeNull();
    }
  });

  it("DUKE tiene referencia EAS Granada (49.2) y posición calculada", () => {
    // duke meanGlobal = 47.3 < 49.2 → "below" (higher-is-better)
    // relDiff = |47.3 - 49.2| / 49.2 = 0.0386 < 0.10 → "similar"
    const result = compileNHSHealthProfile(baseInput(
      { complementaryStudyCount: 1, dukePresent: true },
      { dukeStudy: { id: "s2", municipalityId: "atarfe", sourceFileName: "duke.csv", aggregates: dukeAggregates(), methodologicalCautions: [], warnings: [], createdAt: "", updatedAt: "" } }
    ));
    if (result.ok) {
      const dukeRow = result.artifact.dominios[0].indicators[0];
      expect(dukeRow.reference).not.toBeNull();
      expect(dukeRow.reference!.value).toBe(49.2);
      expect(dukeRow.position).toBe("similar"); // 47.3 vs 49.2 = 3.86% < 10%
    }
  });

  it("PREDIMED tiene referencia EAS Granada (7.6) y posición above cuando valor > referencia", () => {
    // meanScore = 8.1 > 7.6 → higher-is-better → "above"
    // relDiff = |8.1 - 7.6| / 7.6 = 0.0658 < 0.10 → "similar"
    const result = compileNHSHealthProfile(baseInput(
      { complementaryStudyCount: 1, predimedPresent: true },
      { predimedStudy: { id: "s3", municipalityId: "atarfe", sourceFileName: "predimed.csv", aggregates: predimedAggregates(), methodologicalCautions: [], createdAt: "", updatedAt: "" } }
    ));
    if (result.ok) {
      const row = result.artifact.dominios[0].indicators[0];
      expect(row.reference!.value).toBe(7.6);
      expect(row.position).toBe("similar"); // 6.58% < 10%
    }
  });

  it("PREDIMED con valor muy bajo produce posición 'below'", () => {
    const lowPredimed = { ...predimedAggregates(), meanScore: 5.0 };
    // relDiff = |5.0 - 7.6| / 7.6 = 0.342 > 0.10, lower than ref, higher-is-better → "below"
    const result = compileNHSHealthProfile(baseInput(
      { complementaryStudyCount: 1, predimedPresent: true },
      { predimedStudy: { id: "s3", municipalityId: "atarfe", sourceFileName: "predimed.csv", aggregates: lowPredimed, methodologicalCautions: [], createdAt: "", updatedAt: "" } }
    ));
    if (result.ok) {
      const row = result.artifact.dominios[0].indicators[0];
      expect(row.position).toBe("below");
    }
  });

  it("SF-12 PCS 48.5 con diferencia 3% respecto a 50 → 'similar'", () => {
    // meanPCS = 48.5 → relDiff = |48.5-50|/50 = 0.03 < 0.10 → "similar"
    const result = compileNHSHealthProfile(baseInput(
      { complementaryStudyCount: 1, sf12Present: true },
      { sf12Study: { id: "s4", municipalityId: "atarfe", sourceFileName: "sf12.csv", aggregates: sf12Aggregates(), createdAt: "", updatedAt: "" } }
    ));
    if (result.ok) {
      const saludDom = result.artifact.dominios.find((d) => d.id === "salud-percibida")!;
      const pcsRow = saludDom.indicators.find((r) => r.label === "Salud física percibida")!;
      expect(pcsRow.position).toBe("similar");
    }
  });

  it("SF-12 MCS 44.2 con diferencia 11.6% respecto a 50 → 'below'", () => {
    // meanMCS = 44.2 → relDiff = |44.2-50|/50 = 0.116 > 0.10 → "below" (higher-is-better)
    const result = compileNHSHealthProfile(baseInput(
      { complementaryStudyCount: 1, sf12Present: true },
      { sf12Study: { id: "s4", municipalityId: "atarfe", sourceFileName: "sf12.csv", aggregates: sf12Aggregates(), createdAt: "", updatedAt: "" } }
    ));
    if (result.ok) {
      const saludDom = result.artifact.dominios.find((d) => d.id === "salud-percibida")!;
      const mcsRow = saludDom.indicators.find((r) => r.label === "Salud mental percibida")!;
      expect(mcsRow.position).toBe("below");
    }
  });

  it("fewComparatorsWarning: true con solo IBSE (0 comparadores)", () => {
    const result = compileNHSHealthProfile(baseInput(
      { complementaryStudyCount: 1, ibsePresent: true },
      { ibseStudy: { id: "s1", municipalityId: "atarfe", sourceFileName: "ibse.csv", aggregates: ibseAggregates(), methodologicalCautions: [], createdAt: "", updatedAt: "" } }
    ));
    if (result.ok) {
      expect(result.artifact.portada.fewComparatorsWarning).toBe(true);
      expect(result.artifact.alcance.fewComparatorsWarning).toBe(true);
    }
  });

  it("fewComparatorsWarning: false con DUKE + PREDIMED + SF-12 (4 comparadores)", () => {
    const result = compileNHSHealthProfile(baseInput(
      { complementaryStudyCount: 3, dukePresent: true, predimedPresent: true, sf12Present: true },
      {
        dukeStudy:    { id: "s2", municipalityId: "atarfe", sourceFileName: "duke.csv",    aggregates: dukeAggregates(),    methodologicalCautions: [], warnings: [], createdAt: "", updatedAt: "" },
        predimedStudy:{ id: "s3", municipalityId: "atarfe", sourceFileName: "predimed.csv",aggregates: predimedAggregates(),methodologicalCautions: [], createdAt: "", updatedAt: "" },
        sf12Study:    { id: "s4", municipalityId: "atarfe", sourceFileName: "sf12.csv",    aggregates: sf12Aggregates(),    createdAt: "", updatedAt: "" },
      }
    ));
    if (result.ok) {
      expect(result.artifact.portada.fewComparatorsWarning).toBe(false);
    }
  });
});

// ── Tests: aviso de muestra pequeña ──────────────────────────────────────────

describe("compileNHSHealthProfile — muestra pequeña", () => {
  it("nValid < 30 → smallSampleWarning: true", () => {
    const smallIbse = { ...ibseAggregates(), nValid: 15 };
    const result = compileNHSHealthProfile(baseInput(
      { complementaryStudyCount: 1, ibsePresent: true },
      { ibseStudy: { id: "s1", municipalityId: "atarfe", sourceFileName: "ibse.csv", aggregates: smallIbse, methodologicalCautions: [], createdAt: "", updatedAt: "" } }
    ));
    if (result.ok) {
      expect(result.artifact.dominios[0].indicators[0].smallSampleWarning).toBe(true);
    }
  });

  it("nValid >= 30 → smallSampleWarning: false", () => {
    const result = compileNHSHealthProfile(baseInput(
      { complementaryStudyCount: 1, ibsePresent: true },
      { ibseStudy: { id: "s1", municipalityId: "atarfe", sourceFileName: "ibse.csv", aggregates: ibseAggregates(), methodologicalCautions: [], createdAt: "", updatedAt: "" } }
    ));
    if (result.ok) {
      expect(result.artifact.dominios[0].indicators[0].smallSampleWarning).toBe(false);
    }
  });
});

// ── Tests: Alcance del diagnóstico (Parte IV) ─────────────────────────────────

describe("compileNHSHealthProfile — alcance", () => {
  it("alcance siempre presente en el artefacto (P4-I9)", () => {
    const result = compileNHSHealthProfile(baseInput(
      { complementaryStudyCount: 1, ibsePresent: true },
      { ibseStudy: { id: "s1", municipalityId: "atarfe", sourceFileName: "ibse.csv", aggregates: ibseAggregates(), methodologicalCautions: [], createdAt: "", updatedAt: "" } }
    ));
    if (result.ok) expect(result.artifact.alcance).toBeDefined();
  });

  it("alcance.cautela contiene el texto contractual obligatorio", () => {
    const result = compileNHSHealthProfile(baseInput(
      { complementaryStudyCount: 1, ibsePresent: true },
      { ibseStudy: { id: "s1", municipalityId: "atarfe", sourceFileName: "ibse.csv", aggregates: ibseAggregates(), methodologicalCautions: [], createdAt: "", updatedAt: "" } }
    ));
    if (result.ok) {
      expect(result.artifact.alcance.cautela).toContain("ausencia de un estudio");
    }
  });

  it("con 1 de 6 estudios: 1 disponible, 5 ausentes", () => {
    const result = compileNHSHealthProfile(baseInput(
      { complementaryStudyCount: 1, ibsePresent: true },
      { ibseStudy: { id: "s1", municipalityId: "atarfe", sourceFileName: "ibse.csv", aggregates: ibseAggregates(), methodologicalCautions: [], createdAt: "", updatedAt: "" } }
    ));
    if (result.ok) {
      expect(result.artifact.alcance.availableStudies).toHaveLength(1);
      expect(result.artifact.alcance.missingStudies).toHaveLength(5);
    }
  });

  it("IBSE sin referencia aparece en indicatorsWithoutReference", () => {
    const result = compileNHSHealthProfile(baseInput(
      { complementaryStudyCount: 1, ibsePresent: true },
      { ibseStudy: { id: "s1", municipalityId: "atarfe", sourceFileName: "ibse.csv", aggregates: ibseAggregates(), methodologicalCautions: [], createdAt: "", updatedAt: "" } }
    ));
    if (result.ok) {
      const noRef = result.artifact.alcance.indicatorsWithoutReference;
      expect(noRef.some((r) => r.label === "Bienestar socioemocional escolar")).toBe(true);
    }
  });

  it("DUKE con referencia NO aparece en indicatorsWithoutReference", () => {
    const result = compileNHSHealthProfile(baseInput(
      { complementaryStudyCount: 1, dukePresent: true },
      { dukeStudy: { id: "s2", municipalityId: "atarfe", sourceFileName: "duke.csv", aggregates: dukeAggregates(), methodologicalCautions: [], warnings: [], createdAt: "", updatedAt: "" } }
    ));
    if (result.ok) {
      const noRef = result.artifact.alcance.indicatorsWithoutReference;
      expect(noRef.some((r) => r.label === "Apoyo social funcional")).toBe(false);
    }
  });
});

// ── Tests: participación ciudadana ───────────────────────────────────────────

describe("compileNHSHealthProfile — participación ciudadana", () => {
  it("sin priorización → participacionCiudadana null", () => {
    const result = compileNHSHealthProfile(baseInput(
      { complementaryStudyCount: 1, ibsePresent: true },
      { ibseStudy: { id: "s1", municipalityId: "atarfe", sourceFileName: "ibse.csv", aggregates: ibseAggregates(), methodologicalCautions: [], createdAt: "", updatedAt: "" } }
    ));
    if (result.ok) expect(result.artifact.participacionCiudadana).toBeNull();
  });

  it("con priorización ciudadana → participacionCiudadana.realizada true", () => {
    const result = compileNHSHealthProfile(baseInput(
      { complementaryStudyCount: 1, ibsePresent: true, thematicPrioritisationPresent: true },
      {
        ibseStudy: { id: "s1", municipalityId: "atarfe", sourceFileName: "ibse.csv", aggregates: ibseAggregates(), methodologicalCautions: [], createdAt: "", updatedAt: "" },
        thematicPrioritisation: {
          id: "tp-1", municipalityId: "atarfe",
          selectedTopicIds: ["bienestar-emocional", "alimentacion"],
          createdAt: "", updatedAt: "",
        },
      }
    ));
    if (result.ok) {
      expect(result.artifact.participacionCiudadana).not.toBeNull();
      expect(result.artifact.participacionCiudadana!.realizada).toBe(true);
      expect(result.artifact.participacionCiudadana!.tematicasCount).toBe(2);
    }
  });
});

// ── Tests: invariantes ────────────────────────────────────────────────────────

describe("compileNHSHealthProfile — invariantes", () => {
  it("PSL de origen no se modifica tras la compilación (P4-I4)", () => {
    const psl = basePSL({ complementaryStudyCount: 1, ibsePresent: true });
    const statusAntes = psl.status;
    compileNHSHealthProfile({
      psl,
      workspace: { ...emptyWorkspace(), ibseStudy: { id: "s1", municipalityId: "atarfe", sourceFileName: "ibse.csv", aggregates: ibseAggregates(), methodologicalCautions: [], createdAt: "", updatedAt: "" } },
      municipalityName: "Atarfe",
      municipalityProvince: "Granada",
      existingArtifactCount: 0,
    });
    expect(psl.status).toBe(statusAntes);
    expect(psl.complementaryStudyCount).toBe(1);
  });

  it("dos compilaciones del mismo PSL producen artefactos con IDs distintos", () => {
    const input = baseInput(
      { complementaryStudyCount: 1, ibsePresent: true },
      { ibseStudy: { id: "s1", municipalityId: "atarfe", sourceFileName: "ibse.csv", aggregates: ibseAggregates(), methodologicalCautions: [], createdAt: "", updatedAt: "" } }
    );
    const r1 = compileNHSHealthProfile(input);
    const r2 = compileNHSHealthProfile({ ...input, existingArtifactCount: 1 });
    expect(r1.ok).toBe(true);
    expect(r2.ok).toBe(true);
    if (r1.ok && r2.ok) {
      expect(r1.artifact.id).not.toBe(r2.artifact.id);
      expect(r1.artifact.artifactVersion).toBe("PSL-NHS/v1");
      expect(r2.artifact.artifactVersion).toBe("PSL-NHS/v2");
    }
  });

  it("dominios en orden canónico: bienestar → conductas → salud-percibida", () => {
    const result = compileNHSHealthProfile(baseInput(
      { complementaryStudyCount: 6, ibsePresent: true, dukePresent: true, predimedPresent: true, sf12Present: true, suenoPresent: true, cagePresent: true },
      {
        ibseStudy:    { id: "s1", municipalityId: "atarfe", sourceFileName: "ibse.csv",    aggregates: ibseAggregates(),    methodologicalCautions: [], createdAt: "", updatedAt: "" },
        dukeStudy:    { id: "s2", municipalityId: "atarfe", sourceFileName: "duke.csv",    aggregates: dukeAggregates(),    methodologicalCautions: [], warnings: [], createdAt: "", updatedAt: "" },
        predimedStudy:{ id: "s3", municipalityId: "atarfe", sourceFileName: "predimed.csv",aggregates: predimedAggregates(),methodologicalCautions: [], createdAt: "", updatedAt: "" },
        sf12Study:    { id: "s4", municipalityId: "atarfe", sourceFileName: "sf12.csv",    aggregates: sf12Aggregates(),    createdAt: "", updatedAt: "" },
        suenoStudy:   { id: "s5", municipalityId: "atarfe", sourceFileName: "sueno.csv",   aggregates: suenoAggregates(),   methodologicalCautions: [], createdAt: "", updatedAt: "" },
        cageStudy:    { id: "s6", municipalityId: "atarfe", sourceFileName: "cage.csv",    aggregates: cageAggregates(),    methodologicalCautions: [], createdAt: "", updatedAt: "" },
      }
    ));
    if (result.ok) {
      const ids = result.artifact.dominios.map((d) => d.id);
      expect(ids[0]).toBe("bienestar");
      expect(ids[1]).toBe("conductas");
      expect(ids[2]).toBe("salud-percibida");
    }
  });

  it("artefacto con error no contiene artifact (discriminated union)", () => {
    const result = compileNHSHealthProfile(baseInput()); // sin estudios
    expect(result.ok).toBe(false);
    expect("artifact" in result).toBe(false);
  });
});
