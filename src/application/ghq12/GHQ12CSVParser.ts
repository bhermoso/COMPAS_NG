import type { GHQ12Aggregates } from "../../domain/ghq12";
import { getMethodologicalModule } from "../../domain/methodology";
import { splitRow } from "../csv-utils/splitRow";

const _rawModule = getMethodologicalModule("ghq12");
if (!_rawModule) {
  throw new Error(
    "[GHQ12CSVParser] Módulo 'ghq12' no encontrado en el registro metodológico. " +
    "Verifica que GHQ12_MODULE esté registrado en domain/methodology/registry.ts."
  );
}
const _redcap = _rawModule.adapters?.redcap;
if (!_redcap) {
  throw new Error("[GHQ12CSVParser] GHQ12_MODULE no tiene adaptador REDCap configurado.");
}

const _colByField = new Map(_redcap.columns.map((c) => [c.outputField, c.redcapColumn]));

const COLS = Array.from({ length: 12 }, (_, i) => _colByField.get(`q${i + 1}`)!);

const VALID_VALUES = new Set([0, 1, 2, 3]);

const EMPTY_AGGREGATES: GHQ12Aggregates = {
  n: 0, nValid: 0, missing: 0,
  meanBimodal: 0,
  nPositive: 0, pctPositive: 0,
  nScore0to2: 0, nScore3to6: 0, nScore7to12: 0,
};

export interface GHQ12CSVParseResult {
  aggregates: GHQ12Aggregates;
  methodologicalCautions: string[];
  warnings: string[];
}

function parseItem(raw: string | undefined): number | null {
  const t = raw?.trim();
  if (t === undefined || t === "") return null;
  const v = Number(t);
  if (!Number.isInteger(v) || !VALID_VALUES.has(v)) return null;
  return v;
}

function pct(count: number, total: number): number {
  return total > 0 ? Math.round((count / total) * 1000) / 10 : 0;
}

function buildCautions(aggregates: GHQ12Aggregates): string[] {
  const colList = COLS.slice(0, 3).join(", ");
  const cautions: string[] = [
    "El GHQ-12 es un instrumento de cribado de malestar psicológico, no diagnóstico. " +
      "Un score positivo (≥3 en scoring bimodal) no implica trastorno mental confirmado. " +
      "Los resultados son estimaciones de la muestra y requieren validación técnica.",
    "Scoring bimodal aplicado (0/0/1/1): valores 0,1 → 0; valores 2,3 → 1 por ítem. " +
      "Punto de corte ≥ 3 validado en población española (Sánchez-López & Dresch, 2008).",
    "El GHQ-12 evalúa el estado de las últimas semanas, no el estado crónico. " +
      "Los resultados pueden variar significativamente entre períodos de recogida.",
    "Sin referencia provincial ni autonómica disponible para comparación territorial directa.",
  ];

  if (aggregates.n === 0) {
    return [
      `CSV vacío o sin registros. Verifica que incluya las columnas ${colList}...`,
      ...cautions,
    ];
  }

  if (aggregates.nValid === 0) {
    cautions.unshift(
      `CSV sin registros con los 12 ítems completos. Verifica que contengan valores enteros 0–3.`
    );
  } else if (aggregates.nValid < 30) {
    cautions.push(
      `Muestra reducida (${aggregates.nValid} registros válidos). Interpretar con precaución.`
    );
  }

  if (aggregates.missing > 0) {
    cautions.push(
      `${aggregates.missing} de ${aggregates.n} registros excluidos por datos incompletos o inválidos.`
    );
  }

  if (aggregates.nValid > 0 && aggregates.nPositive < 10 && aggregates.nPositive > 0) {
    cautions.push(
      `Prevalencia muy baja (n=${aggregates.nPositive} positivos). ` +
      "Los porcentajes deben interpretarse con extrema precaución."
    );
  }

  return cautions;
}

export function parseGHQ12CSV(csvText: string): GHQ12CSVParseResult {
  const lines = csvText.split(/\r?\n/).filter((l) => l.trim().length > 0);

  if (lines.length < 2) {
    return {
      aggregates: EMPTY_AGGREGATES,
      methodologicalCautions: buildCautions(EMPTY_AGGREGATES),
      warnings: ["CSV vacío o sin registros de datos."],
    };
  }

  const header = splitRow(lines[0]).map((v) => v.trim());
  const idxs = COLS.map((col) => header.indexOf(col));

  const warnings: string[] = [];
  const missingCols = COLS.filter((_, i) => idxs[i] === -1);
  if (missingCols.length > 0) {
    warnings.push(`Columnas no encontradas: ${missingCols.join(", ")}.`);
  }

  if (idxs.every((idx) => idx === -1)) {
    return {
      aggregates: EMPTY_AGGREGATES,
      methodologicalCautions: buildCautions(EMPTY_AGGREGATES),
      warnings,
    };
  }

  let n = 0, nValid = 0, missing = 0;
  let bimodalSum = 0;
  let nPositive = 0;
  let nScore0to2 = 0, nScore3to6 = 0, nScore7to12 = 0;

  for (let i = 1; i < lines.length; i++) {
    const row = splitRow(lines[i]);
    n++;

    let complete = true;
    let bimodal = 0;
    for (let j = 0; j < 12; j++) {
      const idx = idxs[j];
      const v = idx !== -1 ? parseItem(row[idx]) : null;
      if (v === null) { complete = false; break; }
      bimodal += v >= 2 ? 1 : 0;
    }

    if (!complete) { missing++; continue; }

    nValid++;
    bimodalSum += bimodal;
    if (bimodal >= 3) nPositive++;
    if (bimodal <= 2) nScore0to2++;
    else if (bimodal <= 6) nScore3to6++;
    else nScore7to12++;
  }

  const aggregates: GHQ12Aggregates = {
    n, nValid, missing,
    meanBimodal: nValid > 0 ? Math.round((bimodalSum / nValid) * 100) / 100 : 0,
    nPositive, pctPositive: pct(nPositive, nValid),
    nScore0to2, nScore3to6, nScore7to12,
  };

  return { aggregates, methodologicalCautions: buildCautions(aggregates), warnings };
}
