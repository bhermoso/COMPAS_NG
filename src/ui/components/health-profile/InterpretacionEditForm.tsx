import type { InterpretationCerteza } from "../../../domain/health-profile";
import type { EditFormDraft } from "./_shared";

export interface InterpretacionEditFormProps {
  draft:    EditFormDraft;
  onChange: (updates: Partial<EditFormDraft>) => void;
  onSubmit: () => void;
  onCancel: () => void;
  error:    string | null;
}

export function InterpretacionEditForm({
  draft, onChange, onSubmit, onCancel, error,
}: InterpretacionEditFormProps) {
  return (
    <div className="ekc-interp-form ekc-interp-form--inline">
      <p className="ekc-interp-form__title">Editar interpretación</p>
      <p className="ekc-interp-form__note">
        Solo se pueden modificar la certeza, el razonamiento y las evidencias referenciadas.
        Para revisar el enunciado usa "Nueva versión".
      </p>

      <div className="ekc-interp-form__row">
        <label className="ekc-interp-form__label">Certeza</label>
        <select
          className="ekc-interp-form__select ekc-interp-form__select--sm"
          value={draft.certeza}
          onChange={e => onChange({ certeza: e.target.value as InterpretationCerteza })}
        >
          <option value="alta">Alta</option>
          <option value="moderada">Moderada</option>
          <option value="provisional">Provisional</option>
        </select>
      </div>

      <div className="ekc-interp-form__row">
        <label className="ekc-interp-form__label">Razonamiento (opcional)</label>
        <textarea
          className="ekc-interp-form__textarea"
          value={draft.razonamiento}
          onChange={e => onChange({ razonamiento: e.target.value })}
          rows={2}
        />
      </div>

      <div className="ekc-interp-form__row">
        <label className="ekc-interp-form__label">IDs de evidencia (uno por línea)</label>
        <textarea
          className="ekc-interp-form__textarea ekc-interp-form__textarea--mono"
          value={draft.evidenciaIdsRaw}
          onChange={e => onChange({ evidenciaIdsRaw: e.target.value })}
          rows={3}
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
