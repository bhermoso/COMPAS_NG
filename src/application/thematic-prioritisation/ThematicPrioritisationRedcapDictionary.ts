import type { QuestionnaireArtifact } from "../../domain/questionnaire";
import {
  MAX_SELECTED_TOPICS,
  THEMATIC_TOPICS,
} from "../../domain/thematic-prioritisation";
import {
  exportRedcapDictionaryToCsv,
  type RedcapDictionaryDefinition,
} from "../questionnaire/redcap";

export const THEMATIC_PRIORITISATION_REDCAP_FORM_NAME =
  "papeleta_pri_tematica";
export const THEMATIC_PRIORITISATION_REDCAP_FIELD_NAME = "temas";

function buildTopicChoices(): string {
  return THEMATIC_TOPICS.map(
    (topic, index) => `${index + 1}, ${topic.label}`
  ).join(" | ");
}

export function buildThematicPrioritisationRedcapDictionary(): RedcapDictionaryDefinition {
  return {
    instrumentName: THEMATIC_PRIORITISATION_REDCAP_FORM_NAME,
    fields: [
      {
        fieldName: "record_id",
        formName: THEMATIC_PRIORITISATION_REDCAP_FORM_NAME,
        fieldType: "text",
        fieldLabel: "Identificador de registro",
        required: true,
        questionNumber: "0",
      },
      {
        fieldName: THEMATIC_PRIORITISATION_REDCAP_FIELD_NAME,
        formName: THEMATIC_PRIORITISATION_REDCAP_FORM_NAME,
        sectionHeader: "Priorización temática ciudadana",
        fieldType: "checkbox",
        fieldLabel:
          "Seleccione las temáticas que considera prioritarias para el Plan Local de Salud.",
        choicesOrCalculations: buildTopicChoices(),
        fieldNote: `Máximo ${MAX_SELECTED_TOPICS} temáticas. La encuesta se ejecuta en REDCap; COMPÁS importa e interpreta el CSV resultante.`,
        required: true,
        questionNumber: "1",
        fieldAnnotation: `@MAXCHECKED=${MAX_SELECTED_TOPICS}`,
      },
    ],
  };
}

export function generateThematicPrioritisationRedcapDictionaryArtifact(): QuestionnaireArtifact {
  const dictionary = buildThematicPrioritisationRedcapDictionary();
  const now = new Date().toISOString();

  return {
    id: crypto.randomUUID(),
    questionnaireId: THEMATIC_PRIORITISATION_REDCAP_FORM_NAME,
    kind: "redcap-data-dictionary-csv",
    name: `${THEMATIC_PRIORITISATION_REDCAP_FORM_NAME}_data_dictionary.csv`,
    mimeType: "text/csv",
    content: exportRedcapDictionaryToCsv(dictionary),
    createdAt: now,
    metadata: {
      instrumentName: dictionary.instrumentName,
      fieldName: THEMATIC_PRIORITISATION_REDCAP_FIELD_NAME,
      maxSelectedTopics: String(MAX_SELECTED_TOPICS),
      topicCount: String(THEMATIC_TOPICS.length),
    },
  };
}
