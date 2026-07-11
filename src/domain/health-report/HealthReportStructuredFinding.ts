import type { DocumentId } from "../repository";

export type HealthReportFindingKind =
  | "clinical-indicator"
  | "screening"
  | "mortality"
  | "prevention"
  | "health-behaviour-intervention"
  | "textual-agenda"
  | "declared-limitation"
  | "territorial-comparison";

export type HealthReportGeographyLevel =
  | "district"
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
  | "future-human-hypothesis";

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

export interface HealthReportStructuredTable {
  index: number;
  tableReference: string;
  rows: string[][];
  source: {
    documentId: DocumentId;
    sectionTitle?: string;
  };
  recognizedTopic?: string;
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
  limitations: string[];
  extractionNotes: string[];
}
