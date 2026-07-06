export type { BuildLocalHealthProfileInput } from "./buildLocalHealthProfile";
export { buildLocalHealthProfile, hasPSLHumanContent } from "./buildLocalHealthProfile";

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
