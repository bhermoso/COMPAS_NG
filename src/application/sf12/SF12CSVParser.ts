import type { SF12Aggregates } from "../../domain/sf12";
import { splitRow } from "../csv-utils/splitRow";

// Campos canónicos pre-calculados por la EAS (Vilagut et al. 2008).
// COMPÁS NG los consume directamente — no recalcula PCS/MCS desde los 12 ítems.
const PCS_FIELD = "PCS12_SP";
const MCS_FIELD = "MCS12_SP";

const EMPTY_AGGREGATES: SF12Aggregates = {
  n: 0,
  nValidPCS: 0,
  nValidMCS: 0,
  meanPCS: 0,
  meanMCS: 0,
  missingPCS: 0,
  missingMCS: 0,
};

export interface SF12CSVParseResult {
  aggregates: SF12Aggregates;
  methodologicalCautions: string[];
  warnings: string[];
}

function parseNumeric(raw: string | undefined): number | null {
  const trimmed = raw?.trim();
  if (!trimmed || trimmed === "" || trimmed === "." || trimmed.toLowerCase() === "na") return null;
  const value = Number(trimmed.replace(",", "."));
  return Number.isFinite(value) ? value : null;
}

function mean3(sum: number, n: number): number {
  return n > 0 ? Math.round((sum / n) * 1000) / 1000 : 0;
}

function buildCautions(aggregates: SF12Aggregates): string[] {
  const cautions = [
    "PCS12_SP y MCS12_SP son puntuaciones canónicas pre-calculadas por la Encuesta Andaluza de Salud " +
      "aplicando los coeficientes factoriales de la norma española (Vilagut et al. 2008, Med Clín Barc 130(19):726-735). " +
      "COMPÁS NG las consume directamente; no recalcula PCS ni MCS desde los 12 ítems.",
    "Las puntuaciones están en escala 0-100 (media poblacional española ≈ 50, DT ≈ 10). " +
      "Mayor puntuación indica mejor estado de salud percibida en el componente correspondiente.",
    "Los resultados son agregados de la muestra importada y requieren validación técnica " +
      "antes de alimentar interpretación territorial o planificación.",
  ];

  if (aggregates.n === 0) {
    return [
      "CSV vacío o sin registros de datos. Verifica que incluya las columnas PCS12_SP y MCS12_SP.",
      ...cautions,
    ];
  }

  if (aggregates.nValidPCS === 0 && aggregates.nValidMCS === 0) {
    cautions.unshift(
      "CSV sin registros SF-12 válidos. Verifica que las columnas PCS12_SP y MCS12_SP contengan valores numéricos."
    );
  } else if (aggregates.nValidPCS < 30) {
    cautions.push(
      `Muestra pequeña (${aggregates.nValidPCS} registros válidos). Interpretar con precaución.`
    );
  }

  const missingRate = aggregates.n > 0 ? (aggregates.missingPCS / aggregates.n) * 100 : 0;
  if (missingRate > 5) {
    cautions.push(
      `${missingRate.toFixed(1)} % de registros sin puntuación PCS/MCS calculable.`
    );
  }

  return cautions;
}

export function parseSF12CSV(csvText: string): SF12CSVParseResult {
  const lines = csvText.split(/\r?\n/).filter((line) => line.trim().length > 0);

  if (lines.length < 2) {
    return {
      aggregates: EMPTY_AGGREGATES,
      methodologicalCautions: buildCautions(EMPTY_AGGREGATES),
      warnings: ["CSV vacío o sin registros de datos."],
    };
  }

  const header = splitRow(lines[0]).map((v) => v.trim());
  const pcsIdx = header.indexOf(PCS_FIELD);
  const mcsIdx = header.indexOf(MCS_FIELD);

  const warnings: string[] = [];

  if (pcsIdx === -1 && mcsIdx === -1) {
    warnings.push(
      `Columnas "${PCS_FIELD}" y "${MCS_FIELD}" no encontradas. ` +
        "El CSV no contiene datos SF-12 procesables."
    );
    return {
      aggregates: EMPTY_AGGREGATES,
      methodologicalCautions: buildCautions(EMPTY_AGGREGATES),
      warnings,
    };
  }

  if (pcsIdx === -1) warnings.push(`Columna "${PCS_FIELD}" no encontrada.`);
  if (mcsIdx === -1) warnings.push(`Columna "${MCS_FIELD}" no encontrada.`);

  let n = 0;
  let sumPCS = 0;
  let nValidPCS = 0;
  let sumMCS = 0;
  let nValidMCS = 0;

  for (let i = 1; i < lines.length; i++) {
    const row = splitRow(lines[i]);
    n++;

    if (pcsIdx !== -1) {
      const v = parseNumeric(row[pcsIdx]);
      if (v !== null) { nValidPCS++; sumPCS += v; }
    }

    if (mcsIdx !== -1) {
      const v = parseNumeric(row[mcsIdx]);
      if (v !== null) { nValidMCS++; sumMCS += v; }
    }
  }

  const aggregates: SF12Aggregates = {
    n,
    nValidPCS,
    nValidMCS,
    meanPCS: mean3(sumPCS, nValidPCS),
    meanMCS: mean3(sumMCS, nValidMCS),
    missingPCS: n - nValidPCS,
    missingMCS: n - nValidMCS,
  };

  return {
    aggregates,
    methodologicalCautions: buildCautions(aggregates),
    warnings,
  };
}
