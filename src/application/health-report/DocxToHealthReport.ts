import { convertToHtml, extractRawText } from "mammoth";
import type {
  HealthReportAuthor,
  HealthReportDocument,
  HealthReportBody,
  HealthReportSection,
} from "../../domain/health-report";

export interface CreateHealthReportDocumentInput {
  arrayBuffer: ArrayBuffer;
  municipalityId: string;
  linkedDocumentId: string;
  sourceFileName: string;
  title: string;
  reportingPeriod?: string;
  authors?: HealthReportAuthor[];
}

export async function createHealthReportDocumentFromDocx(
  input: CreateHealthReportDocumentInput
): Promise<HealthReportDocument> {
  const [textResult, htmlResult] = await Promise.all([
    extractRawText({ arrayBuffer: input.arrayBuffer }),
    convertToHtml({ arrayBuffer: input.arrayBuffer }),
  ]);

  const originalText = textResult.value;
  const originalHtml = htmlResult.value;
  const tableCount = (originalHtml.match(/<table/g) ?? []).length;

  const body: HealthReportBody = {
    originalText,
    originalHtml,
    format: "html",
    charCount: originalText.length,
    tableCount,
    isAuthoritative: true,
  };

  // Primera sección: documento íntegro como bloque único, pendiente de segmentación.
  const sections: HealthReportSection[] = [
    {
      key: "other",
      title: input.title,
      bodyText: originalText,
      bodyHtml: originalHtml,
      sortOrder: 0,
      isAuthoritative: true,
    },
  ];

  const now = new Date().toISOString();

  return {
    id: crypto.randomUUID(),
    municipalityId: input.municipalityId,
    linkedDocumentId: input.linkedDocumentId,
    sourceFileName: input.sourceFileName,
    title: input.title,
    reportingPeriod: input.reportingPeriod,
    authors: input.authors ?? [],
    body,
    sections,
    createdAt: now,
    updatedAt: now,
  };
}
