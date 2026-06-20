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
          <p className="eyebrow">Repositorio Documental Municipal</p>
          <h2>Fuente manual → EvidenceAtom → LT1</h2>
        </div>
        <p className="panel-note">
          Esta primera tubería registra una fuente, transforma su texto en
          EvidenceAtom y alimenta la lectura territorial LT1.
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
          Procesar documento
        </button>
      </div>

      <textarea
        value={plainText}
        onChange={(event) => onPlainTextChange(event.target.value)}
        placeholder="Pega aquí texto simulado o manual. Cada línea no vacía generará un EvidenceAtom."
        rows={8}
      />

      {lastProcessedDocument && (
        <p className="panel-note">
          Última fuente procesada: <strong>{lastProcessedDocument.title}</strong>
        </p>
      )}

      <div className="document-list">
        {repository.documents.length === 0 ? (
          <p className="empty-state">
            Aún no hay documentos registrados. Añade texto manual para crear las
            primeras evidencias estructuradas.
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
