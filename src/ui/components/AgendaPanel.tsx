import type { AgendaDraft, AgendaQuarter } from "../../application/agenda";

const QUARTER_LABEL: Record<AgendaQuarter, string> = {
  Q1: "1.er trimestre",
  Q2: "2.º trimestre",
  Q3: "3.er trimestre",
  Q4: "4.º trimestre",
};

interface AgendaPanelProps {
  agenda: AgendaDraft;
  isEmpty?: boolean;
}

export function AgendaPanel({ agenda, isEmpty = false }: AgendaPanelProps) {
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

      {isEmpty ? (
        <div className="pipeline-empty-notice">
          <strong>Sin evidencia documental</strong>
          Esta agenda ha sido generada sobre un pipeline sin evidencia.
          Los ítems mostrados no representan compromisos ejecutivos ni calendarios reales.
          Incorpora documentos al repositorio para obtener una agenda basada en el Plan de Acción.
        </div>
      ) : (
        <div className="document-list">
          {agenda.annualItems.map((item) => (
            <article className="document-row" key={item.id}>
              <div>
                <p className="document-kind">{QUARTER_LABEL[item.suggestedQuarter]}</p>
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
      )}

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
