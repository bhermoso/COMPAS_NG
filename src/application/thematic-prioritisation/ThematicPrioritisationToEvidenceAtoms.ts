import { createEvidenceAtom, type EvidenceAtom } from "../../domain/evidence";
import type { ThematicPrioritisation } from "../../domain/thematic-prioritisation";
import type { ThematicTopic } from "../../domain/thematic-prioritisation";

export function thematicPrioritisationToEvidenceAtoms(
  prioritisation: ThematicPrioritisation,
  availableTopics: readonly ThematicTopic[]
): EvidenceAtom[] {
  const topicMap = new Map(availableTopics.map((t) => [t.id, t.label]));
  const total = prioritisation.selectedTopicIds.length;

  return prioritisation.selectedTopicIds.map((topicId, index) => {
    const label = topicMap.get(topicId) ?? topicId;
    return createEvidenceAtom({
      id: `citizen-participation:${prioritisation.municipalityId}:${topicId}`,
      municipalityId: prioritisation.municipalityId,
      kind: "strategic-priority",
      title: `Prioridad ciudadana: ${label}`,
      content: `Temática seleccionada como prioritaria (posición ${index + 1} de ${total}) en el proceso de participación ciudadana municipal.`,
      confidence: "medium",
      provenance: {
        origin: "citizen-participation",
        sourceLabel: "Proceso de participación ciudadana",
        extractedAt: prioritisation.updatedAt,
      },
      methodology: {
        description:
          "Señal de prioridad procedente del proceso participativo. No sustituye priorización técnica ni epidemiológica.",
        limitations: [
          "Refleja preferencias expresadas, no evidencia de magnitud de problema.",
          "Requiere contraste con la lectura territorial antes de incorporarse al Plan de Acción.",
        ],
        requiresHumanValidation: true,
      },
      tags: ["citizen-participation", "strategic-priority", topicId],
    });
  });
}
