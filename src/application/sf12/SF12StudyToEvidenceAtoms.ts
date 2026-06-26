import { createEvidenceAtom, type EvidenceAtom } from "../../domain/evidence";
import type { SF12Study } from "../../domain/sf12";

export function sf12StudyToEvidenceAtoms(study: SF12Study): EvidenceAtom[] {
  if (study.aggregates.nValidPCS === 0 && study.aggregates.nValidMCS === 0) {
    return [];
  }

  const { aggregates } = study;
  const confidence = Math.min(aggregates.nValidPCS, aggregates.nValidMCS) >= 30
    ? "medium"
    : "low";

  const pcsAtom = createEvidenceAtom({
    id: `sf12-eas:${study.municipalityId}:pcs12`,
    municipalityId: study.municipalityId,
    kind: "indicator",
    title: "SF-12 EAS - Componente Físico de Salud (PCS12_SP)",
    content:
      `Media PCS12_SP: ${aggregates.meanPCS} (escala 0-100; mayor = mejor salud física percibida). ` +
      `n válidos: ${aggregates.nValidPCS} de ${aggregates.n}. ` +
      `Sin puntuación: ${aggregates.missingPCS}. ` +
      `Fuente: ${study.sourceFileName}. ` +
      `Norma española: Vilagut et al. 2008 (Med Clín Barc 130(19):726-735).`,
    confidence,
    provenance: {
      origin: "complementary-study",
      sourceLabel: study.sourceFileName,
      extractedAt: study.createdAt,
    },
    methodology: {
      description:
        "Puntuación canónica pre-calculada por la EAS aplicando coeficientes factoriales de la norma española. " +
        "COMPÁS NG la consume directamente sin recalcular desde los 12 ítems.",
      limitations: study.methodologicalCautions,
      requiresHumanValidation: true,
    },
    tags: ["sf12-eas", "eas", "complementary-study", "indicator", "salud-fisica"],
  });

  const mcsAtom = createEvidenceAtom({
    id: `sf12-eas:${study.municipalityId}:mcs12`,
    municipalityId: study.municipalityId,
    kind: "indicator",
    title: "SF-12 EAS - Componente Mental de Salud (MCS12_SP)",
    content:
      `Media MCS12_SP: ${aggregates.meanMCS} (escala 0-100; mayor = mejor salud mental percibida). ` +
      `n válidos: ${aggregates.nValidMCS} de ${aggregates.n}. ` +
      `Sin puntuación: ${aggregates.missingMCS}. ` +
      `Fuente: ${study.sourceFileName}. ` +
      `Norma española: Vilagut et al. 2008 (Med Clín Barc 130(19):726-735).`,
    confidence,
    provenance: {
      origin: "complementary-study",
      sourceLabel: study.sourceFileName,
      extractedAt: study.createdAt,
    },
    methodology: {
      description:
        "Puntuación canónica pre-calculada por la EAS aplicando coeficientes factoriales de la norma española. " +
        "COMPÁS NG la consume directamente sin recalcular desde los 12 ítems.",
      limitations: study.methodologicalCautions,
      requiresHumanValidation: true,
    },
    tags: ["sf12-eas", "eas", "complementary-study", "indicator", "salud-mental"],
  });

  const cautionAtom = createEvidenceAtom({
    id: `sf12-eas:${study.municipalityId}:cautela-metodologica`,
    municipalityId: study.municipalityId,
    kind: "methodological-caution",
    title: "SF-12 EAS - Cautela metodológica",
    content:
      "PCS12_SP y MCS12_SP son puntuaciones norm-based de salud percibida calculadas por la EAS " +
      "con los coeficientes de Vilagut et al. 2008. COMPÁS NG no recalcula estas puntuaciones " +
      "desde los 12 ítems porque el algoritmo factorial requiere acceso a los coeficientes de la norma española. " +
      "No se generan indicadores dicotómicos, por cuartil ni por mediana: " +
      "cualquier clasificación categórica futura requiere referencia metodológica explícita.",
    confidence,
    provenance: {
      origin: "complementary-study",
      sourceLabel: study.sourceFileName,
      extractedAt: study.createdAt,
    },
    methodology: {
      description:
        "Cautela metodológica asociada al procesamiento SF-12 EAS como estudio complementario.",
      limitations: study.methodologicalCautions,
      requiresHumanValidation: true,
    },
    tags: ["sf12-eas", "eas", "complementary-study", "methodological-caution"],
  });

  return [pcsAtom, mcsAtom, cautionAtom];
}
