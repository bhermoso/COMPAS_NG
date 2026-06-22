import type { IBSEAggregates } from "../../domain/ibse";
import { IBSE_MODULE } from "../../domain/methodology";
import { splitRow } from "../csv-utils/splitRow";

const redcapAdapter = IBSE_MODULE.adapters!.redcap!;
const colByField = new Map(redcapAdapter.columns.map((c) => [c.outputField, c.redcapColumn]));

const COLS = {
  total:           colByField.get("meanTotal")!,
  factorVinculo:   colByField.get("meanFactorVinculo")!,
  factorSituacion: colByField.get("meanFactorSituacion")!,
  factorControl:   colByField.get("meanFactorControl")!,
  factorPersona:   colByField.get("meanFactorPersona")!,
  completed:       redcapAdapter.completedColumn,
  completedValue:  redcapAdapter.completedValue,
};

const EMPTY_AGGREGATES: IBSEAggregates = {
  n: 0,
  nValid: 0,
  meanTotal: 0,
  meanFactorVinculo: 0,
  meanFactorSituacion: 0,
  meanFactorControl: 0,
  meanFactorPersona: 0,
};

export interface IBSECSVParseResult {
  aggregates: IBSEAggregates;
  methodologicalCautions: string[];
  warnings: string[];
}

export function parseIBSECSV(csvText: string): IBSECSVParseResult {
  const lines = csvText.split(/\r?\n/).filter((l) => l.trim().length > 0);

  if (lines.length < 2) {
    return {
      aggregates: EMPTY_AGGREGATES,
      methodologicalCautions: ["CSV vacío o sin registros de datos. Verifica el formato y las columnas esperadas."],
      warnings: ["CSV vacío o sin registros de datos."],
    };
  }

  const warnings: string[] = [];
  const header = splitRow(lines[0]);

  const idx = {
    total:           header.indexOf(COLS.total),
    factorVinculo:   header.indexOf(COLS.factorVinculo),
    factorSituacion: header.indexOf(COLS.factorSituacion),
    factorControl:   header.indexOf(COLS.factorControl),
    factorPersona:   header.indexOf(COLS.factorPersona),
    completed:       header.indexOf(COLS.completed),
  };

  const missing = Object.entries(idx)
    .filter(([, v]) => v === -1)
    .map(([k]) => k);

  if (missing.length > 0) {
    warnings.push(`Columnas no encontradas: ${missing.join(", ")}.`);
  }

  let n = 0;
  let nValid = 0;
  let sumTotal = 0;
  let sumVinculo = 0;
  let sumSituacion = 0;
  let sumControl = 0;
  let sumPersona = 0;

  for (let i = 1; i < lines.length; i++) {
    const row = splitRow(lines[i]);
    n++;

    if (idx.completed !== -1 && row[idx.completed] !== COLS.completedValue) {
      continue;
    }

    const total     = parseFloat(row[idx.total]           ?? "");
    const vinculo   = parseFloat(row[idx.factorVinculo]   ?? "");
    const situacion = parseFloat(row[idx.factorSituacion] ?? "");
    const control   = parseFloat(row[idx.factorControl]   ?? "");
    const persona   = parseFloat(row[idx.factorPersona]   ?? "");

    if (
      isNaN(total) || isNaN(vinculo) ||
      isNaN(situacion) || isNaN(control) || isNaN(persona)
    ) {
      continue;
    }

    nValid++;
    sumTotal     += total;
    sumVinculo   += vinculo;
    sumSituacion += situacion;
    sumControl   += control;
    sumPersona   += persona;
  }

  const avg = (sum: number): number =>
    nValid > 0 ? Math.round((sum / nValid) * 10) / 10 : 0;

  const cautions: string[] = [];

  if (nValid === 0) {
    cautions.push("CSV sin registros válidos. Verifica el formato y las columnas esperadas.");
  } else {
    if (nValid < 30) {
      cautions.push(`Muestra pequeña (${nValid} registros válidos). Interpretar con precaución.`);
    }
    const incompleteRate = n > 0 ? ((n - nValid) / n) * 100 : 0;
    if (incompleteRate > 10) {
      cautions.push(
        `${incompleteRate.toFixed(1)} % de registros excluidos por incompletos. Posible sesgo de no respuesta.`
      );
    }
    cautions.push("Los resultados son medias de la muestra disponible, no estimaciones poblacionales.");
  }

  return {
    aggregates: {
      n,
      nValid,
      meanTotal:           avg(sumTotal),
      meanFactorVinculo:   avg(sumVinculo),
      meanFactorSituacion: avg(sumSituacion),
      meanFactorControl:   avg(sumControl),
      meanFactorPersona:   avg(sumPersona),
    },
    methodologicalCautions: cautions,
    warnings,
  };
}
