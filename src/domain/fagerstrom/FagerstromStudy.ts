import type { MunicipalityId } from "../municipality";
import type { FagerstromAggregates } from "./FagerstromAggregates";

export interface FagerstromStudy {
  id: string;
  municipalityId: MunicipalityId;
  sourceFileName: string;
  aggregates: FagerstromAggregates;
  methodologicalCautions: string[];
  warnings: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateFagerstromStudyInput {
  municipalityId: MunicipalityId;
  sourceFileName: string;
  aggregates: FagerstromAggregates;
  methodologicalCautions: string[];
  warnings?: string[];
}

export function createFagerstromStudy(input: CreateFagerstromStudyInput): FagerstromStudy {
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
