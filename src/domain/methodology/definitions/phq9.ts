import type { MethodologicalModule } from "../MethodologicalModule";

export const PHQ9_MODULE: MethodologicalModule = {
  identity: {
    id: "phq9",
    version: "1.0.0",
    status: "draft",
    category: "validated-scale",
    name: "PHQ-9 — Cuestionario sobre la Salud del Paciente (9 ítems)",
    shortName: "PHQ-9",
    description:
      "Cuestionario de 9 ítems para el cribado y la monitorización de la depresión " +
      "en atención primaria y población general. Evalúa los 9 criterios del DSM para " +
      "el trastorno depresivo mayor durante las últimas dos semanas.",
    purpose:
      "Detectar síntomas de depresión y estimar su severidad en la población adulta " +
      "a nivel comunitario. Proporciona una distribución de la gravedad de los síntomas " +
      "depresivos para orientar el diagnóstico de salud municipal.",
    targetPopulation: "Población adulta general (≥18 años)",
    createdAt: "2026-07-02",
  },
  source: {
    authors: "Kroenke, K.; Spitzer, R.L.; Williams, J.B.W.",
    year: 2001,
    title: "The PHQ-9: Validity of a Brief Depression Severity Measure",
    source: "Journal of General Internal Medicine",
    doi: "10.1046/j.1525-1497.2001.016009606.x",
    institutionalBody: "Validado en España: Diez-Quevedo et al. (2001), Actas Esp Psiquiatr.",
    notes: "Validación española: Diez-Quevedo C, Rangil T, Sanchez-Planell L, Kroenke K, Spitzer RL. " +
      "Validation and utility of the patient health questionnaire in diagnosing major depression " +
      "in Spanish inpatients. Psychosom Med 2001;63:679-86.",
  },
  items: Array.from({ length: 9 }, (_, i) => ({
    id: `phq9_q${i + 1}`,
    text: [
      "¿Con qué frecuencia le han molestado los siguientes problemas? Poco interés o placer en hacer cosas",
      "Sentirse desanimado, deprimido, o sin esperanzas",
      "Con problemas para dormir o para mantenerse dormido, o dormir demasiado",
      "Sentirse cansado o con poca energía",
      "Poco apetito o comer en exceso",
      "Sentirse mal consigo mismo — o sentir que es un fracasado o que ha fallado a sí mismo o a su familia",
      "Problemas para concentrarse en cosas como leer el periódico o ver la televisión",
      "Moverse o hablar tan lento que otras personas lo notaron, o lo contrario — estar tan inquieto que se movió mucho más de lo habitual",
      "Pensamientos de que estaría mejor muerto o de hacerse daño de alguna manera",
    ][i],
    redcapFormField: {
      fieldName: `phq9_q${i + 1}`,
      formName: "monitor_phq9",
      fieldType: "radio",
      fieldLabel: `PHQ-9 ítem ${i + 1}`,
      choicesOrCalculations: "0, Nunca | 1, Varios días | 2, Más de la mitad de los días | 3, Casi todos los días",
      required: true,
      questionNumber: `${i + 1}`,
    },
    dimensionId: "depresion",
    responseType: "likert" as const,
    responseOptions: [
      { value: 0, label: "Nunca" },
      { value: 1, label: "Varios días" },
      { value: 2, label: "Más de la mitad de los días" },
      { value: 3, label: "Casi todos los días" },
    ],
  })),
  dimensions: [
    {
      id: "depresion",
      name: "Síntomas depresivos",
      description:
        "Suma de los 9 ítems (0–3 cada uno). Score total 0–27. " +
        "Punto de corte ≥10 para cribado de depresión moderada o superior.",
      itemIds: Array.from({ length: 9 }, (_, i) => `phq9_q${i + 1}`),
      outputField: "total",
      isComposite: false,
    },
  ],
  algorithm: {
    type: "item-sum",
    inputLevel: "individual-responses",
    steps: [
      { order: 1, description: "Administrar los 9 ítems. Respuestas válidas: 0–3 en cada ítem." },
      { order: 2, description: "Excluir registros con algún ítem ausente o fuera del rango 0–3." },
      { order: 3, description: "Calcular el score total: suma de los 9 ítems (rango 0–27)." },
      { order: 4, description: "Clasificar por gravedad: 0–4 mínimo, 5–9 leve, 10–14 moderado, 15–19 moderadamente grave, ≥20 grave." },
      { order: 5, description: "Punto de corte ≥10 para cribado de depresión (moderada o superior)." },
    ],
    aggregationLevel: "municipal",
    completionCriteria: "Registro completo: respuesta válida (0–3) en los 9 ítems.",
    notes: "El ítem 9 (ideación suicida) requiere protocolo de manejo específico cuando se detectan respuestas positivas.",
  },
  interpretation: {
    scale: { min: 0, max: 27, direction: "lower-is-better" },
    thresholds: [
      { min: 0, max: 4, label: "Mínimo", description: "Sin síntomas depresivos relevantes." },
      { min: 5, max: 9, label: "Leve", description: "Síntomas depresivos leves." },
      { min: 10, max: 14, label: "Moderado", description: "Síntomas depresivos moderados. Evaluar necesidad de atención." },
      { min: 15, max: 19, label: "Moderadamente grave", description: "Síntomas depresivos moderadamente graves." },
      { min: 20, max: 27, label: "Grave", description: "Síntomas depresivos graves. Requiere atención inmediata." },
    ],
    contextualNotes: [
      "Punto de corte ≥10 para cribado de depresión moderada o superior.",
      "El ítem 9 (ideación suicida) requiere protocolo específico de manejo.",
      "El PHQ-9 es un instrumento de cribado, no diagnóstico.",
    ],
  },
  limitations: [
    "El PHQ-9 es un instrumento de cribado, no diagnóstico.",
    "El ítem 9 (ideación suicida) requiere protocolo específico en contexto de encuesta.",
    "Mide los síntomas de las últimas 2 semanas: no refleja estados crónicos.",
    "Sin referencia provincial disponible para comparación territorial directa.",
  ],
  bibliography: [
    {
      authors: "Kroenke, K.; Spitzer, R.L.; Williams, J.B.W.",
      year: 2001,
      title: "The PHQ-9: Validity of a Brief Depression Severity Measure",
      source: "Journal of General Internal Medicine",
      doi: "10.1046/j.1525-1497.2001.016009606.x",
    },
    {
      authors: "Diez-Quevedo, C.; Rangil, T.; Sanchez-Planell, L.; Kroenke, K.; Spitzer, R.L.",
      year: 2001,
      title: "Validation and utility of the patient health questionnaire in diagnosing major depression in Spanish inpatients",
      source: "Psychosomatic Medicine",
      notes: "Validación española del PHQ-9.",
    },
  ],
  adapters: {
    redcap: {
      instrument: "monitor_phq9",
      completedColumn: "monitor_phq9_complete",
      completedValue: "2",
      columns: Array.from({ length: 9 }, (_, i) => ({
        outputField: `q${i + 1}`,
        redcapColumn: `phq9_q${i + 1}`,
        isComputed: false,
        notes: `Ítem ${i + 1} PHQ-9 (0–3).`,
      })),
    },
  },
  institutionalNote: {
    diagnosticInterpretation:
      "El PHQ-9 proporciona una estimación de la prevalencia de síntomas depresivos en la " +
      "población adulta del municipio. Un porcentaje de positivos (score ≥10) superior al " +
      "10–15 % señala una carga de síntomas depresivos que merece atención en el diagnóstico. " +
      "IMPORTANTE: El ítem 9 (ideación suicida) requiere un protocolo de gestión específico " +
      "en cualquier encuesta de salud pública.",
    implications: [
      "Analizar la distribución por niveles de gravedad (0–4 / 5–9 / 10–14 / 15–19 / ≥20).",
      "Cruce con GHQ-12 y SF-12 MCS si disponibles para triangular la estimación de malestar mental.",
      "Valorar recursos de salud mental disponibles en el municipio cuando la prevalencia de ≥10 supere el 15 %.",
      "El ítem 9 requiere protocolo de derivación específico: no administrar sin protocolo de seguimiento.",
    ],
    publicHealthApplication: {
      measures: [
        "Prevalencia de síntomas depresivos moderados o superiores (PHQ-9 ≥10).",
        "Distribución del score por rangos de gravedad.",
        "Score medio PHQ-9 de la muestra.",
      ],
      doesNotMeasure: [
        "Diagnóstico de trastorno depresivo mayor: el PHQ-9 es un cribado.",
        "Síntomas de las últimas dos semanas: no refleja estado crónico.",
        "Causas ni contexto del malestar depresivo.",
      ],
      contextualUse: [
        "Instrumento de cribado poblacional con validez en contexto comunitario español.",
        "Complementa al GHQ-12 con una medida específica de depresión.",
      ],
      commonMisinterpretations: [
        "Un score positivo (≥10) no es un diagnóstico de depresión.",
        "El ítem 9 (ideación suicida) no puede administrarse sin protocolo de manejo.",
        "Score 0 no implica bienestar total: solo ausencia de síntomas en las últimas 2 semanas.",
      ],
    },
    pslIntegration: {
      chapter: "Salud Mental y Bienestar",
      determinants: ["Salud mental", "Síntomas depresivos"],
      contribution:
        "El PHQ-9 aporta una medida específica de la prevalencia y gravedad de síntomas " +
        "depresivos en la población adulta, complementando el GHQ-12 (malestar general) " +
        "y el SF-12 MCS (salud mental percibida).",
    },
    relatedInstrumentIds: ["ghq12", "sf12-eas", "psqi"],
  },
};
