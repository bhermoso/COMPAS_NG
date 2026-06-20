import type {
  DocumentKind,
  MunicipalDocument,
  MunicipalDocumentRepository,
} from "../../domain/repository";

interface DocumentKindOption {
  value: DocumentKind;
  label: string;
}

interface DocumentIngestionPanelProps {
  documentKinds: DocumentKindOption[];
  repository: MunicipalDocumentRepository;
  kind: DocumentKind;
  title: string;
  plainText: string;
  lastProcessedDocument: MunicipalDocument | null;
  onKindChange: (kind: DocumentKind) => void;
  onTitleChange: (title: string) => void;
  onPlainTextChange: (plainText: string) => void;
  onProcessDocument: () => void;
}

export function DocumentIngestionPanel({
  documentKinds,
  repository,
  kind,
  title,
  plainText,
  lastProcessedDocument,
  onKindChange,
  onTitleChange,
  onPlainTextChange,
  onProcessDocument,
}: DocumentIngestionPanelProps) {
  return (
    <section className="workspace-panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Repositorio documental municipal</p>
          <h2>Añadir documentación municipal</h2>
        </div>
        <p className="panel-note">
          Pega el texto de cualquier documento municipal —informe de salud,
          memoria de actividades, diagnóstico de barrio, encuesta de
          participación— y el sistema lo transforma en unidades de evidencia
          que alimentan la lectura territorial y el análisis completo.
        </p>
      </div>

      <div className="document-form">
        <select
          value={kind}
          onChange={(event) => onKindChange(event.target.value as DocumentKind)}
        >
          {documentKinds.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <input
          value={title}
          onChange={(event) => onTitleChange(event.target.value)}
          placeholder="Título del documento o fuente"
        />

        <button type="button" onClick={onProcessDocument}>
          Registrar documento
        </button>
      </div>

      <textarea
        value={plainText}
        onChange={(event) => onPlainTextChange(event.target.value)}
        placeholder="Pega aquí el contenido de un informe, estudio o documento municipal. Cada párrafo o línea no vacía se convertirá en una unidad de evidencia estructurada."
        rows={9}
      />

      {lastProcessedDocument && (
        <p className="panel-note">
          Último documento registrado:{" "}
          <strong>{lastProcessedDocument.title}</strong>
        </p>
      )}

      <div className="document-list">
        {repository.documents.length === 0 ? (
          <p className="empty-state">
            Todavía no hay documentos registrados. Sigue los pasos de la guía
            superior para añadir el primer documento.
          </p>
        ) : (
          repository.documents.map((document) => (
            <article className="document-row" key={document.id}>
              <div>
                <p className="document-kind">{document.kind}</p>
                <h3>{document.title}</h3>
              </div>
              <span className="status-pill">{document.status}</span>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
