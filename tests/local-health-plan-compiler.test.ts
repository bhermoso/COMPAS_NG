import { describe, it, expect } from 'vitest';
import { validateCompilerPreconditions, compileLocalHealthPlan } from '../src/application/local-health-plan-compiler/LocalHealthPlanCompiler';

// Mocks mínimos de los tipos requeridos por el compilador
const basePSL: any = {
  id: 'psl-1',
  municipalityId: 'mun-1',
  version: 'v1',
  evidenceStoreVersion: 'e1',
  status: 'approved',
  conclusiones: { content: 'Conclusiones', status: 'authored' },
  cierreInterpretativo: { content: 'Cierre', status: 'authored' },
  priorizacionStatus: 'complete',
  priorizacion: { consensoDocumentado: true, candidaturasTecnicas: [], deliberacionNota: '', tematicasSeleccionadasIds: [], hasParticipatorySelection: false },
  totalEvidenceAtoms: 0,
  integrityWarnings: 0,
  integrityErrors: 0,
};

const pslcMock: any = {
  id: 'pslc-1',
  sourcePSLId: 'psl-1',
  artifactVersion: 'PSL-C/v1',
  sourceHash: 'psl-hash',
  compiledAt: new Date().toISOString(),
};

const actionPlanMock: any = {
  validationStatus: 'formally-validated',
  objectives: [{ id: 'o1', title: 'Obj 1' }],
  actions: [{ id: 'a1', title: 'Action 1', linkedObjectiveId: 'o1' }],
};

const agendaMock: any = {
  validationStatus: 'formally-validated',
  annualItems: [{ id: 'ag1', linkedActionId: 'a1', suggestedQuarter: 'Q1', responsibleProfile: 'Coord' }],
};

const monitoringMock: any = {
  evaluationFramework: { evaluationQuestions: ['Q1'] },
  trackedItems: [],
};

describe('LocalHealthPlanCompiler basic', () => {
  it('validateCompilerPreconditions returns no violations for a crafted input', () => {
    const violations = validateCompilerPreconditions({
      psl: basePSL,
      pslc: pslcMock,
      actionPlan: actionPlanMock,
      agenda: agendaMock,
      monitoring: monitoringMock,
      municipalityName: 'Test',
      municipalityProvince: 'Prov',
      planningPeriod: { start: '2027-01-01', end: '2030-12-31', label: '2027–2030' },
      existingArtifactCount: 0,
      unaddressedNeeds: [{ id: 'n1', title: 'Need', justification: 'Just' }],
    } as any);

    expect(violations).toHaveLength(0);
  });

  it('compileLocalHealthPlan returns ok and a document', () => {
    const result = compileLocalHealthPlan({
      psl: basePSL,
      pslc: pslcMock,
      actionPlan: actionPlanMock,
      agenda: agendaMock,
      monitoring: monitoringMock,
      municipalityName: 'Test',
      municipalityProvince: 'Prov',
      planningPeriod: { start: '2027-01-01', end: '2030-12-31', label: '2027–2030' },
      compiledBy: 'tester',
      existingArtifactCount: 0,
      unaddressedNeeds: [{ id: 'n1', title: 'Need', justification: 'Just' }],
    } as any);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.document).toBeDefined();
      expect(result.manifest).toBeDefined();
      expect(result.document.isCongealed).toBe(true);
    }
  });
});
