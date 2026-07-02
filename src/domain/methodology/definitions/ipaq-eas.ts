import type { MethodologicalModule } from "../MethodologicalModule";

// Definición canónica del bloque IPAQ-EAS (IPAQ adaptación EAS).
//
// Estado: "draft"
// - IPAQ_DICO y P34A_R son campos derivados pre-calculados por la Encuesta
//   Andaluza de Salud. COMPÁS NG los consume directamente: no reconstituye
//   el IPAQ desde los ítems originales del cuestionario.
// - items: [] — los ítems IPAQ no están disponibles como variables individuales
//   en los microdatos EAS que COMPÁS NG procesa. Solo disponibles los derivados.
// - Categoría: "eas-official-block" porque los campos son derivados de la EAS.
// - Missing en IPAQ_DICO (~48 %): puede incluir personas sin actividad evaluable
//   o con datos de calidad insuficiente. No necesariamente missing aleatorio.
// - Estado "draft" hasta contraste con documentación oficial EAS.
//
// Referencia de implementación: IPAQCSVParser.ts.

export const IPAQ_EAS_MODULE: MethodologicalModule = {
  identity: {
    id: "ipaq-eas",
    version: "1.0.0",
    status: "draft",
    category: "eas-official-block",
    name: "Actividad Física IPAQ-EAS",
    shortName: "IPAQ-EAS",
    description:
      "Bloque de la Encuesta Andaluza de Salud (EAS) basado en el Cuestionario " +
      "Internacional de Actividad Física (IPAQ) para la evaluación del nivel de " +
      "actividad física en la población adulta. " +
      "La EAS proporciona dos campos derivados: IPAQ_DICO (alta actividad: sí/no) " +
      "y P34A_R (inactividad en tiempo libre: sí/no).",
    purpose:
      "Estimar la prevalencia de alta actividad física (IPAQ_DICO) y de " +
      "inactividad en tiempo libre (P34A_R) en la población adulta del municipio. " +
      "Ambos indicadores son campos derivados de la EAS: COMPÁS NG los consume " +
      "directamente sin reconstruir los MET-min/semana desde ítems individuales.",
    targetPopulation: "Población adulta (≥16 años), según protocolo EAS",
    createdAt: "2026-07-02",
  },

  source: {
    authors: "Craig, C.L.; Marshall, A.L.; Sjöström, M. et al.",
    year: 2003,
    title:
      "International Physical Activity Questionnaire: 12-Country Reliability and Validity",
    source: "Medicine & Science in Sports & Exercise",
    doi: "10.1249/01.MSS.0000078924.61453.FB",
    institutionalBody: "Consejería de Salud y Familias, Junta de Andalucía (adaptación EAS)",
    notes:
      "El instrumento original IPAQ (Craig et al. 2003) tiene múltiples ítems. " +
      "La EAS calcula los campos derivados IPAQ_DICO (dicotómico) y los ítems de " +
      "actividad en tiempo libre (P34A, P34A_R) sin exponer los METs individuales " +
      "en los microdatos distribuidos. " +
      "COMPÁS NG implementa el bloque EAS, no el cuestionario IPAQ completo.",
  },

  items: [],

  dimensions: [
    {
      id: "actividad-alta",
      name: "Alta actividad física (IPAQ_DICO)",
      description:
        "Indicador binario de alta actividad física. " +
        "IPAQ_DICO = 0: nivel de actividad no-alto (bajo o moderado). " +
        "IPAQ_DICO = 1: alta actividad (≥600 MET-min/sem o ≥150 min/sem de actividad vigorosa). " +
        "Missing (~48 %): registros sin evaluación o con datos insuficientes.",
      itemIds: [],
      outputField: "actividad-alta",
    },
    {
      id: "inactividad-ocio",
      name: "Inactividad en tiempo libre (P34A_R)",
      description:
        "Indicador binario de inactividad en tiempo libre. " +
        "P34A_R = 0: activo en tiempo libre (realiza alguna actividad física en el ocio). " +
        "P34A_R = 1: inactivo en tiempo libre (no realiza actividad física en el ocio). " +
        "Missing (n=6 en Granada): registros sin dato.",
      itemIds: [],
      outputField: "inactividad-ocio",
    },
  ],

  algorithm: {
    type: "distribution",
    inputLevel: "pre-aggregated",
    steps: [
      {
        order: 1,
        description:
          "COMPÁS NG lee IPAQ_DICO y P34A_R del fichero EAS exportado. " +
          "Valores válidos para IPAQ_DICO: 0 (no-alto) o 1 (alto). " +
          "Valores válidos para P34A_R: 0 (activo) o 1 (inactivo en ocio). " +
          "Valores vacíos o no reconocidos se tratan como missing.",
      },
      {
        order: 2,
        description:
          "Se calcula la prevalencia de alta actividad: porcentaje de IPAQ_DICO = 1 " +
          "sobre el total de registros con IPAQ_DICO válido.",
      },
      {
        order: 3,
        description:
          "Se calcula la prevalencia de inactividad en tiempo libre: " +
          "porcentaje de P34A_R = 1 sobre el total de registros con P34A_R válido.",
      },
    ],
    aggregationLevel: "municipal",
    completionCriteria:
      "Registro válido para IPAQ_DICO: valor 0 o 1. " +
      "Registro válido para P34A_R: valor 0 o 1. " +
      "Los valores vacíos se tratan como missing y se excluyen del denominador.",
    notes:
      "El missing en IPAQ_DICO (~48 % en Granada) es sustancial y puede reflejar " +
      "personas mayores no evaluadas o con datos de actividad insuficientes. " +
      "P34A_R tiene missing mínimo (n=6 en Granada).",
  },

  interpretation: {
    scale: {
      min: 0,
      max: 100,
      direction: "higher-is-better",
    },
    thresholds: [
      {
        min: 0,
        max: 0,
        label: "Nivel no-alto",
        description:
          "IPAQ_DICO = 0. Actividad física de nivel bajo o moderado, " +
          "sin alcanzar el umbral de alta actividad (≥600 MET-min/sem).",
      },
      {
        min: 1,
        max: 1,
        label: "Alta actividad",
        description:
          "IPAQ_DICO = 1. Alta actividad física (≥600 MET-min/sem o " +
          "≥150 min/sem de actividad vigorosa según los criterios IPAQ).",
      },
    ],
    contextualNotes: [
      "El missing en IPAQ_DICO (~48 % en EAS Granada) es sustancial: " +
      "puede incluir personas mayores u otros grupos no evaluados.",
      "P34A_R complementa IPAQ_DICO midiendo específicamente la inactividad " +
      "en el tiempo libre, independientemente de la actividad laboral o doméstica.",
      "IPAQ_DICO = 0 incluye tanto actividad baja como moderada: " +
      "no equivale a sedentarismo total.",
      "Para sedentarismo específico, el SBQ (Sedentary Behavior Questionnaire) " +
      "es el instrumento de referencia.",
    ],
  },

  limitations: [
    "COMPÁS NG consume los campos derivados IPAQ_DICO y P34A_R: no tiene acceso " +
    "a los ítems originales del IPAQ ni a los MET-min/semana individuales.",
    "El missing sustancial en IPAQ_DICO (~48 % en Granada) limita la " +
    "representatividad de la estimación de alta actividad.",
    "IPAQ_DICO no distingue entre actividad baja y moderada: ambos niveles " +
    "quedan agrupados en la categoría 'no-alto' (valor 0).",
    "P34A_R solo evalúa la actividad en tiempo libre, no la actividad física " +
    "laboral ni doméstica.",
    "No permite análisis por subgrupos sin acceso a los registros individuales.",
    "Contraste con documentación oficial EAS sobre la codificación pendiente.",
  ],

  bibliography: [
    {
      authors: "Craig, C.L.; Marshall, A.L.; Sjöström, M. et al.",
      year: 2003,
      title:
        "International Physical Activity Questionnaire: 12-Country Reliability and Validity",
      source: "Medicine & Science in Sports & Exercise",
      doi: "10.1249/01.MSS.0000078924.61453.FB",
      notes:
        "Instrumento original. Los ítems IPAQ no son procesados directamente " +
        "por COMPÁS NG: la EAS proporciona los campos derivados IPAQ_DICO y P34A_R.",
    },
  ],

  adapters: {
    sav: {
      referenceFile: "EAS_microdatos_adulto_READY.csv",
      variables: [
        {
          outputField: "actividad-alta",
          savVariable: "IPAQ_DICO",
          label: "Indicador dicotómico de alta actividad física (IPAQ_DICO)",
          valueLabels: [
            { value: 0, label: "Nivel no-alto (bajo o moderado)" },
            { value: 1, label: "Alta actividad (≥600 MET-min/sem)" },
          ],
          missingValues: [],
          measurementLevel: "nominal",
          waveCompatibility: {
            notes: "Missing ~48 % en EAS Granada (personas no evaluadas o datos insuficientes).",
          },
        },
        {
          outputField: "inactividad-ocio",
          savVariable: "P34A_R",
          label: "Inactividad en tiempo libre (P34A_R)",
          valueLabels: [
            { value: 0, label: "Activo en tiempo libre" },
            { value: 1, label: "Inactivo en tiempo libre" },
          ],
          missingValues: [],
          measurementLevel: "nominal",
        },
      ],
    },
  },

  institutionalNote: {
    diagnosticInterpretation:
      "El IPAQ-EAS proporciona dos indicadores complementarios de actividad física " +
      "en la población adulta de Granada. IPAQ_DICO identifica la proporción de " +
      "personas con alta actividad física (≥600 MET-min/sem): en la EAS de Granada, " +
      "solo el 15.7 % de los evaluados alcanza este nivel. P34A_R identifica " +
      "la inactividad específica en el tiempo libre: el 34.2 % de los adultos " +
      "declaró no realizar ninguna actividad física en su tiempo libre. " +
      "El missing sustancial en IPAQ_DICO (~48 %) limita la extrapolación poblacional.",

    implications: [
      "La baja prevalencia de alta actividad física (15.7 %) indica que la " +
      "mayoría de la población adulta no alcanza umbrales de actividad intensa.",
      "La inactividad en tiempo libre (34.2 %) es el indicador más accionable " +
      "para intervenciones de promoción de la salud, ya que identifica a personas " +
      "sin hábito de actividad física en el ocio.",
      "Cruce con SF-12 PCS e IBSE: la inactividad física correlaciona con peor " +
      "salud física percibida y peor bienestar socioemocional en la literatura.",
      "Valorar intervenciones de actividad física comunitaria (espacios verdes, " +
      "programas municipales de deporte) dirigidas a reducir la inactividad en ocio.",
      "El missing en IPAQ_DICO debe declararse en toda comunicación de resultados.",
    ],

    publicHealthApplication: {
      measures: [
        "Prevalencia de alta actividad física (IPAQ_DICO = 1) entre los evaluados.",
        "Prevalencia de inactividad en tiempo libre (P34A_R = 1) en la muestra adulta.",
      ],
      doesNotMeasure: [
        "Nivel de actividad física moderada: incluida en IPAQ_DICO = 0 junto a la baja.",
        "Actividad física laboral ni doméstica (solo tiempo libre en P34A_R).",
        "Tiempo sedentario total (instrumento SBQ).",
        "Intensidad específica de la actividad ni tipo de ejercicio practicado.",
      ],
      contextualUse: [
        "Indicador de nivel de actividad física para el diagnóstico de salud municipal.",
        "P34A_R es más completo que IPAQ_DICO para intervenciones de ocio activo " +
        "porque tiene menor missing y mayor cobertura poblacional.",
        "Los resultados son comparables entre encuestas EAS que usen la misma codificación.",
      ],
      commonMisinterpretations: [
        "IPAQ_DICO = 0 no equivale a sedentarismo: incluye actividad física moderada.",
        "El alto missing de IPAQ_DICO (~48 %) no debe ignorarse: afecta a la " +
        "representatividad de la estimación de alta actividad.",
        "P34A_R = 0 (activo en ocio) no significa que la persona alcance el umbral " +
        "de actividad recomendado: puede ser actividad de baja intensidad.",
      ],
    },

    pslIntegration: {
      chapter: "Determinantes de Salud",
      determinants: [
        "Actividad física y sedentarismo",
        "Estilos de vida",
      ],
      contribution:
        "El IPAQ-EAS aporta dos indicadores de actividad física de la población adulta: " +
        "la prevalencia de alta actividad (IPAQ_DICO) y la inactividad en tiempo libre " +
        "(P34A_R). Ambos alimentan el análisis de estilos de vida del Perfil de Salud " +
        "Local, complementando el PREDIMED-EAS (adherencia mediterránea) y el CAGE-EAS " +
        "(consumo de alcohol) en el capítulo de Determinantes de Salud.",
    },

    relatedInstrumentIds: ["predimed-eas", "sf12-eas", "cage-eas"],
  },
};
