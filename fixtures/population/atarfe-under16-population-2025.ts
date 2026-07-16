import type { PopulationReference } from "../../src/domain/sam";

// Fuente: "20260101_Pob por cap sexo y edad (1).xlsx" — COMPAS_NG root
// MTI-BDU — Poblaciones por Edad a 31/12/2025
// Centro de Atención Primaria: Atarfe (CAP 21046), Zona Básica: 04046
// Municipio: Atarfe (Granada)
//
// Grupo objetivo: 6–15 años — universo coherente de MENORES DE 16.
// Se deriva del desglose por edad (mismo Excel que atarfe-school-population-2025):
//   6: 206 | 7: 201 | 8: 210 | 9: 271 | 10: 230 | 11: 255
//  12: 232 | 13: 245 | 14: 226 | 15: 247
//   Total 6–15: 2.323 personas (= 2.847 de 6–17 − 262 de 16 − 262 de 17)
//
// Nota metodológica: esta es la REFERENCIA de menores de 16 para el
// `SampleQualityAssessment` del IBSE cuando `sampleScope === "under-16"`.
// NO se reutiliza la referencia escolar 6–17 (que incluye 16 y 17 años),
// porque sobreestimaría el universo de una muestra estrictamente de menores de 16.
// nTheoretical Cochran (95 %, ±5 %, p=0,5) con N=2.323 → 330.
export const ATARFE_UNDER16_POPULATION_2025: PopulationReference = {
  municipalityId: "18022",
  municipalityCode: "18022",
  source: "MTI-BDU — Poblaciones por Edad, 31 de diciembre de 2025",
  year: 2025,
  populationTotal: 2_323,
  ageGroupLabel: "6 a 15 años (menores de 16)",
  extractedAt: "2026-06-29",
};
