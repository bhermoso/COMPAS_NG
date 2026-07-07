import { useState } from "react";
import type { HealthReportDocument, HealthReportSection } from "../../domain/health-report";

interface HealthReportViewerProps {
  healthReport?: HealthReportDocument;
}

export function HealthReportViewer({ healthReport }: HealthReportViewerProps) {
  const [open, setOpen] = useState(false);

  const loaded = healthReport !== undefined;

  const toggleRow = (
    <button
      type="button"
      className="fde-source-toggle"
      onClick={() => setOpen((o) => !o)}
      aria-expanded={open}
    >
      <span
        className={`ec-instrument__dot${loaded ? " ec-instrument__dot--loaded" : ""}`}
      />
      <span className="fde-source-toggle__name">Informe de Salud</span>
      <span className="fde-source-toggle__subtitle">Fuente diagnóstica primaria</span>
      <span className="fde-source-toggle__status">
        {healthReport ? healthReport.title : "Sin informe"}
      </span>
      <span className="fde-source-toggle__arrow">{open ? "▲" : "▼"}</span>
    </button>
  );

  if (!healthReport) {
    return (
      <section className="workspace-panel fde-source-panel">
        {toggleRow}
        {open && (
          <div className="fde-source-body">
            <div className="panel-header" style={{ marginTop: 0, paddingTop: 0, borderTop: "none" }}>
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
          </div>
        )}
      </section>
    );
  }

  const authors = [...healthReport.authors].sort(
    (a, b) => a.signatureOrder - b.signatureOrder
  );

  return (
    <section className="workspace-panel hr-viewer fde-source-panel">
      {toggleRow}
      {open && (
        <>
          {/* Encabezado institucional */}
          <div className="hr-viewer__header">
            <div>
              <p className="eyebrow">Informe de Salud · Fuente primaria</p>
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
              {healthReport.body.format === "html" && (
                <span className="panel-note">
                  {healthReport.sections.length} sección(es)
                  {" · "}
                  {healthReport.body.charCount.toLocaleString("es-ES")} caracteres
                  {healthReport.body.tableCount !== undefined &&
                    ` · ${healthReport.body.tableCount} tabla(s)`}
                </span>
              )}
            </div>
          </div>

          {/* Autoría institucional — solo para DOCX con autoría registrada */}
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

          {/* Índice de secciones — solo para DOCX */}
          {healthReport.body.format === "html" && healthReport.sections.length > 0 && (
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
          )}

          {/* Contenido — DOCX con vista formateada o PDF preservado */}
          {healthReport.body.format === "html" ? (
            <div className="hr-viewer__sections">
              {healthReport.sections.map((section) => (
                <ReportSection key={`${section.key}-${section.sortOrder}`} section={section} />
              ))}
            </div>
          ) : (
            <div className="hr-viewer__section-ocr-notice">
              <p className="hr-viewer__section-ocr-label">Fuente primaria preservada</p>
              <p className="hr-viewer__section-ocr-note">
                Documento PDF cargado como fuente diagnóstica primaria.
                Preservado en el Repositorio documental.
                No se ha convertido en evidencia estructurada ni se ha usado para generar análisis automático.
              </p>
              <p className="hr-viewer__section-ocr-note">
                Para consultar el informe, abre el fichero original:{" "}
                <strong>{healthReport.sourceFileName}</strong>
              </p>
            </div>
          )}
        </>
      )}
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
        <div className="hr-viewer__section-ocr-notice">
          <p className="hr-viewer__section-ocr-label">Vista de sección no disponible</p>
          <p className="hr-viewer__section-ocr-note">
            Esta sección no dispone de vista formateada.
            Para consultar el contenido, abre el documento fuente.
          </p>
        </div>
      )}
    </article>
  );
}
