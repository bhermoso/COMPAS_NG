import type { MunicipalityId } from "../municipality";
import type { PopulationReference } from "./PopulationReference";

export type SampleQualityLevel = "high" | "medium" | "low";

export interface CochranParams {
  confidence: number;
  marginOfError: number;
  expectedProportion: number;
}

export const DEFAULT_COCHRAN_PARAMS: CochranParams = {
  confidence: 0.95,
  marginOfError: 0.05,
  expectedProportion: 0.5,
};

export interface SampleCapabilities {
  canInferGlobalCoverage: boolean;
  canClassifyQuality: boolean;
}

export interface SampleQualityAssessment {
  instrumentId: string;
  municipalityId: MunicipalityId;
  nObserved: number;
  populationReference: PopulationReference;
  cochranParams: CochranParams;
  nTheoreticalRaw: number;
  nTheoretical: number;
  coverageGlobal: number;
  sampleQuality: SampleQualityLevel;
  sampleQualityRationale: string;
  methodologicalCautions: string[];
  capabilities: SampleCapabilities;
  requiresHumanValidation: true;
  computedAt: string;
}
