import type { MonitoringDraft } from "../../application/monitoring";

interface Props {
  monitoring: MonitoringDraft;
}

export function MonitoringPanel({ monitoring }: Props) {
  return (
    <section className="workspace-panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Seguimiento</p>
          <h2>{monitoring.title}</h2>
        </div>
      </div>

      <div className="document-list">
        {monitoring.trackedItems.map((item) => (
          <article className="document-row" key={item.id}>
            <div>
              <p className="document-kind">{item.status}</p>
              <h3>{item.title}</h3>
              <ul>
                {item.requiredFields.map((field) => (
                  <li key={field}>{field}</li>
                ))}
              </ul>
            </div>
            <span className="status-pill">pendiente</span>
          </article>
        ))}
      </div>
    </section>
  );
}
