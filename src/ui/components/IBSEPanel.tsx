import type { IBSEStudy } from "../../domain/ibse";

interface IBSEPanelProps {
  ibseStudy?: IBSEStudy;
  isLoading?: boolean;
  message?: string | null;
  onLoadCSV?: (file: File) => void;
}

// [Regla del sistema] Umbrales heurísticos — no normativos ni clínicos.
function nivelLabel(valor: number): string {
  if (valor >= 75) return "alto";
  if (valor >= 60) return "medio";
  if (valor >= 50) return "medio-bajo";
  return "bajo";
}

interface IBSEBarRowProps {
  label: string;
  value: number;
  isTotal?: boolean;
}

function IBSEBarRow({ label, value, isTotal = false }: IBSEBarRowProps) {
  const nivel = nivelLabel(value);
  return (
    <tr className={`study-bar-row${isTotal ? " study-bar-row--total" : ""}`}>
      <td className="study-bar-row__label">{label}</td>
      <td className="study-bar-row__track-cell">
        <div className="study-bar-track">
          <div
            className="study-bar-fill"
            style={{ width: `${value}%` }}
            aria-label={`${value} sobre 100`}
          />
          <span className="study-bar-mark study-bar-mark--50"  title="Umbral medio-bajo (50)" />
          <span className="study-bar-mark study-bar-mark--60"  title="Umbral medio (60)" />
          <span className="study-bar-mark study-bar-mark--75"  title="Umbral alto (75)" />
        </div>
      </td>
      <td className="study-bar-row__value">{value}</td>
      <td className="study-bar-row__level" data-level={nivel}>{nivel}</td>
    </tr>
  );
}

export function IBSEPanel({
  ibseStudy,
  isLoading,
  message,
  onLoadCSV,
}: IBSEPanelProps) {
  return (
    <section className="workspace-panel">
      {/* Upload zone — solo si no hay datos ya cargados en StudyRow */}
      <div className="study-upload">
        <div className="study-upload__zone">
          <label htmlFor="ibse-panel-csv-input" className="study-upload__label">
            Cargar exportación REDCap (.csv)
          </label>
          <input
            id="ibse-panel-csv-input"
            type="file"
            accept=".csv"
            disabled={isLoading === true}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file !== undefined && onLoadCSV !== undefined) onLoadCSV(file);
              e.target.value = "";
            }}
            className="study-upload__input"
          />
        </div>
        {isLoading === true && (
          <p className="study-hint">Procesando CSV IBSE…</p>
        )}
        {message !== undefined && message !== null && isLoading !== true && (
          <p className="study-hint">{message}</p>
        )}
      </div>

      {ibseStudy !== undefined ? (
        <div className="study-results">

          {/* Metadatos de muestra */}
          <p className="study-meta">
            Fuente: <strong>{ibseStudy.sourceFileName}</strong>
            {" · "}
            n válido = {ibseStudy.aggregates.nValid}
            {" · "}
            n bruto = {ibseStudy.aggregates.n}
            {ibseStudy.aggregates.n > 0 && (
              <>
                {" · "}
                Incompletos: {(
                  ((ibseStudy.aggregates.n - ibseStudy.aggregates.nValid) / ibseStudy.aggregates.n) * 100
                ).toFixed(1)} %
              </>
            )}
          </p>

          {/* Tabla de resultados con barras proporcionales */}
          <div className="study-bar-section">
            <div className="study-bar-scale">
              <span style={{ left: "50%" }} className="study-bar-scale__mark" title="50">50</span>
              <span style={{ left: "60%" }} className="study-bar-scale__mark" title="60">60</span>
              <span style={{ left: "75%" }} className="study-bar-scale__mark" title="75">75</span>
              <span style={{ left: "100%" }} className="study-bar-scale__mark study-bar-scale__mark--end" title="100">100</span>
            </div>
            <table className="study-bar-table">
              <tbody>
                <IBSEBarRow
                  label="IBSE Total"
                  value={ibseStudy.aggregates.meanTotal}
                  isTotal
                />
                <IBSEBarRow
                  label="Vínculo"
                  value={ibseStudy.aggregates.meanFactorVinculo}
                />
                <IBSEBarRow
                  label="Situación"
                  value={ibseStudy.aggregates.meanFactorSituacion}
                />
                <IBSEBarRow
                  label="Control"
                  value={ibseStudy.aggregates.meanFactorControl}
                />
                <IBSEBarRow
                  label="Persona"
                  value={ibseStudy.aggregates.meanFactorPersona}
                />
              </tbody>
            </table>
          </div>

          {/* Leyenda de umbrales */}
          <p className="study-threshold-legend">
            Umbrales del sistema (heurísticos, no normativos):
            {" "}<span className="study-threshold-badge" data-level="bajo">bajo &lt;50</span>
            {" "}<span className="study-threshold-badge" data-level="medio-bajo">medio-bajo 50–59</span>
            {" "}<span className="study-threshold-badge" data-level="medio">medio 60–74</span>
            {" "}<span className="study-threshold-badge" data-level="alto">alto ≥75</span>
          </p>

          {/* Dispersión interfactorial */}
          {(() => {
            const factores = [
              ibseStudy.aggregates.meanFactorVinculo,
              ibseStudy.aggregates.meanFactorSituacion,
              ibseStudy.aggregates.meanFactorControl,
              ibseStudy.aggregates.meanFactorPersona,
            ];
            const min = Math.min(...factores);
            const max = Math.max(...factores);
            const rango = Math.round((max - min) * 10) / 10;
            const nivelDispersion =
              rango > 20 ? "alta" : rango > 10 ? "moderada" : "baja";
            return (
              <p className={`study-dispersion study-dispersion--${nivelDispersion}`}>
                Dispersión interfactorial: {rango} puntos ({nivelDispersion}).
                {rango > 20 && (
                  <> El índice total puede no representar adecuadamente la diversidad de dimensiones.
                  Se recomienda revisar cada factor de forma independiente.
                  <em> [Regla del sistema]</em></>
                )}
              </p>
            );
          })()}

          {/* Referencias comparativas */}
          <div className="study-refs">
            <p className="study-refs__title">Referencias comparativas</p>
            <p className="study-refs__item">Granada: sin referencia disponible.</p>
            <p className="study-refs__item">Andalucía: sin referencia disponible.</p>
          </div>

          {/* Cautelas metodológicas */}
          {ibseStudy.methodologicalCautions.length > 0 && (
            <div className="study-cautions">
              <p className="study-cautions__title">Cautelas metodológicas</p>
              <ul className="study-cautions__list">
                {ibseStudy.methodologicalCautions.map((caution, i) => (
                  <li key={i}>{caution}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Recordatorio institucional */}
          <p className="study-institutional-note">
            La decisión territorial corresponde siempre al equipo técnico.
          </p>
        </div>
      ) : (
        <p className="empty-state">
          Ningún estudio IBSE cargado para este municipio. Importa la
          exportación CSV desde REDCap.
        </p>
      )}
    </section>
  );
}
