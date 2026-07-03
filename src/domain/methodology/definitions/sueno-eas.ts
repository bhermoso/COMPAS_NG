import type { MethodologicalModule } from "../MethodologicalModule";

// Definición canónica del bloque de sueño EAS (Sueño EAS).
//
// Estado: "draft"
// - P33_R y P33A son campos derivados oficiales de la Encuesta Andaluza de Salud.
//   No son una escala validada externamente: son indicadores propios de la EAS
//   para monitorización del sueño en la población andaluza.
// - items: [] — COMPÁS NG no procesa los ítems de sueño crudos;
//   consume directamente los campos derivados pre-calculados por la EAS.
// - Categoría: "eas-official-block" porque los campos son construcciones
//   metodológicas propias de la EAS, no una escala con validación psicométrica publicada.
// - Discordancia P33_R / P33A ~29 %: esperada según la literatura del sueño.
//   P33R: cobertura ~98 % en muestras EAS. P33A: cobertura ~75 %.
// - Estado "draft" hasta contraste con documentación metodológica oficial de la EAS.
//
// Referencia de implementación: SuenoCSVParser.ts.

export const SUENO_EAS_MODULE: MethodologicalModule = {
  identity: {
    id: "sueno-eas",
    version: "1.0.0",
    status: "draft",
    category: "eas-official-block",
    name: "Cantidad y Calidad del Sueño EAS",
    shortName: "Sueño EAS",
    description:
      "Bloque oficial de la Encuesta Andaluza de Salud (EAS) para la monitorización " +
      "del sueño en la población adulta. Mide dos dimensiones independientes: " +
      "la duración del sueño respecto a las recomendaciones de la Sociedad Española " +
      "del Sueño (P33_R) y la calidad subjetiva del descanso (P33A).",
    purpose:
      "Estimar la prevalencia de sueño insuficiente y de descanso subjetivamente " +
      "inadecuado en la población adulta del municipio. Los resultados son indicadores " +
      "de prevalencia, no un índice compuesto: se presentan por separado.",
    targetPopulation: "Población adulta (≥16 años), según EAS",
    createdAt: "2026-06-29",
  },

  source: {
    authors: "Consejería de Salud y Familias, Junta de Andalucía",
    title: "Encuesta Andaluza de Salud (EAS) — bloque de monitorización del sueño",
    institutionalBody: "Consejería de Salud y Familias, Junta de Andalucía",
    notes:
      "P33_R clasifica si la persona duerme las horas recomendadas por la " +
      "Sociedad Española del Sueño (SES). P33A recoge si las horas dormidas " +
      "permiten descansar suficiente (calidad subjetiva). " +
      "Estos campos son indicadores propios de la EAS: no corresponden a " +
      "una escala de sueño validada externamente (como el PSQI o el ISI).",
  },

  // P33_R y P33A son campos derivados de la EAS, no ítems de un cuestionario
  // que COMPÁS NG administre o procese directamente.
  items: [],

  dimensions: [
    {
      id: "duracion",
      name: "Duración del sueño",
      description:
        "Indicador binario de duración del sueño respecto a la recomendación SES. " +
        "P33_R = 0: duerme las horas recomendadas (sueño suficiente). " +
        "P33_R = 1: duerme menos horas de las recomendadas (sueño insuficiente). " +
        "Cobertura ~98 % en muestras EAS.",
      itemIds: [],
      outputField: "duracion",
    },
    {
      id: "calidad",
      name: "Calidad subjetiva del sueño",
      description:
        "Indicador binario de calidad subjetiva del descanso. " +
        "P33A = 0: las horas dormidas NO permiten descansar suficiente. " +
        "P33A = 1: las horas dormidas SÍ permiten descansar suficiente. " +
        "Cobertura ~75 % en muestras EAS (missing estructural por oleadas).",
      itemIds: [],
      outputField: "calidad",
    },
  ],

  algorithm: {
    type: "distribution",
    inputLevel: "pre-aggregated",
    steps: [
      {
        order: 1,
        description:
          "COMPÁS NG lee P33_R y P33A del fichero EAS exportado. " +
          "Valores válidos para P33_R: 0 (suficiente) o 1 (insuficiente). " +
          "Valores válidos para P33A: 0 (no descansa) o 1 (descansa suficiente).",
      },
      {
        order: 2,
        description:
          "Se calcula la prevalencia de sueño insuficiente: " +
          "porcentaje de registros con P33_R = 1 sobre el total válido de P33_R.",
      },
      {
        order: 3,
        description:
          "Se calcula la prevalencia de descanso inadecuado: " +
          "porcentaje de registros con P33A = 0 sobre el total válido de P33A.",
      },
      {
        order: 4,
        description:
          "Ambas dimensiones se presentan por separado. " +
          "No se suman ni se combinan en un índice compuesto.",
      },
    ],
    aggregationLevel: "municipal",
    completionCriteria:
      "Registro válido para P33_R: valor 0 o 1 (binary). " +
      "Registro válido para P33A: valor 0 o 1 (binary). " +
      "Un registro puede ser válido para P33_R e inválido para P33A " +
      "(distinta cobertura por oleada).",
    notes:
      "P33_R y P33A son dimensiones independientes: la discordancia esperada " +
      "entre ambas es ~29 %, lo que es estadísticamente coherente con la " +
      "literatura del sueño (se puede dormir horas insuficientes pero sentirse " +
      "descansado, y viceversa). " +
      "El missing en P33A (~25 %) es estructural por oleadas EAS: " +
      "no es missing aleatorio.",
  },

  interpretation: {
    scale: {
      min: 0,
      max: 100,
      direction: "lower-is-better",
    },
    contextualNotes: [
      "Los resultados son prevalencias (%), no un score compuesto.",
      "P33_R y P33A miden dimensiones distintas del sueño: no comparar directamente.",
      "Discordancia esperada entre P33_R y P33A: ~29 %.",
      "P33_R cobertura ~98 %. P33A cobertura ~75 % en muestras EAS.",
      "No existen umbrales de referencia poblacionales publicados para estos " +
      "indicadores específicos de la EAS.",
      "Una muestra inferior a 30 registros válidos limita la interpretación.",
    ],
  },

  limitations: [
    "P33_R y P33A son indicadores propios de la EAS, no escalas de sueño " +
    "validadas externamente (como el PSQI, el ISI o el ESS).",
    "La polaridad de los campos es opuesta: P33_R = 1 indica problema; " +
    "P33A = 0 indica problema. Esta asimetría debe declararse explícitamente.",
    "Missing estructural en P33A: oleadas EAS que no incluyen esta pregunta " +
    "generan tasas de missing altas que no son comparables entre muestras.",
    "Los resultados son agregados de la muestra importada: " +
    "no permiten análisis por subgrupos sin acceso a los registros individuales.",
    "No genera un índice compuesto de calidad del sueño: " +
    "los dos indicadores deben interpretarse por separado.",
    "Contraste con documentación metodológica oficial de la EAS pendiente.",
  ],

  bibliography: [
    {
      authors: "Consejería de Salud y Familias, Junta de Andalucía",
      title: "Encuesta Andaluza de Salud — documentación metodológica de la VI oleada",
      notes: "Fuente de los campos P33_R y P33A como indicadores EAS de sueño.",
    },
  ],

  adapters: {
    sav: {
      referenceFile: "EAS_microdatos_adulto_READY.csv",
      variables: [
        {
          outputField: "duracion",
          savVariable: "P33_R",
          label:
            "Duración del sueño respecto a recomendación SES " +
            "(0 = suficiente, 1 = insuficiente)",
          valueLabels: [
            { value: 0, label: "Duerme las horas recomendadas" },
            { value: 1, label: "Duerme menos horas de las recomendadas" },
          ],
          measurementLevel: "nominal",
          waveCompatibility: {
            notes: "Cobertura ~98 % en muestras EAS.",
          },
        },
        {
          outputField: "calidad",
          savVariable: "P33A",
          label:
            "Calidad subjetiva del sueño " +
            "(0 = no descansa suficiente, 1 = descansa suficiente)",
          valueLabels: [
            { value: 0, label: "Las horas dormidas no permiten descansar suficiente" },
            { value: 1, label: "Las horas dormidas permiten descansar suficiente" },
          ],
          measurementLevel: "nominal",
          waveCompatibility: {
            notes: "Cobertura ~75 %. Missing estructural por oleadas EAS.",
          },
        },
      ],
    },
  },

  institutionalNote: {
    diagnosticInterpretation:
      "El módulo de Sueño EAS mide dos dimensiones independientes del sueño de la " +
      "población adulta: la duración respecto a las horas recomendadas (P33_R) y la " +
      "calidad subjetiva del descanso (P33A). Un porcentaje de sueño insuficiente " +
      "superior al 30–35 % indica que una parte relevante de la muestra no alcanza " +
      "las horas recomendadas por la Sociedad Española del Sueño. La discordancia " +
      "entre P33_R y P33A es estadísticamente esperada (~29 %) y no señala " +
      "inconsistencia: alguien puede dormir las horas suficientes pero no descansar " +
      "bien (o viceversa). Porcentajes de discordancia muy superiores al 29 % pueden " +
      "indicar una prevalencia elevada de problemas de calidad del sueño independientes " +
      "de la duración.",

    implications: [
      "Análisis de la prevalencia de sueño insuficiente en la población adulta y su " +
      "relación con la salud mental y el bienestar cotidiano.",
      "Cruce con SF-12 MCS (salud mental percibida): el sueño insuficiente correlaciona " +
      "con peor bienestar emocional en la literatura.",
      "Consideración del envejecimiento: los patrones de sueño cambian con la edad " +
      "(personas mayores tienden a dormir menos horas pero de forma más fragmentada).",
      "Valoración de los contextos laborales y de cuidados que impactan en el descanso " +
      "(trabajo nocturno, cuidados de personas dependientes).",
      "En municipios con IBSE disponible: cruce con bienestar socioemocional escolar, " +
      "ya que el sueño insuficiente está asociado con peor rendimiento y bienestar en " +
      "adolescentes.",
    ],

    publicHealthApplication: {
      measures: [
        "Proporción de adultos que duermen menos horas de las recomendadas por la " +
        "Sociedad Española del Sueño (P33_R = 1: sueño insuficiente).",
        "Proporción de adultos que sienten que las horas dormidas no les permiten " +
        "descansar suficiente (P33A = 0: no descansa).",
      ],
      doesNotMeasure: [
        "Diagnóstico de trastornos del sueño clínicamente definidos (insomnio, apnea, etc.).",
        "Calidad objetiva del sueño mediante métodos instrumentales (polisomnografía).",
        "Duración exacta del sueño en horas: solo clasifica si supera o no el umbral SES.",
      ],
      contextualUse: [
        "Indicador de salud pública de los hábitos de sueño poblacionales, útil como " +
        "aproximación al bienestar cotidiano y a la carga de fatiga en la población.",
        "P33_R y P33A son dimensiones INDEPENDIENTES: no se suman ni se comparan directamente.",
        "La referencia epidemiológica (~29 % de discordancia P33R/P33A) es orientativa, " +
        "no un umbral de alerta: refleja la heterogeneidad natural de los patrones de sueño.",
      ],
      commonMisinterpretations: [
        "Un porcentaje de sueño insuficiente alto no indica necesariamente un problema " +
        "evitable: puede reflejar patrones culturales, laborales o de cuidados estructurales.",
        "La discordancia ~29 % entre P33_R y P33A es esperada y coherente con la " +
        "literatura: NO indica contradicción en las respuestas.",
        "El missing en P33A puede ser estructural (oleadas EAS sin esta pregunta) y no " +
        "equivale a rechazo de la respuesta.",
      ],
    },

    pslIntegration: {
      chapter: "Determinantes de Salud",
      determinants: [
        "Estilos de vida saludable",
        "Salud mental y bienestar",
        "Hábitos de descanso",
      ],
      contribution:
        "El módulo de Sueño EAS contribuye al análisis de los determinantes de salud " +
        "relacionados con los hábitos cotidianos y el bienestar de la población adulta. " +
        "Sus resultados son especialmente relevantes en combinación con el componente " +
        "mental del SF-12 (MCS) y, cuando esté disponible el IBSE, con el bienestar " +
        "socioemocional escolar, construyendo una imagen integrada del descanso y el " +
        "bienestar en el municipio.",
    },

    relatedInstrumentIds: ["sf12-eas", "ibse"],
  },
};
