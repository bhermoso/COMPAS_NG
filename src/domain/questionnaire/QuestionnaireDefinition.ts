import type { ModuleId } from "../methodology";

export type QuestionnaireOutput =
  | "redcap"
  | "json"
  | "documentation";

export interface QuestionnaireDefinition {
  id: string;
  name: string;
  description?: string;

  // Módulos metodológicos seleccionados (IBSE, DUKE, CAGE, ...)
  methodologicalModules: ModuleId[];

  // Bloques de clasificación opcionales
  classificationBlocks: string[];

  // Formatos objetivo de generación
  outputs: QuestionnaireOutput[];

  // Metadatos libres para futuras ampliaciones
  metadata?: Record<string, string>;
}
