import type { CanonicalProfileDocument } from "../../application/health-profile/canonicalProfileDocument";
import {
  projectNHSDerived,
  type NHSDerivedAgendaItem,
  type NHSDerivedInformeRanking,
  type NHSDerivedOverviewMessage,
  type NHSDerivedRow,
  type NHSDerivedSourceBlock,
  type NHSDerivedTerritorialReading,
} from "../../application/health-profile/nhsDerivedProjection";

/**
 * NHSHealthProfileView — ficha publica breve derivada del Perfil canonico.
 *
 * No es un producto autonomo ni una segunda fuente. Toma el documento canonico
 * sellado y lo presenta con una composicion inspirada en OHID/Fingertips:
 * titular claro, fuentes, indicadores cuando existen, temas del informe,
 * lecturas territoriales, preguntas publicas y huecos de dato. Si faltan
 * indicadores comparables, la salida no queda vacia: declara esa ausencia y usa
 * las otras piezas del Perfil.
 */

interface NHSHealthProfileViewProps {
  /** Documento canonico sellado, o `null` si es inexistente, legacy o incompleto. */
  document: CanonicalProfileDocument | null;
  id?: string;
}

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

function parseNumericValue(value: string): number | null {
  if (!isAvailableValue(value)) return null;
  const match = value.replace(",", ".").match(/-?\d+(?:\.\d+)?/);
  if (match === null) return null;
  const parsed = Number.parseFloat(match[0]);
  return Number.isFinite(parsed) ? parsed : null;
}

function hasBothReferences(row: NHSDerivedRow): boolean {
  return isAvailableValue(row.refGranada) && isAvailableValue(row.refAndalucia);
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

function hasComparableBand(row: NHSDerivedRow): boolean {
  return buildRangePoints(row).length >= 2;
}

function valueTone(value: string): "available" | "missing" {
  return isAvailableValue(value) ? "available" : "missing";
}

function variantClass(variant: string): string {
  if (variant === "informe") return "nhs-variant--informe";
  if (variant === "activo") return "nhs-variant--activo";
  if (variant === "equidad") return "nhs-variant--equidad";
  return "nhs-variant--estudio";
}

function shorten(text: string, max = 320): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastStop = Math.max(cut.lastIndexOf("."), cut.lastIndexOf(";"), cut.lastIndexOf(","));
  return `${cut.slice(0, lastStop > 160 ? lastStop : max).trim()}...`;
}

function readableStatus(status: string): string {
  if (status === "integrated") return "lectura territorial integrada";
  if (status === "prioritization-pending") return "lectura territorial pendiente";
  return "lectura declarada";
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
      ].filter(Boolean).join(" ")}
    >
      <span className="nhs-value-tile__label">{label}</span>
      <span className="nhs-value-tile__value">{value}</span>
    </div>
  );
}

function ComparisonRail({ row }: { row: NHSDerivedRow }) {
  const points = buildRangePoints(row);
  if (points.length < 2) {
    return <p className="nhs-range-note">Sin banda: faltan valores numéricos comparables.</p>;
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

function IndicatorRow({ row }: { row: NHSDerivedRow }) {
  return (
    <article className="nhs-indicator-card">
      <div className="nhs-indicator-card__head">
        <p className="nhs-indicator-card__title">{row.indicador}</p>
        <span className={row.esProxy ? "nhs-indicator-card__badge" : "nhs-indicator-card__badge nhs-indicator-card__badge--local"}>
          {row.esProxy ? "proxy contextual" : "muestra local"}
        </span>
      </div>
      <div className="nhs-indicator-card__values" aria-label={`Valores de ${row.indicador}`}>
        <IndicatorValue label="Territorio" value={row.valor} featured />
        <IndicatorValue label="Provincia" value={row.refGranada} />
        <IndicatorValue label="Andalucía" value={row.refAndalucia} />
      </div>
      <ComparisonRail row={row} />
      <p className="nhs-indicator-card__relation">
        La banda sitúa valores disponibles en una escala común; no emite dictamen sanitario.
      </p>
    </article>
  );
}

function OverviewCard({ item }: { item: NHSDerivedOverviewMessage }) {
  return (
    <article className={`nhs-overview-card ${variantClass(item.variant)}`}>
      <span className="nhs-overview-card__source">{item.source}</span>
      <h3>{item.title}</h3>
      <p className="nhs-overview-card__signal">{item.signal}</p>
      <p>{item.text}</p>
    </article>
  );
}

function SourceCard({ block }: { block: NHSDerivedSourceBlock }) {
  return (
    <article className={`nhs-source-card ${variantClass(block.variant)}`}>
      <h3>{block.title}</h3>
      <dl>
        <dt>Aporta</dt>
        <dd>{block.whatItAdds}</dd>
        <dt>No permite leer</dt>
        <dd>{block.whatItDoesNotAllow}</dd>
      </dl>
    </article>
  );
}

function InformeRanking({ ranking }: { ranking: NHSDerivedInformeRanking }) {
  return (
    <section className="workspace-panel nhs-ranking-panel">
      <div className="nhs-section-head">
        <p className="eyebrow">Mapa de temas del Informe</p>
        <h3>Qué ocupa el texto sanitario de partida</h3>
      </div>
      <div className="nhs-ranking-list">
        {ranking.items.map((item) => (
          <div key={item.etiqueta} className="nhs-ranking-row">
            <div className="nhs-ranking-row__label">
              <span>{item.etiqueta}</span>
              <strong>{item.valor}</strong>
            </div>
            <div className="nhs-ranking-row__bar" aria-hidden="true">
              <span style={{ width: `${item.max > 0 ? Math.max(4, (item.valor / item.max) * 100) : 0}%` }} />
            </div>
          </div>
        ))}
      </div>
      <p className="nhs-caption">{ranking.caption}</p>
      <p className="nhs-caption">{ranking.unidad}</p>
    </section>
  );
}

function ReadingCard({ reading }: { reading: NHSDerivedTerritorialReading }) {
  return (
    <article className="nhs-reading-card">
      <h3>{reading.title}</h3>
      <p>{shorten(reading.reading)}</p>
      <p className="nhs-reading-card__question">{reading.groupMotorQuestion}</p>
    </article>
  );
}

function AgendaCard({ item }: { item: NHSDerivedAgendaItem }) {
  return (
    <article className={`nhs-agenda-card ${variantClass(item.variant)}`}>
      <span className="nhs-agenda-card__topic">{item.tema}</span>
      <h3>{item.senal}</h3>
      <p>{item.mecanismo}</p>
      <p className="nhs-agenda-card__hidden">{item.oculto}</p>
      <p className="nhs-agenda-card__question">{item.pregunta}</p>
    </article>
  );
}

function EmptyComparatorsPanel() {
  return (
    <section className="workspace-panel nhs-empty-comparators">
      <div className="nhs-section-head">
        <p className="eyebrow">Indicadores comparables</p>
        <h3>No hay indicadores cuantitativos comparables en el trazador sellado</h3>
      </div>
      <p>
        Esta ausencia no borra el Perfil: significa que el documento disponible
        no contiene todavía una tabla de indicadores con valor territorial,
        provincia y Andalucía. La ficha usa el Informe, los activos, las lecturas
        territoriales y las preguntas de contraste, y deja visible qué dato
        habría que producir para una lectura comparativa plena.
      </p>
    </section>
  );
}

function DataGapsPanel({
  warnings,
  cautions,
  pendingDeclaration,
}: {
  warnings: string[];
  cautions: string[];
  pendingDeclaration: string | null;
}) {
  const items = [
    ...(pendingDeclaration !== null ? [pendingDeclaration] : []),
    ...warnings,
    ...cautions.filter((text) => !warnings.includes(text)).slice(0, 3),
  ];
  if (items.length === 0) return null;
  return (
    <section className="workspace-panel nhs-gaps-panel">
      <div className="nhs-section-head">
        <p className="eyebrow">Alcance honesto</p>
        <h3>Qué no debe prometer este Perfil</h3>
      </div>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

export function NHSHealthProfileView({ document, id }: NHSHealthProfileViewProps) {
  const projection = projectNHSDerived(document);

  if (!projection.available) {
    return (
      <section id={id} className="workspace-panel nhs-root">
        <p className="eyebrow">Perfil de Salud Local · salida breve tipo Local Health Profiles</p>
        <h2>Pendiente de compilar el Perfil canónico</h2>
        <p className="panel-note">
          Esta salida se inspira en los Local Authority Health Profiles de
          OHID/Fingertips, pero no es un producto autónomo ni una segunda fuente
          de verdad. Se mostrará cuando el Perfil se compile como PSL-C y exista
          un documento canónico sellado.
        </p>
      </section>
    );
  }

  const groups = groupByConsecutiveBloque(projection.rows);
  const comparableRows = projection.rows.filter((row) => hasComparableBand(row));
  const doubleReferenceRows = projection.rows.filter((row) => hasBothReferences(row));
  const proxyRows = projection.rows.filter((row) => row.esProxy);
  const warnings = projection.documentaryBase?.scaleWarnings ?? [];
  const cautionTexts = projection.methodologicalCautions.map((c) => c.text);
  const featuredReadings = projection.territorialReadings.slice(0, 6);

  return (
    <div id={id} className="nhs-root">
      <section className="workspace-panel nhs-executive-hero">
        <div className="nhs-executive-hero__copy">
          <p className="eyebrow">Perfil de Salud Local · ficha pública tipo Local Health Profiles</p>
          <h2>{projection.territory}: salud, capacidades y datos pendientes</h2>
          <p className="panel-note">
            Resumen visual derivado del Perfil canónico. Integra lo que el
            expediente permite leer ahora: agenda sanitaria, activos, indicadores
            si existen, preguntas de equidad y límites metodológicos.
          </p>
        </div>
        <div className="nhs-executive-hero__metrics" aria-label="Resumen visual de la ficha">
          <div className="nhs-executive-metric">
            <span className="nhs-executive-metric__value">{projection.documentaryBase?.evidenceAtoms ?? "—"}</span>
            <span className="nhs-executive-metric__label">evidencias</span>
          </div>
          <div className="nhs-executive-metric">
            <span className="nhs-executive-metric__value">{projection.rows.length}</span>
            <span className="nhs-executive-metric__label">indicadores comparables</span>
          </div>
          <div className="nhs-executive-metric">
            <span className="nhs-executive-metric__value">{featuredReadings.length}</span>
            <span className="nhs-executive-metric__label">lecturas clave</span>
          </div>
          <div className="nhs-executive-metric">
            <span className="nhs-executive-metric__value">{readableStatus(projection.readingStatus)}</span>
            <span className="nhs-executive-metric__label">{projection.generatedDateLabel}</span>
          </div>
        </div>
      </section>

      {projection.overview.length > 0 && (
        <section className="workspace-panel nhs-overview-panel">
          <div className="nhs-section-head">
            <p className="eyebrow">Lectura para todos los públicos</p>
            <h3>Tres mensajes de entrada</h3>
          </div>
          <div className="nhs-overview-grid">
            {projection.overview.map((item) => (
              <OverviewCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}

      <section className="workspace-panel nhs-snapshot-panel">
        <div className="nhs-section-head">
          <p className="eyebrow">Cobertura de lectura</p>
          <h3>Qué tipo de evidencia sostiene la ficha</h3>
        </div>
        <div className="nhs-snapshot-grid">
          <div className="nhs-snapshot-card">
            <span className="nhs-snapshot-card__value">{projection.sourceBlocks.length}</span>
            <span className="nhs-snapshot-card__label">familias de fuente</span>
          </div>
          <div className="nhs-snapshot-card">
            <span className="nhs-snapshot-card__value">{projection.informeSignalRanking?.items.length ?? 0}</span>
            <span className="nhs-snapshot-card__label">temas del Informe</span>
          </div>
          <div className="nhs-snapshot-card">
            <span className="nhs-snapshot-card__value">{projection.groupMotorAgenda.length}</span>
            <span className="nhs-snapshot-card__label">preguntas públicas</span>
          </div>
          <div className="nhs-snapshot-card">
            <span className="nhs-snapshot-card__value">{comparableRows.length}/{projection.rows.length}</span>
            <span className="nhs-snapshot-card__label">con banda comparativa</span>
          </div>
        </div>
      </section>

      {projection.sourceBlocks.length > 0 && (
        <section className="workspace-panel nhs-source-panel">
          <div className="nhs-section-head">
            <p className="eyebrow">Fuentes y alcance</p>
            <h3>Qué aporta cada base de información</h3>
          </div>
          <div className="nhs-source-grid">
            {projection.sourceBlocks.map((block) => (
              <SourceCard key={block.id} block={block} />
            ))}
          </div>
        </section>
      )}

      {projection.rows.length === 0 ? (
        <EmptyComparatorsPanel />
      ) : (
        <>
          <section className="workspace-panel nhs-quality-panel">
            <div className="nhs-section-head">
              <p className="eyebrow">Indicadores comparables</p>
              <h3>Valores territoriales y referencias</h3>
            </div>
            <div className="nhs-quality-grid" aria-label="Resumen de indicadores comparables">
              <div className="nhs-quality-card nhs-quality-card--info">
                <span className="nhs-quality-card__value">{doubleReferenceRows.length}/{projection.rows.length}</span>
                <span className="nhs-quality-card__label">con doble referencia</span>
                <span className="nhs-quality-card__text">Provincia y Andalucía aparecen juntas.</span>
              </div>
              <div className="nhs-quality-card nhs-quality-card--warning">
                <span className="nhs-quality-card__value">{proxyRows.length}</span>
                <span className="nhs-quality-card__label">proxy contextual</span>
                <span className="nhs-quality-card__text">Orientan contexto; no sustituyen una medición local directa.</span>
              </div>
              <div className="nhs-quality-card nhs-quality-card--solid">
                <span className="nhs-quality-card__value">{comparableRows.length}</span>
                <span className="nhs-quality-card__label">con banda visual</span>
                <span className="nhs-quality-card__text">La banda coloca valores, no los juzga.</span>
              </div>
            </div>
            <div className="nhs-key">
              <span className="nhs-key__title">Clave visual</span>
              <span className="nhs-key__item nhs-key__item--local">Territorio</span>
              <span className="nhs-key__item nhs-key__item--province">Provincia</span>
              <span className="nhs-key__item nhs-key__item--andalusia">Andalucía</span>
              <span className="nhs-key__note">La banda no evalúa; muestra distancia numérica visible.</span>
            </div>
          </section>

          {groups.map((group, gi) => (
            <section
              key={`${group.bloque}-${gi}`}
              className={`workspace-panel nhs-domain-panel nhs-domain-panel--tone-${(gi % 3) + 1}`}
            >
              <div className="nhs-domain__header">
                <div>
                  <p className="eyebrow">{group.bloque}</p>
                  <h3>{group.bloque}</h3>
                </div>
                <p className="nhs-domain__count">{group.rows.length} indicador{group.rows.length !== 1 ? "es" : ""}</p>
              </div>
              <div className="nhs-domain__rows">
                {group.rows.map((row, ri) => (
                  <IndicatorRow key={`${row.indicador}-${ri}`} row={row} />
                ))}
              </div>
            </section>
          ))}
        </>
      )}

      {projection.informeSignalRanking !== null && (
        <InformeRanking ranking={projection.informeSignalRanking} />
      )}

      {featuredReadings.length > 0 && (
        <section className="workspace-panel nhs-reading-panel">
          <div className="nhs-section-head">
            <p className="eyebrow">Lecturas territoriales</p>
            <h3>Lo que el expediente permite formular</h3>
          </div>
          <div className="nhs-reading-grid">
            {featuredReadings.map((reading) => (
              <ReadingCard key={reading.title} reading={reading} />
            ))}
          </div>
        </section>
      )}

      {projection.groupMotorAgenda.length > 0 && (
        <section className="workspace-panel nhs-agenda-panel">
          <div className="nhs-section-head">
            <p className="eyebrow">Para conversación pública</p>
            <h3>Preguntas que abren desigualdad y acceso real</h3>
          </div>
          <div className="nhs-agenda-grid">
            {projection.groupMotorAgenda.map((item) => (
              <AgendaCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}

      <DataGapsPanel
        warnings={warnings}
        cautions={cautionTexts}
        pendingDeclaration={projection.pendingDeclaration}
      />
    </div>
  );
}
