import type { PrioritizationResult } from "../../application/prioritization";
import type { LocalHealthProfileStatus } from "../../domain/health-profile";

interface PrioritizationPanelProps {
  prioritization: PrioritizationResult;
  pslStatus: LocalHealthProfileStatus;
  pslIsStale: boolean;
  hasInsufficientEvidence?: boolean;
}

export function PrioritizationPanel({
  prioritization,
  pslStatus,
  pslIsStale,
  hasInsufficientEvidence = false,
}: PrioritizationPanelProps) {
  const needsValidationWarning = pslStatus === "generated" || pslIsStale;

  // Excluir la candidatura metodológica "ampliar base de evidencia" —
  // es una condición previa, no una prioridad territorial.
  const candidates = prioritization.candidatePriorities.filter(
    (p) => p.sourceAreaId !== "oit-expand-evidence-base"
  );

  return (
    <section className="workspace-panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Priorización técnica</p>
          <h2>Áreas candidatas para deliberación</h2>
        </div>
        <p className="panel-note">
          Propuesta derivada del Perfil de Salud Local. No decide prioridades ni ordena
          estratégicamente sin deliberación humana e institucional.
        </p>
      </div>

      {hasInsufficientEvidence ? (
        <div className="phase-blocked-notice">
          <strong>Base documental insuficiente para deliberación</strong>
          <p className="phase-blocked-notice__note">
            La priorización territorial requiere una base de evidencia suficiente.
            Incorpora el Informe de Salud y los estudios complementarios al repositorio
            antes de iniciar el proceso deliberativo.
          </p>
        </div>
      ) : (
        <>
          {needsValidationWarning && (
            <div className="prio-psl-warning">
              <span className="prio-psl-warning__icon" aria-hidden="true">⚠</span>
              <p className="prio-psl-warning__text">
                {pslIsStale
                  ? "La evidencia del municipio ha cambiado desde que se validó el Perfil de Salud Local. Estas áreas candidatas se basan en un perfil que puede no reflejar el diagnóstico actual."
                  : "El Perfil de Salud Local que alimenta estas áreas candidatas está en borrador y no ha sido validado técnicamente. Los resultados deben considerarse orientativos. Valida el perfil en la pestaña «Perfil de Salud Local» antes de avanzar hacia la priorización formal."}
              </p>
            </div>
          )}

          {candidates.length === 0 ? (
            <p className="empty-state">
              Sin áreas candidatas. Incorpora documentación territorial para generar
              candidaturas técnicas de priorización.
            </p>
          ) : (
            <div className="document-list">
              {candidates.map((priority) => (
                <article className="document-row" key={priority.id}>
                  <div>
                    <p className="document-kind">Área candidata</p>
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
                  <span className="status-pill">Candidata técnica</span>
                </article>
              ))}
            </div>
          )}

          <article className="card">
            <h3>Criterios de revisión deliberativa</h3>
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
        </>
      )}
    </section>
  );
}
