import { getMethodologicalModule } from "../../../domain/methodology";
import type { MethodologicalModule } from "../../../domain/methodology";
import type { QuestionnaireDefinition } from "../../../domain/questionnaire";
import type {
  RedcapDictionaryDefinition,
  RedcapFieldDefinition,
} from "./RedcapDictionaryDefinition";

function toRedcapFieldDefinition(
  fallbackFormName: string,
  field: NonNullable<MethodologicalModule["items"][number]["redcapFormField"]>,
): RedcapFieldDefinition {
  return {
    fieldName: field.fieldName,
    formName: field.formName ?? fallbackFormName,
    fieldType: field.fieldType ?? "text",
    fieldLabel: field.fieldLabel ?? field.fieldName,
    fieldNote: field.fieldNote,
    choicesOrCalculations: field.choicesOrCalculations,
    validationType: field.validationType,
    validationMin: field.validationMin,
    validationMax: field.validationMax,
    identifier: field.identifier,
    branchingLogic: field.branchingLogic,
    required: field.required,
    customAlignment: field.customAlignment,
    questionNumber: field.questionNumber,
    matrixGroupName: field.matrixGroupName,
    matrixRanking: field.matrixRanking,
    fieldAnnotation: field.fieldAnnotation,
  };
}

export function buildRedcapDictionary(
  questionnaire: QuestionnaireDefinition,
): RedcapDictionaryDefinition {
  const fields: RedcapFieldDefinition[] = [];

  for (const moduleId of questionnaire.methodologicalModules) {
    const module = getMethodologicalModule(moduleId);

    if (!module) {
      throw new Error(`Módulo metodológico no registrado: ${moduleId}`);
    }

    const fallbackFormName =
      module.adapters?.redcap?.instrument ?? questionnaire.id;

    for (const item of module.items) {
      if (!item.redcapFormField) {
        throw new Error(
          `El ítem ${item.id} del módulo ${moduleId} no tiene definición REDCap de formulario.`,
        );
      }

      fields.push(
        toRedcapFieldDefinition(fallbackFormName, item.redcapFormField),
      );
    }
  }

  return {
    instrumentName: questionnaire.id,
    fields,
  };
}
