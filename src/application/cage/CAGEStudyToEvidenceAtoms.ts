import { createEvidenceAtom, type EvidenceAtom } from "../../domain/evidence";
import type { CAGEStudy } from "../../domain/cage";

export function cageStudyToEvidenceAtoms(study: CAGEStudy): EvidenceAtom[] {
  if (study.aggregates.nValidCAGER === 0) return [];

  const { aggregates } = study;
  const confidence = aggregates.nValidCAGER >= 30 ? "medium" : "low";

  const riskAtom = createEvidenceAtom({
    id: `cage-eas:${study.municipalityId}:riesgo-alcoholismo`,
    municipalityId: study.municipalityId,
    kind: "indicator",
    title: "CAGE-EAS - Riesgo de alcoholismo (CAGE_R)",
    content:
      `${aggregates.pctRisk.toFixed(1)} % de la muestra con CAGE_R presenta riesgo de alcoholismo ` +
      `según el campo derivado oficial de la EAS. ` +
      `n con riesgo: ${aggregates.nRisk} de ${aggregates.nValidCAGER} válidos. ` +
      `Missing / no procede (abstinentes): ${aggregates.missingCAGER} de ${aggregates.n}. ` +
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
        "CAGE_R es un campo derivado pre-calculado por la EAS que clasifica el riesgo de alcoholismo. " +
        "COMPÁS NG lo consume directamente sin reconstruirlo desde ítems individuales.",
      limitations: study.methodologicalCautions,
      requiresHumanValidation: true,
    },
    tags: ["cage-eas", "eas", "complementary-study", "indicator", "alcohol"],
  });

  const atoms: EvidenceAtom[] = [riskAtom];

  if (aggregates.nValidCAGE >= 30) {
    const nRiesgoOPerjudicial = aggregates.nCAGE2 + aggregates.nCAGE3 + aggregates.nCAGE4;
    const ordinalAtom = createEvidenceAtom({
      id: `cage-eas:${study.municipalityId}:clasificacion-consumo`,
      municipalityId: study.municipalityId,
      kind: "indicator",
      title: "CAGE-EAS - Clasificación ordinal de consumo (CAGE)",
      content:
        `Entre los ${aggregates.nValidCAGE} registros con CAGE válido: ` +
        `${aggregates.nCAGE1} bebedores sociales (${((aggregates.nCAGE1 / aggregates.nValidCAGE) * 100).toFixed(1)} %), ` +
        `${aggregates.nCAGE2} consumo de riesgo (${((aggregates.nCAGE2 / aggregates.nValidCAGE) * 100).toFixed(1)} %), ` +
        `${aggregates.nCAGE3} consumo perjudicial (${((aggregates.nCAGE3 / aggregates.nValidCAGE) * 100).toFixed(1)} %), ` +
        `${aggregates.nCAGE4} dependencia alcohólica (${((aggregates.nCAGE4 / aggregates.nValidCAGE) * 100).toFixed(1)} %). ` +
        `Consumo de riesgo o superior: ${nRiesgoOPerjudicial} personas. ` +
        `Fuente: ${study.sourceFileName}.`,
      confidence,
      provenance: {
        origin: "complementary-study",
        sourceLabel: study.sourceFileName,
        extractedAt: study.createdAt,
      },
      methodology: {
        description:
          "CAGE es el campo ordinal pre-calculado por la EAS que clasifica el nivel de consumo en 4 categorías. " +
          "COMPÁS NG lo consume directamente sin reconstruirlo desde ítems individuales.",
        limitations: study.methodologicalCautions,
        requiresHumanValidation: true,
      },
      tags: ["cage-eas", "eas", "complementary-study", "indicator", "alcohol"],
    });
    atoms.push(ordinalAtom);
  }

  const cautionAtom = createEvidenceAtom({
    id: `cage-eas:${study.municipalityId}:cautela-metodologica`,
    municipalityId: study.municipalityId,
    kind: "methodological-caution",
    title: "CAGE-EAS - Cautela metodológica",
    content:
      "CAGE_R y CAGE son indicadores propios de la EAS para monitorización del consumo de alcohol en la población andaluza. " +
      "COMPÁS NG los consume directamente sin recalcular el CAGE desde ítems individuales. " +
      "El missing estructural (~18 % en Granada) corresponde a personas abstemias a las que el protocolo EAS " +
      "no administra el test ('No procede'): no es missing aleatorio ni indica falta de datos. " +
      "Los ítems de consumo episódico masivo de la EAS no forman parte de este análisis. " +
      "Los datos reflejan la muestra EAS provincial, no la población de ningún municipio concreto.",
    confidence,
    provenance: {
      origin: "complementary-study",
      sourceLabel: study.sourceFileName,
      extractedAt: study.createdAt,
    },
    methodology: {
      description: "Cautela metodológica asociada al procesamiento de CAGE-EAS como estudio complementario.",
      limitations: study.methodologicalCautions,
      requiresHumanValidation: true,
    },
    tags: ["cage-eas", "eas", "complementary-study", "methodological-caution"],
  });

  atoms.push(cautionAtom);
  return atoms;
}
