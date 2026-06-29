import type { MethodologicalModule } from "../MethodologicalModule";

// Definición canónica del SF-12v2 en su adaptación EAS (SF-12 EAS).
//
// Estado: "draft"
// - COMPÁS NG no procesa los 12 ítems originales del SF-12.
//   Consume los componentes sumarios PCS12_SP y MCS12_SP pre-calculados
//   por la Encuesta Andaluza de Salud aplicando los coeficientes de la
//   norma española (Vilagut et al. 2008).
// - items: [] — los ítems originales del SF-12 no son procesados por el sistema.
// - El módulo declara los dos campos derivados EAS como outputs canónicos
//   a través del adaptador SAV.
// - Bibliografía: Vilagut 2008 identificada; contraste completo con el artículo
//   original pendiente.
// - Estado "draft" hasta completar ese contraste bibliográfico.
//
// Referencia de implementación: SF12CSVParser.ts.

export const SF12_EAS_MODULE: MethodologicalModule = {
  identity: {
    id: "sf12-eas",
    version: "1.0.0",
    status: "draft",
    category: "validated-scale",
    name: "Cuestionario de Salud SF-12 EAS",
    shortName: "SF-12 EAS",
    description:
      "Cuestionario SF-12v2 (Medical Outcomes Study Short Form 12) en su adaptación " +
      "para la Encuesta Andaluza de Salud (EAS). Mide la calidad de vida relacionada " +
      "con la salud mediante dos componentes sumarios: Componente Físico (PCS) y " +
      "Componente Mental (MCS).",
    purpose:
      "Evaluar la salud percibida de la población adulta en sus dimensiones física " +
      "y mental como indicador de calidad de vida relacionada con la salud. " +
      "Los componentes sumarios permiten comparación con la norma poblacional española.",
    targetPopulation: "Población adulta (≥16 años), según EAS",
    createdAt: "2026-06-29",
  },

  source: {
    authors: "Ware, J.E.; Kosinski, M.; Keller, S.D.",
    year: 1996,
    title: "A 12-Item Short-Form Health Survey: Construction of Scales and Preliminary Tests of Reliability and Validity",
    source: "Medical Care",
    institutionalBody: "Consejería de Salud y Familias, Junta de Andalucía (adaptación EAS)",
    notes:
      "Norma española aplicada por la EAS: Vilagut G et al. " +
      "El Cuestionario de Salud SF-36 español: una década de experiencia y nuevos desarrollos. " +
      "Med Clin (Barc). 2005;126(3):99-104. " +
      "Artículo de validación PCS/MCS norma española: " +
      "Vilagut G et al. Med Clin (Barc). 2008;130(19):726-735. " +
      "COMPÁS NG consume los componentes sumarios pre-calculados por la EAS " +
      "aplicando esos coeficientes factoriales. No recalcula PCS ni MCS desde los 12 ítems.",
  },

  // Los 12 ítems originales del SF-12 no son procesados por COMPÁS NG.
  // La EAS calcula PCS12_SP y MCS12_SP aplicando el algoritmo factorial oblicuo
  // con los 36 coeficientes de la norma española (Vilagut 2008).
  // COMPÁS NG consume directamente esos campos pre-calculados.
  items: [],

  dimensions: [
    {
      id: "pcs",
      name: "Componente Físico de Salud (PCS)",
      description:
        "Componente sumario físico. Pre-calculado por la EAS aplicando los " +
        "coeficientes factoriales de la norma española (Vilagut 2008). " +
        "Escala 0–100. Media poblacional española ≈ 50, DT ≈ 10. " +
        "Mayor puntuación indica mejor salud física percibida.",
      itemIds: [],
      outputField: "pcs",
    },
    {
      id: "mcs",
      name: "Componente Mental de Salud (MCS)",
      description:
        "Componente sumario mental. Pre-calculado por la EAS aplicando los " +
        "coeficientes factoriales de la norma española (Vilagut 2008). " +
        "Escala 0–100. Media poblacional española ≈ 50, DT ≈ 10. " +
        "Mayor puntuación indica mejor salud mental percibida.",
      itemIds: [],
      outputField: "mcs",
    },
  ],

  algorithm: {
    type: "custom",
    inputLevel: "pre-aggregated",
    steps: [
      {
        order: 1,
        description:
          "La EAS administra los 12 ítems del SF-12v2 y aplica el algoritmo factorial " +
          "oblicuo con los 36 coeficientes de la norma española (Vilagut 2008), " +
          "produciendo los campos PCS12_SP y MCS12_SP por participante.",
      },
      {
        order: 2,
        description:
          "COMPÁS NG lee PCS12_SP y MCS12_SP del fichero EAS exportado. " +
          "Calcula la media de cada componente sobre los registros válidos del municipio. " +
          "Un registro es válido si el campo tiene un valor numérico en rango 0–100.",
      },
      {
        order: 3,
        description:
          "Se producen dos agregados municipales: media PCS y media MCS, " +
          "con recuento de registros válidos y registros sin puntuación.",
      },
    ],
    aggregationLevel: "municipal",
    completionCriteria:
      "Registro válido: campo PCS12_SP y/o MCS12_SP con valor numérico finito. " +
      "Un registro puede ser válido para PCS e inválido para MCS o viceversa.",
    notes:
      "COMPÁS NG no recalcula PCS ni MCS desde los 12 ítems porque el algoritmo " +
      "factorial oblicuo requiere los 36 coeficientes específicos de la norma española. " +
      "El campo canónico es PCS12_SP / MCS12_SP tal como los produce la EAS.",
  },

  interpretation: {
    scale: {
      min: 0,
      max: 100,
      direction: "higher-is-better",
    },
    referenceValues: {
      population: "Población general española (Vilagut et al. 2008)",
      mean: 50,
      sd: 10,
      source: "Vilagut G et al. Med Clin (Barc). 2008;130(19):726-735.",
    },
    contextualNotes: [
      "Escala norm-based: la media de la población española de referencia es 50 puntos.",
      "Una desviación estándar equivale a 10 puntos en la escala.",
      "PCS y MCS miden dimensiones independientes: una persona puede tener PCS bajo y MCS alto.",
      "No existen umbrales clínicos dicotómicos publicados para PCS/MCS en contexto EAS.",
      "La comparación territorial requiere que las muestras sean metodológicamente equivalentes.",
    ],
  },

  limitations: [
    "PCS12_SP y MCS12_SP son puntuaciones pre-calculadas por la EAS: " +
    "COMPÁS NG no puede verificar el cálculo ni corregir posibles errores de la fuente.",
    "El algoritmo factorial oblicuo (Vilagut 2008) requiere los 36 coeficientes " +
    "de la norma española; no es reproducible sin ellos desde los ítems crudos.",
    "Los resultados son agregados de la muestra importada: " +
    "no permiten análisis por subgrupos sin acceso a los registros individuales.",
    "La comparación entre municipios requiere que las muestras sean " +
    "metodológicamente equivalentes (misma oleada EAS, mismo protocolo de administración).",
    "No genera umbrales de clasificación categórica: " +
    "cualquier clasificación futura requiere referencia metodológica explícita.",
    "Contraste bibliográfico completo con el artículo original del SF-12v2 pendiente.",
  ],

  bibliography: [
    {
      authors: "Ware, J.E.; Kosinski, M.; Keller, S.D.",
      year: 1996,
      title:
        "A 12-Item Short-Form Health Survey: Construction of Scales and " +
        "Preliminary Tests of Reliability and Validity",
      source: "Medical Care",
      notes: "Instrumento original SF-12.",
    },
    {
      authors: "Vilagut, G. et al.",
      year: 2008,
      title:
        "El Cuestionario de Salud SF-12: evaluación del uso en España con datos " +
        "normativos de la Encuesta Nacional de Salud",
      source: "Medicina Clínica (Barcelona)",
      notes:
        "Med Clin (Barc). 2008;130(19):726-735. " +
        "Fuente de los coeficientes factoriales de la norma española " +
        "aplicados por la EAS para calcular PCS12_SP y MCS12_SP.",
    },
  ],

  adapters: {
    sav: {
      referenceFile: "EAS_microdatos_adulto_READY.csv",
      variables: [
        {
          outputField: "pcs",
          savVariable: "PCS12_SP",
          label: "Componente físico sumario SF-12 (norma española, Vilagut 2008)",
          measurementLevel: "scale",
          derivation:
            "Pre-calculado por la EAS aplicando los coeficientes factoriales " +
            "de la norma española (Vilagut et al. 2008). Escala 0–100.",
        },
        {
          outputField: "mcs",
          savVariable: "MCS12_SP",
          label: "Componente mental sumario SF-12 (norma española, Vilagut 2008)",
          measurementLevel: "scale",
          derivation:
            "Pre-calculado por la EAS aplicando los coeficientes factoriales " +
            "de la norma española (Vilagut et al. 2008). Escala 0–100.",
        },
      ],
    },
  },
};
