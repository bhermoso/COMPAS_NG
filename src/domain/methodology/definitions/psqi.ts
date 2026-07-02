import type { MethodologicalModule } from "../MethodologicalModule";

export const PSQI_MODULE: MethodologicalModule = {
  identity: {
    id: "psqi",
    version: "1.0.0",
    status: "draft",
    category: "validated-scale",
    name: "PSQI — Índice de Calidad del Sueño de Pittsburgh",
    shortName: "PSQI",
    description:
      "Cuestionario de 19 ítems autoadministrado que evalúa la calidad subjetiva del sueño " +
      "en el último mes a través de 7 componentes (C1–C7): calidad subjetiva, latencia, " +
      "duración, eficiencia, perturbaciones, uso de medicación y disfunción diurna. " +
      "Cada componente se puntúa de 0 a 3. Score global 0–21.",
    purpose:
      "Evaluar la calidad del sueño en la población adulta mediante el score global PSQI. " +
      "Punto de corte >5 para discriminar entre buenos y malos dormidores " +
      "(sensibilidad 89.6 %, especificidad 86.5 %).",
    targetPopulation: "Población adulta general (≥18 años)",
    createdAt: "2026-07-02",
  },
  source: {
    authors: "Buysse, D.J.; Reynolds, C.F.; Monk, T.H.; Berman, S.R.; Kupfer, D.J.",
    year: 1989,
    title: "The Pittsburgh Sleep Quality Index: A New Instrument for Psychiatric Practice and Research",
    source: "Psychiatry Research",
    doi: "10.1016/0165-1781(89)90047-4",
    institutionalBody: "Validado en España: Royuela A, Macías JA (1997), Vigilia-Sueño.",
    notes: "Validación española: Royuela Rico A, Macías Fernández JA. Propiedades clinimétricas " +
      "de la versión castellana del Cuestionario de Pittsburgh. Vigilia-Sueño 1997;9(2):81-94.",
  },
  items: Array.from({ length: 7 }, (_, i) => ({
    id: `psqi_c${i + 1}`,
    text: [
      "Componente 1 — Calidad subjetiva del sueño",
      "Componente 2 — Latencia del sueño",
      "Componente 3 — Duración del sueño",
      "Componente 4 — Eficiencia habitual del sueño",
      "Componente 5 — Perturbaciones del sueño",
      "Componente 6 — Uso de medicación para dormir",
      "Componente 7 — Disfunción diurna",
    ][i],
    redcapFormField: {
      fieldName: `psqi_c${i + 1}`,
      formName: "monitor_psqi",
      fieldType: "radio",
      fieldLabel: `PSQI componente ${i + 1}`,
      choicesOrCalculations: "0, Muy buena/Nunca/<6h/≥85%/Ninguna/Nunca/Ningún problema | 1, Bastante buena/Menos de 1 vez/6-7h/75-84%/Menos de 1 vez/Menos de 1 vez/Muy poco problema | 2, Bastante mala/1-2 veces/5-6h/65-74%/1-2 veces/1-2 veces/Algún problema | 3, Muy mala/3+ veces/<5h/<65%/3+ veces/3+ veces/Gran problema",
      required: true,
      questionNumber: `${i + 1}`,
    },
    dimensionId: "calidad-sueno",
    responseType: "likert" as const,
    responseOptions: [
      { value: 0, label: "0 — Sin problema / excelente" },
      { value: 1, label: "1 — Leve" },
      { value: 2, label: "2 — Moderado" },
      { value: 3, label: "3 — Grave" },
    ],
  })),
  dimensions: [
    {
      id: "calidad-sueno",
      name: "Calidad global del sueño (PSQI total)",
      description:
        "Suma de los 7 componentes (C1–C7), cada uno 0–3. Score total 0–21. " +
        "Punto de corte >5: mala calidad del sueño.",
      itemIds: Array.from({ length: 7 }, (_, i) => `psqi_c${i + 1}`),
      outputField: "total",
      isComposite: false,
    },
  ],
  algorithm: {
    type: "item-sum",
    inputLevel: "individual-responses",
    steps: [
      { order: 1, description: "Administrar los 7 componentes del PSQI (0–3 cada uno)." },
      { order: 2, description: "Excluir registros con algún componente ausente o fuera del rango 0–3." },
      { order: 3, description: "Calcular el score global: suma de C1+C2+C3+C4+C5+C6+C7 (rango 0–21)." },
      { order: 4, description: "Aplicar el punto de corte: score >5 = mal dormidor (mala calidad del sueño)." },
    ],
    aggregationLevel: "municipal",
    completionCriteria: "Registro completo: valor válido (0–3) en los 7 componentes.",
    notes:
      "COMPÁS NG procesa los 7 componentes pre-calculados del PSQI. " +
      "En el instrumento original cada componente se calcula a partir de múltiples ítems. " +
      "La exportación REDCap debe incluir los scores de componente ya calculados.",
  },
  interpretation: {
    scale: { min: 0, max: 21, direction: "lower-is-better" },
    thresholds: [
      { min: 0, max: 5, label: "Buen dormidor", description: "Score ≤5: calidad del sueño adecuada." },
      { min: 6, max: 10, label: "Mal dormidor leve-moderado", description: "Score 6–10: mala calidad del sueño leve a moderada." },
      { min: 11, max: 21, label: "Mal dormidor grave", description: "Score 11–21: mala calidad del sueño grave." },
    ],
    contextualNotes: [
      "Punto de corte >5 validado para población española (Royuela & Macías, 1997).",
      "Sensibilidad 89.6 %, especificidad 86.5 % para distinguir buenos/malos dormidores.",
      "El PSQI evalúa la calidad subjetiva del sueño en el último mes.",
      "COMPÁS NG procesa los componentes pre-calculados: no recalcula desde ítems individuales.",
    ],
  },
  limitations: [
    "El PSQI evalúa el sueño del último mes: no refleja el estado habitual a largo plazo.",
    "Los 7 componentes del PSQI deben ser pre-calculados antes de exportar a REDCap.",
    "El instrumento depende de la percepción subjetiva del sueño.",
    "Sin referencia provincial disponible para comparación territorial.",
  ],
  bibliography: [
    {
      authors: "Buysse, D.J.; Reynolds, C.F.; Monk, T.H.; Berman, S.R.; Kupfer, D.J.",
      year: 1989,
      title: "The Pittsburgh Sleep Quality Index: A New Instrument for Psychiatric Practice and Research",
      source: "Psychiatry Research",
      doi: "10.1016/0165-1781(89)90047-4",
    },
    {
      authors: "Royuela Rico, A.; Macías Fernández, J.A.",
      year: 1997,
      title: "Propiedades clinimétricas de la versión castellana del Cuestionario de Pittsburgh",
      source: "Vigilia-Sueño",
      notes: "Vol. 9, nº 2, pp. 81-94. Validación española del PSQI.",
    },
  ],
  adapters: {
    redcap: {
      instrument: "monitor_psqi",
      completedColumn: "monitor_psqi_complete",
      completedValue: "2",
      columns: Array.from({ length: 7 }, (_, i) => ({
        outputField: `c${i + 1}`,
        redcapColumn: `psqi_c${i + 1}`,
        isComputed: true,
        notes: `Componente ${i + 1} PSQI pre-calculado (0–3).`,
      })),
    },
  },
  institutionalNote: {
    diagnosticInterpretation:
      "El PSQI proporciona una estimación de la prevalencia de mala calidad del sueño " +
      "en la población adulta del municipio. Un porcentaje de malos dormidores (score >5) " +
      "superior al 25–30 % señala una carga significativa de problemas de sueño. " +
      "El sueño inadecuado es un determinante conocido de mala salud mental y física.",
    implications: [
      "Cruce con SF-12 MCS y GHQ-12: la mala calidad del sueño correlaciona con peor salud mental.",
      "Cruce con SBQ (sedentarismo): el comportamiento sedentario se asocia con peor calidad del sueño.",
      "Valorar intervenciones de higiene del sueño y actividad física en el municipio.",
    ],
    publicHealthApplication: {
      measures: [
        "Prevalencia de mala calidad del sueño (PSQI >5) en la muestra adulta.",
        "Distribución del score global PSQI por rangos (≤5 / 6–10 / 11–21).",
        "Score medio PSQI global de la muestra.",
      ],
      doesNotMeasure: [
        "Causas específicas del problema de sueño ni diagnóstico de trastorno del sueño.",
        "Calidad del sueño a largo plazo: solo el último mes.",
      ],
      contextualUse: [
        "Instrumento de cribado de calidad del sueño en población adulta general.",
        "Complementa al módulo de sueño de la EAS (P33_R) con una medida más detallada.",
      ],
      commonMisinterpretations: [
        "Un score >5 no es un diagnóstico de trastorno del sueño.",
        "Los 7 componentes del PSQI deben ser calculados por el profesional, no por el sistema.",
      ],
    },
    pslIntegration: {
      chapter: "Determinantes de Salud",
      determinants: ["Calidad del sueño", "Estilos de vida"],
      contribution:
        "El PSQI aporta una medida de la calidad subjetiva del sueño en la población adulta, " +
        "complementando el módulo de sueño de la EAS y el PHQ-9 (que incluye el sueño como síntoma).",
    },
    relatedInstrumentIds: ["phq9", "ghq12", "sf12-eas"],
  },
};
