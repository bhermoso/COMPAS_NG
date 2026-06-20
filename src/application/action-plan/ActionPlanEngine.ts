import type {
  EPVSATranslationResult,
  StrategicLineSuggestion,
} from "../epvsa";

export interface ActionPlanObjective {
  id: string;
  title: string;
  linkedStrategicLine: string;
  rationale: string;
}

export interface ActionPlanAction {
  id: string;
  title: string;
  description: string;
  linkedObjectiveId: string;
  relatedEvidenceIds: string[];
  cautions: string[];
}

export interface ActionPlanIndicator {
  id: string;
  title: string;
  type: "process" | "output" | "outcome";
  linkedActionId: string;
  measurementNote: string;
}

export interface ActionPlanDraft {
  title: string;
  objectives: ActionPlanObjective[];
  actions: ActionPlanAction[];
  indicators: ActionPlanIndicator[];
  cautions: string[];
  requiresHumanValidation: true;
}

export function generateActionPlanDraft(
  epvsa: EPVSATranslationResult
): ActionPlanDraft {
  const objectives = epvsa.suggestions.map((suggestion, index) =>
    buildObjective(suggestion, index + 1)
  );

  const actions = epvsa.suggestions.map((suggestion, index) =>
    buildAction(suggestion, objectives[index].id, index + 1)
  );

  const indicators = actions.flatMap((action, index) =>
    buildIndicators(action, index + 1)
  );

  return {
    title: "Borrador inicial de Plan de Acción Local en Salud",
    objectives,
    actions,
    indicators,
    cautions: [
      ...epvsa.generalCautions,
      "Este plan es un borrador técnico inicial y no sustituye aprobación institucional.",
      "Las acciones deben revisarse con responsables municipales, ciudadanía y profesionales.",
      "Los indicadores son preliminares y deben concretarse con fuentes, línea base, periodicidad y responsables.",
      "No se genera agenda anual hasta que las acciones hayan sido validadas.",
    ],
    requiresHumanValidation: true,
  };
}

function buildObjective(
  suggestion: StrategicLineSuggestion,
  order: number
): ActionPlanObjective {
  return {
    id: `objective-${order}-${suggestion.id}`,
    title: `Objetivo ${order}: abordar ${suggestion.candidateTitle}`,
    linkedStrategicLine: suggestion.suggestedLineLabel,
    rationale:
      "Objetivo preliminar derivado de una candidata priorizada y traducida de forma prudente a EPVSA.",
  };
}

function buildAction(
  suggestion: StrategicLineSuggestion,
  linkedObjectiveId: string,
  order: number
): ActionPlanAction {
  return {
    id: `action-${order}-${suggestion.id}`,
    title: `Actuación ${order}: intervención comunitaria sobre ${suggestion.candidateTitle}`,
    description:
      "Diseñar una actuación local revisable que conecte evidencia municipal, activos disponibles, participación comunitaria y marco estratégico autonómico.",
    linkedObjectiveId,
    relatedEvidenceIds: suggestion.relatedEvidenceIds,
    cautions: suggestion.cautions,
  };
}

function buildIndicators(
  action: ActionPlanAction,
  order: number
): ActionPlanIndicator[] {
  return [
    {
      id: `indicator-process-${order}-${action.id}`,
      title: "Indicador de proceso",
      type: "process",
      linkedActionId: action.id,
      measurementNote:
        "Definir actividades realizadas, sesiones, reuniones, productos generados o hitos de implementación.",
    },
    {
      id: `indicator-output-${order}-${action.id}`,
      title: "Indicador de cobertura/producto",
      type: "output",
      linkedActionId: action.id,
      measurementNote:
        "Definir población, colectivos, activos, entidades o recursos alcanzados por la actuación.",
    },
    {
      id: `indicator-outcome-${order}-${action.id}`,
      title: "Indicador de resultado prudente",
      type: "outcome",
      linkedActionId: action.id,
      measurementNote:
        "Definir cambios esperados observables sin atribuir causalidad automática al plan.",
    },
  ];
}
