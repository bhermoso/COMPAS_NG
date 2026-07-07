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
} from "./profileOperations";
export type { NarrativeChapter, NarrativeChaptersInput } from "./narrativeChapters";
export { buildNarrativeChapters, renderNarrativeChapters } from "./narrativeChapters";
