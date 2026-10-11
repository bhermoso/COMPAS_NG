import { THEMATIC_TOPICS, MAX_SELECTED_TOPICS } from "../../domain/thematic-prioritisation";

interface ThematicPrioritisationPanelProps {
  savedIds: string[];
  onOpen: () => void;
}

export function ThematicPrioritisationPanel({
  savedIds,
  onOpen,
}: ThematicPrioritisationPanelProps) {
  return (
    <section className="workspace-panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Priorización temática · Participación ciudadana</p>
          <h2>Temáticas prioritarias del Plan Local</h2>
        </div>
        <p className="panel-note">
          Registro informativo de hasta {MAX_SELECTED_TOPICS} temáticas procedentes
          de la encuesta ciudadana REDCap. COMPÁS no recoge votos: incorpora el
          resultado documentado para que el Grupo Motor lo interprete junto al Perfil.
        </p>
      </div>

      {savedIds.length > 0 ? (
        <div className="tp-panel__selection">
          <p className="tp-panel__selection-label">Temáticas seleccionadas</p>
          <div className="tp-chips">
            {savedIds.map((id) => {
              const topic = THEMATIC_TOPICS.find((t) => t.id === id);
              return (
                <span key={id} className="tp-chip">
                  {topic?.label ?? id}
                </span>
              );
            })}
          </div>
        </div>
      ) : (
        <p className="empty-state">
          Ninguna temática incorporada aún para este municipio. Importa el CSV REDCap
          o registra una transcripción técnica validada de hasta {MAX_SELECTED_TOPICS} temáticas.
        </p>
      )}

      <button type="button" className="tp-panel__open-btn" onClick={onOpen}>
        {savedIds.length > 0 ? "Revisar resultados" : "Incorporar resultados"}
      </button>
    </section>
  );
}
