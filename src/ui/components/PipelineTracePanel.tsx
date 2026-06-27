import { useState } from "react";
import type { CompasPipelineResult, PipelineStage, PipelineStatus } from "../../domain/pipeline";

// ── Secciones del análisis territorial ───────────────────────────────────────
const SECTION_A = new Set<PipelineStage>([
  "integrity", "repository", "evidence",
  "prioritization", "epvsa", "action-plan",
  "agenda", "monitoring", "evaluation", "compiler",
]);

const SECTION_B = new Set<PipelineStage>([
  "mit", "reconciliacion", "lt1", "oit",
]);

// ── Etiquetas institucionales ─────────────────────────────────────────────────

const STAGE_LABEL: Record<PipelineStage, string> = {
  "integrity":       "Validación de la evidencia",
  "repository":      "Repositorio documental",
  "evidence":        "Evidencias estructuradas",
  "mit":             "Lectura territorial",
  "reconciliacion":  "Interpretación territorial",
  "lt1":             "Diagnóstico territorial",
  "oit":             "Áreas de intervención",
  "prioritization":  "Priorización",
  "epvsa":           "Encaje estratégico",
  "action-plan":     "Plan de Acción",
  "agenda":          "Agenda anual",
  "monitoring":      "Seguimiento",
  "evaluation":      "Evaluación",
  "longi":           "Dimensión longitudinal",
  "compiler":        "Compilador",
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
  const [open, setOpen] = useState(false);

  const sectionA = pipeline.trace.filter((item) => SECTION_A.has(item.stage));
  const sectionB = pipeline.trace.filter((item) => SECTION_B.has(item.stage));
  const sectionC = pipeline.trace.filter(
    (item) => !SECTION_A.has(item.stage) && !SECTION_B.has(item.stage)
  );

  // Cuenta de etapas con estado no trivial para el resumen del header
  const readyCount  = pipeline.trace.filter((i) => i.status === "ready" || i.status === "completed").length;
  const totalCount  = pipeline.trace.length;

  function renderItems(items: typeof pipeline.trace) {
    return items.map((item) => (
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
    ));
  }

  return (
    <section className="workspace-panel ev-store-panel">
      <button
        type="button"
        className="ev-store-panel__toggle"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span className="ev-store-panel__toggle-label">
          Trazabilidad técnica del análisis
        </span>
        <span className="ev-store-panel__toggle-sub">
          {readyCount} de {totalCount} etapas completadas · Solo visible para auditoría técnica
        </span>
        <span className="ev-store-panel__toggle-arrow" aria-hidden="true">
          {open ? "▲" : "▼"}
        </span>
      </button>

      {open && (
        <div className="ev-store-panel__body">
          {/* A — Proceso documental y de planificación */}
          {sectionA.length > 0 && (
            <>
              <p className="pipeline-section-label">Proceso documental y de planificación</p>
              <div className="document-list">
                {renderItems(sectionA)}
              </div>
            </>
          )}

          {/* B — Lectura e interpretación territorial */}
          {sectionB.length > 0 && (
            <>
              <p className="pipeline-section-label">Lectura e interpretación territorial</p>
              <div className="document-list">
                {renderItems(sectionB)}
              </div>
            </>
          )}

          {/* C — Dimensiones internas */}
          {sectionC.length > 0 && (
            <>
              <p className="pipeline-section-label">Dimensiones de análisis interno</p>
              <div className="document-list">
                {renderItems(sectionC)}
              </div>
            </>
          )}
        </div>
      )}
    </section>
  );
}
