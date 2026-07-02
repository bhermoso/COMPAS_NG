import type { AUDITCStudy } from "../../domain/auditc";
import { AUDITC_MODULE } from "../../domain/methodology/definitions/auditc";

interface AUDITCPanelProps {
  auditcStudy?: AUDITCStudy;
  municipalityName?: string;
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("es-ES", {
      day: "numeric", month: "long", year: "numeric",
    });
  } catch { return iso.slice(0, 10); }
}

function getSampleQualityVerdict(
  n: number
): { label: string; key: "adecuada" | "moderada" | "insuficiente"; note: string } {
  if (n >= 100)
    return { label: "Adecuada", key: "adecuada",
      note: `El tamaño muestral (${n} registros válidos) permite una lectura descriptiva.` };
  if (n >= 30)
    return { label: "Moderada", key: "moderada",
      note: `El tamaño muestral (${n} registros válidos) es modesto. Los resultados son descriptivos de la muestra disponible.` };
  return { label: "Insuficiente", key: "insuficiente",
    note: `La muestra es reducida (${n} registros). Interpretar con extrema precaución.` };
}

function getRiskLevel(pct: number): "elevada" | "moderada" | "baja" {
  if (pct > 20) return "elevada";
  if (pct > 10) return "moderada";
  return "baja";
}

export function AUDITCPanel({ auditcStudy, municipalityName }: AUDITCPanelProps) {
  if (auditcStudy === undefined) return null;

  const module = AUDITC_MODULE;
  const note = module.institutionalNote;
  const mun = municipalityName ?? "el municipio";
  const { aggregates: agg } = auditcStudy;

  const quality = getSampleQualityVerdict(agg.nValid);
  const riskLevel = getRiskLevel(agg.pctPositive);

  const missingRate = agg.n > 0
    ? ((agg.missing / agg.n) * 100).toFixed(1)
    : "0.0";

  const executiveSummary: string[] = [
    `En ${mun}, el ${agg.pctPositive.toFixed(1)} % de la muestra adulta (n=${agg.nPositive} de ${agg.nValid}) ` +
      `presenta un score AUDIT-C ≥ 4 — prevalencia de consumo de riesgo ${riskLevel}.`,
    `Score medio: ${agg.meanScore.toFixed(2)}/12. ` +
      `Distribución: sin consumo ${agg.nScore0}, ` +
      `bajo riesgo 1–3: ${agg.nScore1to3}, ` +
      `riesgo 4–7: ${agg.nScore4to7}, ` +
      `alto riesgo ≥8: ${agg.nScore8to12}.`,
    agg.missing > 0
      ? `${agg.missing} de ${agg.n} registros excluidos por datos incompletos o inválidos (${missingRate} %).`
      : `Todos los registros (${agg.n}) completos.`,
    quality.note,
  ];

  const pslParagraph =
    `En ${mun}, la prevalencia de consumo de riesgo de alcohol según AUDIT-C ` +
    `(n = ${agg.nValid} adultos) es del ${agg.pctPositive.toFixed(1)} % ` +
    `(score ≥ 4). Score medio: ${agg.meanScore.toFixed(2)}/12. ` +
    `Este resultado contribuye al análisis de estilos de vida y conductas de riesgo ` +
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
          <span className="study-report__tag">REDCap municipal</span>
          <span className="study-report__tag">{module.identity.targetPopulation}</span>
          <span className="study-report__meta-date">Importado el {formatDate(auditcStudy.createdAt)}</span>
          <span className="study-report__meta-n">
            {agg.nValid} válidos · {agg.pctPositive.toFixed(1)} % score ≥ 4
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
              <tr className="study-bar-row study-bar-row--total">
                <td className="study-bar-row__label">Consumo de riesgo (≥ 4)</td>
                <td className="study-bar-row__track-cell">
                  <div className="study-bar-track">
                    <div className="study-bar-fill"
                      style={{ width: `${agg.pctPositive}%` }}
                      aria-label={`${agg.pctPositive.toFixed(1)} %`}
                    />
                  </div>
                </td>
                <td className="study-bar-row__value">{agg.pctPositive.toFixed(1)} %</td>
                <td className="study-bar-row__level study-bar-row__level--detail">
                  n={agg.nPositive} de {agg.nValid}
                </td>
              </tr>
              <tr className="study-bar-row">
                <td className="study-bar-row__label">Sin consumo (score 0)</td>
                <td className="study-bar-row__track-cell">
                  <div className="study-bar-track">
                    <div className="study-bar-fill"
                      style={{ width: `${agg.nValid > 0 ? (agg.nScore0 / agg.nValid) * 100 : 0}%` }}
                    />
                  </div>
                </td>
                <td className="study-bar-row__value">
                  {agg.nValid > 0 ? ((agg.nScore0 / agg.nValid) * 100).toFixed(1) : "0.0"} %
                </td>
                <td className="study-bar-row__level study-bar-row__level--detail">n={agg.nScore0}</td>
              </tr>
              <tr className="study-bar-row">
                <td className="study-bar-row__label">Bajo riesgo (score 1–3)</td>
                <td className="study-bar-row__track-cell">
                  <div className="study-bar-track">
                    <div className="study-bar-fill"
                      style={{ width: `${agg.nValid > 0 ? (agg.nScore1to3 / agg.nValid) * 100 : 0}%` }}
                    />
                  </div>
                </td>
                <td className="study-bar-row__value">
                  {agg.nValid > 0 ? ((agg.nScore1to3 / agg.nValid) * 100).toFixed(1) : "0.0"} %
                </td>
                <td className="study-bar-row__level study-bar-row__level--detail">n={agg.nScore1to3}</td>
              </tr>
              <tr className="study-bar-row">
                <td className="study-bar-row__label">Consumo de riesgo (score 4–7)</td>
                <td className="study-bar-row__track-cell">
                  <div className="study-bar-track">
                    <div className="study-bar-fill"
                      style={{ width: `${agg.nValid > 0 ? (agg.nScore4to7 / agg.nValid) * 100 : 0}%` }}
                    />
                  </div>
                </td>
                <td className="study-bar-row__value">
                  {agg.nValid > 0 ? ((agg.nScore4to7 / agg.nValid) * 100).toFixed(1) : "0.0"} %
                </td>
                <td className="study-bar-row__level study-bar-row__level--detail">n={agg.nScore4to7}</td>
              </tr>
              <tr className="study-bar-row">
                <td className="study-bar-row__label">Alto riesgo (score ≥ 8)</td>
                <td className="study-bar-row__track-cell">
                  <div className="study-bar-track">
                    <div className="study-bar-fill"
                      style={{ width: `${agg.nValid > 0 ? (agg.nScore8to12 / agg.nValid) * 100 : 0}%` }}
                    />
                  </div>
                </td>
                <td className="study-bar-row__value">
                  {agg.nValid > 0 ? ((agg.nScore8to12 / agg.nValid) * 100).toFixed(1) : "0.0"} %
                </td>
                <td className="study-bar-row__level study-bar-row__level--detail">n={agg.nScore8to12}</td>
              </tr>
            </tbody>
          </table>
        </div>
        {agg.nPositive < 10 && agg.nPositive > 0 && (
          <p className="study-report__footnote" style={{ color: "#b45309", marginTop: "4px" }}>
            Prevalencia muy baja (n={agg.nPositive} positivos): los porcentajes deben
            interpretarse con extrema precaución por el tamaño de celda.
          </p>
        )}
      </section>

      <section className="study-report__section">
        <p className="study-report__section-title">Comparación territorial</p>
        <dl className="study-report__evidence-dl">
          <dt>{mun} — prevalencia consumo de riesgo (≥ 4)</dt>
          <dd>{agg.pctPositive.toFixed(1)} % (sobre {agg.nValid} registros válidos)</dd>
          <dt>Provincia de Granada</dt>
          <dd>Sin referencia disponible — AUDIT-C no tiene equivalente en microdatos EAS</dd>
          <dt>Andalucía</dt>
          <dd>Sin referencia disponible — AUDIT-C no tiene equivalente en microdatos EAS</dd>
        </dl>
        <p className="study-report__interpretation">
          No se dispone de datos de referencia provinciales ni autonómicos para el AUDIT-C
          porque el instrumento no tiene equivalente en los microdatos de la Encuesta Andaluza
          de Salud. La comparación territorial requeriría datos de otra fuente (ENS, estudios
          autonómicos específicos) no disponibles actualmente en el sistema. La interpretación
          del resultado municipal debe hacerse en términos absolutos, considerando la literatura
          sobre prevalencia de consumo de riesgo en población adulta española.
        </p>
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
            <span className="study-report__quality-label">Registros válidos</span>
            <span className="study-report__quality-value">{agg.nValid}</span>
          </div>
          <div className="study-report__quality-cell">
            <span className="study-report__quality-label">Excluidos</span>
            <span className="study-report__quality-value">{agg.missing}</span>
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

      <section className="study-report__section">
        <p className="study-report__section-title">Coherencia con otras evidencias</p>
        <p className="study-report__interpretation">
          El AUDIT-C mide el patrón actual de consumo de alcohol. Su lectura junto al CAGE-EAS
          (si está disponible) ofrece perspectivas complementarias: el CAGE detecta consecuencias
          pasadas del consumo; el AUDIT-C, el patrón actual. Si el AUDIT-C es alto pero el CAGE
          es bajo, puede indicar consumo de riesgo incipiente sin consecuencias declaradas todavía.
          Si el PREDIMED-EAS muestra baja adherencia mediterránea simultáneamente, ambos resultados
          son consistentes como indicadores de riesgo cardiovascular relacionado con el estilo
          de vida. Si el SF-12 MCS indica peor salud mental percibida, la lectura conjunta
          orienta hacia el análisis del consumo como factor de riesgo de malestar emocional.
        </p>
      </section>

      <details className="study-report__collapsible">
        <summary>Descripción del instrumento</summary>
        <div className="study-report__collapsible-body">
          <dl className="study-report__instrument-dl">
            <dt>Nombre oficial</dt><dd>{module.identity.name}</dd>
            <dt>Acrónimo</dt><dd>{module.identity.shortName}</dd>
            <dt>Constructo</dt><dd>{module.identity.description}</dd>
            <dt>Población</dt><dd>{module.identity.targetPopulation}</dd>
            <dt>Ítems</dt><dd>3 (Q1: frecuencia · Q2: cantidad · Q3: consumo intensivo)</dd>
            <dt>Score</dt><dd>Suma Q1+Q2+Q3, rango 0–12</dd>
            <dt>Punto de corte</dt><dd>≥ 4 (general) · ≥ 3 mujeres / ≥ 4 hombres (Bush et al. 1998)</dd>
            <dt>Fuente</dt><dd>Encuesta municipal propia via REDCap</dd>
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
          {auditcStudy.methodologicalCautions.length > 0 && (
            <>
              <p className="study-report__subsection-title">De la muestra importada</p>
              <ul className="study-report__cautions-list">
                {auditcStudy.methodologicalCautions.map((c, i) => <li key={i}>{c}</li>)}
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
            <dd className="study-report__evidence-file">{auditcStudy.sourceFileName}</dd>
            <dt>Fecha de importación</dt><dd>{formatDate(auditcStudy.createdAt)}</dd>
            <dt>Tipo de fuente</dt><dd>Encuesta municipal propia — exportación REDCap</dd>
            <dt>Registros procesados</dt><dd>{agg.n}</dd>
            <dt>Registros válidos</dt><dd>{agg.nValid}</dd>
            <dt>Registros excluidos</dt><dd>{agg.missing}</dd>
            <dt>Score positivos (≥4)</dt><dd>{agg.nPositive}</dd>
          </dl>
        </div>
      </details>

      <details className="study-report__collapsible">
        <summary>Fundamento científico</summary>
        <div className="study-report__collapsible-body">
          {module.bibliography.map((ref, i) => (
            <div key={i} className="study-report__bib-item">
              <span className="study-report__bib-role">
                {i === 0 ? "Validación AUDIT-C" : "AUDIT-10 original"}
              </span>
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
