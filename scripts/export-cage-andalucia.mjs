/**
 * Genera fixtures/cage-eas-andalucia.csv desde los microdatos EAS.
 *
 * Extrae las columnas de consumo de alcohol (CAGE) de la Encuesta Andaluza
 * de Salud (EAS) sin filtrar por provincia: Andalucía completa.
 *
 * Decisión de diseño:
 *   COMPÁS NG consume los campos derivados oficiales de la EAS:
 *     - CAGE_R  (riesgo de alcoholismo, campo derivado binario EAS)
 *     - CAGE    (sospecha de alcoholismo, campo ordinal EAS 1–4)
 *   Ninguno de estos campos es el CAGE clásico recalculado desde ítems crudos.
 *   Son indicadores pre-calculados por la EAS para monitorización del consumo
 *   de alcohol en la población andaluza.
 *
 * CAGE_R es el indicador canónico primario:
 *   0 = No riesgo · 1 = Riesgo · 994 = No procede · 995/996/999 = missing
 *
 * CAGE es el campo ordinal secundario (clasificación de nivel):
 *   1 = Bebedor social · 2 = Consumo de riesgo · 3 = Consumo perjudicial
 *   4 = Dependencia alcohólica · 994 = No procede
 *
 * EXCLUSIÓN EXPLÍCITA:
 *   P32D_2023 NO se usa. Es un ítem de la escala AUDIT-C (frecuencia de
 *   consumo episódico masivo), instrumento distinto del CAGE. Mezclarlos
 *   violaría la integridad metodológica de ambas escalas.
 *
 * Fuente requerida:
 *   EAS_COMPLETO.csv (en el directorio raíz del proyecto)
 *
 * Uso:
 *   node scripts/export-cage-andalucia.mjs
 *
 * @see fixtures/README.md — documentación completa del fixture.
 * @see audit_eas_variables.csv — metadatos de todas las variables EAS.
 */

import { createReadStream, createWriteStream } from 'node:fs'
import { createInterface } from 'node:readline'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const _dir = dirname(fileURLToPath(import.meta.url))
const SOURCE = resolve(_dir, '..', 'EAS_COMPLETO.csv')
const OUTPUT = resolve(_dir, '..', 'fixtures', 'cage-eas-andalucia.csv')
const PROV_GRANADA = '18.0'

const EXPORT_COLS = [
  'CAGE_R',
  'CAGE',
]

const MISSING_CODES = new Set(['', '991.0', '994.0', '995.0', '996.0', '999.0'])

// ── Lectura y filtrado ───────────────────────────────────────────────────────

const rl = createInterface({ input: createReadStream(SOURCE), crlfDelay: Infinity })
const out = createWriteStream(OUTPUT)

let headerDone = false
let provIdx = -1
let colIndexes = []
let totalRows = 0
let exportedRows = 0

for await (const line of rl) {
  if (!headerDone) {
    const cols = line.split(',').map(c => c.trim().replace(/^﻿/, '').replace(/^"|"$/g, ''))
    provIdx = cols.indexOf('PROV')
    colIndexes = EXPORT_COLS.map(c => cols.indexOf(c))

    const missing = EXPORT_COLS.filter((c, i) => colIndexes[i] === -1)
    if (missing.length > 0) throw new Error(`Columnas no encontradas en EAS_COMPLETO: ${missing.join(', ')}`)
    if (provIdx === -1) throw new Error('Columna PROV no encontrada')

    out.write(EXPORT_COLS.join(',') + '\n')
    headerDone = true
    continue
  }

  totalRows++
  const fields = line.split(',')
  const prov = fields[provIdx]?.trim().replace(/^"|"$/g, '')

  const row = colIndexes.map(idx => fields[idx]?.trim().replace(/^"|"$/g, '') ?? '')
  out.write(row.join(',') + '\n')
  exportedRows++
}

await new Promise(r => out.end(r))

// ── Estadísticos de validación ───────────────────────────────────────────────

const { createReadStream: crs } = await import('node:fs')
const { createInterface: ci } = await import('node:readline')

const rl2 = ci({ input: crs(OUTPUT), crlfDelay: Infinity })
let hdr2 = null

// Contadores CAGE_R (binario)
let cageR0 = 0, cageR1 = 0, cageRMiss = 0
// Contadores CAGE (ordinal 1–4)
let cage1 = 0, cage2 = 0, cage3 = 0, cage4 = 0, cageMiss = 0

for await (const line of rl2) {
  if (!hdr2) { hdr2 = line.split(','); continue }
  const cols = line.split(',')

  const idxCageR = hdr2.indexOf('CAGE_R')
  const idxCage  = hdr2.indexOf('CAGE')

  // CAGE_R
  const rawCageR = cols[idxCageR]?.trim()
  if (!rawCageR || MISSING_CODES.has(rawCageR)) { cageRMiss++ }
  else if (rawCageR === '0.0' || rawCageR === '0') { cageR0++ }
  else if (rawCageR === '1.0' || rawCageR === '1') { cageR1++ }
  else { cageRMiss++ }

  // CAGE (ordinal)
  const rawCage = cols[idxCage]?.trim()
  if (!rawCage || MISSING_CODES.has(rawCage)) { cageMiss++ }
  else if (rawCage === '1.0' || rawCage === '1') { cage1++ }
  else if (rawCage === '2.0' || rawCage === '2') { cage2++ }
  else if (rawCage === '3.0' || rawCage === '3') { cage3++ }
  else if (rawCage === '4.0' || rawCage === '4') { cage4++ }
  else { cageMiss++ }
}

const cageRValid = cageR0 + cageR1
const cageValid  = cage1 + cage2 + cage3 + cage4

console.log(`
=== Exportación CAGE-EAS Andalucía ===
Fuente:     EAS_COMPLETO.csv
Filtro:     ninguno — Andalucía completa
Destino:    fixtures/cage-eas-andalucia.csv
Columnas:   ${EXPORT_COLS.length}

Registros totales en EAS_COMPLETO: ${totalRows}
Registros exportados (Andalucía):  ${exportedRows}

CAGE_R — Riesgo de alcoholismo (campo derivado binario EAS):
  n válidos:               ${cageRValid} / ${exportedRows} (${(cageRValid/exportedRows*100).toFixed(1)} %)
  missing / no procede:    ${cageRMiss} (${(cageRMiss/exportedRows*100).toFixed(1)} %)
  CAGE_R=0 (sin riesgo):   ${cageR0} (${(cageR0/cageRValid*100).toFixed(1)} %)
  CAGE_R=1 (con riesgo):   ${cageR1} (${(cageR1/cageRValid*100).toFixed(1)} %)

CAGE — Clasificación ordinal (campo derivado EAS):
  n válidos:               ${cageValid} / ${exportedRows} (${(cageValid/exportedRows*100).toFixed(1)} %)
  missing / no procede:    ${cageMiss} (${(cageMiss/exportedRows*100).toFixed(1)} %)
  1 Bebedor social:        ${cage1} (${cageValid > 0 ? (cage1/cageValid*100).toFixed(1) : '—'} %)
  2 Consumo de riesgo:     ${cage2} (${cageValid > 0 ? (cage2/cageValid*100).toFixed(1) : '—'} %)
  3 Consumo perjudicial:   ${cage3} (${cageValid > 0 ? (cage3/cageValid*100).toFixed(1) : '—'} %)
  4 Dependencia:           ${cage4} (${cageValid > 0 ? (cage4/cageValid*100).toFixed(1) : '—'} %)
`)
