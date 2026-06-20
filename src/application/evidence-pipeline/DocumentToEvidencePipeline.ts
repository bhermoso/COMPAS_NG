import type { MunicipalDocument } from "../../domain/repository";
import {
  addEvidenceAtom,
  type EvidenceStore,
  createEvidenceAtom,
  type EvidenceAtom,
  type EvidenceAtomKind,
} from "../../domain/evidence";

export interface TransformDocumentToEvidenceInput {
  store: EvidenceStore;
  document: MunicipalDocument;
  plainText: string;
}

export interface TransformDocumentToEvidenceResult {
  store: EvidenceStore;
  atomsCreated: EvidenceAtom[];
}

export function transformDocumentToEvidence(
  input: TransformDocumentToEvidenceInput
): TransformDocumentToEvidenceResult {
  const lines = input.plainText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  let store = input.store;
  const atomsCreated: EvidenceAtom[] = [];

  for (let index = 0; index < lines.length; index++) {
    const content = lines[index];
    const kind = classifyEvidenceKind(content, input.document.kind);

    const atom = createEvidenceAtom({
      id: `${input.document.id}-atom-${index + 1}`,
      municipalityId: input.store.municipalityId,
      kind,
      title: extractAtomTitle(content, kind, index + 1),
      content,
      provenance: {
        origin: mapDocumentKindToEvidenceOrigin(input.document.kind),
        documentId: input.document.id,
        sourceLabel: input.document.title,
        extractedAt: new Date().toISOString(),
      },
      methodology: {
        description:
          "Extracción textual inicial. Requiere revisión técnica antes de alimentar decisiones.",
        limitations: [
          "Clasificación heurística inicial.",
          "No establece causalidad.",
          "No prioriza automáticamente.",
        ],
        requiresHumanValidation: true,
      },
      tags: [input.document.kind, kind],
    });

    store = addEvidenceAtom(store, atom);
    atomsCreated.push(atom);
  }

  return {
    store,
    atomsCreated,
  };
}

function classifyEvidenceKind(
  text: string,
  documentKind: MunicipalDocument["kind"]
): EvidenceAtomKind {
  const normalized = text.toLowerCase();

  // Heurística textual — tiene prioridad sobre el tipo de documento
  if (
    normalized.includes("tasa") ||
    normalized.includes("porcentaje") ||
    normalized.includes("%") ||
    normalized.includes("prevalencia") ||
    normalized.includes("incidencia") ||
    normalized.includes("mortalidad")
  ) {
    return "indicator";
  }

  if (
    normalized.includes("determinante") ||
    normalized.includes("desigualdad") ||
    normalized.includes("vulnerabilidad") ||
    normalized.includes("renta") ||
    normalized.includes("empleo") ||
    normalized.includes("educación") ||
    normalized.includes("vivienda")
  ) {
    return "determinant";
  }

  if (
    normalized.includes("activo") ||
    normalized.includes("asociación") ||
    normalized.includes("recurso comunitario") ||
    normalized.includes("equipamiento") ||
    normalized.includes("red comunitaria")
  ) {
    return "asset";
  }

  if (
    normalized.includes("participación") ||
    normalized.includes("ciudadanía") ||
    normalized.includes("grupo focal") ||
    normalized.includes("entrevista") ||
    normalized.includes("encuesta")
  ) {
    return "participation";
  }

  if (
    normalized.includes("cautela") ||
    normalized.includes("limitación") ||
    normalized.includes("sesgo") ||
    normalized.includes("muestra") ||
    normalized.includes("representatividad")
  ) {
    return "methodological-caution";
  }

  // Fallback semántico: el tipo de documento es un prior fuerte
  // cuando el texto no contiene patrones reconocibles
  if (documentKind === "community-asset" || documentKind === "localiza-salud") {
    return "asset";
  }

  if (documentKind === "eas-variable" || documentKind === "cmi-indicator") {
    return "indicator";
  }

  if (documentKind === "redcap-export") {
    return "participation";
  }

  return "qualitative-observation";
}

function extractAtomTitle(
  content: string,
  kind: EvidenceAtomKind,
  index: number
): string {
  if (kind === "asset" && content.includes("|")) {
    const firstField = content.split("|")[0].trim();
    if (firstField.length > 0) return firstField;
  }
  return buildTitle(kind, index);
}

function buildTitle(kind: EvidenceAtomKind, index: number): string {
  const labels: Record<EvidenceAtomKind, string> = {
    indicator: "Indicador detectado",
    determinant: "Determinante detectado",
    asset: "Activo detectado",
    participation: "Hallazgo participativo",
    "qualitative-observation": "Observación cualitativa",
    "territorial-context": "Contexto territorial",
    "sample-quality": "Calidad muestral",
    "longitudinal-snapshot": "Snapshot longitudinal",
    "strategic-priority": "Prioridad estratégica",
    "methodological-caution": "Cautela metodológica",
    other: "Evidencia",
  };

  return `${labels[kind]} ${index}`;
}

function mapDocumentKindToEvidenceOrigin(
  kind: MunicipalDocument["kind"]
): EvidenceAtom["provenance"]["origin"] {
  switch (kind) {
    case "health-report":
      return "health-report";
    case "complementary-study":
      return "complementary-study";
    case "eas-variable":
      return "eas";
    case "cmi-indicator":
      return "cmi";
    case "community-asset":
      return "community-assets";
    case "localiza-salud":
      return "localiza-salud";
    case "redcap-export":
      return "redcap";
    case "longitudinal-evidence":
      return "longi";
    default:
      return "other";
  }
}
