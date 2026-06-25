import type { MunicipalityId } from "../municipality";
import type { PREDIMEDAggregates } from "./PREDIMEDAggregates";

export interface PREDIMEDStudy {
  id: string;
  municipalityId: MunicipalityId;
  sourceFileName: string;
  aggregates: PREDIMEDAggregates;
  methodologicalCautions: string[];
  warnings: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreatePREDIMEDStudyInput {
  municipalityId: MunicipalityId;
  sourceFileName: string;
  aggregates: PREDIMEDAggregates;
  methodologicalCautions: string[];
  warnings?: string[];
}

export function createPREDIMEDStudy(input: CreatePREDIMEDStudyInput): PREDIMEDStudy {
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
