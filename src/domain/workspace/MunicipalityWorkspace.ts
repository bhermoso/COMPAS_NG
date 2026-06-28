import type { MunicipalityContext } from "../municipality";
import type { MunicipalDocumentRepository } from "../repository";
import type { EvidenceStore } from "../evidence";
import type { HealthReportDocument } from "../health-report";
import type { IBSEStudy } from "../ibse";
import type { DUKEStudy } from "../duke";
import type { PREDIMEDStudy } from "../predimed";
import type { SF12Study } from "../sf12";
import type { SuenoStudy } from "../sueno";
import type { CAGEStudy } from "../cage";
import type { ThematicPrioritisation, ThematicPrioritisationStudy } from "../thematic-prioritisation";
import type { LocalHealthProfile } from "../health-profile";
import type { LocalHealthProfileArtifact } from "../health-profile-artifact";
import type { PSLApprovalRecord, FormalValidationRecord } from "../institutional-lifecycle";

/**
 * Snapshot compacto del Estado Territorial Evolutivo.
 * Almacena sólo datos escalares — sin arrays de EvidenceAtom —
 * para que el historial sea persistible en localStorage sin explosión de tamaño.
 * Definido en la capa de dominio porque forma parte del estado del Workspace.
 */
export interface TerritorialStateRecord {
  version: string;           // = evidenceStore.updatedAt en el momento de la captura
  municipalityId: string;
  generadoEn: string;        // ISO timestamp de cuándo se creó este registro
  totalEvidencias: number;
  cuentasDiagnosticas: {
    determinantes: number;
    activos: number;
    indicadores: number;
    hallazgosParticipativos: number;
    cautelasMetodologicas: number;
  };
  resumenTerritorial: string;
  origenesPresentes: string[];
  longitudinalActiva: boolean;
  longitudinalNota: string;
  longitudinalEvidencias: number;
  tensionesEstructurales: string[];
  marcosAplicados: Array<{ framework: string; elementCount: number }>;
  totalAreasIntervencion: number;
}

export interface MunicipalityWorkspace {
  municipality: MunicipalityContext;
  repository: MunicipalDocumentRepository;
  evidenceStore: EvidenceStore;
  healthReport?: HealthReportDocument;
  ibseStudy?: IBSEStudy;
  dukeStudy?: DUKEStudy;
  predimedStudy?: PREDIMEDStudy;
  sf12Study?: SF12Study;
  suenoStudy?: SuenoStudy;
  cageStudy?: CAGEStudy;
  thematicPrioritisation?: ThematicPrioritisation;
  thematicPrioritisationStudy?: ThematicPrioritisationStudy;
  /**
   * Historial de snapshots del Estado Territorial Evolutivo.
   * Acumulativo: cada versión de la evidencia produce una entrada nueva.
   * No destructivo: las entradas previas se conservan.
   * Máximo configurado en la capa de aplicación (App.tsx).
   */
  historialEstadosTerritorial?: TerritorialStateRecord[];
  /**
   * PSL validado técnicamente por el equipo.
   * Cuando existe, el runtime lo usa como objeto canónico para el Nivel 3
   * en lugar de regenerar uno nuevo en estado "generated".
   * Se invalida explícitamente por el usuario cuando la evidencia cambia.
   */
  validatedPSL?: LocalHealthProfile;
  /**
   * PSL-C compilados (LocalHealthProfileArtifact).
   * Acumulativos: cada compilación añade un nuevo artefacto.
   * Inmutables: nunca se sobreescriben. Historial completo por municipio.
   * Ordenados cronológicamente por compiledAt (el más reciente es el último).
   */
  compiledProfiles?: LocalHealthProfileArtifact[];
  /**
   * Registro de la aprobación institucional del PSL (transición validated → approved).
   * Complementa los campos psl.approvedAt / psl.approvedBy con los datos
   * institucionales del acto de aprobación (órgano, referencia externa, notas).
   * Solo existe cuando el PSL activo está en estado "approved".
   */
  pslApproval?: PSLApprovalRecord;
  /**
   * Registros de validación formal de borradores del Nivel 3.
   * Un registro por target (action-plan, agenda, monitoring-framework).
   * Se invalidan automáticamente si el PSL cambia de versión.
   */
  formalValidations?: FormalValidationRecord[];
  schemaVersion: string;
  createdAt: string;
  updatedAt: string;
}

export function createMunicipalityWorkspace(
  municipality: MunicipalityContext,
  repository: MunicipalDocumentRepository,
  evidenceStore: EvidenceStore
): MunicipalityWorkspace {
  const now = new Date().toISOString();

  return {
    municipality,
    repository,
    evidenceStore,
    schemaVersion: "1.0.0",
    createdAt: now,
    updatedAt: now,
  };
}
