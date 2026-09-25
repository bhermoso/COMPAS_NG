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
          Selección de hasta {MAX_SELECTED_TOPICS} temáticas de salud para el Plan Local
          2027–2030. Refleja resultados documentados del proceso de participación
          ciudadana; no equivale a la decisión posterior del Grupo Motor.
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
          Ninguna temática seleccionada aún para este municipio. Abre el selector para
          elegir hasta {MAX_SELECTED_TOPICS} temáticas.
        </p>
      )}

      <button type="button" className="tp-panel__open-btn" onClick={onOpen}>
        {savedIds.length > 0 ? "Modificar selección" : "Seleccionar temáticas"}
      </button>
    </section>
  );
}
