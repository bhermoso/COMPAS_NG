import type { MunicipalityId } from "../municipality";
import type { CAGEAggregates } from "./CAGEAggregates";

export interface CAGEStudy {
  id: string;
  municipalityId: MunicipalityId;
  sourceFileName: string;
  aggregates: CAGEAggregates;
  methodologicalCautions: string[];
  warnings: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateCAGEStudyInput {
  municipalityId: MunicipalityId;
  sourceFileName: string;
  aggregates: CAGEAggregates;
  methodologicalCautions: string[];
  warnings?: string[];
}

export function createCAGEStudy(input: CreateCAGEStudyInput): CAGEStudy {
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
