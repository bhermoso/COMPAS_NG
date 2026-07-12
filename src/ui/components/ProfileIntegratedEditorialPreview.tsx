import type { ProfileIntegratedEditorialView } from "../../application/health-profile";

interface ProfileIntegratedEditorialPreviewProps {
  view: ProfileIntegratedEditorialView;
}

function variantClass(variant: string): string {
  return "pie-variant pie-variant--" + variant;
}

// Etiqueta legible del estatus del cruce (Nivel 3), visible junto al hilo.
const EPISTEMIC_LABEL: Record<string, string> = {
  "integrated-interpretation": "Interpretación integrada",
  "plausible-hypothesis": "Hipótesis plausible",
  "open-question": "Pregunta abierta",
};

export function ProfileIntegratedEditorialPreview({
  view,
}: ProfileIntegratedEditorialPreviewProps) {
  return (
    <section className="pie-doc workspace-panel" aria-labelledby="pie-title">

      {/* ── Apertura documental ─────────────────────────────────────────── */}
      <header className="pie-doc-open">
        <div className="pie-doc-open__identity">
          <p className="pie-doc-open__meta">
            {view.header.territory} · {view.header.status}
            {view.header.generatedDate !== undefined
              ? " · " + view.header.generatedDate
              : ""}
          </p>
          <h2 id="pie-title" className="pie-doc-open__title">
            {view.header.title}
          </h2>
          <p className="pie-doc-open__subtitle">{view.header.subtitle}</p>
        </div>
        <div className="pie-doc-open__sources" aria-label="Fuentes principales">
          {view.header.sources.map((source) => (
            <span key={source}>{source}</span>
          ))}
        </div>
        <p className="pie-doc-open__scale">{view.header.scale}</p>
      </header>

      {/* ── Imagen general ──────────────────────────────────────────────── */}
      <section className="pie-doc-section" aria-labelledby="pie-overview-title">
        <h3 id="pie-overview-title" className="pie-section__title">
          Imagen general
        </h3>
        <div className="pie-overview">
          {view.overview.map((message) => (
            <article key={message.id} className="pie-overview__item">
              <div className="pie-overview__head">
                <span className={variantClass(message.variant)} aria-hidden="true" />
                <strong className="pie-overview__label">{message.title}</strong>
              </div>
              <p className="pie-overview__body">{message.text}</p>
              <p className="pie-overview__source">{message.source}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ── Señales principales por fuente ──────────────────────────────── */}
      <section className="pie-doc-section" aria-labelledby="pie-sources-title">
        <h3 id="pie-sources-title" className="pie-section__title">
          Señales principales por fuente
        </h3>
        <div className="pie-base-doc">
          {view.sourceBlocks.map((block) => (
            <div key={block.id} className="pie-base-doc__entry">
              <span className={variantClass(block.variant)} aria-hidden="true" />
              <div className="pie-base-doc__body">
                <strong className="pie-base-doc__name">{block.title}</strong>
                <span className="pie-base-doc__adds"> — {block.whatItAdds}.</span>
                <span className="pie-base-doc__limit"> {block.whatItDoesNotAllow}.</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Lectura integrada del territorio ────────────────────────────── */}
      <section className="pie-doc-section" aria-labelledby="pie-reading-title">
        <h3 id="pie-reading-title" className="pie-section__title">
          Lectura integrada del territorio
        </h3>
        {/* Advertencia de no exhaustividad: una sola vez, no por hilo.
            Reutiliza la clase de nota existente (sin añadir CSS). */}
        <p className="pie-agenda-intro">{view.interpretation.nonExhaustiveNotice}</p>
        {view.territorialReadings.map((block) => (
          <article key={block.id} className="pie-hilo" aria-labelledby={`pie-h-${block.id}`}>
            <header className="pie-hilo__header">
              <span className={variantClass(block.variant)} aria-hidden="true" />
              <h4 id={`pie-h-${block.id}`} className="pie-hilo__title">
                {block.title}
              </h4>
              {block.epistemicStatus !== undefined ? (
                <span className="pie-hilo__status">
                  {EPISTEMIC_LABEL[block.epistemicStatus] ?? block.epistemicStatus}
                </span>
              ) : null}
            </header>
            <p className="pie-hilo__signal">{block.signal}</p>
            {/* La lectura integrada (Nivel 3) cruza agenda sanitaria, señales
                locales, contexto, mecanismo plausible, desigualdad y capacidad
                como razonamiento continuo, no como lista de campos. */}
            <p className="pie-hilo__reading">{block.reading}</p>
            <p className="pie-hilo__context">{block.source} · {block.scale}</p>
            <p className="pie-hilo__question">{block.groupMotorQuestion}</p>
            {/* Contraste asistencial (N1b): una pregunta abierta por hilo,
                procedente de documentos UGC. No es un resultado. Reutiliza la
                clase de pregunta; no despliega listas de indicadores. */}
            {block.clinicalAssistanceQuestion !== undefined ? (
              <p className="pie-hilo__question">
                <strong>Contraste asistencial: </strong>
                {block.clinicalAssistanceQuestion}
              </p>
            ) : null}
          </article>
        ))}
      </section>

      {/* ── Indicadores trazadores ──────────────────────────────────────── */}
      {view.tracerTable.length > 0 && (
        <section className="pie-doc-section" aria-labelledby="pie-tracer-title">
          <h3 id="pie-tracer-title" className="pie-section__title">
            Indicadores trazadores: valores y referencias
          </h3>
          <div className="pie-table-wrap">
            <table className="pie-table">
              <caption className="pie-table__caption">
                Valores por bloque temático con referencias provinciales y autonómicas.
                Los valores «proxy contextual» son datos de ámbito provincial usados como referencia de contexto.
              </caption>
              <thead>
                <tr>
                  <th>Bloque</th>
                  <th>Indicador</th>
                  <th>Valor</th>
                  <th>Ref. Granada</th>
                  <th>Ref. Andalucía</th>
                  <th>Escala</th>
                  <th>Lectura</th>
                </tr>
              </thead>
              <tbody>
                {view.tracerTable.map((row) => (
                  <tr key={row.bloque + row.indicador}>
                    <td>{row.bloque}</td>
                    <td>{row.indicador}</td>
                    <td className="pie-table__value">{row.valor}</td>
                    <td>{row.refGranada}</td>
                    <td>{row.refAndalucia}</td>
                    <td>{row.escala}</td>
                    <td>{row.lectura}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* ── Agenda del Grupo Motor ───────────────────────────────────────── */}
      {view.groupMotorAgenda.length > 0 && (
        <section className="pie-doc-section" aria-labelledby="pie-agenda-title">
          <h3 id="pie-agenda-title" className="pie-section__title">
            Qué debe discutir el Grupo Motor
          </h3>
          <p className="pie-agenda-intro">
            Cuestiones para contrastar con la experiencia territorial. El Grupo
            Motor delibera; no recibe prioridades cerradas.
          </p>
          <ol className="pie-delibera">
            {view.groupMotorAgenda.map((card) => (
              <li key={card.id} className="pie-delibera__item">
                <div className="pie-delibera__head">
                  <span className={variantClass(card.variant)} aria-hidden="true" />
                  <strong className="pie-delibera__tema">{card.tema}</strong>
                </div>
                <p className="pie-delibera__senal">{card.senal}</p>
                <p className="pie-delibera__tension">
                  <span className="pie-delibera__mechanism-label">Tensión: </span>
                  {card.mecanismo}
                  {" — "}
                  <span className="pie-delibera__oculto-label">Quién puede quedar fuera: </span>
                  {card.oculto}
                </p>
                <p className="pie-delibera__pregunta">{card.pregunta}</p>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* ── Cierre interpretativo ────────────────────────────────────────── */}
      <section className="pie-doc-section" aria-labelledby="pie-closing-title">
        <h3 id="pie-closing-title" className="pie-section__title">
          Cierre interpretativo
        </h3>
        <div className="pie-cierre">
          {view.closing.map((column) => (
            <div key={column.id} className="pie-cierre__bloque">
              <h4 className="pie-cierre__titulo">{column.title}</h4>
              <ul className="pie-cierre__items">
                {column.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ── Lectura territorial ampliada y anexo técnico (colapsado) ────── */}
      <details className="pie-annex">
        <summary>{view.technicalAnnex.title}</summary>
        <p>{view.technicalAnnex.summary}</p>
        <div className="pie-annex__notes">
          {view.technicalAnnex.matrix.notasBloque.map((note) => (
            <p key={note}>{note}</p>
          ))}
        </div>
        <div className="pie-table-wrap">
          <table className="pie-table pie-table--annex">
            <thead>
              <tr>
                <th>Señal</th>
                <th>Fuente</th>
                <th>Escala</th>
                <th>Mecanismo</th>
                <th>Pregunta</th>
              </tr>
            </thead>
            <tbody>
              {view.technicalAnnex.matrix.filas.map((row) => (
                <tr key={row.senal + row.fuente}>
                  <td>{row.senal}</td>
                  <td>{row.fuente}</td>
                  <td>{row.escala}</td>
                  <td>{row.mecanismo}</td>
                  <td>{row.pregunta}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </section>
  );
}
