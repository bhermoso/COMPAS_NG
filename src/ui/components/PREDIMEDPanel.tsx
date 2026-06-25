import type { PREDIMEDStudy } from "../../domain/predimed";

interface PREDIMEDPanelProps {
  predimedStudy?: PREDIMEDStudy;
  isLoading?: boolean;
  message?: string | null;
  onLoadCSV?: (file: File) => void;
}

function formatPercent(value: number): string {
  return `${value.toFixed(1)} %`;
}

export function PREDIMEDPanel({
  predimedStudy,
  isLoading,
  message,
  onLoadCSV,
}: PREDIMEDPanelProps) {
  return (
    <section className="workspace-panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Estudios Complementarios</p>
          <h2>PREDIMED-EAS - Adherencia a dieta mediterránea</h2>
        </div>
        <p className="panel-note">
          PREDIMED-14 según Encuesta Andaluza de Salud. Importa un CSV con la
          columna <code>Predimed</code> (valor canónico EAS) o las columnas{" "}
          <code>P36BPD01_2023</code>–<code>P36BPD14_2023</code>. Cortes: baja
          adherencia ≤ 6, media 7-8, alta ≥ 9.
        </p>
      </div>

      <div className="ibse-upload">
        <div className="ibse-upload__zone">
          <label htmlFor="predimed-csv-input" className="docx-upload__label">
            Cargar CSV PREDIMED-EAS (.csv)
          </label>
          <input
            id="predimed-csv-input"
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
          <p className="ingestion-hint">Procesando CSV PREDIMED-EAS...</p>
        )}
        {message !== undefined && message !== null && isLoading !== true && (
          <p className="panel-note">{message}</p>
        )}
      </div>

      {predimedStudy !== undefined ? (
        <div className="ibse-aggregates">
          <p className="ibse-aggregates__meta">
            Fuente: <strong>{predimedStudy.sourceFileName}</strong>
            {" - "}
            {predimedStudy.aggregates.n} registros procesados
          </p>
          <div className="ibse-aggregates__grid">
            <div className="ibse-factor-card ibse-factor-card--total">
              <p className="ibse-factor-card__label">Media PREDIMED</p>
              <p className="ibse-factor-card__value">
                {predimedStudy.aggregates.meanScore}
              </p>
              <p className="panel-note">
                n={predimedStudy.aggregates.nValid} válidos
              </p>
            </div>
            <div className="ibse-factor-card">
              <p className="ibse-factor-card__label">Alta adherencia</p>
              <p className="ibse-factor-card__value">
                {formatPercent(predimedStudy.aggregates.highPercentage)}
              </p>
              <p className="panel-note">
                score ≥ 9 — n={predimedStudy.aggregates.highCount}
              </p>
            </div>
            <div className="ibse-factor-card">
              <p className="ibse-factor-card__label">Adherencia media</p>
              <p className="ibse-factor-card__value">
                {formatPercent(predimedStudy.aggregates.mediumPercentage)}
              </p>
              <p className="panel-note">
                score 7-8 — n={predimedStudy.aggregates.mediumCount}
              </p>
            </div>
            <div className="ibse-factor-card">
              <p className="ibse-factor-card__label">Baja adherencia</p>
              <p className="ibse-factor-card__value">
                {formatPercent(predimedStudy.aggregates.lowPercentage)}
              </p>
              <p className="panel-note">
                score ≤ 6 — n={predimedStudy.aggregates.lowCount}
              </p>
            </div>
            <div className="ibse-factor-card">
              <p className="ibse-factor-card__label">Sin puntuación</p>
              <p className="ibse-factor-card__value">
                {predimedStudy.aggregates.incompleteCount}
              </p>
              <p className="panel-note">Registros sin score calculable</p>
            </div>
          </div>
          {predimedStudy.methodologicalCautions.length > 0 && (
            <ul className="ibse-cautions">
              {predimedStudy.methodologicalCautions.map((caution, i) => (
                <li key={i} className="panel-note">{caution}</li>
              ))}
            </ul>
          )}
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
