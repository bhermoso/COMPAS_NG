import { createEvidenceAtom, type EvidenceAtom } from "../../domain/evidence";
import type { SampleQualityAssessment } from "../../domain/sam/SampleQualityAssessment";

export function samAssessmentToEvidenceAtom(
  assessment: SampleQualityAssessment
): EvidenceAtom {
  return createEvidenceAtom({
    id: `sam:${assessment.municipalityId}:${assessment.instrumentId}`,
    municipalityId: assessment.municipalityId,
    kind: "sample-quality",
    title: `SAM — Calidad muestral: ${assessment.instrumentId}`,
    content: assessment.sampleQualityRationale,
    confidence: assessment.sampleQuality,
    provenance: {
      origin: "sam",
      sourceLabel: assessment.instrumentId,
      extractedAt: assessment.computedAt,
    },
    methodology: {
      description:
        `Cochran + FPC. Confianza: ${(assessment.cochranParams.confidence * 100).toFixed(0)} %. ` +
        `Error: ±${(assessment.cochranParams.marginOfError * 100).toFixed(0)} %. ` +
        `n teórico: ${assessment.nTheoretical} ` +
        `(N = ${assessment.populationReference.populationTotal}, ` +
        `${assessment.populationReference.ageGroupLabel}). ` +
        `Cobertura: ${assessment.coverageGlobal.toFixed(1)} %. ` +
        `Fuente: ${assessment.populationReference.source} (${assessment.populationReference.year}).`,
      limitations: assessment.methodologicalCautions,
      requiresHumanValidation: true,
    },
    tags: ["sam", "sample-quality", assessment.instrumentId],
  });
}
