import type {
  DocumentKind,
  MunicipalDocument,
} from "../../domain/repository";

interface DocumentKindOption {
  value: DocumentKind;
  label: string;
}

interface DocumentIngestionPanelProps {
  documentKinds: DocumentKindOption[];
  kind: DocumentKind;
  title: string;
  plainText: string;
  lastProcessedDocument: MunicipalDocument | null;
  atomsCreated?: number;
  isLoadingHealthReport?: boolean;
  healthReportMessage?: string | null;
  onKindChange: (kind: DocumentKind) => void;
  onTitleChange: (title: string) => void;
  onPlainTextChange: (plainText: string) => void;
  onProcessDocument: () => void;
  onLoadHealthReport?: (file: File) => void;
}

export function DocumentIngestionPanel({
  documentKinds,
  kind,
  title,
  plainText,
  lastProcessedDocument,
  atomsCreated,
  isLoadingHealthReport,
  healthReportMessage,
  onKindChange,
  onTitleChange,
  onPlainTextChange,
  onProcessDocument,
  onLoadHealthReport,
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

  const isHealthReport = kind === "health-report";

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

      {isHealthReport ? (
        /* ── Carga DOCX para Informe de Salud ── */
        <div className="docx-upload">
          <select
            value={kind}
            onChange={(event) => onKindChange(event.target.value as DocumentKind)}
            className="docx-upload__kind"
          >
            {documentKinds.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <div className="docx-upload__zone">
            <label htmlFor="hr-file-input" className="docx-upload__label">
              Cargar Informe de Salud (.docx / .doc / .pdf)
            </label>
            <input
              id="hr-file-input"
              type="file"
              accept=".docx,.doc,.pdf"
              disabled={isLoadingHealthReport === true}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file !== undefined && onLoadHealthReport !== undefined) {
                  onLoadHealthReport(file);
                }
                e.target.value = "";
              }}
              className="docx-upload__input"
            />
          </div>

          {isLoadingHealthReport === true && (
            <p className="ingestion-hint">Procesando informe…</p>
          )}
          {healthReportMessage !== undefined &&
            healthReportMessage !== null &&
            isLoadingHealthReport !== true && (
              <p className="panel-note">{healthReportMessage}</p>
            )}
        </div>
      ) : (
        /* ── Ingesta de texto para otros tipos documentales ── */
        <>
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
                <> · <strong>{atomsCreated}</strong> unidades de evidencia generadas</>
              )}
            </p>
          )}
        </>
      )}
    </section>
  );
}
