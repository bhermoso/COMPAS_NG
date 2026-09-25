import type { OITResult } from "../../application/oit";

interface OITPanelProps {
  oit: OITResult;
}

export function OITPanel({ oit }: OITPanelProps) {
  return (
    <section className="workspace-panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Áreas de intervención</p>
          <h2>Oportunidades iniciales de intervención territorial</h2>
        </div>
        <p className="panel-note">
          Traducción prudente de la lectura territorial en oportunidades preliminares.
          No prioriza, no asigna líneas EPVSA y requiere validación humana.
        </p>
      </div>

      <div className="document-list">
        {oit.opportunities.map((opportunity) => (
          <article className="document-row" key={opportunity.id}>
            <div>
              <p className="document-kind">Área de intervención</p>
              <h3>{opportunity.title}</h3>
              <p>{opportunity.rationale}</p>
              <p className="panel-note">
                Evidencias relacionadas: {opportunity.relatedEvidenceIds.length}
              </p>
              <ul>
                {opportunity.cautions.map((caution) => (
                  <li key={caution}>{caution}</li>
                ))}
              </ul>
            </div>
            <span className="status-pill">Propuesta asistida</span>
          </article>
        ))}
      </div>
    </section>
  );
}
