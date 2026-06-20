import type { MunicipalDocumentRepository } from "../../domain/repository";

interface DocumentRepositoryPanelProps {
  repository: MunicipalDocumentRepository;
}

export function DocumentRepositoryPanel({ repository }: DocumentRepositoryPanelProps) {
  const { documents } = repository;

  return (
    <section className="workspace-panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Repositorio documental</p>
          <h2>
            Documentos registrados
            {documents.length > 0 && (
              <span className="doc-repo__count">{documents.length}</span>
            )}
          </h2>
        </div>
        <p className="panel-note">
          Fuentes documentales cargadas en este espacio de trabajo municipal.
          Cada documento alimenta el análisis territorial según su tipo.
        </p>
      </div>

      {documents.length === 0 ? (
        <p className="empty-state">
          Todavía no hay documentos registrados. Usa el panel superior para
          añadir el primero.
        </p>
      ) : (
        <div className="document-list">
          {documents.map((document) => (
            <article className="document-row" key={document.id}>
              <div>
                <p className="document-kind">{document.kind}</p>
                <h3>{document.title}</h3>
                {document.source.system && (
                  <p className="doc-repo__source">{document.source.system}</p>
                )}
              </div>
              <span className="status-pill">{document.status}</span>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
