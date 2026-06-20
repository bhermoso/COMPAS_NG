import type { MunicipalityWorkspace } from "../../domain/workspace";
import type { CompasPipelineResult } from "../../domain/pipeline";
import { createEmptyPipelineResult } from "../../domain/pipeline";
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

  return {
    workspace: input.workspace,
    pipeline: createEmptyPipelineResult(input.workspace),
    lt1,
    oit,
    prioritization,
    epvsa,
    actionPlan,
    agenda,
    monitoring: generateMonitoringDraft(agenda),
  };
}
