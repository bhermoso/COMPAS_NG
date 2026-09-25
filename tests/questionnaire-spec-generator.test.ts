/**
 * tests/questionnaire-spec-generator.test.ts
 *
 * Pruebas de contrato del generador de especificación metodológica (Intervención 5).
 *
 * Contratos protegidos:
 *   - Tipo de artefacto (kind, mimeType)
 *   - Identificadores y trazabilidad (questionnaireId, name, createdAt)
 *   - Contenido: nombre de la encuesta, módulos incluidos, tiempo estimado
 *   - Bloque sociodemográfico en la especificación
 *   - Advertencias para módulos en estado "draft"
 *   - Metadatos calculados (totalItems, tiempos, draftModuleCount)
 *   - Robustez: encuestas sin módulos, módulos con items vacíos
 */

import { describe, it, expect } from 'vitest'
import { createQuestionnaire, generateMethodologicalSpecArtifact } from '../src/application/questionnaire'
import type { QuestionnaireProject } from '../src/domain/questionnaire'

// ── Helper ────────────────────────────────────────────────────────────────────

function makeProject(
  id: string,
  name: string,
  moduleIds: string[],
  classificationBlocks: string[] = [],
  description?: string,
): QuestionnaireProject {
  const now = '2026-07-02T08:00:00.000Z'
  return {
    id,
    name,
    description,
    status: 'draft',
    questionnaire: createQuestionnaire({
      id,
      name,
      methodologicalModules: moduleIds,
      classificationBlocks: classificationBlocks as never[],
    }),
    requestedOutputs: ['redcap'],
    createdAt: now,
    updatedAt: now,
  }
}

// ══════════════════════════════════════════════════════════════════════════════
// Tipo y estructura del artefacto
// ══════════════════════════════════════════════════════════════════════════════

describe('generateMethodologicalSpecArtifact() — tipo y estructura', () => {

  const project = makeProject('q-001', 'Encuesta de Salud 2026', ['ibse'])
  const artifact = generateMethodologicalSpecArtifact(project)

  it('kind es "methodological-spec"', () => {
    expect(artifact.kind).toBe('methodological-spec')
  })

  it('mimeType es "text/plain"', () => {
    expect(artifact.mimeType).toBe('text/plain')
  })

  it('questionnaireId coincide con el id del cuestionario', () => {
    expect(artifact.questionnaireId).toBe('q-001')
  })

  it('name sigue el patrón "{project.name} — Especificación Metodológica.txt"', () => {
    expect(artifact.name).toBe('Encuesta de Salud 2026 — Especificación Metodológica.txt')
  })

  it('id es un string no vacío (UUID)', () => {
    expect(artifact.id).toBeTruthy()
    expect(typeof artifact.id).toBe('string')
  })

  it('cada llamada genera un id distinto', () => {
    const a2 = generateMethodologicalSpecArtifact(project)
    expect(artifact.id).not.toBe(a2.id)
  })

  it('createdAt es un timestamp ISO 8601 válido', () => {
    expect(() => new Date(artifact.createdAt).toISOString()).not.toThrow()
    expect(artifact.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
  })

  it('content es una cadena no vacía', () => {
    expect(artifact.content).toBeTruthy()
    expect(typeof artifact.content).toBe('string')
  })

})

// ══════════════════════════════════════════════════════════════════════════════
// Contenido — cabecera e identificación
// ══════════════════════════════════════════════════════════════════════════════

describe('generateMethodologicalSpecArtifact() — contenido: cabecera', () => {

  it('el contenido incluye el nombre de la encuesta', () => {
    const project = makeProject('x', 'Encuesta Piloto Atarfe', ['ibse'])
    const { content } = generateMethodologicalSpecArtifact(project)
    expect(content).toContain('Encuesta Piloto Atarfe')
  })

  it('el contenido incluye la fecha de generación (YYYY-MM-DD)', () => {
    const project = makeProject('x', 'x', ['ibse'])
    const { content } = generateMethodologicalSpecArtifact(project)
    expect(content).toMatch(/\d{4}-\d{2}-\d{2}/)
  })

  it('la descripción del proyecto aparece cuando se proporciona', () => {
    const project = makeProject('x', 'x', ['ibse'], [], 'Descripción de prueba')
    const { content } = generateMethodologicalSpecArtifact(project)
    expect(content).toContain('Descripción de prueba')
  })

  it('la descripción no aparece cuando no se proporciona', () => {
    const project = makeProject('x', 'x', ['ibse'])
    const { content } = generateMethodologicalSpecArtifact(project)
    expect(content).not.toContain('Descripción:')
  })

  it('el contenido incluye el título canónico "ESPECIFICACIÓN METODOLÓGICA — COMPÁS NG"', () => {
    const project = makeProject('x', 'x', ['ibse'])
    const { content } = generateMethodologicalSpecArtifact(project)
    expect(content).toContain('ESPECIFICACIÓN METODOLÓGICA — COMPÁS NG')
  })

})

// ══════════════════════════════════════════════════════════════════════════════
// Contenido — resumen y totales
// ══════════════════════════════════════════════════════════════════════════════

describe('generateMethodologicalSpecArtifact() — contenido: resumen y totales', () => {

  it('el resumen muestra el número total de ítems (IBSE = 8)', () => {
    const project = makeProject('x', 'x', ['ibse'])
    const { content } = generateMethodologicalSpecArtifact(project)
    expect(content).toContain('8')
  })

  it('el resumen muestra el tiempo estimado para IBSE (5–8 minutos)', () => {
    const project = makeProject('x', 'x', ['ibse'])
    const { content } = generateMethodologicalSpecArtifact(project)
    expect(content).toContain('5–8')
  })

  it('el tiempo se acumula correctamente para IBSE + DUKE (5+4=9 mín — 8+6=14 máx)', () => {
    const project = makeProject('x', 'x', ['ibse', 'duke-eas'])
    const { content } = generateMethodologicalSpecArtifact(project)
    expect(content).toContain('9–14')
  })

  it('el total de ítems es correcto para IBSE (8) + DUKE (11) = 19', () => {
    const project = makeProject('x', 'x', ['ibse', 'duke-eas'])
    const { content } = generateMethodologicalSpecArtifact(project)
    expect(content).toContain('19')
  })

  it('el output seleccionado aparece en el resumen', () => {
    const project = makeProject('x', 'x', ['ibse'])
    const { content } = generateMethodologicalSpecArtifact(project)
    expect(content).toContain('redcap')
  })

})

describe('generateMethodologicalSpecArtifact() — estimaciones homogéneas', () => {

  const expectedTimes: Array<[string, string, string]> = [
    ['auditc', '1', '2'],
    ['ipaq-eas', '0', '0'],
    ['ghq12', '4', '6'],
    ['phq9', '3', '5'],
    ['psqi', '3', '5'],
    ['fagerstrom', '2', '3'],
    ['sbq', '3', '5'],
  ]

  it.each(expectedTimes)('%s usa el intervalo %s–%s minutos', (moduleId, min, max) => {
    const project = makeProject(`q-${moduleId}`, moduleId, [moduleId])
    const { metadata, content } = generateMethodologicalSpecArtifact(project)

    expect(metadata?.estimatedTimeMin).toBe(min)
    expect(metadata?.estimatedTimeMax).toBe(max)
    expect(content).toContain(`${min}–${max} minutos`)
  })

})

// ══════════════════════════════════════════════════════════════════════════════
// Contenido — instrumentos metodológicos
// ══════════════════════════════════════════════════════════════════════════════

describe('generateMethodologicalSpecArtifact() — contenido: instrumentos', () => {

  it('el nombre corto del módulo IBSE aparece en la especificación', () => {
    const project = makeProject('x', 'x', ['ibse'])
    const { content } = generateMethodologicalSpecArtifact(project)
    expect(content).toContain('IBSE')
  })

  it('el nombre corto del módulo DUKE aparece en la especificación', () => {
    const project = makeProject('x', 'x', ['duke-eas'])
    const { content } = generateMethodologicalSpecArtifact(project)
    expect(content).toContain('DUKE-EAS')
  })

  it('la versión del módulo aparece en la especificación', () => {
    const project = makeProject('x', 'x', ['ibse'])
    const { content } = generateMethodologicalSpecArtifact(project)
    expect(content).toContain('1.0.0')
  })

  it('el estado del módulo aparece en la especificación', () => {
    const project = makeProject('x', 'x', ['ibse'])
    const { content } = generateMethodologicalSpecArtifact(project)
    expect(content).toContain('draft')
  })

  it('la sección "BIBLIOGRAFÍA" aparece cuando hay módulos', () => {
    const project = makeProject('x', 'x', ['ibse'])
    const { content } = generateMethodologicalSpecArtifact(project)
    expect(content).toContain('BIBLIOGRAFÍA')
  })

  it('una composición de múltiples módulos numera cada sección correctamente', () => {
    const project = makeProject('x', 'x', ['ibse', 'duke-eas', 'predimed-eas'])
    const { content } = generateMethodologicalSpecArtifact(project)
    expect(content).toContain('[1]')
    expect(content).toContain('[2]')
    expect(content).toContain('[3]')
  })

  it('un módulo con items vacíos (SF-12) aparece con "Ítems: 0" sin fallar', () => {
    const project = makeProject('x', 'x', ['sf12-eas'])
    const { content } = generateMethodologicalSpecArtifact(project)
    expect(content).toContain('SF-12 EAS')
    expect(content).toContain('0')
  })

})

// ══════════════════════════════════════════════════════════════════════════════
// Contenido — bloque sociodemográfico
// ══════════════════════════════════════════════════════════════════════════════

describe('generateMethodologicalSpecArtifact() — contenido: bloque sociodemográfico', () => {

  it('sin bloque sociodemográfico, no aparece la sección SD', () => {
    const project = makeProject('x', 'x', ['ibse'])
    const { content } = generateMethodologicalSpecArtifact(project)
    expect(content).not.toContain('BLOQUE DE IDENTIFICACIÓN')
  })

  it('con bloque "eas-sociodemographic", aparece la sección "BLOQUE DE IDENTIFICACIÓN Y CLASIFICACIÓN"', () => {
    const project = makeProject('x', 'x', ['ibse'], ['eas-sociodemographic'])
    const { content } = generateMethodologicalSpecArtifact(project)
    expect(content).toContain('BLOQUE DE IDENTIFICACIÓN Y CLASIFICACIÓN')
  })

  it('la sección SD muestra "datos_basicos" como nombre del formulario REDCap', () => {
    const project = makeProject('x', 'x', [], ['eas-sociodemographic'])
    const { content } = generateMethodologicalSpecArtifact(project)
    expect(content).toContain('datos_basicos')
  })

  it('la variable "sexo" aparece en la sección SD', () => {
    const project = makeProject('x', 'x', [], ['eas-sociodemographic'])
    const { content } = generateMethodologicalSpecArtifact(project)
    expect(content).toContain('sexo')
  })

  it('la variable "anio_nacimiento" aparece en la sección SD', () => {
    const project = makeProject('x', 'x', [], ['eas-sociodemographic'])
    const { content } = generateMethodologicalSpecArtifact(project)
    expect(content).toContain('anio_nacimiento')
  })

  it('el bloque SD añade 6 al total de ítems y 2 minutos al tiempo mínimo', () => {
    const projectSin = makeProject('x', 'x', ['ibse'])
    const projectCon = makeProject('x', 'x', ['ibse'], ['eas-sociodemographic'])
    const metaSin = generateMethodologicalSpecArtifact(projectSin).metadata!
    const metaCon = generateMethodologicalSpecArtifact(projectCon).metadata!

    expect(Number(metaCon.totalItems) - Number(metaSin.totalItems)).toBe(6)
    expect(Number(metaCon.estimatedTimeMin) - Number(metaSin.estimatedTimeMin)).toBe(2)
  })

})

// ══════════════════════════════════════════════════════════════════════════════
// Contenido — advertencias para módulos draft
// ══════════════════════════════════════════════════════════════════════════════

describe('generateMethodologicalSpecArtifact() — contenido: advertencias metodológicas', () => {

  it('los módulos en estado "draft" generan la sección "ADVERTENCIAS METODOLÓGICAS"', () => {
    // Todos los módulos actuales están en draft
    const project = makeProject('x', 'x', ['ibse'])
    const { content } = generateMethodologicalSpecArtifact(project)
    expect(content).toContain('ADVERTENCIAS METODOLÓGICAS')
  })

  it('la sección de advertencias menciona el acrónimo del módulo draft', () => {
    const project = makeProject('x', 'x', ['ibse'])
    const { content } = generateMethodologicalSpecArtifact(project)
    // La sección de advertencias debe mencionar IBSE
    const warningIdx = content.indexOf('ADVERTENCIAS METODOLÓGICAS')
    expect(warningIdx).toBeGreaterThan(-1)
    expect(content.slice(warningIdx)).toContain('IBSE')
  })

})

// ══════════════════════════════════════════════════════════════════════════════
// Metadatos calculados
// ══════════════════════════════════════════════════════════════════════════════

describe('generateMethodologicalSpecArtifact() — metadatos calculados', () => {

  it('metadata.totalItems es correcto para IBSE (8)', () => {
    const project = makeProject('x', 'x', ['ibse'])
    const { metadata } = generateMethodologicalSpecArtifact(project)
    expect(metadata?.totalItems).toBe('8')
  })

  it('metadata.totalItems es correcto para SD + DUKE (6 + 11 = 17)', () => {
    const project = makeProject('x', 'x', ['duke-eas'], ['eas-sociodemographic'])
    const { metadata } = generateMethodologicalSpecArtifact(project)
    expect(metadata?.totalItems).toBe('17')
  })

  it('metadata.estimatedTimeMin es correcto para IBSE (5)', () => {
    const project = makeProject('x', 'x', ['ibse'])
    const { metadata } = generateMethodologicalSpecArtifact(project)
    expect(metadata?.estimatedTimeMin).toBe('5')
  })

  it('metadata.estimatedTimeMax es correcto para IBSE (8)', () => {
    const project = makeProject('x', 'x', ['ibse'])
    const { metadata } = generateMethodologicalSpecArtifact(project)
    expect(metadata?.estimatedTimeMax).toBe('8')
  })

  it('metadata.draftModuleCount refleja el número de módulos en draft', () => {
    // Todos los módulos actuales son draft
    const project = makeProject('x', 'x', ['ibse', 'duke-eas'])
    const { metadata } = generateMethodologicalSpecArtifact(project)
    expect(metadata?.draftModuleCount).toBe('2')
  })

  it('metadata.blockCount incluye el bloque SD cuando está presente', () => {
    const projectSin = makeProject('x', 'x', ['ibse'])
    const projectCon = makeProject('x', 'x', ['ibse'], ['eas-sociodemographic'])
    const metaSin = generateMethodologicalSpecArtifact(projectSin).metadata!
    const metaCon = generateMethodologicalSpecArtifact(projectCon).metadata!
    expect(Number(metaCon.blockCount) - Number(metaSin.blockCount)).toBe(1)
  })

})

// ══════════════════════════════════════════════════════════════════════════════
// Robustez
// ══════════════════════════════════════════════════════════════════════════════

describe('generateMethodologicalSpecArtifact() — robustez', () => {

  it('una encuesta sin módulos ni bloque SD genera un artefacto válido', () => {
    const project = makeProject('x', 'Encuesta Vacía', [])
    const artifact = generateMethodologicalSpecArtifact(project)
    expect(artifact.kind).toBe('methodological-spec')
    expect(artifact.content).toContain('Encuesta Vacía')
    expect(artifact.metadata?.totalItems).toBe('0')
    expect(artifact.metadata?.estimatedTimeMin).toBe('0')
  })

  it('lanza error para un moduleId no registrado', () => {
    const project = makeProject('x', 'x', ['ibse'])
    const invalid = { ...project, questionnaire: { ...project.questionnaire, methodologicalModules: ['no-existe'] } }
    expect(() => generateMethodologicalSpecArtifact(invalid)).toThrow('no-existe')
  })

  it('el pie de página institucional aparece siempre', () => {
    const project = makeProject('x', 'x', [])
    const { content } = generateMethodologicalSpecArtifact(project)
    expect(content).toContain('Generado con COMPÁS NG — Gestor de Encuestas de Salud (GES)')
  })

  it('la sección de compatibilidad con COMPÁS NG aparece siempre', () => {
    const project = makeProject('x', 'x', [])
    const { content } = generateMethodologicalSpecArtifact(project)
    expect(content).toContain('COMPATIBILIDAD CON COMPÁS NG')
    expect(content).toContain('EvidenceAtoms → EvidenceStore → MIT → PSL')
  })

})
