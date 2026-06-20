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

type AppView = "inicio" | "workspace" | "repositorio" | "pipeline";

const NAV_ITEMS: { id: AppView; label: string }[] = [
  { id: "inicio",      label: "Inicio" },
  { id: "workspace",   label: "Espacio de trabajo" },
  { id: "repositorio", label: "Repositorio documental" },
  { id: "pipeline",    label: "Pipeline técnico" },
];

const INITIAL_WORKSPACE = createCompleteMunicipalityWorkspace({
  id: "atarfe",
  name: "Atarfe",
  province: "Granada",
  ineCode: "18022",
  createdBy: "COMPÁS NG",
});

const DOCUMENT_KINDS: { value: DocumentKind; label: string }[] = [
  { value: "health-report",            label: "Informe de Salud" },
  { value: "complementary-study",      label: "Estudio complementario" },
  { value: "eas-variable",             label: "Variables EAS" },
  { value: "cmi-indicator",            label: "CMI / Indicadores" },
  { value: "community-asset",          label: "Activos comunitarios" },
  { value: "localiza-salud",           label: "Localiza Salud" },
  { value: "redcap-export",            label: "REDCap" },
  { value: "territorial-documentation",label: "Documentación territorial" },
  { value: "qualitative-material",     label: "Material endocualitativo" },
  { value: "longitudinal-evidence",    label: "Evidencia longitudinal" },
  { value: "other",                    label: "Otro" },
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
      {/* Barra de navegación principal */}
      <nav className="app-nav">
        <div className="app-nav__bar" />
        <div className="app-nav__inner">
          <span className="app-nav__brand">
            COMPÁS <span className="app-nav__brand-ng">NG</span>
          </span>
          <div className="app-nav__tabs">
            {NAV_ITEMS.map((item) => (
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
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="app-shell">

        {/* ── Vista: Inicio ───────────────────────────────── */}
        {view === "inicio" && (
          <section className="hero">
            <div className="gradient-bar" />
            <p className="eyebrow">
              Sistema de Información para la Acción Local en Salud
            </p>
            <div className="compas-brand-row">
              <h1 className="compas-wordmark">COMPÁS</h1>
              <span className="compas-ng-badge">NG</span>
            </div>
            <p className="compas-hero-subtitle">
              Infraestructura digital para la Acción Local en Salud
            </p>
            <p className="lead">
              Sistema modular para la elaboración de Planes Locales de Salud
              2027–2030 con enfoque salutogénico, comunitario y basado en
              activos. Alineado con RELAS, EPVSA y Localiza Salud.
            </p>
            <div className="hero-tags">
              <span className="hero-tag">Planes Locales de Salud 2027–2030</span>
              <span className="hero-tag">Junta de Andalucía</span>
              <span className="hero-tag">RELAS · EPVSA</span>
              <span className="hero-tag">Localiza Salud</span>
              <span className="hero-tag">Salud comunitaria y activos</span>
            </div>
          </section>
        )}

        {/* ── Vista: Espacio de trabajo ───────────────────── */}
        {view === "workspace" && (
          <>
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
                <h2>Repositorio documental</h2>
                <p>
                  <strong>
                    {runtime.workspace.repository.documents.length}
                  </strong>{" "}
                  documentos registrados
                </p>
                <p>Entrada única municipal de evidencias.</p>
              </article>

              <article className="card">
                <h2>EvidenceStore</h2>
                <p>
                  <strong>
                    {runtime.workspace.evidenceStore.atoms.length}
                  </strong>{" "}
                  EvidenceAtom
                </p>
                <p>Unidad canónica de conocimiento para motores.</p>
              </article>

              <article className="card">
                <h2>Pipeline</h2>
                <p>
                  <strong>{runtime.pipeline.trace.length}</strong> etapas
                  ejecutadas.
                </p>
                <p>Ver análisis completo en Pipeline técnico.</p>
              </article>
            </section>
          </>
        )}

        {/* ── Vista: Repositorio documental ───────────────── */}
        {view === "repositorio" && (
          <>
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

        {/* ── Vista: Pipeline técnico ─────────────────────── */}
        {view === "pipeline" && (
          <>
            <PipelineTracePanel pipeline={runtime.pipeline} />
            <LT1Panel lt1={runtime.lt1} />
            <OITPanel oit={runtime.oit} />
            <PrioritizationPanel prioritization={runtime.prioritization} />
            <EPVSAPanel epvsa={runtime.epvsa} />
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
