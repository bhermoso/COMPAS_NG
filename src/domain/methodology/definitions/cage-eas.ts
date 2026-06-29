import type { MethodologicalModule } from "../MethodologicalModule";

// Definición canónica del bloque CAGE-EAS (CAGE adaptación EAS).
//
// Estado: "draft"
// - CAGE_R y CAGE son campos derivados pre-calculados por la Encuesta Andaluza
//   de Salud. COMPÁS NG los consume directamente: no reconstituye el CAGE
//   desde los cuatro ítems originales del cuestionario (Ewing 1984).
// - items: [] — los cuatro ítems originales del CAGE no están en los
//   microdatos EAS que COMPÁS NG procesa. Solo están disponibles los
//   campos derivados CAGE_R y CAGE.
// - Categoría: "eas-official-block" porque los campos son derivados de la EAS,
//   no la implementación directa de los ítems del CAGE original (Ewing 1984).
// - Missing estructural ~18 %: corresponde a abstemios a quienes el protocolo
//   EAS no administra el test. NO es missing aleatorio.
// - Códigos EAS de no procedencia: 991.0, 994.0, 995.0, 996.0, 999.0
//   (representados como decimales en el CSV exportado).
// - Estado "draft" hasta contraste con documentación oficial de la EAS.
//
// Referencia de implementación: CAGECSVParser.ts.

export const CAGE_EAS_MODULE: MethodologicalModule = {
  identity: {
    id: "cage-eas",
    version: "1.0.0",
    status: "draft",
    category: "eas-official-block",
    name: "Riesgo de Consumo Problemático de Alcohol CAGE-EAS",
    shortName: "CAGE-EAS",
    description:
      "Bloque de la Encuesta Andaluza de Salud (EAS) basado en el cuestionario CAGE " +
      "(Ewing 1984) para la detección de riesgo de consumo problemático de alcohol. " +
      "La EAS no proporciona los 4 ítems originales del CAGE sino dos campos derivados: " +
      "CAGE_R (indicador binario de riesgo) y CAGE (clasificación ordinal 1–4).",
    purpose:
      "Estimar la prevalencia de riesgo de consumo problemático de alcohol en la " +
      "población adulta del municipio. El missing estructural debe distinguirse " +
      "del missing aleatorio: corresponde a personas abstemias a quienes el " +
      "protocolo EAS no aplica el test.",
    targetPopulation: "Población adulta bebedora (≥16 años), según protocolo EAS",
    createdAt: "2026-06-29",
  },

  source: {
    authors: "Ewing, J.A.",
    year: 1984,
    title:
      "Detecting Alcoholism: The CAGE Questionnaire",
    source: "JAMA",
    doi: "10.1001/jama.1984.03350140051025",
    institutionalBody: "Consejería de Salud y Familias, Junta de Andalucía (adaptación EAS)",
    notes:
      "El instrumento original CAGE (Ewing 1984) tiene 4 ítems dicotómicos. " +
      "La EAS calcula los campos derivados CAGE_R y CAGE sin exponer los 4 ítems " +
      "individuales en los microdatos distribuidos. " +
      "COMPÁS NG implementa el bloque EAS, no el cuestionario CAGE original.",
  },

  // Los 4 ítems originales del CAGE (Ewing 1984) no están disponibles
  // en los microdatos EAS que COMPÁS NG procesa. El sistema consume
  // directamente los campos derivados CAGE_R y CAGE.
  items: [],

  dimensions: [
    {
      id: "riesgo",
      name: "Riesgo de alcoholismo (CAGE_R)",
      description:
        "Indicador binario de riesgo de consumo problemático de alcohol. " +
        "CAGE_R = 0: sin riesgo detectado. " +
        "CAGE_R = 1: riesgo detectado. " +
        "Missing estructural ~18 %: abstemios no evaluados (no es missing aleatorio).",
      itemIds: [],
      outputField: "riesgo",
    },
    {
      id: "nivel",
      name: "Nivel de consumo (CAGE ordinal)",
      description:
        "Clasificación ordinal del nivel de consumo en cuatro categorías. " +
        "1 = bebedor social; 2 = consumo de riesgo; " +
        "3 = consumo perjudicial; 4 = dependencia alcohólica.",
      itemIds: [],
      outputField: "nivel",
    },
  ],

  algorithm: {
    type: "distribution",
    inputLevel: "pre-aggregated",
    steps: [
      {
        order: 1,
        description:
          "COMPÁS NG lee CAGE_R y CAGE del fichero EAS exportado. " +
          "Valores válidos para CAGE_R: 0 (sin riesgo) o 1 (riesgo). " +
          "Valores válidos para CAGE: 1, 2, 3 o 4 (ordinal). " +
          "Códigos de no procedencia (abstemios): 991.0, 994.0, 995.0, 996.0, 999.0 " +
          "en el CSV; se tratan como missing estructural, no aleatorio.",
      },
      {
        order: 2,
        description:
          "Se calcula la prevalencia de riesgo: porcentaje de CAGE_R = 1 " +
          "sobre el total de registros con CAGE_R válido (excluyendo el missing estructural).",
      },
      {
        order: 3,
        description:
          "Si nValidCAGE ≥ 30, se calcula la distribución por nivel: " +
          "recuento y porcentaje de cada categoría CAGE (1–4) " +
          "sobre el total de registros con CAGE válido.",
      },
    ],
    aggregationLevel: "municipal",
    completionCriteria:
      "Registro válido para CAGE_R: valor 0 o 1 (binary), excluyendo códigos EAS " +
      "de no procedencia (991.0, 994.0, 995.0, 996.0, 999.0). " +
      "El missing estructural (~18 %) no debe incluirse en el denominador " +
      "de la prevalencia de riesgo.",
    notes:
      "El missing estructural en CAGE_R corresponde a personas abstemias a quienes " +
      "el protocolo EAS no administra el test ('No procede'). " +
      "Este missing indica abstinencia, no ausencia de datos. " +
      "Una baja prevalencia de riesgo puede reflejar alta proporción de abstemios " +
      "o bajo riesgo real: ambas interpretaciones son válidas.",
  },

  interpretation: {
    scale: {
      min: 0,
      max: 100,
      direction: "lower-is-better",
    },
    thresholds: [
      {
        min: 1,
        max: 1,
        label: "Bebedor social",
        description:
          "CAGE = 1. Consumo sin indicadores de riesgo.",
      },
      {
        min: 2,
        max: 2,
        label: "Consumo de riesgo",
        description:
          "CAGE = 2. Patrón de consumo que puede derivar en dependencia.",
      },
      {
        min: 3,
        max: 3,
        label: "Consumo perjudicial",
        description:
          "CAGE = 3. Daño identificable relacionado con el consumo.",
      },
      {
        min: 4,
        max: 4,
        label: "Dependencia alcohólica",
        description:
          "CAGE = 4. Indicadores de dependencia del alcohol.",
      },
    ],
    contextualNotes: [
      "El missing estructural (~18 % en EAS Granada) no es missing aleatorio: " +
      "corresponde a personas abstemias no evaluadas.",
      "La prevalencia de riesgo (CAGE_R = 1) se calcula sobre los evaluados, " +
      "no sobre el total de la muestra.",
      "Cuando nRisk < 10 los porcentajes deben interpretarse con extrema precaución.",
      "Los ítems de consumo episódico masivo (binge drinking) de la EAS " +
      "no forman parte de este módulo: son instrumentos distintos.",
      "Una muestra inferior a 30 registros CAGE_R válidos limita la interpretación.",
    ],
  },

  limitations: [
    "COMPÁS NG consume los campos derivados CAGE_R y CAGE: no tiene acceso " +
    "a los 4 ítems originales del cuestionario CAGE (Ewing 1984).",
    "El missing estructural debe declararse explícitamente en toda comunicación " +
    "de resultados para evitar sobreestimar la prevalencia de riesgo.",
    "Las categorías ordinales del CAGE (1–4) son propias de la codificación EAS " +
    "y pueden diferir de otras clasificaciones publicadas del CAGE.",
    "Baja prevalencia de riesgo puede deberse a alta tasa de abstinencia o a " +
    "consumo real bajo: la muestra EAS no permite distinguirlos sin datos adicionales.",
    "No permite análisis por subgrupos sin acceso a los registros individuales.",
    "Contraste con documentación oficial EAS de la codificación CAGE_R y CAGE pendiente.",
  ],

  bibliography: [
    {
      authors: "Ewing, J.A.",
      year: 1984,
      title: "Detecting Alcoholism: The CAGE Questionnaire",
      source: "JAMA",
      doi: "10.1001/jama.1984.03350140051025",
      notes:
        "Instrumento original. Los 4 ítems CAGE no son procesados directamente " +
        "por COMPÁS NG: la EAS proporciona los campos derivados CAGE_R y CAGE.",
    },
  ],

  adapters: {
    sav: {
      referenceFile: "EAS_microdatos_adulto_READY.csv",
      variables: [
        {
          outputField: "riesgo",
          savVariable: "CAGE_R",
          label: "Indicador binario de riesgo de alcoholismo (CAGE_R)",
          valueLabels: [
            { value: 0, label: "Sin riesgo detectado" },
            { value: 1, label: "Riesgo detectado" },
          ],
          // Missing estructural EAS (abstemios: no procede)
          // Representados como decimales en el CSV exportado: 991.0, 994.0, 995.0, 996.0, 999.0
          missingValues: [991, 994, 995, 996, 999],
          measurementLevel: "nominal",
          waveCompatibility: {
            notes: "Missing estructural ~18 % en EAS Granada (abstemios no evaluados).",
          },
        },
        {
          outputField: "nivel",
          savVariable: "CAGE",
          label: "Nivel ordinal de consumo de alcohol (CAGE 1–4)",
          valueLabels: [
            { value: 1, label: "Bebedor social" },
            { value: 2, label: "Consumo de riesgo" },
            { value: 3, label: "Consumo perjudicial" },
            { value: 4, label: "Dependencia alcohólica" },
          ],
          missingValues: [991, 994, 995, 996, 999],
          measurementLevel: "ordinal",
        },
      ],
    },
  },
};
