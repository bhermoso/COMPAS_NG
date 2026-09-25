import type { ActionPlanAction, ActionPlanDraft } from "../action-plan";

export type AgendaQuarter = "Q1" | "Q2" | "Q3" | "Q4";

export interface AgendaItemDraft {
  id: string;
  title: string;
  linkedActionId: string;
  suggestedQuarter: AgendaQuarter;
  responsibleProfile: string;
  description: string;
  cautions: string[];
  requiresHumanValidation: true;
}

export interface AgendaDraft {
  title: string;
  annualItems: AgendaItemDraft[];
  cautions: string[];
  requiresHumanValidation: true;
}

export function generateAgendaDraft(actionPlan: ActionPlanDraft): AgendaDraft {
  return {
    title: "Borrador inicial de agenda anual",
    annualItems: actionPlan.actions.map((action, index) =>
      buildAgendaItem(action, index + 1)
    ),
    cautions: [
      "La agenda es una propuesta inicial y no implica compromiso ejecutivo.",
      "Cada actuación debe asignar responsables reales, calendario, recursos y condiciones de ejecución.",
      "No se activa seguimiento ni evaluación hasta que la agenda esté validada.",
      "La distribución trimestral es orientativa y debe ajustarse a ciclos municipales y disponibilidad comunitaria.",
    ],
    requiresHumanValidation: true,
  };
}

function buildAgendaItem(
  action: ActionPlanAction,
  order: number
): AgendaItemDraft {
  return {
    id: `agenda-item-${order}-${action.id}`,
    title: `Programar ${action.title}`,
    linkedActionId: action.id,
    suggestedQuarter: inferQuarter(order),
    responsibleProfile: "Responsable municipal de salud / equipo técnico local",
    description:
      "Convertir la actuación validada en una tarea anual con responsables, calendario, recursos, coordinación comunitaria y criterios de seguimiento.",
    cautions: action.cautions,
    requiresHumanValidation: true,
  };
}

function inferQuarter(order: number): AgendaQuarter {
  const sequence: AgendaQuarter[] = ["Q1", "Q2", "Q3", "Q4"];
  return sequence[(order - 1) % sequence.length];
}
