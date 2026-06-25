import type { PREDIMEDAggregates } from "../../domain/predimed";
import { splitRow } from "../csv-utils/splitRow";

// Columna canónica derivada EAS. Cuando está presente, es el valor oficial.
const CANONICAL_FIELD = "Predimed";

// Ítems brutos EAS 2023. Se usan como fallback cuando no existe el campo derivado.
const ITEM_FIELDS = [
  "P36BPD01_2023",
  "P36BPD02_2023",
  "P36BPD03_2023",
  "P36BPD04_2023",
  "P36BPD05_2023",
  "P36BPD06_2023",
  "P36BPD07_2023",
  "P36BPD08_2023",
  "P36BPD09_2023",
  "P36BPD10_2023",
  "P36BPD11_2023",
  "P36BPD12_2023",
  "P36BPD13_2023",
  "P36BPD14_2023",
] as const;

const EMPTY_AGGREGATES: PREDIMEDAggregates = {
  n: 0,
  nValid: 0,
  meanScore: 0,
  lowCount: 0,
  mediumCount: 0,
  highCount: 0,
  lowPercentage: 0,
  mediumPercentage: 0,
  highPercentage: 0,
  incompleteCount: 0,
};

export interface PREDIMEDCSVParseResult {
  aggregates: PREDIMEDAggregates;
  methodologicalCautions: string[];
  warnings: string[];
}

function isValidScore(value: number): boolean {
  return Number.isFinite(value) && value >= 0 && value <= 14;
}

function parseNumeric(raw: string | undefined): number | null {
  const trimmed = raw?.trim();
  if (!trimmed || trimmed === "" || trimmed === "." || trimmed.toLowerCase() === "na") return null;
  const value = Number(trimmed.replace(",", "."));
  return Number.isFinite(value) ? value : null;
}

function sumFromItems(
  row: string[],
  indexes: Record<string, number>
): number | null {
  let sum = 0;
  for (const field of ITEM_FIELDS) {
    const idx = indexes[field];
    if (idx === undefined || idx === -1) return null;
    const raw = row[idx];
    const v = parseNumeric(raw);
    if (v === null) return null;
    // Ítems PREDIMED son 0 o 1
    if (v !== 0 && v !== 1) return null;
    sum += v;
  }
  return sum;
}

function percentage(count: number, denominator: number): number {
  return denominator > 0 ? Math.round((count / denominator) * 1000) / 10 : 0;
}

function mean(sum: number, denominator: number): number {
  return denominator > 0 ? Math.round((sum / denominator) * 10) / 10 : 0;
}

function buildCautions(
  aggregates: PREDIMEDAggregates,
  usedCanonical: boolean
): string[] {
  const source = usedCanonical
    ? "Puntuacion canonica obtenida del campo derivado EAS (Predimed). No se recalcula el indice."
    : "Puntuacion calculada sumando los 14 items P36BPD01..P36BPD14_2023. El item P36BPD07 (vino) no lleva correccion por sexo en este modo; usar el campo Predimed canonico cuando este disponible.";

  const cautions = [
    source,
    "PREDIMED-14: adherencia baja <= 6, media 7-8, alta >= 9. Corte segun Martinez-Gonzalez (2012), adaptacion EAS Andalucia.",
    "Los resultados son agregados de la muestra importada y requieren validacion tecnica antes de alimentar interpretacion territorial o planificacion.",
  ];

  if (aggregates.n === 0) {
    return [
      "CSV vacio o sin registros de datos. Verifica el formato y la columna Predimed o P36BPD01..P36BPD14_2023.",
      ...cautions,
    ];
  }

  if (aggregates.nValid === 0) {
    cautions.unshift(
      "CSV sin registros PREDIMED completos. Verifica el formato y los valores validos 0..14."
    );
  } else if (aggregates.nValid < 30) {
    cautions.push(
      `Muestra pequena (${aggregates.nValid} registros validos). Interpretar con precaucion.`
    );
  }

  const incompleteRate =
    aggregates.n > 0 ? (aggregates.incompleteCount / aggregates.n) * 100 : 0;
  if (incompleteRate > 10) {
    cautions.push(
      `${incompleteRate.toFixed(1)} % de registros sin puntuacion PREDIMED calculable. Posible sesgo de no respuesta.`
    );
  }

  return cautions;
}

export function parsePREDIMEDCSV(csvText: string): PREDIMEDCSVParseResult {
  const lines = csvText.split(/\r?\n/).filter((line) => line.trim().length > 0);

  if (lines.length < 2) {
    return {
      aggregates: EMPTY_AGGREGATES,
      methodologicalCautions: buildCautions(EMPTY_AGGREGATES, false),
      warnings: ["CSV vacio o sin registros de datos."],
    };
  }

  const header = splitRow(lines[0]).map((v) => v.trim());
  const canonicalIndex = header.indexOf(CANONICAL_FIELD);
  const usedCanonical = canonicalIndex !== -1;

  // Índices de ítems brutos (solo necesarios si no hay columna canónica)
  const itemIndexes: Record<string, number> = {};
  for (const field of ITEM_FIELDS) {
    itemIndexes[field] = header.indexOf(field);
  }

  const missingItems = usedCanonical
    ? []
    : ITEM_FIELDS.filter((f) => itemIndexes[f] === -1);

  const warnings: string[] = [];
  if (!usedCanonical && missingItems.length > 0) {
    warnings.push(
      `Columna "${CANONICAL_FIELD}" no encontrada. ` +
      `Columnas de items faltantes: ${missingItems.join(", ")}.`
    );
  }

  let n = 0;
  let nValid = 0;
  let sumScore = 0;
  let lowCount = 0;
  let mediumCount = 0;
  let highCount = 0;
  let incompleteCount = 0;

  for (let i = 1; i < lines.length; i++) {
    const row = splitRow(lines[i]);
    n++;

    let score: number | null = null;

    if (usedCanonical) {
      const raw = row[canonicalIndex];
      const v = parseNumeric(raw);
      if (v !== null && isValidScore(v)) {
        score = Math.round(v);
      }
    } else {
      const computed = sumFromItems(row, itemIndexes);
      if (computed !== null) {
        score = computed;
      }
    }

    if (score === null) {
      incompleteCount++;
    } else {
      nValid++;
      sumScore += score;
      if (score <= 6) lowCount++;
      else if (score <= 8) mediumCount++;
      else highCount++;
    }
  }

  const aggregates: PREDIMEDAggregates = {
    n,
    nValid,
    meanScore: mean(sumScore, nValid),
    lowCount,
    mediumCount,
    highCount,
    lowPercentage: percentage(lowCount, nValid),
    mediumPercentage: percentage(mediumCount, nValid),
    highPercentage: percentage(highCount, nValid),
    incompleteCount,
  };

  return {
    aggregates,
    methodologicalCautions: buildCautions(aggregates, usedCanonical),
    warnings,
  };
}
