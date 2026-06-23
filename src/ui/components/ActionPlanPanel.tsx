import type { ActionPlanDraft } from "../../application/action-plan";

interface ActionPlanPanelProps {
  actionPlan: ActionPlanDraft;
  isEmpty?: boolean;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("es-ES", {
    year: "numeric", month: "long", day: "numeric",
  });
}

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
          <article className="card">
            <h3>Objetivos</h3>
            <ul>
              {actionPlan.objectives.map((objective) => (
                <li key={objective.id}>
                  <strong>{objective.title}</strong> · {objective.linkedStrategicLine}
                </li>
              ))}
            </ul>
          </article>

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
                  <ul>
                    {action.cautions.map((caution) => (
                      <li key={caution}>{caution}</li>
                    ))}
                  </ul>
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
