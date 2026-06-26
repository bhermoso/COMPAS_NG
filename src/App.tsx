import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  type DocumentKind,
  type MunicipalDocument,
  type MunicipalDocumentRepository,
  addMunicipalDocument,
  replaceMunicipalDocumentByKind,
  removeMunicipalDocument,
} from "./domain/repository";
import { type MunicipalityWorkspace } from "./domain/workspace";
import { type CreateMunicipalityContextInput } from "./domain/municipality";
import { createCompleteMunicipalityWorkspace } from "./application/workspace";
import { createMunicipalityRuntime } from "./application/runtime";
import { ingestManualDocument } from "./application/document-ingestion";
// buildLocalHealthProfile is now called inside MunicipalityRuntime — not needed here.
import {
  createHealthReportDocumentFromDocx,
  createHealthReportDocumentFromPdf,
  healthReportToEvidenceAtoms,
} from "./application/health-report";
import { parseIBSECSV, ibseStudyToEvidenceAtoms } from "./application/ibse";
import { createIBSEStudy } from "./domain/ibse";
import { parseDUKECSV, dukeStudyToEvidenceAtoms } from "./application/duke";
import { createDUKEStudy } from "./domain/duke";
import { parsePREDIMEDCSV, predimedStudyToEvidenceAtoms } from "./application/predimed";
import { createPREDIMEDStudy } from "./domain/predimed";
import { parseSF12CSV, sf12StudyToEvidenceAtoms } from "./application/sf12";
import { createSF12Study } from "./domain/sf12";
import { stableAssetKey, upsertEvidenceAtom, type EvidenceAtom } from "./domain/evidence";
import {
  THEMATIC_TOPICS,
  MAX_SELECTED_TOPICS,
  createThematicPrioritisation,
} from "./domain/thematic-prioritisation";
import { createMunicipalSnapshot } from "./domain/municipality-context";
import { createMunicipalInventory } from "./application/municipal-inventory";
import { createStrategicFramework } from "./domain/strategic-framework";
import { parseThematicPrioritisationCSV, thematicPrioritisationToEvidenceAtoms } from "./application/thematic-prioritisation";
import { buildEstadoResumen } from "./application/territorial-interpretation";
import type { ThematicPrioritisationStudy } from "./domain/thematic-prioritisation";
import {
  saveWorkspaceToLocalStorage,
  loadWorkspaceFromLocalStorage,
  hasWorkspaceInLocalStorage,
} from "./infrastructure/persistence/local-storage";

import {
  DocumentIngestionPanel,
  DocumentRepositoryPanel,
  EvidenceStorePanel,
  HealthReportViewer,
  EstudiosComplementariosPanel,
  QuestionnaireBuilderPanel,
  MunicipalInventoryPanel,
  LocalHealthProfilePanel,
  LocalHealthProfileView,
  StrategicFrameworkPanel,
  ThematicPrioritisationPanel,
  ThematicPrioritisationModal,
  PipelineTracePanel,
  LT1Panel,
  OITPanel,
  ReconciliacionPanel,
  PrioritizationPanel,
  EPVSAPanel,
  ActionPlanPanel,
  AgendaPanel,
  MonitoringPanel,
} from "./ui/components";
import "./App.css";

// ── Tipos de ámbito territorial ──────────────────────────────

const TERRITORIAL_TYPE_OPTIONS = [
  { value: "municipio",    label: "Municipio" },
  { value: "mancomunidad", label: "Mancomunidad" },
  { value: "distrito",     label: "Distrito municipal" },
  { value: "otro",         label: "Otro ámbito" },
] as const;

const TERRITORIAL_TYPE_LABEL: Record<string, string> = {
  municipio:    "Municipio",
  mancomunidad: "Mancomunidad",
  distrito:     "Distrito municipal",
  otro:         "Otro ámbito",
};

// ── Municipios de demostración ───────────────────────────────

const DEMO_MUNICIPALITIES: CreateMunicipalityContextInput[] = [
  { id: "atarfe",    name: "Atarfe",              province: "Granada", ineCode: "18022", createdBy: "COMPÁS NG" },
  { id: "alfacar",   name: "Alfacar",              province: "Granada", ineCode: "18009", createdBy: "COMPÁS NG" },
  { id: "churriana", name: "Churriana de la Vega", province: "Granada", ineCode: "18052", createdBy: "COMPÁS NG" },
  { id: "zagra",     name: "Zagra",               province: "Granada",                   createdBy: "COMPÁS NG" },
];

const CUSTOM_MUNICIPALITIES_KEY = "compas-ng:custom-municipalities";
const WORKSPACE_PERSISTENCE_FAILURE_MESSAGE =
  "No se pudo guardar el espacio de trabajo en este navegador. La selección puede perderse al recargar.";

function slugifyMunicipalityId(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ── Tipos y constantes de módulo ─────────────────────────────

type AppView = "inicio" | "repositorio" | "analisis" | "psl" | "priorizacion" | "plan";

const NAV_ITEMS: { id: AppView; label: string }[] = [
  { id: "inicio",        label: "Inicio" },
  { id: "repositorio",   label: "Repositorio documental" },
  { id: "analisis",      label: "Análisis territorial" },
  { id: "psl",           label: "Perfil de Salud Local" },
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

const IBSE_DOCUMENT_TAG = "ibse";
const DUKE_DOCUMENT_TAG = "duke-eas";
const PREDIMED_DOCUMENT_TAG = "predimed-eas";
const SF12_DOCUMENT_TAG = "sf12-eas";
const THEMATIC_PRIORITISATION_DOCUMENT_TAG = "thematic-prioritisation";

function hasDocumentTag(document: MunicipalDocument | undefined, tag: string): boolean {
  return document?.tags.includes(tag) === true;
}

function isIBSEDocument(document: MunicipalDocument | undefined): boolean {
  return hasDocumentTag(document, IBSE_DOCUMENT_TAG);
}

function isDUKEDocument(document: MunicipalDocument | undefined): boolean {
  return hasDocumentTag(document, DUKE_DOCUMENT_TAG);
}

function isPREDIMEDDocument(document: MunicipalDocument | undefined): boolean {
  return hasDocumentTag(document, PREDIMED_DOCUMENT_TAG);
}

function isSF12Document(document: MunicipalDocument | undefined): boolean {
  return hasDocumentTag(document, SF12_DOCUMENT_TAG);
}

function isThematicPrioritisationDocument(
  document: MunicipalDocument | undefined
): boolean {
  return hasDocumentTag(document, THEMATIC_PRIORITISATION_DOCUMENT_TAG);
}

function removeDocumentsByTag(
  repository: MunicipalDocumentRepository,
  tag: string
): MunicipalDocumentRepository {
  const now = new Date().toISOString();
  return {
    ...repository,
    documents: repository.documents.filter((document) => !document.tags.includes(tag)),
    updatedAt: now,
  };
}

function attachDocumentIdToAtoms(
  atoms: EvidenceAtom[],
  documentId: string
): EvidenceAtom[] {
  return atoms.map((atom) => ({
    ...atom,
    provenance: {
      ...atom.provenance,
      documentId,
    },
  }));
}

interface WorkspaceLoadResult {
  workspace: MunicipalityWorkspace;
  protectExistingStorage: boolean;
}

function loadOrCreateMunicipalityWorkspace(
  municipalityId: string,
  input: CreateMunicipalityContextInput
): WorkspaceLoadResult {
  const loaded = loadWorkspaceFromLocalStorage(municipalityId);
  if (loaded !== null) {
    return { workspace: loaded, protectExistingStorage: false };
  }

  return {
    workspace: createCompleteMunicipalityWorkspace(input),
    protectExistingStorage: hasWorkspaceInLocalStorage(municipalityId),
  };
}

function isEmptyWorkspaceForPersistenceGuard(
  workspace: MunicipalityWorkspace
): boolean {
  return (
    workspace.repository.documents.length === 0 &&
    workspace.evidenceStore.atoms.length === 0 &&
    workspace.healthReport === undefined &&
    workspace.ibseStudy === undefined &&
    workspace.dukeStudy === undefined &&
    workspace.predimedStudy === undefined &&
    workspace.sf12Study === undefined &&
    workspace.thematicPrioritisation === undefined &&
    workspace.thematicPrioritisationStudy === undefined &&
    (workspace.historialEstadosTerritorial?.length ?? 0) === 0 &&
    workspace.validatedPSL === undefined
  );
}

// ── Componente principal ─────────────────────────────────────

export default function App() {
  const [view, setView] = useState<AppView>("inicio");
  const [showMunicipalitySelector, setShowMunicipalitySelector] = useState(false);
  const [isThematicModalOpen, setIsThematicModalOpen] = useState(false);

  const [initialWorkspaceLoad] = useState<WorkspaceLoadResult>(() => {
    const defaultMuni = DEMO_MUNICIPALITIES[0];
    return loadOrCreateMunicipalityWorkspace(defaultMuni.id, defaultMuni);
  });
  const [workspace, setWorkspace] = useState<MunicipalityWorkspace>(
    initialWorkspaceLoad.workspace
  );
  const protectedEmptyWorkspaceIdRef = useRef<string | null>(
    initialWorkspaceLoad.protectExistingStorage
      ? initialWorkspaceLoad.workspace.municipality.identity.id
      : null
  );

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
  const [isLoadingDUKE, setIsLoadingDUKE] = useState(false);
  const [dukeMessage, setDukeMessage] = useState<string | null>(null);
  const [isLoadingPREDIMED, setIsLoadingPREDIMED] = useState(false);
  const [predimedMessage, setPredimedMessage] = useState<string | null>(null);
  const [isLoadingSF12, setIsLoadingSF12] = useState(false);
  const [sf12Message, setSf12Message] = useState<string | null>(null);
  const [pendingTopics, setPendingTopics] = useState<string[]>(
    () => workspace.thematicPrioritisation?.selectedTopicIds ?? []
  );
  const [isImportingTP, setIsImportingTP] = useState(false);
  const [tpImportMessage, setTpImportMessage] = useState<string | null>(null);
  const [persistenceMessage, setPersistenceMessage] = useState<string | null>(null);

  const [customMunicipalities, setCustomMunicipalities] = useState<CreateMunicipalityContextInput[]>(() => {
    try {
      const raw = localStorage.getItem(CUSTOM_MUNICIPALITIES_KEY);
      return raw ? (JSON.parse(raw) as CreateMunicipalityContextInput[]) : [];
    } catch {
      return [];
    }
  });
  const [newMuniName, setNewMuniName] = useState("");
  const [newMuniProvince, setNewMuniProvince] = useState("");
  const [newMuniType, setNewMuniType] = useState("municipio");
  const [newMuniError, setNewMuniError] = useState<string | null>(null);

  useEffect(() => {
    if (
      protectedEmptyWorkspaceIdRef.current === workspace.municipality.identity.id &&
      isEmptyWorkspaceForPersistenceGuard(workspace)
    ) {
      setPersistenceMessage(null);
      return;
    }

    protectedEmptyWorkspaceIdRef.current = null;
    const saved = saveWorkspaceToLocalStorage(workspace);
    setPersistenceMessage(saved ? null : WORKSPACE_PERSISTENCE_FAILURE_MESSAGE);
  }, [workspace]);

  const runtime = useMemo(
    () => createMunicipalityRuntime({ workspace }),
    [workspace]
  );

  // ── Estado Territorial Evolutivo — historial acumulativo ────────────────
  // Appends a compact snapshot each time the evidence version changes.
  // Loop-safe: version = evidenceStore.updatedAt, which is NOT modified here.
  // Max 50 entries per municipality (oldest are dropped first).
  useEffect(() => {
    const version = runtime.mit.version;
    const last = (workspace.historialEstadosTerritorial ?? []).at(-1);
    if (runtime.mit.totalEvidencias > 0 && last?.version !== version) {
      const resumen = buildEstadoResumen(runtime.mit);
      setWorkspace((prev) => ({
        ...prev,
        historialEstadosTerritorial: [
          ...(prev.historialEstadosTerritorial ?? []).slice(-49),
          resumen,
        ],
      }));
    }
  }, [runtime.mit.version]); // eslint-disable-line react-hooks/exhaustive-deps

  const municipalInventory = useMemo(() => {
    const snapshot = createMunicipalSnapshot(workspace);
    return createMunicipalInventory(snapshot);
  }, [workspace]);

  // runtime.psl is built inside MunicipalityRuntime as the canonical Nivel 2 → Nivel 3 bridge.

  // ── PSL lifecycle actions ────────────────────────────────────────────────────

  const handleValidatePSL = useCallback((validatedBy: string) => {
    const now = new Date().toISOString();
    const validatedPSL = {
      ...runtime.psl,
      status: "validated" as const,
      validatedAt: now,
      validatedBy: validatedBy.trim() || "Equipo técnico",
    };
    setWorkspace((prev) => ({
      ...prev,
      validatedPSL,
      updatedAt: now,
    }));
  }, [runtime.psl]);

  const handleInvalidatePSL = useCallback(() => {
    setWorkspace((prev) => {
      const { validatedPSL: _removed, ...rest } = prev;
      return { ...rest, updatedAt: new Date().toISOString() };
    });
  }, []);

  const handleEditPSLConclusion = useCallback((content: string) => {
    setWorkspace((prev) => {
      if (!prev.validatedPSL) return prev;
      return {
        ...prev,
        validatedPSL: {
          ...prev.validatedPSL,
          conclusiones: { ...prev.validatedPSL.conclusiones, content, status: "authored" as const },
        },
        updatedAt: new Date().toISOString(),
      };
    });
  }, []);

  const handleEditPSLRecomendaciones = useCallback((content: string) => {
    setWorkspace((prev) => {
      if (!prev.validatedPSL) return prev;
      return {
        ...prev,
        validatedPSL: {
          ...prev.validatedPSL,
          recomendaciones: { ...prev.validatedPSL.recomendaciones, content, status: "authored" as const },
        },
        updatedAt: new Date().toISOString(),
      };
    });
  }, []);

  const handleDocumentarDeliberacion = useCallback((nota: string) => {
    setWorkspace((prev) => {
      if (!prev.validatedPSL) return prev;
      const consenso = nota.trim().length > 0;
      return {
        ...prev,
        validatedPSL: {
          ...prev.validatedPSL,
          priorizacion: {
            ...prev.validatedPSL.priorizacion,
            deliberacionNota: nota,
            consensoDocumentado: consenso,
          },
          priorizacionStatus: consenso ? "complete" as const : prev.validatedPSL.priorizacionStatus,
        },
        updatedAt: new Date().toISOString(),
      };
    });
  }, []);

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

  const allMunicipalities = useMemo(
    () => [...DEMO_MUNICIPALITIES, ...customMunicipalities],
    [customMunicipalities]
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
        source: {
          system: "Carga directa de fuente documental primaria",
          collectedAt: new Date().toISOString(),
        },
        sourceFileName: file.name,
        tags: ["health-report", "primary-source"],
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

      const hrAtoms = healthReportToEvidenceAtoms(healthReport);
      setWorkspace((prev) => ({
        ...prev,
        repository: replaceMunicipalDocumentByKind(prev.repository, newDocInput),
        healthReport,
        evidenceStore: {
          ...prev.evidenceStore,
          atoms: [
            ...prev.evidenceStore.atoms.filter(
              (a) => a.provenance.origin !== "health-report"
            ),
            ...hrAtoms,
          ],
          updatedAt: new Date().toISOString(),
        },
        updatedAt: new Date().toISOString(),
      }));
      setLastHealthReportMessage(
        `Informe de Salud cargado: ${hrAtoms.length} sección(es) incorporada(s) al análisis territorial.`
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
      const { aggregates, methodologicalCautions, warnings } = parseIBSECSV(text);
      const documentId = crypto.randomUUID();
      const study = createIBSEStudy({
        municipalityId: workspace.municipality.identity.id,
        sourceFileName: file.name,
        aggregates,
        methodologicalCautions,
      });
      const ibseAtoms = attachDocumentIdToAtoms(
        ibseStudyToEvidenceAtoms(study),
        documentId
      );
      setWorkspace((prev) => {
        const now = new Date().toISOString();
        const repositoryWithoutPrior = removeDocumentsByTag(
          prev.repository,
          IBSE_DOCUMENT_TAG
        );
        const nextRepository = addMunicipalDocument(repositoryWithoutPrior, {
          id: documentId,
          kind: "redcap-export",
          title: `IBSE - ${file.name}`,
          source: {
            system: "Importación REDCap IBSE",
            collectedAt: study.createdAt,
          },
          sourceFileName: file.name,
          tags: ["redcap-export", IBSE_DOCUMENT_TAG],
        });
        let nextStore = {
          ...prev.evidenceStore,
          atoms: prev.evidenceStore.atoms.filter(
            (atom) =>
              atom.municipalityId !== prev.municipality.identity.id ||
              atom.provenance.origin !== "ibse"
          ),
          updatedAt: now,
        };
        for (const atom of ibseAtoms) {
          const key = stableAssetKey(atom.municipalityId, atom.provenance.origin, atom.title);
          nextStore = upsertEvidenceAtom(nextStore, atom, key);
        }
        return {
          ...prev,
          repository: nextRepository,
          ibseStudy: study,
          evidenceStore: nextStore,
          updatedAt: now,
        };
      });
      const warn = warnings.length > 0 ? ` Avisos: ${warnings.join(" ")}` : "";
      setIbseMessage(
        aggregates.nValid > 0
          ? `IBSE cargado: ${aggregates.nValid} registros válidos · Media total: ${aggregates.meanTotal} · ${ibseAtoms.length} indicadores incorporados al análisis territorial.${warn}`
          : `CSV procesado sin registros válidos.${warn}`
      );
    } catch {
      setIbseMessage("Error al procesar el CSV. Verifica que sea una exportación REDCap válida.");
    } finally {
      setIsLoadingIBSE(false);
    }
  }

  async function handleLoadDUKECSV(file: File): Promise<void> {
    setIsLoadingDUKE(true);
    try {
      const text = await file.text();
      const { aggregates, methodologicalCautions, warnings } = parseDUKECSV(text);
      const documentId = crypto.randomUUID();
      const study = createDUKEStudy({
        municipalityId: workspace.municipality.identity.id,
        sourceFileName: file.name,
        aggregates,
        methodologicalCautions,
        warnings,
      });
      const dukeAtoms = attachDocumentIdToAtoms(
        dukeStudyToEvidenceAtoms(study),
        documentId
      );
      setWorkspace((prev) => {
        const now = new Date().toISOString();
        const repositoryWithoutPrior = removeDocumentsByTag(
          prev.repository,
          DUKE_DOCUMENT_TAG
        );
        const nextRepository = addMunicipalDocument(repositoryWithoutPrior, {
          id: documentId,
          kind: "redcap-export",
          title: `DUKE-EAS - ${file.name}`,
          source: {
            system: "Importacion CSV DUKE-EAS",
            collectedAt: study.createdAt,
          },
          sourceFileName: file.name,
          tags: ["redcap-export", DUKE_DOCUMENT_TAG, "eas", "complementary-study"],
        });
        let nextStore = {
          ...prev.evidenceStore,
          atoms: prev.evidenceStore.atoms.filter(
            (atom) =>
              atom.municipalityId !== prev.municipality.identity.id ||
              !(
                atom.provenance.origin === "complementary-study" &&
                atom.tags.includes(DUKE_DOCUMENT_TAG)
              )
          ),
          updatedAt: now,
        };
        for (const atom of dukeAtoms) {
          const key = stableAssetKey(atom.municipalityId, atom.provenance.origin, atom.title);
          nextStore = upsertEvidenceAtom(nextStore, atom, key);
        }
        return {
          ...prev,
          repository: nextRepository,
          dukeStudy: study,
          evidenceStore: nextStore,
          updatedAt: now,
        };
      });
      const warn = warnings.length > 0 ? ` Avisos: ${warnings.join(" ")}` : "";
      setDukeMessage(
        aggregates.nValidGlobal > 0
          ? `DUKE-EAS cargado: ${aggregates.nValidGlobal} registros globales validos de ${aggregates.n}. Apoyo bajo global: ${aggregates.lowGlobalPercentage.toFixed(1)} %. ${dukeAtoms.length} evidencias incorporadas.${warn}`
          : `CSV DUKE-EAS procesado sin registros globales completos.${warn}`
      );
    } catch {
      setDukeMessage("Error al procesar el CSV. Verifica que incluya las columnas EAS P5701..P5711 con valores 1..5.");
    } finally {
      setIsLoadingDUKE(false);
    }
  }

  async function handleLoadPREDIMEDCSV(file: File): Promise<void> {
    setIsLoadingPREDIMED(true);
    try {
      const text = await file.text();
      const { aggregates, methodologicalCautions, warnings } = parsePREDIMEDCSV(text);
      const documentId = crypto.randomUUID();
      const study = createPREDIMEDStudy({
        municipalityId: workspace.municipality.identity.id,
        sourceFileName: file.name,
        aggregates,
        methodologicalCautions,
        warnings,
      });
      const predimedAtoms = attachDocumentIdToAtoms(
        predimedStudyToEvidenceAtoms(study),
        documentId
      );
      setWorkspace((prev) => {
        const now = new Date().toISOString();
        const repositoryWithoutPrior = removeDocumentsByTag(
          prev.repository,
          PREDIMED_DOCUMENT_TAG
        );
        const nextRepository = addMunicipalDocument(repositoryWithoutPrior, {
          id: documentId,
          kind: "redcap-export",
          title: `PREDIMED-EAS - ${file.name}`,
          source: {
            system: "Importacion CSV PREDIMED-EAS",
            collectedAt: study.createdAt,
          },
          sourceFileName: file.name,
          tags: ["redcap-export", PREDIMED_DOCUMENT_TAG, "eas", "complementary-study"],
        });
        let nextStore = {
          ...prev.evidenceStore,
          atoms: prev.evidenceStore.atoms.filter(
            (atom) =>
              atom.municipalityId !== prev.municipality.identity.id ||
              !(
                atom.provenance.origin === "complementary-study" &&
                atom.tags.includes(PREDIMED_DOCUMENT_TAG)
              )
          ),
          updatedAt: now,
        };
        for (const atom of predimedAtoms) {
          const key = stableAssetKey(atom.municipalityId, atom.provenance.origin, atom.title);
          nextStore = upsertEvidenceAtom(nextStore, atom, key);
        }
        return {
          ...prev,
          repository: nextRepository,
          predimedStudy: study,
          evidenceStore: nextStore,
          updatedAt: now,
        };
      });
      const warn = warnings.length > 0 ? ` Avisos: ${warnings.join(" ")}` : "";
      setPredimedMessage(
        aggregates.nValid > 0
          ? `PREDIMED-EAS cargado: ${aggregates.nValid} registros validos de ${aggregates.n}. Alta adherencia: ${aggregates.highPercentage.toFixed(1)} %. ${predimedAtoms.length} evidencias incorporadas.${warn}`
          : `CSV PREDIMED-EAS procesado sin registros completos.${warn}`
      );
    } catch {
      setPredimedMessage("Error al procesar el CSV. Verifica que incluya la columna Predimed o P36BPD01_2023..P36BPD14_2023.");
    } finally {
      setIsLoadingPREDIMED(false);
    }
  }

  async function handleLoadSF12CSV(file: File): Promise<void> {
    setIsLoadingSF12(true);
    try {
      const text = await file.text();
      const { aggregates, methodologicalCautions, warnings } = parseSF12CSV(text);
      const documentId = crypto.randomUUID();
      const study = createSF12Study({
        municipalityId: workspace.municipality.identity.id,
        sourceFileName: file.name,
        aggregates,
        methodologicalCautions,
        warnings,
      });
      const sf12Atoms = attachDocumentIdToAtoms(
        sf12StudyToEvidenceAtoms(study),
        documentId
      );
      setWorkspace((prev) => {
        const now = new Date().toISOString();
        const repositoryWithoutPrior = removeDocumentsByTag(
          prev.repository,
          SF12_DOCUMENT_TAG
        );
        const nextRepository = addMunicipalDocument(repositoryWithoutPrior, {
          id: documentId,
          kind: "redcap-export",
          title: `SF-12 EAS - ${file.name}`,
          source: {
            system: "Importacion CSV SF-12 EAS",
            collectedAt: study.createdAt,
          },
          sourceFileName: file.name,
          tags: ["redcap-export", SF12_DOCUMENT_TAG, "eas", "complementary-study"],
        });
        let nextStore = {
          ...prev.evidenceStore,
          atoms: prev.evidenceStore.atoms.filter(
            (atom) =>
              atom.municipalityId !== prev.municipality.identity.id ||
              !(
                atom.provenance.origin === "complementary-study" &&
                atom.tags.includes(SF12_DOCUMENT_TAG)
              )
          ),
          updatedAt: now,
        };
        for (const atom of sf12Atoms) {
          const key = stableAssetKey(atom.municipalityId, atom.provenance.origin, atom.title);
          nextStore = upsertEvidenceAtom(nextStore, atom, key);
        }
        return {
          ...prev,
          repository: nextRepository,
          sf12Study: study,
          evidenceStore: nextStore,
          updatedAt: now,
        };
      });
      const warn = warnings.length > 0 ? ` Avisos: ${warnings.join(" ")}` : "";
      setSf12Message(
        aggregates.nValidPCS > 0
          ? `SF-12 EAS cargado: ${aggregates.nValidPCS} registros válidos de ${aggregates.n}. PCS media: ${aggregates.meanPCS.toFixed(1)} / MCS media: ${aggregates.meanMCS.toFixed(1)}. ${sf12Atoms.length} evidencias incorporadas.${warn}`
          : `CSV SF-12 EAS procesado sin registros válidos.${warn}`
      );
    } catch {
      setSf12Message("Error al procesar el CSV. Verifica que incluya las columnas PCS12_SP y MCS12_SP.");
    } finally {
      setIsLoadingSF12(false);
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
    const thematicDocument = workspace.repository.documents.find(
      (document) => isThematicPrioritisationDocument(document)
    );
    const rawTpAtoms = thematicPrioritisationToEvidenceAtoms(prioritisation, THEMATIC_TOPICS);
    const tpAtoms =
      thematicDocument !== undefined
        ? attachDocumentIdToAtoms(rawTpAtoms, thematicDocument.id)
        : rawTpAtoms;
    const nextWorkspace = {
      ...workspace,
      thematicPrioritisation: prioritisation,
      evidenceStore: {
        ...workspace.evidenceStore,
        atoms: [
          ...workspace.evidenceStore.atoms.filter(
            (a) => a.provenance.origin !== "citizen-participation"
          ),
          ...tpAtoms,
        ],
        updatedAt: new Date().toISOString(),
      },
      updatedAt: new Date().toISOString(),
    };

    setWorkspace(nextWorkspace);
    setPendingTopics([...prioritisation.selectedTopicIds]);
    setPersistenceMessage(
      saveWorkspaceToLocalStorage(nextWorkspace)
        ? null
        : WORKSPACE_PERSISTENCE_FAILURE_MESSAGE
    );
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
      const documentId = crypto.randomUUID();
      const study: ThematicPrioritisationStudy = {
        ...partialStudy,
        municipalityId: workspace.municipality.identity.id,
        importedAt: new Date().toISOString(),
      };
      const importedPrioritisation =
        study.completeRecords > 0
          ? createThematicPrioritisation(workspace.municipality.identity.id, study.topFiveTopicIds)
          : null;
      const importedTpAtoms =
        importedPrioritisation !== null
          ? attachDocumentIdToAtoms(
              thematicPrioritisationToEvidenceAtoms(importedPrioritisation, THEMATIC_TOPICS),
              documentId
            )
          : null;
      setWorkspace((prev) => {
        const now = new Date().toISOString();
        const shouldRegisterDocument = study.completeRecords > 0;
        const nextRepository =
          shouldRegisterDocument
            ? addMunicipalDocument(
                removeDocumentsByTag(
                  prev.repository,
                  THEMATIC_PRIORITISATION_DOCUMENT_TAG
                ),
                {
                  id: documentId,
                  kind: "redcap-export",
                  title: `Priorización temática - ${file.name}`,
                  source: {
                    system: "Importación REDCap Priorización temática",
                    collectedAt: study.importedAt,
                  },
                  sourceFileName: file.name,
                  tags: ["redcap-export", THEMATIC_PRIORITISATION_DOCUMENT_TAG],
                }
              )
            : prev.repository;

        return {
          ...prev,
          repository: nextRepository,
          thematicPrioritisationStudy: study,
          ...(importedPrioritisation !== null && {
            thematicPrioritisation: importedPrioritisation,
          }),
          ...(importedTpAtoms !== null && {
            evidenceStore: {
              ...prev.evidenceStore,
              atoms: [
                ...prev.evidenceStore.atoms.filter(
                  (atom) =>
                    atom.municipalityId !== prev.municipality.identity.id ||
                    atom.provenance.origin !== "citizen-participation"
                ),
                ...importedTpAtoms,
              ],
              updatedAt: now,
            },
          }),
          updatedAt: now,
        };
      });
      if (study.completeRecords > 0) {
        setPendingTopics([...study.topFiveTopicIds]);
      }
      const warnText = warnings.length > 0 ? ` Avisos: ${warnings.join(" ")}` : "";
      setTpImportMessage(
        study.completeRecords > 0
          ? `CSV importado: ${study.completeRecords} papeletas completas de ${study.totalRecords} registros. Top 5 aplicado automáticamente como selección temática.${warnText}`
          : `CSV procesado sin papeletas completas. No se ha aplicado selección temática.${warnText}`
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

  function handleDeleteDocument(documentId: string) {
    const deletedDocument = workspace.repository.documents.find((d) => d.id === documentId);

    setLastProcessedDocument((prev) => (prev?.id === documentId ? null : prev));
    if (lastProcessedDocument?.id === documentId) {
      setLastAtomCount(0);
    }
    if (deletedDocument?.kind === "health-report") {
      setLastHealthReportMessage(null);
      setIsLoadingHealthReport(false);
    }
    if (isIBSEDocument(deletedDocument)) {
      setIbseMessage(null);
      setIsLoadingIBSE(false);
    }
    if (isDUKEDocument(deletedDocument)) {
      setDukeMessage(null);
      setIsLoadingDUKE(false);
    }
    if (isPREDIMEDDocument(deletedDocument)) {
      setPredimedMessage(null);
      setIsLoadingPREDIMED(false);
    }
    if (isSF12Document(deletedDocument)) {
      setSf12Message(null);
      setIsLoadingSF12(false);
    }
    if (isThematicPrioritisationDocument(deletedDocument)) {
      setTpImportMessage(null);
      setPendingTopics([]);
    }

    setWorkspace((prev) => {
      const doc = prev.repository.documents.find((d) => d.id === documentId);
      const municipalityId = prev.municipality.identity.id;
      const deletesHealthReport = doc?.kind === "health-report";
      const deletesCommunityAssets = doc?.kind === "community-asset";
      const deletesIBSE = isIBSEDocument(doc);
      const deletesDUKE = isDUKEDocument(doc);
      const deletesPREDIMED = isPREDIMEDDocument(doc);
      const deletesSF12 = isSF12Document(doc);
      const deletesThematicPrioritisation = isThematicPrioritisationDocument(doc);

      return {
        ...prev,
        repository: removeMunicipalDocument(prev.repository, documentId),
        evidenceStore: {
          ...prev.evidenceStore,
          atoms: prev.evidenceStore.atoms.filter(
            (atom) => {
              if (atom.municipalityId !== municipalityId) return true;
              if (atom.provenance.documentId === documentId) return false;
              if (deletesHealthReport && atom.provenance.origin === "health-report") return false;
              if (deletesCommunityAssets && atom.provenance.origin === "community-assets") return false;
              if (deletesIBSE && atom.provenance.origin === "ibse") return false;
              if (
                deletesDUKE &&
                atom.provenance.origin === "complementary-study" &&
                atom.tags.includes(DUKE_DOCUMENT_TAG)
              ) {
                return false;
              }
              if (
                deletesPREDIMED &&
                atom.provenance.origin === "complementary-study" &&
                atom.tags.includes(PREDIMED_DOCUMENT_TAG)
              ) {
                return false;
              }
              if (
                deletesSF12 &&
                atom.provenance.origin === "complementary-study" &&
                atom.tags.includes(SF12_DOCUMENT_TAG)
              ) {
                return false;
              }
              if (
                deletesThematicPrioritisation &&
                atom.provenance.origin === "citizen-participation"
              ) {
                return false;
              }
              return true;
            }
          ),
          updatedAt: new Date().toISOString(),
        },
        healthReport: deletesHealthReport ? undefined : prev.healthReport,
        ibseStudy: deletesIBSE ? undefined : prev.ibseStudy,
        dukeStudy: deletesDUKE ? undefined : prev.dukeStudy,
        predimedStudy: deletesPREDIMED ? undefined : prev.predimedStudy,
        sf12Study: deletesSF12 ? undefined : prev.sf12Study,
        thematicPrioritisation: deletesThematicPrioritisation
          ? undefined
          : prev.thematicPrioritisation,
        thematicPrioritisationStudy: deletesThematicPrioritisation
          ? undefined
          : prev.thematicPrioritisationStudy,
        updatedAt: new Date().toISOString(),
      };
    });
  }

  function switchToMunicipality(
    municipalityId: string,
    input: CreateMunicipalityContextInput
  ) {
    const nextWorkspaceLoad = loadOrCreateMunicipalityWorkspace(municipalityId, input);
    const nextWorkspace = nextWorkspaceLoad.workspace;
    protectedEmptyWorkspaceIdRef.current = nextWorkspaceLoad.protectExistingStorage
      ? municipalityId
      : null;

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
    setDukeMessage(null);
    setIsLoadingDUKE(false);
    setPredimedMessage(null);
    setIsLoadingPREDIMED(false);
    setSf12Message(null);
    setIsLoadingSF12(false);
    setShowMunicipalitySelector(false);
    setIsThematicModalOpen(false);
    setIsImportingTP(false);
    setTpImportMessage(null);
  }

  function handleChangeMunicipality(municipalityId: string) {
    const muni = allMunicipalities.find((m) => m.id === municipalityId);
    if (muni === undefined) return;
    switchToMunicipality(municipalityId, muni);
  }

  function handleAddMunicipality(name: string, province: string, type: string) {
    const id = slugifyMunicipalityId(name);

    const existing = allMunicipalities.find((m) => m.id === id);
    if (existing) {
      switchToMunicipality(id, existing);
      return;
    }

    const newMuni: CreateMunicipalityContextInput = {
      id,
      name: name.trim(),
      province: province.trim() || "Granada",
      territorialType: type || "municipio",
      createdBy: "Usuario",
    };

    const updatedCustom = [...customMunicipalities, newMuni];
    setCustomMunicipalities(updatedCustom);
    try {
      localStorage.setItem(CUSTOM_MUNICIPALITIES_KEY, JSON.stringify(updatedCustom));
    } catch {
      // localStorage lleno o deshabilitado
    }
    switchToMunicipality(id, newMuni);
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
            {municipality.territorialType && municipality.territorialType !== "municipio" && (
              <>
                <span className="app-nav__municipality-sep">·</span>
                <span>{TERRITORIAL_TYPE_LABEL[municipality.territorialType] ?? municipality.territorialType}</span>
              </>
            )}
            <span className="app-nav__municipality-sep">·</span>
            <span>Plan Local de Salud 2027–2030</span>
            {municipality.ineCode && (
              <>
                <span className="app-nav__municipality-sep">·</span>
                <span>INE {municipality.ineCode}</span>
              </>
            )}
            {DEMO_MUNICIPALITIES.some((m) => m.id === municipality.id) && (
              <span className="app-nav__municipality-badge">Demostración</span>
            )}
            <button
              type="button"
              className="app-nav__municipality-btn"
              onClick={() => setShowMunicipalitySelector((v) => !v)}
            >
              {showMunicipalitySelector ? "Cerrar ▲" : "Cambiar ámbito ▾"}
            </button>
          </div>
        </div>
      </nav>

      <main className="app-shell">
        {persistenceMessage !== null && (
          <div className="app-persistence-warning" role="alert">
            {persistenceMessage}
          </div>
        )}

        {/* Selector de municipio (se muestra sobre cualquier vista) */}
        {showMunicipalitySelector && (
          <section className="municipality-selector">
            <p className="municipality-selector__warning">
              Cambiar de ámbito territorial reiniciará el espacio de trabajo
              local actual. Los documentos y evidencias de esta sesión se
              eliminarán.
            </p>
            <div className="municipality-selector__options">
              {allMunicipalities.map((m) => (
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
                    {m.province}
                    {m.territorialType && m.territorialType !== "municipio"
                      ? ` · ${TERRITORIAL_TYPE_LABEL[m.territorialType] ?? m.territorialType}`
                      : ""}
                    {m.ineCode ? ` · INE ${m.ineCode}` : ""}
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

            {/* Formulario de nuevo ámbito territorial */}
            <div className="municipality-add">
              <p className="municipality-add__label">Añadir ámbito territorial</p>
              <div className="municipality-add__row">
                <input
                  type="text"
                  className="municipality-add__input"
                  placeholder="Nombre del ámbito"
                  value={newMuniName}
                  onChange={(e) => {
                    setNewMuniName(e.target.value);
                    setNewMuniError(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const name = newMuniName.trim();
                      if (!name) { setNewMuniError("Introduce un nombre."); return; }
                      handleAddMunicipality(name, newMuniProvince, newMuniType);
                      setNewMuniName("");
                      setNewMuniProvince("");
                      setNewMuniType("municipio");
                    }
                  }}
                />
                <input
                  type="text"
                  className="municipality-add__input municipality-add__input--sm"
                  placeholder="Provincia (Granada)"
                  value={newMuniProvince}
                  onChange={(e) => setNewMuniProvince(e.target.value)}
                />
                <select
                  className="municipality-add__input municipality-add__input--sm"
                  value={newMuniType}
                  onChange={(e) => setNewMuniType(e.target.value)}
                >
                  {TERRITORIAL_TYPE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <button
                  type="button"
                  className="municipality-add__btn"
                  onClick={() => {
                    const name = newMuniName.trim();
                    if (!name) { setNewMuniError("Introduce un nombre."); return; }
                    handleAddMunicipality(name, newMuniProvince, newMuniType);
                    setNewMuniName("");
                    setNewMuniProvince("");
                    setNewMuniType("municipio");
                  }}
                >
                  Añadir
                </button>
              </div>
              {newMuniError && (
                <p className="municipality-add__error">{newMuniError}</p>
              )}
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
            <div className="workspace-divider">
              <span className="workspace-divider-label">
                Perfil de Salud Local
              </span>
            </div>
            <LocalHealthProfilePanel />
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
              onDelete={handleDeleteDocument}
            />
            <EvidenceStorePanel
              evidenceStore={runtime.workspace.evidenceStore}
            />
            {/* ── Fuentes de evidencia ─────────────────────── */}
            <div className="fde-section-divider">
              <span className="fde-section-divider__text">Fuentes de evidencia</span>
            </div>
            <HealthReportViewer
              healthReport={runtime.workspace.healthReport}
            />
            <EstudiosComplementariosPanel
              ibseStudy={runtime.workspace.ibseStudy}
              isLoadingIBSE={isLoadingIBSE}
              ibseMessage={ibseMessage}
              onLoadIBSECSV={handleLoadIBSECSV}
              dukeStudy={runtime.workspace.dukeStudy}
              isLoadingDUKE={isLoadingDUKE}
              dukeMessage={dukeMessage}
              onLoadDUKECSV={handleLoadDUKECSV}
              predimedStudy={runtime.workspace.predimedStudy}
              isLoadingPREDIMED={isLoadingPREDIMED}
              predimedMessage={predimedMessage}
              onLoadPREDIMEDCSV={handleLoadPREDIMEDCSV}
              sf12Study={runtime.workspace.sf12Study}
              isLoadingSF12={isLoadingSF12}
              sf12Message={sf12Message}
              onLoadSF12CSV={handleLoadSF12CSV}
            />
            <QuestionnaireBuilderPanel />
          </>
        )}

        {/* ── ③ Análisis territorial ──────────────────────── */}
        {/* ── ③ Análisis territorial — solo interpretación (Nivel 2) ── */}
        {view === "analisis" && (
          <>
            <PipelineTracePanel pipeline={runtime.pipeline} />
            <LT1Panel lt1={runtime.lt1} />
            <OITPanel oit={runtime.oit} />
            <ReconciliacionPanel reconciliacion={runtime.reconciliacion} />
          </>
        )}

        {/* ── ④ Perfil de Salud Local ──────────────────────── */}
        {view === "psl" && (
          <LocalHealthProfileView
            psl={runtime.psl}
            pslIsStale={runtime.pslIsStale}
            municipalityName={municipality.name}
            onValidate={handleValidatePSL}
            onInvalidate={handleInvalidatePSL}
            onEditConclusion={handleEditPSLConclusion}
            onEditRecomendaciones={handleEditPSLRecomendaciones}
            onDocumentarDeliberacion={handleDocumentarDeliberacion}
          />
        )}

        {/* ── ⑤ Priorizaciones — técnica y participativa ──────── */}
        {view === "priorizacion" && (
          <>
            <section className="workspace-panel">
              <p className="eyebrow">Capa deliberativa</p>
              <h2>Priorizaciones</h2>
              <p className="panel-note">
                La priorización articula el diagnóstico territorial con la orientación
                para la acción. Integra dos fuentes complementarias: las candidaturas
                técnicas derivadas del Perfil de Salud Local y las preferencias
                expresadas por la ciudadanía. Ninguna prevalece automáticamente sobre
                la otra; la deliberación del equipo técnico y la comunidad decide.
              </p>
            </section>
            <PrioritizationPanel
              prioritization={runtime.prioritization}
              pslStatus={runtime.psl.status}
              pslIsStale={runtime.pslIsStale}
            />
            <ThematicPrioritisationPanel
              savedIds={
                runtime.workspace.thematicPrioritisation?.selectedTopicIds ?? []
              }
              onOpen={handleOpenThematicModal}
            />
          </>
        )}

        {/* ── ⑥ Plan Local de Salud — encaje EPVSA + plan + agenda + seguimiento */}
        {view === "plan" && (
          <>
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
