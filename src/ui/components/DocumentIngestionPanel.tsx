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
  atomsCreated?: number;
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
  atomsCreated,
  onKindChange,
  onTitleChange,
  onPlainTextChange,
  onProcessDocument,
}: DocumentIngestionPanelProps) {
  const hasTitle = title.trim().length > 0;
  const hasText = plainText.trim().length > 0;
  const canSubmit = hasTitle && hasText;

  const hint =
    !hasTitle && !hasText
      ? "Escribe un título y pega el texto del documento para poder registrarlo."
      : !hasTitle
      ? "Escribe un título para el documento."
      : "Pega el texto del documento en el área de abajo.";

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

      {/* Textarea primero: es la acción principal */}
      <textarea
        value={plainText}
        onChange={(event) => onPlainTextChange(event.target.value)}
        placeholder="Pega aquí el contenido del documento municipal. Cada párrafo o línea no vacía se convertirá en una unidad de evidencia estructurada."
        rows={9}
      />

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
          placeholder="Título del documento o fuente (obligatorio)"
        />

        <button
          type="button"
          onClick={onProcessDocument}
          disabled={!canSubmit}
          title={canSubmit ? undefined : hint}
        >
          Registrar documento
        </button>
      </div>

      {!canSubmit && (
        <p className="ingestion-hint">{hint}</p>
      )}

      {lastProcessedDocument && (
        <p className="panel-note">
          Último documento registrado:{" "}
          <strong>{lastProcessedDocument.title}</strong>
          {atomsCreated !== undefined && atomsCreated > 0 && (
            <> · <strong>{atomsCreated}</strong> unidades de evidencia generadas — ver panel inferior</>
          )}
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
