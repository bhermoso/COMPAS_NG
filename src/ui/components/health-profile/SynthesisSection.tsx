import { formatDate } from "./_shared";
import { SynthesisEditor } from "./SynthesisEditor";

interface SynthesisSectionProps {
  sintesisTexto?:   string;
  perfilUpdatedAt?: string;
  isEditing:        boolean;
  draft:            string;
  formError:        string | null;
  onOpenEdit:       () => void;
  onCancel:         () => void;
  onChange:         (text: string) => void;
  onSubmit:         () => void;
}

export function SynthesisSection({
  sintesisTexto, perfilUpdatedAt, isEditing,
  draft, formError, onOpenEdit, onCancel, onChange, onSubmit,
}: SynthesisSectionProps) {
  const hasSintesis = !!sintesisTexto;

  return (
    <div className="ekc-syn-section">
      <div className="ekc-interp-section__header">
        <p className="ekc-interp-section__label">Síntesis</p>
        {!isEditing && (
          <button className="ekc-q-add-btn" onClick={onOpenEdit}>
            {hasSintesis ? "Editar síntesis" : "Redactar síntesis"}
          </button>
        )}
      </div>

      {isEditing ? (
        <SynthesisEditor
          draft={draft}
          onChange={onChange}
          onSubmit={onSubmit}
          onCancel={onCancel}
          formError={formError}
        />
      ) : hasSintesis ? (
        <div className="ekc-syn-content">
          <p className="ekc-syn-text">{sintesisTexto}</p>
          {perfilUpdatedAt && (
            <p className="ekc-syn-meta">
              Última actualización del Perfil: {formatDate(perfilUpdatedAt)}
              <span className="ekc-syn-meta__note">
                {" "}(corresponde a la actualización más reciente del Perfil, no específicamente de la síntesis)
              </span>
            </p>
          )}
        </div>
      ) : (
        <p className="ekc-syn-empty">
          Sin síntesis disponible. El equipo técnico puede redactar la síntesis del
          conocimiento utilizando el botón superior.
        </p>
      )}
    </div>
  );
}
