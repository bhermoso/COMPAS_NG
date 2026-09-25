import { describe, it, expect } from 'vitest';
import { hasPSLHumanContent } from '../src/application/health-profile';
import type { LocalHealthProfile } from '../src/domain/health-profile';

// ── Fixture mínimo ────────────────────────────────────────────────────────────

function scaffoldChapter() {
  return { content: "Propuesta asistida.", status: "scaffold" as const, authorshipNote: "Requiere autoría humana." };
}

function authoredChapter() {
  return { content: "Texto redactado por el equipo técnico.", status: "authored" as const, authorshipNote: "Requiere autoría humana." };
}

function basePriorizacion() {
  return {
    candidaturasTecnicas: [],
    hasTechnicalCandidatures: false,
    tematicasSeleccionadasIds: [],
    tematicasSeleccionadasLabels: [],
    hasParticipatorySelection: false,
    deliberacionNota: "Pendiente de autoría humana.",
    consensoDocumentado: false,
  };
}

function basePSL(overrides: Partial<LocalHealthProfile> = {}): LocalHealthProfile {
  return {
    id: "test-psl",
    municipalityId: "test",
    status: "validated",
    version: new Date().toISOString(),
    evidenceStoreVersion: new Date().toISOString(),
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
    conclusiones: scaffoldChapter(),
    cierreInterpretativo: scaffoldChapter(),
    priorizacion: basePriorizacion(),
    priorizacionStatus: "scaffold",
    generatedAt: new Date().toISOString(),
    requiresHumanValidation: true,
    ...overrides,
  };
}

// ── Tests ────────────────────────────────────────────────────────────────────

describe('hasPSLHumanContent', () => {
  it('PSL sin contenido humano → false', () => {
    expect(hasPSLHumanContent(basePSL())).toBe(false);
  });

  it('conclusiones authored → true', () => {
    expect(hasPSLHumanContent(basePSL({ conclusiones: authoredChapter() }))).toBe(true);
  });

  it('cierreInterpretativo authored → true', () => {
    expect(hasPSLHumanContent(basePSL({ cierreInterpretativo: authoredChapter() }))).toBe(true);
  });

  it('consensoDocumentado true → true', () => {
    const psl = basePSL({
      priorizacion: { ...basePriorizacion(), consensoDocumentado: true, deliberacionNota: "Acordado." },
      priorizacionStatus: "complete",
    });
    expect(hasPSLHumanContent(psl)).toBe(true);
  });

  it('deliberacionNota no vacía pero consensoDocumentado false → false', () => {
    // La nota de scaffold no es contenido humano confirmado
    const psl = basePSL({
      priorizacion: { ...basePriorizacion(), consensoDocumentado: false, deliberacionNota: "Pendiente de autoría humana." },
    });
    expect(hasPSLHumanContent(psl)).toBe(false);
  });

  it('todos los campos humanos presentes → true', () => {
    const psl = basePSL({
      conclusiones: authoredChapter(),
      cierreInterpretativo: authoredChapter(),
      priorizacion: { ...basePriorizacion(), consensoDocumentado: true, deliberacionNota: "Consenso alcanzado." },
      priorizacionStatus: "complete",
    });
    expect(hasPSLHumanContent(psl)).toBe(true);
  });
});
