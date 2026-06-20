import type { CompasPipelineResult, PipelineStage, PipelineStatus } from "../../domain/pipeline";

const STAGE_LABEL: Record<PipelineStage, string> = {
  "repository":    "Repositorio documental",
  "evidence":      "Evidencias estructuradas",
  "lt1":           "Lectura territorial (LT-1)",
  "oit":           "Oportunidades de intervención",
  "prioritization":"Priorización",
  "epvsa":         "Encaje estratégico EPVSA",
  "action-plan":   "Plan de acción",
  "agenda":        "Agenda anual",
  "monitoring":    "Seguimiento inicial",
  "evaluation":    "Evaluación",
  "longi":         "Seguimiento longitudinal",
  "compiler":      "Compilador",
};

const STATUS_LABEL: Record<PipelineStatus, string> = {
  pending:   "pendiente",
  empty:     "sin datos",
  ready:     "listo",
  partial:   "parcial",
  blocked:   "bloqueado",
  completed: "completado",
};

function statusClass(status: PipelineStatus): string {
  if (status === "partial") return "status-pill status-pill--partial";
  if (status === "empty")   return "status-pill status-pill--empty";
  return "status-pill";
}

interface PipelineTracePanelProps {
  pipeline: CompasPipelineResult;
}

export function PipelineTracePanel({ pipeline }: PipelineTracePanelProps) {
  return (
    <section className="workspace-panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Pipeline</p>
          <h2>Traza de ejecución</h2>
        </div>
        <p className="panel-note">
          Registro de las etapas ejecutadas en esta sesión. No refleja validación
          humana ni aprobación institucional.
        </p>
      </div>

      <div className="document-list">
        {pipeline.trace.map((item) => (
          <article className="document-row" key={item.stage}>
            <div>
              <p className="document-kind">
                {STAGE_LABEL[item.stage] ?? item.stage}
              </p>
              <p className="panel-note">{item.message}</p>
            </div>
            <span className={statusClass(item.status)}>
              {STATUS_LABEL[item.status]}
            </span>
          </article>
        ))}
      </div>
    </section>
  );
}
