import type { MonitoringDraft, MonitoringStatus } from "../../application/monitoring";

const STATUS_LABEL: Record<MonitoringStatus, string> = {
  "pending-validation": "Pendiente de validación",
  "planned":            "Planificado",
  "in-progress":        "En ejecución",
  "completed":          "Completado",
};

interface MonitoringPanelProps {
  monitoring: MonitoringDraft;
  isEmpty?: boolean;
  isBlocked?: boolean;
}

export function MonitoringPanel({ monitoring, isEmpty = false, isBlocked = false }: MonitoringPanelProps) {
  return (
    <section className="workspace-panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Seguimiento</p>
          <h2>{monitoring.title}</h2>
        </div>
        <p className="panel-note">
          Registro inicial de actuaciones. No refleja ejecución real hasta
          que exista agenda validada.
        </p>
      </div>

      {isBlocked ? (
        <div className="phase-blocked-notice">
          <strong>Seguimiento no disponible</strong>
          <p>Para activar esta fase se requiere:</p>
          <ul>
            <li>Plan de Acción elaborado y revisado.</li>
            <li>Agenda anual acordada institucionalmente.</li>
          </ul>
          <p className="phase-blocked-notice__note">
            El seguimiento solo tiene sentido cuando existen actuaciones planificadas y
            compromisos institucionales establecidos. No se generan registros sin una
            agenda validada previa.
          </p>
        </div>
      ) : isEmpty ? (
        <div className="pipeline-empty-notice">
          <strong>Sin evidencia documental</strong>
          Este seguimiento ha sido generado sobre un repositorio sin evidencia.
          Los ítems mostrados no reflejan actuaciones en ejecución ni compromisos reales.
          Incorpora documentos al repositorio para activar el seguimiento basado en el Plan de Acción.
        </div>
      ) : (
        <>
          <div className="document-list">
            {monitoring.trackedItems.map((item) => (
              <article className="document-row" key={item.id}>
                <div>
                  <p className="document-kind">{STATUS_LABEL[item.status] ?? item.status}</p>
                  <h3>{item.title}</h3>
                  <ul>
                    {item.requiredFields.map((field) => (
                      <li key={field}>{field}</li>
                    ))}
                  </ul>
                  {item.notes.length > 0 && (
                    <ul className="monitoring-notes">
                      {item.notes.map((note) => (
                        <li key={note} className="monitoring-note">{note}</li>
                      ))}
                    </ul>
                  )}
                </div>
                <span className="status-pill">pendiente</span>
              </article>
            ))}
          </div>

          {monitoring.cautions.length > 0 && (
            <article className="card">
              <h3>Cautelas del seguimiento</h3>
              <ul>
                {monitoring.cautions.map((caution) => (
                  <li key={caution}>{caution}</li>
                ))}
              </ul>
            </article>
          )}
        </>
      )}
    </section>
  );
}
