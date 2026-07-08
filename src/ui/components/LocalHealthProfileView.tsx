import { useState } from "react";
import type { LocalHealthProfile, PSLScaffoldChapter } from "../../domain/health-profile";
import type { LocalHealthProfileArtifact } from "../../domain/health-profile-artifact";
import {
  buildInstitutionalProfileViewModel,
  INSTITUTIONAL_NAV,
  CONTRAST_TOPICS_LABEL,
  PENDING_CONTRAST_LABEL,
  formatIndicatorValue,
} from "../../application/health-profile";
import type {
  IndicatorComparisonReference,
  PerfilEpistemicMetrics,
} from "../../application/health-profile";
import { PSLCArtifactViewer } from "./PSLCArtifactViewer";
import { exportPSLCArtifactToDocxBlob } from "../../application/psl-c-export";

// Descarga del documento institucional congelado como DOCX (solo artefactos
// PSL-C compilados; el borrador y el PSL validado no tienen export).
async function descargarPSLCDocx(artifact: LocalHealthProfileArtifact): Promise<void> {
  const { blob, fileName } = await exportPSLCArtifactToDocxBlob(artifact);
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
}

// ── Tipos auxiliares ──────────────────────────────────────────────────────────

interface LocalHealthProfileViewProps {
  psl: LocalHealthProfile;
  pslIsStale: boolean;
  municipalityName: string;
  /** Referencias comparativas por indicador para la trazabilidad técnica. */
  indicatorReferences?: IndicatorComparisonReference[];
  /** Métricas epistémicas del espacio de conocimiento (computePerfilEpistemicMetrics). */
  epistemicMetrics?: PerfilEpistemicMetrics;
  compiledProfiles?: LocalHealthProfileArtifact[];
  onValidate: (validatedBy: string) => void;
  onInvalidate: () => void;
  onEditConclusion?: (content: string) => void;
  onEditCierreInterpretativo?: (content: string) => void;
  onDocumentarDeliberacion?: (nota: string) => void;
  onCompile?: () => void;
  onApprove?: (approvedBy: string, role: "coordination" | "group-motor", approvingBody: string) => void;
}

// ── Status label ──────────────────────────────────────────────────────────────

const STATUS_LABEL: Record<LocalHealthProfile["status"], string> = {
  generated: "Documento de trabajo",
  review:    "En revisión técnica",
  validated: "Validado técnicamente",
  approved:  "Aprobado",
  superseded:"Sustituido",
  archived:  "Archivado",
};

// ── Conflict type label ───────────────────────────────────────────────────────

const CONFLICT_LABEL: Record<string, string> = {
  tendencia:      "Tendencia",
  fuente:         "Fuente",
  escala:         "Escala",
  temporal:       "Temporal",
  interpretativo: "Interpretativo",
};

// ── Origin label (IDs técnicos → lenguaje institucional) ─────────────────────

const ORIGIN_LABEL: Record<string, string> = {
  "health-report":         "Informe de Salud",
  "ibse":                  "IBSE",
  "citizen-participation": "Participación ciudadana",
  "community-assets":      "Activos comunitarios",
  "localiza-salud":        "Localiza Salud",
  "complementary-study":   "Estudio complementario",
  "eas":                   "EAS",
  "cmi":                   "CMI",
  "redcap":                "REDCap",
  "longi":                 "Longitudinal",
  "manual-entry":          "Entrada manual",
  "other":                 "Otras fuentes",
};

// ── Sub-components ────────────────────────────────────────────────────────────

function SectionHeader({ num, title }: { num: string; title: string }) {
  return (
    <div className="psl-doc-section__header">
      <span className="psl-doc-section__num">{num}</span>
      <h2 className="psl-doc-section__title">{title}</h2>
    </div>
  );
}

function ScaffoldBadge({ text }: { text: string }) {
  return <span className="psl-doc-scaffold-badge">{text}</span>;
}

// ── Índice del documento institucional ────────────────────────────────────────
// La estructura principal del Perfil son los seis capítulos narrativos por
// determinantes (INSTITUTIONAL_NAV, fuente única en el modelo de aplicación).

function PslChapterNav() {
  return (
    <nav className="psl-doc-chapter-nav" aria-label="Capítulos del perfil">
      <div className="psl-doc-chapter-nav__inner">
        {INSTITUTIONAL_NAV.map((ch) => (
          <a key={ch.href} href={ch.href} className="psl-doc-chapter-nav__link">
            {ch.label}
          </a>
        ))}
      </div>
    </nav>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function stripBrackets(text: string): string {
  return text.replace(/\s*\[[^\]]*\]\s*/g, " ").trim();
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("es-ES", {
    year: "numeric", month: "long", day: "numeric",
  });
}

// ── Chapter editor sub-component ─────────────────────────────────────────────
// Renders either the authored content or the scaffold preview, plus an
// inline textarea that writes back through the supplied onSave callback.
// Only the text content is edited; the status transitions are handled by the
// parent handler in App.tsx (scaffold → authored when the user saves).

interface PSLChapterEditorProps {
  chapter: PSLScaffoldChapter;
  label: string;
  onSave: (content: string) => void;
}

function PSLChapterEditor({ chapter, label, onSave }: PSLChapterEditorProps) {
  const isAuthored = chapter.status === "authored";
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(
    isAuthored ? chapter.content : stripBrackets(chapter.content)
  );

  // Sync draft when an external save updates the chapter (e.g. after persist)
  const [prevContent, setPrevContent] = useState(chapter.content);
  if (chapter.content !== prevContent) {
    setDraft(isAuthored ? chapter.content : stripBrackets(chapter.content));
    setPrevContent(chapter.content);
  }

  if (!editing) {
    return (
      <div className="psl-chapter-editor">
        {isAuthored ? (
          <div className="psl-chapter-editor__authored">
            <p className="psl-chapter-editor__authored-text">{chapter.content}</p>
          </div>
        ) : (
          <div className="psl-doc-scaffold-block">
            <ScaffoldBadge text="Propuesta asistida por COMPÁS NG · Pendiente de revisión técnica" />
            {stripBrackets(chapter.content) && (
              <p className="psl-doc-scaffold-block__content">
                {stripBrackets(chapter.content)}
              </p>
            )}
            <p className="psl-doc-scaffold-block__note">{chapter.authorshipNote}</p>
          </div>
        )}
        <button
          className="psl-chapter-editor__edit-btn"
          onClick={() => setEditing(true)}
        >
          {isAuthored ? `Editar ${label}` : `Redactar ${label}`}
        </button>
      </div>
    );
  }

  return (
    <div className="psl-chapter-editor psl-chapter-editor--editing">
      {!isAuthored && (
        <p className="psl-chapter-editor__scaffold-hint">
          {stripBrackets(chapter.content)}
        </p>
      )}
      <textarea
        className="psl-chapter-editor__textarea"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        rows={8}
        placeholder={`Redacta aquí las ${label.toLowerCase()} del equipo técnico…`}
      />
      <div className="psl-chapter-editor__actions">
        <button
          className="psl-chapter-editor__save-btn"
          onClick={() => { onSave(draft.trim()); setEditing(false); }}
          disabled={!draft.trim()}
        >
          Guardar {label}
        </button>
        <button
          className="psl-chapter-editor__cancel-btn"
          onClick={() => { setDraft(isAuthored ? chapter.content : stripBrackets(chapter.content)); setEditing(false); }}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

// ── Deliberation editor sub-component ────────────────────────────────────────

interface PSLDeliberacionEditorProps {
  deliberacionNota: string;
  consensoDocumentado: boolean;
  onSave: (nota: string) => void;
}

function PSLDeliberacionEditor({ deliberacionNota, consensoDocumentado, onSave }: PSLDeliberacionEditorProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(consensoDocumentado ? deliberacionNota : "");

  const [prevNota, setPrevNota] = useState(deliberacionNota);
  if (deliberacionNota !== prevNota) {
    setDraft(consensoDocumentado ? deliberacionNota : "");
    setPrevNota(deliberacionNota);
  }

  if (!editing) {
    return (
      <div className="psl-deliberacion-editor">
        {consensoDocumentado ? (
          <div className="psl-deliberacion-editor__documented">
            <span className="psl-deliberacion-editor__badge">Consenso documentado</span>
            <p className="psl-deliberacion-editor__text">{deliberacionNota}</p>
          </div>
        ) : (
          <div className="psl-doc-scaffold-block psl-doc-scaffold-block--deliberation">
            <ScaffoldBadge text="Deliberación pendiente · Se acuerda con el Grupo Motor" />
            <p className="psl-doc-scaffold-block__content">{deliberacionNota}</p>
          </div>
        )}
        <button
          className="psl-chapter-editor__edit-btn"
          onClick={() => setEditing(true)}
        >
          {consensoDocumentado ? "Editar deliberación" : "Documentar deliberación y consenso"}
        </button>
      </div>
    );
  }

  return (
    <div className="psl-deliberacion-editor psl-deliberacion-editor--editing">
      <p className="psl-chapter-editor__scaffold-hint">
        Documenta el resultado de la deliberación: prioridades acordadas, criterios
        utilizados y forma en que se alcanzó el consenso entre el equipo técnico,
        la ciudadanía y las instituciones.
      </p>
      <textarea
        className="psl-chapter-editor__textarea"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        rows={6}
        placeholder="Describe el proceso deliberativo y las prioridades definitivas acordadas…"
      />
      <div className="psl-chapter-editor__actions">
        <button
          className="psl-chapter-editor__save-btn"
          onClick={() => { onSave(draft.trim()); setEditing(false); }}
          disabled={!draft.trim()}
        >
          Documentar consenso
        </button>
        <button
          className="psl-chapter-editor__cancel-btn"
          onClick={() => { setDraft(consensoDocumentado ? deliberacionNota : ""); setEditing(false); }}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

// ── Validation action sub-component ──────────────────────────────────────────

function PSLValidationAction({
  onValidate,
}: {
  onValidate: (validatedBy: string) => void;
}) {
  const [author, setAuthor] = useState("Equipo técnico");

  return (
    <div className="psl-validate-action">
      <div className="psl-validate-action__body">
        <p className="psl-validate-action__text">
          Al validar técnicamente, el equipo confirma que este borrador ha sido
          revisado y es adecuado para fundamentar la priorización municipal. La
          validación técnica no genera el documento institucional: el PSL-C se
          crea después, con la compilación.
        </p>
        <div className="psl-validate-action__form">
          <label className="psl-validate-action__label" htmlFor="psl-validated-by">
            Validado por
          </label>
          <input
            id="psl-validated-by"
            className="psl-validate-action__input"
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            maxLength={120}
          />
          <button
            className="psl-validate-action__btn"
            onClick={() => onValidate(author)}
            disabled={!author.trim()}
          >
            Validar técnicamente
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Approve action sub-component ─────────────────────────────────────────────

function PSLApproveAction({
  onApprove,
}: {
  onApprove: (approvedBy: string, role: "coordination" | "group-motor", approvingBody: string) => void;
}) {
  const [approvedBy, setApprovedBy] = useState("");
  const [role, setRole] = useState<"coordination" | "group-motor">("group-motor");
  const [approvingBody, setApprovingBody] = useState("Grupo Motor del proceso RELAS");

  const canApprove = approvedBy.trim().length > 0 && approvingBody.trim().length > 0;

  return (
    <div className="psl-approve-action">
      <p className="psl-approve-action__text">
        La aprobación institucional formaliza el compromiso del Grupo Motor o la Coordinación
        con el diagnóstico territorial. Requiere evidencia externa documentada (acta o acuerdo).
      </p>
      <div className="psl-approve-action__form">
        <label className="psl-approve-action__label" htmlFor="psl-approved-by">
          Aprobado por (nombre y cargo)
        </label>
        <input
          id="psl-approved-by"
          className="psl-approve-action__input"
          type="text"
          value={approvedBy}
          onChange={(e) => setApprovedBy(e.target.value)}
          maxLength={120}
          placeholder="Nombre y cargo del responsable"
        />
        <label className="psl-approve-action__label" htmlFor="psl-approving-role">
          Rol institucional
        </label>
        <select
          id="psl-approving-role"
          className="psl-approve-action__select"
          value={role}
          onChange={(e) => setRole(e.target.value as "coordination" | "group-motor")}
        >
          <option value="group-motor">Grupo Motor</option>
          <option value="coordination">Coordinación del proceso</option>
        </select>
        <label className="psl-approve-action__label" htmlFor="psl-approving-body">
          Órgano aprobador
        </label>
        <input
          id="psl-approving-body"
          className="psl-approve-action__input"
          type="text"
          value={approvingBody}
          onChange={(e) => setApprovingBody(e.target.value)}
          maxLength={200}
        />
        <button
          className="psl-approve-action__btn"
          onClick={() => onApprove(approvedBy.trim(), role, approvingBody.trim())}
          disabled={!canApprove}
        >
          Aprobar institucionalmente
        </button>
      </div>
    </div>
  );
}

// ── PSL-C: tarjeta de artefacto compilado ────────────────────────────────────

function PSLCArtefactoCard({ artifact }: { artifact: LocalHealthProfileArtifact }) {
  const [expanded, setExpanded] = useState(false);

  const compiledDate = new Date(artifact.compiledAt);
  const dateStr = compiledDate.toLocaleDateString("es-ES", {
    day: "2-digit", month: "long", year: "numeric",
  });
  const timeStr = compiledDate.toLocaleTimeString("es-ES", {
    hour: "2-digit", minute: "2-digit",
  });

  const areas = artifact.lecturaTerritorial.areasDeIntervencion;
  const trazabilidad = artifact.sourceHash.slice(0, 8);

  return (
    <div className="psl-artifact-card">
      <div className="psl-artifact-card__header">
        <span className="psl-artifact-version">{artifact.artifactVersion}</span>
        <span className="psl-artifact-municipality">{artifact.portada.municipalityName}</span>
        <span className="psl-artifact-date">{dateStr} · {timeStr}</span>
        <span className="psl-artifact-frozen">Documento congelado</span>
      </div>

      <div className="psl-artifact-stats">
        <div className="psl-artifact-stats__item">
          <span className="psl-artifact-stats__val">{artifact.baseDocumental.totalEvidenceAtoms}</span>
          átomos de evidencia
        </div>
        <div className="psl-artifact-stats__item">
          <span className="psl-artifact-stats__val">{areas.length}</span>
          {areas.length === 1 ? "área de intervención" : "áreas de intervención"}
        </div>
        <div className="psl-artifact-stats__item">
          <span className="psl-artifact-stats__val">{artifact.baseDocumental.complementaryStudyCount}</span>
          instrumentos complementarios
        </div>
      </div>

      <div className="psl-artifact-trace">
        <span className="psl-artifact-trace__item">
          <span className="psl-artifact-trace__label">Hash:</span>{trazabilidad}…
        </span>
        <span className="psl-artifact-trace__item">
          <span className="psl-artifact-trace__label">PSL origen:</span>{artifact.sourcePSLId}
        </span>
        {artifact.notaValidacion.pslValidatedBy && (
          <span className="psl-artifact-trace__item">
            <span className="psl-artifact-trace__label">Validado por:</span>
            {artifact.notaValidacion.pslValidatedBy}
          </span>
        )}
      </div>

      <div className="psl-artifact-warning">
        Este artefacto requiere validación institucional explícita antes de su uso oficial.
      </div>

      <button
        type="button"
        className="psl-artifact-toggle"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
      >
        {expanded ? "▲ Ocultar contenido institucional" : "▼ Ver contenido institucional"}
      </button>

      {expanded && (
        <div className="psl-artifact-body">

          {artifact.lecturaTerritorial.territorialSummary && (
            <div>
              <p className="psl-artifact-section__label">Lectura territorial</p>
              <p className="psl-artifact-section__text">{artifact.lecturaTerritorial.territorialSummary}</p>
            </div>
          )}

          {areas.length > 0 && (
            <div>
              <p className="psl-artifact-section__label">
                Cuestiones para contraste ({areas.length})
              </p>
              <div className="psl-artifact-areas">
                {areas.map((area, i) => (
                  <div key={i} className="psl-artifact-area">
                    <p className="psl-artifact-area__title">{area.title}</p>
                    <p className="psl-artifact-area__rationale">{area.rationale}</p>
                    {area.cautions.map((c, j) => (
                      <p key={j} className="psl-artifact-area__caution">{c}</p>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          {artifact.conclusiones.content && (
            <div>
              <p className="psl-artifact-section__label">Conclusiones</p>
              <p className="psl-artifact-section__text">{artifact.conclusiones.content}</p>
            </div>
          )}

          {artifact.priorizacion.tematicasSeleccionadasLabels.length > 0 && (
            <div>
              <p className="psl-artifact-section__label">Prioridades ciudadanas</p>
              <div className="psl-artifact-topics">
                {artifact.priorizacion.tematicasSeleccionadasLabels.map((t, i) => (
                  <span key={i} className="psl-artifact-topic-chip">{t}</span>
                ))}
              </div>
            </div>
          )}

          {artifact.cautelasMetodologicas.hasCautelas && (
            <div>
              <p className="psl-artifact-section__label">Cautelas metodológicas</p>
              <p className="psl-artifact-cautela">{artifact.cautelasMetodologicas.nota}</p>
            </div>
          )}

        </div>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function LocalHealthProfileView({
  psl,
  pslIsStale,
  municipalityName,
  indicatorReferences,
  epistemicMetrics,
  compiledProfiles,
  onValidate,
  onInvalidate,
  onEditConclusion,
  onEditCierreInterpretativo,
  onDocumentarDeliberacion,
  onCompile,
  onApprove,
}: LocalHealthProfileViewProps) {
  const isEmpty = psl.totalEvidenceAtoms === 0;
  const doc = buildInstitutionalProfileViewModel(psl);
  const generatedDate = new Date(psl.generatedAt).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="psl-doc-view">

      {/* ── Cabecera institucional ──────────────────────────────────────── */}
      <header className="psl-doc-header workspace-panel">
        <div className="psl-doc-header__gradient" />
        <div className="psl-doc-header__body">
          <p className="psl-doc-header__meta">
            <span className="psl-doc-compas-brand">COMPÁS NG</span>
            {" · Planificación local de salud · Junta de Andalucía"}
          </p>
          <h1 className="psl-doc-header__municipality">{municipalityName}</h1>
          <p className="psl-doc-header__subtitle">Perfil de Salud Local 2027–2030</p>
          <div className="psl-doc-header__badges">
            <span className={`psl-doc-status-chip psl-doc-status-chip--${psl.status}`}>
              {STATUS_LABEL[psl.status]}
            </span>
            <span className="psl-doc-header__date">Generado el {generatedDate}</span>
            {psl.originsSummary.length > 0 && (
              <span className="psl-doc-header__atoms">
                {psl.originsSummary.length} fuente(s) de diagnóstico incorporada(s)
              </span>
            )}
          </div>
        </div>
      </header>

      {/* ── Estado: borrador / validado / validado obsoleto ───────────────── */}
      {psl.status === "generated" && (
        <div className="psl-doc-draft-notice">
          <span className="psl-doc-draft-notice__label">Documento de trabajo</span>{" "}
          Base diagnóstica en elaboración. Requiere revisión técnica y validación
          por el equipo local antes de su uso institucional.
        </div>
      )}

      {psl.status === "validated" && !pslIsStale && (
        <div className="psl-doc-validated-notice">
          <span className="psl-doc-validated-notice__label">Validado técnicamente</span>
          <span className="psl-doc-validated-notice__meta">
            {psl.validatedAt && `el ${formatDate(psl.validatedAt)}`}
            {psl.validatedBy && ` · ${psl.validatedBy}`}
            {(compiledProfiles?.length ?? 0) === 0
              ? " — Documento técnico validado, pendiente de compilación institucional: el documento institucional (PSL-C) se crea al compilar, tras asumir la autoría y documentar el consenso."
              : ` — Compilado como documento institucional: ${compiledProfiles!.length} artefacto(s) PSL-C congelado(s) al final de esta pantalla.`}
          </span>
          <button
            className="psl-doc-validated-notice__invalidate"
            onClick={onInvalidate}
            title="Revertir a borrador para incorporar nueva evidencia"
          >
            Revertir a borrador
          </button>
        </div>
      )}

      {psl.status === "validated" && pslIsStale && (
        <div className="psl-doc-stale-notice">
          <span className="psl-doc-stale-notice__label">Perfil desactualizado</span>
          La evidencia ha cambiado desde la validación del{" "}
          {psl.validatedAt ? formatDate(psl.validatedAt) : "perfil"}.
          Este perfil puede no reflejar la situación territorial actual.{" "}
          <button
            className="psl-doc-stale-notice__action"
            onClick={onInvalidate}
          >
            Regenerar perfil
          </button>
        </div>
      )}

      {/* ── Acción de validación (solo cuando el PSL está en borrador) ───── */}
      {psl.status === "generated" && (
        <PSLValidationAction onValidate={onValidate} />
      )}

      {/* ── Tarea 1: Índice de capítulos sticky ──────────────────────────── */}
      <PslChapterNav />

      {/* ── Resumen ejecutivo ─────────────────────────────────────────────── */}
      <section id="psl-resumen" className="psl-doc-section workspace-panel">
        <SectionHeader num="Resumen" title={`La salud en ${municipalityName}`} />

        {isEmpty ? (
          /* Tarea 2: Estado vacío positivo y constructivo */
          <div className="psl-doc-resumen-empty">
            <p className="psl-doc-resumen-empty__lead">
              Este Perfil de Salud Local inicia la caracterización territorial de{" "}
              <strong>{municipalityName}</strong> para el período 2027–2030.
            </p>
            <p className="psl-doc-resumen-empty__body">
              El diagnóstico se construirá de forma progresiva a medida que se incorporen
              fuentes de evidencia al repositorio documental: el Informe de Salud, el
              estudio IBSE, la priorización ciudadana y los estudios complementarios.
              Cada fuente añadida enriquece la lectura territorial y acerca el perfil
              a su estado completo.
            </p>
            <p className="psl-doc-resumen-empty__cta">
              Comienza incorporando el Informe de Salud en el Repositorio documental.
            </p>
          </div>
        ) : (
          <>
            <div className="psl-doc-kpi-grid">
              <div className="psl-doc-kpi psl-doc-kpi--total">
                <span className="psl-doc-kpi__value">{psl.totalEvidenceAtoms}</span>
                <span className="psl-doc-kpi__label">Elementos de diagnóstico</span>
              </div>
              <div className="psl-doc-kpi psl-doc-kpi--determinant">
                <span className="psl-doc-kpi__value">{psl.determinantCount}</span>
                <span className="psl-doc-kpi__label">Determinantes con evidencia directa</span>
              </div>
              <div className="psl-doc-kpi psl-doc-kpi--asset">
                <span className="psl-doc-kpi__value">{psl.assetCount}</span>
                <span className="psl-doc-kpi__label">Activos comunitarios</span>
              </div>
              <div className="psl-doc-kpi psl-doc-kpi--indicator">
                <span className="psl-doc-kpi__value">{psl.indicatorCount}</span>
                <span className="psl-doc-kpi__label">
                  {indicatorReferences !== undefined && indicatorReferences.length > 0
                    ? "Indicadores comparables"
                    : "Indicadores disponibles"}
                </span>
              </div>
              {indicatorReferences !== undefined && indicatorReferences.length > 0 && (
                <div className="psl-doc-kpi psl-doc-kpi--indicator">
                  <span className="psl-doc-kpi__value">
                    {new Set(indicatorReferences.map((r) => r.diagnosticBlockId)).size}
                  </span>
                  <span className="psl-doc-kpi__label">Bloques diagnósticos</span>
                </div>
              )}
              {epistemicMetrics !== undefined && (
                <div className="psl-doc-kpi psl-doc-kpi--determinant">
                  <span className="psl-doc-kpi__value">
                    {epistemicMetrics.hipotesisAbiertas}
                  </span>
                  <span className="psl-doc-kpi__label">Hipótesis en estudio</span>
                </div>
              )}
              <div className="psl-doc-kpi psl-doc-kpi--area">
                <span className="psl-doc-kpi__value">{psl.areasDeIntervencion.length}</span>
                <span className="psl-doc-kpi__label">Cuestiones para contraste</span>
              </div>
              <div className="psl-doc-kpi psl-doc-kpi--priority">
                <span className="psl-doc-kpi__value">
                  {psl.priorizacion.tematicasSeleccionadasIds.length}
                </span>
                <span className="psl-doc-kpi__label">Temáticas ciudadanas</span>
              </div>
            </div>

            <div className="psl-doc-primary-source">
              <div className="psl-doc-primary-source__icon" aria-hidden="true">📄</div>
              <div className="psl-doc-primary-source__body">
                <p className="psl-doc-primary-source__eyebrow">Fuente diagnóstica primaria</p>
                <p className="psl-doc-primary-source__title">
                  {psl.healthReportTitle ?? "Sin Informe de Salud registrado"}
                </p>
                {psl.healthReportTitle && (
                  <p className="psl-doc-primary-source__meta">
                    Fuente primaria · Preservado íntegramente en el Repositorio documental
                  </p>
                )}
              </div>
              <span className={`psl-doc-source-badge ${psl.healthReportTitle ? "psl-doc-source-badge--present" : "psl-doc-source-badge--absent"}`}>
                {psl.healthReportTitle ? "Presente" : "Ausente"}
              </span>
            </div>
          </>
        )}
      </section>

      {/* ── Documento principal: seis capítulos narrativos por determinantes ─ */}
      {!isEmpty && doc.isDraft && (
        <div className="psl-doc-draft-notice">
          <span className="psl-doc-draft-notice__label">Borrador asistido</span>{" "}
          Documento de trabajo elaborado con apoyo de COMPÁS NG a partir de la
          evidencia del repositorio. El equipo técnico debe revisarlo, completarlo
          y asumir su autoría antes del uso institucional.
        </div>
      )}

      {doc.chapters.length > 0 ? (
        doc.chapters.map((chapter, index) => (
          <section
            key={chapter.numeral}
            id={INSTITUTIONAL_NAV[index + 1]?.href.slice(1) ?? `psl-cap-${chapter.numeral.toLowerCase()}`}
            className="psl-doc-section workspace-panel"
          >
            <SectionHeader num={chapter.numeral} title={chapter.title} />
            <div className="psl-doc-narrative-chapter">
              {chapter.content.split("\n\n").map((paragraph, i) => (
                <p key={i} className="psl-doc-narrative-chapter__paragraph">
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        ))
      ) : (
        <section id="psl-cap-i" className="psl-doc-section workspace-panel">
          <SectionHeader num="I" title="Documento del Perfil" />
          <p className="psl-doc-narrative-chapter__paragraph">{doc.fallbackContent}</p>
        </section>
      )}

      {/* Edición del documento (autoría técnica sobre el texto completo) */}
      {psl.status === "validated" && onEditConclusion && (
        <section className="psl-doc-section workspace-panel">
          <p className="eyebrow">
            Autoría técnica · espacio de trabajo — no forma parte del documento
            institucional
          </p>
          <h2>Revisión y redacción del documento</h2>
          <p className="panel-note">
            El texto de los seis capítulos es un borrador asistido. Al guardarlo,
            el equipo técnico asume su autoría (requisito para compilar el
            documento institucional).
          </p>
          <PSLChapterEditor
            chapter={psl.conclusiones}
            label="documento del Perfil"
            onSave={onEditConclusion}
          />
        </section>
      )}

      {/* ── Anexo: trazabilidad técnica del diagnóstico (apoyo interno) ────── */}
      <section id="psl-anexo" className="psl-doc-section workspace-panel psl-doc-annex">
        <details className="psl-doc-annex__details">
          <summary className="psl-doc-annex__summary">
            Trazabilidad técnica del diagnóstico · apoyo interno del equipo — no
            forma parte del documento institucional
          </summary>

        {isEmpty ? (
          <div className="psl-doc-notice psl-doc-notice--empty">
            Sin evidencia disponible. Añade documentos al Repositorio documental para
            construir el diagnóstico territorial integrado.
          </div>
        ) : (
          <>
            <div className="psl-doc-evidence-grid">
              <div className="psl-doc-evidence-cell psl-doc-evidence-cell--determinant">
                <span className="psl-doc-evidence-cell__count">{psl.determinantCount}</span>
                <span className="psl-doc-evidence-cell__label">Determinantes</span>
                <span className="psl-doc-evidence-cell__hint">Factores estructurales que condicionan la salud</span>
              </div>
              <div className="psl-doc-evidence-cell psl-doc-evidence-cell--asset">
                <span className="psl-doc-evidence-cell__count">{psl.assetCount}</span>
                <span className="psl-doc-evidence-cell__label">Activos comunitarios</span>
                <span className="psl-doc-evidence-cell__hint">Recursos y capacidades del territorio</span>
              </div>
              <div className="psl-doc-evidence-cell psl-doc-evidence-cell--indicator">
                <span className="psl-doc-evidence-cell__count">{psl.indicatorCount}</span>
                <span className="psl-doc-evidence-cell__label">Indicadores</span>
                <span className="psl-doc-evidence-cell__hint">Datos cuantitativos disponibles</span>
              </div>
              <div className="psl-doc-evidence-cell psl-doc-evidence-cell--participation">
                <span className="psl-doc-evidence-cell__count">{psl.qualitativeFindingCount}</span>
                <span className="psl-doc-evidence-cell__label">Hallazgos participativos</span>
                <span className="psl-doc-evidence-cell__hint">Perspectiva ciudadana y cualitativa</span>
              </div>
              <div className="psl-doc-evidence-cell psl-doc-evidence-cell--caution">
                <span className="psl-doc-evidence-cell__count">{psl.methodologicalCautionCount}</span>
                <span className="psl-doc-evidence-cell__label">Cautelas metodológicas</span>
                <span className="psl-doc-evidence-cell__hint">Limitaciones que deben considerarse</span>
              </div>
            </div>

            {indicatorReferences !== undefined && indicatorReferences.length > 0 && (
              <details className="psl-doc-annex__details psl-doc-indicator-refs">
                <summary className="psl-doc-annex__summary">
                  Referencias comparativas por indicador ({indicatorReferences.length})
                  · valor demo, referencia provincial, referencia Andalucía y procedencia
                </summary>
                <p className="panel-note">
                  Los estudios complementarios organizan los instrumentos e
                  indicadores; las referencias comparativas provincial y autonómica
                  proceden de cálculos derivados de microdatos EAS —o de un monitor
                  provincial equivalente— y se incorporan como base de contraste.
                  En la demostración actual, los valores marcados como demo/proxy
                  coinciden con la referencia provincial de Granada: no constituyen
                  estimación específica del distrito.
                </p>
                <div style={{ overflowX: "auto" }}>
                  <table className="psl-doc-indicator-refs__table">
                    <thead>
                      <tr>
                        <th>Bloque</th>
                        <th>Instrumento</th>
                        <th>Indicador</th>
                        <th>Valor demo</th>
                        <th>Ref. Granada/prov.</th>
                        <th>Ref. Andalucía</th>
                        <th>Procedencia</th>
                        <th>Cautela / lectura</th>
                      </tr>
                    </thead>
                    <tbody>
                      {indicatorReferences.map((r) => (
                        <tr key={r.indicatorId}>
                          <td>{r.diagnosticBlockTitle}</td>
                          <td>{r.instrument}</td>
                          <td>{r.indicatorTitle}</td>
                          <td>
                            {formatIndicatorValue(r.territorialValue, r.unit)}
                            {r.demoProxy ? " (demo/proxy)" : ""}
                          </td>
                          <td>
                            {r.provinceReference !== undefined
                              ? formatIndicatorValue(r.provinceReference, r.unit)
                              : "no disponible"}
                          </td>
                          <td>
                            {r.andalusiaReference !== undefined
                              ? formatIndicatorValue(r.andalusiaReference, r.unit)
                              : "pendiente / no disponible"}
                          </td>
                          <td>
                            {r.source}
                            {r.calculationMethod ? ` · ${r.calculationMethod}` : ""}
                          </td>
                          <td>{r.comparisonReading}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </details>
            )}

            {psl.originsSummary.length > 0 && (
              <div className="psl-doc-origins">
                <p className="psl-doc-origins__label">Fuentes de evidencia presentes</p>
                <div className="psl-doc-origins__chips">
                  {psl.originsSummary.map((o) => (
                    <span key={o} className="psl-doc-origin-chip">
                      {ORIGIN_LABEL[o] ?? o}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="psl-doc-source-row">
              <div className={`psl-doc-source-flag ${psl.ibsePresent ? "psl-doc-source-flag--yes" : "psl-doc-source-flag--no"}`}>
                <span className="psl-doc-source-flag__name">IBSE</span>
                <span className="psl-doc-source-flag__status">{psl.ibsePresent ? "Disponible" : "Sin datos"}</span>
              </div>
              <div className={`psl-doc-source-flag ${(psl.dukePresent ?? false) ? "psl-doc-source-flag--yes" : "psl-doc-source-flag--no"}`}>
                <span className="psl-doc-source-flag__name">DUKE-EAS</span>
                <span className="psl-doc-source-flag__status">{(psl.dukePresent ?? false) ? "Disponible" : "Sin datos"}</span>
              </div>
              <div className={`psl-doc-source-flag ${(psl.predimedPresent ?? false) ? "psl-doc-source-flag--yes" : "psl-doc-source-flag--no"}`}>
                <span className="psl-doc-source-flag__name">PREDIMED-EAS</span>
                <span className="psl-doc-source-flag__status">{(psl.predimedPresent ?? false) ? "Disponible" : "Sin datos"}</span>
              </div>
              <div className={`psl-doc-source-flag ${psl.thematicPrioritisationPresent ? "psl-doc-source-flag--yes" : "psl-doc-source-flag--no"}`}>
                <span className="psl-doc-source-flag__name">Priorización ciudadana</span>
                <span className="psl-doc-source-flag__status">{psl.thematicPrioritisationPresent ? "Realizada" : "Pendiente"}</span>
              </div>
              {psl.complementaryStudyCount > 0 && (
                <div className="psl-doc-source-flag psl-doc-source-flag--yes">
                  <span className="psl-doc-source-flag__name">Estudios complementarios</span>
                  <span className="psl-doc-source-flag__status">{psl.complementaryStudyCount} disponible(s)</span>
                </div>
              )}
            </div>

            {psl.integrityErrors > 0 && (
              <div className="psl-doc-notice psl-doc-notice--warning">
                <strong>{psl.integrityErrors} problema(s) de integridad</strong> detectado(s)
                durante la validación de evidencias.
                {psl.integrityWarnings > 0 && ` ${psl.integrityWarnings} aviso(s) adicional(es).`}
                {" "}Consulta el Panel de Análisis para más detalle.
              </div>
            )}
            <div className="psl-doc-territorial-summary">
              <p>{psl.territorialSummary}</p>
            </div>

            {psl.longitudinalActive && (
              <div className="psl-doc-longitudinal-box">
                <p className="psl-doc-longitudinal-box__label">Dimensión longitudinal activa</p>
                <p className="psl-doc-longitudinal-box__note">{psl.longitudinalNote}</p>
              </div>
            )}

            {psl.tensionesEstructurales.length > 0 && (
              <div className="psl-doc-tensions">
                <p className="psl-doc-tensions__label">
                  Tensiones estructurales detectadas ({psl.tensionesEstructurales.length})
                </p>
                <ul className="psl-doc-tension-list">
                  {psl.tensionesEstructurales.map((t, i) => (
                    <li key={i} className="psl-doc-tension-item">{t}</li>
                  ))}
                </ul>
              </div>
            )}

            {(psl.limitacionesDiagnosticas?.length ?? 0) > 0 && (
              <div className="psl-doc-limitations">
                <p className="psl-doc-limitations__label">Limitaciones del diagnóstico</p>
                <p className="psl-doc-limitations__note">
                  Observaciones sobre la base documental disponible. No son áreas de intervención.
                  Deben considerarse antes de avanzar hacia priorización.
                </p>
                <ul className="psl-doc-limitation-list">
                  {(psl.limitacionesDiagnosticas ?? []).map((l, i) => (
                    <li key={i} className="psl-doc-limitation-item">{l}</li>
                  ))}
                </ul>
              </div>
            )}

            {psl.conflictos.length > 0 && (
              <div className="psl-doc-conflicts">
                <p className="psl-doc-conflicts__label">
                  Conflictos interpretativos detectados ({psl.conflictos.length})
                </p>
                <p className="psl-doc-conflicts__note">
                  Los conflictos interpretativos detectados requieren contraste con el equipo técnico y el Grupo Motor. La resolución es competencia humana.
                </p>
                <div className="psl-doc-conflict-list">
                  {psl.conflictos.map((c) => (
                    <div key={c.id} className={`psl-doc-conflict-card psl-doc-conflict-card--${c.tipo}`}>
                      <span className="psl-doc-conflict-card__tipo">
                        {CONFLICT_LABEL[c.tipo] ?? c.tipo}
                      </span>
                      <p className="psl-doc-conflict-card__desc">{c.descripcion}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {doc.contrastTopics.length > 0 && (
              <div className="psl-doc-areas">
                <p className="psl-doc-areas__label">
                  {CONTRAST_TOPICS_LABEL} ({doc.contrastTopics.length})
                </p>
                <p className="psl-doc-areas-intro">
                  Cuestiones diagnósticas identificadas a partir de la evidencia
                  disponible. Requieren deliberación técnica y comunitaria en la
                  fase posterior; no son decisiones ni propuestas de actuación.
                </p>
                <div className="psl-doc-area-list">
                  {doc.contrastTopics.map((topic, i) => (
                    <div key={topic.id} className="psl-doc-area-card">
                      <div className="psl-doc-area-card__num">{i + 1}</div>
                      <div className="psl-doc-area-card__body">
                        <h3 className="psl-doc-area-card__title">{topic.title}</h3>
                        <p className="psl-doc-area-card__rationale">{topic.rationale}</p>
                        {topic.cautions.length > 0 && (
                          <ul className="psl-doc-area-card__cautions">
                            {topic.cautions.map((c) => <li key={c}>{c}</li>)}
                          </ul>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {doc.pendingContrasts.length > 0 && (
              <div className="psl-doc-gaps">
                <p className="psl-doc-gaps__label">{PENDING_CONTRAST_LABEL}</p>
                <p className="psl-doc-gaps__intro">
                  El diagnóstico señala cuestiones que requieren atención metodológica
                  o ampliación de evidencia. No son conclusiones del diagnóstico.
                </p>
                <div className="psl-doc-gap-list">
                  {doc.pendingContrasts.map((gap) => (
                    <div key={gap.id} className="psl-doc-gap-card">
                      <h3 className="psl-doc-gap-card__title">{gap.title}</h3>
                      <p className="psl-doc-gap-card__rationale">{gap.rationale}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
        </details>
      </section>

      {/* ── Espacio de trabajo del equipo técnico (fuera del documento) ───── */}
      <div className="psl-doc-level-break" role="separator" aria-label="Espacio de trabajo del equipo técnico">
        <span>Espacio de trabajo del equipo técnico · no forma parte del documento institucional</span>
      </div>

      {/* ── Cierre interpretativo (autoría técnica) ─────────────────────── */}
      <section className="psl-doc-section workspace-panel">
        <p className="eyebrow">Espacio de trabajo</p>
        <h2>Cierre interpretativo (autoría técnica)</h2>
        <p className="panel-note">
          Lectura integrada de alcance y limitaciones que acompaña al documento.
          Requiere redacción del equipo técnico antes de compilar.
        </p>
        {psl.status === "validated" && onEditCierreInterpretativo ? (
          <PSLChapterEditor
            chapter={psl.cierreInterpretativo}
            label="Cierre interpretativo"
            onSave={onEditCierreInterpretativo}
          />
        ) : (
          <div className="psl-doc-scaffold-block">
            <ScaffoldBadge text="Propuesta asistida por COMPÁS NG · Pendiente de revisión técnica" />
            {stripBrackets(psl.cierreInterpretativo.content) && (
              <p className="psl-doc-scaffold-block__content">
                {stripBrackets(psl.cierreInterpretativo.content)}
              </p>
            )}
            <p className="psl-doc-scaffold-block__note">{psl.cierreInterpretativo.authorshipNote}</p>
          </div>
        )}
      </section>

      {/* ── Preparación de la deliberación (fase posterior al Perfil) ─────── */}
      <section className="psl-doc-section workspace-panel">
        <p className="eyebrow">Espacio de trabajo · fase posterior</p>
        <h2>Preparación de la deliberación con el Grupo Motor</h2>
        <p className="panel-note">
          La priorización es una fase posterior al Perfil y corresponde al Grupo
          Motor. Este espacio reúne los materiales de tránsito: las cuestiones
          para contraste y las temáticas ciudadanas. El documento del Perfil
          concluye; no prioriza ni recomienda.
        </p>

        {psl.priorizacion.hasTechnicalCandidatures && (
          <div className="psl-doc-prio-block">
            <p className="psl-doc-prio-block__label">Cuestiones para la deliberación</p>
            <p className="psl-doc-prio-block__caption">
              Cuestiones diagnósticas identificadas a partir de la evidencia
              disponible, para su contraste con el Grupo Motor. No ordenan
              prioridades ni proponen actuaciones.
            </p>
            <div className="psl-doc-candidature-list">
              {psl.priorizacion.candidaturasTecnicas.map((c, i) => (
                <div key={c.id} className="psl-doc-candidature-item">
                  <span className="psl-doc-candidature-item__num">{i + 1}</span>
                  <div>
                    <p className="psl-doc-candidature-item__title">{c.title}</p>
                    <p className="psl-doc-candidature-item__rationale">{c.rationale}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {psl.priorizacion.hasParticipatorySelection && (
          <div className="psl-doc-prio-block">
            <p className="psl-doc-prio-block__label">Temáticas ciudadanas</p>
            <p className="psl-doc-prio-block__caption">
              Temáticas señaladas en el proceso de participación ciudadana.
            </p>
            <div className="psl-doc-priority-chips">
              {psl.priorizacion.tematicasSeleccionadasLabels.map((label, i) => (
                <span key={i} className="psl-doc-priority-chip">{label}</span>
              ))}
            </div>
          </div>
        )}

        {psl.status === "validated" && onDocumentarDeliberacion ? (
          <PSLDeliberacionEditor
            deliberacionNota={psl.priorizacion.deliberacionNota}
            consensoDocumentado={psl.priorizacion.consensoDocumentado}
            onSave={onDocumentarDeliberacion}
          />
        ) : (
          <div className="psl-doc-scaffold-block psl-doc-scaffold-block--deliberation">
            <ScaffoldBadge text="Deliberación pendiente · Se acuerda con el Grupo Motor" />
            <p className="psl-doc-scaffold-block__content">{psl.priorizacion.deliberacionNota}</p>
          </div>
        )}

        {psl.priorizacionStatus === "scaffold" && (
          <div className="psl-doc-notice psl-doc-notice--info">
            Para preparar la deliberación, realiza la priorización temática con la
            ciudadanía (Priorizaciones) y ejecuta el análisis territorial completo.
          </div>
        )}
      </section>

      {/* ── Aprobación institucional del PSL ───────────────────── */}
      {psl.status === "validated" && !pslIsStale && onApprove != null && (
        <section className="workspace-panel psl-doc-approve-action">
          <p className="eyebrow">Aprobación institucional</p>
          <h2>Aprobar Perfil de Salud Local</h2>
          {psl.priorizacionStatus === "complete" ? (
            <PSLApproveAction onApprove={onApprove} />
          ) : (
            <p className="panel-note">
              La aprobación institucional requiere que la deliberación del Grupo Motor
              y el consenso estén documentados en el espacio de trabajo.
            </p>
          )}
        </section>
      )}

      {/* ── Compilación del PSL-C ──────────────────────────────── */}
      {psl.status === "validated" && !pslIsStale && onCompile != null && (
        <section className="workspace-panel psl-doc-compile-action">
          <p className="eyebrow">Compilación institucional</p>
          <h2>Compilar Perfil de Salud Local</h2>
          {psl.conclusiones.status === "authored" &&
           psl.cierreInterpretativo.status === "authored" &&
           psl.priorizacionStatus === "complete" ? (
            <>
              <p className="panel-note">
                El Perfil de Salud Local está validado y la autoría técnica está completa
                (documento, cierre interpretativo y consenso). Al compilar se crea el
                artefacto institucional congelado (PSL-C): la versión inmutable y
                trazable del Perfil, que es el documento institucional definitivo.
              </p>
              <button
                type="button"
                className="psl-doc-compile-action__btn"
                onClick={onCompile}
              >
                Compilar Perfil de Salud Local
              </button>
            </>
          ) : (
            <p className="panel-note">
              El documento institucional congelado (PSL-C) aún no se ha creado. Para
              compilarlo, asuma la autoría del documento del Perfil y del cierre
              interpretativo, y documente el consenso del Grupo Motor en el espacio
              de trabajo.
            </p>
          )}
        </section>
      )}

      {/* ── Perfiles PSL-C compilados ──────────────────────────── */}
      {compiledProfiles != null && compiledProfiles.length > 0 && (
        <section className="workspace-panel">
          <p className="eyebrow">Perfiles de Salud Local Compilados</p>
          <h2>Documentos institucionales generados</h2>
          <p className="panel-note">
            {compiledProfiles.length === 1
              ? "Un Perfil de Salud Local ha sido compilado como documento institucional. "
              : `${compiledProfiles.length} Perfiles de Salud Local han sido compilados como documentos institucionales. `}
            Cada compilación es un artefacto congelado e inmutable que representa el estado
            del diagnóstico en el momento de su generación.
          </p>
          <div className="psl-compiled-list">
            {[...compiledProfiles].reverse().map((artifact) => (
              <div key={artifact.id}>
                <PSLCArtefactoCard artifact={artifact} />
                <button
                  type="button"
                  className="psl-doc-compile-action__btn psl-doc-docx-btn"
                  onClick={() => void descargarPSLCDocx(artifact)}
                  title="Descargar el documento institucional congelado en formato Word"
                >
                  Descargar DOCX ({artifact.artifactVersion})
                </button>
                <details className="psl-doc-annex__details">
                  <summary className="psl-doc-annex__summary">
                    Ver documento institucional completo ({artifact.artifactVersion})
                  </summary>
                  <PSLCArtifactViewer artifact={artifact} />
                </details>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
