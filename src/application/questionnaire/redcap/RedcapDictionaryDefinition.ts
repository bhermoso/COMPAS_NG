export interface RedcapFieldDefinition {
  fieldName: string;
  formName: string;
  fieldType: string;
  fieldLabel: string;

  choices?: string;
  calculation?: string;

  required?: boolean;
  identifier?: boolean;

  branchingLogic?: string;
  fieldAnnotation?: string;
}

export interface RedcapDictionaryDefinition {
  instrumentName: string;
  fields: RedcapFieldDefinition[];
}
