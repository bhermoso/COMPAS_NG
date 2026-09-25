import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseSBQCSV } from '../src/application/sbq/SBQCSVParser'
import { createSBQStudy } from '../src/domain/sbq'
import { sbqStudyToEvidenceAtoms } from '../src/application/sbq/SBQStudyToEvidenceAtoms'

const _dir = dirname(fileURLToPath(import.meta.url))
const FIXTURE_CSV = readFileSync(resolve(_dir, '../fixtures/sbq-municipal.csv'), 'utf-8')

// ── Fixture: parseSBQCSV ──────────────────────────────────────────────────────

describe('parseSBQCSV — fixture municipal (70 registros)', () => {
  const result = parseSBQCSV(FIXTURE_CSV)

  it('lee los 70 registros del fixture', () => {
    expect(result.aggregates.n).toBe(70)
  })

  it('68 registros válidos con los 9 ítems completos', () => {
    expect(result.aggregates.nValid).toBe(68)
  })

  it('2 registros excluidos por datos incompletos', () => {
    expect(result.aggregates.missing).toBe(2)
  })

  it('nValid + missing = n', () => {
    expect(result.aggregates.nValid + result.aggregates.missing).toBe(result.aggregates.n)
  })

  it('20 altamente sedentarios (>8h/día) — 29.4 % sobre válidos', () => {
    expect(result.aggregates.nPositive).toBe(20)
    expect(result.aggregates.pctPositive).toBe(29.4)
  })

  it('la suma de rangos coincide con nValid', () => {
    const { nLow, nModerate, nHigh, nValid } = result.aggregates
    expect(nLow + nModerate + nHigh).toBe(nValid)
  })

  it('nHigh = nPositive (>8h)', () => {
    expect(result.aggregates.nHigh).toBe(result.aggregates.nPositive)
  })

  it('no hay warnings de columnas faltantes', () => {
    expect(result.warnings).toHaveLength(0)
  })

  it('incluye al menos una cautela metodológica', () => {
    expect(result.methodologicalCautions.length).toBeGreaterThan(0)
  })

  it('la cautela menciona el punto de corte >8h/día', () => {
    const mentionsCutpoint = result.methodologicalCautions.some(c =>
      c.includes('>8h') || c.includes('> 8') || c.includes('8h/día')
    )
    expect(mentionsCutpoint).toBe(true)
  })

  it('la cautela advierte que el sedentarismo y la actividad física son dimensiones distintas', () => {
    const mentionsDistinct = result.methodologicalCautions.some(c =>
      c.toLowerCase().includes('independiente') || c.toLowerCase().includes('distint')
    )
    expect(mentionsDistinct).toBe(true)
  })
})

// ── Unidad: parseSBQCSV — casos de borde ─────────────────────────────────────

describe('parseSBQCSV — casos de borde', () => {
  it('CSV vacío devuelve n=0 y todos los agregados en cero', () => {
    const result = parseSBQCSV('')
    expect(result.aggregates.n).toBe(0)
    expect(result.aggregates.nValid).toBe(0)
    expect(result.aggregates.nPositive).toBe(0)
    expect(result.aggregates.meanHours).toBe(0)
  })

  it('CSV solo con cabecera devuelve n=0', () => {
    const cols = Array.from({ length: 9 }, (_, i) => `sbq_q${i + 1}`).join(',')
    const result = parseSBQCSV(`${cols}\n`)
    expect(result.aggregates.n).toBe(0)
  })

  it('sin columnas SBQ genera warning', () => {
    const result = parseSBQCSV('otra_columna\n1\n')
    expect(result.warnings.length).toBeGreaterThan(0)
    expect(result.aggregates.nValid).toBe(0)
  })

  it('todos 0 → 0 horas, no sedentario', () => {
    const cols = Array.from({ length: 9 }, (_, i) => `sbq_q${i + 1}`).join(',')
    const vals = Array(9).fill('0').join(',')
    const result = parseSBQCSV(`${cols}\n${vals}\n`)
    expect(result.aggregates.nValid).toBe(1)
    expect(result.aggregates.nPositive).toBe(0)
    expect(result.aggregates.nLow).toBe(1)
    expect(result.aggregates.meanHours).toBe(0)
  })

  it('conversión: ítem=1 → 0.5h, ítem=2 → 1.5h, ítem=3 → 3h, ítem=4 → 5h', () => {
    const cols = Array.from({ length: 9 }, (_, i) => `sbq_q${i + 1}`).join(',')
    // 4+4+1+0+0+0+0+0+0 → 5+5+0.5 = 10.5h > 8h → positivo
    const vals = [4,4,1,0,0,0,0,0,0].join(',')
    const result = parseSBQCSV(`${cols}\n${vals}\n`)
    expect(result.aggregates.nValid).toBe(1)
    expect(result.aggregates.nPositive).toBe(1)
    expect(result.aggregates.meanHours).toBe(10.5)
  })

  it('score exactamente 8h (4 horas → no supera el límite)', () => {
    // 3+3+2+0+0+0+0+0+0 → 3+3+1.5 = 7.5h ≤ 8h → no positivo
    const cols = Array.from({ length: 9 }, (_, i) => `sbq_q${i + 1}`).join(',')
    const vals = [3,3,2,0,0,0,0,0,0].join(',')
    const result = parseSBQCSV(`${cols}\n${vals}\n`)
    expect(result.aggregates.nPositive).toBe(0)
    expect(result.aggregates.meanHours).toBe(7.5)
    expect(result.aggregates.nModerate).toBe(1)
  })

  it('ítem con valor 5 excluye el registro', () => {
    const cols = Array.from({ length: 9 }, (_, i) => `sbq_q${i + 1}`).join(',')
    const vals = ['5','0','0','0','0','0','0','0','0'].join(',')
    const result = parseSBQCSV(`${cols}\n${vals}\n`)
    expect(result.aggregates.nValid).toBe(0)
    expect(result.aggregates.missing).toBe(1)
  })

  it('muestra pequeña (n<30) genera cautela adicional', () => {
    const cols = Array.from({ length: 9 }, (_, i) => `sbq_q${i + 1}`).join(',')
    const vals = Array(9).fill('0').join(',')
    const rows = Array(5).fill(vals).join('\n')
    const result = parseSBQCSV(`${cols}\n${rows}\n`)
    const hasSmallSample = result.methodologicalCautions.some(c =>
      c.toLowerCase().includes('reducida') || c.toLowerCase().includes('precaución')
    )
    expect(hasSmallSample).toBe(true)
  })
})

// ── Estructura: sbqStudyToEvidenceAtoms ───────────────────────────────────────

describe('sbqStudyToEvidenceAtoms — estructura de átomos', () => {
  const parsed = parseSBQCSV(FIXTURE_CSV)
  const study = createSBQStudy({
    municipalityId: 'test-municipality',
    sourceFileName: 'sbq-municipal.csv',
    aggregates: parsed.aggregates,
    methodologicalCautions: parsed.methodologicalCautions,
  })
  const atoms = sbqStudyToEvidenceAtoms(study)

  it('genera exactamente 2 átomos (indicador + cautela)', () => {
    expect(atoms).toHaveLength(2)
  })

  it('genera exactamente 1 átomo de tipo indicator', () => {
    expect(atoms.filter(a => a.kind === 'indicator')).toHaveLength(1)
  })

  it('genera exactamente 1 átomo methodological-caution', () => {
    expect(atoms.filter(a => a.kind === 'methodological-caution')).toHaveLength(1)
  })

  it('todos los átomos tienen requiresHumanValidation=true', () => {
    for (const atom of atoms) {
      expect(atom.methodology.requiresHumanValidation).toBe(true)
    }
  })

  it('todos los átomos incluyen el tag "sbq"', () => {
    for (const atom of atoms) {
      expect(atom.tags).toContain('sbq')
    }
  })

  it('provenance.origin es "complementary-study"', () => {
    for (const atom of atoms) {
      expect(atom.provenance.origin).toBe('complementary-study')
    }
  })

  it('todos los IDs contienen el municipalityId', () => {
    for (const atom of atoms) {
      expect(atom.id).toContain('test-municipality')
    }
  })

  it('confidence es "medium" (nValid=68 >= 30)', () => {
    for (const atom of atoms) {
      expect(atom.confidence).toBe('medium')
    }
  })

  it('el átomo indicador menciona el pctPositive correcto (29.4 %)', () => {
    const indicator = atoms.find(a => a.kind === 'indicator')!
    expect(indicator.content).toContain('29.4')
  })

  it('devuelve array vacío cuando nValid=0', () => {
    const emptyParsed = parseSBQCSV('')
    const emptyStudy = createSBQStudy({
      municipalityId: 'test-municipality',
      sourceFileName: 'empty.csv',
      aggregates: emptyParsed.aggregates,
      methodologicalCautions: emptyParsed.methodologicalCautions,
    })
    expect(sbqStudyToEvidenceAtoms(emptyStudy)).toHaveLength(0)
  })
})
