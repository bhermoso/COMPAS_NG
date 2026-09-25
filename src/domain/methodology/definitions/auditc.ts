import type { MethodologicalModule } from "../MethodologicalModule";

// AUDIT-C — Alcohol Use Disorders Identification Test, versión abreviada (3 ítems).
//
// Estado: "draft"
// - Ítems: verificados contra las publicaciones originales de Bush et al. (1998)
//   y el manual AUDIT de la OMS (Babor et al. 2001).
// - Algoritmo: suma directa Q1+Q2+Q3, rango 0–12. Punto de corte estándar ≥4.
//   El punto de corte diferenciado por sexo (≥3 mujeres / ≥4 hombres) requiere
//   dato de sexo por participante; no se implementa en esta versión agregada.
// - Sin equivalente en la EAS: instrumento de administración propia via REDCap.
// - Estado "draft" hasta contraste completo con validación española publicada.
//
// Historial COMPÁS: previsto en ESCALAS_CFG del sistema histórico como
// "pendiente de monitor específico". Primera implementación en COMPÁS NG.

export const AUDITC_MODULE: MethodologicalModule = {
  identity: {
    id: "auditc",
    version: "1.0.0",
    status: "draft",
    category: "validated-scale",
    name: "AUDIT-C — Cribado de Consumo de Riesgo de Alcohol",
    shortName: "AUDIT-C",
    description:
      "Versión abreviada de 3 ítems del Cuestionario de Identificación de " +
      "Trastornos por Uso de Alcohol (AUDIT-10) de la OMS. Evalúa la " +
      "frecuencia, la cantidad y la frecuencia del consumo episódico intensivo " +
      "de alcohol en la población adulta.",
    purpose:
      "Detectar consumo de riesgo de alcohol en la población adulta a nivel " +
      "comunitario mediante cribado breve. A diferencia del CAGE, el AUDIT-C " +
      "mide el patrón actual de consumo, no sus consecuencias, y es más " +
      "sensible para detectar consumo de riesgo en mujeres.",
    targetPopulation: "Población adulta general (≥18 años)",
    createdAt: "2026-07-02",
  },

  source: {
    authors: "Bush, K.; Kivlahan, D.R.; McDonell, M.B.; Fihn, S.D.; Bradley, K.A.",
    year: 1998,
    title:
      "The AUDIT Alcohol Consumption Questions (AUDIT-C): An Effective Brief " +
      "Screening Test for Problem Drinking",
    source: "Archives of Internal Medicine",
    doi: "10.1001/archinte.158.16.1789",
    institutionalBody: "Adaptado de: Babor TF et al. AUDIT: The Alcohol Use Disorders " +
      "Identification Test. WHO, 2001. WHO/MSD/MSB/01.6a.",
    notes:
      "El AUDIT-C son los tres primeros ítems del AUDIT-10 (OMS). " +
      "Validación española del AUDIT: De la Fuente JM, Kerssemakers R. " +
      "Pendiente de identificar validación española específica del AUDIT-C " +
      "en población comunitaria general.",
  },

  items: [
    {
      id: "auditc_q1",
      text: "¿Con qué frecuencia consume bebidas alcohólicas?",
      redcapFormField: {
        fieldName: "auditc_q1",
        formName: "monitor_auditc",
        fieldType: "radio",
        fieldLabel: "¿Con qué frecuencia consume bebidas alcohólicas?",
        choicesOrCalculations:
          "0, Nunca | 1, Una vez al mes o menos | 2, De 2 a 4 veces al mes | " +
          "3, De 2 a 3 veces a la semana | 4, Cuatro o más veces a la semana",
        required: true,
        questionNumber: "1",
      },
      dimensionId: "consumo",
      responseType: "likert",
      responseOptions: [
        { value: 0, label: "Nunca" },
        { value: 1, label: "Una vez al mes o menos" },
        { value: 2, label: "De 2 a 4 veces al mes" },
        { value: 3, label: "De 2 a 3 veces a la semana" },
        { value: 4, label: "Cuatro o más veces a la semana" },
      ],
    },
    {
      id: "auditc_q2",
      text: "¿Cuántas consumiciones de bebidas alcohólicas suele realizar en un día de consumo normal?",
      redcapFormField: {
        fieldName: "auditc_q2",
        formName: "monitor_auditc",
        fieldType: "radio",
        fieldLabel: "¿Cuántas consumiciones de bebidas alcohólicas suele realizar en un día de consumo normal?",
        choicesOrCalculations:
          "0, 1 o 2 | 1, 3 o 4 | 2, 5 o 6 | 3, De 7 a 9 | 4, 10 o más",
        required: true,
        questionNumber: "2",
      },
      dimensionId: "consumo",
      responseType: "likert",
      responseOptions: [
        { value: 0, label: "1 o 2" },
        { value: 1, label: "3 o 4" },
        { value: 2, label: "5 o 6" },
        { value: 3, label: "De 7 a 9" },
        { value: 4, label: "10 o más" },
      ],
    },
    {
      id: "auditc_q3",
      text: "¿Con qué frecuencia toma 6 o más bebidas alcohólicas en una sola ocasión?",
      redcapFormField: {
        fieldName: "auditc_q3",
        formName: "monitor_auditc",
        fieldType: "radio",
        fieldLabel: "¿Con qué frecuencia toma 6 o más bebidas alcohólicas en una sola ocasión?",
        choicesOrCalculations:
          "0, Nunca | 1, Menos de una vez al mes | 2, Mensualmente | " +
          "3, Semanalmente | 4, A diario o casi a diario",
        required: true,
        questionNumber: "3",
      },
      dimensionId: "consumo",
      responseType: "likert",
      responseOptions: [
        { value: 0, label: "Nunca" },
        { value: 1, label: "Menos de una vez al mes" },
        { value: 2, label: "Mensualmente" },
        { value: 3, label: "Semanalmente" },
        { value: 4, label: "A diario o casi a diario" },
      ],
    },
  ],

  dimensions: [
    {
      id: "consumo",
      name: "Consumo de alcohol",
      description:
        "Dimensión única: frecuencia de consumo (Q1), cantidad habitual (Q2) " +
        "y frecuencia de consumo intensivo (Q3). La suma Q1+Q2+Q3 produce el " +
        "score total AUDIT-C (rango 0–12).",
      itemIds: ["auditc_q1", "auditc_q2", "auditc_q3"],
      outputField: "total",
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
          "Administrar los 3 ítems. Respuestas válidas: valores enteros 0–4 para Q1, Q2 y Q3.",
      },
      {
        order: 2,
        description:
          "Excluir registros con algún ítem ausente o con valor fuera del rango 0–4. " +
          "A diferencia del CAGE, no existe missing estructural por abstemia: " +
          "quienes no beben responden 'Nunca' (0) en Q1 y 0 en Q2 y Q3, obteniendo score 0.",
      },
      {
        order: 3,
        description:
          "Calcular el score individual: Q1 + Q2 + Q3 (rango 0–12).",
      },
      {
        order: 4,
        description:
          "Aplicar el punto de corte: score ≥ 4 = positivo para consumo de riesgo " +
          "(punto de corte simplificado de uso general). " +
          "El punto de corte diferenciado por sexo (≥3 mujeres / ≥4 hombres) " +
          "requiere dato de sexo individual y no se calcula en la versión agregada.",
      },
      {
        order: 5,
        description:
          "Agregar al nivel municipal: media del score, prevalencia de positivos (≥4), " +
          "y distribución por rangos de riesgo.",
      },
    ],
    aggregationLevel: "municipal",
    completionCriteria:
      "Registro completo: respuesta válida (0–4) en los tres ítems Q1, Q2 y Q3.",
    notes:
      "El AUDIT-C no tiene missing estructural vinculado a la abstemia. " +
      "Las personas que no consumen alcohol puntúan 0 en los tres ítems. " +
      "El punto de corte ≥4 es el más habitual en muestras mixtas cuando " +
      "no se dispone del sexo para aplicar los cortes diferenciados de Bush et al. (1998).",
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
        max: 0,
        label: "Sin consumo",
        description:
          "Score 0: la persona no consume alcohol o consume de forma extremadamente esporádica.",
      },
      {
        min: 1,
        max: 3,
        label: "Bajo riesgo",
        description:
          "Score 1–3: consumo bajo a moderado; sin señal de riesgo con el punto de corte ≥4 " +
          "(positivo en mujeres si ≥3 según Bush et al. 1998).",
      },
      {
        min: 4,
        max: 7,
        label: "Consumo de riesgo",
        description:
          "Score 4–7: consumo de riesgo. Asociado con mayor probabilidad de problemas " +
          "relacionados con el alcohol. Se indica evaluación adicional.",
      },
      {
        min: 8,
        max: 12,
        label: "Consumo de alto riesgo",
        description:
          "Score 8–12: consumo de alto riesgo o probable dependencia. " +
          "Se recomienda evaluación completa con AUDIT-10.",
      },
    ],
    contextualNotes: [
      "Punto de corte principal en esta implementación: ≥4 (general, sin diferenciación por sexo).",
      "Bush et al. (1998): corte óptimo ≥3 en mujeres y ≥4 en hombres para consumo de riesgo.",
      "Sin datos de sexo por participante, el corte ≥4 puede subestimar el consumo de riesgo femenino.",
      "El AUDIT-C no distingue entre no bebedores y bebedores ocasionales: ambos puntúan 0–1.",
      "Muestras con menos de 30 registros válidos presentan alta incertidumbre en las estimaciones.",
    ],
    referenceValues: {
      population: "Sin referencia provincial disponible (no existe equivalente EAS para AUDIT-C)",
      source: "Datos nacionales de referencia disponibles en ENS; no utilizados en esta versión.",
    },
  },

  limitations: [
    "El AUDIT-C mide consumo autorreferido; el participante puede subestimar su consumo real.",
    "Sin diferenciación por sexo en los agregados: el corte ≥4 puede subestimar " +
      "el consumo de riesgo femenino (donde el corte óptimo es ≥3).",
    "No identifica el tipo de bebida ni el contexto del consumo.",
    "No sustituye al AUDIT-10 completo cuando se sospecha dependencia.",
    "Sin referencia provincial ni autonómica disponible para comparación territorial directa.",
    "Validación española específica del AUDIT-C en población comunitaria general pendiente de identificar.",
  ],

  bibliography: [
    {
      authors: "Bush, K.; Kivlahan, D.R.; McDonell, M.B.; Fihn, S.D.; Bradley, K.A.",
      year: 1998,
      title:
        "The AUDIT Alcohol Consumption Questions (AUDIT-C): An Effective Brief " +
        "Screening Test for Problem Drinking",
      source: "Archives of Internal Medicine",
      doi: "10.1001/archinte.158.16.1789",
    },
    {
      authors: "Babor, T.F.; Higgins-Biddle, J.C.; Saunders, J.B.; Monteiro, M.G.",
      year: 2001,
      title: "AUDIT: The Alcohol Use Disorders Identification Test — Guidelines for Use in Primary Care",
      source: "World Health Organization",
      notes: "WHO/MSD/MSB/01.6a. Segunda edición.",
    },
  ],

  adapters: {
    redcap: {
      instrument: "monitor_auditc",
      completedColumn: "monitor_auditc_complete",
      completedValue: "2",
      columns: [
        {
          outputField: "q1",
          redcapColumn: "auditc_q1",
          isComputed: false,
          notes: "Frecuencia de consumo (0–4). Parte del score AUDIT-C.",
        },
        {
          outputField: "q2",
          redcapColumn: "auditc_q2",
          isComputed: false,
          notes: "Cantidad habitual por ocasión (0–4). Parte del score AUDIT-C.",
        },
        {
          outputField: "q3",
          redcapColumn: "auditc_q3",
          isComputed: false,
          notes: "Frecuencia de consumo intensivo (0–4). Parte del score AUDIT-C.",
        },
      ],
    },
  },

  institutionalNote: {
    diagnosticInterpretation:
      "El AUDIT-C proporciona una estimación de la prevalencia de consumo de riesgo " +
      "de alcohol en la población adulta del municipio. A diferencia del CAGE-EAS, " +
      "que detecta señales de consecuencias pasadas del consumo, el AUDIT-C mide el " +
      "patrón actual de consumo y es más sensible para detectar consumo de riesgo antes " +
      "de que aparezcan consecuencias clínicas, especialmente en mujeres. " +
      "Un score municipal elevado (media ≥2 o prevalencia de positivos ≥4 superior " +
      "al 20–25 %) señala una carga de consumo de riesgo que merece atención preventiva. " +
      "Los scores muy altos (≥8) en la distribución indican posible dependencia y " +
      "orientan hacia la evaluación clínica individual, no la intervención comunitaria directa.",

    implications: [
      "Analizar la prevalencia de positivos (score ≥4) como indicador de necesidad preventiva " +
        "en la población adulta, sin interpretarlo como diagnóstico individual.",
      "Comparar la distribución por rangos (0 / 1–3 / 4–7 / 8–12) para identificar si " +
        "el problema es de extensión (muchas personas con consumo moderado) o de intensidad " +
        "(pocos con consumo muy elevado).",
      "Considerar el efecto del género: si la muestra tiene alta proporción de mujeres, " +
        "el punto de corte ≥4 puede subestimar el consumo de riesgo real. " +
        "Interpretar junto al dato de composición de la muestra.",
      "Articular con el resultado de CAGE-EAS si ambos instrumentos están disponibles: " +
        "AUDIT-C alto con CAGE positivo bajo puede indicar consumo de riesgo incipiente " +
        "sin consecuencias todavía declaradas.",
      "Valorar la pertinencia de programas de intervención breve en Atención Primaria " +
        "cuando la prevalencia de consumo de riesgo supera el 15–20 % de la muestra.",
    ],

    publicHealthApplication: {
      measures: [
        "Prevalencia de consumo de riesgo (score AUDIT-C ≥4) en la muestra adulta.",
        "Distribución del score por rangos de riesgo (0 / 1–3 / 4–7 / 8–12).",
        "Score medio AUDIT-C de la muestra (indicador de carga global de consumo).",
      ],
      doesNotMeasure: [
        "Consecuencias pasadas del consumo (eso corresponde al CAGE).",
        "Dependencia alcohólica como diagnóstico clínico.",
        "Tipo de bebida, contexto de consumo ni patrón específico por grupo de edad.",
        "Consumo en menores de 18 años (validación en adultos).",
      ],
      contextualUse: [
        "Instrumento de cribado poblacional: adecuado para encuesta municipal de salud.",
        "Más sensible que el CAGE para consumo de riesgo en mujeres y en población general.",
        "Los resultados son comparables entre encuestas que usen la misma versión y protocolo.",
      ],
      commonMisinterpretations: [
        "Un score positivo (≥4) no es un diagnóstico de alcoholismo: es una señal de riesgo " +
          "que requeriría evaluación adicional a nivel individual.",
        "Score 0 no significa necesariamente abstemia: puede indicar consumo ocasional " +
          "muy esporádico que no activa Q2 ni Q3.",
        "El punto de corte ≥4 no es universal: ≥3 para mujeres en el estudio de validación original.",
      ],
    },

    pslIntegration: {
      chapter: "Determinantes de Salud",
      determinants: [
        "Consumo de alcohol y conductas de riesgo",
        "Estilos de vida",
      ],
      contribution:
        "El AUDIT-C aporta al Perfil de Salud Local una medida del consumo actual de " +
        "riesgo de alcohol en la población adulta, complementaria al CAGE-EAS. " +
        "Mientras el CAGE detecta consecuencias pasadas, el AUDIT-C identifica patrones " +
        "de consumo actuales susceptibles de prevención. Ambos juntos ofrecen una imagen " +
        "más completa de la dimensión alcohol en el municipio. " +
        "El AUDIT-C es el instrumento recomendado para nuevos estudios propios sin " +
        "dependencia de los microdatos EAS.",
    },

    relatedInstrumentIds: ["cage-eas", "predimed-eas", "sf12-eas"],
  },
};
