import type { HealthProfileHypothesis } from "../../../domain/health-profile";
import type { InterpretacionFormDraft, EditHipotesisFormDraft } from "./_shared";
import { SPACE_LABEL, PLAUSIBILIDAD_LABEL, formatDate } from "./_shared";
import { InterpretacionForm } from "./InterpretacionForm";
import { HipotesisEditForm } from "./HipotesisEditForm";
import { HipotesisDiscardForm } from "./HipotesisDiscardForm";

export interface HipotesisItemProps {
  hip:             HealthProfileHypothesis;
  isEditing:       boolean;
  isResolving:     boolean;
  isDiscarding:    boolean;
  editDraft:       EditHipotesisFormDraft | null;
  resolveDraft:    InterpretacionFormDraft | null;
  discardMotivo:   string;
  onOpenEdit:      () => void;
  onOpenResolve:   () => void;
  onOpenDiscard:   () => void;
  onCancelForm:    () => void;
  onChangeEdit:    (updates: Partial<EditHipotesisFormDraft>) => void;
  onChangeResolve: (updates: Partial<InterpretacionFormDraft>) => void;
  onChangeDiscard: (motivo: string) => void;
  onSubmitEdit:    () => void;
  onSubmitResolve: () => void;
  onSubmitDiscard: () => void;
  formError:       string | null;
}

export function HipotesisItem({
  hip, isEditing, isResolving, isDiscarding,
  editDraft, resolveDraft, discardMotivo,
  onOpenEdit, onOpenResolve, onOpenDiscard, onCancelForm,
  onChangeEdit, onChangeResolve, onChangeDiscard,
  onSubmitEdit, onSubmitResolve, onSubmitDiscard,
  formError,
}: HipotesisItemProps) {
  const isActiva = hip.status === "activa";
  const isResuelta = hip.status === "resuelta-como-interpretacion";
  const isDescartada = hip.status === "descartada";

  return (
    <div className={`ekc-hip-item ekc-hip-item--${hip.status}`}>
      <div className="ekc-hip-item__header">
        <span className="ekc-hip-item__space">{SPACE_LABEL[hip.espacio]}</span>
        <span className="ekc-hip-item__plausibilidad">{PLAUSIBILIDAD_LABEL[hip.plausibilidad]}</span>
        <span className={`ekc-hip-item__badge ekc-hip-item__badge--${hip.status}`}>
          {isActiva     ? "Activa"
           : isResuelta  ? "Resuelta como interpretación"
           :               "Descartada"}
        </span>
      </div>

      <p className="ekc-hip-item__enunciado">{hip.enunciado}</p>

      {hip.indicios.length > 0 && (
        <div className="ekc-hip-item__indicios">
          <span className="ekc-hip-item__indicios-label">Indicios</span>
          <ul className="ekc-hip-item__indicios-list">
            {hip.indicios.map((ind, i) => <li key={i}>{ind}</li>)}
          </ul>
        </div>
      )}

      {hip.preguntasResolutoras.length > 0 && (
        <div className="ekc-hip-item__preguntas">
          <span className="ekc-hip-item__indicios-label">Preguntas resolutoras</span>
          <ul className="ekc-hip-item__indicios-list">
            {hip.preguntasResolutoras.map((pq, i) => <li key={i}>{pq}</li>)}
          </ul>
        </div>
      )}

      {isDescartada && hip.discardedMotivo && (
        <p className="ekc-hip-item__discarded-motivo">
          <span className="ekc-hip-item__indicios-label">Motivo del descarte: </span>
          {hip.discardedMotivo}
        </p>
      )}

      <div className="ekc-hip-item__footer">
        <span>{hip.autorNombre}</span>
        <span className="ekc-interp-item__sep">·</span>
        <span>{formatDate(hip.formuladaEn)}</span>
        {hip.indicios.length > 0 && (
          <>
            <span className="ekc-interp-item__sep">·</span>
            <span>{hip.indicios.length} {hip.indicios.length === 1 ? "indicio" : "indicios"}</span>
          </>
        )}
        {isResuelta && (
          <>
            <span className="ekc-interp-item__sep">·</span>
            <span className="ekc-hip-item__resolved-note">Resuelta como interpretación</span>
          </>
        )}
      </div>

      {isActiva && !isEditing && !isResolving && !isDiscarding && (
        <div className="ekc-hip-item__actions">
          <button className="ekc-hip-item__btn" onClick={onOpenEdit}>Editar</button>
          <button className="ekc-hip-item__btn" onClick={onOpenResolve}>Resolver como interpretación</button>
          <button className="ekc-hip-item__btn ekc-hip-item__btn--discard" onClick={onOpenDiscard}>Descartar</button>
        </div>
      )}

      {isEditing && editDraft && (
        <HipotesisEditForm
          draft={editDraft}
          onChange={onChangeEdit}
          onSubmit={onSubmitEdit}
          onCancel={onCancelForm}
          error={formError}
        />
      )}

      {isResolving && resolveDraft && (
        <InterpretacionForm
          title="Resolver como interpretación"
          noteText="La hipótesis quedará marcada como resuelta. La interpretación resultante aparecerá en la sección de Interpretaciones."
          draft={resolveDraft}
          onChange={onChangeResolve}
          onSubmit={onSubmitResolve}
          onCancel={onCancelForm}
          submitLabel="Crear interpretación"
          error={formError}
        />
      )}

      {isDiscarding && (
        <HipotesisDiscardForm
          motivo={discardMotivo}
          onChange={onChangeDiscard}
          onSubmit={onSubmitDiscard}
          onCancel={onCancelForm}
          error={formError}
        />
      )}
    </div>
  );
}
