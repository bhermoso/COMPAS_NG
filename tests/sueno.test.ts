import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseSuenoCSV } from '../src/application/sueno/SuenoCSVParser'
import { createSuenoStudy } from '../src/domain/sueno'
import { suenoStudyToEvidenceAtoms } from '../src/application/sueno/SuenoStudyToEvidenceAtoms'

const _dir = dirname(fileURLToPath(import.meta.url))
const FIXTURE_CSV = readFileSync(resolve(_dir, '../fixtures/sueno-eas-granada.csv'), 'utf-8')

// ── Fixture: parseSuenoCSV ───────────────────────────────────────────────────

describe('parseSuenoCSV — fixture granada (3064 registros)', () => {
  const result = parseSuenoCSV(FIXTURE_CSV)

  it('lee los 3064 registros del fixture', () => {
    expect(result.aggregates.n).toBe(3064)
  })

  it('P33_R — 3004 válidos, 60 missing (~2 %)', () => {
    expect(result.aggregates.nValidP33R).toBe(3004)
    expect(result.aggregates.missingP33R).toBe(60)
  })

  it('P33_R — 985 con sueño insuficiente (32.8 %)', () => {
    expect(result.aggregates.nInsufficientSleep).toBe(985)
    expect(result.aggregates.pctInsufficientSleep).toBe(32.8)
  })

  it('P33A — 2306 válidos, 758 missing (~25 %)', () => {
    expect(result.aggregates.nValidP33A).toBe(2306)
    expect(result.aggregates.missingP33A).toBe(758)
  })

  it('P33A — 665 sin descanso suficiente (28.8 %)', () => {
    expect(result.aggregates.nNoRest).toBe(665)
    expect(result.aggregates.pctNoRest).toBe(28.8)
  })

  it('no hay warnings de columnas faltantes', () => {
    expect(result.warnings).toHaveLength(0)
  })

  it('incluye al menos una cautela metodológica', () => {
    expect(result.methodologicalCautions.length).toBeGreaterThan(0)
  })

  it('las cautelas no mencionan PSQI', () => {
    for (const caution of result.methodologicalCautions) {
      expect(caution.toUpperCase()).not.toContain('PSQI')
    }
  })
})

// ── Unidad: parseSuenoCSV — casos de borde ──────────────────────────────────

describe('parseSuenoCSV — casos de borde', () => {
  it('CSV vacío devuelve n=0 y todos los agregados en cero', () => {
    const result = parseSuenoCSV('')
    expect(result.aggregates.n).toBe(0)
    expect(result.aggregates.nValidP33R).toBe(0)
    expect(result.aggregates.pctInsufficientSleep).toBe(0)
  })

  it('CSV solo con cabecera devuelve n=0', () => {
    const result = parseSuenoCSV('P33_R,P33A\n')
    expect(result.aggregates.n).toBe(0)
  })

  it('sin columna P33_R genera warning y agrega n=0', () => {
    const result = parseSuenoCSV('P33A\n1\n0\n')
    expect(result.warnings.length).toBeGreaterThan(0)
    expect(result.aggregates.nValidP33R).toBe(0)
  })

  it('valores 0.0 y 1.0 se parsean igual que 0 y 1', () => {
    const csv = 'P33_R,P33A\n1.0,0.0\n0.0,1.0\n'
    const result = parseSuenoCSV(csv)
    expect(result.aggregates.n).toBe(2)
    expect(result.aggregates.nValidP33R).toBe(2)
    expect(result.aggregates.nInsufficientSleep).toBe(1)
    expect(result.aggregates.nValidP33A).toBe(2)
    expect(result.aggregates.nNoRest).toBe(1)
  })

  it('filas con P33_R vacío se cuentan como missing', () => {
    const csv = 'P33_R,P33A\n1,1\n,1\n0,0\n'
    const result = parseSuenoCSV(csv)
    expect(result.aggregates.n).toBe(3)
    expect(result.aggregates.nValidP33R).toBe(2)
    expect(result.aggregates.missingP33R).toBe(1)
  })

  it('P33_R=1 → sueño insuficiente; P33A=0 → no descansa', () => {
    const csv = 'P33_R,P33A\n1,0\n1,0\n0,1\n'
    const result = parseSuenoCSV(csv)
    expect(result.aggregates.nInsufficientSleep).toBe(2)
    expect(result.aggregates.nNoRest).toBe(2)
  })

  it('muestra pequeña (n<30 P33_R válidos) genera cautela adicional', () => {
    const rows = Array.from({ length: 10 }, (_, i) => `${i % 2},1`).join('\n')
    const csv = `P33_R,P33A\n${rows}\n`
    const result = parseSuenoCSV(csv)
    const hasSmallSampleCaution = result.methodologicalCautions.some(c =>
      c.includes('pequeña') || c.includes('precaución')
    )
    expect(hasSmallSampleCaution).toBe(true)
  })
})

// ── Estructura: suenoStudyToEvidenceAtoms ────────────────────────────────────

describe('suenoStudyToEvidenceAtoms — estructura de átomos', () => {
  const parsed = parseSuenoCSV(FIXTURE_CSV)
  const study = createSuenoStudy({
    municipalityId: 'test-municipality',
    sourceFileName: 'sueno-eas-granada.csv',
    aggregates: parsed.aggregates,
    methodologicalCautions: parsed.methodologicalCautions,
    warnings: parsed.warnings,
  })
  const atoms = suenoStudyToEvidenceAtoms(study)

  it('genera exactamente 3 átomos (P33_R + P33A + cautela)', () => {
    expect(atoms).toHaveLength(3)
  })

  it('genera exactamente 2 átomos de tipo indicator', () => {
    expect(atoms.filter(a => a.kind === 'indicator')).toHaveLength(2)
  })

  it('genera exactamente 1 átomo methodological-caution', () => {
    expect(atoms.filter(a => a.kind === 'methodological-caution')).toHaveLength(1)
  })

  it('todos los átomos tienen requiresHumanValidation=true', () => {
    for (const atom of atoms) {
      expect(atom.methodology.requiresHumanValidation).toBe(true)
    }
  })

  it('todos los átomos incluyen el tag "sueno-eas"', () => {
    for (const atom of atoms) {
      expect(atom.tags).toContain('sueno-eas')
    }
  })

  it('provenance.origin es "complementary-study"', () => {
    for (const atom of atoms) {
      expect(atom.provenance.origin).toBe('complementary-study')
    }
  })

  it('todos los IDs de átomo contienen el municipalityId', () => {
    for (const atom of atoms) {
      expect(atom.id).toContain('test-municipality')
    }
  })

  it('ningún átomo menciona PSQI en title ni content', () => {
    for (const atom of atoms) {
      expect(atom.title.toUpperCase()).not.toContain('PSQI')
      expect(atom.content.toUpperCase()).not.toContain('PSQI')
    }
  })

  it('confidence es "medium" (nValidP33R >= 30)', () => {
    for (const atom of atoms) {
      expect(atom.confidence).toBe('medium')
    }
  })

  it('devuelve array vacío cuando nValidP33R=0', () => {
    const emptyParsed = parseSuenoCSV('')
    const emptyStudy = createSuenoStudy({
      municipalityId: 'test-municipality',
      sourceFileName: 'empty.csv',
      aggregates: emptyParsed.aggregates,
      methodologicalCautions: emptyParsed.methodologicalCautions,
    })
    expect(suenoStudyToEvidenceAtoms(emptyStudy)).toHaveLength(0)
  })

  it('omite átomo P33A cuando nValidP33A < 30', () => {
    const smallCsv = Array.from({ length: 5 }, () => '1,0').join('\n')
    const smallParsed = parseSuenoCSV(`P33_R,P33A\n${smallCsv}`)
    const smallStudy = createSuenoStudy({
      municipalityId: 'test-municipality',
      sourceFileName: 'small.csv',
      aggregates: smallParsed.aggregates,
      methodologicalCautions: smallParsed.methodologicalCautions,
    })
    const smallAtoms = suenoStudyToEvidenceAtoms(smallStudy)
    expect(smallAtoms.filter(a => a.kind === 'indicator')).toHaveLength(1)
    expect(smallAtoms.find(a => a.id.includes('calidad-subjetiva'))).toBeUndefined()
  })
})
