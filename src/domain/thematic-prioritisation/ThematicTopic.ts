export interface ThematicTopic {
  id: string;
  label: string;
}

export const MAX_SELECTED_TOPICS = 5;

export const THEMATIC_TOPICS: readonly ThematicTopic[] = [
  { id: "mental-health",       label: "Salud mental y bienestar emocional" },
  { id: "physical-activity",   label: "Actividad física y sedentarismo" },
  { id: "nutrition",           label: "Alimentación y nutrición" },
  { id: "active-ageing",       label: "Envejecimiento activo y saludable" },
  { id: "sexual-reproductive", label: "Salud sexual y reproductiva" },
  { id: "substance-use",       label: "Uso de sustancias y conductas adictivas" },
  { id: "cancer-screening",    label: "Cáncer y cribados preventivos" },
  { id: "cardiovascular",      label: "Enfermedades cardiovasculares" },
  { id: "social-determinants", label: "Determinantes sociales y desigualdad en salud" },
  { id: "community-assets",    label: "Participación comunitaria y activos de salud" },
];
