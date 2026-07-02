import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseGHQ12CSV } from '../src/application/ghq12/GHQ12CSVParser'
import { createGHQ12Study } from '../src/domain/ghq12'
import { ghq12StudyToEvidenceAtoms } from '../src/application/ghq12/GHQ12StudyToEvidenceAtoms'

const _dir = dirname(fileURLToPath(import.meta.url))
const FIXTURE_CSV = readFileSync(resolve(_dir, '../fixtures/ghq12-municipal.csv'), 'utf-8')

// ── Fixture: parseGHQ12CSV ───────────────────────────────────────────────────

describe('parseGHQ12CSV — fixture municipal (100 registros)', () => {
  const result = parseGHQ12CSV(FIXTURE_CSV)

  it('lee los 100 registros del fixture', () => {
    expect(result.aggregates.n).toBe(100)
  })

  it('95 registros válidos con los 12 ítems completos', () => {
    expect(result.aggregates.nValid).toBe(95)
  })

  it('5 registros excluidos por datos incompletos o inválidos', () => {
    expect(result.aggregates.missing).toBe(5)
  })

  it('nValid + missing = n', () => {
    const { n, nValid, missing } = result.aggregates
    expect(nValid + missing).toBe(n)
  })

  it('25 positivos (score bimodal ≥ 3) — 26.3 % sobre válidos', () => {
    expect(result.aggregates.nPositive).toBe(25)
    expect(result.aggregates.pctPositive).toBe(26.3)
  })

  it('nScore0to2 + nScore3to6 + nScore7to12 = nValid', () => {
    const { nScore0to2, nScore3to6, nScore7to12, nValid } = result.aggregates
    expect(nScore0to2 + nScore3to6 + nScore7to12).toBe(nValid)
  })

  it('nScore3to6 + nScore7to12 = nPositive', () => {
    const { nScore3to6, nScore7to12, nPositive } = result.aggregates
    expect(nScore3to6 + nScore7to12).toBe(nPositive)
  })

  it('no hay warnings de columnas faltantes', () => {
    expect(result.warnings).toHaveLength(0)
  })

  it('incluye al menos una cautela metodológica', () => {
    expect(result.methodologicalCautions.length).toBeGreaterThan(0)
  })

  it('la cautela menciona el punto de corte ≥ 3', () => {
    const mentionsCutpoint = result.methodologicalCautions.some(c =>
      c.includes('≥ 3') || c.includes('>=3') || c.includes('≥3')
    )
    expect(mentionsCutpoint).toBe(true)
  })

  it('la cautela advierte que no es instrumento diagnóstico', () => {
    const mentionsDiag = result.methodologicalCautions.some(c =>
      c.toLowerCase().includes('cribado') || c.toLowerCase().includes('diagnóstico')
    )
    expect(mentionsDiag).toBe(true)
  })
})

// ── Unidad: parseGHQ12CSV — casos de borde ───────────────────────────────────

describe('parseGHQ12CSV — casos de borde', () => {
  it('CSV vacío devuelve n=0 y todos los agregados en cero', () => {
    const result = parseGHQ12CSV('')
    expect(result.aggregates.n).toBe(0)
    expect(result.aggregates.nValid).toBe(0)
    expect(result.aggregates.nPositive).toBe(0)
    expect(result.aggregates.pctPositive).toBe(0)
  })

  it('CSV solo con cabecera devuelve n=0', () => {
    const cols = Array.from({ length: 12 }, (_, i) => `ghq12_q${i + 1}`).join(',')
    const result = parseGHQ12CSV(`${cols}\n`)
    expect(result.aggregates.n).toBe(0)
  })

  it('sin columnas GHQ-12 genera warning', () => {
    const result = parseGHQ12CSV('otra_columna\n1\n2\n')
    expect(result.warnings.length).toBeGreaterThan(0)
    expect(result.aggregates.nValid).toBe(0)
  })

  it('registro completo con todos 0 → score bimodal 0, no positivo', () => {
    const cols = Array.from({ length: 12 }, (_, i) => `ghq12_q${i + 1}`).join(',')
    const vals = Array(12).fill('0').join(',')
    const result = parseGHQ12CSV(`${cols}\n${vals}\n`)
    expect(result.aggregates.nValid).toBe(1)
    expect(result.aggregates.nPositive).toBe(0)
    expect(result.aggregates.nScore0to2).toBe(1)
  })

  it('3 ítems con valor 2 → score bimodal 3, positivo', () => {
    const cols = Array.from({ length: 12 }, (_, i) => `ghq12_q${i + 1}`).join(',')
    const vals = ['2','2','2','0','0','0','0','0','0','0','0','0'].join(',')
    const result = parseGHQ12CSV(`${cols}\n${vals}\n`)
    expect(result.aggregates.nValid).toBe(1)
    expect(result.aggregates.nPositive).toBe(1)
    expect(result.aggregates.nScore3to6).toBe(1)
    expect(result.aggregates.meanBimodal).toBe(3)
  })

  it('ítem con valor 4 (fuera de rango) excluye el registro', () => {
    const cols = Array.from({ length: 12 }, (_, i) => `ghq12_q${i + 1}`).join(',')
    const vals = ['4','0','0','0','0','0','0','0','0','0','0','0'].join(',')
    const result = parseGHQ12CSV(`${cols}\n${vals}\n`)
    expect(result.aggregates.nValid).toBe(0)
    expect(result.aggregates.missing).toBe(1)
  })

  it('ítem vacío excluye el registro', () => {
    const cols = Array.from({ length: 12 }, (_, i) => `ghq12_q${i + 1}`).join(',')
    const vals = ['','0','0','0','0','0','0','0','0','0','0','0'].join(',')
    const result = parseGHQ12CSV(`${cols}\n${vals}\n`)
    expect(result.aggregates.nValid).toBe(0)
    expect(result.aggregates.missing).toBe(1)
  })

  it('todos los ítems con valor 3 → score bimodal 12 (máximo)', () => {
    const cols = Array.from({ length: 12 }, (_, i) => `ghq12_q${i + 1}`).join(',')
    const vals = Array(12).fill('3').join(',')
    const result = parseGHQ12CSV(`${cols}\n${vals}\n`)
    expect(result.aggregates.meanBimodal).toBe(12)
    expect(result.aggregates.nScore7to12).toBe(1)
  })

  it('muestra pequeña (n<30) genera cautela adicional', () => {
    const cols = Array.from({ length: 12 }, (_, i) => `ghq12_q${i + 1}`).join(',')
    const vals = Array(12).fill('0').join(',')
    const rows = Array(5).fill(vals).join('\n')
    const result = parseGHQ12CSV(`${cols}\n${rows}\n`)
    const hasSmallSample = result.methodologicalCautions.some(c =>
      c.toLowerCase().includes('reducida') || c.toLowerCase().includes('precaución')
    )
    expect(hasSmallSample).toBe(true)
  })
})

// ── Estructura: ghq12StudyToEvidenceAtoms ────────────────────────────────────

describe('ghq12StudyToEvidenceAtoms — estructura de átomos', () => {
  const parsed = parseGHQ12CSV(FIXTURE_CSV)
  const study = createGHQ12Study({
    municipalityId: 'test-municipality',
    sourceFileName: 'ghq12-municipal.csv',
    aggregates: parsed.aggregates,
    methodologicalCautions: parsed.methodologicalCautions,
  })
  const atoms = ghq12StudyToEvidenceAtoms(study)

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

  it('todos los átomos incluyen el tag "ghq12"', () => {
    for (const atom of atoms) {
      expect(atom.tags).toContain('ghq12')
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

  it('el átomo indicador menciona el pctPositive correcto (26.3 %)', () => {
    const indicator = atoms.find(a => a.kind === 'indicator')!
    expect(indicator.content).toContain('26.3')
  })

  it('devuelve array vacío cuando nValid=0', () => {
    const emptyParsed = parseGHQ12CSV('')
    const emptyStudy = createGHQ12Study({
      municipalityId: 'test-municipality',
      sourceFileName: 'empty.csv',
      aggregates: emptyParsed.aggregates,
      methodologicalCautions: emptyParsed.methodologicalCautions,
    })
    expect(ghq12StudyToEvidenceAtoms(emptyStudy)).toHaveLength(0)
  })

  it('confidence es "low" cuando nValid < 30', () => {
    const cols = Array.from({ length: 12 }, (_, i) => `ghq12_q${i + 1}`).join(',')
    const vals = Array(12).fill('0').join(',')
    const rows = Array(5).fill(vals).join('\n')
    const smallParsed = parseGHQ12CSV(`${cols}\n${rows}`)
    const smallStudy = createGHQ12Study({
      municipalityId: 'test-municipality',
      sourceFileName: 'small.csv',
      aggregates: smallParsed.aggregates,
      methodologicalCautions: smallParsed.methodologicalCautions,
    })
    const smallAtoms = ghq12StudyToEvidenceAtoms(smallStudy)
    for (const atom of smallAtoms) {
      expect(atom.confidence).toBe('low')
    }
  })
})
