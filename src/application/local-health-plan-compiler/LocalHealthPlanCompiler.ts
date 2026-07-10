import type { LocalHealthProfile } from "../../domain/health-profile";
import type { LocalHealthProfileArtifact } from "../../domain/health-profile-artifact";
import type { ActionPlanDraft } from "../action-plan";
import type { AgendaDraft } from "../agenda";
import type { MonitoringDraft } from "../monitoring";
import type { LocalHealthPlanDocument, UnaddressedNeed, PlanningPeriod } from "../../domain/health-plan/LocalHealthPlanDocument";
import type { CompilationManifest, GateResult } from "../../domain/compilation/CompilationManifest";

export interface CompileLocalHealthPlanInput {
  psl: LocalHealthProfile; // debe estar approved
  pslc: LocalHealthProfileArtifact; // artefacto PSL-C coherente
  actionPlan: ActionPlanDraft;
  agenda: AgendaDraft;
  monitoring: MonitoringDraft;
  municipalityName: string;
  municipalityProvince: string;
  planningPeriod: PlanningPeriod;
  compiledBy?: string;
  existingArtifactCount: number;
  unaddressedNeeds?: UnaddressedNeed[];
}

export interface CompilationViolation {
  gate: string;
  message: string;
}

export type CompilationResult =
  | { ok: true; document: LocalHealthPlanDocument; manifest: CompilationManifest }
  | { ok: false; violations: CompilationViolation[] };

function djb2Hash(s: string): string {
  let h = 5381;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) + h) ^ s.charCodeAt(i);
    h = h >>> 0;
  }
  return h.toString(16).padStart(8, "0");
}

export function validateCompilerPreconditions(input: CompileLocalHealthPlanInput): CompilationViolation[] {
  const violations: CompilationViolation[] = [];
  const { psl, pslc, actionPlan, agenda, monitoring, unaddressedNeeds } = input;

  if (psl.status !== "approved") {
    violations.push({ gate: "G-PLS-1", message: `PSL debe estar en estado \"approved\". Estado actual: \"${psl.status}\".` });
  }

  if (pslc.sourcePSLId !== psl.id) {
    violations.push({ gate: "G-PLS-2", message: "PSL-C no es coherente con PSL (sourcePSLId mismatch)." });
  }

  // gates 3 & 4: require formal validation flags on drafts (UI may attach them)
  const actionPlanValidation = (actionPlan as any).validationStatus;
  if (actionPlanValidation !== "formally-validated") {
    violations.push({ gate: "G-PLS-3", message: "Plan de Acción no está formalmente validado (validationStatus)." });
  }

  const agendaValidation = (agenda as any).validationStatus;
  if (agendaValidation !== "formally-validated") {
    violations.push({ gate: "G-PLS-4", message: "Agenda no está formalmente validada (validationStatus)." });
  }

  // gate 5 — monitoring must include an evaluation framework (non-empty)
  const evalFramework = (monitoring as any).evaluationFramework;
  if (!evalFramework) {
    violations.push({ gate: "G-PLS-5", message: "Monitoring debe contener un evaluationFramework definido." });
  }

  // gate 6 — unaddressedNeeds must be documented
  if (!Array.isArray(unaddressedNeeds) || unaddressedNeeds.length === 0) {
    violations.push({ gate: "G-PLS-6", message: "Debe documentarse al menos una necesidad no priorizada (unaddressedNeeds)." });
  }

  // gate 7 — debe existir al menos un objetivo y un ítem de agenda
  const objectivesCount = (actionPlan && (actionPlan as any).objectives) ? (actionPlan as any).objectives.length : 0;
  const agendaItemsCount = (agenda && (agenda as any).annualItems) ? (agenda as any).annualItems.length : 0;
  if (objectivesCount === 0 || agendaItemsCount === 0) {
    violations.push({ gate: "G-PLS-7", message: "El Plan de Acción debe contener al menos un objetivo y la Agenda al menos un ítem." });
  }

  return violations;
}

export function computePLSArtifactHash(document: Partial<LocalHealthPlanDocument>): string {
  const payload = [
    document.id ?? "",
    document.municipalityId ?? "",
    document.planVersion ?? "",
    JSON.stringify(document.priorizacion ?? {}),
    JSON.stringify(document.agenda ?? {}),
  ].join("|");
  return `pls-${djb2Hash(payload)}`;
}

export function compileLocalHealthPlan(input: CompileLocalHealthPlanInput): CompilationResult {
  const violations = validateCompilerPreconditions(input);
  if (violations.length > 0) return { ok: false, violations };

  const { psl, pslc, actionPlan, agenda, monitoring, municipalityName, municipalityProvince, planningPeriod, compiledBy, existingArtifactCount, unaddressedNeeds = [] } = input;

  const compiledAt = new Date().toISOString();
  const planVersion = `PLS/v${existingArtifactCount + 1}`;

  const manifest: CompilationManifest = {
    compilerId: "LocalHealthPlanCompiler",
    compilerVersion: "1.0.0",
    contractVersion: "CONTRACT-LOCAL-HEALTH-PLAN-COMPILER@2026-07-10",
    municipalityId: psl.municipalityId,
    artifactType: "PLS",
    sourceHashes: {
      psl: psl.version ?? psl.id,
      pslc: pslc.sourceHash ?? pslc.id,
    },
    artifactHash: "", // filled later
    reproducibilityId: djb2Hash((pslc.sourceHash ?? pslc.id) + "|" + (psl.version ?? psl.id)),
    generatedAt: compiledAt,
    generatedBy: compiledBy,
    pipelineVersion: "0.0.0",
    gateResults: [],
    warnings: [],
    referencedArtifactIds: [pslc.id],
    referencedContracts: ["CONTRACT-LOCAL-HEALTH-PLAN-COMPILER"],
  };

  // Añadir advertencias institucionales no bloqueantes
  if (unaddressedNeeds && unaddressedNeeds.length > 0) {
    manifest.warnings.push({ code: "PLS-W-001", message: `${unaddressedNeeds.length} necesidad(es) identificada(s) no priorizada(s). Documentarlas en anexos.`, severity: "medium" });
  }

  const gatesToRecord: GateResult[] = [];
  // record gates (all passed because validate preconditions cleared)
  ["G-PLS-1","G-PLS-2","G-PLS-3","G-PLS-4","G-PLS-5","G-PLS-6"].forEach((g) => gatesToRecord.push({ gate: g, passed: true }));
  manifest.gateResults = gatesToRecord;

  // Build a minimal PLS document using the inputs
  const document: LocalHealthPlanDocument = {
    id: crypto.randomUUID(),
    municipalityId: psl.municipalityId,
    planVersion,
    planningPeriod,
    manifest,
    resumenEjecutivo: { content: psl.conclusiones.content.slice(0, 800) },
    portada: {
      municipalityName,
      municipalityProvince,
      planningPeriod,
      compiledAt,
      planVersion,
    },
    marcoInstitucional: {
      strategicFrameworkSectionIds: psl.strategicFrameworkSectionIds ?? [],
    },
    contextoTerritorial: {
      municipalityId: psl.municipalityId,
      municipalityName: municipalityName,
      municipalityProvince: municipalityProvince,
      contextNote: "Compilación automática a partir del PSL validado y documentos fundamentales.",
    },
    diagnosticoTerritorial: {
      pslCArtifactId: pslc.id,
      pslCVersion: pslc.artifactVersion,
      pslCSourceHash: pslc.sourceHash,
      pslCCompiledAt: pslc.compiledAt,
    },
    priorizacion: {
      prioridadesSeleccionadas: (psl.priorizacion.candidaturasTecnicas || []).map((c) => ({ id: (c as any).id ?? c.title, title: c.title, rationale: (c as any).rationale ?? "", participatorySupport: psl.priorizacion.hasParticipatorySelection })),
      unaddressedNeeds: unaddressedNeeds,
      deliberacionNota: psl.priorizacion.deliberacionNota,
      consensoDocumentado: psl.priorizacion.consensoDocumentado,
    },
    articulacionInstitucional: {
      isProvisional: true,
      provisionNote: "Articulación provisional basada en EPVSA/EPVSA-Translator.",
      alignments: [],
    },
    planAccion: {
      objectives: (actionPlan.objectives || []).map((o) => ({ id: o.id, title: o.title, type: "general" as const, linkedPriorityId: (o as any).linkedStrategicLine, actions: (actionPlan.actions || []).filter(a => a.linkedObjectiveId === o.id).map(a => ({ id: a.id, title: a.title, description: a.description, responsible: "Por definir", institution: "Por definir", deadline: new Date().toISOString(), indicators: [] })) }))
    },
    agenda: {
      items: (agenda.annualItems || []).map((it) => ({ id: it.id, linkedActionId: it.linkedActionId, linkedActionTitle: ((actionPlan.actions || []).find(a => a.id === it.linkedActionId) ?? { title: "" }).title, period: `${it.suggestedQuarter} ${planningPeriod.start.slice(0,4)}`, responsible: (it as any).responsibleProfile }))
    },
    seguimiento: {
      trackingItems: (monitoring.trackedItems || []).map((t) => ({ id: t.id, linkedAgendaItemId: t.agendaItemId, status: "pending" as const, measurementFrequency: "mensual", measurementResponsible: "Por definir" })),
      evaluationFramework: {
        evaluationQuestions: ["¿Se implementaron las acciones previstas?"],
        evaluationMoments: [planningPeriod.end],
        evaluationResponsible: "Equipo técnico municipal",
        baselineNote: "Baselines documentados en el PSL y metadatos del EvidenceStore.",
      },
    },
    gobernanza: {
      grupoMotor: { composition: "Equipo técnico + representantes institucionales + ciudadanía", meetingFrequency: "mensual" },
    },
    anexosMetodologicos: {
      integrityWarnings: (psl as any).integrityWarnings ?? 0,
      integrityErrors: (psl as any).integrityErrors ?? 0,
      totalEvidenceAtoms: (psl as any).totalEvidenceAtoms ?? 0,
      complementaryStudies: [],
      methodologicalNotes: [],
    },
    isCongealed: true,
  };

  // finalize manifest artifactHash
  manifest.artifactHash = `pls-${djb2Hash(JSON.stringify({ id: document.id, planVersion, psl: psl.id }))}`;

  return { ok: true, document, manifest };
}

export default { compileLocalHealthPlan, validateCompilerPreconditions };
