import { useState } from "react";
import type { LecturaEstrategicaLocal, EscenarioEstrategico } from "../../domain/strategic-scenario";

interface LecturaEstrategicaViewProps {
  lectura: LecturaEstrategicaLocal;
}

function NivelBadge({ nivel }: { nivel: string }) {
  const labels: Record<string, string> = {
    linea: "Línea", objetivo: "Objetivo", programa: "Programa",
    eje: "Eje", accion: "Acción",
  };
  return <span className="lectura-nivel-badge">{labels[nivel] ?? nivel}</span>;
}

function MarcoBadge({ marcoId }: { marcoId: string }) {
  return <span className={`lectura-marco-badge lectura-marco-badge--${marcoId.toLowerCase()}`}>{marcoId}</span>;
}

function EscenarioCard({ escenario }: { escenario: EscenarioEstrategico }) {
  const [expanded, setExpanded] = useState(false);
  const tieneReferencias = escenario.referenciasInstitucionales.length > 0;
  const tieneTensiones = escenario.tensiones.length > 0;

  return (
    <div className={`lectura-escenario${escenario.sinCoberturaMarcal ? " lectura-escenario--sin-cobertura" : ""}`}>
      <div className="lectura-escenario__header">
        <div className="lectura-escenario__meta">
          {escenario.sinCoberturaMarcal ? (
            <span className="lectura-cobertura-pill lectura-cobertura-pill--ausente">Sin cobertura marcal</span>
          ) : (
            <span className="lectura-cobertura-pill lectura-cobertura-pill--presente">
              {escenario.referenciasInstitucionales.length} referencia{escenario.referenciasInstitucionales.length !== 1 ? "s" : ""}
            </span>
          )}
          {tieneTensiones && (
            <span className="lectura-tension-pill">{escenario.tensiones.length} tensión{escenario.tensiones.length !== 1 ? "es" : ""}</span>
          )}
        </div>
        <p className="lectura-escenario__titulo">{escenario.tema}</p>
        <div className="lectura-escenario__marcos">
          {[...new Set(escenario.referenciasInstitucionales.map((r) => r.marcoId))].map((m) => (
            <MarcoBadge key={m} marcoId={m} />
          ))}
        </div>
      </div>

      {tieneReferencias && (
        <>
          <button
            type="button"
            className="lectura-escenario__toggle"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
          >
            {expanded ? "▲ Ocultar referencias" : "▼ Ver referencias institucionales"}
          </button>

          {expanded && (
            <div className="lectura-escenario__refs">
              {escenario.referenciasInstitucionales.map((ref) => (
                <div key={ref.elementoId} className="lectura-ref">
                  <div className="lectura-ref__head">
                    <MarcoBadge marcoId={ref.marcoId} />
                    <NivelBadge nivel={ref.nivel} />
                    <span className="lectura-ref__label">{ref.elementoLabel}</span>
                  </div>
                  <p className="lectura-ref__trace">{ref.sourceTrace}</p>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {tieneTensiones && (
        <div className="lectura-tensiones">
          {escenario.tensiones.map((t, i) => (
            <div key={i} className="lectura-tension">
              <span className="lectura-tension__tipo">{t.tipo === "evidencia" ? "Tensión evidencial" : "Tensión de marco"}</span>
              <p className="lectura-tension__desc">{t.descripcion}</p>
            </div>
          ))}
        </div>
      )}

      {escenario.cautelasOriginales.length > 0 && (
        <div className="lectura-cautelas-orig">
          {escenario.cautelasOriginales.map((c, i) => (
            <p key={i} className="lectura-cautela-orig">{c}</p>
          ))}
        </div>
      )}
    </div>
  );
}

export function LecturaEstrategicaView({ lectura }: LecturaEstrategicaViewProps) {
  const marcos = [...new Set(
    lectura.escenarios.flatMap((e) => e.referenciasInstitucionales.map((r) => r.marcoId))
  )];

  return (
    <div className="lectura-root">

      {/* Cabecera institucional */}
      <section className="workspace-panel lectura-header-panel">
        <p className="eyebrow">Producto 5 · Motor de Traducción Estratégica</p>
        <h2>Lectura Estratégica Local</h2>
        <p className="panel-note">
          Escenarios estratégicos identificados a partir del diagnóstico territorial y el
          conocimiento estratégico institucional disponible. Cada escenario traza directamente
          a las áreas de intervención del Perfil de Salud Local.
        </p>

        <div className="lectura-summary-row">
          <div className="lectura-summary-item">
            <span className="lectura-summary-val">{lectura.escenarios.length}</span>
            <span className="lectura-summary-label">escenarios</span>
          </div>
          <div className="lectura-summary-item">
            <span className="lectura-summary-val">{marcos.length}</span>
            <span className="lectura-summary-label">marcos consultados</span>
          </div>
          <div className="lectura-summary-item">
            <span className="lectura-summary-val">
              {lectura.escenarios.filter((e) => !e.sinCoberturaMarcal).length}
            </span>
            <span className="lectura-summary-label">con cobertura institucional</span>
          </div>
          <div className="lectura-summary-item">
            <span className="lectura-summary-val">
              {lectura.escenarios.reduce((acc, e) => acc + e.tensiones.length, 0)}
            </span>
            <span className="lectura-summary-label">tensiones identificadas</span>
          </div>
        </div>

        <div className="lectura-marcos-row">
          {marcos.map((m) => <MarcoBadge key={m} marcoId={m} />)}
        </div>
      </section>

      {/* Escenarios */}
      {lectura.hasTranslatableContent ? (
        <section className="workspace-panel">
          <p className="eyebrow">Escenarios estratégicos</p>
          <h2>Coherencias estratégicas identificadas</h2>
          <div className="lectura-escenarios-list">
            {lectura.escenarios.map((e) => (
              <EscenarioCard key={e.id} escenario={e} />
            ))}
          </div>
        </section>
      ) : (
        <section className="workspace-panel">
          <p className="panel-note">
            El Perfil de Salud Local no contiene áreas de intervención procesables.
            La Lectura Estratégica no tiene contenido traducible.
          </p>
        </section>
      )}

      {/* Cautelas invariables */}
      <section className="workspace-panel">
        <p className="eyebrow">Cautelas del Motor de Traducción Estratégica</p>
        <div className="lectura-cautelas">
          {lectura.cautelas.map((c, i) => (
            <p key={i} className="lectura-cautela-invariable">{c}</p>
          ))}
        </div>
      </section>

    </div>
  );
}
