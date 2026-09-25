import type { MunicipalityId } from "../municipality";
import type { SuenoAggregates } from "./SuenoAggregates";

export interface SuenoStudy {
  id: string;
  municipalityId: MunicipalityId;
  sourceFileName: string;
  aggregates: SuenoAggregates;
  methodologicalCautions: string[];
  warnings: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateSuenoStudyInput {
  municipalityId: MunicipalityId;
  sourceFileName: string;
  aggregates: SuenoAggregates;
  methodologicalCautions: string[];
  warnings?: string[];
}

export function createSuenoStudy(input: CreateSuenoStudyInput): SuenoStudy {
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
