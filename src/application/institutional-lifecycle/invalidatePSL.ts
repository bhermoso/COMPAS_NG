/**
 * Retira la validación técnica de un Perfil de Salud Local.
 *
 * La transición validated → review conserva todo el contenido del Perfil y crea
 * una nueva versión de trabajo. Los artefactos ya compilados no se modifican:
 * permanecen como antecedentes inmutables.
 */

import type { LocalHealthProfile } from "../../domain/health-profile";

export interface InvalidatePSLInput {
  psl: LocalHealthProfile;
  invalidatedAt?: string;
}

export interface InvalidatePSLViolation {
  code: string;
  message: string;
}

export type InvalidatePSLResult =
  | {
      ok: true;
      reviewedPSL: LocalHealthProfile;
      invalidatedAt: string;
    }
  | {
      ok: false;
      violations: InvalidatePSLViolation[];
    };

export function validateInvalidatePSL(
  input: InvalidatePSLInput
): InvalidatePSLViolation[] {
  if (input.psl.status === "validated") return [];
  return [{
    code: "PSL-INVALIDATE-01",
    message:
      `Solo puede retirarse la validación de un PSL en estado "validated". Estado actual: "${input.psl.status}".`,
  }];
}

export function invalidatePSL(input: InvalidatePSLInput): InvalidatePSLResult {
  const violations = validateInvalidatePSL(input);
  if (violations.length > 0) return { ok: false, violations };

  const invalidatedAt = input.invalidatedAt ?? new Date().toISOString();
  const reviewedPSL: LocalHealthProfile = {
    ...input.psl,
    status: "review",
    version: invalidatedAt,
    reviewStartedAt: invalidatedAt,
  };
  delete reviewedPSL.validatedAt;
  delete reviewedPSL.validatedBy;

  return { ok: true, reviewedPSL, invalidatedAt };
}
