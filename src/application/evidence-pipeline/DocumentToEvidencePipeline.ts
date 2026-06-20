import type { MunicipalDocument } from "../../domain/repository";
import {
  addEvidenceAtom,
  upsertEvidenceAtom,
  stableAssetKey,
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
      title: resolveAtomTitle(content, kind, input.document.kind, index + 1),
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

    if (input.document.kind === "localiza-salud") {
      const key = stableAssetKey(atom.municipalityId, atom.provenance.origin, atom.title);
      store = upsertEvidenceAtom(store, atom, key);
    } else {
      store = addEvidenceAtom(store, atom);
    }
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
  // Para localiza-salud y community-asset el tipo documental es un prior absoluto:
  // todas sus líneas son activos comunitarios, sin excepción textual.
  if (documentKind === "localiza-salud" || documentKind === "community-asset") {
    return "asset";
  }

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
  if (documentKind === "eas-variable" || documentKind === "cmi-indicator") {
    return "indicator";
  }

  if (documentKind === "redcap-export") {
    return "participation";
  }

  return "qualitative-observation";
}

function resolveAtomTitle(
  content: string,
  kind: EvidenceAtomKind,
  documentKind: MunicipalDocument["kind"],
  index: number
): string {
  if (documentKind === "localiza-salud") {
    return extractLocalizaSaludTitle(content, index);
  }
  return extractAtomTitle(content, kind, index);
}

function extractLocalizaSaludTitle(content: string, index: number): string {
  if (content.includes("|")) {
    const first = content.split("|")[0].trim();
    if (first.length > 0) return first;
  }

  if (content.includes("\t")) {
    const first = content.split("\t")[0].trim();
    if (first.length > 0) return first;
  }

  // Patrones que inician la descripción en Localiza Salud (no son nombres de activo)
  const lowerContent = content.toLowerCase();
  const descriptionStarters = [
    "los centros",
    "grupos de",
    "piscina pública",
    "los puntos",
    "en este taller",
    "las piscinas",
    "este centro",
    "este taller",
  ];
  for (const starter of descriptionStarters) {
    const idx = lowerContent.indexOf(starter);
    if (idx > 0) {
      const candidate = content.slice(0, idx).trim();
      if (candidate.length > 0) return candidate;
    }
  }

  return buildTitle("asset", index);
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
