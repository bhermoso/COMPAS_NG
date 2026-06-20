import type { EvidenceAtom, EvidenceStore } from "../../domain/evidence";

export interface LT1Result {
  summary: string;
  determinants: EvidenceAtom[];
  assets: EvidenceAtom[];
  indicators: EvidenceAtom[];
  qualitativeFindings: EvidenceAtom[];
  methodologicalCautions: EvidenceAtom[];
  preliminaryOpportunities: string[];
  supportingEvidenceIds: string[];
  requiresHumanValidation: true;
}

export function generateLT1(store: EvidenceStore): LT1Result {
  const determinants = store.atoms.filter((atom) => atom.kind === "determinant");
  const assets = store.atoms.filter((atom) => atom.kind === "asset");
  const indicators = store.atoms.filter((atom) => atom.kind === "indicator");
  const qualitativeFindings = store.atoms.filter(
    (atom) =>
      atom.kind === "qualitative-observation" ||
      atom.kind === "participation"
  );
  const methodologicalCautions = store.atoms.filter(
    (atom) => atom.kind === "methodological-caution"
  );

  const supportingEvidenceIds = store.atoms.map((atom) => atom.id);

  const preliminaryOpportunities = buildPreliminaryOpportunities({
    determinants,
    assets,
    qualitativeFindings,
    methodologicalCautions,
  });

  return {
    summary: buildSummary({
      determinants,
      assets,
      indicators,
      qualitativeFindings,
      methodologicalCautions,
    }),
    determinants,
    assets,
    indicators,
    qualitativeFindings,
    methodologicalCautions,
    preliminaryOpportunities,
    supportingEvidenceIds,
    requiresHumanValidation: true,
  };
}

function buildSummary(input: {
  determinants: EvidenceAtom[];
  assets: EvidenceAtom[];
  indicators: EvidenceAtom[];
  qualitativeFindings: EvidenceAtom[];
  methodologicalCautions: EvidenceAtom[];
}): string {
  const total = totalEvidence(input);

  if (total === 0) {
    return (
      "El repositorio no contiene EvidenceAtom. No es posible construir una lectura territorial " +
      "basada en evidencia documental. Incorpora documentos al repositorio, conviértelos en " +
      "EvidenceAtom mediante el pipeline de ingesta y vuelve a ejecutar el análisis."
    );
  }

  const parts: string[] = [];

  parts.push(
    `Lectura territorial construida a partir de ${total} evidencias estructuradas.`
  );

  if (input.determinants.length > 0) {
    parts.push(
      `Se identifican ${input.determinants.length} determinantes relevantes para la planificación local.`
    );
  }

  if (input.assets.length > 0) {
    parts.push(
      `Se registran ${input.assets.length} activos comunitarios que pueden apoyar estrategias salutogénicas.`
    );
  }

  if (input.indicators.length > 0) {
    parts.push(
      `Hay ${input.indicators.length} indicadores disponibles para contextualizar el diagnóstico.`
    );
  }

  if (input.qualitativeFindings.length > 0) {
    parts.push(
      `La lectura incorpora ${input.qualitativeFindings.length} hallazgos cualitativos o participativos.`
    );
  }

  if (input.methodologicalCautions.length > 0) {
    parts.push(
      `Existen ${input.methodologicalCautions.length} cautelas metodológicas que deben considerarse antes de tomar decisiones.`
    );
  }

  parts.push(
    "Esta lectura no establece causalidad ni priorización automática; requiere validación técnica y comunitaria."
  );

  return parts.join(" ");
}

function buildPreliminaryOpportunities(input: {
  determinants: EvidenceAtom[];
  assets: EvidenceAtom[];
  qualitativeFindings: EvidenceAtom[];
  methodologicalCautions: EvidenceAtom[];
}): string[] {
  const opportunities: string[] = [];

  if (input.determinants.length > 0 && input.assets.length > 0) {
    opportunities.push(
      "Cruzar determinantes detectados con activos comunitarios disponibles para formular oportunidades de intervención salutogénica."
    );
  }

  if (input.qualitativeFindings.length > 0) {
    opportunities.push(
      "Contrastar los hallazgos cualitativos y participativos con indicadores y documentación técnica."
    );
  }

  if (input.methodologicalCautions.length > 0) {
    opportunities.push(
      "Revisar cautelas metodológicas antes de convertir la lectura territorial en prioridades o acciones."
    );
  }

  if (opportunities.length === 0) {
    opportunities.push(
      "Ampliar el repositorio municipal con evidencias de determinantes, activos, indicadores y participación."
    );
  }

  return opportunities;
}

function totalEvidence(input: {
  determinants: EvidenceAtom[];
  assets: EvidenceAtom[];
  indicators: EvidenceAtom[];
  qualitativeFindings: EvidenceAtom[];
  methodologicalCautions: EvidenceAtom[];
}): number {
  return (
    input.determinants.length +
    input.assets.length +
    input.indicators.length +
    input.qualitativeFindings.length +
    input.methodologicalCautions.length
  );
}
