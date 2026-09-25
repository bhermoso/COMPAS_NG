export interface SBQAggregates {
  n: number;
  nValid: number;
  missing: number;
  meanHours: number;       // media de horas/día de comportamiento sedentario
  nPositive: number;       // participantes con >8h/día (altamente sedentario)
  pctPositive: number;
  // Distribución por rangos de sedentarismo
  nLow: number;            // ≤4 h/día (sedentarismo bajo)
  nModerate: number;       // 4–8 h/día (sedentarismo moderado)
  nHigh: number;           // >8 h/día (comportamiento altamente sedentario)
}
