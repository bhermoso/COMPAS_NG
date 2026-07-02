import type { GHQ12Study } from "../../domain/ghq12";
import { GHQ12_MODULE } from "../../domain/methodology/definitions/ghq12";

interface GHQ12PanelProps {
  ghq12Study?: GHQ12Study;
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

export function GHQ12Panel({ ghq12Study, municipalityName }: GHQ12PanelProps) {
  if (ghq12Study === undefined) return null;

  const module = GHQ12_MODULE;
  const note = module.institutionalNote;
  const mun = municipalityName ?? "el municipio";
  const { aggregates: agg } = ghq12Study;
  const quality = getSampleQualityVerdict(agg.nValid);
  const missingRate = agg.n > 0 ? ((agg.missing / agg.n) * 100).toFixed(1) : "0.0";

  const pslParagraph =
    `En ${mun}, la prevalencia de probable malestar psicológico según GHQ-12 ` +
    `(n = ${agg.nValid} adultos) es del ${agg.pctPositive.toFixed(1)} % ` +
    `(score bimodal ≥ 3). Score bimodal medio: ${agg.meanBimodal.toFixed(2)}/12.`;

  return (
    <div className="study-report">
      <header className="study-report__header">
        <div className="study-report__header-identity">
          <span className="study-report__label">Estudio complementario</span>
          <h3 className="study-report__name">{module.identity.name}</h3>
          <p className="study-report__constructo">{module.identity.purpose.split(".")[0]}.</p>
        </div>
        <div className="study-report__header-meta">
          <span className="study-report__tag">REDCap municipal</span>
          <span className="study-report__tag">{module.identity.targetPopulation}</span>
          <span className="study-report__meta-date">Importado el {formatDate(ghq12Study.createdAt)}</span>
          <span className="study-report__meta-n">
            {agg.nValid} válidos · {agg.pctPositive.toFixed(1)} % score ≥ 3
          </span>
        </div>
      </header>

      <section className="study-report__section">
        <p className="study-report__section-title">En síntesis</p>
        <ul className="study-report__summary-list">
          <li>En {mun}, el {agg.pctPositive.toFixed(1)} % de la muestra adulta (n={agg.nPositive} de {agg.nValid}) presenta probable malestar psicológico (GHQ-12 bimodal ≥ 3).</li>
          <li>Score bimodal medio: {agg.meanBimodal.toFixed(2)}/12. Distribución: sin indicadores {agg.nScore0to2}, leve-moderado {agg.nScore3to6}, moderado-grave {agg.nScore7to12}.</li>
          {agg.missing > 0 && <li>{agg.missing} de {agg.n} registros excluidos ({missingRate} %).</li>}
          <li>{quality.note}</li>
        </ul>
      </section>

      <section className="study-report__section">
        <p className="study-report__section-title">Resultados en {mun}</p>
        <div className="study-bar-section">
          <table className="study-bar-table">
            <tbody>
              <tr className="study-bar-row study-bar-row--total">
                <td className="study-bar-row__label">Probable malestar (≥ 3)</td>
                <td className="study-bar-row__track-cell">
                  <div className="study-bar-track">
                    <div className="study-bar-fill" style={{ width: `${agg.pctPositive}%` }} />
                  </div>
                </td>
                <td className="study-bar-row__value">{agg.pctPositive.toFixed(1)} %</td>
                <td className="study-bar-row__level study-bar-row__level--detail">n={agg.nPositive} de {agg.nValid}</td>
              </tr>
              <tr className="study-bar-row">
                <td className="study-bar-row__label">Sin indicadores (0–2)</td>
                <td className="study-bar-row__track-cell">
                  <div className="study-bar-track">
                    <div className="study-bar-fill" style={{ width: `${agg.nValid > 0 ? (agg.nScore0to2 / agg.nValid) * 100 : 0}%` }} />
                  </div>
                </td>
                <td className="study-bar-row__value">{agg.nValid > 0 ? ((agg.nScore0to2 / agg.nValid) * 100).toFixed(1) : "0.0"} %</td>
                <td className="study-bar-row__level study-bar-row__level--detail">n={agg.nScore0to2}</td>
              </tr>
              <tr className="study-bar-row">
                <td className="study-bar-row__label">Leve-moderado (3–6)</td>
                <td className="study-bar-row__track-cell">
                  <div className="study-bar-track">
                    <div className="study-bar-fill" style={{ width: `${agg.nValid > 0 ? (agg.nScore3to6 / agg.nValid) * 100 : 0}%` }} />
                  </div>
                </td>
                <td className="study-bar-row__value">{agg.nValid > 0 ? ((agg.nScore3to6 / agg.nValid) * 100).toFixed(1) : "0.0"} %</td>
                <td className="study-bar-row__level study-bar-row__level--detail">n={agg.nScore3to6}</td>
              </tr>
              <tr className="study-bar-row">
                <td className="study-bar-row__label">Moderado-grave (7–12)</td>
                <td className="study-bar-row__track-cell">
                  <div className="study-bar-track">
                    <div className="study-bar-fill" style={{ width: `${agg.nValid > 0 ? (agg.nScore7to12 / agg.nValid) * 100 : 0}%` }} />
                  </div>
                </td>
                <td className="study-bar-row__value">{agg.nValid > 0 ? ((agg.nScore7to12 / agg.nValid) * 100).toFixed(1) : "0.0"} %</td>
                <td className="study-bar-row__level study-bar-row__level--detail">n={agg.nScore7to12}</td>
              </tr>
            </tbody>
          </table>
        </div>
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
      </section>

      {note?.pslIntegration && (
        <section className="study-report__section">
          <p className="study-report__section-title">Integración en el Perfil de Salud Local</p>
          <p className="study-report__psl-chapter">Capítulo: {note.pslIntegration.chapter}</p>
          <p className="study-report__psl-contribution" style={{ fontStyle: "italic" }}>{pslParagraph}</p>
        </section>
      )}

      <details className="study-report__collapsible">
        <summary>Cautelas metodológicas</summary>
        <div className="study-report__collapsible-body">
          {module.limitations.length > 0 && (
            <ul className="study-report__cautions-list">
              {module.limitations.map((l, i) => <li key={i}>{l}</li>)}
            </ul>
          )}
          {ghq12Study.methodologicalCautions.length > 0 && (
            <ul className="study-report__cautions-list">
              {ghq12Study.methodologicalCautions.map((c, i) => <li key={i}>{c}</li>)}
            </ul>
          )}
        </div>
      </details>

      <details className="study-report__collapsible">
        <summary>Evidencia y trazabilidad</summary>
        <div className="study-report__collapsible-body">
          <dl className="study-report__evidence-dl">
            <dt>Archivo fuente</dt><dd className="study-report__evidence-file">{ghq12Study.sourceFileName}</dd>
            <dt>Fecha de importación</dt><dd>{formatDate(ghq12Study.createdAt)}</dd>
            <dt>Tipo de fuente</dt><dd>Encuesta municipal propia — exportación REDCap</dd>
            <dt>Registros procesados</dt><dd>{agg.n}</dd>
            <dt>Registros válidos</dt><dd>{agg.nValid}</dd>
            <dt>Registros excluidos</dt><dd>{agg.missing}</dd>
            <dt>Positivos (≥3)</dt><dd>{agg.nPositive}</dd>
          </dl>
        </div>
      </details>

      <p className="study-institutional-note">
        La decisión territorial corresponde siempre al equipo técnico.
      </p>
    </div>
  );
}
