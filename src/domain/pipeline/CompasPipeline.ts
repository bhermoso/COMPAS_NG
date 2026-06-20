import type { MunicipalityWorkspace } from "../workspace";

export type PipelineStage =
  | "repository"
  | "evidence"
  | "lt1"
  | "oit"
  | "prioritization"
  | "epvsa"
  | "action-plan"
  | "agenda"
  | "monitoring"
  | "evaluation"
  | "longi"
  | "compiler";

export type PipelineStatus =
  | "pending"
  | "ready"
  | "partial"
  | "blocked"
  | "completed";

export interface PipelineTraceItem {
  stage: PipelineStage;
  status: PipelineStatus;
  message: string;
  createdAt: string;
}

export interface TerritorialReading {
  summary: string;
  determinants: string[];
  assets: string[];
  vulnerabilities: string[];
  cautions: string[];
}

export interface TerritorialInterventionOpportunity {
  id: string;
  title: string;
  rationale: string;
  relatedEvidenceIds: string[];
  cautions: string[];
}

export interface PrioritizationProposal {
  opportunities: TerritorialInterventionOpportunity[];
  criteria: string[];
  requiresHumanValidation: true;
}

export interface EpvsaTranslation {
  strategicLines: string[];
  rationale: string;
  requiresHumanValidation: true;
}

export interface ActionPlanDraft {
  title: string;
  objectives: string[];
  actions: string[];
  indicators: string[];
  requiresHumanValidation: true;
}

export interface CompasPipelineResult {
  workspace: MunicipalityWorkspace;
  lt1: TerritorialReading | null;
  oit: TerritorialInterventionOpportunity[];
  prioritization: PrioritizationProposal | null;
  epvsa: EpvsaTranslation | null;
  actionPlan: ActionPlanDraft | null;
  trace: PipelineTraceItem[];
}

export function createEmptyPipelineResult(
  workspace: MunicipalityWorkspace
): CompasPipelineResult {
  const now = new Date().toISOString();

  return {
    workspace,
    lt1: null,
    oit: [],
    prioritization: null,
    epvsa: null,
    actionPlan: null,
    trace: [
      {
        stage: "repository",
        status: "ready",
        message: "Workspace municipal creado como raíz del pipeline.",
        createdAt: now,
      },
    ],
  };
}
