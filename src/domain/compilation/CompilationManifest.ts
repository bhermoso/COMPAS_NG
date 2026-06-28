/**
 * CompilationManifest
 *
 * Objeto transversal a todos los compiladores institucionales de COMPÁS NG.
 * Captura la procedencia, la auditoría y la reproducibilidad de cualquier artefacto
 * institucional compilado.
 *
 * Principio de diseño: el manifest acompaña siempre al artefacto como registro
 * inmutable de las condiciones exactas en que fue producido.
 *
 * Referencia: CONTRACT-LOCAL-HEALTH-PLAN-COMPILER §Manifest
 *
 * Nota de compatibilidad: LocalHealthProfileArtifact (Sprint 2.1) precede al
 * concepto de CompilationManifest. Sus campos de trazabilidad (sourcePSLId,
 * sourceHash, compiledAt, compiledBy, notaValidacion) son equivalentes a los del
 * manifest, pero están embebidos directamente en el artefacto y no en este objeto.
 * Los artefactos producidos desde Sprint 2.3 en adelante (LocalHealthPlanDocument,
 * etc.) embarcan un CompilationManifest explícito.
 */

import type { MunicipalityId } from "../municipality";

// ── GateResult ────────────────────────────────────────────────────────────────

export interface GateResult {
  gate: string;       // Código del gate: "G-LHC-1", "G-PLS-1", …
  passed: boolean;
  message?: string;   // Descripción de la violación si passed === false
}

// ── CompilationWarning ────────────────────────────────────────────────────────

export type CompilationWarningSeverity = "low" | "medium" | "high";

export interface CompilationWarning {
  code: string;
  message: string;
  severity: CompilationWarningSeverity;
}

// ── CompilationManifest ───────────────────────────────────────────────────────

export interface CompilationManifest {
  // ── Identidad del compilador ─────────────────────────────────────────────
  compilerId: string;
  // "LocalHealthProfileCompiler" | "LocalHealthPlanCompiler" | etc.

  compilerVersion: string;
  // Versión semántica del módulo compilador (ej: "1.0.0").

  contractVersion: string;
  // Versión del contrato que gobierna esta compilación
  // (ej: "CONTRACT-LOCAL-HEALTH-PLAN-COMPILER@2026-06-28").

  // ── Contexto ─────────────────────────────────────────────────────────────
  municipalityId: MunicipalityId;
  artifactType: string;
  // "PSL-C" | "PLS" | "MONITORING-REPORT" | etc.

  // ── Hashes de trazabilidad ───────────────────────────────────────────────
  sourceHashes: Record<string, string>;
  // Mapa de identificadores a hashes de los objetos fuente.
  // Ejemplo: { psl: "psl-abc12345", pslc: "pslc-def67890" }

  artifactHash: string;
  // Hash determinista del contenido del artefacto resultante.
  // Permite verificar integridad posterior a la compilación.

  reproducibilityId: string;
  // Hash determinista calculado sobre todos los sourceHashes concatenados.
  // Si los inputs son los mismos, el reproducibilityId es el mismo,
  // independientemente del momento de compilación.

  // ── Proveniencia ─────────────────────────────────────────────────────────
  generatedAt: string;    // ISO timestamp de la compilación
  generatedBy?: string;   // Perfil técnico que ejecutó la compilación

  pipelineVersion: string;
  // Versión del pipeline de COMPÁS NG en el momento de la compilación.
  // Actualmente "0.0.0"; cuando el sistema tenga versión semántica propia, se actualiza.

  // ── Auditoría ─────────────────────────────────────────────────────────────
  gateResults: GateResult[];
  // Estado de cada gate evaluado. Solo gates que pasaron si la compilación fue ok.

  warnings: CompilationWarning[];
  // Advertencias no bloqueantes detectadas durante la compilación.
  // No impiden el artefacto pero se incluyen para auditoría.

  // ── Referencias cruzadas ─────────────────────────────────────────────────
  referencedArtifactIds: string[];
  // IDs de otros artefactos referenciados en este artefacto.
  // Ejemplo: el PLS referencia el PSL-C con su id.

  referencedContracts: string[];
  // Nombres de los contratos que gobiernan esta compilación.
  // Ejemplo: ["CONTRACT-LOCAL-HEALTH-PLAN-COMPILER", "CONTRACT-MIT-PSL"]
}
