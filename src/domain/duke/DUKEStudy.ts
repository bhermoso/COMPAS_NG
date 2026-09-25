import type { MunicipalityId } from "../municipality";
import type { DUKEAggregates } from "./DUKEAggregates";

export interface DUKEStudy {
  id: string;
  municipalityId: MunicipalityId;
  sourceFileName: string;
  aggregates: DUKEAggregates;
  methodologicalCautions: string[];
  warnings: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateDUKEStudyInput {
  municipalityId: MunicipalityId;
  sourceFileName: string;
  aggregates: DUKEAggregates;
  methodologicalCautions: string[];
  warnings?: string[];
}

export function createDUKEStudy(input: CreateDUKEStudyInput): DUKEStudy {
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
