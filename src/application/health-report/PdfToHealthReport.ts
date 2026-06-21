import type {
  HealthReportAuthor,
  HealthReportBody,
  HealthReportDocument,
} from "../../domain/health-report";
import { parseHealthReportSections } from "./HealthReportSectionParser";
import type { CreateHealthReportDocumentInput } from "./DocxToHealthReport";

// URL del worker resolvible por Vite en build y dev. Vite procesa los patrones
// new URL('...', import.meta.url) y copia el fichero como asset separado.
const PDF_WORKER_SRC = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).href;

export { type CreateHealthReportDocumentInput };

// Extrae texto de todas las páginas del PDF y lo reagrupa por línea.
// Ordena los fragmentos de texto por posición Y (top-to-bottom en coords PDF).
async function extractTextFromPdf(arrayBuffer: ArrayBuffer): Promise<string> {
  const pdfjs = await import("pdfjs-dist");

  if (!pdfjs.GlobalWorkerOptions.workerSrc) {
    pdfjs.GlobalWorkerOptions.workerSrc = PDF_WORKER_SRC;
  }

  const data = new Uint8Array(arrayBuffer);
  const loadingTask = pdfjs.getDocument({
    data,
    useWorkerFetch: false,
  });

  const doc = await loadingTask.promise;
  const numPages = doc.numPages;
  const allLines: string[] = [];

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    const page = await doc.getPage(pageNum);
    const content = await page.getTextContent();

    // Agrupar fragmentos de texto por coordenada Y redondeada (= misma línea visual)
    const lineMap = new Map<number, string[]>();
    for (const item of content.items) {
      if (!("str" in item) || !(item as { str: string }).str.trim()) continue;
      const textItem = item as { str: string; transform: number[] };
      const y = Math.round(textItem.transform[5]);
      if (!lineMap.has(y)) lineMap.set(y, []);
      lineMap.get(y)!.push(textItem.str);
    }

    // Coordenadas Y en orden descendente = líneas de arriba a abajo
    const sortedYs = [...lineMap.keys()].sort((a, b) => b - a);
    for (const y of sortedYs) {
      const line = lineMap.get(y)!.join(" ").trim();
      if (line) allLines.push(line);
    }
  }

  return allLines.join("\n");
}

export async function createHealthReportDocumentFromPdf(
  input: CreateHealthReportDocumentInput
): Promise<HealthReportDocument> {
  const originalText = await extractTextFromPdf(input.arrayBuffer);

  const body: HealthReportBody = {
    originalText,
    format: "plain",
    charCount: originalText.length,
    isAuthoritative: true,
  };

  const parsed = parseHealthReportSections({ text: originalText });
  const sections =
    parsed.length > 0
      ? parsed
      : [
          {
            key: "other" as const,
            title: input.title,
            bodyText: originalText,
            sortOrder: 0,
            isAuthoritative: true as const,
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
    authors: (input.authors ?? []) as HealthReportAuthor[],
    body,
    sections,
    createdAt: now,
    updatedAt: now,
  };
}
