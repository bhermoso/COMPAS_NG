import type { MunicipalityWorkspace } from "../../domain/workspace";
import type { MunicipalDocumentRepository } from "../../domain/repository";
import type { EvidenceStore } from "../../domain/evidence";
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

export interface MunicipalityRuntime {
  workspace: MunicipalityWorkspace;
  repository: MunicipalDocumentRepository;
  evidenceStore: EvidenceStore;
  pipeline: CompasPipelineResult;
  lt1: LT1Result;
  oit: OITResult;
  prioritization: PrioritizationResult;
  epvsa: EPVSATranslationResult;
  actionPlan: ActionPlanDraft;
}

export interface CreateMunicipalityRuntimeInput {
  workspace: MunicipalityWorkspace;
  repository: MunicipalDocumentRepository;
  evidenceStore: EvidenceStore;
}

export function createMunicipalityRuntime(
  input: CreateMunicipalityRuntimeInput
): MunicipalityRuntime {
  const workspace: MunicipalityWorkspace = {
    ...input.workspace,
    repository: input.repository,
    updatedAt: new Date().toISOString(),
  };

  const lt1 = generateLT1(input.evidenceStore);
  const oit = generateOIT(lt1);
  const prioritization = generatePrioritization(oit);
  const epvsa = translatePrioritizationToEPVSA(prioritization);

  return {
    workspace,
    repository: input.repository,
    evidenceStore: input.evidenceStore,
    pipeline: createEmptyPipelineResult(workspace),
    lt1,
    oit,
    prioritization,
    epvsa,
    actionPlan: generateActionPlanDraft(epvsa),
  };
}
