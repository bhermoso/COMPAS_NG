import type { LocalHealthProfile } from "../../domain/health-profile";

// ── Tipos auxiliares ──────────────────────────────────────────────────────────

interface LocalHealthProfileViewProps {
  psl: LocalHealthProfile;
  municipalityName: string;
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

// ── Helpers ───────────────────────────────────────────────────────────────────

function stripBrackets(text: string): string {
  return text.replace(/\s*\[[^\]]*\]\s*/g, " ").trim();
}

// ── Main component ────────────────────────────────────────────────────────────

export function LocalHealthProfileView({ psl, municipalityName }: LocalHealthProfileViewProps) {
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

      {/* ── Aviso de estado borrador ──────────────────────────────────────── */}
      {psl.status === "generated" && (
        <div className="psl-doc-draft-notice">
          <span className="psl-doc-draft-notice__label">Borrador</span>
          Este Perfil de Salud Local ha sido generado automáticamente por{" "}
          <span className="psl-doc-compas-brand">COMPÁS NG</span> a partir de
          la evidencia disponible. Requiere revisión y validación técnica antes
          de su uso oficial.
        </div>
      )}

      {/* ── Resumen ejecutivo ─────────────────────────────────────────────── */}
      <section className="psl-doc-section workspace-panel">
        <SectionHeader num="Resumen" title={`La salud en ${municipalityName}`} />

        {isEmpty ? (
          <div className="psl-doc-notice">
            <strong>Base documental no disponible.</strong> Incorpora documentos al
            Repositorio documental para generar el Perfil de Salud Local basado en
            evidencia territorial. Sin evidencia no es posible construir una lectura
            diagnóstica del municipio.
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
      <section className="psl-doc-section workspace-panel">
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
      <section className="psl-doc-section workspace-panel">
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
      <section className="psl-doc-section workspace-panel">
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
      <section className="psl-doc-section workspace-panel">
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

            {/* Áreas de intervención — resultado operativo de la interpretación */}
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

      {/* ── V: Conclusiones ──────────────────────────────────────────────── */}
      <section className="psl-doc-section workspace-panel">
        <SectionHeader num="V" title="Conclusiones" />
        <div className="psl-doc-scaffold-block">
          <ScaffoldBadge text="Propuesta asistida por COMPÁS NG · Pendiente de revisión técnica" />
          {(() => {
            const clean = stripBrackets(psl.conclusiones.content);
            return clean ? (
              <p className="psl-doc-scaffold-block__content">{clean}</p>
            ) : null;
          })()}
          <p className="psl-doc-scaffold-block__note">{psl.conclusiones.authorshipNote}</p>
        </div>
      </section>

      {/* ── VI: Recomendaciones ──────────────────────────────────────────── */}
      <section className="psl-doc-section workspace-panel">
        <SectionHeader num="VI" title="Recomendaciones" />
        <div className="psl-doc-scaffold-block">
          <ScaffoldBadge text="Propuesta asistida por COMPÁS NG · Pendiente de revisión técnica" />
          {(() => {
            const clean = stripBrackets(psl.recomendaciones.content);
            return clean ? (
              <p className="psl-doc-scaffold-block__content">{clean}</p>
            ) : null;
          })()}
          <p className="psl-doc-scaffold-block__note">{psl.recomendaciones.authorshipNote}</p>
        </div>
      </section>

      {/* ── VII: Síntesis y Priorización ─────────────────────────────────── */}
      <section className="psl-doc-section workspace-panel">
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

        <div className="psl-doc-scaffold-block psl-doc-scaffold-block--deliberation">
          <ScaffoldBadge text="Deliberación pendiente · Autoría humana requerida" />
          <p className="psl-doc-scaffold-block__content">{psl.priorizacion.deliberacionNota}</p>
        </div>

        {psl.priorizacionStatus === "scaffold" && (
          <div className="psl-doc-notice psl-doc-notice--info">
            Para completar este capítulo, realiza la priorización temática con la ciudadanía
            (Priorizaciones) y ejecuta el análisis territorial completo.
          </div>
        )}
      </section>

    </div>
  );
}
