import type { LT1Result } from "../../application/lt1";

interface LT1PanelProps {
  lt1: LT1Result;
}

export function LT1Panel({ lt1 }: LT1PanelProps) {
  return (
    <section className="workspace-panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">LT1</p>
          <h2>Lectura territorial inicial</h2>
        </div>
        <p className="panel-note">
          Lectura preliminar, no causal y no priorizadora. Requiere validación
          técnica y comunitaria.
        </p>
      </div>

      <article className="card">
        <h3>Síntesis</h3>
        <p>{lt1.summary}</p>
      </article>

      <section className="grid">
        <article className="card">
          <h3>Determinantes</h3>
          <p>{lt1.determinants.length}</p>
        </article>

        <article className="card">
          <h3>Activos</h3>
          <p>{lt1.assets.length}</p>
        </article>

        <article className="card">
          <h3>Indicadores</h3>
          <p>{lt1.indicators.length}</p>
        </article>

        <article className="card">
          <h3>Cautelas</h3>
          <p>{lt1.methodologicalCautions.length}</p>
        </article>
      </section>

      <div className="document-list">
        <h3>Oportunidades preliminares</h3>
        {lt1.preliminaryOpportunities.map((opportunity) => (
          <p key={opportunity}>{opportunity}</p>
        ))}
      </div>
    </section>
  );
}
