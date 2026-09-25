import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parsePREDIMEDCSV } from '../src/application/predimed/PREDIMEDCSVParser'
import { createPREDIMEDStudy } from '../src/domain/predimed'
import { predimedStudyToEvidenceAtoms } from '../src/application/predimed/PREDIMEDStudyToEvidenceAtoms'

const _dir = dirname(fileURLToPath(import.meta.url))
const FIXTURE_CSV = readFileSync(resolve(_dir, '../fixtures/predimed-eas-granada.csv'), 'utf-8')

// ── Fixture: parsePREDIMEDCSV ────────────────────────────────────────────────

describe('parsePREDIMEDCSV — fixture granada (3064 registros)', () => {
  const result = parsePREDIMEDCSV(FIXTURE_CSV)

  it('lee los 3064 registros del fixture', () => {
    expect(result.aggregates.n).toBe(3064)
  })

  it('extrae 712 registros con puntuación válida', () => {
    expect(result.aggregates.nValid).toBe(712)
  })

  it('puntuación media PREDIMED correcta', () => {
    expect(result.aggregates.meanScore).toBe(7.6)
  })

  it('distribución por niveles de adherencia correcta', () => {
    expect(result.aggregates.lowCount).toBe(256)
    expect(result.aggregates.lowPercentage).toBe(36)
    expect(result.aggregates.mediumCount).toBe(186)
    expect(result.aggregates.mediumPercentage).toBe(26.1)
    expect(result.aggregates.highCount).toBe(270)
    expect(result.aggregates.highPercentage).toBe(37.9)
  })

  it('registros incompletos correctos (oleadas sin módulo PREDIMED)', () => {
    expect(result.aggregates.incompleteCount).toBe(2352)
  })

  it('no hay warnings cuando el campo canónico "Predimed" está presente', () => {
    expect(result.warnings).toHaveLength(0)
  })

  it('incluye al menos una cautela metodológica', () => {
    expect(result.methodologicalCautions.length).toBeGreaterThan(0)
  })
})

// ── Estructura: predimedStudyToEvidenceAtoms ─────────────────────────────────

describe('predimedStudyToEvidenceAtoms — estructura de átomos', () => {
  const parsed = parsePREDIMEDCSV(FIXTURE_CSV)
  const study = createPREDIMEDStudy({
    municipalityId: 'test-municipality',
    sourceFileName: 'predimed-eas-granada.csv',
    aggregates: parsed.aggregates,
    methodologicalCautions: parsed.methodologicalCautions,
    warnings: parsed.warnings,
  })
  const atoms = predimedStudyToEvidenceAtoms(study)

  it('genera exactamente 2 átomos', () => {
    expect(atoms).toHaveLength(2)
  })

  it('genera exactamente 1 átomo indicator y 1 methodological-caution', () => {
    expect(atoms.filter(a => a.kind === 'indicator')).toHaveLength(1)
    expect(atoms.filter(a => a.kind === 'methodological-caution')).toHaveLength(1)
  })

  it('todos los átomos tienen requiresHumanValidation=true', () => {
    for (const atom of atoms) {
      expect(atom.methodology.requiresHumanValidation).toBe(true)
    }
  })

  it('todos los átomos incluyen el tag "predimed-eas"', () => {
    for (const atom of atoms) {
      expect(atom.tags).toContain('predimed-eas')
    }
  })

  it('provenance.origin es "complementary-study" (invariante sin modificar)', () => {
    for (const atom of atoms) {
      expect(atom.provenance.origin).toBe('complementary-study')
    }
  })

  it('todos los IDs de átomo contienen el municipalityId', () => {
    for (const atom of atoms) {
      expect(atom.id).toContain('test-municipality')
    }
  })

  it('devuelve array vacío cuando nValid=0', () => {
    const emptyParsed = parsePREDIMEDCSV('')
    const emptyStudy = createPREDIMEDStudy({
      municipalityId: 'test-municipality',
      sourceFileName: 'empty.csv',
      aggregates: emptyParsed.aggregates,
      methodologicalCautions: emptyParsed.methodologicalCautions,
    })
    expect(predimedStudyToEvidenceAtoms(emptyStudy)).toHaveLength(0)
  })
})

// ── Casos de borde: parsePREDIMEDCSV ─────────────────────────────────────────

describe('parsePREDIMEDCSV — casos de borde', () => {
  it('CSV vacío devuelve n=0 y nValid=0', () => {
    const result = parsePREDIMEDCSV('')
    expect(result.aggregates.n).toBe(0)
    expect(result.aggregates.nValid).toBe(0)
  })

  it('el fallback detecta exactamente 14 ítems P36BPD, no variables auxiliares', () => {
    // CSV con los 14 ítems brutos más columnas auxiliares EAS (Predimed_R, Predimed_R2)
    // que no deben contarse como ítems P36BPD.
    const p36cols = Array.from({ length: 14 }, (_, i) =>
      `P36BPD${String(i + 1).padStart(2, '0')}_2023`
    ).join(',')
    const csv = `${p36cols},Predimed_R,Predimed_R2\n` + '1,'.repeat(14) + '1,1'
    const result = parsePREDIMEDCSV(csv)
    // El warning reporta exactamente 14 columnas detectadas, no 16
    expect(result.warnings[0]).toContain('14 columnas de items P36BPD')
  })

  it('sin campo canónico produce warning que menciona "Predimed"', () => {
    const csv = 'P36BPD01_2023,P36BPD02_2023\n1,1'
    const result = parsePREDIMEDCSV(csv)
    expect(result.warnings.length).toBeGreaterThan(0)
    expect(result.warnings[0]).toContain('Predimed')
  })

  it('sin campo canónico y sin ítems P36BPD produce warning diferenciado', () => {
    const csv = 'otracolumna,otracolumna2\n1,2'
    const result = parsePREDIMEDCSV(csv)
    expect(result.warnings.length).toBeGreaterThan(0)
    expect(result.warnings[0]).toContain('Predimed')
  })

  it('puntuación 0 es válida — adherencia baja', () => {
    const result = parsePREDIMEDCSV('Predimed\n0')
    expect(result.aggregates.nValid).toBe(1)
    expect(result.aggregates.meanScore).toBe(0)
    expect(result.aggregates.lowCount).toBe(1)
    expect(result.aggregates.mediumCount).toBe(0)
    expect(result.aggregates.highCount).toBe(0)
  })

  it('puntuación 14 es válida — adherencia alta máxima', () => {
    const result = parsePREDIMEDCSV('Predimed\n14')
    expect(result.aggregates.nValid).toBe(1)
    expect(result.aggregates.meanScore).toBe(14)
    expect(result.aggregates.highCount).toBe(1)
    expect(result.aggregates.lowCount).toBe(0)
  })

  it('puntuación 15 es inválida — queda como incompleto', () => {
    const result = parsePREDIMEDCSV('Predimed\n15')
    expect(result.aggregates.nValid).toBe(0)
    expect(result.aggregates.incompleteCount).toBe(1)
  })

  it('puntuación negativa es inválida', () => {
    const result = parsePREDIMEDCSV('Predimed\n-1')
    expect(result.aggregates.nValid).toBe(0)
    expect(result.aggregates.incompleteCount).toBe(1)
  })

  it('umbral bajo-medio: 6 → bajo, 7 → medio', () => {
    const result = parsePREDIMEDCSV('Predimed\n6\n7')
    expect(result.aggregates.lowCount).toBe(1)
    expect(result.aggregates.mediumCount).toBe(1)
    expect(result.aggregates.highCount).toBe(0)
  })

  it('umbral medio-alto: 8 → medio, 9 → alto', () => {
    const result = parsePREDIMEDCSV('Predimed\n8\n9')
    expect(result.aggregates.mediumCount).toBe(1)
    expect(result.aggregates.highCount).toBe(1)
    expect(result.aggregates.lowCount).toBe(0)
  })

  it('líneas vacías se descartan antes de procesar (comportamiento del parser)', () => {
    // El parser filtra líneas vacías con .filter(l => l.trim().length > 0)
    // Una línea en blanco entre registros no incrementa n ni incompleteCount
    const result = parsePREDIMEDCSV('Predimed\n\n8')
    expect(result.aggregates.n).toBe(1)
    expect(result.aggregates.nValid).toBe(1)
    expect(result.aggregates.incompleteCount).toBe(0)
  })

  it('valor decimal se redondea al entero más cercano', () => {
    // 8.6 → round → 9 → alto
    const result = parsePREDIMEDCSV('Predimed\n8.6')
    expect(result.aggregates.nValid).toBe(1)
    expect(result.aggregates.highCount).toBe(1)
  })
})
