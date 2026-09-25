import type { MunicipalityId } from "../municipality";
import type { PHQ9Aggregates } from "./PHQ9Aggregates";

export interface PHQ9Study {
  id: string;
  municipalityId: MunicipalityId;
  sourceFileName: string;
  aggregates: PHQ9Aggregates;
  methodologicalCautions: string[];
  warnings: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreatePHQ9StudyInput {
  municipalityId: MunicipalityId;
  sourceFileName: string;
  aggregates: PHQ9Aggregates;
  methodologicalCautions: string[];
  warnings?: string[];
}

export function createPHQ9Study(input: CreatePHQ9StudyInput): PHQ9Study {
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
