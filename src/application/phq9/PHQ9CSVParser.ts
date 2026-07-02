import type { PHQ9Aggregates } from "../../domain/phq9";
import { getMethodologicalModule } from "../../domain/methodology";
import { splitRow } from "../csv-utils/splitRow";

const _rawModule = getMethodologicalModule("phq9");
if (!_rawModule) throw new Error("[PHQ9CSVParser] Módulo 'phq9' no encontrado en el registro metodológico.");
const _redcap = _rawModule.adapters?.redcap;
if (!_redcap) throw new Error("[PHQ9CSVParser] PHQ9_MODULE no tiene adaptador REDCap configurado.");

const _colByField = new Map(_redcap.columns.map((c) => [c.outputField, c.redcapColumn]));
const COLS = Array.from({ length: 9 }, (_, i) => _colByField.get(`q${i + 1}`)!);
const VALID_VALUES = new Set([0, 1, 2, 3]);

const EMPTY_AGGREGATES: PHQ9Aggregates = {
  n: 0, nValid: 0, missing: 0, meanScore: 0,
  nPositive: 0, pctPositive: 0,
  nScore0to4: 0, nScore5to9: 0, nScore10to14: 0, nScore15to19: 0, nScore20to27: 0,
};

export interface PHQ9CSVParseResult {
  aggregates: PHQ9Aggregates;
  methodologicalCautions: string[];
  warnings: string[];
}

function parseItem(raw: string | undefined): number | null {
  const t = raw?.trim();
  if (!t) return null;
  const v = Number(t);
  if (!Number.isInteger(v) || !VALID_VALUES.has(v)) return null;
  return v;
}

function pct(count: number, total: number): number {
  return total > 0 ? Math.round((count / total) * 1000) / 10 : 0;
}

function buildCautions(aggregates: PHQ9Aggregates): string[] {
  const cautions: string[] = [
    "El PHQ-9 es un instrumento de cribado de síntomas depresivos, no diagnóstico. " +
      "Un score ≥10 indica síntomas moderados o superiores que requieren evaluación clínica.",
    "IMPORTANTE: El ítem 9 (ideación suicida) requiere protocolo específico de manejo. " +
      "No administrar sin protocolo de derivación disponible.",
    "El PHQ-9 evalúa los síntomas de las últimas 2 semanas, no el estado crónico. " +
      "Punto de corte ≥10: sensibilidad 88 %, especificidad 88 % (Kroenke et al., 2001).",
    "Sin referencia provincial disponible para comparación territorial.",
  ];

  if (aggregates.n === 0) {
    return [`CSV vacío o sin registros. Verifica que incluya las columnas phq9_q1 a phq9_q9.`, ...cautions];
  }
  if (aggregates.nValid === 0) {
    cautions.unshift("CSV sin registros con los 9 ítems completos. Verifica que contengan valores enteros 0–3.");
  } else if (aggregates.nValid < 30) {
    cautions.push(`Muestra reducida (${aggregates.nValid} registros). Interpretar con precaución.`);
  }
  if (aggregates.missing > 0) {
    cautions.push(`${aggregates.missing} de ${aggregates.n} registros excluidos por datos incompletos o inválidos.`);
  }
  if (aggregates.nValid > 0 && aggregates.nPositive < 10 && aggregates.nPositive > 0) {
    cautions.push(`Prevalencia muy baja (n=${aggregates.nPositive} positivos). Interpretar con precaución.`);
  }
  return cautions;
}

export function parsePHQ9CSV(csvText: string): PHQ9CSVParseResult {
  const lines = csvText.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) {
    return { aggregates: EMPTY_AGGREGATES, methodologicalCautions: buildCautions(EMPTY_AGGREGATES), warnings: ["CSV vacío o sin registros de datos."] };
  }

  const header = splitRow(lines[0]).map((v) => v.trim());
  const idxs = COLS.map((col) => header.indexOf(col));
  const warnings: string[] = [];
  const missingCols = COLS.filter((col, i) => idxs[i] === -1);
  if (missingCols.length > 0) warnings.push(`Columnas no encontradas: ${missingCols.join(", ")}.`);
  if (idxs.every((idx) => idx === -1)) {
    return { aggregates: EMPTY_AGGREGATES, methodologicalCautions: buildCautions(EMPTY_AGGREGATES), warnings };
  }

  let n = 0, nValid = 0, missing = 0, scoreSum = 0;
  let nPositive = 0, nScore0to4 = 0, nScore5to9 = 0, nScore10to14 = 0, nScore15to19 = 0, nScore20to27 = 0;

  for (let i = 1; i < lines.length; i++) {
    const row = splitRow(lines[i]);
    n++;
    let complete = true;
    let score = 0;
    for (let j = 0; j < 9; j++) {
      const idx = idxs[j];
      const v = idx !== -1 ? parseItem(row[idx]) : null;
      if (v === null) { complete = false; break; }
      score += v;
    }
    if (!complete) { missing++; continue; }
    nValid++; scoreSum += score;
    if (score >= 10) nPositive++;
    if (score <= 4) nScore0to4++;
    else if (score <= 9) nScore5to9++;
    else if (score <= 14) nScore10to14++;
    else if (score <= 19) nScore15to19++;
    else nScore20to27++;
  }

  const aggregates: PHQ9Aggregates = {
    n, nValid, missing,
    meanScore: nValid > 0 ? Math.round((scoreSum / nValid) * 100) / 100 : 0,
    nPositive, pctPositive: pct(nPositive, nValid),
    nScore0to4, nScore5to9, nScore10to14, nScore15to19, nScore20to27,
  };
  return { aggregates, methodologicalCautions: buildCautions(aggregates), warnings };
}
