import type { HypothesisPlausibilidad } from "../../../domain/health-profile";
import type { EditHipotesisFormDraft } from "./_shared";

export interface HipotesisEditFormProps {
  draft:    EditHipotesisFormDraft;
  onChange: (updates: Partial<EditHipotesisFormDraft>) => void;
  onSubmit: () => void;
  onCancel: () => void;
  error:    string | null;
}

export function HipotesisEditForm({
  draft, onChange, onSubmit, onCancel, error,
}: HipotesisEditFormProps) {
  return (
    <div className="ekc-interp-form ekc-interp-form--inline">
      <p className="ekc-interp-form__title">Editar hipótesis</p>
      <p className="ekc-interp-form__note">
        Se pueden modificar el enunciado, la plausibilidad, los indicios y las preguntas
        resolutoras. El autor y la fecha de formulación no son editables.
      </p>

      <div className="ekc-interp-form__row">
        <label className="ekc-interp-form__label">Enunciado</label>
        <textarea
          className="ekc-interp-form__textarea"
          value={draft.enunciado}
          onChange={e => onChange({ enunciado: e.target.value })}
          rows={3}
        />
      </div>

      <div className="ekc-interp-form__row">
        <label className="ekc-interp-form__label">Plausibilidad</label>
        <select
          className="ekc-interp-form__select ekc-interp-form__select--sm"
          value={draft.plausibilidad}
          onChange={e => onChange({ plausibilidad: e.target.value as HypothesisPlausibilidad })}
        >
          <option value="alta">Alta</option>
          <option value="moderada">Moderada</option>
          <option value="especulativa">Especulativa</option>
        </select>
      </div>

      <div className="ekc-interp-form__row">
        <label className="ekc-interp-form__label">Indicios (uno por línea)</label>
        <textarea
          className="ekc-interp-form__textarea"
          value={draft.indicios}
          onChange={e => onChange({ indicios: e.target.value })}
          rows={3}
        />
      </div>

      <div className="ekc-interp-form__row">
        <label className="ekc-interp-form__label">Preguntas resolutoras (una por línea)</label>
        <textarea
          className="ekc-interp-form__textarea"
          value={draft.preguntasResolutoras}
          onChange={e => onChange({ preguntasResolutoras: e.target.value })}
          rows={2}
        />
      </div>

      {error && <p className="ekc-interp-form__error">{error}</p>}

      <div className="ekc-interp-form__actions">
        <button className="ekc-interp-form__submit" onClick={onSubmit}>Guardar cambios</button>
        <button className="ekc-interp-form__cancel" onClick={onCancel}>Cancelar</button>
      </div>
    </div>
  );
}
