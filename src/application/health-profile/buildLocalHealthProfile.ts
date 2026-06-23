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

  const complementaryStudyCount = workspace.repository.documents.filter(
    (d) => d.kind === "complementary-study"
  ).length;

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
      content: buildConclusionesScaffold(mit, reconciliacion, originsSummary),
      status: "scaffold",
      authorshipNote:
        "Requiere autoría humana. El equipo técnico debe redactar la síntesis " +
        "razonada del estado de salud del municipio y el funcionamiento del " +
        "territorio. El contenido generado por el sistema es orientativo.",
    },

    // ── VI: Recomendaciones (scaffold) ────────────────────────────────────
    recomendaciones: {
      content: buildRecomendacionesScaffold(oitParaDecision),
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
  originsSummary: string[]
): string {
  const lt1 = mit.dimensionDiagnostica;
  const parts: string[] = [];

  if (mit.totalEvidencias === 0) {
    parts.push(
      "Base documental insuficiente para construir una lectura territorial. " +
      "Incorpora documentos al repositorio antes de redactar las conclusiones."
    );
  } else {
    parts.push(
      `Lectura territorial construida a partir de ${mit.totalEvidencias} evidencia(s) ` +
      `procedente(s) de: ${originsSummary.join(", ")}.`
    );
    if (lt1.determinants.length > 0) {
      parts.push(`${lt1.determinants.length} determinante(s) identificado(s).`);
    }
    if (lt1.assets.length > 0) {
      parts.push(`${lt1.assets.length} activo(s) comunitario(s) registrado(s).`);
    }
    if (lt1.indicators.length > 0) {
      parts.push(`${lt1.indicators.length} indicador(es) disponible(s).`);
    }
    if (lt1.qualitativeFindings.length > 0) {
      parts.push(`${lt1.qualitativeFindings.length} hallazgo(s) participativo(s).`);
    }
    if (mit.tensionesEstructurales.length > 0) {
      parts.push(`${mit.tensionesEstructurales.length} tensión(es) estructural(es) detectada(s).`);
    }
    if (reconciliacion.conflictos.length > 0) {
      parts.push(
        `${reconciliacion.conflictos.length} conflicto(s) interpretativo(s) detectado(s); ` +
        `ninguno resuelto por el sistema.`
      );
    }
  }

  parts.push(
    "[PENDIENTE DE AUTORÍA HUMANA: síntesis razonada del estado de salud " +
    "y el funcionamiento del territorio.]"
  );

  return parts.join(" ");
}

function buildRecomendacionesScaffold(oitParaDecision: OITResult): string {
  const hasReal =
    oitParaDecision.opportunities.length > 0 &&
    oitParaDecision.opportunities[0].id !== "oit-expand-evidence-base";

  if (!hasReal) {
    return (
      "Base documental insuficiente para formular orientaciones estratégicas. " +
      "Las recomendaciones requieren una base de evidencia territorial consolidada. " +
      "[PENDIENTE: incorporar evidencia y ejecutar el análisis territorial.]"
    );
  }

  const areasList = oitParaDecision.opportunities
    .map((o, i) => `${i + 1}. ${o.title}`)
    .join(" ");

  return (
    `${oitParaDecision.opportunities.length} área(s) de intervención territorial ` +
    `identificada(s) por el sistema: ${areasList}. ` +
    "Estas áreas son candidaturas técnicas, no recomendaciones formales. " +
    "[PENDIENTE DE AUTORÍA HUMANA: el equipo técnico debe formular las orientaciones " +
    "estratégicas, validarlas con la ciudadanía y las instituciones, y redactar " +
    "las recomendaciones definitivas.]"
  );
}
