/**
 * healthDeterminantFrames
 *
 * Marco semántico mínimo para que el Perfil no reduzca los problemas de salud
 * a etiquetas. No crea datos locales ni ordena causas: aporta determinantes
 * reconocidos por salud pública para leer señales locales, textuales o proxy
 * con prudencia científica.
 */

export type HealthDeterminantFrameId =
  | "diabetes-metabolic"
  | "cancer"
  | "cardiovascular"
  | "respiratory"
  | "mental-sleep"
  | "ageing-care"
  | "physical-activity"
  | "nutrition-metabolic"
  | "substance-use"
  | "prevention-access"
  | "noncommunicable-disease";

export interface HealthDeterminantFrame {
  id: HealthDeterminantFrameId;
  label: string;
  matchTerms: string[];
  determinants: string[];
  mechanism: string;
  sourceBasis: string[];
}

export interface HealthDeterminantFrameSummary {
  frameIds: HealthDeterminantFrameId[];
  labels: string[];
  determinants: string[];
  statement: string;
  mechanism: string;
  caution: string;
  sourceBasis: string[];
}

const DETERMINANT_FRAMES: HealthDeterminantFrame[] = [
  {
    id: "diabetes-metabolic",
    label: "diabetes y salud metabólica",
    matchTerms: ["diabetes", "glucemia", "hiperglucemia", "hba1c", "metabol"],
    determinants: [
      "edad y curso de vida",
      "susceptibilidad familiar o genética",
      "exceso de peso y adiposidad",
      "alimentación",
      "actividad física",
      "condiciones materiales que facilitan o restringen hábitos",
      "detección, seguimiento y continuidad asistencial",
    ],
    mechanism:
      "La diabetes se entiende como problema multicausal donde biología, trayectoria vital, hábitos y contexto social se combinan",
    sourceBasis: [
      "CDC: factores de riesgo de diabetes tipo 2",
      "OMS: enfermedades no transmisibles",
      "OMS: determinantes sociales de la salud",
    ],
  },
  {
    id: "cancer",
    label: "cáncer y tumores",
    matchTerms: ["cancer", "cáncer", "tumor", "tumores", "neoplas", "oncolog"],
    determinants: [
      "edad",
      "tabaco",
      "alcohol",
      "alimentación y actividad física",
      "exposiciones ambientales, laborales o infecciosas",
      "cribado y diagnóstico oportuno",
      "susceptibilidad hereditaria en algunos tumores",
    ],
    mechanism:
      "El cáncer no admite una lectura única: combina exposiciones acumuladas, prevención, detección y condiciones de acceso",
    sourceBasis: [
      "OMS: cáncer",
      "OMS: enfermedades no transmisibles",
      "OMS: determinantes sociales de la salud",
    ],
  },
  {
    id: "cardiovascular",
    label: "salud cardiovascular",
    matchTerms: [
      "cardiovascular",
      "cardiopat",
      "infarto",
      "ictus",
      "cerebrovascular",
      "hipertension",
      "hipertensión",
      "tension arterial",
      "tensión arterial",
    ],
    determinants: [
      "edad",
      "tabaco",
      "alimentación, sal y calidad de la dieta",
      "actividad física",
      "obesidad, diabetes, presión arterial y lípidos",
      "estrés crónico y condiciones materiales",
      "detección y seguimiento clínico",
    ],
    mechanism:
      "La salud cardiovascular vincula exposiciones acumuladas, metabolismo, estrés social y continuidad de cuidados",
    sourceBasis: [
      "OMS: enfermedades no transmisibles",
      "OMS: determinantes sociales de la salud",
    ],
  },
  {
    id: "respiratory",
    label: "salud respiratoria",
    matchTerms: ["respirator", "epoc", "asma", "bronqu", "pulmon", "pulmón"],
    determinants: [
      "tabaco",
      "calidad del aire",
      "condiciones de vivienda",
      "exposiciones laborales",
      "infecciones",
      "edad y fragilidad",
      "acceso a diagnóstico y seguimiento",
    ],
    mechanism:
      "La salud respiratoria relaciona exposición ambiental, vivienda, trabajo, tabaco y atención continuada",
    sourceBasis: [
      "OMS: enfermedades no transmisibles",
      "OMS: determinantes sociales de la salud",
    ],
  },
  {
    id: "mental-sleep",
    label: "salud mental, malestar y descanso",
    matchTerms: [
      "salud mental",
      "malestar",
      "psicolog",
      "depres",
      "ansiedad",
      "sueno",
      "sueño",
      "descanso",
      "psqi",
      "ghq",
      "phq",
    ],
    determinants: [
      "seguridad material",
      "tiempos de trabajo y cuidados",
      "condiciones de vivienda y descanso",
      "apoyo social",
      "aislamiento",
      "carga de cuidados",
      "acceso a escucha y atención",
    ],
    mechanism:
      "El malestar y el descanso se leen como fenómenos encarnados en tiempo, vivienda, vínculos y cargas cotidianas",
    sourceBasis: [
      "OMS: determinantes sociales de la salud",
      "CDC: dominios de determinantes sociales",
    ],
  },
  {
    id: "ageing-care",
    label: "envejecimiento, cuidados y soledad",
    matchTerms: ["envejec", "dependencia", "mayores", "soledad", "apoyo social", "duke"],
    determinants: [
      "estructura por edad",
      "cronicidad y discapacidad",
      "redes familiares y vecinales",
      "carga de cuidados",
      "accesibilidad de servicios y espacio público",
      "vínculo social",
    ],
    mechanism:
      "El envejecimiento se interpreta como relación entre trayectoria vital, dependencia, cuidados, accesibilidad y red social",
    sourceBasis: [
      "OMS: determinantes sociales de la salud",
      "marco salutogénico y de activos",
    ],
  },
  {
    id: "physical-activity",
    label: "actividad física y sedentarismo",
    matchTerms: ["actividad fisica", "actividad física", "sedentar", "movilidad", "ejercicio", "vida activa", "ipaq", "sbq"],
    determinants: [
      "entorno construido",
      "seguridad y accesibilidad del espacio público",
      "tiempos de trabajo y cuidados",
      "edad, discapacidad y autonomía",
      "renta y oportunidades de ocio activo",
      "normas sociales sobre cuerpo y movimiento",
    ],
    mechanism:
      "La actividad física depende de oportunidades reales de movimiento, no solo de voluntad individual",
    sourceBasis: [
      "OMS: enfermedades no transmisibles",
      "OMS: determinantes sociales de la salud",
    ],
  },
  {
    id: "nutrition-metabolic",
    label: "alimentación, sobrepeso y metabolismo",
    matchTerms: ["aliment", "obesidad", "sobrepeso", "dieta", "nutric", "predimed", "mediterr"],
    determinants: [
      "renta y precio de los alimentos",
      "disponibilidad alimentaria",
      "tiempos de compra, cocina y cuidados",
      "preferencias y cultura alimentaria",
      "entorno comercial",
      "actividad física y metabolismo",
    ],
    mechanism:
      "La alimentación se interpreta como margen real de elección dentro de un entorno material y cultural",
    sourceBasis: [
      "OMS: enfermedades no transmisibles",
      "OMS: determinantes sociales de la salud",
    ],
  },
  {
    id: "substance-use",
    label: "tabaco, alcohol y otros consumos",
    matchTerms: ["tabaco", "alcohol", "consumo", "audit", "cage", "fagerstrom", "adicc"],
    determinants: [
      "disponibilidad y normalización social",
      "estrés psicosocial",
      "condiciones materiales",
      "salud mental",
      "redes de apoyo",
      "acceso a ayuda para abandono o reducción del daño",
    ],
    mechanism:
      "Los consumos se leen como prácticas situadas en oferta, norma social, malestar y apoyos disponibles",
    sourceBasis: [
      "OMS: enfermedades no transmisibles",
      "OMS: determinantes sociales de la salud",
    ],
  },
  {
    id: "prevention-access",
    label: "prevención, cribados y acceso",
    matchTerms: [
      "cribado",
      "cobertura",
      "prevencion",
      "prevención",
      "vacun",
      "diagnostico",
      "diagnóstico",
      "seguimiento",
      "acceso",
      "asistencial",
    ],
    determinants: [
      "accesibilidad de servicios",
      "información y alfabetización en salud",
      "confianza institucional",
      "horarios, citas y tiempos de espera",
      "carga laboral o de cuidados",
      "posición socioeconómica",
    ],
    mechanism:
      "La prevención depende de oferta, acceso real, confianza, tiempo disponible y comprensión de la información sanitaria",
    sourceBasis: [
      "OMS: determinantes sociales de la salud",
      "CDC: dominios de acceso y calidad sanitaria",
    ],
  },
  {
    id: "noncommunicable-disease",
    label: "enfermedades crónicas no transmisibles",
    matchTerms: ["cronicidad", "cronica", "crónica", "cronico", "crónico", "enfermedades no transmisibles", "multimorbilidad"],
    determinants: [
      "factores genéticos y fisiológicos",
      "tabaco",
      "actividad física insuficiente",
      "alimentación no saludable",
      "alcohol",
      "contaminación del aire",
      "condiciones sociales que distribuyen exposición y protección",
    ],
    mechanism:
      "La cronicidad se entiende como acumulación de exposiciones, vulnerabilidades y protección social a lo largo de la vida",
    sourceBasis: [
      "OMS: enfermedades no transmisibles",
      "OMS: determinantes sociales de la salud",
    ],
  },
];

function normalizar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function unique(values: string[]): string[] {
  return [...new Set(values.filter((value) => value.trim().length > 0))];
}

function enumerar(values: string[]): string {
  if (values.length <= 1) return values[0] ?? "";
  return `${values.slice(0, -1).join(", ")} y ${values[values.length - 1]}`;
}

export function findHealthDeterminantFrames(
  text: string
): HealthDeterminantFrame[] {
  const normalized = normalizar(text);
  return DETERMINANT_FRAMES.filter((frame) =>
    frame.matchTerms.some((term) => normalized.includes(normalizar(term)))
  );
}

export function buildHealthDeterminantFrameSummary(
  text: string,
  maxFrames = 2
): HealthDeterminantFrameSummary | undefined {
  const frames = findHealthDeterminantFrames(text).slice(0, maxFrames);
  if (frames.length === 0) return undefined;

  const labels = unique(frames.map((frame) => frame.label));
  const determinants = unique(frames.flatMap((frame) => frame.determinants)).slice(0, 8);
  const sourceBasis = unique(frames.flatMap((frame) => frame.sourceBasis));
  const statement =
    `Determinantes reconocidos para ${enumerar(labels)}: ` +
    `${enumerar(determinants)}.`;
  const caution =
    "El expediente no permite ordenar el peso local de estos factores ni " +
    "atribuir el patrón a uno de ellos; COMPÁS los usa como mecanismos " +
    "plausibles para contraste técnico y comunitario.";

  return {
    frameIds: frames.map((frame) => frame.id),
    labels,
    determinants,
    statement,
    mechanism: `${frames[0].mechanism}. ${statement}`,
    caution,
    sourceBasis,
  };
}
