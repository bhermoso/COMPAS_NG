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

export interface CompasPipelineResult {
  trace: PipelineTraceItem[];
}
