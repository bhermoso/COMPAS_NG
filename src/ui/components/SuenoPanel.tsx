import type { SuenoStudy } from "../../domain/sueno";

interface SuenoPanelProps {
  suenoStudy?: SuenoStudy;
  isLoading?: boolean;
  message?: string | null;
  onLoadCSV?: (file: File) => void;
}

// Sueño EAS: variables autorreferidas de duración y calidad del sueño.
// Referencia epidemiológica: ~29 % de discordancia duración/calidad esperada.

export function SuenoPanel({
  suenoStudy,
  isLoading,
  message,
  onLoadCSV,
}: SuenoPanelProps) {
  return (
    <section className="workspace-panel">
      <div className="study-upload">
        <div className="study-upload__zone">
          <label htmlFor="sueno-panel-csv-input" className="study-upload__label">
            Cargar CSV Sueño EAS (.csv)
          </label>
          <input
            id="sueno-panel-csv-input"
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
          <p className="study-hint">Procesando CSV Sueño EAS…</p>
        )}
        {message !== undefined && message !== null && isLoading !== true && (
          <p className="study-hint">{message}</p>
        )}
      </div>

      {suenoStudy !== undefined ? (
        <div className="study-results">

          <p className="study-meta">
            Fuente: <strong>{suenoStudy.sourceFileName}</strong>
            {" · "}
            n procesados = {suenoStudy.aggregates.n}
            {" · "}
            n válido P33_R = {suenoStudy.aggregates.nValidP33R}
            {suenoStudy.aggregates.nValidP33A > 0 && (
              <> · n válido P33A = {suenoStudy.aggregates.nValidP33A}</>
            )}
          </p>

          <div className="study-bar-section">
            <table className="study-bar-table">
              <tbody>
                <tr className="study-bar-row study-bar-row--total">
                  <td className="study-bar-row__label">Sueño insuficiente (P33_R)</td>
                  <td className="study-bar-row__track-cell">
                    <div className="study-bar-track">
                      <div
                        className="study-bar-fill"
                        style={{ width: `${suenoStudy.aggregates.pctInsufficientSleep}%` }}
                        aria-label={`${suenoStudy.aggregates.pctInsufficientSleep.toFixed(1)} %`}
                      />
                      {/* Referencia epidemiológica ~29 % */}
                      <span className="study-bar-mark" style={{ left: "29%" }} title="Referencia epidemiológica ~29 %" />
                    </div>
                  </td>
                  <td className="study-bar-row__value">
                    {suenoStudy.aggregates.pctInsufficientSleep.toFixed(1)} %
                  </td>
                  <td className="study-bar-row__level">n={suenoStudy.aggregates.nValidP33R}</td>
                </tr>

                {suenoStudy.aggregates.nValidP33A > 0 && (
                  <tr className="study-bar-row">
                    <td className="study-bar-row__label">No descansa suficiente (P33A)</td>
                    <td className="study-bar-row__track-cell">
                      <div className="study-bar-track">
                        <div
                          className="study-bar-fill"
                          style={{ width: `${suenoStudy.aggregates.pctNoRest}%` }}
                          aria-label={`${suenoStudy.aggregates.pctNoRest.toFixed(1)} %`}
                        />
                      </div>
                    </td>
                    <td className="study-bar-row__value">
                      {suenoStudy.aggregates.pctNoRest.toFixed(1)} %
                    </td>
                    <td className="study-bar-row__level">n={suenoStudy.aggregates.nValidP33A}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {suenoStudy.aggregates.missingP33R > 0 && (
            <p className="study-meta">
              Sin P33_R calculable: {suenoStudy.aggregates.missingP33R} registros.
            </p>
          )}

          <div className="study-refs">
            <p className="study-refs__title">Referencias comparativas</p>
            <p className="study-refs__item">Referencia epidemiológica: ~29 % de personas presentan discordancia duración/calidad.</p>
            <p className="study-refs__item">Granada: sin referencia disponible.</p>
            <p className="study-refs__item">Andalucía: sin referencia disponible.</p>
          </div>

          {suenoStudy.methodologicalCautions.length > 0 && (
            <div className="study-cautions">
              <p className="study-cautions__title">Cautelas metodológicas</p>
              <ul className="study-cautions__list">
                {suenoStudy.methodologicalCautions.map((caution, i) => (
                  <li key={i}>{caution}</li>
                ))}
              </ul>
            </div>
          )}

          <p className="study-institutional-note">
            La decisión territorial corresponde siempre al equipo técnico.
          </p>
        </div>
      ) : (
        <p className="empty-state">
          Ningún estudio Sueño EAS cargado para este municipio. Importa un CSV con
          las columnas <code>P33_R</code> y <code>P33A</code>.
        </p>
      )}
    </section>
  );
}
