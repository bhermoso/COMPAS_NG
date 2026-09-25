/**
 * tests/import-project-dataset.test.ts
 *
 * Tests de orquestación del pipeline importProjectDataset.
 * No prueban parsers individuales — prueban que el orquestador:
 *   - detecta correctamente los módulos presentes en la cabecera del CSV
 *   - salta módulos ausentes (completedColumn no en cabecera)
 *   - no lanza si un módulo no tiene registros válidos
 *   - no guarda el CSV bruto en la metadata
 *   - no altera los fieldName/fieldLabel REDCap de los módulos
 */

import { describe, it, expect } from 'vitest'
import { importProjectDataset } from '../src/application/questionnaire/ImportProjectDataset'
import { getMethodologicalModule } from '../src/domain/methodology'

// ── Fixtures inline ───────────────────────────────────────────────────────────

// Cabeceras de completedColumn por módulo (sin columnas de puntuación)
const CSV_IBSE_ONLY = [
  'monitor_ibse_complete',
  '2',
].join('\n')

const CSV_IBSE_AND_GHQ12 = [
  'monitor_ibse_complete,monitor_ghq12_complete',
  '2,2',
].join('\n')

// CSV con módulo IBSE completo (para nValid > 0 en IBSE)
const CSV_IBSE_WITH_SCORES = [
  'monitor_ibse_complete,ibse_total,ibse_factor_vinculo,ibse_factor_situacion,ibse_factor_control,ibse_factor_persona',
  '2,3.5,3.2,3.8,3.4,3.6',
  '2,4.0,4.1,3.9,4.2,3.8',
].join('\n')

const MUN_ID   = 'test-mun'
const FILE_NAME = 'encuesta-2026.csv'
const PROJ_ID   = 'proj-test-01'
const PROJ_NAME = 'Encuesta Test 2026'

// ── 1. Detecta módulos presentes ──────────────────────────────────────────────

describe('importProjectDataset — detección de módulos', () => {

  it('detecta ibse cuando monitor_ibse_complete está en la cabecera', () => {
    const result = importProjectDataset(
      CSV_IBSE_ONLY,
      ['ibse'],
      MUN_ID, FILE_NAME, PROJ_ID, PROJ_NAME,
    )
    expect(result.metadata.detectedModules).toContain('ibse')
  })

  it('detecta ibse y ghq12 cuando ambas completedColumns están en la cabecera', () => {
    const result = importProjectDataset(
      CSV_IBSE_AND_GHQ12,
      ['ibse', 'ghq12'],
      MUN_ID, FILE_NAME, PROJ_ID, PROJ_NAME,
    )
    expect(result.metadata.detectedModules).toContain('ibse')
    expect(result.metadata.detectedModules).toContain('ghq12')
    expect(result.metadata.detectedModules).toHaveLength(2)
  })

  it('registra el rowCount correcto (excluye cabecera)', () => {
    const result = importProjectDataset(
      CSV_IBSE_WITH_SCORES,
      ['ibse'],
      MUN_ID, FILE_NAME, PROJ_ID, PROJ_NAME,
    )
    expect(result.metadata.rowCount).toBe(2)
  })

  it('un módulo procesado con nValid > 0 aparece en processedModules', () => {
    const result = importProjectDataset(
      CSV_IBSE_WITH_SCORES,
      ['ibse'],
      MUN_ID, FILE_NAME, PROJ_ID, PROJ_NAME,
    )
    expect(result.metadata.processedModules).toContain('ibse')
    expect(result.succeeded.length).toBeGreaterThan(0)
    expect(result.succeeded[0].moduleId).toBe('ibse')
    expect(result.succeeded[0].nValid).toBe(2)
  })

})

// ── 2. Salta módulos ausentes ─────────────────────────────────────────────────

describe('importProjectDataset — módulos omitidos', () => {

  it('salta ghq12 con "no-columns" cuando monitor_ghq12_complete no está en la cabecera', () => {
    const result = importProjectDataset(
      CSV_IBSE_ONLY,
      ['ibse', 'ghq12'],
      MUN_ID, FILE_NAME, PROJ_ID, PROJ_NAME,
    )
    const ghqSkip = result.skipped.find(s => s.moduleId === 'ghq12')
    expect(ghqSkip).toBeDefined()
    expect(ghqSkip!.reason).toBe('no-columns')
  })

  it('salta módulos EAS con "no-redcap-adapter"', () => {
    const result = importProjectDataset(
      CSV_IBSE_ONLY,
      ['ibse', 'duke-eas', 'predimed-eas'],
      MUN_ID, FILE_NAME, PROJ_ID, PROJ_NAME,
    )
    const dukeSkip     = result.skipped.find(s => s.moduleId === 'duke-eas')
    const predimedSkip = result.skipped.find(s => s.moduleId === 'predimed-eas')
    expect(dukeSkip?.reason).toBe('no-redcap-adapter')
    expect(predimedSkip?.reason).toBe('no-redcap-adapter')
  })

  it('módulos omitidos aparecen en skippedModules de la metadata', () => {
    const result = importProjectDataset(
      CSV_IBSE_ONLY,
      ['ibse', 'ghq12'],
      MUN_ID, FILE_NAME, PROJ_ID, PROJ_NAME,
    )
    expect(result.metadata.skippedModules).toContain('ghq12')
  })

})

// ── 3. No falla si un módulo no tiene registros válidos ───────────────────────

describe('importProjectDataset — módulo sin registros válidos', () => {

  it('no lanza cuando el CSV tiene completedColumn pero nValid = 0', () => {
    expect(() =>
      importProjectDataset(
        CSV_IBSE_ONLY,
        ['ibse'],
        MUN_ID, FILE_NAME, PROJ_ID, PROJ_NAME,
      )
    ).not.toThrow()
  })

  it('registra el módulo con skip "no-valid-records" cuando nValid = 0', () => {
    const result = importProjectDataset(
      CSV_IBSE_ONLY,
      ['ibse'],
      MUN_ID, FILE_NAME, PROJ_ID, PROJ_NAME,
    )
    const ibseSkip = result.skipped.find(s => s.moduleId === 'ibse')
    expect(ibseSkip).toBeDefined()
    expect(ibseSkip!.reason).toBe('no-valid-records')
  })

  it('succeeded está vacío cuando todos los módulos detectados tienen nValid = 0', () => {
    const result = importProjectDataset(
      CSV_IBSE_ONLY,
      ['ibse'],
      MUN_ID, FILE_NAME, PROJ_ID, PROJ_NAME,
    )
    expect(result.succeeded).toHaveLength(0)
  })

})

// ── 4. No guarda el CSV bruto ─────────────────────────────────────────────────

describe('importProjectDataset — ausencia del CSV bruto', () => {

  it('la metadata no contiene la cadena del CSV bruto', () => {
    const result = importProjectDataset(
      CSV_IBSE_WITH_SCORES,
      ['ibse'],
      MUN_ID, FILE_NAME, PROJ_ID, PROJ_NAME,
    )
    const metaStr = JSON.stringify(result.metadata)
    expect(metaStr).not.toContain('monitor_ibse_complete')
    expect(metaStr).not.toContain('ibse_total')
  })

  it('la metadata no tiene propiedad csvText ni rawCsv', () => {
    const result = importProjectDataset(
      CSV_IBSE_ONLY,
      ['ibse'],
      MUN_ID, FILE_NAME, PROJ_ID, PROJ_NAME,
    )
    expect(result.metadata).not.toHaveProperty('csvText')
    expect(result.metadata).not.toHaveProperty('rawCsv')
  })

  it('la metadata solo contiene las propiedades canónicas de ProjectDatasetImport', () => {
    const result = importProjectDataset(
      CSV_IBSE_ONLY,
      ['ibse'],
      MUN_ID, FILE_NAME, PROJ_ID, PROJ_NAME,
    )
    const keys = Object.keys(result.metadata)
    const allowed = ['id', 'projectId', 'projectName', 'fileName', 'importedAt',
                     'rowCount', 'detectedModules', 'processedModules', 'skippedModules']
    for (const key of keys) {
      expect(allowed).toContain(key)
    }
  })

})

// ── 5. No altera fieldName / fieldLabel REDCap ────────────────────────────────

describe('importProjectDataset — integridad del módulo metodológico', () => {

  it('los redcapColumn de IBSE no se modifican tras la importación', () => {
    const moduleBefore = getMethodologicalModule('ibse')
    const columnsBefore = moduleBefore!.adapters!.redcap!.columns
      .map(c => ({ outputField: c.outputField, redcapColumn: c.redcapColumn }))

    importProjectDataset(
      CSV_IBSE_WITH_SCORES,
      ['ibse'],
      MUN_ID, FILE_NAME, PROJ_ID, PROJ_NAME,
    )

    const moduleAfter = getMethodologicalModule('ibse')
    const columnsAfter = moduleAfter!.adapters!.redcap!.columns
      .map(c => ({ outputField: c.outputField, redcapColumn: c.redcapColumn }))

    expect(columnsAfter).toEqual(columnsBefore)
  })

  it('los ítems del módulo IBSE (fieldName / fieldLabel en diccionario REDCap) no se modifican', () => {
    const moduleBefore = getMethodologicalModule('ibse')
    const itemsBefore = moduleBefore!.items.map(i => ({ id: i.id, text: i.text }))

    importProjectDataset(
      CSV_IBSE_WITH_SCORES,
      ['ibse'],
      MUN_ID, FILE_NAME, PROJ_ID, PROJ_NAME,
    )

    const moduleAfter = getMethodologicalModule('ibse')
    const itemsAfter = moduleAfter!.items.map(i => ({ id: i.id, text: i.text }))

    expect(itemsAfter).toEqual(itemsBefore)
  })

})
