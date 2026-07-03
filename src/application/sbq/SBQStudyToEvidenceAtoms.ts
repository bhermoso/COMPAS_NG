import { createEvidenceAtom, type EvidenceAtom } from "../../domain/evidence";
import type { SBQStudy } from "../../domain/sbq";

export function sbqStudyToEvidenceAtoms(study: SBQStudy): EvidenceAtom[] {
  if (study.aggregates.nValid === 0) return [];
  const { aggregates } = study;
  const confidence = aggregates.nValid >= 30 ? "medium" : "low";

  const prevalenceAtom = createEvidenceAtom({
    id: `sbq:${study.municipalityId}:sedentarismo-alto`,
    municipalityId: study.municipalityId,
    kind: "indicator",
    title: "SBQ — Prevalencia de comportamiento altamente sedentario (>8h/día)",
    content:
      `${aggregates.pctPositive.toFixed(1)} % de la muestra adulta (n=${aggregates.nPositive} de ${aggregates.nValid} registros válidos) ` +
      `presenta comportamiento altamente sedentario (SBQ >8h/día). ` +
      `Media de tiempo sedentario: ${aggregates.meanHours.toFixed(2)} h/día. ` +
      `Distribución: bajo (≤4h) ${aggregates.nLow}, moderado (4–8h) ${aggregates.nModerate}, ` +
      `alto (>8h) ${aggregates.nHigh}. ` +
      `Fuente: ${study.sourceFileName}.`,
    confidence,
    provenance: {
      origin: "complementary-study",
      sourceLabel: study.sourceFileName,
      extractedAt: study.createdAt,
    },
    methodology: {
      description:
        "SBQ: 9 ítems sobre tiempo sedentario diario (0–4 cada uno). Conversión a horas: " +
        "0→0h, 1→0.5h, 2→1.5h, 3→3h, 4→5h. Punto de corte >8h/día. " +
        "Rosenberg et al. (2008, 2010).",
      limitations: study.methodologicalCautions,
      requiresHumanValidation: true,
    },
    tags: ["sbq", "complementary-study", "indicator", "sedentarismo"],
  });

  const cautionAtom = createEvidenceAtom({
    id: `sbq:${study.municipalityId}:cautela-metodologica`,
    municipalityId: study.municipalityId,
    kind: "methodological-caution",
    title: "SBQ — Cautela metodológica",
    content:
      "El SBQ estima el tiempo sedentario mediante una escala ordinal convertida a horas " +
      "con factores de conversión (midpoint). Las estimaciones son aproximaciones: las horas " +
      "reales pueden diferir. El comportamiento sedentario es un factor de riesgo independiente " +
      "del nivel de actividad física: una persona activa puede ser altamente sedentaria. " +
      "Los datos reflejan la muestra importada, no la población municipal completa.",
    confidence,
    provenance: {
      origin: "complementary-study",
      sourceLabel: study.sourceFileName,
      extractedAt: study.createdAt,
    },
    methodology: {
      description: "Cautela metodológica del SBQ como estudio complementario.",
      limitations: study.methodologicalCautions,
      requiresHumanValidation: true,
    },
    tags: ["sbq", "complementary-study", "methodological-caution"],
  });

  return [prevalenceAtom, cautionAtom];
}
