import type { EvidenceStore } from "../../domain/evidence";

interface EvidenceStorePanelProps {
  evidenceStore: EvidenceStore;
}

export function EvidenceStorePanel({ evidenceStore }: EvidenceStorePanelProps) {
  return (
    <section className="workspace-panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Evidencias registradas</p>
          <h2>Unidades de evidencia</h2>
        </div>
        <p className="panel-note">
          Cada texto procesado genera unidades de evidencia estructurada que
          alimentan la lectura territorial y el análisis de intervención.
        </p>
      </div>

      <div className="document-list">
        {evidenceStore.atoms.length === 0 ? (
          <p className="empty-state">
            Todavía no hay evidencias registradas. Añade documentación en el
            panel superior para generar las primeras unidades de evidencia.
          </p>
        ) : (
          evidenceStore.atoms.map((atom) => (
            <article className="document-row" key={atom.id}>
              <div>
                <p className="document-kind">{atom.kind}</p>
                <h3>{atom.title}</h3>
                <p>{atom.content}</p>
                <p className="panel-note">
                  Origen: {atom.provenance.origin} · Validación humana requerida:{" "}
                  {atom.methodology.requiresHumanValidation ? "sí" : "no"}
                </p>
              </div>
              <span className="status-pill">{atom.confidence}</span>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
