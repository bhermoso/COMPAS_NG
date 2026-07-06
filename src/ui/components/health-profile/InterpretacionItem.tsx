import type { HealthProfileInterpretation } from "../../../domain/health-profile";
import type { InterpretacionFormDraft, EditFormDraft } from "./_shared";
import { SPACE_LABEL, CERTEZA_LABEL, formatDate } from "./_shared";
import { InterpretacionForm } from "./InterpretacionForm";
import { InterpretacionEditForm } from "./InterpretacionEditForm";

export interface InterpretacionItemProps {
  interp:            HealthProfileInterpretation;
  isEditing:         boolean;
  isSuperseding:     boolean;
  editDraft:         EditFormDraft | null;
  supersedeDraft:    InterpretacionFormDraft | null;
  onOpenEdit:        () => void;
  onOpenSupersede:   () => void;
  onCancelForm:      () => void;
  onChangeEdit:      (updates: Partial<EditFormDraft>) => void;
  onChangeSupersede: (updates: Partial<InterpretacionFormDraft>) => void;
  onSubmitEdit:      () => void;
  onSubmitSupersede: () => void;
  formError:         string | null;
}

export function InterpretacionItem({
  interp, isEditing, isSuperseding,
  editDraft, supersedeDraft,
  onOpenEdit, onOpenSupersede, onCancelForm,
  onChangeEdit, onChangeSupersede,
  onSubmitEdit, onSubmitSupersede,
  formError,
}: InterpretacionItemProps) {
  const isActiva = interp.status === "activa";

  return (
    <div className={`ekc-interp-item ekc-interp-item--${interp.status}`}>
      <div className="ekc-interp-item__header">
        <span className="ekc-interp-item__space">{SPACE_LABEL[interp.espacio]}</span>
        <span className="ekc-interp-item__certeza">{CERTEZA_LABEL[interp.certeza]}</span>
        <span className={`ekc-interp-item__badge ekc-interp-item__badge--${interp.status}`}>
          {isActiva ? "Activa" : "Superada"}
        </span>
      </div>

      <p className="ekc-interp-item__enunciado">{interp.enunciado}</p>

      {interp.razonamiento && (
        <p className="ekc-interp-item__razonamiento">{interp.razonamiento}</p>
      )}

      <div className="ekc-interp-item__footer">
        <span>{interp.autorNombre}</span>
        <span className="ekc-interp-item__sep">·</span>
        <span>{formatDate(interp.formuladaEn)}</span>
        <span className="ekc-interp-item__sep">·</span>
        <span>
          {interp.evidenciaIds.length}{" "}
          {interp.evidenciaIds.length === 1 ? "evidencia" : "evidencias"}
        </span>
        {!isActiva && (
          <>
            <span className="ekc-interp-item__sep">·</span>
            <span className="ekc-interp-item__superseded-note">Sustituida</span>
          </>
        )}
      </div>

      {isActiva && !isEditing && !isSuperseding && (
        <div className="ekc-interp-item__actions">
          <button className="ekc-interp-item__btn" onClick={onOpenEdit}>Editar</button>
          <button className="ekc-interp-item__btn" onClick={onOpenSupersede}>Nueva versión</button>
        </div>
      )}

      {isEditing && editDraft && (
        <InterpretacionEditForm
          draft={editDraft}
          onChange={onChangeEdit}
          onSubmit={onSubmitEdit}
          onCancel={onCancelForm}
          error={formError}
        />
      )}

      {isSuperseding && supersedeDraft && (
        <InterpretacionForm
          title="Nueva versión"
          noteText="Esta interpretación quedará marcada como superada y permanecerá visible para trazabilidad."
          draft={supersedeDraft}
          onChange={onChangeSupersede}
          onSubmit={onSubmitSupersede}
          onCancel={onCancelForm}
          submitLabel="Crear nueva versión"
          error={formError}
        />
      )}
    </div>
  );
}
