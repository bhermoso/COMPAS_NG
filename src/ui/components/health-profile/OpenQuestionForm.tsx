import type { ProfileSpace } from "../../../domain/health-profile";
import type { OpenQuestionUrgencia } from "../../../domain/health-profile";
import type { OpenQuestionFormDraft } from "./_shared";
import { SPACE_OPTIONS } from "./_shared";

export interface OpenQuestionFormProps {
  title:       string;
  noteText?:   string;
  draft:       OpenQuestionFormDraft;
  onChange:    (updates: Partial<OpenQuestionFormDraft>) => void;
  onSubmit:    () => void;
  onCancel:    () => void;
  submitLabel: string;
  error:       string | null;
}

export function OpenQuestionForm({
  title, noteText, draft, onChange, onSubmit, onCancel, submitLabel, error,
}: OpenQuestionFormProps) {
  return (
    <div className="ekc-interp-form">
      <p className="ekc-interp-form__title">{title}</p>
      {noteText && <p className="ekc-interp-form__note">{noteText}</p>}

      <div className="ekc-interp-form__row">
        <label className="ekc-interp-form__label">Espacio funcional</label>
        <select
          className="ekc-interp-form__select"
          value={draft.espacio}
          onChange={e => onChange({ espacio: e.target.value as ProfileSpace })}
        >
          {SPACE_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      <div className="ekc-interp-form__row">
        <label className="ekc-interp-form__label">Pregunta</label>
        <textarea
          className="ekc-interp-form__textarea"
          value={draft.formulacion}
          onChange={e => onChange({ formulacion: e.target.value })}
          rows={2}
          placeholder="¿Qué necesita saberse sobre este territorio?"
        />
      </div>

      <div className="ekc-interp-form__row">
        <label className="ekc-interp-form__label">Relevancia</label>
        <textarea
          className="ekc-interp-form__textarea"
          value={draft.relevancia}
          onChange={e => onChange({ relevancia: e.target.value })}
          rows={2}
          placeholder="¿Por qué importa responder esta pregunta para el diagnóstico?"
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
          placeholder={"¿Cómo podría responderse?\nEncuesta, análisis de registros, consulta…"}
        />
      </div>

      {error && <p className="ekc-interp-form__error">{error}</p>}

      <div className="ekc-interp-form__actions">
        <button className="ekc-interp-form__submit" onClick={onSubmit}>{submitLabel}</button>
        <button className="ekc-interp-form__cancel" onClick={onCancel}>Cancelar</button>
      </div>
    </div>
  );
}
