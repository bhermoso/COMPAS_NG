import type { EvidenceAtom } from "../../domain/evidence";
import type { LT1Result } from "../lt1";

export interface OITOpportunity {
  id: string;
  title: string;
  rationale: string;
  relatedEvidenceIds: string[];
  cautions: string[];
  isAnalyticalGap?: boolean;
  requiresHumanValidation: true;
}

export interface OITResult {
  opportunities: OITOpportunity[];
  sourceSummary: string;
  requiresHumanValidation: true;
}

export function generateOIT(lt1: LT1Result): OITResult {
  const opportunities: OITOpportunity[] = [];

  if (lt1.determinants.length > 0 && lt1.assets.length > 0) {
    opportunities.push(
      buildOpportunity({
        id: "oit-determinants-assets",
        title: "Conectar determinantes detectados con activos comunitarios",
        rationale:
          "La lectura LT1 identifica determinantes relevantes y activos comunitarios disponibles. La oportunidad consiste en formular intervenciones salutogénicas que no partan solo del déficit, sino también de recursos y capacidades del territorio.",
        relatedEvidence: [...lt1.determinants, ...lt1.assets],
        cautions: [
          "No asumir causalidad directa entre determinantes y resultados de salud.",
          "Validar la pertinencia de los activos con ciudadanía, profesionales y agentes locales.",
        ],
      })
    );
  }

  if (lt1.qualitativeFindings.length > 0 && lt1.indicators.length > 0) {
    opportunities.push(
      buildOpportunity({
        id: "oit-qualitative-indicators",
        title: "Contrastar hallazgos participativos con indicadores disponibles",
        rationale:
          "La lectura LT1 combina hallazgos cualitativos o participativos con indicadores. La oportunidad consiste en triangular experiencia comunitaria y evidencia cuantitativa antes de formular prioridades.",
        relatedEvidence: [...lt1.qualitativeFindings, ...lt1.indicators],
        cautions: [
          "No convertir testimonios aislados en diagnóstico general sin contraste.",
          "Revisar calidad, fecha y escala territorial de los indicadores.",
        ],
      })
    );
  }

  if (lt1.methodologicalCautions.length > 0) {
    opportunities.push(
      buildOpportunity({
        id: "oit-methodological-review",
        title: "Revisar cautelas metodológicas antes de priorizar",
        rationale:
          "El diagnóstico incorpora cautelas metodológicas que deben separarse de la evidencia utilizable antes de avanzar hacia priorización. Conviene documentar límites, sesgos y aspectos que requieren validación técnica.",
        relatedEvidence: lt1.methodologicalCautions,
        cautions: [
          "No usar evidencia metodológicamente débil como base única de una línea de acción.",
          "Documentar límites, sesgos y necesidades de revisión técnica.",
        ],
        isAnalyticalGap: true,
      })
    );
  }

  if (opportunities.length === 0) {
    // El fallback nombra el DÉFICIT REAL derivado de lo que hay y lo que falta para
    // TRIANGULAR una candidatura (determinantes con activos, o participación con
    // indicadores). No aconseja incorporar activos ni indicadores cuando ya existen.
    const presentes: string[] = [];
    if (lt1.assets.length > 0)
      presentes.push(`${lt1.assets.length} ${lt1.assets.length === 1 ? "activo" : "activos"}`);
    if (lt1.indicators.length > 0)
      presentes.push(
        `${lt1.indicators.length} ${lt1.indicators.length === 1 ? "indicador" : "indicadores"}`
      );
    const faltan: string[] = [];
    if (lt1.determinants.length === 0) faltan.push("determinantes con evidencia directa");
    if (lt1.qualitativeFindings.length === 0)
      faltan.push("participación o conocimiento comunitario primario");
    if (lt1.assets.length === 0) faltan.push("activos comunitarios");
    if (lt1.indicators.length === 0) faltan.push("indicadores");
    const presentesStr =
      presentes.length > 0 ? `El expediente ya incorpora ${presentes.join(" y ")}, ` : "";
    const faltanStr =
      faltan.length > 0 ? faltan.join(" y ") : "fuentes complementarias adicionales";
    opportunities.push({
      id: "oit-expand-evidence-base",
      title: "Triangular la base municipal de evidencia",
      rationale:
        `${presentesStr}pero para formular candidaturas territoriales sustantivas faltan ${faltanStr}: ` +
        "no hay pares que triangular (determinantes con activos, o participación primaria con indicadores) " +
        "antes de avanzar hacia priorización.",
      relatedEvidenceIds: lt1.supportingEvidenceIds,
      cautions: [
        "No iniciar priorización estratégica sin triangulación suficiente.",
        "No procede incorporar activos ni indicadores ya presentes; el déficit está en determinantes con evidencia directa y en participación o conocimiento comunitario que permitan emparejarlos.",
      ],
      isAnalyticalGap: true,
      requiresHumanValidation: true,
    });
  }

  return {
    opportunities,
    sourceSummary: lt1.summary,
    requiresHumanValidation: true,
  };
}

function buildOpportunity(input: {
  id: string;
  title: string;
  rationale: string;
  relatedEvidence: EvidenceAtom[];
  cautions: string[];
  isAnalyticalGap?: boolean;
}): OITOpportunity {
  return {
    id: input.id,
    title: input.title,
    rationale: input.rationale,
    relatedEvidenceIds: input.relatedEvidence.map((atom) => atom.id),
    cautions: input.cautions,
    isAnalyticalGap: input.isAnalyticalGap,
    requiresHumanValidation: true,
  };
}
