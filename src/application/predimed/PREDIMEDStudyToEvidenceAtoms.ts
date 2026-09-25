import { createEvidenceAtom, type EvidenceAtom } from "../../domain/evidence";
import type { PREDIMEDStudy } from "../../domain/predimed";

function formatPercent(value: number): string {
  return `${value.toFixed(1)} %`;
}

export function predimedStudyToEvidenceAtoms(study: PREDIMEDStudy): EvidenceAtom[] {
  if (study.aggregates.nValid === 0) {
    return [];
  }

  const { aggregates } = study;
  const confidence = aggregates.nValid >= 30 ? "medium" : "low";

  const indicatorAtom = createEvidenceAtom({
    id: `predimed-eas:${study.municipalityId}:adherencia`,
    municipalityId: study.municipalityId,
    kind: "indicator",
    title: "PREDIMED-EAS - Adherencia a dieta mediterranea",
    content:
      `Puntuacion media PREDIMED-14: ${aggregates.meanScore}/14. ` +
      `Alta adherencia (>= 9): ${aggregates.highCount} de ${aggregates.nValid} registros validos (${formatPercent(aggregates.highPercentage)}). ` +
      `Adherencia media (7-8): ${aggregates.mediumCount} (${formatPercent(aggregates.mediumPercentage)}). ` +
      `Baja adherencia (<= 6): ${aggregates.lowCount} (${formatPercent(aggregates.lowPercentage)}). ` +
      `Registros sin puntuacion calculable: ${aggregates.incompleteCount} de ${aggregates.n}. ` +
      `Fuente: ${study.sourceFileName}.`,
    confidence,
    provenance: {
      origin: "complementary-study",
      sourceLabel: study.sourceFileName,
      extractedAt: study.createdAt,
    },
    methodology: {
      description:
        "Agregado municipal calculado desde CSV PREDIMED-EAS. " +
        "Puntuacion canonica del campo derivado EAS cuando esta disponible; " +
        "en caso contrario, suma de los 14 items P36BPD01..P36BPD14_2023.",
      limitations: study.methodologicalCautions,
      requiresHumanValidation: true,
    },
    tags: ["predimed-eas", "eas", "complementary-study", "indicator", "alimentacion"],
  });

  const cautionAtom = createEvidenceAtom({
    id: `predimed-eas:${study.municipalityId}:cautela-metodologica`,
    municipalityId: study.municipalityId,
    kind: "methodological-caution",
    title: "PREDIMED-EAS - Cautela metodologica",
    content:
      "El indice PREDIMED-14 mide adherencia a la dieta mediterranea mediante 14 items dicotomicos. " +
      "Los cortes (baja <= 6, media 7-8, alta >= 9) siguen a Martinez-Gonzalez (2012) adaptados a la EAS de Andalucia. " +
      "No es instrumento clinico ni genera decisiones automaticas. " +
      "Debe usarse como evidencia complementaria para interpretacion tecnica validada.",
    confidence,
    provenance: {
      origin: "complementary-study",
      sourceLabel: study.sourceFileName,
      extractedAt: study.createdAt,
    },
    methodology: {
      description:
        "Cautela metodologica asociada al procesamiento PREDIMED-EAS como estudio complementario concreto.",
      limitations: study.methodologicalCautions,
      requiresHumanValidation: true,
    },
    tags: ["predimed-eas", "eas", "complementary-study", "methodological-caution"],
  });

  return [indicatorAtom, cautionAtom];
}
