interface SynthesisEditorProps {
  draft:     string;
  onChange:  (text: string) => void;
  onSubmit:  () => void;
  onCancel:  () => void;
  formError: string | null;
}

export function SynthesisEditor({
  draft, onChange, onSubmit, onCancel, formError,
}: SynthesisEditorProps) {
  return (
    <div className="ekc-interp-form">
      <p className="ekc-interp-form__title">Síntesis del conocimiento</p>
      <p className="ekc-interp-form__note">
        La síntesis integra el estado actual del conocimiento territorial: interpretaciones
        consolidadas, hipótesis que permanecen abiertas, preguntas sin resolver e
        incertidumbres relevantes para el diagnóstico.
        Es una elaboración del equipo técnico — no un resumen automático del sistema.
      </p>

      <div className="ekc-interp-form__row">
        <textarea
          className="ekc-interp-form__textarea ekc-syn-textarea"
          value={draft}
          onChange={e => onChange(e.target.value)}
          rows={12}
          placeholder="Redacta aquí la síntesis del conocimiento disponible sobre el territorio…"
        />
      </div>

      {formError && <p className="ekc-interp-form__error">{formError}</p>}

      <div className="ekc-interp-form__actions">
        <button className="ekc-interp-form__submit" onClick={onSubmit}>Guardar síntesis</button>
        <button className="ekc-interp-form__cancel" onClick={onCancel}>Cancelar</button>
      </div>
    </div>
  );
}
