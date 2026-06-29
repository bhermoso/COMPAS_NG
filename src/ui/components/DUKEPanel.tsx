import type { DUKEStudy } from "../../domain/duke";

interface DUKEPanelProps {
  dukeStudy?: DUKEStudy;
  isLoading?: boolean;
  message?: string | null;
  onLoadCSV?: (file: File) => void;
}

// DUKE-UNC-11: escala 0–55, mayor = mayor apoyo social percibido.
// Umbral bajo (regla EAS reconstruida empíricamente): código 993.
const DUKE_MAX = 55;

interface DUKEBarRowProps {
  label: string;
  value: number;
  nValid: number;
  lowPercent: number;
  isTotal?: boolean;
}

function DUKEBarRow({ label, value, nValid, lowPercent, isTotal = false }: DUKEBarRowProps) {
  const pct = (value / DUKE_MAX) * 100;
  return (
    <tr className={`study-bar-row${isTotal ? " study-bar-row--total" : ""}`}>
      <td className="study-bar-row__label">{label}</td>
      <td className="study-bar-row__track-cell">
        <div className="study-bar-track">
          <div
            className="study-bar-fill"
            style={{ width: `${pct}%` }}
            aria-label={`${value} sobre ${DUKE_MAX}`}
          />
        </div>
      </td>
      <td className="study-bar-row__value">{value}/{DUKE_MAX}</td>
      <td className="study-bar-row__level">
        Bajo: {lowPercent.toFixed(1)} % (n={nValid})
      </td>
    </tr>
  );
}

export function DUKEPanel({
  dukeStudy,
  isLoading,
  message,
  onLoadCSV,
}: DUKEPanelProps) {
  return (
    <section className="workspace-panel">
      <div className="study-upload">
        <div className="study-upload__zone">
          <label htmlFor="duke-panel-csv-input" className="study-upload__label">
            Cargar CSV DUKE-EAS (.csv)
          </label>
          <input
            id="duke-panel-csv-input"
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
          <p className="study-hint">Procesando CSV DUKE-EAS…</p>
        )}
        {message !== undefined && message !== null && isLoading !== true && (
          <p className="study-hint">{message}</p>
        )}
      </div>

      {dukeStudy !== undefined ? (
        <div className="study-results">

          <p className="study-meta">
            Fuente: <strong>{dukeStudy.sourceFileName}</strong>
            {" · "}
            n procesados = {dukeStudy.aggregates.n}
          </p>

          <div className="study-bar-section">
            <table className="study-bar-table">
              <tbody>
                <DUKEBarRow
                  label="Apoyo global"
                  value={dukeStudy.aggregates.meanGlobal}
                  nValid={dukeStudy.aggregates.nValidGlobal}
                  lowPercent={dukeStudy.aggregates.lowGlobalPercentage}
                  isTotal
                />
                <DUKEBarRow
                  label="Apoyo confidencial"
                  value={dukeStudy.aggregates.meanConfidential}
                  nValid={dukeStudy.aggregates.nValidConfidential}
                  lowPercent={dukeStudy.aggregates.lowConfidentialPercentage}
                />
                <DUKEBarRow
                  label="Apoyo afectivo"
                  value={dukeStudy.aggregates.meanAffective}
                  nValid={dukeStudy.aggregates.nValidAffective}
                  lowPercent={dukeStudy.aggregates.lowAffectivePercentage}
                />
              </tbody>
            </table>
          </div>

          <p className="study-meta">
            Registros incompletos (código 993): {dukeStudy.aggregates.incompleteGlobalCount}.
            Regla EAS: 0 = apoyo normal · 1 = apoyo bajo.
          </p>

          <div className="study-refs">
            <p className="study-refs__title">Referencias comparativas</p>
            <p className="study-refs__item">Granada: sin referencia disponible.</p>
            <p className="study-refs__item">Andalucía: sin referencia disponible.</p>
          </div>

          {dukeStudy.methodologicalCautions.length > 0 && (
            <div className="study-cautions">
              <p className="study-cautions__title">Cautelas metodológicas</p>
              <ul className="study-cautions__list">
                {dukeStudy.methodologicalCautions.map((caution, i) => (
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
          Ningún estudio DUKE-EAS cargado para este municipio. Importa un CSV
          con las variables EAS P5701..P5711.
        </p>
      )}
    </section>
  );
}
