import type { MunicipalityContext } from "../municipality";
import type { MunicipalDocumentRepository } from "../repository";
import type { EvidenceStore } from "../evidence";
import type { HealthReportDocument } from "../health-report";
import type { IBSEStudy } from "../ibse";
import type { ThematicPrioritisation, ThematicPrioritisationStudy } from "../thematic-prioritisation";

export interface MunicipalityWorkspace {
  municipality: MunicipalityContext;
  repository: MunicipalDocumentRepository;
  evidenceStore: EvidenceStore;
  healthReports?: HealthReportDocument[];
  ibseStudy?: IBSEStudy;
  thematicPrioritisation?: ThematicPrioritisation;
  thematicPrioritisationStudy?: ThematicPrioritisationStudy;
  schemaVersion: string;
  createdAt: string;
  updatedAt: string;
}

export function createMunicipalityWorkspace(
  municipality: MunicipalityContext,
  repository: MunicipalDocumentRepository,
  evidenceStore: EvidenceStore
): MunicipalityWorkspace {
  const now = new Date().toISOString();

  return {
    municipality,
    repository,
    evidenceStore,
    schemaVersion: "1.0.0",
    createdAt: now,
    updatedAt: now,
  };
}
