import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseCAGECSV } from '../src/application/cage/CAGECSVParser'
import { createCAGEStudy } from '../src/domain/cage'
import { cageStudyToEvidenceAtoms } from '../src/application/cage/CAGEStudyToEvidenceAtoms'

const _dir = dirname(fileURLToPath(import.meta.url))
const FIXTURE_CSV = readFileSync(resolve(_dir, '../fixtures/cage-eas-granada.csv'), 'utf-8')

// ── Fixture: parseCAGECSV ────────────────────────────────────────────────────

describe('parseCAGECSV — fixture granada (3064 registros)', () => {
  const result = parseCAGECSV(FIXTURE_CSV)

  it('lee los 3064 registros del fixture', () => {
    expect(result.aggregates.n).toBe(3064)
  })

  it('CAGE_R — 2513 válidos, 551 missing estructural (~18 %)', () => {
    expect(result.aggregates.nValidCAGER).toBe(2513)
    expect(result.aggregates.missingCAGER).toBe(551)
  })

  it('CAGE_R — 14 con riesgo (0.6 % sobre válidos)', () => {
    expect(result.aggregates.nRisk).toBe(14)
    expect(result.aggregates.pctRisk).toBe(0.6)
  })

  it('CAGE ordinal — 2513 válidos, concordantes con CAGE_R', () => {
    expect(result.aggregates.nValidCAGE).toBe(2513)
  })

  it('CAGE ordinal — distribución coherente: nCAGE1 = nNoRisk', () => {
    expect(result.aggregates.nCAGE1).toBe(2499)
    expect(result.aggregates.nCAGE2).toBe(7)
    expect(result.aggregates.nCAGE3).toBe(3)
    expect(result.aggregates.nCAGE4).toBe(4)
  })

  it('suma CAGE ordinal 2-4 coincide con nRisk', () => {
    const { nCAGE2, nCAGE3, nCAGE4, nRisk } = result.aggregates
    expect(nCAGE2 + nCAGE3 + nCAGE4).toBe(nRisk)
  })

  it('no hay warnings de columnas faltantes', () => {
    expect(result.warnings).toHaveLength(0)
  })

  it('incluye al menos una cautela metodológica', () => {
    expect(result.methodologicalCautions.length).toBeGreaterThan(0)
  })

  it('las cautelas mencionan el missing estructural (abstinentes)', () => {
    const hasAbstinentNote = result.methodologicalCautions.some(c =>
      c.toLowerCase().includes('abstinem') ||
      c.toLowerCase().includes('abstinen') ||
      c.toLowerCase().includes('procede')
    )
    expect(hasAbstinentNote).toBe(true)
  })

  it('las cautelas no exponen el nombre de variable P32D_2023 al usuario', () => {
    for (const caution of result.methodologicalCautions) {
      expect(caution).not.toContain('P32D_2023')
    }
  })

  it('las cautelas no introducen AUDIT-C como instrumento de este módulo', () => {
    // AUDIT-C es un instrumento diferente; no debe aparecer como parte del análisis CAGE
    const hasAuditCAsCAGE = result.methodologicalCautions.some(c =>
      c.toUpperCase().includes('AUDIT-C') && c.toUpperCase().includes('CAGE')
    )
    expect(hasAuditCAsCAGE).toBe(false)
  })
})

// ── Unidad: parseCAGECSV — casos de borde ───────────────────────────────────

describe('parseCAGECSV — casos de borde', () => {
  it('CSV vacío devuelve n=0 y todos los agregados en cero', () => {
    const result = parseCAGECSV('')
    expect(result.aggregates.n).toBe(0)
    expect(result.aggregates.nValidCAGER).toBe(0)
    expect(result.aggregates.pctRisk).toBe(0)
  })

  it('CSV solo con cabecera devuelve n=0', () => {
    const result = parseCAGECSV('CAGE_R,CAGE\n')
    expect(result.aggregates.n).toBe(0)
  })

  it('sin columna CAGE_R genera warning', () => {
    const result = parseCAGECSV('CAGE\n1\n2\n')
    expect(result.warnings.length).toBeGreaterThan(0)
    expect(result.aggregates.nValidCAGER).toBe(0)
  })

  it('valores 0.0 y 1.0 se parsean igual que 0 y 1', () => {
    const csv = 'CAGE_R,CAGE\n1.0,2.0\n0.0,1.0\n'
    const result = parseCAGECSV(csv)
    expect(result.aggregates.n).toBe(2)
    expect(result.aggregates.nValidCAGER).toBe(2)
    expect(result.aggregates.nRisk).toBe(1)
    expect(result.aggregates.nCAGE2).toBe(1)
    expect(result.aggregates.nCAGE1).toBe(1)
  })

  it('código 994.0 (No procede) se trata como missing estructural', () => {
    const csv = 'CAGE_R,CAGE\n994.0,994.0\n0,1\n'
    const result = parseCAGECSV(csv)
    expect(result.aggregates.n).toBe(2)
    expect(result.aggregates.nValidCAGER).toBe(1)
    expect(result.aggregates.missingCAGER).toBe(1)
  })

  it('muestra pequeña (n<30) genera cautela adicional', () => {
    const rows = Array.from({ length: 5 }, () => '0,1').join('\n')
    const csv = `CAGE_R,CAGE\n${rows}\n`
    const result = parseCAGECSV(csv)
    const hasSmallSample = result.methodologicalCautions.some(c =>
      c.includes('pequeña') || c.includes('precaución')
    )
    expect(hasSmallSample).toBe(true)
  })

  it('prevalencia muy baja (nRisk<10) genera cautela de celda pequeña', () => {
    const rows = [
      ...Array.from({ length: 50 }, () => '0,1'),
      '1,2',
    ].join('\n')
    const csv = `CAGE_R,CAGE\n${rows}\n`
    const result = parseCAGECSV(csv)
    expect(result.aggregates.nRisk).toBe(1)
    const hasCellCaution = result.methodologicalCautions.some(c =>
      c.toLowerCase().includes('celda') || c.toLowerCase().includes('precaución')
    )
    expect(hasCellCaution).toBe(true)
  })
})

// ── Estructura: cageStudyToEvidenceAtoms ─────────────────────────────────────

describe('cageStudyToEvidenceAtoms — estructura de átomos', () => {
  const parsed = parseCAGECSV(FIXTURE_CSV)
  const study = createCAGEStudy({
    municipalityId: 'test-municipality',
    sourceFileName: 'cage-eas-granada.csv',
    aggregates: parsed.aggregates,
    methodologicalCautions: parsed.methodologicalCautions,
    warnings: parsed.warnings,
  })
  const atoms = cageStudyToEvidenceAtoms(study)

  it('genera exactamente 3 átomos (CAGE_R + ordinal + cautela)', () => {
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

  it('todos los átomos incluyen el tag "cage-eas"', () => {
    for (const atom of atoms) {
      expect(atom.tags).toContain('cage-eas')
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

  it('confidence es "medium" (nValidCAGER >= 30)', () => {
    for (const atom of atoms) {
      expect(atom.confidence).toBe('medium')
    }
  })

  it('ningún átomo expone el nombre de variable P32D_2023 al usuario', () => {
    for (const atom of atoms) {
      expect(atom.title).not.toContain('P32D_2023')
      expect(atom.content).not.toContain('P32D_2023')
    }
  })

  it('ningún átomo presenta AUDIT-C como sinónimo de CAGE', () => {
    for (const atom of atoms) {
      expect(atom.content.toUpperCase()).not.toMatch(/AUDIT-C.*CAGE|CAGE.*=.*AUDIT/i)
    }
  })

  it('devuelve array vacío cuando nValidCAGER=0', () => {
    const emptyParsed = parseCAGECSV('')
    const emptyStudy = createCAGEStudy({
      municipalityId: 'test-municipality',
      sourceFileName: 'empty.csv',
      aggregates: emptyParsed.aggregates,
      methodologicalCautions: emptyParsed.methodologicalCautions,
    })
    expect(cageStudyToEvidenceAtoms(emptyStudy)).toHaveLength(0)
  })

  it('omite átomo ordinal cuando nValidCAGE < 30', () => {
    const smallCsv = Array.from({ length: 5 }, () => '0,1').join('\n')
    const smallParsed = parseCAGECSV(`CAGE_R,CAGE\n${smallCsv}`)
    const smallStudy = createCAGEStudy({
      municipalityId: 'test-municipality',
      sourceFileName: 'small.csv',
      aggregates: smallParsed.aggregates,
      methodologicalCautions: smallParsed.methodologicalCautions,
    })
    const smallAtoms = cageStudyToEvidenceAtoms(smallStudy)
    expect(smallAtoms.filter(a => a.kind === 'indicator')).toHaveLength(1)
    expect(smallAtoms.find(a => a.id.includes('clasificacion'))).toBeUndefined()
  })
})
