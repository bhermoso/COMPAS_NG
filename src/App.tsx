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
import { type QuestionnaireProject } from "./domain/questionnaire";
import { importProjectDataset } from "./application/questionnaire";
import { type CreateMunicipalityContextInput } from "./domain/municipality";
import {
  createCompleteMunicipalityWorkspace,
  isEmptyWorkspaceForPersistenceGuard,
} from "./application/workspace";
import { createMunicipalityRuntime } from "./application/runtime";
import { ingestManualDocument, extractDocxText, removeEquivalentStrategicFramework } from "./application/document-ingestion";
// buildLocalHealthProfile is now called inside MunicipalityRuntime — not needed here.
import {
  hasPSLHumanContent,
  buildIndicatorComparisonReferences,
  computePerfilEpistemicMetrics,
} from "./application/health-profile";
import type { PerfilLocalDeSalud } from "./domain/health-profile";
import {
  createHealthReportDocumentFromDocx,
  createHealthReportDocumentFromPdf,
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
import { parseAUDITCCSV, auditcStudyToEvidenceAtoms } from "./application/auditc";
import { createAUDITCStudy } from "./domain/auditc";
import { parseIPAQCSV, ipaqStudyToEvidenceAtoms } from "./application/ipaq";
import { createIPAQStudy } from "./domain/ipaq";
import { parseGHQ12CSV, ghq12StudyToEvidenceAtoms } from "./application/ghq12";
import { createGHQ12Study } from "./domain/ghq12";
import { parsePHQ9CSV, phq9StudyToEvidenceAtoms } from "./application/phq9";
import { createPHQ9Study } from "./domain/phq9";
import { parsePSQICSV, psqiStudyToEvidenceAtoms } from "./application/psqi";
import { createPSQIStudy } from "./domain/psqi";
import { parseFagerstromCSV, fagerstromStudyToEvidenceAtoms } from "./application/fagerstrom";
import { createFagerstromStudy } from "./domain/fagerstrom";
import { parseSBQCSV, sbqStudyToEvidenceAtoms } from "./application/sbq";
import { createSBQStudy } from "./domain/sbq";
import { stableAssetKey, upsertEvidenceAtom, type EvidenceAtom } from "./domain/evidence";
import {
  THEMATIC_TOPICS,
  MAX_SELECTED_TOPICS,
  createThematicPrioritisation,
} from "./domain/thematic-prioritisation";

import { parseThematicPrioritisationCSV, thematicPrioritisationToEvidenceAtoms } from "./application/thematic-prioritisation";
import { buildEstadoResumen } from "./application/territorial-interpretation";
import type { ThematicPrioritisationStudy } from "./domain/thematic-prioritisation";
import {
  saveWorkspaceToLocalStorage,
  loadWorkspaceFromLocalStorage,
  hasWorkspaceInLocalStorage,
} from "./infrastructure/persistence/local-storage";

import { compileLocalHealthProfile } from "./application/health-profile-compiler";
import { compileNHSHealthProfile } from "./application/nhs-health-profile-compiler";
import { approvePSL, createFormalValidation } from "./application/institutional-lifecycle";
import { isFormalValidationStale } from "./domain/institutional-lifecycle";

import {
  LocalHealthPlanningCycle,
  DocumentIngestionPanel,
  DocumentRepositoryPanel,
  EvidenceStorePanel,
  HealthReportViewer,
  EstudiosComplementariosPanel,
  ActivosSaludPanel,
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
  NHSHealthProfileView,
  LecturaEstrategicaView,
  PAIView,
  GESPanel,
  PerfilLocalDeSaludPanel,
  PerfilFuentesPanel,
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
  { id: "atarfe",         name: "Atarfe",              province: "Granada", ineCode: "18022", createdBy: "COMPÁS NG" },
  { id: "alfacar",        name: "Alfacar",              province: "Granada", ineCode: "18011", createdBy: "COMPÁS NG" },
  { id: "churriana",      name: "Churriana de la Vega", province: "Granada", ineCode: "18062", createdBy: "COMPÁS NG" },
  { id: "zagra",          name: "Zagra",               province: "Granada", ineCode: "18913", createdBy: "COMPÁS NG" },
  // Distrito inframunicipal — sin código INE propio. BADEA solo como contexto de Granada capital (18087).
  { id: "granada-zaidin", name: "Granada-Zaidín",       province: "Granada", territorialType: "distrito", createdBy: "COMPÁS NG" },
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

type AppView = "inicio" | "repositorio" | "analisis" | "psl" | "nhs" | "priorizacion" | "lectura" | "plan" | "plan-local" | "evaluacion" | "ges";

const NAV_ITEMS: { id: AppView; label: string }[] = [
  { id: "inicio",        label: "Inicio" },
  { id: "repositorio",   label: "Diagnóstico territorial" },
  { id: "psl",           label: "Perfil de Salud Local" },
  { id: "nhs",           label: "Perfil Ejecutivo de Salud Local" },
  { id: "plan",          label: "Plan de Acción" },
  { id: "plan-local",    label: "Plan Local de Salud" },
  { id: "evaluacion",    label: "Evaluación" },
  { id: "ges",           label: "Gestor de Encuestas" },
];
// Vistas eliminadas de la navegación principal pero accesibles para desarrollo:
// "analisis" (D-002), "lectura" (D-004), "priorizacion" (integrada en Plan de Acción).

const DOCUMENT_KINDS: { value: DocumentKind; label: string }[] = [
  { value: "health-report",             label: "Informe de Salud" },
  { value: "complementary-study",       label: "Estudio complementario" },
  { value: "localiza-salud",            label: "Localiza Salud" },
  { value: "strategic-framework",       label: "Marco estratégico y normativo" },
  { value: "territorial-documentation", label: "Documentación Territorial de Contexto" },
  { value: "qualitative-material",      label: "Material Cualitativo y Participativo" },
  { value: "longitudinal-evidence",     label: "Evidencia longitudinal" },
];

const IBSE_DOCUMENT_TAG = "ibse";
const DUKE_DOCUMENT_TAG = "duke-eas";
const PREDIMED_DOCUMENT_TAG = "predimed-eas";
const SF12_DOCUMENT_TAG = "sf12-eas";
const SUENO_DOCUMENT_TAG = "sueno-eas";
const CAGE_DOCUMENT_TAG = "cage-eas";
const AUDITC_DOCUMENT_TAG = "auditc";
const IPAQ_DOCUMENT_TAG = "ipaq-eas";
const GHQ12_DOCUMENT_TAG = "ghq12";
const PHQ9_DOCUMENT_TAG = "phq9";
const PSQI_DOCUMENT_TAG = "psqi";
const FAGERSTROM_DOCUMENT_TAG = "fagerstrom";
const SBQ_DOCUMENT_TAG = "sbq";
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

function isAUDITCDocument(document: MunicipalDocument | undefined): boolean {
  return hasDocumentTag(document, AUDITC_DOCUMENT_TAG);
}

function isIPAQDocument(document: MunicipalDocument | undefined): boolean {
  return hasDocumentTag(document, IPAQ_DOCUMENT_TAG);
}

function isGHQ12Document(document: MunicipalDocument | undefined): boolean {
  return hasDocumentTag(document, GHQ12_DOCUMENT_TAG);
}

function isPHQ9Document(document: MunicipalDocument | undefined): boolean {
  return hasDocumentTag(document, PHQ9_DOCUMENT_TAG);
}

function isPSQIDocument(document: MunicipalDocument | undefined): boolean {
  return hasDocumentTag(document, PSQI_DOCUMENT_TAG);
}

function isFagerstromDocument(document: MunicipalDocument | undefined): boolean {
  return hasDocumentTag(document, FAGERSTROM_DOCUMENT_TAG);
}

function isSBQDocument(document: MunicipalDocument | undefined): boolean {
  return hasDocumentTag(document, SBQ_DOCUMENT_TAG);
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

// isEmptyWorkspaceForPersistenceGuard importada desde application/workspace

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
  const [isLoadingDocumentFile, setIsLoadingDocumentFile] = useState(false);
  const [documentFileMessage, setDocumentFileMessage] = useState<string | null>(null);
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
  const [isLoadingAUDITC, setIsLoadingAUDITC] = useState(false);
  const [auditcMessage, setAuditcMessage] = useState<string | null>(null);
  const [isLoadingIPAQ, setIsLoadingIPAQ] = useState(false);
  const [ipaqMessage, setIpaqMessage] = useState<string | null>(null);
  const [isLoadingGHQ12, setIsLoadingGHQ12] = useState(false);
  const [ghq12Message, setGhq12Message] = useState<string | null>(null);
  const [isLoadingPHQ9, setIsLoadingPHQ9] = useState(false);
  const [phq9Message, setPhq9Message] = useState<string | null>(null);
  const [isLoadingPSQI, setIsLoadingPSQI] = useState(false);
  const [psqiMessage, setPsqiMessage] = useState<string | null>(null);
  const [isLoadingFagerstrom, setIsLoadingFagerstrom] = useState(false);
  const [fagerstromMessage, setFagerstromMessage] = useState<string | null>(null);
  const [isLoadingSBQ, setIsLoadingSBQ] = useState(false);
  const [sbqMessage, setSbqMessage] = useState<string | null>(null);
  const [pendingTopics, setPendingTopics] = useState<string[]>(
    () => workspace.thematicPrioritisation?.selectedTopicIds ?? []
  );
  const [isImportingTP, setIsImportingTP] = useState(false);
  const [tpImportMessage, setTpImportMessage] = useState<string | null>(null);
  const [isImportingProjectDataset, setIsImportingProjectDataset] = useState(false);
  const [importProjectDatasetMessage, setImportProjectDatasetMessage] = useState<string | null>(null);
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
        // Puente del espacio de conocimiento: sin él, el artefacto congelado
        // no registra EKC, hipótesis ni preguntas abiertas del técnico.
        perfil: prev.perfilLocalDeSalud,
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

  const handleCompileNHS = useCallback(() => {
    setWorkspace((prev) => {
      const psl = prev.validatedPSL;
      if (!psl) return prev;
      const result = compileNHSHealthProfile({
        psl,
        workspace: prev,
        municipalityName: prev.municipality.identity.name,
        municipalityProvince: prev.municipality.identity.province,
        existingArtifactCount: prev.nhsArtifact ? 1 : 0,
      });
      if (!result.ok) return prev;
      return {
        ...prev,
        nhsArtifact: result.artifact,
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

  const handleUpdatePerfilLocalDeSalud = useCallback((perfil: PerfilLocalDeSalud) => {
    setWorkspace(prev => ({ ...prev, perfilLocalDeSalud: perfil }));
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
    // community-asset y localiza-salud son tipos canónicos: una sola versión activa por municipio.
    // Se eliminan entradas y átomos previos del mismo tipo antes de registrar la nueva.
    const repositoryForIngestion =
      kind === "community-asset" || kind === "localiza-salud"
        ? {
            ...workspace.repository,
            documents: workspace.repository.documents.filter(
              (d) => d.kind !== kind
            ),
          }
        : workspace.repository;

    const evidenceStoreForIngestion =
      kind === "community-asset"
        ? {
            ...workspace.evidenceStore,
            atoms: workspace.evidenceStore.atoms.filter(
              (a) => a.provenance.origin !== "community-assets"
            ),
            updatedAt: new Date().toISOString(),
          }
        : kind === "localiza-salud"
        ? {
            ...workspace.evidenceStore,
            atoms: workspace.evidenceStore.atoms.filter(
              (a) => a.provenance.origin !== "localiza-salud"
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
        ? createHealthReportDocumentFromPdf({
            arrayBuffer,          // no usado internamente; incluido por compatibilidad de tipo
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

      // D-HR-01: health-report nunca genera EvidenceAtom, ni DOCX ni PDF.
      // El EvidenceStore se limpia de átomos residuales de versiones anteriores.
      setWorkspace((prev) => ({
        ...prev,
        repository: replaceMunicipalDocumentByKind(prev.repository, newDocInput),
        healthReport,
        evidenceStore: {
          ...prev.evidenceStore,
          atoms: prev.evidenceStore.atoms.filter(
            (a) => a.provenance.origin !== "health-report"
          ),
          updatedAt: new Date().toISOString(),
        },
        updatedAt: new Date().toISOString(),
      }));
      setLastHealthReportMessage(
        "Informe de Salud registrado como fuente diagnóstica primaria. " +
        "Preservado en el Repositorio documental. " +
        "Para consultarlo, abre el fichero original."
      );
    } catch (err) {
      console.error("[health-report-load-error]", err);
      setLastHealthReportMessage(
        isPdf
          ? "Error al procesar el PDF. Verifica que sea un PDF válido y no esté protegido."
          : "Error al cargar el informe. Si el documento procede de LibreOffice/OpenDocument, verifica que se haya exportado correctamente a .docx. Los ficheros muy grandes o con muchas imágenes pueden requerir más tiempo."
      );
    } finally {
      setIsLoadingHealthReport(false);
    }
  }

  // ── Carga de archivo para tipos documentales con extracción de texto ─────────
  // Aplica a: strategic-framework, territorial-documentation, qualitative-material.
  // DOCX → extrae texto vía mammoth → genera EvidenceAtoms del tipo correspondiente.
  // PDF  → registra como referencia documental sin texto; usuario pega extractos por textarea.
  // D-HR-01 no aplica aquí: estos tipos SÍ pueden generar EvidenceAtoms.
  async function handleLoadDocumentFile(file: File): Promise<void> {
    const isLegacyDoc = /\.doc$/i.test(file.name) && !/\.docx$/i.test(file.name);
    if (isLegacyDoc) {
      setDocumentFileMessage(
        "El formato .doc (binario) no puede procesarse. Convierte el fichero a .docx y vuelve a cargarlo."
      );
      return;
    }

    const isDocx = /\.docx$/i.test(file.name);
    const isPdf = /\.pdf$/i.test(file.name);

    if (!isDocx && !isPdf) {
      setDocumentFileMessage(
        "Formato no admitido. Sube un fichero .docx o .pdf."
      );
      return;
    }

    const rawName = file.name
      .replace(/\.(docx?|pdf)$/i, "")
      .replace(/[-_]/g, " ");
    const docTitle = rawName.charAt(0).toUpperCase() + rawName.slice(1);

    setIsLoadingDocumentFile(true);
    setDocumentFileMessage(null);
    try {
      if (isDocx) {
        const arrayBuffer = await file.arrayBuffer();
        const plainText = await extractDocxText(arrayBuffer);

        if (plainText.trim().length === 0) {
          setDocumentFileMessage(
            "El fichero DOCX no contiene texto extraíble. Pega el contenido manualmente en el área de texto."
          );
          return;
        }

        // La ingesta se calcula DENTRO del actualizador funcional, sobre prev:
        // tras los await, el workspace capturado por cierre puede estar obsoleto
        // y fusionarlo pisaría cambios intermedios de repositorio/evidencia.
        setWorkspace((prev) => {
          // Un marco estratégico recargado sustituye a su versión anterior
          // (mismo fichero o mismo título): nunca se duplica.
          const replaced =
            kind === "strategic-framework"
              ? removeEquivalentStrategicFramework(prev.repository, {
                  title: docTitle,
                  sourceFileName: file.name,
                })
              : { repository: prev.repository, removedDocumentIds: [] };
          const baseStore =
            replaced.removedDocumentIds.length > 0
              ? {
                  ...prev.evidenceStore,
                  atoms: prev.evidenceStore.atoms.filter(
                    (a) =>
                      a.provenance.documentId === undefined ||
                      !replaced.removedDocumentIds.includes(a.provenance.documentId)
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : prev.evidenceStore;

          const result = ingestManualDocument({
            repository: replaced.repository,
            evidenceStore: baseStore,
            kind,
            title: docTitle,
            plainText,
            sourceFileName: file.name,
            sourceSystem: "Archivo DOCX cargado",
          });

          if (result === null) return prev;

          queueMicrotask(() => {
            setLastProcessedDocument(result.document);
            setLastAtomCount(result.atomsCreated);
            setDocumentFileMessage(
              `«${docTitle}» registrado. ${result.atomsCreated} unidades de evidencia extraídas del texto.`
            );
          });

          return {
            ...prev,
            repository: result.repository,
            evidenceStore: result.evidenceStore,
            updatedAt: new Date().toISOString(),
          };
        });
      } else {
        // PDF: registrar como referencia sin extracción de texto.
        // El id se genera fuera para que sea estable; el repositorio se
        // deriva de prev dentro del actualizador (mismo motivo que en DOCX).
        const documentId = crypto.randomUUID();
        setWorkspace((prev) => {
          // Un marco estratégico recargado sustituye a su versión anterior
          // (mismo fichero o mismo título): nunca se duplica.
          const replaced =
            kind === "strategic-framework"
              ? removeEquivalentStrategicFramework(prev.repository, {
                  title: docTitle,
                  sourceFileName: file.name,
                })
              : { repository: prev.repository, removedDocumentIds: [] };

          const nextRepository = addMunicipalDocument(replaced.repository, {
            id: documentId,
            kind: kind as DocumentKind,
            title: docTitle,
            source: {
              system: "Archivo PDF — referencia documental",
              collectedAt: new Date().toISOString(),
            },
            sourceFileName: file.name,
            canGenerateEvidence: false,
            tags: [kind],
          });
          const registeredDoc = nextRepository.documents.find((d) => d.id === documentId);
          if (registeredDoc === undefined) return prev;

          // Si se sustituyó un marco previo cargado con texto, sus evidencias
          // derivadas se purgan junto con el documento.
          const nextStore =
            replaced.removedDocumentIds.length > 0
              ? {
                  ...prev.evidenceStore,
                  atoms: prev.evidenceStore.atoms.filter(
                    (a) =>
                      a.provenance.documentId === undefined ||
                      !replaced.removedDocumentIds.includes(a.provenance.documentId)
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : prev.evidenceStore;

          queueMicrotask(() => {
            setLastProcessedDocument(registeredDoc);
            setLastAtomCount(0);
            setDocumentFileMessage(
              `«${docTitle}» registrado como documento de referencia (PDF sin extracción de texto). ` +
              "Pega un extracto analítico en el área de texto inferior si deseas generar evidencias trazables."
            );
          });

          return {
            ...prev,
            repository: nextRepository,
            evidenceStore: nextStore,
            updatedAt: new Date().toISOString(),
          };
        });
      }
    } catch (err) {
      console.error("[document-file-load-error]", err);
      setDocumentFileMessage(
        "Error al procesar el archivo. Verifica que sea un .docx válido y no esté dañado."
      );
    } finally {
      setIsLoadingDocumentFile(false);
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

  async function handleLoadAUDITCCSV(file: File): Promise<void> {
    setIsLoadingAUDITC(true);
    try {
      const text = await file.text();
      const { aggregates, methodologicalCautions, warnings } = parseAUDITCCSV(text);
      const documentId = crypto.randomUUID();
      const study = createAUDITCStudy({
        municipalityId: workspace.municipality.identity.id,
        sourceFileName: file.name,
        aggregates,
        methodologicalCautions,
        warnings,
      });
      const auditcAtoms = attachDocumentIdToAtoms(
        auditcStudyToEvidenceAtoms(study),
        documentId
      );
      setWorkspace((prev) => {
        const now = new Date().toISOString();
        const repositoryWithoutPrior = removeDocumentsByTag(
          prev.repository,
          AUDITC_DOCUMENT_TAG
        );
        const nextRepository = addMunicipalDocument(repositoryWithoutPrior, {
          id: documentId,
          kind: "redcap-export",
          title: `AUDIT-C - ${file.name}`,
          source: {
            system: "Encuesta municipal propia — exportación REDCap",
            collectedAt: study.createdAt,
          },
          sourceFileName: file.name,
          tags: ["complementary-study", AUDITC_DOCUMENT_TAG],
        });
        let nextStore = {
          ...prev.evidenceStore,
          atoms: prev.evidenceStore.atoms.filter(
            (atom) =>
              atom.municipalityId !== prev.municipality.identity.id ||
              !(
                atom.provenance.origin === "complementary-study" &&
                atom.tags.includes(AUDITC_DOCUMENT_TAG)
              )
          ),
          updatedAt: now,
        };
        for (const atom of auditcAtoms) {
          const key = stableAssetKey(atom.municipalityId, atom.provenance.origin, atom.title);
          nextStore = upsertEvidenceAtom(nextStore, atom, key);
        }
        return {
          ...prev,
          repository: nextRepository,
          auditcStudy: study,
          evidenceStore: nextStore,
          updatedAt: now,
        };
      });
      const warn = warnings.length > 0 ? ` Avisos: ${warnings.join(" ")}` : "";
      setAuditcMessage(
        aggregates.nValid > 0
          ? `AUDIT-C cargado: ${aggregates.nValid} registros válidos de ${aggregates.n}. Consumo de riesgo (≥4): ${aggregates.pctPositive.toFixed(1)} % (n=${aggregates.nPositive}). ${auditcAtoms.length} evidencias incorporadas.${warn}`
          : `CSV AUDIT-C procesado sin registros con los 3 ítems completos.${warn}`
      );
    } catch {
      setAuditcMessage("Error al procesar el CSV. Verifica que incluya las columnas auditc_q1, auditc_q2 y auditc_q3.");
    } finally {
      setIsLoadingAUDITC(false);
    }
  }

  async function handleLoadIPAQCSV(file: File): Promise<void> {
    setIsLoadingIPAQ(true);
    try {
      const text = await file.text();
      const { aggregates, methodologicalCautions, warnings } = parseIPAQCSV(text);
      const documentId = crypto.randomUUID();
      const study = createIPAQStudy({
        municipalityId: workspace.municipality.identity.id,
        sourceFileName: file.name,
        aggregates,
        methodologicalCautions,
        warnings,
      });
      const ipaqAtoms = attachDocumentIdToAtoms(
        ipaqStudyToEvidenceAtoms(study),
        documentId
      );
      setWorkspace((prev) => {
        const now = new Date().toISOString();
        const repositoryWithoutPrior = removeDocumentsByTag(
          prev.repository,
          IPAQ_DOCUMENT_TAG
        );
        const nextRepository = addMunicipalDocument(repositoryWithoutPrior, {
          id: documentId,
          kind: "complementary-study",
          title: `IPAQ-EAS - ${file.name}`,
          source: {
            system: "Encuesta Andaluza de Salud — campos derivados oficiales",
            collectedAt: study.createdAt,
          },
          sourceFileName: file.name,
          tags: ["complementary-study", IPAQ_DOCUMENT_TAG],
        });
        let nextStore = {
          ...prev.evidenceStore,
          atoms: prev.evidenceStore.atoms.filter(
            (atom) =>
              atom.municipalityId !== prev.municipality.identity.id ||
              !(
                atom.provenance.origin === "complementary-study" &&
                atom.tags.includes(IPAQ_DOCUMENT_TAG)
              )
          ),
          updatedAt: now,
        };
        for (const atom of ipaqAtoms) {
          const key = stableAssetKey(atom.municipalityId, atom.provenance.origin, atom.title);
          nextStore = upsertEvidenceAtom(nextStore, atom, key);
        }
        return {
          ...prev,
          repository: nextRepository,
          ipaqStudy: study,
          evidenceStore: nextStore,
          updatedAt: now,
        };
      });
      const warn = warnings.length > 0 ? ` Avisos: ${warnings.join(" ")}` : "";
      setIpaqMessage(
        aggregates.nValidIPAQ > 0 || aggregates.nValidP34AR > 0
          ? `IPAQ-EAS cargado: ${aggregates.nValidIPAQ} válidos IPAQ_DICO · alta actividad ${aggregates.pctHigh.toFixed(1)} % (n=${aggregates.nHigh}). Inactividad tiempo libre: ${aggregates.pctInactive.toFixed(1)} %. ${ipaqAtoms.length} evidencias incorporadas.${warn}`
          : `CSV IPAQ procesado sin registros válidos en IPAQ_DICO ni P34A_R.${warn}`
      );
    } catch {
      setIpaqMessage("Error al procesar el CSV. Verifica que incluya las columnas IPAQ_DICO y/o P34A_R.");
    } finally {
      setIsLoadingIPAQ(false);
    }
  }

  async function handleLoadGHQ12CSV(file: File): Promise<void> {
    setIsLoadingGHQ12(true);
    try {
      const text = await file.text();
      const { aggregates, methodologicalCautions, warnings } = parseGHQ12CSV(text);
      const warn = warnings.length > 0 ? ` Avisos: ${warnings.join(" ")}` : "";
      if (aggregates.nValid === 0) {
        setGhq12Message(`CSV GHQ-12 procesado sin registros con los 12 ítems completos.${warn}`);
        return;
      }
      const documentId = crypto.randomUUID();
      const study = createGHQ12Study({
        municipalityId: workspace.municipality.identity.id,
        sourceFileName: file.name,
        aggregates,
        methodologicalCautions,
        warnings,
      });
      const ghq12Atoms = attachDocumentIdToAtoms(
        ghq12StudyToEvidenceAtoms(study),
        documentId
      );
      setWorkspace((prev) => {
        const now = new Date().toISOString();
        const repositoryWithoutPrior = removeDocumentsByTag(
          prev.repository,
          GHQ12_DOCUMENT_TAG
        );
        const nextRepository = addMunicipalDocument(repositoryWithoutPrior, {
          id: documentId,
          kind: "redcap-export",
          title: `GHQ-12 - ${file.name}`,
          source: {
            system: "Encuesta municipal propia — exportación REDCap",
            collectedAt: study.createdAt,
          },
          sourceFileName: file.name,
          tags: ["complementary-study", GHQ12_DOCUMENT_TAG],
        });
        let nextStore = {
          ...prev.evidenceStore,
          atoms: prev.evidenceStore.atoms.filter(
            (atom) =>
              atom.municipalityId !== prev.municipality.identity.id ||
              !(
                atom.provenance.origin === "complementary-study" &&
                atom.tags.includes(GHQ12_DOCUMENT_TAG)
              )
          ),
          updatedAt: now,
        };
        for (const atom of ghq12Atoms) {
          const key = stableAssetKey(atom.municipalityId, atom.provenance.origin, atom.title);
          nextStore = upsertEvidenceAtom(nextStore, atom, key);
        }
        return {
          ...prev,
          repository: nextRepository,
          ghq12Study: study,
          evidenceStore: nextStore,
          updatedAt: now,
        };
      });
      setGhq12Message(
        `GHQ-12 cargado: ${aggregates.nValid} registros válidos de ${aggregates.n}. Probable malestar (≥3): ${aggregates.pctPositive.toFixed(1)} % (n=${aggregates.nPositive}). ${ghq12Atoms.length} evidencias incorporadas.${warn}`
      );
    } catch {
      setGhq12Message("Error al procesar el CSV. Verifica que incluya las columnas ghq12_q1 a ghq12_q12.");
    } finally {
      setIsLoadingGHQ12(false);
    }
  }

  async function handleLoadPHQ9CSV(file: File): Promise<void> {
    setIsLoadingPHQ9(true);
    try {
      const text = await file.text();
      const { aggregates, methodologicalCautions, warnings } = parsePHQ9CSV(text);
      const warn = warnings.length > 0 ? ` Avisos: ${warnings.join(" ")}` : "";
      if (aggregates.nValid === 0) {
        setPhq9Message(`CSV PHQ-9 procesado sin registros con los 9 ítems completos.${warn}`);
        return;
      }
      const documentId = crypto.randomUUID();
      const study = createPHQ9Study({
        municipalityId: workspace.municipality.identity.id,
        sourceFileName: file.name,
        aggregates,
        methodologicalCautions,
        warnings,
      });
      const phq9Atoms = attachDocumentIdToAtoms(phq9StudyToEvidenceAtoms(study), documentId);
      setWorkspace((prev) => {
        const now = new Date().toISOString();
        const repositoryWithoutPrior = removeDocumentsByTag(prev.repository, PHQ9_DOCUMENT_TAG);
        const nextRepository = addMunicipalDocument(repositoryWithoutPrior, {
          id: documentId, kind: "redcap-export",
          title: `PHQ-9 - ${file.name}`,
          source: { system: "Encuesta municipal propia — exportación REDCap", collectedAt: study.createdAt },
          sourceFileName: file.name,
          tags: ["complementary-study", PHQ9_DOCUMENT_TAG],
        });
        let nextStore = {
          ...prev.evidenceStore,
          atoms: prev.evidenceStore.atoms.filter(
            (atom) => atom.municipalityId !== prev.municipality.identity.id ||
              !(atom.provenance.origin === "complementary-study" && atom.tags.includes(PHQ9_DOCUMENT_TAG))
          ),
          updatedAt: now,
        };
        for (const atom of phq9Atoms) {
          const key = stableAssetKey(atom.municipalityId, atom.provenance.origin, atom.title);
          nextStore = upsertEvidenceAtom(nextStore, atom, key);
        }
        return { ...prev, repository: nextRepository, phq9Study: study, evidenceStore: nextStore, updatedAt: now };
      });
      setPhq9Message(
        `PHQ-9 cargado: ${aggregates.nValid} registros válidos de ${aggregates.n}. Síntomas mod.+ (≥10): ${aggregates.pctPositive.toFixed(1)} % (n=${aggregates.nPositive}). ${phq9Atoms.length} evidencias incorporadas.${warn}`
      );
    } catch {
      setPhq9Message("Error al procesar el CSV. Verifica que incluya las columnas phq9_q1 a phq9_q9.");
    } finally {
      setIsLoadingPHQ9(false);
    }
  }

  async function handleLoadPSQICSV(file: File): Promise<void> {
    setIsLoadingPSQI(true);
    try {
      const text = await file.text();
      const { aggregates, methodologicalCautions, warnings } = parsePSQICSV(text);
      const warn = warnings.length > 0 ? ` Avisos: ${warnings.join(" ")}` : "";
      if (aggregates.nValid === 0) {
        setPsqiMessage(`CSV PSQI procesado sin registros con los 7 componentes completos.${warn}`);
        return;
      }
      const documentId = crypto.randomUUID();
      const study = createPSQIStudy({
        municipalityId: workspace.municipality.identity.id,
        sourceFileName: file.name,
        aggregates,
        methodologicalCautions,
        warnings,
      });
      const psqiAtoms = attachDocumentIdToAtoms(psqiStudyToEvidenceAtoms(study), documentId);
      setWorkspace((prev) => {
        const now = new Date().toISOString();
        const repositoryWithoutPrior = removeDocumentsByTag(prev.repository, PSQI_DOCUMENT_TAG);
        const nextRepository = addMunicipalDocument(repositoryWithoutPrior, {
          id: documentId, kind: "redcap-export",
          title: `PSQI - ${file.name}`,
          source: { system: "Encuesta municipal propia — exportación REDCap", collectedAt: study.createdAt },
          sourceFileName: file.name,
          tags: ["complementary-study", PSQI_DOCUMENT_TAG],
        });
        let nextStore = {
          ...prev.evidenceStore,
          atoms: prev.evidenceStore.atoms.filter(
            (atom) => atom.municipalityId !== prev.municipality.identity.id ||
              !(atom.provenance.origin === "complementary-study" && atom.tags.includes(PSQI_DOCUMENT_TAG))
          ),
          updatedAt: now,
        };
        for (const atom of psqiAtoms) {
          const key = stableAssetKey(atom.municipalityId, atom.provenance.origin, atom.title);
          nextStore = upsertEvidenceAtom(nextStore, atom, key);
        }
        return { ...prev, repository: nextRepository, psqiStudy: study, evidenceStore: nextStore, updatedAt: now };
      });
      setPsqiMessage(
        `PSQI cargado: ${aggregates.nValid} registros válidos de ${aggregates.n}. Mal dormidor (&gt;5): ${aggregates.pctPositive.toFixed(1)} % (n=${aggregates.nPositive}). ${psqiAtoms.length} evidencias incorporadas.${warn}`
      );
    } catch {
      setPsqiMessage("Error al procesar el CSV. Verifica que incluya las columnas psqi_c1 a psqi_c7.");
    } finally {
      setIsLoadingPSQI(false);
    }
  }

  async function handleLoadFagerstromCSV(file: File): Promise<void> {
    setIsLoadingFagerstrom(true);
    try {
      const text = await file.text();
      const { aggregates, methodologicalCautions, warnings } = parseFagerstromCSV(text);
      const warn = warnings.length > 0 ? ` Avisos: ${warnings.join(" ")}` : "";
      if (aggregates.nValid === 0) {
        setFagerstromMessage(`CSV Fagerström procesado sin registros con los 6 ítems completos.${warn}`);
        return;
      }
      const documentId = crypto.randomUUID();
      const study = createFagerstromStudy({
        municipalityId: workspace.municipality.identity.id,
        sourceFileName: file.name,
        aggregates,
        methodologicalCautions,
        warnings,
      });
      const fagerstromAtoms = attachDocumentIdToAtoms(fagerstromStudyToEvidenceAtoms(study), documentId);
      setWorkspace((prev) => {
        const now = new Date().toISOString();
        const repositoryWithoutPrior = removeDocumentsByTag(prev.repository, FAGERSTROM_DOCUMENT_TAG);
        const nextRepository = addMunicipalDocument(repositoryWithoutPrior, {
          id: documentId, kind: "redcap-export",
          title: `Fagerström - ${file.name}`,
          source: { system: "Encuesta municipal propia — exportación REDCap", collectedAt: study.createdAt },
          sourceFileName: file.name,
          tags: ["complementary-study", FAGERSTROM_DOCUMENT_TAG],
        });
        let nextStore = {
          ...prev.evidenceStore,
          atoms: prev.evidenceStore.atoms.filter(
            (atom) => atom.municipalityId !== prev.municipality.identity.id ||
              !(atom.provenance.origin === "complementary-study" && atom.tags.includes(FAGERSTROM_DOCUMENT_TAG))
          ),
          updatedAt: now,
        };
        for (const atom of fagerstromAtoms) {
          const key = stableAssetKey(atom.municipalityId, atom.provenance.origin, atom.title);
          nextStore = upsertEvidenceAtom(nextStore, atom, key);
        }
        return { ...prev, repository: nextRepository, fagerstromStudy: study, evidenceStore: nextStore, updatedAt: now };
      });
      setFagerstromMessage(
        `Fagerström cargado: ${aggregates.nValid} fumadores activos de ${aggregates.n}. Dep. mod.+ (≥5): ${aggregates.pctPositive.toFixed(1)} % (n=${aggregates.nPositive}). ${fagerstromAtoms.length} evidencias incorporadas.${warn}`
      );
    } catch {
      setFagerstromMessage("Error al procesar el CSV. Verifica que incluya las columnas ftnd_q1 a ftnd_q6.");
    } finally {
      setIsLoadingFagerstrom(false);
    }
  }

  async function handleLoadSBQCSV(file: File): Promise<void> {
    setIsLoadingSBQ(true);
    try {
      const text = await file.text();
      const { aggregates, methodologicalCautions, warnings } = parseSBQCSV(text);
      const warn = warnings.length > 0 ? ` Avisos: ${warnings.join(" ")}` : "";
      if (aggregates.nValid === 0) {
        setSbqMessage(`CSV SBQ procesado sin registros con los 9 ítems completos.${warn}`);
        return;
      }
      const documentId = crypto.randomUUID();
      const study = createSBQStudy({
        municipalityId: workspace.municipality.identity.id,
        sourceFileName: file.name,
        aggregates,
        methodologicalCautions,
        warnings,
      });
      const sbqAtoms = attachDocumentIdToAtoms(sbqStudyToEvidenceAtoms(study), documentId);
      setWorkspace((prev) => {
        const now = new Date().toISOString();
        const repositoryWithoutPrior = removeDocumentsByTag(prev.repository, SBQ_DOCUMENT_TAG);
        const nextRepository = addMunicipalDocument(repositoryWithoutPrior, {
          id: documentId, kind: "redcap-export",
          title: `SBQ - ${file.name}`,
          source: { system: "Encuesta municipal propia — exportación REDCap", collectedAt: study.createdAt },
          sourceFileName: file.name,
          tags: ["complementary-study", SBQ_DOCUMENT_TAG],
        });
        let nextStore = {
          ...prev.evidenceStore,
          atoms: prev.evidenceStore.atoms.filter(
            (atom) => atom.municipalityId !== prev.municipality.identity.id ||
              !(atom.provenance.origin === "complementary-study" && atom.tags.includes(SBQ_DOCUMENT_TAG))
          ),
          updatedAt: now,
        };
        for (const atom of sbqAtoms) {
          const key = stableAssetKey(atom.municipalityId, atom.provenance.origin, atom.title);
          nextStore = upsertEvidenceAtom(nextStore, atom, key);
        }
        return { ...prev, repository: nextRepository, sbqStudy: study, evidenceStore: nextStore, updatedAt: now };
      });
      setSbqMessage(
        `SBQ cargado: ${aggregates.nValid} registros válidos de ${aggregates.n}. Alt. sedentario (&gt;8h): ${aggregates.pctPositive.toFixed(1)} % (n=${aggregates.nPositive}). Media: ${aggregates.meanHours.toFixed(2)} h/día. ${sbqAtoms.length} evidencias incorporadas.${warn}`
      );
    } catch {
      setSbqMessage("Error al procesar el CSV. Verifica que incluya las columnas sbq_q1 a sbq_q9.");
    } finally {
      setIsLoadingSBQ(false);
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

  // ── Handlers del Gestor de Encuestas (GES) ────────────────────────────────

  function handleAddQuestionnaireProject(project: QuestionnaireProject): void {
    setWorkspace((prev) => ({
      ...prev,
      questionnaireProjects: [...(prev.questionnaireProjects ?? []), project],
      updatedAt: new Date().toISOString(),
    }));
  }

  function handleUpdateQuestionnaireProject(updated: QuestionnaireProject): void {
    setWorkspace((prev) => ({
      ...prev,
      questionnaireProjects: (prev.questionnaireProjects ?? []).map((p) =>
        p.id === updated.id ? updated : p
      ),
      updatedAt: new Date().toISOString(),
    }));
  }

  function handleDeleteQuestionnaireProject(projectId: string): void {
    setWorkspace((prev) => ({
      ...prev,
      questionnaireProjects: (prev.questionnaireProjects ?? []).filter((p) => p.id !== projectId),
      updatedAt: new Date().toISOString(),
    }));
  }

  async function handleImportProjectDataset(
    file: File,
    project: QuestionnaireProject
  ): Promise<void> {
    setIsImportingProjectDataset(true);
    try {
      const csvText = await file.text();
      const result = importProjectDataset(
        csvText,
        project.questionnaire.methodologicalModules,
        workspace.municipality.identity.id,
        file.name,
        project.id,
        project.name,
      );
      setWorkspace((prev) => {
        let next = { ...prev };
        for (const study of result.succeeded) {
          next = study.applyStudy(next);
        }
        return {
          ...next,
          projectDatasetImports: [...(next.projectDatasetImports ?? []), result.metadata],
          updatedAt: new Date().toISOString(),
        };
      });
      const { succeeded, skipped, failed, metadata } = result;
      const parts: string[] = [];
      if (succeeded.length > 0) {
        parts.push(`${succeeded.length} módulo${succeeded.length !== 1 ? "s" : ""} importado${succeeded.length !== 1 ? "s" : ""}: ${succeeded.map((s) => s.moduleId).join(", ")}`);
      }
      if (skipped.length > 0) parts.push(`${skipped.length} omitido${skipped.length !== 1 ? "s" : ""}`);
      if (failed.length > 0) parts.push(`${failed.length} fallido${failed.length !== 1 ? "s" : ""}`);
      setImportProjectDatasetMessage(
        parts.length > 0
          ? `${metadata.rowCount} fila${metadata.rowCount !== 1 ? "s" : ""} · ${parts.join(" · ")}.`
          : "CSV procesado sin módulos reconocidos."
      );
    } catch (err) {
      console.error("[import-project-dataset-error]", err);
      setImportProjectDatasetMessage("Error al procesar el CSV. Verifica que sea una exportación REDCap válida.");
    } finally {
      setIsImportingProjectDataset(false);
    }
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
    if (isAUDITCDocument(deletedDocument)) {
      setAuditcMessage(null);
      setIsLoadingAUDITC(false);
    }
    if (isIPAQDocument(deletedDocument)) {
      setIpaqMessage(null);
      setIsLoadingIPAQ(false);
    }
    if (isGHQ12Document(deletedDocument)) {
      setGhq12Message(null);
      setIsLoadingGHQ12(false);
    }
    if (isPHQ9Document(deletedDocument)) {
      setPhq9Message(null);
      setIsLoadingPHQ9(false);
    }
    if (isPSQIDocument(deletedDocument)) {
      setPsqiMessage(null);
      setIsLoadingPSQI(false);
    }
    if (isFagerstromDocument(deletedDocument)) {
      setFagerstromMessage(null);
      setIsLoadingFagerstrom(false);
    }
    if (isSBQDocument(deletedDocument)) {
      setSbqMessage(null);
      setIsLoadingSBQ(false);
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
      const deletesAUDITC = isAUDITCDocument(doc);
      const deletesIPAQ = isIPAQDocument(doc);
      const deletesGHQ12 = isGHQ12Document(doc);
      const deletesPHQ9 = isPHQ9Document(doc);
      const deletesPSQI = isPSQIDocument(doc);
      const deletesFagerstrom = isFagerstromDocument(doc);
      const deletesSBQ = isSBQDocument(doc);
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
                deletesAUDITC &&
                atom.provenance.origin === "complementary-study" &&
                atom.tags.includes(AUDITC_DOCUMENT_TAG)
              ) {
                return false;
              }
              if (
                deletesIPAQ &&
                atom.provenance.origin === "complementary-study" &&
                atom.tags.includes(IPAQ_DOCUMENT_TAG)
              ) {
                return false;
              }
              if (
                deletesGHQ12 &&
                atom.provenance.origin === "complementary-study" &&
                atom.tags.includes(GHQ12_DOCUMENT_TAG)
              ) {
                return false;
              }
              if (
                deletesPHQ9 &&
                atom.provenance.origin === "complementary-study" &&
                atom.tags.includes(PHQ9_DOCUMENT_TAG)
              ) {
                return false;
              }
              if (
                deletesPSQI &&
                atom.provenance.origin === "complementary-study" &&
                atom.tags.includes(PSQI_DOCUMENT_TAG)
              ) {
                return false;
              }
              if (
                deletesFagerstrom &&
                atom.provenance.origin === "complementary-study" &&
                atom.tags.includes(FAGERSTROM_DOCUMENT_TAG)
              ) {
                return false;
              }
              if (
                deletesSBQ &&
                atom.provenance.origin === "complementary-study" &&
                atom.tags.includes(SBQ_DOCUMENT_TAG)
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
        auditcStudy: deletesAUDITC ? undefined : prev.auditcStudy,
        ipaqStudy: deletesIPAQ ? undefined : prev.ipaqStudy,
        ghq12Study: deletesGHQ12 ? undefined : prev.ghq12Study,
        phq9Study: deletesPHQ9 ? undefined : prev.phq9Study,
        psqiStudy: deletesPSQI ? undefined : prev.psqiStudy,
        fagerstromStudy: deletesFagerstrom ? undefined : prev.fagerstromStudy,
        sbqStudy: deletesSBQ ? undefined : prev.sbqStudy,
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
      <nav className={view === "inicio" ? "app-nav app-nav--home" : "app-nav"}>
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

        {/* Franja de contexto municipal — oculta en inicio, visible en vistas operativas */}
        {view !== "inicio" && <div className="app-nav__municipality">
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
        </div>}
      </nav>

      {/* Ciclo de Planificación Local — oculto en inicio, visible en vistas operativas */}
      {view !== "inicio" && (
        <LocalHealthPlanningCycle
          healthReportLoaded={runtime.workspace.healthReport !== undefined}
          pslHasEvidence={runtime.psl.totalEvidenceAtoms > 0}
          pslStatus={runtime.psl.status}
          pslIsStale={runtime.pslIsStale}
          pslCompiled={(runtime.workspace.compiledProfiles?.length ?? 0) > 0}
          thematicPrioritisationDone={runtime.workspace.thematicPrioritisation !== undefined}
          onNavigate={(v) => setView(v as AppView)}
        />
      )}

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

        {/* ── ① Inicio — Portada institucional de COMPÁS */}
        {view === "inicio" && (
          <>
            {/* ═══ CUBIERTA — identidad COMPÁS NG ═══ */}
            <div className="home-cover">
              <div className="home-cover__stripe" />
              <div className="home-cover__inner">
                {/* Marco de referencia — sin atribución oficial */}
                <div className="home-cover__chain">
                  <span className="home-cover__chain-level">Marco de referencia</span>
                  <span className="home-cover__chain-sep">·</span>
                  <span className="home-cover__chain-level">RELAS</span>
                  <span className="home-cover__chain-sep">·</span>
                  <span className="home-cover__chain-level">Planificación Local de Salud</span>
                  <span className="home-cover__chain-sep">·</span>
                  <span className="home-cover__chain-level">Salud pública municipal</span>
                  <span className="home-cover__chain-sep">·</span>
                  <span className="home-cover__chain-level">Andalucía</span>
                </div>

                {/* Marca — el único foco visual */}
                <div className="home-cover__brand">
                  <h1 className="home-cover__wordmark">COMPÁS</h1>
                  <span className="home-cover__ng">NG</span>
                </div>

                {/* Regla de identidad — franja canónica bajo la marca */}
                <hr className="home-cover__rule" />

                {/* Subtítulo */}
                <p className="home-cover__subtitle">
                  Herramienta en desarrollo para la planificación local en salud
                </p>
              </div>
            </div>

            {/* ═══ MISIÓN — qué es y para qué sirve ═══ */}
            <section className="home-mission">
              <div className="home-mission__inner">
                <p className="home-mission__statement">
                  Prototipo metodológico orientado a apoyar la elaboración de Planes Locales
                  de Salud municipales, tomando como referencia el marco RELAS y la experiencia
                  acumulada de <strong>COMPÁS</strong>.
                </p>
                <div className="home-mission__context">
                  <p className="home-mission__context-label">Marco de referencia</p>
                  <ul className="home-mission__context-list">
                    <li className="home-mission__context-item">Marco RELAS · Planificación Local de Salud</li>
                    <li className="home-mission__context-item">Salud pública municipal · Andalucía</li>
                    <li className="home-mission__context-item">Experiencia histórica de COMPÁS</li>
                    <li className="home-mission__context-item">Herramienta en desarrollo — no desplegada oficialmente</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* ═══ PROCESO — cómo trabaja ═══ */}
            <section className="home-process">
              <div className="home-process__inner">
                <p className="home-section-eyebrow">Proceso</p>
                <h2 className="home-process__heading">El ciclo de planificación local en salud</h2>
                <div className="home-process__cycle">
                  <div className="home-process__phase home-process__phase--1">
                    <span className="home-process__ordinal">01</span>
                    <span className="home-process__verb">Diagnosticar</span>
                    <p className="home-process__desc">
                      Informe de salud, estudios complementarios y activos comunitarios
                      organizados y analizados.
                    </p>
                  </div>
                  <div className="home-process__phase home-process__phase--2">
                    <span className="home-process__ordinal">02</span>
                    <span className="home-process__verb">Perfilar</span>
                    <p className="home-process__desc">
                      Perfil de Salud Local: síntesis interpretativa validada técnicamente
                      por el equipo.
                    </p>
                  </div>
                  <div className="home-process__phase home-process__phase--3">
                    <span className="home-process__ordinal">03</span>
                    <span className="home-process__verb">Priorizar</span>
                    <p className="home-process__desc">
                      Selección técnica y participativa de las áreas de actuación
                      prioritarias.
                    </p>
                  </div>
                  <div className="home-process__phase home-process__phase--4">
                    <span className="home-process__ordinal">04</span>
                    <span className="home-process__verb">Planificar</span>
                    <p className="home-process__desc">
                      Plan de Acción: líneas de actuación, objetivos e indicadores
                      trazados al diagnóstico.
                    </p>
                  </div>
                  <div className="home-process__phase home-process__phase--5">
                    <span className="home-process__ordinal">05</span>
                    <span className="home-process__verb">Elaborar</span>
                    <p className="home-process__desc">
                      Plan Local de Salud: diagnóstico, priorización y plan
                      compilados como documento institucional.
                    </p>
                  </div>
                  <div className="home-process__phase home-process__phase--6">
                    <span className="home-process__ordinal">06</span>
                    <span className="home-process__verb">Evaluar</span>
                    <p className="home-process__desc">
                      Grado de cumplimiento del plan, resultados alcanzados y
                      recomendaciones para el ciclo siguiente.
                    </p>
                  </div>
                </div>
                <p className="home-process__note">
                  Las decisiones sobre el diagnóstico, la priorización y el plan corresponden
                  al equipo técnico, a la ciudadanía y a la autoridad competente.
                  COMPÁS organiza la información y apoya el proceso; no sustituye la deliberación
                  institucional.
                </p>
              </div>
            </section>

            {/* ═══ FLUJO — entradas y salidas de COMPÁS ═══ */}
            <section className="home-products">
              <div className="home-products__inner">

                {/* Zona 1: Fuentes — entran en COMPÁS, no las genera */}
                <div className="home-sources">
                  <p className="home-section-eyebrow">Fuentes para el diagnóstico</p>
                  <p className="home-sources__note">
                    Documentos elaborados fuera de COMPÁS e incorporados al proceso diagnóstico.
                  </p>
                  <div className="home-sources__list">
                    <div className="home-source">
                      <p className="home-source__name">Informe de Salud</p>
                      <p className="home-source__desc">
                        Documento fuente elaborado fuera de COMPÁS e incorporado
                        al proceso diagnóstico.
                      </p>
                    </div>
                    <div className="home-source">
                      <p className="home-source__name">Estudios complementarios</p>
                      <p className="home-source__desc">
                        Información recogida mediante estudios específicos que
                        complementa el diagnóstico territorial.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Conector — COMPÁS transforma las fuentes */}
                <div className="home-transform">
                  <span className="home-transform__arrow">↓</span>
                  <span className="home-transform__label">COMPÁS analiza y transforma</span>
                </div>

                {/* Zona 2: Salidas — documentos que genera COMPÁS */}
                <div className="home-outputs">
                  <p className="home-section-eyebrow">Documentos que produce COMPÁS NG</p>
                  <div className="home-products__list">
                    <div className="home-product home-product--1">
                      <p className="home-product__name">Perfil de Salud Local</p>
                      <p className="home-product__desc">
                        Síntesis interpretativa del diagnóstico territorial validada
                        técnicamente. Documento base para la planificación.
                      </p>
                    </div>
                    <div className="home-product home-product--2">
                      <p className="home-product__name">Perfil Ejecutivo de Salud Local</p>
                      <p className="home-product__desc">
                        Presentación ejecutiva y sintética del Perfil de Salud Local
                        destinada a comunicación institucional y apoyo a la toma de decisiones.
                      </p>
                    </div>
                    <div className="home-product home-product--3">
                      <p className="home-product__name">Plan de Acción Local en Salud</p>
                      <p className="home-product__desc">
                        Líneas estratégicas, objetivos, indicadores, programas y actuaciones
                        construidos a partir del diagnóstico y la priorización.
                      </p>
                    </div>
                    <div className="home-product home-product--4">
                      <p className="home-product__name">Plan Local de Salud</p>
                      <p className="home-product__desc">
                        Documento institucional que integra diagnóstico, priorización,
                        plan de acción, seguimiento y evaluación.
                      </p>
                    </div>
                    <div className="home-product home-product--5">
                      <p className="home-product__name">Informe de Evaluación</p>
                      <p className="home-product__desc">
                        Documento de evaluación anual, bianual, trianual o final
                        del Plan Local de Salud.
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </section>
          </>
        )}

        {/* ── ② Repositorio documental ─────────────────────── */}
        {view === "repositorio" && (
          <>
            {/* ── BLOQUE 1+2: Cabecera del diagnóstico territorial ── */}
            {(() => {
              const hrLoaded = runtime.workspace.healthReport !== undefined;
              const atoms = runtime.workspace.evidenceStore.atoms;
              const atomCount = atoms.length;
              const studies = [
                runtime.workspace.ibseStudy,
                runtime.workspace.dukeStudy,
                runtime.workspace.predimedStudy,
                runtime.workspace.sf12Study,
                runtime.workspace.suenoStudy,
                runtime.workspace.cageStudy,
                runtime.workspace.auditcStudy,
                runtime.workspace.ipaqStudy,
                runtime.workspace.ghq12Study,
                runtime.workspace.phq9Study,
                runtime.workspace.psqiStudy,
                runtime.workspace.fagerstromStudy,
                runtime.workspace.sbqStudy,
              ];
              const studiesLoaded = studies.filter(Boolean).length;
              const ibseAtoms = atoms.filter(a => a.provenance.origin === "ibse").length;
              const studyAtoms = atoms.filter(a => a.provenance.origin === "complementary-study").length;

              // Capa 3: Activos para la salud
              const docs = runtime.workspace.repository.documents;
              const assetDocs = docs.filter(
                (d) => d.kind === "community-asset" || d.kind === "localiza-salud"
              );
              const assetNames = assetDocs.flatMap((d) =>
                (d.sourceText ?? "").split("\n").map((s) => s.trim()).filter(Boolean)
              );
              const assetCount = assetNames.length;

              // Capa 4: Otras fuentes documentales (excluye capas 1–3).
              // Los marcos estratégicos y normativos (strategic-framework) se
              // excluyen también: son insumo del Plan de Acción / Plan Local de
              // Salud, no fuente diagnóstica del Perfil.
              const STUDY_TAGS = ["ibse", "duke-eas", "predimed-eas", "sf12-eas", "sueno-eas", "cage-eas", "auditc", "ipaq-eas", "ghq12", "phq9", "psqi", "fagerstrom", "sbq"];
              const otherDocCount = docs.filter(
                (d) =>
                  d.kind !== "health-report" &&
                  d.kind !== "community-asset" &&
                  d.kind !== "localiza-salud" &&
                  d.kind !== "complementary-study" &&
                  d.kind !== "strategic-framework" &&
                  !(d.kind === "redcap-export" && d.tags.some((t) => STUDY_TAGS.includes(t)))
              ).length;

              type DiagState = "ready" | "partial" | "empty";
              const diagState: DiagState =
                hrLoaded && atomCount > 0 ? "ready"
                : (hrLoaded || atomCount > 0 || docs.length > 0) ? "partial"
                : "empty";

              const conclusionMsg: Record<DiagState, string> = {
                ready:   "Diagnóstico con evidencia complementaria disponible para revisar el Perfil de Salud Local.",
                partial: "Diagnóstico en elaboración. Incorpora el Informe de Salud y fuentes complementarias para enriquecer el análisis territorial.",
                empty:   "El diagnóstico está vacío. Comienza incorporando el Informe de Salud del ámbito territorial.",
              };

              return (
                <section className="diag-header workspace-panel">
                  <div className="diag-header__title-row">
                    <div>
                      <p className="eyebrow">Diagnóstico territorial</p>
                      <h2 className="diag-header__municipality">{municipality.name}</h2>
                      <p className="diag-header__subtitle">
                        Estado metodológico del diagnóstico del ámbito territorial.
                      </p>
                    </div>
                  </div>

                  <div className="diag-status">
                    <p className="diag-status__heading">Estado del diagnóstico</p>
                    <ul className="diag-status__list">
                      <li className={`diag-status__item diag-status__item--${hrLoaded ? "ok" : "missing"}`}>
                        <span className="diag-status__label">Informe de Salud</span>
                        <span className="diag-status__value">
                          {hrLoaded ? "Fuente primaria disponible" : "No incorporado"}
                        </span>
                      </li>
                      <li className={`diag-status__item diag-status__item--${studiesLoaded > 0 ? "ok" : "pending"}`}>
                        <span className="diag-status__label">Estudios complementarios</span>
                        <span className="diag-status__value">
                          {studiesLoaded > 0
                            ? `${studiesLoaded} de 13 · ${ibseAtoms + studyAtoms} evidencias`
                            : "Ninguno incorporado"}
                        </span>
                      </li>
                      <li className={`diag-status__item diag-status__item--${assetCount > 0 ? "ok" : "pending"}`}>
                        <span className="diag-status__label">Activos para la salud</span>
                        <span className="diag-status__value">
                          {assetCount > 0 ? `${assetCount} activos incorporados` : "Sin activos registrados"}
                        </span>
                      </li>
                      <li className={`diag-status__item diag-status__item--${otherDocCount > 0 ? "ok" : "pending"}`}>
                        <span className="diag-status__label">Otras fuentes documentales</span>
                        <span className="diag-status__value">
                          {otherDocCount > 0 ? `${otherDocCount} registradas` : "Ninguna registrada"}
                        </span>
                      </li>
                    </ul>

                    <div className={`diag-status__conclusion diag-status__conclusion--${diagState}`}>
                      {conclusionMsg[diagState]}
                    </div>
                  </div>
                </section>
              );
            })()}

            {/* ── Capas del diagnóstico ── */}
            <HealthReportViewer
              healthReport={runtime.workspace.healthReport}
            />
            <EstudiosComplementariosPanel
              municipalityName={municipality.name}
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
              auditcStudy={runtime.workspace.auditcStudy}
              isLoadingAUDITC={isLoadingAUDITC}
              auditcMessage={auditcMessage}
              onLoadAUDITCCSV={handleLoadAUDITCCSV}
              ipaqStudy={runtime.workspace.ipaqStudy}
              isLoadingIPAQ={isLoadingIPAQ}
              ipaqMessage={ipaqMessage}
              onLoadIPAQCSV={handleLoadIPAQCSV}
              ghq12Study={runtime.workspace.ghq12Study}
              isLoadingGHQ12={isLoadingGHQ12}
              ghq12Message={ghq12Message}
              onLoadGHQ12CSV={handleLoadGHQ12CSV}
              phq9Study={runtime.workspace.phq9Study}
              isLoadingPHQ9={isLoadingPHQ9}
              phq9Message={phq9Message}
              onLoadPHQ9CSV={handleLoadPHQ9CSV}
              psqiStudy={runtime.workspace.psqiStudy}
              isLoadingPSQI={isLoadingPSQI}
              psqiMessage={psqiMessage}
              onLoadPSQICSV={handleLoadPSQICSV}
              fagerstromStudy={runtime.workspace.fagerstromStudy}
              isLoadingFagerstrom={isLoadingFagerstrom}
              fagerstromMessage={fagerstromMessage}
              onLoadFagerstromCSV={handleLoadFagerstromCSV}
              sbqStudy={runtime.workspace.sbqStudy}
              isLoadingSBQ={isLoadingSBQ}
              sbqMessage={sbqMessage}
              onLoadSBQCSV={handleLoadSBQCSV}
              repository={runtime.workspace.repository}
              onDeleteDocument={handleDeleteDocument}
            />
            <ActivosSaludPanel
              repository={runtime.workspace.repository}
              onDeleteDocument={handleDeleteDocument}
            />
            <DocumentRepositoryPanel
              repository={runtime.workspace.repository}
              onDelete={handleDeleteDocument}
            />

            {/* ── BLOQUE 4: Añadir o sustituir fuentes ── */}
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
              onLoadDocumentFile={handleLoadDocumentFile}
              isLoadingDocumentFile={isLoadingDocumentFile}
              documentFileMessage={documentFileMessage}
            />

            {/* ── BLOQUE 5: Evidencias incorporadas al análisis ── */}
            <EvidenceStorePanel
              evidenceStore={runtime.workspace.evidenceStore}
              defaultOpen={false}
            />

            {/* ── BLOQUE 6: Continuación del proceso ── */}
            <section className="diag-continue workspace-panel">
              <div className="diag-continue__inner">
                <div>
                  <p className="diag-continue__label">Siguiente paso</p>
                  <p className="diag-continue__text">
                    Revisar el diagnóstico e iniciar la elaboración del Perfil de Salud Local
                  </p>
                </div>
                <button
                  type="button"
                  className="diag-continue__btn"
                  onClick={() => setView("psl")}
                >
                  Ir al Perfil de Salud Local →
                </button>
              </div>
            </section>
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
          <>
            <LocalHealthProfileView
              psl={runtime.psl}
              pslIsStale={runtime.pslIsStale}
              municipalityName={municipality.name}
              indicatorReferences={
                buildIndicatorComparisonReferences({ workspace }).references
              }
              epistemicMetrics={
                workspace.perfilLocalDeSalud !== undefined
                  ? computePerfilEpistemicMetrics(workspace.perfilLocalDeSalud)
                  : undefined
              }
              compiledProfiles={workspace.compiledProfiles}
              onValidate={handleValidatePSL}
              onInvalidate={handleInvalidatePSL}
              onEditConclusion={handleEditPSLConclusion}
              onEditCierreInterpretativo={handleEditPSLCierreInterpretativo}
              onDocumentarDeliberacion={handleDocumentarDeliberacion}
              onCompile={handleCompilePSL}
              onApprove={handleApprovePSL}
            />
            <PerfilFuentesPanel workspace={workspace} />
            <PerfilLocalDeSaludPanel
              perfil={workspace.perfilLocalDeSalud}
              municipalityId={municipality.id}
              municipalityName={municipality.name}
              onUpdatePerfil={handleUpdatePerfilLocalDeSalud}
            />
          </>
        )}

        {/* ── ④b Panel de Salud Local ────────────────── */}
        {view === "nhs" && (
          workspace.nhsArtifact ? (
            <NHSHealthProfileView artifact={workspace.nhsArtifact} />
          ) : (
            <section className="workspace-panel">
              <p className="eyebrow">Panel de Salud Local · {municipality.name}</p>
              <h2>Panel de Salud Local</h2>
              <p className="panel-note">
                El Panel de Salud Local es una síntesis visual del Perfil de Salud Local,
                con indicadores clave, comparación territorial y mensajes principales para
                comunicación institucional y ciudadana. Inspirado en los NHS Health Profiles.
              </p>
              {pslValidated ? (
                <>
                  <p className="panel-note">
                    El Perfil de Salud Local está validado y hay {runtime.psl.complementaryStudyCount} instrumento(s) disponible(s).
                    Puede generarse el Panel de Salud Local.
                  </p>
                  <button
                    type="button"
                    className="psl-doc-compile-action__btn"
                    onClick={handleCompileNHS}
                  >
                    Generar Panel de Salud Local
                  </button>
                </>
              ) : (
                <p className="panel-note">
                  El Perfil de Salud Local debe estar validado para generar el Panel de Salud Local.
                </p>
              )}
            </section>
          )
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

        {/* ── ⑥ Lectura Estratégica Local + PAI ───────────────── */}
        {view === "lectura" && (
          runtime.lectura ? (
            <>
              <LecturaEstrategicaView lectura={runtime.lectura} />
              {runtime.pai && <PAIView pai={runtime.pai} />}
            </>
          ) : (
            <section className="workspace-panel">
              <p className="eyebrow">Producto 5 · Motor de Traducción Estratégica</p>
              <h2>Lectura Estratégica Local</h2>
              <p className="panel-note">
                La Lectura Estratégica Local se genera automáticamente cuando el Perfil de Salud
                Local está validado. Navega a "Perfil de Salud Local" y valida el PSL para
                activar este producto.
              </p>
              {pslValidated === false && (
                <p className="panel-note">
                  El PSL está en estado "{runtime.psl.status}". Se requiere "validated" o "approved".
                </p>
              )}
            </section>
          )
        )}

        {/* ── ⑦ Plan de Acción — priorización + encaje EPVSA + plan + agenda + seguimiento */}
        {view === "plan" && (
          <>
            {/* Priorización — integrada en Plan de Acción (antes view independiente) */}
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
            <PrioritizationPanel
              prioritization={runtime.prioritization}
              pslStatus={runtime.psl.status}
              pslIsStale={runtime.pslIsStale}
              hasInsufficientEvidence={pipelineIsEmpty}
            />
            <div className="repo-section-divider">
              <span className="repo-section-divider__text">Participación ciudadana</span>
            </div>
            <ThematicPrioritisationPanel
              savedIds={
                runtime.workspace.thematicPrioritisation?.selectedTopicIds ?? []
              }
              onOpen={handleOpenThematicModal}
            />
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

        {/* ── ⑧ Plan Local de Salud — espacio canónico (compilador pendiente) */}
        {view === "plan-local" && (
          <section className="workspace-panel">
            <p className="eyebrow">Planificación municipal · {municipality.name}</p>
            <h2>Plan Local de Salud</h2>
            <p className="panel-note">
              El Plan Local de Salud es el documento institucional definitivo del proceso de
              planificación. Integra el Perfil de Salud Local, la priorización, el Plan de Acción
              validado, la agenda de actuaciones, el sistema de seguimiento y la evaluación en un
              compromiso formal de la corporación municipal.
            </p>
            {workspace.pslApproval !== undefined ? (
              <p className="panel-note">
                El Perfil de Salud Local está aprobado institucionalmente. La compilación del Plan
                Local de Salud estará disponible en la siguiente versión del sistema.
              </p>
            ) : pslValidated ? (
              <p className="panel-note">
                El Perfil de Salud Local está validado técnicamente. Para compilar el Plan Local de
                Salud es necesario que el Perfil sea aprobado institucionalmente y que el Plan de
                Acción haya sido validado formalmente.
              </p>
            ) : (
              <p className="panel-note">
                Para compilar el Plan Local de Salud es necesario completar primero el Perfil de
                Salud Local y validarlo técnicamente.
              </p>
            )}
          </section>
        )}

        {/* ── ⑨ Evaluación — espacio canónico (pendiente de implementación) */}
        {view === "evaluacion" && (
          <section className="workspace-panel">
            <p className="eyebrow">Evaluación del Plan · {municipality.name}</p>
            <h2>Evaluación del Plan Local de Salud</h2>
            <p className="panel-note">
              El Informe de Evaluación valora el grado de cumplimiento del Plan Local de Salud,
              los resultados alcanzados y las recomendaciones para el ciclo siguiente. Puede
              realizarse de forma anual, bianual, trianual o como evaluación final del plan.
            </p>
            <p className="panel-note">
              Este espacio estará disponible cuando el Plan Local de Salud se encuentre en
              fase de seguimiento y evaluación.
            </p>
          </section>
        )}

        {/* ── Gestor de Encuestas de Salud (GES) */}
        {view === "ges" && (
          <GESPanel
            projects={workspace.questionnaireProjects ?? []}
            projectDatasetImports={workspace.projectDatasetImports}
            municipalityName={municipality.name}
            onAddProject={handleAddQuestionnaireProject}
            onUpdateProject={handleUpdateQuestionnaireProject}
            onDeleteProject={handleDeleteQuestionnaireProject}
            onImportProjectDataset={handleImportProjectDataset}
            isImportingProjectDataset={isImportingProjectDataset}
            importProjectDatasetMessage={importProjectDatasetMessage}
          />
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
