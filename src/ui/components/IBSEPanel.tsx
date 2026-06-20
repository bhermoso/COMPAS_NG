import type { IBSEStudy } from "../../domain/ibse";

interface IBSEPanelProps {
  ibseStudy?: IBSEStudy;
  isLoading?: boolean;
  message?: string | null;
  onLoadCSV?: (file: File) => void;
}

export function IBSEPanel({
  ibseStudy,
  isLoading,
  message,
  onLoadCSV,
}: IBSEPanelProps) {
  return (
    <section className="workspace-panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Estudios Complementarios</p>
          <h2>IBSE — Índice de Bienestar Socioemocional</h2>
        </div>
        <p className="panel-note">
          Metodología Bericat 2014 · 8 ítems · 4 factores · 1 índice total.
          Carga la exportación CSV de REDCap para obtener los agregados municipales.
          No se almacenan registros individuales.
        </p>
      </div>

      <div className="ibse-upload">
        <label htmlFor="ibse-csv-input" className="docx-upload__label">
          Cargar exportación REDCap (.csv)
        </label>
        <input
          id="ibse-csv-input"
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
        {isLoading === true && (
          <p className="ingestion-hint">Procesando CSV IBSE…</p>
        )}
        {message !== undefined && message !== null && isLoading !== true && (
          <p className="panel-note">{message}</p>
        )}
      </div>

      {ibseStudy !== undefined ? (
        <div className="ibse-aggregates">
          <p className="ibse-aggregates__meta">
            Fuente: <strong>{ibseStudy.sourceFileName}</strong>
            {" · "}
            {ibseStudy.aggregates.nValid} registros válidos de{" "}
            {ibseStudy.aggregates.n} totales
          </p>
          <div className="ibse-aggregates__grid">
            <div className="ibse-factor-card ibse-factor-card--total">
              <p className="ibse-factor-card__label">IBSE Total</p>
              <p className="ibse-factor-card__value">
                {ibseStudy.aggregates.meanTotal}
              </p>
            </div>
            <div className="ibse-factor-card">
              <p className="ibse-factor-card__label">Vínculo</p>
              <p className="ibse-factor-card__value">
                {ibseStudy.aggregates.meanFactorVinculo}
              </p>
            </div>
            <div className="ibse-factor-card">
              <p className="ibse-factor-card__label">Situación</p>
              <p className="ibse-factor-card__value">
                {ibseStudy.aggregates.meanFactorSituacion}
              </p>
            </div>
            <div className="ibse-factor-card">
              <p className="ibse-factor-card__label">Control</p>
              <p className="ibse-factor-card__value">
                {ibseStudy.aggregates.meanFactorControl}
              </p>
            </div>
            <div className="ibse-factor-card">
              <p className="ibse-factor-card__label">Persona</p>
              <p className="ibse-factor-card__value">
                {ibseStudy.aggregates.meanFactorPersona}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <p className="empty-state">
          Ningún estudio IBSE cargado para este municipio. Importa la
          exportación CSV desde REDCap.
        </p>
      )}
    </section>
  );
}
