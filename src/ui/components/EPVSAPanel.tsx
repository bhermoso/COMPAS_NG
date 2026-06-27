import type { EPVSATranslationResult } from "../../application/epvsa";

interface EPVSAPanelProps {
  epvsa: EPVSATranslationResult;
  isBlocked?: boolean;
}

export function EPVSAPanel({ epvsa, isBlocked = false }: EPVSAPanelProps) {
  return (
    <section className="workspace-panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Encaje estratégico</p>
          <h2>Traducción estratégica inicial</h2>
        </div>
        <p className="panel-note">
          Sugerencias prudentes de encaje con el marco EPVSA. No sustituyen
          validación técnica, institucional ni comunitaria.
        </p>
      </div>

      {isBlocked ? (
        <div className="phase-blocked-notice">
          <strong>Encaje estratégico no disponible</strong>
          <p>Para activar esta fase se requiere:</p>
          <ul>
            <li>Perfil de Salud Local validado técnicamente.</li>
            <li>Priorización territorial realizada.</li>
            <li>Revisión técnica previa de la propuesta de intervención.</li>
          </ul>
          <p className="phase-blocked-notice__note">
            Completa y valida el Perfil de Salud Local antes de avanzar al encaje estratégico.
          </p>
        </div>
      ) : (
        <>
          <div className="document-list">
            {epvsa.suggestions.map((suggestion) => (
              <article className="document-row" key={suggestion.id}>
                <div>
                  <p className="document-kind">{suggestion.suggestedLine}</p>
                  <h3>{suggestion.candidateTitle}</h3>
                  <p><strong>{suggestion.suggestedLineLabel}</strong></p>
                  <p>{suggestion.rationale}</p>
                  <p className="panel-note">
                    Evidencias relacionadas: {suggestion.relatedEvidenceIds.length}
                  </p>
                  <ul>
                    {suggestion.cautions.map((caution) => (
                      <li key={caution}>{caution}</li>
                    ))}
                  </ul>
                </div>
                <span className="status-pill">Propuesta asistida</span>
              </article>
            ))}
          </div>

          <article className="card">
            <h3>Cautelas generales</h3>
            <ul>
              {epvsa.generalCautions.map((caution) => (
                <li key={caution}>{caution}</li>
              ))}
            </ul>
          </article>
        </>
      )}
    </section>
  );
}
