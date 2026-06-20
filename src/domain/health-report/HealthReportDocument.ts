import type { MunicipalityId } from "../municipality";
import type { DocumentId } from "../repository";

export type HealthReportSectionKey =
  | "title-page"
  | "introduccion"
  | "objetivo"
  | "metodologia"
  | "resultados"
  | "demografia"
  | "mortalidad"
  | "morbilidad"
  | "cancer"
  | "edo-its"
  | "vacunacion-cribados"
  | "discusion"
  | "conclusiones"
  | "autores"
  | "other";

export type HealthReportBodyFormat = "html" | "plain";

export interface HealthReportBody {
  originalText: string;
  originalHtml?: string;
  format: HealthReportBodyFormat;
  charCount: number;
  tableCount?: number;
  isAuthoritative: true;
}

export interface HealthReportSection {
  key: HealthReportSectionKey;
  title: string;
  bodyText: string;
  bodyHtml?: string;
  sortOrder: number;
  isAuthoritative: true;
}

export interface HealthReportDocument {
  id: string;
  municipalityId: MunicipalityId;
  linkedDocumentId: DocumentId;
  sourceFileName: string;
  title: string;
  reportingPeriod?: string;
  authors?: string[];
  body: HealthReportBody;
  sections: HealthReportSection[];
  createdAt: string;
  updatedAt: string;
}
