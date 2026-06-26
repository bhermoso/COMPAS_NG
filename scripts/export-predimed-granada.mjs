/**
 * Genera fixtures/predimed-eas-granada.csv desde los microdatos EAS.
 *
 * Extrae las columnas PREDIMED de los microdatos oficiales de la Encuesta
 * Andaluza de Salud (EAS) filtrando por la provincia de Granada (PROV = 18).
 *
 * Fuente: EAS_microdatos_adulto_READY.csv — todas las columnas PREDIMED
 * necesarias están presentes en el fichero READY, a diferencia de SF-12
 * (que requiere EAS_COMPLETO por carecer READY de MCS12_SP).
 *
 * Columnas exportadas:
 *   Predimed              Campo canónico: índice PREDIMED-14 ya calculado por la EAS.
 *   Predimed_R            Nivel de adherencia (categórico EAS).
 *   Predimed_R2           Variante dicotómica EAS.
 *   Predimed_R3           Variante adicional EAS.
 *   P36BPD01_2023 …
 *   P36BPD14_2023         Ítems brutos (solo trazabilidad; no usar para recalcular).
 *
 * AVISO: los 14 ítems P36BPD usan códigos 1–4, no valores binarios 0/1.
 * La suma directa de ítems NO reproduce el índice Predimed oficial.
 * El campo canónico `Predimed` incorpora la recodificación per-ítem de la EAS.
 * Solo los registros de oleadas que incluyen el módulo PREDIMED tienen
 * `Predimed` válido; el resto aparece con celda vacía.
 *
 * Uso:
 *   node scripts/export-predimed-granada.mjs
 *
 * @see fixtures/README.md — documentación completa del fixture.
 * @see audit_eas_variables.csv — metadatos de todas las variables EAS.
 */

import { createReadStream, createWriteStream } from 'node:fs'
import { createInterface } from 'node:readline'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const _dir = dirname(fileURLToPath(import.meta.url))
const SOURCE  = resolve(_dir, '..', 'EAS_microdatos_adulto_READY.csv')
const OUTPUT  = resolve(_dir, '..', 'fixtures', 'predimed-eas-granada.csv')
const PROV_GRANADA = '18.0'

const EXPORT_COLS = [
  'Predimed', 'Predimed_R', 'Predimed_R2', 'Predimed_R3',
  'P36BPD01_2023', 'P36BPD02_2023', 'P36BPD03_2023', 'P36BPD04_2023',
  'P36BPD05_2023', 'P36BPD06_2023', 'P36BPD07_2023', 'P36BPD08_2023',
  'P36BPD09_2023', 'P36BPD10_2023', 'P36BPD11_2023', 'P36BPD12_2023',
  'P36BPD13_2023', 'P36BPD14_2023',
]

const MISSING_CODES = new Set(['', '991.0', '994.0', '995.0', '996.0', '999.0'])

// ── Lectura y filtrado ───────────────────────────────────────────────────────

const rl  = createInterface({ input: createReadStream(SOURCE), crlfDelay: Infinity })
const out = createWriteStream(OUTPUT)

let headerDone = false
let provIdx = -1
let colIndexes = []
let totalRows = 0
let exportedRows = 0

for await (const line of rl) {
  if (!headerDone) {
    const cols = line.split(',').map(c => c.trim().replace(/^﻿/, '').replace(/^"|"$/g, ''))
    provIdx    = cols.indexOf('PROV')
    colIndexes = EXPORT_COLS.map(c => cols.indexOf(c))

    const missing = EXPORT_COLS.filter((c, i) => colIndexes[i] === -1)
    if (missing.length > 0) throw new Error(`Columnas no encontradas: ${missing.join(', ')}`)
    if (provIdx === -1)     throw new Error('Columna PROV no encontrada')

    out.write(EXPORT_COLS.join(',') + '\n')
    headerDone = true
    continue
  }

  totalRows++
  const fields = line.split(',')
  const prov   = fields[provIdx]?.trim().replace(/^"|"$/g, '')
  if (prov !== PROV_GRANADA) continue

  const row = colIndexes.map(idx => fields[idx]?.trim().replace(/^"|"$/g, '') ?? '')
  out.write(row.join(',') + '\n')
  exportedRows++
}

await new Promise(r => out.end(r))

// ── Estadísticos de validación ───────────────────────────────────────────────

const rl2 = createInterface({ input: createReadStream(OUTPUT), crlfDelay: Infinity })
let hdr2 = null
let predimedVals = []
let row2Count = 0

for await (const line of rl2) {
  if (!hdr2) { hdr2 = line.split(','); continue }
  row2Count++
  const cols = line.split(',')
  const pIdx = hdr2.indexOf('Predimed')
  const raw  = cols[pIdx]?.trim()
  if (raw && !MISSING_CODES.has(raw)) {
    const v = parseFloat(raw)
    if (Number.isFinite(v) && v >= 0 && v <= 14) predimedVals.push(Math.round(v))
  }
}

const mean   = arr => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : NaN
const sd     = arr => { if (arr.length < 2) return NaN; const m = mean(arr); return Math.sqrt(arr.reduce((a,b) => a+(b-m)**2, 0)/(arr.length-1)) }
const median = arr => { if (!arr.length) return NaN; const s = [...arr].sort((a,b)=>a-b); const m = Math.floor(s.length/2); return s.length%2===0 ? (s[m-1]+s[m])/2 : s[m] }

const low  = predimedVals.filter(v => v <= 6).length
const mid  = predimedVals.filter(v => v >= 7 && v <= 8).length
const high = predimedVals.filter(v => v >= 9).length
const n    = predimedVals.length

console.log(`
=== Exportación PREDIMED-EAS Granada ===
Fuente:     EAS_microdatos_adulto_READY.csv
Filtro:     PROV=${PROV_GRANADA} (Granada)
Destino:    fixtures/predimed-eas-granada.csv
Columnas:   ${EXPORT_COLS.length}

Registros totales en READY:        ${totalRows}
Registros exportados (Granada):    ${exportedRows}

Campo Predimed (índice canónico):
  n válidos:   ${n} / ${exportedRows} (${(n/exportedRows*100).toFixed(1)} %)
  missing:     ${exportedRows - n} (${((exportedRows-n)/exportedRows*100).toFixed(1)} %)
  media:       ${mean(predimedVals).toFixed(3)}
  mediana:     ${median(predimedVals).toFixed(3)}
  DT:          ${sd(predimedVals).toFixed(3)}
  rango:       ${Math.min(...predimedVals)} – ${Math.max(...predimedVals)}

Distribución adherencia (sobre válidos):
  Baja  (≤ 6): ${low}  (${(low/n*100).toFixed(1)} %)
  Media (7–8): ${mid}  (${(mid/n*100).toFixed(1)} %)
  Alta  (≥ 9): ${high} (${(high/n*100).toFixed(1)} %)
`)
