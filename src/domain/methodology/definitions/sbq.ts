import type { MethodologicalModule } from "../MethodologicalModule";

export const SBQ_MODULE: MethodologicalModule = {
  identity: {
    id: "sbq",
    version: "1.0.0",
    status: "draft",
    category: "validated-scale",
    name: "SBQ — Cuestionario de Comportamiento Sedentario",
    shortName: "SBQ",
    description:
      "Cuestionario de 9 ítems (Sedentary Behavior Questionnaire, Rosenberg et al. 2010) " +
      "que evalúa el tiempo dedicado a diferentes actividades sedentarias en un día típico " +
      "(TV, ordenador, videojuegos, coche, teléfono, comer, escritorio, estar sentado/tumbado, otras). " +
      "Cada ítem se puntúa con una escala de frecuencia: 0=nada, 1=<1h, 2=1-2h, 3=2-4h, 4=>4h.",
    purpose:
      "Estimar las horas diarias de comportamiento sedentario en la población adulta. " +
      "Punto de corte clínico: >8h/día = comportamiento altamente sedentario (Rosenberg et al., 2010).",
    targetPopulation: "Población adulta general (≥18 años)",
    createdAt: "2026-07-02",
  },
  source: {
    authors: "Rosenberg, D.E.; Bull, F.C.; Marshall, A.L.; Sallis, J.F.; Bauman, A.E.",
    year: 2008,
    title: "Assessment of sedentary behavior with the International Physical Activity Questionnaire",
    source: "Journal of Physical Activity and Health",
    doi: "10.1123/jpah.5.s1.s30",
    institutionalBody: "Rosenberg DE et al. (2010). Sedentary behaviors and obesity in adults.",
    notes:
      "Rosenberg DE, Bull FC, Marshall AL, Sallis JF, Bauman AE (2008). Versión de 9 ítems. " +
      "Factor de conversión de puntuación ordinal a horas: 0→0h, 1→0.5h, 2→1.5h, 3→3h, 4→5h. " +
      "Punto de corte >8h/día: Rosenberg DE et al. (2010) Prev Chronic Dis.",
  },
  items: Array.from({ length: 9 }, (_, i) => ({
    id: `sbq_q${i + 1}`,
    text: [
      "¿Cuántas horas al día suele dedicar a ver la televisión?",
      "¿Cuántas horas al día suele dedicar al ordenador (fuera del trabajo)?",
      "¿Cuántas horas al día suele dedicar a videojuegos?",
      "¿Cuántas horas al día pasa sentado en el coche, autobús u otro transporte?",
      "¿Cuántas horas al día suele dedicar a hablar por teléfono sentado?",
      "¿Cuántas horas al día pasa sentado comiendo (incluye desayuno, comida y cena)?",
      "¿Cuántas horas al día pasa sentado en el trabajo o estudiando?",
      "¿Cuántas horas al día pasa sentado o tumbado sin hacer nada?",
      "¿Cuántas horas al día pasa en otras actividades sedentarias no incluidas antes?",
    ][i],
    redcapFormField: {
      fieldName: `sbq_q${i + 1}`,
      formName: "monitor_sbq",
      fieldType: "radio",
      fieldLabel: `SBQ ítem ${i + 1}`,
      choicesOrCalculations: "0, Nada | 1, Menos de 1 hora | 2, 1-2 horas | 3, 2-4 horas | 4, Más de 4 horas",
      required: true,
      questionNumber: `${i + 1}`,
    },
    dimensionId: "sedentarismo",
    responseType: "likert" as const,
    responseOptions: [
      { value: 0, label: "Nada" },
      { value: 1, label: "Menos de 1 hora" },
      { value: 2, label: "1–2 horas" },
      { value: 3, label: "2–4 horas" },
      { value: 4, label: "Más de 4 horas" },
    ],
  })),
  dimensions: [
    {
      id: "sedentarismo",
      name: "Tiempo sedentario total (horas/día)",
      description:
        "Suma de los 9 ítems convertidos a horas mediante el factor de conversión: " +
        "0→0h, 1→0.5h, 2→1.5h, 3→3h, 4→5h. Total = horas/día de comportamiento sedentario. " +
        "Punto de corte >8h/día = comportamiento altamente sedentario.",
      itemIds: Array.from({ length: 9 }, (_, i) => `sbq_q${i + 1}`),
      outputField: "hours",
      isComposite: false,
    },
  ],
  algorithm: {
    type: "item-sum",
    inputLevel: "individual-responses",
    steps: [
      { order: 1, description: "Administrar los 9 ítems (0–4 cada uno). Todos se aplican a adultos." },
      { order: 2, description: "Excluir registros con algún ítem ausente o fuera del rango 0–4." },
      { order: 3, description: "Convertir cada ítem a horas: 0→0, 1→0.5, 2→1.5, 3→3, 4→5." },
      { order: 4, description: "Calcular el total de horas/día: suma de los 9 valores convertidos." },
      { order: 5, description: "Aplicar el punto de corte: >8h/día = comportamiento altamente sedentario." },
    ],
    aggregationLevel: "municipal",
    completionCriteria: "Registro completo: respuesta válida (0–4) en los 9 ítems.",
    notes:
      "El factor de conversión a horas (midpoint) es una aproximación. " +
      "Las horas reales pueden diferir significativamente del punto medio del intervalo.",
  },
  interpretation: {
    scale: { min: 0, max: 45, direction: "lower-is-better" },
    thresholds: [
      { min: 0, max: 4, label: "Sedentarismo bajo", description: "≤4 h/día de comportamiento sedentario total." },
      { min: 5, max: 8, label: "Sedentarismo moderado", description: "4–8 h/día: nivel moderado de comportamiento sedentario (umbral real: >4h)." },
      { min: 9, max: 45, label: "Comportamiento altamente sedentario", description: ">8 h/día: nivel asociado a mayor riesgo cardiometabólico (umbral real: >8h)." },
    ],
    contextualNotes: [
      "Punto de corte clínico >8h/día para comportamiento altamente sedentario (Rosenberg et al., 2010).",
      "Las estimaciones de horas son aproximaciones (midpoint de cada categoría ordinal).",
      "El SBQ no distingue la actividad física entre períodos sedentarios.",
      "Sin referencia provincial disponible para comparación territorial.",
    ],
  },
  limitations: [
    "Las horas son estimaciones basadas en el punto medio de cada categoría ordinal.",
    "El sedentarismo laboral puede solaparse con el sedentarismo de ocio en algunos ítems.",
    "No distingue entre sedentarismo continuo y pausas activas.",
    "Sin referencia provincial ni autonómica para comparación directa.",
  ],
  bibliography: [
    {
      authors: "Rosenberg, D.E.; Bull, F.C.; Marshall, A.L.; Sallis, J.F.; Bauman, A.E.",
      year: 2008,
      title: "Assessment of sedentary behavior with the International Physical Activity Questionnaire",
      source: "Journal of Physical Activity and Health",
      doi: "10.1123/jpah.5.s1.s30",
    },
    {
      authors: "Rosenberg, D.E.; Bellettiere, J.; Gardiner, P.A.; et al.",
      year: 2010,
      title: "Independent associations between sedentary behaviors and mental, behavioral and physical health",
      source: "Preventing Chronic Disease",
      notes: "Referencia para el punto de corte clínico >8h/día.",
    },
  ],
  adapters: {
    redcap: {
      instrument: "monitor_sbq",
      completedColumn: "monitor_sbq_complete",
      completedValue: "2",
      columns: Array.from({ length: 9 }, (_, i) => ({
        outputField: `q${i + 1}`,
        redcapColumn: `sbq_q${i + 1}`,
        isComputed: false,
        notes: `Ítem ${i + 1} SBQ (0–4): tiempo en actividad sedentaria.`,
      })),
    },
  },
  institutionalNote: {
    diagnosticInterpretation:
      "El SBQ proporciona una estimación de las horas diarias de comportamiento sedentario " +
      "en la población adulta del municipio. Una media superior a 8 horas/día y una " +
      "prevalencia de comportamiento altamente sedentario (>8h/día) superior al 25–30 % " +
      "señalan una carga significativa de sedentarismo que merece atención preventiva. " +
      "El sedentarismo es un factor de riesgo independiente del nivel de actividad física.",
    implications: [
      "El comportamiento sedentario (>8h/día) es un factor de riesgo cardiovascular independiente.",
      "Cruce con IPAQ-EAS: el sedentarismo elevado y la inactividad física son problemas distintos.",
      "Cruce con PSQI: el sedentarismo elevado se asocia con peor calidad del sueño.",
      "Valorar intervenciones de reducción de tiempo sedentario (pausas activas, caminatas).",
    ],
    publicHealthApplication: {
      measures: [
        "Prevalencia de comportamiento altamente sedentario (SBQ >8h/día).",
        "Media de horas/día de comportamiento sedentario total.",
        "Distribución por rangos (≤4h / 4–8h / >8h).",
      ],
      doesNotMeasure: [
        "Actividad física: el sedentarismo no es la inversa de la actividad física.",
        "El tiempo sedentario específicamente en el trabajo vs. el ocio.",
        "Consecuencias clínicas directas del sedentarismo.",
      ],
      contextualUse: [
        "Instrumento de cribado del tiempo sedentario en población adulta.",
        "Complementa al IPAQ-EAS (actividad física) para una imagen completa del estilo de vida.",
      ],
      commonMisinterpretations: [
        "Una persona activa físicamente puede ser altamente sedentaria el resto del tiempo.",
        "Las horas son estimaciones ordinales: no se deben interpretar como medidas precisas.",
      ],
    },
    pslIntegration: {
      chapter: "Determinantes de Salud",
      determinants: ["Sedentarismo", "Actividad física y estilos de vida"],
      contribution:
        "El SBQ aporta una medida del comportamiento sedentario como determinante independiente " +
        "de la salud, complementando el IPAQ-EAS. Ambos juntos ofrecen una imagen más completa " +
        "del perfil de actividad-sedentarismo de la población adulta del municipio.",
    },
    relatedInstrumentIds: ["ipaq-eas", "psqi", "phq9"],
  },
};
