import { useMemo, useState } from "react";
import {
  type DocumentKind,
  type MunicipalDocument,
} from "./domain/repository";
import { type MunicipalityWorkspace } from "./domain/workspace";
import { createCompleteMunicipalityWorkspace } from "./application/workspace";
import { createMunicipalityRuntime } from "./application/runtime";
import { ingestManualDocument } from "./application/document-ingestion";

import {
  DocumentIngestionPanel,
  EvidenceStorePanel,
  PipelineTracePanel,
  LT1Panel,
  OITPanel,
  PrioritizationPanel,
  EPVSAPanel,
  ActionPlanPanel,
  AgendaPanel,
  MonitoringPanel,
} from "./ui/components";
import "./App.css";

// ── Tipos y constantes de módulo ────────────────────────────

type AppView = "inicio" | "repositorio" | "analisis" | "plan";

const NAV_ITEMS: { id: AppView; label: string }[] = [
  { id: "inicio",      label: "Inicio" },
  { id: "repositorio", label: "Repositorio documental" },
  { id: "analisis",    label: "Análisis territorial" },
  { id: "plan",        label: "Plan Local de Salud" },
];

const INITIAL_WORKSPACE = createCompleteMunicipalityWorkspace({
  id: "atarfe",
  name: "Atarfe",
  province: "Granada",
  ineCode: "18022",
  createdBy: "COMPÁS NG",
});

const DOCUMENT_KINDS: { value: DocumentKind; label: string }[] = [
  { value: "health-report",             label: "Informe de Salud" },
  { value: "complementary-study",       label: "Estudio complementario" },
  { value: "eas-variable",              label: "Variables EAS" },
  { value: "cmi-indicator",             label: "CMI / Indicadores" },
  { value: "community-asset",           label: "Activos comunitarios" },
  { value: "localiza-salud",            label: "Localiza Salud" },
  { value: "redcap-export",             label: "REDCap" },
  { value: "territorial-documentation", label: "Documentación territorial" },
  { value: "qualitative-material",      label: "Material cualitativo" },
  { value: "longitudinal-evidence",     label: "Evidencia longitudinal" },
  { value: "other",                     label: "Otro" },
];

// ── Componente principal ─────────────────────────────────────

export default function App() {
  const [view, setView] = useState<AppView>("inicio");

  const [workspace, setWorkspace] =
    useState<MunicipalityWorkspace>(INITIAL_WORKSPACE);

  const [title, setTitle] = useState("");
  const [plainText, setPlainText] = useState("");
  const [kind, setKind] = useState<DocumentKind>("health-report");
  const [lastProcessedDocument, setLastProcessedDocument] =
    useState<MunicipalDocument | null>(null);

  const runtime = useMemo(
    () => createMunicipalityRuntime({ workspace }),
    [workspace]
  );

  const pipelineIsEmpty = runtime.workspace.evidenceStore.atoms.length === 0;
  const municipality = runtime.workspace.municipality.identity;

  function handleProcessDocument() {
    const result = ingestManualDocument({
      repository: workspace.repository,
      evidenceStore: workspace.evidenceStore,
      kind,
      title,
      plainText,
    });

    if (result === null) return;

    setWorkspace((prev) => ({
      ...prev,
      repository: result.repository,
      evidenceStore: result.evidenceStore,
      updatedAt: new Date().toISOString(),
    }));
    setLastProcessedDocument(result.document);
    setTitle("");
    setPlainText("");
  }

  // ── Render ──────────────────────────────────────────────────

  return (
    <>
      {/* Barra de navegación con indicadores de etapa */}
      <nav className="app-nav">
        <div className="app-nav__bar" />
        <div className="app-nav__inner">
          <span className="app-nav__brand">
            COMPÁS <span className="app-nav__brand-ng">NG</span>
          </span>
          <div className="app-nav__tabs">
            {NAV_ITEMS.map((item, index) => (
              <button
                key={item.id}
                type="button"
                className={
                  view === item.id
                    ? "app-nav__tab app-nav__tab--active"
                    : "app-nav__tab"
                }
                onClick={() => setView(item.id)}
              >
                <span className="app-nav__step-num">{index + 1}</span>
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="app-shell">

        {/* ── ① Inicio ────────────────────────────────────── */}
        {view === "inicio" && (
          <>
            <section className="hero">
              <div className="gradient-bar" />
              <p className="eyebrow">
                Planificación local de salud · Junta de Andalucía
              </p>
              <div className="compas-brand-row">
                <h1 className="compas-wordmark">COMPÁS</h1>
                <span className="compas-ng-badge">NG</span>
              </div>
              <p className="compas-hero-subtitle">
                Apoyo a la elaboración del Plan Local de Salud 2027–2030
              </p>
              <p className="lead">
                COMPÁS NG acompaña a los equipos de salud pública municipal en
                la recopilación de evidencia territorial, el análisis de la
                situación y la elaboración del Plan Local de Salud con enfoque
                salutogénico, comunitario y basado en activos.
              </p>
              <div className="hero-tags">
                <span className="hero-tag">Planes Locales de Salud 2027–2030</span>
                <span className="hero-tag">Junta de Andalucía</span>
                <span className="hero-tag">RELAS · EPVSA</span>
                <span className="hero-tag">Localiza Salud</span>
                <span className="hero-tag">Salud comunitaria y activos</span>
              </div>
            </section>

            {/* Flujo de trabajo */}
            <div className="workflow-steps">
              <button
                type="button"
                className="workflow-step"
                onClick={() => setView("repositorio")}
              >
                <span className="workflow-step__num">1</span>
                <p className="workflow-step__title">
                  Incorporar documentación municipal
                </p>
                <p className="workflow-step__desc">
                  Añade informes de salud, estudios, diagnósticos de barrio,
                  encuestas de participación o cualquier documento municipal
                  relevante.
                </p>
              </button>

              <button
                type="button"
                className="workflow-step"
                onClick={() => setView("analisis")}
              >
                <span className="workflow-step__num">2</span>
                <p className="workflow-step__title">
                  Analizar la información disponible
                </p>
                <p className="workflow-step__desc">
                  Consulta la lectura territorial, los determinantes de salud,
                  los activos comunitarios y las oportunidades de intervención
                  identificadas.
                </p>
              </button>

              <button
                type="button"
                className="workflow-step"
                onClick={() => setView("plan")}
              >
                <span className="workflow-step__num">3</span>
                <p className="workflow-step__title">
                  Elaborar el borrador del Plan Local
                </p>
                <p className="workflow-step__desc">
                  Revisa el borrador de Plan de Acción, la agenda anual de
                  intervenciones y el registro de seguimiento inicial.
                </p>
              </button>

              <div className="workflow-step workflow-step--info">
                <span className="workflow-step__num workflow-step__num--info">4</span>
                <p className="workflow-step__title">
                  Revisar y continuar el trabajo
                </p>
                <p className="workflow-step__desc">
                  Valida los resultados con el equipo técnico y la ciudadanía.
                  Actualiza la documentación e itera hasta consolidar el Plan
                  Local de Salud.
                </p>
              </div>
            </div>

            {/* Estado del municipio activo */}
            <div className="workspace-divider">
              <span className="workspace-divider-label">
                {municipality.name} · {municipality.province} · INE {municipality.ineCode}
              </span>
            </div>
            <section className="grid">
              <article className="card">
                <h2>Municipio activo</h2>
                <p><strong>{municipality.name}</strong></p>
                <p>{municipality.province}</p>
                <p>INE: {municipality.ineCode}</p>
              </article>

              <article className="card">
                <h2>Documentación registrada</h2>
                <p>
                  <strong>
                    {runtime.workspace.repository.documents.length}
                  </strong>{" "}
                  documentos
                </p>
                <p>Ve a Repositorio documental para añadir más fuentes.</p>
              </article>

              <article className="card">
                <h2>Evidencias estructuradas</h2>
                <p>
                  <strong>
                    {runtime.workspace.evidenceStore.atoms.length}
                  </strong>{" "}
                  unidades procesadas
                </p>
                <p>Listas para alimentar el análisis territorial.</p>
              </article>

              <article className="card">
                <h2>Análisis en curso</h2>
                <p>
                  <strong>{runtime.pipeline.trace.length}</strong> etapas
                  ejecutadas
                </p>
                <p>Ve a Análisis territorial para consultar el informe.</p>
              </article>
            </section>
          </>
        )}

        {/* ── ② Repositorio documental ─────────────────────── */}
        {view === "repositorio" && (
          <>
            <section className="workspace-panel">
              <p className="eyebrow">Cómo añadir documentación</p>
              <ol className="repo-guide__list">
                <li>
                  Pega el texto de un informe, estudio, diagnóstico o documento
                  municipal en el área de abajo.
                </li>
                <li>
                  Elige el tipo de documento en el menú y escribe un título breve.
                </li>
                <li>
                  Pulsa <strong>«Registrar documento»</strong> para transformar
                  el texto en unidades de evidencia estructurada.
                </li>
                <li>
                  Ve a <strong>Análisis territorial</strong> para ver la lectura
                  territorial, las oportunidades de intervención y el análisis
                  completo hasta el Plan de Acción.
                </li>
              </ol>
            </section>

            <DocumentIngestionPanel
              documentKinds={DOCUMENT_KINDS}
              repository={runtime.workspace.repository}
              kind={kind}
              title={title}
              plainText={plainText}
              lastProcessedDocument={lastProcessedDocument}
              onKindChange={setKind}
              onTitleChange={setTitle}
              onPlainTextChange={setPlainText}
              onProcessDocument={handleProcessDocument}
            />
            <EvidenceStorePanel
              evidenceStore={runtime.workspace.evidenceStore}
            />
          </>
        )}

        {/* ── ③ Análisis territorial ──────────────────────── */}
        {view === "analisis" && (
          <>
            <PipelineTracePanel pipeline={runtime.pipeline} />
            <LT1Panel lt1={runtime.lt1} />
            <OITPanel oit={runtime.oit} />
            <PrioritizationPanel prioritization={runtime.prioritization} />
            <EPVSAPanel epvsa={runtime.epvsa} />
          </>
        )}

        {/* ── ④ Plan Local de Salud ───────────────────────── */}
        {view === "plan" && (
          <>
            <ActionPlanPanel
              actionPlan={runtime.actionPlan}
              isEmpty={pipelineIsEmpty}
            />
            <AgendaPanel
              agenda={runtime.agenda}
              isEmpty={pipelineIsEmpty}
            />
            <MonitoringPanel
              monitoring={runtime.monitoring}
              isEmpty={pipelineIsEmpty}
            />
          </>
        )}

      </main>
    </>
  );
}
