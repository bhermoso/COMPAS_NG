import type { LecturaEstrategicaLocal } from "../strategic-scenario";
import type { ThematicPrioritisation } from "../thematic-prioritisation";

/**
 * Decisión explícita del Grupo Motor entre la lectura estratégica y el PAI.
 * Conserva por separado las candidaturas técnicas, la evidencia ciudadana
 * disponible y la selección humana. El sistema nunca rellena esta entidad.
 */
export interface DeliberativePrioritySelection {
  id: string;
  municipalityId: string;
  sourceLecturaId: string;
  sourcePSLId: string;
  sourcePSLVersion: string;
  candidateScenarioIds: string[];
  selectedScenarioIds: string[];
  citizenTopicIds: string[];
  sourceCitizenPrioritisationUpdatedAt?: string;
  deliberationRationale: string;
  citizenInfluenceStatement: string;
  decidedBy: string;
  decidedByRole: "group-motor";
  decidedAt: string;
  requiresHumanValidation: true;
}

export type CreateDeliberativePrioritySelectionResult =
  | { ok: true; selection: DeliberativePrioritySelection }
  | { ok: false; violations: readonly string[] };

export interface CreateDeliberativePrioritySelectionInput {
  lectura: LecturaEstrategicaLocal;
  citizenPrioritisation?: ThematicPrioritisation;
  selectedScenarioIds: readonly string[];
  deliberationRationale: string;
  citizenInfluenceStatement: string;
  decidedBy: string;
  now?: string;
}

export function createDeliberativePrioritySelection(
  input: CreateDeliberativePrioritySelectionInput
): CreateDeliberativePrioritySelectionResult {
  const candidateScenarioIds = input.lectura.escenarios.map((scenario) => scenario.id);
  const candidateIds = new Set(candidateScenarioIds);
  const selectedScenarioIds = [...new Set(input.selectedScenarioIds)];
  const violations: string[] = [];

  if (!input.lectura.hasTranslatableContent || candidateScenarioIds.length === 0) {
    violations.push("G-DPS-1: la Lectura Estratégica no contiene candidaturas seleccionables");
  }
  if (selectedScenarioIds.length === 0) {
    violations.push("G-DPS-2: el Grupo Motor debe seleccionar al menos una candidatura");
  }
  if (selectedScenarioIds.some((id) => !candidateIds.has(id))) {
    violations.push("G-DPS-3: la selección contiene candidaturas ajenas a la Lectura Estratégica");
  }
  if (input.deliberationRationale.trim().length === 0) {
    violations.push("G-DPS-4: debe documentarse la motivación de la deliberación");
  }
  if (input.citizenInfluenceStatement.trim().length === 0) {
    violations.push("G-DPS-5: debe documentarse cómo influyó el conocimiento ciudadano, incluida su ausencia");
  }
  if (input.decidedBy.trim().length === 0) {
    violations.push("G-DPS-6: debe identificarse al Grupo Motor que adopta la selección");
  }

  if (violations.length > 0) return { ok: false, violations };

  const decidedAt = input.now ?? new Date().toISOString();
  return {
    ok: true,
    selection: {
      id: `priority-selection-${input.lectura.id}-${decidedAt}`,
      municipalityId: input.lectura.municipalityId,
      sourceLecturaId: input.lectura.id,
      sourcePSLId: input.lectura.sourcePSLId,
      sourcePSLVersion: input.lectura.sourcePSLVersion,
      candidateScenarioIds,
      selectedScenarioIds,
      citizenTopicIds: [...(input.citizenPrioritisation?.selectedTopicIds ?? [])],
      sourceCitizenPrioritisationUpdatedAt: input.citizenPrioritisation?.updatedAt,
      deliberationRationale: input.deliberationRationale.trim(),
      citizenInfluenceStatement: input.citizenInfluenceStatement.trim(),
      decidedBy: input.decidedBy.trim(),
      decidedByRole: "group-motor",
      decidedAt,
      requiresHumanValidation: true,
    },
  };
}

export function isDeliberativePrioritySelectionStale(
  selection: DeliberativePrioritySelection,
  lectura: LecturaEstrategicaLocal,
  citizenPrioritisation?: ThematicPrioritisation
): boolean {
  const currentCandidateIds = lectura.escenarios.map((scenario) => scenario.id);
  return (
    selection.municipalityId !== lectura.municipalityId ||
    selection.sourceLecturaId !== lectura.id ||
    selection.sourcePSLId !== lectura.sourcePSLId ||
    selection.sourcePSLVersion !== lectura.sourcePSLVersion ||
    selection.sourceCitizenPrioritisationUpdatedAt !== citizenPrioritisation?.updatedAt ||
    selection.candidateScenarioIds.length !== currentCandidateIds.length ||
    selection.candidateScenarioIds.some((id, index) => id !== currentCandidateIds[index])
  );
}

export function doesDeliberativePrioritySelectionMatchLectura(
  selection: DeliberativePrioritySelection,
  lectura: LecturaEstrategicaLocal
): boolean {
  const currentCandidateIds = lectura.escenarios.map((scenario) => scenario.id);
  const candidateIds = new Set(currentCandidateIds);
  return (
    selection.municipalityId === lectura.municipalityId &&
    selection.sourceLecturaId === lectura.id &&
    selection.sourcePSLId === lectura.sourcePSLId &&
    selection.sourcePSLVersion === lectura.sourcePSLVersion &&
    selection.candidateScenarioIds.length === currentCandidateIds.length &&
    selection.candidateScenarioIds.every((id, index) => id === currentCandidateIds[index]) &&
    selection.selectedScenarioIds.length > 0 &&
    selection.selectedScenarioIds.every((id) => candidateIds.has(id))
  );
}
