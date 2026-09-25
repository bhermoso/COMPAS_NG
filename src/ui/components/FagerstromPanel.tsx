import type { FagerstromStudy } from "../../domain/fagerstrom";
import { FAGERSTROM_MODULE } from "../../domain/methodology/definitions/fagerstrom";

interface FagerstromPanelProps {
  fagerstromStudy?: FagerstromStudy;
  municipalityName?: string;
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" });
  } catch { return iso.slice(0, 10); }
}

function getSampleQualityVerdict(n: number): { label: string; key: "adecuada" | "moderada" | "insuficiente"; note: string } {
  if (n >= 50) return { label: "Adecuada", key: "adecuada", note: `Tamaño muestral adecuado para una submuestra de fumadores (${n} registros).` };
  if (n >= 15) return { label: "Moderada", key: "moderada", note: `Tamaño muestral modesto para fumadores (${n} registros). Resultados descriptivos.` };
  return { label: "Insuficiente", key: "insuficiente", note: `Muestra muy reducida (${n} fumadores). Precaución extrema.` };
}

export function FagerstromPanel({ fagerstromStudy, municipalityName }: FagerstromPanelProps) {
  if (fagerstromStudy === undefined) return null;
  const module = FAGERSTROM_MODULE;
  const note = module.institutionalNote;
  const mun = municipalityName ?? "el municipio";
  const { aggregates: agg } = fagerstromStudy;
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
          <span className="study-report__tag">Solo fumadores activos</span>
          <span className="study-report__meta-date">Importado el {formatDate(fagerstromStudy.createdAt)}</span>
          <span className="study-report__meta-n">{agg.nValid} fumadores · dep. mod.+ {agg.pctPositive.toFixed(1)} %</span>
        </div>
      </header>

      <section className="study-report__section">
        <p className="study-report__section-title">En síntesis</p>
        <ul className="study-report__summary-list">
          <li>En {mun}, el {agg.pctPositive.toFixed(1)} % de los fumadores activos evaluados (n={agg.nPositive} de {agg.nValid}) presenta dependencia moderada o superior (FTND ≥5).</li>
          <li>Score medio: {agg.meanScore.toFixed(2)}/10. Distribución: muy baja {agg.nVeryLow}, baja {agg.nLow}, moderada {agg.nModerate}, alta {agg.nHigh}, muy alta {agg.nVeryHigh}.</li>
          {agg.missing > 0 && <li>{agg.missing} de {agg.n} registros excluidos ({missingRate} %).</li>}
          <li>{quality.note}</li>
        </ul>
      </section>

      <section className="study-report__section">
        <p className="study-report__section-title">Resultados en {mun} (fumadores activos)</p>
        <div className="study-bar-section">
          <table className="study-bar-table">
            <tbody>
              {[
                { label: "Dependencia mod. o superior (≥5)", value: agg.nPositive, pct: agg.pctPositive, total: true },
                { label: "Muy baja (0–2)", value: agg.nVeryLow, pct: agg.nValid > 0 ? (agg.nVeryLow / agg.nValid) * 100 : 0, total: false },
                { label: "Baja (3–4)", value: agg.nLow, pct: agg.nValid > 0 ? (agg.nLow / agg.nValid) * 100 : 0, total: false },
                { label: "Moderada (5)", value: agg.nModerate, pct: agg.nValid > 0 ? (agg.nModerate / agg.nValid) * 100 : 0, total: false },
                { label: "Alta (6–7)", value: agg.nHigh, pct: agg.nValid > 0 ? (agg.nHigh / agg.nValid) * 100 : 0, total: false },
                { label: "Muy alta (8–10)", value: agg.nVeryHigh, pct: agg.nValid > 0 ? (agg.nVeryHigh / agg.nValid) * 100 : 0, total: false },
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
          <div className="study-report__quality-cell"><span className="study-report__quality-label">Fumadores evaluados</span><span className="study-report__quality-value">{agg.nValid}</span></div>
          <div className="study-report__quality-cell"><span className="study-report__quality-label">Excluidos</span><span className="study-report__quality-value">{agg.missing}</span></div>
          <div className="study-report__quality-cell"><span className="study-report__quality-label">Procesados</span><span className="study-report__quality-value">{agg.n}</span></div>
          <div className="study-report__quality-cell"><span className="study-report__quality-label">Valoración</span><span className={`study-report__quality-verdict study-report__quality-verdict--${quality.key}`}>{quality.label}</span></div>
        </div>
      </section>

      <details className="study-report__collapsible">
        <summary>Cautelas metodológicas</summary>
        <div className="study-report__collapsible-body">
          <ul className="study-report__cautions-list">
            {[...module.limitations, ...fagerstromStudy.methodologicalCautions].map((c, i) => <li key={i}>{c}</li>)}
          </ul>
        </div>
      </details>

      <details className="study-report__collapsible">
        <summary>Evidencia y trazabilidad</summary>
        <div className="study-report__collapsible-body">
          <dl className="study-report__evidence-dl">
            <dt>Archivo fuente</dt><dd className="study-report__evidence-file">{fagerstromStudy.sourceFileName}</dd>
            <dt>Fecha de importación</dt><dd>{formatDate(fagerstromStudy.createdAt)}</dd>
            <dt>Registros procesados</dt><dd>{agg.n}</dd>
            <dt>Fumadores válidos</dt><dd>{agg.nValid}</dd>
            <dt>Dependencia mod.+ (≥5)</dt><dd>{agg.nPositive}</dd>
          </dl>
        </div>
      </details>

      <p className="study-institutional-note">La decisión territorial corresponde siempre al equipo técnico.</p>
    </div>
  );
}
