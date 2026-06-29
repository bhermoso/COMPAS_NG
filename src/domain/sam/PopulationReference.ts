import type { MunicipalityId } from "../municipality";

export interface PopulationReference {
  municipalityId: MunicipalityId;
  municipalityCode: string;
  source: string;
  year: number;
  populationTotal: number;
  ageGroupLabel: string;
  extractedAt: string;
}
