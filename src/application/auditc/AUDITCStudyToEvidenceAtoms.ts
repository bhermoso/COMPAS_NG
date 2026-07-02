import { createEvidenceAtom, type EvidenceAtom } from "../../domain/evidence";
import type { AUDITCStudy } from "../../domain/auditc";

export function auditcStudyToEvidenceAtoms(study: AUDITCStudy): EvidenceAtom[] {
  if (study.aggregates.nValid === 0) return [];

  const { aggregates } = study;
  const confidence = aggregates.nValid >= 30 ? "medium" : "low";

  const riskAtom = createEvidenceAtom({
    id: `auditc:${study.municipalityId}:consumo-riesgo`,
    municipalityId: study.municipalityId,
    kind: "indicator",
    title: "AUDIT-C — Prevalencia de consumo de riesgo de alcohol",
    content:
      `${aggregates.pctPositive.toFixed(1)} % de la muestra adulta (n=${aggregates.nPositive} de ${aggregates.nValid} registros válidos) ` +
      `presenta un score AUDIT-C ≥ 4 (consumo de riesgo). ` +
      `Score medio: ${aggregates.meanScore.toFixed(2)}/12. ` +
      `Distribución: sin consumo ${aggregates.nScore0} personas, ` +
      `bajo riesgo (1–3) ${aggregates.nScore1to3}, ` +
      `riesgo (4–7) ${aggregates.nScore4to7}, ` +
      `alto riesgo (≥8) ${aggregates.nScore8to12}. ` +
      `Fuente: ${study.sourceFileName}.`,
    confidence,
    provenance: {
      origin: "complementary-study",
      sourceLabel: study.sourceFileName,
      extractedAt: study.createdAt,
    },
    methodology: {
      description:
        "AUDIT-C: suma de los ítems Q1 (frecuencia), Q2 (cantidad habitual) y Q3 " +
        "(frecuencia de consumo intensivo). Rango 0–12. Punto de corte ≥4 para consumo de riesgo.",
      limitations: study.methodologicalCautions,
      requiresHumanValidation: true,
    },
    tags: ["auditc", "complementary-study", "indicator", "alcohol"],
  });

  const cautionAtom = createEvidenceAtom({
    id: `auditc:${study.municipalityId}:cautela-metodologica`,
    municipalityId: study.municipalityId,
    kind: "methodological-caution",
    title: "AUDIT-C — Cautela metodológica",
    content:
      "El AUDIT-C mide el patrón actual de consumo autorreferido de alcohol mediante " +
      "3 ítems (frecuencia, cantidad y consumo intensivo). " +
      "Punto de corte aplicado: ≥4 (general). El corte diferenciado por sexo " +
      "(≥3 mujeres / ≥4 hombres) no se calcula en esta versión agregada, " +
      "por lo que la prevalencia de riesgo en muestras con alta proporción de mujeres " +
      "puede estar subestimada. " +
      "No existe referencia provincial disponible para comparación territorial. " +
      "Los datos reflejan la muestra importada, no la población municipal completa.",
    confidence,
    provenance: {
      origin: "complementary-study",
      sourceLabel: study.sourceFileName,
      extractedAt: study.createdAt,
    },
    methodology: {
      description:
        "Cautela metodológica asociada al procesamiento de AUDIT-C como estudio complementario.",
      limitations: study.methodologicalCautions,
      requiresHumanValidation: true,
    },
    tags: ["auditc", "complementary-study", "methodological-caution"],
  });

  return [riskAtom, cautionAtom];
}
