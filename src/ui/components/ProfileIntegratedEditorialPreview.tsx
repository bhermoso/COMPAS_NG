import type { ProfileIntegratedEditorialView } from "../../application/health-profile";

interface ProfileIntegratedEditorialPreviewProps {
  view: ProfileIntegratedEditorialView;
}

function variantClass(variant: string): string {
  return "pie-variant pie-variant--" + variant;
}

export function ProfileIntegratedEditorialPreview({
  view,
}: ProfileIntegratedEditorialPreviewProps) {
  return (
    <section className="pie-preview workspace-panel" aria-labelledby="pie-title">
      <header className="pie-header">
        <div>
          <p className="pie-header__meta">
            {view.header.territory} · {view.header.status}
            {view.header.generatedDate !== undefined
              ? " · " + view.header.generatedDate
              : ""}
          </p>
          <h2 id="pie-title" className="pie-header__title">
            {view.header.title}
          </h2>
          <p className="pie-header__subtitle">
            Propuesta de composición del Perfil de Salud Local
          </p>
        </div>
        <div className="pie-header__scale">
          <span>Escala</span>
          <strong>{view.header.scale}</strong>
        </div>
      </header>

      <div className="pie-sources-line" aria-label="Fuentes principales">
        {view.header.sources.map((source) => (
          <span key={source}>{source}</span>
        ))}
      </div>

      <section className="pie-section" aria-labelledby="pie-overview-title">
        <h3 id="pie-overview-title" className="pie-section__title">
          Imagen general
        </h3>
        <div className="pie-overview">
          {view.overview.map((message) => (
            <article key={message.id} className="pie-overview__item">
              <span className={variantClass(message.variant)} />
              <h4>{message.title}</h4>
              <p>{message.text}</p>
              <dl className="pie-mini-meta">
                <div>
                  <dt>Señal</dt>
                  <dd>{message.signal}</dd>
                </div>
                <div>
                  <dt>Fuente</dt>
                  <dd>{message.source}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </section>

      <section className="pie-section" aria-labelledby="pie-source-title">
        <h3 id="pie-source-title" className="pie-section__title">
          Señales principales por fuente
        </h3>
        <div className="pie-source-grid">
          {view.sourceBlocks.map((block) => (
            <article key={block.id} className="pie-source-card">
              <div className="pie-source-card__top">
                <span className={variantClass(block.variant)} />
                <h4>{block.title}</h4>
              </div>
              <p>
                <strong>Aporta: </strong>
                {block.whatItAdds}
              </p>
              <p>
                <strong>No permite: </strong>
                {block.whatItDoesNotAllow}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="pie-section" aria-labelledby="pie-reading-title">
        <h3 id="pie-reading-title" className="pie-section__title">
          Lectura integrada del territorio
        </h3>
        <div className="pie-reading-grid">
          {view.territorialReadings.map((block) => (
            <article key={block.id} className="pie-reading-card">
              <div className="pie-reading-card__head">
                <span className={variantClass(block.variant)} />
                <h4>{block.title}</h4>
              </div>
              <p className="pie-reading-card__signal">{block.signal}</p>
              <p className="pie-reading-card__meta">
                {block.source} · {block.scale}
              </p>
              <p>{block.reading}</p>
              <p className="pie-reading-card__mechanism">
                <strong>Mecanismo plausible: </strong>
                {block.mechanism}
              </p>
              <p className="pie-reading-card__exclusion">
                <strong>Quién puede quedar fuera: </strong>
                {block.exclusion}
              </p>
              <p className="pie-reading-card__question">
                {block.groupMotorQuestion}
              </p>
            </article>
          ))}
        </div>
      </section>

      {view.tracerTable.length > 0 && (
        <section className="pie-section" aria-labelledby="pie-tracer-title">
          <h3 id="pie-tracer-title" className="pie-section__title">
            Indicadores trazadores: valores y referencias
          </h3>
          <div className="pie-table-wrap">
            <table className="pie-table">
              <thead>
                <tr>
                  <th>Bloque</th>
                  <th>Indicador</th>
                  <th>Valor</th>
                  <th>Granada</th>
                  <th>Andalucía</th>
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

      {view.groupMotorAgenda.length > 0 && (
        <section className="pie-section" aria-labelledby="pie-agenda-title">
          <h3 id="pie-agenda-title" className="pie-section__title">
            Qué debe discutir el Grupo Motor
          </h3>
          <div className="pie-agenda">
            {view.groupMotorAgenda.map((card) => (
              <article key={card.id} className="pie-agenda-card">
                <span className={variantClass(card.variant)} />
                <h4>{card.tema}</h4>
                <p>{card.senal}</p>
                <p>
                  <strong>Mecanismo: </strong>
                  {card.mecanismo}
                </p>
                <p>
                  <strong>Zona ciega: </strong>
                  {card.oculto}
                </p>
                <p className="pie-agenda-card__question">{card.pregunta}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="pie-section" aria-labelledby="pie-closing-title">
        <h3 id="pie-closing-title" className="pie-section__title">
          Cierre interpretativo
        </h3>
        <div className="pie-closing">
          {view.closing.map((column) => (
            <article key={column.id} className="pie-closing-column">
              <h4>{column.title}</h4>
              <ul>
                {column.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

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
