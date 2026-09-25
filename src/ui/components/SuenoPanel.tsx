import type { SuenoStudy } from "../../domain/sueno";
import { SUENO_EAS_MODULE } from "../../domain/methodology/definitions/sueno-eas";
import { getSampleQualityVerdict } from "./studyPanelUtils";

interface SuenoPanelProps {
  suenoStudy?: SuenoStudy;
  isLoading?: boolean;
  message?: string | null;
  onLoadCSV?: (file: File) => void;
  municipalityName?: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("es-ES", {
      day: "numeric", month: "long", year: "numeric",
    });
  } catch { return iso.slice(0, 10); }
}

const REF_DISCORDANCE_PCT = 29;

// ── Componente ────────────────────────────────────────────────────────────────

export function SuenoPanel({ suenoStudy, municipalityName }: SuenoPanelProps) {
  if (suenoStudy === undefined) return null;

  const module = SUENO_EAS_MODULE;
  const note = module.institutionalNote;
  const mun = municipalityName ?? "el municipio";
  const { aggregates: agg } = suenoStudy;

  const quality = getSampleQualityVerdict(agg.nValidP33R);
  const hasP33A = agg.nValidP33A > 0;

  // Descripción diagnóstica del nivel de sueño insuficiente
  const insuficienteDesc =
    agg.pctInsufficientSleep > 35
      ? "elevada"
      : agg.pctInsufficientSleep > 20
      ? "moderada"
      : "baja";

  const executiveSummary: string[] = [
    `En ${mun}, el ${agg.pctInsufficientSleep.toFixed(1)} % de la muestra adulta no alcanza las horas de sueño recomendadas (P33_R) — prevalencia ${insuficienteDesc}.`,
    hasP33A
      ? `El ${agg.pctNoRest.toFixed(1)} % refiere que las horas dormidas no les permiten descansar suficiente (P33A), indicador de calidad subjetiva del descanso.`
      : "El indicador de calidad subjetiva del descanso (P33A) no está disponible en esta muestra.",
    quality.note,
  ];

  const pslParagraph =
    `En ${mun}, la prevalencia de sueño insuficiente (P33_R) entre la población adulta ` +
    `(n = ${agg.nValidP33R} registros válidos) es del ${agg.pctInsufficientSleep.toFixed(1)} %` +
    (hasP33A
      ? `, y el ${agg.pctNoRest.toFixed(1)} % refiere descanso subjetivamente inadecuado (P33A, n = ${agg.nValidP33A}).`
      : ". El indicador de calidad subjetiva del descanso (P33A) no está disponible en esta muestra.") +
    ` Estos resultados aportan evidencia sobre los hábitos de sueño de la población adulta ` +
    `para el capítulo de Determinantes de Salud del Perfil de Salud Local.`;

  return (
    <div className="study-report">

      {/* CABECERA */}
      <header className="study-report__header">
        <div className="study-report__header-identity">
          <span className="study-report__label">Estudio complementario</span>
          <h3 className="study-report__name">{module.identity.name}</h3>
          <p className="study-report__constructo">
            {module.identity.purpose.split(".")[0]}.
          </p>
        </div>
        <div className="study-report__header-meta">
          <span className="study-report__tag">Encuesta Andaluza de Salud</span>
          <span className="study-report__tag">{module.identity.targetPopulation}</span>
          <span className="study-report__meta-date">Importado el {formatDate(suenoStudy.createdAt)}</span>
          <span className="study-report__meta-n">
            {agg.nValidP33R} válidos P33_R
            {hasP33A ? ` · ${agg.nValidP33A} válidos P33A` : ""}
          </span>
        </div>
      </header>

      {/* EN SÍNTESIS */}
      <section className="study-report__section">
        <p className="study-report__section-title">En síntesis</p>
        <ul className="study-report__summary-list">
          {executiveSummary.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
      </section>

      {/* RESULTADOS */}
      <section className="study-report__section">
        <p className="study-report__section-title">Resultados en {mun}</p>
        <div className="study-bar-section">
          <table className="study-bar-table">
            <tbody>
              <tr className="study-bar-row study-bar-row--total">
                <td className="study-bar-row__label">Sueño insuficiente (P33_R)</td>
                <td className="study-bar-row__track-cell">
                  <div className="study-bar-track">
                    <div className="study-bar-fill"
                      style={{ width: `${agg.pctInsufficientSleep}%` }}
                      aria-label={`${agg.pctInsufficientSleep.toFixed(1)} %`}
                    />
                    {/* Referencia epidemiológica discordancia ~29 % */}
                    <span className="study-bar-mark"
                      style={{ left: `${REF_DISCORDANCE_PCT}%` }}
                      title="Referencia epidemiológica ~29 %"
                    />
                  </div>
                </td>
                <td className="study-bar-row__value">{agg.pctInsufficientSleep.toFixed(1)} %</td>
                <td className="study-bar-row__level study-bar-row__level--detail">n={agg.nValidP33R}</td>
              </tr>

              {hasP33A && (
                <tr className="study-bar-row">
                  <td className="study-bar-row__label">No descansa suficiente (P33A)</td>
                  <td className="study-bar-row__track-cell">
                    <div className="study-bar-track">
                      <div className="study-bar-fill"
                        style={{ width: `${agg.pctNoRest}%` }}
                        aria-label={`${agg.pctNoRest.toFixed(1)} %`}
                      />
                    </div>
                  </td>
                  <td className="study-bar-row__value">{agg.pctNoRest.toFixed(1)} %</td>
                  <td className="study-bar-row__level study-bar-row__level--detail">n={agg.nValidP33A}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="study-report__legend">
          <span className="study-report__legend-item study-report__legend-item--threshold">
            Ref. epidemiológica discordancia P33R/P33A: ~{REF_DISCORDANCE_PCT} %
          </span>
        </div>
        {agg.missingP33R > 0 && (
          <p className="study-report__footnote">
            Sin valor P33_R: {agg.missingP33R} registros.
            {!hasP33A && " P33A no disponible en esta muestra."}
          </p>
        )}
        <p className="study-report__footnote" style={{ marginTop: "4px" }}>
          P33_R (duración) y P33A (calidad) son dimensiones independientes. No suman.
        </p>
      </section>

      {/* COMPARACIÓN TERRITORIAL */}
      <section className="study-report__section">
        <p className="study-report__section-title">Comparación territorial</p>
        <dl className="study-report__evidence-dl">
          <dt>{mun} — sueño insuficiente (P33_R)</dt>
          <dd>{agg.pctInsufficientSleep.toFixed(1)} % (n = {agg.nValidP33R})</dd>
          {hasP33A && (
            <>
              <dt>{mun} — no descansa suficiente (P33A)</dt>
              <dd>{agg.pctNoRest.toFixed(1)} % (n = {agg.nValidP33A})</dd>
            </>
          )}
          <dt>Provincia de Granada — EAS</dt>
          <dd>Sin referencia disponible para estos indicadores en esta fuente</dd>
          <dt>Andalucía — EAS</dt>
          <dd>Sin referencia disponible para estos indicadores en esta fuente</dd>
        </dl>
        <p className="study-report__interpretation">
          No se dispone de datos de referencia desagregados para Andalucía ni para la provincia
          de Granada sobre los indicadores P33_R y P33A. La única referencia disponible es
          epidemiológica y de alcance general: la discordancia esperada entre P33_R y P33A es
          de aproximadamente el {REF_DISCORDANCE_PCT} % (literatura del sueño), lo que significa que
          es estadísticamente coherente que una persona duerma horas insuficientes pero se sienta
          descansada o viceversa. Cuando la prevalencia de sueño insuficiente supera el 30–35 %
          en la muestra, puede indicar que una parte relevante de la población adulta de {mun}
          no alcanza las horas recomendadas.
        </p>
      </section>

      {/* INTERPRETACIÓN */}
      {note && (
        <section className="study-report__section">
          <p className="study-report__section-title">Interpretación para el diagnóstico municipal</p>
          <p className="study-report__interpretation">{note.diagnosticInterpretation}</p>
        </section>
      )}

      {/* CALIDAD */}
      <section className="study-report__section">
        <p className="study-report__section-title">Calidad de la evidencia</p>
        <div className="study-report__quality-grid">
          <div className="study-report__quality-cell">
            <span className="study-report__quality-label">Válidos P33_R</span>
            <span className="study-report__quality-value">{agg.nValidP33R}</span>
          </div>
          <div className="study-report__quality-cell">
            <span className="study-report__quality-label">Válidos P33A</span>
            <span className="study-report__quality-value">{hasP33A ? agg.nValidP33A : "—"}</span>
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

      {/* LÍNEAS DE OBSERVACIÓN */}
      {note?.implications && (
        <section className="study-report__section">
          <p className="study-report__section-title">Líneas de observación para el diagnóstico</p>
          <ul className="study-report__implications-list">
            {note.implications.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </section>
      )}

      {/* INTEGRACIÓN PSL */}
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

      {/* COHERENCIA CON OTRAS EVIDENCIAS */}
      <section className="study-report__section">
        <p className="study-report__section-title">Coherencia con otras evidencias</p>
        <p className="study-report__interpretation">
          El sueño insuficiente es un determinante del bienestar con conexiones documentadas
          con la salud mental percibida. Cuando el SF-12 MCS está disponible, una prevalencia
          alta de sueño insuficiente en {mun} combinada con un MCS por debajo de la norma
          española mostraría resultados consistentes con la literatura: ambos apuntarían a
          un déficit en el bienestar cotidiano de la población adulta. Una discrepancia —
          sueño insuficiente elevado con MCS dentro del rango — no es contradictoria: indica
          que el impacto percibido del sueño en la salud mental es limitado en este caso.
          Cuando el IBSE escolar está disponible, puede ser relevante observar si el patrón
          de sueño de la población joven (reflejado indirectamente en el bienestar escolar)
          es coherente con el perfil adulto, aunque los datos de Sueño EAS corresponden
          exclusivamente a la población ≥ 16 años.
        </p>
      </section>

      {/* COLAPSABLES */}
      <details className="study-report__collapsible">
        <summary>Descripción del instrumento</summary>
        <div className="study-report__collapsible-body">
          <dl className="study-report__instrument-dl">
            <dt>Nombre oficial</dt><dd>{module.identity.name}</dd>
            <dt>Acrónimo</dt><dd>{module.identity.shortName}</dd>
            <dt>Constructo</dt><dd>{module.identity.description}</dd>
            <dt>Población</dt><dd>{module.identity.targetPopulation}</dd>
            <dt>Indicadores</dt><dd>P33_R (duración) · P33A (calidad subjetiva)</dd>
            <dt>Fuente</dt><dd>EAS: campos derivados P33_R y P33A</dd>
          </dl>
          <p className="study-report__dimension-item" style={{ marginTop: "10px" }}>
            <strong>P33_R</strong> — Duración del sueño: 1 = sueño insuficiente según recomendación SES;
            0 = sueño suficiente.
          </p>
          <p className="study-report__dimension-item">
            <strong>P33A</strong> — Calidad subjetiva: 0 = no descansa suficiente con las horas dormidas;
            1 = sí descansa. Cobertura ~75 % (missing estructural por oleadas EAS).
          </p>
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
          {suenoStudy.methodologicalCautions.length > 0 && (
            <>
              <p className="study-report__subsection-title">De la muestra importada</p>
              <ul className="study-report__cautions-list">
                {suenoStudy.methodologicalCautions.map((c, i) => <li key={i}>{c}</li>)}
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
            <dd className="study-report__evidence-file">{suenoStudy.sourceFileName}</dd>
            <dt>Fecha de importación</dt><dd>{formatDate(suenoStudy.createdAt)}</dd>
            <dt>Tipo de fuente</dt><dd>Microdatos EAS — Encuesta Andaluza de Salud</dd>
            <dt>Registros procesados</dt><dd>{agg.n}</dd>
            <dt>Válidos P33_R</dt><dd>{agg.nValidP33R}</dd>
            <dt>Válidos P33A</dt><dd>{hasP33A ? agg.nValidP33A : "No disponible"}</dd>
          </dl>
        </div>
      </details>

      <details className="study-report__collapsible">
        <summary>Fundamento científico</summary>
        <div className="study-report__collapsible-body">
          {module.bibliography.map((ref, i) => (
            <div key={i} className="study-report__bib-item">
              <span className="study-report__bib-role">Fuente metodológica</span>
              {ref.authors}.{ref.title && <> <em>{ref.title}</em>.</>}
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
