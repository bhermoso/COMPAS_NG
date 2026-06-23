export type PipelineStage =
  | "integrity"
  | "repository"
  | "evidence"
  | "mit"              // Motor de Interpretación Territorial (Nivel 2)
  | "reconciliacion"   // Motor de Reconciliación Interpretativa (entre Nivel 2 y Nivel 3)
  | "lt1"              // kept for type compatibility — not used in current trace
  | "oit"              // kept for type compatibility — not used in current trace
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
  | "empty"
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
