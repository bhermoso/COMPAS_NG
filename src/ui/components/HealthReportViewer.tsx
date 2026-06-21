import type { HealthReportDocument, HealthReportSection } from "../../domain/health-report";

interface HealthReportViewerProps {
  healthReport?: HealthReportDocument;
}

export function HealthReportViewer({ healthReport }: HealthReportViewerProps) {
  if (!healthReport) {
    return (
      <section className="workspace-panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Informe de Salud · Fuente primaria</p>
            <h2>Informe de Situación de Salud</h2>
          </div>
          <p className="panel-note">
            Cuando se cargue el Informe de Salud del municipio se mostrará aquí
            íntegramente, sin resumir ni interpretar, como fuente primaria literal
            firmada por el equipo epidemiológico.
          </p>
        </div>
        <p className="empty-state">
          No hay ningún Informe de Salud cargado en este espacio de trabajo.
        </p>
      </section>
    );
  }

  const authors = [...healthReport.authors].sort(
    (a, b) => a.signatureOrder - b.signatureOrder
  );

  return (
    <section className="workspace-panel hr-viewer">
      {/* Encabezado institucional */}
      <div className="hr-viewer__header">
        <div>
          <p className="eyebrow">Informe de Salud · Fuente primaria literal</p>
          <h2 className="hr-viewer__title">{healthReport.title}</h2>
        </div>
        <div className="hr-viewer__meta">
          <span className="panel-note">
            Fichero: <strong>{healthReport.sourceFileName}</strong>
          </span>
          {healthReport.reportingPeriod && (
            <span className="panel-note">
              Período: <strong>{healthReport.reportingPeriod}</strong>
            </span>
          )}
          <span className="panel-note">
            {healthReport.sections.length} sección(es)
            {" · "}
            {healthReport.body.charCount.toLocaleString("es-ES")} caracteres
            {healthReport.body.tableCount !== undefined &&
              ` · ${healthReport.body.tableCount} tabla(s)`}
          </span>
        </div>
      </div>

      {/* Autoría institucional */}
      {authors.length > 0 && (
        <div className="hr-viewer__authors">
          <p className="hr-viewer__section-label">Autoría</p>
          <ul className="hr-viewer__authors-list">
            {authors.map((author) => (
              <li key={author.signatureOrder} className="hr-viewer__author-entry">
                <strong>{author.name}</strong>
                {author.role && <span>{author.role}</span>}
                {author.organisation && <span>{author.organisation}</span>}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Índice de secciones */}
      <nav className="hr-viewer__toc" aria-label="Índice del informe">
        <p className="hr-viewer__section-label">Índice</p>
        <ol className="hr-viewer__toc-list">
          {healthReport.sections.map((section) => (
            <li key={`${section.key}-${section.sortOrder}`}>
              <a href={`#hr-section-${section.key}-${section.sortOrder}`}>{section.title}</a>
            </li>
          ))}
        </ol>
      </nav>

      {/* Secciones en orden */}
      <div className="hr-viewer__sections">
        {healthReport.sections.map((section) => (
          <ReportSection key={`${section.key}-${section.sortOrder}`} section={section} />
        ))}
      </div>
    </section>
  );
}

function ReportSection({ section }: { section: HealthReportSection }) {
  return (
    <article id={`hr-section-${section.key}-${section.sortOrder}`} className="hr-viewer__section">
      <h3 className="hr-viewer__section-title">{section.title}</h3>
      {section.bodyHtml ? (
        // bodyHtml proviene exclusivamente de Mammoth sobre el DOCX local del
        // Informe de Salud municipal (fuente controlada). No se aplica
        // sanitización adicional en esta intervención.
        <div
          className="hr-viewer__section-html"
          dangerouslySetInnerHTML={{ __html: section.bodyHtml }}
        />
      ) : (
        <pre className="hr-viewer__section-pre">{section.bodyText}</pre>
      )}
    </article>
  );
}
