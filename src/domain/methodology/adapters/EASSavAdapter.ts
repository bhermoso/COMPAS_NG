import type { QuestionnaireDefinition } from "../../questionnaire/QuestionnaireDefinition";

export function inspectEASSavStructure(): string {
  return "EAS SAV adapter scaffold ready";
}

export function inferEASClassificationCandidates(): string[] {
  return [
    "PROV",
    "hab",
    "TAM_HOG",
    "SEX_01",
    "ED_01",
    "ME_01"
  ];
}

export function buildEASQuestionnaireSkeleton(): Partial<QuestionnaireDefinition> {
  return {
    id: "eas-auto-import",
    name: "EAS Auto Import (experimental)",
    description: "Generated from SAV metadata",
    methodologicalModules: ["ibse"],
    classificationBlocks: ["eas-sociodemographic"],
    outputs: ["redcap"]
  };
}
