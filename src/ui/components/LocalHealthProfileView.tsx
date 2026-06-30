import { useState } from "react";
import type { LocalHealthProfile, PSLScaffoldChapter } from "../../domain/health-profile";

// ── Tipos auxiliares ──────────────────────────────────────────────────────────

interface LocalHealthProfileViewProps {
  psl: LocalHealthProfile;
  pslIsStale: boolean;
  municipalityName: string;
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
  generated: "Borrador generado",
  review:    "En revisión técnica",
  validated: "Validado",
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

function InterpretationBox({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="psl-doc-interp-box">
      <p className="psl-doc-interp-box__label">{label}</p>
      <div className="psl-doc-interp-box__body">{children}</div>
    </div>
  );
}

// ── Tarea 1: Índice de capítulos ──────────────────────────────────────────────

const CHAPTERS = [
  { href: "#psl-resumen",  label: "Resumen" },
  { href: "#psl-cap-i",   label: "I · Marco estratégico" },
  { href: "#psl-cap-ii",  label: "II · Informe de Salud" },
  { href: "#psl-cap-iii", label: "III · Diagnóstico" },
  { href: "#psl-cap-iv",  label: "IV · Interpretación" },
  { href: "#psl-cap-v",   label: "V · Conclusiones" },
  { href: "#psl-cap-vi",  label: "VI · Recomendaciones" },
  { href: "#psl-cap-vii", label: "VII · Priorización" },
] as const;

function PslChapterNav() {
  return (
    <nav className="psl-doc-chapter-nav" aria-label="Capítulos del perfil">
      <div className="psl-doc-chapter-nav__inner">
        {CHAPTERS.map((ch) => (
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
            <ScaffoldBadge text="Deliberación pendiente · Autoría humana requerida" />
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
          revisado y es adecuado para fundamentar la priorización municipal.
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

// ── Main component ────────────────────────────────────────────────────────────

export function LocalHealthProfileView({
  psl,
  pslIsStale,
  municipalityName,
  onValidate,
  onInvalidate,
  onEditConclusion,
  onEditCierreInterpretativo,
  onDocumentarDeliberacion,
  onCompile,
  onApprove,
}: LocalHealthProfileViewProps) {
  const isEmpty = psl.totalEvidenceAtoms === 0;
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
            {psl.totalEvidenceAtoms > 0 && (
              <span className="psl-doc-header__atoms">
                {psl.totalEvidenceAtoms} evidencias · {psl.originsSummary.length} fuente(s)
              </span>
            )}
          </div>
        </div>
      </header>

      {/* ── Estado: borrador / validado / validado obsoleto ───────────────── */}
      {psl.status === "generated" && (
        <div className="psl-doc-draft-notice">
          <span className="psl-doc-draft-notice__label">Borrador</span>
          Este Perfil de Salud Local ha sido generado automáticamente por{" "}
          <span className="psl-doc-compas-brand">COMPÁS NG</span> a partir de
          la evidencia disponible. Requiere revisión y validación técnica antes
          de su uso oficial.
        </div>
      )}

      {psl.status === "validated" && !pslIsStale && (
        <div className="psl-doc-validated-notice">
          <span className="psl-doc-validated-notice__label">Validado</span>
          <span className="psl-doc-validated-notice__meta">
            {psl.validatedAt && `el ${formatDate(psl.validatedAt)}`}
            {psl.validatedBy && ` · ${psl.validatedBy}`}
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
                <span className="psl-doc-kpi__label">Evidencias estructuradas</span>
              </div>
              <div className="psl-doc-kpi psl-doc-kpi--determinant">
                <span className="psl-doc-kpi__value">{psl.determinantCount}</span>
                <span className="psl-doc-kpi__label">Determinantes identificados</span>
              </div>
              <div className="psl-doc-kpi psl-doc-kpi--asset">
                <span className="psl-doc-kpi__value">{psl.assetCount}</span>
                <span className="psl-doc-kpi__label">Activos comunitarios</span>
              </div>
              <div className="psl-doc-kpi psl-doc-kpi--indicator">
                <span className="psl-doc-kpi__value">{psl.indicatorCount}</span>
                <span className="psl-doc-kpi__label">Indicadores disponibles</span>
              </div>
              <div className="psl-doc-kpi psl-doc-kpi--area">
                <span className="psl-doc-kpi__value">{psl.areasDeIntervencion.length}</span>
                <span className="psl-doc-kpi__label">Áreas de intervención</span>
              </div>
              <div className="psl-doc-kpi psl-doc-kpi--priority">
                <span className="psl-doc-kpi__value">
                  {psl.priorizacion.tematicasSeleccionadasIds.length}
                </span>
                <span className="psl-doc-kpi__label">Temáticas priorizadas</span>
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
                    {psl.healthReportSectionCount} sección(es) analizadas ·{" "}
                    {psl.healthReportAtomCount} evidencia(s) estructurada(s)
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

      {/* ── I: Marco Estratégico ──────────────────────────────────────────── */}
      <section id="psl-cap-i" className="psl-doc-section workspace-panel">
        <SectionHeader num="I" title="Marco Estratégico" />
        <p className="psl-doc-framework-intro">
          Este Perfil de Salud Local se elabora dentro del marco de la planificación
          local en salud de la Junta de Andalucía, bajo los principios de la
          Estrategia de Promoción de la Vida Saludable 2024–2030 (EPVSA),
          la metodología de la Red Local de Acción en Salud (RELAS) y el
          enfoque salutogénico orientado a activos comunitarios.
        </p>
        <dl className="psl-doc-framework-list">
          {[
            {
              id: "EPVSA",
              title: "Estrategia de Promoción de la Vida Saludable 2024–2030",
              desc: "Marco estratégico autonómico. Define líneas de actuación en alimentación, actividad física, bienestar emocional, entornos y estilos de vida.",
            },
            {
              id: "RELAS",
              title: "Red Local de Acción en Salud",
              desc: "Marco metodológico de referencia. Articula diagnóstico participativo, priorización ciudadana, planificación e implementación en red municipal.",
            },
            {
              id: "Salutogénesis",
              title: "Enfoque salutogénico y basado en activos",
              desc: "Orienta el análisis hacia los recursos, capacidades y fortalezas del territorio, complementando el análisis de necesidades.",
            },
            {
              id: "Determinantes sociales",
              title: "Determinantes sociales de la salud",
              desc: "Integra condiciones de vida, trabajo, educación, vivienda y equidad como factores estructurales que determinan los resultados de salud.",
            },
            {
              id: "Salud en Todas las Políticas",
              title: "Salud en Todas las Políticas",
              desc: "Promueve la acción intersectorial local, incorporando la salud en las decisiones de urbanismo, educación, servicios sociales y cultura.",
            },
            {
              id: "Participación ciudadana",
              title: "Acción comunitaria y participación",
              desc: "La comunidad es actora del diagnóstico, la priorización y la acción. La voz ciudadana informa y valida las decisiones de planificación.",
            },
          ].map((f) => (
            <div key={f.id} className="psl-doc-framework-item">
              <dt>
                <span className="psl-doc-framework-item__id">{f.id}</span>
                <span className="psl-doc-framework-item__title">{f.title}</span>
              </dt>
              <dd className="psl-doc-framework-item__desc">{f.desc}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ── II: Informe de Salud ──────────────────────────────────────────── */}
      <section id="psl-cap-ii" className="psl-doc-section workspace-panel">
        <SectionHeader num="II" title="Informe de Salud" />
        {psl.healthReportTitle ? (
          <>
            <div className="psl-doc-health-report">
              <div className="psl-doc-health-report__identity">
                <h3 className="psl-doc-health-report__title">{psl.healthReportTitle}</h3>
                <p className="psl-doc-health-report__caption">
                  Documento fuente primario. Preservado íntegramente en el Repositorio
                  documental. COMPÁS NG no lo sustituye: lo reinterpreta y enriquece.
                </p>
                <div className="psl-doc-health-report__stats">
                  <div className="psl-doc-mini-kpi">
                    <span className="psl-doc-mini-kpi__value">{psl.healthReportSectionCount}</span>
                    <span className="psl-doc-mini-kpi__label">Secciones analizadas</span>
                  </div>
                  <div className="psl-doc-mini-kpi">
                    <span className="psl-doc-mini-kpi__value">{psl.healthReportAtomCount}</span>
                    <span className="psl-doc-mini-kpi__label">Evidencias estructuradas</span>
                  </div>
                </div>
              </div>
            </div>
            <InterpretationBox label="¿Qué aporta COMPÁS NG al Informe de Salud?">
              <p>
                COMPÁS NG extrae el contenido diagnóstico del Informe de Salud, lo clasifica
                por tipo de evidencia (indicadores epidemiológicos, determinantes sociales,
                activos comunitarios, hallazgos cualitativos y cautelas metodológicas) y lo
                integra con el resto de fuentes del municipio.
              </p>
              <p>
                La lectura resultante trasciende la descripción epidemiológica clásica:
                incorpora determinantes sociales, recursos comunitarios y perspectiva
                salutogénica, respondiendo no solo a <em>«qué ocurre»</em> sino a{" "}
                <em>«por qué ocurre»</em>, <em>«con qué capacidades cuenta el municipio»</em>{" "}
                y <em>«qué oportunidades de acción existen»</em>.
              </p>
            </InterpretationBox>
          </>
        ) : (
          <div className="psl-doc-notice psl-doc-notice--info">
            <strong>Informe de Salud no registrado.</strong> El Informe de Salud es la fuente
            diagnóstica primaria recomendada. Cárgalo en el Repositorio documental (formatos
            .docx o .pdf) para enriquecer el diagnóstico territorial.
          </div>
        )}
      </section>

      {/* ── III: Diagnóstico integrado ────────────────────────────────────── */}
      <section id="psl-cap-iii" className="psl-doc-section workspace-panel">
        <SectionHeader num="III" title="Diagnóstico integrado" />

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
          </>
        )}
      </section>

      {/* ── IV: Interpretación territorial ───────────────────────────────── */}
      <section id="psl-cap-iv" className="psl-doc-section workspace-panel">
        <SectionHeader num="IV" title="Interpretación territorial" />
        <p className="psl-doc-section-subtitle">
          ¿Qué ocurre en el municipio? ¿Por qué puede estar ocurriendo?
          ¿Con qué activos y fortalezas cuenta? ¿Qué implica para la planificación local?
        </p>

        {isEmpty ? (
          <div className="psl-doc-notice psl-doc-notice--empty">
            Sin evidencia disponible. Incorpora documentos al Repositorio documental
            para construir la interpretación territorial del municipio.
          </div>
        ) : (
          <>
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

            {psl.conflictos.length > 0 && (
              <div className="psl-doc-conflicts">
                <p className="psl-doc-conflicts__label">
                  Conflictos interpretativos detectados ({psl.conflictos.length})
                </p>
                <p className="psl-doc-conflicts__note">
                  Ningún conflicto ha sido resuelto por el sistema. Requieren deliberación técnica.
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

            {psl.marcosAplicados.length > 0 && (
              <div className="psl-doc-frameworks-row">
                <p className="psl-doc-frameworks-row__label">Marcos interpretativos aplicados</p>
                <div className="psl-doc-frameworks-row__chips">
                  {psl.marcosAplicados.map((m) => (
                    <span key={m.framework} className="psl-doc-framework-chip">
                      {m.framework} <em>({m.elementCount})</em>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {psl.areasDeIntervencion.length > 0 && (
              <div className="psl-doc-areas">
                <p className="psl-doc-areas__label">
                  Áreas de intervención territorial ({psl.areasDeIntervencion.length})
                </p>
                <p className="psl-doc-areas-intro">
                  Áreas identificadas a partir de la evidencia disponible.
                  Son candidaturas técnicas del sistema; requieren validación y deliberación
                  antes de traducirse en objetivos del Plan de Acción.
                </p>
                <div className="psl-doc-area-list">
                  {psl.areasDeIntervencion.map((area, i) => (
                    <div key={area.id} className="psl-doc-area-card">
                      <div className="psl-doc-area-card__num">{i + 1}</div>
                      <div className="psl-doc-area-card__body">
                        <h3 className="psl-doc-area-card__title">{area.title}</h3>
                        <p className="psl-doc-area-card__rationale">{area.rationale}</p>
                        <p className="psl-doc-area-card__meta">
                          {area.relatedEvidenceIds.length} evidencia(s) relacionada(s)
                        </p>
                        {area.cautions.length > 0 && (
                          <ul className="psl-doc-area-card__cautions">
                            {area.cautions.map((c) => <li key={c}>{c}</li>)}
                          </ul>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </section>

      {/* ── Tarea 3: Transición entre análisis (I–IV) y elaboración (V–VII) ─ */}
      <div className="psl-doc-level-break" role="separator" aria-label="Elaboración y validación humana">
        <span>Elaboración y validación humana</span>
      </div>

      {/* ── V: Conclusiones ──────────────────────────────────────────────── */}
      <section id="psl-cap-v" className="psl-doc-section workspace-panel">
        <SectionHeader num="V" title="Conclusiones" />
        {psl.status === "validated" && onEditConclusion ? (
          <PSLChapterEditor
            chapter={psl.conclusiones}
            label="Conclusiones"
            onSave={onEditConclusion}
          />
        ) : (
          <div className="psl-doc-scaffold-block">
            <ScaffoldBadge text="Propuesta asistida por COMPÁS NG · Pendiente de revisión técnica" />
            {stripBrackets(psl.conclusiones.content) && (
              <p className="psl-doc-scaffold-block__content">
                {stripBrackets(psl.conclusiones.content)}
              </p>
            )}
            <p className="psl-doc-scaffold-block__note">{psl.conclusiones.authorshipNote}</p>
          </div>
        )}
      </section>

      {/* ── VI: Cierre interpretativo ────────────────────────────────────── */}
      <section id="psl-cap-vi" className="psl-doc-section workspace-panel">
        <SectionHeader num="VI" title="Cierre interpretativo" />
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

      {/* ── VII: Síntesis y Priorización ─────────────────────────────────── */}
      <section id="psl-cap-vii" className="psl-doc-section workspace-panel">
        <SectionHeader num="VII" title="Síntesis y Priorización" />

        {psl.priorizacion.hasTechnicalCandidatures && (
          <div className="psl-doc-prio-block">
            <p className="psl-doc-prio-block__label">Candidaturas técnicas</p>
            <p className="psl-doc-prio-block__caption">
              Áreas de intervención con suficiente evidencia para ser consideradas
              en la priorización. Son propuestas del sistema; no ordenan prioridades
              sin deliberación.
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
            <p className="psl-doc-prio-block__label">Prioridades ciudadanas</p>
            <p className="psl-doc-prio-block__caption">
              Temáticas seleccionadas en el proceso de participación ciudadana.
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
            <ScaffoldBadge text="Deliberación pendiente · Autoría humana requerida" />
            <p className="psl-doc-scaffold-block__content">{psl.priorizacion.deliberacionNota}</p>
          </div>
        )}

        {psl.priorizacionStatus === "scaffold" && (
          <div className="psl-doc-notice psl-doc-notice--info">
            Para completar este capítulo, realiza la priorización temática con la ciudadanía
            (Priorizaciones) y ejecuta el análisis territorial completo.
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
              La aprobación institucional requiere que el capítulo VII (deliberación del
              Grupo Motor y consenso documentado) esté completo.
            </p>
          )}
        </section>
      )}

      {/* ── Compilación del PSL-C ──────────────────────────────── */}
      {psl.status === "validated" && !pslIsStale && onCompile != null && (
        <section className="workspace-panel psl-doc-compile-action">
          <p className="eyebrow">Exportación institucional</p>
          <h2>Compilar Perfil de Salud Local</h2>
          {psl.conclusiones.status === "authored" &&
           psl.cierreInterpretativo.status === "authored" &&
           psl.priorizacionStatus === "complete" ? (
            <>
              <p className="panel-note">
                El Perfil de Salud Local está validado y sus capítulos de autoría humana
                están completos. Puede compilarse como documento institucional exportable (PSL-C).
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
              Para compilar el PSL-C, complete los capítulos V (Conclusiones) y VI (Recomendaciones)
              con autoría humana, y documente el consenso del Grupo Motor en el capítulo VII.
            </p>
          )}
        </section>
      )}

    </div>
  );
}
