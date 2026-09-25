import type { MunicipalityId } from "../municipality";
import type { PSQIAggregates } from "./PSQIAggregates";

export interface PSQIStudy {
  id: string;
  municipalityId: MunicipalityId;
  sourceFileName: string;
  aggregates: PSQIAggregates;
  methodologicalCautions: string[];
  warnings: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreatePSQIStudyInput {
  municipalityId: MunicipalityId;
  sourceFileName: string;
  aggregates: PSQIAggregates;
  methodologicalCautions: string[];
  warnings?: string[];
}

export function createPSQIStudy(input: CreatePSQIStudyInput): PSQIStudy {
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
