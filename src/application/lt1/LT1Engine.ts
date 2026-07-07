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
    (atom) => atom.kind === "methodological-caution" || atom.kind === "sample-quality"
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
      "El Perfil aún no dispone de información territorial suficiente para construir " +
      "una lectura diagnóstica sustantiva. La incorporación de fuentes epidemiológicas, " +
      "documentación territorial, activos comunitarios y materiales participativos " +
      "permitirá identificar patrones, capacidades e incertidumbres relevantes para " +
      "la priorización."
    );
  }

  const parts: string[] = [];

  // ── Apertura: dimensiones de conocimiento presentes ───────────────────────
  const dimensiones: string[] = [];
  if (input.indicators.length > 0)          dimensiones.push("indicadores epidemiológicos");
  if (input.determinants.length > 0)        dimensiones.push("determinantes sociales de la salud");
  if (input.assets.length > 0)              dimensiones.push("activos comunitarios");
  if (input.qualitativeFindings.length > 0) dimensiones.push("perspectiva ciudadana y cualitativa");

  if (dimensiones.length > 0) {
    parts.push(`La lectura territorial integra ${dimensiones.join(", ")}.`);
  }

  // ── Determinantes: lenguaje de territorio, no de conteo ───────────────────
  if (input.determinants.length > 0) {
    parts.push(
      "El territorio muestra factores estructurales que condicionan la salud " +
      "de la población: condiciones socioeconómicas, entorno, acceso a recursos " +
      "y otros determinantes que el Grupo Motor deberá interpretar en su contexto local."
    );
  }

  // ── Activos: palancas para la acción ──────────────────────────────────────
  if (input.assets.length > 0) {
    const fromLocalizaSalud = input.assets.some(
      (a) => a.provenance.origin === "localiza-salud"
    );
    parts.push(
      fromLocalizaSalud
        ? "Se han identificado recursos y activos en el entorno territorial " +
          "mediante consulta de Localiza Salud, incorporados como base de trabajo. " +
          "Requieren validación territorial antes de ser interpretados como activos " +
          "propios del ámbito. La lectura salutogénica del territorio debe apoyarse " +
          "en el contraste comunitario."
        : "El municipio cuenta con activos y capacidades comunitarias que pueden " +
          "actuar como palancas para la acción en salud. " +
          "La lectura salutogénica del territorio no se agota en sus déficits: " +
          "las fortalezas existentes son punto de partida para la planificación."
    );
  }

  // ── Participación: conocimiento situado ───────────────────────────────────
  if (input.qualitativeFindings.length > 0) {
    parts.push(
      "La perspectiva ciudadana y cualitativa aporta un conocimiento del territorio " +
      "que los datos estadísticos no pueden capturar. " +
      "El patrón observado debe contrastarse con el Grupo Motor para identificar " +
      "convergencias y divergencias entre la lectura técnica y la comunitaria."
    );
  }

  // ── Cierre: prudencia territorial, no disclaimer del sistema ──────────────
  parts.push(
    "Esta lectura es una propuesta interpretativa inicial " +
    "que el equipo técnico debe validar, contextualizar y completar " +
    "con su conocimiento del territorio y con la deliberación comunitaria."
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
    const fromLocalizaSalud = input.assets.some(
      (a) => a.provenance.origin === "localiza-salud"
    );
    opportunities.push(
      fromLocalizaSalud
        ? "Contrastar los recursos identificados mediante Localiza Salud con los determinantes detectados, priorizando los validados territorialmente como activos del ámbito."
        : "Cruzar determinantes detectados con activos comunitarios disponibles para formular oportunidades de intervención salutogénica."
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
