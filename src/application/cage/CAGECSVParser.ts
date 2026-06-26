import type { CAGEAggregates } from "../../domain/cage";
import { splitRow } from "../csv-utils/splitRow";

// Campos canónicos derivados por la EAS para monitorización del consumo de alcohol.
// COMPÁS NG los consume directamente — no recalcula el CAGE desde ítems individuales.
// CAGE_R es el indicador de riesgo binario (0=No / 1=Sí).
// CAGE clasifica el nivel de consumo en cuatro categorías ordinales (1–4).
// P32D_2023 (ítem AUDIT-C) NO forma parte de este módulo: es un instrumento distinto.
const CAGE_R_FIELD = "CAGE_R";
const CAGE_FIELD = "CAGE";

// Códigos de missing / no procede en EAS
const MISSING_CODES = new Set(["", "991.0", "994.0", "995.0", "996.0", "999.0"]);

const EMPTY_AGGREGATES: CAGEAggregates = {
  n: 0,
  nValidCAGER: 0, missingCAGER: 0, nRisk: 0, pctRisk: 0,
  nValidCAGE: 0, nCAGE1: 0, nCAGE2: 0, nCAGE3: 0, nCAGE4: 0,
};

export interface CAGECSVParseResult {
  aggregates: CAGEAggregates;
  methodologicalCautions: string[];
  warnings: string[];
}

function parseBinary(raw: string | undefined): 0 | 1 | null {
  const t = raw?.trim();
  if (!t || MISSING_CODES.has(t)) return null;
  if (t === "0" || t === "0.0") return 0;
  if (t === "1" || t === "1.0") return 1;
  return null;
}

function parseOrdinal(raw: string | undefined): 1 | 2 | 3 | 4 | null {
  const t = raw?.trim();
  if (!t || MISSING_CODES.has(t)) return null;
  if (t === "1" || t === "1.0") return 1;
  if (t === "2" || t === "2.0") return 2;
  if (t === "3" || t === "3.0") return 3;
  if (t === "4" || t === "4.0") return 4;
  return null;
}

function pct(count: number, total: number): number {
  return total > 0 ? Math.round((count / total) * 1000) / 10 : 0;
}

function buildCautions(aggregates: CAGEAggregates): string[] {
  const cautions = [
    "CAGE_R y CAGE son campos derivados oficiales de la Encuesta Andaluza de Salud (EAS). " +
      "COMPÁS NG los consume directamente sin recalcular el CAGE desde ítems individuales.",
    "El missing en CAGE_R (~18 % en la EAS Granada) es estructural: corresponde a personas abstemias " +
      "a las que el protocolo EAS no administra el test ('No procede'). No es missing aleatorio.",
    "Los ítems de consumo episódico masivo de la EAS (oleada 2023) no forman parte de este análisis. " +
      "Son instrumentos que miden dimensiones distintas del consumo de alcohol.",
    "Los resultados son agregados de la muestra importada y requieren validación técnica " +
      "antes de alimentar interpretación territorial o planificación.",
  ];

  if (aggregates.n === 0) {
    return [
      `CSV vacío o sin registros de datos. Verifica que incluya la columna ${CAGE_R_FIELD}.`,
      ...cautions,
    ];
  }

  if (aggregates.nValidCAGER === 0) {
    cautions.unshift(
      `CSV sin registros válidos en ${CAGE_R_FIELD}. Verifica que la columna contenga valores 0 o 1.`
    );
  } else if (aggregates.nValidCAGER < 30) {
    cautions.push(`Muestra pequeña (${aggregates.nValidCAGER} registros CAGE_R válidos). Interpretar con precaución.`);
  }

  if (aggregates.nValidCAGER > 0 && aggregates.nRisk < 10) {
    cautions.push(
      `Prevalencia de riesgo muy baja (n=${aggregates.nRisk} personas con CAGE_R=1). ` +
        "Los porcentajes deben interpretarse con extrema precaución por el tamaño de celda."
    );
  }

  return cautions;
}

export function parseCAGECSV(csvText: string): CAGECSVParseResult {
  const lines = csvText.split(/\r?\n/).filter((line) => line.trim().length > 0);

  if (lines.length < 2) {
    return {
      aggregates: EMPTY_AGGREGATES,
      methodologicalCautions: buildCautions(EMPTY_AGGREGATES),
      warnings: ["CSV vacío o sin registros de datos."],
    };
  }

  const header = splitRow(lines[0]).map((v) => v.trim());
  const cageRIdx = header.indexOf(CAGE_R_FIELD);
  const cageIdx  = header.indexOf(CAGE_FIELD);

  const warnings: string[] = [];

  if (cageRIdx === -1 && cageIdx === -1) {
    warnings.push(
      `Columnas "${CAGE_R_FIELD}" y "${CAGE_FIELD}" no encontradas. El CSV no contiene datos CAGE-EAS procesables.`
    );
    return { aggregates: EMPTY_AGGREGATES, methodologicalCautions: buildCautions(EMPTY_AGGREGATES), warnings };
  }
  if (cageRIdx === -1) warnings.push(`Columna "${CAGE_R_FIELD}" no encontrada.`);
  if (cageIdx === -1)  warnings.push(`Columna "${CAGE_FIELD}" no encontrada.`);

  let n = 0;
  let nValidCAGER = 0, nRisk = 0;
  let nValidCAGE = 0, nCAGE1 = 0, nCAGE2 = 0, nCAGE3 = 0, nCAGE4 = 0;

  for (let i = 1; i < lines.length; i++) {
    const row = splitRow(lines[i]);
    n++;

    if (cageRIdx !== -1) {
      const v = parseBinary(row[cageRIdx]);
      if (v !== null) { nValidCAGER++; if (v === 1) nRisk++; }
    }

    if (cageIdx !== -1) {
      const v = parseOrdinal(row[cageIdx]);
      if (v !== null) {
        nValidCAGE++;
        if (v === 1) nCAGE1++;
        else if (v === 2) nCAGE2++;
        else if (v === 3) nCAGE3++;
        else if (v === 4) nCAGE4++;
      }
    }
  }

  const aggregates: CAGEAggregates = {
    n,
    nValidCAGER, missingCAGER: n - nValidCAGER,
    nRisk, pctRisk: pct(nRisk, nValidCAGER),
    nValidCAGE, nCAGE1, nCAGE2, nCAGE3, nCAGE4,
  };

  return { aggregates, methodologicalCautions: buildCautions(aggregates), warnings };
}
