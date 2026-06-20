import type { ThematicTopic } from "../../domain/thematic-prioritisation";
import { MAX_SELECTED_TOPICS } from "../../domain/thematic-prioritisation";

interface ThematicPrioritisationPanelProps {
  topics: readonly ThematicTopic[];
  selectedIds: string[];
  savedIds: string[];
  onToggle: (id: string) => void;
  onSave: () => void;
}

export function ThematicPrioritisationPanel({
  topics,
  selectedIds,
  savedIds,
  onToggle,
  onSave,
}: ThematicPrioritisationPanelProps) {
  const count = selectedIds.length;
  const atMax = count >= MAX_SELECTED_TOPICS;

  const hasUnsavedChanges =
    selectedIds.length !== savedIds.length ||
    selectedIds.some((id) => !savedIds.includes(id));

  return (
    <section className="workspace-panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Priorización temática</p>
          <h2>Temáticas prioritarias del Plan Local</h2>
        </div>
        <p className="panel-note">
          Selección de hasta {MAX_SELECTED_TOPICS} temáticas de salud para el Plan
          Local de Salud 2027–2030. Representa una decisión de participación o
          consenso técnico, independiente del análisis automático.
        </p>
      </div>

      <div className="tp-toolbar">
        <span className="tp-counter">
          <span className="tp-counter__value">{count}</span>
          <span className="tp-counter__sep">/</span>
          <span className="tp-counter__max">{MAX_SELECTED_TOPICS}</span>
          <span className="tp-counter__label">temáticas seleccionadas</span>
        </span>
        <button
          type="button"
          className="tp-save-btn"
          onClick={onSave}
          disabled={!hasUnsavedChanges}
        >
          Guardar selección
        </button>
      </div>

      <div className="tp-grid">
        {topics.map((topic) => {
          const isSelected = selectedIds.includes(topic.id);
          const isDisabled = !isSelected && atMax;
          return (
            <button
              key={topic.id}
              type="button"
              onClick={() => !isDisabled && onToggle(topic.id)}
              className={[
                "tp-topic",
                isSelected ? "tp-topic--selected" : "",
                isDisabled ? "tp-topic--disabled" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              aria-pressed={isSelected}
              disabled={isDisabled}
            >
              <span className="tp-topic__check" aria-hidden="true">
                {isSelected ? "✓" : ""}
              </span>
              <span className="tp-topic__label">{topic.label}</span>
            </button>
          );
        })}
      </div>

      {savedIds.length > 0 && !hasUnsavedChanges && (
        <p className="tp-saved-note">
          Selección guardada:{" "}
          {savedIds
            .map((id) => topics.find((t) => t.id === id)?.label ?? id)
            .join(", ")}
          .
        </p>
      )}
    </section>
  );
}
