import type { OITOpportunity, OITResult } from "../oit";

export interface CandidatePriority {
  id: string;
  title: string;
  rationale: string;
  sourceOpportunityId: string;
  relatedEvidenceIds: string[];
  cautions: string[];
}

export interface PrioritizationResult {
  candidatePriorities: CandidatePriority[];
  criteria: string[];
  cautions: string[];
  requiresHumanValidation: true;
}

export function generatePrioritization(
  oit: OITResult
): PrioritizationResult {
  const candidatePriorities = oit.opportunities.map((opportunity, index) =>
    buildCandidatePriority(opportunity, index + 1)
  );

  return {
    candidatePriorities,
    criteria: [
      "Magnitud o relevancia territorial sugerida por la evidencia disponible.",
      "Posibilidad de intervención desde el ámbito local.",
      "Existencia de activos comunitarios o capacidades institucionales relacionadas.",
      "Necesidad de validación técnica, política y comunitaria antes de decidir.",
    ],
    cautions: [
      "Esta propuesta no constituye priorización automática.",
      "No ordena prioridades por importancia sin deliberación humana.",
      "No traduce todavía a líneas EPVSA.",
      "No establece causalidad entre evidencia, oportunidad y resultado esperado.",
    ],
    requiresHumanValidation: true,
  };
}

function buildCandidatePriority(
  opportunity: OITOpportunity,
  order: number
): CandidatePriority {
  return {
    id: `priority-${order}-${opportunity.id}`,
    title: opportunity.title,
    rationale:
      "Candidata derivada de una oportunidad inicial de intervención territorial. Debe revisarse antes de incorporarse a una priorización formal.",
    sourceOpportunityId: opportunity.id,
    relatedEvidenceIds: opportunity.relatedEvidenceIds,
    cautions: opportunity.cautions,
  };
}
