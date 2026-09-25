export interface IPAQAggregates {
  n: number;
  // IPAQ_DICO — actividad física alta (campo derivado oficial EAS)
  nValidIPAQ: number;
  missingIPAQ: number;
  nHigh: number;         // IPAQ_DICO = 1 (alta actividad: ≥600 MET-min/sem o ≥150 min/sem vigorosa)
  pctHigh: number;       // porcentaje de alta actividad sobre válidos
  // P34A_R — inactividad en tiempo libre (campo EAS)
  nValidP34AR: number;
  missingP34AR: number;
  nInactive: number;     // P34A_R = 1 (sin actividad física en tiempo libre)
  pctInactive: number;   // porcentaje de inactivos sobre válidos
}
