import type { LocalHealthProfile, PSLAreaIntervencion } from "../../domain/health-profile";

export interface CandidatePriority {
  id: string;
  title: string;
  rationale: string;
  sourceAreaId: string;          // renamed from sourceOpportunityId — now tracks PSL area
  relatedEvidenceIds: string[];
  cautions: string[];
}

export interface PrioritizationResult {
  candidatePriorities: CandidatePriority[];
  criteria: string[];
  cautions: string[];
  requiresHumanValidation: true;
}

// ── Entry point ────────────────────────────────────────────────────────────────
// Consumes exclusively the LocalHealthProfile validated by the Nivel 2 pipeline.
// PSL-C1: no Nivel 3 component may consume Nivel 2 outputs without PSL mediation.

export function generatePrioritization(
  psl: LocalHealthProfile
): PrioritizationResult {
  const candidatePriorities = psl.areasDeIntervencion.map((area, index) =>
    buildCandidatePriority(area, index + 1)
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
      "No establece causalidad entre evidencia, área de intervención y resultado esperado.",
    ],
    requiresHumanValidation: true,
  };
}

function buildCandidatePriority(
  area: PSLAreaIntervencion,
  order: number
): CandidatePriority {
  return {
    id: `priority-${order}-${area.id}`,
    title: area.title,
    rationale:
      "Candidata derivada de un área de intervención territorial del Perfil de Salud Local. " +
      "Debe revisarse técnicamente antes de incorporarse a una priorización formal.",
    sourceAreaId: area.id,
    relatedEvidenceIds: area.relatedEvidenceIds,
    cautions: area.cautions,
  };
}
