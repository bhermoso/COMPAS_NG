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

function IndicatorRow({ row }: { row: NHSDerivedRow }) {
  return (
    <div className="nhs-indicator-row">
      <div className="nhs-indicator-row__label-col">
        <p className="nhs-indicator-row__label">{row.indicador}</p>
        {row.esProxy && (
          <span className="nhs-indicator-row__dir">referencia proxy contextual</span>
        )}
      </div>
      <div className="nhs-indicator-row__value-col">
        <span className="nhs-indicator-row__value">{row.valor}</span>
      </div>
      <div className="nhs-indicator-row__ref-col">
        <span className="nhs-indicator-row__ref-val">{row.refGranada}</span>
      </div>
      <div className="nhs-indicator-row__ref-col">
        <span className="nhs-indicator-row__ref-val">{row.refAndalucia}</span>
      </div>
    </div>
  );
}

export function NHSHealthProfileView({ document }: NHSHealthProfileViewProps) {
  const projection = projectNHSDerived(document);

  if (!projection.available) {
    return (
      <section className="workspace-panel">
        <p className="eyebrow">Perfil de Salud Local · Representación derivada</p>
        <h2>Vista no disponible</h2>
        <p className="panel-note">
          Esta vista es una representación derivada del Perfil de Salud Local canónico.
          Para mostrarse necesita que el Perfil se haya compilado como documento
          institucional (documento canónico sellado). Un Perfil validado pero todavía
          no compilado no tiene aún esta representación derivada.
        </p>
      </section>
    );
  }

  const groups = groupByConsecutiveBloque(projection.rows);

  return (
    <div className="nhs-root">

      <section className="workspace-panel">
        <p className="eyebrow">Perfil de Salud Local · Representación derivada (diagnóstico comparativo)</p>
        <h2>Indicadores del territorio y sus referencias</h2>
        <p className="panel-note">
          Representación derivada del Perfil de Salud Local canónico. Se presentan los
          valores del territorio y sus referencias provincial y andaluza tal como constan
          en el documento; la interpretación corresponde al lector. Esta vista no emite
          veredictos comparativos.
        </p>
      </section>

      {projection.rows.length === 0 ? (
        <section className="workspace-panel">
          <p className="panel-note">
            El trazador del Perfil canónico no contiene filas disponibles para esta representación.
          </p>
        </section>
      ) : (
        groups.map((group, gi) => (
          <section key={`${group.bloque}-${gi}`} className="workspace-panel nhs-domain-panel">
            <div className="nhs-domain">
              <div className="nhs-domain__header">
                <p className="eyebrow">{group.bloque}</p>
                <p className="nhs-domain__count">
                  {group.rows.length} indicador{group.rows.length !== 1 ? "es" : ""}
                </p>
              </div>
              <div className="nhs-domain__table-header">
                <span>Indicador</span>
                <span>Valor</span>
                <span>Ref. provincial</span>
                <span>Ref. andaluza</span>
              </div>
              <div className="nhs-domain__rows">
                {group.rows.map((row, ri) => (
                  <IndicatorRow key={`${row.indicador}-${ri}`} row={row} />
                ))}
              </div>
            </div>
          </section>
        ))
      )}

    </div>
  );
}
