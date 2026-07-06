/**
 * tests/perfil-local-de-salud.test.ts
 *
 * Suite completa del Perfil Local de Salud — Incrementos 1, 2 y 3.
 *
 * Incremento 1:
 *   - Creación del Perfil, Interpretaciones, Hipótesis, Preguntas Abiertas.
 *   - Invariantes del Modelo Conceptual.
 *   - Persistencia: round-trip JSON en MunicipalityWorkspace.
 *   - Compatibilidad hacia atrás.
 *
 * Incremento 2:
 *   - Ciclo de vida completo: actualización, sustitución, resolución, descarte.
 *   - Conservación del historial — ningún contenido humano se pierde.
 *   - Trazabilidad de la sustitución.
 *   - Invariante: interpretación sin evidencias lanza error.
 *   - Invariante: hipótesis no se convierte automáticamente en interpretación.
 *   - Síntesis elaborada por el profesional.
 *   - Persistencia de todos los estados de ciclo de vida.
 *
 * Incremento 3:
 *   - Estado del Conocimiento: conteos globales y por espacio.
 *   - Cobertura de espacios funcionales (vacío, iniciado, pendiente-revisión, desarrollado).
 *   - Alertas metodológicas estructurales.
 *   - Inmutabilidad: computePerfilEstadoGlobal no modifica el perfil.
 */

import { describe, it, expect } from 'vitest'
import {
  createPerfilLocalDeSalud,
  addInterpretation,
  updateInterpretation,
  supersedeInterpretation,
  addHypothesis,
  updateHypothesis,
  resolveHypothesisAsInterpretation,
  discardHypothesis,
  addOpenQuestion,
  updateOpenQuestion,
  resolveOpenQuestion,
  updateSynthesis,
  computePerfilEstadoGlobal,
  computeEstadoDelConocimiento,
} from '../src/application/health-profile/profileOperations'
import type { PerfilLocalDeSalud } from '../src/domain/health-profile'
import type { MunicipalityWorkspace } from '../src/domain/workspace'
import { createCompleteMunicipalityWorkspace } from '../src/application/workspace'

// ── Helpers ───────────────────────────────────────────────────────────────────

function roundTrip(workspace: MunicipalityWorkspace): MunicipalityWorkspace {
  return JSON.parse(JSON.stringify(workspace)) as MunicipalityWorkspace
}

function makeWorkspace(id = 'test-mun') {
  return createCompleteMunicipalityWorkspace({ id, name: `Municipio ${id}` })
}

// Referencia de evidencia canónica para tests de infraestructura.
// Satisface la invariante sin necesitar un EvidenceAtom real.
const REF = ['atom-ref-01']
const REF2 = ['atom-ref-02']

// ─────────────────────────────────────────────────────────────────────────────
// INCREMENTO 1 — Fundación
// ─────────────────────────────────────────────────────────────────────────────

// ── 1. Creación del Perfil ────────────────────────────────────────────────────

describe('createPerfilLocalDeSalud', () => {

  it('crea un perfil vacío para el municipio', () => {
    const perfil = createPerfilLocalDeSalud('atarfe')
    expect(perfil.municipalityId).toBe('atarfe')
    expect(perfil.interpretaciones).toHaveLength(0)
    expect(perfil.hipotesis).toHaveLength(0)
    expect(perfil.preguntasAbiertas).toHaveLength(0)
    expect(perfil.sintesisTexto).toBeUndefined()
  })

  it('asigna id único en cada llamada', () => {
    const a = createPerfilLocalDeSalud('mun-a')
    const b = createPerfilLocalDeSalud('mun-a')
    expect(a.id).not.toBe(b.id)
  })

  it('tiene timestamps válidos', () => {
    const perfil = createPerfilLocalDeSalud('mun-x')
    expect(() => new Date(perfil.createdAt)).not.toThrow()
    expect(() => new Date(perfil.updatedAt)).not.toThrow()
    expect(perfil.createdAt).toBe(perfil.updatedAt)
  })

})

// ── 2. addInterpretation ──────────────────────────────────────────────────────

describe('addInterpretation', () => {

  const base = createPerfilLocalDeSalud('atarfe')

  it('añade una interpretación y la devuelve en el array', () => {
    const result = addInterpretation(base, {
      espacio:      'situacion-salud',
      enunciado:    'La prevalencia de malestar psicológico es superior a la media regional.',
      certeza:      'moderada',
      evidenciaIds: ['atom-ghq12-001'],
      autorNombre:  'María García',
    })
    expect(result.interpretaciones).toHaveLength(1)
    const interp = result.interpretaciones[0]
    expect(interp.espacio).toBe('situacion-salud')
    expect(interp.certeza).toBe('moderada')
    expect(interp.autorNombre).toBe('María García')
    expect(interp.evidenciaIds).toEqual(['atom-ghq12-001'])
  })

  it('la interpretación nueva nace con status "activa"', () => {
    const result = addInterpretation(base, {
      espacio: 'determinantes', enunciado: 'El aislamiento social es determinante clave.',
      certeza: 'provisional', evidenciaIds: REF, autorNombre: 'Técnico',
    })
    expect(result.interpretaciones[0].status).toBe('activa')
  })

  it('la interpretación nueva no tiene supersededById', () => {
    const result = addInterpretation(base, {
      espacio: 'activos', enunciado: 'El polideportivo es un activo subutilizado.',
      certeza: 'alta', evidenciaIds: REF, autorNombre: 'Técnico',
    })
    expect(result.interpretaciones[0].supersededById).toBeUndefined()
  })

  it('tiene autor explícito — invariante del Modelo Conceptual', () => {
    const result = addInterpretation(base, {
      espacio: 'contexto-territorial', enunciado: 'Municipio con envejecimiento acelerado.',
      certeza: 'alta', evidenciaIds: REF, autorNombre: 'Dr. Pérez',
    })
    expect(result.interpretaciones[0].autorNombre).toBe('Dr. Pérez')
    expect(result.interpretaciones[0].autorNombre.length).toBeGreaterThan(0)
  })

  it('acepta razonamiento opcional', () => {
    const result = addInterpretation(base, {
      espacio: 'sintesis', enunciado: 'El municipio presenta un perfil de vulnerabilidad múltiple.',
      certeza: 'moderada', evidenciaIds: ['atom-1', 'atom-2'],
      razonamiento: 'La convergencia de GHQ-12 y SF-12 con los datos de renta indica acumulación de factores.',
      autorNombre: 'Técnico',
    })
    expect(result.interpretaciones[0].razonamiento).toContain('convergencia')
  })

  it('no modifica el perfil original (inmutabilidad)', () => {
    addInterpretation(base, {
      espacio: 'desigualdades', enunciado: 'El barrio norte concentra mayor carga.',
      certeza: 'provisional', evidenciaIds: REF, autorNombre: 'Técnico',
    })
    expect(base.interpretaciones).toHaveLength(0)
  })

  it('acumula múltiples interpretaciones', () => {
    const p1 = addInterpretation(base, {
      espacio: 'situacion-salud', enunciado: 'Primera.', certeza: 'alta',
      evidenciaIds: REF, autorNombre: 'A',
    })
    const p2 = addInterpretation(p1, {
      espacio: 'determinantes', enunciado: 'Segunda.', certeza: 'moderada',
      evidenciaIds: REF2, autorNombre: 'B',
    })
    expect(p2.interpretaciones).toHaveLength(2)
  })

  it('actualiza updatedAt al añadir interpretación', () => {
    const before = base.updatedAt
    const result = addInterpretation(base, {
      espacio: 'activos', enunciado: 'X.', certeza: 'alta',
      evidenciaIds: REF, autorNombre: 'T',
    })
    expect(result.updatedAt >= before).toBe(true)
  })

})

// ── 3. addHypothesis ──────────────────────────────────────────────────────────

describe('addHypothesis', () => {

  const base = createPerfilLocalDeSalud('alfacar')

  it('añade una hipótesis con todos sus campos', () => {
    const result = addHypothesis(base, {
      espacio:              'determinantes',
      enunciado:            'El deterioro del tejido asociativo explica el aislamiento social observado.',
      plausibilidad:        'alta',
      indicios:             ['GHQ-12 superior media', 'grupos discusión: "no hay donde reunirse"'],
      preguntasResolutoras: ['¿Cuántas asociaciones activas existen?', '¿Han cerrado locales comunitarios en 5 años?'],
      autorNombre:          'Equipo técnico',
    })
    expect(result.hipotesis).toHaveLength(1)
    const hip = result.hipotesis[0]
    expect(hip.espacio).toBe('determinantes')
    expect(hip.plausibilidad).toBe('alta')
    expect(hip.indicios).toHaveLength(2)
    expect(hip.preguntasResolutoras).toHaveLength(2)
  })

  it('la hipótesis nueva nace con status "activa"', () => {
    const result = addHypothesis(base, {
      espacio: 'situacion-salud', enunciado: 'H.', plausibilidad: 'especulativa',
      indicios: [], preguntasResolutoras: [], autorNombre: 'T',
    })
    expect(result.hipotesis[0].status).toBe('activa')
  })

  it('la hipótesis nueva no tiene resolvedById', () => {
    const result = addHypothesis(base, {
      espacio: 'desigualdades', enunciado: 'H2.', plausibilidad: 'moderada',
      indicios: ['indicio-1'], preguntasResolutoras: [], autorNombre: 'T',
    })
    expect(result.hipotesis[0].resolvedById).toBeUndefined()
  })

  it('no modifica el perfil original', () => {
    addHypothesis(base, {
      espacio: 'activos', enunciado: 'H3.', plausibilidad: 'alta',
      indicios: [], preguntasResolutoras: [], autorNombre: 'T',
    })
    expect(base.hipotesis).toHaveLength(0)
  })

  it('no interfiere con las interpretaciones existentes', () => {
    const conInterp = addInterpretation(base, {
      espacio: 'situacion-salud', enunciado: 'I.', certeza: 'alta',
      evidenciaIds: REF, autorNombre: 'T',
    })
    const conHip = addHypothesis(conInterp, {
      espacio: 'determinantes', enunciado: 'H.', plausibilidad: 'moderada',
      indicios: [], preguntasResolutoras: [], autorNombre: 'T',
    })
    expect(conHip.interpretaciones).toHaveLength(1)
    expect(conHip.hipotesis).toHaveLength(1)
  })

})

// ── 4. addOpenQuestion ────────────────────────────────────────────────────────

describe('addOpenQuestion', () => {

  const base = createPerfilLocalDeSalud('churriana')

  it('añade una pregunta abierta con todos sus campos', () => {
    const result = addOpenQuestion(base, {
      espacio:        'desigualdades',
      formulacion:    '¿Existen diferencias en salud mental entre el casco histórico y las zonas periféricas?',
      relevancia:     'Sin datos desagregados por zona no es posible identificar desigualdades intramunicipales.',
      urgencia:       'alta',
      viasResolucion: ['Encuesta con variable de zona', 'Análisis de recetas por zona básica'],
    })
    expect(result.preguntasAbiertas).toHaveLength(1)
    const pq = result.preguntasAbiertas[0]
    expect(pq.espacio).toBe('desigualdades')
    expect(pq.urgencia).toBe('alta')
    expect(pq.viasResolucion).toHaveLength(2)
  })

  it('la pregunta nace con status "abierta"', () => {
    const result = addOpenQuestion(base, {
      espacio: 'contexto-territorial', formulacion: '¿?',
      relevancia: 'relevante', urgencia: 'baja', viasResolucion: [],
    })
    expect(result.preguntasAbiertas[0].status).toBe('abierta')
  })

  it('no modifica el perfil original', () => {
    addOpenQuestion(base, {
      espacio: 'activos', formulacion: '¿?', relevancia: 'r',
      urgencia: 'media', viasResolucion: [],
    })
    expect(base.preguntasAbiertas).toHaveLength(0)
  })

  it('acumula preguntas de distintos espacios', () => {
    const p1 = addOpenQuestion(base, {
      espacio: 'determinantes', formulacion: '¿A?', relevancia: 'r',
      urgencia: 'alta', viasResolucion: [],
    })
    const p2 = addOpenQuestion(p1, {
      espacio: 'desigualdades', formulacion: '¿B?', relevancia: 'r',
      urgencia: 'media', viasResolucion: [],
    })
    expect(p2.preguntasAbiertas).toHaveLength(2)
    expect(p2.preguntasAbiertas[0].espacio).toBe('determinantes')
    expect(p2.preguntasAbiertas[1].espacio).toBe('desigualdades')
  })

})

// ── 5. Invariantes del Modelo Conceptual (Incremento 1) ──────────────────────

describe('Invariantes del Modelo Conceptual', () => {

  it('las interpretaciones no se eliminan al añadir nuevas', () => {
    let p = createPerfilLocalDeSalud('mun-inv')
    for (let i = 0; i < 5; i++) {
      p = addInterpretation(p, {
        espacio: 'situacion-salud', enunciado: `Interpretación ${i}.`,
        certeza: 'alta', evidenciaIds: [`atom-${i}`], autorNombre: 'T',
      })
    }
    expect(p.interpretaciones).toHaveLength(5)
    expect(p.interpretaciones.every(i => i.status === 'activa')).toBe(true)
  })

  it('cada interpretación tiene municipalityId igual al del perfil', () => {
    const perfil = createPerfilLocalDeSalud('zagra')
    const result = addInterpretation(perfil, {
      espacio: 'activos', enunciado: 'E.', certeza: 'alta',
      evidenciaIds: REF, autorNombre: 'T',
    })
    expect(result.interpretaciones[0].municipalityId).toBe('zagra')
  })

  it('cada hipótesis tiene municipalityId igual al del perfil', () => {
    const perfil = createPerfilLocalDeSalud('zagra')
    const result = addHypothesis(perfil, {
      espacio: 'determinantes', enunciado: 'H.', plausibilidad: 'alta',
      indicios: [], preguntasResolutoras: [], autorNombre: 'T',
    })
    expect(result.hipotesis[0].municipalityId).toBe('zagra')
  })

  it('cada pregunta abierta tiene municipalityId igual al del perfil', () => {
    const perfil = createPerfilLocalDeSalud('zagra')
    const result = addOpenQuestion(perfil, {
      espacio: 'desigualdades', formulacion: '¿?', relevancia: 'r',
      urgencia: 'baja', viasResolucion: [],
    })
    expect(result.preguntasAbiertas[0].municipalityId).toBe('zagra')
  })

  it('cada afirmación tiene id único', () => {
    let p = createPerfilLocalDeSalud('mun-ids')
    p = addInterpretation(p, { espacio: 'activos', enunciado: 'E1.', certeza: 'alta', evidenciaIds: REF, autorNombre: 'T' })
    p = addInterpretation(p, { espacio: 'activos', enunciado: 'E2.', certeza: 'alta', evidenciaIds: REF2, autorNombre: 'T' })
    const ids = p.interpretaciones.map(i => i.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('interpretaciones, hipótesis y preguntas son arrays independientes', () => {
    let p = createPerfilLocalDeSalud('mun-sep')
    p = addInterpretation(p, { espacio: 'situacion-salud', enunciado: 'I.', certeza: 'alta', evidenciaIds: REF, autorNombre: 'T' })
    p = addHypothesis(p, { espacio: 'determinantes', enunciado: 'H.', plausibilidad: 'alta', indicios: [], preguntasResolutoras: [], autorNombre: 'T' })
    p = addOpenQuestion(p, { espacio: 'desigualdades', formulacion: '¿?', relevancia: 'r', urgencia: 'alta', viasResolucion: [] })
    expect(p.interpretaciones).toHaveLength(1)
    expect(p.hipotesis).toHaveLength(1)
    expect(p.preguntasAbiertas).toHaveLength(1)
  })

})

// ── 6. Persistencia y round-trip JSON ────────────────────────────────────────

describe('Persistencia — round-trip JSON', () => {

  it('un workspace sin perfilLocalDeSalud sigue siendo válido tras round-trip', () => {
    const ws = makeWorkspace('mun-old')
    expect(ws.perfilLocalDeSalud).toBeUndefined()
    const restored = roundTrip(ws)
    expect(restored.perfilLocalDeSalud).toBeUndefined()
    expect(restored.municipality.identity.id).toBe('mun-old')
    expect(restored.evidenceStore.atoms).toHaveLength(0)
  })

  it('el perfil completo sobrevive al round-trip JSON', () => {
    let perfil = createPerfilLocalDeSalud('atarfe')
    perfil = addInterpretation(perfil, {
      espacio: 'situacion-salud',
      enunciado: 'Prevalencia de malestar superior a media regional.',
      certeza: 'moderada',
      evidenciaIds: ['atom-ghq12-001', 'atom-sf12-002'],
      razonamiento: 'Convergencia de GHQ-12 y SF-12.',
      autorNombre: 'María García',
    })
    perfil = addHypothesis(perfil, {
      espacio: 'determinantes',
      enunciado: 'El aislamiento social es determinante clave.',
      plausibilidad: 'alta',
      indicios: ['GHQ-12 alto', 'grupos de discusión'],
      preguntasResolutoras: ['¿Cuántas asociaciones activas?'],
      autorNombre: 'Equipo técnico',
    })
    perfil = addOpenQuestion(perfil, {
      espacio: 'desigualdades',
      formulacion: '¿Existen diferencias por barrio?',
      relevancia: 'Crítica para identificar inequidades.',
      urgencia: 'alta',
      viasResolucion: ['Encuesta con variable de zona'],
    })

    const ws: MunicipalityWorkspace = { ...makeWorkspace('atarfe'), perfilLocalDeSalud: perfil }
    const rp = roundTrip(ws).perfilLocalDeSalud!

    expect(rp.municipalityId).toBe('atarfe')
    expect(rp.interpretaciones).toHaveLength(1)
    expect(rp.interpretaciones[0].certeza).toBe('moderada')
    expect(rp.interpretaciones[0].evidenciaIds).toEqual(['atom-ghq12-001', 'atom-sf12-002'])
    expect(rp.interpretaciones[0].status).toBe('activa')
    expect(rp.hipotesis[0].plausibilidad).toBe('alta')
    expect(rp.hipotesis[0].status).toBe('activa')
    expect(rp.preguntasAbiertas[0].urgencia).toBe('alta')
    expect(rp.preguntasAbiertas[0].status).toBe('abierta')
  })

  it('el pipeline diagnóstico existente no se ve afectado por el nuevo campo', () => {
    const ws: MunicipalityWorkspace = {
      ...makeWorkspace('atarfe'),
      perfilLocalDeSalud: createPerfilLocalDeSalud('atarfe'),
    }
    const restored = roundTrip(ws)
    expect(restored.evidenceStore.atoms).toHaveLength(0)
    expect(restored.repository.documents).toHaveLength(0)
    expect(restored.validatedPSL).toBeUndefined()
  })

  it('el aislamiento entre municipios se preserva', () => {
    let perfilA = createPerfilLocalDeSalud('mun-a')
    perfilA = addInterpretation(perfilA, {
      espacio: 'activos', enunciado: 'Solo municipio A.',
      certeza: 'alta', evidenciaIds: REF, autorNombre: 'T',
    })
    const wsA: MunicipalityWorkspace = { ...makeWorkspace('mun-a'), perfilLocalDeSalud: perfilA }
    const wsB: MunicipalityWorkspace = { ...makeWorkspace('mun-b'), perfilLocalDeSalud: createPerfilLocalDeSalud('mun-b') }
    const rA = roundTrip(wsA)
    const rB = roundTrip(wsB)
    expect(rA.perfilLocalDeSalud!.interpretaciones).toHaveLength(1)
    expect(rB.perfilLocalDeSalud!.interpretaciones).toHaveLength(0)
  })

  it('el perfil con arrays vacíos sobrevive al round-trip', () => {
    const ws: MunicipalityWorkspace = { ...makeWorkspace('vacio'), perfilLocalDeSalud: createPerfilLocalDeSalud('vacio') }
    const rp = roundTrip(ws).perfilLocalDeSalud!
    expect(rp.interpretaciones).toEqual([])
    expect(rp.hipotesis).toEqual([])
    expect(rp.preguntasAbiertas).toEqual([])
  })

})

// ── 7. Compatibilidad con workspaces antiguos ─────────────────────────────────

describe('Compatibilidad hacia atrás', () => {

  it('un workspace serializado sin perfilLocalDeSalud se carga correctamente', () => {
    const parsed = JSON.parse(JSON.stringify(makeWorkspace('mun-legacy'))) as MunicipalityWorkspace
    expect(parsed.perfilLocalDeSalud).toBeUndefined()
    expect(parsed.municipality.identity.id).toBe('mun-legacy')
  })

  it('un workspace con perfilLocalDeSalud malformado es detectable', () => {
    const malformed = {
      ...makeWorkspace('mun-broken'),
      perfilLocalDeSalud: { id: 'x', municipalityId: 'mun-broken' },
    }
    const parsed = JSON.parse(JSON.stringify(malformed)) as {
      perfilLocalDeSalud?: { interpretaciones?: unknown }
    }
    expect(Array.isArray(parsed.perfilLocalDeSalud?.interpretaciones)).toBe(false)
  })

})

// ─────────────────────────────────────────────────────────────────────────────
// INCREMENTO 2 — Ciclo de vida del conocimiento
// ─────────────────────────────────────────────────────────────────────────────

// ── 8. Invariante: interpretación requiere evidencias ────────────────────────

describe('Invariante — interpretación sin evidencias lanza error', () => {

  const base = createPerfilLocalDeSalud('inv-test')

  it('addInterpretation lanza cuando evidenciaIds está vacío', () => {
    expect(() =>
      addInterpretation(base, {
        espacio: 'situacion-salud', enunciado: 'Sin respaldo empírico.',
        certeza: 'alta', evidenciaIds: [], autorNombre: 'T',
      })
    ).toThrow()
  })

  it('supersedeInterpretation lanza cuando la nueva interpretación no tiene evidencias', () => {
    const p = addInterpretation(base, {
      espacio: 'activos', enunciado: 'Original.', certeza: 'alta',
      evidenciaIds: REF, autorNombre: 'T',
    })
    const idOriginal = p.interpretaciones[0].id
    expect(() =>
      supersedeInterpretation(p, idOriginal, {
        espacio: 'activos', enunciado: 'Nueva sin evidencias.',
        certeza: 'alta', evidenciaIds: [], autorNombre: 'T',
      })
    ).toThrow()
  })

  it('resolveHypothesisAsInterpretation lanza cuando la interpretación no tiene evidencias', () => {
    const p = addHypothesis(base, {
      espacio: 'determinantes', enunciado: 'H.', plausibilidad: 'alta',
      indicios: ['indicio'], preguntasResolutoras: [], autorNombre: 'T',
    })
    const hipId = p.hipotesis[0].id
    expect(() =>
      resolveHypothesisAsInterpretation(p, hipId, {
        espacio: 'determinantes', enunciado: 'Confirmada.',
        certeza: 'alta', evidenciaIds: [], autorNombre: 'T',
      })
    ).toThrow()
  })

})

// ── 9. updateInterpretation ───────────────────────────────────────────────────

describe('updateInterpretation', () => {

  function perfilConInterp() {
    const p = createPerfilLocalDeSalud('update-test')
    return addInterpretation(p, {
      espacio: 'situacion-salud',
      enunciado: 'Prevalencia de depresión elevada.',
      certeza: 'provisional',
      evidenciaIds: ['atom-phq9-001'],
      autorNombre: 'Técnico',
    })
  }

  it('actualiza certeza manteniendo el enunciado intacto', () => {
    const p = perfilConInterp()
    const id = p.interpretaciones[0].id
    const result = updateInterpretation(p, id, { certeza: 'alta' })
    expect(result.interpretaciones[0].certeza).toBe('alta')
    expect(result.interpretaciones[0].enunciado).toBe('Prevalencia de depresión elevada.')
  })

  it('actualiza razonamiento', () => {
    const p = perfilConInterp()
    const id = p.interpretaciones[0].id
    const result = updateInterpretation(p, id, { razonamiento: 'Convergencia PHQ-9 y atención primaria.' })
    expect(result.interpretaciones[0].razonamiento).toBe('Convergencia PHQ-9 y atención primaria.')
  })

  it('actualiza evidenciaIds', () => {
    const p = perfilConInterp()
    const id = p.interpretaciones[0].id
    const result = updateInterpretation(p, id, { evidenciaIds: ['atom-phq9-001', 'atom-ap-002'] })
    expect(result.interpretaciones[0].evidenciaIds).toEqual(['atom-phq9-001', 'atom-ap-002'])
  })

  it('no permite dejar evidenciaIds vacío', () => {
    const p = perfilConInterp()
    const id = p.interpretaciones[0].id
    expect(() => updateInterpretation(p, id, { evidenciaIds: [] })).toThrow()
  })

  it('lanza si el id no existe', () => {
    const p = perfilConInterp()
    expect(() => updateInterpretation(p, 'no-existe', { certeza: 'alta' })).toThrow()
  })

  it('no modifica el perfil original (inmutabilidad)', () => {
    const p = perfilConInterp()
    const id = p.interpretaciones[0].id
    updateInterpretation(p, id, { certeza: 'alta' })
    expect(p.interpretaciones[0].certeza).toBe('provisional')
  })

  it('la interpretación sigue en status "activa" tras actualización', () => {
    const p = perfilConInterp()
    const id = p.interpretaciones[0].id
    const result = updateInterpretation(p, id, { certeza: 'alta' })
    expect(result.interpretaciones[0].status).toBe('activa')
  })

})

// ── 10. supersedeInterpretation ───────────────────────────────────────────────

describe('supersedeInterpretation', () => {

  function perfilConInterp() {
    const p = createPerfilLocalDeSalud('sup-test')
    return addInterpretation(p, {
      espacio: 'situacion-salud',
      enunciado: 'Versión 1: alta prevalencia de malestar.',
      certeza: 'provisional',
      evidenciaIds: ['atom-ghq12-v1'],
      autorNombre: 'T',
    })
  }

  it('crea una nueva interpretación activa', () => {
    const p = perfilConInterp()
    const idOriginal = p.interpretaciones[0].id
    const result = supersedeInterpretation(p, idOriginal, {
      espacio: 'situacion-salud',
      enunciado: 'Versión 2: alta prevalencia confirmada con datos longitudinales.',
      certeza: 'alta',
      evidenciaIds: ['atom-ghq12-v1', 'atom-longi-001'],
      autorNombre: 'T',
    })
    const activas = result.interpretaciones.filter(i => i.status === 'activa')
    expect(activas).toHaveLength(1)
    expect(activas[0].enunciado).toContain('Versión 2')
    expect(activas[0].certeza).toBe('alta')
  })

  it('marca la original como superada — trazabilidad conservada', () => {
    const p = perfilConInterp()
    const idOriginal = p.interpretaciones[0].id
    const result = supersedeInterpretation(p, idOriginal, {
      espacio: 'situacion-salud', enunciado: 'V2.', certeza: 'alta',
      evidenciaIds: REF, autorNombre: 'T',
    })
    const superada = result.interpretaciones.find(i => i.id === idOriginal)!
    expect(superada.status).toBe('superada')
    expect(superada.supersededById).toBeDefined()
    expect(superada.enunciado).toBe('Versión 1: alta prevalencia de malestar.')
  })

  it('supersededById de la original apunta al id de la nueva', () => {
    const p = perfilConInterp()
    const idOriginal = p.interpretaciones[0].id
    const result = supersedeInterpretation(p, idOriginal, {
      espacio: 'situacion-salud', enunciado: 'V2.', certeza: 'alta',
      evidenciaIds: REF, autorNombre: 'T',
    })
    const superada = result.interpretaciones.find(i => i.id === idOriginal)!
    const nueva = result.interpretaciones.find(i => i.status === 'activa')!
    expect(superada.supersededById).toBe(nueva.id)
  })

  it('el perfil tiene N+1 interpretaciones tras la sustitución', () => {
    const p = perfilConInterp()
    const idOriginal = p.interpretaciones[0].id
    const result = supersedeInterpretation(p, idOriginal, {
      espacio: 'situacion-salud', enunciado: 'V2.', certeza: 'alta',
      evidenciaIds: REF, autorNombre: 'T',
    })
    expect(result.interpretaciones).toHaveLength(2)
  })

  it('lanza si el id a sustituir no existe', () => {
    const p = perfilConInterp()
    expect(() =>
      supersedeInterpretation(p, 'no-existe', {
        espacio: 'activos', enunciado: 'X.', certeza: 'alta',
        evidenciaIds: REF, autorNombre: 'T',
      })
    ).toThrow()
  })

})

// ── 11. updateHypothesis ──────────────────────────────────────────────────────

describe('updateHypothesis', () => {

  function perfilConHip() {
    const p = createPerfilLocalDeSalud('hip-update')
    return addHypothesis(p, {
      espacio: 'determinantes',
      enunciado: 'El aislamiento causa malestar.',
      plausibilidad: 'especulativa',
      indicios: ['GHQ elevado'],
      preguntasResolutoras: ['¿Cuántas redes existen?'],
      autorNombre: 'T',
    })
  }

  it('actualiza plausibilidad', () => {
    const p = perfilConHip()
    const id = p.hipotesis[0].id
    const result = updateHypothesis(p, id, { plausibilidad: 'alta' })
    expect(result.hipotesis[0].plausibilidad).toBe('alta')
  })

  it('añade indicios sin borrar los anteriores', () => {
    const p = perfilConHip()
    const id = p.hipotesis[0].id
    const result = updateHypothesis(p, id, { indicios: ['GHQ elevado', 'AP primaria'] })
    expect(result.hipotesis[0].indicios).toHaveLength(2)
  })

  it('actualiza preguntas resolutoras', () => {
    const p = perfilConHip()
    const id = p.hipotesis[0].id
    const result = updateHypothesis(p, id, {
      preguntasResolutoras: ['¿Cuántas redes?', '¿Frecuencia de uso?'],
    })
    expect(result.hipotesis[0].preguntasResolutoras).toHaveLength(2)
  })

  it('no modifica el perfil original', () => {
    const p = perfilConHip()
    const id = p.hipotesis[0].id
    updateHypothesis(p, id, { plausibilidad: 'alta' })
    expect(p.hipotesis[0].plausibilidad).toBe('especulativa')
  })

  it('lanza si el id no existe', () => {
    const p = perfilConHip()
    expect(() => updateHypothesis(p, 'no-existe', { plausibilidad: 'alta' })).toThrow()
  })

})

// ── 12. resolveHypothesisAsInterpretation ─────────────────────────────────────

describe('resolveHypothesisAsInterpretation', () => {

  function perfilConHip() {
    const p = createPerfilLocalDeSalud('resolve-test')
    return addHypothesis(p, {
      espacio: 'determinantes',
      enunciado: 'El aislamiento social produce malestar psicológico.',
      plausibilidad: 'alta',
      indicios: ['GHQ-12 elevado', 'participación indica "falta de lugares"'],
      preguntasResolutoras: ['¿Correlación con datos de renta?'],
      autorNombre: 'Equipo técnico',
    })
  }

  it('crea una nueva interpretación activa', () => {
    const p = perfilConHip()
    const hipId = p.hipotesis[0].id
    const result = resolveHypothesisAsInterpretation(p, hipId, {
      espacio: 'determinantes',
      enunciado: 'El aislamiento social es un determinante del malestar psicológico en Atarfe.',
      certeza: 'alta',
      evidenciaIds: ['atom-ghq12-001', 'atom-renta-001'],
      autorNombre: 'Equipo técnico',
    })
    expect(result.interpretaciones).toHaveLength(1)
    expect(result.interpretaciones[0].status).toBe('activa')
    expect(result.interpretaciones[0].certeza).toBe('alta')
  })

  it('marca la hipótesis como resuelta — no la elimina', () => {
    const p = perfilConHip()
    const hipId = p.hipotesis[0].id
    const result = resolveHypothesisAsInterpretation(p, hipId, {
      espacio: 'determinantes', enunciado: 'Confirmada.',
      certeza: 'alta', evidenciaIds: REF, autorNombre: 'T',
    })
    expect(result.hipotesis).toHaveLength(1)
    expect(result.hipotesis[0].status).toBe('resuelta-como-interpretacion')
    expect(result.hipotesis[0].enunciado).toBe('El aislamiento social produce malestar psicológico.')
  })

  it('resolvedById de la hipótesis apunta a la nueva interpretación', () => {
    const p = perfilConHip()
    const hipId = p.hipotesis[0].id
    const result = resolveHypothesisAsInterpretation(p, hipId, {
      espacio: 'determinantes', enunciado: 'Confirmada.',
      certeza: 'alta', evidenciaIds: REF, autorNombre: 'T',
    })
    const hip = result.hipotesis[0]
    const interp = result.interpretaciones[0]
    expect(hip.resolvedById).toBe(interp.id)
  })

  it('la hipótesis NO se convierte automáticamente: requiere llamada explícita', () => {
    // Verificar que el acto de resolución es siempre explícito y deliberado.
    // Tras addHypothesis, ninguna interpretación existe todavía.
    const p = perfilConHip()
    expect(p.interpretaciones).toHaveLength(0)
    expect(p.hipotesis[0].status).toBe('activa')
    // Solo tras la llamada explícita aparece la interpretación.
    const resolved = resolveHypothesisAsInterpretation(p, p.hipotesis[0].id, {
      espacio: 'determinantes', enunciado: 'Confirmada.', certeza: 'alta',
      evidenciaIds: REF, autorNombre: 'T',
    })
    expect(resolved.interpretaciones).toHaveLength(1)
  })

  it('lanza si la hipótesis no existe', () => {
    const p = perfilConHip()
    expect(() =>
      resolveHypothesisAsInterpretation(p, 'no-existe', {
        espacio: 'determinantes', enunciado: 'X.', certeza: 'alta',
        evidenciaIds: REF, autorNombre: 'T',
      })
    ).toThrow()
  })

})

// ── 13. discardHypothesis ─────────────────────────────────────────────────────

describe('discardHypothesis', () => {

  function perfilConHip() {
    const p = createPerfilLocalDeSalud('discard-test')
    return addHypothesis(p, {
      espacio: 'desigualdades',
      enunciado: 'La zona norte concentra mayor carga de enfermedad crónica.',
      plausibilidad: 'moderada',
      indicios: ['percepción en grupos focales'],
      preguntasResolutoras: ['¿Datos de AP por zona?'],
      autorNombre: 'T',
    })
  }

  it('marca la hipótesis como descartada sin eliminarla', () => {
    const p = perfilConHip()
    const id = p.hipotesis[0].id
    const result = discardHypothesis(p, id, 'Datos de AP muestran distribución homogénea.')
    expect(result.hipotesis).toHaveLength(1)
    expect(result.hipotesis[0].status).toBe('descartada')
  })

  it('conserva el enunciado original de la hipótesis', () => {
    const p = perfilConHip()
    const id = p.hipotesis[0].id
    const result = discardHypothesis(p, id, 'Datos contradicen la hipótesis.')
    expect(result.hipotesis[0].enunciado).toBe('La zona norte concentra mayor carga de enfermedad crónica.')
  })

  it('almacena el motivo del descarte', () => {
    const p = perfilConHip()
    const id = p.hipotesis[0].id
    const result = discardHypothesis(p, id, 'Datos de AP muestran distribución homogénea.')
    expect(result.hipotesis[0].discardedMotivo).toBe('Datos de AP muestran distribución homogénea.')
  })

  it('lanza si el id no existe', () => {
    const p = perfilConHip()
    expect(() => discardHypothesis(p, 'no-existe', 'motivo')).toThrow()
  })

  it('no modifica el perfil original', () => {
    const p = perfilConHip()
    const id = p.hipotesis[0].id
    discardHypothesis(p, id, 'motivo')
    expect(p.hipotesis[0].status).toBe('activa')
  })

})

// ── 14. updateOpenQuestion ────────────────────────────────────────────────────

describe('updateOpenQuestion', () => {

  function perfilConPQ() {
    const p = createPerfilLocalDeSalud('pq-update')
    return addOpenQuestion(p, {
      espacio: 'desigualdades',
      formulacion: '¿Existen diferencias por zona?',
      relevancia: 'Relevante para planificación.',
      urgencia: 'media',
      viasResolucion: ['Encuesta'],
    })
  }

  it('actualiza urgencia', () => {
    const p = perfilConPQ()
    const id = p.preguntasAbiertas[0].id
    const result = updateOpenQuestion(p, id, { urgencia: 'alta' })
    expect(result.preguntasAbiertas[0].urgencia).toBe('alta')
  })

  it('actualiza formulacion', () => {
    const p = perfilConPQ()
    const id = p.preguntasAbiertas[0].id
    const result = updateOpenQuestion(p, id, { formulacion: '¿Diferencias por barrio y género?' })
    expect(result.preguntasAbiertas[0].formulacion).toBe('¿Diferencias por barrio y género?')
  })

  it('actualiza vias de resolución', () => {
    const p = perfilConPQ()
    const id = p.preguntasAbiertas[0].id
    const result = updateOpenQuestion(p, id, { viasResolucion: ['Encuesta', 'Análisis registros AP'] })
    expect(result.preguntasAbiertas[0].viasResolucion).toHaveLength(2)
  })

  it('lanza si el id no existe', () => {
    const p = perfilConPQ()
    expect(() => updateOpenQuestion(p, 'no-existe', { urgencia: 'alta' })).toThrow()
  })

  it('no modifica el perfil original', () => {
    const p = perfilConPQ()
    const id = p.preguntasAbiertas[0].id
    updateOpenQuestion(p, id, { urgencia: 'alta' })
    expect(p.preguntasAbiertas[0].urgencia).toBe('media')
  })

})

// ── 15. resolveOpenQuestion ───────────────────────────────────────────────────

describe('resolveOpenQuestion', () => {

  function perfilConPQ() {
    const p = createPerfilLocalDeSalud('pq-resolve')
    return addOpenQuestion(p, {
      espacio: 'desigualdades',
      formulacion: '¿Existen diferencias por zona?',
      relevancia: 'Relevante.',
      urgencia: 'alta',
      viasResolucion: ['Encuesta'],
    })
  }

  it('marca la pregunta como resuelta sin eliminarla', () => {
    const p = perfilConPQ()
    const id = p.preguntasAbiertas[0].id
    const result = resolveOpenQuestion(p, id, 'Encuesta 2026 demuestra distribución homogénea.')
    expect(result.preguntasAbiertas).toHaveLength(1)
    expect(result.preguntasAbiertas[0].status).toBe('resuelta')
  })

  it('almacena la nota de resolución', () => {
    const p = perfilConPQ()
    const id = p.preguntasAbiertas[0].id
    const result = resolveOpenQuestion(p, id, 'Distribución homogénea confirmada.')
    expect(result.preguntasAbiertas[0].resolucionNota).toBe('Distribución homogénea confirmada.')
  })

  it('conserva la formulación original tras la resolución', () => {
    const p = perfilConPQ()
    const id = p.preguntasAbiertas[0].id
    const result = resolveOpenQuestion(p, id, 'Nota.')
    expect(result.preguntasAbiertas[0].formulacion).toBe('¿Existen diferencias por zona?')
  })

  it('lanza si el id no existe', () => {
    const p = perfilConPQ()
    expect(() => resolveOpenQuestion(p, 'no-existe', 'nota')).toThrow()
  })

})

// ─────────────────────────────────────────────────────────────────────────────
// INCREMENTO 3 — Estado del Conocimiento
// ─────────────────────────────────────────────────────────────────────────────

// ── 18. Conteos globales ──────────────────────────────────────────────────────

describe('computePerfilEstadoGlobal — conteos globales', () => {

  it('perfil vacío: todos los conteos son 0', () => {
    const estado = computePerfilEstadoGlobal(createPerfilLocalDeSalud('empty'))
    expect(estado.interpretacionesActivas).toBe(0)
    expect(estado.interpretacionesSuperadas).toBe(0)
    expect(estado.hipotesisActivas).toBe(0)
    expect(estado.hipotesisResueltas).toBe(0)
    expect(estado.hipotesisDescartadas).toBe(0)
    expect(estado.preguntasAbiertas).toBe(0)
    expect(estado.preguntasResueltas).toBe(0)
    expect(estado.tieneSintesis).toBe(false)
  })

  it('refleja correctamente una interpretación activa', () => {
    let p = createPerfilLocalDeSalud('mun-cnt')
    p = addInterpretation(p, { espacio: 'situacion-salud', enunciado: 'I.', certeza: 'alta', evidenciaIds: REF, autorNombre: 'T' })
    const estado = computePerfilEstadoGlobal(p)
    expect(estado.interpretacionesActivas).toBe(1)
    expect(estado.interpretacionesSuperadas).toBe(0)
  })

  it('refleja correctamente una interpretación superada', () => {
    let p = createPerfilLocalDeSalud('mun-sup')
    p = addInterpretation(p, { espacio: 'situacion-salud', enunciado: 'V1.', certeza: 'provisional', evidenciaIds: REF, autorNombre: 'T' })
    const idV1 = p.interpretaciones[0].id
    p = supersedeInterpretation(p, idV1, { espacio: 'situacion-salud', enunciado: 'V2.', certeza: 'alta', evidenciaIds: REF2, autorNombre: 'T' })
    const estado = computePerfilEstadoGlobal(p)
    expect(estado.interpretacionesActivas).toBe(1)
    expect(estado.interpretacionesSuperadas).toBe(1)
  })

  it('refleja correctamente hipótesis activa, resuelta y descartada', () => {
    let p = createPerfilLocalDeSalud('mun-hip-cnt')
    p = addHypothesis(p, { espacio: 'determinantes', enunciado: 'H-activa.', plausibilidad: 'alta', indicios: ['i'], preguntasResolutoras: [], autorNombre: 'T' })
    p = addHypothesis(p, { espacio: 'determinantes', enunciado: 'H-resuelta.', plausibilidad: 'moderada', indicios: ['i2'], preguntasResolutoras: [], autorNombre: 'T' })
    const hipIdResuelta = p.hipotesis[1].id
    p = resolveHypothesisAsInterpretation(p, hipIdResuelta, { espacio: 'determinantes', enunciado: 'Confirmada.', certeza: 'alta', evidenciaIds: REF, autorNombre: 'T' })
    p = addHypothesis(p, { espacio: 'desigualdades', enunciado: 'H-descartada.', plausibilidad: 'especulativa', indicios: [], preguntasResolutoras: [], autorNombre: 'T' })
    const hipIdDescartada = p.hipotesis[2].id
    p = discardHypothesis(p, hipIdDescartada, 'Datos contradicen.')
    const estado = computePerfilEstadoGlobal(p)
    expect(estado.hipotesisActivas).toBe(1)
    expect(estado.hipotesisResueltas).toBe(1)
    expect(estado.hipotesisDescartadas).toBe(1)
  })

  it('refleja preguntas abiertas y resueltas por separado', () => {
    let p = createPerfilLocalDeSalud('mun-pq-cnt')
    p = addOpenQuestion(p, { espacio: 'desigualdades', formulacion: '¿A?', relevancia: 'r', urgencia: 'alta', viasResolucion: ['v'] })
    p = addOpenQuestion(p, { espacio: 'activos', formulacion: '¿B?', relevancia: 'r', urgencia: 'media', viasResolucion: [] })
    const idResuelta = p.preguntasAbiertas[1].id
    p = resolveOpenQuestion(p, idResuelta, 'Resuelta.')
    const estado = computePerfilEstadoGlobal(p)
    expect(estado.preguntasAbiertas).toBe(1)
    expect(estado.preguntasResueltas).toBe(1)
  })

  it('tieneSintesis es true cuando hay texto de síntesis', () => {
    const p = updateSynthesis(createPerfilLocalDeSalud('mun-syn'), 'Texto.')
    expect(computePerfilEstadoGlobal(p).tieneSintesis).toBe(true)
  })

  it('tieneSintesis es false cuando no hay síntesis', () => {
    expect(computePerfilEstadoGlobal(createPerfilLocalDeSalud('mun-nosyn')).tieneSintesis).toBe(false)
  })

  it('ultimaActualizacion coincide con updatedAt del perfil', () => {
    const p = createPerfilLocalDeSalud('mun-ts')
    const estado = computePerfilEstadoGlobal(p)
    expect(estado.ultimaActualizacion).toBe(p.updatedAt)
  })

})

// ── 19. Estado por espacio y cobertura ────────────────────────────────────────

describe('computePerfilEstadoGlobal — espacios y cobertura', () => {

  it('perfil vacío: los 8 espacios existen y todos son "vacio"', () => {
    const estado = computePerfilEstadoGlobal(createPerfilLocalDeSalud('mun-spaces'))
    expect(estado.espacios).toHaveLength(8)
    expect(estado.espacios.every(s => s.cobertura === 'vacio')).toBe(true)
  })

  it('espacio con hipótesis activa (sin interpretación): cobertura "iniciado"', () => {
    let p = createPerfilLocalDeSalud('mun-iniciado')
    p = addHypothesis(p, { espacio: 'determinantes', enunciado: 'H.', plausibilidad: 'alta', indicios: ['i'], preguntasResolutoras: [], autorNombre: 'T' })
    const estado = computePerfilEstadoGlobal(p)
    const det = estado.espacios.find(s => s.espacio === 'determinantes')!
    expect(det.cobertura).toBe('iniciado')
    expect(det.hipotesisActivas).toBe(1)
    expect(det.interpretacionesActivas).toBe(0)
  })

  it('espacio con interpretación certeza="alta": cobertura "desarrollado"', () => {
    let p = createPerfilLocalDeSalud('mun-dev')
    p = addInterpretation(p, { espacio: 'situacion-salud', enunciado: 'I.', certeza: 'alta', evidenciaIds: REF, autorNombre: 'T' })
    const det = computePerfilEstadoGlobal(p).espacios.find(s => s.espacio === 'situacion-salud')!
    expect(det.cobertura).toBe('desarrollado')
    expect(det.interpretacionesActivas).toBe(1)
  })

  it('espacio con interpretación certeza="moderada": cobertura "desarrollado"', () => {
    let p = createPerfilLocalDeSalud('mun-mod')
    p = addInterpretation(p, { espacio: 'determinantes', enunciado: 'I.', certeza: 'moderada', evidenciaIds: REF, autorNombre: 'T' })
    const det = computePerfilEstadoGlobal(p).espacios.find(s => s.espacio === 'determinantes')!
    expect(det.cobertura).toBe('desarrollado')
  })

  it('espacio con interpretación certeza="provisional" únicamente: cobertura "pendiente-revision"', () => {
    let p = createPerfilLocalDeSalud('mun-pend')
    p = addInterpretation(p, { espacio: 'activos', enunciado: 'I provisional.', certeza: 'provisional', evidenciaIds: REF, autorNombre: 'T' })
    const det = computePerfilEstadoGlobal(p).espacios.find(s => s.espacio === 'activos')!
    expect(det.cobertura).toBe('pendiente-revision')
  })

  it('espacio con interpretaciones mixtas (provisional + alta): cobertura "desarrollado"', () => {
    let p = createPerfilLocalDeSalud('mun-mix')
    p = addInterpretation(p, { espacio: 'desigualdades', enunciado: 'I1 provisional.', certeza: 'provisional', evidenciaIds: REF, autorNombre: 'T' })
    p = addInterpretation(p, { espacio: 'desigualdades', enunciado: 'I2 alta.', certeza: 'alta', evidenciaIds: REF2, autorNombre: 'T' })
    const det = computePerfilEstadoGlobal(p).espacios.find(s => s.espacio === 'desigualdades')!
    expect(det.cobertura).toBe('desarrollado')
  })

  it('solo el espacio poblado tiene cobertura distinta de "vacio"', () => {
    let p = createPerfilLocalDeSalud('mun-one')
    p = addInterpretation(p, { espacio: 'activos', enunciado: 'I.', certeza: 'alta', evidenciaIds: REF, autorNombre: 'T' })
    const estado = computePerfilEstadoGlobal(p)
    const vacíos = estado.espacios.filter(s => s.cobertura === 'vacio')
    expect(vacíos).toHaveLength(7)
    const activos = estado.espacios.find(s => s.espacio === 'activos')!
    expect(activos.cobertura).toBe('desarrollado')
  })

  it('conteos por espacio reflejan solo los elementos del espacio', () => {
    let p = createPerfilLocalDeSalud('mun-scope')
    p = addInterpretation(p, { espacio: 'situacion-salud', enunciado: 'I.', certeza: 'alta', evidenciaIds: REF, autorNombre: 'T' })
    p = addHypothesis(p, { espacio: 'determinantes', enunciado: 'H.', plausibilidad: 'alta', indicios: [], preguntasResolutoras: [], autorNombre: 'T' })
    p = addOpenQuestion(p, { espacio: 'desigualdades', formulacion: '¿D?', relevancia: 'r', urgencia: 'media', viasResolucion: [] })
    const estado = computePerfilEstadoGlobal(p)
    const ss  = estado.espacios.find(s => s.espacio === 'situacion-salud')!
    const det = estado.espacios.find(s => s.espacio === 'determinantes')!
    const des = estado.espacios.find(s => s.espacio === 'desigualdades')!
    expect(ss.interpretacionesActivas).toBe(1)
    expect(ss.hipotesisActivas).toBe(0)
    expect(det.interpretacionesActivas).toBe(0)
    expect(det.hipotesisActivas).toBe(1)
    expect(des.preguntasAbiertas).toBe(1)
  })

})

// ── 20. Alertas metodológicas ─────────────────────────────────────────────────

describe('computePerfilEstadoGlobal — alertas metodológicas', () => {

  it('perfil vacío: sin alertas globales', () => {
    const estado = computePerfilEstadoGlobal(createPerfilLocalDeSalud('mun-noalert'))
    expect(estado.alertasGlobales).toHaveLength(0)
    expect(estado.espacios.every(s => s.alertas.length === 0)).toBe(true)
  })

  it('alerta "sintesis-ausente" cuando hay interpretaciones pero no hay síntesis', () => {
    let p = createPerfilLocalDeSalud('mun-nosyn')
    p = addInterpretation(p, { espacio: 'situacion-salud', enunciado: 'I.', certeza: 'alta', evidenciaIds: REF, autorNombre: 'T' })
    const estado = computePerfilEstadoGlobal(p)
    const alerta = estado.alertasGlobales.find(a => a.tipo === 'sintesis-ausente')
    expect(alerta).toBeDefined()
  })

  it('no alerta "sintesis-ausente" cuando el perfil está vacío', () => {
    const estado = computePerfilEstadoGlobal(createPerfilLocalDeSalud('mun-empty'))
    expect(estado.alertasGlobales.some(a => a.tipo === 'sintesis-ausente')).toBe(false)
  })

  it('no alerta "sintesis-ausente" cuando hay síntesis', () => {
    let p = createPerfilLocalDeSalud('mun-syn')
    p = addInterpretation(p, { espacio: 'situacion-salud', enunciado: 'I.', certeza: 'alta', evidenciaIds: REF, autorNombre: 'T' })
    p = updateSynthesis(p, 'Síntesis elaborada.')
    const estado = computePerfilEstadoGlobal(p)
    expect(estado.alertasGlobales.some(a => a.tipo === 'sintesis-ausente')).toBe(false)
  })

  it('alerta "sintesis-con-preguntas-criticas" cuando hay síntesis y preguntas urgencia=alta abiertas', () => {
    let p = createPerfilLocalDeSalud('mun-syncrit')
    p = updateSynthesis(p, 'Síntesis.')
    p = addOpenQuestion(p, { espacio: 'desigualdades', formulacion: '¿?', relevancia: 'r', urgencia: 'alta', viasResolucion: ['v'] })
    const estado = computePerfilEstadoGlobal(p)
    const alerta = estado.alertasGlobales.find(a => a.tipo === 'sintesis-con-preguntas-criticas')
    expect(alerta).toBeDefined()
    expect(alerta!.descripcion).toContain('1')
  })

  it('no alerta "sintesis-con-preguntas-criticas" cuando las preguntas urgencia=alta están resueltas', () => {
    let p = createPerfilLocalDeSalud('mun-resolved')
    p = updateSynthesis(p, 'Síntesis.')
    p = addOpenQuestion(p, { espacio: 'desigualdades', formulacion: '¿?', relevancia: 'r', urgencia: 'alta', viasResolucion: ['v'] })
    const idPQ = p.preguntasAbiertas[0].id
    p = resolveOpenQuestion(p, idPQ, 'Resuelta.')
    const estado = computePerfilEstadoGlobal(p)
    expect(estado.alertasGlobales.some(a => a.tipo === 'sintesis-con-preguntas-criticas')).toBe(false)
  })

  it('alerta "elemento-superado-sin-trazabilidad" cuando hay interpretación superada sin supersededById', () => {
    let p = createPerfilLocalDeSalud('mun-notrac')
    p = addInterpretation(p, { espacio: 'situacion-salud', enunciado: 'V1.', certeza: 'provisional', evidenciaIds: REF, autorNombre: 'T' })
    // Simular estado inconsistente: superada sin supersededById (edge case de datos anteriores)
    const idV1 = p.interpretaciones[0].id
    const perfilManipulado = {
      ...p,
      interpretaciones: p.interpretaciones.map(i =>
        i.id === idV1 ? { ...i, status: 'superada' as const } : i
      ),
    }
    const estado = computePerfilEstadoGlobal(perfilManipulado)
    const alerta = estado.alertasGlobales.find(a => a.tipo === 'elemento-superado-sin-trazabilidad')
    expect(alerta).toBeDefined()
    expect(alerta!.elementoId).toBe(idV1)
  })

  it('no alerta "elemento-superado-sin-trazabilidad" cuando supersedeInterpretation se usa correctamente', () => {
    let p = createPerfilLocalDeSalud('mun-trac')
    p = addInterpretation(p, { espacio: 'situacion-salud', enunciado: 'V1.', certeza: 'provisional', evidenciaIds: REF, autorNombre: 'T' })
    const idV1 = p.interpretaciones[0].id
    p = supersedeInterpretation(p, idV1, { espacio: 'situacion-salud', enunciado: 'V2.', certeza: 'alta', evidenciaIds: REF2, autorNombre: 'T' })
    const estado = computePerfilEstadoGlobal(p)
    expect(estado.alertasGlobales.some(a => a.tipo === 'elemento-superado-sin-trazabilidad')).toBe(false)
  })

  it('alerta por espacio "hipotesis-sin-indicios" para hipótesis activa sin indicios', () => {
    let p = createPerfilLocalDeSalud('mun-hipsin')
    p = addHypothesis(p, { espacio: 'determinantes', enunciado: 'H sin indicios.', plausibilidad: 'especulativa', indicios: [], preguntasResolutoras: [], autorNombre: 'T' })
    const estado = computePerfilEstadoGlobal(p)
    const det = estado.espacios.find(s => s.espacio === 'determinantes')!
    expect(det.alertas.some(a => a.tipo === 'hipotesis-sin-indicios')).toBe(true)
    expect(det.alertas[0].espacio).toBe('determinantes')
  })

  it('no alerta "hipotesis-sin-indicios" cuando la hipótesis tiene indicios', () => {
    let p = createPerfilLocalDeSalud('mun-hipcon')
    p = addHypothesis(p, { espacio: 'determinantes', enunciado: 'H con indicios.', plausibilidad: 'alta', indicios: ['indicio-1'], preguntasResolutoras: [], autorNombre: 'T' })
    const estado = computePerfilEstadoGlobal(p)
    const det = estado.espacios.find(s => s.espacio === 'determinantes')!
    expect(det.alertas.some(a => a.tipo === 'hipotesis-sin-indicios')).toBe(false)
  })

  it('alerta "pregunta-alta-urgencia-sin-via" para pregunta urgencia=alta sin vías', () => {
    let p = createPerfilLocalDeSalud('mun-pqsin')
    p = addOpenQuestion(p, { espacio: 'desigualdades', formulacion: '¿?', relevancia: 'r', urgencia: 'alta', viasResolucion: [] })
    const estado = computePerfilEstadoGlobal(p)
    const des = estado.espacios.find(s => s.espacio === 'desigualdades')!
    expect(des.alertas.some(a => a.tipo === 'pregunta-alta-urgencia-sin-via')).toBe(true)
  })

  it('no alerta por pregunta urgencia=media sin vías', () => {
    let p = createPerfilLocalDeSalud('mun-pqmed')
    p = addOpenQuestion(p, { espacio: 'desigualdades', formulacion: '¿?', relevancia: 'r', urgencia: 'media', viasResolucion: [] })
    const estado = computePerfilEstadoGlobal(p)
    const des = estado.espacios.find(s => s.espacio === 'desigualdades')!
    expect(des.alertas.some(a => a.tipo === 'pregunta-alta-urgencia-sin-via')).toBe(false)
  })

  it('no alerta por hipótesis descartada sin indicios (solo aplica a activas)', () => {
    let p = createPerfilLocalDeSalud('mun-hipdesc')
    p = addHypothesis(p, { espacio: 'determinantes', enunciado: 'H.', plausibilidad: 'especulativa', indicios: [], preguntasResolutoras: [], autorNombre: 'T' })
    const id = p.hipotesis[0].id
    p = discardHypothesis(p, id, 'Descartada.')
    const estado = computePerfilEstadoGlobal(p)
    const det = estado.espacios.find(s => s.espacio === 'determinantes')!
    expect(det.alertas.some(a => a.tipo === 'hipotesis-sin-indicios')).toBe(false)
  })

  it('varias alertas pueden coexistir en el mismo espacio', () => {
    let p = createPerfilLocalDeSalud('mun-multialert')
    p = addHypothesis(p, { espacio: 'determinantes', enunciado: 'H sin indicios.', plausibilidad: 'especulativa', indicios: [], preguntasResolutoras: [], autorNombre: 'T' })
    p = addOpenQuestion(p, { espacio: 'determinantes', formulacion: '¿?', relevancia: 'r', urgencia: 'alta', viasResolucion: [] })
    const estado = computePerfilEstadoGlobal(p)
    const det = estado.espacios.find(s => s.espacio === 'determinantes')!
    expect(det.alertas.length).toBeGreaterThanOrEqual(2)
    expect(det.alertas.some(a => a.tipo === 'hipotesis-sin-indicios')).toBe(true)
    expect(det.alertas.some(a => a.tipo === 'pregunta-alta-urgencia-sin-via')).toBe(true)
  })

})

// ── 21. Inmutabilidad del perfil ──────────────────────────────────────────────

describe('computePerfilEstadoGlobal — no mutación del perfil', () => {

  it('el perfil no se modifica tras el cálculo', () => {
    let p = createPerfilLocalDeSalud('mun-pure')
    p = addInterpretation(p, { espacio: 'situacion-salud', enunciado: 'I.', certeza: 'alta', evidenciaIds: REF, autorNombre: 'T' })
    p = addHypothesis(p, { espacio: 'determinantes', enunciado: 'H.', plausibilidad: 'alta', indicios: ['i'], preguntasResolutoras: [], autorNombre: 'T' })
    const updatedAtAntes = p.updatedAt
    const countAntes = p.interpretaciones.length
    computePerfilEstadoGlobal(p)
    expect(p.interpretaciones.length).toBe(countAntes)
    expect(p.updatedAt).toBe(updatedAtAntes)
  })

  it('múltiples llamadas a computePerfilEstadoGlobal producen el mismo resultado', () => {
    let p = createPerfilLocalDeSalud('mun-stable')
    p = addInterpretation(p, { espacio: 'activos', enunciado: 'I.', certeza: 'moderada', evidenciaIds: REF, autorNombre: 'T' })
    const estado1 = computePerfilEstadoGlobal(p)
    const estado2 = computePerfilEstadoGlobal(p)
    expect(estado1.interpretacionesActivas).toBe(estado2.interpretacionesActivas)
    expect(estado1.espacios.find(s => s.espacio === 'activos')!.cobertura)
      .toBe(estado2.espacios.find(s => s.espacio === 'activos')!.cobertura)
  })

})

// ── 16. updateSynthesis ───────────────────────────────────────────────────────

describe('updateSynthesis', () => {

  it('almacena la síntesis elaborada por el técnico', () => {
    const p = createPerfilLocalDeSalud('syn-test')
    const result = updateSynthesis(p, 'Atarfe presenta un perfil de vulnerabilidad múltiple concentrado en el barrio norte.')
    expect(result.sintesisTexto).toBe('Atarfe presenta un perfil de vulnerabilidad múltiple concentrado en el barrio norte.')
  })

  it('actualiza una síntesis existente sin perder la nueva', () => {
    let p = createPerfilLocalDeSalud('syn-test')
    p = updateSynthesis(p, 'Versión inicial.')
    p = updateSynthesis(p, 'Versión revisada con nuevos datos de GHQ-12.')
    expect(p.sintesisTexto).toBe('Versión revisada con nuevos datos de GHQ-12.')
  })

  it('no modifica el perfil original (inmutabilidad)', () => {
    const p = createPerfilLocalDeSalud('syn-test')
    updateSynthesis(p, 'Texto.')
    expect(p.sintesisTexto).toBeUndefined()
  })

  it('la síntesis sobrevive al round-trip JSON', () => {
    const perfil = updateSynthesis(createPerfilLocalDeSalud('syn-persist'), 'Texto persistido.')
    const ws: MunicipalityWorkspace = { ...makeWorkspace('syn-persist'), perfilLocalDeSalud: perfil }
    const rp = roundTrip(ws).perfilLocalDeSalud!
    expect(rp.sintesisTexto).toBe('Texto persistido.')
  })

})

// ── 17. Conservación del historial y ausencia de pérdida de información ───────

describe('Conservación del historial — ningún contenido humano se pierde', () => {

  it('una cadena completa de vida (add → update → supersede) conserva todos los estados', () => {
    let p = createPerfilLocalDeSalud('hist-test')
    p = addInterpretation(p, {
      espacio: 'situacion-salud', enunciado: 'V1: problema leve.',
      certeza: 'provisional', evidenciaIds: ['atom-1'], autorNombre: 'T',
    })
    const idV1 = p.interpretaciones[0].id
    p = updateInterpretation(p, idV1, { certeza: 'moderada' })
    p = supersedeInterpretation(p, idV1, {
      espacio: 'situacion-salud', enunciado: 'V2: problema moderado confirmado.',
      certeza: 'alta', evidenciaIds: ['atom-1', 'atom-2'], autorNombre: 'T',
    })
    // V1 sigue en el array, marcada como superada
    const v1 = p.interpretaciones.find(i => i.id === idV1)!
    expect(v1.status).toBe('superada')
    expect(v1.enunciado).toBe('V1: problema leve.')
    // V2 es activa
    const v2 = p.interpretaciones.find(i => i.status === 'activa')!
    expect(v2.enunciado).toBe('V2: problema moderado confirmado.')
    // La trazabilidad es completa
    expect(v1.supersededById).toBe(v2.id)
    expect(p.interpretaciones).toHaveLength(2)
  })

  it('una hipótesis descartada retiene todo su contenido original', () => {
    let p = createPerfilLocalDeSalud('hist-hip')
    p = addHypothesis(p, {
      espacio: 'determinantes', enunciado: 'H original con indicios.',
      plausibilidad: 'alta',
      indicios: ['indicio A', 'indicio B'],
      preguntasResolutoras: ['¿Pregunta clave?'],
      autorNombre: 'Autor original',
    })
    const id = p.hipotesis[0].id
    p = discardHypothesis(p, id, 'Refutada por datos.')
    const hip = p.hipotesis[0]
    expect(hip.indicios).toEqual(['indicio A', 'indicio B'])
    expect(hip.preguntasResolutoras).toEqual(['¿Pregunta clave?'])
    expect(hip.autorNombre).toBe('Autor original')
    expect(hip.discardedMotivo).toBe('Refutada por datos.')
  })

  it('una pregunta resuelta retiene su formulación e historial', () => {
    let p = createPerfilLocalDeSalud('hist-pq')
    p = addOpenQuestion(p, {
      espacio: 'desigualdades', formulacion: '¿Diferencias por barrio?',
      relevancia: 'Alta.', urgencia: 'alta',
      viasResolucion: ['Encuesta zonal'],
    })
    const id = p.preguntasAbiertas[0].id
    p = resolveOpenQuestion(p, id, 'La encuesta de 2026 muestra homogeneidad.')
    expect(p.preguntasAbiertas[0].formulacion).toBe('¿Diferencias por barrio?')
    expect(p.preguntasAbiertas[0].urgencia).toBe('alta')
    expect(p.preguntasAbiertas[0].viasResolucion).toEqual(['Encuesta zonal'])
    expect(p.preguntasAbiertas[0].status).toBe('resuelta')
    expect(p.preguntasAbiertas[0].resolucionNota).toContain('homogeneidad')
  })

  it('el ciclo de vida completo persiste íntegro en round-trip JSON', () => {
    let perfil = createPerfilLocalDeSalud('rt-lifecycle')

    // Interpretación V1 → superada por V2
    perfil = addInterpretation(perfil, {
      espacio: 'situacion-salud', enunciado: 'V1.', certeza: 'provisional',
      evidenciaIds: ['atom-a'], autorNombre: 'T',
    })
    const idV1 = perfil.interpretaciones[0].id
    perfil = supersedeInterpretation(perfil, idV1, {
      espacio: 'situacion-salud', enunciado: 'V2.', certeza: 'alta',
      evidenciaIds: ['atom-a', 'atom-b'], autorNombre: 'T',
    })

    // Hipótesis resuelta
    perfil = addHypothesis(perfil, {
      espacio: 'determinantes', enunciado: 'H resuelta.',
      plausibilidad: 'alta', indicios: ['i1'], preguntasResolutoras: ['q1'], autorNombre: 'T',
    })
    const hipId = perfil.hipotesis[0].id
    perfil = resolveHypothesisAsInterpretation(perfil, hipId, {
      espacio: 'determinantes', enunciado: 'H confirmada como interpretación.',
      certeza: 'alta', evidenciaIds: ['atom-c'], autorNombre: 'T',
    })

    // Pregunta resuelta
    perfil = addOpenQuestion(perfil, {
      espacio: 'desigualdades', formulacion: '¿PQ?', relevancia: 'r',
      urgencia: 'alta', viasResolucion: ['v'],
    })
    const pqId = perfil.preguntasAbiertas[0].id
    perfil = resolveOpenQuestion(perfil, pqId, 'Resuelta.')

    // Síntesis
    perfil = updateSynthesis(perfil, 'Síntesis final del municipio.')

    const ws: MunicipalityWorkspace = { ...makeWorkspace('rt-lifecycle'), perfilLocalDeSalud: perfil }
    const rp = roundTrip(ws).perfilLocalDeSalud!

    // Interpretaciones: V1 superada + V2 activa + la de la hipótesis
    expect(rp.interpretaciones).toHaveLength(3)
    expect(rp.interpretaciones.find(i => i.id === idV1)?.status).toBe('superada')
    const v2 = rp.interpretaciones.find(i => i.enunciado === 'V2.')!
    expect(v2.status).toBe('activa')

    // Hipótesis resuelta
    expect(rp.hipotesis[0].status).toBe('resuelta-como-interpretacion')
    expect(rp.hipotesis[0].resolvedById).toBeDefined()

    // Pregunta resuelta
    expect(rp.preguntasAbiertas[0].status).toBe('resuelta')
    expect(rp.preguntasAbiertas[0].resolucionNota).toBe('Resuelta.')

    // Síntesis
    expect(rp.sintesisTexto).toBe('Síntesis final del municipio.')
  })

})

// ─────────────────────────────────────────────────────────────────────────────
// INCREMENTO 4 — Estado del Conocimiento (nivel superior)
// ─────────────────────────────────────────────────────────────────────────────

// ── 22. nivelEstado ───────────────────────────────────────────────────────────

describe('computeEstadoDelConocimiento — nivelEstado', () => {

  it('perfil vacío → "vacio"', () => {
    const estado = computeEstadoDelConocimiento(createPerfilLocalDeSalud('mun-vacio'))
    expect(estado.nivelEstado).toBe('vacio')
  })

  it('solo hipótesis activa (sin interpretación) → "en-construccion"', () => {
    let p = createPerfilLocalDeSalud('mun-hip-solo')
    p = addHypothesis(p, { espacio: 'determinantes', enunciado: 'H.', plausibilidad: 'alta', indicios: ['i'], preguntasResolutoras: [], autorNombre: 'T' })
    expect(computeEstadoDelConocimiento(p).nivelEstado).toBe('en-construccion')
  })

  it('interpretación activa sin síntesis → "en-construccion"', () => {
    let p = createPerfilLocalDeSalud('mun-nosin')
    p = addInterpretation(p, { espacio: 'situacion-salud', enunciado: 'I.', certeza: 'alta', evidenciaIds: REF, autorNombre: 'T' })
    expect(computeEstadoDelConocimiento(p).nivelEstado).toBe('en-construccion')
  })

  it('interpretación activa + síntesis sin espacio desarrollado → "en-construccion"', () => {
    // certeza=provisional no da cobertura "desarrollado"
    let p = createPerfilLocalDeSalud('mun-prov')
    p = addInterpretation(p, { espacio: 'activos', enunciado: 'I provisional.', certeza: 'provisional', evidenciaIds: REF, autorNombre: 'T' })
    p = updateSynthesis(p, 'Síntesis.')
    expect(computeEstadoDelConocimiento(p).nivelEstado).toBe('en-construccion')
  })

  it('criterios mínimos cumplidos + alertas globales → "cobertura-minima"', () => {
    // síntesis + pregunta urgencia=alta abierta → alerta sintesis-con-preguntas-criticas
    let p = createPerfilLocalDeSalud('mun-cmin')
    p = addInterpretation(p, { espacio: 'situacion-salud', enunciado: 'I.', certeza: 'alta', evidenciaIds: REF, autorNombre: 'T' })
    p = updateSynthesis(p, 'Síntesis.')
    p = addOpenQuestion(p, { espacio: 'desigualdades', formulacion: '¿?', relevancia: 'r', urgencia: 'alta', viasResolucion: ['v'] })
    expect(computeEstadoDelConocimiento(p).nivelEstado).toBe('cobertura-minima')
  })

  it('criterios mínimos cumplidos + sin alertas globales → "estructuralmente-completo"', () => {
    let p = createPerfilLocalDeSalud('mun-completo')
    p = addInterpretation(p, { espacio: 'situacion-salud', enunciado: 'I.', certeza: 'alta', evidenciaIds: REF, autorNombre: 'T' })
    p = updateSynthesis(p, 'Síntesis.')
    // Sin preguntas abiertas urgencia=alta ni interpretaciones superadas sin trazabilidad
    expect(computeEstadoDelConocimiento(p).nivelEstado).toBe('estructuralmente-completo')
  })

})

// ── 23. Criterios de cobertura ────────────────────────────────────────────────

describe('computeEstadoDelConocimiento — criterios de cobertura', () => {

  it('perfil vacío: los 3 criterios existen y todos tienen cumplido=false', () => {
    const { criteriosCobertura } = computeEstadoDelConocimiento(createPerfilLocalDeSalud('mun-crit-vacio'))
    expect(criteriosCobertura).toHaveLength(3)
    expect(criteriosCobertura.every(c => !c.cumplido)).toBe(true)
  })

  it('los ids de criterios son estables entre llamadas distintas', () => {
    const ids1 = computeEstadoDelConocimiento(createPerfilLocalDeSalud('mun-ids-a')).criteriosCobertura.map(c => c.id)
    const ids2 = computeEstadoDelConocimiento(createPerfilLocalDeSalud('mun-ids-b')).criteriosCobertura.map(c => c.id)
    expect(ids1).toEqual(ids2)
  })

  it('criterio "tiene-interpretacion-activa" pasa al añadir interpretación activa', () => {
    let p = createPerfilLocalDeSalud('mun-crit-interp')
    p = addInterpretation(p, { espacio: 'situacion-salud', enunciado: 'I.', certeza: 'alta', evidenciaIds: REF, autorNombre: 'T' })
    const crit = computeEstadoDelConocimiento(p).criteriosCobertura.find(c => c.id === 'tiene-interpretacion-activa')!
    expect(crit.cumplido).toBe(true)
  })

  it('criterio "tiene-sintesis" pasa al añadir síntesis', () => {
    const p = updateSynthesis(createPerfilLocalDeSalud('mun-crit-syn'), 'Texto.')
    const crit = computeEstadoDelConocimiento(p).criteriosCobertura.find(c => c.id === 'tiene-sintesis')!
    expect(crit.cumplido).toBe(true)
  })

  it('criterio "tiene-espacio-desarrollado" pasa con interpretación certeza="alta"', () => {
    let p = createPerfilLocalDeSalud('mun-crit-dev')
    p = addInterpretation(p, { espacio: 'activos', enunciado: 'I.', certeza: 'alta', evidenciaIds: REF, autorNombre: 'T' })
    const crit = computeEstadoDelConocimiento(p).criteriosCobertura.find(c => c.id === 'tiene-espacio-desarrollado')!
    expect(crit.cumplido).toBe(true)
  })

  it('criterio "tiene-espacio-desarrollado" no pasa con interpretación certeza="provisional"', () => {
    let p = createPerfilLocalDeSalud('mun-crit-prov')
    p = addInterpretation(p, { espacio: 'activos', enunciado: 'I.', certeza: 'provisional', evidenciaIds: REF, autorNombre: 'T' })
    const crit = computeEstadoDelConocimiento(p).criteriosCobertura.find(c => c.id === 'tiene-espacio-desarrollado')!
    expect(crit.cumplido).toBe(false)
  })

})

// ── 24. coberturaMinimaCumplida ───────────────────────────────────────────────

describe('computeEstadoDelConocimiento — coberturaMinimaCumplida', () => {

  it('false cuando falta al menos un criterio', () => {
    let p = createPerfilLocalDeSalud('mun-cob-false')
    p = addInterpretation(p, { espacio: 'situacion-salud', enunciado: 'I.', certeza: 'alta', evidenciaIds: REF, autorNombre: 'T' })
    // falta síntesis y espacio desarrollado (ambos incumplidos — en realidad espacio sí desarrollado)
    // falta síntesis
    expect(computeEstadoDelConocimiento(p).coberturaMinimaCumplida).toBe(false)
  })

  it('true cuando los 3 criterios están cumplidos', () => {
    let p = createPerfilLocalDeSalud('mun-cob-true')
    p = addInterpretation(p, { espacio: 'situacion-salud', enunciado: 'I.', certeza: 'alta', evidenciaIds: REF, autorNombre: 'T' })
    p = updateSynthesis(p, 'Síntesis.')
    expect(computeEstadoDelConocimiento(p).coberturaMinimaCumplida).toBe(true)
  })

})

// ── 25. Reutilización de computePerfilEstadoGlobal ────────────────────────────

describe('computeEstadoDelConocimiento — reutilización del cálculo base', () => {

  it('estado.base es igual al resultado de computePerfilEstadoGlobal(perfil)', () => {
    let p = createPerfilLocalDeSalud('mun-reuse')
    p = addInterpretation(p, { espacio: 'situacion-salud', enunciado: 'I.', certeza: 'moderada', evidenciaIds: REF, autorNombre: 'T' })
    p = addHypothesis(p, { espacio: 'determinantes', enunciado: 'H.', plausibilidad: 'alta', indicios: ['i'], preguntasResolutoras: [], autorNombre: 'T' })
    const base       = computePerfilEstadoGlobal(p)
    const { base: baseDesde } = computeEstadoDelConocimiento(p)
    expect(baseDesde.interpretacionesActivas).toBe(base.interpretacionesActivas)
    expect(baseDesde.hipotesisActivas).toBe(base.hipotesisActivas)
    expect(baseDesde.tieneSintesis).toBe(base.tieneSintesis)
    expect(baseDesde.alertasGlobales).toHaveLength(base.alertasGlobales.length)
    expect(baseDesde.espacios).toHaveLength(base.espacios.length)
  })

})

// ── 26. Inmutabilidad ─────────────────────────────────────────────────────────

describe('computeEstadoDelConocimiento — inmutabilidad', () => {

  it('no modifica el perfil original', () => {
    let p = createPerfilLocalDeSalud('mun-inmut')
    p = addInterpretation(p, { espacio: 'activos', enunciado: 'I.', certeza: 'alta', evidenciaIds: REF, autorNombre: 'T' })
    const updatedAtAntes = p.updatedAt
    const countAntes = p.interpretaciones.length
    computeEstadoDelConocimiento(p)
    expect(p.interpretaciones.length).toBe(countAntes)
    expect(p.updatedAt).toBe(updatedAtAntes)
  })

  it('múltiples llamadas producen el mismo nivelEstado', () => {
    let p = createPerfilLocalDeSalud('mun-stable2')
    p = addInterpretation(p, { espacio: 'situacion-salud', enunciado: 'I.', certeza: 'alta', evidenciaIds: REF, autorNombre: 'T' })
    p = updateSynthesis(p, 'Síntesis.')
    const e1 = computeEstadoDelConocimiento(p)
    const e2 = computeEstadoDelConocimiento(p)
    expect(e1.nivelEstado).toBe(e2.nivelEstado)
    expect(e1.coberturaMinimaCumplida).toBe(e2.coberturaMinimaCumplida)
    expect(e1.criteriosCobertura.map(c => c.cumplido))
      .toEqual(e2.criteriosCobertura.map(c => c.cumplido))
  })

})
