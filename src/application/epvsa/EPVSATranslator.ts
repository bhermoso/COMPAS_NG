import type {
  CandidatePriority,
  PrioritizationResult,
} from "../prioritization";

export type EPVSAStrategicLine =
  | "LE1"
  | "LE2"
  | "LE3"
  | "LE4"
  | "pending-review";

export interface StrategicLineSuggestion {
  id: string;
  candidatePriorityId: string;
  candidateTitle: string;
  suggestedLine: EPVSAStrategicLine;
  suggestedLineLabel: string;
  rationale: string;
  cautions: string[];
  relatedEvidenceIds: string[];
  requiresHumanValidation: true;
}

export interface EPVSATranslationResult {
  suggestions: StrategicLineSuggestion[];
  generalCautions: string[];
  requiresHumanValidation: true;
}

export function translatePrioritizationToEPVSA(
  prioritization: PrioritizationResult
): EPVSATranslationResult {
  return {
    suggestions: prioritization.candidatePriorities.map((priority, index) =>
      buildStrategicLineSuggestion(priority, index + 1)
    ),
    generalCautions: [
      "La traducción EPVSA es orientativa y no sustituye deliberación técnica, institucional ni comunitaria.",
      "Una misma prioridad puede relacionarse con más de una línea estratégica.",
      "No debe usarse esta traducción como selección automática de líneas EPVSA.",
      "La asignación final debe revisar políticas autonómicas, competencias locales, activos disponibles y factibilidad.",
    ],
    requiresHumanValidation: true,
  };
}

function buildStrategicLineSuggestion(
  priority: CandidatePriority,
  order: number
): StrategicLineSuggestion {
  const normalized = `${priority.title} ${priority.rationale}`.toLowerCase();
  const suggestedLine = inferStrategicLine(normalized);

  return {
    id: `epvsa-${order}-${priority.id}`,
    candidatePriorityId: priority.id,
    candidateTitle: priority.title,
    suggestedLine,
    suggestedLineLabel: labelForStrategicLine(suggestedLine),
    rationale: buildRationale(suggestedLine),
    cautions: [
      ...priority.cautions,
      "Revisar correspondencia con la estrategia autonómica antes de incorporarla al Plan Local de Salud.",
    ],
    relatedEvidenceIds: priority.relatedEvidenceIds,
    requiresHumanValidation: true,
  };
}

function inferStrategicLine(text: string): EPVSAStrategicLine {
  if (
    text.includes("activo") ||
    text.includes("comunitario") ||
    text.includes("participación") ||
    text.includes("ciudadanía") ||
    text.includes("red")
  ) {
    return "LE1";
  }

  if (
    text.includes("determinante") ||
    text.includes("desigualdad") ||
    text.includes("vulnerabilidad") ||
    text.includes("renta") ||
    text.includes("empleo") ||
    text.includes("vivienda")
  ) {
    return "LE3";
  }

  if (
    text.includes("indicador") ||
    text.includes("evaluación") ||
    text.includes("seguimiento") ||
    text.includes("cautela") ||
    text.includes("metodológica")
  ) {
    return "LE4";
  }

  return "pending-review";
}

function labelForStrategicLine(line: EPVSAStrategicLine): string {
  const labels: Record<EPVSAStrategicLine, string> = {
    LE1: "LE1 · Acción local en salud y comunidad",
    LE2: "LE2 · Entornos y estilos de vida saludables",
    LE3: "LE3 · Equidad, determinantes sociales y vulnerabilidades",
    LE4: "LE4 · Gobernanza, evaluación y conocimiento para la salud",
    "pending-review": "Pendiente de revisión técnica",
  };

  return labels[line];
}

function buildRationale(line: EPVSAStrategicLine): string {
  switch (line) {
    case "LE1":
      return "La candidata contiene elementos de comunidad, participación, redes o activos locales que sugieren una posible relación con acción local en salud.";
    case "LE2":
      return "La candidata podría relacionarse con entornos o estilos de vida saludables, pero requiere evidencia más específica.";
    case "LE3":
      return "La candidata contiene determinantes sociales, desigualdades o vulnerabilidades que sugieren una posible relación con equidad.";
    case "LE4":
      return "La candidata contiene elementos de evaluación, seguimiento, indicadores o cautelas metodológicas.";
    case "pending-review":
      return "No hay evidencia textual suficiente para sugerir una línea EPVSA con prudencia.";
  }
}
