import type { IPAQStudy } from "../../domain/ipaq";
import { IPAQ_EAS_MODULE } from "../../domain/methodology/definitions/ipaq-eas";
import { getSampleQualityVerdict } from "./studyPanelUtils";

interface IPAQPanelProps {
  ipaqStudy?: IPAQStudy;
  municipalityName?: string;
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("es-ES", {
      day: "numeric", month: "long", year: "numeric",
    });
  } catch { return iso.slice(0, 10); }
}

export function IPAQPanel({ ipaqStudy, municipalityName }: IPAQPanelProps) {
  if (ipaqStudy === undefined) return null;

  const module = IPAQ_EAS_MODULE;
  const note = module.institutionalNote;
  const mun = municipalityName ?? "el municipio";
  const { aggregates: agg } = ipaqStudy;

  const quality = getSampleQualityVerdict(Math.max(agg.nValidIPAQ, agg.nValidP34AR));

  const missingRateIPAQ = agg.n > 0
    ? ((agg.missingIPAQ / agg.n) * 100).toFixed(1)
    : "0.0";

  const executiveSummary: string[] = [
    agg.nValidIPAQ > 0
      ? `En ${mun}, el ${agg.pctHigh.toFixed(1)} % de los evaluados con IPAQ_DICO (n=${agg.nValidIPAQ}) ` +
        `presenta alta actividad física (≥600 MET-min/sem). ` +
        `Missing: ${agg.missingIPAQ} de ${agg.n} registros (${missingRateIPAQ} %).`
      : `Sin datos válidos de IPAQ_DICO en la muestra importada.`,
    agg.nValidP34AR > 0
      ? `Inactividad en tiempo libre: el ${agg.pctInactive.toFixed(1)} % ` +
        `(n=${agg.nInactive} de ${agg.nValidP34AR}) no realiza actividad física en el ocio.`
      : `Sin datos válidos de P34A_R (inactividad en tiempo libre).`,
    quality.note,
  ];

  const pslParagraph =
    `En ${mun}, la prevalencia de alta actividad física (IPAQ_DICO) es del ` +
    `${agg.pctHigh.toFixed(1)} % (n=${agg.nValidIPAQ} evaluados). ` +
    `La inactividad en tiempo libre (P34A_R) afecta al ${agg.pctInactive.toFixed(1)} % ` +
    `(n=${agg.nValidP34AR} evaluados). ` +
    `Estos resultados contribuyen al análisis de actividad física y estilos de vida ` +
    `en el capítulo de Determinantes de Salud del Perfil de Salud Local.`;

  return (
    <div className="study-report">

      <header className="study-report__header">
        <div className="study-report__header-identity">
          <span className="study-report__label">Estudio complementario</span>
          <h3 className="study-report__name">{module.identity.name}</h3>
          <p className="study-report__constructo">
            {module.identity.purpose.split(".")[0]}.
          </p>
        </div>
        <div className="study-report__header-meta">
          <span className="study-report__tag">EAS oficial</span>
          <span className="study-report__tag">{module.identity.targetPopulation}</span>
          <span className="study-report__meta-date">Importado el {formatDate(ipaqStudy.createdAt)}</span>
          <span className="study-report__meta-n">
            {agg.nValidIPAQ} válidos IPAQ_DICO · {agg.pctHigh.toFixed(1)} % alta actividad
          </span>
        </div>
      </header>

      <section className="study-report__section">
        <p className="study-report__section-title">En síntesis</p>
        <ul className="study-report__summary-list">
          {executiveSummary.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
      </section>

      <section className="study-report__section">
        <p className="study-report__section-title">Resultados en {mun}</p>
        <div className="study-bar-section">
          <table className="study-bar-table">
            <tbody>
              {agg.nValidIPAQ > 0 && (
                <>
                  <tr className="study-bar-row study-bar-row--total">
                    <td className="study-bar-row__label">Alta actividad (IPAQ_DICO = 1)</td>
                    <td className="study-bar-row__track-cell">
                      <div className="study-bar-track">
                        <div className="study-bar-fill"
                          style={{ width: `${agg.pctHigh}%` }}
                          aria-label={`${agg.pctHigh.toFixed(1)} %`}
                        />
                      </div>
                    </td>
                    <td className="study-bar-row__value">{agg.pctHigh.toFixed(1)} %</td>
                    <td className="study-bar-row__level study-bar-row__level--detail">
                      n={agg.nHigh} de {agg.nValidIPAQ}
                    </td>
                  </tr>
                  <tr className="study-bar-row">
                    <td className="study-bar-row__label">Nivel no-alto (bajo o moderado)</td>
                    <td className="study-bar-row__track-cell">
                      <div className="study-bar-track">
                        <div className="study-bar-fill"
                          style={{ width: `${agg.nValidIPAQ > 0 ? ((agg.nValidIPAQ - agg.nHigh) / agg.nValidIPAQ) * 100 : 0}%` }}
                        />
                      </div>
                    </td>
                    <td className="study-bar-row__value">
                      {agg.nValidIPAQ > 0 ? (((agg.nValidIPAQ - agg.nHigh) / agg.nValidIPAQ) * 100).toFixed(1) : "0.0"} %
                    </td>
                    <td className="study-bar-row__level study-bar-row__level--detail">n={agg.nValidIPAQ - agg.nHigh}</td>
                  </tr>
                </>
              )}
              {agg.nValidP34AR > 0 && (
                <>
                  <tr className="study-bar-row study-bar-row--total">
                    <td className="study-bar-row__label">Inactividad en tiempo libre (P34A_R = 1)</td>
                    <td className="study-bar-row__track-cell">
                      <div className="study-bar-track">
                        <div className="study-bar-fill"
                          style={{ width: `${agg.pctInactive}%` }}
                          aria-label={`${agg.pctInactive.toFixed(1)} %`}
                        />
                      </div>
                    </td>
                    <td className="study-bar-row__value">{agg.pctInactive.toFixed(1)} %</td>
                    <td className="study-bar-row__level study-bar-row__level--detail">
                      n={agg.nInactive} de {agg.nValidP34AR}
                    </td>
                  </tr>
                  <tr className="study-bar-row">
                    <td className="study-bar-row__label">Activo en tiempo libre</td>
                    <td className="study-bar-row__track-cell">
                      <div className="study-bar-track">
                        <div className="study-bar-fill"
                          style={{ width: `${agg.nValidP34AR > 0 ? ((agg.nValidP34AR - agg.nInactive) / agg.nValidP34AR) * 100 : 0}%` }}
                        />
                      </div>
                    </td>
                    <td className="study-bar-row__value">
                      {agg.nValidP34AR > 0 ? (((agg.nValidP34AR - agg.nInactive) / agg.nValidP34AR) * 100).toFixed(1) : "0.0"} %
                    </td>
                    <td className="study-bar-row__level study-bar-row__level--detail">n={agg.nValidP34AR - agg.nInactive}</td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
        {agg.nValidIPAQ > 0 && agg.missingIPAQ > 0 && (
          <p className="study-report__footnote" style={{ color: "#b45309", marginTop: "4px" }}>
            Missing IPAQ_DICO: {agg.missingIPAQ} de {agg.n} registros ({missingRateIPAQ} %).
            El missing sustancial puede reflejar personas no evaluadas o con datos insuficientes.
          </p>
        )}
      </section>

      {note && (
        <section className="study-report__section">
          <p className="study-report__section-title">Interpretación para el diagnóstico municipal</p>
          <p className="study-report__interpretation">{note.diagnosticInterpretation}</p>
        </section>
      )}

      <section className="study-report__section">
        <p className="study-report__section-title">Calidad de la evidencia</p>
        <div className="study-report__quality-grid">
          <div className="study-report__quality-cell">
            <span className="study-report__quality-label">Válidos IPAQ_DICO</span>
            <span className="study-report__quality-value">{agg.nValidIPAQ}</span>
          </div>
          <div className="study-report__quality-cell">
            <span className="study-report__quality-label">Válidos P34A_R</span>
            <span className="study-report__quality-value">{agg.nValidP34AR}</span>
          </div>
          <div className="study-report__quality-cell">
            <span className="study-report__quality-label">Procesados</span>
            <span className="study-report__quality-value">{agg.n}</span>
          </div>
          <div className="study-report__quality-cell">
            <span className="study-report__quality-label">Valoración</span>
            <span className={`study-report__quality-verdict study-report__quality-verdict--${quality.key}`}>
              {quality.label}
            </span>
          </div>
        </div>
        <p className="study-report__quality-note">
          {quality.note} La evaluación completa de la representatividad requiere el análisis SAM.
        </p>
      </section>

      {note?.implications && (
        <section className="study-report__section">
          <p className="study-report__section-title">Líneas de observación para el diagnóstico</p>
          <ul className="study-report__implications-list">
            {note.implications.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </section>
      )}

      {note?.pslIntegration && (
        <section className="study-report__section">
          <p className="study-report__section-title">Integración en el Perfil de Salud Local</p>
          <p className="study-report__psl-chapter">Capítulo: {note.pslIntegration.chapter}</p>
          <div className="study-report__psl-determinants">
            {note.pslIntegration.determinants.map((d, i) => (
              <span key={i} className="study-report__psl-determinant">{d}</span>
            ))}
          </div>
          <p className="study-report__psl-contribution">{note.pslIntegration.contribution}</p>
          <p className="study-report__psl-contribution" style={{ marginTop: "8px", fontStyle: "italic" }}>
            {pslParagraph}
          </p>
        </section>
      )}

      <details className="study-report__collapsible">
        <summary>Descripción del instrumento</summary>
        <div className="study-report__collapsible-body">
          <dl className="study-report__instrument-dl">
            <dt>Nombre oficial</dt><dd>{module.identity.name}</dd>
            <dt>Acrónimo</dt><dd>{module.identity.shortName}</dd>
            <dt>Constructo</dt><dd>{module.identity.description}</dd>
            <dt>Población</dt><dd>{module.identity.targetPopulation}</dd>
            <dt>Indicadores</dt><dd>IPAQ_DICO (alta actividad) · P34A_R (inactividad en tiempo libre)</dd>
            <dt>Fuente</dt><dd>Encuesta Andaluza de Salud — campos derivados oficiales</dd>
          </dl>
        </div>
      </details>

      {note?.publicHealthApplication && (
        <details className="study-report__collapsible">
          <summary>Aplicación en salud pública</summary>
          <div className="study-report__collapsible-body">
            <p className="study-report__subsection-title">Qué mide</p>
            <ul className="study-report__sp-list">
              {note.publicHealthApplication.measures.map((m, i) => <li key={i}>{m}</li>)}
            </ul>
            <p className="study-report__subsection-title">Qué no mide</p>
            <ul className="study-report__sp-list">
              {note.publicHealthApplication.doesNotMeasure.map((m, i) => <li key={i}>{m}</li>)}
            </ul>
            <p className="study-report__subsection-title">Contexto de uso</p>
            <ul className="study-report__sp-list">
              {note.publicHealthApplication.contextualUse.map((m, i) => <li key={i}>{m}</li>)}
            </ul>
            {note.publicHealthApplication.commonMisinterpretations && (
              <>
                <p className="study-report__subsection-title">Errores frecuentes</p>
                <ul className="study-report__sp-list study-report__sp-list--caution">
                  {note.publicHealthApplication.commonMisinterpretations.map((m, i) => <li key={i}>{m}</li>)}
                </ul>
              </>
            )}
          </div>
        </details>
      )}

      <details className="study-report__collapsible">
        <summary>Cautelas metodológicas</summary>
        <div className="study-report__collapsible-body">
          {module.limitations.length > 0 && (
            <>
              <p className="study-report__subsection-title">Del instrumento</p>
              <ul className="study-report__cautions-list">
                {module.limitations.map((l, i) => <li key={i}>{l}</li>)}
              </ul>
            </>
          )}
          {ipaqStudy.methodologicalCautions.length > 0 && (
            <>
              <p className="study-report__subsection-title">De la muestra importada</p>
              <ul className="study-report__cautions-list">
                {ipaqStudy.methodologicalCautions.map((c, i) => <li key={i}>{c}</li>)}
              </ul>
            </>
          )}
        </div>
      </details>

      <details className="study-report__collapsible">
        <summary>Evidencia y trazabilidad</summary>
        <div className="study-report__collapsible-body">
          <dl className="study-report__evidence-dl">
            <dt>Archivo fuente</dt>
            <dd className="study-report__evidence-file">{ipaqStudy.sourceFileName}</dd>
            <dt>Fecha de importación</dt><dd>{formatDate(ipaqStudy.createdAt)}</dd>
            <dt>Tipo de fuente</dt><dd>Encuesta Andaluza de Salud — campos derivados oficiales</dd>
            <dt>Registros procesados</dt><dd>{agg.n}</dd>
            <dt>Válidos IPAQ_DICO</dt><dd>{agg.nValidIPAQ}</dd>
            <dt>Missing IPAQ_DICO</dt><dd>{agg.missingIPAQ}</dd>
            <dt>Alta actividad (IPAQ_DICO=1)</dt><dd>{agg.nHigh}</dd>
            <dt>Válidos P34A_R</dt><dd>{agg.nValidP34AR}</dd>
            <dt>Inactivos en tiempo libre</dt><dd>{agg.nInactive}</dd>
          </dl>
        </div>
      </details>

      <details className="study-report__collapsible">
        <summary>Fundamento científico</summary>
        <div className="study-report__collapsible-body">
          {module.bibliography.map((ref, i) => (
            <div key={i} className="study-report__bib-item">
              <span className="study-report__bib-role">Referencia IPAQ</span>
              {ref.authors} ({ref.year}). <em>{ref.title}</em>.{" "}
              {ref.source && <>{ref.source}.</>}
              {ref.doi && <> DOI: {ref.doi}.</>}
              {ref.notes && <> {ref.notes}</>}
            </div>
          ))}
        </div>
      </details>

      <p className="study-institutional-note">
        La decisión territorial corresponde siempre al equipo técnico.
      </p>
    </div>
  );
}
