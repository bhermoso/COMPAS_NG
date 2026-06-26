/**
 * Genera fixtures/sf12-eas-granada.csv desde los microdatos EAS.
 *
 * Extrae las columnas SF-12 de los microdatos oficiales de la Encuesta
 * Andaluza de Salud (EAS) filtrando por la provincia de Granada (PROV=18).
 *
 * Decisión de diseño:
 *   COMPÁS NG consume los campos pre-calculados PCS12_SP y MCS12_SP
 *   (Physical/Mental Component Summary España), no recalcula PCS/MCS
 *   desde los 12 ítems. El algoritmo de puntuación norm-based corresponde
 *   a Vilagut et al. 2008 (Med Clín Barc 130(19):726-735) y se aplica
 *   internamente por la EAS antes de publicar los microdatos.
 *
 * Columnas exportadas:
 *   Puntuaciones canónicas:
 *     PCS12_SP        Physical Component Summary (continua, 0–100)
 *     MCS12_SP        Mental Component Summary (continua, 0–100)
 *     PCS12_SP_R      PCS cuartiles (1–4)
 *     PCS12_SP_R2     PCS bajo mediana (0/1)
 *     MCS12_SP_R      MCS cuartiles (1–4)
 *     MCS12_SP_R2     MCS bajo mediana (0/1)
 *
 *   Ítems canónicos recodificados (trazabilidad y futuro módulo):
 *     RGH1            GH1 — Salud general (1=Mala…5=Excelente)
 *     PF02            PF2 — Esfuerzos moderados (1=Limita mucho…3=No limita)
 *     PF04            PF4 — Subir pisos (misma escala)
 *     rp2             RP2 — Menos de lo deseado por salud física (0=No/1=Sí)
 *     rp3             RP3 — Dejar tareas por salud física (0=No/1=Sí)
 *     RE2             RE2 — Menos de lo deseado por emociones (1=Sí/2=No)
 *     RE3             RE3 — No tan cuidadoso por emociones (1=Sí/2=No)
 *     RBP2            BP2 — Dolor (1=Mucho…5=Nada); RBP2 = 6 − P11
 *     RMH3            MH3 — Calmado/tranquilo (1=Nunca…6=Siempre); RMH3 = 7 − P1201
 *     RVT2            VT2 — Energía (1=Nunca…6=Siempre); RVT2 = 7 − P1202
 *     MH4             MH4 — Desanimado/triste (1=Siempre…6=Nunca)
 *     SF2             SF2 — Función social (1=Siempre…5=Nunca)
 *
 * AVISO: No usar P40 como sustituto de RGH1.
 *   P40 pregunta por la salud "en los últimos 12 meses" (retrospectivo),
 *   mientras que RGH1 pregunta por el estado de salud actual (ítem GH1
 *   canónico del SF-12). Son preguntas distintas con 19.447 discrepancias
 *   verificadas sobre 28.132 pares válidos en los microdatos EAS.
 *
 * Fuente requerida:
 *   EAS_COMPLETO.csv  (en el directorio raíz del proyecto)
 *   — NO usar EAS_microdatos_adulto_READY.csv: carece de MCS12_SP y de
 *     la mayoría de ítems canónicos recodificados (RGH1, rp2, rp3…).
 *
 * Uso:
 *   node scripts/export-sf12-granada.mjs
 *
 * @see fixtures/README.md — documentación completa del fixture.
 * @see audit_eas_variables.csv — metadatos de todas las variables EAS.
 */

import { createReadStream, createWriteStream } from 'node:fs'
import { createInterface } from 'node:readline'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const _dir = dirname(fileURLToPath(import.meta.url))
const SOURCE  = resolve(_dir, '..', 'EAS_COMPLETO.csv')
const OUTPUT  = resolve(_dir, '..', 'fixtures', 'sf12-eas-granada.csv')
const PROV_GRANADA = '18.0'

const SF12_COLS = [
  'PCS12_SP', 'MCS12_SP',
  'PCS12_SP_R', 'PCS12_SP_R2',
  'MCS12_SP_R', 'MCS12_SP_R2',
  'RGH1', 'PF02', 'PF04',
  'rp2', 'rp3', 'RE2', 'RE3',
  'RBP2', 'RMH3', 'RVT2', 'MH4', 'SF2',
]

const MISSING_CODES = new Set(['', '991.0', '993.0', '994.0', '995.0', '996.0', '999.0'])

// ── Lectura y filtrado ───────────────────────────────────────────────────────

const rl = createInterface({ input: createReadStream(SOURCE), crlfDelay: Infinity })
const out = createWriteStream(OUTPUT)

let headerLine = null
let provIdx = -1
let sf12Indexes = []
let totalRows = 0
let exportedRows = 0

for await (const line of rl) {
  if (headerLine === null) {
    // Primera línea: cabecera
    const cols = line.split(',').map(c => c.trim().replace(/^"|"$/g, ''))
    provIdx = cols.indexOf('PROV')
    sf12Indexes = SF12_COLS.map(c => cols.indexOf(c))

    const missing = SF12_COLS.filter((c, i) => sf12Indexes[i] === -1)
    if (missing.length > 0) {
      throw new Error(`Columnas SF-12 no encontradas en EAS_COMPLETO: ${missing.join(', ')}`)
    }
    if (provIdx === -1) {
      throw new Error('Columna PROV no encontrada en EAS_COMPLETO')
    }

    headerLine = SF12_COLS.join(',')
    out.write(headerLine + '\n')
    continue
  }

  totalRows++
  const fields = line.split(',')
  const prov = fields[provIdx]?.trim().replace(/^"|"$/g, '')

  if (prov !== PROV_GRANADA) continue

  const row = sf12Indexes.map(idx => {
    const val = fields[idx]?.trim().replace(/^"|"$/g, '') ?? ''
    return val
  })

  out.write(row.join(',') + '\n')
  exportedRows++
}

await new Promise(resolve => out.end(resolve))

// ── Estadísticos de validación ───────────────────────────────────────────────

const { createReadStream: crs } = await import('node:fs')
const { createInterface: ci } = await import('node:readline')

const rl2 = ci({ input: crs(OUTPUT), crlfDelay: Infinity })
let header2 = null
let pcsVals = []
let mcsVals = []
let row2Count = 0

for await (const line of rl2) {
  if (header2 === null) { header2 = line.split(','); continue }
  row2Count++
  const cols = line.split(',')
  const pcsIdx = header2.indexOf('PCS12_SP')
  const mcsIdx = header2.indexOf('MCS12_SP')

  const pcs = cols[pcsIdx]?.trim()
  const mcs = cols[mcsIdx]?.trim()

  if (pcs && !MISSING_CODES.has(pcs)) {
    const v = parseFloat(pcs)
    if (Number.isFinite(v)) pcsVals.push(v)
  }
  if (mcs && !MISSING_CODES.has(mcs)) {
    const v = parseFloat(mcs)
    if (Number.isFinite(v)) mcsVals.push(v)
  }
}

const mean = arr => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : NaN
const sd = arr => {
  if (arr.length < 2) return NaN
  const m = mean(arr)
  return Math.sqrt(arr.reduce((a, b) => a + (b - m) ** 2, 0) / (arr.length - 1))
}
const median = arr => {
  if (!arr.length) return NaN
  const s = [...arr].sort((a, b) => a - b)
  const mid = Math.floor(s.length / 2)
  return s.length % 2 === 0 ? (s[mid - 1] + s[mid]) / 2 : s[mid]
}

console.log(`
=== Exportación SF-12 Granada ===
Fuente:     EAS_COMPLETO.csv
Filtro:     PROV=${PROV_GRANADA} (Granada)
Destino:    fixtures/sf12-eas-granada.csv
Columnas:   ${SF12_COLS.length}

Registros totales en EAS_COMPLETO: ${totalRows}
Registros exportados (Granada):    ${exportedRows}

PCS12_SP (Physical Component Summary):
  n válidos:   ${pcsVals.length} / ${exportedRows} (${(pcsVals.length/exportedRows*100).toFixed(1)} %)
  missing:     ${exportedRows - pcsVals.length} (${((exportedRows-pcsVals.length)/exportedRows*100).toFixed(1)} %)
  media:       ${mean(pcsVals).toFixed(3)}
  mediana:     ${median(pcsVals).toFixed(3)}
  DT:          ${sd(pcsVals).toFixed(3)}
  min:         ${Math.min(...pcsVals).toFixed(3)}
  max:         ${Math.max(...pcsVals).toFixed(3)}

MCS12_SP (Mental Component Summary):
  n válidos:   ${mcsVals.length} / ${exportedRows} (${(mcsVals.length/exportedRows*100).toFixed(1)} %)
  missing:     ${exportedRows - mcsVals.length} (${((exportedRows-mcsVals.length)/exportedRows*100).toFixed(1)} %)
  media:       ${mean(mcsVals).toFixed(3)}
  mediana:     ${median(mcsVals).toFixed(3)}
  DT:          ${sd(mcsVals).toFixed(3)}
  min:         ${Math.min(...mcsVals).toFixed(3)}
  max:         ${Math.max(...mcsVals).toFixed(3)}
`)
