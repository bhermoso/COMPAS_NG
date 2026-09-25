import type {
  QuestionnaireDefinition,
  QuestionnaireOutput,
  ClassificationBlockId,
} from "../../domain/questionnaire";

import { getMethodologicalModule } from "../../domain/methodology";
import type { ModuleId } from "../../domain/methodology";

export interface CreateQuestionnaireParams {
  id: string;
  name: string;
  description?: string;

  methodologicalModules: ModuleId[];
  classificationBlocks?: ClassificationBlockId[];
  outputs?: QuestionnaireOutput[];
}

export function createQuestionnaire(
  params: CreateQuestionnaireParams,
): QuestionnaireDefinition {

  for (const moduleId of params.methodologicalModules) {
    if (!getMethodologicalModule(moduleId)) {
      throw new Error(
        `Módulo metodológico no registrado: ${moduleId}`
      );
    }
  }

  return {
    id: params.id,
    name: params.name,
    description: params.description,

    methodologicalModules: [...params.methodologicalModules],
    classificationBlocks: [...(params.classificationBlocks ?? [])],

    outputs:
      params.outputs && params.outputs.length > 0
        ? [...params.outputs]
        : ["redcap"],

    metadata: {},
  };
}
