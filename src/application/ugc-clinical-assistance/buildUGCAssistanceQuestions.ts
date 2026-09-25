import type {
  UGCClinicalAssistanceReading,
  UGCClinicalAssistanceSignal,
} from "./UGCClinicalAssistanceReading";

/**
 * Validación humana que una pregunta de contraste requiere. Nunca se marca como
 * resuelta ni se automatiza la relevancia.
 */
export type UGCRequiredValidation =
  | "health-professionals" // significado técnico, criterios del indicador
  | "data-owners" // valor, periodo, denominador, comparador, dirección
  | "motor-group" // relevancia territorial, deliberación
  | "mixed";

/**
 * Visibilidad editorial (Incremento 5D). Las preguntas se PRODUCEN todas (modelo
 * técnico y trazabilidad), pero solo una selección por UTILIDAD se muestra en el
 * Perfil. Las `technical-only` no se pierden: quedan disponibles para el espacio
 * técnico. La selección NO es por orden ni frecuencia: es un juicio de utilidad
 * declarado por unidad (ver `visibilityRationale`).
 */
export type UGCQuestionVisibility = "profile" | "technical-only";

/**
 * Pregunta de contraste profesional derivada de N1b. NO es un hecho, ni una
 * magnitud, ni una diferencia demostrada: es una `open-question` trazada que
 * requiere validación humana. Vincula a una unidad N3 existente por convergencia.
 */
export interface UGCAssistanceQuestion {
  id: string;
  /** Id de la unidad N3 existente con la que converge (no crea unidades). */
  unitId: string;
  topic: string;
  question: string;
  ugcs: string[];
  sourceSignalIds: string[];
  documentIds: string[];
  areas: string[];
  indicatorNames: string[];
  rationale: string;
  requiredValidation: UGCRequiredValidation;
  epistemicStatus: "open-question";
  /** Si la pregunta se muestra en el Perfil o queda solo para el espacio técnico. */
  visibility: UGCQuestionVisibility;
  /** Motivo explícito de la decisión de visibilidad (auditable, no por orden). */
  visibilityRationale: string;
  limitations: string[];
}

/**
 * Límites de densidad. 5C: ≤3 señales/unidad, ≤1 pregunta/unidad, ≤8 producidas.
 * 5D: además ≤4 preguntas VISIBLES en el Perfil (el resto quedan técnicas).
 */
export const MAX_SIGNALS_PER_UNIT = 3;
export const MAX_QUESTIONS_TOTAL = 8;
export const MAX_VISIBLE_QUESTIONS = 4;

const SHARED_LIMITATIONS: string[] = [
  "Los documentos UGC no aportan valores, periodos ni denominadores verificables; esta selección solo permite abrir una pregunta.",
  "La clasificación 'A mejorar' es autoría del documento; no significa peor valor, incumplimiento ni dirección negativa conocida.",
  "La coincidencia entre UGC es documental (misma lista de indicadores seleccionados); no implica diferencia ni patrón epidemiológico compartido.",
];

interface UnitMapping {
  unitId: string;
  topic: string;
  /**
   * Indicadores REPRESENTATIVOS (curados, ≤3), no seleccionados por frecuencia
   * ni posición: encarnan la convergencia con la agenda N1a / dimensión N2 de la
   * unidad. Solo se usan si aparecen realmente en la selección documental.
   */
  representativePatterns: RegExp[];
  question: string;
  rationale: string;
  requiredValidation: UGCRequiredValidation;
  /** Decisión de visibilidad (auditoría 5D) por utilidad, no por orden. */
  visibility: UGCQuestionVisibility;
  visibilityRationale: string;
}

/**
 * Mapa conservador N1b → unidad N3 existente. Cada entrada declara la
 * convergencia (regla de selección del mandato: agenda N1a / dimensión N2 /
 * cuestión asistencial clara) y una única pregunta abierta. Referencia las
 * unidades N3 por id (string): esta capa no importa la lógica de N3.
 */
const UNIT_MAPPINGS: UnitMapping[] = [
  {
    unitId: "cronicidad-condiciones-de-vida",
    topic: "Seguimiento de la cronicidad",
    representativePatterns: [
      /PAI Diabetes/i,
      /Retinograf/i,
      /Cartera Servicios HTA\b/i,
    ],
    question:
      "¿Conviene revisar con los profesionales de ambas UGC cómo se interpreta la selección de indicadores de seguimiento de la cronicidad (diabetes, HTA) y qué denominadores utiliza, dado que la selección documental no incluye valores ni periodos?",
    rationale:
      "Converge con la agenda de cronicidad del Informe (N1a) y con las dimensiones de estilos de vida de N2; la selección UGC plantea una cuestión de seguimiento y registro, no un resultado.",
    requiredValidation: "mixed",
    visibility: "profile",
    visibilityRationale:
      "Cuestión asistencial específica (interpretación y denominadores del seguimiento de diabetes/HTA) no presente en la pregunta principal del hilo, centrada en condiciones cotidianas; ámbito prioritario (cronicidad y seguimiento).",
  },
  {
    unitId: "apoyo-social-soledad-envejecimiento",
    topic: "Continuidad de cuidados domiciliarios",
    representativePatterns: [
      /inmovilizados?\b.*seguimiento|inmovilizados? > ?65/i,
      /PAI Cuidados paliativos/i,
      /Cr[oó]nicos Complejos con Plan/i,
    ],
    question:
      "Los informes UGC incorporan indicadores de inmovilizados, cuidados paliativos y pacientes complejos entre los clasificados como 'A mejorar'; sin valores ni periodos, ¿qué pregunta sobre acceso y continuidad de cuidados domiciliarios abre esta selección para el envejecimiento del barrio?",
    rationale:
      "Converge con la agenda de envejecimiento y dependencia (N1a) y con la dimensión de apoyo social (N2); función asistencial clara de continuidad de cuidados.",
    requiredValidation: "mixed",
    visibility: "profile",
    visibilityRationale:
      "Añade la dimensión de acceso y continuidad de cuidados domiciliarios, no cubierta por la pregunta principal (soledad/apoyo); ámbito prioritario (envejecimiento y cuidados).",
  },
  {
    unitId: "consumos-tabaco-alcohol",
    topic: "Intervención en tabaquismo",
    // Patrones específicos de tabaco. Se retira /Intervención Avanzada/ porque
    // capturaba, por orden documental, las intervenciones de OBESIDAD infantil
    // (defecto de trazabilidad detectado en la auditoría 5D).
    representativePatterns: [
      /Fumadores/i,
      /h[aá]bito tab[aá]quico/i,
    ],
    question:
      "¿La presencia de indicadores de intervención en tabaquismo y de registro del hábito en la selección documental responde a diferencias de cobertura, de registro o a criterios internos de vigilancia, y cómo lo interpretan los profesionales de ambas UGC?",
    rationale:
      "Converge con el tema de consumos (N1a/N2), cuya agenda ya recoge la intervención sobre el tabaco; cuestión de cobertura y registro, no de resultado.",
    requiredValidation: "health-professionals",
    visibility: "technical-only",
    visibilityRationale:
      "El hilo ya cuenta con señal local N2 suficiente (AUDIT-C y Fagerström); la pregunta UGC repite la cautela general de datos y no cambia la interpretación. Se conserva para el espacio técnico.",
  },
  {
    unitId: "alimentacion-sobrepeso",
    topic: "Detección de obesidad y sobrepeso",
    representativePatterns: [
      /Detecci[oó]n obesidad/i,
      /Prevalencia de sobrepeso/i,
      /Obesidad Infantil/i,
    ],
    question:
      "Los documentos de ambas UGC incluyen la detección de obesidad y sobrepeso entre los indicadores seleccionados para revisión; sin valores ni denominadores, ¿qué cuestión de cobertura o de registro conviene contrastar con los profesionales antes de leerla como una señal de salud?",
    rationale:
      "Converge con la dimensión de alimentación (N2) y con la agenda de sobrepeso; cuestión de registro/cobertura, no de prevalencia.",
    requiredValidation: "mixed",
    visibility: "technical-only",
    visibilityRationale:
      "Repite la incertidumbre ya explícita en la unidad ('no hay medición alimentaria local; PREDIMED es contexto provincial'); no añade una cuestión asistencial nueva frente a N1a/N2. Se conserva para el espacio técnico.",
  },
  {
    unitId: "prevencion-cribados",
    topic: "Cribados y vacunación",
    representativePatterns: [
      /citolog[ií]a en (el |los )/i,
      /Diagn[oó]stico Precoz C[aá]ncer/i,
      /vacunad/i,
    ],
    question:
      "¿La presencia de indicadores de cribado (citología, diagnóstico precoz de cáncer) y de vacunación en la selección documental responde a diferencias de cobertura, de registro, de población adscrita o a criterios internos de vigilancia?",
    rationale:
      "Converge con la agenda de prevención y cribados (N1a); cuestión clara de cobertura y registro que requiere validación.",
    requiredValidation: "mixed",
    visibility: "profile",
    visibilityRationale:
      "Concreta el porqué de la selección (criterios internos, población adscrita, registro) más allá de la cobertura que ya plantea la pregunta principal; ámbito prioritario (prevención y cribados).",
  },
  {
    unitId: "mortalidad-escala-desigualdad",
    topic: "Mortalidad asistencial",
    representativePatterns: [
      /Mortalidad Intrahospitalaria/i,
      /fallecimientos Intrahospitalarios/i,
    ],
    question:
      "La selección documental incluye la mortalidad intrahospitalaria por ictus como indicador 'A mejorar'; sin valor, periodo ni denominador, ¿qué comparador y qué dirección de la desviación deberían aportar los responsables de datos antes de interpretarla?",
    rationale:
      "Converge con la agenda de mortalidad (N1a); requiere valor/periodo/denominador/comparador antes de cualquier lectura.",
    requiredValidation: "data-owners",
    visibility: "profile",
    visibilityRationale:
      "Señala un indicador nombrado y clasificado 'A mejorar' sin valor/periodo/denominador, con validación concreta (responsables de datos); la ausencia de dato es relevante y específica. Ámbito prioritario (mortalidad asistencial).",
  },
];

function dedupe<T>(values: T[]): T[] {
  return Array.from(new Set(values));
}

/**
 * Capa intermedia PURA: transforma la lectura N1b en un número LIMITADO de
 * preguntas de contraste trazadas, una por unidad N3 con convergencia. No inserta
 * señales en la prosa, no produce hechos ni magnitudes, no infiere dirección, no
 * afirma diferencias entre UGC. N3 consume ESTA salida, no las 384 señales.
 */
export function buildUGCAssistanceQuestions(
  reading: UGCClinicalAssistanceReading
): UGCAssistanceQuestion[] {
  const questions: UGCAssistanceQuestion[] = [];

  for (const mapping of UNIT_MAPPINGS) {
    if (questions.length >= MAX_QUESTIONS_TOTAL) break;

    // Señales que encajan en algún patrón representativo de la unidad.
    const matched: UGCClinicalAssistanceSignal[] = reading.signals.filter(
      (signal) =>
        mapping.representativePatterns.some((pattern) =>
          pattern.test(signal.indicatorName)
        )
    );
    if (matched.length === 0) continue; // señal ausente ⇒ unidad fuera (no se fuerza)

    // Deduplicación NOMINAL (misma lista en ambas UGC): agrupar por nombre y
    // limitar a MAX_SIGNALS_PER_UNIT nombres representativos, conservando en
    // trazabilidad TODOS los ids (de ambas UGC) de esos nombres.
    const namesInOrder = dedupe(matched.map((s) => s.indicatorName)).slice(
      0,
      MAX_SIGNALS_PER_UNIT
    );
    const selected = matched.filter((s) =>
      namesInOrder.includes(s.indicatorName)
    );

    questions.push({
      id: `ugc-q:${mapping.unitId}`,
      unitId: mapping.unitId,
      topic: mapping.topic,
      question: mapping.question,
      ugcs: dedupe(selected.map((s) => s.ugc)),
      sourceSignalIds: selected.map((s) => s.id),
      documentIds: dedupe(selected.map((s) => s.documentId)),
      areas: dedupe(selected.map((s) => s.area)),
      indicatorNames: namesInOrder,
      rationale: mapping.rationale,
      requiredValidation: mapping.requiredValidation,
      epistemicStatus: "open-question",
      visibility: mapping.visibility,
      visibilityRationale: mapping.visibilityRationale,
      limitations: [...SHARED_LIMITATIONS],
    });
  }

  return questions;
}

/** Preguntas seleccionadas para la vista (visibilidad "profile"), ≤ límite. */
export function selectVisibleUGCAssistanceQuestions(
  questions: UGCAssistanceQuestion[]
): UGCAssistanceQuestion[] {
  return questions
    .filter((q) => q.visibility === "profile")
    .slice(0, MAX_VISIBLE_QUESTIONS);
}
