import type { HealthProfileOpenQuestion } from "../../../domain/health-profile";
import type {
  ActiveForm,
  OpenQuestionFormDraft,
  EditOpenQuestionFormDraft,
} from "./_shared";
import { OpenQuestionForm } from "./OpenQuestionForm";
import { OpenQuestionItem } from "./OpenQuestionItem";

export interface OpenQuestionSectionProps {
  preguntasAbiertas: HealthProfileOpenQuestion[];
  activeForm:        ActiveForm;
  createDraft:       OpenQuestionFormDraft;
  editDraft:         EditOpenQuestionFormDraft | null;
  resolveNota:       string;
  formError:         string | null;
  onOpenCreate:      () => void;
  onCancelForm:      () => void;
  onChangeCreate:    (updates: Partial<OpenQuestionFormDraft>) => void;
  onChangeEdit:      (updates: Partial<EditOpenQuestionFormDraft>) => void;
  onChangeResolve:   (nota: string) => void;
  onSubmitCreate:    () => void;
  onOpenEdit:        (pq: HealthProfileOpenQuestion) => void;
  onOpenResolve:     (pq: HealthProfileOpenQuestion) => void;
  onSubmitEdit:      (id: string) => void;
  onSubmitResolve:   (id: string) => void;
}

export function OpenQuestionSection({
  preguntasAbiertas, activeForm,
  createDraft, editDraft, resolveNota, formError,
  onOpenCreate, onCancelForm,
  onChangeCreate, onChangeEdit, onChangeResolve,
  onSubmitCreate, onOpenEdit, onOpenResolve,
  onSubmitEdit, onSubmitResolve,
}: OpenQuestionSectionProps) {
  return (
    <div className="ekc-q-section">
      <div className="ekc-interp-section__header">
        <p className="ekc-interp-section__label">Preguntas abiertas</p>
        {activeForm?.type !== "create-q" && (
          <button className="ekc-q-add-btn" onClick={onOpenCreate}>
            + Añadir pregunta abierta
          </button>
        )}
      </div>

      {activeForm?.type === "create-q" && (
        <OpenQuestionForm
          title="Nueva pregunta abierta"
          draft={createDraft}
          onChange={onChangeCreate}
          onSubmit={onSubmitCreate}
          onCancel={onCancelForm}
          submitLabel="Añadir pregunta"
          error={formError}
        />
      )}

      {preguntasAbiertas.length === 0 ? (
        <p className="ekc-q-empty">
          Sin preguntas abiertas registradas. El equipo técnico puede añadir la primera
          utilizando el botón superior.
        </p>
      ) : (
        <div className="ekc-q-list">
          {preguntasAbiertas.map(pq => {
            const isEditing   = activeForm?.type === "edit-q"    && activeForm.id === pq.id;
            const isResolving = activeForm?.type === "resolve-q" && activeForm.id === pq.id;
            return (
              <OpenQuestionItem
                key={pq.id}
                pq={pq}
                isEditing={isEditing}
                isResolving={isResolving}
                editDraft={isEditing ? editDraft : null}
                resolveNota={isResolving ? resolveNota : ""}
                onOpenEdit={() => onOpenEdit(pq)}
                onOpenResolve={() => onOpenResolve(pq)}
                onCancelForm={onCancelForm}
                onChangeEdit={onChangeEdit}
                onChangeResolve={onChangeResolve}
                onSubmitEdit={() => onSubmitEdit(pq.id)}
                onSubmitResolve={() => onSubmitResolve(pq.id)}
                formError={(isEditing || isResolving) ? formError : null}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
