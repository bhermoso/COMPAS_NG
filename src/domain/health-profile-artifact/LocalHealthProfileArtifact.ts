import type { MunicipalityId } from "../municipality";
import type {
  HypothesisPlausibilidad,
  OpenQuestionUrgencia,
  ProfileSpace,
} from "../health-profile";

// ── EKC Snapshot ──────────────────────────────────────────────────────────────
// Fotografía estable del Estado del Conocimiento en el momento de compilación.
// Derivada de computePerfilEstadoGlobal(perfil) — no duplica lógica de cálculo.

export interface EKCSnapshot {
  capturedAt: string;
  interpretacionesActivas: number;
  interpretacionesSuperadas: number;
  hipotesisActivas: number;
  hipotesisResueltas: number;
  hipotesisDescartadas: number;
  preguntasAbiertas: number;
  preguntasResueltas: number;
  tieneSintesis: boolean;
  alertasGlobalesCount: number;
  ultimaActualizacion: string;
}

// ── Proyecciones del PerfilLocalDeSalud ───────────────────────────────────────
// Representación institucional mínima. Sin IDs internos ni arrays de trabajo.

export interface PSLCArtifactHipotesis {
  enunciado: string;
  plausibilidad: HypothesisPlausibilidad;
  espacio: ProfileSpace;
  formuladaEn: string;
  autorNombre: string;
}

export interface PSLCArtifactPreguntaAbierta {
  formulacion: string;
  relevancia: string;
  urgencia: OpenQuestionUrgencia;
  espacio: ProfileSpace;
  creadaEn: string;
}

// ── Secciones del PSL-C ───────────────────────────────────────────────────────
// Cada sección mapea campos del LocalHealthProfile a su representación
// institucional. No expone tipos internos del pipeline.

export interface PSLCArtifactPortada {
  municipalityName: string;
  municipalityProvince: string;
  compiledAt: string;        // ISO timestamp de compilación
  artifactVersion: string;   // PSL-C/v1, PSL-C/v2, …
}

export interface PSLCArtifactIdentificacion {
  municipalityId: MunicipalityId;
  municipalityName: string;
  municipalityProvince: string;
  pslGeneratedAt: string;    // cuándo se generó el PSL origen
  pslValidatedAt?: string;   // cuándo fue validado por el equipo técnico
  pslValidatedBy?: string;   // perfil técnico que lo validó
}

export interface PSLCArtifactMarcoEstrategico {
  sectionIds: string[];      // IDs de las secciones del StrategicFramework aplicadas
}

export interface PSLCArtifactInformeSalud {
  // Invariante PSL-I1: referencia al Informe de Salud; nunca su contenido.
  documentId?: string;
  title?: string;
  sectionCount: number;
  atomCount: number;
}

export interface PSLCArtifactBaseDocumental {
  totalEvidenceAtoms: number;
  integrityErrors: number;
  integrityWarnings: number;
  atomsByOrigin: Record<string, number>;
  atomsByKind: Record<string, number>;
  originsSummary: string[];
  complementaryStudyCount: number;
  ibsePresent: boolean;
  dukePresent: boolean;
  predimedPresent: boolean;
  sf12Present: boolean;
  suenoPresent: boolean;
  cagePresent: boolean;
  auditcPresent?: boolean;
  ipaqPresent?: boolean;
  ghq12Present?: boolean;
  phq9Present?: boolean;
  psqiPresent?: boolean;
  fagerstromPresent?: boolean;
  sbqPresent?: boolean;
  thematicPrioritisationPresent: boolean;
}

export interface PSLCArtifactAreaIntervencion {
  // No incluye IDs internos ni relatedEvidenceIds: son información institucional.
  title: string;
  rationale: string;
  cautions: string[];
}

export interface PSLCArtifactLecturaTerritorial {
  territorialSummary: string;
  determinantCount: number;
  assetCount: number;
  indicatorCount: number;
  qualitativeFindingCount: number;
  methodologicalCautionCount: number;
  preliminaryOpportunities: string[];
  longitudinalActive: boolean;
  longitudinalNote: string;
  longitudinalEvidenceCount: number;
  marcosAplicados: ReadonlyArray<{ framework: string; elementCount: number }>;
  tensionesEstructurales: string[];
  limitacionesDiagnosticas?: string[];
  tensionesEscaladasCount: number;
  tensionesNoEscaladasCount: number;
  ruidoEstructuralCount: number;
  conflictosCount: number;
  areasDeIntervencion: PSLCArtifactAreaIntervencion[];
}

export interface PSLCArtifactConclusiones {
  content: string;    // Documento narrativo del Perfil (seis capítulos, autoría humana)
}

export interface PSLCArtifactCierreInterpretativo {
  content: string;    // Cierre interpretativo (bloque no capitular, autoría humana)
}

export interface PSLCArtifactCandidatura {
  title: string;
  rationale: string;
}

export interface PSLCArtifactPriorizacion {
  candidaturasTecnicas: PSLCArtifactCandidatura[];
  hasTechnicalCandidatures: boolean;
  tematicasSeleccionadasLabels: string[];
  hasParticipatorySelection: boolean;
  deliberacionNota: string;
  consensoDocumentado: boolean;
  priorizacionStatus: "scaffold" | "partial" | "complete";
}

export interface PSLCArtifactNotaValidacion {
  pslValidatedAt?: string;
  pslValidatedBy?: string;
  compiledAt: string;
  compiledBy?: string;
  sourcePSLId: string;
  sourceHash: string;
}

export interface PSLCArtifactCautelas {
  integrityErrors: number;
  integrityWarnings: number;
  hasCautelas: boolean;
  // Nota institucional fija para cualquier PSL-C exportado
  nota: string;
}

// ── LocalHealthProfileArtifact (PSL-C) ───────────────────────────────────────

export interface LocalHealthProfileArtifact {

  // ── Identidad del artefacto ───────────────────────────────────────────────
  id: string;
  municipalityId: MunicipalityId;
  artifactVersion: string;         // PSL-C/vN (N = número secuencial por municipio)
  compiledAt: string;              // ISO timestamp de compilación
  compiledBy?: string;             // Perfil técnico que ejecutó la compilación

  // ── Trazabilidad (§7 del contrato) ───────────────────────────────────────
  sourcePSLId: string;
  sourcePSLVersion: string;        // = psl.version del PSL origen
  sourcePSLEvidenceStoreVersion: string;  // = psl.evidenceStoreVersion del PSL origen
  sourceHash: string;              // hash determinista del contenido del PSL fuente
  evidenceAtomIds: string[];       // IDs de átomos del PSL en el momento de compilación

  // ── Secciones del documento institucional ────────────────────────────────
  portada: PSLCArtifactPortada;
  identificacionMunicipal: PSLCArtifactIdentificacion;
  marcoEstrategico: PSLCArtifactMarcoEstrategico;
  informeSalud: PSLCArtifactInformeSalud;
  baseDocumental: PSLCArtifactBaseDocumental;
  lecturaTerritorial: PSLCArtifactLecturaTerritorial;
  conclusiones: PSLCArtifactConclusiones;
  cierreInterpretativo: PSLCArtifactCierreInterpretativo;
  priorizacion: PSLCArtifactPriorizacion;
  notaValidacion: PSLCArtifactNotaValidacion;
  cautelasMetodologicas: PSLCArtifactCautelas;

  // ── Puente PerfilLocalDeSalud → PSL-C ────────────────────────────────────
  // Campos opcionales según si se pasó un PerfilLocalDeSalud en la compilación.
  ekcSnapshot: EKCSnapshot | null;
  hipotesisActivas: PSLCArtifactHipotesis[];
  preguntasAbiertas: PSLCArtifactPreguntaAbierta[];
  generatedFromPerfilId: string | null;

  // ── Invariante de congelación ─────────────────────────────────────────────
  isCongealed: true;
}
