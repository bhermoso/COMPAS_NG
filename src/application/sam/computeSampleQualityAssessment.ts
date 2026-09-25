import type { MunicipalityId } from "../../domain/municipality";
import type { PopulationReference } from "../../domain/sam/PopulationReference";
import {
  type SampleQualityAssessment,
  type SampleQualityLevel,
  type CochranParams,
  DEFAULT_COCHRAN_PARAMS,
} from "../../domain/sam/SampleQualityAssessment";

// Z-scores para niveles de confianza estándar (tabla normal tipificada)
const Z_SCORES: Readonly<Record<number, number>> = {
  0.90: 1.645,
  0.95: 1.96,
  0.99: 2.576,
};

function getZScore(confidence: number): number {
  const z = Z_SCORES[confidence];
  if (z === undefined) {
    throw new Error(
      `Nivel de confianza no soportado: ${confidence}. Use 0.90, 0.95 o 0.99.`
    );
  }
  return z;
}

function cochranRaw(params: CochranParams): number {
  const z = getZScore(params.confidence);
  const p = params.expectedProportion;
  const e = params.marginOfError;
  return (z * z * p * (1 - p)) / (e * e);
}

// Corrección de población finita (FPC): reduce n0 cuando la muestra
// representa una fracción significativa de la población objetivo.
function applyFPC(n0: number, N: number): number {
  return Math.ceil(n0 / (1 + (n0 - 1) / N));
}

function classifyQuality(coverage: number): SampleQualityLevel {
  if (coverage >= 100) return "high";
  if (coverage >= 60) return "medium";
  return "low";
}

function buildRationale(
  quality: SampleQualityLevel,
  coverage: number,
  nObserved: number,
  nTheoretical: number
): string {
  const pct = coverage.toFixed(1);
  switch (quality) {
    case "high":
      return (
        `Calidad alta: la muestra observada (n=${nObserved}) alcanza o supera la muestra ` +
        `teórica Cochran (n=${nTheoretical}), cubriendo el ${pct} %. ` +
        `La representatividad estadística está asegurada con los parámetros estándar.`
      );
    case "medium":
      return (
        `Calidad media: la muestra observada (n=${nObserved}) cubre el ${pct} % de la muestra ` +
        `teórica Cochran (n=${nTheoretical}). Las estimaciones son operativas pero deben ` +
        `interpretarse con cautela por la cobertura parcial.`
      );
    case "low":
      return (
        `Calidad baja: la muestra observada (n=${nObserved}) solo cubre el ${pct} % de la muestra ` +
        `teórica Cochran (n=${nTheoretical}). El margen de error real supera el estándar ` +
        `previsto (±5 %). Las conclusiones tienen alcance descriptivo, no inferencial.`
      );
  }
}

function buildCautions(
  quality: SampleQualityLevel,
  coverage: number,
  populationReference: PopulationReference
): string[] {
  const cautions: string[] = [];

  if (quality === "low") {
    cautions.push(
      "Muestra insuficiente para estimaciones representativas con error ±5 % y confianza 95 %. " +
      "Las conclusiones tienen alcance descriptivo, no inferencial."
    );
  } else if (quality === "medium") {
    cautions.push(
      "Cobertura muestral parcial (60–99 % del óptimo Cochran). Se recomienda interpretar los " +
      "resultados con cautela y no extraer inferencias categóricas sobre la población."
    );
  }

  if (coverage < 100) {
    cautions.push(
      "La representatividad estadística plena no está asegurada. Se requiere valoración técnica " +
      "antes de utilizar este dato como evidencia principal en el diagnóstico territorial."
    );
  }

  cautions.push(
    `Fuente poblacional de referencia: ${populationReference.source} (${populationReference.year}). ` +
    `El tamaño muestral teórico variará si se utiliza una fuente o año distintos.`
  );

  cautions.push(
    "La calidad muestral informa sobre representatividad estadística. " +
    "No modifica los resultados del instrumento ni determina su validez metodológica."
  );

  return cautions;
}

export interface ComputeSAMInput {
  instrumentId: string;
  municipalityId: MunicipalityId;
  nObserved: number;
  populationReference: PopulationReference;
  cochranParams?: Partial<CochranParams>;
}

export function computeSampleQualityAssessment(
  input: ComputeSAMInput
): SampleQualityAssessment {
  const params: CochranParams = {
    ...DEFAULT_COCHRAN_PARAMS,
    ...input.cochranParams,
  };

  const nTheoreticalRaw = cochranRaw(params);
  const nTheoretical = applyFPC(
    nTheoreticalRaw,
    input.populationReference.populationTotal
  );
  const coverageGlobal = (input.nObserved / nTheoretical) * 100;
  const sampleQuality = classifyQuality(coverageGlobal);

  return {
    instrumentId: input.instrumentId,
    municipalityId: input.municipalityId,
    nObserved: input.nObserved,
    populationReference: input.populationReference,
    cochranParams: params,
    nTheoreticalRaw,
    nTheoretical,
    coverageGlobal,
    sampleQuality,
    sampleQualityRationale: buildRationale(
      sampleQuality,
      coverageGlobal,
      input.nObserved,
      nTheoretical
    ),
    methodologicalCautions: buildCautions(
      sampleQuality,
      coverageGlobal,
      input.populationReference
    ),
    capabilities: {
      canInferGlobalCoverage: true,
      canClassifyQuality: true,
    },
    requiresHumanValidation: true,
    computedAt: new Date().toISOString(),
  };
}
