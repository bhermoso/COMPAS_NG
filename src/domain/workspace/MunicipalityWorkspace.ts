import type { MunicipalityContext } from "../municipality";
import type { MunicipalDocumentRepository } from "../repository";
import type { EvidenceStore } from "../evidence";
import type { HealthReportDocument } from "../health-report";
import type { IBSEStudy } from "../ibse";
import type { ThematicPrioritisation, ThematicPrioritisationStudy } from "../thematic-prioritisation";

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
  thematicPrioritisation?: ThematicPrioritisation;
  thematicPrioritisationStudy?: ThematicPrioritisationStudy;
  /**
   * Historial de snapshots del Estado Territorial Evolutivo.
   * Acumulativo: cada versión de la evidencia produce una entrada nueva.
   * No destructivo: las entradas previas se conservan.
   * Máximo configurado en la capa de aplicación (App.tsx).
   */
  historialEstadosTerritorial?: TerritorialStateRecord[];
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
