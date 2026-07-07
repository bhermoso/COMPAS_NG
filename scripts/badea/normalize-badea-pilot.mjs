/**
 * BADEA/IECA Pilot Normalization Script — Consulta 19824
 *
 * "Porcentaje de población según tipología de celda y grado de urbanización por municipio"
 * Actividad estadística: Clasificación del grado de urbanización
 * Fuente: Instituto de Estadística y Cartografía de Andalucía (IECA) / BADEA
 *
 * Este script es un piloto de evaluación. NO es un parser de producción.
 * Convierte una respuesta de la API BADEA en líneas de ingesta normalizadas
 * listas para pegar en COMPÁS NG como `cmi-indicator`.
 *
 * API BADEA (REST pública, sin autenticación):
 *   https://www.juntadeandalucia.es/institutodeestadisticaycartografia/intranet/admin/rest/v1.0/consulta/19824
 *
 * Evaluado el 2026-07-07. Ver BADEA-IECA-PILOT-ATARFE-19824.md.
 */

// ── Metainformación de la consulta ─────────────────────────────────────────

export const CONSULTA_METADATA = {
  id: 19824,
  title: "Porcentaje de población según tipología de celda y grado de urbanización por municipio",
  activity: "Clasificación del grado de urbanización",
  source: "IECA",
  apiUrl: "https://www.juntadeandalucia.es/institutodeestadisticaycartografia/intranet/admin/rest/v1.0/consulta/19824",
  periodicity: "Anual",
  accessedAt: "2026-07-07",
};

// ── Esquema de columnas de consulta 19824 ──────────────────────────────────
// Derivado de la respuesta real de la API. Posiciones (índices) en cada fila.
// Estructura de fila: [municipio, año, fuente, grado_urbanizacion, %_centros, %_agrupaciones, %_rurales]

export const COLUMN_SCHEMA = [
  { index: 0, field: "municipio",             type: "dimension" },
  { index: 1, field: "año",                   type: "dimension" },
  { index: 2, field: "fuente",                type: "dimension" },
  { index: 3, field: "gradoUrbanizacion",
    label: "Grado de urbanización según clasificación por tipología de celda",
    type: "category",
    note: "Valor literal, no código numérico. Ej: 'Zona rural', 'Zona de densidad intermedia', 'Zona urbana'." },
  { index: 4, field: "pctCentrosUrbanos",
    label: "Porcentaje de población en centros urbanos",
    unit: "%",
    type: "measure" },
  { index: 5, field: "pctAgrupacionesUrbanas",
    label: "Porcentaje de población en agrupaciones urbanas",
    unit: "%",
    type: "measure" },
  { index: 6, field: "pctCeldasRurales",
    label: "Porcentaje de población en celdas de malla rurales",
    unit: "%",
    type: "measure" },
];

// ── Parseo de fila ──────────────────────────────────────────────────────────

/**
 * Parsea una fila del array `data` de la respuesta BADEA en un objeto legible.
 * @param {Array} row - Array de 7 objetos de la API BADEA
 * @returns {Object} Registro parseado con campos nombrados
 */
export function parseRow(row) {
  if (!Array.isArray(row) || row.length < 7) {
    throw new Error(
      `Fila inválida: se esperan 7 elementos, se recibieron ${row?.length ?? "undefined"}.`
    );
  }
  return {
    cod:                   row[0].cod?.[0] ?? "",
    municipio:             row[0].des ?? "",
    año:                   row[1].des ?? "",
    fuente:                row[2].des ?? "",
    gradoUrbanizacion:     row[3].format ?? "",     // literal, no código
    pctCentrosUrbanos:     { val: row[4].val ?? "", format: row[4].format ?? "" },
    pctAgrupacionesUrbanas:{ val: row[5].val ?? "", format: row[5].format ?? "" },
    pctCeldasRurales:      { val: row[6].val ?? "", format: row[6].format ?? "" },
  };
}

// ── Búsqueda por código INE ────────────────────────────────────────────────

/**
 * Encuentra la fila correspondiente a un municipio por su código INE.
 * @param {Array} dataArray - Array `data` completo de la respuesta BADEA
 * @param {string} ineCode  - Código INE del municipio (ej. "18022")
 * @returns {Array|null}
 */
export function findMunicipioRow(dataArray, ineCode) {
  if (!Array.isArray(dataArray)) return null;
  return dataArray.find(
    (row) => Array.isArray(row) && row[0]?.cod?.[0] === ineCode
  ) ?? null;
}

// ── Normalización ──────────────────────────────────────────────────────────

function buildProvenance(año, meta = CONSULTA_METADATA) {
  return `Fuente: ${meta.source}, BADEA, consulta ${meta.id}, ${meta.activity}. Año ${año}.`;
}

/**
 * Convierte un registro parseado en líneas de ingesta normalizadas.
 * Una línea por medida. Cada línea es autocontenida y legible.
 * No usa códigos crudos cuando hay literal disponible.
 *
 * @param {Object} record  - Registro parseado por parseRow()
 * @param {Object} [meta]  - Metainformación de la consulta
 * @returns {string[]} Líneas listas para pegar en COMPÁS NG
 */
export function normalizeRecord(record, meta = CONSULTA_METADATA) {
  const { municipio, cod, año } = record;
  const mun  = cod ? `${municipio} (INE ${cod})` : municipio;
  const prov = buildProvenance(año, meta);
  const lines = [];

  // Línea 1: Grado de urbanización (literal, no código)
  if (record.gradoUrbanizacion) {
    lines.push(
      `${mun} · Grado de urbanización según tipología de celda, ${año}: ` +
      `${record.gradoUrbanizacion}. ${prov}`
    );
  }

  // Línea 2: % centros urbanos
  if (record.pctCentrosUrbanos.val !== "") {
    const fmt = record.pctCentrosUrbanos.format || `${record.pctCentrosUrbanos.val}%`;
    lines.push(
      `${mun} · Porcentaje de población en centros urbanos, ${año}: ${fmt}. ${prov}`
    );
  }

  // Línea 3: % agrupaciones urbanas (con valor de precisión)
  if (record.pctAgrupacionesUrbanas.val !== "") {
    const fmt     = record.pctAgrupacionesUrbanas.format || `${record.pctAgrupacionesUrbanas.val}%`;
    const precise = parseFloat(record.pctAgrupacionesUrbanas.val).toFixed(2);
    lines.push(
      `${mun} · Porcentaje de población en agrupaciones urbanas, ${año}: ` +
      `${fmt} (valor exacto: ${precise} %). ${prov}`
    );
  }

  // Línea 4: % celdas de malla rurales (con valor de precisión)
  if (record.pctCeldasRurales.val !== "") {
    const fmt     = record.pctCeldasRurales.format || `${record.pctCeldasRurales.val}%`;
    const precise = parseFloat(record.pctCeldasRurales.val).toFixed(2);
    lines.push(
      `${mun} · Porcentaje de población en celdas de malla rurales, ${año}: ` +
      `${fmt} (valor exacto: ${precise} %). ${prov}`
    );
  }

  return lines;
}

/**
 * Pipeline completo: respuesta API → búsqueda de municipio → normalización.
 *
 * @param {Object} apiResponse - Respuesta JSON completa de la API BADEA
 * @param {string} ineCode     - Código INE del municipio
 * @returns {{ lines: string[], record: Object|null, error: string|null }}
 */
export function normalizeMunicipioFromResponse(apiResponse, ineCode) {
  const data = apiResponse?.data;
  if (!Array.isArray(data)) {
    return {
      lines: [],
      record: null,
      error: "La respuesta de la API no contiene un array 'data' válido.",
    };
  }

  const row = findMunicipioRow(data, ineCode);
  if (!row) {
    return {
      lines: [],
      record: null,
      error: `Municipio con código INE ${ineCode} no encontrado en la respuesta.`,
    };
  }

  let record;
  try {
    record = parseRow(row);
  } catch (err) {
    return { lines: [], record: null, error: `Error al parsear la fila: ${err.message}` };
  }

  return { lines: normalizeRecord(record), record, error: null };
}
