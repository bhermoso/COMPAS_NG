import type { MunicipalityId } from "../municipality";
import type { IBSEAggregates } from "./IBSEAggregates";

export interface IBSEStudy {
  id: string;
  municipalityId: MunicipalityId;
  sourceFileName: string;
  aggregates: IBSEAggregates;
  methodologicalCautions: string[];
  exportedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateIBSEStudyInput {
  municipalityId: MunicipalityId;
  sourceFileName: string;
  aggregates: IBSEAggregates;
  methodologicalCautions: string[];
  exportedAt?: string;
}

export function createIBSEStudy(input: CreateIBSEStudyInput): IBSEStudy {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    municipalityId: input.municipalityId,
    sourceFileName: input.sourceFileName,
    aggregates: input.aggregates,
    methodologicalCautions: input.methodologicalCautions,
    exportedAt: input.exportedAt,
    createdAt: now,
    updatedAt: now,
  };
}
