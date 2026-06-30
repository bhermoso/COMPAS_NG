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
 *  - Los capítulos V y VI son scaffold marcados como "authored" pendiente.
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

    // ── VI: Recomendaciones (scaffold) ────────────────────────────────────
    recomendaciones: {
      content: buildRecomendacionesScaffold(oitParaDecision, reconciliacion, mit),
      status: "scaffold",
      authorshipNote:
        "Requiere autoría humana. El equipo técnico debe formular las " +
        "orientaciones estratégicas derivadas del análisis. Las áreas de " +
        "intervención son candidaturas del sistema, no recomendaciones técnicas.",
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
    psl.recomendaciones.status === "authored" ||
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

function buildRecomendacionesScaffold(
  oitParaDecision: OITResult,
  reconciliacion: ReconciliacionResult,
  mit: EstadoTerritorialEvolutivo,
): string {
  const hasReal =
    oitParaDecision.opportunities.length > 0 &&
    oitParaDecision.opportunities[0].id !== "oit-expand-evidence-base";

  if (!hasReal) {
    return (
      "Base documental insuficiente para formular orientaciones estratégicas. " +
      "Las recomendaciones requieren una base de evidencia territorial consolidada."
    );
  }

  const parts: string[] = [];

  // ── Intro ─────────────────────────────────────────────────────────────────
  parts.push(
    "A partir del diagnóstico territorial, se proponen las siguientes " +
    "orientaciones estratégicas para consideración del equipo técnico, " +
    "la ciudadanía y las instituciones:"
  );

  // ── Orientaciones por área (título + rationale + cautelas) ────────────────
  const orientaciones = oitParaDecision.opportunities
    .map((area, i) => {
      const cautionNote =
        area.cautions.length > 0
          ? ` Aspectos a considerar: ${area.cautions.slice(0, 2).join("; ")}.`
          : "";
      return `${i + 1}. ${area.title}\n${area.rationale}${cautionNote}`;
    })
    .join("\n\n");
  parts.push(orientaciones);

  // ── Tensiones no escaladas a monitorizar ─────────────────────────────────
  if (reconciliacion.tensionesNoEscaladas.length > 0) {
    parts.push(
      `${reconciliacion.tensionesNoEscaladas.length} tensión(es) identificada(s) ` +
      `como relevante(s) no han derivado en área de intervención; ` +
      `se recomienda mantenerlas bajo seguimiento técnico.`
    );
  }

  // ── Marcos estratégicos aplicados ────────────────────────────────────────
  if (mit.marcosAplicados.length > 0) {
    const marcos = mit.marcosAplicados.map((m) => m.framework).join(", ");
    parts.push(
      `El encaje con los marcos estratégicos aplicados (${marcos}) debe ` +
      `explorarse para cada orientación, verificando la correspondencia con ` +
      `sus objetivos y programas específicos.`
    );
  }

  // ── Cautela de autoría ────────────────────────────────────────────────────
  parts.push(
    "Estas orientaciones son propuestas técnicas preliminares, no recomendaciones " +
    "formales. El equipo técnico, la ciudadanía y las instituciones son quienes " +
    "deliberan y aprueban las recomendaciones definitivas del Plan Local de Salud."
  );

  return parts.join("\n\n");
}
