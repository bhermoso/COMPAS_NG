import type { ProfileSpace, InterpretationCerteza } from "../../../domain/health-profile";
import type { InterpretacionFormDraft } from "./_shared";
import { SPACE_OPTIONS } from "./_shared";

export interface InterpretacionFormProps {
  title:       string;
  noteText?:   string;
  draft:       InterpretacionFormDraft;
  onChange:    (updates: Partial<InterpretacionFormDraft>) => void;
  onSubmit:    () => void;
  onCancel:    () => void;
  submitLabel: string;
  error:       string | null;
}

export function InterpretacionForm({
  title, noteText, draft, onChange, onSubmit, onCancel, submitLabel, error,
}: InterpretacionFormProps) {
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
          placeholder="Afirmación técnica sobre el territorio…"
        />
      </div>

      <div className="ekc-interp-form__row ekc-interp-form__row--half">
        <div>
          <label className="ekc-interp-form__label">Certeza</label>
          <select
            className="ekc-interp-form__select"
            value={draft.certeza}
            onChange={e => onChange({ certeza: e.target.value as InterpretationCerteza })}
          >
            <option value="alta">Alta</option>
            <option value="moderada">Moderada</option>
            <option value="provisional">Provisional</option>
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
        <label className="ekc-interp-form__label">Razonamiento (opcional)</label>
        <textarea
          className="ekc-interp-form__textarea"
          value={draft.razonamiento}
          onChange={e => onChange({ razonamiento: e.target.value })}
          rows={2}
          placeholder="Explicación del razonamiento que sustenta esta interpretación…"
        />
      </div>

      <div className="ekc-interp-form__row">
        <label className="ekc-interp-form__label">IDs de evidencia (uno por línea)</label>
        <textarea
          className="ekc-interp-form__textarea ekc-interp-form__textarea--mono"
          value={draft.evidenciaIdsRaw}
          onChange={e => onChange({ evidenciaIdsRaw: e.target.value })}
          rows={3}
          placeholder={"atom-id-001\natom-id-002"}
        />
        <p className="ekc-interp-form__hint">
          Identificadores de los átomos de evidencia que sustentan esta interpretación.
        </p>
      </div>

      {error && <p className="ekc-interp-form__error">{error}</p>}

      <div className="ekc-interp-form__actions">
        <button className="ekc-interp-form__submit" onClick={onSubmit}>{submitLabel}</button>
        <button className="ekc-interp-form__cancel" onClick={onCancel}>Cancelar</button>
      </div>
    </div>
  );
}
