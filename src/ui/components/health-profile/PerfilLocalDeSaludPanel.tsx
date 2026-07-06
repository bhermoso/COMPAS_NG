import { useMemo, useState } from "react";
import type { PerfilLocalDeSalud, HealthProfileInterpretation } from "../../../domain/health-profile";
import {
  computeEstadoDelConocimiento,
  createPerfilLocalDeSalud,
  addInterpretation,
  updateInterpretation,
  supersedeInterpretation,
  type AddInterpretationInput,
  type UpdateInterpretationInput,
} from "../../../application/health-profile";
import {
  INIT_FORM_DRAFT,
  parseEvidenciaIds,
  type ActiveForm,
  type InterpretacionFormDraft,
  type EditFormDraft,
} from "./_shared";
import { EstadoConocimientoView } from "./EstadoConocimientoView";
import { InterpretacionesSection } from "./InterpretacionesSection";

// ── Props ─────────────────────────────────────────────────────────────────────

export interface PerfilLocalDeSaludPanelProps {
  perfil?:         PerfilLocalDeSalud;
  municipalityId:  string;
  municipalityName: string;
  onUpdatePerfil:  (perfil: PerfilLocalDeSalud) => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function PerfilLocalDeSaludPanel({
  perfil,
  municipalityId,
  municipalityName,
  onUpdatePerfil,
}: PerfilLocalDeSaludPanelProps) {

  // Estado del Conocimiento — derivado, recalculado automáticamente al cambiar perfil
  const estado = useMemo(
    () => (perfil ? computeEstadoDelConocimiento(perfil) : null),
    [perfil]
  );

  // ── Form state ──────────────────────────────────────────────────────────────
  const [activeForm,     setActiveForm]     = useState<ActiveForm>(null);
  const [formError,      setFormError]      = useState<string | null>(null);
  const [createDraft,    setCreateDraft]    = useState<InterpretacionFormDraft>(INIT_FORM_DRAFT);
  const [editDraft,      setEditDraft]      = useState<EditFormDraft | null>(null);
  const [supersedeDraft, setSupersedeDraft] = useState<InterpretacionFormDraft | null>(null);

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleCancelForm = () => { setActiveForm(null); setFormError(null); };

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
      setActiveForm(null);
      setCreateDraft(INIT_FORM_DRAFT);
      setFormError(null);
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "Error al añadir la interpretación.");
    }
  };

  const handleOpenEdit = (interp: HealthProfileInterpretation) => {
    setActiveForm({ type: "edit", id: interp.id });
    setEditDraft({
      certeza:         interp.certeza,
      razonamiento:    interp.razonamiento ?? "",
      evidenciaIdsRaw: interp.evidenciaIds.join("\n"),
    });
    setFormError(null);
  };

  const handleSubmitEdit = (id: string) => {
    if (!perfil || !editDraft) return;
    try {
      const changes: UpdateInterpretationInput = {
        certeza:      editDraft.certeza,
        razonamiento: editDraft.razonamiento,
        evidenciaIds: parseEvidenciaIds(editDraft.evidenciaIdsRaw),
      };
      onUpdatePerfil(updateInterpretation(perfil, id, changes));
      setActiveForm(null);
      setEditDraft(null);
      setFormError(null);
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "Error al actualizar la interpretación.");
    }
  };

  const handleOpenSupersede = (interp: HealthProfileInterpretation) => {
    setActiveForm({ type: "supersede", id: interp.id });
    setSupersedeDraft({
      espacio:         interp.espacio,
      enunciado:       "",
      certeza:         interp.certeza,
      autorNombre:     interp.autorNombre,
      razonamiento:    "",
      evidenciaIdsRaw: interp.evidenciaIds.join("\n"),
    });
    setFormError(null);
  };

  const handleSubmitSupersede = (id: string) => {
    if (!perfil || !supersedeDraft) return;
    try {
      const input: AddInterpretationInput = {
        espacio:      supersedeDraft.espacio,
        enunciado:    supersedeDraft.enunciado,
        certeza:      supersedeDraft.certeza,
        evidenciaIds: parseEvidenciaIds(supersedeDraft.evidenciaIdsRaw),
        autorNombre:  supersedeDraft.autorNombre,
        ...(supersedeDraft.razonamiento.trim() && { razonamiento: supersedeDraft.razonamiento.trim() }),
      };
      onUpdatePerfil(supersedeInterpretation(perfil, id, input));
      setActiveForm(null);
      setSupersedeDraft(null);
      setFormError(null);
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "Error al sustituir la interpretación.");
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

      {estado && <EstadoConocimientoView estado={estado} />}
    </section>
  );
}
