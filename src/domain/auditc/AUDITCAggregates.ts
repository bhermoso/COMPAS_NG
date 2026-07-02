export interface AUDITCAggregates {
  // ── Cobertura ─────────────────────────────────────────────────────────────
  n: number;               // total de registros procesados en el CSV
  nValid: number;          // registros con los 3 ítems completos (Q1+Q2+Q3 válidos)
  missing: number;         // registros excluidos por datos incompletos o inválidos

  // ── Score ─────────────────────────────────────────────────────────────────
  meanScore: number;       // media del score total AUDIT-C (0–12) sobre registros válidos

  // ── Indicador de riesgo (punto de corte ≥4) ───────────────────────────────
  // Punto de corte simplificado de uso general (sin diferenciación por sexo).
  // Corte diferenciado original: ≥3 mujeres / ≥4 hombres (Bush et al. 1998).
  nPositive: number;       // registros con score ≥ 4
  pctPositive: number;     // porcentaje positivo sobre nValid

  // ── Distribución por rangos de riesgo ─────────────────────────────────────
  nScore0: number;         // score = 0 (no consume o consumo extremadamente esporádico)
  nScore1to3: number;      // score 1–3 (bajo riesgo; positivo en mujeres si ≥3)
  nScore4to7: number;      // score 4–7 (consumo de riesgo)
  nScore8to12: number;     // score 8–12 (consumo de alto riesgo)
}
