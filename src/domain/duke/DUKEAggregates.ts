export type DUKEResponseValue = 1 | 2 | 3 | 4 | 5;

export type DUKERecodedSupport = 0 | 1 | 993;

export interface DUKERowInput {
  P5701?: number | null;
  P5702?: number | null;
  P5703?: number | null;
  P5704?: number | null;
  P5705?: number | null;
  P5706?: number | null;
  P5707?: number | null;
  P5708?: number | null;
  P5709?: number | null;
  P5710?: number | null;
  P5711?: number | null;
}

export interface DUKERowScores {
  dukeGLOBAL: number | null;
  dukeCONF: number | null;
  dukeAFECT: number | null;
  P57GLOBAL_R: DUKERecodedSupport;
  P57_AC_R: DUKERecodedSupport;
  P57_AF_R: DUKERecodedSupport;
}

export interface DUKEAggregates {
  n: number;
  nValidGlobal: number;
  nValidConfidential: number;
  nValidAffective: number;
  meanGlobal: number;
  meanConfidential: number;
  meanAffective: number;
  lowGlobalCount: number;
  lowConfidentialCount: number;
  lowAffectiveCount: number;
  normalGlobalCount: number;
  normalConfidentialCount: number;
  normalAffectiveCount: number;
  incompleteGlobalCount: number;
  incompleteConfidentialCount: number;
  incompleteAffectiveCount: number;
  lowGlobalPercentage: number;
  lowConfidentialPercentage: number;
  lowAffectivePercentage: number;
}
