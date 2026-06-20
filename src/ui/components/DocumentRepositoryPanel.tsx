import type { DocumentKind, MunicipalDocumentRepository } from "../../domain/repository";

const KIND_LABEL: Record<DocumentKind, string> = {
  "health-report": "Informe de Salud",
  "localiza-salud": "Localiza Salud",
  "complementary-study": "Estudio complementario",
  "eas-variable": "Variable EAS",
  "cmi-indicator": "Indicador CMI",
  "community-asset": "Activo comunitario",
  "redcap-export": "Exportación REDCap",
  "territorial-documentation": "Documentación territorial",
  "qualitative-material": "Material cualitativo",
  "longitudinal-evidence": "Evidencia longitudinal",
  other: "Otro documento",
};

const STATUS_LABEL: Record<string, string> = {
  uploaded: "Cargado",
  validated: "Validado",
  rejected: "Rechazado",
  archived: "Archivado",
};

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
            <article
              className={`document-row${document.kind === "health-report" ? " document-row--primary" : ""}`}
              key={document.id}
            >
              <div>
                <p className="document-kind">
                  {KIND_LABEL[document.kind] ?? document.kind}
                </p>
                <h3>
                  {document.title}
                  {document.kind === "health-report" && (
                    <span className="doc-repo__primary-badge">
                      Documento fuente principal
                    </span>
                  )}
                </h3>
                {document.source.system && (
                  <p className="doc-repo__source">{document.source.system}</p>
                )}
              </div>
              <span className="status-pill">
                {STATUS_LABEL[document.status] ?? document.status}
              </span>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
