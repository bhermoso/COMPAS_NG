import type { HealthProfileInterpretation } from "../../../domain/health-profile";
import type { ActiveForm, InterpretacionFormDraft, EditFormDraft } from "./_shared";
import { InterpretacionForm } from "./InterpretacionForm";
import { InterpretacionItem } from "./InterpretacionItem";

export interface InterpretacionesSectionProps {
  interpretaciones:  HealthProfileInterpretation[];
  activeForm:        ActiveForm;
  createDraft:       InterpretacionFormDraft;
  editDraft:         EditFormDraft | null;
  supersedeDraft:    InterpretacionFormDraft | null;
  formError:         string | null;
  onOpenCreate:      () => void;
  onCancelForm:      () => void;
  onChangeCreate:    (updates: Partial<InterpretacionFormDraft>) => void;
  onChangeEdit:      (updates: Partial<EditFormDraft>) => void;
  onChangeSupersede: (updates: Partial<InterpretacionFormDraft>) => void;
  onSubmitCreate:    () => void;
  onOpenEdit:        (interp: HealthProfileInterpretation) => void;
  onOpenSupersede:   (interp: HealthProfileInterpretation) => void;
  onSubmitEdit:      (id: string) => void;
  onSubmitSupersede: (id: string) => void;
}

export function InterpretacionesSection({
  interpretaciones, activeForm,
  createDraft, editDraft, supersedeDraft, formError,
  onOpenCreate, onCancelForm,
  onChangeCreate, onChangeEdit, onChangeSupersede,
  onSubmitCreate, onOpenEdit, onOpenSupersede, onSubmitEdit, onSubmitSupersede,
}: InterpretacionesSectionProps) {
  return (
    <div className="ekc-interp-section">
      <div className="ekc-interp-section__header">
        <p className="ekc-interp-section__label">Interpretaciones</p>
        {activeForm?.type !== "create" && (
          <button className="ekc-interp-add-btn" onClick={onOpenCreate}>
            + Añadir interpretación técnica
          </button>
        )}
      </div>

      {activeForm?.type === "create" && (
        <InterpretacionForm
          title="Nueva interpretación"
          draft={createDraft}
          onChange={onChangeCreate}
          onSubmit={onSubmitCreate}
          onCancel={onCancelForm}
          submitLabel="Añadir interpretación"
          error={formError}
        />
      )}

      {interpretaciones.length === 0 ? (
        <p className="ekc-interp-empty">
          Sin interpretaciones registradas. El equipo técnico puede añadir la primera
          utilizando el botón superior.
        </p>
      ) : (
        <div className="ekc-interp-list">
          {interpretaciones.map(interp => {
            const isEditing     = activeForm?.type === "edit"      && activeForm.id === interp.id;
            const isSuperseding = activeForm?.type === "supersede" && activeForm.id === interp.id;
            return (
              <InterpretacionItem
                key={interp.id}
                interp={interp}
                isEditing={isEditing}
                isSuperseding={isSuperseding}
                editDraft={isEditing ? editDraft : null}
                supersedeDraft={isSuperseding ? supersedeDraft : null}
                onOpenEdit={() => onOpenEdit(interp)}
                onOpenSupersede={() => onOpenSupersede(interp)}
                onCancelForm={onCancelForm}
                onChangeEdit={onChangeEdit}
                onChangeSupersede={onChangeSupersede}
                onSubmitEdit={() => onSubmitEdit(interp.id)}
                onSubmitSupersede={() => onSubmitSupersede(interp.id)}
                formError={activeForm?.type !== "create" ? formError : null}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
