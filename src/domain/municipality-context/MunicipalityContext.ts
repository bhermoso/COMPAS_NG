/**
 * Contrato canónico de municipio para los motores de COMPÁS NG.
 *
 * Nota de nomenclatura: el tipo se llama MunicipalSnapshot (no MunicipalityContext)
 * porque MunicipalityContext ya existe en domain/municipality como objeto de
 * identidad/estado. Usar el mismo nombre causaría conflictos de import.
 * MunicipalSnapshot refleja mejor su semántica: es una fotografía del estado
 * completo de un municipio en un instante dado.
 *
 * No contiene lógica. No transforma. No interpreta.
 * Es un contenedor puro destinado a convertirse en la entrada única de los
 * futuros motores (Perfil de Salud Local, LT1, OIT, priorización, IA).
 */

import type { MunicipalityContext } from "../municipality";
import type { MunicipalDocumentRepository } from "../repository";
import type { HealthReportDocument } from "../health-report";
import type { IBSEStudy } from "../ibse";
import type { DUKEStudy } from "../duke";
import type { PREDIMEDStudy } from "../predimed";
import type { SF12Study } from "../sf12";
import type { SuenoStudy } from "../sueno";
import type { CAGEStudy } from "../cage";
import type { AUDITCStudy } from "../auditc";
import type { IPAQStudy } from "../ipaq";
import type { GHQ12Study } from "../ghq12";
import type { EvidenceStore } from "../evidence";
import type { ThematicPrioritisation, ThematicPrioritisationStudy } from "../thematic-prioritisation";

export interface MunicipalSnapshot {
  municipality: MunicipalityContext;

  repository: MunicipalDocumentRepository;

  healthReport?: HealthReportDocument;

  ibseStudy?: IBSEStudy;

  dukeStudy?: DUKEStudy;

  predimedStudy?: PREDIMEDStudy;

  sf12Study?: SF12Study;

  suenoStudy?: SuenoStudy;

  cageStudy?: CAGEStudy;

  auditcStudy?: AUDITCStudy;

  ipaqStudy?: IPAQStudy;

  ghq12Study?: GHQ12Study;

  evidenceStore: EvidenceStore;

  thematicPrioritisation?: ThematicPrioritisation;

  thematicPrioritisationStudy?: ThematicPrioritisationStudy;

  // Reservado: priorización estratégica (EPVSA / Plan de Acción)
  // No implementar hasta que exista el motor correspondiente.
  strategicPrioritisation?: unknown;

  // Reservado: mejoramiento municipal (datos contextuales enriquecidos)
  // No implementar hasta que exista el motor correspondiente.
  municipalEnrichment?: unknown;
}
