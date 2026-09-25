import type { MunicipalityId } from "../municipality";
import type { GHQ12Aggregates } from "./GHQ12Aggregates";

export interface GHQ12Study {
  id: string;
  municipalityId: MunicipalityId;
  sourceFileName: string;
  aggregates: GHQ12Aggregates;
  methodologicalCautions: string[];
  warnings: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateGHQ12StudyInput {
  municipalityId: MunicipalityId;
  sourceFileName: string;
  aggregates: GHQ12Aggregates;
  methodologicalCautions: string[];
  warnings?: string[];
}

export function createGHQ12Study(input: CreateGHQ12StudyInput): GHQ12Study {
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
