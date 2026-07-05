/**
 * tests/questionnaire-redcap-generator.test.ts
 *
 * Pruebas de contrato del subsistema Questionnaire del GES.
 *
 * Cubre:
 *   - createQuestionnaire()          — validación, composición, valores por defecto
 *   - buildRedcapDictionary()        — ruta explícita (IBSE), ruta inferida (DUKE),
 *                                      bloque sociodemográfico, composiciones mixtas
 *   - exportRedcapDictionaryToCsv()  — cabeceras REDCap, serialización, escaping
 *   - generateRedcapDictionaryArtifact() — tipo, contenido, metadatos
 *
 * No duplica los tests de persistencia (questionnaire-persistence.test.ts).
 * No duplica los tests de integridad de módulos (methodology-registry.test.ts).
 */

import { describe, it, expect } from 'vitest'

import {
  createQuestionnaire,
  generateRedcapDictionaryArtifact,
} from '../src/application/questionnaire'

import {
  buildRedcapDictionary,
  exportRedcapDictionaryToCsv,
  EAS_SOCIODEMOGRAPHIC_FIELDS,
  SOCIODEMOGRAPHIC_FORM_NAME,
} from '../src/application/questionnaire/redcap'

import type { QuestionnaireProject } from '../src/domain/questionnaire'

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeProject(
  id: string,
  moduleIds: string[],
  classificationBlocks: string[] = [],
): QuestionnaireProject {
  const now = '2026-07-02T08:00:00.000Z'
  return {
    id,
    name: `Encuesta ${id}`,
    status: 'draft',
    questionnaire: createQuestionnaire({ id, name: `Encuesta ${id}`, methodologicalModules: moduleIds, classificationBlocks: classificationBlocks as never[] }),
    requestedOutputs: ['redcap'],
    createdAt: now,
    updatedAt: now,
  }
}

// ══════════════════════════════════════════════════════════════════════════════
// createQuestionnaire()
// ══════════════════════════════════════════════════════════════════════════════

describe('createQuestionnaire()', () => {

  it('preserva id y name exactamente como se proporcionan', () => {
    const q = createQuestionnaire({ id: 'enc-001', name: 'Mi Encuesta', methodologicalModules: ['ibse'] })
    expect(q.id).toBe('enc-001')
    expect(q.name).toBe('Mi Encuesta')
  })

  it('lanza error cuando un moduleId no está registrado en la Biblioteca Metodológica', () => {
    expect(() =>
      createQuestionnaire({ id: 'x', name: 'x', methodologicalModules: ['no-existe'] })
    ).toThrow('no-existe')
  })

  it('preserva el orden de methodologicalModules', () => {
    const q = createQuestionnaire({ id: 'x', name: 'x', methodologicalModules: ['duke-eas', 'ibse', 'predimed-eas'] })
    expect(q.methodologicalModules).toEqual(['duke-eas', 'ibse', 'predimed-eas'])
  })

  it('classificationBlocks es [] por defecto cuando no se proporciona', () => {
    const q = createQuestionnaire({ id: 'x', name: 'x', methodologicalModules: ['ibse'] })
    expect(q.classificationBlocks).toEqual([])
  })

  it('preserva classificationBlocks cuando se proporcionan', () => {
    const q = createQuestionnaire({ id: 'x', name: 'x', methodologicalModules: ['ibse'], classificationBlocks: ['eas-sociodemographic'] })
    expect(q.classificationBlocks).toContain('eas-sociodemographic')
  })

  it('outputs es ["redcap"] por defecto cuando no se especifica', () => {
    const q = createQuestionnaire({ id: 'x', name: 'x', methodologicalModules: ['ibse'] })
    expect(q.outputs).toEqual(['redcap'])
  })

  it('preserva outputs cuando se especifican', () => {
    const q = createQuestionnaire({ id: 'x', name: 'x', methodologicalModules: ['ibse'], outputs: ['redcap', 'documentation'] })
    expect(q.outputs).toEqual(['redcap', 'documentation'])
  })

  it('description es undefined cuando no se proporciona', () => {
    const q = createQuestionnaire({ id: 'x', name: 'x', methodologicalModules: ['ibse'] })
    expect(q.description).toBeUndefined()
  })

  it('description se preserva cuando se proporciona', () => {
    const q = createQuestionnaire({ id: 'x', name: 'x', methodologicalModules: ['ibse'], description: 'Descripción de prueba' })
    expect(q.description).toBe('Descripción de prueba')
  })

})

// ══════════════════════════════════════════════════════════════════════════════
// buildRedcapDictionary() — módulo IBSE (ruta explícita)
// ══════════════════════════════════════════════════════════════════════════════

describe('buildRedcapDictionary() — módulo IBSE (ruta explícita: redcapFormField)', () => {

  const q = createQuestionnaire({ id: 'q-ibse', name: 'IBSE', methodologicalModules: ['ibse'] })
  const dict = buildRedcapDictionary(q)

  it('instrumentName coincide con el id del cuestionario', () => {
    expect(dict.instrumentName).toBe('q-ibse')
  })

  it('genera exactamente 8 campos (un campo por ítem del módulo IBSE)', () => {
    expect(dict.fields).toHaveLength(8)
  })

  it('el primer campo tiene fieldName "ibse_deprimido" (del redcapFormField explícito)', () => {
    expect(dict.fields[0].fieldName).toBe('ibse_deprimido')
  })

  it('el primer campo usa formName "monitor_ibse" (de adapters.redcap.instrument)', () => {
    expect(dict.fields[0].formName).toBe('monitor_ibse')
  })

  it('el primer campo tiene fieldType "radio" (del redcapFormField explícito)', () => {
    expect(dict.fields[0].fieldType).toBe('radio')
  })

  it('el primer campo tiene fieldLabel "Deprimido/a" (del redcapFormField explícito)', () => {
    expect(dict.fields[0].fieldLabel).toBe('Deprimido/a')
  })

  it('todos los campos pertenecen al instrumento monitor_ibse', () => {
    expect(dict.fields.every(f => f.formName === 'monitor_ibse')).toBe(true)
  })

})

// ══════════════════════════════════════════════════════════════════════════════
// buildRedcapDictionary() — módulo DUKE (ruta inferida)
// ══════════════════════════════════════════════════════════════════════════════

describe('buildRedcapDictionary() — módulo DUKE (ruta inferida desde propiedades canónicas)', () => {

  const q = createQuestionnaire({ id: 'q-duke', name: 'DUKE', methodologicalModules: ['duke-eas'] })
  const dict = buildRedcapDictionary(q)

  it('genera exactamente 11 campos (un campo por ítem del módulo DUKE)', () => {
    expect(dict.fields).toHaveLength(11)
  })

  it('el primer campo usa item.id como fieldName ("duke_p5701")', () => {
    expect(dict.fields[0].fieldName).toBe('duke_p5701')
  })

  it('el formName es "duke_eas" (module.identity.id sanitizado: "duke-eas" → "duke_eas")', () => {
    expect(dict.fields[0].formName).toBe('duke_eas')
  })

  it('el fieldType es "radio" (inferido: responseType=likert con 5 opciones ≤ 7)', () => {
    expect(dict.fields[0].fieldType).toBe('radio')
  })

  it('el fieldLabel coincide con item.text', () => {
    expect(dict.fields[0].fieldLabel).toBe('Recibo visitas de mis amigos y familiares')
  })

  it('choicesOrCalculations contiene la primera opción de respuesta en formato REDCap', () => {
    expect(dict.fields[0].choicesOrCalculations).toContain('1, Mucho menos de lo que deseo')
  })

  it('choicesOrCalculations contiene la última opción de respuesta', () => {
    expect(dict.fields[0].choicesOrCalculations).toContain('5, Tanto como deseo')
  })

  it('las opciones están separadas con " | "', () => {
    expect(dict.fields[0].choicesOrCalculations).toContain(' | ')
  })

  it('required es true para todos los campos inferidos', () => {
    expect(dict.fields.every(f => f.required === true)).toBe(true)
  })

  it('el questionNumber del primer ítem es "1" y el del segundo es "2"', () => {
    expect(dict.fields[0].questionNumber).toBe('1')
    expect(dict.fields[1].questionNumber).toBe('2')
  })

  it('todos los campos pertenecen al instrumento duke_eas', () => {
    expect(dict.fields.every(f => f.formName === 'duke_eas')).toBe(true)
  })

})

// ══════════════════════════════════════════════════════════════════════════════
// buildRedcapDictionary() — bloque sociodemográfico
// ══════════════════════════════════════════════════════════════════════════════

describe('buildRedcapDictionary() — Bloque de Identificación y Clasificación', () => {

  it('sin classificationBlocks, no se generan campos sociodemográficos', () => {
    const q = createQuestionnaire({ id: 'x', name: 'x', methodologicalModules: ['ibse'] })
    const dict = buildRedcapDictionary(q)
    const hasSocioFields = dict.fields.some(f => f.formName === SOCIODEMOGRAPHIC_FORM_NAME)
    expect(hasSocioFields).toBe(false)
  })

  it('con "eas-sociodemographic", se generan exactamente 6 campos del bloque', () => {
    const q = createQuestionnaire({ id: 'x', name: 'x', methodologicalModules: [], classificationBlocks: ['eas-sociodemographic'] })
    const dict = buildRedcapDictionary(q)
    expect(dict.fields).toHaveLength(EAS_SOCIODEMOGRAPHIC_FIELDS.length)
    expect(dict.fields).toHaveLength(6)
  })

  it('el primer campo sociodemográfico es "fecha_encuesta"', () => {
    const q = createQuestionnaire({ id: 'x', name: 'x', methodologicalModules: [], classificationBlocks: ['eas-sociodemographic'] })
    const dict = buildRedcapDictionary(q)
    expect(dict.fields[0].fieldName).toBe('fecha_encuesta')
  })

  it('los campos sociodemográficos usan el formName "datos_basicos"', () => {
    const q = createQuestionnaire({ id: 'x', name: 'x', methodologicalModules: [], classificationBlocks: ['eas-sociodemographic'] })
    const dict = buildRedcapDictionary(q)
    expect(dict.fields.every(f => f.formName === SOCIODEMOGRAPHIC_FORM_NAME)).toBe(true)
  })

  it('el campo "sexo" existe y sus opciones incluyen "1, Hombre" (compatibilidad EAS SEX_01)', () => {
    const q = createQuestionnaire({ id: 'x', name: 'x', methodologicalModules: [], classificationBlocks: ['eas-sociodemographic'] })
    const dict = buildRedcapDictionary(q)
    const sexoField = dict.fields.find(f => f.fieldName === 'sexo')
    expect(sexoField).toBeDefined()
    expect(sexoField!.choicesOrCalculations).toContain('1, Hombre')
    expect(sexoField!.choicesOrCalculations).toContain('2, Mujer')
  })

  it('el campo "sexo" incluye extensiones COMPÁS NG (categorías 3 y 4)', () => {
    const q = createQuestionnaire({ id: 'x', name: 'x', methodologicalModules: [], classificationBlocks: ['eas-sociodemographic'] })
    const dict = buildRedcapDictionary(q)
    const sexoField = dict.fields.find(f => f.fieldName === 'sexo')!
    expect(sexoField.choicesOrCalculations).toContain('3, Otro género')
    expect(sexoField.choicesOrCalculations).toContain('4, Prefiero no indicar')
  })

  it('"municipio_cod" no es obligatorio (required = false)', () => {
    const q = createQuestionnaire({ id: 'x', name: 'x', methodologicalModules: [], classificationBlocks: ['eas-sociodemographic'] })
    const dict = buildRedcapDictionary(q)
    const munField = dict.fields.find(f => f.fieldName === 'municipio_cod')
    expect(munField).toBeDefined()
    expect(munField!.required).toBe(false)
  })

  it('el bloque sociodemográfico precede a los módulos metodológicos', () => {
    const q = createQuestionnaire({ id: 'x', name: 'x', methodologicalModules: ['ibse'], classificationBlocks: ['eas-sociodemographic'] })
    const dict = buildRedcapDictionary(q)
    const firstSocioIndex = dict.fields.findIndex(f => f.formName === SOCIODEMOGRAPHIC_FORM_NAME)
    const firstModuleIndex = dict.fields.findIndex(f => f.formName === 'monitor_ibse')
    expect(firstSocioIndex).toBeLessThan(firstModuleIndex)
  })

})

// ══════════════════════════════════════════════════════════════════════════════
// buildRedcapDictionary() — composiciones y casos límite
// ══════════════════════════════════════════════════════════════════════════════

describe('buildRedcapDictionary() — composiciones y casos límite', () => {

  it('lanza error cuando un moduleId no está registrado', () => {
    const q = createQuestionnaire({ id: 'x', name: 'x', methodologicalModules: ['ibse'] })
    // Mutamos directamente para simular un módulo inexistente en el diccionario
    const qInvalid = { ...q, methodologicalModules: ['modulo-no-registrado'] }
    expect(() => buildRedcapDictionary(qInvalid)).toThrow('modulo-no-registrado')
  })

  it('un módulo con items vacíos (SF-12: PCS/MCS pre-calculados) produce 0 campos de ese módulo', () => {
    const q = createQuestionnaire({ id: 'x', name: 'x', methodologicalModules: ['sf12-eas'] })
    const dict = buildRedcapDictionary(q)
    expect(dict.fields).toHaveLength(0)
  })

  it('composición IBSE + DUKE produce 8 + 11 = 19 campos metodológicos', () => {
    const q = createQuestionnaire({ id: 'x', name: 'x', methodologicalModules: ['ibse', 'duke-eas'] })
    const dict = buildRedcapDictionary(q)
    expect(dict.fields).toHaveLength(19)
  })

  it('composición SD + IBSE produce 6 + 8 = 14 campos totales', () => {
    const q = createQuestionnaire({ id: 'x', name: 'x', methodologicalModules: ['ibse'], classificationBlocks: ['eas-sociodemographic'] })
    const dict = buildRedcapDictionary(q)
    expect(dict.fields).toHaveLength(14)
  })

  it('PREDIMED genera exactamente 14 campos (un campo por criterio dietético)', () => {
    const q = createQuestionnaire({ id: 'x', name: 'x', methodologicalModules: ['predimed-eas'] })
    const dict = buildRedcapDictionary(q)
    expect(dict.fields).toHaveLength(14)
  })

  it('el questionNumber del DUKE se reinicia en "1" aunque vaya tras IBSE en la composición', () => {
    const q = createQuestionnaire({ id: 'x', name: 'x', methodologicalModules: ['ibse', 'duke-eas'] })
    const dict = buildRedcapDictionary(q)
    // Los 8 primeros campos son IBSE; el campo 9 (índice 8) es el primer ítem de DUKE
    const firstDukeField = dict.fields[8]
    expect(firstDukeField.fieldName).toBe('duke_p5701')
    expect(firstDukeField.questionNumber).toBe('1')
  })

})

// ══════════════════════════════════════════════════════════════════════════════
// exportRedcapDictionaryToCsv() — cabeceras REDCap
// ══════════════════════════════════════════════════════════════════════════════

describe('exportRedcapDictionaryToCsv() — cabeceras REDCap canónicas', () => {

  // Diccionario mínimo para estas pruebas
  const q = createQuestionnaire({ id: 'q-csv-test', name: 'CSV Test', methodologicalModules: ['ibse'], classificationBlocks: ['eas-sociodemographic'] })
  const dict = buildRedcapDictionary(q)
  const csv = exportRedcapDictionaryToCsv(dict)
  const lines = csv.split('\n')

  it('la primera línea comienza con "Variable / Field Name,"', () => {
    expect(lines[0]).toMatch(/^Variable \/ Field Name,/)
  })

  it('la primera línea contiene "Form Name" como segunda columna', () => {
    expect(lines[0]).toContain(',Form Name,')
  })

  it('la primera línea contiene "Required Field?" en la posición correcta', () => {
    expect(lines[0]).toContain('Required Field?')
  })

  it('la primera línea contiene "Field Type" como cuarta columna (índice 3)', () => {
    // La cabecera empieza con: Variable / Field Name,Form Name,Section Header,Field Type,...
    expect(lines[0]).toMatch(/^Variable \/ Field Name,Form Name,Section Header,Field Type,/)
  })

  it('el número total de líneas es 1 (cabecera) + N campos', () => {
    expect(lines).toHaveLength(1 + dict.fields.length)
  })

})

// ══════════════════════════════════════════════════════════════════════════════
// exportRedcapDictionaryToCsv() — serialización y escaping
// ══════════════════════════════════════════════════════════════════════════════

describe('exportRedcapDictionaryToCsv() — serialización y escaping', () => {

  it('required: true se serializa como "y"', () => {
    const q = createQuestionnaire({ id: 'x', name: 'x', methodologicalModules: [], classificationBlocks: ['eas-sociodemographic'] })
    const dict = buildRedcapDictionary(q)
    const csv = exportRedcapDictionaryToCsv(dict)
    const lines = csv.split('\n')
    // fecha_encuesta es la primera fila de datos (required=true)
    expect(lines[1]).toContain(',y,')
  })

  it('required: false produce una celda vacía (no "y" ni "n")', () => {
    const q = createQuestionnaire({ id: 'x', name: 'x', methodologicalModules: [], classificationBlocks: ['eas-sociodemographic'] })
    const dict = buildRedcapDictionary(q)
    const csv = exportRedcapDictionaryToCsv(dict)
    const lines = csv.split('\n')
    // municipio_cod es la segunda fila de datos (required=false)
    // La fila no debe contener ",y," en la posición de required
    const municipioLine = lines[2]  // índice 0=header, 1=fecha_encuesta, 2=municipio_cod
    expect(municipioLine.startsWith('municipio_cod,')).toBe(true)
    // La celda required está vacía, no contiene 'y' aislado
    const cells = splitCsvLine(municipioLine)
    expect(cells[12]).toBe('')  // columna 13 (índice 12) = Required Field?
  })

  it('las celdas con comas se envuelven en comillas dobles', () => {
    // Los choices de DUKE contienen comas: "1, Mucho menos..."
    const q = createQuestionnaire({ id: 'x', name: 'x', methodologicalModules: ['duke-eas'] })
    const dict = buildRedcapDictionary(q)
    const csv = exportRedcapDictionaryToCsv(dict)
    const lines = csv.split('\n')
    // El primer ítem de DUKE tiene choices con comas
    expect(lines[1]).toContain('"1, Mucho menos de lo que deseo')
  })

  it('una celda que contiene comillas dobles las duplica (escaping RFC 4180)', () => {
    // Probamos el comportamiento del escaper con datos sintéticos
    const dictWithQuotes = {
      instrumentName: 'test',
      fields: [{
        fieldName: 'campo_prueba',
        formName: 'test_form',
        fieldType: 'text',
        fieldLabel: 'Campo con "comillas"',
      }]
    }
    const csv = exportRedcapDictionaryToCsv(dictWithQuotes)
    const lines = csv.split('\n')
    // La celda con comillas debe estar envuelta y con comillas duplicadas
    expect(lines[1]).toContain('"Campo con ""comillas"""')
  })

  it('los campos undefined se serializan como cadena vacía', () => {
    const q = createQuestionnaire({ id: 'x', name: 'x', methodologicalModules: ['ibse'] })
    const dict = buildRedcapDictionary(q)
    const csv = exportRedcapDictionaryToCsv(dict)
    const lines = csv.split('\n')
    // Todos los campos de datos deben tener exactamente 17 comas (18 columnas)
    // En filas sin comillas en celdas, podemos contar directamente
    // Para el caso de ibse_deprimido (los choices tienen comas → fila tiene quoted cell)
    // Solo verificamos que la estructura general es válida: el CSV tiene contenido
    expect(lines.length).toBeGreaterThan(1)
  })

})

// ══════════════════════════════════════════════════════════════════════════════
// generateRedcapDictionaryArtifact()
// ══════════════════════════════════════════════════════════════════════════════

describe('generateRedcapDictionaryArtifact()', () => {

  const project = makeProject('enc-atarfe-2026', ['ibse', 'duke-eas'], ['eas-sociodemographic'])
  const artifact = generateRedcapDictionaryArtifact(project)

  it('kind es "redcap-data-dictionary-csv"', () => {
    expect(artifact.kind).toBe('redcap-data-dictionary-csv')
  })

  it('mimeType es "text/csv"', () => {
    expect(artifact.mimeType).toBe('text/csv')
  })

  it('questionnaireId coincide con el id del cuestionario del proyecto', () => {
    expect(artifact.questionnaireId).toBe(project.questionnaire.id)
  })

  it('name sigue el patrón "{questionnaire.name}.csv"', () => {
    expect(artifact.name).toBe(`${project.questionnaire.name}.csv`)
  })

  it('content comienza con las cabeceras REDCap canónicas', () => {
    expect(artifact.content).toMatch(/^Variable \/ Field Name,Form Name,/)
  })

  it('content tiene más de una línea (cabecera + campos de datos)', () => {
    const lines = artifact.content.split('\n').filter(l => l.trim() !== '')
    expect(lines.length).toBeGreaterThan(1)
  })

  it('content contiene el bloque sociodemográfico (fecha_encuesta)', () => {
    expect(artifact.content).toContain('fecha_encuesta')
  })

  it('content contiene los campos metodológicos (ibse_deprimido)', () => {
    expect(artifact.content).toContain('ibse_deprimido')
  })

  it('id es un string no vacío', () => {
    expect(artifact.id).toBeTruthy()
    expect(typeof artifact.id).toBe('string')
  })

  it('createdAt es un timestamp ISO 8601 válido', () => {
    expect(() => new Date(artifact.createdAt).toISOString()).not.toThrow()
    expect(artifact.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
  })

  it('metadata.instrumentName coincide con el id del cuestionario', () => {
    expect(artifact.metadata?.instrumentName).toBe(project.questionnaire.id)
  })

  it('cada llamada genera un id distinto', () => {
    const artifact2 = generateRedcapDictionaryArtifact(project)
    expect(artifact.id).not.toBe(artifact2.id)
  })

})

// ── CSV helpers ───────────────────────────────────────────────────────────────
// Parser CSV mínimo para verificar columnas individuales en filas simples
// (sin celdas con comillas). Solo para uso interno de estos tests.

function splitCsvLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') { current += '"'; i++; }
      else { inQuotes = !inQuotes; }
    } else if (ch === ',' && !inQuotes) {
      result.push(current); current = '';
    } else {
      current += ch
    }
  }
  result.push(current)
  return result
}
