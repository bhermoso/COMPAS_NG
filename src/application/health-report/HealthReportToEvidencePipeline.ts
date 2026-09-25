import { createEvidenceAtom, type EvidenceAtom, type EvidenceAtomKind } from "../../domain/evidence";
import type { HealthReportDocument, HealthReportSectionKey } from "../../domain/health-report";

const SKIP_SECTIONS: ReadonlySet<HealthReportSectionKey> = new Set([
  "title-page",
  "autores",
]);

const MAX_CONTENT_CHARS = 2000;

function sectionKeyToKind(key: HealthReportSectionKey): EvidenceAtomKind {
  switch (key) {
    case "mortalidad":
    case "morbilidad":
    case "cancer":
    case "edo-its":
    case "vacunacion-cribados":
    case "demografia":
      return "indicator";
    case "metodologia":
      return "methodological-caution";
    case "introduccion":
      return "territorial-context";
    case "resultados":
    case "discusion":
    case "conclusiones":
    case "objetivo":
    case "other":
    default:
      return "qualitative-observation";
  }
}

export function healthReportToEvidenceAtoms(report: HealthReportDocument): EvidenceAtom[] {
  return report.sections
    .filter((s) => !SKIP_SECTIONS.has(s.key) && s.bodyText.trim().length > 0)
    .map((section) => {
      const kind = sectionKeyToKind(section.key);
      const raw = section.bodyText.trim();
      const content =
        raw.length > MAX_CONTENT_CHARS
          ? raw.slice(0, MAX_CONTENT_CHARS) + " […]"
          : raw;

      return createEvidenceAtom({
        id: `health-report:${report.linkedDocumentId}:${section.key}:${section.sortOrder}`,
        municipalityId: report.municipalityId,
        kind,
        title: `[Informe de Salud] ${section.title}`,
        content,
        confidence: "medium",
        provenance: {
          origin: "health-report",
          documentId: report.linkedDocumentId,
          sourceLabel: report.title,
          extractedAt: report.createdAt,
        },
        methodology: {
          description:
            "Sección extraída del Informe de Salud municipal. Contenido autorizado. Clasificación heurística por tipo de sección.",
          limitations: [
            "El contenido puede incluir tablas y notas mixtas.",
            "Requiere interpretación técnica contextual antes de alimentar decisiones.",
          ],
          requiresHumanValidation: true,
        },
        tags: ["health-report", section.key, kind],
      });
    });
}
