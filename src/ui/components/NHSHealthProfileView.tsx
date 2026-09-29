import type { CanonicalProfileDocument } from "../../application/health-profile/canonicalProfileDocument";
import {
  projectNHSDerived,
  type NHSDerivedRow,
} from "../../application/health-profile/nhsDerivedProjection";

/**
 * NHSHealthProfileView — representación breve DERIVADA del Perfil canónico
 * (GOV-P4-01 · PR-D).
 *
 * Reoriginada: ya no consume `NHSHealthProfileArtifact`. Recibe el documento
 * canónico sellado y lo presenta a través del proyector puro `projectNHSDerived`.
 * No calcula, compara, ordena, puntúa ni reconstruye contenido. No emite posición
 * municipal ni ningún veredicto: presenta valor territorial y referencias tal como
 * constan en el trazador canónico y deja la interpretación al lector. La marca de
 * proxy contextual depende exclusivamente de `esProxy`.
 */

interface NHSHealthProfileViewProps {
  /** Documento canónico sellado, o `null` si es inexistente, legacy o incompleto. */
  document: CanonicalProfileDocument | null;
}

/** Agrupa filas en tramos CONSECUTIVOS por `bloque`, preservando orden exacto. */
function groupByConsecutiveBloque(
  rows: NHSDerivedRow[]
): Array<{ bloque: string; rows: NHSDerivedRow[] }> {
  const groups: Array<{ bloque: string; rows: NHSDerivedRow[] }> = [];
  for (const row of rows) {
    const last = groups[groups.length - 1];
    if (last !== undefined && last.bloque === row.bloque) {
      last.rows.push(row);
    } else {
      groups.push({ bloque: row.bloque, rows: [row] });
    }
  }
  return groups;
}

function isAvailableValue(value: string): boolean {
  const normalized = value.trim().toLowerCase();
  return (
    normalized.length > 0 &&
    normalized !== "no disponible" &&
    normalized !== "n/a" &&
    normalized !== "-" &&
    normalized !== "—"
  );
}

function valueTone(value: string): "available" | "missing" {
  return isAvailableValue(value) ? "available" : "missing";
}

function IndicatorValue({
  label,
  value,
  featured = false,
}: {
  label: string;
  value: string;
  featured?: boolean;
}) {
  return (
    <div
      className={[
        "nhs-value-tile",
        `nhs-value-tile--${valueTone(value)}`,
        featured ? "nhs-value-tile--featured" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span className="nhs-value-tile__label">{label}</span>
      <span className="nhs-value-tile__value">{value}</span>
    </div>
  );
}

function IndicatorRow({ row }: { row: NHSDerivedRow }) {
  return (
    <article className="nhs-indicator-card">
      <div className="nhs-indicator-card__head">
        <p className="nhs-indicator-card__title">{row.indicador}</p>
        {row.esProxy && (
          <span className="nhs-indicator-card__badge">proxy contextual</span>
        )}
      </div>
      <div className="nhs-indicator-card__values" aria-label={`Valores de ${row.indicador}`}>
        <IndicatorValue label="Territorio" value={row.valor} featured />
        <IndicatorValue label="Provincia" value={row.refGranada} />
        <IndicatorValue label="Andalucía" value={row.refAndalucia} />
      </div>
    </article>
  );
}

export function NHSHealthProfileView({ document }: NHSHealthProfileViewProps) {
  const projection = projectNHSDerived(document);

  if (!projection.available || document === null) {
    return (
      <section className="workspace-panel nhs-root">
        <p className="eyebrow">Perfil de Salud Local · salida breve tipo Local Health Profiles</p>
        <h2>Pendiente de compilar el Perfil canónico</h2>
        <p className="panel-note">
          Esta salida se inspira en los Local Authority Health Profiles de
          OHID/Fingertips, pero no es un producto autónomo ni una segunda fuente
          de verdad. Se mostrará cuando el Perfil se compile como PSL-C y exista
          un documento canónico sellado del que derivar sus indicadores.
        </p>
      </section>
    );
  }

  const groups = groupByConsecutiveBloque(projection.rows);
  const proxyCount = projection.rows.filter((row) => row.esProxy).length;
  const provincialRefs = projection.rows.filter((row) => isAvailableValue(row.refGranada)).length;
  const andalusianRefs = projection.rows.filter((row) => isAvailableValue(row.refAndalucia)).length;
  const spotlightRows = projection.rows.slice(0, 4);
  const territory = document.editorialView.header.territory;

  return (
    <div className="nhs-root">

      <section className="workspace-panel nhs-executive-hero">
        <div className="nhs-executive-hero__copy">
          <p className="eyebrow">Perfil de Salud Local · salida breve tipo Local Health Profiles</p>
          <h2>{territory}: ficha ejecutiva de indicadores</h2>
          <p className="panel-note">
            Representación derivada del Perfil canónico, inspirada en OHID/Fingertips.
            Presenta valores del territorio y referencias provincial y andaluza tal
            como constan en el documento. La visualización no convierte diferencias
            en veredictos comparativos.
          </p>
        </div>
        <div className="nhs-executive-hero__metrics" aria-label="Resumen visual de la ficha">
          <div className="nhs-executive-metric">
            <span className="nhs-executive-metric__value">{projection.rows.length}</span>
            <span className="nhs-executive-metric__label">indicadores</span>
          </div>
          <div className="nhs-executive-metric">
            <span className="nhs-executive-metric__value">{groups.length}</span>
            <span className="nhs-executive-metric__label">bloques</span>
          </div>
          <div className="nhs-executive-metric">
            <span className="nhs-executive-metric__value">{proxyCount}</span>
            <span className="nhs-executive-metric__label">proxy</span>
          </div>
        </div>
      </section>

      {projection.rows.length === 0 ? (
        <section className="workspace-panel">
          <p className="panel-note">
            El trazador del Perfil canónico no contiene filas disponibles para esta representación.
          </p>
        </section>
      ) : (
        <>
          <section className="workspace-panel nhs-snapshot-panel">
            <div className="nhs-snapshot-panel__header">
              <p className="eyebrow">Lectura ejecutiva</p>
              <h3>Datos disponibles y huecos declarados</h3>
            </div>
            <div className="nhs-snapshot-grid">
              <div className="nhs-snapshot-card">
                <span className="nhs-snapshot-card__value">{provincialRefs}</span>
                <span className="nhs-snapshot-card__label">con referencia provincial</span>
              </div>
              <div className="nhs-snapshot-card">
                <span className="nhs-snapshot-card__value">{andalusianRefs}</span>
                <span className="nhs-snapshot-card__label">con referencia andaluza</span>
              </div>
              <div className="nhs-snapshot-card nhs-snapshot-card--plain">
                <span className="nhs-snapshot-card__label">
                  Los valores no disponibles permanecen visibles: orientan qué datos conviene producir localmente.
                </span>
              </div>
            </div>
          </section>

          <section className="workspace-panel nhs-spotlight-panel">
            <div className="nhs-snapshot-panel__header">
              <p className="eyebrow">Indicadores destacados</p>
              <h3>Primeras señales del trazador canónico</h3>
            </div>
            <div className="nhs-spotlight-grid">
              {spotlightRows.map((row, ri) => (
                <IndicatorRow key={`${row.indicador}-spotlight-${ri}`} row={row} />
              ))}
            </div>
          </section>

          {groups.map((group, gi) => (
            <section
              key={`${group.bloque}-${gi}`}
              className={`workspace-panel nhs-domain-panel nhs-domain-panel--tone-${gi % 4}`}
            >
              <div className="nhs-domain">
                <div className="nhs-domain__header">
                  <div>
                    <p className="eyebrow">{group.bloque}</p>
                    <h3>{group.bloque}</h3>
                  </div>
                  <p className="nhs-domain__count">
                    {group.rows.length} indicador{group.rows.length !== 1 ? "es" : ""}
                  </p>
                </div>
                <div className="nhs-domain__rows">
                  {group.rows.map((row, ri) => (
                    <IndicatorRow key={`${row.indicador}-${ri}`} row={row} />
                  ))}
                </div>
              </div>
            </section>
          ))}
        </>
      )}

    </div>
  );
}
