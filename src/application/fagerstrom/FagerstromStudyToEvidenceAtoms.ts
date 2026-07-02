import { createEvidenceAtom, type EvidenceAtom } from "../../domain/evidence";
import type { FagerstromStudy } from "../../domain/fagerstrom";

export function fagerstromStudyToEvidenceAtoms(study: FagerstromStudy): EvidenceAtom[] {
  if (study.aggregates.nValid === 0) return [];
  const { aggregates } = study;
  const confidence = aggregates.nValid >= 30 ? "medium" : "low";

  const prevalenceAtom = createEvidenceAtom({
    id: `fagerstrom:${study.municipalityId}:dependencia-nicotina`,
    municipalityId: study.municipalityId,
    kind: "indicator",
    title: "Fagerström (FTND) — Dependencia moderada o superior a la nicotina",
    content:
      `${aggregates.pctPositive.toFixed(1)} % de la muestra de fumadores activos (n=${aggregates.nPositive} de ${aggregates.nValid} evaluados) ` +
      `presenta dependencia moderada o superior a la nicotina (FTND ≥5). ` +
      `Score medio: ${aggregates.meanScore.toFixed(2)}/10. ` +
      `Distribución: muy baja (0–2) ${aggregates.nVeryLow}, baja (3–4) ${aggregates.nLow}, ` +
      `moderada (5) ${aggregates.nModerate}, alta (6–7) ${aggregates.nHigh}, muy alta (8–10) ${aggregates.nVeryHigh}. ` +
      `Fuente: ${study.sourceFileName}. Solo fumadores activos.`,
    confidence,
    provenance: {
      origin: "complementary-study",
      sourceLabel: study.sourceFileName,
      extractedAt: study.createdAt,
    },
    methodology: {
      description:
        "FTND: 6 ítems sobre dependencia física a la nicotina. Score 0–10. " +
        "Punto de corte ≥5 para dependencia moderada o superior. Solo fumadores activos. " +
        "Heatherton et al. (1991). Validado en España: Becoña & Vázquez (1998).",
      limitations: study.methodologicalCautions,
      requiresHumanValidation: true,
    },
    tags: ["fagerstrom", "complementary-study", "indicator", "tabaquismo"],
  });

  const cautionAtom = createEvidenceAtom({
    id: `fagerstrom:${study.municipalityId}:cautela-metodologica`,
    municipalityId: study.municipalityId,
    kind: "methodological-caution",
    title: "Fagerström — Cautela metodológica",
    content:
      "El Test de Fagerström solo se administra a fumadores activos. Los resultados reflejan " +
      "la distribución de dependencia tabáquica en la submuestra de fumadores, no en la " +
      "población adulta total. " +
      "El instrumento mide dependencia física a la nicotina: la dependencia psicológica " +
      "no está incluida. Un score bajo no implica que sea fácil dejar de fumar. " +
      "Los datos reflejan la muestra importada, no la población completa del municipio.",
    confidence,
    provenance: {
      origin: "complementary-study",
      sourceLabel: study.sourceFileName,
      extractedAt: study.createdAt,
    },
    methodology: {
      description: "Cautela metodológica del Test de Fagerström como estudio complementario.",
      limitations: study.methodologicalCautions,
      requiresHumanValidation: true,
    },
    tags: ["fagerstrom", "complementary-study", "methodological-caution"],
  });

  return [prevalenceAtom, cautionAtom];
}
