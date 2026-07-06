export interface HipotesisDiscardFormProps {
  motivo:   string;
  onChange: (motivo: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  error:    string | null;
}

export function HipotesisDiscardForm({
  motivo, onChange, onSubmit, onCancel, error,
}: HipotesisDiscardFormProps) {
  return (
    <div className="ekc-interp-form ekc-interp-form--inline">
      <p className="ekc-interp-form__title">Descartar hipótesis</p>
      <p className="ekc-interp-form__note">
        La hipótesis permanecerá visible con estado "descartada" y el motivo del
        descarte. Esto documenta el razonamiento del equipo técnico.
      </p>

      <div className="ekc-interp-form__row">
        <label className="ekc-interp-form__label">Motivo del descarte</label>
        <textarea
          className="ekc-interp-form__textarea"
          value={motivo}
          onChange={e => onChange(e.target.value)}
          rows={2}
          placeholder="¿Por qué se descarta esta hipótesis?"
        />
      </div>

      {error && <p className="ekc-interp-form__error">{error}</p>}

      <div className="ekc-interp-form__actions">
        <button
          className="ekc-interp-form__submit"
          onClick={onSubmit}
          disabled={!motivo.trim()}
        >
          Descartar hipótesis
        </button>
        <button className="ekc-interp-form__cancel" onClick={onCancel}>Cancelar</button>
      </div>
    </div>
  );
}
