import { useState } from "react";
import type { ActionPlanDraft, FrameworkAlignment } from "../../application/action-plan";

interface ActionPlanPanelProps {
  actionPlan: ActionPlanDraft;
  isEmpty?: boolean;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("es-ES", {
    year: "numeric", month: "long", day: "numeric",
  });
}

// ── Subcomponente: bloque de encaje estratégico ───────────────────────────────
// Muestra los frameworkAlignments ya calculados por ActionPlanEngine.
// Se pliega / despliega con un botón local. No genera ningún cálculo nuevo.

function FrameworkAlignmentsBlock({ alignments }: { alignments: FrameworkAlignment[] }) {
  const [open, setOpen] = useState(false);

  if (alignments.length === 0) return null;

  const uniqueFrameworks = [...new Set(alignments.map((a) => a.frameworkId))];

  return (
    <div className="fa-block">
      <button
        className="fa-block__toggle"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className="fa-block__toggle-label">Encaje estratégico</span>
        <span className="fa-block__badges">
          {uniqueFrameworks.map((fid) => (
            <span key={fid} className="fa-badge">{fid}</span>
          ))}
        </span>
        <span className="fa-block__toggle-count">({alignments.length})</span>
        <span className="fa-block__toggle-arrow" aria-hidden="true">
          {open ? "▲" : "▾"}
        </span>
      </button>

      {open && (
        <div className="fa-block__detail">
          {alignments.map((a) => (
            <div key={a.elementId} className={`fa-item fa-item--${a.alignmentType}`}>
              <div className="fa-item__head">
                <span className="fa-item__framework">{a.frameworkId}</span>
                <span className="fa-item__label">{a.elementLabel}</span>
                <span className={`fa-item__type fa-item__type--${a.alignmentType}`}>
                  {a.alignmentType === "direct" ? "directo" : "temático"}
                </span>
              </div>
              <p className="fa-item__note">{a.relevanceNote}</p>
              {a.indicators.length > 0 && (
                <ul className="fa-item__indicators">
                  {a.indicators.map((ind, i) => (
                    <li key={i}>{ind}</li>
                  ))}
                </ul>
              )}
              {a.sourceTrace && (
                <p className="fa-item__trace">{a.sourceTrace}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Panel principal ───────────────────────────────────────────────────────────

export function ActionPlanPanel({ actionPlan, isEmpty = false }: ActionPlanPanelProps) {
  const { pslReference } = actionPlan;

  const provenanceText = (() => {
    if (pslReference.isStale) {
      return "Basado en un Perfil de Salud Local validado que ha quedado desactualizado por cambios posteriores en la evidencia.";
    }
    if (pslReference.status === "validated" && pslReference.validatedAt) {
      const who = pslReference.validatedBy ? ` por ${pslReference.validatedBy}` : "";
      return `Basado en un Perfil de Salud Local validado técnicamente el ${formatDate(pslReference.validatedAt)}${who}.`;
    }
    return "Basado en un Perfil de Salud Local en estado de borrador. Se recomienda validar el perfil antes de formalizar el plan.";
  })();

  const provenanceMod = pslReference.isStale
    ? "plan-psl-provenance--stale"
    : pslReference.status === "validated"
      ? "plan-psl-provenance--validated"
      : "plan-psl-provenance--draft";

  return (
    <section className="workspace-panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Plan de Acción</p>
          <h2>{actionPlan.title}</h2>
        </div>
        <p className="panel-note">
          Borrador técnico inicial. No genera agenda ni compromisos ejecutivos
          hasta validación humana.
        </p>
      </div>

      {/* ── Procedencia: referencia al PSL origen ──────────────── */}
      <div className={`plan-psl-provenance ${provenanceMod}`}>
        {provenanceText}
      </div>

      {isEmpty ? (
        <div className="pipeline-empty-notice">
          <strong>Sin evidencia documental</strong>
          Este borrador de Plan de Acción ha sido generado sobre un pipeline sin evidencia.
          Los objetivos y actuaciones mostrados no representan intervenciones reales.
          Incorpora documentos al repositorio para generar un plan basado en evidencia territorial.
        </div>
      ) : (
        <>
          {/* ── Objetivos con encaje estratégico ───────────────── */}
          <article className="card">
            <h3>Objetivos</h3>
            <ul className="plan-objectives-list">
              {actionPlan.objectives.map((objective) => (
                <li key={objective.id} className="plan-objective-item">
                  <div className="plan-objective-item__head">
                    <strong>{objective.title}</strong>
                    <span className="plan-objective-item__line">
                      {objective.linkedStrategicLine}
                    </span>
                  </div>
                  <FrameworkAlignmentsBlock alignments={objective.frameworkAlignments} />
                </li>
              ))}
            </ul>
          </article>

          {/* ── Actuaciones con encaje estratégico ─────────────── */}
          <div className="document-list">
            {actionPlan.actions.map((action) => (
              <article className="document-row" key={action.id}>
                <div>
                  <p className="document-kind">Actuación</p>
                  <h3>{action.title}</h3>
                  <p>{action.description}</p>
                  <p className="panel-note">
                    Evidencias relacionadas: {action.relatedEvidenceIds.length}
                  </p>
                  {action.cautions.length > 0 && (
                    <ul>
                      {action.cautions.map((caution) => (
                        <li key={caution}>{caution}</li>
                      ))}
                    </ul>
                  )}
                  <FrameworkAlignmentsBlock alignments={action.frameworkAlignments} />
                </div>
                <span className="status-pill">borrador</span>
              </article>
            ))}
          </div>

          <article className="card">
            <h3>Indicadores preliminares</h3>
            <ul>
              {actionPlan.indicators.map((indicator) => (
                <li key={indicator.id}>
                  <strong>{indicator.title}</strong> ({indicator.type}) ·{" "}
                  {indicator.measurementNote}
                </li>
              ))}
            </ul>
          </article>
        </>
      )}

      <article className="card">
        <h3>Cautelas</h3>
        <ul>
          {actionPlan.cautions.map((caution) => (
            <li key={caution}>{caution}</li>
          ))}
        </ul>
      </article>
    </section>
  );
}
