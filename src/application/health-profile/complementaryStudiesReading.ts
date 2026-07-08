/**
 * complementaryStudiesReading
 *
 * Lectura sustantiva de los estudios complementarios: convierte el conjunto
 * de estudios levantados y sus indicadores en BLOQUES DIAGNÓSTICOS
 * interpretables (patrones de salud y bienestar), con los instrumentos que
 * sostienen cada bloque, sus cautelas, la lectura territorial que permiten,
 * las hipótesis diagnósticas que habilitan y las preguntas de contraste
 * que dejan abiertas.
 *
 * Regla de producto: el Perfil debe demostrar que ha LEÍDO los estudios,
 * no que los ha contado. Esta capa no produce una lista larga de variables:
 * produce una lectura institucional útil, prudente y trazable.
 *
 * Criterios:
 *   - Clasificación textual conservadora sobre los títulos reales de los
 *     indicadores y la presencia real de cada instrumento. Nada se inventa:
 *     un bloque solo existe si sus instrumentos o indicadores constan.
 *   - Sin causalidad fuerte, sin recomendaciones, sin estimación territorial
 *     que la escala no permita.
 *   - Los indicadores que no clasifican se declaran como limitación.
 */

import type { MunicipalityWorkspace } from "../../domain/workspace";

// ── Tipos ─────────────────────────────────────────────────────────────────────

export interface ComplementaryStudyDiagnosticBlock {
  id: string;
  /** Nombre del patrón de salud y bienestar, en minúscula narrativa. */
  title: string;
  /** Lectura de una frase: qué describe el bloque y con qué prudencia. */
  summary: string;
  /** Señales de salud y bienestar que agrupa. */
  signals: string[];
  /** Instrumentos presentes en el expediente que sostienen el bloque. */
  supportingStudies: string[];
  /** Títulos de indicadores reales clasificados en el bloque. */
  supportingIndicators: string[];
  cautions: string[];
  /** Qué lectura territorial permite este bloque (y cuál no). */
  territorialReading: string;
  /** Enunciados de hipótesis de determinantes que el bloque habilita. */
  relatedDeterminantHypotheses: string[];
  contrastQuestions: string[];
}

export interface ComplementaryStudiesReading {
  totalStudies: number;
  totalIndicators: number;
  diagnosticBlocks: ComplementaryStudyDiagnosticBlock[];
  /** Indicadores que la clasificación prudente no asigna: limitación declarada. */
  unclassifiedIndicators: string[];
  crossCuttingCautions: string[];
  contrastQuestions: string[];
}

// ── Enunciados compartidos de hipótesis de determinantes ─────────────────────
// Los mismos enunciados que produce la lectura epidemiológico-social
// (diagnosticAnswers): la identidad textual es lo que hace trazable el vínculo
// bloque → hipótesis en la narrativa.

export const HIPOTESIS_PSICOSOCIAL =
  "condiciones psicosociales del entorno cotidiano (redes de apoyo, " +
  "convivencia y carga de malestar emocional)";

export const HIPOTESIS_ENTORNO_URBANO =
  "características del entorno urbano y oportunidades de vida activa " +
  "(espacio público, accesibilidad, usos cotidianos)";

export const HIPOTESIS_CONSUMOS =
  "condiciones socioeconómicas y contextos de consumo y alimentación";

// ── Instrumentos reconocidos del expediente ──────────────────────────────────

type StudyField =
  | "ibseStudy"
  | "dukeStudy"
  | "predimedStudy"
  | "sf12Study"
  | "suenoStudy"
  | "cageStudy"
  | "auditcStudy"
  | "ipaqStudy"
  | "ghq12Study"
  | "phq9Study"
  | "psqiStudy"
  | "fagerstromStudy"
  | "sbqStudy";

const STUDY_FIELDS: Array<{ field: StudyField; label: string }> = [
  { field: "ibseStudy", label: "IBSE" },
  { field: "dukeStudy", label: "DUKE" },
  { field: "predimedStudy", label: "PREDIMED" },
  { field: "sf12Study", label: "SF-12" },
  { field: "suenoStudy", label: "Sueño (EAS)" },
  { field: "cageStudy", label: "CAGE" },
  { field: "auditcStudy", label: "AUDIT-C" },
  { field: "ipaqStudy", label: "IPAQ" },
  { field: "ghq12Study", label: "GHQ-12" },
  { field: "phq9Study", label: "PHQ-9" },
  { field: "psqiStudy", label: "PSQI" },
  { field: "fagerstromStudy", label: "Fagerström" },
  { field: "sbqStudy", label: "SBQ" },
];

const PROXY_SCALE_RE =
  /proxy|contexto exploratorio|estimaci[óo]n espec[íi]fica|escala provincial|[áa]mbito provincial/i;

// ── Especificación de bloques (clasificación textual conservadora) ────────────
// El orden importa: un indicador se asigna al primer bloque cuyas claves
// coincidan (p. ej., «IBSE – Factor Vínculo» clasifica como bienestar
// socioemocional escolar antes de que «vínculo» pueda leerse como apoyo social;
// «SF-12 … Componente Físico» clasifica como salud percibida antes de que
// «físico» pueda leerse como actividad física).

interface BlockSpec {
  id: string;
  title: string;
  claves: string[];
  studyLabels: string[];
  signals: string[];
  hypotheses: string[];
  contrastQuestion: string;
  describe: string;
}

const BLOCK_SPECS: BlockSpec[] = [
  {
    id: "bienestar-socioemocional-escolar",
    title: "bienestar socioemocional escolar",
    claves: ["ibse", "socioemocional"],
    studyLabels: ["IBSE"],
    signals: ["bienestar socioemocional escolar"],
    hypotheses: [],
    contrastQuestion:
      "¿El patrón de bienestar socioemocional escolar observado se reproduce " +
      "en los centros educativos del ámbito y en qué grupos se concentra?",
    describe:
      "el bienestar socioemocional de la población escolar y sus factores " +
      "(vínculo, situación, control y persona)",
  },
  {
    id: "salud-mental-sueno-malestar",
    title: "salud mental, sueño y malestar percibido",
    claves: [
      "ghq",
      "phq",
      "psqi",
      "sf12",
      "salud percibida",
      "mental",
      "malestar",
      "depresiv",
      "ansie",
      "sueno",
      "descanso",
    ],
    studyLabels: ["SF-12", "Sueño (EAS)", "GHQ-12", "PHQ-9", "PSQI"],
    signals: ["salud mental y salud percibida", "calidad y suficiencia del sueño"],
    hypotheses: [HIPOTESIS_PSICOSOCIAL],
    contrastQuestion:
      "¿El malestar psicológico y los problemas de descanso que muestra la " +
      "evidencia contextual se confirman en la población del ámbito y en qué " +
      "perfiles se concentran?",
    describe:
      "la salud percibida, el malestar psicológico y la calidad del descanso",
  },
  {
    id: "apoyo-social-vinculo-comunitario",
    title: "apoyo social y vínculo comunitario",
    claves: ["duke", "apoyo social", "apoyo confidencial", "apoyo afectivo", "soledad", "convivencia"],
    studyLabels: ["DUKE"],
    signals: ["apoyo social funcional"],
    hypotheses: [HIPOTESIS_PSICOSOCIAL],
    contrastQuestion:
      "¿Las redes de apoyo social funcionan de forma equivalente en los " +
      "distintos barrios y grupos de edad del ámbito?",
    describe:
      "la disponibilidad de apoyo social funcional, confidencial y afectivo",
  },
  {
    id: "actividad-fisica-sedentarismo-entorno",
    title: "actividad física, sedentarismo y entorno cotidiano",
    claves: ["ipaq", "sbq", "actividad fisica", "sedentar", "inactividad", "movilidad", "paseo"],
    studyLabels: ["IPAQ", "SBQ"],
    signals: ["actividad física y sedentarismo"],
    hypotheses: [HIPOTESIS_ENTORNO_URBANO],
    contrastQuestion:
      "¿El entorno cotidiano del ámbito facilita o dificulta la vida activa " +
      "que sugieren las señales de actividad física y sedentarismo?",
    describe:
      "los niveles de actividad física, la inactividad en tiempo libre y el " +
      "comportamiento sedentario",
  },
  {
    id: "consumos-alimentacion-habitos",
    title: "consumos, alimentación y hábitos de salud",
    claves: [
      "cage",
      "audit",
      "fagerstrom",
      "nicotina",
      "tabaco",
      "alcohol",
      "predimed",
      "dieta",
      "alimenta",
      "consumo",
    ],
    studyLabels: ["CAGE", "AUDIT-C", "Fagerström", "PREDIMED"],
    signals: ["consumos de alcohol y tabaco", "alimentación"],
    hypotheses: [HIPOTESIS_CONSUMOS],
    contrastQuestion:
      "¿Los patrones contextuales de consumo y alimentación se corresponden " +
      "con los contextos reales de consumo del ámbito?",
    describe:
      "los consumos de alcohol y tabaco, la dependencia de la nicotina y la " +
      "adherencia alimentaria",
  },
];

// ── Utilidades ────────────────────────────────────────────────────────────────

function normalize(value: string): string {
  const decomposed = value.normalize("NFD").toLowerCase();
  let out = "";
  for (let i = 0; i < decomposed.length; i++) {
    const code = decomposed.charCodeAt(i);
    const keep =
      (code >= 48 && code <= 57) || (code >= 97 && code <= 122) || code === 32;
    if (keep) out += decomposed[i];
  }
  return out;
}

function listar(items: string[]): string {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} y ${items[items.length - 1]}`;
}

// ── Punto de entrada ──────────────────────────────────────────────────────────

export interface BuildComplementaryStudiesReadingInput {
  workspace: MunicipalityWorkspace;
  /** Títulos reales de los indicadores disponibles. */
  indicatorTitles: string[];
}

export function buildComplementaryStudiesReading(
  input: BuildComplementaryStudiesReadingInput
): ComplementaryStudiesReading {
  const { workspace, indicatorTitles } = input;

  const presentes = STUDY_FIELDS.filter(
    (s) => workspace[s.field] !== undefined
  );
  const presentLabels = new Set(presentes.map((s) => s.label));

  const hasProxyScale = presentes.some((s) => {
    const study = workspace[s.field] as
      | { methodologicalCautions?: string[] }
      | undefined;
    return (study?.methodologicalCautions ?? []).some((c) =>
      PROXY_SCALE_RE.test(c)
    );
  });

  // Clasificación de indicadores: primer bloque cuyas claves coinciden.
  const porBloque = new Map<string, string[]>(
    BLOCK_SPECS.map((b) => [b.id, []])
  );
  const unclassifiedIndicators: string[] = [];
  for (const title of indicatorTitles) {
    const texto = normalize(title);
    const spec = BLOCK_SPECS.find((b) =>
      b.claves.some((clave) => texto.includes(normalize(clave)))
    );
    if (spec === undefined) {
      unclassifiedIndicators.push(title);
      continue;
    }
    porBloque.get(spec.id)!.push(title);
  }

  const escala = hasProxyScale
    ? "lectura de escala contextual (provincial u origen externo): orienta " +
      "hipótesis, no mide resultados propios del ámbito y requiere contraste " +
      "territorial"
    : "lectura sujeta a las cautelas metodológicas declaradas por cada instrumento";

  const diagnosticBlocks: ComplementaryStudyDiagnosticBlock[] = [];
  for (const spec of BLOCK_SPECS) {
    const supportingStudies = spec.studyLabels.filter((l) =>
      presentLabels.has(l)
    );
    const supportingIndicators = porBloque.get(spec.id)!;
    // Un bloque solo existe si sus instrumentos o indicadores constan.
    if (supportingStudies.length === 0 && supportingIndicators.length === 0) {
      continue;
    }
    diagnosticBlocks.push({
      id: spec.id,
      title: spec.title,
      summary:
        `Reúne ${supportingIndicators.length} indicadores de ` +
        `${listar(supportingStudies)} que describen ${spec.describe}; ` +
        `es un patrón interpretable, no una medición del ámbito.`,
      signals: [...spec.signals],
      supportingStudies,
      supportingIndicators,
      cautions: [escala],
      territorialReading:
        "Permite una lectura territorial exploratoria: sitúa un patrón " +
        "plausible de salud y bienestar y habilita hipótesis, sin sustituir " +
        "la medición propia del ámbito.",
      relatedDeterminantHypotheses: [...spec.hypotheses],
      contrastQuestions: [spec.contrastQuestion],
    });
  }

  const crossCuttingCautions: string[] = [];
  if (hasProxyScale) {
    crossCuttingCautions.push(
      "Las señales de los bloques proceden de evidencia contextual (escala " +
      "provincial u origen externo) y quedan pendientes de contraste territorial."
    );
  }
  crossCuttingCautions.push(
    "Los agregados disponibles no permiten desagregación interna por sexo, " +
    "edad o condición socioeconómica."
  );

  const contrastQuestions = diagnosticBlocks.flatMap((b) => b.contrastQuestions);

  return {
    totalStudies: presentes.length,
    totalIndicators: indicatorTitles.length,
    diagnosticBlocks,
    unclassifiedIndicators,
    crossCuttingCautions,
    contrastQuestions,
  };
}
