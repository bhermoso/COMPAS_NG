import type {
  HealthReportAuthor,
  HealthReportDocument,
} from "../../domain/health-report";
import type { CreateHealthReportDocumentInput } from "./DocxToHealthReport";

export { type CreateHealthReportDocumentInput };

/**
 * Registra un PDF como Informe de Salud preservado íntegramente.
 *
 * No extrae texto, no infiere secciones diagnósticas, no genera EvidenceAtom.
 * El documento se conserva por su nombre de archivo, tipo, municipio y trazabilidad.
 * La lectura diagnóstica se hace sobre el fichero original, no sobre contenido extraído.
 */
export function createHealthReportDocumentFromPdf(
  input: CreateHealthReportDocumentInput
): HealthReportDocument {
  const now = new Date().toISOString();

  return {
    id: crypto.randomUUID(),
    municipalityId: input.municipalityId,
    linkedDocumentId: input.linkedDocumentId,
    sourceFileName: input.sourceFileName,
    title: input.title,
    reportingPeriod: input.reportingPeriod,
    authors: (input.authors ?? []) as HealthReportAuthor[],
    body: {
      originalText: "",
      format: "plain",
      charCount: 0,
      isAuthoritative: true,
    },
    sections: [],
    createdAt: now,
    updatedAt: now,
  };
}
