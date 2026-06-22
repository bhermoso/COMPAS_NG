export type QuestionnaireArtifactKind =
  | "questionnaire-json"
  | "redcap-data-dictionary-csv"
  | "technical-documentation"
  | "codebook"
  | "html-form";

export interface QuestionnaireArtifact {
  id: string;
  questionnaireId: string;
  kind: QuestionnaireArtifactKind;
  name: string;
  mimeType: string;
  content: string;
  createdAt: string;
  metadata?: Record<string, string>;
}
