import type { MethodologicalModule } from "../MethodologicalModule";

// GHQ-12 — General Health Questionnaire, versión de 12 ítems.
//
// Estado: "draft"
// - Scoring bimodal (0/0/1/1): valores 0,1 → 0; valores 2,3 → 1 por ítem.
//   Score total bimodal 0–12. Cutpoint ≥ 3 = probable caso.
// - Sin equivalente en la EAS: instrumento de administración propia via REDCap.
// - Validado en España: Sánchez-López & Dresch (2008), Psicothema.

export const GHQ12_MODULE: MethodologicalModule = {
  identity: {
    id: "ghq12",
    version: "1.0.0",
    status: "draft",
    category: "validated-scale",
    name: "GHQ-12 — Cuestionario de Salud General (12 ítems)",
    shortName: "GHQ-12",
    description:
      "Versión abreviada de 12 ítems del Cuestionario de Salud General (General Health " +
      "Questionnaire) de Goldberg & Williams (1988). Instrumento de cribado para la " +
      "detección de malestar psicológico en la población general. Evalúa síntomas " +
      "psiquiátricos no psicóticos en las últimas semanas.",
    purpose:
      "Detectar probable malestar psicológico en la población adulta a nivel comunitario " +
      "mediante cribado breve. Identifica la prevalencia de posibles casos de malestar " +
      "mental en la muestra municipal para orientar el diagnóstico de salud.",
    targetPopulation: "Población adulta general (≥18 años)",
    createdAt: "2026-07-02",
  },

  source: {
    authors: "Goldberg, D.P.; Williams, P.",
    year: 1988,
    title: "A User's Guide to the General Health Questionnaire",
    source: "NFER-Nelson",
    institutionalBody: "Goldberg, D.P. (instrumento original)",
    notes:
      "Validación española: Sánchez-López MP, Dresch V (2008). The 12-Item General Health " +
      "Questionnaire (GHQ-12): Reliability, external validity and factor structure in the " +
      "Spanish population. Psicothema, 20(4), 839-843.",
  },

  items: [
    { id: "ghq12_q1", text: "¿Ha podido concentrarse bien en lo que hacía?",
      redcapFormField: { fieldName: "ghq12_q1", formName: "monitor_ghq12", fieldType: "radio",
        fieldLabel: "¿Ha podido concentrarse bien en lo que hacía?",
        choicesOrCalculations: "0, Mejor que lo habitual | 1, Igual que lo habitual | 2, Menos que lo habitual | 3, Mucho menos que lo habitual",
        required: true, questionNumber: "1" },
      dimensionId: "salud-mental", responseType: "likert",
      responseOptions: [{ value: 0, label: "Mejor que lo habitual" }, { value: 1, label: "Igual que lo habitual" }, { value: 2, label: "Menos que lo habitual" }, { value: 3, label: "Mucho menos que lo habitual" }] },
    { id: "ghq12_q2", text: "¿Sus preocupaciones le han hecho perder mucho sueño?",
      redcapFormField: { fieldName: "ghq12_q2", formName: "monitor_ghq12", fieldType: "radio",
        fieldLabel: "¿Sus preocupaciones le han hecho perder mucho sueño?",
        choicesOrCalculations: "0, No, en absoluto | 1, No más que lo habitual | 2, Bastante más que lo habitual | 3, Mucho más que lo habitual",
        required: true, questionNumber: "2" },
      dimensionId: "salud-mental", responseType: "likert",
      responseOptions: [{ value: 0, label: "No, en absoluto" }, { value: 1, label: "No más que lo habitual" }, { value: 2, label: "Bastante más que lo habitual" }, { value: 3, label: "Mucho más que lo habitual" }] },
    { id: "ghq12_q3", text: "¿Ha sentido que está jugando un papel útil en la vida?",
      redcapFormField: { fieldName: "ghq12_q3", formName: "monitor_ghq12", fieldType: "radio",
        fieldLabel: "¿Ha sentido que está jugando un papel útil en la vida?",
        choicesOrCalculations: "0, Más que lo habitual | 1, Igual que lo habitual | 2, Menos útil que lo habitual | 3, Mucho menos útil",
        required: true, questionNumber: "3" },
      dimensionId: "salud-mental", responseType: "likert",
      responseOptions: [{ value: 0, label: "Más que lo habitual" }, { value: 1, label: "Igual que lo habitual" }, { value: 2, label: "Menos útil que lo habitual" }, { value: 3, label: "Mucho menos útil" }] },
    { id: "ghq12_q4", text: "¿Se ha sentido capaz de tomar decisiones?",
      redcapFormField: { fieldName: "ghq12_q4", formName: "monitor_ghq12", fieldType: "radio",
        fieldLabel: "¿Se ha sentido capaz de tomar decisiones?",
        choicesOrCalculations: "0, Más que lo habitual | 1, Igual que lo habitual | 2, Menos que lo habitual | 3, Mucho menos que lo habitual",
        required: true, questionNumber: "4" },
      dimensionId: "salud-mental", responseType: "likert",
      responseOptions: [{ value: 0, label: "Más que lo habitual" }, { value: 1, label: "Igual que lo habitual" }, { value: 2, label: "Menos que lo habitual" }, { value: 3, label: "Mucho menos que lo habitual" }] },
    { id: "ghq12_q5", text: "¿Se ha notado constantemente agobiado y en tensión?",
      redcapFormField: { fieldName: "ghq12_q5", formName: "monitor_ghq12", fieldType: "radio",
        fieldLabel: "¿Se ha notado constantemente agobiado y en tensión?",
        choicesOrCalculations: "0, No, en absoluto | 1, No más que lo habitual | 2, Bastante más que lo habitual | 3, Mucho más que lo habitual",
        required: true, questionNumber: "5" },
      dimensionId: "salud-mental", responseType: "likert",
      responseOptions: [{ value: 0, label: "No, en absoluto" }, { value: 1, label: "No más que lo habitual" }, { value: 2, label: "Bastante más que lo habitual" }, { value: 3, label: "Mucho más que lo habitual" }] },
    { id: "ghq12_q6", text: "¿Ha tenido la sensación de que no puede superar sus dificultades?",
      redcapFormField: { fieldName: "ghq12_q6", formName: "monitor_ghq12", fieldType: "radio",
        fieldLabel: "¿Ha tenido la sensación de que no puede superar sus dificultades?",
        choicesOrCalculations: "0, No, en absoluto | 1, No más que lo habitual | 2, Bastante más que lo habitual | 3, Mucho más que lo habitual",
        required: true, questionNumber: "6" },
      dimensionId: "salud-mental", responseType: "likert",
      responseOptions: [{ value: 0, label: "No, en absoluto" }, { value: 1, label: "No más que lo habitual" }, { value: 2, label: "Bastante más que lo habitual" }, { value: 3, label: "Mucho más que lo habitual" }] },
    { id: "ghq12_q7", text: "¿Ha sido capaz de disfrutar de sus actividades normales de cada día?",
      redcapFormField: { fieldName: "ghq12_q7", formName: "monitor_ghq12", fieldType: "radio",
        fieldLabel: "¿Ha sido capaz de disfrutar de sus actividades normales de cada día?",
        choicesOrCalculations: "0, Más que lo habitual | 1, Igual que lo habitual | 2, Menos que lo habitual | 3, Mucho menos que lo habitual",
        required: true, questionNumber: "7" },
      dimensionId: "salud-mental", responseType: "likert",
      responseOptions: [{ value: 0, label: "Más que lo habitual" }, { value: 1, label: "Igual que lo habitual" }, { value: 2, label: "Menos que lo habitual" }, { value: 3, label: "Mucho menos que lo habitual" }] },
    { id: "ghq12_q8", text: "¿Ha sido capaz de hacer frente adecuadamente a sus problemas?",
      redcapFormField: { fieldName: "ghq12_q8", formName: "monitor_ghq12", fieldType: "radio",
        fieldLabel: "¿Ha sido capaz de hacer frente adecuadamente a sus problemas?",
        choicesOrCalculations: "0, Más capaz que lo habitual | 1, Igual que lo habitual | 2, Menos capaz que lo habitual | 3, Mucho menos capaz",
        required: true, questionNumber: "8" },
      dimensionId: "salud-mental", responseType: "likert",
      responseOptions: [{ value: 0, label: "Más capaz que lo habitual" }, { value: 1, label: "Igual que lo habitual" }, { value: 2, label: "Menos capaz que lo habitual" }, { value: 3, label: "Mucho menos capaz" }] },
    { id: "ghq12_q9", text: "¿Se ha sentido poco feliz y deprimido?",
      redcapFormField: { fieldName: "ghq12_q9", formName: "monitor_ghq12", fieldType: "radio",
        fieldLabel: "¿Se ha sentido poco feliz y deprimido?",
        choicesOrCalculations: "0, No, en absoluto | 1, No más que lo habitual | 2, Bastante más que lo habitual | 3, Mucho más que lo habitual",
        required: true, questionNumber: "9" },
      dimensionId: "salud-mental", responseType: "likert",
      responseOptions: [{ value: 0, label: "No, en absoluto" }, { value: 1, label: "No más que lo habitual" }, { value: 2, label: "Bastante más que lo habitual" }, { value: 3, label: "Mucho más que lo habitual" }] },
    { id: "ghq12_q10", text: "¿Ha perdido confianza en sí mismo?",
      redcapFormField: { fieldName: "ghq12_q10", formName: "monitor_ghq12", fieldType: "radio",
        fieldLabel: "¿Ha perdido confianza en sí mismo?",
        choicesOrCalculations: "0, No, en absoluto | 1, No más que lo habitual | 2, Bastante más que lo habitual | 3, Mucho más que lo habitual",
        required: true, questionNumber: "10" },
      dimensionId: "salud-mental", responseType: "likert",
      responseOptions: [{ value: 0, label: "No, en absoluto" }, { value: 1, label: "No más que lo habitual" }, { value: 2, label: "Bastante más que lo habitual" }, { value: 3, label: "Mucho más que lo habitual" }] },
    { id: "ghq12_q11", text: "¿Ha pensado que usted es una persona que no vale para nada?",
      redcapFormField: { fieldName: "ghq12_q11", formName: "monitor_ghq12", fieldType: "radio",
        fieldLabel: "¿Ha pensado que usted es una persona que no vale para nada?",
        choicesOrCalculations: "0, No, en absoluto | 1, No más que lo habitual | 2, Bastante más que lo habitual | 3, Mucho más que lo habitual",
        required: true, questionNumber: "11" },
      dimensionId: "salud-mental", responseType: "likert",
      responseOptions: [{ value: 0, label: "No, en absoluto" }, { value: 1, label: "No más que lo habitual" }, { value: 2, label: "Bastante más que lo habitual" }, { value: 3, label: "Mucho más que lo habitual" }] },
    { id: "ghq12_q12", text: "¿Se siente razonablemente feliz considerando todas las circunstancias?",
      redcapFormField: { fieldName: "ghq12_q12", formName: "monitor_ghq12", fieldType: "radio",
        fieldLabel: "¿Se siente razonablemente feliz considerando todas las circunstancias?",
        choicesOrCalculations: "0, Más que lo habitual | 1, Igual que lo habitual | 2, Menos que lo habitual | 3, Mucho menos que lo habitual",
        required: true, questionNumber: "12" },
      dimensionId: "salud-mental", responseType: "likert",
      responseOptions: [{ value: 0, label: "Más que lo habitual" }, { value: 1, label: "Igual que lo habitual" }, { value: 2, label: "Menos que lo habitual" }, { value: 3, label: "Mucho menos que lo habitual" }] },
  ],

  dimensions: [
    {
      id: "salud-mental",
      name: "Malestar psicológico general",
      description:
        "Dimensión única: malestar psicológico general evaluado mediante 12 ítems. " +
        "Scoring bimodal: 0,1 → 0; 2,3 → 1 por ítem. Score total 0–12. " +
        "Punto de corte ≥ 3 = probable caso de malestar psicológico.",
      itemIds: ["ghq12_q1","ghq12_q2","ghq12_q3","ghq12_q4","ghq12_q5","ghq12_q6",
                "ghq12_q7","ghq12_q8","ghq12_q9","ghq12_q10","ghq12_q11","ghq12_q12"],
      outputField: "bimodal",
      isComposite: false,
    },
  ],

  algorithm: {
    type: "item-sum",
    inputLevel: "individual-responses",
    steps: [
      {
        order: 1,
        description:
          "Administrar los 12 ítems. Respuestas válidas: valores enteros 0–3 para todos los ítems.",
      },
      {
        order: 2,
        description:
          "Excluir registros con algún ítem ausente o con valor fuera del rango 0–3.",
      },
      {
        order: 3,
        description:
          "Aplicar scoring bimodal por ítem: valor 0 o 1 → 0; valor 2 o 3 → 1. " +
          "Score bimodal total = suma de los 12 ítems binorizados. Rango 0–12.",
      },
      {
        order: 4,
        description:
          "Aplicar el punto de corte: score bimodal ≥ 3 = probable caso de malestar psicológico. " +
          "Sánchez-López & Dresch (2008) validaron este punto de corte en población española.",
      },
      {
        order: 5,
        description:
          "Agregar al nivel municipal: media bimodal, prevalencia de probables casos (≥3), " +
          "y distribución por rangos (0–2 / 3–6 / 7–12).",
      },
    ],
    aggregationLevel: "municipal",
    completionCriteria:
      "Registro completo: respuesta válida (0–3) en los 12 ítems.",
    notes:
      "El scoring bimodal (0/0/1/1) es el más recomendado para estudios de prevalencia " +
      "con el GHQ-12. El scoring Likert (0/1/2/3) también existe pero no se implementa " +
      "en esta versión por ser menos habitual en estudios de salud pública española.",
  },

  interpretation: {
    scale: {
      min: 0,
      max: 12,
      direction: "lower-is-better",
    },
    thresholds: [
      {
        min: 0,
        max: 2,
        label: "Sin indicadores de malestar",
        description: "Score bimodal 0–2: sin señales de malestar psicológico significativo.",
      },
      {
        min: 3,
        max: 6,
        label: "Probable caso leve-moderado",
        description: "Score bimodal 3–6: probable malestar psicológico. Requiere atención.",
      },
      {
        min: 7,
        max: 12,
        label: "Probable caso moderado-grave",
        description: "Score bimodal 7–12: indicadores marcados de malestar psicológico.",
      },
    ],
    contextualNotes: [
      "Punto de corte ≥ 3 validado para población española (Sánchez-López & Dresch, 2008).",
      "El GHQ-12 es un instrumento de cribado, no diagnóstico: un positivo no implica " +
      "trastorno mental confirmado.",
      "El GHQ-12 evalúa el estado actual (últimas semanas), no rasgos estables.",
      "Muestras con menos de 30 registros válidos presentan alta incertidumbre.",
    ],
  },

  limitations: [
    "El GHQ-12 es un instrumento de cribado, no diagnóstico. Un score positivo no " +
    "implica diagnóstico de trastorno mental.",
    "Evalúa el estado de las últimas semanas, no el estado crónico ni los rasgos de personalidad.",
    "El scoring bimodal puede infraestimar el malestar en comparación con el scoring Likert.",
    "Sin referencia provincial ni autonómica disponible para comparación territorial directa.",
    "No mide dominios específicos como ansiedad o depresión por separado.",
    "Puede estar afectado por sesgos de deseabilidad social en contextos grupales.",
  ],

  bibliography: [
    {
      authors: "Goldberg, D.P.; Williams, P.",
      year: 1988,
      title: "A User's Guide to the General Health Questionnaire",
      source: "NFER-Nelson",
    },
    {
      authors: "Sánchez-López, M.P.; Dresch, V.",
      year: 2008,
      title: "The 12-Item General Health Questionnaire (GHQ-12): Reliability, external validity " +
        "and factor structure in the Spanish population",
      source: "Psicothema",
      notes: "Vol. 20, nº 4, pp. 839-843. Validación española del GHQ-12.",
    },
  ],

  adapters: {
    redcap: {
      instrument: "monitor_ghq12",
      completedColumn: "monitor_ghq12_complete",
      completedValue: "2",
      columns: [
        { outputField: "q1", redcapColumn: "ghq12_q1", isComputed: false, notes: "Ítem 1 (0–3)." },
        { outputField: "q2", redcapColumn: "ghq12_q2", isComputed: false, notes: "Ítem 2 (0–3)." },
        { outputField: "q3", redcapColumn: "ghq12_q3", isComputed: false, notes: "Ítem 3 (0–3)." },
        { outputField: "q4", redcapColumn: "ghq12_q4", isComputed: false, notes: "Ítem 4 (0–3)." },
        { outputField: "q5", redcapColumn: "ghq12_q5", isComputed: false, notes: "Ítem 5 (0–3)." },
        { outputField: "q6", redcapColumn: "ghq12_q6", isComputed: false, notes: "Ítem 6 (0–3)." },
        { outputField: "q7", redcapColumn: "ghq12_q7", isComputed: false, notes: "Ítem 7 (0–3)." },
        { outputField: "q8", redcapColumn: "ghq12_q8", isComputed: false, notes: "Ítem 8 (0–3)." },
        { outputField: "q9", redcapColumn: "ghq12_q9", isComputed: false, notes: "Ítem 9 (0–3)." },
        { outputField: "q10", redcapColumn: "ghq12_q10", isComputed: false, notes: "Ítem 10 (0–3)." },
        { outputField: "q11", redcapColumn: "ghq12_q11", isComputed: false, notes: "Ítem 11 (0–3)." },
        { outputField: "q12", redcapColumn: "ghq12_q12", isComputed: false, notes: "Ítem 12 (0–3)." },
      ],
    },
  },

  institutionalNote: {
    diagnosticInterpretation:
      "El GHQ-12 proporciona una estimación de la prevalencia de probable malestar " +
      "psicológico en la población adulta del municipio. Un porcentaje de positivos " +
      "superior al 20–25 % señala una carga de malestar mental que merece atención en " +
      "el diagnóstico de salud municipal. Es un instrumento de cribado: los resultados " +
      "orientan prioridades pero no sustituyen la evaluación clínica individual.",

    implications: [
      "Analizar la prevalencia de probables casos (score ≥3) como indicador de necesidad " +
      "de atención en salud mental a nivel comunitario.",
      "Cruce con indicadores de contexto social (desempleo, aislamiento, nivel socioeconómico) " +
      "para identificar grupos de mayor vulnerabilidad.",
      "Comparar con el SF-12 MCS si está disponible: ambos miden salud mental percibida " +
      "con enfoques complementarios.",
      "Valorar la pertinencia de programas de promoción de salud mental comunitaria " +
      "cuando la prevalencia de probables casos supere el 20 % de la muestra.",
    ],

    publicHealthApplication: {
      measures: [
        "Prevalencia de probable malestar psicológico (score GHQ-12 bimodal ≥3).",
        "Distribución del score por rangos (0–2 / 3–6 / 7–12).",
        "Score medio GHQ-12 bimodal de la muestra.",
      ],
      doesNotMeasure: [
        "Diagnóstico de trastorno mental específico (depresión, ansiedad, etc.).",
        "Estado crónico o rasgos de personalidad.",
        "Factores etiológicos ni causalidad del malestar.",
        "Malestar en menores de 18 años (validación en adultos).",
      ],
      contextualUse: [
        "Instrumento de cribado poblacional: adecuado para encuesta municipal de salud.",
        "Permite estimaciones comparables entre encuestas que usen el mismo scoring y punto de corte.",
        "Útil para monitorizar tendencias de malestar psicológico en el tiempo.",
      ],
      commonMisinterpretations: [
        "Un score positivo (≥3) no es un diagnóstico de trastorno mental.",
        "El GHQ-12 no distingue entre ansiedad y depresión: son dimensiones distintas.",
        "Score 0 no implica bienestar psicológico óptimo: solo ausencia de señales de malestar reciente.",
      ],
    },

    pslIntegration: {
      chapter: "Salud Mental y Bienestar",
      determinants: [
        "Salud mental y malestar psicológico",
        "Determinantes sociales de la salud",
      ],
      contribution:
        "El GHQ-12 aporta al Perfil de Salud Local una medida de la prevalencia de probable " +
        "malestar psicológico en la población adulta del municipio. Complementa el SF-12 MCS " +
        "(salud mental percibida) con una medida específica de síntomas de malestar reciente. " +
        "Alimenta el capítulo de Salud Mental y Bienestar del diagnóstico territorial.",
    },

    relatedInstrumentIds: ["sf12-eas", "phq9", "psqi"],
  },
};
