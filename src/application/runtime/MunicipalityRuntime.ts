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

  const trace: PipelineTraceItem[] = [
    {
      stage: "repository",
      status: "ready",
      message: `${docCount} documento(s) en el repositorio municipal.`,
      createdAt: now,
    },
    {
      stage: "evidence",
      status: atomCount > 0 ? "ready" : "partial",
      message: `${atomCount} EvidenceAtom disponibles para los motores.`,
      createdAt: now,
    },
    {
      stage: "lt1",
      status: "ready",
      message: `Lectura territorial: ${stages.lt1.determinants.length} determinante(s), ${stages.lt1.assets.length} activo(s), ${stages.lt1.indicators.length} indicador(es), ${stages.lt1.methodologicalCautions.length} cautela(s).`,
      createdAt: now,
    },
    {
      stage: "oit",
      status: "ready",
      message: `${stages.oit.opportunities.length} oportunidad(es) inicial(es) de intervención identificadas.`,
      createdAt: now,
    },
    {
      stage: "prioritization",
      status: "ready",
      message: `${stages.prioritization.candidatePriorities.length} candidata(s) a priorización. Requieren validación humana.`,
      createdAt: now,
    },
    {
      stage: "epvsa",
      status: "ready",
      message: `${stages.epvsa.suggestions.length} sugerencia(s) de encaje estratégico. Requieren validación técnica.`,
      createdAt: now,
    },
    {
      stage: "action-plan",
      status: "ready",
      message: `${stages.actionPlan.objectives.length} objetivo(s) y ${stages.actionPlan.actions.length} actuación(es) en borrador inicial.`,
      createdAt: now,
    },
    {
      stage: "agenda",
      status: "ready",
      message: `${stages.agenda.annualItems.length} ítem(s) de agenda anual propuesto(s). Pendiente de validación.`,
      createdAt: now,
    },
    {
      stage: "monitoring",
      status: "ready",
      message: `${stages.monitoring.trackedItems.length} actuación(es) en seguimiento inicial. Estado: pendiente de validación.`,
      createdAt: now,
    },
  ];

  return { trace };
}
