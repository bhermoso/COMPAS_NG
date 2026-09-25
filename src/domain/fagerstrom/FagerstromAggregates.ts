export interface FagerstromAggregates {
  n: number;
  nValid: number;          // fumadores con los 6 ítems completos y válidos
  missing: number;
  meanScore: number;       // media del score FTND (0–10)
  nPositive: number;       // score >= 5 (dependencia moderada o superior)
  pctPositive: number;
  // Distribución por nivel de dependencia (Heatherton et al., 1991)
  nVeryLow: number;        // 0–2 muy baja
  nLow: number;            // 3–4 baja
  nModerate: number;       // 5 moderada
  nHigh: number;           // 6–7 alta
  nVeryHigh: number;       // 8–10 muy alta
}
