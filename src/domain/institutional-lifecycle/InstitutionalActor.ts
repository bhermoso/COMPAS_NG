/**
 * InstitutionalActor — modelo de actores institucionales de COMPÁS NG
 *
 * Define quién puede ejecutar cada transición del ciclo de vida institucional.
 * Cada actor tiene responsabilidades distintas y no intercambiables.
 *
 * Referencia: CONTRACT-INSTITUTIONAL-LIFECYCLE §3
 */

// ── Roles ─────────────────────────────────────────────────────────────────────

export type InstitutionalActorRole =
  | "system"              // COMPÁS NG: transiciones automáticas (generación de borradores)
  | "technical-staff"     // Equipo técnico de salud pública del municipio
  | "coordination"        // Coordinación del proceso (Distrito Sanitario, técnicos RELAS)
  | "group-motor"         // Grupo Motor: coordinación intersectorial deliberativa
  | "municipal-council";  // Corporación municipal: pleno o junta de gobierno

// ── Permisos por transición ────────────────────────────────────────────────────

export interface TransitionPermission {
  /** Roles que pueden ejecutar la transición. */
  allowedRoles: ReadonlyArray<InstitutionalActorRole>;
  /** Si true, la transición requiere evidencia externa documentada (acta, firma, etc.). */
  requiresExternalEvidence: boolean;
  /** Si true, la transición es irreversible (o su reversión abre un nuevo ciclo). */
  irreversible: boolean;
}

/**
 * Mapa de permisos para las transiciones del PSL.
 * Exportado para uso en validaciones de aplicación y en tests.
 */
export const PSL_TRANSITION_PERMISSIONS: Readonly<
  Record<string, TransitionPermission>
> = {
  "generated→validated": {
    allowedRoles: ["technical-staff", "coordination"],
    requiresExternalEvidence: false,
    irreversible: false,   // puede revertirse a "generated" (invalidación)
  },
  "validated→approved": {
    allowedRoles: ["coordination", "group-motor"],
    requiresExternalEvidence: true,   // requiere acuerdo del Grupo Motor documentado
    irreversible: false,              // puede abrirse nuevo ciclo si la evidencia cambia
  },
  "validated→generated": {   // invalidación
    allowedRoles: ["technical-staff", "coordination"],
    requiresExternalEvidence: false,
    irreversible: false,
  },
  "generated→archived": {
    allowedRoles: ["technical-staff", "coordination"],
    requiresExternalEvidence: false,
    irreversible: true,
  },
  "validated→archived": {
    allowedRoles: ["technical-staff", "coordination"],
    requiresExternalEvidence: false,
    irreversible: true,
  },
  "approved→archived": {
    allowedRoles: ["coordination"],
    requiresExternalEvidence: false,
    irreversible: true,
  },
};

/**
 * Permisos para la validación formal de borradores del Nivel 3.
 */
export const LEVEL3_FORMAL_VALIDATION_PERMISSION: TransitionPermission = {
  allowedRoles: ["group-motor", "coordination"],
  requiresExternalEvidence: true,   // acta o acuerdo del Grupo Motor
  irreversible: false,              // se invalida si el PSL cambia
};

/**
 * Permisos para la aprobación institucional del PLS.
 */
export const PLS_INSTITUTIONAL_APPROVAL_PERMISSION: TransitionPermission = {
  allowedRoles: ["municipal-council"],
  requiresExternalEvidence: true,   // acuerdo de pleno o junta de gobierno
  irreversible: true,               // la aprobación es un acto institucional formal
};
