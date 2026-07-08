export type { BuildLocalHealthProfileInput } from "./buildLocalHealthProfile";
export { buildLocalHealthProfile, hasPSLHumanContent } from "./buildLocalHealthProfile";

export { populatePSLFromPerfil } from "./populatePSLFromPerfil";

export type {
  AddInterpretationInput,
  UpdateInterpretationInput,
  AddHypothesisInput,
  UpdateHypothesisInput,
  AddOpenQuestionInput,
  UpdateOpenQuestionInput,
  PerfilSpaceCoverage,
  PerfilAlertaTipo,
  PerfilAlertaMetodologica,
  PerfilSpaceEstado,
  PerfilEstadoGlobal,
  PerfilEstadoNivel,
  CriterioEstructural,
  EstadoDelConocimiento,
  PerfilEpistemicMetrics,
} from "./profileOperations";
export {
  createPerfilLocalDeSalud,
  addInterpretation,
  updateInterpretation,
  supersedeInterpretation,
  addHypothesis,
  updateHypothesis,
  resolveHypothesisAsInterpretation,
  discardHypothesis,
  addOpenQuestion,
  updateOpenQuestion,
  resolveOpenQuestion,
  updateSynthesis,
  computePerfilEstadoGlobal,
  computeEstadoDelConocimiento,
  computePerfilEpistemicMetrics,
} from "./profileOperations";
export type { NarrativeChapter, NarrativeChaptersInput } from "./narrativeChapters";
export {
  buildNarrativeChapters,
  renderNarrativeChapters,
  NARRATIVE_CHAPTER_TITLES,
} from "./narrativeChapters";
export { parseNarrativeChapters } from "./narrativeChapters";
export type {
  InstitutionalProfileViewModel,
  ContrastTopic,
} from "./institutionalProfileModel";
export {
  buildInstitutionalProfileViewModel,
  INSTITUTIONAL_NAV,
  CONTRAST_TOPICS_LABEL,
  PENDING_CONTRAST_LABEL,
} from "./institutionalProfileModel";
export type {
  DiagnosticAnswers,
  DiagnosticDeterminantReading,
  DeterminantReadingKind,
  HealthReportReading,
  SalutogenicReading,
  SalutogenicGroup,
  SpaceKnowledge,
} from "./diagnosticAnswers";
export {
  buildDiagnosticAnswers,
  inferSocialEpidemiologyDeterminants,
  buildSalutogenicReading,
} from "./diagnosticAnswers";
export type {
  ComplementaryStudiesReading,
  ComplementaryStudyDiagnosticBlock,
} from "./complementaryStudiesReading";
export {
  buildComplementaryStudiesReading,
  DIAGNOSTIC_BLOCK_TITLES,
  HIPOTESIS_PSICOSOCIAL,
  HIPOTESIS_ENTORNO_URBANO,
  HIPOTESIS_CONSUMOS,
} from "./complementaryStudiesReading";
export type {
  IndicatorComparisonReference,
  IndicatorReferencesCoverage,
  ComplementaryIndicatorReferencesReading,
} from "./complementaryIndicatorReferences";
export {
  buildIndicatorComparisonReferences,
  interpretIndicatorComparison,
  formatIndicatorValue,
} from "./complementaryIndicatorReferences";
