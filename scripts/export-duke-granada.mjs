/**
 * Genera fixtures/duke-eas-granada.csv desde los microdatos EAS.
 *
 * Extrae las columnas DUKE-UNC-11 de la Encuesta Andaluza de Salud (EAS)
 * filtrando por la provincia de Granada (PROV = 18.0).
 *
 * Decisión de diseño — pre-filtrado a registros completos:
 *   A diferencia de otros fixtures EAS (sueno, predimed, cage) que exportan
 *   todos los registros de Granada y dejan el tratamiento del missing al parser,
 *   este fixture exporta ÚNICAMENTE los 3028 registros de Granada en los que
 *   los 11 ítems DUKE (P5701–P5711) tienen valores en el rango válido 1–5.
 *
 *   Razón: el análisis DUKE requiere los 11 ítems completos para calcular
 *   dukeGLOBAL, dukeAFECT y dukeCONF. Un registro con cualquier ítem
 *   missing no puede contribuir a ninguna de las tres escalas. El fixture
 *   de referencia original fue generado con este filtro (3028 / 3064 Granada).
 *
 *   Los 36 registros Granada con algún ítem faltante (994.0 / 995.0 / 996.0
 *   / 999.0 / fuera de rango) quedan fuera del fixture. Si se necesitara el
 *   análisis de no-respuesta, habría que generar un fixture sin pre-filtrar.
 *
 * Nota sobre BOM:
 *   El fixture versionado incluye un BOM UTF-8 (U+FEFF) al inicio del fichero,
 *   proveniente de la herramienta con que se exportó originalmente. Este script
 *   lo reproduce para garantizar la reproducibilidad byte a byte del contenido
 *   (los parsers TypeScript lo eliminan vía String.prototype.trim()).
 *
 * Fuente requerida:
 *   EAS_microdatos_adulto_READY.csv (en el directorio raíz del proyecto)
 *   — todos los ítems DUKE P5701..P5711 están presentes en READY.
 *
 * Columnas exportadas:
 *   P5701 … P5711   11 ítems DUKE-UNC-11 (escala 1=nunca … 5=siempre).
 *
 * Uso:
 *   node scripts/export-duke-granada.mjs
 *
 * @see fixtures/README.md — documentación completa del fixture.
 * @see audit_eas_variables.csv — metadatos de todas las variables EAS.
 */

import { createReadStream, createWriteStream } from 'node:fs'
import { createInterface } from 'node:readline'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const _dir = dirname(fileURLToPath(import.meta.url))
const SOURCE = resolve(_dir, '..', 'EAS_microdatos_adulto_READY.csv')
const OUTPUT = resolve(_dir, '..', 'fixtures', 'duke-eas-granada.csv')
const PROV_GRANADA = '18.0'

const EXPORT_COLS = [
  'P5701', 'P5702', 'P5703', 'P5704', 'P5705', 'P5706',
  'P5707', 'P5708', 'P5709', 'P5710', 'P5711',
]

// Rango válido para ítems DUKE (Likert 1–5)
const DUKE_MIN = 1
const DUKE_MAX = 5

function isDUKEValid(raw) {
  const v = parseFloat(raw?.trim() ?? '')
  return Number.isFinite(v) && Number.isInteger(v) && v >= DUKE_MIN && v <= DUKE_MAX
}

// ── Lectura y filtrado ───────────────────────────────────────────────────────

const rl  = createInterface({ input: createReadStream(SOURCE), crlfDelay: Infinity })
// BOM reproducido para concordancia byte-a-byte con el fixture original
const out = createWriteStream(OUTPUT)

let headerDone = false
let provIdx    = -1
let colIndexes = []
let totalRows  = 0
let granadaRows = 0
let exportedRows = 0

for await (const line of rl) {
  if (!headerDone) {
    const cols = line.split(',').map(c => c.trim().replace(/^﻿/, '').replace(/^"|"$/g, ''))
    provIdx    = cols.indexOf('PROV')
    colIndexes = EXPORT_COLS.map(c => cols.indexOf(c))

    const missing = EXPORT_COLS.filter((c, i) => colIndexes[i] === -1)
    if (missing.length > 0) throw new Error(`Columnas no encontradas en READY: ${missing.join(', ')}`)
    if (provIdx === -1)     throw new Error('Columna PROV no encontrada')

    // BOM + header sin salto final (el \n se escribe como parte del bloque)
    out.write('﻿' + EXPORT_COLS.join(',') + '\n')
    headerDone = true
    continue
  }

  totalRows++
  const fields = line.split(',')
  const prov   = fields[provIdx]?.trim().replace(/^"|"$/g, '')
  if (prov !== PROV_GRANADA) continue
  granadaRows++

  // Pre-filtrar a registros completos: los 11 ítems deben ser válidos 1–5
  const rawVals = colIndexes.map(idx => fields[idx]?.trim().replace(/^"|"$/g, '') ?? '')
  if (!rawVals.every(isDUKEValid)) continue

  // Normalizar a float sin trailing ceros innecesarios (mantener .0)
  const row = rawVals.map(v => {
    const n = parseFloat(v)
    return n % 1 === 0 ? n.toFixed(1) : v
  })
  out.write(row.join(',') + '\n')
  exportedRows++
}

await new Promise(r => out.end(r))

// ── Estadísticos de validación ───────────────────────────────────────────────

const { createReadStream: crs } = await import('node:fs')
const { createInterface: ci  } = await import('node:readline')

const rl2 = ci({ input: crs(OUTPUT), crlfDelay: Infinity })
let hdr2 = null
let dukeVals = []  // suma GLOBAL por fila (suma de los 11 ítems)

for await (const line of rl2) {
  if (!hdr2) {
    hdr2 = line.replace(/^﻿/, '').split(',')
    continue
  }
  const cols = line.split(',')
  const sum  = cols.reduce((acc, v) => acc + parseFloat(v), 0)
  dukeVals.push(sum)
}

const n    = dukeVals.length
const mean = n ? dukeVals.reduce((a, b) => a + b, 0) / n : 0
const low  = dukeVals.filter(v => v < 32).length    // <32 = apoyo bajo (referencia EAS Granada)
const norm = dukeVals.filter(v => v >= 32).length

console.log(`
=== Exportación DUKE-EAS Granada ===
Fuente:     EAS_microdatos_adulto_READY.csv
Filtro:     PROV=${PROV_GRANADA} (Granada) — solo registros completos (11 ítems en 1–5)
Destino:    fixtures/duke-eas-granada.csv
Columnas:   ${EXPORT_COLS.length}

Registros totales en READY:              ${totalRows}
Registros Granada (PROV=18.0):           ${granadaRows}
  De los cuales completos (exportados):  ${exportedRows}  (${(exportedRows/granadaRows*100).toFixed(1)} %)
  Incompletos / no exportados:           ${granadaRows - exportedRows}  (${((granadaRows - exportedRows)/granadaRows*100).toFixed(1)} %)

Suma DUKE Global (11 ítems, escala 11–55):
  n exportados:        ${n}
  Media suma global:   ${mean.toFixed(2)}
  Apoyo bajo (<32):    ${low}  (${(low/n*100).toFixed(1)} %)
  Apoyo normal (≥32):  ${norm} (${(norm/n*100).toFixed(1)} %)
`)
