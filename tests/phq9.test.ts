import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parsePHQ9CSV } from '../src/application/phq9/PHQ9CSVParser'
import { createPHQ9Study } from '../src/domain/phq9'
import { phq9StudyToEvidenceAtoms } from '../src/application/phq9/PHQ9StudyToEvidenceAtoms'

const _dir = dirname(fileURLToPath(import.meta.url))
const FIXTURE_CSV = readFileSync(resolve(_dir, '../fixtures/phq9-municipal.csv'), 'utf-8')

// ── Fixture: parsePHQ9CSV ─────────────────────────────────────────────────────

describe('parsePHQ9CSV — fixture municipal (80 registros)', () => {
  const result = parsePHQ9CSV(FIXTURE_CSV)

  it('lee los 80 registros del fixture', () => {
    expect(result.aggregates.n).toBe(80)
  })

  it('77 registros válidos con los 9 ítems completos', () => {
    expect(result.aggregates.nValid).toBe(77)
  })

  it('3 registros excluidos por datos incompletos', () => {
    expect(result.aggregates.missing).toBe(3)
  })

  it('nValid + missing = n', () => {
    expect(result.aggregates.nValid + result.aggregates.missing).toBe(result.aggregates.n)
  })

  it('10 positivos (score ≥ 10) — 13.0 % sobre válidos', () => {
    expect(result.aggregates.nPositive).toBe(10)
    expect(result.aggregates.pctPositive).toBe(13.0)
  })

  it('la suma de rangos coincide con nValid', () => {
    const { nScore0to4, nScore5to9, nScore10to14, nScore15to19, nScore20to27, nValid } = result.aggregates
    expect(nScore0to4 + nScore5to9 + nScore10to14 + nScore15to19 + nScore20to27).toBe(nValid)
  })

  it('nScore10to14 + nScore15to19 + nScore20to27 = nPositive', () => {
    const { nScore10to14, nScore15to19, nScore20to27, nPositive } = result.aggregates
    expect(nScore10to14 + nScore15to19 + nScore20to27).toBe(nPositive)
  })

  it('no hay warnings de columnas faltantes', () => {
    expect(result.warnings).toHaveLength(0)
  })

  it('incluye al menos una cautela metodológica', () => {
    expect(result.methodologicalCautions.length).toBeGreaterThan(0)
  })

  it('la cautela advierte sobre el ítem 9 de ideación suicida', () => {
    const mentionsItem9 = result.methodologicalCautions.some(c =>
      c.toLowerCase().includes('ítem 9') || c.toLowerCase().includes('ideación') || c.toLowerCase().includes('suicida')
    )
    expect(mentionsItem9).toBe(true)
  })

  it('la cautela advierte que no es instrumento diagnóstico', () => {
    const mentionsDiag = result.methodologicalCautions.some(c =>
      c.toLowerCase().includes('cribado') || c.toLowerCase().includes('diagnóstico')
    )
    expect(mentionsDiag).toBe(true)
  })
})

// ── Unidad: parsePHQ9CSV — casos de borde ────────────────────────────────────

describe('parsePHQ9CSV — casos de borde', () => {
  it('CSV vacío devuelve n=0 y todos los agregados en cero', () => {
    const result = parsePHQ9CSV('')
    expect(result.aggregates.n).toBe(0)
    expect(result.aggregates.nValid).toBe(0)
    expect(result.aggregates.nPositive).toBe(0)
    expect(result.aggregates.pctPositive).toBe(0)
  })

  it('CSV solo con cabecera devuelve n=0', () => {
    const cols = Array.from({ length: 9 }, (_, i) => `phq9_q${i + 1}`).join(',')
    const result = parsePHQ9CSV(`${cols}\n`)
    expect(result.aggregates.n).toBe(0)
  })

  it('sin columnas PHQ-9 genera warning', () => {
    const result = parsePHQ9CSV('otra_columna\n1\n2\n')
    expect(result.warnings.length).toBeGreaterThan(0)
    expect(result.aggregates.nValid).toBe(0)
  })

  it('score de todos 0 → mínimo (0–4), no positivo', () => {
    const cols = Array.from({ length: 9 }, (_, i) => `phq9_q${i + 1}`).join(',')
    const vals = Array(9).fill('0').join(',')
    const result = parsePHQ9CSV(`${cols}\n${vals}\n`)
    expect(result.aggregates.nValid).toBe(1)
    expect(result.aggregates.nPositive).toBe(0)
    expect(result.aggregates.nScore0to4).toBe(1)
    expect(result.aggregates.meanScore).toBe(0)
  })

  it('score 10 (1+2+2+1+1+1+1+1+0) es positivo → moderado', () => {
    const cols = Array.from({ length: 9 }, (_, i) => `phq9_q${i + 1}`).join(',')
    const vals = [1, 2, 2, 1, 1, 1, 1, 1, 0].join(',')
    const result = parsePHQ9CSV(`${cols}\n${vals}\n`)
    expect(result.aggregates.nValid).toBe(1)
    expect(result.aggregates.nPositive).toBe(1)
    expect(result.aggregates.nScore10to14).toBe(1)
    expect(result.aggregates.meanScore).toBe(10)
  })

  it('score 27 (todos 3) → grave (≥20)', () => {
    const cols = Array.from({ length: 9 }, (_, i) => `phq9_q${i + 1}`).join(',')
    const vals = Array(9).fill('3').join(',')
    const result = parsePHQ9CSV(`${cols}\n${vals}\n`)
    expect(result.aggregates.meanScore).toBe(27)
    expect(result.aggregates.nScore20to27).toBe(1)
  })

  it('ítem con valor 4 excluye el registro', () => {
    const cols = Array.from({ length: 9 }, (_, i) => `phq9_q${i + 1}`).join(',')
    const vals = ['4','0','0','0','0','0','0','0','0'].join(',')
    const result = parsePHQ9CSV(`${cols}\n${vals}\n`)
    expect(result.aggregates.nValid).toBe(0)
    expect(result.aggregates.missing).toBe(1)
  })

  it('muestra pequeña (n<30) genera cautela adicional', () => {
    const cols = Array.from({ length: 9 }, (_, i) => `phq9_q${i + 1}`).join(',')
    const vals = Array(9).fill('0').join(',')
    const rows = Array(5).fill(vals).join('\n')
    const result = parsePHQ9CSV(`${cols}\n${rows}\n`)
    const hasSmallSample = result.methodologicalCautions.some(c =>
      c.toLowerCase().includes('reducida') || c.toLowerCase().includes('precaución')
    )
    expect(hasSmallSample).toBe(true)
  })
})

// ── Estructura: phq9StudyToEvidenceAtoms ─────────────────────────────────────

describe('phq9StudyToEvidenceAtoms — estructura de átomos', () => {
  const parsed = parsePHQ9CSV(FIXTURE_CSV)
  const study = createPHQ9Study({
    municipalityId: 'test-municipality',
    sourceFileName: 'phq9-municipal.csv',
    aggregates: parsed.aggregates,
    methodologicalCautions: parsed.methodologicalCautions,
  })
  const atoms = phq9StudyToEvidenceAtoms(study)

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

  it('todos los átomos incluyen el tag "phq9"', () => {
    for (const atom of atoms) {
      expect(atom.tags).toContain('phq9')
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

  it('confidence es "medium" (nValid >= 30)', () => {
    for (const atom of atoms) {
      expect(atom.confidence).toBe('medium')
    }
  })

  it('el átomo indicador menciona el pctPositive correcto (13.0 %)', () => {
    const indicator = atoms.find(a => a.kind === 'indicator')!
    expect(indicator.content).toContain('13.0')
  })

  it('devuelve array vacío cuando nValid=0', () => {
    const emptyParsed = parsePHQ9CSV('')
    const emptyStudy = createPHQ9Study({
      municipalityId: 'test-municipality',
      sourceFileName: 'empty.csv',
      aggregates: emptyParsed.aggregates,
      methodologicalCautions: emptyParsed.methodologicalCautions,
    })
    expect(phq9StudyToEvidenceAtoms(emptyStudy)).toHaveLength(0)
  })
})
