/**
 * tests/questionnaire-persistence.test.ts
 *
 * Demuestra que los QuestionnaireProjects del GES persisten correctamente
 * en el MunicipalityWorkspace a través de la serialización JSON.
 *
 * El mecanismo de persistencia (localStorage) serializa el workspace completo
 * con JSON.stringify / JSON.parse. Los tests usan el mismo round-trip para
 * verificar el comportamiento sin necesitar un entorno de navegador.
 *
 * Cubre:
 *   - Un proyecto sobrevive al round-trip JSON
 *   - Workspaces sin proyectos siguen siendo válidos (compatibilidad atrás)
 *   - Múltiples proyectos se conservan íntegramente
 *   - El aislamiento entre municipios se preserva
 *   - El pipeline diagnóstico existente no se ve afectado
 */

import { describe, it, expect } from 'vitest'
import { createCompleteMunicipalityWorkspace } from '../src/application/workspace'
import { parseWorkspaceJSON } from '../src/infrastructure/persistence/local-storage'
import type { MunicipalityWorkspace } from '../src/domain/workspace'
import type { QuestionnaireProject } from '../src/domain/questionnaire'
import { createQuestionnaire } from '../src/application/questionnaire'

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Simula exactamente lo que hace localStorage: stringify → parse. */
function roundTrip(workspace: MunicipalityWorkspace): MunicipalityWorkspace {
  return JSON.parse(JSON.stringify(workspace)) as MunicipalityWorkspace
}

function makeWorkspace(municipalityId: string) {
  return createCompleteMunicipalityWorkspace({ id: municipalityId, name: `Municipio ${municipalityId}` })
}

function makeProject(id: string, moduleIds: string[] = ['ibse']): QuestionnaireProject {
  const now = '2026-07-02T08:00:00.000Z'
  return {
    id,
    name: `Encuesta ${id}`,
    status: 'draft',
    questionnaire: createQuestionnaire({
      id,
      name: `Encuesta ${id}`,
      methodologicalModules: moduleIds,
      classificationBlocks: ['eas-sociodemographic'],
    }),
    requestedOutputs: ['redcap'],
    createdAt: now,
    updatedAt: now,
  }
}

// ── Suite ─────────────────────────────────────────────────────────────────────

describe('GES — persistencia de QuestionnaireProjects en el workspace', () => {

  it('un workspace recién creado no tiene proyectos (campo ausente)', () => {
    const ws = makeWorkspace('mun-001')
    expect(ws.questionnaireProjects).toBeUndefined()
  })

  it('un proyecto de encuesta sobrevive al round-trip JSON', () => {
    const ws = makeWorkspace('mun-001')
    const project = makeProject('enc-2026-ibse')

    const wsWithProject: MunicipalityWorkspace = {
      ...ws,
      questionnaireProjects: [project],
    }

    const restored = roundTrip(wsWithProject)

    expect(restored.questionnaireProjects).toHaveLength(1)
    expect(restored.questionnaireProjects![0].id).toBe('enc-2026-ibse')
    expect(restored.questionnaireProjects![0].status).toBe('draft')
    expect(restored.questionnaireProjects![0].questionnaire.id).toBe('enc-2026-ibse')
    expect(restored.questionnaireProjects![0].questionnaire.methodologicalModules).toContain('ibse')
    expect(restored.questionnaireProjects![0].questionnaire.classificationBlocks).toContain('eas-sociodemographic')
  })

  it('los bloques de clasificación se preservan tras el round-trip', () => {
    const ws = makeWorkspace('mun-001')
    const project = makeProject('enc-sd', ['duke-eas', 'predimed-eas'])

    const restored = roundTrip({ ...ws, questionnaireProjects: [project] })

    expect(restored.questionnaireProjects![0].questionnaire.classificationBlocks)
      .toEqual(['eas-sociodemographic'])
  })

  it('un workspace SIN proyectos sigue siendo válido tras round-trip (compatibilidad hacia atrás)', () => {
    const ws = makeWorkspace('mun-001')
    const restored = roundTrip(ws)

    expect(restored.questionnaireProjects).toBeUndefined()
    expect(restored.municipality.identity.id).toBe('mun-001')
    expect(restored.evidenceStore.atoms).toHaveLength(0)
    expect(restored.repository.documents).toHaveLength(0)
  })

  it('múltiples proyectos se conservan todos en el orden correcto', () => {
    const ws = makeWorkspace('mun-001')
    const projects = [
      makeProject('enc-a', ['ibse']),
      makeProject('enc-b', ['duke-eas']),
      makeProject('enc-c', ['predimed-eas', 'ibse']),
    ]

    const restored = roundTrip({ ...ws, questionnaireProjects: projects })

    expect(restored.questionnaireProjects).toHaveLength(3)
    expect(restored.questionnaireProjects![0].id).toBe('enc-a')
    expect(restored.questionnaireProjects![1].id).toBe('enc-b')
    expect(restored.questionnaireProjects![2].id).toBe('enc-c')
    expect(restored.questionnaireProjects![2].questionnaire.methodologicalModules)
      .toEqual(['predimed-eas', 'ibse'])
  })

  it('el aislamiento entre municipios se preserva: proyectos de un workspace no contaminan otro', () => {
    const wsA = makeWorkspace('mun-a')
    const wsB = makeWorkspace('mun-b')

    const projectA = makeProject('enc-a')
    const projectB = makeProject('enc-b')

    const restoredA = roundTrip({ ...wsA, questionnaireProjects: [projectA] })
    const restoredB = roundTrip({ ...wsB, questionnaireProjects: [projectB] })

    expect(restoredA.municipality.identity.id).toBe('mun-a')
    expect(restoredA.questionnaireProjects![0].id).toBe('enc-a')

    expect(restoredB.municipality.identity.id).toBe('mun-b')
    expect(restoredB.questionnaireProjects![0].id).toBe('enc-b')

    // Ningún proyecto del municipio A aparece en B y viceversa
    const idsA = restoredA.questionnaireProjects!.map(p => p.id)
    const idsB = restoredB.questionnaireProjects!.map(p => p.id)
    expect(idsA).not.toContain('enc-b')
    expect(idsB).not.toContain('enc-a')
  })

  it('el pipeline diagnóstico no se ve afectado: EvidenceStore, repository y PSL intactos', () => {
    const ws = makeWorkspace('mun-001')
    const project = makeProject('enc-test')

    const wsWithProject: MunicipalityWorkspace = {
      ...ws,
      questionnaireProjects: [project],
    }

    const restored = roundTrip(wsWithProject)

    // El pipeline diagnóstico no se toca
    expect(restored.evidenceStore.atoms).toHaveLength(0)
    expect(restored.repository.documents).toHaveLength(0)
    expect(restored.validatedPSL).toBeUndefined()
    expect(restored.compiledProfiles).toBeUndefined()

    // El proyecto existe en paralelo sin interferir
    expect(restored.questionnaireProjects).toHaveLength(1)
  })

})

// ── Compatibilidad legacy: propiedad `nhsArtifact` sobrante (GOV-P4-01 · PR-E) ──
// Tras retirar la autonomía NHS, `nhsArtifact` ya no existe en el tipo. Un blob
// persistido por una versión anterior puede llevarlo como propiedad adicional.
// `parseWorkspaceJSON` tolera extras: el workspace se rehidrata sin que ninguna
// lógica de producción necesite leer ni interpretar el artefacto antiguo, y sin
// migración destructiva (el extra puede persistir como dato inerte).
describe('Compatibilidad legacy — blob con `nhsArtifact` sobrante', () => {
  it('rehidrata un blob legacy con nhsArtifact sin interpretarlo', () => {
    const ws = makeWorkspace('mun-legacy')
    const legacyRaw = JSON.stringify({
      ...ws,
      nhsArtifact: { id: 'legacy-nhs', municipalityId: 'mun-legacy', isCongealed: true },
    })

    const restored = parseWorkspaceJSON(legacyRaw)

    expect(restored).not.toBeNull()
    expect(restored!.municipality.identity.id).toBe('mun-legacy')
    expect(restored!.repository.documents).toHaveLength(0)
    expect(restored!.evidenceStore.atoms).toHaveLength(0)
    // No se exige purga del extra: la restauración es válida sin leerlo.
  })
})
