#!/usr/bin/env node
/**
 * Genera fixtures/predimed-eas-andalucia.csv desde los microdatos EAS READY.
 *
 * Fuente:
 *   EAS_microdatos_adulto_READY.csv
 *
 * Columnas:
 *   Predimed              puntuación PREDIMED-14 si está disponible
 *   P36BPD01_2023..P36BPD14_2023  ítems brutos EAS, solo trazabilidad
 *
 * Diferencia con Granada:
 *   - Granada/provincia = PROV == 18.0
 *   - Andalucía = sin filtro PROV
 *
 * Uso:
 *   node scripts/export-predimed-andalucia.mjs
 */

import { createReadStream, createWriteStream } from 'node:fs'
import { createInterface } from 'node:readline'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const _dir = dirname(fileURLToPath(import.meta.url))

const SOURCE = resolve(_dir, '..', 'EAS_microdatos_adulto_READY.csv')
const OUTPUT = resolve(_dir, '..', 'fixtures', 'predimed-eas-andalucia.csv')

const ITEM_COLS = [
  'P36BPD01_2023', 'P36BPD02_2023', 'P36BPD03_2023', 'P36BPD04_2023',
  'P36BPD05_2023', 'P36BPD06_2023', 'P36BPD07_2023', 'P36BPD08_2023',
  'P36BPD09_2023', 'P36BPD10_2023', 'P36BPD11_2023', 'P36BPD12_2023',
  'P36BPD13_2023', 'P36BPD14_2023',
]

const EXPORT_COLS = ['Predimed', ...ITEM_COLS]
const MISSING_CODES = new Set(['', ' ', '994', '994.0', '995', '995.0', '996', '996.0', '997', '997.0', '998', '998.0', '999', '999.0'])

const clean = (v) => String(v ?? '').trim().replace(/^"|"$/g, '')
const mean = (arr) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : NaN
const sd = (arr) => {
  if (arr.length < 2) return NaN
  const m = mean(arr)
  return Math.sqrt(arr.reduce((a, b) => a + (b - m) ** 2, 0) / (arr.length - 1))
}
const median = (arr) => {
  if (!arr.length) return NaN
  const s = [...arr].sort((a, b) => a - b)
  const mid = Math.floor(s.length / 2)
  return s.length % 2 === 0 ? (s[mid - 1] + s[mid]) / 2 : s[mid]
}
const fmt = (n) => Number.isFinite(n) ? n.toFixed(1) : '0.0'
const pct = (n, d) => d ? (n / d * 100).toFixed(1) : '0.0'

const rl = createInterface({
  input: createReadStream(SOURCE),
  crlfDelay: Infinity,
})

const out = createWriteStream(OUTPUT)

let headerDone = false
let colIndexes = []

let totalRows = 0
let exportedRows = 0

const predimedVals = []

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

  const values = colIndexes.map((idx) => clean(cols[idx]))
  const predimedRaw = values[0]

  if (predimedRaw && !MISSING_CODES.has(predimedRaw)) {
    const v = Number(predimedRaw)
    if (Number.isFinite(v) && v >= 0 && v <= 14) {
      predimedVals.push(Math.round(v))
    }
  }

  out.write(`${values.join(',')}\n`)
  exportedRows++
}

await new Promise((resolveDone) => out.end(resolveDone))

const low = predimedVals.filter(v => v <= 6).length
const mid = predimedVals.filter(v => v >= 7 && v <= 8).length
const high = predimedVals.filter(v => v >= 9).length

console.log(`
=== Exportación PREDIMED-EAS Andalucía ===
Fuente:     EAS_microdatos_adulto_READY.csv
Filtro:     ninguno — Andalucía completa
Destino:    fixtures/predimed-eas-andalucia.csv

Registros EAS procesados:                 ${totalRows}
Registros exportados:                     ${exportedRows}
Registros con puntuación PREDIMED válida: ${predimedVals.length}

PREDIMED-14:
  Media:                                  ${fmt(mean(predimedVals))}/14
  Mediana:                                ${fmt(median(predimedVals))}
  Desviación típica:                      ${fmt(sd(predimedVals))}

Categorías:
  Baja adherencia (<=6):                  ${low} (${pct(low, predimedVals.length)} %)
  Adherencia media (7-8):                 ${mid} (${pct(mid, predimedVals.length)} %)
  Alta adherencia (>=9):                  ${high} (${pct(high, predimedVals.length)} %)
`)
