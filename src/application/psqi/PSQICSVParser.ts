import type { PSQIAggregates } from "../../domain/psqi";
import { getMethodologicalModule } from "../../domain/methodology";
import { splitRow } from "../csv-utils/splitRow";

const _rawModule = getMethodologicalModule("psqi");
if (!_rawModule) throw new Error("[PSQICSVParser] Módulo 'psqi' no encontrado en el registro metodológico.");
const _redcap = _rawModule.adapters?.redcap;
if (!_redcap) throw new Error("[PSQICSVParser] PSQI_MODULE no tiene adaptador REDCap configurado.");

const _colByField = new Map(_redcap.columns.map((c) => [c.outputField, c.redcapColumn]));
const COLS = Array.from({ length: 7 }, (_, i) => _colByField.get(`c${i + 1}`)!);
const VALID_VALUES = new Set([0, 1, 2, 3]);

const EMPTY_AGGREGATES: PSQIAggregates = {
  n: 0, nValid: 0, missing: 0, meanScore: 0,
  nPositive: 0, pctPositive: 0,
  nScore0to5: 0, nScore6to10: 0, nScore11to21: 0,
};

export interface PSQICSVParseResult {
  aggregates: PSQIAggregates;
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

function buildCautions(aggregates: PSQIAggregates): string[] {
  const cautions: string[] = [
    "El PSQI evalúa la calidad subjetiva del sueño en el último mes. " +
      "Punto de corte >5: mala calidad del sueño. Sensibilidad 89.6 %, especificidad 86.5 %. " +
      "Buysse et al. (1989). Validado en España: Royuela & Macías (1997).",
    "COMPÁS NG procesa los 7 componentes PSQI pre-calculados. Los componentes deben ser " +
      "calculados por el profesional antes de exportar desde REDCap, ya que cada uno " +
      "requiere múltiples ítems del cuestionario original.",
    "El PSQI evalúa el estado del último mes: no refleja la calidad del sueño habitual a largo plazo.",
    "Sin referencia provincial disponible para comparación territorial.",
  ];

  if (aggregates.n === 0) {
    return [`CSV vacío o sin registros. Verifica que incluya las columnas psqi_c1 a psqi_c7.`, ...cautions];
  }
  if (aggregates.nValid === 0) {
    cautions.unshift("CSV sin registros con los 7 componentes completos. Verifica que contengan valores enteros 0–3.");
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

export function parsePSQICSV(csvText: string): PSQICSVParseResult {
  const lines = csvText.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) {
    return { aggregates: EMPTY_AGGREGATES, methodologicalCautions: buildCautions(EMPTY_AGGREGATES), warnings: ["CSV vacío o sin registros de datos."] };
  }

  const header = splitRow(lines[0]).map((v) => v.trim());
  const idxs = COLS.map((col) => header.indexOf(col));
  const warnings: string[] = [];
  const missingCols = COLS.filter((_, i) => idxs[i] === -1);
  if (missingCols.length > 0) warnings.push(`Columnas no encontradas: ${missingCols.join(", ")}.`);
  if (idxs.every((idx) => idx === -1)) {
    return { aggregates: EMPTY_AGGREGATES, methodologicalCautions: buildCautions(EMPTY_AGGREGATES), warnings };
  }

  let n = 0, nValid = 0, missing = 0, scoreSum = 0;
  let nPositive = 0, nScore0to5 = 0, nScore6to10 = 0, nScore11to21 = 0;

  for (let i = 1; i < lines.length; i++) {
    const row = splitRow(lines[i]);
    n++;
    let complete = true;
    let score = 0;
    for (let j = 0; j < 7; j++) {
      const idx = idxs[j];
      const v = idx !== -1 ? parseItem(row[idx]) : null;
      if (v === null) { complete = false; break; }
      score += v;
    }
    if (!complete) { missing++; continue; }
    nValid++; scoreSum += score;
    if (score > 5) nPositive++;
    if (score <= 5) nScore0to5++;
    else if (score <= 10) nScore6to10++;
    else nScore11to21++;
  }

  const aggregates: PSQIAggregates = {
    n, nValid, missing,
    meanScore: nValid > 0 ? Math.round((scoreSum / nValid) * 100) / 100 : 0,
    nPositive, pctPositive: pct(nPositive, nValid),
    nScore0to5, nScore6to10, nScore11to21,
  };
  return { aggregates, methodologicalCautions: buildCautions(aggregates), warnings };
}
