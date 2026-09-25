/**
 * pslcDocumentModel
 *
 * Modelo documental PURO del export institucional del PSL-C: estructura
 * intermedia (títulos + párrafos, con tipos visuales) independiente del formato
 * final (visor, DOCX, PDF).
 *
 * GOV-SALIDA-01 (PR-2): `buildPSLCDocumentModel` DESPACHA por artefacto:
 *   - v2 completo (con documento canónico sellado) → proyección mecánica desde
 *     `editorialView` + `technicalSpace` (`pslcCanonicalProjector`). No relee
 *     `provenance`/`conclusiones.content` ni ejecuta `parseNarrativeChapters`.
 *   - legacy o v2 incompleto → ruta B histórica aislada
 *     (`pslcDocumentModelLegacy`).
 *
 * Como el visor, el DOCX y el PDF ya consumen `buildPSLCDocumentModel(artifact)`,
 * el despacho los enruta al proyector para v2 sin cambios en esos renderers.
 */

import type { LocalHealthProfileArtifact } from "../../domain/health-profile-artifact";
import type {
  CanonicalReadingSectionId,
  CanonicalTechnicalSectionId,
} from "../health-profile";
import { readSealedCanonicalDocument } from "../psl-c-canonical";
import { buildPSLCDocumentModelLegacy } from "./pslcDocumentModelLegacy";
import {
  projectCanonicalToDocumentModel,
  buildPSLCDocumentMetadata,
} from "./pslcCanonicalProjector";

// ── Tipos del modelo ──────────────────────────────────────────────────────────

/** Tipo de sección del documento: textual o estructurada (contrato visual). */
export type PSLCSectionKind =
  | "text"
  | "summaryCards"
  | "table"
  | "barRanking"
  | "compactSignalList"
  | "groupMotorAgenda";

export interface PSLCSummaryCard {
  destacado: boolean;
  texto: string;
}

export interface PSLCTableData {
  headers: string[];
  rows: string[][];
  nota?: string;
}

export interface PSLCRankingItem {
  etiqueta: string;
  valor: number;
  max: number;
}

export interface PSLCSignalListItem {
  grupo: string;
  senal: string;
  fuente: string;
  pregunta: string;
}

export interface PSLCAgendaEntry {
  tema: string;
  senal: string;
  mecanismo: string;
  oculto: string;
  pregunta: string;
}

export interface PSLCDocumentSection {
  /**
   * Identidad estable de la sección para la paridad por ID (no por título).
   * La emite el proyector v2; la ruta legacy la omite.
   */
  sectionId?: CanonicalReadingSectionId | CanonicalTechnicalSectionId;
  /** Título de la sección (principal o subsección del anexo). */
  title: string;
  /** 1 = sección principal; 2 = subsección. */
  level: 1 | 2;
  paragraphs: string[];
  /** "text" por defecto; el resto lleva su carga estructurada. */
  kind?: PSLCSectionKind;
  cards?: PSLCSummaryCard[];
  table?: PSLCTableData;
  ranking?: PSLCRankingItem[];
  signalList?: PSLCSignalListItem[];
  agenda?: PSLCAgendaEntry[];
}

export interface PSLCDocumentModel {
  /** Título del documento (portada). */
  title: string;
  subtitle: string;
  /** Párrafos de la portada (metadatos institucionales, sin hash). */
  portada: string[];
  sections: PSLCDocumentSection[];
  fileName: string;
}

// ── Nombre de archivo estable ─────────────────────────────────────────────────

/** Nombre de archivo estable y seguro para el export. */
export function pslcDocxFileName(artifact: LocalHealthProfileArtifact): string {
  const slug = artifact.municipalityId
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `psl-c-${slug}-2027-2030.docx`;
}

// ── Despachador ───────────────────────────────────────────────────────────────

/**
 * Construye el modelo documental del artefacto. Despacha entre la proyección
 * canónica (v2 completo) y la ruta B histórica (legacy o v2 incompleto).
 */
export function buildPSLCDocumentModel(
  artifact: LocalHealthProfileArtifact
): PSLCDocumentModel {
  if (artifact.canonicalDocument !== undefined) {
    const norm = readSealedCanonicalDocument(artifact.canonicalDocument);
    if (norm !== null) {
      return projectCanonicalToDocumentModel(
        norm.editorialView,
        norm.technicalSpace,
        buildPSLCDocumentMetadata(artifact)
      );
    }
  }
  return buildPSLCDocumentModelLegacy(artifact);
}
