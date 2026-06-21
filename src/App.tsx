import { useEffect, useMemo, useState } from "react";
import {
  type DocumentKind,
  type MunicipalDocument,
  replaceMunicipalDocumentByKind,
} from "./domain/repository";
import { type MunicipalityWorkspace } from "./domain/workspace";
import { type CreateMunicipalityContextInput } from "./domain/municipality";
import { createCompleteMunicipalityWorkspace } from "./application/workspace";
import { createMunicipalityRuntime } from "./application/runtime";
import { ingestManualDocument } from "./application/document-ingestion";
import {
  createHealthReportDocumentFromDocx,
  createHealthReportDocumentFromPdf,
} from "./application/health-report";
import { parseIBSECSV } from "./application/ibse";
import { createIBSEStudy } from "./domain/ibse";
import {
  THEMATIC_TOPICS,
  MAX_SELECTED_TOPICS,
  createThematicPrioritisation,
} from "./domain/thematic-prioritisation";
import { createMunicipalSnapshot } from "./domain/municipality-context";
import { createMunicipalInventory } from "./application/municipal-inventory";
import { createStrategicFramework } from "./domain/strategic-framework";
import { parseThematicPrioritisationCSV } from "./application/thematic-prioritisation";
import type { ThematicPrioritisationStudy } from "./domain/thematic-prioritisation";
import {
  saveWorkspaceToLocalStorage,
  loadWorkspaceFromLocalStorage,
} from "./infrastructure/persistence/local-storage";

import {
  DocumentIngestionPanel,
  DocumentRepositoryPanel,
  EvidenceStorePanel,
  HealthReportViewer,
  IBSEPanel,
  MunicipalInventoryPanel,
  StrategicFrameworkPanel,
  ThematicPrioritisationPanel,
  ThematicPrioritisationModal,
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

// ── Municipios de demostración ───────────────────────────────

const DEMO_MUNICIPALITIES: CreateMunicipalityContextInput[] = [
  { id: "atarfe",    name: "Atarfe",              province: "Granada", ineCode: "18022", createdBy: "COMPÁS NG" },
  { id: "alfacar",   name: "Alfacar",              province: "Granada", ineCode: "18009", createdBy: "COMPÁS NG" },
  { id: "churriana", name: "Churriana de la Vega", province: "Granada", ineCode: "18052", createdBy: "COMPÁS NG" },
  { id: "zagra",     name: "Zagra",               province: "Granada",                   createdBy: "COMPÁS NG" },
];

// ── Tipos y constantes de módulo ─────────────────────────────

type AppView = "inicio" | "repositorio" | "analisis" | "priorizacion" | "plan";

const NAV_ITEMS: { id: AppView; label: string }[] = [
  { id: "inicio",        label: "Inicio" },
  { id: "repositorio",   label: "Repositorio documental" },
  { id: "analisis",      label: "Análisis territorial" },
  { id: "priorizacion",  label: "Priorizaciones" },
  { id: "plan",          label: "Plan Local de Salud" },
];

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
  const [showMunicipalitySelector, setShowMunicipalitySelector] = useState(false);
  const [isThematicModalOpen, setIsThematicModalOpen] = useState(false);

  const [workspace, setWorkspace] = useState<MunicipalityWorkspace>(() => {
    const defaultMuni = DEMO_MUNICIPALITIES[0];
    return (
      loadWorkspaceFromLocalStorage(defaultMuni.id) ??
      createCompleteMunicipalityWorkspace(defaultMuni)
    );
  });

  const [title, setTitle] = useState("");
  const [plainText, setPlainText] = useState("");
  const [kind, setKind] = useState<DocumentKind>("territorial-documentation");
  const [lastProcessedDocument, setLastProcessedDocument] =
    useState<MunicipalDocument | null>(null);
  const [lastAtomCount, setLastAtomCount] = useState<number>(0);
  const [isLoadingHealthReport, setIsLoadingHealthReport] = useState(false);
  const [lastHealthReportMessage, setLastHealthReportMessage] = useState<string | null>(null);
  const [isLoadingIBSE, setIsLoadingIBSE] = useState(false);
  const [ibseMessage, setIbseMessage] = useState<string | null>(null);
  const [pendingTopics, setPendingTopics] = useState<string[]>(
    () => workspace.thematicPrioritisation?.selectedTopicIds ?? []
  );
  const [isImportingTP, setIsImportingTP] = useState(false);
  const [tpImportMessage, setTpImportMessage] = useState<string | null>(null);

  useEffect(() => {
    saveWorkspaceToLocalStorage(workspace);
  }, [workspace]);

  useEffect(() => {
    setPendingTopics([...(workspace.thematicPrioritisation?.selectedTopicIds ?? [])]);
  }, [workspace.municipality.identity.id]);

  const runtime = useMemo(
    () => createMunicipalityRuntime({ workspace }),
    [workspace]
  );

  const municipalInventory = useMemo(() => {
    const snapshot = createMunicipalSnapshot(workspace);
    return createMunicipalInventory(snapshot);
  }, [workspace]);

  // Pipeline en modo fallback cuando la única oportunidad OIT es "Ampliar la base"
  // (ocurre cuando hay activos pero no hay determinantes ni otros tipos de evidencia).
  // En ese caso, los motores generan contenido de plantilla sin valor real para el plan.
  const pipelineIsEmpty =
    runtime.workspace.evidenceStore.atoms.length === 0 ||
    (runtime.oit.opportunities.length === 1 &&
      runtime.oit.opportunities[0].id === "oit-expand-evidence-base");
  const municipality = runtime.workspace.municipality.identity;

  const strategicFramework = useMemo(
    () =>
      createStrategicFramework({
        municipalityName: municipality.name,
      }),
    [municipality.name]
  );

  function handleProcessDocument() {
    // community-asset es un tipo canónico: una sola versión activa por municipio.
    // Se eliminan entradas previas del mismo tipo antes de registrar la nueva.
    const repositoryForIngestion =
      kind === "community-asset"
        ? {
            ...workspace.repository,
            documents: workspace.repository.documents.filter(
              (d) => d.kind !== "community-asset"
            ),
          }
        : workspace.repository;

    // Para community-asset, purgar también los átomos derivados de versiones
    // anteriores del documento para evitar acumulación de fragmentos residuales.
    const evidenceStoreForIngestion =
      kind === "community-asset"
        ? {
            ...workspace.evidenceStore,
            atoms: workspace.evidenceStore.atoms.filter(
              (a) => a.provenance.origin !== "community-assets"
            ),
            updatedAt: new Date().toISOString(),
          }
        : workspace.evidenceStore;

    const result = ingestManualDocument({
      repository: repositoryForIngestion,
      evidenceStore: evidenceStoreForIngestion,
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
    setLastAtomCount(result.atomsCreated);
    setTitle("");
    setPlainText("");
  }

  async function handleLoadHealthReport(file: File): Promise<void> {
    // .doc binario (Word 97-2003) no soportado por mammoth.
    const isLegacyDoc = /\.doc$/i.test(file.name) && !/\.docx$/i.test(file.name);
    if (isLegacyDoc) {
      setLastHealthReportMessage(
        "El formato .doc (binario) no puede procesarse. Convierte el fichero a .docx y vuelve a cargarlo."
      );
      return;
    }

    const isPdf = /\.pdf$/i.test(file.name);

    setIsLoadingHealthReport(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const documentId = crypto.randomUUID();
      // Normalizar título: quitar extensión y convertir guiones/subrayados a espacios
      const rawName = file.name
        .replace(/\.(docx?|pdf)$/i, "")
        .replace(/[-_]/g, " ");
      const docTitle = rawName.charAt(0).toUpperCase() + rawName.slice(1);
      const municipalityId = workspace.municipality.identity.id;

      const newDocInput = {
        id: documentId,
        kind: "health-report" as const,
        title: docTitle,
        source: { system: "Carga directa documento", collectedAt: new Date().toISOString() },
        sourceFileName: file.name,
        tags: ["health-report"],
      };

      const healthReport = isPdf
        ? await createHealthReportDocumentFromPdf({
            arrayBuffer,
            municipalityId,
            linkedDocumentId: documentId,
            sourceFileName: file.name,
            title: docTitle,
            authors: [],
          })
        : await createHealthReportDocumentFromDocx({
            arrayBuffer,
            municipalityId,
            linkedDocumentId: documentId,
            sourceFileName: file.name,
            title: docTitle,
            authors: [],
          });

      setWorkspace((prev) => ({
        ...prev,
        repository: replaceMunicipalDocumentByKind(prev.repository, newDocInput),
        healthReport,
        updatedAt: new Date().toISOString(),
      }));
      setLastHealthReportMessage(
        "Informe de Salud cargado y preservado como documento literal."
      );
    } catch (err) {
      console.error("[PDF-load-error]", err);
      setLastHealthReportMessage(
        isPdf
          ? "Error al procesar el PDF. Verifica que sea un PDF válido y no esté protegido."
          : "Error al cargar el informe. Comprueba que el fichero sea un .docx válido."
      );
    } finally {
      setIsLoadingHealthReport(false);
    }
  }

  async function handleLoadIBSECSV(file: File): Promise<void> {
    setIsLoadingIBSE(true);
    try {
      const text = await file.text();
      const { aggregates, warnings } = parseIBSECSV(text);
      const study = createIBSEStudy({
        municipalityId: workspace.municipality.identity.id,
        sourceFileName: file.name,
        aggregates,
      });
      setWorkspace((prev) => ({
        ...prev,
        ibseStudy: study,
        updatedAt: new Date().toISOString(),
      }));
      const warn = warnings.length > 0 ? ` Avisos: ${warnings.join(" ")}` : "";
      setIbseMessage(
        aggregates.nValid > 0
          ? `IBSE cargado: ${aggregates.nValid} registros válidos · Media total: ${aggregates.meanTotal}.${warn}`
          : `CSV procesado sin registros válidos.${warn}`
      );
    } catch {
      setIbseMessage("Error al procesar el CSV. Verifica que sea una exportación REDCap válida.");
    } finally {
      setIsLoadingIBSE(false);
    }
  }

  function handleTopicToggle(topicId: string) {
    setPendingTopics((prev) => {
      if (prev.includes(topicId)) return prev.filter((id) => id !== topicId);
      if (prev.length >= MAX_SELECTED_TOPICS) return prev;
      return [...prev, topicId];
    });
  }

  function handleSaveThematicPrioritisation() {
    const prioritisation = createThematicPrioritisation(
      workspace.municipality.identity.id,
      pendingTopics
    );
    setWorkspace((prev) => ({
      ...prev,
      thematicPrioritisation: prioritisation,
      updatedAt: new Date().toISOString(),
    }));
    setIsThematicModalOpen(false);
  }

  function handleOpenThematicModal() {
    setPendingTopics([...(workspace.thematicPrioritisation?.selectedTopicIds ?? [])]);
    setTpImportMessage(null);
    setIsThematicModalOpen(true);
  }

  function handleCloseThematicModal() {
    setPendingTopics([...(workspace.thematicPrioritisation?.selectedTopicIds ?? [])]);
    setIsThematicModalOpen(false);
  }

  async function handleImportThematicCSV(file: File): Promise<void> {
    setIsImportingTP(true);
    try {
      const text = await file.text();
      const { partialStudy, warnings } = parseThematicPrioritisationCSV(text, file.name);
      const study: ThematicPrioritisationStudy = {
        ...partialStudy,
        municipalityId: workspace.municipality.identity.id,
        importedAt: new Date().toISOString(),
      };
      setWorkspace((prev) => ({
        ...prev,
        thematicPrioritisationStudy: study,
        updatedAt: new Date().toISOString(),
      }));
      const warnText = warnings.length > 0 ? ` Avisos: ${warnings.join(" ")}` : "";
      setTpImportMessage(
        study.completeRecords > 0
          ? `CSV importado: ${study.completeRecords} papeletas completas de ${study.totalRecords} registros.${warnText}`
          : `CSV procesado sin papeletas completas.${warnText}`
      );
    } catch {
      setTpImportMessage("Error al procesar el CSV. Verifica que sea una exportación REDCap válida.");
    } finally {
      setIsImportingTP(false);
    }
  }

  function handleApplyTopFive(topicIds: string[]): void {
    setPendingTopics([...topicIds]);
  }

  function handleChangeMunicipality(municipalityId: string) {
    const demo = DEMO_MUNICIPALITIES.find((m) => m.id === municipalityId);
    if (demo === undefined) return;

    const nextWorkspace =
      loadWorkspaceFromLocalStorage(municipalityId) ??
      createCompleteMunicipalityWorkspace(demo);

    setWorkspace(nextWorkspace);
    setPendingTopics([...(nextWorkspace.thematicPrioritisation?.selectedTopicIds ?? [])]);
    setTitle("");
    setPlainText("");
    setKind("health-report");
    setLastProcessedDocument(null);
    setLastAtomCount(0);
    setLastHealthReportMessage(null);
    setIsLoadingHealthReport(false);
    setIbseMessage(null);
    setIsLoadingIBSE(false);
    setShowMunicipalitySelector(false);
    setIsThematicModalOpen(false);
    setIsImportingTP(false);
    setTpImportMessage(null);
  }

  // ── Render ──────────────────────────────────────────────────

  return (
    <>
      {/* Barra de navegación con contexto municipal */}
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

        {/* Franja de contexto municipal — siempre visible */}
        <div className="app-nav__municipality">
          <div className="app-nav__municipality-row">
            <span className="app-nav__municipality-name">
              {municipality.name}
            </span>
            <span className="app-nav__municipality-sep">·</span>
            <span>{municipality.province}</span>
            <span className="app-nav__municipality-sep">·</span>
            <span>Plan Local de Salud 2027–2030</span>
            {municipality.ineCode && (
              <>
                <span className="app-nav__municipality-sep">·</span>
                <span>INE {municipality.ineCode}</span>
              </>
            )}
            <span className="app-nav__municipality-badge">Demostración</span>
            <button
              type="button"
              className="app-nav__municipality-btn"
              onClick={() => setShowMunicipalitySelector((v) => !v)}
            >
              {showMunicipalitySelector ? "Cerrar ▲" : "Cambiar municipio ▾"}
            </button>
          </div>
        </div>
      </nav>

      <main className="app-shell">

        {/* Selector de municipio (se muestra sobre cualquier vista) */}
        {showMunicipalitySelector && (
          <section className="municipality-selector">
            <p className="municipality-selector__warning">
              Cambiar de municipio reiniciará el espacio de trabajo local
              actual. Los documentos y evidencias de esta sesión se eliminarán.
            </p>
            <div className="municipality-selector__options">
              {DEMO_MUNICIPALITIES.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  className={
                    municipality.id === m.id
                      ? "municipality-selector__option municipality-selector__option--active"
                      : "municipality-selector__option"
                  }
                  onClick={() => handleChangeMunicipality(m.id)}
                >
                  <span className="municipality-selector__option-name">{m.name}</span>
                  <span className="municipality-selector__option-meta">
                    {m.province} · INE {m.ineCode}
                  </span>
                </button>
              ))}
              <button
                type="button"
                className="municipality-selector__cancel"
                onClick={() => setShowMunicipalitySelector(false)}
              >
                Cancelar
              </button>
            </div>
          </section>
        )}

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
                onClick={() => setView("priorizacion")}
              >
                <span className="workflow-step__num">3</span>
                <p className="workflow-step__title">
                  Priorizar las temáticas de salud
                </p>
                <p className="workflow-step__desc">
                  Recoge las preferencias ciudadanas y delibera sobre las
                  temáticas prioritarias para el Plan Local de Salud.
                </p>
              </button>

              <button
                type="button"
                className="workflow-step"
                onClick={() => setView("plan")}
              >
                <span className="workflow-step__num">4</span>
                <p className="workflow-step__title">
                  Elaborar el borrador del Plan Local
                </p>
                <p className="workflow-step__desc">
                  Revisa el borrador de Plan de Acción, la agenda anual de
                  intervenciones y el registro de seguimiento inicial.
                </p>
              </button>

              <div className="workflow-step workflow-step--info">
                <span className="workflow-step__num workflow-step__num--info">5</span>
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

            {/* Estado del espacio de trabajo */}
            <div className="workspace-divider">
              <span className="workspace-divider-label">
                Estado del espacio de trabajo
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
            <StrategicFrameworkPanel framework={strategicFramework} />
            <MunicipalInventoryPanel inventory={municipalInventory} />
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
              kind={kind}
              title={title}
              plainText={plainText}
              lastProcessedDocument={lastProcessedDocument}
              atomsCreated={lastAtomCount}
              isLoadingHealthReport={isLoadingHealthReport}
              healthReportMessage={lastHealthReportMessage}
              onKindChange={setKind}
              onTitleChange={setTitle}
              onPlainTextChange={setPlainText}
              onProcessDocument={handleProcessDocument}
              onLoadHealthReport={handleLoadHealthReport}
            />
            <DocumentRepositoryPanel
              repository={runtime.workspace.repository}
            />
            <EvidenceStorePanel
              evidenceStore={runtime.workspace.evidenceStore}
            />
            <HealthReportViewer
              healthReport={runtime.workspace.healthReport}
            />
            <IBSEPanel
              ibseStudy={runtime.workspace.ibseStudy}
              isLoading={isLoadingIBSE}
              message={ibseMessage}
              onLoadCSV={handleLoadIBSECSV}
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

        {/* ── ④ Priorizaciones ────────────────────────────── */}
        {view === "priorizacion" && (
          <>
            <section className="workspace-panel">
              <p className="eyebrow">Capa deliberativa intermedia</p>
              <h2>Priorizaciones</h2>
              <p className="panel-note">
                La priorización es la capa deliberativa que transforma el diagnóstico
                en orientación para la acción. Se sitúa entre el Perfil de Salud Local
                y el Plan de Acción: no pertenece al diagnóstico ni al plan.
              </p>
            </section>
            <ThematicPrioritisationPanel
              savedIds={
                runtime.workspace.thematicPrioritisation?.selectedTopicIds ?? []
              }
              onOpen={handleOpenThematicModal}
            />
          </>
        )}

        {/* ── ⑤ Plan Local de Salud ───────────────────────── */}
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

      <ThematicPrioritisationModal
        isOpen={isThematicModalOpen}
        topics={THEMATIC_TOPICS}
        selectedIds={pendingTopics}
        savedIds={runtime.workspace.thematicPrioritisation?.selectedTopicIds ?? []}
        study={runtime.workspace.thematicPrioritisationStudy}
        isImporting={isImportingTP}
        importMessage={tpImportMessage}
        onToggle={handleTopicToggle}
        onSave={handleSaveThematicPrioritisation}
        onClose={handleCloseThematicModal}
        onImportCSV={handleImportThematicCSV}
        onApplyTopFive={handleApplyTopFive}
      />
    </>
  );
}
