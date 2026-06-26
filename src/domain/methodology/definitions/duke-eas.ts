import type { MethodologicalModule } from "../MethodologicalModule";

// Definición canónica del Duke-UNC-11 en su adaptación EAS (DUKE-EAS).
//
// Estado: "draft"
// - Ítems: verificados contra metadatos EAS (audit_eas_variables.csv).
// - Algoritmo: la recodificación binaria (max → apoyo normal; <max → apoyo bajo)
//   fue reconstruida empíricamente desde los microdatos EAS con reproducción 100 %.
//   No está extraída del artículo original de Broadhead (1988) ni de Bellón (1996).
// - Bibliografía: referencias identificadas; contraste completo con texto original pendiente.
// - Adaptador REDCap: no aplica en el flujo actual (datos vienen de microdatos EAS).
//
// Esta definición es declarativa. El parser DUKECSVParser.ts no la consume todavía.
// Cuando se conecte, los campos ITEM_FIELDS, CONF_FIELDS y AFFECT_FIELDS del parser
// deben derivarse de module.dimensions, y los umbrales de module.interpretation.thresholds.

const RESPONSE_OPTIONS = [
  { value: 1, label: "Mucho menos de lo que deseo" },
  { value: 2, label: "Menos de lo que deseo" },
  { value: 3, label: "Ni mucho ni poco" },
  { value: 4, label: "Casi como deseo" },
  { value: 5, label: "Tanto como deseo" },
] as const;

export const DUKE_EAS_MODULE: MethodologicalModule = {
  identity: {
    id: "duke-eas",
    version: "1.0.0",
    status: "draft",
    category: "validated-scale",
    name: "Apoyo Social Funcional DUKE-EAS",
    shortName: "DUKE-EAS",
    description:
      "Cuestionario de Apoyo Social Funcional Duke-UNC-11 en su adaptación para " +
      "la Encuesta Andaluza de Salud (EAS). Mide la percepción de apoyo social " +
      "funcional mediante 11 ítems agrupados en dos subescalas: apoyo confidencial " +
      "y apoyo afectivo.",
    purpose:
      "Evaluar la disponibilidad percibida de apoyo social funcional en la población " +
      "adulta, como determinante social de la salud. Identifica la prevalencia de " +
      "apoyo social bajo en el municipio.",
    targetPopulation: "Población adulta (≥16 años)",
    createdAt: "2026-06-25",
  },

  source: {
    authors: "Broadhead, W.E.; Gehlbach, S.H.; de Gruy, F.V.; Kaplan, B.H.",
    year: 1988,
    title:
      "The Duke-UNC Functional Social Support Questionnaire: Measurement of social " +
      "support in family medicine patients",
    source: "Medical Care",
    doi: "10.1097/00005650-198807000-00006",
    institutionalBody: "Consejería de Salud y Familias, Junta de Andalucía (adaptación EAS)",
    notes:
      "El instrumento original (Broadhead, 1988) fue adaptado para la Encuesta " +
      "Andaluza de Salud. La recodificación EAS (apoyo bajo / apoyo normal) fue " +
      "reconstruida desde los microdatos EAS con reproducción 100 %. " +
      "Validación española: Bellón Saameño JA et al., Med Clin (Barc) 1996;106(4):153-163.",
  },

  items: [
    {
      id: "duke_p5701",
      text: "Recibo visitas de mis amigos y familiares",
      dimensionId: "confidencial",
      responseType: "likert",
      responseOptions: [...RESPONSE_OPTIONS],
    },
    {
      id: "duke_p5702",
      text: "Recibo ayuda en asuntos relacionados con mi casa",
      dimensionId: "confidencial",
      responseType: "likert",
      responseOptions: [...RESPONSE_OPTIONS],
    },
    {
      id: "duke_p5703",
      text: "Recibo elogios y reconocimientos cuando hago bien mi trabajo",
      dimensionId: "afectivo",
      responseType: "likert",
      responseOptions: [...RESPONSE_OPTIONS],
    },
    {
      id: "duke_p5704",
      text: "Cuento con personas que se preocupan de lo que me sucede",
      dimensionId: "afectivo",
      responseType: "likert",
      responseOptions: [...RESPONSE_OPTIONS],
    },
    {
      id: "duke_p5705",
      text: "Recibo amor y afecto",
      dimensionId: "afectivo",
      responseType: "likert",
      responseOptions: [...RESPONSE_OPTIONS],
    },
    {
      id: "duke_p5706",
      text: "Tengo la posibilidad de hablar con alguien de mis problemas en el trabajo y/o en la casa",
      dimensionId: "confidencial",
      responseType: "likert",
      responseOptions: [...RESPONSE_OPTIONS],
    },
    {
      id: "duke_p5707",
      text: "Tengo la posibilidad de hablar con alguien de mis problemas personales y familiares",
      dimensionId: "confidencial",
      responseType: "likert",
      responseOptions: [...RESPONSE_OPTIONS],
    },
    {
      id: "duke_p5708",
      text: "Tengo posibilidad de hablar con alguien de mis problemas económicos",
      dimensionId: "confidencial",
      responseType: "likert",
      responseOptions: [...RESPONSE_OPTIONS],
    },
    {
      id: "duke_p5709",
      text: "Recibo invitaciones para distraerme y salir con otras personas",
      dimensionId: "confidencial",
      responseType: "likert",
      responseOptions: [...RESPONSE_OPTIONS],
    },
    {
      id: "duke_p5710",
      text: "Recibo consejos útiles cuando me ocurre algún acontecimiento importante en mi vida",
      dimensionId: "confidencial",
      responseType: "likert",
      responseOptions: [...RESPONSE_OPTIONS],
    },
    {
      id: "duke_p5711",
      text: "Recibo ayuda cuando estoy enfermo en la cama",
      dimensionId: "afectivo",
      responseType: "likert",
      responseOptions: [...RESPONSE_OPTIONS],
    },
  ],

  dimensions: [
    {
      id: "global",
      name: "Apoyo social global",
      description:
        "Suma de los 11 ítems. Rango 11–55. " +
        "Umbral EAS: 55 = apoyo normal; <55 = apoyo bajo.",
      itemIds: [
        "duke_p5701", "duke_p5702", "duke_p5703", "duke_p5704", "duke_p5705",
        "duke_p5706", "duke_p5707", "duke_p5708", "duke_p5709", "duke_p5710",
        "duke_p5711",
      ],
      outputField: "dukeGLOBAL",
    },
    {
      id: "confidencial",
      name: "Apoyo confidencial",
      description:
        "Suma de 7 ítems: P5701, P5702, P5706, P5707, P5708, P5709, P5710. " +
        "Rango 7–35. Umbral EAS: 35 = apoyo normal; <35 = apoyo bajo.",
      itemIds: [
        "duke_p5701", "duke_p5702", "duke_p5706", "duke_p5707",
        "duke_p5708", "duke_p5709", "duke_p5710",
      ],
      outputField: "dukeCONF",
    },
    {
      id: "afectivo",
      name: "Apoyo afectivo",
      description:
        "Suma de 4 ítems: P5703, P5704, P5705, P5711. " +
        "Rango 4–20. Umbral EAS: 20 = apoyo normal; <20 = apoyo bajo.",
      itemIds: [
        "duke_p5703", "duke_p5704", "duke_p5705", "duke_p5711",
      ],
      outputField: "dukeAFECT",
    },
  ],

  algorithm: {
    type: "item-sum",
    inputLevel: "individual-responses",
    steps: [
      {
        order: 1,
        description:
          "Administrar los 11 ítems con escala de respuesta 1–5 " +
          "(1 = Mucho menos de lo que deseo … 5 = Tanto como deseo).",
      },
      {
        order: 2,
        description:
          "Verificar la validez de cada respuesta: solo los valores enteros 1–5 " +
          "son válidos. Cualquier otro valor (missing codes: 994, 995, 996, 999) " +
          "invalida el registro para la escala correspondiente.",
      },
      {
        order: 3,
        description:
          "Calcular las tres puntuaciones por registro: " +
          "dukeGLOBAL = suma de los 11 ítems (rango 11–55); " +
          "dukeCONF = suma de los 7 ítems confidenciales (rango 7–35); " +
          "dukeAFECT = suma de los 4 ítems afectivos (rango 4–20). " +
          "Si algún ítem de la escala es inválido, la puntuación de esa escala es null.",
      },
      {
        order: 4,
        description:
          "Aplicar la recodificación EAS: " +
          "P57GLOBAL_R = 0 (apoyo normal) si dukeGLOBAL === 55, " +
          "P57GLOBAL_R = 1 (apoyo bajo) si dukeGLOBAL < 55, " +
          "P57GLOBAL_R = 993 si incompleto. " +
          "Análogamente para P57_AC_R (umbral 35) y P57_AF_R (umbral 20).",
      },
      {
        order: 5,
        description:
          "Agregar al nivel municipal: calcular la media aritmética de cada " +
          "puntuación suma, el recuento y porcentaje de apoyo bajo en cada escala, " +
          "sobre el conjunto de registros válidos.",
      },
    ],
    aggregationLevel: "municipal",
    completionCriteria:
      "Escala global: respuesta válida (1–5) a los 11 ítems. " +
      "Escala confidencial: respuesta válida a los 7 ítems correspondientes. " +
      "Escala afectiva: respuesta válida a los 4 ítems correspondientes. " +
      "Un registro puede ser válido para una escala e inválido para otra.",
    notes:
      "La recodificación binaria (solo la puntuación máxima se clasifica como " +
      "'apoyo normal') fue reconstruida empíricamente desde los microdatos EAS " +
      "con reproducción 100 %. Difiere del umbral clínico habitualmente citado " +
      "en la literatura (≤32 puntos sobre 55 = apoyo bajo según Bellón, 1996). " +
      "COMPÁS NG implementa la recodificación EAS para mantener comparabilidad " +
      "con los datos poblacionales andaluces.",
  },

  interpretation: {
    scale: {
      min: 11,
      max: 55,
      direction: "higher-is-better",
    },
    thresholds: [
      {
        min: 55,
        max: 55,
        label: "Apoyo normal (global)",
        description: "Puntuación global máxima: 55/55. Clasificación EAS: apoyo social funcional normal.",
      },
      {
        min: 11,
        max: 54,
        label: "Apoyo bajo (global)",
        description: "Puntuación global inferior al máximo. Clasificación EAS: apoyo social funcional bajo.",
      },
    ],
    referenceValues: {
      population: "Adultos ≥16 años, Andalucía (EAS Granada)",
      mean: 49.2,
      source: "Fixture EAS Granada — parseDUKECSV (fixtures/duke-eas-granada.csv, n=3028)",
    },
    contextualNotes: [
      "La escala confidencial tiene rango 7–35 (umbral EAS: 35 = normal; <35 = bajo).",
      "La escala afectiva tiene rango 4–20 (umbral EAS: 20 = normal; <20 = bajo).",
      "Los umbrales EAS son más estrictos que los clínicos publicados (Bellón, 1996).",
      "Los resultados son agregados de la muestra disponible, no estimaciones poblacionales.",
      "Una muestra inferior a 30 registros válidos limita la fiabilidad de los resultados.",
    ],
  },

  limitations: [
    "La recodificación binaria EAS (solo máximo = apoyo normal) difiere de los " +
    "umbrales clínicos publicados en la validación española (Bellón, 1996: ≤32/55).",
    "Esta recodificación fue reconstruida empíricamente desde los microdatos EAS; " +
    "no se presenta como criterio clínico universal ni genera decisiones automáticas.",
    "No permite análisis por subgrupos sin acceso a los registros individuales.",
    "La comparación con otros municipios requiere que el proceso de administración " +
    "sea metodológicamente equivalente al de la EAS.",
    "Los textos de los ítems corresponden a la adaptación EAS. El contraste completo " +
    "con el instrumento original (Broadhead, 1988) está pendiente.",
  ],

  bibliography: [
    {
      authors: "Broadhead, W.E.; Gehlbach, S.H.; de Gruy, F.V.; Kaplan, B.H.",
      year: 1988,
      title:
        "The Duke-UNC Functional Social Support Questionnaire: Measurement of social " +
        "support in family medicine patients",
      source: "Medical Care",
      doi: "10.1097/00005650-198807000-00006",
    },
    {
      authors:
        "Bellón Saameño, J.A.; Delgado Sánchez, A.; Luna del Castillo, J.D.; Lardelli Claret, P.",
      year: 1996,
      title:
        "Validez y fiabilidad del cuestionario de apoyo social funcional Duke-UNC-11",
      source: "Medicina Clínica (Barcelona)",
      notes: "Med Clin (Barc). 1996;106(4):153-163. Validación española del instrumento.",
    },
  ],

  adapters: {
    sav: {
      referenceFile: "EAS_microdatos_adulto_READY.csv",
      variables: [
        {
          outputField: "duke_p5701",
          savVariable: "P5701",
          label: "Recibo visitas de mis amigos y familiares",
          valueLabels: [
            { value: 1, label: "Mucho menos de lo que deseo" },
            { value: 2, label: "Menos de lo que deseo" },
            { value: 3, label: "Ni mucho ni poco" },
            { value: 4, label: "Casi como deseo" },
            { value: 5, label: "Tanto como deseo" },
          ],
          missingValues: [994, 995, 996, 999],
          measurementLevel: "ordinal",
        },
        {
          outputField: "duke_p5702",
          savVariable: "P5702",
          label: "Recibo ayuda en asuntos relacionados con mi casa",
          valueLabels: [
            { value: 1, label: "Mucho menos de lo que deseo" },
            { value: 2, label: "Menos de lo que deseo" },
            { value: 3, label: "Ni mucho ni poco" },
            { value: 4, label: "Casi como deseo" },
            { value: 5, label: "Tanto como deseo" },
          ],
          missingValues: [994, 995, 996, 999],
          measurementLevel: "ordinal",
        },
        {
          outputField: "duke_p5703",
          savVariable: "P5703",
          label: "Recibo elogios y reconocimientos cuando hago bien mi trabajo",
          valueLabels: [
            { value: 1, label: "Mucho menos de lo que deseo" },
            { value: 2, label: "Menos de lo que deseo" },
            { value: 3, label: "Ni mucho ni poco" },
            { value: 4, label: "Casi como deseo" },
            { value: 5, label: "Tanto como deseo" },
          ],
          missingValues: [994, 995, 996, 999],
          measurementLevel: "ordinal",
        },
        {
          outputField: "duke_p5704",
          savVariable: "P5704",
          label: "Cuento con personas que se preocupan de lo que me sucede",
          valueLabels: [
            { value: 1, label: "Mucho menos de lo que deseo" },
            { value: 2, label: "Menos de lo que deseo" },
            { value: 3, label: "Ni mucho ni poco" },
            { value: 4, label: "Casi como deseo" },
            { value: 5, label: "Tanto como deseo" },
          ],
          missingValues: [994, 995, 996, 999],
          measurementLevel: "ordinal",
        },
        {
          outputField: "duke_p5705",
          savVariable: "P5705",
          label: "Recibo amor y afecto",
          valueLabels: [
            { value: 1, label: "Mucho menos de lo que deseo" },
            { value: 2, label: "Menos de lo que deseo" },
            { value: 3, label: "Ni mucho ni poco" },
            { value: 4, label: "Casi como deseo" },
            { value: 5, label: "Tanto como deseo" },
          ],
          missingValues: [994, 995, 996, 999],
          measurementLevel: "ordinal",
        },
        {
          outputField: "duke_p5706",
          savVariable: "P5706",
          label: "Tengo la posibilidad de hablar con alguien de mis problemas en el trabajo y/o en la casa",
          valueLabels: [
            { value: 1, label: "Mucho menos de lo que deseo" },
            { value: 2, label: "Menos de lo que deseo" },
            { value: 3, label: "Ni mucho ni poco" },
            { value: 4, label: "Casi como deseo" },
            { value: 5, label: "Tanto como deseo" },
          ],
          missingValues: [994, 995, 996, 999],
          measurementLevel: "ordinal",
        },
        {
          outputField: "duke_p5707",
          savVariable: "P5707",
          label: "Tengo la posibilidad de hablar con alguien de mis problemas personales y familiares",
          valueLabels: [
            { value: 1, label: "Mucho menos de lo que deseo" },
            { value: 2, label: "Menos de lo que deseo" },
            { value: 3, label: "Ni mucho ni poco" },
            { value: 4, label: "Casi como deseo" },
            { value: 5, label: "Tanto como deseo" },
          ],
          missingValues: [994, 995, 996, 999],
          measurementLevel: "ordinal",
        },
        {
          outputField: "duke_p5708",
          savVariable: "P5708",
          label: "Tengo posibilidad de hablar con alguien de mis problemas económicos",
          valueLabels: [
            { value: 1, label: "Mucho menos de lo que deseo" },
            { value: 2, label: "Menos de lo que deseo" },
            { value: 3, label: "Ni mucho ni poco" },
            { value: 4, label: "Casi como deseo" },
            { value: 5, label: "Tanto como deseo" },
          ],
          missingValues: [994, 995, 996, 999],
          measurementLevel: "ordinal",
        },
        {
          outputField: "duke_p5709",
          savVariable: "P5709",
          label: "Recibo invitaciones para distraerme y salir con otras personas",
          valueLabels: [
            { value: 1, label: "Mucho menos de lo que deseo" },
            { value: 2, label: "Menos de lo que deseo" },
            { value: 3, label: "Ni mucho ni poco" },
            { value: 4, label: "Casi como deseo" },
            { value: 5, label: "Tanto como deseo" },
          ],
          missingValues: [994, 995, 996, 999],
          measurementLevel: "ordinal",
        },
        {
          outputField: "duke_p5710",
          savVariable: "P5710",
          label: "Recibo consejos útiles cuando me ocurre algún acontecimiento importante en mi vida",
          valueLabels: [
            { value: 1, label: "Mucho menos de lo que deseo" },
            { value: 2, label: "Menos de lo que deseo" },
            { value: 3, label: "Ni mucho ni poco" },
            { value: 4, label: "Casi como deseo" },
            { value: 5, label: "Tanto como deseo" },
          ],
          missingValues: [994, 995, 996, 999],
          measurementLevel: "ordinal",
        },
        {
          outputField: "duke_p5711",
          savVariable: "P5711",
          label: "Recibo ayuda cuando estoy enfermo en la cama",
          valueLabels: [
            { value: 1, label: "Mucho menos de lo que deseo" },
            { value: 2, label: "Menos de lo que deseo" },
            { value: 3, label: "Ni mucho ni poco" },
            { value: 4, label: "Casi como deseo" },
            { value: 5, label: "Tanto como deseo" },
          ],
          missingValues: [994, 995, 996, 999],
          measurementLevel: "ordinal",
        },
      ],
    },
  },
};
