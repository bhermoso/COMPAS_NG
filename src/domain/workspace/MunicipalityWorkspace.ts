import type { MunicipalityContext } from "../municipality";
import type { MunicipalDocumentRepository } from "../repository";
import type { EvidenceGraph } from "../evidence";

export interface MunicipalityWorkspace {
  municipality: MunicipalityContext;
  repository: MunicipalDocumentRepository;
  evidence: EvidenceGraph;
  schemaVersion: string;
  createdAt: string;
  updatedAt: string;
}

export function createMunicipalityWorkspace(
  municipality: MunicipalityContext,
  repository: MunicipalDocumentRepository,
  evidence: EvidenceGraph
): MunicipalityWorkspace {
  const now = new Date().toISOString();

  return {
    municipality,
    repository,
    evidence,
    schemaVersion: "1.0.0",
    createdAt: now,
    updatedAt: now,
  };
}
