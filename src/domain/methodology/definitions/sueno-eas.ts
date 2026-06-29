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
};
