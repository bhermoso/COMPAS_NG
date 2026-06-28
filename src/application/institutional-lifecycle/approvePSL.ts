/**
 * approvePSL — transición validated → approved del Perfil de Salud Local
 *
 * Implementa el gate G-PLS-1 del LocalHealthPlanCompiler:
 * PSL en estado "approved" como prerequisito para compilar el PLS.
 *
 * Reglas:
 *   - Solo puede aprobarse un PSL en estado "validated".
 *   - Requiere quórum del Grupo Motor o de la Coordinación.
 *   - Registra el acto de aprobación en un PSLApprovalRecord.
 *   - No modifica la evidencia ni el pipeline diagnóstico.
 *   - Devuelve tipos immutables; el caller persiste los cambios.
 *
 * Referencia: CONTRACT-INSTITUTIONAL-LIFECYCLE §5, CONTRACT-MIT-PSL §6.3
 */

import type { LocalHealthProfile } from "../../domain/health-profile";
import type { PSLApprovalRecord } from "../../domain/institutional-lifecycle";
import type { InstitutionalActorRole } from "../../domain/institutional-lifecycle";
import { PSL_TRANSITION_PERMISSIONS } from "../../domain/institutional-lifecycle";

// ── Tipos públicos ─────────────────────────────────────────────────────────────

export interface ApprovePSLInput {
  psl: LocalHealthProfile;
  approvedBy: string;
  approvedByRole: InstitutionalActorRole;
  approvingBody: string;
  externalReference?: string;
  notes?: string;
}

export interface ApprovePSLViolation {
  code: string;
  message: string;
}

export type ApprovePSLResult =
  | {
      ok: true;
      approvedPSL: LocalHealthProfile;
      approvalRecord: PSLApprovalRecord;
    }
  | {
      ok: false;
      violations: ApprovePSLViolation[];
    };

// ── Validación ─────────────────────────────────────────────────────────────────

export function validateApprovePSL(
  input: ApprovePSLInput
): ApprovePSLViolation[] {
  const violations: ApprovePSLViolation[] = [];
  const { psl, approvedBy, approvedByRole, approvingBody } = input;

  if (psl.status !== "validated") {
    violations.push({
      code: "PSL-APPROVE-01",
      message: `Solo puede aprobarse un PSL en estado "validated". Estado actual: "${psl.status}".`,
    });
  }

  const permission = PSL_TRANSITION_PERMISSIONS["validated→approved"];
  if (!permission.allowedRoles.includes(approvedByRole)) {
    violations.push({
      code: "PSL-APPROVE-02",
      message: `El rol "${approvedByRole}" no está autorizado para aprobar el PSL. Roles permitidos: ${permission.allowedRoles.join(", ")}.`,
    });
  }

  if (!approvedBy.trim()) {
    violations.push({
      code: "PSL-APPROVE-03",
      message: "Debe indicarse el nombre y cargo del responsable que aprueba (approvedBy).",
    });
  }

  if (!approvingBody.trim()) {
    violations.push({
      code: "PSL-APPROVE-04",
      message: "Debe indicarse el órgano aprobador (approvingBody).",
    });
  }

  if (psl.priorizacionStatus !== "complete") {
    violations.push({
      code: "PSL-APPROVE-05",
      message: `El capítulo VII debe estar en estado "complete" antes de aprobar. Estado actual: "${psl.priorizacionStatus}".`,
    });
  }

  if (!psl.priorizacion.consensoDocumentado) {
    violations.push({
      code: "PSL-APPROVE-06",
      message: "El consenso del Grupo Motor debe estar documentado antes de aprobar el PSL.",
    });
  }

  return violations;
}

// ── Transición ─────────────────────────────────────────────────────────────────

export function approvePSL(input: ApprovePSLInput): ApprovePSLResult {
  const violations = validateApprovePSL(input);
  if (violations.length > 0) {
    return { ok: false, violations };
  }

  const { psl, approvedBy, approvedByRole, approvingBody, externalReference, notes } = input;
  const approvedAt = new Date().toISOString();

  const approvedPSL: LocalHealthProfile = {
    ...psl,
    status: "approved",
    approvedAt,
    approvedBy,
  };

  const approvalRecord: PSLApprovalRecord = {
    pslId: psl.id,
    pslVersion: psl.version,
    pslEvidenceStoreVersion: psl.evidenceStoreVersion,
    approvedAt,
    approvedBy,
    approvedByRole,
    approvingBody,
    externalReference,
    notes,
  };

  return { ok: true, approvedPSL, approvalRecord };
}
