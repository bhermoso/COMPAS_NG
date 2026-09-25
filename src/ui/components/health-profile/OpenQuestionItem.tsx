import type { HealthProfileOpenQuestion } from "../../../domain/health-profile";
import type { EditOpenQuestionFormDraft } from "./_shared";
import { SPACE_LABEL, URGENCIA_LABEL, formatDate } from "./_shared";
import { OpenQuestionEditForm } from "./OpenQuestionEditForm";

export interface OpenQuestionItemProps {
  pq:              HealthProfileOpenQuestion;
  isEditing:       boolean;
  isResolving:     boolean;
  editDraft:       EditOpenQuestionFormDraft | null;
  resolveNota:     string;
  onOpenEdit:      () => void;
  onOpenResolve:   () => void;
  onCancelForm:    () => void;
  onChangeEdit:    (updates: Partial<EditOpenQuestionFormDraft>) => void;
  onChangeResolve: (nota: string) => void;
  onSubmitEdit:    () => void;
  onSubmitResolve: () => void;
  formError:       string | null;
}

export function OpenQuestionItem({
  pq, isEditing, isResolving,
  editDraft, resolveNota,
  onOpenEdit, onOpenResolve, onCancelForm,
  onChangeEdit, onChangeResolve,
  onSubmitEdit, onSubmitResolve,
  formError,
}: OpenQuestionItemProps) {
  const isAbierta  = pq.status === "abierta";
  const isResuelta = pq.status === "resuelta";

  return (
    <div className={`ekc-q-item ekc-q-item--${pq.status} ekc-q-item--urgencia-${pq.urgencia}`}>
      <div className="ekc-q-item__header">
        <span className="ekc-q-item__space">{SPACE_LABEL[pq.espacio]}</span>
        <span className={`ekc-q-item__urgencia ekc-q-item__urgencia--${pq.urgencia}`}>
          {URGENCIA_LABEL[pq.urgencia]}
        </span>
        <span className={`ekc-q-item__badge ekc-q-item__badge--${pq.status}`}>
          {isAbierta ? "Abierta" : "Resuelta"}
        </span>
      </div>

      <p className="ekc-q-item__formulacion">{pq.formulacion}</p>

      {pq.relevancia && (
        <p className="ekc-q-item__relevancia">{pq.relevancia}</p>
      )}

      {pq.viasResolucion.length > 0 && (
        <div className="ekc-q-item__vias">
          <span className="ekc-q-item__section-label">Vías de resolución</span>
          <ul className="ekc-q-item__vias-list">
            {pq.viasResolucion.map((v, i) => <li key={i}>{v}</li>)}
          </ul>
        </div>
      )}

      {isResuelta && pq.resolucionNota && (
        <div className="ekc-q-item__resolucion">
          <span className="ekc-q-item__section-label">Resolución</span>
          <p className="ekc-q-item__resolucion-nota">{pq.resolucionNota}</p>
        </div>
      )}

      <div className="ekc-q-item__footer">
        <span>{formatDate(pq.creadaEn)}</span>
      </div>

      {isAbierta && !isEditing && !isResolving && (
        <div className="ekc-q-item__actions">
          <button className="ekc-q-item__btn" onClick={onOpenEdit}>Editar</button>
          <button className="ekc-q-item__btn" onClick={onOpenResolve}>Marcar como resuelta</button>
        </div>
      )}

      {isEditing && editDraft && (
        <OpenQuestionEditForm
          draft={editDraft}
          onChange={onChangeEdit}
          onSubmit={onSubmitEdit}
          onCancel={onCancelForm}
          error={formError}
        />
      )}

      {isResolving && (
        <div className="ekc-interp-form ekc-interp-form--inline">
          <p className="ekc-interp-form__title">Marcar como resuelta</p>
          <p className="ekc-interp-form__note">
            La pregunta permanecerá visible con estado "Resuelta" y la nota de resolución.
          </p>
          <div className="ekc-interp-form__row">
            <label className="ekc-interp-form__label">Nota de resolución</label>
            <textarea
              className="ekc-interp-form__textarea"
              value={resolveNota}
              onChange={e => onChangeResolve(e.target.value)}
              rows={2}
              placeholder="¿Cómo se resolvió esta pregunta? ¿Qué evidencia la cerró?"
            />
          </div>
          {formError && <p className="ekc-interp-form__error">{formError}</p>}
          <div className="ekc-interp-form__actions">
            <button
              className="ekc-interp-form__submit"
              onClick={onSubmitResolve}
              disabled={!resolveNota.trim()}
            >
              Marcar como resuelta
            </button>
            <button className="ekc-interp-form__cancel" onClick={onCancelForm}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
}
