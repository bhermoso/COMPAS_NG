import type { MunicipalityWorkspace } from "../../domain/workspace";
import type { MunicipalDocumentRepository } from "../../domain/repository";
import type { EvidenceStore } from "../../domain/evidence";
import type { CompasPipelineResult } from "../../domain/pipeline";
import { createEmptyCompasPipelineResult } from "../../domain/pipeline";
import type { LT1Result } from "../lt1";
import { generateLT1 } from "../lt1";

export interface MunicipalityRuntime {
  workspace: MunicipalityWorkspace;
  repository: MunicipalDocumentRepository;
  evidenceStore: EvidenceStore;
  pipeline: CompasPipelineResult;
  lt1: LT1Result;
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

  return {
    workspace,
    repository: input.repository,
    evidenceStore: input.evidenceStore,
    pipeline: createEmptyCompasPipelineResult(workspace),
    lt1: generateLT1(input.evidenceStore),
  };
}
