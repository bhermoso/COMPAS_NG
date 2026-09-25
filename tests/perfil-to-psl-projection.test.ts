import { describe, it, expect } from "vitest";
import { populatePSLFromPerfil } from "../src/application/health-profile/populatePSLFromPerfil";
import type { LocalHealthProfile } from "../src/domain/health-profile";
import type { PerfilLocalDeSalud } from "../src/domain/health-profile";

// ── Fixtures ──────────────────────────────────────────────────────────────────

function basePSL(overrides: Partial<LocalHealthProfile> = {}): LocalHealthProfile {
  return {
    id: "psl-test-001",
    municipalityId: "atarfe",
    status: "validated",
    version: "2026-07-07T10:00:00.000Z",
    evidenceStoreVersion: "2026-07-07T09:00:00.000Z",
    strategicFrameworkSectionIds: [],
    healthReportSectionCount: 0,
    healthReportAtomCount: 0,
    totalEvidenceAtoms: 0,
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
    conclusiones: {
      content: "Orientación técnica del sistema.",
      status: "scaffold",
      authorshipNote: "Requiere autoría humana.",
    },
    cierreInterpretativo: {
      content: "Texto scaffold del cierre.",
      status: "scaffold",
      authorshipNote: "Requiere autoría humana.",
    },
    priorizacion: {
      candidaturasTecnicas: [],
      hasTechnicalCandidatures: false,
      tematicasSeleccionadasIds: [],
      tematicasSeleccionadasLabels: [],
      hasParticipatorySelection: false,
      deliberacionNota: "Pendiente.",
      consensoDocumentado: false,
    },
    priorizacionStatus: "scaffold",
    generatedAt: "2026-07-07T09:30:00.000Z",
    requiresHumanValidation: true,
    ...overrides,
  };
}

function basePerfil(overrides: Partial<PerfilLocalDeSalud> = {}): PerfilLocalDeSalud {
  return {
    id: "perfil-test-001",
    municipalityId: "atarfe",
    interpretaciones: [],
    hipotesis: [],
    preguntasAbiertas: [],
    createdAt: "2026-07-07T08:00:00.000Z",
    updatedAt: "2026-07-07T08:00:00.000Z",
    ...overrides,
  };
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("populatePSLFromPerfil — proyección de síntesis", () => {
  it("copia sintesisTexto a conclusiones.content", () => {
    const psl = basePSL();
    const perfil = basePerfil({ sintesisTexto: "Síntesis técnica elaborada por el equipo." });
    const resultado = populatePSLFromPerfil(psl, perfil);
    expect(resultado.conclusiones.content).toBe("Síntesis técnica elaborada por el equipo.");
  });

  it("marca conclusiones como authored", () => {
    const psl = basePSL();
    const perfil = basePerfil({ sintesisTexto: "Texto de síntesis." });
    const resultado = populatePSLFromPerfil(psl, perfil);
    expect(resultado.conclusiones.status).toBe("authored");
  });

  it("no modifica conclusiones si sintesisTexto está ausente", () => {
    const psl = basePSL();
    const perfil = basePerfil(); // sin sintesisTexto
    const resultado = populatePSLFromPerfil(psl, perfil);
    expect(resultado.conclusiones.content).toBe("Orientación técnica del sistema.");
    expect(resultado.conclusiones.status).toBe("scaffold");
  });

  it("no modifica conclusiones si sintesisTexto es cadena vacía", () => {
    const psl = basePSL();
    const perfil = basePerfil({ sintesisTexto: "" });
    const resultado = populatePSLFromPerfil(psl, perfil);
    expect(resultado.conclusiones.status).toBe("scaffold");
  });

  it("no modifica conclusiones si sintesisTexto es sólo espacios", () => {
    const psl = basePSL();
    const perfil = basePerfil({ sintesisTexto: "   " });
    const resultado = populatePSLFromPerfil(psl, perfil);
    expect(resultado.conclusiones.status).toBe("scaffold");
  });

  it("no modifica cierreInterpretativo", () => {
    const psl = basePSL();
    const perfil = basePerfil({ sintesisTexto: "Síntesis técnica." });
    const resultado = populatePSLFromPerfil(psl, perfil);
    expect(resultado.cierreInterpretativo.content).toBe("Texto scaffold del cierre.");
    expect(resultado.cierreInterpretativo.status).toBe("scaffold");
  });

  it("no modifica priorizacion", () => {
    const psl = basePSL();
    const perfil = basePerfil({ sintesisTexto: "Síntesis técnica." });
    const resultado = populatePSLFromPerfil(psl, perfil);
    expect(resultado.priorizacion.consensoDocumentado).toBe(false);
    expect(resultado.priorizacionStatus).toBe("scaffold");
  });

  it("no muta el PSL original", () => {
    const psl = basePSL();
    const contenidoOriginal = psl.conclusiones.content;
    const statusOriginal = psl.conclusiones.status;
    const perfil = basePerfil({ sintesisTexto: "Síntesis que no debe mutar el original." });
    populatePSLFromPerfil(psl, perfil);
    expect(psl.conclusiones.content).toBe(contenidoOriginal);
    expect(psl.conclusiones.status).toBe(statusOriginal);
  });

  it("no muta el Perfil original", () => {
    const psl = basePSL();
    const perfil = basePerfil({ sintesisTexto: "Síntesis técnica." });
    const sintesisOriginal = perfil.sintesisTexto;
    populatePSLFromPerfil(psl, perfil);
    expect(perfil.sintesisTexto).toBe(sintesisOriginal);
  });
});
