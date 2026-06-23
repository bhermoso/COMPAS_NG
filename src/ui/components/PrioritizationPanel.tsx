import type { PrioritizationResult } from "../../application/prioritization";
import type { LocalHealthProfileStatus } from "../../domain/health-profile";

interface PrioritizationPanelProps {
  prioritization: PrioritizationResult;
  pslStatus: LocalHealthProfileStatus;
  pslIsStale: boolean;
}

export function PrioritizationPanel({
  prioritization,
  pslStatus,
  pslIsStale,
}: PrioritizationPanelProps) {
  const needsValidationWarning = pslStatus === "generated" || pslIsStale;

  return (
    <section className="workspace-panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Priorización</p>
          <h2>Candidatas iniciales a priorización</h2>
        </div>
        <p className="panel-note">
          Propuesta derivada del Perfil de Salud Local. No decide prioridades ni ordena
          estratégicamente sin validación humana y deliberación institucional.
        </p>
      </div>

      {needsValidationWarning && (
        <div className="prio-psl-warning">
          <span className="prio-psl-warning__icon" aria-hidden="true">⚠</span>
          <p className="prio-psl-warning__text">
            {pslIsStale
              ? "La evidencia del municipio ha cambiado desde que se validó el Perfil de Salud Local. Estas candidaturas se basan en un perfil que puede no reflejar el estado actual del diagnóstico."
              : "El Perfil de Salud Local que alimenta estas candidaturas está en borrador y no ha sido validado técnicamente. Los resultados deben considerarse orientativos. Valida el perfil en la pestaña «Perfil de Salud Local» antes de avanzar hacia la priorización formal."}
          </p>
        </div>
      )}

      <div className="document-list">
        {prioritization.candidatePriorities.map((priority) => (
          <article className="document-row" key={priority.id}>
            <div>
              <p className="document-kind">Candidata</p>
              <h3>{priority.title}</h3>
              <p>{priority.rationale}</p>
              <p className="panel-note">
                Evidencias relacionadas: {priority.relatedEvidenceIds.length}
              </p>
              <ul>
                {priority.cautions.map((caution) => (
                  <li key={caution}>{caution}</li>
                ))}
              </ul>
            </div>
            <span className="status-pill">revisar</span>
          </article>
        ))}
      </div>

      <article className="card">
        <h3>Criterios de revisión</h3>
        <ul>
          {prioritization.criteria.map((criterion) => (
            <li key={criterion}>{criterion}</li>
          ))}
        </ul>
      </article>

      <article className="card">
        <h3>Cautelas</h3>
        <ul>
          {prioritization.cautions.map((caution) => (
            <li key={caution}>{caution}</li>
          ))}
        </ul>
      </article>
    </section>
  );
}
