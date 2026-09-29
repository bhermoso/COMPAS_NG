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
 * No puntúa ni reconstruye contenido. La capa visual puede representar relaciones
 * numéricas simples entre valores ya presentes (local/provincia/Andalucía), pero
 * no las convierte en "mejor" o "peor": sin dirección epidemiológica explícita,
 * la lectura sigue correspondiendo al lector. La marca de proxy contextual depende
 * exclusivamente de `esProxy`.
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

function hasAnyReference(row: NHSDerivedRow): boolean {
  return isAvailableValue(row.refGranada) || isAvailableValue(row.refAndalucia);
}

function hasBothReferences(row: NHSDerivedRow): boolean {
  return isAvailableValue(row.refGranada) && isAvailableValue(row.refAndalucia);
}

function parseNumericValue(value: string): number | null {
  if (!isAvailableValue(value)) return null;
  const match = value.replace(",", ".").match(/-?\d+(?:\.\d+)?/);
  if (match === null) return null;
  const parsed = Number.parseFloat(match[0]);
  return Number.isFinite(parsed) ? parsed : null;
}

type NumericRelation = "higher" | "lower" | "same" | "missing";

function compareValues(local: string, reference: string): NumericRelation {
  const localValue = parseNumericValue(local);
  const referenceValue = parseNumericValue(reference);
  if (localValue === null || referenceValue === null) return "missing";
  const delta = localValue - referenceValue;
  if (Math.abs(delta) < 0.05) return "same";
  return delta > 0 ? "higher" : "lower";
}

function relationLabel(referenceName: string, relation: NumericRelation): string {
  if (relation === "higher") return `Valor mayor que ${referenceName}`;
  if (relation === "lower") return `Valor menor que ${referenceName}`;
  if (relation === "same") return `Valor muy próximo a ${referenceName}`;
  return `Sin dato comparable con ${referenceName}`;
}

function relationText(row: NHSDerivedRow): string {
  const province = relationLabel("provincia", compareValues(row.valor, row.refGranada));
  const andalusia = relationLabel("Andalucía", compareValues(row.valor, row.refAndalucia));
  return `${province}; ${andalusia}.`;
}

function buildRangePoints(row: NHSDerivedRow): Array<{
  key: "local" | "province" | "andalusia";
  label: string;
  value: string;
  position: number;
}> {
  const values = [
    { key: "local" as const, label: "Territorio", value: row.valor, numeric: parseNumericValue(row.valor) },
    { key: "province" as const, label: "Provincia", value: row.refGranada, numeric: parseNumericValue(row.refGranada) },
    { key: "andalusia" as const, label: "Andalucía", value: row.refAndalucia, numeric: parseNumericValue(row.refAndalucia) },
  ].filter((item): item is {
    key: "local" | "province" | "andalusia";
    label: string;
    value: string;
    numeric: number;
  } => item.numeric !== null);
  if (values.length < 2) return [];
  const nums = values.map((item) => item.numeric);
  const min = Math.min(...nums);
  const max = Math.max(...nums);
  const span = max - min;
  return values.map((item) => ({
    key: item.key,
    label: item.label,
    value: item.value,
    position: span === 0 ? 50 : Math.max(2, Math.min(98, ((item.numeric - min) / span) * 100)),
  }));
}

function ComparisonRail({ row }: { row: NHSDerivedRow }) {
  const points = buildRangePoints(row);
  if (points.length < 2) {
    return (
      <p className="nhs-range-note">
        Banda no disponible: faltan valores numéricos comparables.
      </p>
    );
  }
  return (
    <div className="nhs-range" aria-label={`Banda visual comparativa de ${row.indicador}`}>
      <div className="nhs-range__rail" aria-hidden="true">
        {points.map((point) => (
          <span
            key={point.key}
            className={`nhs-range__point nhs-range__point--${point.key}`}
            style={{ left: `${point.position}%` }}
            title={`${point.label}: ${point.value}`}
          />
        ))}
      </div>
      <div className="nhs-range__legend">
        {points.map((point) => (
          <span key={point.key} className={`nhs-range__legend-item nhs-range__legend-item--${point.key}`}>
            {point.label}
          </span>
        ))}
      </div>
    </div>
  );
}

function hasComparableBand(row: NHSDerivedRow): boolean {
  return buildRangePoints(row).length >= 2;
}

type ScopeChipTone = "solid" | "info" | "warning" | "muted";

function buildScopeChips(row: NHSDerivedRow): Array<{ label: string; tone: ScopeChipTone }> {
  const chips: Array<{ label: string; tone: ScopeChipTone }> = [
    row.esProxy
      ? { label: "proxy contextual", tone: "warning" }
      : { label: "muestra local", tone: "solid" },
  ];
  if (hasBothReferences(row)) {
    chips.push({ label: "doble referencia", tone: "info" });
  } else if (hasAnyReference(row)) {
    chips.push({ label: "referencia parcial", tone: "warning" });
  } else {
    chips.push({ label: "sin referencias", tone: "muted" });
  }
  chips.push(
    hasComparableBand(row)
      ? { label: "banda disponible", tone: "info" }
      : { label: "sin banda", tone: "muted" }
  );
  if (parseNumericValue(row.valor) === null) {
    chips.push({ label: "valor no numérico", tone: "muted" });
  }
  return chips;
}

function IndicatorScopeChips({ row }: { row: NHSDerivedRow }) {
  return (
    <div className="nhs-scope-chips" aria-label={`Alcance de lectura de ${row.indicador}`}>
      {buildScopeChips(row).map((chip) => (
        <span key={chip.label} className={`nhs-scope-chip nhs-scope-chip--${chip.tone}`}>
          {chip.label}
        </span>
      ))}
    </div>
  );
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
      <IndicatorScopeChips row={row} />
      <ComparisonRail row={row} />
      <p className="nhs-indicator-card__relation">{relationText(row)}</p>
    </article>
  );
}

function DomainStats({ rows }: { rows: NHSDerivedRow[] }) {
  const withLocalValue = rows.filter((row) => isAvailableValue(row.valor)).length;
  const withBothReferences = rows.filter(
    (row) => isAvailableValue(row.refGranada) && isAvailableValue(row.refAndalucia)
  ).length;
  const proxies = rows.filter((row) => row.esProxy).length;
  return (
    <div className="nhs-domain-stats" aria-label="Resumen del bloque">
      <span>{withLocalValue}/{rows.length} con valor territorial</span>
      <span>{withBothReferences} con doble referencia</span>
      <span>{proxies} proxy</span>
    </div>
  );
}

function buildReadingScopeNotes(rows: NHSDerivedRow[]): string[] {
  const proxyRows = rows.filter((row) => row.esProxy).length;
  const withoutComparableBand = rows.filter((row) => !hasComparableBand(row)).length;
  const withoutProvince = rows.filter((row) => !isAvailableValue(row.refGranada)).length;
  const withoutAndalusia = rows.filter((row) => !isAvailableValue(row.refAndalucia)).length;
  const nonNumericLocal = rows.filter((row) => parseNumericValue(row.valor) === null).length;
  const notes: string[] = [];

  if (withoutComparableBand > 0) {
    notes.push(
      `${withoutComparableBand} indicador(es) no admiten banda visual por falta de valores numéricos comparables.`
    );
  }
  if (proxyRows > 0) {
    notes.push(
      `${proxyRows} indicador(es) proceden de proxy contextual: orientan, pero no sustituyen una medición local directa.`
    );
  }
  if (withoutProvince > 0 || withoutAndalusia > 0) {
    notes.push(
      `Faltan referencias en ${withoutProvince} indicador(es) para provincia y en ${withoutAndalusia} para Andalucía.`
    );
  }
  if (nonNumericLocal > 0) {
    notes.push(
      `${nonNumericLocal} valor(es) territoriales no son numéricos y se mantienen como lectura textual.`
    );
  }
  if (notes.length === 0) {
    notes.push(
      "Todas las filas visibles tienen valores numéricos comparables y referencia provincial y andaluza declarada."
    );
  }
  return notes;
}

function ReadingQualityPanel({ rows }: { rows: NHSDerivedRow[] }) {
  const total = rows.length;
  const comparable = rows.filter((row) => hasComparableBand(row)).length;
  const bothRefs = rows.filter((row) => hasBothReferences(row)).length;
  const localSample = rows.filter((row) => !row.esProxy).length;
  const proxyRows = total - localSample;
  const notes = buildReadingScopeNotes(rows);
  const metrics = [
    {
      value: `${comparable}/${total}`,
      label: "con lectura visual",
      text: "Al menos dos valores numéricos permiten situar territorio y referencia en una misma banda.",
      tone: "info",
    },
    {
      value: `${bothRefs}/${total}`,
      label: "con doble referencia",
      text: "Incluyen provincia y Andalucía, sin convertir diferencias en veredictos sanitarios.",
      tone: "solid",
    },
    {
      value: `${localSample}/${total}`,
      label: "muestra local",
      text: "No están marcados como proxy contextual en el trazador canónico.",
      tone: "solid",
    },
    {
      value: `${proxyRows}`,
      label: "proxy contextual",
      text: "Deben leerse como apoyo territorial, no como estimación distrital completa.",
      tone: proxyRows > 0 ? "warning" : "muted",
    },
  ];

  return (
    <section className="workspace-panel nhs-quality-panel">
      <div className="nhs-snapshot-panel__header">
        <p className="eyebrow">Calidad de lectura</p>
        <h3>Qué puede leerse y qué debe producirse mejor</h3>
      </div>
      <div className="nhs-quality-grid" aria-label="Resumen de calidad de lectura">
        {metrics.map((metric) => (
          <div key={metric.label} className={`nhs-quality-card nhs-quality-card--${metric.tone}`}>
            <span className="nhs-quality-card__value">{metric.value}</span>
            <span className="nhs-quality-card__label">{metric.label}</span>
            <span className="nhs-quality-card__text">{metric.text}</span>
          </div>
        ))}
      </div>
      <ul className="nhs-quality-notes" aria-label="Huecos metodológicos declarados">
        {notes.map((note) => (
          <li key={note}>{note}</li>
        ))}
      </ul>
      <p className="nhs-quality-panel__foot">
        La calidad de lectura no pondera ni corrige valores: solo hace visible el alcance del dato disponible.
      </p>
    </section>
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
  const completeReferenceRows = projection.rows.filter(
    (row) => isAvailableValue(row.refGranada) && isAvailableValue(row.refAndalucia)
  );
  const comparableRows = projection.rows.filter((row) => buildRangePoints(row).length >= 2);
  const spotlightRows = (completeReferenceRows.length > 0 ? completeReferenceRows : projection.rows).slice(0, 4);
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
            como constan en el documento. La relación visual indica mayor/menor
            valor numérico, no valoración sanitaria.
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
              <div className="nhs-snapshot-card">
                <span className="nhs-snapshot-card__value">{comparableRows.length}</span>
                <span className="nhs-snapshot-card__label">con banda comparativa</span>
              </div>
              <div className="nhs-snapshot-card nhs-snapshot-card--plain">
                <span className="nhs-snapshot-card__label">
                  Los valores no disponibles permanecen visibles: orientan qué datos conviene producir localmente.
                </span>
              </div>
            </div>
            <div className="nhs-key">
              <span className="nhs-key__title">Clave visual</span>
              <span className="nhs-key__item nhs-key__item--local">Territorio</span>
              <span className="nhs-key__item nhs-key__item--province">Provincia</span>
              <span className="nhs-key__item nhs-key__item--andalusia">Andalucía</span>
              <span className="nhs-key__note">
                La banda no evalúa; solo coloca valores disponibles en una misma escala.
              </span>
            </div>
          </section>

          <ReadingQualityPanel rows={projection.rows} />

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
              className={`workspace-panel nhs-domain-panel nhs-domain-panel--tone-${(gi % 3) + 1}`}
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
                <DomainStats rows={group.rows} />
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
