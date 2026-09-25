import type {
  QuestionnaireDefinition,
  QuestionnaireOutput,
} from "./QuestionnaireDefinition";

export type QuestionnaireProjectStatus =
  | "draft"
  | "ready"
  | "archived";

export interface QuestionnaireProject {
  id: string;
  name: string;
  description?: string;
  status: QuestionnaireProjectStatus;
  questionnaire: QuestionnaireDefinition;
  requestedOutputs: QuestionnaireOutput[];
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, string>;
}
