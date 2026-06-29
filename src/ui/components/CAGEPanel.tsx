import type { CAGEStudy } from "../../domain/cage";

interface CAGEPanelProps {
  cageStudy?: CAGEStudy;
  isLoading?: boolean;
  message?: string | null;
  onLoadCSV?: (file: File) => void;
}

// CAGE-EAS: cribado de riesgo de alcoholismo (variable dicotómica CAGE_R).
// CAGE ordinal 1–4: 1 = bebedor social, 2 = consumo de riesgo, 3 = perjudicial, 4 = dependencia.
// Cautela: el CAGE es un cribado, no un diagnóstico clínico.

export function CAGEPanel({
  cageStudy,
  isLoading,
  message,
  onLoadCSV,
}: CAGEPanelProps) {
  return (
    <section className="workspace-panel">
      <div className="study-upload">
        <div className="study-upload__zone">
          <label htmlFor="cage-panel-csv-input" className="study-upload__label">
            Cargar CSV CAGE-EAS (.csv)
          </label>
          <input
            id="cage-panel-csv-input"
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
          <p className="study-hint">Procesando CSV CAGE-EAS…</p>
        )}
        {message !== undefined && message !== null && isLoading !== true && (
          <p className="study-hint">{message}</p>
        )}
      </div>

      {cageStudy !== undefined ? (
        <div className="study-results">

          <p className="study-meta">
            Fuente: <strong>{cageStudy.sourceFileName}</strong>
            {" · "}
            n procesados = {cageStudy.aggregates.n}
            {" · "}
            n válido CAGE_R = {cageStudy.aggregates.nValidCAGER}
            {cageStudy.aggregates.missingCAGER > 0 && (
              <> · Abstinentes / no administrado: {cageStudy.aggregates.missingCAGER}</>
            )}
          </p>

          <div className="study-bar-section">
            <table className="study-bar-table">
              <tbody>
                <tr className="study-bar-row study-bar-row--total">
                  <td className="study-bar-row__label">Riesgo de alcoholismo (CAGE_R)</td>
                  <td className="study-bar-row__track-cell">
                    <div className="study-bar-track">
                      <div
                        className="study-bar-fill"
                        style={{ width: `${cageStudy.aggregates.pctRisk}%` }}
                        aria-label={`${cageStudy.aggregates.pctRisk.toFixed(1)} %`}
                      />
                    </div>
                  </td>
                  <td className="study-bar-row__value">
                    {cageStudy.aggregates.pctRisk.toFixed(1)} %
                  </td>
                  <td className="study-bar-row__level">
                    n={cageStudy.aggregates.nRisk} de {cageStudy.aggregates.nValidCAGER}
                  </td>
                </tr>

                {/* Distribución ordinal CAGE si disponible */}
                {cageStudy.aggregates.nValidCAGE > 0 && (
                  <>
                    <tr className="study-bar-row">
                      <td className="study-bar-row__label">Bebedor social (nivel 1)</td>
                      <td className="study-bar-row__track-cell">
                        <div className="study-bar-track">
                          <div
                            className="study-bar-fill"
                            style={{
                              width: `${(cageStudy.aggregates.nCAGE1 / cageStudy.aggregates.nValidCAGE) * 100}%`
                            }}
                          />
                        </div>
                      </td>
                      <td className="study-bar-row__value">
                        {((cageStudy.aggregates.nCAGE1 / cageStudy.aggregates.nValidCAGE) * 100).toFixed(1)} %
                      </td>
                      <td className="study-bar-row__level">n={cageStudy.aggregates.nCAGE1}</td>
                    </tr>
                    <tr className="study-bar-row">
                      <td className="study-bar-row__label">Consumo de riesgo (nivel 2)</td>
                      <td className="study-bar-row__track-cell">
                        <div className="study-bar-track">
                          <div
                            className="study-bar-fill"
                            style={{
                              width: `${(cageStudy.aggregates.nCAGE2 / cageStudy.aggregates.nValidCAGE) * 100}%`
                            }}
                          />
                        </div>
                      </td>
                      <td className="study-bar-row__value">
                        {((cageStudy.aggregates.nCAGE2 / cageStudy.aggregates.nValidCAGE) * 100).toFixed(1)} %
                      </td>
                      <td className="study-bar-row__level">n={cageStudy.aggregates.nCAGE2}</td>
                    </tr>
                    <tr className="study-bar-row">
                      <td className="study-bar-row__label">Consumo perjudicial (nivel 3)</td>
                      <td className="study-bar-row__track-cell">
                        <div className="study-bar-track">
                          <div
                            className="study-bar-fill"
                            style={{
                              width: `${(cageStudy.aggregates.nCAGE3 / cageStudy.aggregates.nValidCAGE) * 100}%`
                            }}
                          />
                        </div>
                      </td>
                      <td className="study-bar-row__value">
                        {((cageStudy.aggregates.nCAGE3 / cageStudy.aggregates.nValidCAGE) * 100).toFixed(1)} %
                      </td>
                      <td className="study-bar-row__level">n={cageStudy.aggregates.nCAGE3}</td>
                    </tr>
                    <tr className="study-bar-row">
                      <td className="study-bar-row__label">Dependencia grave (nivel 4)</td>
                      <td className="study-bar-row__track-cell">
                        <div className="study-bar-track">
                          <div
                            className="study-bar-fill"
                            style={{
                              width: `${(cageStudy.aggregates.nCAGE4 / cageStudy.aggregates.nValidCAGE) * 100}%`
                            }}
                          />
                        </div>
                      </td>
                      <td className="study-bar-row__value">
                        {((cageStudy.aggregates.nCAGE4 / cageStudy.aggregates.nValidCAGE) * 100).toFixed(1)} %
                      </td>
                      <td className="study-bar-row__level">n={cageStudy.aggregates.nCAGE4}</td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>

          <div className="study-refs">
            <p className="study-refs__title">Referencias comparativas</p>
            <p className="study-refs__item">Granada: sin referencia disponible.</p>
            <p className="study-refs__item">Andalucía: sin referencia disponible.</p>
          </div>

          {cageStudy.methodologicalCautions.length > 0 && (
            <div className="study-cautions">
              <p className="study-cautions__title">Cautelas metodológicas</p>
              <ul className="study-cautions__list">
                {cageStudy.methodologicalCautions.map((caution, i) => (
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
          Ningún estudio CAGE-EAS cargado para este municipio. Importa un CSV con
          la columna <code>CAGE_R</code> y opcionalmente <code>CAGE</code>.
        </p>
      )}
    </section>
  );
}
