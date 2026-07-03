import type { MunicipalityId } from "../municipality";
import type { SBQAggregates } from "./SBQAggregates";

export interface SBQStudy {
  id: string;
  municipalityId: MunicipalityId;
  sourceFileName: string;
  aggregates: SBQAggregates;
  methodologicalCautions: string[];
  warnings: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateSBQStudyInput {
  municipalityId: MunicipalityId;
  sourceFileName: string;
  aggregates: SBQAggregates;
  methodologicalCautions: string[];
  warnings?: string[];
}

export function createSBQStudy(input: CreateSBQStudyInput): SBQStudy {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    municipalityId: input.municipalityId,
    sourceFileName: input.sourceFileName,
    aggregates: input.aggregates,
    methodologicalCautions: input.methodologicalCautions,
    warnings: input.warnings ?? [],
    createdAt: now,
    updatedAt: now,
  };
}
