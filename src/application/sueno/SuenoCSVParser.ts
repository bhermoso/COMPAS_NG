import type { SuenoAggregates } from "../../domain/sueno";
import { splitRow } from "../csv-utils/splitRow";

// Campos canónicos derivados por la EAS para monitorización del sueño.
// COMPÁS NG los consume directamente — no reconstruye ningún índice desde ítems.
// P33_R mide CANTIDAD (horas vs. recomendación SES); P33A mide CALIDAD subjetiva.
// Son dimensiones independientes: se espera ~29 % de discordancia entre ambas.
const P33R_FIELD = "P33_R";
const P33A_FIELD = "P33A";

const EMPTY_AGGREGATES: SuenoAggregates = {
  n: 0,
  nValidP33R: 0, missingP33R: 0, nInsufficientSleep: 0, pctInsufficientSleep: 0,
  nValidP33A: 0, missingP33A: 0, nNoRest: 0, pctNoRest: 0,
};

export interface SuenoCSVParseResult {
  aggregates: SuenoAggregates;
  methodologicalCautions: string[];
  warnings: string[];
}

function parseBinary(raw: string | undefined): 0 | 1 | null {
  const t = raw?.trim();
  if (!t) return null;
  if (t === "0" || t === "0.0") return 0;
  if (t === "1" || t === "1.0") return 1;
  return null;
}

function pct(count: number, total: number): number {
  return total > 0 ? Math.round((count / total) * 1000) / 10 : 0;
}

function buildCautions(aggregates: SuenoAggregates): string[] {
  const cautions = [
    "P33_R y P33A son campos derivados oficiales de la Encuesta Andaluza de Salud (EAS). " +
      "P33_R clasifica si la persona duerme las horas recomendadas por la Sociedad Española del Sueño. " +
      "P33A recoge si las horas dormidas permiten descansar suficiente (calidad subjetiva). " +
      "Son dimensiones independientes: no deben sumarse ni compararse directamente.",
    "P33_R y P33A son indicadores propios de la Encuesta Andaluza de Salud (EAS) para " +
      "monitorización del sueño en la población andaluza. No son escalas validadas externamente.",
    "Se espera una discordancia del ~29 % entre P33_R y P33A en la muestra EAS, " +
      "lo que es estadísticamente coherente con la literatura del sueño.",
    "Los resultados son agregados de la muestra importada y requieren validación técnica " +
      "antes de alimentar interpretación territorial o planificación.",
  ];

  if (aggregates.n === 0) {
    return [
      `CSV vacío o sin registros de datos. Verifica que incluya las columnas ${P33R_FIELD} y ${P33A_FIELD}.`,
      ...cautions,
    ];
  }

  if (aggregates.nValidP33R === 0) {
    cautions.unshift(
      `CSV sin registros válidos en ${P33R_FIELD}. Verifica que la columna contenga valores 0 o 1.`
    );
  } else if (aggregates.nValidP33R < 30) {
    cautions.push(`Muestra pequeña (${aggregates.nValidP33R} registros P33_R válidos). Interpretar con precaución.`);
  }

  if (aggregates.nValidP33R > 0) {
    const missingRate = (aggregates.missingP33R / aggregates.n) * 100;
    if (missingRate > 5) {
      cautions.push(
        `${missingRate.toFixed(1)} % de registros sin valor en P33_R (missing estructural por oleadas EAS).`
      );
    }
  }

  if (aggregates.nValidP33A === 0 && aggregates.nValidP33R > 0) {
    cautions.push(`Sin registros válidos en ${P33A_FIELD}. El indicador de calidad subjetiva no está disponible.`);
  }

  return cautions;
}

export function parseSuenoCSV(csvText: string): SuenoCSVParseResult {
  const lines = csvText.split(/\r?\n/).filter((line) => line.trim().length > 0);

  if (lines.length < 2) {
    return {
      aggregates: EMPTY_AGGREGATES,
      methodologicalCautions: buildCautions(EMPTY_AGGREGATES),
      warnings: ["CSV vacío o sin registros de datos."],
    };
  }

  const header = splitRow(lines[0]).map((v) => v.trim());
  const p33rIdx = header.indexOf(P33R_FIELD);
  const p33aIdx = header.indexOf(P33A_FIELD);

  const warnings: string[] = [];

  if (p33rIdx === -1 && p33aIdx === -1) {
    warnings.push(
      `Columnas "${P33R_FIELD}" y "${P33A_FIELD}" no encontradas. El CSV no contiene datos de Sueño EAS procesables.`
    );
    return { aggregates: EMPTY_AGGREGATES, methodologicalCautions: buildCautions(EMPTY_AGGREGATES), warnings };
  }
  if (p33rIdx === -1) warnings.push(`Columna "${P33R_FIELD}" no encontrada.`);
  if (p33aIdx === -1) warnings.push(`Columna "${P33A_FIELD}" no encontrada.`);

  let n = 0;
  let nValidP33R = 0, nInsufficientSleep = 0;
  let nValidP33A = 0, nNoRest = 0;

  for (let i = 1; i < lines.length; i++) {
    const row = splitRow(lines[i]);
    n++;

    if (p33rIdx !== -1) {
      const v = parseBinary(row[p33rIdx]);
      if (v !== null) { nValidP33R++; if (v === 1) nInsufficientSleep++; }
    }

    if (p33aIdx !== -1) {
      const v = parseBinary(row[p33aIdx]);
      if (v !== null) { nValidP33A++; if (v === 0) nNoRest++; }
    }
  }

  const aggregates: SuenoAggregates = {
    n,
    nValidP33R, missingP33R: n - nValidP33R,
    nInsufficientSleep, pctInsufficientSleep: pct(nInsufficientSleep, nValidP33R),
    nValidP33A, missingP33A: n - nValidP33A,
    nNoRest, pctNoRest: pct(nNoRest, nValidP33A),
  };

  return { aggregates, methodologicalCautions: buildCautions(aggregates), warnings };
}
