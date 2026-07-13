import type { NHSHealthProfileArtifact, NHSDomain, NHSIndicatorRow } from "../../domain/nhs-health-profile";

interface NHSHealthProfileViewProps {
  artifact: NHSHealthProfileArtifact;
}

const DOMAIN_LABELS: Record<string, string> = {
  bienestar: "Bienestar y salud socioemocional",
  conductas: "Conductas de salud",
  "salud-percibida": "Salud percibida",
};

const POSITION_LABEL: Record<string, { label: string; css: string }> = {
  above:   { label: "Mejor que referencia", css: "nhs-pos--above" },
  below:   { label: "Peor que referencia",  css: "nhs-pos--below" },
  similar: { label: "Similar a referencia", css: "nhs-pos--similar" },
};

function IndicatorRow({ row }: { row: NHSIndicatorRow }) {
  const pos = row.position ? POSITION_LABEL[row.position] : null;
  const dirLabel = row.positiveDirection === "higher-is-better" ? "↑ mejor más alto" : "↓ mejor más bajo";

  return (
    <div className="nhs-indicator-row">
      <div className="nhs-indicator-row__label-col">
        <p className="nhs-indicator-row__label">{row.label}</p>
        <span className="nhs-indicator-row__dir">{dirLabel}</span>
        {row.smallSampleWarning && (
          <span className="nhs-indicator-row__small-n">⚠ muestra pequeña (n={row.validN})</span>
        )}
      </div>
      <div className="nhs-indicator-row__value-col">
        <span className="nhs-indicator-row__value">{row.value.toFixed(1)}</span>
        <span className="nhs-indicator-row__unit">{row.unit}</span>
      </div>
      <div className="nhs-indicator-row__ref-col">
        {row.reference ? (
          <>
            <span className="nhs-indicator-row__ref-val">{row.reference.value.toFixed(1)}</span>
            <span className="nhs-indicator-row__ref-pop">{row.reference.population}</span>
          </>
        ) : (
          <span className="nhs-indicator-row__no-ref">Sin referencia</span>
        )}
      </div>
      <div className="nhs-indicator-row__pos-col">
        {pos ? (
          <span className={`nhs-pos-pill ${pos.css}`}>{pos.label}</span>
        ) : (
          <span className="nhs-pos-pill nhs-pos--no-ref">—</span>
        )}
      </div>
    </div>
  );
}

function DomainSection({ domain }: { domain: NHSDomain }) {
  return (
    <div className="nhs-domain">
      <div className="nhs-domain__header">
        <p className="eyebrow">{DOMAIN_LABELS[domain.id] ?? domain.id}</p>
        <p className="nhs-domain__count">{domain.indicators.length} indicador{domain.indicators.length !== 1 ? "es" : ""}</p>
      </div>
      <div className="nhs-domain__table-header">
        <span>Indicador</span>
        <span>Valor municipal</span>
        <span>Referencia</span>
        <span>Posición</span>
      </div>
      <div className="nhs-domain__rows">
        {domain.indicators.map((row) => (
          <IndicatorRow key={row.instrumentId} row={row} />
        ))}
      </div>
    </div>
  );
}

export function NHSHealthProfileView({ artifact }: NHSHealthProfileViewProps) {
  const compiledDate = new Date(artifact.compiledAt).toLocaleDateString("es-ES", {
    day: "2-digit", month: "long", year: "numeric",
  });

  return (
    <div className="nhs-root">

      {/* Portada */}
      <section className="workspace-panel nhs-portada">
        <div className="nhs-portada__head">
          <div>
            <p className="eyebrow">Perfil de Salud Local · Diagnóstico Comparativo</p>
            <h2>{artifact.portada.municipalityName}</h2>
            <p className="nhs-portada__province">{artifact.portada.municipalityProvince} · {artifact.portada.year}</p>
          </div>
          <div className="nhs-portada__meta">
            <span className="psl-artifact-version">{artifact.artifactVersion}</span>
            <span className="nhs-portada__date">{compiledDate}</span>
          </div>
        </div>

        <div className="nhs-portada__stats">
          <div className="nhs-stat">
            <span className="nhs-stat__val">{artifact.portada.complementaryStudyCount}</span>
            <span className="nhs-stat__label">de 6 estudios disponibles</span>
          </div>
          <div className="nhs-stat">
            <span className="nhs-stat__val">{artifact.dominios.reduce((a, d) => a + d.indicators.length, 0)}</span>
            <span className="nhs-stat__label">indicadores calculados</span>
          </div>
          <div className="nhs-stat">
            <span className="nhs-stat__val">
              {artifact.dominios.reduce((a, d) => a + d.indicators.filter((i) => i.reference !== null).length, 0)}
            </span>
            <span className="nhs-stat__label">con referencia comparativa</span>
          </div>
        </div>

        {artifact.portada.fewComparatorsWarning && (
          <p className="nhs-warning">
            ⚠ Pocos indicadores tienen referencia comparativa disponible. El perfil comparativo tiene valor limitado hasta que se incorporen datos de referencia Granada/Andalucía.
          </p>
        )}
      </section>

      {/* Dominios de indicadores */}
      {artifact.dominios.map((domain) => (
        <section key={domain.id} className="workspace-panel nhs-domain-panel">
          <DomainSection domain={domain} />
        </section>
      ))}

      {/* Participación ciudadana */}
      {artifact.participacionCiudadana?.realizada && (
        <section className="workspace-panel">
          <p className="eyebrow">Participación ciudadana</p>
          <p className="panel-note">
            Proceso participativo realizado
            {artifact.participacionCiudadana.fecha ? ` (${artifact.participacionCiudadana.fecha})` : ""}.
            {" "}{artifact.participacionCiudadana.tematicasCount} temáticas priorizadas.
          </p>
        </section>
      )}

      {/* Alcance */}
      <section className="workspace-panel">
        <p className="eyebrow">Alcance del diagnóstico</p>
        <h2>Instrumentos disponibles</h2>
        <div className="nhs-alcance">
          {artifact.alcance.availableStudies.length > 0 && (
            <div>
              <p className="nhs-alcance__label">Instrumentos incluidos:</p>
              <div className="nhs-alcance__list">
                {artifact.alcance.availableStudies.map((s) => (
                  <span key={s.instrumentId} className="nhs-study-chip nhs-study-chip--present">{s.label}</span>
                ))}
              </div>
            </div>
          )}
          {artifact.alcance.missingStudies.length > 0 && (
            <div>
              <p className="nhs-alcance__label">No disponibles en este expediente:</p>
              <div className="nhs-alcance__list">
                {artifact.alcance.missingStudies.map((s) => (
                  <span key={s.instrumentId} className="nhs-study-chip nhs-study-chip--missing">{s.label}</span>
                ))}
              </div>
            </div>
          )}
          <p className="nhs-alcance__cautela">{artifact.alcance.cautela}</p>
        </div>
      </section>

    </div>
  );
}
