import type { SBQAggregates } from "../../domain/sbq";
import { getMethodologicalModule } from "../../domain/methodology";
import { splitRow } from "../csv-utils/splitRow";

const _rawModule = getMethodologicalModule("sbq");
if (!_rawModule) throw new Error("[SBQCSVParser] Módulo 'sbq' no encontrado en el registro metodológico.");
const _redcap = _rawModule.adapters?.redcap;
if (!_redcap) throw new Error("[SBQCSVParser] SBQ_MODULE no tiene adaptador REDCap configurado.");

const _colByField = new Map(_redcap.columns.map((c) => [c.outputField, c.redcapColumn]));
const COLS = Array.from({ length: 9 }, (_, i) => _colByField.get(`q${i + 1}`)!);
const VALID_VALUES = new Set([0, 1, 2, 3, 4]);

// Factor de conversión de puntuación ordinal a horas (midpoint)
const HOURS_MAP: Record<number, number> = { 0: 0, 1: 0.5, 2: 1.5, 3: 3, 4: 5 };
const CUTPOINT_HOURS = 8; // >8h/día = comportamiento altamente sedentario

const EMPTY_AGGREGATES: SBQAggregates = {
  n: 0, nValid: 0, missing: 0, meanHours: 0,
  nPositive: 0, pctPositive: 0,
  nLow: 0, nModerate: 0, nHigh: 0,
};

export interface SBQCSVParseResult {
  aggregates: SBQAggregates;
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

function buildCautions(aggregates: SBQAggregates): string[] {
  const cautions: string[] = [
    "El SBQ estima el tiempo sedentario diario mediante una escala ordinal. " +
      "Las horas se calculan usando el punto medio de cada categoría (midpoint): " +
      "0→0h, 1→0.5h, 2→1.5h, 3→3h, 4→5h. " +
      "Las estimaciones son aproximaciones: las horas reales pueden diferir. " +
      "Rosenberg et al. (2008, 2010).",
    "Punto de corte clínico: >8h/día = comportamiento altamente sedentario. " +
      "El sedentarismo es un factor de riesgo independiente del nivel de actividad física.",
    "El comportamiento sedentario y la actividad física son dimensiones distintas: " +
      "una persona puede ser activa y, a la vez, altamente sedentaria el resto del tiempo.",
    "Sin referencia provincial disponible para comparación territorial.",
  ];

  if (aggregates.n === 0) {
    return [`CSV vacío o sin registros. Verifica que incluya las columnas sbq_q1 a sbq_q9.`, ...cautions];
  }
  if (aggregates.nValid === 0) {
    cautions.unshift("CSV sin registros con los 9 ítems completos. Verifica que contengan valores enteros 0–4.");
  } else if (aggregates.nValid < 30) {
    cautions.push(`Muestra reducida (${aggregates.nValid} registros). Interpretar con precaución.`);
  }
  if (aggregates.missing > 0) {
    cautions.push(`${aggregates.missing} de ${aggregates.n} registros excluidos por datos incompletos o inválidos.`);
  }
  return cautions;
}

export function parseSBQCSV(csvText: string): SBQCSVParseResult {
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

  let n = 0, nValid = 0, missing = 0, hoursSum = 0;
  let nPositive = 0, nLow = 0, nModerate = 0, nHigh = 0;

  for (let i = 1; i < lines.length; i++) {
    const row = splitRow(lines[i]);
    n++;
    let complete = true;
    let totalHours = 0;
    for (let j = 0; j < 9; j++) {
      const idx = idxs[j];
      const v = idx !== -1 ? parseItem(row[idx]) : null;
      if (v === null) { complete = false; break; }
      totalHours += HOURS_MAP[v];
    }
    if (!complete) { missing++; continue; }
    nValid++; hoursSum += totalHours;
    if (totalHours > CUTPOINT_HOURS) nPositive++;
    if (totalHours <= 4) nLow++;
    else if (totalHours <= 8) nModerate++;
    else nHigh++;
  }

  const aggregates: SBQAggregates = {
    n, nValid, missing,
    meanHours: nValid > 0 ? Math.round((hoursSum / nValid) * 100) / 100 : 0,
    nPositive, pctPositive: pct(nPositive, nValid),
    nLow, nModerate, nHigh,
  };
  return { aggregates, methodologicalCautions: buildCautions(aggregates), warnings };
}
