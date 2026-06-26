import type {
  DUKEAggregates,
  DUKERowInput,
  DUKERowScores,
} from "../../domain/duke";
import { splitRow } from "../csv-utils/splitRow";
import { getMethodologicalModule } from "../../domain/methodology";

// ── Configuración derivada de DUKE_EAS_MODULE ─────────────────────────────────
// Los campos ITEM_FIELDS, CONF_FIELDS y AFFECT_FIELDS se obtienen del módulo
// metodológico canónico en lugar de estar duplicados aquí.

const _rawDukeModule = getMethodologicalModule("duke-eas");
if (!_rawDukeModule) {
  throw new Error(
    "[DUKECSVParser] Módulo 'duke-eas' no encontrado en el registro metodológico. " +
    "Verifica que DUKE_EAS_MODULE esté registrado en domain/methodology/registry.ts."
  );
}
const _dukeSavAdapter = _rawDukeModule.adapters?.sav;
if (!_dukeSavAdapter) {
  throw new Error(
    "[DUKECSVParser] DUKE_EAS_MODULE no tiene adaptador SAV configurado. " +
    "El parser requiere adapters.sav.variables para mapear item IDs a columnas CSV."
  );
}

// Capturas en scope estrecho (tras los guards) para que TypeScript las conozca como non-null
const dukeDimensions = _rawDukeModule.dimensions;
const savColByItemId = new Map(
  _dukeSavAdapter.variables.map(v => [v.outputField, v.savVariable])
);

// Convierte los itemIds de una dimensión del módulo a los nombres de columna del CSV
function dimToFields(dimensionId: string): readonly (keyof DUKERowInput)[] {
  const dim = dukeDimensions.find(d => d.id === dimensionId);
  if (!dim) {
    throw new Error(
      `[DUKECSVParser] Dimensión "${dimensionId}" no encontrada en DUKE_EAS_MODULE. ` +
      `Dimensiones disponibles: ${dukeDimensions.map(d => d.id).join(", ")}.`
    );
  }
  return dim.itemIds.map(id => {
    const col = savColByItemId.get(id);
    if (!col) {
      throw new Error(
        `[DUKECSVParser] Columna SAV para el ítem "${id}" no encontrada en DUKE_EAS_MODULE.adapters.sav.`
      );
    }
    return col as keyof DUKERowInput;
  });
}

const ITEM_FIELDS   = dimToFields("global");
const CONF_FIELDS   = dimToFields("confidencial");
const AFFECT_FIELDS = dimToFields("afectivo");

// ── Resto del parser (sin cambios lógicos) ────────────────────────────────────

const EMPTY_AGGREGATES: DUKEAggregates = {
  n: 0,
  nValidGlobal: 0,
  nValidConfidential: 0,
  nValidAffective: 0,
  meanGlobal: 0,
  meanConfidential: 0,
  meanAffective: 0,
  lowGlobalCount: 0,
  lowConfidentialCount: 0,
  lowAffectiveCount: 0,
  normalGlobalCount: 0,
  normalConfidentialCount: 0,
  normalAffectiveCount: 0,
  incompleteGlobalCount: 0,
  incompleteConfidentialCount: 0,
  incompleteAffectiveCount: 0,
  lowGlobalPercentage: 0,
  lowConfidentialPercentage: 0,
  lowAffectivePercentage: 0,
};

export interface DUKECSVParseResult {
  aggregates: DUKEAggregates;
  methodologicalCautions: string[];
  warnings: string[];
}

function isValidDUKEResponse(value: unknown): value is 1 | 2 | 3 | 4 | 5 {
  return (
    typeof value === "number" &&
    Number.isInteger(value) &&
    value >= 1 &&
    value <= 5
  );
}

function sumIfComplete(
  input: DUKERowInput,
  fields: readonly (keyof DUKERowInput)[]
): number | null {
  let sum = 0;
  for (const field of fields) {
    const value = input[field];
    if (!isValidDUKEResponse(value)) return null;
    sum += value;
  }
  return sum;
}

export function calculateDUKEScores(input: DUKERowInput): DUKERowScores {
  const dukeGLOBAL = sumIfComplete(input, ITEM_FIELDS);
  const dukeCONF = sumIfComplete(input, CONF_FIELDS);
  const dukeAFECT = sumIfComplete(input, AFFECT_FIELDS);

  return {
    dukeGLOBAL,
    dukeCONF,
    dukeAFECT,
    P57GLOBAL_R:
      dukeGLOBAL === null ? 993 : dukeGLOBAL === 55 ? 0 : 1,
    P57_AC_R:
      dukeCONF === null ? 993 : dukeCONF === 35 ? 0 : 1,
    P57_AF_R:
      dukeAFECT === null ? 993 : dukeAFECT === 20 ? 0 : 1,
  };
}

function parseDUKEValue(raw: string | undefined): number | null {
  const trimmed = raw?.trim();
  if (!trimmed) return null;
  const value = Number(trimmed.replace(",", "."));
  return isValidDUKEResponse(value) ? value : null;
}

function readDUKERow(
  row: string[],
  indexes: Record<string, number>
): DUKERowInput {
  return ITEM_FIELDS.reduce<DUKERowInput>((acc, field) => {
    const index = indexes[field];
    acc[field] = index === -1 ? null : parseDUKEValue(row[index]);
    return acc;
  }, {});
}

function percentage(count: number, denominator: number): number {
  return denominator > 0 ? Math.round((count / denominator) * 1000) / 10 : 0;
}

function mean(sum: number, denominator: number): number {
  return denominator > 0 ? Math.round((sum / denominator) * 10) / 10 : 0;
}

function buildCautions(aggregates: DUKEAggregates): string[] {
  const cautions = [
    "DUKE-EAS: recodificacion reconstruida empiricamente desde los microdatos EAS disponibles con reproduccion 100 %. No se presenta como criterio clinico universal.",
    "Los resultados son agregados de la muestra importada y requieren validacion tecnica antes de alimentar interpretacion territorial o planificacion.",
  ];

  if (aggregates.n === 0) {
    return [
      "CSV vacio o sin registros de datos. Verifica el formato y las columnas EAS P5701..P5711.",
      ...cautions,
    ];
  }

  if (aggregates.nValidGlobal === 0) {
    cautions.unshift(
      "CSV sin registros DUKE completos para la escala global. Verifica el formato y los valores validos 1..5."
    );
  } else if (aggregates.nValidGlobal < 30) {
    cautions.push(
      `Muestra pequena (${aggregates.nValidGlobal} registros globales validos). Interpretar con precaucion.`
    );
  }

  const incompleteRate =
    aggregates.n > 0 ? (aggregates.incompleteGlobalCount / aggregates.n) * 100 : 0;
  if (incompleteRate > 10) {
    cautions.push(
      `${incompleteRate.toFixed(1)} % de registros con DUKE global incompleto/no calculable. Posible sesgo de no respuesta.`
    );
  }

  return cautions;
}

export function parseDUKECSV(csvText: string): DUKECSVParseResult {
  const lines = csvText.split(/\r?\n/).filter((line) => line.trim().length > 0);

  if (lines.length < 2) {
    return {
      aggregates: EMPTY_AGGREGATES,
      methodologicalCautions: buildCautions(EMPTY_AGGREGATES),
      warnings: ["CSV vacio o sin registros de datos."],
    };
  }

  const header = splitRow(lines[0]).map((value) => value.trim());

  const indexes: Record<string, number> = {};
  for (const field of ITEM_FIELDS) {
    indexes[field] = header.indexOf(field);
  }

  const missing = ITEM_FIELDS.filter((field) => indexes[field] === -1);
  const warnings =
    missing.length > 0
      ? [`Columnas DUKE-EAS no encontradas: ${missing.join(", ")}.`]
      : [];

  let n = 0;
  let nValidGlobal = 0;
  let nValidConfidential = 0;
  let nValidAffective = 0;
  let sumGlobal = 0;
  let sumConfidential = 0;
  let sumAffective = 0;
  let lowGlobalCount = 0;
  let lowConfidentialCount = 0;
  let lowAffectiveCount = 0;
  let normalGlobalCount = 0;
  let normalConfidentialCount = 0;
  let normalAffectiveCount = 0;
  let incompleteGlobalCount = 0;
  let incompleteConfidentialCount = 0;
  let incompleteAffectiveCount = 0;

  for (let i = 1; i < lines.length; i++) {
    const row = splitRow(lines[i]);
    const scores = calculateDUKEScores(readDUKERow(row, indexes));
    n++;

    if (scores.dukeGLOBAL === null) {
      incompleteGlobalCount++;
    } else {
      nValidGlobal++;
      sumGlobal += scores.dukeGLOBAL;
      if (scores.P57GLOBAL_R === 1) lowGlobalCount++;
      if (scores.P57GLOBAL_R === 0) normalGlobalCount++;
    }

    if (scores.dukeCONF === null) {
      incompleteConfidentialCount++;
    } else {
      nValidConfidential++;
      sumConfidential += scores.dukeCONF;
      if (scores.P57_AC_R === 1) lowConfidentialCount++;
      if (scores.P57_AC_R === 0) normalConfidentialCount++;
    }

    if (scores.dukeAFECT === null) {
      incompleteAffectiveCount++;
    } else {
      nValidAffective++;
      sumAffective += scores.dukeAFECT;
      if (scores.P57_AF_R === 1) lowAffectiveCount++;
      if (scores.P57_AF_R === 0) normalAffectiveCount++;
    }
  }

  const aggregates: DUKEAggregates = {
    n,
    nValidGlobal,
    nValidConfidential,
    nValidAffective,
    meanGlobal: mean(sumGlobal, nValidGlobal),
    meanConfidential: mean(sumConfidential, nValidConfidential),
    meanAffective: mean(sumAffective, nValidAffective),
    lowGlobalCount,
    lowConfidentialCount,
    lowAffectiveCount,
    normalGlobalCount,
    normalConfidentialCount,
    normalAffectiveCount,
    incompleteGlobalCount,
    incompleteConfidentialCount,
    incompleteAffectiveCount,
    lowGlobalPercentage: percentage(lowGlobalCount, nValidGlobal),
    lowConfidentialPercentage: percentage(lowConfidentialCount, nValidConfidential),
    lowAffectivePercentage: percentage(lowAffectiveCount, nValidAffective),
  };

  return {
    aggregates,
    methodologicalCautions: buildCautions(aggregates),
    warnings,
  };
}
