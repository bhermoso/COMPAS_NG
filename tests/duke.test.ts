import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseDUKECSV, calculateDUKEScores } from '../src/application/duke/DUKECSVParser'
import { createDUKEStudy } from '../src/domain/duke'
import { dukeStudyToEvidenceAtoms } from '../src/application/duke/DUKEStudyToEvidenceAtoms'

const _dir = dirname(fileURLToPath(import.meta.url))
const FIXTURE_CSV = readFileSync(resolve(_dir, '../fixtures/duke-eas-granada.csv'), 'utf-8')

// ── Fixture: parseDUKECSV ────────────────────────────────────────────────────

describe('parseDUKECSV — fixture granada (3028 registros)', () => {
  const result = parseDUKECSV(FIXTURE_CSV)

  it('lee los 3028 registros del fixture', () => {
    expect(result.aggregates.n).toBe(3028)
  })

  it('todos los registros son válidos (cero incompletos)', () => {
    expect(result.aggregates.nValidGlobal).toBe(3028)
    expect(result.aggregates.nValidConfidential).toBe(3028)
    expect(result.aggregates.nValidAffective).toBe(3028)
    expect(result.aggregates.incompleteGlobalCount).toBe(0)
    expect(result.aggregates.incompleteConfidentialCount).toBe(0)
    expect(result.aggregates.incompleteAffectiveCount).toBe(0)
  })

  it('medias por escala correctas', () => {
    expect(result.aggregates.meanGlobal).toBe(49.2)
    expect(result.aggregates.meanConfidential).toBe(31.1)
    expect(result.aggregates.meanAffective).toBe(18.1)
  })

  it('recuentos de apoyo bajo correctos', () => {
    expect(result.aggregates.lowGlobalCount).toBe(1658)
    expect(result.aggregates.lowGlobalPercentage).toBe(54.8)
    expect(result.aggregates.lowConfidentialCount).toBe(1605)
    expect(result.aggregates.lowConfidentialPercentage).toBe(53)
    expect(result.aggregates.lowAffectiveCount).toBe(1360)
    expect(result.aggregates.lowAffectivePercentage).toBe(44.9)
  })

  it('recuentos de apoyo normal correctos', () => {
    expect(result.aggregates.normalGlobalCount).toBe(1370)
    expect(result.aggregates.normalConfidentialCount).toBe(1423)
    expect(result.aggregates.normalAffectiveCount).toBe(1668)
  })

  it('no hay warnings de columnas faltantes', () => {
    expect(result.warnings).toHaveLength(0)
  })

  it('incluye al menos una cautela metodológica', () => {
    expect(result.methodologicalCautions.length).toBeGreaterThan(0)
  })
})

// ── Unidad: calculateDUKEScores ──────────────────────────────────────────────

describe('calculateDUKEScores — casos unitarios', () => {
  const all5s = {
    P5701: 5 as const, P5702: 5 as const, P5703: 5 as const,
    P5704: 5 as const, P5705: 5 as const, P5706: 5 as const,
    P5707: 5 as const, P5708: 5 as const, P5709: 5 as const,
    P5710: 5 as const, P5711: 5 as const,
  }
  const all1s = {
    P5701: 1 as const, P5702: 1 as const, P5703: 1 as const,
    P5704: 1 as const, P5705: 1 as const, P5706: 1 as const,
    P5707: 1 as const, P5708: 1 as const, P5709: 1 as const,
    P5710: 1 as const, P5711: 1 as const,
  }

  it('todos en 5 → global=55 (máximo), apoyo normal en todas las escalas', () => {
    const scores = calculateDUKEScores(all5s)
    expect(scores.dukeGLOBAL).toBe(55)
    expect(scores.P57GLOBAL_R).toBe(0)
    expect(scores.dukeCONF).toBe(35)
    expect(scores.P57_AC_R).toBe(0)
    expect(scores.dukeAFECT).toBe(20)
    expect(scores.P57_AF_R).toBe(0)
  })

  it('todos en 1 → apoyo bajo en todas las escalas', () => {
    const scores = calculateDUKEScores(all1s)
    expect(scores.dukeGLOBAL).toBe(11)
    expect(scores.P57GLOBAL_R).toBe(1)
    expect(scores.dukeCONF).toBe(7)
    expect(scores.P57_AC_R).toBe(1)
    expect(scores.dukeAFECT).toBe(4)
    expect(scores.P57_AF_R).toBe(1)
  })

  it('ítem nulo en CONF → global=null, conf=null; afectivo sigue calculable', () => {
    // P5701 pertenece a GLOBAL y CONF pero NO a AFECT
    const scores = calculateDUKEScores({ ...all5s, P5701: null })
    expect(scores.dukeGLOBAL).toBeNull()
    expect(scores.P57GLOBAL_R).toBe(993)
    expect(scores.dukeCONF).toBeNull()
    expect(scores.P57_AC_R).toBe(993)
    expect(scores.dukeAFECT).toBe(20)
    expect(scores.P57_AF_R).toBe(0)
  })

  it('ítem nulo en AFECT → global=null, afect=null; conf con el resto', () => {
    // P5703 pertenece a GLOBAL y AFECT pero NO a CONF
    const scores = calculateDUKEScores({ ...all5s, P5703: null })
    expect(scores.dukeGLOBAL).toBeNull()
    expect(scores.P57GLOBAL_R).toBe(993)
    expect(scores.dukeAFECT).toBeNull()
    expect(scores.P57_AF_R).toBe(993)
    expect(scores.dukeCONF).toBe(35)
    expect(scores.P57_AC_R).toBe(0)
  })
})

// ── Estructura: dukeStudyToEvidenceAtoms ─────────────────────────────────────

describe('dukeStudyToEvidenceAtoms — estructura de átomos', () => {
  const parsed = parseDUKECSV(FIXTURE_CSV)
  const study = createDUKEStudy({
    municipalityId: 'test-municipality',
    sourceFileName: 'duke-eas-granada.csv',
    aggregates: parsed.aggregates,
    methodologicalCautions: parsed.methodologicalCautions,
    warnings: parsed.warnings,
  })
  const atoms = dukeStudyToEvidenceAtoms(study)

  it('genera exactamente 4 átomos', () => {
    expect(atoms).toHaveLength(4)
  })

  it('genera exactamente 3 átomos de tipo indicator', () => {
    expect(atoms.filter(a => a.kind === 'indicator')).toHaveLength(3)
  })

  it('genera exactamente 1 átomo methodological-caution', () => {
    expect(atoms.filter(a => a.kind === 'methodological-caution')).toHaveLength(1)
  })

  it('todos los átomos tienen requiresHumanValidation=true', () => {
    for (const atom of atoms) {
      expect(atom.methodology.requiresHumanValidation).toBe(true)
    }
  })

  it('todos los átomos incluyen el tag "duke-eas"', () => {
    for (const atom of atoms) {
      expect(atom.tags).toContain('duke-eas')
    }
  })

  it('provenance.origin es "complementary-study" (invariante sin modificar)', () => {
    for (const atom of atoms) {
      expect(atom.provenance.origin).toBe('complementary-study')
    }
  })

  it('todos los IDs de átomo contienen el municipalityId', () => {
    for (const atom of atoms) {
      expect(atom.id).toContain('test-municipality')
    }
  })

  it('devuelve array vacío cuando nValidGlobal=nValidConfidential=nValidAffective=0', () => {
    const emptyParsed = parseDUKECSV('')
    const emptyStudy = createDUKEStudy({
      municipalityId: 'test-municipality',
      sourceFileName: 'empty.csv',
      aggregates: emptyParsed.aggregates,
      methodologicalCautions: emptyParsed.methodologicalCautions,
    })
    expect(dukeStudyToEvidenceAtoms(emptyStudy)).toHaveLength(0)
  })
})

// ── Casos de borde: parseDUKECSV ─────────────────────────────────────────────

describe('parseDUKECSV — casos de borde', () => {
  it('CSV vacío devuelve n=0 y todos los agregados en cero', () => {
    const result = parseDUKECSV('')
    expect(result.aggregates.n).toBe(0)
    expect(result.aggregates.nValidGlobal).toBe(0)
    expect(result.aggregates.meanGlobal).toBe(0)
  })

  it('CSV solo con cabecera devuelve n=0', () => {
    const header = 'P5701,P5702,P5703,P5704,P5705,P5706,P5707,P5708,P5709,P5710,P5711'
    const result = parseDUKECSV(header + '\n')
    expect(result.aggregates.n).toBe(0)
  })

  it('valores fuera de rango 1–5 se tratan como incompletos', () => {
    const csv = [
      'P5701,P5702,P5703,P5704,P5705,P5706,P5707,P5708,P5709,P5710,P5711',
      '6,6,6,6,6,6,6,6,6,6,6',
      '0,0,0,0,0,0,0,0,0,0,0',
    ].join('\n')
    const result = parseDUKECSV(csv)
    expect(result.aggregates.n).toBe(2)
    expect(result.aggregates.nValidGlobal).toBe(0)
    expect(result.aggregates.incompleteGlobalCount).toBe(2)
  })

  it('una fila válida entre dos inválidas se procesa correctamente', () => {
    const csv = [
      'P5701,P5702,P5703,P5704,P5705,P5706,P5707,P5708,P5709,P5710,P5711',
      '6,6,6,6,6,6,6,6,6,6,6',
      '5,5,5,5,5,5,5,5,5,5,5',
      '0,0,0,0,0,0,0,0,0,0,0',
    ].join('\n')
    const result = parseDUKECSV(csv)
    expect(result.aggregates.n).toBe(3)
    expect(result.aggregates.nValidGlobal).toBe(1)
    expect(result.aggregates.meanGlobal).toBe(55)
  })
})
