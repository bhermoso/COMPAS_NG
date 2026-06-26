import type { CAGEStudy } from "../../domain/cage";

interface CAGEPanelProps {
  cageStudy?: CAGEStudy;
  isLoading?: boolean;
  message?: string | null;
  onLoadCSV?: (file: File) => void;
}

export function CAGEPanel({
  cageStudy,
  isLoading,
  message,
  onLoadCSV,
}: CAGEPanelProps) {
  return (
    <section className="workspace-panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Estudios Complementarios</p>
          <h2>CAGE-EAS</h2>
        </div>
        <p className="panel-note">
          Indicadores de consumo de alcohol de la Encuesta Andaluza de Salud. Importa un CSV con la
          columna <code>CAGE_R</code> (riesgo de alcoholismo) y opcionalmente{" "}
          <code>CAGE</code> (clasificación ordinal de nivel de consumo).
        </p>
      </div>

      <div className="ibse-upload">
        <div className="ibse-upload__zone">
          <label htmlFor="cage-csv-input" className="docx-upload__label">
            Cargar CSV CAGE-EAS (.csv)
          </label>
          <input
            id="cage-csv-input"
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
          <p className="ingestion-hint">Procesando CSV CAGE-EAS...</p>
        )}
        {message !== undefined && message !== null && isLoading !== true && (
          <p className="panel-note">{message}</p>
        )}
      </div>

      {cageStudy !== undefined ? (
        <div className="ibse-aggregates">
          <p className="ibse-aggregates__meta">
            Fuente: <strong>{cageStudy.sourceFileName}</strong>
            {" — "}
            {cageStudy.aggregates.n} registros procesados
          </p>
          <div className="ibse-aggregates__grid">
            <div className="ibse-factor-card ibse-factor-card--total">
              <p className="ibse-factor-card__label">Riesgo de alcoholismo</p>
              <p className="ibse-factor-card__value">
                {cageStudy.aggregates.pctRisk.toFixed(1)} %
              </p>
              <p className="panel-note">
                n={cageStudy.aggregates.nValidCAGER} válidos CAGE_R
              </p>
            </div>
            <div className="ibse-factor-card">
              <p className="ibse-factor-card__label">Personas con riesgo</p>
              <p className="ibse-factor-card__value">
                {cageStudy.aggregates.nRisk}
              </p>
              <p className="panel-note">CAGE_R=1 en muestra EAS Granada</p>
            </div>
            <div className="ibse-factor-card">
              <p className="ibse-factor-card__label">Missing / No procede</p>
              <p className="ibse-factor-card__value">
                {cageStudy.aggregates.missingCAGER}
              </p>
              <p className="panel-note">Abstinentes: CAGE no administrado</p>
            </div>
          </div>
          {cageStudy.aggregates.nValidCAGE > 0 && (
            <div className="ibse-aggregates__grid">
              <div className="ibse-factor-card">
                <p className="ibse-factor-card__label">Bebedor social</p>
                <p className="ibse-factor-card__value">{cageStudy.aggregates.nCAGE1}</p>
              </div>
              <div className="ibse-factor-card">
                <p className="ibse-factor-card__label">Consumo de riesgo</p>
                <p className="ibse-factor-card__value">{cageStudy.aggregates.nCAGE2}</p>
              </div>
              <div className="ibse-factor-card">
                <p className="ibse-factor-card__label">Consumo perjudicial</p>
                <p className="ibse-factor-card__value">{cageStudy.aggregates.nCAGE3}</p>
              </div>
              <div className="ibse-factor-card">
                <p className="ibse-factor-card__label">Dependencia</p>
                <p className="ibse-factor-card__value">{cageStudy.aggregates.nCAGE4}</p>
              </div>
            </div>
          )}
          {cageStudy.methodologicalCautions.length > 0 && (
            <ul className="ibse-cautions">
              {cageStudy.methodologicalCautions.map((caution, i) => (
                <li key={i} className="panel-note">{caution}</li>
              ))}
            </ul>
          )}
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
