export interface PHQ9Aggregates {
  n: number;
  nValid: number;
  missing: number;
  meanScore: number;
  nPositive: number;       // score >= 10 (depresión moderada o superior)
  pctPositive: number;
  nScore0to4: number;      // mínimo
  nScore5to9: number;      // leve
  nScore10to14: number;    // moderado
  nScore15to19: number;    // moderadamente grave
  nScore20to27: number;    // grave
}
