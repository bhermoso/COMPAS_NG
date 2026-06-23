import type { MunicipalityWorkspace } from "../../domain/workspace";
import type { CompasPipelineResult, PipelineTraceItem, PipelineStatus } from "../../domain/pipeline";
import type { LT1Result } from "../lt1";
import type { OITResult } from "../oit";
import type { PrioritizationResult } from "../prioritization";
import { generatePrioritization } from "../prioritization";
import type { EPVSATranslationResult } from "../epvsa";
import { translatePrioritizationToEPVSA } from "../epvsa";
import type { ActionPlanDraft } from "../action-plan";
import { generateActionPlanDraft } from "../action-plan";
import type { AgendaDraft } from "../agenda";
import { generateAgendaDraft } from "../agenda";
import type { MonitoringDraft } from "../monitoring";
import { generateMonitoringDraft } from "../monitoring";
import {
  runEvidenceStoreIntegrityGuard,
  type IntegrityGuardResult,
} from "../evidence";
import { getAllStrategicElements } from "../../domain/strategy";
import {
  createEstadoTerritorialEvolutivo,
  type EstadoTerritorialEvolutivo,
} from "../territorial-interpretation";
import {
  runReconciliacionInterpretativa,
  type ReconciliacionResult,
} from "../reconciliation";

// ── Runtime interface ──────────────────────────────────────────────────────

export interface MunicipalityRuntime {
  workspace: MunicipalityWorkspace;
  pipeline: CompasPipelineResult;
  integrityGuard: IntegrityGuardResult;

  // Nivel 2 — Motor de Interpretación Territorial (MIT)
  mit: EstadoTerritorialEvolutivo;

  // Motor de Reconciliación Interpretativa
  // Detecta conflictos y decide qué tensiones se escalan a Áreas de Intervención.
  // Posicionado entre Nivel 2 (MIT) y Nivel 3 (Decisión) en el flujo obligatorio.
  reconciliacion: ReconciliacionResult;

  // Campos derivados del MIT / reconciliacion — para compatibilidad con paneles UI.
  // lt1 = mit.dimensionDiagnostica
  // oit = reconciliacion-gated OIT (or mit.areasDeIntervencion as fallback)
  lt1: LT1Result;
  oit: OITResult;

  // Nivel 3 — Capa de Decisión
  prioritization: PrioritizationResult;
  epvsa: EPVSATranslationResult;
  actionPlan: ActionPlanDraft;
  agenda: AgendaDraft;
  monitoring: MonitoringDraft;
}

export interface CreateMunicipalityRuntimeInput {
  workspace: MunicipalityWorkspace;
}

// ── Factory ────────────────────────────────────────────────────────────────

export function createMunicipalityRuntime(
  input: CreateMunicipalityRuntimeInput
): MunicipalityRuntime {
  // ── Nivel 1: integridad del EvidenceStore
  const integrityGuard = runEvidenceStoreIntegrityGuard(input.workspace.evidenceStore);

  // Marcos interpretativos — cargados una sola vez y compartidos
  // por el MIT (interpretación territorial) y el motor de acción (ActionPlan).
  const frameworks = getAllStrategicElements();

  // ── Nivel 2: Motor de Interpretación Territorial (MIT)
  // Único motor de análisis. LT1 y OIT son sub-rutinas internas.
  // EPVSA/ESCA son marcos interpretativos, no módulos ejecutables.
  const mit = createEstadoTerritorialEvolutivo({
    evidenceStore: integrityGuard.sanitizedStore,
    strategicFrameworks: frameworks,
  });

  // ── Reconciliación: Motor de Reconciliación Interpretativa
  // Detecta conflictos entre estados, fuentes y escalas.
  // Aplica la Regla de Escalado: solo las tensiones con persistencia temporal,
  // convergencia de fuentes y coherencia estructural se escalan a Áreas de
  // Intervención Territorial. Las demás permanecen como tensiones no escaladas.
  // No resuelve conflictos — solo los estructura para deliberación humana.
  const reconciliacion = runReconciliacionInterpretativa(
    mit,
    input.workspace.historialEstadosTerritorial ?? []
  );

  // ── OIT para Nivel 3 (Capa de Decisión)
  // Regla del Plan de Acción: el plan solo puede construirse a partir de OIT.
  // Se usan las Áreas escaladas cuando el Motor de Reconciliación las produjo;
  // si no, se usa el OIT simple del MIT como fallback (insuficiente historia).
  const oitParaDecision: OITResult =
    reconciliacion.areasIntervencionEscaladas.length > 0
      ? {
          opportunities: reconciliacion.areasIntervencionEscaladas,
          sourceSummary:
            `${reconciliacion.areasIntervencionEscaladas.length} área(s) de intervención ` +
            "escaladas por el Motor de Reconciliación Interpretativa.",
          requiresHumanValidation: true,
        }
      : mit.areasDeIntervencion;

  // Campos derivados para compatibilidad con paneles de visualización.
  const lt1 = mit.dimensionDiagnostica;
  const oit = oitParaDecision;

  // ── Nivel 3: Capa de Decisión
  const prioritization = generatePrioritization(oit);
  const epvsa = translatePrioritizationToEPVSA(prioritization);
  const actionPlan = generateActionPlanDraft(epvsa, frameworks);
  const agenda = generateAgendaDraft(actionPlan);
  const monitoring = generateMonitoringDraft(agenda);

  return {
    workspace: input.workspace,
    integrityGuard,
    mit,
    reconciliacion,
    lt1,
    oit,
    pipeline: buildPipelineTrace(input.workspace, integrityGuard, mit, reconciliacion, {
      prioritization,
      epvsa,
      actionPlan,
      agenda,
      monitoring,
    }),
    prioritization,
    epvsa,
    actionPlan,
    agenda,
    monitoring,
  };
}

// ── Pipeline trace ─────────────────────────────────────────────────────────
// Reflects the 3-level architecture:
//   Nivel 1: integrity, repository, evidence
//   Nivel 2: mit (single territorial engine)
//   Nivel 3: prioritization, epvsa, action-plan, agenda, monitoring

function buildPipelineTrace(
  workspace: MunicipalityWorkspace,
  guard: IntegrityGuardResult,
  mit: EstadoTerritorialEvolutivo,
  reconciliacion: ReconciliacionResult,
  stages: {
    prioritization: PrioritizationResult;
    epvsa: EPVSATranslationResult;
    actionPlan: ActionPlanDraft;
    agenda: AgendaDraft;
    monitoring: MonitoringDraft;
  }
): CompasPipelineResult {
  const now = new Date().toISOString();
  const docCount = workspace.repository.documents.length;
  const atomCount = guard.sanitizedStore.atoms.length;

  const hasAtoms = atomCount > 0;
  const motorStatus: PipelineStatus = hasAtoms ? "ready" : "empty";
  const evidenceStatus: PipelineStatus =
    atomCount > 0 ? "ready" : docCount > 0 ? "partial" : "empty";

  // ── Nivel 1 ────────────────────────────────────────────────────────────

  const integrityStatus: PipelineStatus =
    guard.errors.length > 0 ? "partial" : "ready";

  const integrityMessage =
    guard.errors.length > 0
      ? `${guard.errors.length} error(es) de integridad · ${guard.stats.totalAtoms} átomos válidos de ${workspace.evidenceStore.atoms.length} procesados. Errores: ${guard.errors.slice(0, 2).join(" | ")}${guard.errors.length > 2 ? " …" : ""}`
      : guard.warnings.length > 0
        ? `Integridad: ${guard.stats.totalAtoms} átomos válidos. ${guard.warnings.length} aviso(s). ${buildOriginSummary(guard.stats.byOrigin)}`
        : `Integridad verificada: ${guard.stats.totalAtoms} átomo(s). ${buildOriginSummary(guard.stats.byOrigin)}`;

  // ── Nivel 2: MIT ────────────────────────────────────────────────────────

  const mitStatus: PipelineStatus =
    hasAtoms
      ? mit.tensionesEstructurales.length > 0
        ? "partial"
        : "ready"
      : "empty";

  const mitMessage = hasAtoms
    ? buildMITMessage(mit)
    : "Sin EvidenceAtom. El Motor de Interpretación Territorial no puede construir un Estado Territorial Evolutivo sin base documental.";

  // ── Nivel 3 ────────────────────────────────────────────────────────────

  const trace: PipelineTraceItem[] = [
    // — Nivel 1 —
    {
      stage: "integrity",
      status: integrityStatus,
      message: integrityMessage,
      createdAt: now,
    },
    {
      stage: "repository",
      status: docCount > 0 ? "ready" : "partial",
      message: `${docCount} documento(s) en el repositorio municipal.`,
      createdAt: now,
    },
    {
      stage: "evidence",
      status: evidenceStatus,
      message: `${atomCount} EvidenceAtom disponibles para el Motor de Interpretación Territorial.`,
      createdAt: now,
    },
    // — Nivel 2 —
    {
      stage: "mit",
      status: mitStatus,
      message: mitMessage,
      createdAt: now,
    },
    // — Reconciliación (puente Nivel 2 → Nivel 3) —
    {
      stage: "reconciliacion",
      status: buildReconciliacionStatus(reconciliacion, hasAtoms),
      message: buildReconciliacionMessage(reconciliacion, hasAtoms),
      createdAt: now,
    },
    // — Nivel 3 —
    {
      stage: "prioritization",
      status: motorStatus,
      message: hasAtoms
        ? `${stages.prioritization.candidatePriorities.length} candidata(s) a priorización. Requieren validación humana.`
        : "Sin evidencia real. Candidata de fallback heredada del pipeline vacío.",
      createdAt: now,
    },
    {
      stage: "epvsa",
      status: motorStatus,
      message: hasAtoms
        ? `${stages.epvsa.suggestions.length} sugerencia(s) de encaje estratégico. Requieren validación técnica.`
        : "Sin evidencia real. Sugerencia EPVSA pendiente de revisión por ausencia de base documental.",
      createdAt: now,
    },
    {
      stage: "action-plan",
      status: motorStatus,
      message: hasAtoms
        ? `${stages.actionPlan.objectives.length} objetivo(s) y ${stages.actionPlan.actions.length} actuación(es) en borrador inicial.`
        : "Sin evidencia real. Borrador de plan generado sobre pipeline vacío. No representa acciones reales.",
      createdAt: now,
    },
    {
      stage: "agenda",
      status: motorStatus,
      message: hasAtoms
        ? `${stages.agenda.annualItems.length} ítem(s) de agenda anual propuesto(s). Pendiente de validación.`
        : "Sin evidencia real. Agenda generada sobre pipeline vacío. No representa compromisos ejecutivos.",
      createdAt: now,
    },
    {
      stage: "monitoring",
      status: motorStatus,
      message: hasAtoms
        ? `${stages.monitoring.trackedItems.length} actuación(es) en seguimiento inicial. Estado: pendiente de validación.`
        : "Sin evidencia real. Seguimiento generado sobre pipeline vacío. No refleja ejecución real.",
      createdAt: now,
    },
  ];

  return { trace };
}

// ── Helpers ────────────────────────────────────────────────────────────────

function buildMITMessage(mit: EstadoTerritorialEvolutivo): string {
  const lt1 = mit.dimensionDiagnostica;
  const areas = mit.areasDeIntervencion.opportunities.length;
  const tensiones = mit.tensionesEstructurales.length;
  const marcosStr = mit.marcosAplicados.map((m) => m.framework).join(", ");
  const longiStr = mit.dimensionLongitudinal.activa
    ? ` · Dimensión longitudinal activa (${mit.dimensionLongitudinal.evidenciasLongitudinales} evidencia(s))`
    : "";

  return (
    `Estado Territorial v${mit.version.slice(0, 10)} · ` +
    `${lt1.determinants.length} determinante(s), ` +
    `${lt1.assets.length} activo(s), ` +
    `${lt1.indicators.length} indicador(es), ` +
    `${lt1.qualitativeFindings.length} hallazgo(s) participativo(s)` +
    longiStr +
    ` · ${areas} área(s) de intervención territorial` +
    (tensiones > 0 ? ` · ${tensiones} tensión(es) estructural(es)` : "") +
    (marcosStr ? ` · Marcos: ${marcosStr}` : "")
  );
}

function buildReconciliacionStatus(
  r: ReconciliacionResult,
  hasAtoms: boolean
): PipelineStatus {
  if (!hasAtoms) return "empty";
  if (r.tensionesEscaladas.length > 0) return "ready";
  if (r.conflictos.length > 0) return "partial";
  return "ready";
}

function buildReconciliacionMessage(
  r: ReconciliacionResult,
  hasAtoms: boolean
): string {
  if (!hasAtoms) {
    return "Sin evidencia. No hay tensiones ni conflictos que reconciliar.";
  }
  const partes: string[] = [];
  if (r.conflictos.length > 0) {
    partes.push(`${r.conflictos.length} conflicto(s) detectado(s) (no resueltos)`);
  }
  if (r.ruidoEstructural.length > 0) {
    partes.push(`${r.ruidoEstructural.length} tensión(es) clasificada(s) como ruido estructural`);
  }
  if (r.tensionesNoEscaladas.length > 0) {
    partes.push(`${r.tensionesNoEscaladas.length} tensión(es) relevante(s) no escalada(s)`);
  }
  if (r.tensionesEscaladas.length > 0) {
    partes.push(
      `${r.tensionesEscaladas.length} tensión(es) escalada(s) a Áreas de Intervención Territorial`
    );
  }
  if (partes.length === 0) {
    return "Sin tensiones ni conflictos detectados. El Estado Territorial es homogéneo.";
  }
  return partes.join(" · ") + ". Ningún conflicto ha sido resuelto por el sistema.";
}

function buildOriginSummary(byOrigin: Record<string, number>): string {
  const entries = Object.entries(byOrigin);
  if (entries.length === 0) return "Sin átomos clasificados.";
  return entries
    .sort(([, a], [, b]) => b - a)
    .map(([origin, count]) => `${origin}(${count})`)
    .join(" · ");
}
