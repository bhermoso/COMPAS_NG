import { useMemo } from "react";
import type { PerfilLocalDeSalud, ProfileSpace } from "../../domain/health-profile";
import {
  computeEstadoDelConocimiento,
} from "../../application/health-profile";
import type {
  PerfilEstadoNivel,
  PerfilSpaceCoverage,
} from "../../application/health-profile";

// ── Label maps ────────────────────────────────────────────────────────────────

const NIVEL_LABEL: Record<PerfilEstadoNivel, string> = {
  "vacio":                     "Vacío",
  "en-construccion":           "En construcción",
  "cobertura-minima":          "Cobertura mínima",
  "estructuralmente-completo": "Estructuralmente completo",
};

const SPACE_LABEL: Record<ProfileSpace, string> = {
  "contexto-territorial":     "Contexto territorial",
  "situacion-salud":          "Situación de salud",
  "determinantes":            "Determinantes",
  "desigualdades":            "Desigualdades",
  "activos":                  "Activos",
  "sintesis":                 "Síntesis",
  "preguntas-abiertas":       "Preguntas abiertas",
  "preparacion-deliberativa": "Preparación deliberativa",
};

const COVERAGE_LABEL: Record<PerfilSpaceCoverage, string> = {
  "vacio":              "Vacío",
  "iniciado":           "Iniciado",
  "pendiente-revision": "Pendiente revisión",
  "desarrollado":       "Desarrollado",
};

// ── Props ─────────────────────────────────────────────────────────────────────

interface PerfilLocalDeSaludPanelProps {
  perfil?: PerfilLocalDeSalud;
  municipalityName: string;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function PerfilLocalDeSaludPanel({
  perfil,
  municipalityName,
}: PerfilLocalDeSaludPanelProps) {

  const estado = useMemo(
    () => (perfil ? computeEstadoDelConocimiento(perfil) : null),
    [perfil]
  );

  // ── Estado vacío: workspace sin Perfil iniciado ───────────────────────────
  if (!perfil || !estado) {
    return (
      <section className="workspace-panel ekc-panel">
        <p className="eyebrow">Espacio interpretativo · {municipalityName}</p>
        <h2 className="ekc-panel__title">Estado del Conocimiento</h2>
        <p className="panel-note">
          El espacio de trabajo interpretativo del Perfil Local de Salud permite al equipo
          técnico registrar interpretaciones, hipótesis y preguntas abiertas sobre el
          territorio, construidas a partir de la evidencia disponible en el pipeline.
        </p>
        <p className="panel-note ekc-panel__empty-note">
          Estado del Perfil: <strong>Vacío.</strong> No se han registrado afirmaciones
          técnicas sobre {municipalityName}.
        </p>
      </section>
    );
  }

  const { base, nivelEstado, criteriosCobertura, coberturaMinimaCumplida } = estado;
  const alertasGlobales = base.alertasGlobales;
  const espaciosConAlertas = base.espacios.filter(s => s.alertas.length > 0);

  const ultimaActualizacion = new Date(base.ultimaActualizacion).toLocaleDateString("es-ES", {
    year: "numeric", month: "long", day: "numeric",
  });

  return (
    <section className="workspace-panel ekc-panel">
      <p className="eyebrow">Espacio interpretativo · {municipalityName}</p>
      <h2 className="ekc-panel__title">Estado del Conocimiento</h2>

      {/* ── Estado global ──────────────────────────────────────────────────── */}
      <div className="ekc-nivel">
        <span className="ekc-nivel__label">Estado del Perfil</span>
        <span className={`ekc-nivel__chip ekc-nivel__chip--${nivelEstado}`}>
          {NIVEL_LABEL[nivelEstado]}
        </span>
        <span className="ekc-nivel__meta">Actualizado: {ultimaActualizacion}</span>
      </div>

      {/* ── Conteos globales ────────────────────────────────────────────────── */}
      <table className="ekc-conteos">
        <tbody>
          <tr>
            <td className="ekc-conteos__label">Interpretaciones activas</td>
            <td className="ekc-conteos__val">{base.interpretacionesActivas}</td>
            <td className="ekc-conteos__extra">
              {base.interpretacionesSuperadas > 0 &&
                `${base.interpretacionesSuperadas} superada(s)`}
            </td>
          </tr>
          <tr>
            <td className="ekc-conteos__label">Hipótesis activas</td>
            <td className="ekc-conteos__val">{base.hipotesisActivas}</td>
            <td className="ekc-conteos__extra">
              {base.hipotesisResueltas > 0 && `${base.hipotesisResueltas} resuelta(s)`}
              {base.hipotesisResueltas > 0 && base.hipotesisDescartadas > 0 && " · "}
              {base.hipotesisDescartadas > 0 && `${base.hipotesisDescartadas} descartada(s)`}
            </td>
          </tr>
          <tr>
            <td className="ekc-conteos__label">Preguntas abiertas</td>
            <td className="ekc-conteos__val">{base.preguntasAbiertas}</td>
            <td className="ekc-conteos__extra">
              {base.preguntasResueltas > 0 && `${base.preguntasResueltas} resuelta(s)`}
            </td>
          </tr>
          <tr>
            <td className="ekc-conteos__label">Síntesis narrativa</td>
            <td className="ekc-conteos__val" colSpan={2}>
              {base.tieneSintesis ? "Elaborada" : "Pendiente"}
            </td>
          </tr>
        </tbody>
      </table>

      {/* ── Cobertura mínima ────────────────────────────────────────────────── */}
      <div className="ekc-cobertura">
        <p className="ekc-cobertura__heading">
          Cobertura mínima
          <span className={`ekc-cobertura__estado ekc-cobertura__estado--${coberturaMinimaCumplida ? "ok" : "pending"}`}>
            {coberturaMinimaCumplida ? "Cumplida" : "No cumplida"}
          </span>
        </p>
        <ul className="ekc-criterios">
          {criteriosCobertura.map(c => (
            <li
              key={c.id}
              className={`ekc-criterio ekc-criterio--${c.cumplido ? "ok" : "pending"}`}
            >
              <span className="ekc-criterio__mark" aria-hidden="true">
                {c.cumplido ? "✓" : "○"}
              </span>
              <span className="ekc-criterio__desc">{c.descripcion}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* ── Alertas estructurales globales ──────────────────────────────────── */}
      {alertasGlobales.length > 0 && (
        <div className="ekc-alertas">
          <p className="ekc-alertas__heading">
            Alertas estructurales globales
            <span className="ekc-alertas__count">{alertasGlobales.length}</span>
          </p>
          <ul className="ekc-alertas__list">
            {alertasGlobales.map((a, i) => (
              <li key={i} className="ekc-alerta">
                <span className="ekc-alerta__tipo">{a.tipo}</span>
                <span className="ekc-alerta__desc">{a.descripcion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── Alertas por espacio funcional ───────────────────────────────────── */}
      {espaciosConAlertas.length > 0 && (
        <div className="ekc-alertas">
          <p className="ekc-alertas__heading">
            Alertas por espacio funcional
            <span className="ekc-alertas__count">
              {espaciosConAlertas.reduce((acc, s) => acc + s.alertas.length, 0)}
            </span>
          </p>
          {espaciosConAlertas.map(s => (
            <div key={s.espacio} className="ekc-espacio-alertas">
              <p className="ekc-espacio-alertas__space">{SPACE_LABEL[s.espacio]}</p>
              <ul className="ekc-alertas__list">
                {s.alertas.map((a, i) => (
                  <li key={i} className="ekc-alerta">
                    <span className="ekc-alerta__tipo">{a.tipo}</span>
                    <span className="ekc-alerta__desc">{a.descripcion}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* ── Estado por espacios funcionales ─────────────────────────────────── */}
      <div className="ekc-spaces">
        <p className="ekc-spaces__heading">Espacios funcionales</p>
        <table className="ekc-spaces-table">
          <thead>
            <tr>
              <th>Espacio</th>
              <th>Cobertura</th>
              <th>Interp.</th>
              <th>Hip.</th>
              <th>Preg.</th>
              <th>Alertas</th>
            </tr>
          </thead>
          <tbody>
            {base.espacios.map(s => (
              <tr key={s.espacio} className="ekc-spaces-row">
                <td className="ekc-spaces-row__name">{SPACE_LABEL[s.espacio]}</td>
                <td>
                  <span className={`ekc-coverage ekc-coverage--${s.cobertura}`}>
                    {COVERAGE_LABEL[s.cobertura]}
                  </span>
                </td>
                <td className="ekc-spaces-row__num">
                  {s.interpretacionesActivas > 0 ? s.interpretacionesActivas : "—"}
                </td>
                <td className="ekc-spaces-row__num">
                  {s.hipotesisActivas > 0 ? s.hipotesisActivas : "—"}
                </td>
                <td className="ekc-spaces-row__num">
                  {s.preguntasAbiertas > 0 ? s.preguntasAbiertas : "—"}
                </td>
                <td className="ekc-spaces-row__num">
                  {s.alertas.length > 0 ? s.alertas.length : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </section>
  );
}
