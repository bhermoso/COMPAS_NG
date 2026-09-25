/**
 * StrategicFrameworkRegistry
 *
 * Machine-readable catalogue of all strategic frameworks in scope for
 * COMPÁS NG municipal health planning. Each framework's elements are
 * normalised into a shared StrategicElement shape so that planners,
 * pipeline stages, and reporting layers can reference any framework
 * through a single, stable API.
 *
 * Design rules:
 *  - Data is immutable at runtime (all arrays are frozen).
 *  - No business logic lives here; this is a pure reference store.
 *  - Every element carries a sourceTrace so its provenance is citable.
 *  - IDs are globally unique across all frameworks (prefix-scoped).
 */

// ── Types ──────────────────────────────────────────────────────────────────

export type FrameworkId =
  | "EPVSA"
  | "ESCA"
  | "MAYORES"
  | "BUENA_EDAD"
  | "RELAS"
  | "OTHER";

export type StrategicLevel =
  | "line"       // Línea estratégica
  | "objective"  // Objetivo estratégico
  | "indicator"  // Indicador de seguimiento
  | "program"    // Programa o fase metodológica
  | "action";    // Actuación concreta

export interface StrategicElement {
  framework: FrameworkId;
  level: StrategicLevel;
  id: string;
  label: string;
  description?: string;
  indicators?: string[];
  sourceTrace: string;
}

// ── EPVSA 2024–2030 ────────────────────────────────────────────────────────
// Estrategia de Promoción de la Vida Saludable en Andalucía
// Consejería de Salud y Consumo, Junta de Andalucía
// IDs aligned with EPVSATranslator.ts (LE1–LE4)

const EPVSA: readonly StrategicElement[] = Object.freeze([
  {
    framework: "EPVSA" as const,
    level: "line" as const,
    id: "EPVSA-LE1",
    label: "LE1 · Acción local en salud y comunidad",
    description:
      "Fomento de la participación comunitaria, los activos en salud y la acción intersectorial local.",
    indicators: [
      "Número de municipios con Plan Local de Salud activo",
      "Número de intervenciones comunitarias registradas",
      "Porcentaje de municipios RELAS con diagnóstico participativo actualizado",
    ],
    sourceTrace:
      "EPVSA 2024–2030, Línea Estratégica 1. Consejería de Salud y Consumo, Junta de Andalucía.",
  },
  {
    framework: "EPVSA" as const,
    level: "line" as const,
    id: "EPVSA-LE2",
    label: "LE2 · Entornos y estilos de vida saludables",
    description:
      "Promoción de alimentación saludable, actividad física, bienestar emocional y prevención de consumos perjudiciales.",
    indicators: [
      "Prevalencia de alimentación no saludable en población infantil",
      "Porcentaje de población con actividad física insuficiente",
      "Tasa de consumo de tabaco en adolescentes",
      "Puntuación IBSE (Bienestar Socioemocional Escolar)",
    ],
    sourceTrace:
      "EPVSA 2024–2030, Línea Estratégica 2. Consejería de Salud y Consumo, Junta de Andalucía.",
  },
  {
    framework: "EPVSA" as const,
    level: "line" as const,
    id: "EPVSA-LE3",
    label: "LE3 · Equidad, determinantes sociales y vulnerabilidades",
    description:
      "Reducción de desigualdades en salud y abordaje de determinantes socioeconómicos y colectivos vulnerables.",
    indicators: [
      "Índice de privación socioeconómica por zona censal",
      "Brecha de salud entre grupos de renta alta y baja",
      "Porcentaje de hogares en situación de exclusión social",
    ],
    sourceTrace:
      "EPVSA 2024–2030, Línea Estratégica 3. Consejería de Salud y Consumo, Junta de Andalucía.",
  },
  {
    framework: "EPVSA" as const,
    level: "line" as const,
    id: "EPVSA-LE4",
    label: "LE4 · Gobernanza, evaluación y conocimiento para la salud",
    description:
      "Fortalecimiento de la gobernanza local, sistemas de información, evaluación e investigación en salud pública.",
    indicators: [
      "Número de municipios con sistema de seguimiento de indicadores activo",
      "Porcentaje de actuaciones evaluadas con indicadores de resultado",
      "Disponibilidad de datos desagregados por sexo, edad y territorio",
    ],
    sourceTrace:
      "EPVSA 2024–2030, Línea Estratégica 4. Consejería de Salud y Consumo, Junta de Andalucía.",
  },
  {
    framework: "EPVSA" as const,
    level: "objective" as const,
    id: "EPVSA-LE1-OBJ1",
    label: "Fortalecer la participación comunitaria en salud en el ámbito local",
    sourceTrace: "EPVSA 2024–2030, LE1, Objetivo 1.",
  },
  {
    framework: "EPVSA" as const,
    level: "objective" as const,
    id: "EPVSA-LE2-OBJ1",
    label: "Promover la alimentación saludable en el ámbito comunitario y escolar",
    sourceTrace: "EPVSA 2024–2030, LE2, Objetivo 1.",
  },
  {
    framework: "EPVSA" as const,
    level: "objective" as const,
    id: "EPVSA-LE2-OBJ2",
    label: "Incrementar la práctica de actividad física en todas las edades",
    sourceTrace: "EPVSA 2024–2030, LE2, Objetivo 2.",
  },
  {
    framework: "EPVSA" as const,
    level: "objective" as const,
    id: "EPVSA-LE2-OBJ3",
    label: "Mejorar el bienestar emocional y reducir el estigma asociado a la salud mental",
    sourceTrace: "EPVSA 2024–2030, LE2, Objetivo 3.",
  },
  {
    framework: "EPVSA" as const,
    level: "objective" as const,
    id: "EPVSA-LE3-OBJ1",
    label: "Reducir las desigualdades sociales en salud con enfoque de equidad",
    sourceTrace: "EPVSA 2024–2030, LE3, Objetivo 1.",
  },
]);

// ── ESCA ───────────────────────────────────────────────────────────────────
// Estrategia de Salud Comunitaria de Andalucía (de nueva aprobación)
// Orientada al sistema sanitario y la salud comunitaria
// Referencia: ESCA.pdf (repositorio documental COMPÁS)

const ESCA: readonly StrategicElement[] = Object.freeze([
  {
    framework: "ESCA" as const,
    level: "line" as const,
    id: "ESCA-L1",
    label: "Reorientación del sistema sanitario hacia la salud comunitaria",
    description:
      "Transformación de los servicios de atención primaria y especializada para integrar intervenciones comunitarias y de promoción de la salud.",
    indicators: [
      "Porcentaje de centros de salud con programa de salud comunitaria activo",
      "Número de profesionales sanitarios formados en metodología comunitaria",
      "Número de prescripciones sociales realizadas desde atención primaria",
    ],
    sourceTrace:
      "ESCA — Estrategia de Salud Comunitaria de Andalucía. Línea 1. Consejería de Salud y Consumo. Véase ESCA.pdf en repositorio documental.",
  },
  {
    framework: "ESCA" as const,
    level: "line" as const,
    id: "ESCA-L2",
    label: "Coordinación sociosanitaria e intersectorial",
    description:
      "Articulación de servicios sanitarios, sociales y municipales para abordar conjuntamente los determinantes sociales de la salud.",
    indicators: [
      "Número de protocolos de coordinación sociosanitaria vigentes por distrito",
      "Porcentaje de casos de vulnerabilidad atendidos con protocolo conjunto",
      "Número de mesas de coordinación intersectorial activas",
    ],
    sourceTrace:
      "ESCA — Línea 2. Coordinación sociosanitaria. Véase ESCA.pdf.",
  },
  {
    framework: "ESCA" as const,
    level: "line" as const,
    id: "ESCA-L3",
    label: "Participación ciudadana y empoderamiento en salud",
    description:
      "Fortalecimiento del papel activo de la ciudadanía en la toma de decisiones sobre su salud y la del entorno comunitario.",
    indicators: [
      "Porcentaje de municipios con proceso participativo en salud activo",
      "Número de grupos comunitarios de salud constituidos",
      "Satisfacción ciudadana con los procesos participativos en salud (escala 1–10)",
    ],
    sourceTrace:
      "ESCA — Línea 3. Participación ciudadana. Véase ESCA.pdf.",
  },
  {
    framework: "ESCA" as const,
    level: "line" as const,
    id: "ESCA-L4",
    label: "Calidad, equidad y seguridad en los servicios de salud",
    description:
      "Garantía de calidad asistencial con enfoque en reducción de inequidades de acceso y seguridad del paciente.",
    indicators: [
      "Índice de satisfacción ciudadana con la atención primaria",
      "Brecha de acceso a servicios sanitarios entre grupos socioeconómicos",
      "Tasa de eventos adversos en centros de atención primaria",
    ],
    sourceTrace:
      "ESCA — Línea 4. Calidad y equidad. Véase ESCA.pdf.",
  },
]);

// ── MAYORES — Plan Estratégico para las Personas Mayores en Andalucía ──────
// Consejería de Igualdad, Políticas Sociales y Conciliación, Junta de Andalucía
// Período: 2020–2023

const MAYORES: readonly StrategicElement[] = Object.freeze([
  {
    framework: "MAYORES" as const,
    level: "line" as const,
    id: "MAYORES-EJE1",
    label: "Eje 1 · Envejecimiento activo y saludable",
    description:
      "Fomento de la autonomía, la participación social y el mantenimiento de la salud física y mental en personas mayores.",
    indicators: [
      "Porcentaje de personas mayores de 65 años con actividad física regular",
      "Tasa de participación en actividades de envejecimiento activo por municipio",
      "Prevalencia de aislamiento social en personas mayores (encuesta)",
    ],
    sourceTrace:
      "Plan Estratégico para las Personas Mayores en Andalucía 2020–2023. Eje 1. Consejería de Igualdad, Políticas Sociales y Conciliación, Junta de Andalucía.",
  },
  {
    framework: "MAYORES" as const,
    level: "line" as const,
    id: "MAYORES-EJE2",
    label: "Eje 2 · Atención a la dependencia y apoyo a personas cuidadoras",
    description:
      "Servicios de atención a la dependencia, apoyo domiciliario y reconocimiento del trabajo no remunerado de cuidado.",
    indicators: [
      "Tiempo medio de resolución de expedientes de dependencia (días)",
      "Porcentaje de personas cuidadoras con acceso a servicios de respiro familiar",
      "Cobertura de la atención domiciliaria en municipios de menos de 5.000 habitantes",
    ],
    sourceTrace:
      "Plan Estratégico para las Personas Mayores en Andalucía 2020–2023. Eje 2.",
  },
  {
    framework: "MAYORES" as const,
    level: "line" as const,
    id: "MAYORES-EJE3",
    label: "Eje 3 · Protección frente a violencia, abuso y exclusión",
    description:
      "Prevención y atención ante situaciones de vulnerabilidad, maltrato o exclusión social de personas mayores.",
    indicators: [
      "Número de casos de maltrato a personas mayores detectados y atendidos",
      "Porcentaje de municipios con protocolo de atención a situaciones de riesgo en personas mayores",
    ],
    sourceTrace:
      "Plan Estratégico para las Personas Mayores en Andalucía 2020–2023. Eje 3.",
  },
  {
    framework: "MAYORES" as const,
    level: "line" as const,
    id: "MAYORES-EJE4",
    label: "Eje 4 · Entornos accesibles y amigables con las personas mayores",
    description:
      "Adaptación del entorno urbano, los servicios públicos y los espacios comunitarios a las necesidades de las personas mayores.",
    indicators: [
      "Porcentaje de municipios con plan de accesibilidad universal vigente",
      "Índice de urbanismo amigable para personas mayores (OMS, Age-Friendly Cities)",
      "Porcentaje de viviendas con adaptaciones de accesibilidad para mayores",
    ],
    sourceTrace:
      "Plan Estratégico para las Personas Mayores en Andalucía 2020–2023. Eje 4.",
  },
]);

// ── BUENA_EDAD — Marcos de salud y envejecimiento saludable ────────────────
// Plataforma «En Buena Edad» y marcos nacionales/autonómicos de salud
// en el envejecimiento (Ministerio de Sanidad / Consejería de Salud)

const BUENA_EDAD: readonly StrategicElement[] = Object.freeze([
  {
    framework: "BUENA_EDAD" as const,
    level: "program" as const,
    id: "BUENA_EDAD-P1",
    label: "Promoción de la salud en el proceso de envejecimiento",
    description:
      "Intervenciones de promoción de salud adaptadas a las necesidades y características de las personas mayores a nivel comunitario.",
    indicators: [
      "Número de personas mayores participantes en actividades de salud comunitaria",
      "Prevalencia de sedentarismo en mayores de 65 años",
      "Porcentaje de mayores con revisiones preventivas al día",
    ],
    sourceTrace:
      "Plataforma «En Buena Edad» — Marco nacional de envejecimiento saludable. Ministerio de Sanidad. Véase también: Estrategia de Promoción de la Salud y Prevención en el SNS.",
  },
  {
    framework: "BUENA_EDAD" as const,
    level: "program" as const,
    id: "BUENA_EDAD-P2",
    label: "Prevención de caídas y accidentabilidad en el hogar",
    description:
      "Programas específicos de prevención de caídas, evaluación del riesgo domiciliario y adaptación del entorno.",
    indicators: [
      "Tasa de hospitalización por caída en mayores de 65 años (por 1.000 hab.)",
      "Porcentaje de hogares de personas mayores evaluados para adaptaciones de seguridad",
      "Número de talleres de prevención de caídas realizados en el municipio",
    ],
    sourceTrace:
      "Programa «En Buena Edad» — Prevención de caídas. Ministerio de Sanidad / Consejería de Salud.",
  },
  {
    framework: "BUENA_EDAD" as const,
    level: "program" as const,
    id: "BUENA_EDAD-P3",
    label: "Salud mental y bienestar emocional en personas mayores",
    description:
      "Prevención y atención de la depresión, la ansiedad y el deterioro cognitivo en personas mayores.",
    indicators: [
      "Prevalencia de depresión diagnosticada en mayores de 65 años",
      "Porcentaje de personas mayores con acceso a atención de salud mental",
      "Tasa de solicitudes de valoración por deterioro cognitivo (por 1.000 hab.)",
    ],
    sourceTrace:
      "Programa «En Buena Edad» — Salud mental y envejecimiento.",
  },
  {
    framework: "BUENA_EDAD" as const,
    level: "program" as const,
    id: "BUENA_EDAD-P4",
    label: "Participación social y prevención de la soledad no deseada",
    description:
      "Programas de vinculación comunitaria y actividad social para prevenir el aislamiento y la soledad en personas mayores.",
    indicators: [
      "Porcentaje de personas mayores en situación de soledad no deseada (escala UCLA/De Jong Gierveld)",
      "Número de intervenciones comunitarias contra la soledad realizadas",
      "Porcentaje de mayores participantes en redes sociales de apoyo comunitario",
    ],
    sourceTrace:
      "Programa «En Buena Edad» — Soledad y participación social.",
  },
]);

// ── RELAS — Red Local de Acción en Salud de Granada ───────────────────────
// Marco metodológico para la elaboración de Planes Locales de Salud
// Referencia: metodología en cuatro fases, documentada en COMPÁS

const RELAS: readonly StrategicElement[] = Object.freeze([
  {
    framework: "RELAS" as const,
    level: "program" as const,
    id: "RELAS-F1",
    label: "Fase 1 · Diagnóstico de situación de salud",
    description:
      "Análisis epidemiológico, territorial y participativo del estado de salud del municipio. Integra fuentes cuantitativas y cualitativas.",
    indicators: [
      "Informe de Salud Municipal elaborado y validado",
      "Proceso participativo de diagnóstico realizado con ciudadanía",
      "Perfil de Salud Local (PSL) completado y aprobado",
    ],
    sourceTrace:
      "Metodología RELAS Granada — Fase 1: Diagnóstico de situación de salud.",
  },
  {
    framework: "RELAS" as const,
    level: "program" as const,
    id: "RELAS-F2",
    label: "Fase 2 · Priorización participativa",
    description:
      "Identificación de prioridades de salud con participación de la ciudadanía y los actores locales. Instrumentos: IBSE, papeleta temática, diagnóstico comunitario.",
    indicators: [
      "Proceso de priorización ciudadana realizado (instrumento validado)",
      "Temáticas prioritarias seleccionadas y documentadas",
      "Criterios de priorización acordados con el equipo técnico y la ciudadanía",
    ],
    sourceTrace:
      "Metodología RELAS Granada — Fase 2: Priorización participativa.",
  },
  {
    framework: "RELAS" as const,
    level: "program" as const,
    id: "RELAS-F3",
    label: "Fase 3 · Planificación de la acción",
    description:
      "Elaboración del Plan Local de Salud con objetivos, actuaciones, responsables, calendario e indicadores. Alineación con EPVSA y otros marcos estratégicos.",
    indicators: [
      "Plan Local de Salud aprobado por el Consejo Local de Salud",
      "Objetivos, actuaciones e indicadores definidos para cada prioridad",
      "Alineación con EPVSA y otros marcos estratégicos documentada",
    ],
    sourceTrace:
      "Metodología RELAS Granada — Fase 3: Planificación de la acción.",
  },
  {
    framework: "RELAS" as const,
    level: "program" as const,
    id: "RELAS-F4",
    label: "Fase 4 · Implementación y seguimiento",
    description:
      "Ejecución de las actuaciones planificadas y evaluación periódica del progreso. Informes de seguimiento y revisión del Plan.",
    indicators: [
      "Porcentaje de actuaciones del Plan Local en ejecución sobre las previstas",
      "Informes de seguimiento semestrales elaborados",
      "Revisión del Plan Local realizada al final del período de vigencia",
    ],
    sourceTrace:
      "Metodología RELAS Granada — Fase 4: Implementación y seguimiento.",
  },
]);

// ── Flat registry (frozen) ─────────────────────────────────────────────────

const ALL_ELEMENTS: readonly StrategicElement[] = Object.freeze([
  ...EPVSA,
  ...ESCA,
  ...MAYORES,
  ...BUENA_EDAD,
  ...RELAS,
]);

// ── Public query API ───────────────────────────────────────────────────────

/** All elements across all registered frameworks. */
export function getAllStrategicElements(): readonly StrategicElement[] {
  return ALL_ELEMENTS;
}

/** All elements belonging to a specific framework. */
export function getElementsByFramework(
  id: FrameworkId
): readonly StrategicElement[] {
  return ALL_ELEMENTS.filter((e) => e.framework === id);
}

/** Single element lookup by globally-unique element id. */
export function getElementById(
  elementId: string
): StrategicElement | undefined {
  return ALL_ELEMENTS.find((e) => e.id === elementId);
}

/** All elements at a given structural level across all frameworks. */
export function getElementsByLevel(
  level: StrategicLevel
): readonly StrategicElement[] {
  return ALL_ELEMENTS.filter((e) => e.level === level);
}

/** Returns the known framework IDs, including OTHER for ad-hoc use. */
export function getFrameworkIds(): readonly FrameworkId[] {
  return Object.freeze<FrameworkId[]>([
    "EPVSA",
    "ESCA",
    "MAYORES",
    "BUENA_EDAD",
    "RELAS",
    "OTHER",
  ]);
}

/** Summary of registered frameworks and their element counts. */
export function getRegistryOverview(): ReadonlyArray<{
  id: FrameworkId;
  elementCount: number;
}> {
  return getFrameworkIds().map((id) => ({
    id,
    elementCount: ALL_ELEMENTS.filter((e) => e.framework === id).length,
  }));
}

/** All elements whose indicators array contains text matching a keyword. */
export function searchByIndicatorKeyword(
  keyword: string
): readonly StrategicElement[] {
  const lc = keyword.toLowerCase();
  return ALL_ELEMENTS.filter(
    (e) => e.indicators?.some((ind) => ind.toLowerCase().includes(lc)) ?? false
  );
}
