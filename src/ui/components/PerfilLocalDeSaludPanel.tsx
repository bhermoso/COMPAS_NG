import { useMemo, useState } from "react";
import type {
  PerfilLocalDeSalud,
  ProfileSpace,
  HealthProfileInterpretation,
  InterpretationCerteza,
} from "../../domain/health-profile";
import {
  computeEstadoDelConocimiento,
  createPerfilLocalDeSalud,
  addInterpretation,
  updateInterpretation,
  supersedeInterpretation,
  type AddInterpretationInput,
  type UpdateInterpretationInput,
  type PerfilEstadoNivel,
  type PerfilSpaceCoverage,
} from "../../application/health-profile";

// ── Label maps ────────────────────────────────────────────────────────────────

const NIVEL_LABEL: Record<PerfilEstadoNivel, string> = {
  "vacio":                     "Vacío",
  "en-construccion":           "En construcción",
  "cobertura-minima":          "Cobertura mínima",
  "estructuralmente-completo": "Estructuralmente completo",
};

const SPACE_LABEL: Record<ProfileSpace, string> = {
  "contexto-territorial":     "Contexto territorial",
  "situacion-salud":          "Situación de salud",
  "determinantes":            "Determinantes",
  "desigualdades":            "Desigualdades",
  "activos":                  "Activos",
  "sintesis":                 "Síntesis",
  "preguntas-abiertas":       "Preguntas abiertas",
  "preparacion-deliberativa": "Preparación deliberativa",
};

const COVERAGE_LABEL: Record<PerfilSpaceCoverage, string> = {
  "vacio":              "Vacío",
  "iniciado":           "Iniciado",
  "pendiente-revision": "Pendiente revisión",
  "desarrollado":       "Desarrollado",
};

const CERTEZA_LABEL: Record<InterpretationCerteza, string> = {
  "alta":        "Alta",
  "moderada":    "Moderada",
  "provisional": "Provisional",
};

const SPACE_OPTIONS: Array<{ value: ProfileSpace; label: string }> = [
  { value: "contexto-territorial",     label: "Contexto territorial" },
  { value: "situacion-salud",          label: "Situación de salud" },
  { value: "determinantes",            label: "Determinantes" },
  { value: "desigualdades",            label: "Desigualdades" },
  { value: "activos",                  label: "Activos" },
  { value: "sintesis",                 label: "Síntesis" },
  { value: "preguntas-abiertas",       label: "Preguntas abiertas" },
  { value: "preparacion-deliberativa", label: "Preparación deliberativa" },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function parseEvidenciaIds(raw: string): string[] {
  return raw.split(/[\n,;]+/).map(s => s.trim()).filter(Boolean);
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("es-ES", {
    year: "numeric", month: "short", day: "numeric",
  });
}

// ── Internal types ────────────────────────────────────────────────────────────

type ActiveForm =
  | null
  | { type: "create" }
  | { type: "edit";      id: string }
  | { type: "supersede"; id: string };

interface InterpretacionFormDraft {
  espacio:         ProfileSpace;
  enunciado:       string;
  certeza:         InterpretationCerteza;
  autorNombre:     string;
  razonamiento:    string;
  evidenciaIdsRaw: string;
}

interface EditFormDraft {
  certeza:         InterpretationCerteza;
  razonamiento:    string;
  evidenciaIdsRaw: string;
}

const INIT_FORM_DRAFT: InterpretacionFormDraft = {
  espacio:         "situacion-salud",
  enunciado:       "",
  certeza:         "moderada",
  autorNombre:     "",
  razonamiento:    "",
  evidenciaIdsRaw: "",
};

// ── Sub-components ────────────────────────────────────────────────────────────

interface InterpretacionFormProps {
  title:       string;
  noteText?:   string;
  draft:       InterpretacionFormDraft;
  onChange:    (updates: Partial<InterpretacionFormDraft>) => void;
  onSubmit:    () => void;
  onCancel:    () => void;
  submitLabel: string;
  error:       string | null;
}

function InterpretacionForm({
  title, noteText, draft, onChange, onSubmit, onCancel, submitLabel, error,
}: InterpretacionFormProps) {
  return (
    <div className="ekc-interp-form">
      <p className="ekc-interp-form__title">{title}</p>
      {noteText && <p className="ekc-interp-form__note">{noteText}</p>}

      <div className="ekc-interp-form__row">
        <label className="ekc-interp-form__label">Espacio funcional</label>
        <select
          className="ekc-interp-form__select"
          value={draft.espacio}
          onChange={e => onChange({ espacio: e.target.value as ProfileSpace })}
        >
          {SPACE_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      <div className="ekc-interp-form__row">
        <label className="ekc-interp-form__label">Enunciado</label>
        <textarea
          className="ekc-interp-form__textarea"
          value={draft.enunciado}
          onChange={e => onChange({ enunciado: e.target.value })}
          rows={3}
          placeholder="Afirmación técnica sobre el territorio…"
        />
      </div>

      <div className="ekc-interp-form__row ekc-interp-form__row--half">
        <div>
          <label className="ekc-interp-form__label">Certeza</label>
          <select
            className="ekc-interp-form__select"
            value={draft.certeza}
            onChange={e => onChange({ certeza: e.target.value as InterpretationCerteza })}
          >
            <option value="alta">Alta</option>
            <option value="moderada">Moderada</option>
            <option value="provisional">Provisional</option>
          </select>
        </div>
        <div>
          <label className="ekc-interp-form__label">Autor / Equipo técnico</label>
          <input
            className="ekc-interp-form__input"
            type="text"
            value={draft.autorNombre}
            onChange={e => onChange({ autorNombre: e.target.value })}
            placeholder="Nombre del técnico o equipo"
          />
        </div>
      </div>

      <div className="ekc-interp-form__row">
        <label className="ekc-interp-form__label">Razonamiento (opcional)</label>
        <textarea
          className="ekc-interp-form__textarea"
          value={draft.razonamiento}
          onChange={e => onChange({ razonamiento: e.target.value })}
          rows={2}
          placeholder="Explicación del razonamiento que sustenta esta interpretación…"
        />
      </div>

      <div className="ekc-interp-form__row">
        <label className="ekc-interp-form__label">
          IDs de evidencia (uno por línea)
        </label>
        <textarea
          className="ekc-interp-form__textarea ekc-interp-form__textarea--mono"
          value={draft.evidenciaIdsRaw}
          onChange={e => onChange({ evidenciaIdsRaw: e.target.value })}
          rows={3}
          placeholder={"atom-id-001\natom-id-002"}
        />
        <p className="ekc-interp-form__hint">
          Identificadores de los átomos de evidencia que sustentan esta interpretación.
        </p>
      </div>

      {error && <p className="ekc-interp-form__error">{error}</p>}

      <div className="ekc-interp-form__actions">
        <button className="ekc-interp-form__submit" onClick={onSubmit}>{submitLabel}</button>
        <button className="ekc-interp-form__cancel" onClick={onCancel}>Cancelar</button>
      </div>
    </div>
  );
}

// ── Edit form (certeza + razonamiento + evidenciaIds) ─────────────────────────

interface InterpretacionEditFormProps {
  draft:    EditFormDraft;
  onChange: (updates: Partial<EditFormDraft>) => void;
  onSubmit: () => void;
  onCancel: () => void;
  error:    string | null;
}

function InterpretacionEditForm({
  draft, onChange, onSubmit, onCancel, error,
}: InterpretacionEditFormProps) {
  return (
    <div className="ekc-interp-form ekc-interp-form--inline">
      <p className="ekc-interp-form__title">Editar interpretación</p>
      <p className="ekc-interp-form__note">
        Solo se pueden modificar la certeza, el razonamiento y las evidencias referenciadas.
        Para revisar el enunciado usa "Nueva versión".
      </p>

      <div className="ekc-interp-form__row">
        <label className="ekc-interp-form__label">Certeza</label>
        <select
          className="ekc-interp-form__select ekc-interp-form__select--sm"
          value={draft.certeza}
          onChange={e => onChange({ certeza: e.target.value as InterpretationCerteza })}
        >
          <option value="alta">Alta</option>
          <option value="moderada">Moderada</option>
          <option value="provisional">Provisional</option>
        </select>
      </div>

      <div className="ekc-interp-form__row">
        <label className="ekc-interp-form__label">Razonamiento (opcional)</label>
        <textarea
          className="ekc-interp-form__textarea"
          value={draft.razonamiento}
          onChange={e => onChange({ razonamiento: e.target.value })}
          rows={2}
        />
      </div>

      <div className="ekc-interp-form__row">
        <label className="ekc-interp-form__label">IDs de evidencia (uno por línea)</label>
        <textarea
          className="ekc-interp-form__textarea ekc-interp-form__textarea--mono"
          value={draft.evidenciaIdsRaw}
          onChange={e => onChange({ evidenciaIdsRaw: e.target.value })}
          rows={3}
        />
      </div>

      {error && <p className="ekc-interp-form__error">{error}</p>}

      <div className="ekc-interp-form__actions">
        <button className="ekc-interp-form__submit" onClick={onSubmit}>Guardar cambios</button>
        <button className="ekc-interp-form__cancel" onClick={onCancel}>Cancelar</button>
      </div>
    </div>
  );
}

// ── Interpretation item ───────────────────────────────────────────────────────

interface InterpretacionItemProps {
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

function InterpretacionItem({
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

// ── Props ─────────────────────────────────────────────────────────────────────

interface PerfilLocalDeSaludPanelProps {
  perfil?:        PerfilLocalDeSalud;
  municipalityId:  string;
  municipalityName: string;
  onUpdatePerfil: (perfil: PerfilLocalDeSalud) => void;
}

// ── Main component ────────────────────────────────────────────────────────────

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
  const [activeForm, setActiveForm]       = useState<ActiveForm>(null);
  const [formError,  setFormError]        = useState<string | null>(null);
  const [createDraft, setCreateDraft]     = useState<InterpretacionFormDraft>(INIT_FORM_DRAFT);
  const [editDraft,   setEditDraft]       = useState<EditFormDraft | null>(null);
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

  // ── Derived ─────────────────────────────────────────────────────────────────

  const interpretaciones = perfil?.interpretaciones ?? [];

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <section className="workspace-panel ekc-panel">
      <p className="eyebrow">Espacio interpretativo · {municipalityName}</p>
      <h2 className="ekc-panel__title">Perfil Local de Salud</h2>

      {/* ── Interpretaciones ────────────────────────────────────────────────── */}
      <div className="ekc-interp-section">
        <div className="ekc-interp-section__header">
          <p className="ekc-interp-section__label">Interpretaciones</p>
          {activeForm?.type !== "create" && (
            <button className="ekc-interp-add-btn" onClick={handleOpenCreate}>
              + Nueva interpretación
            </button>
          )}
        </div>

        {activeForm?.type === "create" && (
          <InterpretacionForm
            title="Nueva interpretación"
            draft={createDraft}
            onChange={updates => setCreateDraft(prev => ({ ...prev, ...updates }))}
            onSubmit={handleSubmitCreate}
            onCancel={handleCancelForm}
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
              const isEditing    = activeForm?.type === "edit"      && activeForm.id === interp.id;
              const isSuperseding = activeForm?.type === "supersede" && activeForm.id === interp.id;
              return (
                <InterpretacionItem
                  key={interp.id}
                  interp={interp}
                  isEditing={isEditing}
                  isSuperseding={isSuperseding}
                  editDraft={isEditing ? editDraft : null}
                  supersedeDraft={isSuperseding ? supersedeDraft : null}
                  onOpenEdit={() => handleOpenEdit(interp)}
                  onOpenSupersede={() => handleOpenSupersede(interp)}
                  onCancelForm={handleCancelForm}
                  onChangeEdit={updates => setEditDraft(prev => prev ? { ...prev, ...updates } : null)}
                  onChangeSupersede={updates => setSupersedeDraft(prev => prev ? { ...prev, ...updates } : null)}
                  onSubmitEdit={() => handleSubmitEdit(interp.id)}
                  onSubmitSupersede={() => handleSubmitSupersede(interp.id)}
                  formError={activeForm?.type !== "create" ? formError : null}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* ── Estado del Conocimiento (calculado automáticamente) ─────────────── */}
      {estado && (
        <>
          <hr className="ekc-section-divider" />

          <p className="ekc-interp-section__label">Estado del Conocimiento</p>

          <div className="ekc-nivel">
            <span className="ekc-nivel__label">Estado del Perfil</span>
            <span className={`ekc-nivel__chip ekc-nivel__chip--${estado.nivelEstado}`}>
              {NIVEL_LABEL[estado.nivelEstado]}
            </span>
            <span className="ekc-nivel__meta">
              Actualizado:{" "}
              {new Date(estado.base.ultimaActualizacion).toLocaleDateString("es-ES", {
                year: "numeric", month: "long", day: "numeric",
              })}
            </span>
          </div>

          <table className="ekc-conteos">
            <tbody>
              <tr>
                <td className="ekc-conteos__label">Interpretaciones activas</td>
                <td className="ekc-conteos__val">{estado.base.interpretacionesActivas}</td>
                <td className="ekc-conteos__extra">
                  {estado.base.interpretacionesSuperadas > 0 &&
                    `${estado.base.interpretacionesSuperadas} superada(s)`}
                </td>
              </tr>
              <tr>
                <td className="ekc-conteos__label">Hipótesis activas</td>
                <td className="ekc-conteos__val">{estado.base.hipotesisActivas}</td>
                <td className="ekc-conteos__extra">
                  {estado.base.hipotesisResueltas > 0 && `${estado.base.hipotesisResueltas} resuelta(s)`}
                  {estado.base.hipotesisResueltas > 0 && estado.base.hipotesisDescartadas > 0 && " · "}
                  {estado.base.hipotesisDescartadas > 0 && `${estado.base.hipotesisDescartadas} descartada(s)`}
                </td>
              </tr>
              <tr>
                <td className="ekc-conteos__label">Preguntas abiertas</td>
                <td className="ekc-conteos__val">{estado.base.preguntasAbiertas}</td>
                <td className="ekc-conteos__extra">
                  {estado.base.preguntasResueltas > 0 && `${estado.base.preguntasResueltas} resuelta(s)`}
                </td>
              </tr>
              <tr>
                <td className="ekc-conteos__label">Síntesis narrativa</td>
                <td className="ekc-conteos__val" colSpan={2}>
                  {estado.base.tieneSintesis ? "Elaborada" : "Pendiente"}
                </td>
              </tr>
            </tbody>
          </table>

          <div className="ekc-cobertura">
            <p className="ekc-cobertura__heading">
              Cobertura mínima
              <span className={`ekc-cobertura__estado ekc-cobertura__estado--${estado.coberturaMinimaCumplida ? "ok" : "pending"}`}>
                {estado.coberturaMinimaCumplida ? "Cumplida" : "No cumplida"}
              </span>
            </p>
            <ul className="ekc-criterios">
              {estado.criteriosCobertura.map(c => (
                <li
                  key={c.id}
                  className={`ekc-criterio ekc-criterio--${c.cumplido ? "ok" : "pending"}`}
                >
                  <span className="ekc-criterio__mark" aria-hidden="true">
                    {c.cumplido ? "✓" : "○"}
                  </span>
                  <span className="ekc-criterio__desc">{c.descripcion}</span>
                </li>
              ))}
            </ul>
          </div>

          {estado.base.alertasGlobales.length > 0 && (
            <div className="ekc-alertas">
              <p className="ekc-alertas__heading">
                Alertas estructurales globales
                <span className="ekc-alertas__count">{estado.base.alertasGlobales.length}</span>
              </p>
              <ul className="ekc-alertas__list">
                {estado.base.alertasGlobales.map((a, i) => (
                  <li key={i} className="ekc-alerta">
                    <span className="ekc-alerta__tipo">{a.tipo}</span>
                    <span className="ekc-alerta__desc">{a.descripcion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {estado.base.espacios.filter(s => s.alertas.length > 0).length > 0 && (
            <div className="ekc-alertas">
              <p className="ekc-alertas__heading">
                Alertas por espacio funcional
                <span className="ekc-alertas__count">
                  {estado.base.espacios.reduce((acc, s) => acc + s.alertas.length, 0)}
                </span>
              </p>
              {estado.base.espacios.filter(s => s.alertas.length > 0).map(s => (
                <div key={s.espacio} className="ekc-espacio-alertas">
                  <p className="ekc-espacio-alertas__space">{SPACE_LABEL[s.espacio]}</p>
                  <ul className="ekc-alertas__list">
                    {s.alertas.map((a, i) => (
                      <li key={i} className="ekc-alerta">
                        <span className="ekc-alerta__tipo">{a.tipo}</span>
                        <span className="ekc-alerta__desc">{a.descripcion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          <div className="ekc-spaces">
            <p className="ekc-spaces__heading">Espacios funcionales</p>
            <table className="ekc-spaces-table">
              <thead>
                <tr>
                  <th>Espacio</th>
                  <th>Cobertura</th>
                  <th>Interp.</th>
                  <th>Hip.</th>
                  <th>Preg.</th>
                  <th>Alertas</th>
                </tr>
              </thead>
              <tbody>
                {estado.base.espacios.map(s => (
                  <tr key={s.espacio} className="ekc-spaces-row">
                    <td className="ekc-spaces-row__name">{SPACE_LABEL[s.espacio]}</td>
                    <td>
                      <span className={`ekc-coverage ekc-coverage--${s.cobertura}`}>
                        {COVERAGE_LABEL[s.cobertura]}
                      </span>
                    </td>
                    <td className="ekc-spaces-row__num">
                      {s.interpretacionesActivas > 0 ? s.interpretacionesActivas : "—"}
                    </td>
                    <td className="ekc-spaces-row__num">
                      {s.hipotesisActivas > 0 ? s.hipotesisActivas : "—"}
                    </td>
                    <td className="ekc-spaces-row__num">
                      {s.preguntasAbiertas > 0 ? s.preguntasAbiertas : "—"}
                    </td>
                    <td className="ekc-spaces-row__num">
                      {s.alertas.length > 0 ? s.alertas.length : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}
