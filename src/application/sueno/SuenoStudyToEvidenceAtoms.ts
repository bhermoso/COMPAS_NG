import { createEvidenceAtom, type EvidenceAtom } from "../../domain/evidence";
import type { SuenoStudy } from "../../domain/sueno";

export function suenoStudyToEvidenceAtoms(study: SuenoStudy): EvidenceAtom[] {
  if (study.aggregates.nValidP33R === 0) return [];

  const { aggregates } = study;
  const confidence = aggregates.nValidP33R >= 30 ? "medium" : "low";

  const p33rAtom = createEvidenceAtom({
    id: `sueno-eas:${study.municipalityId}:duracion-insuficiente`,
    municipalityId: study.municipalityId,
    kind: "indicator",
    title: "Sueño EAS - Duración insuficiente (P33_R)",
    content:
      `${aggregates.pctInsufficientSleep.toFixed(1)} % de la muestra no duerme las horas recomendadas ` +
      `por la Sociedad Española del Sueño (P33_R=1). ` +
      `n con sueño insuficiente: ${aggregates.nInsufficientSleep} de ${aggregates.nValidP33R} válidos. ` +
      `Missing P33_R: ${aggregates.missingP33R} de ${aggregates.n}. ` +
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
        "P33_R es un campo derivado pre-calculado por la EAS que clasifica si la persona duerme " +
        "las horas recomendadas. COMPÁS NG lo consume directamente sin reconstruirlo.",
      limitations: study.methodologicalCautions,
      requiresHumanValidation: true,
    },
    tags: ["sueno-eas", "eas", "complementary-study", "indicator", "sueno"],
  });

  const atoms: EvidenceAtom[] = [p33rAtom];

  if (aggregates.nValidP33A >= 30) {
    const p33aAtom = createEvidenceAtom({
      id: `sueno-eas:${study.municipalityId}:calidad-subjetiva`,
      municipalityId: study.municipalityId,
      kind: "indicator",
      title: "Sueño EAS - Calidad subjetiva: no descansa suficiente (P33A)",
      content:
        `${aggregates.pctNoRest.toFixed(1)} % de la muestra indica que las horas dormidas ` +
        `no le permiten descansar lo suficiente (P33A=0). ` +
        `n sin descanso suficiente: ${aggregates.nNoRest} de ${aggregates.nValidP33A} válidos. ` +
        `Missing P33A: ${aggregates.missingP33A} de ${aggregates.n}. ` +
        `Fuente: ${study.sourceFileName}.`,
      confidence,
      provenance: {
        origin: "complementary-study",
        sourceLabel: study.sourceFileName,
        extractedAt: study.createdAt,
      },
      methodology: {
        description:
          "P33A es un ítem directo de la EAS sobre calidad subjetiva del sueño. " +
          "Mide percepción de descanso, complementaria e independiente de P33_R (duración).",
        limitations: study.methodologicalCautions,
        requiresHumanValidation: true,
      },
      tags: ["sueno-eas", "eas", "complementary-study", "indicator", "sueno"],
    });
    atoms.push(p33aAtom);
  }

  const cautionAtom = createEvidenceAtom({
    id: `sueno-eas:${study.municipalityId}:cautela-metodologica`,
    municipalityId: study.municipalityId,
    kind: "methodological-caution",
    title: "Sueño EAS - Cautela metodológica",
    content:
      "P33_R y P33A son indicadores propios de la EAS para monitorización del sueño en la población andaluza. " +
      "No son escalas de sueño validadas externamente. " +
      "P33_R mide duración (criterio cuantitativo SES); P33A mide calidad subjetiva percibida. " +
      "Se espera ~29 % de discordancia entre ambas dimensiones, lo cual es metodológicamente coherente. " +
      "Los datos reflejan la muestra EAS provincial, no la población de ningún municipio concreto.",
    confidence,
    provenance: {
      origin: "complementary-study",
      sourceLabel: study.sourceFileName,
      extractedAt: study.createdAt,
    },
    methodology: {
      description: "Cautela metodológica asociada al procesamiento de Sueño EAS como estudio complementario.",
      limitations: study.methodologicalCautions,
      requiresHumanValidation: true,
    },
    tags: ["sueno-eas", "eas", "complementary-study", "methodological-caution"],
  });

  atoms.push(cautionAtom);
  return atoms;
}
