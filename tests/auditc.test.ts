import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseAUDITCCSV } from '../src/application/auditc/AUDITCCSVParser'
import { createAUDITCStudy } from '../src/domain/auditc'
import { auditcStudyToEvidenceAtoms } from '../src/application/auditc/AUDITCStudyToEvidenceAtoms'

const _dir = dirname(fileURLToPath(import.meta.url))
const FIXTURE_CSV = readFileSync(resolve(_dir, '../fixtures/auditc-municipal.csv'), 'utf-8')

// ── Fixture: parseAUDITCCSV ──────────────────────────────────────────────────

describe('parseAUDITCCSV — fixture municipal (95 registros)', () => {
  const result = parseAUDITCCSV(FIXTURE_CSV)

  it('lee los 95 registros del fixture', () => {
    expect(result.aggregates.n).toBe(95)
  })

  it('85 registros válidos con los 3 ítems completos', () => {
    expect(result.aggregates.nValid).toBe(85)
  })

  it('10 registros excluidos por datos incompletos o inválidos', () => {
    expect(result.aggregates.missing).toBe(10)
  })

  it('nValid + missing = n', () => {
    const { n, nValid, missing } = result.aggregates
    expect(nValid + missing).toBe(n)
  })

  it('score 0 — 28 registros (sin consumo / abstemia)', () => {
    expect(result.aggregates.nScore0).toBe(28)
  })

  it('score 1–3 — 39 registros (bajo riesgo)', () => {
    expect(result.aggregates.nScore1to3).toBe(39)
  })

  it('score 4–7 — 15 registros (consumo de riesgo)', () => {
    expect(result.aggregates.nScore4to7).toBe(15)
  })

  it('score ≥ 8 — 3 registros (alto riesgo)', () => {
    expect(result.aggregates.nScore8to12).toBe(3)
  })

  it('la suma de rangos coincide con nValid', () => {
    const { nScore0, nScore1to3, nScore4to7, nScore8to12, nValid } = result.aggregates
    expect(nScore0 + nScore1to3 + nScore4to7 + nScore8to12).toBe(nValid)
  })

  it('18 positivos (score ≥ 4) — 21.2 % sobre válidos', () => {
    expect(result.aggregates.nPositive).toBe(18)
    expect(result.aggregates.pctPositive).toBe(21.2)
  })

  it('nScore4to7 + nScore8to12 = nPositive', () => {
    const { nScore4to7, nScore8to12, nPositive } = result.aggregates
    expect(nScore4to7 + nScore8to12).toBe(nPositive)
  })

  it('score medio = 1.98 (168/85)', () => {
    expect(result.aggregates.meanScore).toBe(1.98)
  })

  it('no hay warnings de columnas faltantes', () => {
    expect(result.warnings).toHaveLength(0)
  })

  it('incluye al menos una cautela metodológica', () => {
    expect(result.methodologicalCautions.length).toBeGreaterThan(0)
  })

  it('la cautela menciona el punto de corte ≥4', () => {
    const mentionsCutpoint = result.methodologicalCautions.some(c =>
      c.includes('≥ 4') || c.includes('>=4') || c.includes('≥4')
    )
    expect(mentionsCutpoint).toBe(true)
  })

  it('la cautela advierte sobre el sesgo de género', () => {
    const mentionsGender = result.methodologicalCautions.some(c =>
      c.toLowerCase().includes('sexo') || c.toLowerCase().includes('mujeres') || c.toLowerCase().includes('género')
    )
    expect(mentionsGender).toBe(true)
  })
})

// ── Unidad: casos de borde ────────────────────────────────────────────────────

describe('parseAUDITCCSV — casos de borde', () => {
  it('CSV vacío devuelve n=0 y todos los agregados en cero', () => {
    const result = parseAUDITCCSV('')
    expect(result.aggregates.n).toBe(0)
    expect(result.aggregates.nValid).toBe(0)
    expect(result.aggregates.pctPositive).toBe(0)
    expect(result.aggregates.meanScore).toBe(0)
  })

  it('CSV solo con cabecera devuelve n=0', () => {
    const result = parseAUDITCCSV('auditc_q1,auditc_q2,auditc_q3\n')
    expect(result.aggregates.n).toBe(0)
  })

  it('sin columnas AUDIT-C genera warning', () => {
    const result = parseAUDITCCSV('otra_columna\n1\n2\n')
    expect(result.warnings.length).toBeGreaterThan(0)
    expect(result.aggregates.nValid).toBe(0)
  })

  it('score de 0+0+0 = 0, no es positivo', () => {
    const csv = 'auditc_q1,auditc_q2,auditc_q3\n0,0,0\n0,0,0\n'
    const result = parseAUDITCCSV(csv)
    expect(result.aggregates.nValid).toBe(2)
    expect(result.aggregates.nPositive).toBe(0)
    expect(result.aggregates.nScore0).toBe(2)
    expect(result.aggregates.meanScore).toBe(0)
  })

  it('score de 1+1+2 = 4, es positivo', () => {
    const csv = 'auditc_q1,auditc_q2,auditc_q3\n1,1,2\n'
    const result = parseAUDITCCSV(csv)
    expect(result.aggregates.nValid).toBe(1)
    expect(result.aggregates.nPositive).toBe(1)
    expect(result.aggregates.nScore4to7).toBe(1)
    expect(result.aggregates.meanScore).toBe(4)
  })

  it('score de 4+4+4 = 12, es de alto riesgo', () => {
    const csv = 'auditc_q1,auditc_q2,auditc_q3\n4,4,4\n'
    const result = parseAUDITCCSV(csv)
    expect(result.aggregates.nValid).toBe(1)
    expect(result.aggregates.nScore8to12).toBe(1)
    expect(result.aggregates.meanScore).toBe(12)
  })

  it('ítem fuera de rango (5) excluye el registro como missing', () => {
    const csv = 'auditc_q1,auditc_q2,auditc_q3\n1,5,0\n1,0,0\n'
    const result = parseAUDITCCSV(csv)
    expect(result.aggregates.n).toBe(2)
    expect(result.aggregates.nValid).toBe(1)
    expect(result.aggregates.missing).toBe(1)
  })

  it('Q3 vacío excluye el registro como missing', () => {
    const csv = 'auditc_q1,auditc_q2,auditc_q3\n1,0,\n1,0,0\n'
    const result = parseAUDITCCSV(csv)
    expect(result.aggregates.n).toBe(2)
    expect(result.aggregates.nValid).toBe(1)
    expect(result.aggregates.missing).toBe(1)
  })

  it('muestra pequeña (n<30) genera cautela adicional', () => {
    const rows = Array.from({ length: 5 }, () => '1,0,0').join('\n')
    const csv = `auditc_q1,auditc_q2,auditc_q3\n${rows}\n`
    const result = parseAUDITCCSV(csv)
    const hasSmallSample = result.methodologicalCautions.some(c =>
      c.toLowerCase().includes('reducida') || c.toLowerCase().includes('precaución')
    )
    expect(hasSmallSample).toBe(true)
  })

  it('prevalencia muy baja (nPositive<10) genera cautela de celda pequeña', () => {
    const rows = [
      ...Array.from({ length: 50 }, () => '1,0,0'),
      '2,1,1',
    ].join('\n')
    const csv = `auditc_q1,auditc_q2,auditc_q3\n${rows}\n`
    const result = parseAUDITCCSV(csv)
    expect(result.aggregates.nPositive).toBe(1)
    const hasCellCaution = result.methodologicalCautions.some(c =>
      c.toLowerCase().includes('celda') || c.toLowerCase().includes('precaución')
    )
    expect(hasCellCaution).toBe(true)
  })

  it('score 3 — no es positivo con corte ≥4', () => {
    const csv = 'auditc_q1,auditc_q2,auditc_q3\n1,1,1\n'
    const result = parseAUDITCCSV(csv)
    expect(result.aggregates.nPositive).toBe(0)
    expect(result.aggregates.nScore1to3).toBe(1)
  })
})

// ── Estructura: auditcStudyToEvidenceAtoms ───────────────────────────────────

describe('auditcStudyToEvidenceAtoms — estructura de átomos', () => {
  const parsed = parseAUDITCCSV(FIXTURE_CSV)
  const study = createAUDITCStudy({
    municipalityId: 'test-municipality',
    sourceFileName: 'auditc-municipal.csv',
    aggregates: parsed.aggregates,
    methodologicalCautions: parsed.methodologicalCautions,
  })
  const atoms = auditcStudyToEvidenceAtoms(study)

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

  it('todos los átomos incluyen el tag "auditc"', () => {
    for (const atom of atoms) {
      expect(atom.tags).toContain('auditc')
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

  it('el átomo indicador menciona el pctPositive correcto', () => {
    const indicator = atoms.find(a => a.kind === 'indicator')!
    expect(indicator.content).toContain('21.2')
  })

  it('devuelve array vacío cuando nValid=0', () => {
    const emptyParsed = parseAUDITCCSV('')
    const emptyStudy = createAUDITCStudy({
      municipalityId: 'test-municipality',
      sourceFileName: 'empty.csv',
      aggregates: emptyParsed.aggregates,
      methodologicalCautions: emptyParsed.methodologicalCautions,
    })
    expect(auditcStudyToEvidenceAtoms(emptyStudy)).toHaveLength(0)
  })

  it('confidence es "low" cuando nValid < 30', () => {
    const smallCsv = Array.from({ length: 5 }, () => '1,0,0').join('\n')
    const smallParsed = parseAUDITCCSV(`auditc_q1,auditc_q2,auditc_q3\n${smallCsv}`)
    const smallStudy = createAUDITCStudy({
      municipalityId: 'test-municipality',
      sourceFileName: 'small.csv',
      aggregates: smallParsed.aggregates,
      methodologicalCautions: smallParsed.methodologicalCautions,
    })
    const smallAtoms = auditcStudyToEvidenceAtoms(smallStudy)
    for (const atom of smallAtoms) {
      expect(atom.confidence).toBe('low')
    }
  })
})
