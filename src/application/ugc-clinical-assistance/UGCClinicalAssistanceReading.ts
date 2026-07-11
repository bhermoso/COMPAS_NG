/**
 * N1b — Señales clínico-asistenciales documentadas por UGC.
 *
 * Capa SEPARADA de la base epidemiológica del Informe de Salud (N1a,
 * `HealthReportStructuredReading`). Modela lo que los informes de Vigilancia
 * Integral de la Salud por UGC realmente aportan: una LISTA de nombres de
 * indicadores SELECCIONADOS por el sistema de vigilancia asistencial, sin
 * valores observados, sin referencia numérica, sin desviación típica, sin
 * periodo y sin denominadores verificables.
 *
 * Por tanto cada entrada es una SEÑAL DOCUMENTAL, no un resultado
 * epidemiológico cuantificado. Este módulo NO produce prevalencias, tasas,
 * valores, rankings, diferencias entre UGC ni dirección clínica.
 *
 * Campos deliberadamente AUSENTES del modelo (no se rellenan por inferencia):
 * value, referenceValue, period, direction, exactDenominator.
 */

/** Clasificación documental que el propio informe asigna al bloque de indicadores. */
export type UGCDocumentClassification = "a-mejorar" | "mantener" | "unknown";

/**
 * Familia semántica del indicador, deducida de forma conservadora por patrones
 * del NOMBRE (y, en áreas inequívocas, del área). No es una categoría clínica ni
 * causal. Ante la duda: `unknown` (no se fuerza para reducir desconocidos).
 */
export type UGCIndicatorNature =
  | "care-process" // cobertura o proceso clínico-programático
  | "service-utilization" // utilización de servicios
  | "registered-health-status" // estado de salud registrado
  | "administrative-record" // registro administrativo
  | "assigned-population" // población asignada o BDU
  | "care-quality" // calidad asistencial
  | "assistance-mortality" // mortalidad asistencial
  | "municipal-context" // contexto municipal
  | "unknown";

/** Tipo de denominador PLAUSIBLE (no el denominador exacto, que no consta). */
export type UGCDenominatorType =
  | "assigned-population"
  | "attended-population"
  | "registered-patients"
  | "events"
  | "municipal-resource"
  | "unknown";

/**
 * Una señal documental clínico-asistencial por UGC. No es un dato poblacional.
 * `comparability` es siempre `not-evaluable`: faltan valores, periodos,
 * denominadores, referencias y dirección de la desviación.
 */
export interface UGCClinicalAssistanceSignal {
  id: string;
  documentId: string;
  municipalityId: string;
  ugc: string;
  /** Escala SIEMPRE UGC. Nunca distrito/municipio/barrio/distrito sanitario. */
  territorialScale: "ugc";
  area: string;
  indicatorName: string;
  /** Orden documental (1-based) dentro del documento de origen. */
  ordinal: number;
  /** La clasificación tal cual la escribe el informe ("A mejorar"). */
  documentClassification: UGCDocumentClassification;
  /**
   * Estatus epistémico de esa clasificación: es AUTORÍA DEL DOCUMENTO, no una
   * interpretación de COMPÁS. "A mejorar" NO significa peor valor / menor
   * cobertura / mayor riesgo / dirección negativa conocida.
   */
  documentClassificationStatus: "document-authored-classification";
  indicatorNature: UGCIndicatorNature;
  /** Regla que asignó la familia (para auditar la clasificación). */
  classificationBasis: string;
  denominatorType: UGCDenominatorType;
  /** Inicialmente no evaluable: sin valores/periodos/denominadores/referencia. */
  comparability: "not-evaluable";
  /**
   * El comparador documental "Distrito" es de escala sanitaria NO identificada
   * en el propio documento. No se fija Granada-Metropolitano ni ningún distrito.
   */
  referenceScope: "unknown-sanitary-district";
  /** Fragmento textual literal de origen ("Indicador: …"). */
  sourceFragment: string;
  limitations: string[];
}

/** Coincidencia NOMINAL de un indicador entre UGCs (coincidencia documental). */
export interface UGCNominalCoincidence {
  indicatorName: string;
  /** UGCs en cuyos informes aparece seleccionado ese nombre de indicador. */
  ugcs: string[];
}

export interface UGCClinicalAssistanceDocumentReading {
  documentId: string;
  municipalityId: string;
  ugc: string;
  sourceFileName?: string;
  territorialScale: "ugc";
  /** Áreas en orden de aparición. */
  areas: string[];
  signalCount: number;
  /** Nº de señales documentales por área (recuento documental, no gravedad). */
  signalCountByArea: Record<string, number>;
  /** Familias semánticas presentes en el documento. */
  naturesPresent: UGCIndicatorNature[];
  signals: UGCClinicalAssistanceSignal[];
  limitations: string[];
}

export interface UGCClinicalAssistanceReading {
  present: boolean;
  documents: UGCClinicalAssistanceDocumentReading[];
  /** Todas las señales, SIN agregar ni deduplicar entre UGCs. */
  signals: UGCClinicalAssistanceSignal[];
  /**
   * Indicadores cuyo nombre coincide en más de una UGC. Es una coincidencia
   * DOCUMENTAL de indicadores seleccionados, NO un problema común, ni peor
   * situación compartida, ni prioridad sanitaria.
   */
  nominalCoincidences: UGCNominalCoincidence[];
  limitations: string[];
}
