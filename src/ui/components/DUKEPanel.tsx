import type { DUKEStudy } from "../../domain/duke";
import { DUKE_EAS_MODULE } from "../../domain/methodology/definitions/duke-eas";

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

function getSampleQualityVerdict(
  n: number
): { label: string; key: "adecuada" | "moderada" | "insuficiente"; note: string } {
  if (n >= 100)
    return {
      label: "Adecuada",
      key: "adecuada",
      note: `El tamaño muestral (${n} registros válidos) permite una lectura descriptiva del municipio.`,
    };
  if (n >= 30)
    return {
      label: "Moderada",
      key: "moderada",
      note: `El tamaño muestral (${n} registros válidos) es modesto. Los resultados son descriptivos de la muestra disponible, no estimaciones de la población total.`,
    };
  return {
    label: "Insuficiente",
    key: "insuficiente",
    note: `La muestra es reducida (${n} registros válidos). Los resultados deben interpretarse con extrema precaución y no deben utilizarse para generalizaciones sobre el municipio.`,
  };
}

const DUKE_MAX = 55;
const DUKE_MAX_CONF = 35;
const DUKE_MAX_AFF = 20;

const LEVEL_SUMMARY: Record<string, string> = {
  adecuado:
    "El nivel medio de apoyo social funcional de la muestra es adecuado.",
  moderado:
    "El nivel medio de apoyo social funcional de la muestra es moderado.",
  bajo: "El nivel medio de apoyo social funcional de la muestra es bajo.",
};

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

  const executiveSummary: string[] = [
    `Se han analizado ${agg.nValidGlobal} registros válidos en ${mun}.`,
    `${LEVEL_SUMMARY[clinicalLevel]} Media: ${agg.meanGlobal.toFixed(1)} sobre ${DUKE_MAX}.`,
    `El ${agg.lowGlobalPercentage.toFixed(1)} % de la muestra presenta indicadores de apoyo social bajo.`,
    quality.note,
    "Este estudio contribuye al análisis de los determinantes sociales del diagnóstico del municipio.",
  ];

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
                    {/* Referencia EAS Granada: media 49.2 */}
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
              Ref. EAS Granada: {ref.mean}
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
        </section>
      )}

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
