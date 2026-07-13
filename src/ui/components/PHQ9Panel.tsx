import type { PHQ9Study } from "../../domain/phq9";
import { PHQ9_MODULE } from "../../domain/methodology/definitions/phq9";
import { getSampleQualityVerdict } from "./studyPanelUtils";

interface PHQ9PanelProps {
  phq9Study?: PHQ9Study;
  municipalityName?: string;
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" });
  } catch { return iso.slice(0, 10); }
}

export function PHQ9Panel({ phq9Study, municipalityName }: PHQ9PanelProps) {
  if (phq9Study === undefined) return null;
  const module = PHQ9_MODULE;
  const note = module.institutionalNote;
  const mun = municipalityName ?? "el municipio";
  const { aggregates: agg } = phq9Study;
  const quality = getSampleQualityVerdict(agg.nValid);
  const missingRate = agg.n > 0 ? ((agg.missing / agg.n) * 100).toFixed(1) : "0.0";

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
          <span className="study-report__meta-date">Importado el {formatDate(phq9Study.createdAt)}</span>
          <span className="study-report__meta-n">{agg.nValid} válidos · {agg.pctPositive.toFixed(1)} % score ≥ 10</span>
        </div>
      </header>

      <section className="study-report__section">
        <p className="study-report__section-title">En síntesis</p>
        <ul className="study-report__summary-list">
          <li>En {mun}, el {agg.pctPositive.toFixed(1)} % (n={agg.nPositive} de {agg.nValid}) presenta síntomas depresivos moderados o superiores (PHQ-9 ≥ 10).</li>
          <li>Score medio: {agg.meanScore.toFixed(2)}/27. Distribución: mínimo {agg.nScore0to4}, leve {agg.nScore5to9}, moderado {agg.nScore10to14}, mod.grave {agg.nScore15to19}, grave {agg.nScore20to27}.</li>
          {agg.missing > 0 && <li>{agg.missing} de {agg.n} registros excluidos ({missingRate} %).</li>}
          <li>{quality.note}</li>
        </ul>
      </section>

      <section className="study-report__section">
        <p className="study-report__section-title">Resultados en {mun}</p>
        <div className="study-bar-section">
          <table className="study-bar-table">
            <tbody>
              {[
                { label: "Síntomas moderados o superiores (≥10)", value: agg.nPositive, pct: agg.pctPositive, total: true },
                { label: "Mínimo (0–4)", value: agg.nScore0to4, pct: agg.nValid > 0 ? (agg.nScore0to4 / agg.nValid) * 100 : 0, total: false },
                { label: "Leve (5–9)", value: agg.nScore5to9, pct: agg.nValid > 0 ? (agg.nScore5to9 / agg.nValid) * 100 : 0, total: false },
                { label: "Moderado (10–14)", value: agg.nScore10to14, pct: agg.nValid > 0 ? (agg.nScore10to14 / agg.nValid) * 100 : 0, total: false },
                { label: "Mod. grave (15–19)", value: agg.nScore15to19, pct: agg.nValid > 0 ? (agg.nScore15to19 / agg.nValid) * 100 : 0, total: false },
                { label: "Grave (≥20)", value: agg.nScore20to27, pct: agg.nValid > 0 ? (agg.nScore20to27 / agg.nValid) * 100 : 0, total: false },
              ].map((row, i) => (
                <tr key={i} className={`study-bar-row${row.total ? " study-bar-row--total" : ""}`}>
                  <td className="study-bar-row__label">{row.label}</td>
                  <td className="study-bar-row__track-cell">
                    <div className="study-bar-track"><div className="study-bar-fill" style={{ width: `${Math.min(row.pct, 100)}%` }} /></div>
                  </td>
                  <td className="study-bar-row__value">{row.pct.toFixed(1)} %</td>
                  <td className="study-bar-row__level study-bar-row__level--detail">n={row.value}</td>
                </tr>
              ))}
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
          <div className="study-report__quality-cell"><span className="study-report__quality-label">Registros válidos</span><span className="study-report__quality-value">{agg.nValid}</span></div>
          <div className="study-report__quality-cell"><span className="study-report__quality-label">Excluidos</span><span className="study-report__quality-value">{agg.missing}</span></div>
          <div className="study-report__quality-cell"><span className="study-report__quality-label">Procesados</span><span className="study-report__quality-value">{agg.n}</span></div>
          <div className="study-report__quality-cell"><span className="study-report__quality-label">Valoración</span><span className={`study-report__quality-verdict study-report__quality-verdict--${quality.key}`}>{quality.label}</span></div>
        </div>
      </section>

      <details className="study-report__collapsible">
        <summary>Cautelas metodológicas</summary>
        <div className="study-report__collapsible-body">
          <ul className="study-report__cautions-list">
            {[...module.limitations, ...phq9Study.methodologicalCautions].map((c, i) => <li key={i}>{c}</li>)}
          </ul>
        </div>
      </details>

      <details className="study-report__collapsible">
        <summary>Evidencia y trazabilidad</summary>
        <div className="study-report__collapsible-body">
          <dl className="study-report__evidence-dl">
            <dt>Archivo fuente</dt><dd className="study-report__evidence-file">{phq9Study.sourceFileName}</dd>
            <dt>Fecha de importación</dt><dd>{formatDate(phq9Study.createdAt)}</dd>
            <dt>Registros procesados</dt><dd>{agg.n}</dd>
            <dt>Registros válidos</dt><dd>{agg.nValid}</dd>
            <dt>Positivos (≥10)</dt><dd>{agg.nPositive}</dd>
          </dl>
        </div>
      </details>

      <p className="study-institutional-note">La decisión territorial corresponde siempre al equipo técnico.</p>
    </div>
  );
}
