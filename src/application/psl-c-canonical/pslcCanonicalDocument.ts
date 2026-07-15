/**
 * pslcCanonicalDocument
 *
 * Documento canónico congelado del Perfil de Salud Local (esquema 2).
 *
 * El documento canónico es la VISTA EDITORIAL INTEGRADA serializada como datos,
 * más una instantánea sellada de procedencia. Pantalla, visor, DOCX, PDF e
 * impresión renderizan esta misma estructura (Art. 17 bis / I-LHPM-8). Se congela
 * en compilación: dejar de ser una función de estado vivo es lo que hace que el
 * mismo artefacto produzca siempre el mismo documento (Art. 17 / I-LHPM-6).
 *
 * PASO 1 (aditivo): este módulo construye y sella el documento; el compilador lo
 * adjunta al artefacto cuando recibe la instantánea de respuestas diagnósticas.
 * Los proyectores (DOCX/PDF) y la pantalla todavía NO lo consumen (pasos 2-3).
 */

import {
  buildProfileIntegratedEditorialView,
  type DiagnosticAnswers,
  type ProfileIntegratedEditorialView,
} from "../health-profile";
import type { LocalHealthProfileStatus } from "../../domain/health-profile";
import type { PSLCSealedCanonicalDocument } from "../../domain/health-profile-artifact";

/** Versión del esquema del documento canónico. Distinta de `artifactVersion`. */
export const PSLC_CANONICAL_SCHEMA_VERSION = 2 as const;

export interface PSLCCanonicalDocumentProvenance {
  /**
   * Instantánea sellada de las respuestas diagnósticas del expediente en el
   * momento de compilación. Es PROCEDENCIA, no fuente de render: ningún proyector
   * la consume. Sirve a auditoría y a la futura lectura de la priorización.
   */
  diagnosticAnswersSnapshot: DiagnosticAnswers;
}

export interface PSLCCanonicalDocument {
  schemaVersion: typeof PSLC_CANONICAL_SCHEMA_VERSION;
  /** Estructura canónica que renderizan pantalla, visor, DOCX, PDF e impresión. */
  editorialView: ProfileIntegratedEditorialView;
  /** Fecha de generación pre-formateada de forma determinista (sin ICU ni TZ). */
  generatedDateLabel: string;
  provenance: PSLCCanonicalDocumentProvenance;
}

// Etiqueta institucional del estado del PSL. Réplica determinista del mapa que la
// pantalla usa hoy (STATUS_LABEL); la paridad exacta de cabecera se consolida en
// el paso 3, cuando pantalla y export lean esta misma estructura congelada.
const PSL_STATUS_LABEL: Record<LocalHealthProfileStatus, string> = {
  generated: "Documento de trabajo",
  review: "En revisión técnica",
  validated: "Validado técnicamente",
  approved: "Aprobado",
  superseded: "Sustituido",
  archived: "Archivado",
};

export function pslStatusLabel(status: LocalHealthProfileStatus): string {
  return PSL_STATUS_LABEL[status];
}

const MESES_ES = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

/**
 * Formateo de fecha determinista e independiente del entorno: usa componentes
 * UTC (no la zona horaria local de la máquina) y nombres de mes fijos (no ICU).
 * Sustituye a `toLocaleDateString`, que depende de los datos ICU del runtime y
 * de la TZ local — dos fuentes de no-reproducibilidad.
 */
export function formatCanonicalDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "fecha no disponible";
  return `${d.getUTCDate()} de ${MESES_ES[d.getUTCMonth()]} de ${d.getUTCFullYear()}`;
}

export interface BuildPSLCCanonicalDocumentInput {
  answers: DiagnosticAnswers;
  territory: string;
  status: LocalHealthProfileStatus;
  informeTitulo?: string;
  /** ISO timestamp de generación del PSL origen (psl.generatedAt). */
  generatedAtISO: string;
}

export function buildPSLCCanonicalDocument(
  input: BuildPSLCCanonicalDocumentInput
): PSLCCanonicalDocument {
  const generatedDateLabel = formatCanonicalDate(input.generatedAtISO);
  const editorialView = buildProfileIntegratedEditorialView(input.answers, {
    territory: input.territory,
    status: pslStatusLabel(input.status),
    informeTitulo: input.informeTitulo,
    generatedDate: generatedDateLabel,
  });
  return {
    schemaVersion: PSLC_CANONICAL_SCHEMA_VERSION,
    editorialView,
    generatedDateLabel,
    provenance: {
      // Clon detach y serializable: la instantánea no aliasa el objeto vivo, de
      // modo que mutar el workspace tras compilar no altera el artefacto.
      diagnosticAnswersSnapshot: JSON.parse(
        JSON.stringify(input.answers)
      ) as DiagnosticAnswers,
    },
  };
}

// djb2: mismo algoritmo determinista y sin dependencias que computePSLHash. El
// documento canónico lleva su propio hash (prefijo `pslc-`) para no alterar el
// `sourceHash` del PSL (prefijo `psl-`), cuya estabilidad protegen otros tests.
function djb2Hex(payload: string): string {
  let hash = 5381;
  for (let i = 0; i < payload.length; i++) {
    hash = ((hash << 5) + hash) ^ payload.charCodeAt(i);
    hash = hash >>> 0;
  }
  return hash.toString(16).padStart(8, "0");
}

export function sealCanonicalDocument(
  doc: PSLCCanonicalDocument
): PSLCSealedCanonicalDocument {
  const payload = JSON.stringify(doc);
  return {
    schemaVersion: PSLC_CANONICAL_SCHEMA_VERSION,
    payload,
    canonicalHash: `pslc-${djb2Hex(payload)}`,
  };
}

/**
 * Rehidrata el documento canónico sellado a su forma estructurada. Es el único
 * punto donde el proyector (capa de aplicación) reconstruye el documento a partir
 * del artefacto: no hay ninguna otra entrada. Devuelve `null` si el sello no es
 * del esquema esperado (artefacto de esquema anterior u opaco no reconocible),
 * para que el proyector caiga con dignidad al camino legacy.
 */
export function readSealedCanonicalDocument(
  sealed: PSLCSealedCanonicalDocument
): PSLCCanonicalDocument | null {
  if (sealed.schemaVersion !== PSLC_CANONICAL_SCHEMA_VERSION) return null;
  try {
    const doc = JSON.parse(sealed.payload) as PSLCCanonicalDocument;
    return doc.schemaVersion === PSLC_CANONICAL_SCHEMA_VERSION ? doc : null;
  } catch {
    return null;
  }
}

export function buildSealedCanonicalDocument(
  input: BuildPSLCCanonicalDocumentInput
): PSLCSealedCanonicalDocument {
  return sealCanonicalDocument(buildPSLCCanonicalDocument(input));
}
