import { createEvidenceAtom, type EvidenceAtom } from "../../domain/evidence";
import type { IPAQStudy } from "../../domain/ipaq";

export function ipaqStudyToEvidenceAtoms(study: IPAQStudy): EvidenceAtom[] {
  const { aggregates } = study;

  // Necesitamos al menos uno de los dos indicadores con datos válidos
  if (aggregates.nValidIPAQ === 0 && aggregates.nValidP34AR === 0) return [];

  const confidence =
    Math.max(aggregates.nValidIPAQ, aggregates.nValidP34AR) >= 30 ? "medium" : "low";

  const atoms: EvidenceAtom[] = [];

  if (aggregates.nValidIPAQ > 0) {
    const pctNoHigh = aggregates.nValidIPAQ > 0
      ? (100 - aggregates.pctHigh).toFixed(1)
      : "0.0";
    const actividadAtom = createEvidenceAtom({
      id: `ipaq-eas:${study.municipalityId}:actividad-alta`,
      municipalityId: study.municipalityId,
      kind: "indicator",
      title: "IPAQ-EAS - Alta actividad física (IPAQ_DICO)",
      content:
        `${aggregates.pctHigh.toFixed(1)} % de la muestra con IPAQ_DICO presenta alta actividad física ` +
        `(≥600 MET-min/sem o ≥150 min/sem vigorosa) según el campo derivado oficial de la EAS. ` +
        `n con alta actividad: ${aggregates.nHigh} de ${aggregates.nValidIPAQ} válidos. ` +
        `Nivel no-alto (bajo o moderado): ${pctNoHigh} % (n=${aggregates.nValidIPAQ - aggregates.nHigh}). ` +
        `Missing / no evaluado: ${aggregates.missingIPAQ} de ${aggregates.n}. ` +
        `Fuente: ${study.sourceFileName}. ` +
        `Campo derivado oficial EAS — no recalculado desde ítems crudos.`,
      confidence,
      provenance: {
        origin: "complementary-study",
        sourceLabel: study.sourceFileName,
        extractedAt: study.createdAt,
      },
      methodology: {
        description:
          "IPAQ_DICO es un campo derivado pre-calculado por la EAS que clasifica la actividad " +
          "física en dos categorías: alta (1) y no-alta (0). " +
          "COMPÁS NG lo consume directamente sin reconstruirlo desde ítems individuales.",
        limitations: study.methodologicalCautions,
        requiresHumanValidation: true,
      },
      tags: ["ipaq-eas", "eas", "complementary-study", "indicator", "actividad-fisica"],
    });
    atoms.push(actividadAtom);
  }

  if (aggregates.nValidP34AR > 0) {
    const pctActive = aggregates.nValidP34AR > 0
      ? (100 - aggregates.pctInactive).toFixed(1)
      : "0.0";
    const inactividadAtom = createEvidenceAtom({
      id: `ipaq-eas:${study.municipalityId}:inactividad-tiempo-libre`,
      municipalityId: study.municipalityId,
      kind: "indicator",
      title: "IPAQ-EAS - Inactividad en tiempo libre (P34A_R)",
      content:
        `${aggregates.pctInactive.toFixed(1)} % de la muestra adulta es inactiva en tiempo libre ` +
        `(P34A_R = 1: no realiza actividad física en el ocio). ` +
        `n inactivos: ${aggregates.nInactive} de ${aggregates.nValidP34AR} válidos. ` +
        `Activos en tiempo libre: ${pctActive} % (n=${aggregates.nValidP34AR - aggregates.nInactive}). ` +
        `Missing: ${aggregates.missingP34AR} de ${aggregates.n}. ` +
        `Fuente: ${study.sourceFileName}.`,
      confidence,
      provenance: {
        origin: "complementary-study",
        sourceLabel: study.sourceFileName,
        extractedAt: study.createdAt,
      },
      methodology: {
        description:
          "P34A_R es un campo derivado de la EAS que identifica si la persona realiza " +
          "actividad física en su tiempo libre. COMPÁS NG lo consume directamente.",
        limitations: study.methodologicalCautions,
        requiresHumanValidation: true,
      },
      tags: ["ipaq-eas", "eas", "complementary-study", "indicator", "actividad-fisica"],
    });
    atoms.push(inactividadAtom);
  }

  const cautionAtom = createEvidenceAtom({
    id: `ipaq-eas:${study.municipalityId}:cautela-metodologica`,
    municipalityId: study.municipalityId,
    kind: "methodological-caution",
    title: "IPAQ-EAS - Cautela metodológica",
    content:
      "IPAQ_DICO y P34A_R son indicadores propios de la EAS para monitorización de la " +
      "actividad física en la población andaluza. " +
      "COMPÁS NG los consume directamente sin recalcular los MET-min desde ítems individuales. " +
      "El missing sustancial en IPAQ_DICO (~48 % en Granada) puede reflejar personas mayores " +
      "u otros grupos no evaluados: no debe ignorarse en la interpretación. " +
      "IPAQ_DICO = 0 incluye actividad baja y moderada: no equivale a sedentarismo. " +
      "P34A_R solo evalúa el tiempo libre, no la actividad laboral ni doméstica. " +
      "Los datos reflejan la muestra EAS provincial, no la población de ningún municipio concreto.",
    confidence,
    provenance: {
      origin: "complementary-study",
      sourceLabel: study.sourceFileName,
      extractedAt: study.createdAt,
    },
    methodology: {
      description: "Cautela metodológica asociada al procesamiento de IPAQ-EAS como estudio complementario.",
      limitations: study.methodologicalCautions,
      requiresHumanValidation: true,
    },
    tags: ["ipaq-eas", "eas", "complementary-study", "methodological-caution"],
  });

  atoms.push(cautionAtom);
  return atoms;
}
