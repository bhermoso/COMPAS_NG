import type { CompasPipelineResult, PipelineStatus } from "../../domain/pipeline";

interface PipelineTracePanelProps {
  pipeline: CompasPipelineResult;
}

function statusLabel(status: PipelineStatus): string {
  const labels: Record<PipelineStatus, string> = {
    pending:   "pendiente",
    ready:     "listo",
    partial:   "parcial",
    blocked:   "bloqueado",
    completed: "completado",
  };
  return labels[status];
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
              <p className="document-kind">{item.stage}</p>
              <p className="panel-note">{item.message}</p>
            </div>
            <span
              className={
                item.status === "partial"
                  ? "status-pill status-pill--partial"
                  : "status-pill"
              }
            >
              {statusLabel(item.status)}
            </span>
          </article>
        ))}
      </div>
    </section>
  );
}
