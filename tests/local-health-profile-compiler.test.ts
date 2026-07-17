import { describe, it, expect } from "vitest";
import {
  compileLocalHealthProfile,
  validateCompilationPreconditions,
  validateCompiledBody,
  computePSLHash,
} from "../src/application/health-profile-compiler";
import {
  buildDiagnosticAnswers,
  buildProfileIntegratedEditorialView,
} from "../src/application/health-profile";
import type { DiagnosticAnswers } from "../src/application/health-profile";
import {
  readSealedCanonicalDocument,
  buildPSLCCanonicalDocument,
  sealCanonicalDocument,
  type PSLCReadingContext,
} from "../src/application/psl-c-canonical";
import { createMunicipalityContext } from "../src/domain/municipality";
import { createEvidenceStore } from "../src/domain/evidence";
import { createMunicipalDocumentRepository } from "../src/domain/repository";
import { createMunicipalityWorkspace } from "../src/domain/workspace";
import { createThematicPrioritisation } from "../src/domain/thematic-prioritisation";
import type { HealthReportDocument } from "../src/domain/health-report";
import type { MunicipalityWorkspace } from "../src/domain/workspace";
import type {
  LocalHealthProfile,
  PerfilLocalDeSalud,
  PSLPriorizacion,
} from "../src/domain/health-profile";

// ── Fixtures ──────────────────────────────────────────────────────────────────

function scaffoldChapter() {
  return {
    content: "Orientación técnica del sistema.",
    status: "scaffold" as const,
    authorshipNote: "Requiere autoría humana.",
  };
}

function authoredChapter(content = "Texto redactado por el equipo técnico.") {
  return {
    content,
    status: "authored" as const,
    authorshipNote: "Requiere autoría humana.",
  };
}

function basePriorizacion(consenso = false) {
  return {
    candidaturasTecnicas: [
      { id: "cand-1", title: "Salud mental", rationale: "Alta prevalencia", relatedEvidenceIds: ["ev-1"] },
    ],
    hasTechnicalCandidatures: true,
    tematicasSeleccionadasIds: ["bienestar-emocional"],
    tematicasSeleccionadasLabels: ["Bienestar Emocional"],
    hasParticipatorySelection: true,
    deliberacionNota: consenso
      ? "El Grupo Motor deliberó y alcanzó consenso."
      : "Pendiente de autoría humana.",
    consensoDocumentado: consenso,
  };
}

function basePSL(overrides: Partial<LocalHealthProfile> = {}): LocalHealthProfile {
  return {
    id: "psl-atarfe-001",
    municipalityId: "atarfe",
    status: "validated",
    version: "2026-06-28T10:00:00.000Z",
    evidenceStoreVersion: "2026-06-28T09:00:00.000Z",
    strategicFrameworkSectionIds: ["normativo", "estrategico", "metodologico"],
    healthReportDocumentId: "doc-informe-salud",
    healthReportTitle: "Informe de Salud de Atarfe 2025",
    healthReportSectionCount: 12,
    healthReportAtomCount: 8,
    totalEvidenceAtoms: 21,
    integrityErrors: 0,
    integrityWarnings: 2,
    atomsByOrigin: { "ibse": 6, "health-report": 8, "duke": 4, "predimed": 3 },
    atomsByKind: { "indicator": 10, "determinant": 5, "asset": 4, "methodological-caution": 2 },
    evidenceAtomIds: ["ev-1", "ev-2", "ev-3", "ev-4", "ev-5"],
    originsSummary: ["duke", "health-report", "ibse", "predimed"],
    ibsePresent: true,
    dukePresent: true,
    predimedPresent: true,
    sf12Present: false,
    suenoPresent: false,
    cagePresent: false,
    thematicPrioritisationPresent: true,
    complementaryStudyCount: 3,
    territorialSummary: "El territorio de Atarfe presenta un perfil de salud con fortalezas en cohesión social.",
    determinantCount: 5,
    assetCount: 4,
    indicatorCount: 10,
    qualitativeFindingCount: 2,
    methodologicalCautionCount: 2,
    preliminaryOpportunities: ["Salud mental", "Alimentación saludable"],
    longitudinalActive: false,
    longitudinalNote: "",
    longitudinalEvidenceCount: 0,
    marcosAplicados: [{ framework: "EPVSA", elementCount: 4 }],
    tensionesEstructurales: ["Brecha socioeconómica norte-sur"],
    conflictos: [],
    tensionesEscaladas: [{ descripcion: "Tensión salud mental", clasificacion: "escalada", criteriosCumplidos: 3 }],
    tensionesNoEscaladas: [],
    ruidoEstructural: [],
    areasDeIntervencion: [
      { id: "ait-1", title: "Salud mental comunitaria", rationale: "Alta prevalencia de malestar emocional.", relatedEvidenceIds: ["ev-1"], cautions: ["Datos limitados a menores de 18 años."] },
      { id: "ait-2", title: "Alimentación saludable", rationale: "Baja adherencia dieta mediterránea.", relatedEvidenceIds: ["ev-2"], cautions: [] },
    ],
    conclusiones: authoredChapter("El municipio de Atarfe presenta una situación de salud compleja con necesidades en salud mental y nutrición."),
    cierreInterpretativo: authoredChapter("El diagnóstico presenta limitaciones en la cobertura de datos cualitativos. Las áreas identificadas requieren validación del equipo técnico."),
    priorizacion: basePriorizacion(true),
    priorizacionStatus: "complete",
    generatedAt: "2026-06-28T09:30:00.000Z",
    validatedAt: "2026-06-28T10:00:00.000Z",
    validatedBy: "Técnica de salud pública — DAP Granada-Metro",
    requiresHumanValidation: true,
    ...overrides,
  };
}

const INPUT_ATARFE = {
  psl: basePSL(),
  compiledBy: "Técnica de salud pública — DAP Granada-Metro",
  municipalityName: "Atarfe",
  municipalityProvince: "Granada",
  existingArtifactCount: 0,
};

// ── Tests: validateCompilationPreconditions ───────────────────────────────────

describe("validateCompilationPreconditions", () => {
  it("PSL válido → 0 violaciones", () => {
    const violations = validateCompilationPreconditions(basePSL());
    expect(violations).toHaveLength(0);
  });

  it("G-LHC-1: PSL no validado → violación", () => {
    const v = validateCompilationPreconditions(basePSL({ status: "generated" }));
    expect(v.some((x) => x.gate === "G-LHC-1")).toBe(true);
  });

  it("G-LHC-2 RETIRADO (Paso 4): conclusiones scaffold ya no viola por sí mismo", () => {
    // Art. 16: el cuerpo diagnóstico es compilado y trazable, no autoría de un
    // string de capítulos. La autoría humana se conserva sobre el cierre.
    const v = validateCompilationPreconditions(basePSL({ conclusiones: scaffoldChapter() }));
    expect(v.some((x) => x.gate === "G-LHC-2")).toBe(false);
    expect(v).toHaveLength(0);
  });

  it("G-LHC-3: cierreInterpretativo scaffold → violación", () => {
    const v = validateCompilationPreconditions(basePSL({ cierreInterpretativo: scaffoldChapter() }));
    expect(v.some((x) => x.gate === "G-LHC-3")).toBe(true);
  });

  it("G-LHC-4: priorizacionStatus partial → violación", () => {
    const v = validateCompilationPreconditions(basePSL({ priorizacionStatus: "partial" }));
    expect(v.some((x) => x.gate === "G-LHC-4")).toBe(true);
  });

  it("G-LHC-5: consensoDocumentado false → violación", () => {
    const v = validateCompilationPreconditions(
      basePSL({ priorizacion: basePriorizacion(false), priorizacionStatus: "partial" })
    );
    expect(v.some((x) => x.gate === "G-LHC-5")).toBe(true);
  });

  it("G-LHC-6 RETIRADO (Paso 4): conclusiones vacías ya no violan por sí mismas", () => {
    const v = validateCompilationPreconditions(basePSL({ conclusiones: authoredChapter("   ") }));
    expect(v.some((x) => x.gate === "G-LHC-6")).toBe(false);
    expect(v).toHaveLength(0);
  });

  it("G-LHC-8: 0 átomos y ningún +1 → violación N+1", () => {
    const v = validateCompilationPreconditions(
      basePSL({
        totalEvidenceAtoms: 0,
        complementaryStudyCount: 0,
        assetCount: 0,
        thematicPrioritisationPresent: false,
        priorizacion: {
          ...basePriorizacion(true),
          hasParticipatorySelection: false,
          tematicasSeleccionadasIds: [],
          tematicasSeleccionadasLabels: [],
        },
      })
    );
    expect(v.some((x) => x.gate === "G-LHC-8")).toBe(true);
  });

  it("G-LHC-8: 0 átomos con priorización ciudadana → sin violación N+1 (Zagra)", () => {
    const v = validateCompilationPreconditions(
      basePSL({
        totalEvidenceAtoms: 0,
        complementaryStudyCount: 0,
        assetCount: 0,
        thematicPrioritisationPresent: true,
      })
    );
    expect(v.some((x) => x.gate === "G-LHC-8")).toBe(false);
  });

  it("G-LHC-8: átomos > 0 de origen no elegible y ningún +1 → violación N+1", () => {
    // Art. 7 bis A: el bloqueo depende de la PRESENCIA de un +1 válido, no del
    // recuento de átomos. Un expediente con átomos de un origen no elegible pero
    // sin estudios, activos ni priorización sigue siendo el Informe, no un Perfil.
    const v = validateCompilationPreconditions(
      basePSL({
        totalEvidenceAtoms: 12,
        complementaryStudyCount: 0,
        assetCount: 0,
        thematicPrioritisationPresent: false,
        priorizacion: {
          ...basePriorizacion(true),
          hasParticipatorySelection: false,
          tematicasSeleccionadasIds: [],
          tematicasSeleccionadasLabels: [],
        },
      })
    );
    expect(v.some((x) => x.gate === "G-LHC-8")).toBe(true);
  });

  it("G-LHC-7: cierreInterpretativo vacío → violación", () => {
    const v = validateCompilationPreconditions(basePSL({ cierreInterpretativo: authoredChapter("  ") }));
    expect(v.some((x) => x.gate === "G-LHC-7")).toBe(true);
  });

  it("múltiples violaciones → todas reportadas", () => {
    const psl = basePSL({
      status: "generated",
      conclusiones: scaffoldChapter(),
      cierreInterpretativo: scaffoldChapter(),
      priorizacionStatus: "scaffold",
      priorizacion: basePriorizacion(false),
    });
    const v = validateCompilationPreconditions(psl);
    expect(v.length).toBeGreaterThanOrEqual(4);
  });
});

// ── Tests: computePSLHash ─────────────────────────────────────────────────────

describe("computePSLHash", () => {
  it("mismo PSL → mismo hash (determinismo)", () => {
    const psl = basePSL();
    expect(computePSLHash(psl)).toBe(computePSLHash(psl));
  });

  it("dos instancias idénticas → mismo hash", () => {
    const a = basePSL();
    const b = basePSL();
    expect(computePSLHash(a)).toBe(computePSLHash(b));
  });

  it("PSL con conclusiones distintas → hash distinto", () => {
    const a = basePSL({ conclusiones: authoredChapter("Texto A") });
    const b = basePSL({ conclusiones: authoredChapter("Texto B") });
    expect(computePSLHash(a)).not.toBe(computePSLHash(b));
  });

  it("hash tiene formato psl-{8hex}", () => {
    const hash = computePSLHash(basePSL());
    expect(hash).toMatch(/^psl-[0-9a-f]{8}$/);
  });

  it("PSL con evidenceStoreVersion distinto → hash distinto", () => {
    const a = basePSL({ evidenceStoreVersion: "2026-06-28T09:00:00.000Z" });
    const b = basePSL({ evidenceStoreVersion: "2026-06-28T11:00:00.000Z" });
    expect(computePSLHash(a)).not.toBe(computePSLHash(b));
  });
});

// ── Tests: compileLocalHealthProfile ─────────────────────────────────────────

describe("compileLocalHealthProfile — compilación correcta", () => {
  it("compila con éxito el caso canónico de Atarfe", () => {
    const result = compileLocalHealthProfile(INPUT_ATARFE);
    expect(result.ok).toBe(true);
  });

  it("el artefacto tiene isCongealed: true", () => {
    const result = compileLocalHealthProfile(INPUT_ATARFE);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.artifact.isCongealed).toBe(true);
  });

  it("el artefacto tiene un id UUID propio distinto del PSL id", () => {
    const result = compileLocalHealthProfile(INPUT_ATARFE);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.artifact.id).not.toBe(INPUT_ATARFE.psl.id);
      expect(result.artifact.id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
      );
    }
  });

  it("trazabilidad: sourcePSLId apunta al PSL origen", () => {
    const result = compileLocalHealthProfile(INPUT_ATARFE);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.artifact.sourcePSLId).toBe(INPUT_ATARFE.psl.id);
  });

  it("trazabilidad: sourceHash está presente y tiene formato correcto", () => {
    const result = compileLocalHealthProfile(INPUT_ATARFE);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.artifact.sourceHash).toMatch(/^psl-[0-9a-f]{8}$/);
  });

  it("trazabilidad: evidenceAtomIds captura todos los IDs del PSL", () => {
    const result = compileLocalHealthProfile(INPUT_ATARFE);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.artifact.evidenceAtomIds).toEqual(INPUT_ATARFE.psl.evidenceAtomIds);
    }
  });

  it("portada tiene municipalityName y province correctos", () => {
    const result = compileLocalHealthProfile(INPUT_ATARFE);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.artifact.portada.municipalityName).toBe("Atarfe");
      expect(result.artifact.portada.municipalityProvince).toBe("Granada");
    }
  });

  it("versioning: primer artefacto → PSL-C/v1", () => {
    const result = compileLocalHealthProfile({ ...INPUT_ATARFE, existingArtifactCount: 0 });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.artifact.artifactVersion).toBe("PSL-C/v1");
  });

  it("versioning: segundo artefacto → PSL-C/v2", () => {
    const result = compileLocalHealthProfile({ ...INPUT_ATARFE, existingArtifactCount: 1 });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.artifact.artifactVersion).toBe("PSL-C/v2");
  });

  it("conclusiones del artefacto coinciden con las del PSL origen", () => {
    const result = compileLocalHealthProfile(INPUT_ATARFE);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.artifact.conclusiones.content).toBe(
        INPUT_ATARFE.psl.conclusiones.content
      );
    }
  });

  it("cierreInterpretativo del artefacto coincide con el del PSL origen", () => {
    const result = compileLocalHealthProfile(INPUT_ATARFE);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.artifact.cierreInterpretativo.content).toBe(
        INPUT_ATARFE.psl.cierreInterpretativo.content
      );
    }
  });

  it("áreas de intervención: incluye título y rationale, no IDs internos", () => {
    const result = compileLocalHealthProfile(INPUT_ATARFE);
    expect(result.ok).toBe(true);
    if (result.ok) {
      const areas = result.artifact.lecturaTerritorial.areasDeIntervencion;
      expect(areas).toHaveLength(2);
      expect(areas[0].title).toBe("Salud mental comunitaria");
      expect(areas[0].rationale).toBeTruthy();
      // No hay IDs internos en las áreas del artefacto
      expect("id" in areas[0]).toBe(false);
      expect("relatedEvidenceIds" in areas[0]).toBe(false);
    }
  });

  it("candidaturas técnicas: incluye título y rationale, no IDs internos", () => {
    const result = compileLocalHealthProfile(INPUT_ATARFE);
    expect(result.ok).toBe(true);
    if (result.ok) {
      const candidaturas = result.artifact.priorizacion.candidaturasTecnicas;
      expect(candidaturas).toHaveLength(1);
      expect(candidaturas[0].title).toBe("Salud mental");
      expect("id" in candidaturas[0]).toBe(false);
      expect("relatedEvidenceIds" in candidaturas[0]).toBe(false);
    }
  });

  it("baseDocumental: los trece flags de estudios complementarios reflejan el PSL origen", () => {
    const psl = basePSL({
      sf12Present: true, suenoPresent: true, cagePresent: true,
      auditcPresent: true, ipaqPresent: true, ghq12Present: true,
      phq9Present: true, psqiPresent: true, fagerstromPresent: true, sbqPresent: true,
      complementaryStudyCount: 13,
    });
    const result = compileLocalHealthProfile({ ...INPUT_ATARFE, psl });
    expect(result.ok).toBe(true);
    if (result.ok) {
      const bd = result.artifact.baseDocumental;
      expect(bd.ibsePresent).toBe(true);
      expect(bd.dukePresent).toBe(true);
      expect(bd.predimedPresent).toBe(true);
      expect(bd.sf12Present).toBe(true);
      expect(bd.suenoPresent).toBe(true);
      expect(bd.cagePresent).toBe(true);
      expect(bd.auditcPresent).toBe(true);
      expect(bd.ipaqPresent).toBe(true);
      expect(bd.ghq12Present).toBe(true);
      expect(bd.phq9Present).toBe(true);
      expect(bd.psqiPresent).toBe(true);
      expect(bd.fagerstromPresent).toBe(true);
      expect(bd.sbqPresent).toBe(true);
      expect(bd.complementaryStudyCount).toBe(13);
    }
  });

  it("baseDocumental: flags ausentes se propagan como false/undefined al artefacto", () => {
    const result = compileLocalHealthProfile(INPUT_ATARFE);
    expect(result.ok).toBe(true);
    if (result.ok) {
      const bd = result.artifact.baseDocumental;
      expect(bd.sf12Present).toBe(false);
      expect(bd.suenoPresent).toBe(false);
      expect(bd.cagePresent).toBe(false);
      expect(bd.auditcPresent).toBeUndefined();
      expect(bd.ghq12Present).toBeUndefined();
      expect(bd.sbqPresent).toBeUndefined();
    }
  });

  it("informeSalud: referencia al documento, no el contenido", () => {
    const result = compileLocalHealthProfile(INPUT_ATARFE);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.artifact.informeSalud.documentId).toBe("doc-informe-salud");
      expect(result.artifact.informeSalud.title).toBe("Informe de Salud de Atarfe 2025");
    }
  });

  it("cautelas metodológicas incluyen la nota institucional fija", () => {
    const result = compileLocalHealthProfile(INPUT_ATARFE);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.artifact.cautelasMetodologicas.nota).toContain("COMPÁS NG");
      expect(result.artifact.cautelasMetodologicas.nota).toContain("validación institucional");
    }
  });

  it("advertencias de integridad se reflejan en el artefacto", () => {
    const result = compileLocalHealthProfile(INPUT_ATARFE);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.artifact.cautelasMetodologicas.integrityWarnings).toBe(2);
      expect(result.artifact.cautelasMetodologicas.hasCautelas).toBe(true);
    }
  });

  it("PSL sin advertencias → hasCautelas: false", () => {
    const psl = basePSL({ integrityWarnings: 0, integrityErrors: 0 });
    const result = compileLocalHealthProfile({ ...INPUT_ATARFE, psl });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.artifact.cautelasMetodologicas.hasCautelas).toBe(false);
  });
});

// ── Tests: casos de error ─────────────────────────────────────────────────────

describe("compileLocalHealthProfile — casos de error", () => {
  it("PSL no validado → ok: false", () => {
    const result = compileLocalHealthProfile({
      ...INPUT_ATARFE,
      psl: basePSL({ status: "generated" }),
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.violations.some((v) => v.gate === "G-LHC-1")).toBe(true);
    }
  });

  it("conclusiones scaffold → ok: true (Paso 4: cuerpo compilado, sin gate de autoría)", () => {
    // Sin diagnosticAnswers no hay documento canónico ni gate estructural; el
    // cuerpo diagnóstico ya no exige autoría (G-LHC-2/6 retirados).
    const result = compileLocalHealthProfile({
      ...INPUT_ATARFE,
      psl: basePSL({ conclusiones: scaffoldChapter() }),
    });
    expect(result.ok).toBe(true);
  });

  it("N+1: 0 átomos y ningún +1 → ok: false con violación G-LHC-8", () => {
    const result = compileLocalHealthProfile({
      ...INPUT_ATARFE,
      psl: basePSL({
        totalEvidenceAtoms: 0,
        complementaryStudyCount: 0,
        assetCount: 0,
        thematicPrioritisationPresent: false,
        priorizacion: {
          ...basePriorizacion(true),
          hasParticipatorySelection: false,
          tematicasSeleccionadasIds: [],
          tematicasSeleccionadasLabels: [],
        },
      }),
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.violations.some((v) => v.gate === "G-LHC-8")).toBe(true);
    }
  });

  it("priorizacion incompleta → ok: false", () => {
    const result = compileLocalHealthProfile({
      ...INPUT_ATARFE,
      psl: basePSL({
        priorizacionStatus: "partial",
        priorizacion: basePriorizacion(false),
      }),
    });
    expect(result.ok).toBe(false);
  });

  it("resultado de error nunca contiene artifact", () => {
    const result = compileLocalHealthProfile({
      ...INPUT_ATARFE,
      psl: basePSL({ status: "generated" }),
    });
    expect(result.ok).toBe(false);
    expect("artifact" in result).toBe(false);
  });
});

// ── Tests: inmutabilidad ──────────────────────────────────────────────────────

describe("inmutabilidad del artefacto", () => {
  it("el PSL origen no se modifica tras la compilación", () => {
    const psl = basePSL();
    const conclusionesAntes = psl.conclusiones.content;
    compileLocalHealthProfile(INPUT_ATARFE);
    expect(psl.conclusiones.content).toBe(conclusionesAntes);
    expect(psl.status).toBe("validated");
  });

  it("las evidenceAtomIds del artefacto son copia, no referencia", () => {
    const psl = basePSL();
    const result = compileLocalHealthProfile({ ...INPUT_ATARFE, psl });
    expect(result.ok).toBe(true);
    if (result.ok) {
      const artifactIds = result.artifact.evidenceAtomIds;
      psl.evidenceAtomIds.push("ev-extra");
      expect(artifactIds).not.toContain("ev-extra");
    }
  });

  it("dos compilaciones del mismo PSL producen artefactos distintos", () => {
    const r1 = compileLocalHealthProfile({ ...INPUT_ATARFE, existingArtifactCount: 0 });
    const r2 = compileLocalHealthProfile({ ...INPUT_ATARFE, existingArtifactCount: 1 });
    expect(r1.ok).toBe(true);
    expect(r2.ok).toBe(true);
    if (r1.ok && r2.ok) {
      expect(r1.artifact.id).not.toBe(r2.artifact.id);
      expect(r1.artifact.artifactVersion).toBe("PSL-C/v1");
      expect(r2.artifact.artifactVersion).toBe("PSL-C/v2");
      // El hash es el mismo (mismo PSL origen)
      expect(r1.artifact.sourceHash).toBe(r2.artifact.sourceHash);
    }
  });

  it("compilación repetida: el hash del PSL no cambia entre ejecuciones", () => {
    const psl = basePSL();
    const h1 = computePSLHash(psl);
    const h2 = computePSLHash(psl);
    const h3 = computePSLHash(psl);
    expect(h1).toBe(h2);
    expect(h2).toBe(h3);
  });
});

// ── Tests: trazabilidad completa ──────────────────────────────────────────────

describe("trazabilidad completa", () => {
  it("notaValidacion contiene todos los campos de trazabilidad requeridos", () => {
    const result = compileLocalHealthProfile(INPUT_ATARFE);
    expect(result.ok).toBe(true);
    if (result.ok) {
      const nota = result.artifact.notaValidacion;
      expect(nota.sourcePSLId).toBe(INPUT_ATARFE.psl.id);
      expect(nota.sourceHash).toBeTruthy();
      expect(nota.compiledAt).toBeTruthy();
      expect(nota.compiledBy).toBe(INPUT_ATARFE.compiledBy);
      expect(nota.pslValidatedAt).toBe(INPUT_ATARFE.psl.validatedAt);
      expect(nota.pslValidatedBy).toBe(INPUT_ATARFE.psl.validatedBy);
    }
  });

  it("sourcePSLVersion y sourcePSLEvidenceStoreVersion coinciden con el PSL origen", () => {
    const result = compileLocalHealthProfile(INPUT_ATARFE);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.artifact.sourcePSLVersion).toBe(INPUT_ATARFE.psl.version);
      expect(result.artifact.sourcePSLEvidenceStoreVersion).toBe(
        INPUT_ATARFE.psl.evidenceStoreVersion
      );
    }
  });

  it("municipalityId del artefacto coincide con el del PSL origen", () => {
    const result = compileLocalHealthProfile(INPUT_ATARFE);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.artifact.municipalityId).toBe(INPUT_ATARFE.psl.municipalityId);
    }
  });

  it("el artefacto puede detectar si el PSL origen cambió (hash distinto)", () => {
    const r1 = compileLocalHealthProfile(INPUT_ATARFE);
    const pslModificado = basePSL({
      conclusiones: authoredChapter("Texto de conclusiones MODIFICADO por el equipo."),
    });
    const r2 = compileLocalHealthProfile({ ...INPUT_ATARFE, psl: pslModificado });
    expect(r1.ok).toBe(true);
    expect(r2.ok).toBe(true);
    if (r1.ok && r2.ok) {
      expect(r1.artifact.sourceHash).not.toBe(r2.artifact.sourceHash);
    }
  });
});

// ── Tests: puente PerfilLocalDeSalud → PSL-C ─────────────────────────────────

function basePerfil(overrides: Partial<PerfilLocalDeSalud> = {}): PerfilLocalDeSalud {
  return {
    id: "perfil-atarfe-001",
    municipalityId: "atarfe",
    interpretaciones: [],
    hipotesis: [],
    preguntasAbiertas: [],
    createdAt: "2026-07-07T08:00:00.000Z",
    updatedAt: "2026-07-07T08:00:00.000Z",
    ...overrides,
  };
}

describe("compileLocalHealthProfile — con PerfilLocalDeSalud", () => {
  it("con perfil: el artefacto contiene ekcSnapshot no nulo", () => {
    const result = compileLocalHealthProfile({ ...INPUT_ATARFE, perfil: basePerfil() });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.artifact.ekcSnapshot).not.toBeNull();
  });

  it("con perfil: ekcSnapshot refleja las hipótesis activas del perfil", () => {
    const perfil = basePerfil({
      hipotesis: [
        {
          id: "hip-1",
          municipalityId: "atarfe",
          espacio: "situacion-salud",
          enunciado: "Hipótesis de prueba.",
          plausibilidad: "alta",
          indicios: ["indicio-1"],
          preguntasResolutoras: [],
          autorNombre: "Técnica X",
          formuladaEn: "2026-07-07T08:00:00.000Z",
          status: "activa",
        },
      ],
    });
    const result = compileLocalHealthProfile({ ...INPUT_ATARFE, perfil });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.artifact.ekcSnapshot?.hipotesisActivas).toBe(1);
  });

  it("con perfil: hipotesisActivas contiene sólo hipótesis con status activa", () => {
    const perfil = basePerfil({
      hipotesis: [
        {
          id: "hip-1",
          municipalityId: "atarfe",
          espacio: "determinantes",
          enunciado: "Hipótesis activa.",
          plausibilidad: "moderada",
          indicios: [],
          preguntasResolutoras: [],
          autorNombre: "Técnica X",
          formuladaEn: "2026-07-07T08:00:00.000Z",
          status: "activa",
        },
        {
          id: "hip-2",
          municipalityId: "atarfe",
          espacio: "determinantes",
          enunciado: "Hipótesis descartada.",
          plausibilidad: "especulativa",
          indicios: [],
          preguntasResolutoras: [],
          autorNombre: "Técnica X",
          formuladaEn: "2026-07-07T08:00:00.000Z",
          status: "descartada",
          discardedMotivo: "Sin evidencia.",
        },
      ],
    });
    const result = compileLocalHealthProfile({ ...INPUT_ATARFE, perfil });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.artifact.hipotesisActivas).toHaveLength(1);
      expect(result.artifact.hipotesisActivas[0].enunciado).toBe("Hipótesis activa.");
    }
  });

  it("con perfil: preguntasAbiertas contiene sólo preguntas con status abierta", () => {
    const perfil = basePerfil({
      preguntasAbiertas: [
        {
          id: "pq-1",
          municipalityId: "atarfe",
          espacio: "desigualdades",
          formulacion: "¿Cuál es la prevalencia real?",
          relevancia: "Determina la prioridad de intervención.",
          urgencia: "alta",
          viasResolucion: ["encuesta"],
          creadaEn: "2026-07-07T08:00:00.000Z",
          status: "abierta",
        },
        {
          id: "pq-2",
          municipalityId: "atarfe",
          espacio: "activos",
          formulacion: "Pregunta ya resuelta.",
          relevancia: "Relevancia resuelta.",
          urgencia: "baja",
          viasResolucion: [],
          creadaEn: "2026-07-07T08:00:00.000Z",
          status: "resuelta",
          resolucionNota: "Se respondió con datos IBSE.",
        },
      ],
    });
    const result = compileLocalHealthProfile({ ...INPUT_ATARFE, perfil });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.artifact.preguntasAbiertas).toHaveLength(1);
      expect(result.artifact.preguntasAbiertas[0].formulacion).toBe("¿Cuál es la prevalencia real?");
    }
  });

  it("con perfil: generatedFromPerfilId coincide con perfil.id", () => {
    const perfil = basePerfil();
    const result = compileLocalHealthProfile({ ...INPUT_ATARFE, perfil });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.artifact.generatedFromPerfilId).toBe(perfil.id);
  });

  it("sin perfil: ekcSnapshot es null", () => {
    const result = compileLocalHealthProfile(INPUT_ATARFE);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.artifact.ekcSnapshot).toBeNull();
  });

  it("sin perfil: hipotesisActivas es array vacío", () => {
    const result = compileLocalHealthProfile(INPUT_ATARFE);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.artifact.hipotesisActivas).toHaveLength(0);
  });

  it("sin perfil: preguntasAbiertas es array vacío", () => {
    const result = compileLocalHealthProfile(INPUT_ATARFE);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.artifact.preguntasAbiertas).toHaveLength(0);
  });

  it("sin perfil: generatedFromPerfilId es null", () => {
    const result = compileLocalHealthProfile(INPUT_ATARFE);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.artifact.generatedFromPerfilId).toBeNull();
  });
});

// ── Fixture Zagra coherente (Paso 4) ──────────────────────────────────────────
// Informe de Salud realmente presente en el workspace y en DiagnosticAnswers,
// preservado SIN EvidenceAtoms (Art. 7 bis §3), priorización ciudadana presente,
// evidenceStore vacío (0 átomos). No reutiliza basePSL(Atarfe): PSL propio con
// campos concordantes.

const ZAGRA_INFORME_TEXTO =
  "El Informe de Salud de Zagra describe la situación de salud del municipio: " +
  "demografía, mortalidad y morbilidad principales. Se preserva íntegro como " +
  "documento y no se atomiza en el flujo de evidencia.";

function zagraHealthReport(): HealthReportDocument {
  return {
    id: "hr-zagra",
    municipalityId: "zagra",
    linkedDocumentId: "doc-informe-zagra",
    sourceFileName: "informe-salud-zagra.pdf",
    title: "Informe de Salud de Zagra 2025",
    authors: [],
    body: {
      originalText: ZAGRA_INFORME_TEXTO,
      format: "plain",
      charCount: ZAGRA_INFORME_TEXTO.length, // coherente con el texto real
      isAuthoritative: true,
    },
    sections: [
      {
        key: "demografia",
        title: "Demografía",
        bodyText: "Estructura y evolución de la población de Zagra.",
        sortOrder: 1,
        isAuthoritative: true,
      },
      {
        key: "mortalidad",
        title: "Mortalidad",
        bodyText: "Principales causas de mortalidad a escala municipal.",
        sortOrder: 2,
        isAuthoritative: true,
      },
    ],
    createdAt: "2026-07-01T00:00:00.000Z",
    updatedAt: "2026-07-01T00:00:00.000Z",
  };
}

/** Workspace Zagra: Informe presente, priorización ciudadana, 0 átomos. */
function zagraWorkspace(): MunicipalityWorkspace {
  const municipality = createMunicipalityContext({
    id: "zagra",
    name: "Zagra",
    province: "Granada",
  });
  const base = createMunicipalityWorkspace(
    municipality,
    createMunicipalDocumentRepository({ municipalityId: "zagra" }),
    createEvidenceStore("zagra") // evidenceStore vacío: el Informe NO atomiza
  );
  return {
    ...base,
    healthReport: zagraHealthReport(),
    thematicPrioritisation: createThematicPrioritisation("zagra", [
      "bienestar-emocional",
      "envejecimiento-activo",
    ]),
  };
}

function zagraDiagnosticAnswers(): DiagnosticAnswers {
  return buildDiagnosticAnswers({
    workspace: zagraWorkspace(),
    determinantTitles: [],
    assets: [],
  });
}

/** DiagnosticAnswers de Zagra CON activos reales (los mismos que el flujo de App
 *  deriva de los átomos `kind === "asset"`). */
function zagraAnswersWithAssets(
  assets: Array<{ title: string; content: string }>
): DiagnosticAnswers {
  return buildDiagnosticAnswers({
    workspace: zagraWorkspace(),
    determinantTitles: [],
    assets,
  });
}

function zagraPrioritizacion(): PSLPriorizacion {
  return {
    candidaturasTecnicas: [],
    hasTechnicalCandidatures: false,
    tematicasSeleccionadasIds: ["bienestar-emocional", "envejecimiento-activo"],
    tematicasSeleccionadasLabels: ["Bienestar Emocional", "Envejecimiento Activo"],
    hasParticipatorySelection: true, // priorización ciudadana = el +1
    deliberacionNota: "El Grupo Motor de Zagra deliberó y documentó consenso.",
    consensoDocumentado: true,
  };
}

/** PSL Zagra dedicado y coherente (no derivado de basePSL/Atarfe). */
function zagraPSL(overrides: Partial<LocalHealthProfile> = {}): LocalHealthProfile {
  return {
    id: "psl-zagra-001",
    municipalityId: "zagra",
    status: "validated",
    version: "2026-07-01T10:00:00.000Z",
    evidenceStoreVersion: "2026-07-01T09:00:00.000Z",
    strategicFrameworkSectionIds: [],
    healthReportDocumentId: "doc-informe-zagra",
    healthReportTitle: "Informe de Salud de Zagra 2025",
    healthReportSectionCount: 2,
    healthReportAtomCount: 0, // el Informe NO atomiza
    totalEvidenceAtoms: 0, // 0 átomos
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
    thematicPrioritisationPresent: true, // priorización ciudadana presente
    complementaryStudyCount: 0,
    territorialSummary:
      "Zagra: Informe de Salud y priorización ciudadana, sin evidencia atomizada.",
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
    conclusiones: authoredChapter("Zagra: cuerpo diagnóstico compilado y trazable."),
    cierreInterpretativo: authoredChapter(
      "Cierre interpretativo del equipo técnico de Zagra: alcance y limitaciones del diagnóstico."
    ),
    priorizacion: zagraPrioritizacion(),
    priorizacionStatus: "complete",
    generatedAt: "2026-07-01T09:30:00.000Z",
    validatedAt: "2026-07-01T10:00:00.000Z",
    validatedBy: "Técnica de salud pública — Zagra",
    requiresHumanValidation: true,
    ...overrides,
  };
}

function zagraContext(over: Partial<PSLCReadingContext> = {}): PSLCReadingContext {
  return {
    totalEvidenceAtoms: 0,
    complementaryStudyCount: 0,
    assetCount: 0,
    hasParticipatoryPrioritisation: true,
    prioritizacion: zagraPrioritizacion(),
    ...over,
  };
}

const ZAGRA_COMPILE_INPUT = () => ({
  psl: zagraPSL(),
  compiledBy: "Técnica de salud pública — Zagra",
  municipalityName: "Zagra",
  municipalityProvince: "Granada",
  existingArtifactCount: 0,
  diagnosticAnswers: zagraDiagnosticAnswers(),
});

// ── Tests: Paso 4 — readingStatus, N+1 y coherencia ───────────────────────────

describe("compileLocalHealthProfile — Paso 4 readingStatus / N+1 / coherencia", () => {
  it("Informe + priorización + 0 átomos → pending, sin lecturas fabricadas", () => {
    const result = compileLocalHealthProfile(ZAGRA_COMPILE_INPUT());
    expect(result.ok).toBe(true);
    if (result.ok) {
      const sealed = result.artifact.canonicalDocument;
      expect(sealed).toBeDefined();
      const doc = sealed ? readSealedCanonicalDocument(sealed) : null;
      expect(doc?.editorialView.readingStatus).toBe("prioritization-pending");
      // No se fabrica lectura: territorialReadings queda vacío en la copia canónica.
      expect(doc?.editorialView.territorialReadings).toHaveLength(0);
      // Documento digno: cabecera, bloques de fuente y cierre presentes.
      expect(doc?.editorialView.header.title.trim().length).toBeGreaterThan(0);
      expect(doc?.editorialView.sourceBlocks.length).toBeGreaterThan(0);
      expect(doc?.editorialView.closing.length).toBeGreaterThan(0);
      // El Informe está presente en la procedencia sin haberse atomizado.
      expect(doc?.provenance.diagnosticAnswersSnapshot.healthReport.present).toBe(true);
    }
  });

  it("Informe solo (sin ningún +1) → G-LHC-8, no compila", () => {
    const psl = zagraPSL({
      thematicPrioritisationPresent: false,
      priorizacion: {
        ...zagraPrioritizacion(),
        hasParticipatorySelection: false,
        tematicasSeleccionadasIds: [],
        tematicasSeleccionadasLabels: [],
      },
    });
    const result = compileLocalHealthProfile({
      ...ZAGRA_COMPILE_INPUT(),
      psl,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.violations.some((v) => v.gate === "G-LHC-8")).toBe(true);
    }
  });

  it("evidencia no elegible sin ningún +1 → G-LHC-8 (bloqueo por presencia, no por átomos)", () => {
    const psl = zagraPSL({
      totalEvidenceAtoms: 9, // átomos de un origen no elegible
      thematicPrioritisationPresent: false,
      priorizacion: {
        ...zagraPrioritizacion(),
        hasParticipatorySelection: false,
        tematicasSeleccionadasIds: [],
        tematicasSeleccionadasLabels: [],
      },
    });
    const result = compileLocalHealthProfile({ ...ZAGRA_COMPILE_INPUT(), psl });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.violations.some((v) => v.gate === "G-LHC-8")).toBe(true);
    }
  });

  it("Informe + activos atomizados REALES, sin estudios → integrated", () => {
    // Activo real y concordante en los answers (no solo contadores): el bloque de
    // fuentes lo declara, el contexto tiene assetCount/átomos concordantes y el
    // builder produce hilos → readingStatus integrated.
    const answers = zagraAnswersWithAssets([
      {
        title: "Asociación de personas mayores La Solana",
        content: "Grupo comunitario de personas mayores del municipio.",
      },
    ]);
    expect(answers.salutogenica.totalAssets).toBeGreaterThan(0);
    const doc = buildPSLCCanonicalDocument({
      answers,
      territory: "Zagra",
      status: "validated",
      generatedAtISO: "2026-07-01T09:30:00.000Z",
      pslContext: zagraContext({ totalEvidenceAtoms: 1, assetCount: 1 }),
    });
    // El bloque de fuentes «activos» declara el recurso real.
    const activos = doc.editorialView.sourceBlocks.find((b) => b.id === "activos");
    expect(activos?.whatItAdds).toContain("1 recurso");
    expect(doc.editorialView.territorialReadings.length).toBeGreaterThan(0);
    expect(doc.editorialView.readingStatus).toBe("integrated");
  });

  it("contexto declara activos pero answers sin activos → pending (sin respaldo real)", () => {
    const doc = buildPSLCCanonicalDocument({
      answers: zagraDiagnosticAnswers(), // salutogenica.totalAssets === 0
      territory: "Zagra",
      status: "validated",
      generatedAtISO: "2026-07-01T09:30:00.000Z",
      pslContext: zagraContext({ totalEvidenceAtoms: 3, assetCount: 3 }), // contador sin respaldo
    });
    expect(doc.editorialView.readingStatus).toBe("prioritization-pending");
    expect(doc.editorialView.territorialReadings).toHaveLength(0);
  });

  it("priorización + átomo no elegible (sin estudios ni activos reales) → pending y 0 hilos", () => {
    const doc = buildPSLCCanonicalDocument({
      answers: zagraDiagnosticAnswers(),
      territory: "Zagra",
      status: "validated",
      generatedAtISO: "2026-07-01T09:30:00.000Z",
      pslContext: zagraContext({ totalEvidenceAtoms: 5 }), // átomos de origen no elegible
    });
    expect(doc.editorialView.readingStatus).toBe("prioritization-pending");
    expect(doc.editorialView.territorialReadings).toHaveLength(0);
  });

  it("provenance sella la instantánea de priorización; entra en el canonicalHash", () => {
    const doc = buildPSLCCanonicalDocument({
      answers: zagraDiagnosticAnswers(),
      territory: "Zagra",
      status: "validated",
      generatedAtISO: "2026-07-01T09:30:00.000Z",
      pslContext: zagraContext(),
    });
    // Presente y con la priorización de Zagra.
    expect(doc.provenance.prioritizationSnapshot.tematicasSeleccionadasLabels).toEqual([
      "Bienestar Emocional",
      "Envejecimiento Activo",
    ]);
    expect(doc.provenance.prioritizationSnapshot.hasParticipatorySelection).toBe(true);
    // El snapshot entra en el payload y en el hash.
    const sealed = sealCanonicalDocument(doc);
    expect(sealed.payload).toContain("Envejecimiento Activo");
    expect(sealed.canonicalHash).toMatch(/^pslc-[0-9a-f]{8}$/);
  });

  it("pantalla viva sin regresión: el builder compartido NO se vacía con 0 átomos", () => {
    // El builder compartido (que alimenta la pantalla viva) conserva su
    // comportamiento: con los mismos answers de Zagra produce hilos de agenda. El
    // vaciado a `territorialReadings: []` ocurre SOLO en la copia canónica.
    const liveView = buildProfileIntegratedEditorialView(zagraDiagnosticAnswers(), {
      territory: "Zagra",
      status: "Validado técnicamente",
      generatedDate: "1 de julio de 2026",
    });
    expect(liveView.territorialReadings.length).toBeGreaterThan(0);

    const canonical = buildPSLCCanonicalDocument({
      answers: zagraDiagnosticAnswers(),
      territory: "Zagra",
      status: "validated",
      generatedAtISO: "2026-07-01T09:30:00.000Z",
      pslContext: zagraContext(), // 0 átomos
    });
    expect(canonical.editorialView.territorialReadings).toHaveLength(0);
  });

  it("mutación posterior de la priorización → snapshot inalterado (detach), y luego sella", () => {
    const prioritizacion = zagraPrioritizacion();
    // 1. Construir el documento canónico SIN sellar todavía.
    const doc = buildPSLCCanonicalDocument({
      answers: zagraDiagnosticAnswers(),
      territory: "Zagra",
      status: "validated",
      generatedAtISO: "2026-07-01T09:30:00.000Z",
      pslContext: zagraContext({ prioritizacion }),
    });
    // 2. Mutar el objeto `prioritizacion` ORIGINAL después de construir.
    prioritizacion.tematicasSeleccionadasIds.push("intruso");
    prioritizacion.tematicasSeleccionadasLabels.push("Intruso");
    // 3. El snapshot es un clon detach: no refleja la mutación.
    expect(
      doc.provenance.prioritizationSnapshot.tematicasSeleccionadasLabels
    ).not.toContain("Intruso");
    expect(
      doc.provenance.prioritizationSnapshot.tematicasSeleccionadasLabels
    ).toEqual(["Bienestar Emocional", "Envejecimiento Activo"]);
    // 4. Sellar después: el sello tampoco refleja la mutación.
    const sealed = sealCanonicalDocument(doc);
    expect(sealed.payload).not.toContain("Intruso");
  });

  it("priorizaciones distintas (todo lo demás igual) → payload y canonicalHash distintos", () => {
    const common = {
      answers: zagraDiagnosticAnswers(),
      territory: "Zagra",
      status: "validated" as const,
      generatedAtISO: "2026-07-01T09:30:00.000Z",
    };
    const a = sealCanonicalDocument(
      buildPSLCCanonicalDocument({ ...common, pslContext: zagraContext() })
    );
    const b = sealCanonicalDocument(
      buildPSLCCanonicalDocument({
        ...common,
        pslContext: zagraContext({
          prioritizacion: {
            ...zagraPrioritizacion(),
            tematicasSeleccionadasIds: ["otra-tematica"],
            tematicasSeleccionadasLabels: ["Otra Temática"],
          },
        }),
      })
    );
    expect(a.payload).not.toBe(b.payload);
    expect(a.canonicalHash).not.toBe(b.canonicalHash);
  });
});

// ── Tests: G-LHC-9 (estructura, trazabilidad, coherencia, fallback legacy) ─────

describe("validateCompiledBody — G-LHC-9", () => {
  function zagraDoc(over: Partial<PSLCReadingContext> = {}) {
    return buildPSLCCanonicalDocument({
      answers: zagraDiagnosticAnswers(),
      territory: "Zagra",
      status: "validated",
      generatedAtISO: "2026-07-01T09:30:00.000Z",
      pslContext: zagraContext(over),
    });
  }

  it("documento digno (Zagra pending) → sin violación G-LHC-9", () => {
    const v = validateCompiledBody(zagraDoc(), zagraPSL());
    expect(v).toHaveLength(0);
  });

  it("documento estructuralmente degenerado (sin cierre) → G-LHC-9", () => {
    const doc = zagraDoc();
    const degenerate = {
      ...doc,
      editorialView: { ...doc.editorialView, closing: [] },
    };
    const v = validateCompiledBody(degenerate, zagraPSL());
    expect(v.some((x) => x.gate === "G-LHC-9")).toBe(true);
  });

  it("documento sin trazadora de priorización → G-LHC-9", () => {
    const doc = zagraDoc();
    const sinSnapshot = {
      ...doc,
      provenance: { diagnosticAnswersSnapshot: doc.provenance.diagnosticAnswersSnapshot },
    } as typeof doc;
    const v = validateCompiledBody(sinSnapshot, zagraPSL());
    expect(v.some((x) => x.gate === "G-LHC-9")).toBe(true);
  });

  it("incoherencia: prioritization-pending con hilos territoriales → G-LHC-9", () => {
    const doc = zagraDoc();
    const incoherente = {
      ...doc,
      // GOV-SALIDA-01: readingStatus vive en editorialView, no en la raíz.
      editorialView: {
        ...doc.editorialView,
        readingStatus: "prioritization-pending" as const,
        territorialReadings: [
          {
            id: "fabricado",
            title: "Hilo fabricado",
            signal: "x",
            source: "x",
            scale: "x",
            reading: "x",
            mechanism: "x",
            exclusion: "x",
            groupMotorQuestion: "x",
            motorQuestion: "x",
            variant: "informe" as const,
          },
        ],
      },
    };
    const v = validateCompiledBody(incoherente, zagraPSL());
    expect(v.some((x) => x.gate === "G-LHC-9")).toBe(true);
  });

  it("fallback legacy: sin documento canónico y cuerpo vacío → G-LHC-9", () => {
    const v = validateCompiledBody(
      undefined,
      zagraPSL({ conclusiones: authoredChapter("   ") })
    );
    expect(v.some((x) => x.gate === "G-LHC-9")).toBe(true);
  });

  it("fallback legacy: sin documento canónico y cuerpo con contenido → sin violación", () => {
    const v = validateCompiledBody(
      undefined,
      zagraPSL({ conclusiones: authoredChapter("Cuerpo compilado presente.") })
    );
    expect(v).toHaveLength(0);
  });
});
