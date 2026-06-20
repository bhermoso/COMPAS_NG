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

export interface MunicipalityRuntime {
  workspace: MunicipalityWorkspace;
  repository: MunicipalDocumentRepository;
  evidenceStore: EvidenceStore;
  pipeline: CompasPipelineResult;
  lt1: LT1Result;
  oit: OITResult;
  prioritization: PrioritizationResult;
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

  return {
    workspace,
    repository: input.repository,
    evidenceStore: input.evidenceStore,
    pipeline: createEmptyPipelineResult(workspace),
    lt1,
    oit,
    prioritization: generatePrioritization(oit),
  };
}
