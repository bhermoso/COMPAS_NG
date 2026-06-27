import type { SF12Study } from "../../domain/sf12";

interface SF12PanelProps {
  sf12Study?: SF12Study;
  isLoading?: boolean;
  message?: string | null;
  onLoadCSV?: (file: File) => void;
}

// SF-12: escala 0–100 (componentes normalizados, norma española Vilagut 2008).
// Mayor puntuación = mejor salud percibida.

export function SF12Panel({
  sf12Study,
  isLoading,
  message,
  onLoadCSV,
}: SF12PanelProps) {
  return (
    <section className="workspace-panel">
      <div className="study-upload">
        <div className="study-upload__zone">
          <label htmlFor="sf12-csv-input" className="study-upload__label">
            Cargar CSV SF-12 EAS (.csv)
          </label>
          <input
            id="sf12-csv-input"
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
          <p className="study-hint">Procesando CSV SF-12 EAS…</p>
        )}
        {message !== undefined && message !== null && isLoading !== true && (
          <p className="study-hint">{message}</p>
        )}
      </div>

      {sf12Study !== undefined ? (
        <div className="study-results">

          <p className="study-meta">
            Fuente: <strong>{sf12Study.sourceFileName}</strong>
            {" · "}
            n bruto = {sf12Study.aggregates.n}
            {" · "}
            n válido PCS = {sf12Study.aggregates.nValidPCS}
            {" · "}
            n válido MCS = {sf12Study.aggregates.nValidMCS}
            {sf12Study.aggregates.missingPCS > 0 && (
              <> · Sin puntuación: {sf12Study.aggregates.missingPCS}</>
            )}
          </p>

          <div className="study-bar-section">
            <table className="study-bar-table">
              <tbody>
                <tr className="study-bar-row study-bar-row--total">
                  <td className="study-bar-row__label">Componente Físico (PCS)</td>
                  <td className="study-bar-row__track-cell">
                    <div className="study-bar-track">
                      <div
                        className="study-bar-fill"
                        style={{ width: `${sf12Study.aggregates.meanPCS}%` }}
                        aria-label={`${sf12Study.aggregates.meanPCS.toFixed(1)} sobre 100`}
                      />
                      {/* Referencia norma española ~50 */}
                      <span className="study-bar-mark" style={{ left: "50%" }} title="Norma española ≈ 50" />
                    </div>
                  </td>
                  <td className="study-bar-row__value">{sf12Study.aggregates.meanPCS.toFixed(1)}/100</td>
                  <td className="study-bar-row__level">n={sf12Study.aggregates.nValidPCS}</td>
                </tr>
                <tr className="study-bar-row">
                  <td className="study-bar-row__label">Componente Mental (MCS)</td>
                  <td className="study-bar-row__track-cell">
                    <div className="study-bar-track">
                      <div
                        className="study-bar-fill"
                        style={{ width: `${sf12Study.aggregates.meanMCS}%` }}
                        aria-label={`${sf12Study.aggregates.meanMCS.toFixed(1)} sobre 100`}
                      />
                      <span className="study-bar-mark" style={{ left: "50%" }} title="Norma española ≈ 50" />
                    </div>
                  </td>
                  <td className="study-bar-row__value">{sf12Study.aggregates.meanMCS.toFixed(1)}/100</td>
                  <td className="study-bar-row__level">n={sf12Study.aggregates.nValidMCS}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="study-refs">
            <p className="study-refs__title">Referencias comparativas</p>
            <p className="study-refs__item">Norma española (Vilagut et al. 2008): PCS ≈ 50 · MCS ≈ 50.</p>
            <p className="study-refs__item">Granada: sin referencia disponible.</p>
            <p className="study-refs__item">Andalucía: sin referencia disponible.</p>
          </div>

          {sf12Study.methodologicalCautions.length > 0 && (
            <div className="study-cautions">
              <p className="study-cautions__title">Cautelas metodológicas</p>
              <ul className="study-cautions__list">
                {sf12Study.methodologicalCautions.map((caution, i) => (
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
          Ningún estudio SF-12 cargado para este municipio. Importa un CSV con
          las columnas <code>PCS12_SP</code> y <code>MCS12_SP</code>.
        </p>
      )}
    </section>
  );
}
