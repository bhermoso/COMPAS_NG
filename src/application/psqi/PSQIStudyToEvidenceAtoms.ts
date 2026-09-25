import { createEvidenceAtom, type EvidenceAtom } from "../../domain/evidence";
import type { PSQIStudy } from "../../domain/psqi";

export function psqiStudyToEvidenceAtoms(study: PSQIStudy): EvidenceAtom[] {
  if (study.aggregates.nValid === 0) return [];
  const { aggregates } = study;
  const confidence = aggregates.nValid >= 30 ? "medium" : "low";

  const prevalenceAtom = createEvidenceAtom({
    id: `psqi:${study.municipalityId}:mala-calidad-sueno`,
    municipalityId: study.municipalityId,
    kind: "indicator",
    title: "PSQI — Prevalencia de mala calidad del sueño",
    content:
      `${aggregates.pctPositive.toFixed(1)} % de la muestra adulta (n=${aggregates.nPositive} de ${aggregates.nValid} registros válidos) ` +
      `presenta mala calidad del sueño (PSQI global >5). ` +
      `Score medio: ${aggregates.meanScore.toFixed(2)}/21. ` +
      `Distribución: buen dormidor (≤5) ${aggregates.nScore0to5}, ` +
      `mal dormidor leve-moderado (6–10) ${aggregates.nScore6to10}, ` +
      `mal dormidor grave (11–21) ${aggregates.nScore11to21}. ` +
      `Fuente: ${study.sourceFileName}.`,
    confidence,
    provenance: {
      origin: "complementary-study",
      sourceLabel: study.sourceFileName,
      extractedAt: study.createdAt,
    },
    methodology: {
      description:
        "PSQI: 7 componentes pre-calculados (C1–C7), cada uno 0–3. Score global 0–21. " +
        "Punto de corte >5 para mala calidad del sueño. Buysse et al. (1989). " +
        "Validado en España: Royuela & Macías (1997).",
      limitations: study.methodologicalCautions,
      requiresHumanValidation: true,
    },
    tags: ["psqi", "complementary-study", "indicator", "sueno"],
  });

  const cautionAtom = createEvidenceAtom({
    id: `psqi:${study.municipalityId}:cautela-metodologica`,
    municipalityId: study.municipalityId,
    kind: "methodological-caution",
    title: "PSQI — Cautela metodológica",
    content:
      "El PSQI evalúa la calidad subjetiva del sueño del último mes: no refleja el estado habitual a largo plazo. " +
      "COMPÁS NG procesa los 7 componentes pre-calculados: los componentes deben ser calculados " +
      "por el profesional antes de exportar desde REDCap. " +
      "Un score >5 identifica al participante como 'mal dormidor' pero no equivale a diagnóstico " +
      "de trastorno del sueño. Los datos reflejan la muestra importada, no la población completa.",
    confidence,
    provenance: {
      origin: "complementary-study",
      sourceLabel: study.sourceFileName,
      extractedAt: study.createdAt,
    },
    methodology: {
      description: "Cautela metodológica del PSQI como estudio complementario.",
      limitations: study.methodologicalCautions,
      requiresHumanValidation: true,
    },
    tags: ["psqi", "complementary-study", "methodological-caution"],
  });

  return [prevalenceAtom, cautionAtom];
}
