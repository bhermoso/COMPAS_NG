import { getMethodologicalModule } from "../../../domain/methodology";
import type { MethodologicalModule, ResponseType } from "../../../domain/methodology";
import type { QuestionnaireDefinition } from "../../../domain/questionnaire";
import type {
  RedcapDictionaryDefinition,
  RedcapFieldDefinition,
} from "./RedcapDictionaryDefinition";
import { EAS_SOCIODEMOGRAPHIC_FIELDS } from "./SociodemographicRedcapBlock";

// ── Ruta explícita: redcapFormField presente ──────────────────────────────────
// Se usa para ítems que tienen configuración REDCap declarada explícitamente
// (actualmente solo IBSE, cuyo redcapFormField proviene del monitor REDCap histórico).
// No modifica ni valida el contenido: lo traslada literalmente al diccionario.

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

// ── Ruta inferida: redcapFormField ausente ────────────────────────────────────
// Construye la definición REDCap a partir de las propiedades canónicas del ítem.
// Toda la información necesaria ya existe en Item: id (→ fieldName), text (→ fieldLabel),
// responseType + responseOptions (→ fieldType + choices). No hay pérdida de datos.

function inferFieldType(responseType: ResponseType, optionCount: number): string {
  if (responseType === "numeric") return "text";
  if (responseType === "text")    return "notes";
  // likert, binary, categorical → radio si pocas opciones, dropdown si muchas
  return optionCount > 7 ? "dropdown" : "radio";
}

function buildChoicesString(
  responseOptions: NonNullable<MethodologicalModule["items"][number]["responseOptions"]>,
): string {
  return responseOptions.map((opt) => `${opt.value}, ${opt.label}`).join(" | ");
}

function inferRedcapFieldFromItem(
  item: MethodologicalModule["items"][number],
  formName: string,
  questionNumber: number,
): RedcapFieldDefinition {
  const fieldType = inferFieldType(
    item.responseType,
    item.responseOptions?.length ?? 0,
  );

  const choicesOrCalculations =
    item.responseOptions && item.responseOptions.length > 0
      ? buildChoicesString(item.responseOptions)
      : undefined;

  return {
    fieldName: item.id,
    formName,
    fieldType,
    fieldLabel: item.text,
    choicesOrCalculations,
    required: true,
    questionNumber: String(questionNumber),
  };
}

// ── Generador principal ───────────────────────────────────────────────────────

export function buildRedcapDictionary(
  questionnaire: QuestionnaireDefinition,
): RedcapDictionaryDefinition {
  const fields: RedcapFieldDefinition[] = [];

  // El bloque de identificación y clasificación siempre precede a los módulos.
  if (questionnaire.classificationBlocks.includes("eas-sociodemographic")) {
    fields.push(...EAS_SOCIODEMOGRAPHIC_FIELDS);
  }

  for (const moduleId of questionnaire.methodologicalModules) {
    const module = getMethodologicalModule(moduleId);

    if (!module) {
      throw new Error(`Módulo metodológico no registrado: ${moduleId}`);
    }

    // Los id de módulo pueden contener guiones ("duke-eas"); REDCap exige snake_case.
    const fallbackFormName =
      module.adapters?.redcap?.instrument ??
      module.identity.id.replaceAll("-", "_");

    let questionCounter = 1;

    for (const item of module.items) {
      if (item.redcapFormField) {
        // Ruta explícita: respeta la definición REDCap declarada en el módulo
        fields.push(toRedcapFieldDefinition(fallbackFormName, item.redcapFormField));
      } else {
        // Ruta inferida: construye desde las propiedades canónicas del ítem
        fields.push(inferRedcapFieldFromItem(item, fallbackFormName, questionCounter));
      }
      questionCounter++;
    }
  }

  return {
    instrumentName: questionnaire.id,
    fields,
  };
}
