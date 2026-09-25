import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parsePSQICSV } from '../src/application/psqi/PSQICSVParser'
import { createPSQIStudy } from '../src/domain/psqi'
import { psqiStudyToEvidenceAtoms } from '../src/application/psqi/PSQIStudyToEvidenceAtoms'

const _dir = dirname(fileURLToPath(import.meta.url))
const FIXTURE_CSV = readFileSync(resolve(_dir, '../fixtures/psqi-municipal.csv'), 'utf-8')

// ── Fixture: parsePSQICSV ─────────────────────────────────────────────────────

describe('parsePSQICSV — fixture municipal (60 registros)', () => {
  const result = parsePSQICSV(FIXTURE_CSV)

  it('lee los 60 registros del fixture', () => {
    expect(result.aggregates.n).toBe(60)
  })

  it('58 registros válidos con los 7 componentes completos', () => {
    expect(result.aggregates.nValid).toBe(58)
  })

  it('2 registros excluidos por datos incompletos', () => {
    expect(result.aggregates.missing).toBe(2)
  })

  it('nValid + missing = n', () => {
    expect(result.aggregates.nValid + result.aggregates.missing).toBe(result.aggregates.n)
  })

  it('18 positivos (score >5) — 31.0 % sobre válidos', () => {
    expect(result.aggregates.nPositive).toBe(18)
    expect(result.aggregates.pctPositive).toBe(31.0)
  })

  it('la suma de rangos coincide con nValid', () => {
    const { nScore0to5, nScore6to10, nScore11to21, nValid } = result.aggregates
    expect(nScore0to5 + nScore6to10 + nScore11to21).toBe(nValid)
  })

  it('nScore6to10 + nScore11to21 = nPositive', () => {
    const { nScore6to10, nScore11to21, nPositive } = result.aggregates
    expect(nScore6to10 + nScore11to21).toBe(nPositive)
  })

  it('no hay warnings de columnas faltantes', () => {
    expect(result.warnings).toHaveLength(0)
  })

  it('incluye al menos una cautela metodológica', () => {
    expect(result.methodologicalCautions.length).toBeGreaterThan(0)
  })

  it('la cautela menciona el punto de corte >5', () => {
    const mentionsCutpoint = result.methodologicalCautions.some(c =>
      c.includes('>5') || c.includes('> 5')
    )
    expect(mentionsCutpoint).toBe(true)
  })

  it('la cautela advierte que los componentes deben ser pre-calculados', () => {
    const mentionsPreCalc = result.methodologicalCautions.some(c =>
      c.toLowerCase().includes('pre-calculad') || c.toLowerCase().includes('componente')
    )
    expect(mentionsPreCalc).toBe(true)
  })
})

// ── Unidad: parsePSQICSV — casos de borde ────────────────────────────────────

describe('parsePSQICSV — casos de borde', () => {
  it('CSV vacío devuelve n=0 y todos los agregados en cero', () => {
    const result = parsePSQICSV('')
    expect(result.aggregates.n).toBe(0)
    expect(result.aggregates.nValid).toBe(0)
    expect(result.aggregates.nPositive).toBe(0)
    expect(result.aggregates.pctPositive).toBe(0)
  })

  it('CSV solo con cabecera devuelve n=0', () => {
    const cols = Array.from({ length: 7 }, (_, i) => `psqi_c${i + 1}`).join(',')
    const result = parsePSQICSV(`${cols}\n`)
    expect(result.aggregates.n).toBe(0)
  })

  it('sin columnas PSQI genera warning', () => {
    const result = parsePSQICSV('otra_columna\n1\n2\n')
    expect(result.warnings.length).toBeGreaterThan(0)
    expect(result.aggregates.nValid).toBe(0)
  })

  it('score 0 (todos 0) → buen dormidor (≤5), no positivo', () => {
    const cols = Array.from({ length: 7 }, (_, i) => `psqi_c${i + 1}`).join(',')
    const vals = Array(7).fill('0').join(',')
    const result = parsePSQICSV(`${cols}\n${vals}\n`)
    expect(result.aggregates.nValid).toBe(1)
    expect(result.aggregates.nPositive).toBe(0)
    expect(result.aggregates.nScore0to5).toBe(1)
  })

  it('score 6 (1+1+1+1+1+1+0) → mal dormidor, positivo', () => {
    const cols = Array.from({ length: 7 }, (_, i) => `psqi_c${i + 1}`).join(',')
    const vals = [1,1,1,1,1,1,0].join(',')
    const result = parsePSQICSV(`${cols}\n${vals}\n`)
    expect(result.aggregates.nValid).toBe(1)
    expect(result.aggregates.nPositive).toBe(1)
    expect(result.aggregates.nScore6to10).toBe(1)
    expect(result.aggregates.meanScore).toBe(6)
  })

  it('score 5 (exactamente el límite) → buen dormidor, no positivo', () => {
    const cols = Array.from({ length: 7 }, (_, i) => `psqi_c${i + 1}`).join(',')
    const vals = [1,1,1,1,1,0,0].join(',')
    const result = parsePSQICSV(`${cols}\n${vals}\n`)
    expect(result.aggregates.nPositive).toBe(0)
    expect(result.aggregates.nScore0to5).toBe(1)
  })

  it('score 21 (todos 3) → mal dormidor grave', () => {
    const cols = Array.from({ length: 7 }, (_, i) => `psqi_c${i + 1}`).join(',')
    const vals = Array(7).fill('3').join(',')
    const result = parsePSQICSV(`${cols}\n${vals}\n`)
    expect(result.aggregates.meanScore).toBe(21)
    expect(result.aggregates.nScore11to21).toBe(1)
  })

  it('componente con valor 4 excluye el registro', () => {
    const cols = Array.from({ length: 7 }, (_, i) => `psqi_c${i + 1}`).join(',')
    const vals = ['4','0','0','0','0','0','0'].join(',')
    const result = parsePSQICSV(`${cols}\n${vals}\n`)
    expect(result.aggregates.nValid).toBe(0)
    expect(result.aggregates.missing).toBe(1)
  })

  it('muestra pequeña (n<30) genera cautela adicional', () => {
    const cols = Array.from({ length: 7 }, (_, i) => `psqi_c${i + 1}`).join(',')
    const vals = Array(7).fill('0').join(',')
    const rows = Array(5).fill(vals).join('\n')
    const result = parsePSQICSV(`${cols}\n${rows}\n`)
    const hasSmallSample = result.methodologicalCautions.some(c =>
      c.toLowerCase().includes('reducida') || c.toLowerCase().includes('precaución')
    )
    expect(hasSmallSample).toBe(true)
  })
})

// ── Estructura: psqiStudyToEvidenceAtoms ─────────────────────────────────────

describe('psqiStudyToEvidenceAtoms — estructura de átomos', () => {
  const parsed = parsePSQICSV(FIXTURE_CSV)
  const study = createPSQIStudy({
    municipalityId: 'test-municipality',
    sourceFileName: 'psqi-municipal.csv',
    aggregates: parsed.aggregates,
    methodologicalCautions: parsed.methodologicalCautions,
  })
  const atoms = psqiStudyToEvidenceAtoms(study)

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

  it('todos los átomos incluyen el tag "psqi"', () => {
    for (const atom of atoms) {
      expect(atom.tags).toContain('psqi')
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

  it('el átomo indicador menciona el pctPositive correcto (31.0 %)', () => {
    const indicator = atoms.find(a => a.kind === 'indicator')!
    expect(indicator.content).toContain('31.0')
  })

  it('devuelve array vacío cuando nValid=0', () => {
    const emptyParsed = parsePSQICSV('')
    const emptyStudy = createPSQIStudy({
      municipalityId: 'test-municipality',
      sourceFileName: 'empty.csv',
      aggregates: emptyParsed.aggregates,
      methodologicalCautions: emptyParsed.methodologicalCautions,
    })
    expect(psqiStudyToEvidenceAtoms(emptyStudy)).toHaveLength(0)
  })
})
