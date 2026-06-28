import { describe, it, expect } from "vitest";
import {
  compileLocalHealthProfile,
  validateCompilationPreconditions,
  computePSLHash,
} from "../src/application/health-profile-compiler";
import type { LocalHealthProfile } from "../src/domain/health-profile";

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
    recomendaciones: authoredChapter("Se recomienda priorizar intervenciones en salud mental comunitaria y promoción de alimentación saludable."),
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

  it("G-LHC-2: conclusiones scaffold → violación", () => {
    const v = validateCompilationPreconditions(basePSL({ conclusiones: scaffoldChapter() }));
    expect(v.some((x) => x.gate === "G-LHC-2")).toBe(true);
  });

  it("G-LHC-3: recomendaciones scaffold → violación", () => {
    const v = validateCompilationPreconditions(basePSL({ recomendaciones: scaffoldChapter() }));
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

  it("G-LHC-6: conclusiones vacías → violación", () => {
    const v = validateCompilationPreconditions(basePSL({ conclusiones: authoredChapter("   ") }));
    expect(v.some((x) => x.gate === "G-LHC-6")).toBe(true);
  });

  it("G-LHC-7: recomendaciones vacías → violación", () => {
    const v = validateCompilationPreconditions(basePSL({ recomendaciones: authoredChapter("  ") }));
    expect(v.some((x) => x.gate === "G-LHC-7")).toBe(true);
  });

  it("múltiples violaciones → todas reportadas", () => {
    const psl = basePSL({
      status: "generated",
      conclusiones: scaffoldChapter(),
      recomendaciones: scaffoldChapter(),
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

  it("recomendaciones del artefacto coinciden con las del PSL origen", () => {
    const result = compileLocalHealthProfile(INPUT_ATARFE);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.artifact.recomendaciones.content).toBe(
        INPUT_ATARFE.psl.recomendaciones.content
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

  it("conclusiones scaffold → ok: false", () => {
    const result = compileLocalHealthProfile({
      ...INPUT_ATARFE,
      psl: basePSL({ conclusiones: scaffoldChapter() }),
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.violations.some((v) => v.gate === "G-LHC-2")).toBe(true);
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
