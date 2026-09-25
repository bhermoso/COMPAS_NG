import type { IPAQAggregates } from "../../domain/ipaq";
import { splitRow } from "../csv-utils/splitRow";
import { getMethodologicalModule } from "../../domain/methodology";

// ── Configuración derivada de IPAQ_EAS_MODULE ─────────────────────────────────
// Los campos canónicos se obtienen del módulo metodológico en lugar de estar
// duplicados aquí. El módulo mapea outputField → savVariable (columna CSV).

const _rawIpaqModule = getMethodologicalModule("ipaq-eas");
if (!_rawIpaqModule) {
  throw new Error(
    "[IPAQCSVParser] Módulo 'ipaq-eas' no encontrado en el registro metodológico. " +
    "Verifica que IPAQ_EAS_MODULE esté registrado en domain/methodology/registry.ts."
  );
}
const _ipaqSavAdapter = _rawIpaqModule.adapters?.sav;
if (!_ipaqSavAdapter) {
  throw new Error(
    "[IPAQCSVParser] IPAQ_EAS_MODULE no tiene adaptador SAV configurado. " +
    "El parser requiere adapters.sav.variables con outputField 'actividad-alta' y 'inactividad-ocio'."
  );
}

const _actividadVar = _ipaqSavAdapter.variables.find(v => v.outputField === "actividad-alta");
if (!_actividadVar) {
  throw new Error(
    "[IPAQCSVParser] Variable 'actividad-alta' no encontrada en IPAQ_EAS_MODULE.adapters.sav. " +
    "El módulo debe declarar una entrada con outputField='actividad-alta' y savVariable='IPAQ_DICO'."
  );
}
const _inactividadVar = _ipaqSavAdapter.variables.find(v => v.outputField === "inactividad-ocio");
if (!_inactividadVar) {
  throw new Error(
    "[IPAQCSVParser] Variable 'inactividad-ocio' no encontrada en IPAQ_EAS_MODULE.adapters.sav. " +
    "El módulo debe declarar una entrada con outputField='inactividad-ocio' y savVariable='P34A_R'."
  );
}

const IPAQ_DICO_FIELD = _actividadVar.savVariable;    // "IPAQ_DICO"
const P34A_R_FIELD = _inactividadVar.savVariable;     // "P34A_R"

const EMPTY_AGGREGATES: IPAQAggregates = {
  n: 0,
  nValidIPAQ: 0, missingIPAQ: 0, nHigh: 0, pctHigh: 0,
  nValidP34AR: 0, missingP34AR: 0, nInactive: 0, pctInactive: 0,
};

export interface IPAQCSVParseResult {
  aggregates: IPAQAggregates;
  methodologicalCautions: string[];
  warnings: string[];
}

function parseBinary(raw: string | undefined): 0 | 1 | null {
  const t = raw?.trim();
  if (!t || t === "") return null;
  if (t === "0" || t === "0.0") return 0;
  if (t === "1" || t === "1.0") return 1;
  return null;
}

function pct(count: number, total: number): number {
  return total > 0 ? Math.round((count / total) * 1000) / 10 : 0;
}

function buildCautions(aggregates: IPAQAggregates): string[] {
  const cautions = [
    "IPAQ_DICO y P34A_R son campos derivados oficiales de la Encuesta Andaluza de Salud (EAS). " +
      "COMPÁS NG los consume directamente sin recalcular los MET-min/semana desde ítems individuales.",
    "El missing en IPAQ_DICO (~48 % en la EAS Granada) es sustancial y puede reflejar " +
      "personas mayores u otros grupos no evaluados. No es necesariamente missing aleatorio.",
    "IPAQ_DICO = 0 incluye tanto actividad física baja como moderada: " +
      "no equivale a sedentarismo total. Para sedentarismo específico, usar el SBQ.",
    "P34A_R solo evalúa la inactividad en tiempo libre, no la actividad laboral ni doméstica.",
    "Los resultados son agregados de la muestra importada y requieren validación técnica " +
      "antes de alimentar interpretación territorial o planificación.",
  ];

  if (aggregates.n === 0) {
    return [
      `CSV vacío o sin registros de datos. Verifica que incluya la columna ${IPAQ_DICO_FIELD}.`,
      ...cautions,
    ];
  }

  if (aggregates.nValidIPAQ === 0) {
    cautions.unshift(
      `CSV sin registros válidos en ${IPAQ_DICO_FIELD}. Verifica que la columna contenga valores 0 o 1.`
    );
  } else if (aggregates.nValidIPAQ < 30) {
    cautions.push(`Muestra pequeña (${aggregates.nValidIPAQ} registros IPAQ_DICO válidos). Interpretar con precaución.`);
  }

  if (aggregates.nValidIPAQ > 0 && aggregates.nHigh < 10) {
    cautions.push(
      `Prevalencia de alta actividad muy baja (n=${aggregates.nHigh} personas con IPAQ_DICO=1). ` +
        "Los porcentajes deben interpretarse con extrema precaución por el tamaño de celda."
    );
  }

  return cautions;
}

export function parseIPAQCSV(csvText: string): IPAQCSVParseResult {
  const lines = csvText.split(/\r?\n/).filter((line) => line.trim().length > 0);

  if (lines.length < 2) {
    return {
      aggregates: EMPTY_AGGREGATES,
      methodologicalCautions: buildCautions(EMPTY_AGGREGATES),
      warnings: ["CSV vacío o sin registros de datos."],
    };
  }

  const header = splitRow(lines[0]).map((v) => v.trim());
  const ipaqIdx  = header.indexOf(IPAQ_DICO_FIELD);
  const p34aIdx  = header.indexOf(P34A_R_FIELD);

  const warnings: string[] = [];

  if (ipaqIdx === -1 && p34aIdx === -1) {
    warnings.push(
      `Columnas "${IPAQ_DICO_FIELD}" y "${P34A_R_FIELD}" no encontradas. El CSV no contiene datos IPAQ-EAS procesables.`
    );
    return { aggregates: EMPTY_AGGREGATES, methodologicalCautions: buildCautions(EMPTY_AGGREGATES), warnings };
  }
  if (ipaqIdx === -1)  warnings.push(`Columna "${IPAQ_DICO_FIELD}" no encontrada.`);
  if (p34aIdx === -1)  warnings.push(`Columna "${P34A_R_FIELD}" no encontrada.`);

  let n = 0;
  let nValidIPAQ = 0, nHigh = 0;
  let nValidP34AR = 0, nInactive = 0;

  for (let i = 1; i < lines.length; i++) {
    const row = splitRow(lines[i]);
    n++;

    if (ipaqIdx !== -1) {
      const v = parseBinary(row[ipaqIdx]);
      if (v !== null) { nValidIPAQ++; if (v === 1) nHigh++; }
    }

    if (p34aIdx !== -1) {
      const v = parseBinary(row[p34aIdx]);
      if (v !== null) { nValidP34AR++; if (v === 1) nInactive++; }
    }
  }

  const aggregates: IPAQAggregates = {
    n,
    nValidIPAQ, missingIPAQ: n - nValidIPAQ,
    nHigh, pctHigh: pct(nHigh, nValidIPAQ),
    nValidP34AR, missingP34AR: n - nValidP34AR,
    nInactive, pctInactive: pct(nInactive, nValidP34AR),
  };

  return { aggregates, methodologicalCautions: buildCautions(aggregates), warnings };
}
