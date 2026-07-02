import type { MethodologicalModule } from "../MethodologicalModule";

export const FAGERSTROM_MODULE: MethodologicalModule = {
  identity: {
    id: "fagerstrom",
    version: "1.0.0",
    status: "draft",
    category: "validated-scale",
    name: "Test de Fagerström de Dependencia a la Nicotina (FTND)",
    shortName: "Fagerström",
    description:
      "Cuestionario de 6 ítems para evaluar la dependencia física a la nicotina en " +
      "fumadores activos. Proporciona un score 0–10 con 5 niveles de dependencia. " +
      "Solo se administra a fumadores activos.",
    purpose:
      "Evaluar el grado de dependencia a la nicotina en fumadores activos del municipio " +
      "para orientar la intervención en deshabituación tabáquica. Un score ≥5 indica " +
      "dependencia moderada o superior.",
    targetPopulation: "Fumadores activos adultos (≥18 años)",
    createdAt: "2026-07-02",
  },
  source: {
    authors: "Heatherton, T.F.; Kozlowski, L.T.; Frecker, R.C.; Fagerström, K.O.",
    year: 1991,
    title: "The Fagerström Test for Nicotine Dependence: A Revision of the Fagerström Tolerance Questionnaire",
    source: "British Journal of Addiction",
    doi: "10.1111/j.1360-0443.1991.tb01879.x",
    institutionalBody: "Validado en España: Becoña E, Vázquez FL (1998). Rev Esp Drogodependencias.",
    notes: "Revisión del cuestionario de tolerancia de Fagerström (1978). La versión de 6 ítems " +
      "es el instrumento de referencia para dependencia a la nicotina.",
  },
  items: [
    { id: "ftnd_q1", text: "¿Cuánto tiempo pasa entre que se levanta y se fuma su primer cigarrillo?",
      redcapFormField: { fieldName: "ftnd_q1", formName: "monitor_fagerstrom", fieldType: "radio",
        fieldLabel: "Tiempo hasta el primer cigarrillo",
        choicesOrCalculations: "0, Más de 60 minutos | 1, De 31 a 60 minutos | 2, De 6 a 30 minutos | 3, 5 minutos o menos | 4, Al instante (mientras aún se despierta)",
        required: true, questionNumber: "1" },
      dimensionId: "dependencia", responseType: "likert" as const,
      responseOptions: [{ value: 0, label: "Más de 60 minutos" }, { value: 1, label: "De 31 a 60 minutos" }, { value: 2, label: "De 6 a 30 minutos" }, { value: 3, label: "5 minutos o menos" }, { value: 4, label: "Al instante" }] },
    { id: "ftnd_q2", text: "¿Le resulta difícil no fumar en lugares donde está prohibido?",
      redcapFormField: { fieldName: "ftnd_q2", formName: "monitor_fagerstrom", fieldType: "radio",
        fieldLabel: "Dificultad para no fumar donde está prohibido",
        choicesOrCalculations: "0, No | 1, Sí", required: true, questionNumber: "2" },
      dimensionId: "dependencia", responseType: "likert" as const,
      responseOptions: [{ value: 0, label: "No" }, { value: 1, label: "Sí" }] },
    { id: "ftnd_q3", text: "¿A qué cigarrillo le costaría más renunciar?",
      redcapFormField: { fieldName: "ftnd_q3", formName: "monitor_fagerstrom", fieldType: "radio",
        fieldLabel: "Cigarrillo al que costaría más renunciar",
        choicesOrCalculations: "0, A cualquier otro | 1, Al primero de la mañana", required: true, questionNumber: "3" },
      dimensionId: "dependencia", responseType: "likert" as const,
      responseOptions: [{ value: 0, label: "A cualquier otro" }, { value: 1, label: "Al primero de la mañana" }] },
    { id: "ftnd_q4", text: "¿Cuántos cigarrillos fuma al día?",
      redcapFormField: { fieldName: "ftnd_q4", formName: "monitor_fagerstrom", fieldType: "radio",
        fieldLabel: "Número de cigarrillos al día",
        choicesOrCalculations: "0, 10 o menos | 1, 11-20 | 2, 21-30 | 3, 31 o más", required: true, questionNumber: "4" },
      dimensionId: "dependencia", responseType: "likert" as const,
      responseOptions: [{ value: 0, label: "10 o menos" }, { value: 1, label: "11–20" }, { value: 2, label: "21–30" }, { value: 3, label: "31 o más" }] },
    { id: "ftnd_q5", text: "¿Fuma con más frecuencia durante las primeras horas tras levantarse?",
      redcapFormField: { fieldName: "ftnd_q5", formName: "monitor_fagerstrom", fieldType: "radio",
        fieldLabel: "Mayor frecuencia de consumo por la mañana",
        choicesOrCalculations: "0, No | 1, Sí", required: true, questionNumber: "5" },
      dimensionId: "dependencia", responseType: "likert" as const,
      responseOptions: [{ value: 0, label: "No" }, { value: 1, label: "Sí" }] },
    { id: "ftnd_q6", text: "¿Fuma aunque esté tan enfermo que tenga que guardar cama la mayor parte del día?",
      redcapFormField: { fieldName: "ftnd_q6", formName: "monitor_fagerstrom", fieldType: "radio",
        fieldLabel: "Fumar incluso estando enfermo en cama",
        choicesOrCalculations: "0, No | 1, Sí", required: true, questionNumber: "6" },
      dimensionId: "dependencia", responseType: "likert" as const,
      responseOptions: [{ value: 0, label: "No" }, { value: 1, label: "Sí" }] },
  ],
  dimensions: [
    {
      id: "dependencia",
      name: "Dependencia a la nicotina (FTND total)",
      description:
        "Suma de los 6 ítems: Q1 (0–4), Q2 (0–1), Q3 (0–1), Q4 (0–1), Q5 (0–1), Q6 (0–1). " +
        "Score total 0–10. Punto de corte ≥5 para dependencia moderada o superior. " +
        "NOTA: En el instrumento original Q4 tiene opciones 0, 1, 2, 3; en la versión simplificada solo 0 o 1.",
      itemIds: ["ftnd_q1","ftnd_q2","ftnd_q3","ftnd_q4","ftnd_q5","ftnd_q6"],
      outputField: "total",
      isComposite: false,
    },
  ],
  algorithm: {
    type: "item-sum",
    inputLevel: "individual-responses",
    steps: [
      { order: 1, description: "Solo administrar a fumadores activos. Respuestas válidas: Q1=0-4, Q2=0-1, Q3=0-1, Q4=0-1, Q5=0-1, Q6=0-3." },
      { order: 2, description: "Excluir registros con algún ítem ausente o fuera del rango válido." },
      { order: 3, description: "Calcular el score: Q1+Q2+Q3+Q4+Q5+Q6. Rango 0–10." },
      { order: 4, description: "Clasificar por nivel: 0–2 muy baja, 3–4 baja, 5 moderada, 6–7 alta, 8–10 muy alta." },
    ],
    aggregationLevel: "municipal",
    completionCriteria: "Registro completo: respuesta válida en los 6 ítems con los rangos correctos por ítem.",
    notes:
      "El Fagerström solo se aplica a fumadores activos. " +
      "COMPÁS NG aplica la puntuación Q4 binaria (0/1) según la versión REDCap implementada. " +
      "Q6 acepta valores 0-3 para capturar toda la variabilidad de la respuesta.",
  },
  interpretation: {
    scale: { min: 0, max: 10, direction: "lower-is-better" },
    thresholds: [
      { min: 0, max: 2, label: "Muy baja dependencia", description: "Score 0–2: dependencia a la nicotina muy baja." },
      { min: 3, max: 4, label: "Baja dependencia", description: "Score 3–4: dependencia a la nicotina baja." },
      { min: 5, max: 5, label: "Dependencia moderada", description: "Score 5: dependencia moderada a la nicotina." },
      { min: 6, max: 7, label: "Dependencia alta", description: "Score 6–7: dependencia alta a la nicotina." },
      { min: 8, max: 10, label: "Dependencia muy alta", description: "Score 8–10: dependencia muy alta. Requiere apoyo intensivo para deshabituación." },
    ],
    contextualNotes: [
      "Punto de corte ≥5 para dependencia moderada o superior en la mayoría de estudios.",
      "El Fagerström solo se aplica a fumadores activos: la muestra puede ser pequeña.",
      "Los resultados deben interpretarse en el contexto de la prevalencia de tabaquismo del municipio.",
    ],
  },
  limitations: [
    "Solo aplicable a fumadores activos: la muestra municipal puede ser muy reducida.",
    "No mide la dependencia psicológica al tabaco, solo la dependencia física (nicotina).",
    "Sin referencia provincial disponible para comparación directa.",
    "La administración REDCap puede usar versiones simplificadas de algunos ítems.",
  ],
  bibliography: [
    {
      authors: "Heatherton, T.F.; Kozlowski, L.T.; Frecker, R.C.; Fagerström, K.O.",
      year: 1991,
      title: "The Fagerström Test for Nicotine Dependence: A Revision of the Fagerström Tolerance Questionnaire",
      source: "British Journal of Addiction",
      doi: "10.1111/j.1360-0443.1991.tb01879.x",
    },
    {
      authors: "Becoña, E.; Vázquez, F.L.",
      year: 1998,
      title: "The Fagerström Test for Nicotine Dependence in a Spanish sample",
      source: "Psychological Reports",
      notes: "Validación española del FTND.",
    },
  ],
  adapters: {
    redcap: {
      instrument: "monitor_fagerstrom",
      completedColumn: "monitor_fagerstrom_complete",
      completedValue: "2",
      columns: [
        { outputField: "q1", redcapColumn: "ftnd_q1", isComputed: false, notes: "Tiempo al primer cigarrillo (0–4)." },
        { outputField: "q2", redcapColumn: "ftnd_q2", isComputed: false, notes: "Dificultad para no fumar (0–1)." },
        { outputField: "q3", redcapColumn: "ftnd_q3", isComputed: false, notes: "Cigarrillo más importante (0–1)." },
        { outputField: "q4", redcapColumn: "ftnd_q4", isComputed: false, notes: "Cigarrillos/día (0–1 versión simplificada)." },
        { outputField: "q5", redcapColumn: "ftnd_q5", isComputed: false, notes: "Mayor consumo por la mañana (0–1)." },
        { outputField: "q6", redcapColumn: "ftnd_q6", isComputed: false, notes: "Fumar enfermo en cama (0–3 versión extendida)." },
      ],
    },
  },
  institutionalNote: {
    diagnosticInterpretation:
      "El Fagerström proporciona una estimación del grado de dependencia física a la nicotina " +
      "en la submuestra de fumadores activos del municipio. Un score ≥5 (dependencia moderada " +
      "o superior) indica que el fumador tiene alta probabilidad de síntomas de abstinencia " +
      "y puede beneficiarse de tratamiento farmacológico de apoyo en la deshabituación tabáquica. " +
      "Los resultados deben interpretarse junto a la prevalencia de tabaquismo en el municipio.",
    implications: [
      "Analizar la distribución de niveles de dependencia para priorizar intervenciones.",
      "Score ≥5 orienta hacia tratamiento farmacológico de apoyo (terapia sustitutiva con nicotina, vareniclina, bupropión).",
      "Cruce con prevalencia de tabaquismo (si disponible) para estimar la carga en la población total.",
    ],
    publicHealthApplication: {
      measures: [
        "Prevalencia de dependencia moderada o superior (FTND ≥5) en fumadores activos.",
        "Distribución del score por niveles (0–2 / 3–4 / 5 / 6–7 / 8–10).",
        "Score medio FTND en la muestra de fumadores activos.",
      ],
      doesNotMeasure: [
        "Dependencia psicológica al tabaco.",
        "Prevalencia de tabaquismo (el instrumento solo se aplica a fumadores activos).",
        "Intención de abandono ni motivación para dejar de fumar.",
      ],
      contextualUse: [
        "Instrumento de cribado de dependencia física en fumadores para planificación de intervención.",
        "Solo aplicable cuando la muestra incluye fumadores activos identificados.",
      ],
      commonMisinterpretations: [
        "Un score bajo no implica que sea fácil dejar de fumar: puede existir alta dependencia psicológica.",
        "El Fagerström no evalúa el riesgo cardiovascular asociado al tabaquismo.",
      ],
    },
    pslIntegration: {
      chapter: "Determinantes de Salud",
      determinants: ["Tabaquismo", "Conductas de riesgo", "Estilos de vida"],
      contribution:
        "El Fagerström aporta información sobre la intensidad de la dependencia tabáquica " +
        "en la subpoblación fumadora del municipio, orientando la planificación de programas " +
        "de deshabituación y la necesidad de recursos de apoyo farmacológico.",
    },
    relatedInstrumentIds: ["cage-eas", "auditc"],
  },
};
