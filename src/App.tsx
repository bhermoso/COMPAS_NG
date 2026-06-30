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
import { hasPSLHumanContent } from "./application/health-profile";
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
import { parseSuenoCSV, suenoStudyToEvidenceAtoms } from "./application/sueno";
import { createSuenoStudy } from "./domain/sueno";
import { parseCAGECSV, cageStudyToEvidenceAtoms } from "./application/cage";
import { createCAGEStudy } from "./domain/cage";
import { stableAssetKey, upsertEvidenceAtom, type EvidenceAtom } from "./domain/evidence";
import {
  THEMATIC_TOPICS,
  MAX_SELECTED_TOPICS,
  createThematicPrioritisation,
} from "./domain/thematic-prioritisation";
import { createMunicipalSnapshot } from "./domain/municipality-context";
import { createMunicipalInventory } from "./application/municipal-inventory";

import { parseThematicPrioritisationCSV, thematicPrioritisationToEvidenceAtoms } from "./application/thematic-prioritisation";
import { buildEstadoResumen } from "./application/territorial-interpretation";
import type { ThematicPrioritisationStudy } from "./domain/thematic-prioritisation";
import {
  saveWorkspaceToLocalStorage,
  loadWorkspaceFromLocalStorage,
  hasWorkspaceInLocalStorage,
} from "./infrastructure/persistence/local-storage";

import { compileLocalHealthProfile } from "./application/health-profile-compiler";
import { approvePSL, createFormalValidation } from "./application/institutional-lifecycle";
import { isFormalValidationStale } from "./domain/institutional-lifecycle";

import {
  LocalHealthPlanningCycle,
  DocumentIngestionPanel,
  DocumentRepositoryPanel,
  EvidenceStorePanel,
  HealthReportViewer,
  EstudiosComplementariosPanel,
  MunicipalInventoryPanel,
  LocalHealthProfileView,
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
  { id: "plan",          label: "Elaboración del Plan" },
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
const SUENO_DOCUMENT_TAG = "sueno-eas";
const CAGE_DOCUMENT_TAG = "cage-eas";
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

function isSuenoDocument(document: MunicipalDocument | undefined): boolean {
  return hasDocumentTag(document, SUENO_DOCUMENT_TAG);
}

function isCAGEDocument(document: MunicipalDocument | undefined): boolean {
  return hasDocumentTag(document, CAGE_DOCUMENT_TAG);
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
    workspace.suenoStudy === undefined &&
    workspace.cageStudy === undefined &&
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
  const [isLoadingSueno, setIsLoadingSueno] = useState(false);
  const [suenoMessage, setSuenoMessage] = useState<string | null>(null);
  const [isLoadingCAGE, setIsLoadingCAGE] = useState(false);
  const [cageMessage, setCageMessage] = useState<string | null>(null);
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
      // eslint-disable-next-line react-hooks/set-state-in-effect
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
    if (
      workspace.validatedPSL !== undefined &&
      hasPSLHumanContent(workspace.validatedPSL) &&
      !window.confirm(
        "El Perfil de Salud Local contiene contenido redactado por el equipo técnico " +
        "(conclusiones, cierre interpretativo o deliberación documentada).\n\n" +
        "Al regenerar el perfil, este contenido se perderá definitivamente.\n\n" +
        "¿Descartar el contenido y regenerar el perfil?"
      )
    ) {
      return;
    }
    setWorkspace((prev) => {
      const { validatedPSL: _psl, ...rest } = prev; // eslint-disable-line @typescript-eslint/no-unused-vars
      return { ...rest, updatedAt: new Date().toISOString() };
    });
  }, [workspace.validatedPSL]);

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

  const handleEditPSLCierreInterpretativo = useCallback((content: string) => {
    setWorkspace((prev) => {
      if (!prev.validatedPSL) return prev;
      return {
        ...prev,
        validatedPSL: {
          ...prev.validatedPSL,
          cierreInterpretativo: { ...prev.validatedPSL.cierreInterpretativo, content, status: "authored" as const },
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

  const handleCompilePSL = useCallback(() => {
    setWorkspace((prev) => {
      const psl = prev.validatedPSL;
      if (!psl) return prev;
      const result = compileLocalHealthProfile({
        psl,
        municipalityName: prev.municipality.identity.name,
        municipalityProvince: prev.municipality.identity.province,
        existingArtifactCount: prev.compiledProfiles?.length ?? 0,
      });
      if (!result.ok) return prev;
      return {
        ...prev,
        compiledProfiles: [...(prev.compiledProfiles ?? []), result.artifact],
        updatedAt: new Date().toISOString(),
      };
    });
  }, []);

  const handleApprovePSL = useCallback((
    approvedBy: string,
    approvedByRole: "coordination" | "group-motor",
    approvingBody: string,
  ) => {
    setWorkspace((prev) => {
      const psl = prev.validatedPSL;
      if (!psl) return prev;
      const result = approvePSL({ psl, approvedBy, approvedByRole, approvingBody });
      if (!result.ok) return prev;
      return {
        ...prev,
        validatedPSL: result.approvedPSL,
        pslApproval: result.approvalRecord,
        updatedAt: new Date().toISOString(),
      };
    });
  }, []);

  const handleFormalValidation = useCallback((
    target: "action-plan" | "agenda",
    validatedBy: string,
    validatedByRole: "coordination" | "group-motor",
    externalReference?: string,
  ) => {
    setWorkspace((prev) => {
      const psl = prev.validatedPSL;
      if (!psl) return prev;
      const result = createFormalValidation({ target, psl, validatedBy, validatedByRole, externalReference });
      if (!result.ok) return prev;
      const others = (prev.formalValidations ?? []).filter((r) => r.target !== target);
      return {
        ...prev,
        formalValidations: [...others, result.record],
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

  // PSL validado o aprobado: requisito para que el Nivel 3 (Plan, Agenda, Seguimiento) sea accesible.
  // El estado "approved" es institucionalmente superior a "validated" y también habilita el Nivel 3.
  const pslValidated =
    (runtime.psl.status === "validated" || runtime.psl.status === "approved") &&
    !runtime.pslIsStale;
  const municipality = runtime.workspace.municipality.identity;

  // Estado derivado de validaciones formales del Nivel 3.
  // Independiente de compilación y aprobación del PSL.
  const fvRecordActionPlan = workspace.formalValidations?.find((r) => r.target === "action-plan");
  const actionPlanFormalValidation = fvRecordActionPlan
    ? { validatedAt: fvRecordActionPlan.validatedAt, validatedBy: fvRecordActionPlan.validatedBy, isStale: isFormalValidationStale(fvRecordActionPlan, runtime.psl) }
    : undefined;

  const fvRecordAgenda = workspace.formalValidations?.find((r) => r.target === "agenda");
  const agendaFormalValidation = fvRecordAgenda
    ? { validatedAt: fvRecordAgenda.validatedAt, validatedBy: fvRecordAgenda.validatedBy, isStale: isFormalValidationStale(fvRecordAgenda, runtime.psl) }
    : undefined;


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
          kind: "complementary-study",
          title: `DUKE-EAS - ${file.name}`,
          source: {
            system: "EAS microdatos — Apoyo social funcional (DUKE-UNC-11)",
            collectedAt: study.createdAt,
          },
          sourceFileName: file.name,
          tags: ["complementary-study", DUKE_DOCUMENT_TAG, "eas"],
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
          kind: "complementary-study",
          title: `PREDIMED-EAS - ${file.name}`,
          source: {
            system: "EAS microdatos — Adherencia dieta mediterránea (PREDIMED-14)",
            collectedAt: study.createdAt,
          },
          sourceFileName: file.name,
          tags: ["complementary-study", PREDIMED_DOCUMENT_TAG, "eas"],
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
          kind: "complementary-study",
          title: `SF-12 EAS - ${file.name}`,
          source: {
            system: "EAS microdatos — Salud percibida SF-12 (Vilagut et al. 2008)",
            collectedAt: study.createdAt,
          },
          sourceFileName: file.name,
          tags: ["complementary-study", SF12_DOCUMENT_TAG, "eas"],
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

  async function handleLoadSuenoCSV(file: File): Promise<void> {
    setIsLoadingSueno(true);
    try {
      const text = await file.text();
      const { aggregates, methodologicalCautions, warnings } = parseSuenoCSV(text);
      const documentId = crypto.randomUUID();
      const study = createSuenoStudy({
        municipalityId: workspace.municipality.identity.id,
        sourceFileName: file.name,
        aggregates,
        methodologicalCautions,
        warnings,
      });
      const suenoAtoms = attachDocumentIdToAtoms(
        suenoStudyToEvidenceAtoms(study),
        documentId
      );
      setWorkspace((prev) => {
        const now = new Date().toISOString();
        const repositoryWithoutPrior = removeDocumentsByTag(
          prev.repository,
          SUENO_DOCUMENT_TAG
        );
        const nextRepository = addMunicipalDocument(repositoryWithoutPrior, {
          id: documentId,
          kind: "complementary-study",
          title: `Sueño EAS - ${file.name}`,
          source: {
            system: "EAS microdatos — Sueño (P33_R / P33A)",
            collectedAt: study.createdAt,
          },
          sourceFileName: file.name,
          tags: ["complementary-study", SUENO_DOCUMENT_TAG, "eas"],
        });
        let nextStore = {
          ...prev.evidenceStore,
          atoms: prev.evidenceStore.atoms.filter(
            (atom) =>
              atom.municipalityId !== prev.municipality.identity.id ||
              !(
                atom.provenance.origin === "complementary-study" &&
                atom.tags.includes(SUENO_DOCUMENT_TAG)
              )
          ),
          updatedAt: now,
        };
        for (const atom of suenoAtoms) {
          const key = stableAssetKey(atom.municipalityId, atom.provenance.origin, atom.title);
          nextStore = upsertEvidenceAtom(nextStore, atom, key);
        }
        return {
          ...prev,
          repository: nextRepository,
          suenoStudy: study,
          evidenceStore: nextStore,
          updatedAt: now,
        };
      });
      const warn = warnings.length > 0 ? ` Avisos: ${warnings.join(" ")}` : "";
      setSuenoMessage(
        aggregates.nValidP33R > 0
          ? `Sueño EAS cargado: ${aggregates.nValidP33R} registros P33_R válidos de ${aggregates.n}. Sueño insuficiente: ${aggregates.pctInsufficientSleep.toFixed(1)} %. ${suenoAtoms.length} evidencias incorporadas.${warn}`
          : `CSV Sueño EAS procesado sin registros P33_R válidos.${warn}`
      );
    } catch {
      setSuenoMessage("Error al procesar el CSV. Verifica que incluya la columna P33_R.");
    } finally {
      setIsLoadingSueno(false);
    }
  }

  async function handleLoadCAGECSV(file: File): Promise<void> {
    setIsLoadingCAGE(true);
    try {
      const text = await file.text();
      const { aggregates, methodologicalCautions, warnings } = parseCAGECSV(text);
      const documentId = crypto.randomUUID();
      const study = createCAGEStudy({
        municipalityId: workspace.municipality.identity.id,
        sourceFileName: file.name,
        aggregates,
        methodologicalCautions,
        warnings,
      });
      const cageAtoms = attachDocumentIdToAtoms(
        cageStudyToEvidenceAtoms(study),
        documentId
      );
      setWorkspace((prev) => {
        const now = new Date().toISOString();
        const repositoryWithoutPrior = removeDocumentsByTag(
          prev.repository,
          CAGE_DOCUMENT_TAG
        );
        const nextRepository = addMunicipalDocument(repositoryWithoutPrior, {
          id: documentId,
          kind: "complementary-study",
          title: `CAGE-EAS - ${file.name}`,
          source: {
            system: "EAS microdatos — Consumo de alcohol (CAGE_R / CAGE)",
            collectedAt: study.createdAt,
          },
          sourceFileName: file.name,
          tags: ["complementary-study", CAGE_DOCUMENT_TAG, "eas"],
        });
        let nextStore = {
          ...prev.evidenceStore,
          atoms: prev.evidenceStore.atoms.filter(
            (atom) =>
              atom.municipalityId !== prev.municipality.identity.id ||
              !(
                atom.provenance.origin === "complementary-study" &&
                atom.tags.includes(CAGE_DOCUMENT_TAG)
              )
          ),
          updatedAt: now,
        };
        for (const atom of cageAtoms) {
          const key = stableAssetKey(atom.municipalityId, atom.provenance.origin, atom.title);
          nextStore = upsertEvidenceAtom(nextStore, atom, key);
        }
        return {
          ...prev,
          repository: nextRepository,
          cageStudy: study,
          evidenceStore: nextStore,
          updatedAt: now,
        };
      });
      const warn = warnings.length > 0 ? ` Avisos: ${warnings.join(" ")}` : "";
      setCageMessage(
        aggregates.nValidCAGER > 0
          ? `CAGE-EAS cargado: ${aggregates.nValidCAGER} registros CAGE_R válidos de ${aggregates.n}. Riesgo de alcoholismo: ${aggregates.pctRisk.toFixed(1)} % (n=${aggregates.nRisk}). ${cageAtoms.length} evidencias incorporadas.${warn}`
          : `CSV CAGE-EAS procesado sin registros CAGE_R válidos.${warn}`
      );
    } catch {
      setCageMessage("Error al procesar el CSV. Verifica que incluya la columna CAGE_R.");
    } finally {
      setIsLoadingCAGE(false);
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
    const existingDocument = workspace.repository.documents.find(
      (document) => isThematicPrioritisationDocument(document)
    );

    let nextRepository = workspace.repository;
    let documentId: string;

    if (existingDocument !== undefined) {
      documentId = existingDocument.id;
    } else {
      documentId = crypto.randomUUID();
      nextRepository = addMunicipalDocument(nextRepository, {
        id: documentId,
        kind: "other",
        title: "Priorización temática — Selección manual",
        source: {
          system: "Selección manual COMPÁS NG",
          collectedAt: new Date().toISOString(),
        },
        tags: [THEMATIC_PRIORITISATION_DOCUMENT_TAG],
      });
    }

    const tpAtoms = attachDocumentIdToAtoms(
      thematicPrioritisationToEvidenceAtoms(prioritisation, THEMATIC_TOPICS),
      documentId
    );

    const nextWorkspace = {
      ...workspace,
      repository: nextRepository,
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
    if (isSuenoDocument(deletedDocument)) {
      setSuenoMessage(null);
      setIsLoadingSueno(false);
    }
    if (isCAGEDocument(deletedDocument)) {
      setCageMessage(null);
      setIsLoadingCAGE(false);
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
      const deletesSueno = isSuenoDocument(doc);
      const deletesCAGE = isCAGEDocument(doc);
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
                deletesSueno &&
                atom.provenance.origin === "complementary-study" &&
                atom.tags.includes(SUENO_DOCUMENT_TAG)
              ) {
                return false;
              }
              if (
                deletesCAGE &&
                atom.provenance.origin === "complementary-study" &&
                atom.tags.includes(CAGE_DOCUMENT_TAG)
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
        suenoStudy: deletesSueno ? undefined : prev.suenoStudy,
        cageStudy: deletesCAGE ? undefined : prev.cageStudy,
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
    setSuenoMessage(null);
    setIsLoadingSueno(false);
    setCageMessage(null);
    setIsLoadingCAGE(false);
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

      {/* Ciclo de Planificación Local — siempre visible en todas las vistas */}
      <LocalHealthPlanningCycle
        healthReportLoaded={runtime.workspace.healthReport !== undefined}
        pslHasEvidence={runtime.psl.totalEvidenceAtoms > 0}
        pslStatus={runtime.psl.status}
        pslIsStale={runtime.pslIsStale}
        thematicPrioritisationDone={runtime.workspace.thematicPrioritisation !== undefined}
        onNavigate={(v) => setView(v as AppView)}
      />

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

        {/* ── ① Inicio — Dashboard del expediente municipal ─── */}
        {view === "inicio" && (() => {
          // Fuentes cargadas — siempre desde el estado actual del workspace
          const hrLoaded      = runtime.workspace.healthReport !== undefined;
          const loadedStudies = [
            runtime.workspace.ibseStudy,
            runtime.workspace.dukeStudy,
            runtime.workspace.predimedStudy,
            runtime.workspace.sf12Study,
            runtime.workspace.suenoStudy,
            runtime.workspace.cageStudy,
          ].filter(Boolean).length;
          // hasAssets desde municipalInventory: detecta activos de cualquier origen
          // (Localiza Salud, community-asset, manual) vía EvidenceStore.atoms
          const hasAssets  = municipalInventory.hasAssets;
          const prioLoaded = runtime.workspace.thematicPrioritisation !== undefined;
          const atomCount  = runtime.workspace.evidenceStore.atoms.length;

          // Siguiente acción institucional recomendada
          const nextAction: { text: string; label: string; view: AppView } = (() => {
            if (!hrLoaded && atomCount === 0) {
              return {
                text:  "El expediente no tiene aún ninguna fuente documental cargada.",
                label: "Ir al Repositorio documental",
                view:  "repositorio",
              };
            }
            if (!hrLoaded) {
              return {
                text:  "El Informe de Salud es la fuente diagnóstica primaria. No está registrado.",
                label: "Cargar Informe de Salud",
                view:  "repositorio",
              };
            }
            if (atomCount === 0) {
              return {
                text:  "El repositorio tiene documentos pero no hay evidencias estructuradas.",
                label: "Revisar el Repositorio",
                view:  "repositorio",
              };
            }
            if (!pslValidated) {
              return {
                text:  "El Perfil de Salud Local está en borrador. Requiere revisión y validación técnica.",
                label: "Revisar el Perfil de Salud Local",
                view:  "psl",
              };
            }
            if (!prioLoaded) {
              return {
                text:  "El PSL está validado. El siguiente paso es la priorización temática con la ciudadanía.",
                label: "Iniciar priorización",
                view:  "priorizacion",
              };
            }
            return {
              text:  "PSL validado y priorización realizada. Puede avanzar al Plan de Acción.",
              label: "Ver Elaboración del Plan",
              view:  "plan",
            };
          })();

          const isStale = runtime.pslIsStale;
          const pslChipClass =
            pslValidated                                        ? "exp-psl-chip--validated" :
            runtime.psl.status === "validated" && isStale       ? "exp-psl-chip--stale" :
            atomCount > 0                                       ? "exp-psl-chip--draft" :
                                                                  "exp-psl-chip--empty";

          const pslChipLabel =
            pslValidated                                        ? "Validado técnicamente" :
            runtime.psl.status === "validated" && isStale       ? "Validado · evidencia modificada" :
            atomCount > 0                                       ? "Borrador disponible" :
                                                                  "Base documental insuficiente";

          return (
            <>
              {/* Cabecera institucional del municipio */}
              <header className="muni-header workspace-panel">
                <div className="gradient-bar" />
                <p className="eyebrow">Plan Local de Salud 2027–2030 · Junta de Andalucía</p>
                <h1 className="muni-header__name">{municipality.name}</h1>
                <div className="muni-header__meta">
                  <span>{municipality.province}</span>
                  {municipality.ineCode && (
                    <>
                      <span className="muni-header__sep">·</span>
                      <span>INE {municipality.ineCode}</span>
                    </>
                  )}
                  {municipality.territorialType && municipality.territorialType !== "municipio" && (
                    <>
                      <span className="muni-header__sep">·</span>
                      <span>{TERRITORIAL_TYPE_LABEL[municipality.territorialType] ?? municipality.territorialType}</span>
                    </>
                  )}
                </div>
              </header>

              {/* Estado del expediente municipal */}
              <section className="workspace-panel expediente-card">
                <div className="exp-card__header">
                  <div>
                    <p className="eyebrow">Estado del expediente</p>
                    <h2>Perfil de Salud Local</h2>
                  </div>
                  <button
                    type="button"
                    className="exp-card__goto"
                    onClick={() => setView("psl")}
                  >
                    Ir al Perfil de Salud Local
                  </button>
                </div>

                {/* Estado del PSL */}
                <div className="exp-card__psl-row">
                  <span className={`exp-psl-chip ${pslChipClass}`}>
                    {pslChipLabel}
                  </span>
                  {atomCount > 0 && (
                    <span className="exp-card__atoms">
                      {atomCount} evidencia{atomCount !== 1 ? "s" : ""} estructurada{atomCount !== 1 ? "s" : ""}
                    </span>
                  )}
                </div>

                {/* Aviso de PSL desactualizado */}
                {isStale && (
                  <div className="exp-card__stale-notice">
                    El expediente ha sido modificado desde la última validación del PSL.
                    Las fuentes mostradas corresponden al estado actual del repositorio,
                    no a las que alimentaron el PSL validado.
                  </div>
                )}

                {/* Fuentes del expediente */}
                <div className="exp-card__sources">
                  <p className="exp-card__sources-label">Fuentes del expediente</p>
                  <div className="exp-card__sources-grid">
                    <div className={`exp-source ${hrLoaded ? "exp-source--yes" : "exp-source--no"}`}>
                      <span className="exp-source__name">Informe de Salud</span>
                      <span className="exp-source__status">{hrLoaded ? "Presente" : "Pendiente"}</span>
                    </div>
                    <div className={`exp-source ${loadedStudies > 0 ? "exp-source--yes" : "exp-source--no"}`}>
                      <span className="exp-source__name">Estudios complementarios</span>
                      <span className="exp-source__status">{loadedStudies} de 6</span>
                    </div>
                    <div className={`exp-source ${hasAssets ? "exp-source--yes" : "exp-source--no"}`}>
                      <span className="exp-source__name">Activos comunitarios</span>
                      <span className="exp-source__status">{hasAssets ? "Registrados" : "Pendiente"}</span>
                    </div>
                    <div className={`exp-source ${prioLoaded ? "exp-source--yes" : "exp-source--no"}`}>
                      <span className="exp-source__name">Priorización ciudadana</span>
                      <span className="exp-source__status">{prioLoaded ? "Realizada" : "Pendiente"}</span>
                    </div>
                  </div>
                </div>

                {/* Siguiente acción */}
                <div className="exp-card__next">
                  <p className="exp-card__next-label">Siguiente acción recomendada</p>
                  <div className="exp-card__next-body">
                    <p className="exp-card__next-text">{nextAction.text}</p>
                    <button
                      type="button"
                      className="exp-card__next-btn"
                      onClick={() => setView(nextAction.view)}
                    >
                      {nextAction.label}
                    </button>
                  </div>
                </div>
              </section>

              {/* Inventario detallado de fuentes */}
              <MunicipalInventoryPanel inventory={municipalInventory} />
            </>
          );
        })()}

        {/* ── ② Repositorio documental ─────────────────────── */}
        {view === "repositorio" && (
          <>
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
              defaultOpen={false}
            />
            {/* ── Fuentes documentales primarias ───────────── */}
            <div className="repo-section-divider">
              <span className="repo-section-divider__text">Fuentes documentales primarias</span>
            </div>
            <HealthReportViewer
              healthReport={runtime.workspace.healthReport}
            />
            {/* ── Estudios Complementarios ──────────────────── */}
            <div className="repo-section-divider">
              <span className="repo-section-divider__text">Estudios Complementarios</span>
            </div>
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
              suenoStudy={runtime.workspace.suenoStudy}
              isLoadingSueno={isLoadingSueno}
              suenoMessage={suenoMessage}
              onLoadSuenoCSV={handleLoadSuenoCSV}
              cageStudy={runtime.workspace.cageStudy}
              isLoadingCAGE={isLoadingCAGE}
              cageMessage={cageMessage}
              onLoadCAGECSV={handleLoadCAGECSV}
              repository={runtime.workspace.repository}
              onDeleteDocument={handleDeleteDocument}
            />
          </>
        )}

        {/* ── ③ Análisis territorial — interpretación territorial (Nivel 2) ── */}
        {/* Orden: resultados (B) → explicabilidad (C) → estado del proceso (A) */}
        {view === "analisis" && (
          <>
            <LT1Panel lt1={runtime.lt1} />
            <OITPanel oit={runtime.oit} />
            <ReconciliacionPanel reconciliacion={runtime.reconciliacion} />
            <PipelineTracePanel pipeline={runtime.pipeline} />
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
            onEditCierreInterpretativo={handleEditPSLCierreInterpretativo}
            onDocumentarDeliberacion={handleDocumentarDeliberacion}
            onCompile={handleCompilePSL}
            onApprove={handleApprovePSL}
          />
        )}

        {/* ── ⑤ Priorizaciones — técnica y participativa ──────── */}
        {view === "priorizacion" && (
          <>
            <section className="workspace-panel">
              <p className="eyebrow">Plan Local de Salud 2027–2030</p>
              <h2>Priorización territorial</h2>
              <p className="panel-note">
                La priorización integra dos fuentes complementarias: las áreas
                candidatas derivadas del Perfil de Salud Local y las temáticas
                expresadas por la ciudadanía en el proceso de participación.
                La decisión definitiva corresponde al equipo técnico y a la comunidad,
                no al sistema.
              </p>
            </section>
            {/* Candidaturas técnicas — derivadas del PSL */}
            <PrioritizationPanel
              prioritization={runtime.prioritization}
              pslStatus={runtime.psl.status}
              pslIsStale={runtime.pslIsStale}
              hasInsufficientEvidence={pipelineIsEmpty}
            />
            {/* Participación ciudadana — proceso independiente de selección temática */}
            <div className="repo-section-divider">
              <span className="repo-section-divider__text">Participación ciudadana</span>
            </div>
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
            <EPVSAPanel
              epvsa={runtime.epvsa}
              isBlocked={!pslValidated}
            />
            <ActionPlanPanel
              actionPlan={runtime.actionPlan}
              isEmpty={pipelineIsEmpty}
              isBlocked={!pslValidated}
              formalValidation={actionPlanFormalValidation}
              onFormalValidate={(vb, role, ref) => handleFormalValidation("action-plan", vb, role, ref)}
            />
            <AgendaPanel
              agenda={runtime.agenda}
              isEmpty={pipelineIsEmpty}
              isBlocked={!pslValidated}
              formalValidation={agendaFormalValidation}
              onFormalValidate={(vb, role, ref) => handleFormalValidation("agenda", vb, role, ref)}
            />
            <MonitoringPanel
              monitoring={runtime.monitoring}
              isEmpty={pipelineIsEmpty}
              isBlocked={!pslValidated}
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
