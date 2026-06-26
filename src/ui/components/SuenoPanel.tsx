import type { SuenoStudy } from "../../domain/sueno";

interface SuenoPanelProps {
  suenoStudy?: SuenoStudy;
  isLoading?: boolean;
  message?: string | null;
  onLoadCSV?: (file: File) => void;
}

export function SuenoPanel({
  suenoStudy,
  isLoading,
  message,
  onLoadCSV,
}: SuenoPanelProps) {
  return (
    <section className="workspace-panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Estudios Complementarios</p>
          <h2>Sueño EAS</h2>
        </div>
        <p className="panel-note">
          Indicadores de sueño de la Encuesta Andaluza de Salud. Importa un CSV con la
          columna <code>P33_R</code> (duración insuficiente) y opcionalmente{" "}
          <code>P33A</code> (calidad subjetiva).
        </p>
      </div>

      <div className="ibse-upload">
        <div className="ibse-upload__zone">
          <label htmlFor="sueno-csv-input" className="docx-upload__label">
            Cargar CSV Sueño EAS (.csv)
          </label>
          <input
            id="sueno-csv-input"
            type="file"
            accept=".csv"
            disabled={isLoading === true}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file !== undefined && onLoadCSV !== undefined) {
                onLoadCSV(file);
              }
              e.target.value = "";
            }}
            className="docx-upload__input"
          />
        </div>
        {isLoading === true && (
          <p className="ingestion-hint">Procesando CSV Sueño EAS...</p>
        )}
        {message !== undefined && message !== null && isLoading !== true && (
          <p className="panel-note">{message}</p>
        )}
      </div>

      {suenoStudy !== undefined ? (
        <div className="ibse-aggregates">
          <p className="ibse-aggregates__meta">
            Fuente: <strong>{suenoStudy.sourceFileName}</strong>
            {" — "}
            {suenoStudy.aggregates.n} registros procesados
          </p>
          <div className="ibse-aggregates__grid">
            <div className="ibse-factor-card ibse-factor-card--total">
              <p className="ibse-factor-card__label">Sueño insuficiente</p>
              <p className="ibse-factor-card__value">
                {suenoStudy.aggregates.pctInsufficientSleep.toFixed(1)} %
              </p>
              <p className="panel-note">
                n={suenoStudy.aggregates.nValidP33R} válidos P33_R
              </p>
            </div>
            {suenoStudy.aggregates.nValidP33A > 0 && (
              <div className="ibse-factor-card">
                <p className="ibse-factor-card__label">No descansa suficiente</p>
                <p className="ibse-factor-card__value">
                  {suenoStudy.aggregates.pctNoRest.toFixed(1)} %
                </p>
                <p className="panel-note">
                  n={suenoStudy.aggregates.nValidP33A} válidos P33A
                </p>
              </div>
            )}
            <div className="ibse-factor-card">
              <p className="ibse-factor-card__label">Missing P33_R</p>
              <p className="ibse-factor-card__value">
                {suenoStudy.aggregates.missingP33R}
              </p>
              <p className="panel-note">Registros sin P33_R calculable</p>
            </div>
          </div>
          {suenoStudy.methodologicalCautions.length > 0 && (
            <ul className="ibse-cautions">
              {suenoStudy.methodologicalCautions.map((caution, i) => (
                <li key={i} className="panel-note">{caution}</li>
              ))}
            </ul>
          )}
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
