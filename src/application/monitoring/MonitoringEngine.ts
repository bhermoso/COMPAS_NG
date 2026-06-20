import type { AgendaDraft } from "../agenda";

export type MonitoringStatus =
  | "pending-validation"
  | "planned"
  | "in-progress"
  | "completed";

export interface MonitoringItem {
  id: string;
  agendaItemId: string;
  title: string;
  status: MonitoringStatus;
  requiredFields: string[];
  notes: string[];
  requiresHumanValidation: true;
}

export interface MonitoringDraft {
  title: string;
  trackedItems: MonitoringItem[];
  cautions: string[];
  requiresHumanValidation: true;
}

export function generateMonitoringDraft(
  agenda: AgendaDraft
): MonitoringDraft {
  return {
    title: "Seguimiento inicial de actuaciones",
    trackedItems: agenda.annualItems.map((item, index) => ({
      id: `monitor-${index + 1}-${item.id}`,
      agendaItemId: item.id,
      title: item.title,
      status: "pending-validation",
      requiredFields: [
        "Fecha de inicio",
        "Responsable definitivo",
        "Estado de ejecución",
        "Observaciones",
        "Indicadores asociados",
      ],
      notes: [
        "No registrar ejecución real hasta validación del plan.",
        "Separar claramente planificación y seguimiento efectivo.",
      ],
      requiresHumanValidation: true,
    })),
    cautions: [
      "El seguimiento no implica evaluación de resultados.",
      "Debe existir una agenda validada antes de registrar actividad.",
      "Los cambios de estado requieren intervención humana.",
    ],
    requiresHumanValidation: true,
  };
}
