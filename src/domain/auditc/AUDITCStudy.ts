import type { MunicipalityId } from "../municipality";
import type { AUDITCAggregates } from "./AUDITCAggregates";

export interface AUDITCStudy {
  id: string;
  municipalityId: MunicipalityId;
  sourceFileName: string;
  aggregates: AUDITCAggregates;
  methodologicalCautions: string[];
  warnings: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateAUDITCStudyInput {
  municipalityId: MunicipalityId;
  sourceFileName: string;
  aggregates: AUDITCAggregates;
  methodologicalCautions: string[];
  warnings?: string[];
}

export function createAUDITCStudy(input: CreateAUDITCStudyInput): AUDITCStudy {
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
