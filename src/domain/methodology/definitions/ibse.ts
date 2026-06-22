import type { MethodologicalModule } from "../MethodologicalModule";

// Definición canónica del Índice de Bienestar Socioemocional (IBSE).
//
// Estado: "draft" — los textos oficiales de los 8 ítems no han sido contrastados
// con la fuente primaria (Bericat, 2014). La estructura de factores, el algoritmo
// y el adaptador REDCap sí están verificados contra la implementación en uso.
// El módulo no debe marcarse como "validated" hasta completar esa revisión.
//
// Nota sobre el algoritmo:
// El algoritmo canónico opera sobre respuestas individuales crudas (individual-responses).
// La implementación actual recibe puntuaciones ya calculadas por REDCap por participante
// (pre-aggregated), lo que es una limitación del adaptador, no del instrumento.

export const IBSE_MODULE: MethodologicalModule = {
  identity: {
    id: "ibse",
    version: "1.0.0",
    status: "draft",
    category: "validated-scale",
    name: "Índice de Bienestar Socioemocional",
    shortName: "IBSE",
    description:
      "Instrumento de medición del bienestar socioemocional de la población escolar " +
      "mediante 8 ítems agrupados en 4 factores y un índice total.",
    purpose:
      "Evaluar el estado de bienestar subjetivo de la población escolar en sus " +
      "dimensiones de vínculo, situación vital, control percibido y aspectos personales.",
    targetPopulation: "Población escolar (aproximadamente 10–16 años)",
    createdAt: "2026-06-22",
  },

  source: {
    authors: "Bericat, E.",
    year: 2014,
    notes:
      "Adaptación para uso en planificación local de salud en municipios andaluces. " +
      "La referencia bibliográfica completa debe completarse con los datos de la publicación original.",
  },

  // Los textos de los 8 ítems requieren contraste con la fuente primaria (Bericat, 2014).
  // Se dejan vacíos hasta disponer de la documentación oficial verificada.
  items: [],

  dimensions: [
    {
      id: "factor-vinculo",
      name: "Vínculo",
      description: "Dimensión que recoge el sentido de pertenencia y las relaciones afectivas del escolar.",
      itemIds: [],
      outputField: "meanFactorVinculo",
    },
    {
      id: "factor-situacion",
      name: "Situación",
      description: "Dimensión que evalúa la valoración de la situación vital actual del escolar.",
      itemIds: [],
      outputField: "meanFactorSituacion",
    },
    {
      id: "factor-control",
      name: "Control",
      description: "Dimensión que mide el sentido de control percibido sobre la propia vida.",
      itemIds: [],
      outputField: "meanFactorControl",
    },
    {
      id: "factor-persona",
      name: "Persona",
      description: "Dimensión que recoge aspectos de la autopercepción y la identidad personal.",
      itemIds: [],
      outputField: "meanFactorPersona",
    },
    {
      id: "total",
      name: "Índice total",
      description: "Índice compuesto calculado como media de los 8 ítems del instrumento.",
      itemIds: [],
      outputField: "meanTotal",
      isComposite: true,
    },
  ],

  algorithm: {
    type: "item-mean",
    inputLevel: "individual-responses",
    steps: [
      {
        order: 1,
        description: "Administrar los 8 ítems del instrumento a cada participante en la escala de respuesta definida.",
      },
      {
        order: 2,
        description: "Calcular la puntuación de cada factor como la media de los 2 ítems que lo componen.",
      },
      {
        order: 3,
        description: "Calcular el índice total como la media de los 8 ítems.",
      },
      {
        order: 4,
        description: "Filtrar participantes: incluir solo registros con respuesta completa a todos los ítems.",
      },
      {
        order: 5,
        description:
          "Agregar al nivel municipal: calcular la media aritmética de cada puntuación de factor " +
          "e índice total sobre el conjunto de participantes válidos del municipio.",
      },
    ],
    aggregationLevel: "municipal",
    completionCriteria:
      "Registro completo: respuesta válida a los 8 ítems del instrumento.",
    notes:
      "La implementación actual recibe de REDCap puntuaciones de factor e índice ya calculadas " +
      "a nivel individual (pasos 2-3 ejecutados por REDCap). El parser realiza el filtrado " +
      "y la agregación municipal (pasos 4-5). Esta es una limitación del adaptador actual, " +
      "no del algoritmo canónico.",
  },

  interpretation: {
    scale: {
      min: 0,
      max: 10,
      direction: "higher-is-better",
    },
    contextualNotes: [
      "Los resultados son medias de la muestra disponible, no estimaciones poblacionales.",
      "La comparabilidad entre municipios y entre oleadas requiere homogeneidad metodológica en el proceso de recogida.",
      "Una muestra inferior a 30 participantes válidos limita la fiabilidad de los resultados.",
      "Los resultados deben interpretarse en el contexto del municipio concreto y no como indicadores normativos.",
    ],
  },

  limitations: [
    "Instrumento diseñado para población escolar; no es aplicable a otras franjas etarias sin validación específica.",
    "No permite análisis por subgrupos (género, curso, centro) sin acceso a los registros individuales.",
    "La comparación con otros municipios requiere que el proceso de administración sea metodológicamente equivalente.",
    "Los ítems específicos y sus opciones de respuesta deben contrastarse con la publicación original de Bericat (2014).",
  ],

  bibliography: [
    {
      authors: "Bericat, E.",
      year: 2014,
      notes: "Referencia bibliográfica completa pendiente de contraste con la fuente primaria.",
    },
  ],

  adapters: {
    redcap: {
      instrument: "monitor_ibse",
      completedColumn: "monitor_ibse_complete",
      completedValue: "2",
      columns: [
        {
          outputField: "meanTotal",
          redcapColumn: "ibse_total",
          isComputed: true,
          notes: "Puntuación total calculada por REDCap a nivel individual.",
        },
        {
          outputField: "meanFactorVinculo",
          redcapColumn: "ibse_factor_vinculo",
          isComputed: true,
        },
        {
          outputField: "meanFactorSituacion",
          redcapColumn: "ibse_factor_situacion",
          isComputed: true,
        },
        {
          outputField: "meanFactorControl",
          redcapColumn: "ibse_factor_control",
          isComputed: true,
        },
        {
          outputField: "meanFactorPersona",
          redcapColumn: "ibse_factor_persona",
          isComputed: true,
        },
      ],
      notes:
        "REDCap calcula las puntuaciones de factor e índice a nivel individual antes de la exportación. " +
        "El parser lee esas columnas calculadas y agrega al nivel municipal.",
    },
    // sav: pendiente de contraste con EAS_dif_Adultos.sav
  },
};
