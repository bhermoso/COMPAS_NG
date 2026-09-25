#!/usr/bin/env node
/**
 * Genera fixtures/ipaq-eas-andalucia.csv desde los microdatos EAS completos.
 *
 * Fuente:
 *   EAS_COMPLETO.csv
 *
 * Columnas:
 *   IPAQ_DICO  campo derivado oficial EAS: alta actividad física
 *   P34A_R     campo derivado EAS: inactividad en tiempo libre
 *
 * Diferencia con Granada:
 *   - Granada/provincia = PROV == 18.0
 *   - Andalucía = sin filtro PROV
 *
 * Uso:
 *   node scripts/export-ipaq-andalucia.mjs
 */

import { createReadStream, createWriteStream } from 'node:fs'
import { createInterface } from 'node:readline'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const _dir = dirname(fileURLToPath(import.meta.url))

const SOURCE = resolve(_dir, '..', 'EAS_COMPLETO.csv')
const OUTPUT = resolve(_dir, '..', 'fixtures', 'ipaq-eas-andalucia.csv')

const EXPORT_COLS = ['IPAQ_DICO', 'P34A_R']
const MISSING_CODES = new Set(['', ' ', '994', '994.0', '995', '995.0', '996', '996.0', '997', '997.0', '998', '998.0', '999', '999.0'])

const clean = (v) => String(v ?? '').trim().replace(/^"|"$/g, '')
const isOne = (v) => v === '1' || v === '1.0'
const isZero = (v) => v === '0' || v === '0.0'
const isValidBinary = (v) => isZero(v) || isOne(v)

const rl = createInterface({
  input: createReadStream(SOURCE),
  crlfDelay: Infinity,
})

const out = createWriteStream(OUTPUT)

let headerDone = false
let colIndexes = []

let totalRows = 0
let exportedRows = 0

let ipaqValid = 0
let ipaqHigh = 0
let ipaqMissing = 0

let p34aValid = 0
let p34aInactive = 0
let p34aMissing = 0

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
  const [ipaq, p34a] = values

  if (!ipaq || MISSING_CODES.has(ipaq)) {
    ipaqMissing++
  } else if (isValidBinary(ipaq)) {
    ipaqValid++
    if (isOne(ipaq)) ipaqHigh++
  }

  if (!p34a || MISSING_CODES.has(p34a)) {
    p34aMissing++
  } else if (isValidBinary(p34a)) {
    p34aValid++
    if (isOne(p34a)) p34aInactive++
  }

  out.write(`${values.join(',')}\n`)
  exportedRows++
}

await new Promise((resolveDone) => out.end(resolveDone))

const pct = (n, d) => d ? (n / d * 100).toFixed(1) : '0.0'

console.log(`
=== Exportación IPAQ-EAS Andalucía ===
Fuente:     EAS_COMPLETO.csv
Filtro:     ninguno — Andalucía completa
Destino:    fixtures/ipaq-eas-andalucia.csv

Registros EAS procesados:         ${totalRows}
Registros exportados:             ${exportedRows}

IPAQ_DICO — Alta actividad física:
  Válidos:                        ${ipaqValid}
  IPAQ_DICO=1 alta actividad:     ${ipaqHigh} (${pct(ipaqHigh, ipaqValid)} %)
  IPAQ_DICO missing/no evaluado:  ${ipaqMissing}

P34A_R — Inactividad en tiempo libre:
  Válidos:                        ${p34aValid}
  P34A_R=1 inactividad ocio:      ${p34aInactive} (${pct(p34aInactive, p34aValid)} %)
  P34A_R missing/no evaluado:     ${p34aMissing}
`)
