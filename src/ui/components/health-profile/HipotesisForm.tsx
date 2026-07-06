import type { ProfileSpace } from "../../../domain/health-profile";
import type { HypothesisPlausibilidad } from "../../../domain/health-profile";
import type { HipotesisFormDraft } from "./_shared";
import { SPACE_OPTIONS } from "./_shared";

export interface HipotesisFormProps {
  title:       string;
  noteText?:   string;
  draft:       HipotesisFormDraft;
  onChange:    (updates: Partial<HipotesisFormDraft>) => void;
  onSubmit:    () => void;
  onCancel:    () => void;
  submitLabel: string;
  error:       string | null;
}

export function HipotesisForm({
  title, noteText, draft, onChange, onSubmit, onCancel, submitLabel, error,
}: HipotesisFormProps) {
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
        <label className="ekc-interp-form__label">Enunciado</label>
        <textarea
          className="ekc-interp-form__textarea"
          value={draft.enunciado}
          onChange={e => onChange({ enunciado: e.target.value })}
          rows={3}
          placeholder="Afirmación provisional sobre el territorio…"
        />
      </div>

      <div className="ekc-interp-form__row ekc-interp-form__row--half">
        <div>
          <label className="ekc-interp-form__label">Plausibilidad</label>
          <select
            className="ekc-interp-form__select"
            value={draft.plausibilidad}
            onChange={e => onChange({ plausibilidad: e.target.value as HypothesisPlausibilidad })}
          >
            <option value="alta">Alta</option>
            <option value="moderada">Moderada</option>
            <option value="especulativa">Especulativa</option>
          </select>
        </div>
        <div>
          <label className="ekc-interp-form__label">Autor / Equipo técnico</label>
          <input
            className="ekc-interp-form__input"
            type="text"
            value={draft.autorNombre}
            onChange={e => onChange({ autorNombre: e.target.value })}
            placeholder="Nombre del técnico o equipo"
          />
        </div>
      </div>

      <div className="ekc-interp-form__row">
        <label className="ekc-interp-form__label">Indicios (uno por línea)</label>
        <textarea
          className="ekc-interp-form__textarea"
          value={draft.indicios}
          onChange={e => onChange({ indicios: e.target.value })}
          rows={3}
          placeholder={"Señal o indicio que hace plausible esta hipótesis…\nOtro indicio…"}
        />
        <p className="ekc-interp-form__hint">
          Texto libre. No son IDs de evidencia: describe lo que la sugiere sin confirmarla.
        </p>
      </div>

      <div className="ekc-interp-form__row">
        <label className="ekc-interp-form__label">Preguntas resolutoras (una por línea)</label>
        <textarea
          className="ekc-interp-form__textarea"
          value={draft.preguntasResolutoras}
          onChange={e => onChange({ preguntasResolutoras: e.target.value })}
          rows={2}
          placeholder={"¿Qué información confirmaría esta hipótesis?\n¿Qué datos faltan?"}
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
