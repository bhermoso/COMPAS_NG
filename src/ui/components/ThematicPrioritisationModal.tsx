import { useEffect } from "react";
import type { ThematicTopic } from "../../domain/thematic-prioritisation";
import { MAX_SELECTED_TOPICS } from "../../domain/thematic-prioritisation";

interface ThematicPrioritisationModalProps {
  isOpen: boolean;
  topics: readonly ThematicTopic[];
  selectedIds: string[];
  savedIds: string[];
  onToggle: (id: string) => void;
  onSave: () => void;
  onClose: () => void;
}

export function ThematicPrioritisationModal({
  isOpen,
  topics,
  selectedIds,
  savedIds,
  onToggle,
  onSave,
  onClose,
}: ThematicPrioritisationModalProps) {
  const count = selectedIds.length;
  const atMax = count >= MAX_SELECTED_TOPICS;

  const hasChanges =
    selectedIds.length !== savedIds.length ||
    selectedIds.some((id) => !savedIds.includes(id));

  useEffect(() => {
    if (!isOpen) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  function handleBackdrop(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <div className="tp-modal-backdrop" onClick={handleBackdrop} role="presentation">
      <div
        className="tp-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tp-modal-title"
      >
        {/* Cabecera */}
        <div className="tp-modal__header">
          <div className="tp-modal__header-text">
            <p className="eyebrow">Participación ciudadana · Priorización Temática</p>
            <h2 id="tp-modal-title" className="tp-modal__title">
              ¿Cuáles son las temáticas más importantes para la salud de tu municipio?
            </h2>
            <p className="tp-modal__desc">
              Selecciona hasta <strong>{MAX_SELECTED_TOPICS} temáticas</strong>.
              Esta selección reflejará las prioridades ciudadanas para el Plan Local de Salud 2027–2030.
            </p>
          </div>
          <button
            type="button"
            className="tp-modal__close"
            onClick={onClose}
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        {/* Contador */}
        <div className="tp-modal__counter-bar">
          <span
            className={`tp-modal__counter-pill${atMax ? " tp-modal__counter-pill--full" : ""}`}
          >
            {count} / {MAX_SELECTED_TOPICS}
          </span>
          <span className="tp-modal__counter-label">
            {atMax
              ? "Límite alcanzado · Deselecciona una para cambiar"
              : count === 0
              ? "Ninguna seleccionada aún"
              : `${MAX_SELECTED_TOPICS - count} más disponible${MAX_SELECTED_TOPICS - count !== 1 ? "s" : ""}`}
          </span>
        </div>

        {/* Cuadrícula de temas */}
        <div className="tp-modal__grid">
          {topics.map((topic, index) => {
            const isSelected = selectedIds.includes(topic.id);
            const isDisabled = !isSelected && atMax;
            return (
              <button
                key={topic.id}
                type="button"
                className={[
                  "tp-card",
                  isSelected ? "tp-card--selected" : "",
                  isDisabled ? "tp-card--disabled" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => !isDisabled && onToggle(topic.id)}
                aria-pressed={isSelected}
                disabled={isDisabled}
              >
                <span className="tp-card__num" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {isSelected && (
                  <span className="tp-card__check" aria-hidden="true">✓</span>
                )}
                <span className="tp-card__label">{topic.label}</span>
              </button>
            );
          })}
        </div>

        {/* Pie de modal */}
        <div className="tp-modal__footer">
          <button type="button" className="tp-modal__btn-cancel" onClick={onClose}>
            Cancelar
          </button>
          <button
            type="button"
            className="tp-modal__btn-save"
            onClick={onSave}
            disabled={!hasChanges}
          >
            Guardar selección
          </button>
        </div>
      </div>
    </div>
  );
}
