export interface SuenoAggregates {
  n: number;
  // P33_R — duración insuficiente (campo canónico primario, ~98 % cobertura)
  nValidP33R: number;
  missingP33R: number;
  nInsufficientSleep: number;
  pctInsufficientSleep: number;
  // P33A — calidad subjetiva percibida (campo canónico secundario, ~75 % cobertura)
  nValidP33A: number;
  missingP33A: number;
  nNoRest: number;
  pctNoRest: number;
}
