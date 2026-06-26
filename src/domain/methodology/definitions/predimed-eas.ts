import type { MethodologicalModule } from "../MethodologicalModule";

// Definición canónica del PREDIMED-14 en su adaptación EAS (PREDIMED-EAS).
//
// Estado: "draft"
// - Ítems: verificados contra metadatos EAS (audit_eas_variables.csv).
// - Campo canónico: `Predimed` (puntuación 0–14 pre-calculada por la EAS).
//   Es la única fuente que debe usar el parser. La suma directa de los 14 ítems
//   P36BPD no reproduce el índice oficial (ítems usan códigos 1–4, no 0/1).
// - Umbrales (≤6 baja, 7–8 media, ≥9 alta): referenciados como "Martínez-González
//   (2012), adaptación EAS Andalucía" en el parser. Contraste con la publicación
//   primaria pendiente de verificación.
// - Bibliografía: referencia identificada; verificación completa con el artículo
//   original pendiente.
// - Adaptador REDCap: no aplica en el flujo actual (datos de microdatos EAS).
//
// Esta definición es declarativa. PREDIMEDCSVParser.ts no la consume todavía.
// Cuando se conecte, el campo canónico y los umbrales deben derivarse del módulo.

export const PREDIMED_EAS_MODULE: MethodologicalModule = {
  identity: {
    id: "predimed-eas",
    version: "1.0.0",
    status: "draft",
    category: "validated-scale",
    name: "Adherencia a la Dieta Mediterránea PREDIMED-EAS",
    shortName: "PREDIMED-EAS",
    description:
      "Cuestionario PREDIMED-14 de adherencia a la dieta mediterránea en su " +
      "adaptación para la Encuesta Andaluza de Salud (EAS). Evalúa 14 criterios " +
      "dietéticos mediante un índice sumativo (0–14).",
    purpose:
      "Medir el grado de adherencia de la población adulta a la dieta mediterránea " +
      "como factor protector de la salud cardiovascular y determinante de estilo " +
      "de vida. Clasifica la población en adherencia baja, media o alta.",
    targetPopulation: "Población adulta (≥16 años), según EAS",
    createdAt: "2026-06-26",
  },

  source: {
    authors: "Martínez-González, M.A. et al.",
    year: 2012,
    title:
      "Adaptación del cuestionario PREDIMED-14 para la Encuesta Andaluza de Salud. " +
      "Cortes de adherencia: ≤6 baja, 7–8 media, ≥9 alta.",
    institutionalBody: "Consejería de Salud y Familias, Junta de Andalucía (adaptación EAS)",
    notes:
      "La referencia 'Martínez-González (2012)' procede de la cautela metodológica " +
      "del parser PREDIMEDCSVParser.ts. La publicación primaria específica del " +
      "instrumento PREDIMED-14 y sus umbrales está pendiente de contraste. " +
      "El estudio PREDIMED original: Estruch R et al., N Engl J Med 2013;368:1279-1290.",
  },

  items: [
    {
      id: "predimed_p36bpd01",
      text: "¿Usa usted el aceite de oliva como principal grasa para cocinar?",
      dimensionId: "adherencia",
      responseType: "binary",
      responseOptions: [
        { value: 0, label: "No" },
        { value: 1, label: "Sí" },
      ],
      notes: "Criterio positivo: Sí = +1 en el índice canónico EAS.",
    },
    {
      id: "predimed_p36bpd02",
      text: "¿Cuánto aceite de oliva consume en total al día (incluyendo el usado para freír, el de las comidas fuera de casa, las ensaladas, etc.)?",
      dimensionId: "adherencia",
      responseType: "likert",
      responseOptions: [
        { value: 1, label: "Cuatro o más cucharadas" },
        { value: 2, label: "Dos o tres cucharadas" },
        { value: 3, label: "Menos de dos cucharadas" },
      ],
      notes: "Criterio positivo (EAS): valor 1 (≥4 cucharadas). Código 1–3; no binario.",
    },
    {
      id: "predimed_p36bpd03",
      text: "¿Cuántas raciones de verdura u hortalizas consume al día (las guarniciones o acompañamientos contabilizan como ½ ración)?",
      dimensionId: "adherencia",
      responseType: "likert",
      responseOptions: [
        { value: 1, label: "Dos o más al día (al menos una de ellas en ensalada o crudas)" },
        { value: 2, label: "Diariamente, aunque menos de dos al día" },
        { value: 3, label: "No diariamente, pero tres o más por semana" },
        { value: 4, label: "Menos de tres veces por semana" },
      ],
      notes: "Criterio positivo (EAS): valor 1 (≥2 raciones/día, al menos una cruda). Código 1–4.",
    },
    {
      id: "predimed_p36bpd04",
      text: "¿Cuántas piezas de fruta (incluyendo zumo natural) consume al día?",
      dimensionId: "adherencia",
      responseType: "likert",
      responseOptions: [
        { value: 1, label: "Tres o más al día" },
        { value: 2, label: "Diariamente aunque menos de tres veces al día" },
        { value: 3, label: "No diariamente, pero tres o más veces por semana" },
        { value: 4, label: "Menos de tres veces por semana" },
      ],
      notes: "Criterio positivo (EAS): valor 1 (≥3 piezas/día). Código 1–4.",
    },
    {
      id: "predimed_p36bpd05",
      text: "¿Cuántas raciones de carnes rojas, hamburguesas, salchichas o embutidos consume al día (una ración equivale a 100-150 gr)?",
      dimensionId: "adherencia",
      responseType: "likert",
      responseOptions: [
        { value: 1, label: "Menos de una al día" },
        { value: 2, label: "Una o más de una ración" },
      ],
      notes: "Criterio positivo (EAS): valor 1 (<1 ración/día). Ítem inverso: menos consumo = mejor. Código 1–2.",
    },
    {
      id: "predimed_p36bpd06",
      text: "¿Cuántas raciones de mantequilla, margarina o nata consume al día (una porción individual equivale a 12 gr)?",
      dimensionId: "adherencia",
      responseType: "likert",
      responseOptions: [
        { value: 1, label: "Menos de una al día" },
        { value: 2, label: "Una o más al día" },
      ],
      notes: "Criterio positivo (EAS): valor 1 (<1 ración/día). Ítem inverso. Código 1–2.",
    },
    {
      id: "predimed_p36bpd07",
      text: "¿Cuántas bebidas carbonatadas y/o azucaradas (refrescos, colas, tónicas, bitter) consume al día?",
      dimensionId: "adherencia",
      responseType: "likert",
      responseOptions: [
        { value: 1, label: "Menos de una al día" },
        { value: 2, label: "Una o más de una al día" },
      ],
      notes: "Criterio positivo (EAS): valor 1 (<1 bebida/día). Ítem inverso. Código 1–2.",
    },
    {
      id: "predimed_p36bpd08",
      text: "¿Bebe vino? ¿Cuánto consume a la semana?",
      dimensionId: "adherencia",
      responseType: "likert",
      responseOptions: [
        { value: 1, label: "Siete o más vasos a la semana" },
        { value: 2, label: "De tres a menos de 7 vasos a la semana" },
        { value: 3, label: "Menos de tres vasos a la semana" },
      ],
      notes: "Criterio positivo (EAS): valor 1 (≥7 vasos/semana). Código 1–3.",
    },
    {
      id: "predimed_p36bpd09",
      text: "¿Cuántas raciones de legumbres consume a la semana (una ración o plato equivale a 150 gr)?",
      dimensionId: "adherencia",
      responseType: "likert",
      responseOptions: [
        { value: 1, label: "Tres o más por semana" },
        { value: 2, label: "Una o dos a la semana" },
        { value: 3, label: "Menos de una por semana" },
      ],
      notes: "Criterio positivo (EAS): valor 1 (≥3 raciones/semana). Código 1–3.",
    },
    {
      id: "predimed_p36bpd10",
      text: "¿Cuántas raciones de pescado o mariscos consume a la semana (un plato, pieza o ración equivale a 100-150 gr de pescado ó 4-5 piezas de marisco)?",
      dimensionId: "adherencia",
      responseType: "likert",
      responseOptions: [
        { value: 1, label: "Dos o más por semana" },
        { value: 2, label: "Uno por semana" },
        { value: 3, label: "Menos de una por semana" },
      ],
      notes: "Criterio positivo (EAS): valor 1 (≥2 raciones/semana). Código 1–3.",
    },
    {
      id: "predimed_p36bpd11",
      text: "¿Cuántas consume repostería comercial (no casera) como galletas, flanes, dulce o pasteles?",
      dimensionId: "adherencia",
      responseType: "likert",
      responseOptions: [
        { value: 1, label: "Tres o más a la semana" },
        { value: 2, label: "Uno o dos a la semana" },
        { value: 3, label: "Menos de una a la semana" },
      ],
      notes: "Criterio positivo (EAS): valor 3 (<1/semana). Ítem inverso. Código 1–3.",
    },
    {
      id: "predimed_p36bpd12",
      text: "¿Cuántas veces consume frutos secos a la semana (una ración equivale a 30 gr)?",
      dimensionId: "adherencia",
      responseType: "likert",
      responseOptions: [
        { value: 1, label: "Tres o más a la semana" },
        { value: 2, label: "Una o dos por semana" },
        { value: 3, label: "Menos de una a la semana" },
      ],
      notes: "Criterio positivo (EAS): valor 1 (≥3 veces/semana). Código 1–3.",
    },
    {
      id: "predimed_p36bpd13",
      text: "¿Consume preferentemente carne de pollo, pavo o conejo en vez de ternera, cerdo, hamburguesas o salchichas?",
      dimensionId: "adherencia",
      responseType: "binary",
      responseOptions: [
        { value: 0, label: "No" },
        { value: 1, label: "Sí" },
      ],
      notes: "Criterio positivo: Sí = +1 en el índice canónico EAS.",
    },
    {
      id: "predimed_p36bpd14",
      text: "¿Cuántas veces a la semana consume los vegetales cocinados, la pasta, el arroz u otros platos aderezados con una salsa de tomate, ajo, cebolla o puerro elaborada a fuego lento con aceite de oliva (sofrito)?",
      dimensionId: "adherencia",
      responseType: "likert",
      responseOptions: [
        { value: 1, label: "Dos o más por semana" },
        { value: 2, label: "Una por semana" },
        { value: 3, label: "Menos de una por semana" },
      ],
      notes: "Criterio positivo (EAS): valor 1 (≥2 veces/semana). Código 1–3.",
    },
  ],

  dimensions: [
    {
      id: "adherencia",
      name: "Adherencia a la dieta mediterránea",
      description:
        "Índice sumativo de 14 criterios dietéticos (0–14). " +
        "Cada criterio vale 1 punto si se cumple el umbral de adherencia definido por la EAS. " +
        "El campo canónico `Predimed` incorpora esta recodificación per-ítem. " +
        "La suma directa de P36BPD01_2023–P36BPD14_2023 no reproduce el índice " +
        "porque los ítems usan códigos categoriales (1–4, 1–3, 1–2, 0/1), no valores binarios.",
      itemIds: [
        "predimed_p36bpd01", "predimed_p36bpd02", "predimed_p36bpd03", "predimed_p36bpd04",
        "predimed_p36bpd05", "predimed_p36bpd06", "predimed_p36bpd07", "predimed_p36bpd08",
        "predimed_p36bpd09", "predimed_p36bpd10", "predimed_p36bpd11", "predimed_p36bpd12",
        "predimed_p36bpd13", "predimed_p36bpd14",
      ],
      outputField: "predimedScore",
    },
  ],

  algorithm: {
    type: "item-sum",
    inputLevel: "pre-aggregated",
    steps: [
      {
        order: 1,
        description:
          "Administrar los 14 ítems dietéticos del cuestionario PREDIMED. " +
          "Cada ítem usa su propia escala de respuesta (binaria, ordinal 1–2, 1–3 o 1–4).",
      },
      {
        order: 2,
        description:
          "Aplicar la recodificación per-ítem EAS: convertir cada respuesta categorial " +
          "a 0 (criterio no cumplido) o 1 (criterio cumplido). La regla varía por ítem. " +
          "Esta recodificación está implementada por la EAS y su resultado es el campo `Predimed`.",
      },
      {
        order: 3,
        description:
          "Sumar los 14 valores binarios recodificados. El índice `Predimed` resultante " +
          "tiene rango 0–14 (mayor puntuación = mayor adherencia a la dieta mediterránea).",
      },
      {
        order: 4,
        description:
          "Clasificar el índice según los umbrales EAS: " +
          "baja adherencia (0–6), adherencia media (7–8), alta adherencia (9–14).",
      },
      {
        order: 5,
        description:
          "Agregar al nivel municipal: calcular la media, la distribución por nivel " +
          "y los recuentos y porcentajes de cada categoría sobre los registros válidos.",
      },
    ],
    aggregationLevel: "municipal",
    completionCriteria:
      "Registro válido: campo `Predimed` con valor numérico en rango 0–14. " +
      "Los registros con `Predimed` ausente o fuera de rango se tratan como incompletos. " +
      "Solo algunos oleadas EAS incluyen el módulo PREDIMED; la tasa de incompletos " +
      "puede ser alta en muestras pooladas.",
    notes:
      "COMPÁS NG utiliza el campo `Predimed` (pre-calculado por la EAS) como entrada canónica. " +
      "Los ítems P36BPD01_2023–P36BPD14_2023 se conservan únicamente para trazabilidad: " +
      "su suma directa NO reproduce el índice oficial porque los códigos de respuesta son " +
      "categoriales (1–4, no 0/1). El parser emite un aviso explícito si solo dispone " +
      "de los ítems brutos sin el campo canónico.",
  },

  interpretation: {
    scale: {
      min: 0,
      max: 14,
      direction: "higher-is-better",
    },
    thresholds: [
      {
        min: 0,
        max: 6,
        label: "Baja adherencia",
        description:
          "Puntuación 0–6. Adherencia insuficiente a la dieta mediterránea. " +
          "Mayor riesgo cardiovascular asociado a patrón dietético.",
      },
      {
        min: 7,
        max: 8,
        label: "Adherencia media",
        description:
          "Puntuación 7–8. Adherencia moderada. " +
          "Margen de mejora relevante para intervención dietética.",
      },
      {
        min: 9,
        max: 14,
        label: "Alta adherencia",
        description:
          "Puntuación 9–14. Adherencia elevada a la dieta mediterránea. " +
          "Patrón dietético cardioprotector.",
      },
    ],
    referenceValues: {
      population:
        "Adultos ≥16 años, Granada — microdatos EAS (nTotal=3064; nVálido=712). " +
        "Fixture reproducible: fixtures/predimed-eas-granada.csv. " +
        "Script de regeneración: scripts/export-predimed-granada.mjs.",
      mean: 7.6,
      source: "fixtures/predimed-eas-granada.csv",
    },
    contextualNotes: [
      "Solo los registros con campo `Predimed` válido contribuyen al cálculo " +
      "(712 de 3064 en el fixture Granada = 23,2 %). Las oleadas sin módulo PREDIMED " +
      "generan una tasa de incompletos estructuralmente alta.",
      "Alta adherencia (≥9): 37,9 % de los registros válidos (Granada, EAS).",
      "Adherencia media (7–8): 26,1 %. Baja adherencia (≤6): 36,0 %.",
      "Los umbrales (≤6/7–8/≥9) siguen la adaptación EAS Andalucía. " +
      "Difieren de otras clasificaciones PREDIMED publicadas.",
      "Los resultados son agregados de la muestra disponible, no estimaciones poblacionales.",
      "Una muestra inferior a 30 registros válidos limita la fiabilidad.",
    ],
  },

  limitations: [
    "El campo canónico `Predimed` es el único aceptable para calcular la puntuación. " +
    "La suma directa de los 14 ítems P36BPD no es metodológicamente equivalente.",
    "Solo las oleadas EAS que incluyen el módulo PREDIMED tienen `Predimed` válido. " +
    "En muestras pooladas, la tasa de incompletos puede superar el 75 %.",
    "La recodificación per-ítem EAS (código categorial → 0/1) no está publicada " +
    "de forma exhaustiva; se conoce únicamente el resultado agregado en el campo `Predimed`.",
    "Los umbrales (≤6 baja, 7–8 media, ≥9 alta) proceden de la adaptación EAS; " +
    "el contraste con la publicación primaria de referencia está pendiente.",
    "No permite análisis por subgrupos sin acceso a los registros individuales.",
    "No es un instrumento clínico y no debe generar decisiones institucionales automáticas. " +
    "Requiere validación técnica humana antes de alimentar interpretación territorial.",
  ],

  bibliography: [
    {
      authors: "Martínez-González, M.A. et al.",
      year: 2012,
      notes:
        "Referencia citada en la cautela metodológica del parser como fuente de los umbrales " +
        "de adherencia (≤6 baja, 7–8 media, ≥9 alta) y su adaptación EAS Andalucía. " +
        "La publicación específica está pendiente de identificación exacta.",
    },
    {
      authors: "Estruch, R. et al. (PREDIMED Study Investigators)",
      year: 2013,
      title:
        "Primary Prevention of Cardiovascular Disease with a Mediterranean Diet",
      source: "New England Journal of Medicine",
      doi: "10.1056/NEJMoa1200303",
      notes:
        "Estudio clínico principal que valida el patrón dietético mediterráneo " +
        "como factor cardioprotector. El cuestionario PREDIMED-14 fue desarrollado " +
        "como herramienta de cribado dietético para este ensayo.",
    },
  ],

  adapters: {
    sav: {
      referenceFile: "EAS_microdatos_adulto_READY.csv",
      variables: [
        {
          outputField: "predimedScore",
          savVariable: "Predimed",
          label: "Escala adherencia a la dieta mediterránea a través del Predimed",
          missingValues: [991, 994, 999],
          measurementLevel: "scale",
          derivation:
            "Suma de 14 ítems binarios recodificados per-ítem por la EAS. " +
            "Campo canónico: usar directamente sin recalcular desde los ítems brutos.",
        },
        {
          outputField: "predimed_p36bpd01",
          savVariable: "P36BPD01_2023",
          label: "¿Usa usted el aceite de oliva como principal grasa para cocinar?",
          valueLabels: [{ value: 0, label: "No" }, { value: 1, label: "Sí" }],
          missingValues: [991, 994, 996, 999],
          measurementLevel: "nominal",
          derivation: "Solo trazabilidad. No usar para recalcular el índice.",
        },
        {
          outputField: "predimed_p36bpd02",
          savVariable: "P36BPD02_2023",
          label: "¿Cuánto aceite de oliva consume en total al día?",
          valueLabels: [
            { value: 1, label: "Cuatro o más cucharadas" },
            { value: 2, label: "Dos o tres cucharadas" },
            { value: 3, label: "Menos de dos cucharadas" },
          ],
          missingValues: [991, 994, 996, 999],
          measurementLevel: "ordinal",
          derivation: "Solo trazabilidad. Código 1–3; no binario.",
        },
        {
          outputField: "predimed_p36bpd03",
          savVariable: "P36BPD03_2023",
          label: "¿Cuántas raciones de verdura u hortalizas consume al día?",
          valueLabels: [
            { value: 1, label: "Dos o más al día (al menos una en ensalada o crudas)" },
            { value: 2, label: "Diariamente, aunque menos de dos al día" },
            { value: 3, label: "No diariamente, pero tres o más por semana" },
            { value: 4, label: "Menos de tres veces por semana" },
          ],
          missingValues: [991, 994, 996, 999],
          measurementLevel: "ordinal",
          derivation: "Solo trazabilidad. Código 1–4.",
        },
        {
          outputField: "predimed_p36bpd04",
          savVariable: "P36BPD04_2023",
          label: "¿Cuántas piezas de fruta (incluyendo zumo natural) consume al día?",
          valueLabels: [
            { value: 1, label: "Tres o más al día" },
            { value: 2, label: "Diariamente aunque menos de tres veces al día" },
            { value: 3, label: "No diariamente, pero tres o más veces por semana" },
            { value: 4, label: "Menos de tres veces por semana" },
          ],
          missingValues: [991, 994, 996, 999],
          measurementLevel: "ordinal",
          derivation: "Solo trazabilidad. Código 1–4.",
        },
        {
          outputField: "predimed_p36bpd05",
          savVariable: "P36BPD05_2023",
          label: "¿Cuántas raciones de carnes rojas, hamburguesas, salchichas o embutidos consume al día?",
          valueLabels: [
            { value: 1, label: "Menos de una al día" },
            { value: 2, label: "Una o más de una ración" },
          ],
          missingValues: [991, 994, 996, 999],
          measurementLevel: "ordinal",
          derivation: "Solo trazabilidad. Ítem inverso. Código 1–2.",
        },
        {
          outputField: "predimed_p36bpd06",
          savVariable: "P36BPD06_2023",
          label: "¿Cuántas raciones de mantequilla, margarina o nata consume al día?",
          valueLabels: [
            { value: 1, label: "Menos de una al día" },
            { value: 2, label: "Una o más al día" },
          ],
          missingValues: [991, 994, 996, 999],
          measurementLevel: "ordinal",
          derivation: "Solo trazabilidad. Ítem inverso. Código 1–2.",
        },
        {
          outputField: "predimed_p36bpd07",
          savVariable: "P36BPD07_2023",
          label: "¿Cuántas bebidas carbonatadas y/o azucaradas consume al día?",
          valueLabels: [
            { value: 1, label: "Menos de una al día" },
            { value: 2, label: "Una o más de una al día" },
          ],
          missingValues: [991, 994, 996, 999],
          measurementLevel: "ordinal",
          derivation: "Solo trazabilidad. Ítem inverso. Código 1–2.",
        },
        {
          outputField: "predimed_p36bpd08",
          savVariable: "P36BPD08_2023",
          label: "¿Bebe vino? ¿Cuánto consume a la semana?",
          valueLabels: [
            { value: 1, label: "Siete o más vasos a la semana" },
            { value: 2, label: "De tres a menos de 7 vasos a la semana" },
            { value: 3, label: "Menos de tres vasos a la semana" },
          ],
          missingValues: [991, 994, 996, 999],
          measurementLevel: "ordinal",
          derivation: "Solo trazabilidad. Código 1–3.",
        },
        {
          outputField: "predimed_p36bpd09",
          savVariable: "P36BPD09_2023",
          label: "¿Cuántas raciones de legumbres consume a la semana?",
          valueLabels: [
            { value: 1, label: "Tres o más por semana" },
            { value: 2, label: "Una o dos a la semana" },
            { value: 3, label: "Menos de una por semana" },
          ],
          missingValues: [991, 994, 996, 999],
          measurementLevel: "ordinal",
          derivation: "Solo trazabilidad. Código 1–3.",
        },
        {
          outputField: "predimed_p36bpd10",
          savVariable: "P36BPD10_2023",
          label: "¿Cuántas raciones de pescado o mariscos consume a la semana?",
          valueLabels: [
            { value: 1, label: "Dos o más por semana" },
            { value: 2, label: "Uno por semana" },
            { value: 3, label: "Menos de una por semana" },
          ],
          missingValues: [991, 994, 996, 999],
          measurementLevel: "ordinal",
          derivation: "Solo trazabilidad. Código 1–3.",
        },
        {
          outputField: "predimed_p36bpd11",
          savVariable: "P36BPD11_2023",
          label: "¿Cuántas consume repostería comercial (no casera) como galletas, flanes, dulce o pasteles?",
          valueLabels: [
            { value: 1, label: "Tres o más a la semana" },
            { value: 2, label: "Uno o dos a la semana" },
            { value: 3, label: "Menos de una a la semana" },
          ],
          missingValues: [991, 994, 996, 999],
          measurementLevel: "ordinal",
          derivation: "Solo trazabilidad. Ítem inverso. Código 1–3.",
        },
        {
          outputField: "predimed_p36bpd12",
          savVariable: "P36BPD12_2023",
          label: "¿Cuántas veces consume frutos secos a la semana?",
          valueLabels: [
            { value: 1, label: "Tres o más a la semana" },
            { value: 2, label: "Una o dos por semana" },
            { value: 3, label: "Menos de una a la semana" },
          ],
          missingValues: [991, 994, 996, 999],
          measurementLevel: "ordinal",
          derivation: "Solo trazabilidad. Código 1–3.",
        },
        {
          outputField: "predimed_p36bpd13",
          savVariable: "P36BPD13_2023",
          label: "¿Consume preferentemente carne de pollo, pavo o conejo en vez de ternera, cerdo, hamburguesas o salchichas?",
          valueLabels: [{ value: 0, label: "No" }, { value: 1, label: "Sí" }],
          missingValues: [991, 994, 996, 999],
          measurementLevel: "nominal",
          derivation: "Solo trazabilidad.",
        },
        {
          outputField: "predimed_p36bpd14",
          savVariable: "P36BPD14_2023",
          label: "¿Cuántas veces a la semana consume vegetales cocinados con sofrito?",
          valueLabels: [
            { value: 1, label: "Dos o más por semana" },
            { value: 2, label: "Una por semana" },
            { value: 3, label: "Menos de una por semana" },
          ],
          missingValues: [991, 994, 996, 999],
          measurementLevel: "ordinal",
          derivation: "Solo trazabilidad. Código 1–3.",
        },
      ],
    },
  },
};
