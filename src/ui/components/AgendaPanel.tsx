import type { AgendaDraft } from "../../application/agenda";

interface AgendaPanelProps {
  agenda: AgendaDraft;
}

export function AgendaPanel({ agenda }: AgendaPanelProps) {
  return (
    <section className="workspace-panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Agenda</p>
          <h2>{agenda.title}</h2>
        </div>
        <p className="panel-note">
          Borrador operativo derivado del Plan de Acción. No activa seguimiento
          ni evaluación hasta validación.
        </p>
      </div>

      <div className="document-list">
        {agenda.annualItems.map((item) => (
          <article className="document-row" key={item.id}>
            <div>
              <p className="document-kind">{item.suggestedQuarter}</p>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <p className="panel-note">
                Perfil responsable: {item.responsibleProfile}
              </p>
              <ul>
                {item.cautions.map((caution) => (
                  <li key={caution}>{caution}</li>
                ))}
              </ul>
            </div>
            <span className="status-pill">borrador</span>
          </article>
        ))}
      </div>

      <article className="card">
        <h3>Cautelas de agenda</h3>
        <ul>
          {agenda.cautions.map((caution) => (
            <li key={caution}>{caution}</li>
          ))}
        </ul>
      </article>
    </section>
  );
}
