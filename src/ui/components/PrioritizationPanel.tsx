import type { PrioritizationResult } from "../../application/prioritization";

interface PrioritizationPanelProps {
  prioritization: PrioritizationResult;
}

export function PrioritizationPanel({
  prioritization,
}: PrioritizationPanelProps) {
  return (
    <section className="workspace-panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Priorización</p>
          <h2>Candidatas iniciales a priorización</h2>
        </div>
        <p className="panel-note">
          Propuesta preliminar derivada de OIT. No decide prioridades ni ordena
          estratégicamente sin validación humana.
        </p>
      </div>

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
            <span className="status-pill">validar</span>
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
