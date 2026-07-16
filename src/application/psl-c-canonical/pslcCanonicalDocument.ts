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
import type {
  LocalHealthProfileStatus,
  PSLPriorizacion,
} from "../../domain/health-profile";
import type { PSLCSealedCanonicalDocument } from "../../domain/health-profile-artifact";

/** Versión del esquema del documento canónico. Distinta de `artifactVersion`. */
export const PSLC_CANONICAL_SCHEMA_VERSION = 2 as const;

/**
 * Estatuto de la lectura territorial del Perfil (Paso 4).
 *
 * - `"integrated"`: el diagnóstico tiene lectura territorial integrada (hay al
 *   menos un hilo en `editorialView.territorialReadings`, que solo existe cuando
 *   la evidencia produce señales).
 * - `"prioritization-pending"`: el Perfil es válido por la regla N+1 (Art. 7 bis
 *   A / I-LHPM-7) —típicamente por priorización ciudadana— pero todavía no hay
 *   lectura territorial atomizada. El documento se declara DIGNO y explicita que
 *   la lectura está pendiente (Popay: conocimiento pendiente, no ausencia). No se
 *   fabrica lectura: `territorialReadings` permanece vacío.
 */
export type PSLCReadingStatus = "integrated" | "prioritization-pending";

/**
 * Declaración explícita de lectura territorial pendiente para el documento digno
 * `prioritization-pending`. Es un enunciado de pendencia (Popay), no una lectura
 * fabricada. Constante compartida para que pantalla, visor, DOCX y PDF declaren
 * lo mismo (Art. 17 bis / I-LHPM-8: modelo canónico único).
 */
export const PRIORITIZATION_PENDING_DECLARATION =
  "La lectura territorial integrada está pendiente: este Perfil es válido por la " +
  "regla N+1 —el Informe de Salud interpretado junto a al menos una fuente adicional " +
  "(estudios complementarios, activos y capacidades, o priorización ciudadana)—, pero " +
  "esa fuente todavía no sostiene una lectura territorial atomizada. Es conocimiento " +
  "pendiente de incorporación, no ausencia de conocimiento; el documento no fabrica " +
  "una lectura que la evidencia aún no permite. Cuando la priorización ciudadana está " +
  "presente, su incorporación interpretativa como evidencia queda explícitamente pendiente.";

export interface PSLCCanonicalDocumentProvenance {
  /**
   * Instantánea sellada de las respuestas diagnósticas del expediente en el
   * momento de compilación. Es PROCEDENCIA, no fuente de render: ningún proyector
   * la consume. Sirve a auditoría y a la futura lectura de la priorización.
   */
  diagnosticAnswersSnapshot: DiagnosticAnswers;
  /**
   * Instantánea sellada de la priorización del PSL en el momento de compilación
   * (Paso 4). Es PROCEDENCIA detach y serializable: sostiene el estatuto N+1 del
   * documento `prioritization-pending` (caso Zagra) y deja la puerta abierta a la
   * futura lectura de la priorización (Fase 3) sin cambiar esquema. Entra en el
   * payload sellado y, por tanto, en el `canonicalHash`.
   */
  prioritizationSnapshot: PSLPriorizacion;
}

/**
 * Contexto mínimo y coherente del PSL que el compilador entrega al documento
 * canónico (Paso 4). El documento canónico NO accede al PSL ni al workspace: la
 * decisión de `readingStatus` y el sellado de la priorización se toman solo con
 * este contexto. Evita alterar el builder compartido `buildProfileIntegratedEditorialView`,
 * que también alimenta la pantalla viva.
 */
export interface PSLCReadingContext {
  /** Nº de EvidenceAtoms del PSL. El Informe NO atomiza (Art. 7 bis §3). */
  totalEvidenceAtoms: number;
  complementaryStudyCount: number;
  assetCount: number;
  /** Presencia/resultado de la priorización ciudadana (participativa). */
  hasParticipatoryPrioritisation: boolean;
  /** Instantánea de `psl.priorizacion` para sellar en `provenance`. */
  prioritizacion: PSLPriorizacion;
}

export interface PSLCCanonicalDocument {
  schemaVersion: typeof PSLC_CANONICAL_SCHEMA_VERSION;
  /** Estructura canónica que renderizan pantalla, visor, DOCX, PDF e impresión. */
  editorialView: ProfileIntegratedEditorialView;
  /**
   * Estatuto de la lectura territorial (Paso 4). Se deriva de la propia
   * `editorialView` y entra en el payload sellado y en el `canonicalHash`.
   */
  readingStatus: PSLCReadingStatus;
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
  /** Contexto compilado del PSL: decide `readingStatus` y sella la priorización. */
  pslContext: PSLCReadingContext;
}

/** Clon detach y serializable: no aliasa el objeto vivo, de modo que mutar el
 *  PSL/workspace tras compilar no altera el artefacto sellado. */
function detachClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export function buildPSLCCanonicalDocument(
  input: BuildPSLCCanonicalDocumentInput
): PSLCCanonicalDocument {
  const { pslContext: ctx } = input;
  const generatedDateLabel = formatCanonicalDate(input.generatedAtISO);
  // El builder compartido NO se altera (alimenta también la pantalla viva): puede
  // producir hilos de agenda aunque no haya evidencia atomizada.
  const editorialView = buildProfileIntegratedEditorialView(input.answers, {
    territory: input.territory,
    status: pslStatusLabel(input.status),
    informeTitulo: input.informeTitulo,
    generatedDate: generatedDateLabel,
  });

  // El estatuto de lectura lo decide el CONTEXTO COMPILADO del PSL (Art. 7 bis §3:
  // el Informe no atomiza; solo estudios/activos generan átomos). Para declarar
  // «integrated» no basta con contadores: se exige EVIDENCIA REAL que pueda
  // sostener lectura, con concordancia entre el contexto (contadores del PSL) y los
  // answers compilados (estructuras derivadas de la evidencia):
  //   - estudios reales: ctx.complementaryStudyCount > 0 Y answers.estudios.totalStudies > 0;
  //   - activos reales:  ctx.assetCount > 0 Y answers.salutogenica.totalAssets > 0.
  // Así un átomo de origen no elegible (o contadores falsificados sin respaldo en
  // los answers) no puede colar hilos de andamiaje como lectura integrada.
  const hasRealStudies =
    ctx.complementaryStudyCount > 0 && input.answers.estudios.totalStudies > 0;
  const hasRealAssets =
    ctx.assetCount > 0 && input.answers.salutogenica.totalAssets > 0;
  const hasReadingBearingEvidence = hasRealStudies || hasRealAssets;

  // «integrated» requiere: evidencia atomizada + al menos una fuente real
  // (estudios/activos) + al menos un hilo territorial compilado. En cualquier otro
  // caso válido por N+1 (p. ej. Zagra: Informe + priorización, 0 átomos) la lectura
  // está PENDIENTE: el documento es digno pero NO fabrica hilos, así que su copia
  // canónica vacía `territorialReadings`.
  const readingStatus: PSLCReadingStatus =
    ctx.totalEvidenceAtoms > 0 &&
    hasReadingBearingEvidence &&
    editorialView.territorialReadings.length > 0
      ? "integrated"
      : "prioritization-pending";

  // El vaciado ocurre AQUÍ, sobre la copia canónica, no en el builder compartido.
  const canonicalEditorialView: ProfileIntegratedEditorialView =
    readingStatus === "prioritization-pending"
      ? { ...editorialView, territorialReadings: [] }
      : editorialView;

  return {
    schemaVersion: PSLC_CANONICAL_SCHEMA_VERSION,
    editorialView: canonicalEditorialView,
    readingStatus,
    generatedDateLabel,
    provenance: {
      diagnosticAnswersSnapshot: detachClone(input.answers),
      prioritizationSnapshot: detachClone(ctx.prioritizacion),
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
