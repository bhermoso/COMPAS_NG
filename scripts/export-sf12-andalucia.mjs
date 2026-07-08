#!/usr/bin/env node
/**
 * Genera fixtures/sf12-eas-andalucia.csv desde los microdatos EAS completos.
 *
 * Fuente:
 *   EAS_COMPLETO.csv
 *
 * Columnas:
 *   PCS12_SP      componente físico SF-12
 *   MCS12_SP      componente mental SF-12
 *   PCS12_SP_R    recodificación componente físico
 *   PCS12_SP_R2   segunda recodificación componente físico
 *   MCS12_SP_R    recodificación componente mental
 *   MCS12_SP_R2   segunda recodificación componente mental
 *
 * Diferencia con Granada:
 *   - Granada/provincia = PROV == 18.0
 *   - Andalucía = sin filtro PROV
 *
 * Uso:
 *   node scripts/export-sf12-andalucia.mjs
 */

import { createReadStream, createWriteStream } from 'node:fs'
import { createInterface } from 'node:readline'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const _dir = dirname(fileURLToPath(import.meta.url))

const SOURCE = resolve(_dir, '..', 'EAS_COMPLETO.csv')
const OUTPUT = resolve(_dir, '..', 'fixtures', 'sf12-eas-andalucia.csv')

const EXPORT_COLS = [
  'PCS12_SP',
  'MCS12_SP',
  'PCS12_SP_R',
  'PCS12_SP_R2',
  'MCS12_SP_R',
  'MCS12_SP_R2',
]

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
const fmt = (n) => Number.isFinite(n) ? n.toFixed(2) : '0.00'

const rl = createInterface({
  input: createReadStream(SOURCE),
  crlfDelay: Infinity,
})

const out = createWriteStream(OUTPUT)

let headerDone = false
let colIndexes = []

let totalRows = 0
let exportedRows = 0

const pcsVals = []
const mcsVals = []

out.write(`${EXPORT_COLS.join(',')}\n`)

for await (const line of rl) {
  const cols = line.split(',')

  if (!headerDone) {
    colIndexes = EXPORT_COLS.map((c) => cols.indexOf(c))
    const missing = EXPORT_COLS.filter((_, i) => colIndexes[i] === -1)

    if (missing.length > 0) {
      throw new Error(`Columnas no encontradas en EAS_COMPLETO.csv: ${missing.join(', ')}`)
    }

    headerDone = true
    continue
  }

  totalRows++

  const values = colIndexes.map((idx) => clean(cols[idx]))
  const [pcsRaw, mcsRaw] = values

  if (pcsRaw && !MISSING_CODES.has(pcsRaw)) {
    const v = Number(pcsRaw)
    if (Number.isFinite(v)) pcsVals.push(v)
  }

  if (mcsRaw && !MISSING_CODES.has(mcsRaw)) {
    const v = Number(mcsRaw)
    if (Number.isFinite(v)) mcsVals.push(v)
  }

  out.write(`${values.join(',')}\n`)
  exportedRows++
}

await new Promise((resolveDone) => out.end(resolveDone))

console.log(`
=== Exportación SF-12 EAS Andalucía ===
Fuente:     EAS_COMPLETO.csv
Filtro:     ninguno — Andalucía completa
Destino:    fixtures/sf12-eas-andalucia.csv

Registros EAS procesados:       ${totalRows}
Registros exportados:           ${exportedRows}

PCS12_SP — Componente físico:
  Válidos:                      ${pcsVals.length}
  Media:                        ${fmt(mean(pcsVals))}
  Mediana:                      ${fmt(median(pcsVals))}
  Desviación típica:            ${fmt(sd(pcsVals))}

MCS12_SP — Componente mental:
  Válidos:                      ${mcsVals.length}
  Media:                        ${fmt(mean(mcsVals))}
  Mediana:                      ${fmt(median(mcsVals))}
  Desviación típica:            ${fmt(sd(mcsVals))}
`)
