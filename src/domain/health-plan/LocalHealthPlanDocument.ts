/**
 * LocalHealthPlanDocument (PLS)
 *
 * Plan Local de Salud como documento institucional definitivo.
 * El compilador lo produce; la corporación municipal lo aprueba.
 *
 * Contratos de referencia:
 *  - CONTRACT-LOCAL-HEALTH-PLAN-DOCUMENT — define qué es y qué contiene
 *  - CONTRACT-LOCAL-HEALTH-PLAN-COMPILER — define cómo se produce
 *
 * Invariante: isCongealed === true.
 * El documento compilado nunca puede modificarse.
 * Cada ciclo de planificación produce un nuevo documento con versión mayor.
 */

import type { MunicipalityId } from "../municipality";
import type { CompilationManifest } from "../compilation";

// ── Período de planificación ──────────────────────────────────────────────────

export interface PlanningPeriod {
  start: string;   // Año de inicio (ISO date: "2027-01-01")
  end: string;     // Año de cierre (ISO date: "2030-12-31")
  label: string;   // Etiqueta legible: "2027–2030"
}

// ── Aprobación institucional ──────────────────────────────────────────────────

export interface InstitutionalApproval {
  approvedAt: string;       // ISO timestamp de aprobación
  approvedBy: string;       // Representante que aprueba (cargo + nombre)
  approvingBody: string;    // "Pleno municipal" | "Junta de gobierno local" | otro
  referenceActa?: string;   // Referencia al acta o acuerdo externo al sistema
}

// ── Necesidad no priorizada ───────────────────────────────────────────────────

export interface UnaddressedNeed {
  id: string;
  title: string;              // Necesidad identificada en el diagnóstico
  sourceAreaId?: string;      // ID del área de intervención del PSL de origen
  justification: string;      // Por qué no se prioriza en este ciclo
}

// ── Secciones del PLS ─────────────────────────────────────────────────────────
// Cada sección captura el contenido tal como fue validado y aprobado.
// No expone objetos técnicos del pipeline.

export interface PLSSectionResumenEjecutivo {
  // Compilado por el sistema a partir de hitos del PLS + revisable por el equipo.
  content: string;
}

export interface PLSSectionPortada {
  municipalityName: string;
  municipalityProvince: string;
  planningPeriod: PlanningPeriod;
  compiledAt: string;
  planVersion: string;   // PLS/v1, PLS/v2, …
}

export interface PLSSectionMarcoInstitucional {
  // Marcos estratégicos de referencia: RELAS, ESCA, EPVSA, PSMA, PEM y otros.
  // Compilado desde el PSL Cap. I + StrategicRepository (cuando esté disponible).
  strategicFrameworkSectionIds: string[];
  // Nota sobre articulación provisional (cuando el MTE no esté disponible):
  articulacionProvisionalmente?: string;
}

export interface PLSSectionContextoTerritorial {
  municipalityId: MunicipalityId;
  municipalityName: string;
  municipalityProvince: string;
  // Datos de contexto del workspace en el momento de compilación
  contextNote: string;
}

export interface PLSSectionDiagnosticoTerritorial {
  // El PLS integra el PSL-C por referencia (Opción A de CONTRACT-LOCAL-HEALTH-PLAN-DOCUMENT).
  // No reproduce el contenido diagnóstico: referencia el artefacto congelado.
  pslCArtifactId: string;       // ID del LocalHealthProfileArtifact incluido
  pslCVersion: string;          // PSL-C/vN del artefacto referenciado
  pslCSourceHash: string;       // sourceHash del PSL-C, para verificar integridad posterior
  pslCCompiledAt: string;       // Cuándo fue compilado el PSL-C
}

export interface PLSSectionPriorizacion {
  // Prioridades seleccionadas tras deliberación del Grupo Motor.
  prioridadesSeleccionadas: Array<{
    id: string;
    title: string;
    rationale: string;             // Justificación de la selección
    participatorySupport: boolean; // ¿Tiene respaldo de la priorización ciudadana?
  }>;
  unaddressedNeeds: UnaddressedNeed[];   // Necesidades no priorizadas (obligatorio)
  deliberacionNota: string;
  consensoDocumentado: boolean;          // Siempre true en este punto
}

export interface PLSSectionArticulacionInstitucional {
  // Correspondencias con marcos estratégicos.
  // Provisional: EPVSATranslator; Canónico: MTE (cuando esté disponible).
  isProvisional: boolean;
  // Si isProvisional === true, el PLS debe marcar esta sección explícitamente.
  provisionNote?: string;
  alignments: Array<{
    priorityId: string;
    priorityTitle: string;
    framework: string;             // "EPVSA" | "ESCA" | "RELAS" | etc.
    line: string;                  // Línea estratégica correspondiente
    nature: "normative-reference" | "guaranteed-capacity" | "provisional";
    rationale: string;
  }>;
}

export interface PLSSectionPlanAccion {
  // Cap. VII del PLS. Validado formalmente por el Grupo Motor.
  // Cada objetivo tiene sus actuaciones, indicadores, responsables y plazos.
  objectives: Array<{
    id: string;
    title: string;
    type: "general" | "specific";
    linkedPriorityId: string;
    actions: Array<{
      id: string;
      title: string;
      description: string;
      responsible: string;          // Persona nominada con cargo
      institution: string;          // Institución responsable
      deadline: string;             // Fecha límite (ISO date)
      resourcesNote?: string;       // Recursos estimados
      targetPopulation?: string;
      institutionalOrigin: "sspa-esca" | "municipality" | "intersectoral";
      indicators: Array<{
        id: string;
        title: string;
        type: "process" | "outcome" | "impact";
        operationalDefinition: string;
        numerator: string;
        denominator: string;
        dataSource: string;
        frequency: string;
        baseline: string;    // Tiempo cero — obligatorio (PM invariante)
        target: string;
        measurementResponsible: string;
      }>;
    }>;
  }>;
}

export interface PLSSectionAgenda {
  // Cap. VIII del PLS. Distribución temporal validada por ciclos municipales reales.
  items: Array<{
    id: string;
    linkedActionId: string;
    linkedActionTitle: string;
    period: string;       // Trimestre o fecha real: "Q1 2027", "enero-marzo 2027"
    responsible: string;  // Responsable real (no genérico)
    conditions?: string;  // Condiciones de ejecución
  }>;
}

export interface PLSSectionSeguimiento {
  // Cap. IX del PLS: Marco de seguimiento inicial + Marco de evaluación.
  trackingItems: Array<{
    id: string;
    linkedAgendaItemId: string;
    status: "pending" | "planned" | "in-progress" | "completed";
    measurementFrequency: string;
    alertThreshold?: string;
    measurementResponsible: string;
  }>;
  evaluationFramework: {
    evaluationQuestions: string[];   // Preguntas de evaluación (obligatorio)
    evaluationMoments: string[];     // Cuándo se mide: "final del período", "año 2"
    evaluationResponsible: string;
    baselineNote: string;            // Nota sobre la documentación del tiempo cero
  };
}

export interface PLSSectionGobernanza {
  // Marco de gobernanza del proceso.
  grupoMotor: {
    composition: string;   // Descripción de la composición
    meetingFrequency: string;
    coordinator?: string;
  };
  citizenParticipation?: {
    mechanism: string;
    frequency: string;
  };
  monitoringCommission?: {
    composition: string;
    meetingFrequency: string;
  };
}

export interface PLSSectionAnexosMetodologicos {
  // Fichas de indicadores completas, notas metodológicas, etc.
  // Compilados automáticamente desde los metadatos del PSL y del EvidenceStore.
  integrityWarnings: number;
  integrityErrors: number;
  totalEvidenceAtoms: number;
  complementaryStudies: string[];   // Estudios presentes en el diagnóstico
  methodologicalNotes: string[];
}

// ── LocalHealthPlanDocument ───────────────────────────────────────────────────

export interface LocalHealthPlanDocument {

  // ── Identidad del artefacto ───────────────────────────────────────────────
  id: string;
  municipalityId: MunicipalityId;
  planVersion: string;           // PLS/v1, PLS/v2, …

  // ── Período de planificación ──────────────────────────────────────────────
  planningPeriod: PlanningPeriod;

  // ── Aprobación institucional ──────────────────────────────────────────────
  // Puede estar presente en el momento de compilación o registrarse después.
  institutionalApproval?: InstitutionalApproval;

  // ── Manifest de compilación (§7 del contrato) ─────────────────────────────
  manifest: CompilationManifest;

  // ── Secciones del documento (§3 del CONTRACT-LOCAL-HEALTH-PLAN-DOCUMENT) ──
  resumenEjecutivo: PLSSectionResumenEjecutivo;
  portada: PLSSectionPortada;
  marcoInstitucional: PLSSectionMarcoInstitucional;
  contextoTerritorial: PLSSectionContextoTerritorial;
  diagnosticoTerritorial: PLSSectionDiagnosticoTerritorial;
  priorizacion: PLSSectionPriorizacion;
  articulacionInstitucional: PLSSectionArticulacionInstitucional;
  planAccion: PLSSectionPlanAccion;
  agenda: PLSSectionAgenda;
  seguimiento: PLSSectionSeguimiento;
  gobernanza: PLSSectionGobernanza;
  anexosMetodologicos: PLSSectionAnexosMetodologicos;
  // § XI (Memoria del proceso): responsabilidad humana exclusiva, no compilada por el sistema
  // § AN (Nota de aprobación): en institutionalApproval

  // ── Invariante de congelación ─────────────────────────────────────────────
  isCongealed: true;
}
