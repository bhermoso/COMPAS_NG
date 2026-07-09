/**
 * healthReportSanitaryReading
 *
 * El Informe de salud como HILO SANITARIO del Perfil: lectura sustantiva y
 * trazable del cuerpo del Informe (texto ya extraído en la ingesta), basada
 * en PRESENCIA REAL de términos sanitarios — nunca en valores inventados.
 *
 * Reglas:
 *   - D-HR-01 intacta: no se generan EvidenceAtoms del Informe; esto es una
 *     lectura para narrativa, con el documento preservado íntegro.
 *   - Solo se reporta una dimensión si sus términos aparecen de verdad en el
 *     texto del Informe; las magnitudes exactas quedan en el documento.
 *   - Denominación institucional del Informe: nunca nombres técnicos de
 *     archivo ni etiquetas históricas («estilo Atarfe»).
 */

import type { HealthReportDocument } from "../../domain/health-report";

// ── Denominación institucional del Informe ────────────────────────────────────

const TITULOS_INSTITUCIONALES: Record<string, string> = {
  "granada-zaidin": "Informe de salud de El Zaidín",
};

/**
 * Título visible del Informe en producto (pantalla, PSL-C, DOCX, PDF).
 * Cae al título crudo saneado (sin extensión ni etiquetas técnicas) cuando
 * el municipio no tiene denominación institucional registrada.
 */
export function institutionalHealthReportTitle(
  municipalityId: string,
  rawTitle: string
): string {
  const institucional = TITULOS_INSTITUCIONALES[municipalityId];
  if (institucional !== undefined) return institucional;
  return rawTitle
    .replace(/\.(docx|pdf|doc|odt)$/i, "")
    .replace(/\s+estilo\s+\S+.*$/i, "")
    .trim();
}

// ── Lectura sanitaria por presencia ───────────────────────────────────────────

export interface HealthReportSanitarySignal {
  /** Dimensión sanitaria (agrupación de términos). */
  dimension: string;
  /** Términos de la dimensión realmente presentes en el Informe. */
  terminos: string[];
  /** Total de menciones de esos términos en el cuerpo del Informe. */
  menciones: number;
}

export interface HealthReportSanitaryReading {
  present: boolean;
  /** Señales sanitarias detectadas, ordenadas por peso de menciones. */
  senales: HealthReportSanitarySignal[];
  /** Secciones sanitarias del Informe (títulos reales). */
  seccionesSanitarias: string[];
  /** Qué no permite leer el Informe (declarado, no rellenado). */
  sinResolver: string[];
  charCount: number;
}

// Taxonomía sanitaria conservadora: dimensión → términos (sin acentos).
const TAXONOMIA_SANITARIA: Array<{ dimension: string; terminos: string[] }> = [
  { dimension: "mortalidad y esperanza de vida", terminos: ["mortalidad", "esperanza de vida"] },
  { dimension: "cáncer y tumores", terminos: ["cancer", "tumores", "tumor"] },
  {
    dimension: "enfermedades crónicas (diabetes, hipertensión, cardiovascular)",
    terminos: ["cronic", "diabetes", "hipertension", "cardiovascular", "circulatorio"],
  },
  { dimension: "salud mental y malestar emocional", terminos: ["salud mental", "depresion", "ansiedad"] },
  { dimension: "consumos de tabaco y alcohol", terminos: ["tabaco", "alcohol", "tabaquismo"] },
  { dimension: "alimentación, sobrepeso y obesidad", terminos: ["obesidad", "sobrepeso", "alimentacion"] },
  { dimension: "actividad física y sedentarismo", terminos: ["sedentari", "actividad fisica"] },
  { dimension: "envejecimiento y dependencia", terminos: ["envejecimiento", "dependencia"] },
  { dimension: "prevención y vacunación", terminos: ["vacunacion", "cribado"] },
  {
    dimension: "condiciones socioeconómicas y desigualdad",
    terminos: ["desigualdad", "renta", "paro", "desempleo", "vivienda"],
  },
];

const SECCION_SANITARIA_RE =
  /epidemiol|problemas de salud|factores de riesgo|encuesta andaluza|sociodemogr/i;

function aTextoPlano(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

function contar(texto: string, termino: string): number {
  return texto.split(termino).length - 1;
}

export function buildHealthReportSanitaryReading(
  healthReport: HealthReportDocument | undefined
): HealthReportSanitaryReading {
  if (!healthReport || !healthReport.body?.originalText) {
    return {
      present: false,
      senales: [],
      seccionesSanitarias: [],
      sinResolver: [],
      charCount: 0,
    };
  }

  const texto = aTextoPlano(healthReport.body.originalText);
  const senales: HealthReportSanitarySignal[] = [];
  for (const grupo of TAXONOMIA_SANITARIA) {
    const presentes: string[] = [];
    let menciones = 0;
    for (const termino of grupo.terminos) {
      const n = contar(texto, aTextoPlano(termino));
      if (n > 0) {
        presentes.push(termino);
        menciones += n;
      }
    }
    if (presentes.length > 0) {
      senales.push({ dimension: grupo.dimension, terminos: presentes, menciones });
    }
  }
  senales.sort((a, b) => b.menciones - a.menciones);

  const seccionesSanitarias = healthReport.sections
    .filter((s) => SECCION_SANITARIA_RE.test(s.title))
    .map((s) => s.title);

  return {
    present: true,
    senales,
    seccionesSanitarias: [...new Set(seccionesSanitarias)],
    sinResolver: [
      "la mayor parte de los apartados no desagrega al nivel del distrito",
      "las magnitudes exactas deben leerse en el propio Informe",
    ],
    charCount: texto.length,
  };
}
