export interface CAGEAggregates {
  n: number;
  // CAGE_R — riesgo de alcoholismo (campo canónico primario, ~82 % cobertura en EAS)
  nValidCAGER: number;
  missingCAGER: number;
  nRisk: number;
  pctRisk: number;
  // CAGE — clasificación ordinal de nivel de consumo (1–4, mismo n que CAGE_R)
  nValidCAGE: number;
  nCAGE1: number; // Bebedor social
  nCAGE2: number; // Consumo de riesgo
  nCAGE3: number; // Consumo perjudicial
  nCAGE4: number; // Dependencia alcohólica
}
