import type { MunicipalityId } from "../municipality";
import { MAX_SELECTED_TOPICS } from "./ThematicTopic";

export interface ThematicPrioritisation {
  municipalityId: MunicipalityId;
  selectedTopicIds: string[];
  updatedAt: string;
}

export function createThematicPrioritisation(
  municipalityId: MunicipalityId,
  selectedTopicIds: string[]
): ThematicPrioritisation {
  return {
    municipalityId,
    selectedTopicIds: selectedTopicIds.slice(0, MAX_SELECTED_TOPICS),
    updatedAt: new Date().toISOString(),
  };
}
