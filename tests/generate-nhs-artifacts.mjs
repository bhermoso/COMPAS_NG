/**
 * generate-nhs-artifacts.mjs
 *
 * Script de auditoría: genera NHSHealthProfileArtifact reales
 * para Atarfe y Zagra y los imprime en formato legible.
 *
 * Uso: node --experimental-vm-modules tests/generate-nhs-artifacts.mjs
 * (o vía vitest si se configura como test de integración)
 *
 * NO modifica nada. Solo genera y muestra.
 */

import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const _dir = dirname(fileURLToPath(import.meta.url));

// ── Importaciones del sistema ────────────────────────────────────────────────

import { parseIBSECSV }    from '../src/application/ibse/IBSECSVParser.js';
import { parseDUKECSV }    from '../src/application/duke/DUKECSVParser.js';
import { parsePREDIMEDCSV } from '../src/application/predimed/PREDIMEDCSVParser.js';
import { parseSF12CSV }    from '../src/application/sf12/SF12CSVParser.js';
import { parseSuenoCSV }   from '../src/application/sueno/SuenoCSVParser.js';
import { parseCAGECSV }    from '../src/application/cage/CAGECSVParser.js';

import { createIBSEStudy }    from '../src/domain/ibse/IBSEStudy.js';
import { createDUKEStudy }    from '../src/domain/duke/DUKEStudy.js';
import { createPREDIMEDStudy } from '../src/domain/predimed/PREDIMEDStudy.js';
import { createSF12Study }    from '../src/domain/sf12/SF12Study.js';
import { createSuenoStudy }   from '../src/domain/sueno/SuenoStudy.js';
import { createCAGEStudy }    from '../src/domain/cage/CAGEStudy.js';

import { compileNHSHealthProfile } from '../src/application/nhs-health-profile-compiler/NHSHealthProfileCompiler.js';
import { createCompleteMunicipalityWorkspace } from '../src/application/workspace/index.js';

// ── Fixtures disponibles ─────────────────────────────────────────────────────

const IBSE_ATARFE_CSV = readFileSync(resolve(_dir, '../fixtures/ibse-atarfe.csv'), 'utf-8');
const DUKE_CSV        = readFileSync(resolve(_dir, '../fixtures/duke-eas-granada.csv'), 'utf-8');
const PREDIMED_CSV    = readFileSync(resolve(_dir, '../fixtures/predimed-eas-granada.csv'), 'utf-8');
const SF12_CSV        = readFileSync(resolve(_dir, '../fixtures/sf12-eas-granada.csv'), 'utf-8');
const SUENO_CSV       = readFileSync(resolve(_dir, '../fixtures/sueno-eas-granada.csv'), 'utf-8');
const CAGE_CSV        = readFileSync(resolve(_dir, '../fixtures/cage-eas-granada.csv'), 'utf-8');

// ── Parsear fixtures ──────────────────────────────────────────────────────────

const ibseResult    = parseIBSECSV(IBSE_ATARFE_CSV);
const dukeResult    = parseDUKECSV(DUKE_CSV);
const predimedResult = parsePREDIMEDCSV(PREDIMED_CSV);
const sf12Result    = parseSF12CSV(SF12_CSV);
const suenoResult   = parseSuenoCSV(SUENO_CSV);
const cageResult    = parseCAGECSV(CAGE_CSV);

// ── Crear estudios ────────────────────────────────────────────────────────────

const ibseStudy    = createIBSEStudy({ municipalityId: 'atarfe', sourceFileName: 'ibse-atarfe.csv', aggregates: ibseResult.aggregates, methodologicalCautions: ibseResult.cautions });
const dukeStudy    = createDUKEStudy({ municipalityId: 'atarfe', sourceFileName: 'duke-eas-granada.csv', aggregates: dukeResult.aggregates, methodologicalCautions: dukeResult.cautions, warnings: dukeResult.warnings });
const predimedStudy = createPREDIMEDStudy({ municipalityId: 'atarfe', sourceFileName: 'predimed-eas-granada.csv', aggregates: predimedResult.aggregates, methodologicalCautions: predimedResult.cautions });
const sf12Study    = createSF12Study({ municipalityId: 'atarfe', sourceFileName: 'sf12-eas-granada.csv', aggregates: sf12Result.aggregates });
const suenoStudy   = createSuenoStudy({ municipalityId: 'atarfe', sourceFileName: 'sueno-eas-granada.csv', aggregates: suenoResult.aggregates, methodologicalCautions: suenoResult.cautions });
const cageStudy    = createCAGEStudy({ municipalityId: 'atarfe', sourceFileName: 'cage-eas-granada.csv', aggregates: cageResult.aggregates, methodologicalCautions: cageResult.cautions });

// ── PSL simulado (Atarfe — 6 estudios completos) ──────────────────────────────

const pslAtarfeFull = {
  id: 'psl-atarfe-audit-001',
  municipalityId: 'atarfe',
  status: 'validated',
  version: '2026-06-30T10:00:00.000Z',
  evidenceStoreVersion: '2026-06-30T09:00:00.000Z',
  strategicFrameworkSectionIds: ['normativo', 'estrategico', 'metodologico', 'salutogenico', 'fuentes'],
  healthReportDocumentId: 'informe-salud-atarfe-2025',
  healthReportTitle: 'Informe de Salud de Atarfe 2025',
  healthReportSectionCount: 12,
  healthReportAtomCount: 8,
  totalEvidenceAtoms: 214,
  integrityErrors: 0,
  integrityWarnings: 2,
  atomsByOrigin: { ibse: 40, 'duke-eas': 6, 'predimed-eas': 6, 'sf12-eas': 6, 'sueno-eas': 6, 'cage-eas': 6, 'health-report': 8 },
  atomsByKind: { indicator: 60, determinant: 12, asset: 8, 'methodological-caution': 4 },
  evidenceAtomIds: [],
  originsSummary: ['cage-eas', 'duke-eas', 'health-report', 'ibse', 'predimed-eas', 'sf12-eas', 'sueno-eas'],
  ibsePresent: true, dukePresent: true, predimedPresent: true,
  sf12Present: true, suenoPresent: true, cagePresent: true,
  thematicPrioritisationPresent: true,
  complementaryStudyCount: 6,
  territorialSummary: 'El territorio de Atarfe presenta...',
  determinantCount: 5, assetCount: 4, indicatorCount: 10,
  qualitativeFindingCount: 2, methodologicalCautionCount: 3,
  preliminaryOpportunities: ['Salud mental', 'Alimentación saludable'],
  longitudinalActive: false, longitudinalNote: '', longitudinalEvidenceCount: 0,
  marcosAplicados: [{ framework: 'EPVSA', elementCount: 4 }],
  tensionesEstructurales: ['Brecha socioeconómica norte-sur'],
  conflictos: [], tensionesEscaladas: [], tensionesNoEscaladas: [], ruidoEstructural: [],
  areasDeIntervencion: [],
  conclusiones: { content: 'Conclusiones del equipo técnico.', status: 'authored', authorshipNote: '' },
  cierreInterpretativo: { content: 'Cierre interpretativo.', status: 'authored', authorshipNote: '' },
  priorizacion: {
    candidaturasTecnicas: [], hasTechnicalCandidatures: false,
    tematicasSeleccionadasIds: ['bienestar-emocional', 'alimentacion-saludable'],
    tematicasSeleccionadasLabels: ['Bienestar Emocional', 'Alimentación Saludable'],
    hasParticipatorySelection: true,
    deliberacionNota: 'El Grupo Motor deliberó y alcanzó consenso sobre las prioridades.',
    consensoDocumentado: true,
  },
  priorizacionStatus: 'complete',
  generatedAt: '2026-06-30T09:30:00.000Z',
  validatedAt: '2026-06-30T10:00:00.000Z',
  validatedBy: 'Técnica de salud pública — DAP Granada-Metro',
  requiresHumanValidation: true,
};

// ── Workspace Atarfe (6 estudios) ─────────────────────────────────────────────

const workspaceAtarfe = {
  municipality: { identity: { id: 'atarfe', name: 'Atarfe', province: 'Granada' }, metadata: { createdAt: '', updatedAt: '' } },
  repository: { documents: [], municipalityId: 'atarfe' },
  evidenceStore: { atoms: [], municipalityId: 'atarfe', updatedAt: '2026-06-30T09:00:00.000Z' },
  ibseStudy, dukeStudy, predimedStudy, sf12Study, suenoStudy, cageStudy,
  thematicPrioritisation: {
    id: 'tp-atarfe', municipalityId: 'atarfe',
    selectedTopicIds: ['bienestar-emocional', 'alimentacion-saludable'],
    createdAt: '', updatedAt: '',
  },
};

// ── PSL simulado (Zagra — sin estudios EAS, sin IBSE) ─────────────────────────

const pslZagraEmpty = {
  ...pslAtarfeFull,
  id: 'psl-zagra-audit-001',
  municipalityId: 'zagra',
  healthReportTitle: 'Plan de Salud Local de Zagra 2017',
  healthReportDocumentId: 'psl-zagra-2017',
  totalEvidenceAtoms: 12,
  originsSummary: ['health-report'],
  ibsePresent: false, dukePresent: false, predimedPresent: false,
  sf12Present: false, suenoPresent: false, cagePresent: false,
  thematicPrioritisationPresent: true,
  complementaryStudyCount: 0,
  validatedAt: '2026-06-30T10:00:00.000Z',
  validatedBy: 'Coordinadora de salud comunitaria — DAP Granada-Metro',
};

// Zagra tiene priorización pero sin estudios EAS
const workspaceZagra = {
  municipality: { identity: { id: 'zagra', name: 'Zagra', province: 'Granada' }, metadata: { createdAt: '', updatedAt: '' } },
  repository: { documents: [], municipalityId: 'zagra' },
  evidenceStore: { atoms: [], municipalityId: 'zagra', updatedAt: '2026-06-30T09:00:00.000Z' },
  thematicPrioritisation: {
    id: 'tp-zagra', municipalityId: 'zagra',
    selectedTopicIds: ['salud-mental', 'envejecimiento-activo'],
    createdAt: '', updatedAt: '',
  },
};

// ── Escenario 3: Atarfe sin IBSE (solo EAS provincial) ───────────────────────

const pslAtarfeSinIBSE = {
  ...pslAtarfeFull,
  id: 'psl-atarfe-no-ibse-001',
  ibsePresent: false,
  complementaryStudyCount: 5,
};

const workspaceAtarfeSinIBSE = { ...workspaceAtarfe, ibseStudy: undefined };

// ── Generar artefactos ────────────────────────────────────────────────────────

const resultAtarfe = compileNHSHealthProfile({
  psl: pslAtarfeFull,
  workspace: workspaceAtarfe,
  compiledBy: 'Técnica de salud pública — DAP Granada-Metro',
  municipalityName: 'Atarfe',
  municipalityProvince: 'Granada',
  existingArtifactCount: 0,
});

const resultZagra = compileNHSHealthProfile({
  psl: pslZagraEmpty,
  workspace: workspaceZagra,
  compiledBy: 'Coordinadora de salud comunitaria — DAP Granada-Metro',
  municipalityName: 'Zagra',
  municipalityProvince: 'Granada',
  existingArtifactCount: 0,
});

const resultAtarfeSinIBSE = compileNHSHealthProfile({
  psl: pslAtarfeSinIBSE,
  workspace: workspaceAtarfeSinIBSE,
  compiledBy: 'Técnica de salud pública — DAP Granada-Metro',
  municipalityName: 'Atarfe (sin IBSE)',
  municipalityProvince: 'Granada',
  existingArtifactCount: 1,
});

// ── Función de presentación legible ──────────────────────────────────────────

function presentArtifact(label, result) {
  console.log('\n' + '='.repeat(72));
  console.log(`ARTEFACTO: ${label}`);
  console.log('='.repeat(72));

  if (!result.ok) {
    console.log('❌ COMPILACIÓN FALLIDA');
    result.violations.forEach(v => console.log(`  [${v.gate}] ${v.message}`));
    return;
  }

  const a = result.artifact;
  const p = a.portada;

  console.log('\n── PORTADA ─────────────────────────────────────────────────────────');
  console.log(`Municipio:       ${p.municipalityName} (${p.municipalityProvince})`);
  console.log(`Año:             ${p.year}`);
  console.log(`Estudios:        ${p.complementaryStudyCount} de 6 estudios disponibles`);
  if (p.validatedAt) console.log(`Validado:        ${new Date(p.validatedAt).toLocaleDateString('es-ES')} · ${p.validatedBy ?? 'No especificado'}`);
  if (p.fewComparatorsWarning) console.log(`⚠️  AVISO:  Menos de 3 indicadores tienen referencia comparativa disponible.`);

  console.log('\n── DOMINIOS DE INDICADORES ─────────────────────────────────────────');
  if (a.dominios.length === 0) {
    console.log('  (Sin dominios disponibles — no hay estudios cargados)');
  }
  for (const dominio of a.dominios) {
    console.log(`\n  ${dominio.label.toUpperCase()}`);
    for (const ind of dominio.indicators) {
      const ref = ind.reference
        ? `Ref: ${ind.reference.value.toFixed(1)} [${ind.reference.population}]`
        : 'Sin referencia disponible';
      const pos = ind.position
        ? (ind.position === 'above' ? '▲ Por encima' : ind.position === 'below' ? '▼ Por debajo' : '→ Similar')
        : '';
      const warn = ind.smallSampleWarning ? ' ⚠️ (muestra reducida)' : '';
      console.log(`    ${ind.label.padEnd(38)} ${String(ind.value.toFixed(1)).padStart(6)} ${ind.unit.padEnd(14)} ${ref}`);
      if (ind.position) console.log(`    ${''.padEnd(38)} ${' '.padStart(6)} ${' '.padEnd(14)} ${pos}${warn}`);
    }
  }

  if (a.participacionCiudadana) {
    const pc = a.participacionCiudadana;
    console.log('\n── PARTICIPACIÓN CIUDADANA ─────────────────────────────────────────');
    console.log(`  ${pc.realizada ? `Realizada · ${pc.tematicasCount} temáticas identificadas` : 'No realizada en este diagnóstico'}`);
  }

  console.log('\n── ALCANCE DEL DIAGNÓSTICO ─────────────────────────────────────────');
  console.log(`  Estudios disponibles (${a.alcance.availableStudies.length}/6):`);
  a.alcance.availableStudies.forEach(s => console.log(`    ✅ ${s.label}`));
  if (a.alcance.missingStudies.length > 0) {
    console.log(`  Estudios no disponibles (${a.alcance.missingStudies.length}/6):`);
    a.alcance.missingStudies.forEach(s => console.log(`    — ${s.label}`));
  }
  if (a.alcance.indicatorsWithoutReference.length > 0) {
    console.log(`  Indicadores sin referencia comparativa:`);
    a.alcance.indicatorsWithoutReference.forEach(r => console.log(`    ◌ ${r.label}: ${r.reason}`));
  }
  console.log(`\n  CAUTELA: "${a.alcance.cautela}"`);

  console.log('\n── TRAZABILIDAD ─────────────────────────────────────────────────────');
  console.log(`  Versión:         ${a.artifactVersion}`);
  console.log(`  PSL origen:      ${a.sourcePSLId}`);
  console.log(`  Compilado:       ${new Date(a.compiledAt).toLocaleString('es-ES')}`);
  console.log(`  Compilado por:   ${a.compiledBy ?? 'No especificado'}`);
  console.log(`  isCongealed:     ${a.isCongealed}`);
}

// ── Ejecutar ──────────────────────────────────────────────────────────────────

presentArtifact('ATARFE — 6 estudios completos (IBSE municipal + EAS Granada)', resultAtarfe);
presentArtifact('ZAGRA — Sin estudios EAS (solo priorización ciudadana)', resultZagra);
presentArtifact('ATARFE — Sin IBSE (5 estudios EAS Granada)', resultAtarfeSinIBSE);

// ── Resumen de aggregates reales ──────────────────────────────────────────────

console.log('\n' + '='.repeat(72));
console.log('DATOS REALES DE FIXTURES — RESUMEN DE AGREGADOS');
console.log('='.repeat(72));
console.log('\nIBSE Atarfe (ibse-atarfe.csv):');
console.log('  n:', ibseResult.aggregates.n, '| nValid:', ibseResult.aggregates.nValid);
console.log('  meanTotal:', ibseResult.aggregates.meanTotal);
console.log('  meanVinculo:', ibseResult.aggregates.meanFactorVinculo);
console.log('  meanSituacion:', ibseResult.aggregates.meanFactorSituacion);
console.log('  meanControl:', ibseResult.aggregates.meanFactorControl);
console.log('  meanPersona:', ibseResult.aggregates.meanFactorPersona);
if (ibseResult.cautions.length) console.log('  cautions:', ibseResult.cautions);

console.log('\nDUKE-EAS Granada (duke-eas-granada.csv):');
console.log('  nValidGlobal:', dukeResult.aggregates.nValidGlobal);
console.log('  meanGlobal:', dukeResult.aggregates.meanGlobal, '  [ref EAS Granada: 49.2]');
console.log('  lowGlobal%:', dukeResult.aggregates.lowGlobalPercentage);

console.log('\nPREDIMED Granada (predimed-eas-granada.csv):');
console.log('  nValid:', predimedResult.aggregates.nValid);
console.log('  meanScore:', predimedResult.aggregates.meanScore, '  [ref EAS Granada: 7.6]');
console.log('  high%:', predimedResult.aggregates.highPercentage);

console.log('\nSF-12 Granada (sf12-eas-granada.csv):');
console.log('  nValidPCS:', sf12Result.aggregates.nValidPCS);
console.log('  meanPCS:', sf12Result.aggregates.meanPCS, '  [ref España: 50.0]');
console.log('  meanMCS:', sf12Result.aggregates.meanMCS, '  [ref España: 50.0]');

console.log('\nSueño Granada (sueno-eas-granada.csv):');
console.log('  nValidP33R:', suenoResult.aggregates.nValidP33R);
console.log('  pctInsuficiente:', suenoResult.aggregates.pctInsufficientSleep);

console.log('\nCAGE Granada (cage-eas-granada.csv):');
console.log('  nValidCAGER:', cageResult.aggregates.nValidCAGER);
console.log('  pctRisk:', cageResult.aggregates.pctRisk);
