import type { MunicipalityId } from "../municipality";
import type { IPAQAggregates } from "./IPAQAggregates";

export interface IPAQStudy {
  id: string;
  municipalityId: MunicipalityId;
  sourceFileName: string;
  aggregates: IPAQAggregates;
  methodologicalCautions: string[];
  warnings: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateIPAQStudyInput {
  municipalityId: MunicipalityId;
  sourceFileName: string;
  aggregates: IPAQAggregates;
  methodologicalCautions: string[];
  warnings?: string[];
}

export function createIPAQStudy(input: CreateIPAQStudyInput): IPAQStudy {
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
