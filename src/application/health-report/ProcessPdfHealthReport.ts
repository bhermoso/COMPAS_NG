import type { HealthReportDocument } from '../../domain/health-report';
import { extractPdfText } from '../../infrastructure/pdf/extractPdfText';
import { parseHealthReportSections } from './HealthReportSectionParser';

export async function processPdfHealthReport(report: HealthReportDocument, bytes: ArrayBuffer): Promise<HealthReportDocument> {
 const extracted=await extractPdfText(bytes); const now=new Date().toISOString();
 const parsed=extracted.text ? parseHealthReportSections({text:extracted.text}) : [];
 return {...report,
  body:{originalText:extracted.text,format:'plain',charCount:extracted.text.length,isAuthoritative:true},
  sections:parsed.length ? parsed : extracted.text ? [{key:'other',title:report.title,bodyText:extracted.text,sortOrder:0,isAuthoritative:true}] : [],
  pdfExtraction:{version:1,processedAt:now,pageCount:extracted.pageCount,emptyPages:extracted.emptyPages,sha256:extracted.sha256},
  updatedAt:now,
 };
}
