import { createEvidenceAtom, type EvidenceAtom } from "../../domain/evidence";
import type { GHQ12Study } from "../../domain/ghq12";

export function ghq12StudyToEvidenceAtoms(study: GHQ12Study): EvidenceAtom[] {
  if (study.aggregates.nValid === 0) return [];

  const { aggregates } = study;
  const confidence = aggregates.nValid >= 30 ? "medium" : "low";

  const prevalenceAtom = createEvidenceAtom({
    id: `ghq12:${study.municipalityId}:malestar-psicologico`,
    municipalityId: study.municipalityId,
    kind: "indicator",
    title: "GHQ-12 — Prevalencia de probable malestar psicológico",
    content:
      `${aggregates.pctPositive.toFixed(1)} % de la muestra adulta (n=${aggregates.nPositive} de ${aggregates.nValid} registros válidos) ` +
      `presenta un score GHQ-12 bimodal ≥ 3 (probable malestar psicológico). ` +
      `Score bimodal medio: ${aggregates.meanBimodal.toFixed(2)}/12. ` +
      `Distribución: sin indicadores (0–2) ${aggregates.nScore0to2} personas, ` +
      `probable caso leve-moderado (3–6) ${aggregates.nScore3to6}, ` +
      `probable caso moderado-grave (7–12) ${aggregates.nScore7to12}. ` +
      `Fuente: ${study.sourceFileName}.`,
    confidence,
    provenance: {
      origin: "complementary-study",
      sourceLabel: study.sourceFileName,
      extractedAt: study.createdAt,
    },
    methodology: {
      description:
        "GHQ-12: 12 ítems sobre estado de salud mental en las últimas semanas. Scoring bimodal " +
        "(0/0/1/1): valores 0,1 → 0; valores 2,3 → 1. Score total 0–12. Punto de corte ≥3. " +
        "Validado en España: Sánchez-López & Dresch (2008), Psicothema.",
      limitations: study.methodologicalCautions,
      requiresHumanValidation: true,
    },
    tags: ["ghq12", "complementary-study", "indicator", "salud-mental"],
  });

  const cautionAtom = createEvidenceAtom({
    id: `ghq12:${study.municipalityId}:cautela-metodologica`,
    municipalityId: study.municipalityId,
    kind: "methodological-caution",
    title: "GHQ-12 — Cautela metodológica",
    content:
      "El GHQ-12 es un instrumento de cribado de malestar psicológico, no un instrumento diagnóstico. " +
      "Un score ≥3 (scoring bimodal) indica probable malestar psicológico que requeriría evaluación " +
      "clínica adicional para confirmar cualquier diagnóstico. " +
      "El instrumento evalúa el estado de las últimas semanas: los resultados pueden variar " +
      "significativamente en función del momento de recogida. " +
      "No mide dominios específicos (ansiedad vs. depresión) sino malestar general. " +
      "Los datos reflejan la muestra importada, no la población municipal completa.",
    confidence,
    provenance: {
      origin: "complementary-study",
      sourceLabel: study.sourceFileName,
      extractedAt: study.createdAt,
    },
    methodology: {
      description: "Cautela metodológica del GHQ-12 como estudio complementario de salud mental.",
      limitations: study.methodologicalCautions,
      requiresHumanValidation: true,
    },
    tags: ["ghq12", "complementary-study", "methodological-caution"],
  });

  return [prevalenceAtom, cautionAtom];
}
