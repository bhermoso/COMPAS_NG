import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseSF12CSV } from '../src/application/sf12/SF12CSVParser'
import { createSF12Study } from '../src/domain/sf12'
import { sf12StudyToEvidenceAtoms } from '../src/application/sf12/SF12StudyToEvidenceAtoms'

const _dir = dirname(fileURLToPath(import.meta.url))
const FIXTURE_CSV = readFileSync(resolve(_dir, '../fixtures/sf12-eas-granada.csv'), 'utf-8')

// ── Fixture: parseSF12CSV ────────────────────────────────────────────────────

describe('parseSF12CSV — fixture granada (3064 registros)', () => {
  const result = parseSF12CSV(FIXTURE_CSV)

  it('lee los 3064 registros del fixture', () => {
    expect(result.aggregates.n).toBe(3064)
  })

  it('nValidPCS = 3047 (99,4 %)', () => {
    expect(result.aggregates.nValidPCS).toBe(3047)
  })

  it('nValidMCS = 3047 (99,4 %)', () => {
    expect(result.aggregates.nValidMCS).toBe(3047)
  })

  it('missingPCS = 17', () => {
    expect(result.aggregates.missingPCS).toBe(17)
  })

  it('missingMCS = 17', () => {
    expect(result.aggregates.missingMCS).toBe(17)
  })

  it('meanPCS ≈ 49.552 (±0.01)', () => {
    expect(result.aggregates.meanPCS).toBeGreaterThan(49.54)
    expect(result.aggregates.meanPCS).toBeLessThan(49.56)
  })

  it('meanMCS ≈ 51.139 (±0.01)', () => {
    expect(result.aggregates.meanMCS).toBeGreaterThan(51.13)
    expect(result.aggregates.meanMCS).toBeLessThan(51.15)
  })

  it('no hay warnings cuando PCS12_SP y MCS12_SP están presentes', () => {
    expect(result.warnings).toHaveLength(0)
  })

  it('incluye al menos una cautela metodológica', () => {
    expect(result.methodologicalCautions.length).toBeGreaterThan(0)
  })

  it('cautela menciona Vilagut et al. 2008', () => {
    expect(result.methodologicalCautions.join(' ')).toContain('Vilagut')
  })
})

// ── Estructura: sf12StudyToEvidenceAtoms ─────────────────────────────────────

describe('sf12StudyToEvidenceAtoms — estructura de átomos', () => {
  const parsed = parseSF12CSV(FIXTURE_CSV)
  const study = createSF12Study({
    municipalityId: 'test-municipality',
    sourceFileName: 'sf12-eas-granada.csv',
    aggregates: parsed.aggregates,
    methodologicalCautions: parsed.methodologicalCautions,
    warnings: parsed.warnings,
  })
  const atoms = sf12StudyToEvidenceAtoms(study)

  it('genera exactamente 3 átomos', () => {
    expect(atoms).toHaveLength(3)
  })

  it('genera exactamente 2 átomos de tipo indicator', () => {
    expect(atoms.filter(a => a.kind === 'indicator')).toHaveLength(2)
  })

  it('genera exactamente 1 átomo methodological-caution', () => {
    expect(atoms.filter(a => a.kind === 'methodological-caution')).toHaveLength(1)
  })

  it('el primer átomo indicator corresponde a PCS12_SP', () => {
    const pcs = atoms.find(a => a.id.endsWith(':pcs12'))
    expect(pcs).toBeDefined()
    expect(pcs?.kind).toBe('indicator')
    expect(pcs?.tags).toContain('salud-fisica')
  })

  it('el segundo átomo indicator corresponde a MCS12_SP', () => {
    const mcs = atoms.find(a => a.id.endsWith(':mcs12'))
    expect(mcs).toBeDefined()
    expect(mcs?.kind).toBe('indicator')
    expect(mcs?.tags).toContain('salud-mental')
  })

  it('todos los átomos tienen requiresHumanValidation=true', () => {
    for (const atom of atoms) {
      expect(atom.methodology.requiresHumanValidation).toBe(true)
    }
  })

  it('todos los átomos incluyen el tag "sf12-eas"', () => {
    for (const atom of atoms) {
      expect(atom.tags).toContain('sf12-eas')
    }
  })

  it('provenance.origin es "complementary-study" (invariante)', () => {
    for (const atom of atoms) {
      expect(atom.provenance.origin).toBe('complementary-study')
    }
  })

  it('todos los IDs de átomo contienen el municipalityId', () => {
    for (const atom of atoms) {
      expect(atom.id).toContain('test-municipality')
    }
  })

  it('devuelve array vacío cuando nValidPCS=nValidMCS=0', () => {
    const emptyParsed = parseSF12CSV('')
    const emptyStudy = createSF12Study({
      municipalityId: 'test-municipality',
      sourceFileName: 'empty.csv',
      aggregates: emptyParsed.aggregates,
      methodologicalCautions: emptyParsed.methodologicalCautions,
    })
    expect(sf12StudyToEvidenceAtoms(emptyStudy)).toHaveLength(0)
  })
})

// ── Casos de borde: parseSF12CSV ─────────────────────────────────────────────

describe('parseSF12CSV — casos de borde', () => {
  it('CSV vacío devuelve n=0 y todos los agregados en cero', () => {
    const result = parseSF12CSV('')
    expect(result.aggregates.n).toBe(0)
    expect(result.aggregates.nValidPCS).toBe(0)
    expect(result.aggregates.meanPCS).toBe(0)
  })

  it('CSV sin columnas PCS/MCS produce warning y agr. vacíos', () => {
    const csv = 'otracolumna,otracolumna2\n1,2'
    const result = parseSF12CSV(csv)
    expect(result.warnings.length).toBeGreaterThan(0)
    expect(result.warnings[0]).toContain('PCS12_SP')
    expect(result.aggregates.n).toBe(0)
  })

  it('solo PCS presente: MCS válidos = 0, PCS se calcula', () => {
    const csv = 'PCS12_SP\n50.0\n60.0'
    const result = parseSF12CSV(csv)
    expect(result.aggregates.nValidPCS).toBe(2)
    expect(result.aggregates.nValidMCS).toBe(0)
    expect(result.aggregates.meanPCS).toBe(55)
    expect(result.aggregates.meanMCS).toBe(0)
  })

  it('fila con valor vacío en PCS cuenta como missing', () => {
    const csv = 'PCS12_SP,MCS12_SP\n50.0,55.0\n,60.0'
    const result = parseSF12CSV(csv)
    expect(result.aggregates.n).toBe(2)
    expect(result.aggregates.nValidPCS).toBe(1)
    expect(result.aggregates.missingPCS).toBe(1)
    expect(result.aggregates.nValidMCS).toBe(2)
    expect(result.aggregates.missingMCS).toBe(0)
  })

  it('media con 3 decimales de precisión', () => {
    const csv = 'PCS12_SP,MCS12_SP\n49.552,51.139'
    const result = parseSF12CSV(csv)
    expect(result.aggregates.meanPCS).toBe(49.552)
    expect(result.aggregates.meanMCS).toBe(51.139)
  })
})
