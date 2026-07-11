import type { DocumentId } from "../repository";

export type HealthReportFindingKind =
  | "clinical-indicator"
  | "screening"
  | "mortality"
  | "prevention"
  | "health-behaviour-intervention"
  | "textual-agenda"
  | "declared-limitation"
  | "territorial-comparison"
  // Incremento 4 — cobertura epidemiológica prioritaria:
  | "demographic-indicator" // estructura demográfica (envejecimiento, dependencia, edad)
  | "material-inequality-indicator" // desigualdad material (desempleo, vulnerabilidad)
  | "epidemiological-event"; // EDO, brotes y alertas (recuentos, no tasas)

export type HealthReportGeographyLevel =
  | "district"
  | "census-district" // distrito censal municipal (Granada capital), NO distrito sanitario
  | "health-care-unit"
  | "municipality"
  | "health-district"
  | "province"
  | "autonomous-community"
  | "unknown";

export interface HealthReportFindingGeography {
  level: HealthReportGeographyLevel;
  label: string;
  isProxyForTargetTerritory: boolean;
}

export interface HealthReportFindingSource {
  documentId: DocumentId;
  sectionTitle?: string;
  tableReference?: string;
  textExcerpt?: string;
}

export type HealthReportInterpretationStatus =
  | "documented-fact"
  | "document-authored-interpretation"
  | "textual-presence";

export type HealthReportInterpretationUse =
  | "sanitary-thread"
  | "chronicity"
  | "ageing"
  | "prevention"
  | "care-access"
  | "health-behaviours"
  | "inequalities"
  | "future-human-hypothesis"
  // Incremento 4 — usos nuevos, deliberadamente distintos de los anteriores para
  // no alterar los siete temas actuales de N3 (que aún no los consumen).
  | "demography"
  | "material-inequality"
  | "surveillance";

export interface HealthReportStructuredFinding {
  id: string;
  kind: HealthReportFindingKind;
  topic: string;
  statement: string;
  value?: number | string;
  unit?: string;
  numerator?: number;
  denominator?: number;
  population?: string;
  geography: HealthReportFindingGeography;
  period?: string;
  source: HealthReportFindingSource;
  limitations: string[];
  interpretationStatus: HealthReportInterpretationStatus;
  interpretationUse: HealthReportInterpretationUse[];
}

export interface HealthReportStructuredSection {
  title: string;
  bodyText: string;
  source: {
    documentId: DocumentId;
    startAnchor?: string;
    endAnchor?: string;
  };
  reconstructionStatus: "from-parser" | "from-text-anchors" | "unknown";
}

/**
 * Estado de extracción de una tabla detectada. Distinguir detectar ≠ reconocer ≠
 * estructurar es esencial para no confundir la cobertura: una tabla detectada
 * pero no interpretable NO significa ausencia epidemiológica.
 */
export type HealthReportTableStructuringStatus =
  | "structured" // reconocida y con hallazgos producidos
  | "recognized-not-structured" // reconocida por tema pero sin hallazgos aún
  | "detected-not-structured"; // detectada sin tema reconocido / no interpretable

export interface HealthReportStructuredTable {
  index: number;
  tableReference: string;
  rows: string[][];
  source: {
    documentId: DocumentId;
    sectionTitle?: string;
  };
  recognizedTopic?: string;
  structuringStatus?: HealthReportTableStructuringStatus;
  /** Motivo cuando no se estructura (fuera de alcance, semántica dudosa, vacío). */
  notStructuredReason?: string;
}

/**
 * Correspondencia territorial explícita (Incremento 4, Prioridad 3): relaciona
 * centro de salud, distrito censal municipal y barriadas. Evita que N3 mezcle
 * escalas (UA ≠ distrito municipal ≠ distrito sanitario).
 */
export interface HealthReportTerritorialCorrespondence {
  centroSalud?: string;
  censusDistrict?: string;
  neighbourhoods: string[];
  source: {
    documentId: DocumentId;
    tableReference: string;
    textExcerpt?: string;
  };
}

export interface HealthReportStructuredReading {
  present: boolean;
  documentId?: DocumentId;
  charCount: number;
  originalTextAvailable: boolean;
  originalTableCount?: number;
  sections: HealthReportStructuredSection[];
  tables: HealthReportStructuredTable[];
  findings: HealthReportStructuredFinding[];
  /** Correspondencias territoriales estructuradas (Prioridad 3). */
  territorialCorrespondences: HealthReportTerritorialCorrespondence[];
  limitations: string[];
  extractionNotes: string[];
}
