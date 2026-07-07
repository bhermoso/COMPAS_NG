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
import { buildNarrativeChapters, renderNarrativeChapters } from "./narrativeChapters";

// ── Secciones del Marco Estratégico (Capítulo I) ──────────────────────────────
// Corresponden a los IDs fijos de createStrategicFramework().
const STRATEGIC_FRAMEWORK_SECTION_IDS: string[] = [
  "normativo",
  "estrategico",
  "metodologico",
  "salutogenico",
  "fuentes",
];

// ── Vocabulario territorial ───────────────────────────────────────────────────
// El sustantivo con el que el Perfil se refiere a su ámbito se deriva de
// territorialType: un distrito nunca debe redactarse como "municipio".

export function territorialScopeNoun(territorialType: string | undefined): string {
  const t = (territorialType ?? "").trim().toLowerCase();
  if (t === "distrito" || t === "district") return "distrito";
  if (t === "municipio" || t === "municipality") return "municipio";
  return "ámbito territorial";
}

// ── Cautelas de escala/proxy ──────────────────────────────────────────────────
// Detecta cautelas metodológicas que declaran evidencia de escala más amplia
// que el ámbito (provincial u origen externo) usada como contexto exploratorio.

const PROXY_SCALE_RE =
  /proxy|contexto exploratorio|estimaci[óo]n espec[íi]fica|escala provincial|[áa]mbito provincial/i;

interface StudyWithCautions {
  methodologicalCautions?: string[];
}

function collectStudyCautions(workspace: MunicipalityWorkspace): string[] {
  const studies: Array<StudyWithCautions | undefined> = [
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
  ];
  const unique: string[] = [];
  const seen = new Set<string>();
  for (const study of studies) {
    for (const caution of study?.methodologicalCautions ?? []) {
      if (!seen.has(caution)) {
        seen.add(caution);
        unique.push(caution);
      }
    }
  }
  return unique;
}

interface ScopeContext {
  scopeNoun: string;
  studyCautions: string[];
  hasProxyScale: boolean;
}

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

  // Vocabulario y escala del ámbito, compartidos por todos los bloques narrativos.
  const scope: ScopeContext = (() => {
    const studyCautions = collectStudyCautions(workspace);
    return {
      scopeNoun: territorialScopeNoun(workspace.municipality.identity.territorialType),
      studyCautions,
      hasProxyScale: studyCautions.some((c) => PROXY_SCALE_RE.test(c)),
    };
  })();

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

  const realOpportunities = oitParaDecision.opportunities.filter(
    (o) => !o.isAnalyticalGap
  );
  const hasTechnical = realOpportunities.length > 0;

  const priorizacion: PSLPriorizacion = {
    candidaturasTecnicas: realOpportunities.map((o) => ({
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
      `${scope.scopeNoun} a partir de las candidaturas técnicas y las preferencias ` +
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
    limitacionesDiagnosticas: [...(mit.limitacionesDiagnosticas ?? [])],
    conflictos: reconciliacion.conflictos.map(mapConflicto),
    tensionesEscaladas: reconciliacion.tensionesEscaladas.map(mapTension),
    tensionesNoEscaladas: reconciliacion.tensionesNoEscaladas.map(mapTension),
    ruidoEstructural: reconciliacion.ruidoEstructural.map(mapTension),
    areasDeIntervencion: oitParaDecision.opportunities.map(mapAreaIntervencion),

    // ── V: Conclusiones (scaffold) ─────────────────────────────────────────
    conclusiones: {
      content: buildConclusionesScaffold(mit, reconciliacion, oitParaDecision, hr?.title, workspace.ibseStudy, scope, {
        complementaryStudyCount,
        territorialDocTitles: workspace.repository.documents
          .filter((d) => d.kind === "territorial-documentation")
          .map((d) => d.title),
      }),
      status: "scaffold",
      authorshipNote:
        "Requiere autoría humana. El equipo técnico debe redactar la síntesis " +
        `razonada del estado de salud del ${scope.scopeNoun} y el funcionamiento del ` +
        "territorio. El contenido generado por el sistema es orientativo.",
    },

    // ── VI: Cierre interpretativo (scaffold) ──────────────────────────────
    cierreInterpretativo: {
      content: buildCierreInterpretativoScaffold(mit, reconciliacion, oitParaDecision, {
        hasLocalizaSaludAssets: lt1.assets.some((a) => a.provenance.origin === "localiza-salud"),
        isDistrict: scope.scopeNoun === "distrito",
        scope,
      }),
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
    isAnalyticalGap: o.isAnalyticalGap,
  };
}

// ── Scaffold text generators ──────────────────────────────────────────────────

function buildConclusionesScaffold(
  mit: EstadoTerritorialEvolutivo,
  reconciliacion: ReconciliacionResult,
  oitParaDecision: OITResult,
  healthReportTitle: string | undefined,
  ibseStudy: IBSEStudy | undefined,
  scope: ScopeContext,
  extras: { complementaryStudyCount: number; territorialDocTitles: string[] },
): string {
  const lt1 = mit.dimensionDiagnostica;

  if (mit.totalEvidencias === 0) {
    return (
      "El Perfil aún no dispone de información territorial suficiente para formular " +
      "conclusiones sustantivas. Incorpora fuentes diagnósticas al repositorio " +
      "antes de redactar este capítulo."
    );
  }

  // El borrador de conclusiones se organiza como documento por determinantes
  // (capítulos I–VI). La composición vive en narrativeChapters.ts como
  // funciones puras; aquí solo se seleccionan los datos que lo alimentan.
  const areasReales = oitParaDecision.opportunities
    .filter((o) => !o.isAnalyticalGap)
    .map((o) => o.title);

  const chapters = buildNarrativeChapters({
    scopeNoun: scope.scopeNoun,
    studyCautions: scope.studyCautions,
    hasProxyScale: scope.hasProxyScale,
    healthReportTitle,
    complementaryStudyCount: extras.complementaryStudyCount,
    territorialDocTitles: extras.territorialDocTitles,
    ibse:
      ibseStudy && Number.isFinite(ibseStudy.aggregates.meanTotal)
        ? {
            meanTotal: ibseStudy.aggregates.meanTotal,
            nValid: ibseStudy.aggregates.nValid,
            isProxy: (ibseStudy.methodologicalCautions ?? []).some((c) =>
              PROXY_SCALE_RE.test(c)
            ),
          }
        : undefined,
    indicatorCount: lt1.indicators.length,
    determinantCount: lt1.determinants.length,
    determinantTitles: lt1.determinants.map((a) => a.title),
    assetCount: lt1.assets.length,
    assetTitles: lt1.assets.map((a) => a.title),
    hasLocalizaAssets: lt1.assets.some(
      (a) => a.provenance.origin === "localiza-salud"
    ),
    qualitativeCount: lt1.qualitativeFindings.length,
    cautionCount: lt1.methodologicalCautions.length,
    longitudinalNote: mit.dimensionLongitudinal.nota,
    tensionesEscaladas: reconciliacion.tensionesEscaladas.length,
    tensionesNoEscaladas: reconciliacion.tensionesNoEscaladas.length,
    conflictos: reconciliacion.conflictos.length,
    limitacionesDiagnosticas: [...(mit.limitacionesDiagnosticas ?? [])],
    areasReales,
  });

  return renderNarrativeChapters(chapters);
}

function buildCierreInterpretativoScaffold(
  mit: EstadoTerritorialEvolutivo,
  reconciliacion: ReconciliacionResult,
  oitParaDecision: OITResult,
  options: { hasLocalizaSaludAssets: boolean; isDistrict: boolean; scope: ScopeContext },
): string {
  const { scopeNoun, hasProxyScale } = options.scope;

  if (mit.totalEvidencias === 0) {
    return (
      "El Perfil aún no dispone de información suficiente para formular un cierre " +
      "interpretativo. Incorpora fuentes diagnósticas al repositorio antes de " +
      "redactar este capítulo."
    );
  }

  const parts: string[] = [];

  // ── Propósito del cierre: comprensión del territorio ─────────────────────
  parts.push(
    "El cierre interpretativo es la lectura integrada del territorio que emerge " +
    "del conjunto del diagnóstico. No formula actuaciones ni recomendaciones: " +
    `establece qué comprensión del ${scopeNoun} queda disponible para orientar ` +
    "la priorización y el proceso comunitario."
  );

  // ── Escala de la evidencia: contexto exploratorio, no estimación propia ───
  if (hasProxyScale) {
    parts.push(
      "Parte de la evidencia utilizada procede de escalas más amplias que el " +
      `${scopeNoun} (provincial u origen externo) y tiene carácter de contexto ` +
      "exploratorio: su lectura requiere contraste territorial antes de sustentar " +
      `interpretaciones específicas del ${scopeNoun}.`
    );
  }

  // ── Tensiones que señalan donde el conocimiento es más incierto ───────────
  const hasConflictos = reconciliacion.conflictos.length > 0;
  const hasTensionesNoEscaladas = reconciliacion.tensionesNoEscaladas.length > 0;

  if (hasConflictos || hasTensionesNoEscaladas) {
    parts.push(
      "El proceso diagnóstico ha identificado aspectos del territorio donde " +
      "las distintas fuentes ofrecen lecturas que no convergen plenamente. " +
      "Estas tensiones no son un defecto del diagnóstico: señalan dónde el " +
      "conocimiento disponible es más incierto y donde la deliberación con " +
      "el Grupo Motor resulta más necesaria."
    );
  }

  // ── Activos: capacidades que sostienen el proceso ─────────────────────────
  if (mit.dimensionDiagnostica.assets.length > 0) {
    if (options.hasLocalizaSaludAssets) {
      parts.push(
        "Se han identificado recursos y activos en el entorno territorial " +
        "mediante consulta de Localiza Salud. " +
        (options.isDistrict
          ? "En este ámbito inframunicipal, los activos incorporados pueden " +
            "incluir recursos del municipio matriz o del entorno funcional más amplio. " +
            "Requieren validación territorial fina antes de ser interpretados " +
            "como activos propios del ámbito y antes de respaldar decisiones de planificación."
          : "Requieren validación territorial antes de ser incorporados " +
            "como activos propios del proceso de planificación participativa.")
      );
    } else {
      parts.push(
        "El territorio dispone de activos y capacidades comunitarias que pueden " +
        "sostener el proceso de planificación participativa. " +
        "La fortaleza del tejido comunitario es un factor de viabilidad de cualquier " +
        "plan que se adopte."
      );
    }
  }

  // ── Incertidumbres: hacerlas explícitas, no ocultarlas ────────────────────
  if (mit.dimensionDiagnostica.methodologicalCautions.length > 0) {
    parts.push(
      "El diagnóstico tiene límites que deben hacerse explícitos antes de la " +
      "priorización. No toda la información relevante está disponible a escala " +
      "municipal. Las decisiones de planificación deben considerar estas " +
      "incertidumbres, no ignorarlas."
    );
  }

  // ── Transición a la priorización ──────────────────────────────────────────
  const realCount = oitParaDecision.opportunities.filter(
    (o) => !o.isAnalyticalGap
  ).length;

  if (realCount > 0) {
    parts.push(
      `El Perfil deja preparadas ${realCount} área(s) ` +
      `territorial(es) para el proceso de priorización con el Grupo Motor. ` +
      `La priorización es el paso siguiente: no la conclusión del diagnóstico, ` +
      `sino su traducción en decisión comunitaria.`
    );
  }

  // ── Orientación para el equipo técnico ────────────────────────────────────
  parts.push(
    "El equipo técnico debe redactar aquí el cierre interpretativo del territorio: " +
    "qué comprensión global emerge del diagnóstico, qué tensiones o patrones " +
    "deben contrastarse con el Grupo Motor, qué capacidades pueden sostener " +
    "el proceso comunitario, qué incertidumbres deben quedar explícitas."
  );

  return parts.join("\n\n");
}
