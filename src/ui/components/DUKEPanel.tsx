import type { DUKEStudy } from "../../domain/duke";

interface DUKEPanelProps {
  dukeStudy?: DUKEStudy;
  isLoading?: boolean;
  message?: string | null;
  onLoadCSV?: (file: File) => void;
}

function formatPercent(value: number): string {
  return `${value.toFixed(1)} %`;
}

export function DUKEPanel({
  dukeStudy,
  isLoading,
  message,
  onLoadCSV,
}: DUKEPanelProps) {
  return (
    <section className="workspace-panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Estudios Complementarios</p>
          <h2>DUKE-EAS - Apoyo social funcional</h2>
        </div>
        <p className="panel-note">
          DUKE-UNC-11 segun Encuesta Andaluza de Salud. Importa un CSV con
          columnas P5701..P5711. La recodificacion se conserva como regla EAS
          reconstruida empiricamente, no como criterio clinico universal.
        </p>
      </div>

      <div className="ibse-upload">
        <div className="ibse-upload__zone">
          <label htmlFor="duke-csv-input" className="docx-upload__label">
            Cargar CSV DUKE-EAS (.csv)
          </label>
          <input
            id="duke-csv-input"
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
          <p className="ingestion-hint">Procesando CSV DUKE-EAS...</p>
        )}
        {message !== undefined && message !== null && isLoading !== true && (
          <p className="panel-note">{message}</p>
        )}
      </div>

      {dukeStudy !== undefined ? (
        <div className="ibse-aggregates">
          <p className="ibse-aggregates__meta">
            Fuente: <strong>{dukeStudy.sourceFileName}</strong>
            {" - "}
            {dukeStudy.aggregates.n} registros procesados
          </p>
          <div className="ibse-aggregates__grid">
            <div className="ibse-factor-card ibse-factor-card--total">
              <p className="ibse-factor-card__label">Global</p>
              <p className="ibse-factor-card__value">
                {dukeStudy.aggregates.meanGlobal}
              </p>
              <p className="panel-note">
                Bajo: {formatPercent(dukeStudy.aggregates.lowGlobalPercentage)}
                {" - "}
                n={dukeStudy.aggregates.nValidGlobal}
              </p>
            </div>
            <div className="ibse-factor-card">
              <p className="ibse-factor-card__label">Confidencial</p>
              <p className="ibse-factor-card__value">
                {dukeStudy.aggregates.meanConfidential}
              </p>
              <p className="panel-note">
                Bajo: {formatPercent(dukeStudy.aggregates.lowConfidentialPercentage)}
                {" - "}
                n={dukeStudy.aggregates.nValidConfidential}
              </p>
            </div>
            <div className="ibse-factor-card">
              <p className="ibse-factor-card__label">Afectivo</p>
              <p className="ibse-factor-card__value">
                {dukeStudy.aggregates.meanAffective}
              </p>
              <p className="panel-note">
                Bajo: {formatPercent(dukeStudy.aggregates.lowAffectivePercentage)}
                {" - "}
                n={dukeStudy.aggregates.nValidAffective}
              </p>
            </div>
            <div className="ibse-factor-card">
              <p className="ibse-factor-card__label">Incompleto global</p>
              <p className="ibse-factor-card__value">
                {dukeStudy.aggregates.incompleteGlobalCount}
              </p>
              <p className="panel-note">Codigo conceptual 993</p>
            </div>
            <div className="ibse-factor-card">
              <p className="ibse-factor-card__label">Regla EAS</p>
              <p className="ibse-factor-card__value">0/1</p>
              <p className="panel-note">0 normal - 1 bajo</p>
            </div>
          </div>
          {dukeStudy.methodologicalCautions.length > 0 && (
            <ul className="ibse-cautions">
              {dukeStudy.methodologicalCautions.map((caution, i) => (
                <li key={i} className="panel-note">{caution}</li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <p className="empty-state">
          Ningun estudio DUKE-EAS cargado para este municipio. Importa un CSV
          con las variables EAS P5701..P5711.
        </p>
      )}
    </section>
  );
}
