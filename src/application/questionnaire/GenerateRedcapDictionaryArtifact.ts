import type { QuestionnaireProject } from "../../domain/questionnaire";
import type { QuestionnaireArtifact } from "../../domain/questionnaire";

import {
  buildRedcapDictionary,
  exportRedcapDictionaryToCsv,
} from "./redcap";

export function generateRedcapDictionaryArtifact(
  project: QuestionnaireProject,
): QuestionnaireArtifact {
  const dictionary = buildRedcapDictionary(project.questionnaire);

  const csv = exportRedcapDictionaryToCsv(dictionary);

  const now = new Date().toISOString();

  return {
    id: crypto.randomUUID(),
    questionnaireId: project.questionnaire.id,
    kind: "redcap-data-dictionary-csv",
    name: `${project.questionnaire.name}.csv`,
    mimeType: "text/csv",
    content: csv,
    createdAt: now,
    metadata: {
      instrumentName: dictionary.instrumentName,
    },
  };
}
