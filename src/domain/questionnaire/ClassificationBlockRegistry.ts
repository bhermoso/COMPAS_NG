import type { ClassificationBlockId } from "./QuestionnaireDefinition";

export type ClassificationBlockStatus =
  | "planned"
  | "draft"
  | "validated";

export interface ClassificationBlockDefinition {
  id: ClassificationBlockId;
  name: string;
  description: string;
  status: ClassificationBlockStatus;
  source: string;
}

const CLASSIFICATION_BLOCKS: ClassificationBlockDefinition[] = [
  {
    id: "eas-sociodemographic",
    name: "Bloque de Identificación y Clasificación",
    description:
      "Variables de clasificación sociodemográfica del Gestor de Encuestas de Salud. " +
      "Incluye: fecha_encuesta, municipio_cod, sexo, anio_nacimiento, nivel_educativo, situacion_laboral. " +
      "Compatibilidad EAS: sexo → SEX_01, nivel_educativo → ME_01, situacion_laboral → SIT_LAB (pending-verification). " +
      "Ver CONTRACT-GES-EAS-COMPATIBILITY.",
    status: "draft",
    source: "VI Encuesta Andaluza de Salud / COMPÁS NG",
  },
  {
    id: "eas-household",
    name: "Hogar y convivencia EAS",
    description:
      "Bloque previsto para variables de hogar, convivencia y composición familiar procedentes de la Encuesta Andaluza de Salud.",
    status: "planned",
    source: "VI Encuesta Andaluza de Salud",
  },
  {
    id: "ine-demography",
    name: "Variables demográficas INE",
    description:
      "Bloque previsto para variables demográficas oficiales necesarias para clasificación y análisis territorial.",
    status: "planned",
    source: "Instituto Nacional de Estadística",
  },
  {
    id: "ieca-territorial",
    name: "Variables territoriales IECA",
    description:
      "Bloque previsto para variables territoriales y estadísticas oficiales de contexto andaluz.",
    status: "planned",
    source: "Instituto de Estadística y Cartografía de Andalucía",
  },
  {
    id: "cis-political",
    name: "Variables sociopolíticas CIS",
    description:
      "Bloque previsto solo para estudios donde proceda incorporar variables sociopolíticas comparables.",
    status: "planned",
    source: "Centro de Investigaciones Sociológicas",
  },
  {
    id: "custom",
    name: "Preguntas propias",
    description:
      "Bloque reservado para preguntas específicas de un municipio, proyecto o estudio complementario.",
    status: "planned",
    source: "Definición propia del proyecto",
  },
];

export function getAllClassificationBlocks(): ClassificationBlockDefinition[] {
  return CLASSIFICATION_BLOCKS;
}

export function getClassificationBlock(
  id: ClassificationBlockId
): ClassificationBlockDefinition | undefined {
  return CLASSIFICATION_BLOCKS.find((block) => block.id === id);
}
