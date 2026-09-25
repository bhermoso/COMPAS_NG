import type { OpenQuestionUrgencia } from "../../../domain/health-profile";
import type { EditOpenQuestionFormDraft } from "./_shared";

export interface OpenQuestionEditFormProps {
  draft:    EditOpenQuestionFormDraft;
  onChange: (updates: Partial<EditOpenQuestionFormDraft>) => void;
  onSubmit: () => void;
  onCancel: () => void;
  error:    string | null;
}

export function OpenQuestionEditForm({
  draft, onChange, onSubmit, onCancel, error,
}: OpenQuestionEditFormProps) {
  return (
    <div className="ekc-interp-form ekc-interp-form--inline">
      <p className="ekc-interp-form__title">Editar pregunta</p>
      <p className="ekc-interp-form__note">
        Se pueden modificar la pregunta, la relevancia, la urgencia y las vías de resolución.
        La fecha de creación no es editable.
      </p>

      <div className="ekc-interp-form__row">
        <label className="ekc-interp-form__label">Pregunta</label>
        <textarea
          className="ekc-interp-form__textarea"
          value={draft.formulacion}
          onChange={e => onChange({ formulacion: e.target.value })}
          rows={2}
        />
      </div>

      <div className="ekc-interp-form__row">
        <label className="ekc-interp-form__label">Relevancia</label>
        <textarea
          className="ekc-interp-form__textarea"
          value={draft.relevancia}
          onChange={e => onChange({ relevancia: e.target.value })}
          rows={2}
        />
      </div>

      <div className="ekc-interp-form__row">
        <label className="ekc-interp-form__label">Urgencia</label>
        <select
          className="ekc-interp-form__select ekc-interp-form__select--sm"
          value={draft.urgencia}
          onChange={e => onChange({ urgencia: e.target.value as OpenQuestionUrgencia })}
        >
          <option value="alta">Alta</option>
          <option value="media">Media</option>
          <option value="baja">Baja</option>
        </select>
      </div>

      <div className="ekc-interp-form__row">
        <label className="ekc-interp-form__label">Vías de resolución (una por línea)</label>
        <textarea
          className="ekc-interp-form__textarea"
          value={draft.viasResolucion}
          onChange={e => onChange({ viasResolucion: e.target.value })}
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
