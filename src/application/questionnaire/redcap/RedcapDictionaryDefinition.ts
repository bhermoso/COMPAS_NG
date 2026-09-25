export interface RedcapFieldDefinition {
  // Identificación
  fieldName: string;
  formName: string;

  // Presentación
  sectionHeader?: string;
  fieldType: string;
  fieldLabel: string;
  fieldNote?: string;

  // Contenido REDCap
  choicesOrCalculations?: string;

  // Validación
  validationType?: string;
  validationMin?: string;
  validationMax?: string;

  // Configuración
  identifier?: boolean;
  branchingLogic?: string;
  required?: boolean;
  customAlignment?: string;
  questionNumber?: string;

  // Matrices
  matrixGroupName?: string;
  matrixRanking?: boolean;

  // Anotaciones REDCap
  fieldAnnotation?: string;
}

export interface RedcapDictionaryDefinition {
  instrumentName: string;
  fields: RedcapFieldDefinition[];
}
