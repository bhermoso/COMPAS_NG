import type { SBQStudy } from "../../domain/sbq";
import { SBQ_MODULE } from "../../domain/methodology/definitions/sbq";

interface SBQPanelProps {
  sbqStudy?: SBQStudy;
  municipalityName?: string;
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" });
  } catch { return iso.slice(0, 10); }
}

function getSampleQualityVerdict(n: number): { label: string; key: "adecuada" | "moderada" | "insuficiente"; note: string } {
  if (n >= 100) return { label: "Adecuada", key: "adecuada", note: `Tamaño muestral adecuado (${n} registros válidos).` };
  if (n >= 30) return { label: "Moderada", key: "moderada", note: `Tamaño muestral modesto (${n} registros válidos). Resultados descriptivos.` };
  return { label: "Insuficiente", key: "insuficiente", note: `Muestra reducida (${n} registros). Precaución extrema.` };
}

export function SBQPanel({ sbqStudy, municipalityName }: SBQPanelProps) {
  if (sbqStudy === undefined) return null;
  const module = SBQ_MODULE;
  const note = module.institutionalNote;
  const mun = municipalityName ?? "el municipio";
  const { aggregates: agg } = sbqStudy;
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
          <span className="study-report__meta-date">Importado el {formatDate(sbqStudy.createdAt)}</span>
          <span className="study-report__meta-n">{agg.nValid} válidos · alt. sedentario {agg.pctPositive.toFixed(1)} %</span>
        </div>
      </header>

      <section className="study-report__section">
        <p className="study-report__section-title">En síntesis</p>
        <ul className="study-report__summary-list">
          <li>En {mun}, el {agg.pctPositive.toFixed(1)} % (n={agg.nPositive} de {agg.nValid}) presenta comportamiento altamente sedentario (SBQ >8h/día).</li>
          <li>Media de tiempo sedentario: {agg.meanHours.toFixed(2)} h/día. Distribución: bajo (≤4h) {agg.nLow}, moderado (4–8h) {agg.nModerate}, alto (>8h) {agg.nHigh}.</li>
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
                { label: "Altamente sedentario (>8h)", value: agg.nPositive, pct: agg.pctPositive, total: true },
                { label: "Sedentarismo bajo (≤4h)", value: agg.nLow, pct: agg.nValid > 0 ? (agg.nLow / agg.nValid) * 100 : 0, total: false },
                { label: "Sedentarismo moderado (4–8h)", value: agg.nModerate, pct: agg.nValid > 0 ? (agg.nModerate / agg.nValid) * 100 : 0, total: false },
                { label: "Sedentarismo alto (>8h)", value: agg.nHigh, pct: agg.nValid > 0 ? (agg.nHigh / agg.nValid) * 100 : 0, total: false },
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
            {[...module.limitations, ...sbqStudy.methodologicalCautions].map((c, i) => <li key={i}>{c}</li>)}
          </ul>
        </div>
      </details>

      <details className="study-report__collapsible">
        <summary>Evidencia y trazabilidad</summary>
        <div className="study-report__collapsible-body">
          <dl className="study-report__evidence-dl">
            <dt>Archivo fuente</dt><dd className="study-report__evidence-file">{sbqStudy.sourceFileName}</dd>
            <dt>Fecha de importación</dt><dd>{formatDate(sbqStudy.createdAt)}</dd>
            <dt>Registros procesados</dt><dd>{agg.n}</dd>
            <dt>Registros válidos</dt><dd>{agg.nValid}</dd>
            <dt>Altamente sedentarios (>8h)</dt><dd>{agg.nPositive}</dd>
            <dt>Media horas/día</dt><dd>{agg.meanHours.toFixed(2)} h</dd>
          </dl>
        </div>
      </details>

      <p className="study-institutional-note">La decisión territorial corresponde siempre al equipo técnico.</p>
    </div>
  );
}
