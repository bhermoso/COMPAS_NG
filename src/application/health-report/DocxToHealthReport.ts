import { convertToHtml, extractRawText } from "mammoth";
import type {
  HealthReportAuthor,
  HealthReportDocument,
  HealthReportBody,
  HealthReportSection,
} from "../../domain/health-report";
import { parseHealthReportSections } from "./HealthReportSectionParser";

export interface CreateHealthReportDocumentInput {
  arrayBuffer: ArrayBuffer;
  municipalityId: string;
  linkedDocumentId: string;
  sourceFileName: string;
  title: string;
  reportingPeriod?: string;
  authors?: HealthReportAuthor[];
}

// DOCX files converted from ODT (LibreOffice) can produce HTML with hundreds
// of base64-encoded chart images, resulting in multi-MB strings that cause
// browser memory pressure. Stripping data: URIs reduces the HTML from ~6 MB
// to ~200 KB while preserving tables, headings and all text structure.
// The HTML size limit (1 MB after stripping) is a secondary safety net.
const HTML_SIZE_LIMIT_BYTES = 1 * 1024 * 1024;

function stripDataUris(html: string): string {
  return html.replace(/\s+src="data:[^"]+"/g, ' src=""');
}

export async function createHealthReportDocumentFromDocx(
  input: CreateHealthReportDocumentInput
): Promise<HealthReportDocument> {
  // La API node de mammoth acepta { buffer }; la de navegador, { arrayBuffer }.
  // Se elige según el entorno para que el mismo servicio funcione en la app y
  // en el generador de expedientes demo (scripts/demo). El acceso a Buffer se
  // hace vía globalThis para no requerir tipos de Node en el build del navegador.
  const nodeBuffer = (globalThis as {
    Buffer?: { from(data: ArrayBuffer): unknown };
  }).Buffer;
  const mammothInput = (nodeBuffer !== undefined
    ? { buffer: nodeBuffer.from(input.arrayBuffer) }
    : { arrayBuffer: input.arrayBuffer }) as { arrayBuffer: ArrayBuffer };

  // Text extraction always runs first. It is the authoritative content path
  // and must succeed for the load to proceed.
  const textResult = await extractRawText(mammothInput);
  const originalText = textResult.value;

  // HTML conversion is best-effort. DOCX files converted from ODT or containing
  // many embedded charts can produce very large HTML output. Failures here are
  // recoverable: the document is still stored and its text is usable.
  let originalHtml: string | undefined;
  try {
    const htmlResult = await convertToHtml(mammothInput);
    const stripped = stripDataUris(htmlResult.value);
    if (stripped.length <= HTML_SIZE_LIMIT_BYTES) {
      originalHtml = stripped;
    }
    // If still too large after stripping, fall through to text-only mode.
  } catch {
    // HTML conversion failed (unrecognized OOXML structure, memory pressure, etc.).
    // Continue in text-only mode: the document is preserved as a literal source.
  }

  const format: HealthReportBody["format"] = originalHtml !== undefined ? "html" : "plain";
  const tableCount = originalHtml !== undefined
    ? (originalHtml.match(/<table/g) ?? []).length
    : undefined;

  const body: HealthReportBody = {
    originalText,
    originalHtml,
    format,
    charCount: originalText.length,
    tableCount,
    isAuthoritative: true,
  };

  const parsed = parseHealthReportSections({ text: originalText, html: originalHtml });
  const sections: HealthReportSection[] = parsed.length > 0
    ? parsed
    : [{ key: "other", title: input.title, bodyText: originalText, bodyHtml: originalHtml, sortOrder: 0, isAuthoritative: true }];

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
