import type { PREDIMEDStudy } from "../../domain/predimed";

interface PREDIMEDPanelProps {
  predimedStudy?: PREDIMEDStudy;
  isLoading?: boolean;
  message?: string | null;
  onLoadCSV?: (file: File) => void;
}

// PREDIMED-14: 14 ítems binarios. Cortes: alta ≥9, media 7–8, baja ≤6.

export function PREDIMEDPanel({
  predimedStudy,
  isLoading,
  message,
  onLoadCSV,
}: PREDIMEDPanelProps) {
  return (
    <section className="workspace-panel">
      <div className="study-upload">
        <div className="study-upload__zone">
          <label htmlFor="predimed-csv-input" className="study-upload__label">
            Cargar CSV PREDIMED-EAS (.csv)
          </label>
          <input
            id="predimed-csv-input"
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
          <p className="study-hint">Procesando CSV PREDIMED-EAS…</p>
        )}
        {message !== undefined && message !== null && isLoading !== true && (
          <p className="study-hint">{message}</p>
        )}
      </div>

      {predimedStudy !== undefined ? (
        <div className="study-results">

          <p className="study-meta">
            Fuente: <strong>{predimedStudy.sourceFileName}</strong>
            {" · "}
            n válido = {predimedStudy.aggregates.nValid}
            {" · "}
            n bruto = {predimedStudy.aggregates.n}
            {predimedStudy.aggregates.incompleteCount > 0 && (
              <> · Sin puntuación: {predimedStudy.aggregates.incompleteCount}</>
            )}
          </p>

          <div className="study-bar-section">
            <table className="study-bar-table">
              <tbody>
                <tr className="study-bar-row study-bar-row--total">
                  <td className="study-bar-row__label">Media PREDIMED</td>
                  <td className="study-bar-row__track-cell">
                    <div className="study-bar-track">
                      <div
                        className="study-bar-fill"
                        style={{ width: `${(predimedStudy.aggregates.meanScore / 14) * 100}%` }}
                        aria-label={`${predimedStudy.aggregates.meanScore} sobre 14`}
                      />
                      {/* Umbral 6/14 ≈ 43 %, 8/14 ≈ 57 %, 9/14 ≈ 64 % */}
                      <span className="study-bar-mark" style={{ left: "42.9%" }} title="Umbral baja/media (6–7)" />
                      <span className="study-bar-mark" style={{ left: "64.3%" }} title="Umbral media/alta (≥9)" />
                    </div>
                  </td>
                  <td className="study-bar-row__value">{predimedStudy.aggregates.meanScore}/14</td>
                  <td className="study-bar-row__level">
                    {predimedStudy.aggregates.meanScore >= 9
                      ? "alta"
                      : predimedStudy.aggregates.meanScore >= 7
                      ? "media"
                      : "baja"}
                  </td>
                </tr>

                {/* Distribución por niveles como proporciones */}
                <tr className="study-bar-row">
                  <td className="study-bar-row__label">Alta adherencia (≥9)</td>
                  <td className="study-bar-row__track-cell">
                    <div className="study-bar-track">
                      <div
                        className="study-bar-fill"
                        style={{ width: `${predimedStudy.aggregates.highPercentage}%` }}
                      />
                    </div>
                  </td>
                  <td className="study-bar-row__value">{predimedStudy.aggregates.highPercentage.toFixed(1)} %</td>
                  <td className="study-bar-row__level">n={predimedStudy.aggregates.highCount}</td>
                </tr>
                <tr className="study-bar-row">
                  <td className="study-bar-row__label">Adherencia media (7–8)</td>
                  <td className="study-bar-row__track-cell">
                    <div className="study-bar-track">
                      <div
                        className="study-bar-fill"
                        style={{ width: `${predimedStudy.aggregates.mediumPercentage}%` }}
                      />
                    </div>
                  </td>
                  <td className="study-bar-row__value">{predimedStudy.aggregates.mediumPercentage.toFixed(1)} %</td>
                  <td className="study-bar-row__level">n={predimedStudy.aggregates.mediumCount}</td>
                </tr>
                <tr className="study-bar-row">
                  <td className="study-bar-row__label">Baja adherencia (≤6)</td>
                  <td className="study-bar-row__track-cell">
                    <div className="study-bar-track">
                      <div
                        className="study-bar-fill"
                        style={{ width: `${predimedStudy.aggregates.lowPercentage}%` }}
                      />
                    </div>
                  </td>
                  <td className="study-bar-row__value">{predimedStudy.aggregates.lowPercentage.toFixed(1)} %</td>
                  <td className="study-bar-row__level">n={predimedStudy.aggregates.lowCount}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="study-refs">
            <p className="study-refs__title">Referencias comparativas</p>
            <p className="study-refs__item">Granada: sin referencia disponible.</p>
            <p className="study-refs__item">Andalucía: sin referencia disponible.</p>
          </div>

          {predimedStudy.methodologicalCautions.length > 0 && (
            <div className="study-cautions">
              <p className="study-cautions__title">Cautelas metodológicas</p>
              <ul className="study-cautions__list">
                {predimedStudy.methodologicalCautions.map((caution, i) => (
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
          Ningún estudio PREDIMED-EAS cargado para este municipio. Importa un
          CSV con la columna <code>Predimed</code> o los ítems{" "}
          <code>P36BPD01_2023</code>–<code>P36BPD14_2023</code>.
        </p>
      )}
    </section>
  );
}
