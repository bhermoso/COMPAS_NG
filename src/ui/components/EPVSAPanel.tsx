import type { EPVSATranslationResult } from "../../application/epvsa";

interface EPVSAPanelProps {
  epvsa: EPVSATranslationResult;
}

export function EPVSAPanel({ epvsa }: EPVSAPanelProps) {
  return (
    <section className="workspace-panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">EPVSA</p>
          <h2>Traducción estratégica inicial</h2>
        </div>
        <p className="panel-note">
          Sugerencias prudentes de encaje estratégico. No sustituyen validación
          técnica, institucional ni comunitaria.
        </p>
      </div>

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
            <span className="status-pill">validar</span>
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
    </section>
  );
}
