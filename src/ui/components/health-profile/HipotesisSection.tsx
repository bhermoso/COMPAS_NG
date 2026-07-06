import type { HealthProfileHypothesis } from "../../../domain/health-profile";
import type {
  ActiveForm,
  HipotesisFormDraft,
  EditHipotesisFormDraft,
  InterpretacionFormDraft,
} from "./_shared";
import { HipotesisForm } from "./HipotesisForm";
import { HipotesisItem } from "./HipotesisItem";

export interface HipotesisSectionProps {
  hipotesis:         HealthProfileHypothesis[];
  activeForm:        ActiveForm;
  createDraft:       HipotesisFormDraft;
  editDraft:         EditHipotesisFormDraft | null;
  resolveDraft:      InterpretacionFormDraft | null;
  discardMotivo:     string;
  formError:         string | null;
  onOpenCreate:      () => void;
  onCancelForm:      () => void;
  onChangeCreate:    (updates: Partial<HipotesisFormDraft>) => void;
  onChangeEdit:      (updates: Partial<EditHipotesisFormDraft>) => void;
  onChangeResolve:   (updates: Partial<InterpretacionFormDraft>) => void;
  onChangeDiscard:   (motivo: string) => void;
  onSubmitCreate:    () => void;
  onOpenEdit:        (hip: HealthProfileHypothesis) => void;
  onOpenResolve:     (hip: HealthProfileHypothesis) => void;
  onOpenDiscard:     (hip: HealthProfileHypothesis) => void;
  onSubmitEdit:      (id: string) => void;
  onSubmitResolve:   (id: string) => void;
  onSubmitDiscard:   (id: string) => void;
}

export function HipotesisSection({
  hipotesis, activeForm,
  createDraft, editDraft, resolveDraft, discardMotivo, formError,
  onOpenCreate, onCancelForm,
  onChangeCreate, onChangeEdit, onChangeResolve, onChangeDiscard,
  onSubmitCreate, onOpenEdit, onOpenResolve, onOpenDiscard,
  onSubmitEdit, onSubmitResolve, onSubmitDiscard,
}: HipotesisSectionProps) {
  return (
    <div className="ekc-hip-section">
      <div className="ekc-interp-section__header">
        <p className="ekc-interp-section__label">Hipótesis</p>
        {activeForm?.type !== "create-hip" && (
          <button className="ekc-hip-add-btn" onClick={onOpenCreate}>
            + Nueva hipótesis
          </button>
        )}
      </div>

      {activeForm?.type === "create-hip" && (
        <HipotesisForm
          title="Nueva hipótesis"
          draft={createDraft}
          onChange={onChangeCreate}
          onSubmit={onSubmitCreate}
          onCancel={onCancelForm}
          submitLabel="Añadir hipótesis"
          error={formError}
        />
      )}

      {hipotesis.length === 0 ? (
        <p className="ekc-hip-empty">
          Sin hipótesis registradas. El equipo técnico puede añadir la primera
          utilizando el botón superior.
        </p>
      ) : (
        <div className="ekc-hip-list">
          {hipotesis.map(hip => {
            const isEditing    = activeForm?.type === "edit-hip"    && activeForm.id === hip.id;
            const isResolving  = activeForm?.type === "resolve-hip" && activeForm.id === hip.id;
            const isDiscarding = activeForm?.type === "discard-hip" && activeForm.id === hip.id;
            return (
              <HipotesisItem
                key={hip.id}
                hip={hip}
                isEditing={isEditing}
                isResolving={isResolving}
                isDiscarding={isDiscarding}
                editDraft={isEditing ? editDraft : null}
                resolveDraft={isResolving ? resolveDraft : null}
                discardMotivo={isDiscarding ? discardMotivo : ""}
                onOpenEdit={() => onOpenEdit(hip)}
                onOpenResolve={() => onOpenResolve(hip)}
                onOpenDiscard={() => onOpenDiscard(hip)}
                onCancelForm={onCancelForm}
                onChangeEdit={onChangeEdit}
                onChangeResolve={onChangeResolve}
                onChangeDiscard={onChangeDiscard}
                onSubmitEdit={() => onSubmitEdit(hip.id)}
                onSubmitResolve={() => onSubmitResolve(hip.id)}
                onSubmitDiscard={() => onSubmitDiscard(hip.id)}
                formError={
                  activeForm?.type !== "create-hip" &&
                  activeForm?.type !== "create" &&
                  activeForm?.type !== "edit" &&
                  activeForm?.type !== "supersede"
                    ? formError : null
                }
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
