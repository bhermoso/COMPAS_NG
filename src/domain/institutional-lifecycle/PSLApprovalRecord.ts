/**
 * PSLApprovalRecord — registro de aprobación institucional del PSL
 *
 * Cuando el PSL pasa de "validated" a "approved", COMPÁS NG necesita registrar
 * los detalles institucionales del acto de aprobación: quién aprueba, en qué
 * capacidad, con qué referencia externa.
 *
 * Este objeto se almacena en workspace.pslApproval y complementa el campo
 * `psl.status === "approved"` + `psl.approvedAt` + `psl.approvedBy`.
 *
 * Diseño: la aprobación es un registro independiente del objeto vivo PSL porque:
 *   1. Los campos `psl.approvedAt` y `psl.approvedBy` ya existen en el tipo.
 *   2. La información institucional adicional (órgano, referencia) es más estable
 *      que el PSL (no se regenera) y pertenece conceptualmente al expediente
 *      del proceso, no al análisis territorial.
 *
 * Referencia: CONTRACT-INSTITUTIONAL-LIFECYCLE §5, CONTRACT-MIT-PSL §6.3
 */

import type { InstitutionalActorRole } from "./InstitutionalActor";

export interface PSLApprovalRecord {
  // ── Referencia al PSL aprobado ───────────────────────────────────────────
  pslId: string;             // ID del LocalHealthProfile aprobado
  pslVersion: string;        // version del PSL en el momento de la aprobación
  pslEvidenceStoreVersion: string;  // snapshot de la versión del EvidenceStore

  // ── Quién aprueba ────────────────────────────────────────────────────────
  approvedAt: string;        // ISO timestamp del acto de aprobación
  approvedBy: string;        // Nombre + cargo del responsable que aprueba
  approvedByRole: InstitutionalActorRole;  // "group-motor" o "coordination"

  // ── Órgano aprobador ─────────────────────────────────────────────────────
  approvingBody: string;
  // Descripción del órgano: "Grupo Motor del proceso RELAS — Municipio de Atarfe",
  // "Pleno del Ayuntamiento de Atarfe — sesión de 28/06/2026", etc.

  // ── Evidencia externa (obligatoria para aprobación) ───────────────────────
  externalReference?: string;
  // Referencia al acta, acuerdo o documento institucional externo al sistema.
  // No es el documento en sí; es la cita que permite localizarlo.
  // Ejemplo: "Acta del Grupo Motor — reunión 28/06/2026, punto 3 del orden del día"

  // ── Observaciones opcionales ──────────────────────────────────────────────
  notes?: string;
}
