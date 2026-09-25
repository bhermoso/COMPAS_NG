/**
 * Genera fixtures/sueno-eas-granada.csv desde los microdatos EAS.
 *
 * Extrae las columnas de sueño de la Encuesta Andaluza de Salud (EAS)
 * filtrando por la provincia de Granada (PROV = 18.0).
 *
 * Decisión de diseño:
 *   COMPÁS NG consume los campos derivados oficiales de la EAS:
 *     - P33_R   (sueño insuficiente en cantidad, campo derivado EAS)
 *     - P33A    (sueño no reparador en calidad subjetiva, ítem directo EAS)
 *   Ninguno de estos campos es el PSQI ni ninguna escala validada externa.
 *   Son indicadores propios de la EAS para monitorización del sueño en la
 *   población andaluza. No deben presentarse con la etiqueta PSQI.
 *
 * Columnas exportadas:
 *
 *   Campos canónicos (cobertura amplia):
 *     P33_R          Sueño insuficiente en horas (0=No / 1=Sí). Derivado por EAS
 *                    según criterios de la Sociedad Española del Sueño. Missing ~2 %.
 *     P33A           "¿Las horas que duerme le permiten descansar lo suficiente?"
 *                    (0=No / 1=Sí). Mide calidad subjetiva percibida. Missing ~25 %.
 *
 *   Campos de trazabilidad — oleada 2023 únicamente (missing ~70 %):
 *     P33_1_2023     Horas de sueño entre semana (valor numérico). Missing estructural.
 *     P33B1_2023     "¿Dificultades para dormirse?" (1=Nunca…4=Diariamente)
 *     P33B2_2023     "¿Se despierta durante la noche?" (ídem escala)
 *     P33B3_2023     "¿Se despierta demasiado temprano?" (ídem)
 *     P33B4_2023     "¿Se siente cansado/a al despertar?" (ídem)
 *     P33B5_2023     "¿Toma algún remedio para dormir (no farmacológico)?" (ídem)
 *     ProblemasDormirP33b  Problemas diarios: cualquier P33Bx=4 (0=No / 1=Sí). Derivado.
 *
 * AVISO: P33_R y P33A miden dimensiones DISTINTAS y complementarias del sueño:
 *   P33_R  = cantidad (horas dormidas vs. recomendación normativa SES)
 *   P33A   = calidad subjetiva percibida (¿permite descansar?)
 *   Se espera discordancia del ~29 % entre ambas: personas que duermen suficientes
 *   horas pero no descansan, y quienes duermen menos pero se sienten bien.
 *   No es un error de datos; refleja dimensiones independientes del sueño.
 *
 * Fuente requerida:
 *   EAS_COMPLETO.csv (en el directorio raíz del proyecto)
 *   — P33_R y ProblemasDormirP33b solo están en EAS_COMPLETO, no en READY.
 *
 * Uso:
 *   node scripts/export-sueno-granada.mjs
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
const OUTPUT = resolve(_dir, '..', 'fixtures', 'sueno-eas-granada.csv')
const PROV_GRANADA = '18.0'

const EXPORT_COLS = [
  'P33_R',
  'P33A',
  'P33_1_2023',
  'P33B1_2023',
  'P33B2_2023',
  'P33B3_2023',
  'P33B4_2023',
  'P33B5_2023',
  'ProblemasDormirP33b',
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
  if (prov !== PROV_GRANADA) continue

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

// Contadores P33_R
let p33r0 = 0, p33r1 = 0, p33rMiss = 0
// Contadores P33A
let p33a0 = 0, p33a1 = 0, p33aMiss = 0
// Horas P33_1_2023
let hoursVals = []
// ProblemasDormirP33b
let prob0 = 0, prob1 = 0, probMiss = 0

for await (const line of rl2) {
  if (!hdr2) { hdr2 = line.split(','); continue }
  const cols = line.split(',')

  const idx33r   = hdr2.indexOf('P33_R')
  const idx33a   = hdr2.indexOf('P33A')
  const idx33_1  = hdr2.indexOf('P33_1_2023')
  const idxProb  = hdr2.indexOf('ProblemasDormirP33b')

  // P33_R
  const raw33r = cols[idx33r]?.trim()
  if (!raw33r || MISSING_CODES.has(raw33r)) { p33rMiss++ }
  else if (raw33r === '0.0' || raw33r === '0') { p33r0++ }
  else if (raw33r === '1.0' || raw33r === '1') { p33r1++ }
  else { p33rMiss++ }

  // P33A
  const raw33a = cols[idx33a]?.trim()
  if (!raw33a || MISSING_CODES.has(raw33a)) { p33aMiss++ }
  else if (raw33a === '0.0' || raw33a === '0') { p33a0++ }
  else if (raw33a === '1.0' || raw33a === '1') { p33a1++ }
  else { p33aMiss++ }

  // P33_1_2023 (horas, numérico)
  const rawH = cols[idx33_1]?.trim()
  if (rawH && !MISSING_CODES.has(rawH)) {
    const v = parseFloat(rawH)
    if (Number.isFinite(v) && v >= 1 && v <= 24) hoursVals.push(v)
  }

  // ProblemasDormirP33b
  const rawProb = cols[idxProb]?.trim()
  if (!rawProb || MISSING_CODES.has(rawProb)) { probMiss++ }
  else if (rawProb === '0.0' || rawProb === '0') { prob0++ }
  else if (rawProb === '1.0' || rawProb === '1') { prob1++ }
  else { probMiss++ }
}

const p33rValid = p33r0 + p33r1
const p33aValid = p33a0 + p33a1
const probValid = prob0 + prob1
const hoursMean = hoursVals.length
  ? hoursVals.reduce((a, b) => a + b, 0) / hoursVals.length
  : NaN

console.log(`
=== Exportación Sueño EAS Granada ===
Fuente:     EAS_COMPLETO.csv
Filtro:     PROV=${PROV_GRANADA} (Granada)
Destino:    fixtures/sueno-eas-granada.csv
Columnas:   ${EXPORT_COLS.length}

Registros totales en EAS_COMPLETO: ${totalRows}
Registros exportados (Granada):    ${exportedRows}

P33_R — Sueño insuficiente en horas (campo derivado EAS, cobertura ~98 %):
  n válidos:              ${p33rValid} / ${exportedRows} (${(p33rValid/exportedRows*100).toFixed(1)} %)
  missing:                ${p33rMiss} (${(p33rMiss/exportedRows*100).toFixed(1)} %)
  P33_R=0 (sí suficiente): ${p33r0} (${(p33r0/p33rValid*100).toFixed(1)} %)
  P33_R=1 (no suficiente): ${p33r1} (${(p33r1/p33rValid*100).toFixed(1)} %)

P33A — Calidad subjetiva: ¿descansa suficiente? (ítem directo EAS):
  n válidos:              ${p33aValid} / ${exportedRows} (${(p33aValid/exportedRows*100).toFixed(1)} %)
  missing:                ${p33aMiss} (${(p33aMiss/exportedRows*100).toFixed(1)} %)
  P33A=0 (no descansa):   ${p33a0} (${(p33a0/p33aValid*100).toFixed(1)} %)
  P33A=1 (sí descansa):   ${p33a1} (${(p33a1/p33aValid*100).toFixed(1)} %)

P33_1_2023 — Horas de sueño diarias (solo oleada 2023):
  n válidos:              ${hoursVals.length} / ${exportedRows} (${(hoursVals.length/exportedRows*100).toFixed(1)} %)
  media:                  ${hoursMean.toFixed(2)} h
  rango:                  ${hoursVals.length ? Math.min(...hoursVals) : '—'} – ${hoursVals.length ? Math.max(...hoursVals) : '—'} h

ProblemasDormirP33b — Problemas de sueño diarios (solo oleada 2023):
  n válidos:              ${probValid} / ${exportedRows} (${(probValid/exportedRows*100).toFixed(1)} %)
  missing:                ${probMiss} (${(probMiss/exportedRows*100).toFixed(1)} %)
  Problemas diarios (=1): ${prob1} (${probValid > 0 ? (prob1/probValid*100).toFixed(1) : '—'} %)
`)
