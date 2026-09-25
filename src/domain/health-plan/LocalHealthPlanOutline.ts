/**
 * Proyección evolutiva del futuro Plan Local de Salud.
 * Puede consultarse antes de registrar actuaciones y no satisface los gates de compilación.
 */
export const LOCAL_HEALTH_PLAN_OUTLINE_STATUS = "evolving-outline" as const;

export type LocalHealthPlanOutlinePendingSection =
  | "actions"
  | "implementation-agenda"
  | "monitoring"
  | "evaluation"
  | "institutional-approval";

export interface LocalHealthPlanOutlineStrategicItem {
  lineId: string;
  lineTitle: string;
  strategicObjective: string;
  generalObjectives: Array<{
    code: string;
    title: string;
    specificObjectives: Array<{
      code: string;
      title: string;
      indicator?: { code: string; title: string };
    }>;
  }>;
}

export interface LocalHealthPlanOutline {
  schemaVersion: 1;
  status: typeof LOCAL_HEALTH_PLAN_OUTLINE_STATUS;
  municipalityId: string;
  municipalityName: string;
  province: string;
  proposedPlanningPeriod: string;
  generatedAt: string;
  diagnostic: {
    pslStatus: string;
    pslCompiled: boolean;
    healthReportTitle?: string;
  };
  selectedPriorities: string[];
  strategicArchitecture: LocalHealthPlanOutlineStrategicItem[];
  pendingSections: LocalHealthPlanOutlinePendingSection[];
  isCongealed: false;
  isInstitutionalDocument: false;
}
