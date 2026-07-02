import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseFagerstromCSV } from '../src/application/fagerstrom/FagerstromCSVParser'
import { createFagerstromStudy } from '../src/domain/fagerstrom'
import { fagerstromStudyToEvidenceAtoms } from '../src/application/fagerstrom/FagerstromStudyToEvidenceAtoms'

const _dir = dirname(fileURLToPath(import.meta.url))
const FIXTURE_CSV = readFileSync(resolve(_dir, '../fixtures/fagerstrom-municipal.csv'), 'utf-8')

// ── Fixture: parseFagerstromCSV ───────────────────────────────────────────────

describe('parseFagerstromCSV — fixture municipal (50 registros)', () => {
  const result = parseFagerstromCSV(FIXTURE_CSV)

  it('lee los 50 registros del fixture', () => {
    expect(result.aggregates.n).toBe(50)
  })

  it('48 registros válidos con los 6 ítems completos', () => {
    expect(result.aggregates.nValid).toBe(48)
  })

  it('2 registros excluidos por datos incompletos', () => {
    expect(result.aggregates.missing).toBe(2)
  })

  it('nValid + missing = n', () => {
    expect(result.aggregates.nValid + result.aggregates.missing).toBe(result.aggregates.n)
  })

  it('15 positivos (score ≥ 5) — 31.3 % sobre válidos', () => {
    expect(result.aggregates.nPositive).toBe(15)
    expect(result.aggregates.pctPositive).toBe(31.3)
  })

  it('la suma de niveles coincide con nValid', () => {
    const { nVeryLow, nLow, nModerate, nHigh, nVeryHigh, nValid } = result.aggregates
    expect(nVeryLow + nLow + nModerate + nHigh + nVeryHigh).toBe(nValid)
  })

  it('nModerate + nHigh + nVeryHigh + nLow >= nPositive (nPositive = >=5)', () => {
    const { nModerate, nHigh, nVeryHigh, nPositive } = result.aggregates
    expect(nModerate + nHigh + nVeryHigh).toBe(nPositive)
  })

  it('no hay warnings de columnas faltantes', () => {
    expect(result.warnings).toHaveLength(0)
  })

  it('incluye al menos una cautela metodológica', () => {
    expect(result.methodologicalCautions.length).toBeGreaterThan(0)
  })

  it('la cautela advierte que solo se aplica a fumadores activos', () => {
    const mentionsSmokers = result.methodologicalCautions.some(c =>
      c.toLowerCase().includes('fumador') || c.toLowerCase().includes('tabaquismo')
    )
    expect(mentionsSmokers).toBe(true)
  })

  it('la cautela advierte que no mide dependencia psicológica', () => {
    const mentionsPsych = result.methodologicalCautions.some(c =>
      c.toLowerCase().includes('psicológica') || c.toLowerCase().includes('física')
    )
    expect(mentionsPsych).toBe(true)
  })
})

// ── Unidad: parseFagerstromCSV — casos de borde ──────────────────────────────

describe('parseFagerstromCSV — casos de borde', () => {
  it('CSV vacío devuelve n=0 y todos los agregados en cero', () => {
    const result = parseFagerstromCSV('')
    expect(result.aggregates.n).toBe(0)
    expect(result.aggregates.nValid).toBe(0)
    expect(result.aggregates.nPositive).toBe(0)
    expect(result.aggregates.pctPositive).toBe(0)
  })

  it('CSV solo con cabecera devuelve n=0', () => {
    const cols = 'ftnd_q1,ftnd_q2,ftnd_q3,ftnd_q4,ftnd_q5,ftnd_q6'
    const result = parseFagerstromCSV(`${cols}\n`)
    expect(result.aggregates.n).toBe(0)
  })

  it('sin columnas Fagerström genera warning', () => {
    const result = parseFagerstromCSV('otra_columna\n1\n')
    expect(result.warnings.length).toBeGreaterThan(0)
    expect(result.aggregates.nValid).toBe(0)
  })

  it('score 0 (todos 0) → muy baja dependencia, no positivo', () => {
    const result = parseFagerstromCSV('ftnd_q1,ftnd_q2,ftnd_q3,ftnd_q4,ftnd_q5,ftnd_q6\n0,0,0,0,0,0\n')
    expect(result.aggregates.nValid).toBe(1)
    expect(result.aggregates.nPositive).toBe(0)
    expect(result.aggregates.nVeryLow).toBe(1)
  })

  it('score 5 exacto → dependencia moderada, positivo', () => {
    const result = parseFagerstromCSV('ftnd_q1,ftnd_q2,ftnd_q3,ftnd_q4,ftnd_q5,ftnd_q6\n4,1,0,0,0,0\n')
    expect(result.aggregates.nValid).toBe(1)
    expect(result.aggregates.nPositive).toBe(1)
    expect(result.aggregates.nModerate).toBe(1)
    expect(result.aggregates.meanScore).toBe(5)
  })

  it('Q1 con valor 5 (fuera de rango 0-4) excluye el registro', () => {
    const result = parseFagerstromCSV('ftnd_q1,ftnd_q2,ftnd_q3,ftnd_q4,ftnd_q5,ftnd_q6\n5,0,0,0,0,0\n')
    expect(result.aggregates.nValid).toBe(0)
    expect(result.aggregates.missing).toBe(1)
  })

  it('Q2 con valor 2 (fuera de rango 0-1) excluye el registro', () => {
    const result = parseFagerstromCSV('ftnd_q1,ftnd_q2,ftnd_q3,ftnd_q4,ftnd_q5,ftnd_q6\n0,2,0,0,0,0\n')
    expect(result.aggregates.nValid).toBe(0)
    expect(result.aggregates.missing).toBe(1)
  })

  it('Q6 con valor 3 (máximo) es válido', () => {
    const result = parseFagerstromCSV('ftnd_q1,ftnd_q2,ftnd_q3,ftnd_q4,ftnd_q5,ftnd_q6\n0,0,0,0,0,3\n')
    expect(result.aggregates.nValid).toBe(1)
    expect(result.aggregates.meanScore).toBe(3)
  })

  it('muestra pequeña (n<15) genera cautela de muestra muy reducida', () => {
    const cols = 'ftnd_q1,ftnd_q2,ftnd_q3,ftnd_q4,ftnd_q5,ftnd_q6'
    const rows = Array(5).fill('0,0,0,0,0,0').join('\n')
    const result = parseFagerstromCSV(`${cols}\n${rows}\n`)
    const hasSmallSample = result.methodologicalCautions.some(c =>
      c.toLowerCase().includes('muy reducida') || c.toLowerCase().includes('precaución')
    )
    expect(hasSmallSample).toBe(true)
  })
})

// ── Estructura: fagerstromStudyToEvidenceAtoms ────────────────────────────────

describe('fagerstromStudyToEvidenceAtoms — estructura de átomos', () => {
  const parsed = parseFagerstromCSV(FIXTURE_CSV)
  const study = createFagerstromStudy({
    municipalityId: 'test-municipality',
    sourceFileName: 'fagerstrom-municipal.csv',
    aggregates: parsed.aggregates,
    methodologicalCautions: parsed.methodologicalCautions,
  })
  const atoms = fagerstromStudyToEvidenceAtoms(study)

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

  it('todos los átomos incluyen el tag "fagerstrom"', () => {
    for (const atom of atoms) {
      expect(atom.tags).toContain('fagerstrom')
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

  it('confidence es "medium" (nValid=48 >= 30)', () => {
    for (const atom of atoms) {
      expect(atom.confidence).toBe('medium')
    }
  })

  it('el átomo indicador menciona el pctPositive correcto (31.3 %)', () => {
    const indicator = atoms.find(a => a.kind === 'indicator')!
    expect(indicator.content).toContain('31.3')
  })

  it('devuelve array vacío cuando nValid=0', () => {
    const emptyParsed = parseFagerstromCSV('')
    const emptyStudy = createFagerstromStudy({
      municipalityId: 'test-municipality',
      sourceFileName: 'empty.csv',
      aggregates: emptyParsed.aggregates,
      methodologicalCautions: emptyParsed.methodologicalCautions,
    })
    expect(fagerstromStudyToEvidenceAtoms(emptyStudy)).toHaveLength(0)
  })
})
