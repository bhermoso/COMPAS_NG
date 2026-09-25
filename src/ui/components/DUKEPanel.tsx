import type { DUKEStudy } from "../../domain/duke";
import { DUKE_EAS_MODULE } from "../../domain/methodology/definitions/duke-eas";
import { getSampleQualityVerdict } from "./studyPanelUtils";

interface DUKEPanelProps {
  dukeStudy?: DUKEStudy;
  isLoading?: boolean;
  message?: string | null;
  onLoadCSV?: (file: File) => void;
  municipalityName?: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return iso.slice(0, 10);
  }
}

function getDukeClinicalLevel(mean: number): "adecuado" | "moderado" | "bajo" {
  if (mean >= 40) return "adecuado";
  if (mean >= 32) return "moderado";
  return "bajo";
}

function dukeTerritorialNarrative(municipalMean: number, refGranada: number): string {
  const diff = municipalMean - refGranada;
  let comparison: string;
  if (Math.abs(diff) <= 1.5)
    comparison = `es próximo a la referencia provincial de Granada (${refGranada}/55)`;
  else if (diff > 0)
    comparison = `supera la referencia de Granada (${refGranada}/55) en ${diff.toFixed(1)} puntos`;
  else
    comparison = `se sitúa ${Math.abs(diff).toFixed(1)} puntos por debajo de la referencia de Granada (${refGranada}/55)`;
  return `El apoyo social medio del municipio (${municipalMean.toFixed(1)}/55) ${comparison}. No se dispone de una referencia específica para Andalucía en esta escala. La referencia provincial procede de los microdatos EAS de Granada (n = 3.028 adultos ≥ 16 años).`;
}

const DUKE_MAX = 55;
const DUKE_MAX_CONF = 35;
const DUKE_MAX_AFF = 20;


// ── Componente ────────────────────────────────────────────────────────────────

export function DUKEPanel({
  dukeStudy,
  municipalityName,
}: DUKEPanelProps) {
  if (dukeStudy === undefined) return null;

  const module = DUKE_EAS_MODULE;
  const note = module.institutionalNote;
  const ref = module.interpretation.referenceValues;
  const mun = municipalityName ?? "el municipio";
  const { aggregates: agg } = dukeStudy;

  const clinicalLevel = getDukeClinicalLevel(agg.meanGlobal);
  const quality = getSampleQualityVerdict(agg.nValidGlobal);
  const incompleteRate =
    agg.n > 0
      ? ((agg.incompleteGlobalCount / agg.n) * 100).toFixed(1)
      : "0.0";

  // Qué componente muestra mayor déficit relativo
  const confRelative = agg.meanConfidential / DUKE_MAX_CONF;
  const affRelative = agg.meanAffective / DUKE_MAX_AFF;
  const lowerComponent = confRelative < affRelative ? "confidencial" : "afectivo";

  const executiveSummary: string[] = [
    `La población adulta de ${mun} muestra una media de apoyo social funcional de ${agg.meanGlobal.toFixed(1)}/55 — nivel ${clinicalLevel} (Bellón, 1996).`,
    `El ${agg.lowGlobalPercentage.toFixed(1)} % de la muestra evaluada presenta indicadores de apoyo social bajo (recodificación EAS).`,
    `El componente con mayor déficit relativo es el apoyo ${lowerComponent}, que orienta el tipo de red de apoyo más vulnerable en el municipio.`,
    quality.note,
  ];

  const pslParagraph =
    `En ${mun}, el análisis de apoyo social funcional (DUKE-EAS, n = ${agg.nValidGlobal} adultos) ` +
    `muestra una media de ${agg.meanGlobal.toFixed(1)}/55 (nivel ${clinicalLevel}), ` +
    `con un ${agg.lowGlobalPercentage.toFixed(1)} % de la muestra con indicadores de apoyo bajo. ` +
    `El componente confidencial alcanza ${agg.meanConfidential.toFixed(1)}/35 (bajo: ${agg.lowConfidentialPercentage.toFixed(1)} %) ` +
    `y el afectivo ${agg.meanAffective.toFixed(1)}/20 (bajo: ${agg.lowAffectivePercentage.toFixed(1)} %). ` +
    `Este resultado contribuye al análisis de determinantes sociales del Perfil de Salud Local ` +
    `en el capítulo de Apoyo social y redes comunitarias.`;

  return (
    <div className="study-report">

      {/* ── CABECERA ─────────────────────────────────────────────────────── */}
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
          <span className="study-report__meta-date">
            Importado el {formatDate(dukeStudy.createdAt)}
          </span>
          <span className="study-report__meta-n">
            {agg.nValidGlobal} registros válidos
          </span>
        </div>
      </header>

      {/* ── EN SÍNTESIS ──────────────────────────────────────────────────── */}
      <section className="study-report__section">
        <p className="study-report__section-title">En síntesis</p>
        <ul className="study-report__summary-list">
          {executiveSummary.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </section>

      {/* ── RESULTADOS ───────────────────────────────────────────────────── */}
      <section className="study-report__section">
        <p className="study-report__section-title">
          Resultados en {mun}
        </p>

        <div className="study-bar-section">
          <table className="study-bar-table">
            <tbody>
              <tr className="study-bar-row study-bar-row--total">
                <td className="study-bar-row__label">Apoyo global</td>
                <td className="study-bar-row__track-cell">
                  <div className="study-bar-track">
                    <div
                      className="study-bar-fill"
                      style={{ width: `${(agg.meanGlobal / DUKE_MAX) * 100}%` }}
                      aria-label={`${agg.meanGlobal} sobre ${DUKE_MAX}`}
                    />
                    {/* Umbral clínico Bellón (1996): <32 = bajo */}
                    <span
                      className="study-bar-mark"
                      style={{ left: `${(32 / DUKE_MAX) * 100}%` }}
                      title="Umbral bajo: 32/55 (Bellón, 1996)"
                    />
                    {/* Referencia EAS Granada */}
                    {ref?.mean !== undefined && (
                      <span
                        className="study-bar-mark study-bar-mark--ref"
                        style={{ left: `${(ref.mean / DUKE_MAX) * 100}%` }}
                        title={`Referencia EAS Granada: ${ref.mean}`}
                      />
                    )}
                  </div>
                </td>
                <td className="study-bar-row__value">
                  {agg.meanGlobal.toFixed(1)}/{DUKE_MAX}
                </td>
                <td className="study-bar-row__level">{clinicalLevel}</td>
              </tr>

              <tr className="study-bar-row">
                <td className="study-bar-row__label">Apoyo confidencial</td>
                <td className="study-bar-row__track-cell">
                  <div className="study-bar-track">
                    <div
                      className="study-bar-fill"
                      style={{
                        width: `${(agg.meanConfidential / DUKE_MAX_CONF) * 100}%`,
                      }}
                    />
                  </div>
                </td>
                <td className="study-bar-row__value">
                  {agg.meanConfidential.toFixed(1)}/{DUKE_MAX_CONF}
                </td>
                <td className="study-bar-row__level study-bar-row__level--detail">
                  bajo: {agg.lowConfidentialPercentage.toFixed(1)} %
                  {" · "}n={agg.nValidConfidential}
                </td>
              </tr>

              <tr className="study-bar-row">
                <td className="study-bar-row__label">Apoyo afectivo</td>
                <td className="study-bar-row__track-cell">
                  <div className="study-bar-track">
                    <div
                      className="study-bar-fill"
                      style={{
                        width: `${(agg.meanAffective / DUKE_MAX_AFF) * 100}%`,
                      }}
                    />
                  </div>
                </td>
                <td className="study-bar-row__value">
                  {agg.meanAffective.toFixed(1)}/{DUKE_MAX_AFF}
                </td>
                <td className="study-bar-row__level study-bar-row__level--detail">
                  bajo: {agg.lowAffectivePercentage.toFixed(1)} %
                  {" · "}n={agg.nValidAffective}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="study-report__legend">
          <span className="study-report__legend-item study-report__legend-item--threshold">
            Umbral bajo &lt; 32/55 (Bellón, 1996)
          </span>
          {ref?.mean !== undefined && (
            <span className="study-report__legend-item study-report__legend-item--ref">
              Ref. EAS Granada: {ref.mean}/55
            </span>
          )}
        </div>

        {agg.incompleteGlobalCount > 0 && (
          <p className="study-report__footnote">
            Registros con DUKE no calculable (código 993):{" "}
            {agg.incompleteGlobalCount} de {agg.n} ({incompleteRate} %).
          </p>
        )}
      </section>

      {/* ── COMPARACIÓN TERRITORIAL ──────────────────────────────────────── */}
      <section className="study-report__section">
        <p className="study-report__section-title">Comparación territorial</p>
        <dl className="study-report__evidence-dl">
          <dt>{mun} (muestra analizada)</dt>
          <dd>{agg.meanGlobal.toFixed(1)}/55 — nivel {clinicalLevel}</dd>
          <dt>Provincia de Granada</dt>
          <dd>
            {ref?.mean !== undefined
              ? `${ref.mean}/55 (EAS Granada, n = 3.028 adultos ≥ 16 años)`
              : "Sin referencia disponible"}
          </dd>
          <dt>Andalucía</dt>
          <dd>Sin referencia disponible para este instrumento en la EAS</dd>
        </dl>
        {ref?.mean !== undefined && (
          <p className="study-report__interpretation">
            {dukeTerritorialNarrative(agg.meanGlobal, ref.mean)}
          </p>
        )}
      </section>

      {/* ── INTERPRETACIÓN ───────────────────────────────────────────────── */}
      {note && (
        <section className="study-report__section">
          <p className="study-report__section-title">
            Interpretación para el diagnóstico municipal
          </p>
          <p className="study-report__interpretation">
            {note.diagnosticInterpretation}
          </p>
        </section>
      )}

      {/* ── CALIDAD DE LA EVIDENCIA ──────────────────────────────────────── */}
      <section className="study-report__section">
        <p className="study-report__section-title">Calidad de la evidencia</p>
        <div className="study-report__quality-grid">
          <div className="study-report__quality-cell">
            <span className="study-report__quality-label">Registros válidos</span>
            <span className="study-report__quality-value">{agg.nValidGlobal}</span>
          </div>
          <div className="study-report__quality-cell">
            <span className="study-report__quality-label">Procesados</span>
            <span className="study-report__quality-value">{agg.n}</span>
          </div>
          <div className="study-report__quality-cell">
            <span className="study-report__quality-label">Incompletos</span>
            <span className="study-report__quality-value">{incompleteRate} %</span>
          </div>
          <div className="study-report__quality-cell">
            <span className="study-report__quality-label">Valoración</span>
            <span
              className={`study-report__quality-verdict study-report__quality-verdict--${quality.key}`}
            >
              {quality.label}
            </span>
          </div>
        </div>
        <p className="study-report__quality-note">
          {quality.note} La evaluación completa de la representatividad
          requiere el análisis de ajuste muestral (SAM).
        </p>
      </section>

      {/* ── LÍNEAS DE OBSERVACIÓN ────────────────────────────────────────── */}
      {note?.implications && note.implications.length > 0 && (
        <section className="study-report__section">
          <p className="study-report__section-title">
            Líneas de observación para el diagnóstico
          </p>
          <ul className="study-report__implications-list">
            {note.implications.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </section>
      )}

      {/* ── INTEGRACIÓN EN EL PERFIL DE SALUD LOCAL ─────────────────────── */}
      {note?.pslIntegration && (
        <section className="study-report__section">
          <p className="study-report__section-title">
            Integración en el Perfil de Salud Local
          </p>
          <p className="study-report__psl-chapter">
            Capítulo: {note.pslIntegration.chapter}
          </p>
          <div className="study-report__psl-determinants">
            {note.pslIntegration.determinants.map((d, i) => (
              <span key={i} className="study-report__psl-determinant">
                {d}
              </span>
            ))}
          </div>
          <p className="study-report__psl-contribution">
            {note.pslIntegration.contribution}
          </p>
          <p className="study-report__psl-contribution" style={{ marginTop: "8px", fontStyle: "italic" }}>
            {pslParagraph}
          </p>
        </section>
      )}

      {/* ── COHERENCIA CON OTRAS EVIDENCIAS ──────────────────────────────── */}
      <section className="study-report__section">
        <p className="study-report__section-title">Coherencia con otras evidencias</p>
        <p className="study-report__interpretation">
          El apoyo social funcional (DUKE-EAS) es un determinante reconocido de la salud
          mental percibida. Cuando el SF-12 MCS está disponible, la concordancia o
          discrepancia entre ambos resultados amplía el diagnóstico: un MCS por debajo
          de la norma española combinado con apoyo social bajo señalaría que dos
          dimensiones relacionales apuntan en la misma dirección para {mun}. Una
          discrepancia — apoyo bajo con MCS dentro del rango — no es contradictoria,
          ya que ambos instrumentos miden percepciones distintas. Si el IBSE escolar está
          disponible, el cruce entre el Factor Vínculo escolar y el apoyo social adulto
          puede caracterizar el perfil relacional del municipio en su conjunto.
        </p>
      </section>

      {/* ── SECCIONES COLAPSABLES ────────────────────────────────────────── */}

      <details className="study-report__collapsible">
        <summary>Descripción del instrumento</summary>
        <div className="study-report__collapsible-body">
          <dl className="study-report__instrument-dl">
            <dt>Nombre oficial</dt>
            <dd>{module.identity.name}</dd>
            <dt>Acrónimo</dt>
            <dd>{module.identity.shortName}</dd>
            <dt>Constructo</dt>
            <dd>{module.identity.description}</dd>
            <dt>Población objetivo</dt>
            <dd>{module.identity.targetPopulation}</dd>
            <dt>Ítems</dt>
            <dd>
              {module.items.length} ítems · escala Likert 1–5
              (1 = mucho menos de lo que deseo … 5 = tanto como deseo)
            </dd>
            <dt>Rango</dt>
            <dd>
              {module.interpretation.scale.min}–{module.interpretation.scale.max} ·
              mayor puntuación = mayor apoyo percibido
            </dd>
          </dl>

          <p className="study-report__subsection-title">Dimensiones</p>
          {module.dimensions.map((d) => (
            <p key={d.id} className="study-report__dimension-item">
              <strong>{d.name}</strong> — {d.description}
            </p>
          ))}

          {module.algorithm.notes && (
            <p className="study-report__algo-note">
              Nota de implementación: {module.algorithm.notes}
            </p>
          )}
        </div>
      </details>

      {note?.publicHealthApplication && (
        <details className="study-report__collapsible">
          <summary>Aplicación en salud pública</summary>
          <div className="study-report__collapsible-body">
            <p className="study-report__subsection-title">Qué mide</p>
            <ul className="study-report__sp-list">
              {note.publicHealthApplication.measures.map((m, i) => (
                <li key={i}>{m}</li>
              ))}
            </ul>

            <p className="study-report__subsection-title">Qué no mide</p>
            <ul className="study-report__sp-list">
              {note.publicHealthApplication.doesNotMeasure.map((m, i) => (
                <li key={i}>{m}</li>
              ))}
            </ul>

            <p className="study-report__subsection-title">Contexto de uso</p>
            <ul className="study-report__sp-list">
              {note.publicHealthApplication.contextualUse.map((m, i) => (
                <li key={i}>{m}</li>
              ))}
            </ul>

            {note.publicHealthApplication.commonMisinterpretations && (
              <>
                <p className="study-report__subsection-title">
                  Errores de interpretación frecuentes
                </p>
                <ul className="study-report__sp-list study-report__sp-list--caution">
                  {note.publicHealthApplication.commonMisinterpretations.map(
                    (m, i) => (
                      <li key={i}>{m}</li>
                    )
                  )}
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
                {module.limitations.map((l, i) => (
                  <li key={i}>{l}</li>
                ))}
              </ul>
            </>
          )}
          {dukeStudy.methodologicalCautions.length > 0 && (
            <>
              <p className="study-report__subsection-title">De la muestra importada</p>
              <ul className="study-report__cautions-list">
                {dukeStudy.methodologicalCautions.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
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
            <dd className="study-report__evidence-file">{dukeStudy.sourceFileName}</dd>
            <dt>Fecha de importación</dt>
            <dd>{formatDate(dukeStudy.createdAt)}</dd>
            <dt>Tipo de fuente</dt>
            <dd>Microdatos EAS — Encuesta Andaluza de Salud</dd>
            <dt>Registros procesados</dt>
            <dd>{agg.n}</dd>
            <dt>Registros válidos — global</dt>
            <dd>{agg.nValidGlobal}</dd>
            <dt>Registros válidos — confidencial</dt>
            <dd>{agg.nValidConfidential}</dd>
            <dt>Registros válidos — afectivo</dt>
            <dd>{agg.nValidAffective}</dd>
            <dt>Registros incompletos (cód. 993)</dt>
            <dd>{agg.incompleteGlobalCount}</dd>
          </dl>
        </div>
      </details>

      <details className="study-report__collapsible">
        <summary>Fundamento científico</summary>
        <div className="study-report__collapsible-body">
          {module.bibliography.map((ref, i) => (
            <div key={i} className="study-report__bib-item">
              <span className="study-report__bib-role">
                {i === 0 ? "Instrumento original" : "Validación española"}
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
