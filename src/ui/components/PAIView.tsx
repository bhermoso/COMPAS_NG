import { useState } from "react";
import type { BorradorPAI, ObjetivoEstrategicoPAI } from "../../application/pai";

interface PAIViewProps {
  pai: BorradorPAI;
}

function ObjetivoCard({ objetivo }: { objetivo: ObjetivoEstrategicoPAI }) {
  const [expanded, setExpanded] = useState(false);
  const totalIndicadores = objetivo.alineaciones.reduce(
    (acc, a) => acc + a.indicadoresDelMarco.length, 0
  );

  return (
    <div className={`pai-objetivo${objetivo.sinCoberturaMarcal ? " pai-objetivo--sin-cobertura" : ""}`}>
      <div className="pai-objetivo__header">
        <div className="pai-objetivo__meta">
          <span className="pai-objetivo__num">Área de intervención</span>
          {objetivo.sinCoberturaMarcal && (
            <span className="pai-sin-cobertura-pill">Sin cobertura institucional</span>
          )}
        </div>
        <p className="pai-objetivo__titulo">{objetivo.titulo}</p>
        {!objetivo.sinCoberturaMarcal && (
          <div className="pai-objetivo__stats">
            <span>{objetivo.alineaciones.length} alineación{objetivo.alineaciones.length !== 1 ? "es" : ""} institucional{objetivo.alineaciones.length !== 1 ? "es" : ""}</span>
            {totalIndicadores > 0 && (
              <span>{totalIndicadores} indicador{totalIndicadores !== 1 ? "es" : ""} de referencia</span>
            )}
          </div>
        )}
      </div>

      {objetivo.alineaciones.length > 0 && (
        <>
          <button
            type="button"
            className="pai-objetivo__toggle"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
          >
            {expanded ? "▲ Ocultar propuesta técnica" : "▼ Ver propuesta técnica"}
          </button>

          {expanded && (
            <div className="pai-objetivo__body">

              {/* Actuación propuesta */}
              <div className="pai-actuacion">
                <p className="pai-section-label">Actuación propuesta</p>
                <p className="pai-actuacion__desc">{objetivo.actuaciones[0]?.descripcion}</p>
                <p className="pai-actuacion__nota">
                  Scaffold institucional. El equipo técnico definirá las actuaciones, responsables, plazos y recursos.
                </p>
              </div>

              {/* Alineaciones institucionales con sus indicadores */}
              <div className="pai-alineaciones">
                <p className="pai-section-label">Alineación institucional y marcos de referencia</p>
                {objetivo.alineaciones.map((ali) => (
                  <div key={ali.elementoId} className="pai-alineacion">
                    <div className="pai-alineacion__head">
                      <span className={`lectura-marco-badge lectura-marco-badge--${ali.marcoId.toLowerCase()}`}>{ali.marcoId}</span>
                      <span className="pai-alineacion__label">{ali.elementoLabel}</span>
                    </div>
                    <p className="pai-alineacion__trace">{ali.sourceTrace}</p>
                    {ali.indicadoresDelMarco.length > 0 && (
                      <div className="pai-indicadores">
                        <p className="pai-indicadores__label">Indicadores del marco:</p>
                        <ul className="pai-indicadores__list">
                          {ali.indicadoresDelMarco.map((ind, i) => (
                            <li key={i} className="pai-indicador">{ind}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Tensiones */}
              {objetivo.tensiones.length > 0 && (
                <div className="pai-tensiones">
                  <p className="pai-section-label">Señales de deliberación</p>
                  {objetivo.tensiones.map((t, i) => (
                    <div key={i} className="pai-tension">
                      <span className="pai-tension__tipo">
                        {t.tipo === "evidencia" ? "⚡ Tensión evidencial" : "⚡ Tensión de marcos"}
                      </span>
                      <p className="pai-tension__desc">{t.descripcion}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Cautelas */}
              {objetivo.cautelasOriginales.length > 0 && (
                <div className="pai-cautelas-orig">
                  <p className="pai-section-label">Cautelas heredadas del diagnóstico</p>
                  {objetivo.cautelasOriginales.map((c, i) => (
                    <p key={i} className="pai-cautela-orig">{c}</p>
                  ))}
                </div>
              )}

            </div>
          )}
        </>
      )}
    </div>
  );
}

export function PAIView({ pai }: PAIViewProps) {
  const conCobertura = pai.objetivos.filter((o) => !o.sinCoberturaMarcal).length;
  const sinCobertura = pai.objetivos.filter((o) => o.sinCoberturaMarcal).length;
  const totalIndicadores = pai.objetivos.reduce(
    (acc, o) => acc + o.alineaciones.reduce((a2, al) => a2 + al.indicadoresDelMarco.length, 0),
    0
  );

  return (
    <div className="pai-root">

      {/* Cabecera institucional */}
      <section className="workspace-panel pai-header-panel">
        <p className="eyebrow">Producto 6 · Plan de Acción Inteligente</p>
        <h2>Borrador de Plan de Acción</h2>
        <p className="panel-note">
          Propuesta técnica estructurada generada a partir de la Lectura Estratégica Local.
          Cada objetivo deriva directamente de un escenario estratégico identificado en el diagnóstico.
          Requiere validación del equipo técnico antes de cualquier uso institucional.
        </p>

        {pai.sinContenidoTraducible ? (
          <p className="panel-note">
            La Lectura Estratégica no tiene contenido traducible. No se pueden generar objetivos.
          </p>
        ) : (
          <div className="pai-summary-row">
            <div className="pai-summary-item">
              <span className="pai-summary-val">{pai.objetivos.length}</span>
              <span className="pai-summary-label">objetivos propuestos</span>
            </div>
            <div className="pai-summary-item">
              <span className="pai-summary-val">{conCobertura}</span>
              <span className="pai-summary-label">con cobertura institucional</span>
            </div>
            {sinCobertura > 0 && (
              <div className="pai-summary-item">
                <span className="pai-summary-val pai-summary-val--warn">{sinCobertura}</span>
                <span className="pai-summary-label">sin cobertura</span>
              </div>
            )}
            <div className="pai-summary-item">
              <span className="pai-summary-val">{totalIndicadores}</span>
              <span className="pai-summary-label">indicadores de referencia</span>
            </div>
          </div>
        )}
      </section>

      {/* Objetivos */}
      {pai.objetivos.length > 0 && (
        <section className="workspace-panel">
          <p className="eyebrow">Objetivos estratégicos propuestos</p>
          <h2>Propuesta de intervención territorial</h2>
          <div className="pai-objetivos-list">
            {pai.objetivos.map((obj) => (
              <ObjetivoCard key={obj.id} objetivo={obj} />
            ))}
          </div>
        </section>
      )}

      {/* Cautelas invariables */}
      <section className="workspace-panel">
        <p className="eyebrow">Cautelas institucionales</p>
        <div className="pai-cautelas">
          {pai.cautelas.map((c, i) => (
            <p key={i} className="pai-cautela-invariable">{c}</p>
          ))}
        </div>
      </section>

    </div>
  );
}
