import { useMemo, useState } from "react";
import type { PerfilLocalDeSalud, HealthProfileInterpretation, HealthProfileHypothesis } from "../../../domain/health-profile";
import {
  computeEstadoDelConocimiento,
  createPerfilLocalDeSalud,
  addInterpretation,
  updateInterpretation,
  supersedeInterpretation,
  addHypothesis,
  updateHypothesis,
  resolveHypothesisAsInterpretation,
  discardHypothesis,
  type AddInterpretationInput,
  type UpdateInterpretationInput,
  type AddHypothesisInput,
  type UpdateHypothesisInput,
} from "../../../application/health-profile";
import {
  INIT_FORM_DRAFT,
  INIT_HIPOTESIS_FORM_DRAFT,
  parseEvidenciaIds,
  parseTextLines,
  type ActiveForm,
  type InterpretacionFormDraft,
  type EditFormDraft,
  type HipotesisFormDraft,
  type EditHipotesisFormDraft,
} from "./_shared";
import { EstadoConocimientoView } from "./EstadoConocimientoView";
import { InterpretacionesSection } from "./InterpretacionesSection";
import { HipotesisSection } from "./HipotesisSection";

// ── Props ─────────────────────────────────────────────────────────────────────

export interface PerfilLocalDeSaludPanelProps {
  perfil?:          PerfilLocalDeSalud;
  municipalityId:   string;
  municipalityName: string;
  onUpdatePerfil:   (perfil: PerfilLocalDeSalud) => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function PerfilLocalDeSaludPanel({
  perfil,
  municipalityId,
  municipalityName,
  onUpdatePerfil,
}: PerfilLocalDeSaludPanelProps) {

  const estado = useMemo(
    () => (perfil ? computeEstadoDelConocimiento(perfil) : null),
    [perfil]
  );

  // ── Form state ──────────────────────────────────────────────────────────────
  const [activeForm,      setActiveForm]      = useState<ActiveForm>(null);
  const [formError,       setFormError]       = useState<string | null>(null);

  // Interpretation drafts
  const [createDraft,    setCreateDraft]    = useState<InterpretacionFormDraft>(INIT_FORM_DRAFT);
  const [editDraft,      setEditDraft]      = useState<EditFormDraft | null>(null);
  const [supersedeDraft, setSupersedeDraft] = useState<InterpretacionFormDraft | null>(null);

  // Hypothesis drafts
  const [createHipDraft,  setCreateHipDraft]  = useState<HipotesisFormDraft>(INIT_HIPOTESIS_FORM_DRAFT);
  const [editHipDraft,    setEditHipDraft]    = useState<EditHipotesisFormDraft | null>(null);
  const [resolveHipDraft, setResolveHipDraft] = useState<InterpretacionFormDraft | null>(null);
  const [discardMotivo,   setDiscardMotivo]   = useState<string>("");

  // ── Shared cancel ──────────────────────────────────────────────────────────
  const handleCancelForm = () => { setActiveForm(null); setFormError(null); };

  // ── Interpretation handlers ─────────────────────────────────────────────────

  const handleOpenCreate = () => {
    setActiveForm({ type: "create" });
    setCreateDraft(INIT_FORM_DRAFT);
    setFormError(null);
  };

  const handleSubmitCreate = () => {
    try {
      const base = perfil ?? createPerfilLocalDeSalud(municipalityId);
      const input: AddInterpretationInput = {
        espacio:      createDraft.espacio,
        enunciado:    createDraft.enunciado,
        certeza:      createDraft.certeza,
        evidenciaIds: parseEvidenciaIds(createDraft.evidenciaIdsRaw),
        autorNombre:  createDraft.autorNombre,
        ...(createDraft.razonamiento.trim() && { razonamiento: createDraft.razonamiento.trim() }),
      };
      onUpdatePerfil(addInterpretation(base, input));
      setActiveForm(null); setCreateDraft(INIT_FORM_DRAFT); setFormError(null);
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "Error al añadir la interpretación.");
    }
  };

  const handleOpenEdit = (interp: HealthProfileInterpretation) => {
    setActiveForm({ type: "edit", id: interp.id });
    setEditDraft({ certeza: interp.certeza, razonamiento: interp.razonamiento ?? "", evidenciaIdsRaw: interp.evidenciaIds.join("\n") });
    setFormError(null);
  };

  const handleSubmitEdit = (id: string) => {
    if (!perfil || !editDraft) return;
    try {
      const changes: UpdateInterpretationInput = { certeza: editDraft.certeza, razonamiento: editDraft.razonamiento, evidenciaIds: parseEvidenciaIds(editDraft.evidenciaIdsRaw) };
      onUpdatePerfil(updateInterpretation(perfil, id, changes));
      setActiveForm(null); setEditDraft(null); setFormError(null);
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "Error al actualizar la interpretación.");
    }
  };

  const handleOpenSupersede = (interp: HealthProfileInterpretation) => {
    setActiveForm({ type: "supersede", id: interp.id });
    setSupersedeDraft({ ...INIT_FORM_DRAFT, espacio: interp.espacio, certeza: interp.certeza, autorNombre: interp.autorNombre, evidenciaIdsRaw: interp.evidenciaIds.join("\n") });
    setFormError(null);
  };

  const handleSubmitSupersede = (id: string) => {
    if (!perfil || !supersedeDraft) return;
    try {
      const input: AddInterpretationInput = {
        espacio: supersedeDraft.espacio, enunciado: supersedeDraft.enunciado, certeza: supersedeDraft.certeza,
        evidenciaIds: parseEvidenciaIds(supersedeDraft.evidenciaIdsRaw), autorNombre: supersedeDraft.autorNombre,
        ...(supersedeDraft.razonamiento.trim() && { razonamiento: supersedeDraft.razonamiento.trim() }),
      };
      onUpdatePerfil(supersedeInterpretation(perfil, id, input));
      setActiveForm(null); setSupersedeDraft(null); setFormError(null);
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "Error al sustituir la interpretación.");
    }
  };

  // ── Hypothesis handlers ─────────────────────────────────────────────────────

  const handleOpenCreateHip = () => {
    setActiveForm({ type: "create-hip" });
    setCreateHipDraft(INIT_HIPOTESIS_FORM_DRAFT);
    setFormError(null);
  };

  const handleSubmitCreateHip = () => {
    try {
      const base = perfil ?? createPerfilLocalDeSalud(municipalityId);
      const input: AddHypothesisInput = {
        espacio:              createHipDraft.espacio,
        enunciado:            createHipDraft.enunciado,
        plausibilidad:        createHipDraft.plausibilidad,
        indicios:             parseTextLines(createHipDraft.indicios),
        preguntasResolutoras: parseTextLines(createHipDraft.preguntasResolutoras),
        autorNombre:          createHipDraft.autorNombre,
      };
      onUpdatePerfil(addHypothesis(base, input));
      setActiveForm(null); setCreateHipDraft(INIT_HIPOTESIS_FORM_DRAFT); setFormError(null);
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "Error al añadir la hipótesis.");
    }
  };

  const handleOpenEditHip = (hip: HealthProfileHypothesis) => {
    setActiveForm({ type: "edit-hip", id: hip.id });
    setEditHipDraft({ enunciado: hip.enunciado, plausibilidad: hip.plausibilidad, indicios: hip.indicios.join("\n"), preguntasResolutoras: hip.preguntasResolutoras.join("\n") });
    setFormError(null);
  };

  const handleSubmitEditHip = (id: string) => {
    if (!perfil || !editHipDraft) return;
    try {
      const changes: UpdateHypothesisInput = {
        enunciado:            editHipDraft.enunciado,
        plausibilidad:        editHipDraft.plausibilidad,
        indicios:             parseTextLines(editHipDraft.indicios),
        preguntasResolutoras: parseTextLines(editHipDraft.preguntasResolutoras),
      };
      onUpdatePerfil(updateHypothesis(perfil, id, changes));
      setActiveForm(null); setEditHipDraft(null); setFormError(null);
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "Error al actualizar la hipótesis.");
    }
  };

  const handleOpenResolveHip = (hip: HealthProfileHypothesis) => {
    setActiveForm({ type: "resolve-hip", id: hip.id });
    setResolveHipDraft({ ...INIT_FORM_DRAFT, espacio: hip.espacio, autorNombre: hip.autorNombre });
    setFormError(null);
  };

  const handleSubmitResolveHip = (id: string) => {
    if (!perfil || !resolveHipDraft) return;
    try {
      const input: AddInterpretationInput = {
        espacio: resolveHipDraft.espacio, enunciado: resolveHipDraft.enunciado, certeza: resolveHipDraft.certeza,
        evidenciaIds: parseEvidenciaIds(resolveHipDraft.evidenciaIdsRaw), autorNombre: resolveHipDraft.autorNombre,
        ...(resolveHipDraft.razonamiento.trim() && { razonamiento: resolveHipDraft.razonamiento.trim() }),
      };
      onUpdatePerfil(resolveHypothesisAsInterpretation(perfil, id, input));
      setActiveForm(null); setResolveHipDraft(null); setFormError(null);
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "Error al resolver la hipótesis.");
    }
  };

  const handleOpenDiscardHip = (hip: HealthProfileHypothesis) => {
    setActiveForm({ type: "discard-hip", id: hip.id });
    setDiscardMotivo("");
    setFormError(null);
  };

  const handleSubmitDiscardHip = (id: string) => {
    if (!perfil) return;
    try {
      onUpdatePerfil(discardHypothesis(perfil, id, discardMotivo.trim()));
      setActiveForm(null); setDiscardMotivo(""); setFormError(null);
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "Error al descartar la hipótesis.");
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <section className="workspace-panel ekc-panel">
      <p className="eyebrow">Espacio interpretativo · {municipalityName}</p>
      <h2 className="ekc-panel__title">Perfil Local de Salud</h2>

      <InterpretacionesSection
        interpretaciones={perfil?.interpretaciones ?? []}
        activeForm={activeForm}
        createDraft={createDraft}
        editDraft={editDraft}
        supersedeDraft={supersedeDraft}
        formError={formError}
        onOpenCreate={handleOpenCreate}
        onCancelForm={handleCancelForm}
        onChangeCreate={updates => setCreateDraft(prev => ({ ...prev, ...updates }))}
        onChangeEdit={updates => setEditDraft(prev => prev ? { ...prev, ...updates } : null)}
        onChangeSupersede={updates => setSupersedeDraft(prev => prev ? { ...prev, ...updates } : null)}
        onSubmitCreate={handleSubmitCreate}
        onOpenEdit={handleOpenEdit}
        onOpenSupersede={handleOpenSupersede}
        onSubmitEdit={handleSubmitEdit}
        onSubmitSupersede={handleSubmitSupersede}
      />

      <hr className="ekc-section-divider" />

      <HipotesisSection
        hipotesis={perfil?.hipotesis ?? []}
        activeForm={activeForm}
        createDraft={createHipDraft}
        editDraft={editHipDraft}
        resolveDraft={resolveHipDraft}
        discardMotivo={discardMotivo}
        formError={formError}
        onOpenCreate={handleOpenCreateHip}
        onCancelForm={handleCancelForm}
        onChangeCreate={updates => setCreateHipDraft(prev => ({ ...prev, ...updates }))}
        onChangeEdit={updates => setEditHipDraft(prev => prev ? { ...prev, ...updates } : null)}
        onChangeResolve={updates => setResolveHipDraft(prev => prev ? { ...prev, ...updates } : null)}
        onChangeDiscard={setDiscardMotivo}
        onSubmitCreate={handleSubmitCreateHip}
        onOpenEdit={handleOpenEditHip}
        onOpenResolve={handleOpenResolveHip}
        onOpenDiscard={handleOpenDiscardHip}
        onSubmitEdit={handleSubmitEditHip}
        onSubmitResolve={handleSubmitResolveHip}
        onSubmitDiscard={handleSubmitDiscardHip}
      />

      {estado && <EstadoConocimientoView estado={estado} />}
    </section>
  );
}
