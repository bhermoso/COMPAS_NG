export interface PSQIAggregates {
  n: number;
  nValid: number;
  missing: number;
  meanScore: number;
  nPositive: number;       // total PSQI > 5 (mala calidad del sueño)
  pctPositive: number;
  nScore0to5: number;      // buena calidad del sueño (≤5)
  nScore6to10: number;     // mala calidad del sueño leve-moderada
  nScore11to21: number;    // mala calidad del sueño grave
}
