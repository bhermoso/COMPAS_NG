import { createEvidenceAtom, type EvidenceAtom } from "../../domain/evidence";
import type { DUKEStudy } from "../../domain/duke";

interface DUKEIndicatorDef {
  idSuffix: string;
  title: string;
  meanField: keyof Pick<
    DUKEStudy["aggregates"],
    "meanGlobal" | "meanConfidential" | "meanAffective"
  >;
  validField: keyof Pick<
    DUKEStudy["aggregates"],
    "nValidGlobal" | "nValidConfidential" | "nValidAffective"
  >;
  lowCountField: keyof Pick<
    DUKEStudy["aggregates"],
    "lowGlobalCount" | "lowConfidentialCount" | "lowAffectiveCount"
  >;
  lowPercentageField: keyof Pick<
    DUKEStudy["aggregates"],
    "lowGlobalPercentage" | "lowConfidentialPercentage" | "lowAffectivePercentage"
  >;
  incompleteField: keyof Pick<
    DUKEStudy["aggregates"],
    "incompleteGlobalCount" | "incompleteConfidentialCount" | "incompleteAffectiveCount"
  >;
  itemDescription: string;
  maxScore: number;
}

const DUKE_INDICATORS: DUKEIndicatorDef[] = [
  {
    idSuffix: "global",
    title: "DUKE-EAS - Apoyo social funcional global",
    meanField: "meanGlobal",
    validField: "nValidGlobal",
    lowCountField: "lowGlobalCount",
    lowPercentageField: "lowGlobalPercentage",
    incompleteField: "incompleteGlobalCount",
    itemDescription: "Suma P5701..P5711",
    maxScore: 55,
  },
  {
    idSuffix: "confidencial",
    title: "DUKE-EAS - Apoyo confidencial",
    meanField: "meanConfidential",
    validField: "nValidConfidential",
    lowCountField: "lowConfidentialCount",
    lowPercentageField: "lowConfidentialPercentage",
    incompleteField: "incompleteConfidentialCount",
    itemDescription: "Suma P5701, P5702, P5706, P5707, P5708, P5709, P5710",
    maxScore: 35,
  },
  {
    idSuffix: "afectivo",
    title: "DUKE-EAS - Apoyo afectivo",
    meanField: "meanAffective",
    validField: "nValidAffective",
    lowCountField: "lowAffectiveCount",
    lowPercentageField: "lowAffectivePercentage",
    incompleteField: "incompleteAffectiveCount",
    itemDescription: "Suma P5703, P5704, P5705, P5711",
    maxScore: 20,
  },
];

function formatPercent(value: number): string {
  return `${value.toFixed(1)} %`;
}

export function dukeStudyToEvidenceAtoms(study: DUKEStudy): EvidenceAtom[] {
  if (
    study.aggregates.nValidGlobal === 0 &&
    study.aggregates.nValidConfidential === 0 &&
    study.aggregates.nValidAffective === 0
  ) {
    return [];
  }

  const lowestValidN = Math.min(
    study.aggregates.nValidGlobal,
    study.aggregates.nValidConfidential,
    study.aggregates.nValidAffective
  );
  const confidence = lowestValidN >= 30 ? "medium" : "low";

  const indicatorAtoms = DUKE_INDICATORS.map((def) => {
    const mean = study.aggregates[def.meanField];
    const nValid = study.aggregates[def.validField];
    const lowCount = study.aggregates[def.lowCountField];
    const lowPercentage = study.aggregates[def.lowPercentageField];
    const incompleteCount = study.aggregates[def.incompleteField];

    return createEvidenceAtom({
      id: `duke-eas:${study.municipalityId}:${def.idSuffix}`,
      municipalityId: study.municipalityId,
      kind: "indicator",
      title: def.title,
      content:
        `${def.itemDescription}. Media: ${mean}/${def.maxScore}. ` +
        `Apoyo bajo: ${lowCount} de ${nValid} registros validos (${formatPercent(lowPercentage)}). ` +
        `Incompletos/no calculables en esta escala: ${incompleteCount} de ${study.aggregates.n}. ` +
        `Fuente: ${study.sourceFileName}. Recodificacion EAS: 0 = apoyo normal, 1 = apoyo bajo, 993 = Duke incompleto/no calculable.`,
      confidence,
      provenance: {
        origin: "complementary-study",
        sourceLabel: study.sourceFileName,
        extractedAt: study.createdAt,
      },
      methodology: {
        description:
          "Agregado municipal calculado desde CSV DUKE-EAS. La recodificacion implementada se reconstruyo empiricamente desde los microdatos EAS disponibles con reproduccion 100 %.",
        limitations: study.methodologicalCautions,
        requiresHumanValidation: true,
      },
      tags: ["duke-eas", "eas", "complementary-study", "indicator", def.idSuffix],
    });
  });

  const cautionAtom = createEvidenceAtom({
    id: `duke-eas:${study.municipalityId}:cautela-recodificacion`,
    municipalityId: study.municipalityId,
    kind: "methodological-caution",
    title: "DUKE-EAS - Cautela metodologica de recodificacion",
    content:
      "La recodificacion DUKE-EAS usada por COMPAS NG reproduce al 100 % los microdatos EAS disponibles, " +
      "pero no se presenta como criterio clinico universal ni genera decisiones automaticas. " +
      "Debe usarse como evidencia complementaria para interpretacion tecnica validada.",
    confidence,
    provenance: {
      origin: "complementary-study",
      sourceLabel: study.sourceFileName,
      extractedAt: study.createdAt,
    },
    methodology: {
      description:
        "Cautela metodologica asociada al procesamiento DUKE-EAS como estudio complementario concreto.",
      limitations: study.methodologicalCautions,
      requiresHumanValidation: true,
    },
    tags: ["duke-eas", "eas", "complementary-study", "methodological-caution"],
  });

  return [...indicatorAtoms, cautionAtom];
}
