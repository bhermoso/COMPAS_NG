/**
 * tests/atarfe-workspace.test.ts
 *
 * Especificación del workspace de Atarfe como municipio laboratorio de COMPÁS NG.
 *
 * Construye el workspace programáticamente replicando el flujo de App.tsx:
 *   parseDUKECSV / parsePREDIMEDCSV → createStudy → toEvidenceAtoms → workspace
 *
 * Estudios cargados:
 *   - DUKE-EAS     → fixtures/duke-eas-granada.csv (n=3028, referencia provincial Granada)
 *   - PREDIMED-EAS → fixtures/predimed-eas-granada.csv (n=3064, oleadas con módulo)
 *   - SF-12 EAS    → fixtures/sf12-eas-granada.csv (n=3064; PCS media=49.552, MCS media=51.139)
 *   - Priorización Temática → derivada del Plan Local de Salud de Atarfe
 *     (priorizacion_atarfe.csv → mapeo al catálogo THEMATIC_TOPICS)
 *     AVISO: solo para integración y desarrollo de motores, no procede de proceso REDCap.
 *
 * Pendiente de implementación (fuera de alcance de esta intervención):
 *   - IBSE: fixture no versionado (datos municipales, no EAS provincial).
 *     El IBSE ya existe en el workspace de producción de Atarfe vía REDCap.
 */

import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import { createCompleteMunicipalityWorkspace } from '../src/application/workspace'
import { parseDUKECSV, dukeStudyToEvidenceAtoms } from '../src/application/duke'
import { createDUKEStudy } from '../src/domain/duke'
import { parsePREDIMEDCSV, predimedStudyToEvidenceAtoms } from '../src/application/predimed'
import { createPREDIMEDStudy } from '../src/domain/predimed'
import { parseSF12CSV, sf12StudyToEvidenceAtoms } from '../src/application/sf12'
import { createSF12Study } from '../src/domain/sf12'
import { createThematicPrioritisation, THEMATIC_TOPICS } from '../src/domain/thematic-prioritisation'
import { thematicPrioritisationToEvidenceAtoms } from '../src/application/thematic-prioritisation'
import { addMunicipalDocument } from '../src/domain/repository'
import { stableAssetKey, upsertEvidenceAtom } from '../src/domain/evidence'
import { createMunicipalSnapshot } from '../src/domain/municipality-context'
import { createMunicipalInventory } from '../src/application/municipal-inventory'

// ── Fixtures ────────────────────────────────────────────────────────────────

const _dir = dirname(fileURLToPath(import.meta.url))
const DUKE_CSV     = readFileSync(resolve(_dir, '../fixtures/duke-eas-granada.csv'), 'utf-8')
const PREDIMED_CSV = readFileSync(resolve(_dir, '../fixtures/predimed-eas-granada.csv'), 'utf-8')
const SF12_CSV     = readFileSync(resolve(_dir, '../fixtures/sf12-eas-granada.csv'), 'utf-8')

// ── Construcción del workspace de Atarfe ─────────────────────────────────────
// Replica el flujo de App.tsx (handleLoadDUKECSV / handleLoadPREDIMEDCSV /
// handleSaveThematicPrioritisation) sin UI ni estado React.

const MUNICIPALITY_ID  = 'atarfe'
const DUKE_DOC_ID      = 'duke-eas-granada-fixture'
const PREDIMED_DOC_ID  = 'predimed-eas-granada-fixture'
const SF12_DOC_ID      = 'sf12-eas-granada-fixture'

// 1. Workspace vacío
let workspace = createCompleteMunicipalityWorkspace({
  id:         MUNICIPALITY_ID,
  name:       'Atarfe',
  province:   'Granada',
  ineCode:    '18022',
  createdBy:  'COMPÁS NG',
})

// 2. DUKE-EAS
const dukeParseResult = parseDUKECSV(DUKE_CSV)
const dukeStudy = createDUKEStudy({
  municipalityId:        MUNICIPALITY_ID,
  sourceFileName:        'duke-eas-granada.csv',
  aggregates:            dukeParseResult.aggregates,
  methodologicalCautions: dukeParseResult.methodologicalCautions,
  warnings:              dukeParseResult.warnings,
})
const dukeAtoms = dukeStudyToEvidenceAtoms(dukeStudy).map(a => ({
  ...a,
  provenance: { ...a.provenance, documentId: DUKE_DOC_ID },
}))

{
  const now = new Date().toISOString()
  let store = workspace.evidenceStore
  for (const atom of dukeAtoms) {
    store = upsertEvidenceAtom(store, atom, stableAssetKey(atom.municipalityId, atom.provenance.origin, atom.title))
  }
  workspace = {
    ...workspace,
    repository: addMunicipalDocument(workspace.repository, {
      id:           DUKE_DOC_ID,
      kind:         'complementary-study',
      title:        'DUKE-EAS - duke-eas-granada.csv',
      sourceFileName: 'duke-eas-granada.csv',
      source:       { system: 'EAS microdatos — Apoyo social funcional (DUKE-UNC-11)' },
      tags:         ['complementary-study', 'duke-eas', 'eas'],
    }),
    dukeStudy,
    evidenceStore: { ...store, updatedAt: now },
    updatedAt:    now,
  }
}

// 3. PREDIMED-EAS
const predimedParseResult = parsePREDIMEDCSV(PREDIMED_CSV)
const predimedStudy = createPREDIMEDStudy({
  municipalityId:        MUNICIPALITY_ID,
  sourceFileName:        'predimed-eas-granada.csv',
  aggregates:            predimedParseResult.aggregates,
  methodologicalCautions: predimedParseResult.methodologicalCautions,
  warnings:              predimedParseResult.warnings,
})
const predimedAtoms = predimedStudyToEvidenceAtoms(predimedStudy).map(a => ({
  ...a,
  provenance: { ...a.provenance, documentId: PREDIMED_DOC_ID },
}))

{
  const now = new Date().toISOString()
  let store = workspace.evidenceStore
  for (const atom of predimedAtoms) {
    store = upsertEvidenceAtom(store, atom, stableAssetKey(atom.municipalityId, atom.provenance.origin, atom.title))
  }
  workspace = {
    ...workspace,
    repository: addMunicipalDocument(workspace.repository, {
      id:           PREDIMED_DOC_ID,
      kind:         'complementary-study',
      title:        'PREDIMED-EAS - predimed-eas-granada.csv',
      sourceFileName: 'predimed-eas-granada.csv',
      source:       { system: 'EAS microdatos — Adherencia dieta mediterránea (PREDIMED-14)' },
      tags:         ['complementary-study', 'predimed-eas', 'eas'],
    }),
    predimedStudy,
    evidenceStore: { ...store, updatedAt: now },
    updatedAt:    now,
  }
}

// 4. SF-12 EAS
const sf12ParseResult = parseSF12CSV(SF12_CSV)
const sf12Study = createSF12Study({
  municipalityId:        MUNICIPALITY_ID,
  sourceFileName:        'sf12-eas-granada.csv',
  aggregates:            sf12ParseResult.aggregates,
  methodologicalCautions: sf12ParseResult.methodologicalCautions,
  warnings:              sf12ParseResult.warnings,
})
const sf12Atoms = sf12StudyToEvidenceAtoms(sf12Study).map(a => ({
  ...a,
  provenance: { ...a.provenance, documentId: SF12_DOC_ID },
}))

{
  const now = new Date().toISOString()
  let store = workspace.evidenceStore
  for (const atom of sf12Atoms) {
    store = upsertEvidenceAtom(store, atom, stableAssetKey(atom.municipalityId, atom.provenance.origin, atom.title))
  }
  workspace = {
    ...workspace,
    repository: addMunicipalDocument(workspace.repository, {
      id:           SF12_DOC_ID,
      kind:         'complementary-study',
      title:        'SF-12 EAS - sf12-eas-granada.csv',
      sourceFileName: 'sf12-eas-granada.csv',
      source:       { system: 'EAS microdatos — Salud percibida SF-12 (Vilagut et al. 2008)' },
      tags:         ['complementary-study', 'sf12-eas', 'eas'],
    }),
    sf12Study,
    evidenceStore: { ...store, updatedAt: now },
    updatedAt:    now,
  }
}

// 5. Priorización Temática — derivada del Plan Local de Salud de Atarfe
// Fuente: priorizacion_atarfe.csv (formato propio, no REDCap) → mapeo a THEMATIC_TOPICS.
// Solo para integración y desarrollo de motores; no procede de proceso participativo REDCap.
//   Bienestar Emocional     → bienestar-emocional  (prioridad 1 del PLS Atarfe)
//   Vida Activa             → actividad-fisica      (prioridad 2)
//   Alimentación Saludable  → alimentacion          (prioridad 3)
//   Vida sin Humo           → tabaco-alcohol-drogas (prioridad 7)
//   Sueño Saludable         → sueno-descanso        (prioridad 8)
const ATARFE_TOPIC_IDS = [
  'bienestar-emocional',
  'actividad-fisica',
  'alimentacion',
  'tabaco-alcohol-drogas',
  'sueno-descanso',
]
const thematicPrioritisation = createThematicPrioritisation(MUNICIPALITY_ID, ATARFE_TOPIC_IDS)
const tpAtoms = thematicPrioritisationToEvidenceAtoms(thematicPrioritisation, THEMATIC_TOPICS)

{
  const now = new Date().toISOString()
  workspace = {
    ...workspace,
    thematicPrioritisation,
    evidenceStore: {
      ...workspace.evidenceStore,
      atoms: [
        ...workspace.evidenceStore.atoms.filter(a => a.provenance.origin !== 'citizen-participation'),
        ...tpAtoms,
      ],
      updatedAt: now,
    },
    updatedAt: now,
  }
}

// ── Snapshot e inventario ───────────────────────────────────────────────────

const snapshot  = createMunicipalSnapshot(workspace)
const inventory = createMunicipalInventory(snapshot)

// ═══════════════════════════════════════════════════════════════════════════
// TESTS
// ═══════════════════════════════════════════════════════════════════════════

describe('Atarfe — workspace base', () => {
  it('municipio identificado correctamente', () => {
    expect(workspace.municipality.identity.id).toBe('atarfe')
    expect(workspace.municipality.identity.name).toBe('Atarfe')
    expect(workspace.municipality.identity.province).toBe('Granada')
    expect(workspace.municipality.identity.ineCode).toBe('18022')
  })

  it('schemaVersion 1.0.0', () => {
    expect(workspace.schemaVersion).toBe('1.0.0')
  })

  it('3 documentos en el repositorio (DUKE + PREDIMED + SF-12)', () => {
    expect(workspace.repository.documents).toHaveLength(3)
  })
})

// ── DUKE-EAS ──────────────────────────────────────────────────────────────

describe('Atarfe — DUKE-EAS (fixtures/duke-eas-granada.csv)', () => {
  it('dukeStudy cargado en workspace', () => {
    expect(workspace.dukeStudy).toBeDefined()
  })

  it('municipalityId = atarfe', () => {
    expect(workspace.dukeStudy?.municipalityId).toBe('atarfe')
  })

  it('n = 3.028 registros', () => {
    expect(workspace.dukeStudy?.aggregates.n).toBe(3028)
  })

  it('nValidGlobal = 3.028 (todos válidos)', () => {
    expect(workspace.dukeStudy?.aggregates.nValidGlobal).toBe(3028)
  })

  it('genera 4 evidence atoms (3 indicator + 1 methodological-caution)', () => {
    expect(dukeAtoms).toHaveLength(4)
    expect(dukeAtoms.filter(a => a.kind === 'indicator')).toHaveLength(3)
    expect(dukeAtoms.filter(a => a.kind === 'methodological-caution')).toHaveLength(1)
  })

  it('documento registrado con kind y tags correctos', () => {
    const doc = workspace.repository.documents.find(d => d.id === DUKE_DOC_ID)
    expect(doc).toBeDefined()
    expect(doc?.kind).toBe('complementary-study')
    expect(doc?.tags).toContain('duke-eas')
  })
})

// ── PREDIMED-EAS ─────────────────────────────────────────────────────────

describe('Atarfe — PREDIMED-EAS (fixtures/predimed-eas-granada.csv)', () => {
  it('predimedStudy cargado en workspace', () => {
    expect(workspace.predimedStudy).toBeDefined()
  })

  it('municipalityId = atarfe', () => {
    expect(workspace.predimedStudy?.municipalityId).toBe('atarfe')
  })

  it('n = 3.064 registros', () => {
    expect(workspace.predimedStudy?.aggregates.n).toBe(3064)
  })

  it('nValid = 712 (oleadas con módulo PREDIMED activo)', () => {
    expect(workspace.predimedStudy?.aggregates.nValid).toBe(712)
  })

  it('genera 2 evidence atoms (1 indicator + 1 methodological-caution)', () => {
    expect(predimedAtoms).toHaveLength(2)
    expect(predimedAtoms.filter(a => a.kind === 'indicator')).toHaveLength(1)
    expect(predimedAtoms.filter(a => a.kind === 'methodological-caution')).toHaveLength(1)
  })

  it('documento registrado con kind y tags correctos', () => {
    const doc = workspace.repository.documents.find(d => d.id === PREDIMED_DOC_ID)
    expect(doc).toBeDefined()
    expect(doc?.kind).toBe('complementary-study')
    expect(doc?.tags).toContain('predimed-eas')
  })
})

// ── SF-12 EAS ────────────────────────────────────────────────────────────

describe('Atarfe — SF-12 EAS (fixtures/sf12-eas-granada.csv)', () => {
  it('sf12Study cargado en workspace', () => {
    expect(workspace.sf12Study).toBeDefined()
  })

  it('municipalityId = atarfe', () => {
    expect(workspace.sf12Study?.municipalityId).toBe('atarfe')
  })

  it('n = 3.064 registros', () => {
    expect(workspace.sf12Study?.aggregates.n).toBe(3064)
  })

  it('nValidPCS = 3.047 (99,4 %)', () => {
    expect(workspace.sf12Study?.aggregates.nValidPCS).toBe(3047)
  })

  it('nValidMCS = 3.047 (99,4 %)', () => {
    expect(workspace.sf12Study?.aggregates.nValidMCS).toBe(3047)
  })

  it('genera 3 evidence atoms (2 indicator + 1 methodological-caution)', () => {
    expect(sf12Atoms).toHaveLength(3)
    expect(sf12Atoms.filter(a => a.kind === 'indicator')).toHaveLength(2)
    expect(sf12Atoms.filter(a => a.kind === 'methodological-caution')).toHaveLength(1)
  })

  it('documento registrado con kind y tags correctos', () => {
    const doc = workspace.repository.documents.find(d => d.id === SF12_DOC_ID)
    expect(doc).toBeDefined()
    expect(doc?.kind).toBe('complementary-study')
    expect(doc?.tags).toContain('sf12-eas')
  })
})

// ── Priorización Temática ────────────────────────────────────────────────

describe('Atarfe — Priorización Temática (desarrollo — derivada del PLS Atarfe)', () => {
  it('thematicPrioritisation cargada en workspace', () => {
    expect(workspace.thematicPrioritisation).toBeDefined()
  })

  it('municipalityId = atarfe', () => {
    expect(workspace.thematicPrioritisation?.municipalityId).toBe('atarfe')
  })

  it('5 temas seleccionados (MAX_SELECTED_TOPICS)', () => {
    expect(workspace.thematicPrioritisation?.selectedTopicIds).toHaveLength(5)
  })

  it('bienestar-emocional incluido (prioridad 1 del PLS Atarfe)', () => {
    expect(workspace.thematicPrioritisation?.selectedTopicIds).toContain('bienestar-emocional')
  })

  it('actividad-fisica incluido (Vida Activa → prioridad 2)', () => {
    expect(workspace.thematicPrioritisation?.selectedTopicIds).toContain('actividad-fisica')
  })

  it('alimentacion incluido (Alimentación Saludable → prioridad 3)', () => {
    expect(workspace.thematicPrioritisation?.selectedTopicIds).toContain('alimentacion')
  })

  it('genera 5 átomos strategic-priority en el evidenceStore', () => {
    expect(tpAtoms).toHaveLength(5)
    expect(tpAtoms.every(a => a.kind === 'strategic-priority')).toBe(true)
    expect(tpAtoms.every(a => a.provenance.origin === 'citizen-participation')).toBe(true)
  })
})

// ── EvidenceStore ──────────────────────────────────────────────────────────

describe('Atarfe — EvidenceStore', () => {
  it('14 átomos totales (4 DUKE + 2 PREDIMED + 3 SF-12 + 5 TP)', () => {
    expect(workspace.evidenceStore.atoms).toHaveLength(14)
  })

  it('4 átomos con tag duke-eas', () => {
    const atoms = workspace.evidenceStore.atoms.filter(a => a.tags.includes('duke-eas'))
    expect(atoms).toHaveLength(4)
  })

  it('2 átomos con tag predimed-eas', () => {
    const atoms = workspace.evidenceStore.atoms.filter(a => a.tags.includes('predimed-eas'))
    expect(atoms).toHaveLength(2)
  })

  it('3 átomos con tag sf12-eas', () => {
    const atoms = workspace.evidenceStore.atoms.filter(a => a.tags.includes('sf12-eas'))
    expect(atoms).toHaveLength(3)
  })

  it('5 átomos strategic-priority (priorización)', () => {
    const atoms = workspace.evidenceStore.atoms.filter(a => a.kind === 'strategic-priority')
    expect(atoms).toHaveLength(5)
  })

  it('todos los átomos pertenecen al municipio atarfe', () => {
    expect(workspace.evidenceStore.atoms.every(a => a.municipalityId === 'atarfe')).toBe(true)
  })
})

// ── MunicipalSnapshot e Inventario ────────────────────────────────────────

describe('Atarfe — MunicipalSnapshot e Inventario', () => {
  it('snapshot contiene dukeStudy, predimedStudy, sf12Study y thematicPrioritisation', () => {
    expect(snapshot.dukeStudy).toBeDefined()
    expect(snapshot.predimedStudy).toBeDefined()
    expect(snapshot.sf12Study).toBeDefined()
    expect(snapshot.thematicPrioritisation).toBeDefined()
  })

  it('inventory.hasDUKE = true', () => {
    expect(inventory.hasDUKE).toBe(true)
  })

  it('inventory.hasPREDIMED = true', () => {
    expect(inventory.hasPREDIMED).toBe(true)
  })

  it('inventory.hasSF12 = true', () => {
    expect(inventory.hasSF12).toBe(true)
  })

  it('inventory.hasThematicPrioritisation = true', () => {
    expect(inventory.hasThematicPrioritisation).toBe(true)
  })

  it('dukeRecordCount = 3.028', () => {
    expect(inventory.dukeRecordCount).toBe(3028)
  })

  it('predimedRecordCount = 712', () => {
    expect(inventory.predimedRecordCount).toBe(712)
  })

  it('sf12RecordCount = 3.047', () => {
    expect(inventory.sf12RecordCount).toBe(3047)
  })

  it('repositoryDocumentCount = 3', () => {
    expect(inventory.repositoryDocumentCount).toBe(3)
  })

  it('evidenceAtomCount = 14', () => {
    expect(inventory.evidenceAtomCount).toBe(14)
  })

  it('sin warnings en el inventario', () => {
    expect(inventory.warnings).toHaveLength(0)
  })
})

// ── Preparación para motores ──────────────────────────────────────────────

describe('Atarfe — preparación para motores COMPÁS NG', () => {
  it('MIT: evidenceStore no vacío (motores pueden arrancar)', () => {
    expect(workspace.evidenceStore.atoms.length).toBeGreaterThan(0)
  })

  it('Perfil de Salud Local: DUKE, PREDIMED y SF-12 presentes en snapshot', () => {
    expect(snapshot.dukeStudy).toBeDefined()
    expect(snapshot.predimedStudy).toBeDefined()
    expect(snapshot.sf12Study).toBeDefined()
  })

  it('Motor de Traducción Estratégica: thematicPrioritisation con temas', () => {
    expect(snapshot.thematicPrioritisation).toBeDefined()
    expect(snapshot.thematicPrioritisation!.selectedTopicIds.length).toBeGreaterThan(0)
  })

  it('Plan de Acción / Agenda / Compiler: evidencia + priorización disponibles', () => {
    expect(snapshot.evidenceStore.atoms.length).toBeGreaterThan(0)
    expect(snapshot.thematicPrioritisation).toBeDefined()
  })

  it('Plan Local de Salud: snapshot cumple condiciones de entrada completas', () => {
    expect(snapshot.dukeStudy).toBeDefined()
    expect(snapshot.predimedStudy).toBeDefined()
    expect(snapshot.sf12Study).toBeDefined()
    expect(snapshot.thematicPrioritisation).toBeDefined()
    expect(snapshot.evidenceStore.atoms.length).toBeGreaterThan(0)
  })

  it('IBSE: no en este test (fixture municipal no versionado — ya cargado en prod)', () => {
    // El IBSE de Atarfe existe en el workspace de producción (localStorage del navegador).
    // No hay fixture versionado para IBSE municipal; se carga vía REDCap en la UI.
    expect(snapshot.ibseStudy).toBeUndefined()
  })

  it('SF-12: instrumento implementado y cargado correctamente', () => {
    expect(snapshot.sf12Study).toBeDefined()
    expect(snapshot.sf12Study?.aggregates.nValidPCS).toBe(3047)
    expect(snapshot.sf12Study?.aggregates.nValidMCS).toBe(3047)
  })
})
