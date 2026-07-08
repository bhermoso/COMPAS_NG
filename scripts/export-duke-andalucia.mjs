#!/usr/bin/env node
/**
 * Genera fixtures/duke-eas-andalucia.csv desde los microdatos EAS READY.
 *
 * Fuente:
 *   EAS_microdatos_adulto_READY.csv
 *
 * Columnas:
 *   P5701..P5711  11 ítems DUKE-UNC-11, escala 1..5
 *
 * Diferencia con Granada:
 *   - Granada/provincia = PROV == 18.0
 *   - Andalucía = sin filtro PROV
 *
 * Criterio:
 *   Se exportan únicamente registros completos en los 11 ítems DUKE.
 *
 * Uso:
 *   node scripts/export-duke-andalucia.mjs
 */

import { createReadStream, createWriteStream } from 'node:fs'
import { createInterface } from 'node:readline'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const _dir = dirname(fileURLToPath(import.meta.url))

const SOURCE = resolve(_dir, '..', 'EAS_microdatos_adulto_READY.csv')
const OUTPUT = resolve(_dir, '..', 'fixtures', 'duke-eas-andalucia.csv')

const EXPORT_COLS = [
  'P5701', 'P5702', 'P5703', 'P5704', 'P5705', 'P5706',
  'P5707', 'P5708', 'P5709', 'P5710', 'P5711',
]

const clean = (v) => String(v ?? '').trim().replace(/^"|"$/g, '')

const isDUKEValid = (v) => {
  const n = Number(v)
  return Number.isFinite(n) && n >= 1 && n <= 5
}

const fmt = (n) => Number.isFinite(n) ? n.toFixed(1) : '0.0'
const mean = (arr) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : NaN

const rl = createInterface({
  input: createReadStream(SOURCE),
  crlfDelay: Infinity,
})

const out = createWriteStream(OUTPUT)

let headerDone = false
let colIndexes = []

let totalRows = 0
let exportedRows = 0
let incompleteRows = 0

const totals = []
const confidencial = []
const afectivo = []

out.write(`${EXPORT_COLS.join(',')}\n`)

for await (const line of rl) {
  const cols = line.split(',')

  if (!headerDone) {
    colIndexes = EXPORT_COLS.map((c) => cols.indexOf(c))
    const missing = EXPORT_COLS.filter((_, i) => colIndexes[i] === -1)

    if (missing.length > 0) {
      throw new Error(`Columnas no encontradas en READY: ${missing.join(', ')}`)
    }

    headerDone = true
    continue
  }

  totalRows++

  const rawVals = colIndexes.map((idx) => clean(cols[idx]))

  if (!rawVals.every(isDUKEValid)) {
    incompleteRows++
    continue
  }

  const vals = rawVals.map(Number)

  const total = vals.reduce((a, b) => a + b, 0)
  const conf = vals[0] + vals[1] + vals[5] + vals[6] + vals[7] + vals[8] + vals[9]
  const afec = vals[2] + vals[3] + vals[4] + vals[10]

  totals.push(total)
  confidencial.push(conf)
  afectivo.push(afec)

  out.write(`${rawVals.join(',')}\n`)
  exportedRows++
}

await new Promise((resolveDone) => out.end(resolveDone))

const low = totals.filter(v => v < 32).length
const normal = totals.filter(v => v >= 32).length
const pct = (n, d) => d ? (n / d * 100).toFixed(1) : '0.0'

console.log(`
=== Exportación DUKE-EAS Andalucía ===
Fuente:     EAS_microdatos_adulto_READY.csv
Filtro:     ninguno — Andalucía completa
Destino:    fixtures/duke-eas-andalucia.csv

Registros EAS procesados:              ${totalRows}
Registros completos exportados:        ${exportedRows} (${pct(exportedRows, totalRows)} %)
Registros incompletos/no exportados:   ${incompleteRows} (${pct(incompleteRows, totalRows)} %)

DUKE-UNC-11:
  Media global:                        ${fmt(mean(totals))}/55
  Apoyo bajo (<32):                    ${low} (${pct(low, totals.length)} %)
  Apoyo normal (>=32):                 ${normal} (${pct(normal, totals.length)} %)

Subescalas:
  Media apoyo confidencial:            ${fmt(mean(confidencial))}/35
  Media apoyo afectivo:                ${fmt(mean(afectivo))}/20
`)
