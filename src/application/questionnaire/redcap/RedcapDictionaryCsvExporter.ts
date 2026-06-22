import type {
  RedcapDictionaryDefinition,
  RedcapFieldDefinition,
} from "./RedcapDictionaryDefinition";

const REDCAP_DATA_DICTIONARY_HEADERS = [
  "Variable / Field Name",
  "Form Name",
  "Section Header",
  "Field Type",
  "Field Label",
  "Choices, Calculations, OR Slider Labels",
  "Field Note",
  "Text Validation Type OR Show Slider Number",
  "Text Validation Min",
  "Text Validation Max",
  "Identifier?",
  "Branching Logic (Show field only if...)",
  "Required Field?",
  "Custom Alignment",
  "Question Number (surveys only)",
  "Matrix Group Name",
  "Matrix Ranking?",
  "Field Annotation",
];

function csvCell(value: string | number | boolean | undefined): string {
  if (value === undefined) return "";

  if (typeof value === "boolean") {
    return value ? "y" : "";
  }

  const text = String(value);

  if (/[",\n\r]/.test(text)) {
    return `"${text.replaceAll('"', '""')}"`;
  }

  return text;
}

function redcapFieldToCsvRow(field: RedcapFieldDefinition): string {
  return [
    field.fieldName,
    field.formName,
    field.sectionHeader,
    field.fieldType,
    field.fieldLabel,
    field.choicesOrCalculations,
    field.fieldNote,
    field.validationType,
    field.validationMin,
    field.validationMax,
    field.identifier,
    field.branchingLogic,
    field.required,
    field.customAlignment,
    field.questionNumber,
    field.matrixGroupName,
    field.matrixRanking,
    field.fieldAnnotation,
  ].map(csvCell).join(",");
}

export function exportRedcapDictionaryToCsv(
  dictionary: RedcapDictionaryDefinition,
): string {
  return [
    REDCAP_DATA_DICTIONARY_HEADERS.map(csvCell).join(","),
    ...dictionary.fields.map(redcapFieldToCsvRow),
  ].join("\n");
}
