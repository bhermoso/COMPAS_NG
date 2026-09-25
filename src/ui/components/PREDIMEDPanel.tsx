import type { PREDIMEDStudy } from "../../domain/predimed";
import { PREDIMED_EAS_MODULE } from "../../domain/methodology/definitions/predimed-eas";
import { getSampleQualityVerdict } from "./studyPanelUtils";

interface PREDIMEDPanelProps {
  predimedStudy?: PREDIMEDStudy;
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

function getPREDIMEDLevel(mean: number): "alta" | "media" | "baja" {
  if (mean >= 9) return "alta";
  if (mean >= 7) return "media";
  return "baja";
}

function predimedTerritorialNarrative(municipalMean: number, refGranada: number): string {
  const diff = municipalMean - refGranada;
  let comparison: string;
  if (Math.abs(diff) <= 0.4)
    comparison = `es próxima a la referencia provincial de Granada (${refGranada}/14)`;
  else if (diff > 0)
    comparison = `supera la referencia de Granada (${refGranada}/14) en ${diff.toFixed(1)} puntos`;
  else
    comparison = `se sitúa ${Math.abs(diff).toFixed(1)} puntos por debajo de la referencia de Granada (${refGranada}/14)`;
  return `La media de adherencia del municipio (${municipalMean.toFixed(1)}/14) ${comparison}. No se dispone de una referencia desagregada para Andalucía en esta variable. La referencia provincial procede de los microdatos EAS de Granada (n = 712 registros válidos de un total de 3.064; únicamente las oleadas con módulo PREDIMED).`;
}

const PREDIMED_MAX = 14;
const LEVEL_SUMMARY: Record<string, string> = {
  alta: "El nivel de adherencia a la dieta mediterránea es alto.",
  media: "El nivel de adherencia a la dieta mediterránea es medio.",
  baja: "El nivel de adherencia a la dieta mediterránea es bajo.",
};

// ── Componente ────────────────────────────────────────────────────────────────

export function PREDIMEDPanel({ predimedStudy, municipalityName }: PREDIMEDPanelProps) {
  if (predimedStudy === undefined) return null;

  const module = PREDIMED_EAS_MODULE;
  const note = module.institutionalNote;
  const ref = module.interpretation.referenceValues;
  const mun = municipalityName ?? "el municipio";
  const { aggregates: agg } = predimedStudy;

  const level = getPREDIMEDLevel(agg.meanScore);
  const quality = getSampleQualityVerdict(agg.nValid);

  const executiveSummary: string[] = [
    `La población adulta de ${mun} obtiene una media de adherencia mediterránea de ${agg.meanScore.toFixed(1)}/14. ${LEVEL_SUMMARY[level]}`,
    `Distribución: alta adherencia (≥9) ${agg.highPercentage.toFixed(1)} % · media (7–8) ${agg.mediumPercentage.toFixed(1)} % · baja (≤6) ${agg.lowPercentage.toFixed(1)} %.`,
    quality.note,
  ];

  const pslParagraph =
    `En ${mun}, la adherencia a la dieta mediterránea (PREDIMED-EAS, n = ${agg.nValid} adultos con puntuación válida) ` +
    `muestra una media de ${agg.meanScore.toFixed(1)}/14 — adherencia ${level}. ` +
    `El ${agg.highPercentage.toFixed(1)} % de la muestra presenta alta adherencia (≥9), ` +
    `el ${agg.mediumPercentage.toFixed(1)} % adherencia media (7–8) ` +
    `y el ${agg.lowPercentage.toFixed(1)} % baja adherencia (≤6). ` +
    `Este resultado aporta evidencia sobre el patrón alimentario de la población adulta ` +
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
          <span className="study-report__meta-date">Importado el {formatDate(predimedStudy.createdAt)}</span>
          <span className="study-report__meta-n">{agg.nValid} registros válidos</span>
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
                <td className="study-bar-row__label">Media de adherencia</td>
                <td className="study-bar-row__track-cell">
                  <div className="study-bar-track">
                    <div className="study-bar-fill"
                      style={{ width: `${(agg.meanScore / PREDIMED_MAX) * 100}%` }}
                      aria-label={`${agg.meanScore.toFixed(1)} sobre ${PREDIMED_MAX}`}
                    />
                    {/* Corte baja/media: 6/14 ≈ 42.9 % */}
                    <span className="study-bar-mark" style={{ left: "42.9%" }}
                      title="Corte baja/media: 6/14" />
                    {/* Corte media/alta: 9/14 ≈ 64.3 % */}
                    <span className="study-bar-mark" style={{ left: "64.3%" }}
                      title="Corte media/alta: 9/14" />
                    {ref?.mean !== undefined && (
                      <span className="study-bar-mark study-bar-mark--ref"
                        style={{ left: `${(ref.mean / PREDIMED_MAX) * 100}%` }}
                        title={`Referencia EAS Granada: ${ref.mean}`}
                      />
                    )}
                  </div>
                </td>
                <td className="study-bar-row__value">{agg.meanScore.toFixed(1)}/{PREDIMED_MAX}</td>
                <td className="study-bar-row__level">{level}</td>
              </tr>

              {/* Distribución por categorías */}
              <tr className="study-bar-row">
                <td className="study-bar-row__label">Alta adherencia (≥9)</td>
                <td className="study-bar-row__track-cell">
                  <div className="study-bar-track">
                    <div className="study-bar-fill" style={{ width: `${agg.highPercentage}%` }} />
                  </div>
                </td>
                <td className="study-bar-row__value">{agg.highPercentage.toFixed(1)} %</td>
                <td className="study-bar-row__level study-bar-row__level--detail">n={agg.highCount}</td>
              </tr>
              <tr className="study-bar-row">
                <td className="study-bar-row__label">Adherencia media (7–8)</td>
                <td className="study-bar-row__track-cell">
                  <div className="study-bar-track">
                    <div className="study-bar-fill" style={{ width: `${agg.mediumPercentage}%` }} />
                  </div>
                </td>
                <td className="study-bar-row__value">{agg.mediumPercentage.toFixed(1)} %</td>
                <td className="study-bar-row__level study-bar-row__level--detail">n={agg.mediumCount}</td>
              </tr>
              <tr className="study-bar-row">
                <td className="study-bar-row__label">Baja adherencia (≤6)</td>
                <td className="study-bar-row__track-cell">
                  <div className="study-bar-track">
                    <div className="study-bar-fill" style={{ width: `${agg.lowPercentage}%` }} />
                  </div>
                </td>
                <td className="study-bar-row__value">{agg.lowPercentage.toFixed(1)} %</td>
                <td className="study-bar-row__level study-bar-row__level--detail">n={agg.lowCount}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="study-report__legend">
          <span className="study-report__legend-item study-report__legend-item--threshold">
            Cortes: ≤6 baja · 7–8 media · ≥9 alta (adaptación EAS Andalucía)
          </span>
          {ref?.mean !== undefined && (
            <span className="study-report__legend-item study-report__legend-item--ref">
              Ref. EAS Granada: {ref.mean}/14 (n = 712)
            </span>
          )}
        </div>
        {agg.incompleteCount > 0 && (
          <p className="study-report__footnote">
            Sin puntuación Predimed: {agg.incompleteCount} de {agg.n} registros
            ({((agg.incompleteCount / agg.n) * 100).toFixed(1)} %) —
            probable missing estructural por oleada EAS sin módulo PREDIMED.
          </p>
        )}
      </section>

      {/* COMPARACIÓN TERRITORIAL */}
      <section className="study-report__section">
        <p className="study-report__section-title">Comparación territorial</p>
        <dl className="study-report__evidence-dl">
          <dt>{mun} (muestra analizada)</dt>
          <dd>{agg.meanScore.toFixed(1)}/14 — adherencia {level}</dd>
          <dt>Provincia de Granada</dt>
          <dd>
            {ref?.mean !== undefined
              ? `${ref.mean}/14 (EAS Granada, n = 712 de 3.064 procesados)`
              : "Sin referencia disponible"}
          </dd>
          <dt>Andalucía</dt>
          <dd>Sin referencia desagregada disponible para este instrumento en la EAS</dd>
        </dl>
        {ref?.mean !== undefined && (
          <p className="study-report__interpretation">
            {predimedTerritorialNarrative(agg.meanScore, ref.mean)}
          </p>
        )}
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
            <span className="study-report__quality-label">Registros válidos</span>
            <span className="study-report__quality-value">{agg.nValid}</span>
          </div>
          <div className="study-report__quality-cell">
            <span className="study-report__quality-label">Procesados</span>
            <span className="study-report__quality-value">{agg.n}</span>
          </div>
          <div className="study-report__quality-cell">
            <span className="study-report__quality-label">Sin puntuación</span>
            <span className="study-report__quality-value">{agg.incompleteCount}</span>
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
          El PREDIMED-EAS describe el patrón alimentario de la población adulta. Cuando
          el CAGE-EAS está disponible, la lectura conjunta de adherencia a la dieta
          mediterránea y consumo de alcohol enmarca el análisis de estilos de vida del
          municipio: la presencia simultánea de baja adherencia dietética y consumo de
          riesgo en {mun} señalaría dos determinantes de salud cardiovascular actuando
          en la misma dirección. Si la adherencia es alta pero el consumo de riesgo es
          también elevado, la interpretación debe matizarse. El PREDIMED no tiene
          relación directa con los instrumentos de bienestar socioemocional (IBSE)
          o apoyo social (DUKE-EAS), aunque todos contribuyen al capítulo de determinantes
          del Perfil de Salud Local.
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
            <dt>Ítems</dt><dd>{module.items.length} criterios dietéticos dicotómicos (Sí/No)</dd>
            <dt>Rango</dt><dd>0–14 · mayor puntuación = mayor adherencia mediterránea</dd>
            <dt>Fuente</dt><dd>EAS: campo derivado Predimed (pre-calculado)</dd>
          </dl>
          {module.algorithm.notes && (
            <p className="study-report__algo-note">Nota: {module.algorithm.notes}</p>
          )}
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
          {predimedStudy.methodologicalCautions.length > 0 && (
            <>
              <p className="study-report__subsection-title">De la muestra importada</p>
              <ul className="study-report__cautions-list">
                {predimedStudy.methodologicalCautions.map((c, i) => <li key={i}>{c}</li>)}
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
            <dd className="study-report__evidence-file">{predimedStudy.sourceFileName}</dd>
            <dt>Fecha de importación</dt><dd>{formatDate(predimedStudy.createdAt)}</dd>
            <dt>Tipo de fuente</dt><dd>Microdatos EAS — Encuesta Andaluza de Salud</dd>
            <dt>Registros procesados</dt><dd>{agg.n}</dd>
            <dt>Registros válidos</dt><dd>{agg.nValid}</dd>
            <dt>Sin puntuación Predimed</dt><dd>{agg.incompleteCount}</dd>
          </dl>
        </div>
      </details>

      <details className="study-report__collapsible">
        <summary>Fundamento científico</summary>
        <div className="study-report__collapsible-body">
          {module.bibliography.map((ref, i) => (
            <div key={i} className="study-report__bib-item">
              <span className="study-report__bib-role">
                {i === 0 ? "Umbrales de adherencia (EAS Andalucía)" : "Estudio de validación"}
              </span>
              {ref.authors} ({ref.year}).{ref.title && <> <em>{ref.title}</em>.</>}
              {ref.source && <> {ref.source}.</>}
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
