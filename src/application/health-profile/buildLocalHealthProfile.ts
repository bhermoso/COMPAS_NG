/**
 * buildLocalHealthProfile
 *
 * Función pura. Construye un LocalHealthProfile en estado "generated"
 * a partir de los outputs del pipeline existente y del workspace.
 *
 * Contratos garantizados:
 *  - No escribe en el workspace.
 *  - No persiste nada.
 *  - No llama a localStorage.
 *  - No depende de React.
 *  - No genera datos simulados; todo contenido procede de los inputs.
 *  - El capítulo V es scaffold marcado como "authored" pendiente.
 *  - El capítulo VII contiene datos reales + nota de deliberación humana.
 *  - El Informe de Salud se referencia por ID; nunca se embebe su contenido.
 */

import type { EvidenceStore } from "../../domain/evidence";
import type { IntegrityGuardResult } from "../../application/evidence";
import type { EstadoTerritorialEvolutivo } from "../../application/territorial-interpretation";
import type {
  ReconciliacionResult,
  ConflictoInterpretativo,
  TensionAnalizada,
} from "../../application/reconciliation";
import type { OITResult, OITOpportunity } from "../../application/oit";
import type { MunicipalityWorkspace } from "../../domain/workspace";
import type { IBSEStudy } from "../../domain/ibse";
import type {
  LocalHealthProfile,
  PSLConflicto,
  PSLTension,
  PSLAreaIntervencion,
  PSLPriorizacion,
  PSLPriorizacionStatus,
} from "../../domain/health-profile";
import { THEMATIC_TOPICS } from "../../domain/thematic-prioritisation";

// ── Secciones del Marco Estratégico (Capítulo I) ──────────────────────────────
// Corresponden a los IDs fijos de createStrategicFramework().
const STRATEGIC_FRAMEWORK_SECTION_IDS: string[] = [
  "normativo",
  "estrategico",
  "metodologico",
  "salutogenico",
  "fuentes",
];

// ── Input ─────────────────────────────────────────────────────────────────────

export interface BuildLocalHealthProfileInput {
  sanitizedStore: EvidenceStore;
  integrityResult: IntegrityGuardResult;
  mit: EstadoTerritorialEvolutivo;
  reconciliacion: ReconciliacionResult;
  oitParaDecision: OITResult;
  workspace: MunicipalityWorkspace;
}

// ── Entry point ───────────────────────────────────────────────────────────────

export function buildLocalHealthProfile(
  input: BuildLocalHealthProfileInput
): LocalHealthProfile {
  const { sanitizedStore, integrityResult, mit, reconciliacion, oitParaDecision, workspace } =
    input;

  const now = new Date().toISOString();
  const lt1 = mit.dimensionDiagnostica;

  // ── Capítulo II: referencia al Informe de Salud ──────────────────────────
  const hr = workspace.healthReport;
  const hrAtomCount = sanitizedStore.atoms.filter(
    (a) => a.provenance.origin === "health-report"
  ).length;

  // ── Capítulo III: diagnóstico integrado ──────────────────────────────────
  const originsSummary = [...new Set(
    sanitizedStore.atoms.map((a) => a.provenance.origin)
  )].sort();

  const complementaryStudyCount = [
    workspace.ibseStudy,
    workspace.dukeStudy,
    workspace.predimedStudy,
    workspace.sf12Study,
    workspace.suenoStudy,
    workspace.cageStudy,
    workspace.auditcStudy,
    workspace.ipaqStudy,
    workspace.ghq12Study,
    workspace.phq9Study,
    workspace.psqiStudy,
    workspace.fagerstromStudy,
    workspace.sbqStudy,
  ].filter(Boolean).length;

  // ── Capítulo VII: priorización scaffold ──────────────────────────────────
  const topicMap = new Map(THEMATIC_TOPICS.map((t) => [t.id, t.label]));
  const selectedIds = workspace.thematicPrioritisation?.selectedTopicIds ?? [];

  const hasTechnical =
    oitParaDecision.opportunities.length > 0 &&
    oitParaDecision.opportunities[0].id !== "oit-expand-evidence-base";

  const priorizacion: PSLPriorizacion = {
    candidaturasTecnicas: oitParaDecision.opportunities.map((o) => ({
      id: o.id,
      title: o.title,
      rationale: o.rationale,
      relatedEvidenceIds: [...o.relatedEvidenceIds],
    })),
    hasTechnicalCandidatures: hasTechnical,
    tematicasSeleccionadasIds: [...selectedIds],
    tematicasSeleccionadasLabels: selectedIds.map((id) => topicMap.get(id) ?? id),
    hasParticipatorySelection: selectedIds.length > 0,
    deliberacionNota:
      "Pendiente de autoría humana. El equipo técnico, la ciudadanía y las " +
      "instituciones deben deliberar sobre las prioridades definitivas del " +
      "municipio a partir de las candidaturas técnicas y las preferencias " +
      "ciudadanas. Este capítulo no puede ser completado por el sistema.",
    consensoDocumentado: false,
  };

  const priorizacionStatus: PSLPriorizacionStatus =
    hasTechnical || selectedIds.length > 0 ? "partial" : "scaffold";

  return {
    // ── Identidad ──────────────────────────────────────────────────────────
    id: crypto.randomUUID(),
    municipalityId: workspace.municipality.identity.id,
    status: "generated",
    version: now,
    evidenceStoreVersion: sanitizedStore.updatedAt,

    // ── I: Marco Estratégico ───────────────────────────────────────────────
    strategicFrameworkSectionIds: STRATEGIC_FRAMEWORK_SECTION_IDS,

    // ── II: Informe de Salud — referencia, nunca el documento ─────────────
    healthReportDocumentId: hr?.linkedDocumentId,
    healthReportTitle: hr?.title,
    healthReportSectionCount: hr?.sections.length ?? 0,
    healthReportAtomCount: hrAtomCount,

    // ── III: Diagnóstico integrado ─────────────────────────────────────────
    totalEvidenceAtoms: integrityResult.stats.totalAtoms,
    integrityErrors: integrityResult.errors.length,
    integrityWarnings: integrityResult.warnings.length,
    atomsByOrigin: { ...integrityResult.stats.byOrigin },
    atomsByKind: { ...integrityResult.stats.byKind },
    evidenceAtomIds: sanitizedStore.atoms.map((a) => a.id),
    originsSummary,
    ibsePresent: workspace.ibseStudy !== undefined,
    dukePresent: workspace.dukeStudy !== undefined,
    predimedPresent: workspace.predimedStudy !== undefined,
    sf12Present: workspace.sf12Study !== undefined,
    suenoPresent: workspace.suenoStudy !== undefined,
    cagePresent: workspace.cageStudy !== undefined,
    auditcPresent: workspace.auditcStudy !== undefined,
    ipaqPresent: workspace.ipaqStudy !== undefined,
    ghq12Present: workspace.ghq12Study !== undefined,
    phq9Present: workspace.phq9Study !== undefined,
    psqiPresent: workspace.psqiStudy !== undefined,
    fagerstromPresent: workspace.fagerstromStudy !== undefined,
    sbqPresent: workspace.sbqStudy !== undefined,
    thematicPrioritisationPresent: workspace.thematicPrioritisation !== undefined,
    complementaryStudyCount,

    // ── IV: Interpretación territorial ────────────────────────────────────
    territorialSummary: lt1.summary,
    determinantCount: lt1.determinants.length,
    assetCount: lt1.assets.length,
    indicatorCount: lt1.indicators.length,
    qualitativeFindingCount: lt1.qualitativeFindings.length,
    methodologicalCautionCount: lt1.methodologicalCautions.length,
    preliminaryOpportunities: [...lt1.preliminaryOpportunities],
    longitudinalActive: mit.dimensionLongitudinal.activa,
    longitudinalNote: mit.dimensionLongitudinal.nota,
    longitudinalEvidenceCount: mit.dimensionLongitudinal.evidenciasLongitudinales,
    marcosAplicados: [...mit.marcosAplicados],
    tensionesEstructurales: [...mit.tensionesEstructurales],
    conflictos: reconciliacion.conflictos.map(mapConflicto),
    tensionesEscaladas: reconciliacion.tensionesEscaladas.map(mapTension),
    tensionesNoEscaladas: reconciliacion.tensionesNoEscaladas.map(mapTension),
    ruidoEstructural: reconciliacion.ruidoEstructural.map(mapTension),
    areasDeIntervencion: oitParaDecision.opportunities.map(mapAreaIntervencion),

    // ── V: Conclusiones (scaffold) ─────────────────────────────────────────
    conclusiones: {
      content: buildConclusionesScaffold(mit, reconciliacion, oitParaDecision, originsSummary, hr?.title, workspace.ibseStudy),
      status: "scaffold",
      authorshipNote:
        "Requiere autoría humana. El equipo técnico debe redactar la síntesis " +
        "razonada del estado de salud del municipio y el funcionamiento del " +
        "territorio. El contenido generado por el sistema es orientativo.",
    },

    // ── VI: Cierre interpretativo (scaffold) ──────────────────────────────
    cierreInterpretativo: {
      content: buildCierreInterpretativoScaffold(mit, reconciliacion, oitParaDecision),
      status: "scaffold",
      authorshipNote:
        "Requiere autoría humana. El equipo técnico debe documentar el alcance " +
        "del diagnóstico, sus limitaciones metodológicas y la síntesis interpretativa " +
        "del territorio. Este capítulo no formula acciones ni recomendaciones.",
    },

    // ── VII: Síntesis y Priorización (scaffold) ───────────────────────────
    priorizacion,
    priorizacionStatus,

    // ── Metadatos del ciclo de vida ────────────────────────────────────────
    generatedAt: now,

    requiresHumanValidation: true,
  };
}

// ── Detección de contenido humano ────────────────────────────────────────────
// Devuelve true si el PSL validado contiene texto o consenso redactado por el
// equipo técnico. Se usa para proteger contra invalidación accidental.

export function hasPSLHumanContent(psl: LocalHealthProfile): boolean {
  return (
    psl.conclusiones.status === "authored" ||
    psl.cierreInterpretativo.status === "authored" ||
    psl.priorizacion.consensoDocumentado
  );
}

// ── Mappers de tipos de aplicación a tipos PSL de dominio ────────────────────

function mapConflicto(c: ConflictoInterpretativo): PSLConflicto {
  return {
    id: c.id,
    tipo: c.tipo,
    descripcion: c.descripcion,
    fuentesImplicadas: [...c.fuentesImplicadas],
    resolucion: "no-resuelta",
  };
}

function mapTension(t: TensionAnalizada): PSLTension {
  return {
    descripcion: t.tension,
    clasificacion: t.clasificacion,
    criteriosCumplidos: t.relevancia.criteriosCumplidos,
  };
}

function mapAreaIntervencion(o: OITOpportunity): PSLAreaIntervencion {
  return {
    id: o.id,
    title: o.title,
    rationale: o.rationale,
    relatedEvidenceIds: [...o.relatedEvidenceIds],
    cautions: [...o.cautions],
  };
}

// ── Scaffold text generators ──────────────────────────────────────────────────

function buildConclusionesScaffold(
  mit: EstadoTerritorialEvolutivo,
  reconciliacion: ReconciliacionResult,
  oitParaDecision: OITResult,
  originsSummary: string[],
  healthReportTitle: string | undefined,
  ibseStudy: IBSEStudy | undefined,
): string {
  const lt1 = mit.dimensionDiagnostica;
  const hasReal =
    oitParaDecision.opportunities.length > 0 &&
    oitParaDecision.opportunities[0].id !== "oit-expand-evidence-base";

  if (mit.totalEvidencias === 0) {
    return (
      "Base documental insuficiente para construir una lectura territorial. " +
      "Incorpora documentos al repositorio antes de redactar las conclusiones."
    );
  }

  const parts: string[] = [];

  // ── Bloque 1: fuentes y base documental ──────────────────────────────────
  const sourceLine =
    `La lectura territorial se ha construido a partir de ${mit.totalEvidencias} ` +
    `evidencias estructuradas procedentes de: ${originsSummary.join(", ")}.`;
  const reportLine = healthReportTitle
    ? ` «${healthReportTitle}» es la fuente diagnóstica primaria.`
    : "";
  parts.push(sourceLine + reportLine);

  // ── Bloque 2: síntesis diagnóstica del MIT ────────────────────────────────
  // lt1.summary es ya un párrafo narrativo correcto generado por LT1Engine.
  parts.push(lt1.summary);

  // ── Bloque 3: áreas de intervención detectadas ────────────────────────────
  if (hasReal) {
    const areaTitles = oitParaDecision.opportunities
      .map((a, i) => `${i + 1}. ${a.title}`)
      .join("; ");
    parts.push(
      `El análisis identifica ${oitParaDecision.opportunities.length} ` +
      `área(s) de intervención territorial: ${areaTitles}.`
    );
  }

  // ── Bloque 4: tensiones y conflictos ─────────────────────────────────────
  if (reconciliacion.tensionesEscaladas.length > 0) {
    parts.push(
      `Se detectan ${reconciliacion.tensionesEscaladas.length} tensión(es) ` +
      `estructural(es) con impacto en la planificación territorial.`
    );
  }
  if (reconciliacion.conflictos.length > 0) {
    parts.push(
      `${reconciliacion.conflictos.length} conflicto(s) interpretativo(s) ` +
      `permanecen sin resolver y condicionan la lectura.`
    );
  }

  // ── Bloque 5: IBSE ────────────────────────────────────────────────────────
  if (ibseStudy && Number.isFinite(ibseStudy.aggregates.meanTotal)) {
    const agg = ibseStudy.aggregates;
    parts.push(
      `El estudio IBSE registra un índice total de bienestar socioemocional ` +
      `escolar de ${agg.meanTotal.toFixed(1)} sobre 100 ` +
      `(${agg.nValid} registros válidos).`
    );
  }

  // ── Bloque 6: dimensión longitudinal ─────────────────────────────────────
  if (mit.dimensionLongitudinal.activa) {
    parts.push(mit.dimensionLongitudinal.nota);
  }

  // ── Bloque 7: cautela de autoría ─────────────────────────────────────────
  parts.push(
    "Esta síntesis es una propuesta asistida por COMPÁS NG. " +
    "El equipo técnico debe revisar, contextualizar y completar las conclusiones " +
    "con el criterio profesional del municipio."
  );

  return parts.join("\n\n");
}

function buildCierreInterpretativoScaffold(
  mit: EstadoTerritorialEvolutivo,
  reconciliacion: ReconciliacionResult,
  oitParaDecision: OITResult,
): string {
  if (mit.totalEvidencias === 0) {
    return (
      "Base documental insuficiente para formular un cierre interpretativo. " +
      "Incorpora documentos al repositorio antes de redactar este capítulo."
    );
  }

  const parts: string[] = [];

  // ── Alcance del diagnóstico ───────────────────────────────────────────────
  parts.push(
    `El diagnóstico se ha construido a partir de ${mit.totalEvidencias} evidencias ` +
    `estructuradas. El alcance del análisis está delimitado por las fuentes disponibles ` +
    `en el repositorio municipal en el momento de la generación del perfil.`
  );

  // ── Limitaciones metodológicas ────────────────────────────────────────────
  const hasConflictos = reconciliacion.conflictos.length > 0;
  const hasTensionesNoEscaladas = reconciliacion.tensionesNoEscaladas.length > 0;

  if (hasConflictos || hasTensionesNoEscaladas) {
    const items: string[] = [];
    if (hasConflictos) {
      items.push(
        `${reconciliacion.conflictos.length} conflicto(s) interpretativo(s) sin resolver ` +
        `que condicionan la lectura territorial`
      );
    }
    if (hasTensionesNoEscaladas) {
      items.push(
        `${reconciliacion.tensionesNoEscaladas.length} tensión(es) identificada(s) ` +
        `que no han derivado en área de intervención pero permanecen activas`
      );
    }
    parts.push(
      `El diagnóstico presenta las siguientes limitaciones a considerar: ` +
      items.join("; ") + "."
    );
  }

  // ── Áreas identificadas (sin prescripción) ────────────────────────────────
  const hasReal =
    oitParaDecision.opportunities.length > 0 &&
    oitParaDecision.opportunities[0].id !== "oit-expand-evidence-base";

  if (hasReal) {
    parts.push(
      `El análisis ha identificado ${oitParaDecision.opportunities.length} ` +
      `área(s) territorial(es) con evidencia suficiente para ser consideradas ` +
      `en el proceso de priorización (Capítulo VII). Su validación y priorización ` +
      `corresponde al equipo técnico y a la ciudadanía.`
    );
  }

  // ── Cautela de cierre ─────────────────────────────────────────────────────
  parts.push(
    "Este capítulo cierra la lectura interpretativa del territorio. " +
    "El diagnóstico concluye aquí; las decisiones de planificación y las " +
    "orientaciones estratégicas se desarrollan en productos posteriores."
  );

  return parts.join("\n\n");
}
