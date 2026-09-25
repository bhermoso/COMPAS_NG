export interface GHQ12Aggregates {
  // ── Cobertura ────────────────────────────────────────────────────────────────
  n: number;               // total de registros procesados en el CSV
  nValid: number;          // registros con los 12 ítems completos y válidos (0–3)
  missing: number;         // registros excluidos por datos incompletos o inválidos

  // ── Score bimodal (0/0/1/1) ───────────────────────────────────────────────
  // Scoring oficial GHQ-12: valores 0,1 → 0; valores 2,3 → 1 por ítem.
  // Score bimodal = suma de ítems con respuesta 2 o 3. Rango 0–12.
  meanBimodal: number;     // media del score bimodal sobre registros válidos

  // ── Indicador de probable caso (cutpoint ≥ 3) ─────────────────────────────
  nPositive: number;       // registros con score bimodal ≥ 3
  pctPositive: number;     // porcentaje positivo sobre nValid

  // ── Distribución por rangos ───────────────────────────────────────────────
  nScore0to2: number;      // score bimodal 0–2 (sin indicadores de malestar)
  nScore3to6: number;      // score bimodal 3–6 (probable caso leve-moderado)
  nScore7to12: number;     // score bimodal 7–12 (probable caso moderado-grave)
}
