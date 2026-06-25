import type { PREDIMEDAggregates } from "../../domain/predimed";
import { splitRow } from "../csv-utils/splitRow";

// Columna canónica derivada EAS. Obligatoria para calcular la puntuación.
const CANONICAL_FIELD = "Predimed";

// Ítems brutos EAS 2023. Reconocidos para trazabilidad, no para cómputo.
// Empíricamente verificado (fixture Granada, 712 registros): los ítems P36BPD
// usan códigos de respuesta (1/2/3/4), no valores binarios (0/1). La suma
// directa de ítems no reproduce el índice Predimed. El campo canónico
// (Predimed) incorpora la recodificación per-ítem aplicada por el equipo EAS.
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

function percentage(count: number, denominator: number): number {
  return denominator > 0 ? Math.round((count / denominator) * 1000) / 10 : 0;
}

function mean(sum: number, denominator: number): number {
  return denominator > 0 ? Math.round((sum / denominator) * 10) / 10 : 0;
}

function buildCautions(aggregates: PREDIMEDAggregates): string[] {
  const cautions = [
    "Puntuacion canonica obtenida del campo derivado EAS (Predimed). No se recalcula el indice.",
    "PREDIMED-14: adherencia baja <= 6, media 7-8, alta >= 9. Corte segun Martinez-Gonzalez (2012), adaptacion EAS Andalucia.",
    "Los resultados son agregados de la muestra importada y requieren validacion tecnica antes de alimentar interpretacion territorial o planificacion.",
  ];

  if (aggregates.n === 0) {
    return [
      "CSV vacio o sin registros de datos. Verifica el formato y la columna Predimed.",
      ...cautions,
    ];
  }

  if (aggregates.nValid === 0) {
    cautions.unshift(
      "CSV sin registros PREDIMED completos. Verifica el formato y los valores validos (0..14) de la columna Predimed."
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
      `${incompleteRate.toFixed(1)} % de registros sin puntuacion Predimed calculable. ` +
      `En los microdatos EAS READY, Predimed solo se calcula para registros de oleadas que incluyen el modulo PREDIMED-14.`
    );
  }

  return cautions;
}

export function parsePREDIMEDCSV(csvText: string): PREDIMEDCSVParseResult {
  const lines = csvText.split(/\r?\n/).filter((line) => line.trim().length > 0);

  if (lines.length < 2) {
    return {
      aggregates: EMPTY_AGGREGATES,
      methodologicalCautions: buildCautions(EMPTY_AGGREGATES),
      warnings: ["CSV vacio o sin registros de datos."],
    };
  }

  const header = splitRow(lines[0]).map((v) => v.trim());
  const canonicalIndex = header.indexOf(CANONICAL_FIELD);
  const usedCanonical = canonicalIndex !== -1;

  const warnings: string[] = [];

  if (!usedCanonical) {
    const itemsPresent = ITEM_FIELDS.filter(
      (f) => header.indexOf(f) !== -1
    );
    if (itemsPresent.length > 0) {
      warnings.push(
        `Columna "${CANONICAL_FIELD}" no encontrada. ` +
        `Se detectan ${itemsPresent.length} columnas de items P36BPD. ` +
        `Los items P36BPD del fichero EAS READY usan codigos de respuesta (1/2/3/4), no valores binarios: ` +
        `la suma directa de items no reproduce el indice Predimed. ` +
        `Carga un CSV que incluya la columna "${CANONICAL_FIELD}" (campo canonico derivado EAS).`
      );
    } else {
      warnings.push(
        `Columna "${CANONICAL_FIELD}" no encontrada. ` +
        `Tampoco se detectan columnas de items P36BPD01..P36BPD14_2023. ` +
        `El CSV no contiene datos PREDIMED procesables.`
      );
    }
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

    if (!usedCanonical) {
      incompleteCount++;
      continue;
    }

    const raw = row[canonicalIndex];
    const v = parseNumeric(raw);
    const score = v !== null && isValidScore(v) ? Math.round(v) : null;

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
    methodologicalCautions: buildCautions(aggregates),
    warnings,
  };
}
