import { createEvidenceAtom, type EvidenceAtom } from "../../domain/evidence";
import type { PHQ9Study } from "../../domain/phq9";

export function phq9StudyToEvidenceAtoms(study: PHQ9Study): EvidenceAtom[] {
  if (study.aggregates.nValid === 0) return [];
  const { aggregates } = study;
  const confidence = aggregates.nValid >= 30 ? "medium" : "low";

  const prevalenceAtom = createEvidenceAtom({
    id: `phq9:${study.municipalityId}:sintomas-depresivos`,
    municipalityId: study.municipalityId,
    kind: "indicator",
    title: "PHQ-9 — Prevalencia de síntomas depresivos moderados o superiores",
    content:
      `${aggregates.pctPositive.toFixed(1)} % de la muestra adulta (n=${aggregates.nPositive} de ${aggregates.nValid} registros válidos) ` +
      `presenta síntomas depresivos moderados o superiores (PHQ-9 ≥ 10). ` +
      `Score medio: ${aggregates.meanScore.toFixed(2)}/27. ` +
      `Distribución: mínimo (0–4) ${aggregates.nScore0to4}, leve (5–9) ${aggregates.nScore5to9}, ` +
      `moderado (10–14) ${aggregates.nScore10to14}, mod.grave (15–19) ${aggregates.nScore15to19}, ` +
      `grave (≥20) ${aggregates.nScore20to27}. ` +
      `Fuente: ${study.sourceFileName}.`,
    confidence,
    provenance: {
      origin: "complementary-study",
      sourceLabel: study.sourceFileName,
      extractedAt: study.createdAt,
    },
    methodology: {
      description:
        "PHQ-9: 9 ítems sobre síntomas depresivos de las últimas 2 semanas (0–3 cada uno). Score 0–27. " +
        "Punto de corte ≥10 para depresión moderada o superior. Kroenke et al. (2001).",
      limitations: study.methodologicalCautions,
      requiresHumanValidation: true,
    },
    tags: ["phq9", "complementary-study", "indicator", "salud-mental"],
  });

  const cautionAtom = createEvidenceAtom({
    id: `phq9:${study.municipalityId}:cautela-metodologica`,
    municipalityId: study.municipalityId,
    kind: "methodological-caution",
    title: "PHQ-9 — Cautela metodológica",
    content:
      "El PHQ-9 es un instrumento de cribado de síntomas depresivos, no diagnóstico. " +
      "Un score ≥10 indica probable depresión moderada o superior: requiere evaluación clínica. " +
      "IMPORTANTE: El ítem 9 (ideación suicida) requiere protocolo de derivación específico. " +
      "El PHQ-9 evalúa los síntomas de las últimas 2 semanas, no el estado crónico. " +
      "Los datos reflejan la muestra importada, no la población municipal completa.",
    confidence,
    provenance: {
      origin: "complementary-study",
      sourceLabel: study.sourceFileName,
      extractedAt: study.createdAt,
    },
    methodology: {
      description: "Cautela metodológica del PHQ-9 como estudio complementario.",
      limitations: study.methodologicalCautions,
      requiresHumanValidation: true,
    },
    tags: ["phq9", "complementary-study", "methodological-caution"],
  });

  return [prevalenceAtom, cautionAtom];
}
