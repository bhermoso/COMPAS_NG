import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseIPAQCSV } from '../src/application/ipaq/IPAQCSVParser'
import { createIPAQStudy } from '../src/domain/ipaq'
import { ipaqStudyToEvidenceAtoms } from '../src/application/ipaq/IPAQStudyToEvidenceAtoms'

const _dir = dirname(fileURLToPath(import.meta.url))
const FIXTURE_CSV = readFileSync(resolve(_dir, '../fixtures/ipaq-eas-granada.csv'), 'utf-8')

// ── Fixture: parseIPAQCSV ────────────────────────────────────────────────────

describe('parseIPAQCSV — fixture granada (3064 registros)', () => {
  const result = parseIPAQCSV(FIXTURE_CSV)

  it('lee los 3064 registros del fixture', () => {
    expect(result.aggregates.n).toBe(3064)
  })

  it('IPAQ_DICO — 1603 válidos, 1461 missing (~48 %)', () => {
    expect(result.aggregates.nValidIPAQ).toBe(1603)
    expect(result.aggregates.missingIPAQ).toBe(1461)
  })

  it('IPAQ_DICO — 251 con alta actividad (15.7 % sobre válidos)', () => {
    expect(result.aggregates.nHigh).toBe(251)
    expect(result.aggregates.pctHigh).toBe(15.7)
  })

  it('P34A_R — 3058 válidos, 6 missing', () => {
    expect(result.aggregates.nValidP34AR).toBe(3058)
    expect(result.aggregates.missingP34AR).toBe(6)
  })

  it('P34A_R — 1047 inactivos en tiempo libre (34.2 % sobre válidos)', () => {
    expect(result.aggregates.nInactive).toBe(1047)
    expect(result.aggregates.pctInactive).toBe(34.2)
  })

  it('nValidIPAQ + missingIPAQ = n', () => {
    const { n, nValidIPAQ, missingIPAQ } = result.aggregates
    expect(nValidIPAQ + missingIPAQ).toBe(n)
  })

  it('nValidP34AR + missingP34AR = n', () => {
    const { n, nValidP34AR, missingP34AR } = result.aggregates
    expect(nValidP34AR + missingP34AR).toBe(n)
  })

  it('no hay warnings de columnas faltantes', () => {
    expect(result.warnings).toHaveLength(0)
  })

  it('incluye al menos una cautela metodológica', () => {
    expect(result.methodologicalCautions.length).toBeGreaterThan(0)
  })

  it('las cautelas mencionan el missing sustancial de IPAQ_DICO', () => {
    const hasMissingNote = result.methodologicalCautions.some(c =>
      c.toLowerCase().includes('missing') ||
      c.toLowerCase().includes('48') ||
      c.toLowerCase().includes('evaluad')
    )
    expect(hasMissingNote).toBe(true)
  })

  it('las cautelas advierten que IPAQ_DICO=0 no equivale a sedentarismo', () => {
    const hasSedentaryNote = result.methodologicalCautions.some(c =>
      c.toLowerCase().includes('sedentarismo') ||
      c.toLowerCase().includes('moderada') ||
      c.toLowerCase().includes('sbq')
    )
    expect(hasSedentaryNote).toBe(true)
  })
})

// ── Unidad: parseIPAQCSV — casos de borde ────────────────────────────────────

describe('parseIPAQCSV — casos de borde', () => {
  it('CSV vacío devuelve n=0 y todos los agregados en cero', () => {
    const result = parseIPAQCSV('')
    expect(result.aggregates.n).toBe(0)
    expect(result.aggregates.nValidIPAQ).toBe(0)
    expect(result.aggregates.pctHigh).toBe(0)
    expect(result.aggregates.nValidP34AR).toBe(0)
    expect(result.aggregates.pctInactive).toBe(0)
  })

  it('CSV solo con cabecera devuelve n=0', () => {
    const result = parseIPAQCSV('IPAQ_DICO,P34A_R\n')
    expect(result.aggregates.n).toBe(0)
  })

  it('sin columnas IPAQ genera warning', () => {
    const result = parseIPAQCSV('otra_columna\n1\n2\n')
    expect(result.warnings.length).toBeGreaterThan(0)
    expect(result.aggregates.nValidIPAQ).toBe(0)
  })

  it('valores 0.0 y 1.0 se parsean igual que 0 y 1', () => {
    const csv = 'IPAQ_DICO,P34A_R\n1.0,0.0\n0.0,1.0\n'
    const result = parseIPAQCSV(csv)
    expect(result.aggregates.n).toBe(2)
    expect(result.aggregates.nValidIPAQ).toBe(2)
    expect(result.aggregates.nHigh).toBe(1)
    expect(result.aggregates.nValidP34AR).toBe(2)
    expect(result.aggregates.nInactive).toBe(1)
  })

  it('valor vacío en IPAQ_DICO se trata como missing', () => {
    const csv = 'IPAQ_DICO,P34A_R\n,0\n1,1\n'
    const result = parseIPAQCSV(csv)
    expect(result.aggregates.n).toBe(2)
    expect(result.aggregates.nValidIPAQ).toBe(1)
    expect(result.aggregates.missingIPAQ).toBe(1)
  })

  it('valor inválido en P34A_R se trata como missing', () => {
    const csv = 'IPAQ_DICO,P34A_R\n1,9\n0,0\n'
    const result = parseIPAQCSV(csv)
    expect(result.aggregates.nValidP34AR).toBe(1)
    expect(result.aggregates.missingP34AR).toBe(1)
  })

  it('muestra pequeña (n<30) en IPAQ_DICO genera cautela adicional', () => {
    const rows = Array.from({ length: 5 }, () => '0,1').join('\n')
    const csv = `IPAQ_DICO,P34A_R\n${rows}\n`
    const result = parseIPAQCSV(csv)
    const hasSmallSample = result.methodologicalCautions.some(c =>
      c.includes('pequeña') || c.includes('precaución')
    )
    expect(hasSmallSample).toBe(true)
  })

  it('prevalencia de alta actividad muy baja (nHigh<10) genera cautela de celda pequeña', () => {
    const rows = [
      ...Array.from({ length: 50 }, () => '0,1'),
      '1,0',
    ].join('\n')
    const csv = `IPAQ_DICO,P34A_R\n${rows}\n`
    const result = parseIPAQCSV(csv)
    expect(result.aggregates.nHigh).toBe(1)
    const hasCellCaution = result.methodologicalCautions.some(c =>
      c.toLowerCase().includes('celda') || c.toLowerCase().includes('precaución')
    )
    expect(hasCellCaution).toBe(true)
  })
})

// ── Estructura: ipaqStudyToEvidenceAtoms ─────────────────────────────────────

describe('ipaqStudyToEvidenceAtoms — estructura de átomos', () => {
  const parsed = parseIPAQCSV(FIXTURE_CSV)
  const study = createIPAQStudy({
    municipalityId: 'test-municipality',
    sourceFileName: 'ipaq-eas-granada.csv',
    aggregates: parsed.aggregates,
    methodologicalCautions: parsed.methodologicalCautions,
    warnings: parsed.warnings,
  })
  const atoms = ipaqStudyToEvidenceAtoms(study)

  it('genera exactamente 3 átomos (IPAQ_DICO + P34A_R + cautela)', () => {
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

  it('todos los átomos incluyen el tag "ipaq-eas"', () => {
    for (const atom of atoms) {
      expect(atom.tags).toContain('ipaq-eas')
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

  it('confidence es "medium" (nValidIPAQ >= 30)', () => {
    for (const atom of atoms) {
      expect(atom.confidence).toBe('medium')
    }
  })

  it('el átomo IPAQ_DICO menciona el pctHigh correcto (15.7 %)', () => {
    const indicator = atoms.find(a => a.id.includes('actividad-alta'))!
    expect(indicator).toBeDefined()
    expect(indicator.content).toContain('15.7')
  })

  it('el átomo P34A_R menciona el pctInactive correcto (34.2 %)', () => {
    const indicator = atoms.find(a => a.id.includes('inactividad-tiempo-libre'))!
    expect(indicator).toBeDefined()
    expect(indicator.content).toContain('34.2')
  })

  it('devuelve array vacío cuando nValidIPAQ=0 y nValidP34AR=0', () => {
    const emptyParsed = parseIPAQCSV('')
    const emptyStudy = createIPAQStudy({
      municipalityId: 'test-municipality',
      sourceFileName: 'empty.csv',
      aggregates: emptyParsed.aggregates,
      methodologicalCautions: emptyParsed.methodologicalCautions,
    })
    expect(ipaqStudyToEvidenceAtoms(emptyStudy)).toHaveLength(0)
  })

  it('confidence es "low" cuando ambos válidos < 30', () => {
    const smallCsv = Array.from({ length: 5 }, () => '1,0').join('\n')
    const smallParsed = parseIPAQCSV(`IPAQ_DICO,P34A_R\n${smallCsv}`)
    const smallStudy = createIPAQStudy({
      municipalityId: 'test-municipality',
      sourceFileName: 'small.csv',
      aggregates: smallParsed.aggregates,
      methodologicalCautions: smallParsed.methodologicalCautions,
    })
    const smallAtoms = ipaqStudyToEvidenceAtoms(smallStudy)
    for (const atom of smallAtoms) {
      expect(atom.confidence).toBe('low')
    }
  })
})
