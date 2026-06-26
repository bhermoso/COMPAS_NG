import type { SF12Study } from "../../domain/sf12";

interface SF12PanelProps {
  sf12Study?: SF12Study;
  isLoading?: boolean;
  message?: string | null;
  onLoadCSV?: (file: File) => void;
}

export function SF12Panel({
  sf12Study,
  isLoading,
  message,
  onLoadCSV,
}: SF12PanelProps) {
  return (
    <section className="workspace-panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Estudios Complementarios</p>
          <h2>SF-12 EAS - Salud percibida</h2>
        </div>
        <p className="panel-note">
          Cuestionario SF-12 (versión española, Vilagut et al. 2008) según Encuesta Andaluza de Salud.
          Importa un CSV con las columnas <code>PCS12_SP</code> (Componente Físico) y{" "}
          <code>MCS12_SP</code> (Componente Mental). Escala 0–100; mayor puntuación
          indica mejor salud percibida.
        </p>
      </div>

      <div className="ibse-upload">
        <div className="ibse-upload__zone">
          <label htmlFor="sf12-csv-input" className="docx-upload__label">
            Cargar CSV SF-12 EAS (.csv)
          </label>
          <input
            id="sf12-csv-input"
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
          <p className="ingestion-hint">Procesando CSV SF-12 EAS...</p>
        )}
        {message !== undefined && message !== null && isLoading !== true && (
          <p className="panel-note">{message}</p>
        )}
      </div>

      {sf12Study !== undefined ? (
        <div className="ibse-aggregates">
          <p className="ibse-aggregates__meta">
            Fuente: <strong>{sf12Study.sourceFileName}</strong>
            {" - "}
            {sf12Study.aggregates.n} registros procesados
          </p>
          <div className="ibse-aggregates__grid">
            <div className="ibse-factor-card ibse-factor-card--total">
              <p className="ibse-factor-card__label">Media PCS12_SP</p>
              <p className="ibse-factor-card__value">
                {sf12Study.aggregates.meanPCS.toFixed(1)}
              </p>
              <p className="panel-note">
                n={sf12Study.aggregates.nValidPCS} válidos · Componente Físico
              </p>
            </div>
            <div className="ibse-factor-card ibse-factor-card--total">
              <p className="ibse-factor-card__label">Media MCS12_SP</p>
              <p className="ibse-factor-card__value">
                {sf12Study.aggregates.meanMCS.toFixed(1)}
              </p>
              <p className="panel-note">
                n={sf12Study.aggregates.nValidMCS} válidos · Componente Mental
              </p>
            </div>
            <div className="ibse-factor-card">
              <p className="ibse-factor-card__label">Sin puntuación</p>
              <p className="ibse-factor-card__value">
                {sf12Study.aggregates.missingPCS}
              </p>
              <p className="panel-note">Registros sin PCS/MCS calculable</p>
            </div>
          </div>
          {sf12Study.methodologicalCautions.length > 0 && (
            <ul className="ibse-cautions">
              {sf12Study.methodologicalCautions.map((caution, i) => (
                <li key={i} className="panel-note">{caution}</li>
              ))}
            </ul>
          )}
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
