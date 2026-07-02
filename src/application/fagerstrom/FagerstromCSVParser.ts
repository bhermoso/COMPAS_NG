import type { FagerstromAggregates } from "../../domain/fagerstrom";
import { getMethodologicalModule } from "../../domain/methodology";
import { splitRow } from "../csv-utils/splitRow";

const _rawModule = getMethodologicalModule("fagerstrom");
if (!_rawModule) throw new Error("[FagerstromCSVParser] Módulo 'fagerstrom' no encontrado en el registro metodológico.");
const _redcap = _rawModule.adapters?.redcap;
if (!_redcap) throw new Error("[FagerstromCSVParser] FAGERSTROM_MODULE no tiene adaptador REDCap configurado.");

const _colByField = new Map(_redcap.columns.map((c) => [c.outputField, c.redcapColumn]));

const COL_Q1 = _colByField.get("q1")!;  // ftnd_q1 (0–4)
const COL_Q2 = _colByField.get("q2")!;  // ftnd_q2 (0–1)
const COL_Q3 = _colByField.get("q3")!;  // ftnd_q3 (0–1)
const COL_Q4 = _colByField.get("q4")!;  // ftnd_q4 (0–1)
const COL_Q5 = _colByField.get("q5")!;  // ftnd_q5 (0–1)
const COL_Q6 = _colByField.get("q6")!;  // ftnd_q6 (0–3)

const VALID_Q1 = new Set([0, 1, 2, 3, 4]);
const VALID_BIN = new Set([0, 1]);
const VALID_Q6 = new Set([0, 1, 2, 3]);

const EMPTY_AGGREGATES: FagerstromAggregates = {
  n: 0, nValid: 0, missing: 0, meanScore: 0,
  nPositive: 0, pctPositive: 0,
  nVeryLow: 0, nLow: 0, nModerate: 0, nHigh: 0, nVeryHigh: 0,
};

export interface FagerstromCSVParseResult {
  aggregates: FagerstromAggregates;
  methodologicalCautions: string[];
  warnings: string[];
}

function parseWithRange(raw: string | undefined, valid: Set<number>): number | null {
  const t = raw?.trim();
  if (!t) return null;
  const v = Number(t);
  if (!Number.isInteger(v) || !valid.has(v)) return null;
  return v;
}

function pct(count: number, total: number): number {
  return total > 0 ? Math.round((count / total) * 1000) / 10 : 0;
}

function buildCautions(aggregates: FagerstromAggregates): string[] {
  const cautions: string[] = [
    "El Test de Fagerström solo se administra a fumadores activos. " +
      "Los resultados reflejan la distribución de dependencia tabáquica en la submuestra de fumadores, " +
      "no en la población adulta total. La prevalencia de tabaquismo no es calculable desde este instrumento.",
    "Score ≥5 indica dependencia moderada o superior con alta probabilidad de síntomas de abstinencia. " +
      "Heatherton et al. (1991). Validado en España: Becoña & Vázquez (1998).",
    "El instrumento mide dependencia física a la nicotina, no la dependencia psicológica al tabaco.",
    "Sin referencia provincial disponible para comparación territorial directa.",
  ];

  if (aggregates.n === 0) {
    return [`CSV vacío o sin registros. Verifica que incluya las columnas ftnd_q1 a ftnd_q6.`, ...cautions];
  }
  if (aggregates.nValid === 0) {
    cautions.unshift("CSV sin registros con los 6 ítems completos. Verifica los rangos: Q1=0-4, Q2-Q5=0-1, Q6=0-3.");
  } else if (aggregates.nValid < 15) {
    cautions.push(`Muestra muy reducida (${aggregates.nValid} fumadores activos). Interpretar con extrema precaución.`);
  } else if (aggregates.nValid < 30) {
    cautions.push(`Muestra reducida (${aggregates.nValid} fumadores activos). Interpretar con precaución.`);
  }
  if (aggregates.missing > 0) {
    cautions.push(`${aggregates.missing} de ${aggregates.n} registros excluidos por datos incompletos o inválidos.`);
  }
  return cautions;
}

export function parseFagerstromCSV(csvText: string): FagerstromCSVParseResult {
  const lines = csvText.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) {
    return { aggregates: EMPTY_AGGREGATES, methodologicalCautions: buildCautions(EMPTY_AGGREGATES), warnings: ["CSV vacío o sin registros de datos."] };
  }

  const header = splitRow(lines[0]).map((v) => v.trim());
  const idxQ1 = header.indexOf(COL_Q1);
  const idxQ2 = header.indexOf(COL_Q2);
  const idxQ3 = header.indexOf(COL_Q3);
  const idxQ4 = header.indexOf(COL_Q4);
  const idxQ5 = header.indexOf(COL_Q5);
  const idxQ6 = header.indexOf(COL_Q6);

  const warnings: string[] = [];
  if (idxQ1 === -1) warnings.push(`Columna "${COL_Q1}" no encontrada.`);
  if ([idxQ1, idxQ2, idxQ3, idxQ4, idxQ5, idxQ6].every(i => i === -1)) {
    return { aggregates: EMPTY_AGGREGATES, methodologicalCautions: buildCautions(EMPTY_AGGREGATES), warnings };
  }

  let n = 0, nValid = 0, missing = 0, scoreSum = 0;
  let nPositive = 0, nVeryLow = 0, nLow = 0, nModerate = 0, nHigh = 0, nVeryHigh = 0;

  for (let i = 1; i < lines.length; i++) {
    const row = splitRow(lines[i]);
    n++;

    const q1 = idxQ1 !== -1 ? parseWithRange(row[idxQ1], VALID_Q1) : null;
    const q2 = idxQ2 !== -1 ? parseWithRange(row[idxQ2], VALID_BIN) : null;
    const q3 = idxQ3 !== -1 ? parseWithRange(row[idxQ3], VALID_BIN) : null;
    const q4 = idxQ4 !== -1 ? parseWithRange(row[idxQ4], VALID_BIN) : null;
    const q5 = idxQ5 !== -1 ? parseWithRange(row[idxQ5], VALID_BIN) : null;
    const q6 = idxQ6 !== -1 ? parseWithRange(row[idxQ6], VALID_Q6) : null;

    if (q1 === null || q2 === null || q3 === null || q4 === null || q5 === null || q6 === null) {
      missing++; continue;
    }

    const score = q1 + q2 + q3 + q4 + q5 + q6;
    nValid++; scoreSum += score;
    if (score >= 5) nPositive++;
    if (score <= 2) nVeryLow++;
    else if (score <= 4) nLow++;
    else if (score === 5) nModerate++;
    else if (score <= 7) nHigh++;
    else nVeryHigh++;
  }

  const aggregates: FagerstromAggregates = {
    n, nValid, missing,
    meanScore: nValid > 0 ? Math.round((scoreSum / nValid) * 100) / 100 : 0,
    nPositive, pctPositive: pct(nPositive, nValid),
    nVeryLow, nLow, nModerate, nHigh, nVeryHigh,
  };
  return { aggregates, methodologicalCautions: buildCautions(aggregates), warnings };
}
