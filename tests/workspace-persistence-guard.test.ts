/**
 * tests/workspace-persistence-guard.test.ts
 *
 * Test de regresión para la guardia de persistencia del workspace.
 *
 * CAUSA RAÍZ (Intervención 3 — 2026-07-02):
 *   isEmptyWorkspaceForPersistenceGuard() no incluía questionnaireProjects.
 *   Un workspace con SOLO proyectos GES era considerado "vacío" por el guard,
 *   lo que provocaba que el useEffect de guardado omitiera llamar a
 *   saveWorkspaceToLocalStorage(), perdiendo los proyectos silenciosamente.
 *
 * Invariante protegido:
 *   Toda colección opcional de MunicipalityWorkspace que el usuario pueda poblar
 *   debe estar representada en isEmptyWorkspaceForPersistenceGuard(). Si se añade
 *   una nueva colección al workspace, DEBE añadirse también al guard.
 */

import { describe, it, expect } from 'vitest'
import { isEmptyWorkspaceForPersistenceGuard } from '../src/application/workspace'
import { createCompleteMunicipalityWorkspace } from '../src/application/workspace'
import { createQuestionnaire } from '../src/application/questionnaire'
import type { MunicipalityWorkspace } from '../src/domain/workspace'
import type { QuestionnaireProject } from '../src/domain/questionnaire'

// ── Helper ────────────────────────────────────────────────────────────────────

function makeEmptyWorkspace(): MunicipalityWorkspace {
  return createCompleteMunicipalityWorkspace({ id: 'test-mun', name: 'Test' })
}

function makeQuestionnaireProject(id: string): QuestionnaireProject {
  const now = '2026-07-02T08:00:00.000Z'
  return {
    id,
    name: `Encuesta ${id}`,
    status: 'draft',
    questionnaire: createQuestionnaire({ id, name: `Encuesta ${id}`, methodologicalModules: ['ibse'] }),
    requestedOutputs: ['redcap'],
    createdAt: now,
    updatedAt: now,
  }
}

// ══════════════════════════════════════════════════════════════════════════════
// El workspace vacío debe considerarse vacío
// ══════════════════════════════════════════════════════════════════════════════

describe('isEmptyWorkspaceForPersistenceGuard() — workspaces verdaderamente vacíos', () => {

  it('un workspace recién creado (sin nada) es "vacío" para el guard', () => {
    const ws = makeEmptyWorkspace()
    expect(isEmptyWorkspaceForPersistenceGuard(ws)).toBe(true)
  })

})

// ══════════════════════════════════════════════════════════════════════════════
// REGRESIÓN: questionnaireProjects debe no ser vacío
// ══════════════════════════════════════════════════════════════════════════════

describe('isEmptyWorkspaceForPersistenceGuard() — REGRESIÓN: questionnaireProjects', () => {

  it('un workspace con SOLO questionnaireProjects NO es "vacío" — regresión I3', () => {
    const ws: MunicipalityWorkspace = {
      ...makeEmptyWorkspace(),
      questionnaireProjects: [makeQuestionnaireProject('enc-001')],
    }
    // Sin el fix: devolvía true → el guard bloqueaba el guardado → datos perdidos
    // Con el fix: devuelve false → el workspace se guarda normalmente
    expect(isEmptyWorkspaceForPersistenceGuard(ws)).toBe(false)
  })

  it('un workspace con questionnaireProjects vacío [] continúa siendo "vacío"', () => {
    const ws: MunicipalityWorkspace = {
      ...makeEmptyWorkspace(),
      questionnaireProjects: [],
    }
    expect(isEmptyWorkspaceForPersistenceGuard(ws)).toBe(true)
  })

  it('un workspace con questionnaireProjects undefined continúa siendo "vacío"', () => {
    const ws: MunicipalityWorkspace = {
      ...makeEmptyWorkspace(),
      questionnaireProjects: undefined,
    }
    expect(isEmptyWorkspaceForPersistenceGuard(ws)).toBe(true)
  })

  it('múltiples proyectos: sigue siendo no-vacío', () => {
    const ws: MunicipalityWorkspace = {
      ...makeEmptyWorkspace(),
      questionnaireProjects: [
        makeQuestionnaireProject('enc-a'),
        makeQuestionnaireProject('enc-b'),
      ],
    }
    expect(isEmptyWorkspaceForPersistenceGuard(ws)).toBe(false)
  })

})

// ══════════════════════════════════════════════════════════════════════════════
// Las colecciones existentes siguen funcionando correctamente
// ══════════════════════════════════════════════════════════════════════════════

describe('isEmptyWorkspaceForPersistenceGuard() — colecciones existentes siguen correctas', () => {

  it('un workspace con documents es no-vacío', () => {
    const base = makeEmptyWorkspace()
    const ws: MunicipalityWorkspace = {
      ...base,
      repository: {
        ...base.repository,
        documents: [{ id: 'doc-1', kind: 'territorial-documentation', title: 'Doc', body: { bodyText: '' }, sections: [], source: { system: 'test' }, tags: [], createdAt: '2026-07-02T00:00:00.000Z' }],
        updatedAt: new Date().toISOString(),
      },
    }
    expect(isEmptyWorkspaceForPersistenceGuard(ws)).toBe(false)
  })

  it('un workspace con evidenceStore.atoms es no-vacío', () => {
    const base = makeEmptyWorkspace()
    const ws: MunicipalityWorkspace = {
      ...base,
      evidenceStore: {
        ...base.evidenceStore,
        atoms: [{
          id: 'atom-1',
          municipalityId: 'test-mun',
          kind: 'indicator',
          confidence: 'medium',
          requiresHumanValidation: true,
          tags: [],
          payload: { label: 'test', value: 1, unit: 'u' },
          provenance: { origin: 'health-report' },
          createdAt: '2026-07-02T00:00:00.000Z',
        }],
        updatedAt: new Date().toISOString(),
      },
    }
    expect(isEmptyWorkspaceForPersistenceGuard(ws)).toBe(false)
  })

})

// ══════════════════════════════════════════════════════════════════════════════
// Invariante: añadir questionnaireProjects no borra colecciones existentes
// ══════════════════════════════════════════════════════════════════════════════

describe('invariante — añadir questionnaireProjects no borra colecciones preexistentes', () => {

  it('un workspace con estudios Y proyectos GES no pierde estudios tras round-trip JSON', () => {
    const base = makeEmptyWorkspace()

    // Simula un workspace con un ibseStudy y un questionnaireProject
    const ws: MunicipalityWorkspace = {
      ...base,
      ibseStudy: {
        sourceFileName: 'ibse-test.csv',
        createdAt: '2026-07-02T00:00:00.000Z',
        aggregates: {
          n: 100, nValid: 95,
          meanTotal: 75, meanFactorVinculo: 70, meanFactorSituacion: 72,
          meanFactorControl: 78, meanFactorPersona: 80,
        },
        methodologicalCautions: [],
      },
      questionnaireProjects: [makeQuestionnaireProject('enc-001')],
    }

    // Round-trip JSON (lo que hace localStorage)
    const restored = JSON.parse(JSON.stringify(ws)) as MunicipalityWorkspace

    // El ibseStudy no se pierde
    expect(restored.ibseStudy).toBeDefined()
    expect(restored.ibseStudy!.aggregates.meanTotal).toBe(75)

    // Los questionnaireProjects no se pierden
    expect(restored.questionnaireProjects).toHaveLength(1)
    expect(restored.questionnaireProjects![0].id).toBe('enc-001')

    // El guard reconoce el workspace como no-vacío (no bloqueará el guardado)
    expect(isEmptyWorkspaceForPersistenceGuard(restored)).toBe(false)
  })

  it('añadir questionnaireProjects a un workspace con repository no borra el repository', () => {
    const base = makeEmptyWorkspace()

    const ws: MunicipalityWorkspace = {
      ...base,
      repository: {
        ...base.repository,
        documents: [{ id: 'doc-1', kind: 'health-report', title: 'Informe', body: { bodyText: 'texto' }, sections: [], source: { system: 'test' }, tags: [], createdAt: '2026-07-02T00:00:00.000Z' }],
        updatedAt: new Date().toISOString(),
      },
    }

    // Añadimos proyecto GES a posteriori (como haría el handler de guardado)
    const wsConProyecto: MunicipalityWorkspace = {
      ...ws,
      questionnaireProjects: [makeQuestionnaireProject('enc-nuevo')],
    }

    expect(wsConProyecto.repository.documents).toHaveLength(1)
    expect(wsConProyecto.repository.documents[0].id).toBe('doc-1')
    expect(wsConProyecto.questionnaireProjects).toHaveLength(1)
    // Guard: no-vacío (tiene documentos)
    expect(isEmptyWorkspaceForPersistenceGuard(wsConProyecto)).toBe(false)
  })

  it('el aislamiento por municipio se mantiene: proyectos de un municipio no contaminan otro', () => {
    const wsA: MunicipalityWorkspace = {
      ...createCompleteMunicipalityWorkspace({ id: 'mun-a', name: 'A' }),
      questionnaireProjects: [makeQuestionnaireProject('enc-a')],
    }
    const wsB: MunicipalityWorkspace = {
      ...createCompleteMunicipalityWorkspace({ id: 'mun-b', name: 'B' }),
      questionnaireProjects: [makeQuestionnaireProject('enc-b')],
    }

    const restoredA = JSON.parse(JSON.stringify(wsA)) as MunicipalityWorkspace
    const restoredB = JSON.parse(JSON.stringify(wsB)) as MunicipalityWorkspace

    expect(restoredA.municipality.identity.id).toBe('mun-a')
    expect(restoredA.questionnaireProjects![0].id).toBe('enc-a')
    expect(restoredB.municipality.identity.id).toBe('mun-b')
    expect(restoredB.questionnaireProjects![0].id).toBe('enc-b')

    // Ningún proyecto del municipio A aparece en B
    const idsA = restoredA.questionnaireProjects!.map(p => p.id)
    const idsB = restoredB.questionnaireProjects!.map(p => p.id)
    expect(idsA).not.toContain('enc-b')
    expect(idsB).not.toContain('enc-a')
  })

})
