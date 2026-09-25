import type { MunicipalityId } from "../municipality";
import type { SF12Aggregates } from "./SF12Aggregates";

export interface SF12Study {
  id: string;
  municipalityId: MunicipalityId;
  sourceFileName: string;
  aggregates: SF12Aggregates;
  methodologicalCautions: string[];
  warnings: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateSF12StudyInput {
  municipalityId: MunicipalityId;
  sourceFileName: string;
  aggregates: SF12Aggregates;
  methodologicalCautions: string[];
  warnings?: string[];
}

export function createSF12Study(input: CreateSF12StudyInput): SF12Study {
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
