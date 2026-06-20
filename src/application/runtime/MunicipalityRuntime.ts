import type { MunicipalityWorkspace } from "../../domain/workspace";
import type { CompasPipelineResult, PipelineTraceItem } from "../../domain/pipeline";
import type { LT1Result } from "../lt1";
import { generateLT1 } from "../lt1";
import type { OITResult } from "../oit";
import { generateOIT } from "../oit";
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

export interface MunicipalityRuntime {
  workspace: MunicipalityWorkspace;
  pipeline: CompasPipelineResult;
  lt1: LT1Result;
  oit: OITResult;
  prioritization: PrioritizationResult;
  epvsa: EPVSATranslationResult;
  actionPlan: ActionPlanDraft;
  agenda: AgendaDraft;
  monitoring: MonitoringDraft;
}

export interface CreateMunicipalityRuntimeInput {
  workspace: MunicipalityWorkspace;
}

export function createMunicipalityRuntime(
  input: CreateMunicipalityRuntimeInput
): MunicipalityRuntime {
  const lt1 = generateLT1(input.workspace.evidenceStore);
  const oit = generateOIT(lt1);
  const prioritization = generatePrioritization(oit);
  const epvsa = translatePrioritizationToEPVSA(prioritization);
  const actionPlan = generateActionPlanDraft(epvsa);
  const agenda = generateAgendaDraft(actionPlan);
  const monitoring = generateMonitoringDraft(agenda);

  return {
    workspace: input.workspace,
    pipeline: buildPipelineTrace(input.workspace, {
      lt1,
      oit,
      prioritization,
      epvsa,
      actionPlan,
      agenda,
      monitoring,
    }),
    lt1,
    oit,
    prioritization,
    epvsa,
    actionPlan,
    agenda,
    monitoring,
  };
}

function buildPipelineTrace(
  workspace: MunicipalityWorkspace,
  stages: {
    lt1: LT1Result;
    oit: OITResult;
    prioritization: PrioritizationResult;
    epvsa: EPVSATranslationResult;
    actionPlan: ActionPlanDraft;
    agenda: AgendaDraft;
    monitoring: MonitoringDraft;
  }
): CompasPipelineResult {
  const now = new Date().toISOString();
  const docCount = workspace.repository.documents.length;
  const atomCount = workspace.evidenceStore.atoms.length;

  const hasAtoms = atomCount > 0;
  const motorStatus = hasAtoms ? "ready" : "empty";

  const evidenceStatus =
    atomCount > 0 ? "ready" : docCount > 0 ? "partial" : "empty";

  const trace: PipelineTraceItem[] = [
    {
      stage: "repository",
      status: docCount > 0 ? "ready" : "partial",
      message: `${docCount} documento(s) en el repositorio municipal.`,
      createdAt: now,
    },
    {
      stage: "evidence",
      status: evidenceStatus,
      message: `${atomCount} EvidenceAtom disponibles para los motores.`,
      createdAt: now,
    },
    {
      stage: "lt1",
      status: motorStatus,
      message: hasAtoms
        ? `Lectura territorial: ${stages.lt1.determinants.length} determinante(s), ${stages.lt1.assets.length} activo(s), ${stages.lt1.indicators.length} indicador(es), ${stages.lt1.methodologicalCautions.length} cautela(s).`
        : "Sin EvidenceAtom. La lectura territorial no puede construirse sin base documental.",
      createdAt: now,
    },
    {
      stage: "oit",
      status: motorStatus,
      message: hasAtoms
        ? `${stages.oit.opportunities.length} oportunidad(es) inicial(es) de intervención identificadas.`
        : "Sin evidencia real. Resultado de fallback: ampliar base documental.",
      createdAt: now,
    },
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
