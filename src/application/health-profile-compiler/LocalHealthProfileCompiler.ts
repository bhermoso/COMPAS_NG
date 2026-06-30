/**
 * LocalHealthProfileCompiler
 *
 * Transforma un LocalHealthProfile en estado "validated" en un
 * LocalHealthProfileArtifact (PSL-C): documento institucional exportable,
 * inmutable y trazable.
 *
 * Contratos garantizados (CONTRACT-LOCAL-HEALTH-PROFILE-COMPILER):
 *  - No modifica el PSL origen.
 *  - No accede al EvidenceStore ni al MunicipalDocumentRepository.
 *  - No produce texto narrativo nuevo.
 *  - No lanza excepciones: devuelve CompilationResult tipado.
 *  - El artefacto resultante tiene isCongealed: true (invariante).
 *  - Toda la información proviene del LocalHealthProfile.
 */

import type { LocalHealthProfile } from "../../domain/health-profile";
import type {
  LocalHealthProfileArtifact,
  PSLCArtifactAreaIntervencion,
  PSLCArtifactCandidatura,
  PSLCArtifactCierreInterpretativo,
} from "../../domain/health-profile-artifact";

// ── Tipos públicos ─────────────────────────────────────────────────────────────

export interface CompileLocalHealthProfileInput {
  psl: LocalHealthProfile;
  compiledBy?: string;
  municipalityName: string;
  municipalityProvince: string;
  /** Número de artefactos ya compilados para este municipio (para el versioning). */
  existingArtifactCount: number;
}

export interface CompilationViolation {
  gate: string;
  message: string;
}

export type CompilationResult =
  | { ok: true; artifact: LocalHealthProfileArtifact }
  | { ok: false; violations: CompilationViolation[] };

// ── Validación de precondiciones ──────────────────────────────────────────────

export function validateCompilationPreconditions(
  psl: LocalHealthProfile
): CompilationViolation[] {
  const violations: CompilationViolation[] = [];

  if (psl.status !== "validated") {
    violations.push({
      gate: "G-LHC-1",
      message: `El PSL debe estar en estado "validated". Estado actual: "${psl.status}".`,
    });
  }

  if (psl.conclusiones.status !== "authored") {
    violations.push({
      gate: "G-LHC-2",
      message: `Las conclusiones (Cap. V) deben estar en estado "authored". Estado actual: "${psl.conclusiones.status}".`,
    });
  }

  if (psl.cierreInterpretativo.status !== "authored") {
    violations.push({
      gate: "G-LHC-3",
      message: `El cierre interpretativo (Cap. VI) debe estar en estado "authored". Estado actual: "${psl.cierreInterpretativo.status}".`,
    });
  }

  if (psl.priorizacionStatus !== "complete") {
    violations.push({
      gate: "G-LHC-4",
      message: `La priorización (Cap. VII) debe estar en estado "complete". Estado actual: "${psl.priorizacionStatus}".`,
    });
  }

  if (!psl.priorizacion.consensoDocumentado) {
    violations.push({
      gate: "G-LHC-5",
      message: "El consenso del Grupo Motor debe estar documentado (consensoDocumentado: true).",
    });
  }

  if (!psl.conclusiones.content.trim()) {
    violations.push({
      gate: "G-LHC-6",
      message: "Las conclusiones no pueden estar vacías.",
    });
  }

  if (!psl.cierreInterpretativo.content.trim()) {
    violations.push({
      gate: "G-LHC-7",
      message: "El cierre interpretativo no puede estar vacío.",
    });
  }

  return violations;
}

// ── Hash determinista del PSL ─────────────────────────────────────────────────
// Identifica de forma única el estado del PSL en el momento de compilación.
// Usa los campos que constituyen el contenido del diagnóstico y la validación.
// No usa crypto para evitar dependencias externas en el dominio.

export function computePSLHash(psl: LocalHealthProfile): string {
  const payload = [
    psl.id,
    psl.version,
    psl.evidenceStoreVersion,
    psl.status,
    psl.totalEvidenceAtoms.toString(),
    psl.conclusiones.content,
    psl.conclusiones.status,
    psl.cierreInterpretativo.content,
    psl.cierreInterpretativo.status,
    psl.priorizacionStatus,
    psl.priorizacion.consensoDocumentado.toString(),
    psl.priorizacion.deliberacionNota,
    psl.priorizacion.tematicasSeleccionadasIds.join(","),
    psl.areasDeIntervencion.map((a) => a.id).join(","),
    psl.validatedAt ?? "",
    psl.validatedBy ?? "",
  ].join("|");

  // djb2 hash: determinista, sin dependencias externas, suficiente para auditoría.
  let hash = 5381;
  for (let i = 0; i < payload.length; i++) {
    hash = ((hash << 5) + hash) ^ payload.charCodeAt(i);
    hash = hash >>> 0; // mantiene 32 bits sin signo
  }
  return `psl-${hash.toString(16).padStart(8, "0")}`;
}

// ── Compilador ────────────────────────────────────────────────────────────────

export function compileLocalHealthProfile(
  input: CompileLocalHealthProfileInput
): CompilationResult {
  const { psl, compiledBy, municipalityName, municipalityProvince, existingArtifactCount } = input;

  const violations = validateCompilationPreconditions(psl);
  if (violations.length > 0) {
    return { ok: false, violations };
  }

  const compiledAt = new Date().toISOString();
  const artifactVersion = `PSL-C/v${existingArtifactCount + 1}`;
  const sourceHash = computePSLHash(psl);

  const areasDeIntervencion: PSLCArtifactAreaIntervencion[] = psl.areasDeIntervencion.map(
    (area) => ({
      title: area.title,
      rationale: area.rationale,
      cautions: [...area.cautions],
    })
  );

  const candidaturasTecnicas: PSLCArtifactCandidatura[] =
    psl.priorizacion.candidaturasTecnicas.map((c) => ({
      title: c.title,
      rationale: c.rationale,
    }));

  const artifact: LocalHealthProfileArtifact = {
    // ── Identidad ──────────────────────────────────────────────────────────
    id: crypto.randomUUID(),
    municipalityId: psl.municipalityId,
    artifactVersion,
    compiledAt,
    compiledBy,

    // ── Trazabilidad ───────────────────────────────────────────────────────
    sourcePSLId: psl.id,
    sourcePSLVersion: psl.version,
    sourcePSLEvidenceStoreVersion: psl.evidenceStoreVersion,
    sourceHash,
    evidenceAtomIds: [...psl.evidenceAtomIds],

    // ── Portada ────────────────────────────────────────────────────────────
    portada: {
      municipalityName,
      municipalityProvince,
      compiledAt,
      artifactVersion,
    },

    // ── Identificación municipal ───────────────────────────────────────────
    identificacionMunicipal: {
      municipalityId: psl.municipalityId,
      municipalityName,
      municipalityProvince,
      pslGeneratedAt: psl.generatedAt,
      pslValidatedAt: psl.validatedAt,
      pslValidatedBy: psl.validatedBy,
    },

    // ── Marco estratégico (Cap. I) ─────────────────────────────────────────
    marcoEstrategico: {
      sectionIds: [...psl.strategicFrameworkSectionIds],
    },

    // ── Informe de Salud (Cap. II) — referencia, no contenido ─────────────
    informeSalud: {
      documentId: psl.healthReportDocumentId,
      title: psl.healthReportTitle,
      sectionCount: psl.healthReportSectionCount,
      atomCount: psl.healthReportAtomCount,
    },

    // ── Base documental (Cap. III) ─────────────────────────────────────────
    baseDocumental: {
      totalEvidenceAtoms: psl.totalEvidenceAtoms,
      integrityErrors: psl.integrityErrors,
      integrityWarnings: psl.integrityWarnings,
      atomsByOrigin: { ...psl.atomsByOrigin },
      atomsByKind: { ...psl.atomsByKind },
      originsSummary: [...psl.originsSummary],
      complementaryStudyCount: psl.complementaryStudyCount,
      ibsePresent: psl.ibsePresent,
      dukePresent: psl.dukePresent,
      predimedPresent: psl.predimedPresent,
      thematicPrioritisationPresent: psl.thematicPrioritisationPresent,
    },

    // ── Lectura territorial (Cap. IV) ──────────────────────────────────────
    lecturaTerritorial: {
      territorialSummary: psl.territorialSummary,
      determinantCount: psl.determinantCount,
      assetCount: psl.assetCount,
      indicatorCount: psl.indicatorCount,
      qualitativeFindingCount: psl.qualitativeFindingCount,
      methodologicalCautionCount: psl.methodologicalCautionCount,
      preliminaryOpportunities: [...psl.preliminaryOpportunities],
      longitudinalActive: psl.longitudinalActive,
      longitudinalNote: psl.longitudinalNote,
      longitudinalEvidenceCount: psl.longitudinalEvidenceCount,
      marcosAplicados: psl.marcosAplicados.map((m) => ({ ...m })),
      tensionesEstructurales: [...psl.tensionesEstructurales],
      tensionesEscaladasCount: psl.tensionesEscaladas.length,
      tensionesNoEscaladasCount: psl.tensionesNoEscaladas.length,
      ruidoEstructuralCount: psl.ruidoEstructural.length,
      conflictosCount: psl.conflictos.length,
      areasDeIntervencion,
    },

    // ── Conclusiones (Cap. V) — autoría humana ─────────────────────────────
    conclusiones: {
      content: psl.conclusiones.content,
    },

    // ── Cierre interpretativo (Cap. VI) — autoría humana ──────────────────
    cierreInterpretativo: {
      content: psl.cierreInterpretativo.content,
    } satisfies PSLCArtifactCierreInterpretativo,

    // ── Priorización (Cap. VII) ────────────────────────────────────────────
    priorizacion: {
      candidaturasTecnicas,
      hasTechnicalCandidatures: psl.priorizacion.hasTechnicalCandidatures,
      tematicasSeleccionadasLabels: [...psl.priorizacion.tematicasSeleccionadasLabels],
      hasParticipatorySelection: psl.priorizacion.hasParticipatorySelection,
      deliberacionNota: psl.priorizacion.deliberacionNota,
      consensoDocumentado: psl.priorizacion.consensoDocumentado,
      priorizacionStatus: psl.priorizacionStatus,
    },

    // ── Nota de validación ─────────────────────────────────────────────────
    notaValidacion: {
      pslValidatedAt: psl.validatedAt,
      pslValidatedBy: psl.validatedBy,
      compiledAt,
      compiledBy,
      sourcePSLId: psl.id,
      sourceHash,
    },

    // ── Cautelas metodológicas ─────────────────────────────────────────────
    cautelasMetodologicas: {
      integrityErrors: psl.integrityErrors,
      integrityWarnings: psl.integrityWarnings,
      hasCautelas: psl.integrityWarnings > 0 || psl.integrityErrors > 0,
      nota:
        "Este documento ha sido generado por COMPÁS NG a partir de evidencia " +
        "estructurada y contenido de autoría humana. Las interpretaciones " +
        "territoriales y las áreas de intervención son propuestas técnicas " +
        "que requieren validación institucional. COMPÁS NG no adopta decisiones " +
        "de planificación; facilita su fundamentación.",
    },

    // ── Invariante ────────────────────────────────────────────────────────
    isCongealed: true,
  };

  return { ok: true, artifact };
}
