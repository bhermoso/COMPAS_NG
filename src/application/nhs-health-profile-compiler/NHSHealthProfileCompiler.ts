/**
 * NHSHealthProfileCompiler
 *
 * Compila un NHSHealthProfileArtifact (PSL-NHS, Producto 4) desde un
 * LocalHealthProfile validado y el workspace municipal.
 *
 * Contratos garantizados (CONTRACT-NHS-HEALTH-PROFILE v1.0):
 *  - No accede a caps. V, VI ni VII del PSL.
 *  - No accede a ningún motor del Nivel 3 (MTE, ActionPlan, etc.).
 *  - No genera texto interpretativo ni conclusiones.
 *  - No modifica el PSL de origen ni el workspace.
 *  - Los valores de referencia provienen exclusivamente de
 *    MethodologicalModule.interpretation.referenceValues.
 *  - Organización por dominio causal (P4-I7).
 *  - Parte IV (Alcance) siempre presente (P4-I9).
 *  - No lanza excepciones: devuelve NHSCompilationResult tipado.
 */

import type { LocalHealthProfile } from "../../domain/health-profile";
import type { MunicipalityWorkspace } from "../../domain/workspace";
import type {
  NHSHealthProfileArtifact,
  NHSDomain,
  NHSIndicatorRow,
  NHSPosition,
  NHSReference,
  NHSPortada,
  NHSParticipacion,
  NHSAlcance,
  NHSStudyEntry,
} from "../../domain/nhs-health-profile";

import { DUKE_EAS_MODULE }    from "../../domain/methodology/definitions/duke-eas";
import { PREDIMED_EAS_MODULE } from "../../domain/methodology/definitions/predimed-eas";
import { SF12_EAS_MODULE }    from "../../domain/methodology/definitions/sf12-eas";

// ── Constantes ────────────────────────────────────────────────────────────────

// Umbral de similitud: diferencia relativa ≤10 % → posición "similar"
const SIMILAR_THRESHOLD = 0.10;

// Umbral de muestra pequeña (P4-I10)
const SMALL_SAMPLE_THRESHOLD = 30;

// Texto fijo obligatorio de la sección Alcance (CONTRACT §7 Parte IV)
const CAUTELA_ALCANCE =
  "Este perfil presenta datos disponibles en el momento del diagnóstico. " +
  "La ausencia de un estudio en este documento significa que no estaba disponible " +
  "en el expediente del municipio, no que el problema no exista.";

// Etiquetas institucionales (no técnicas) de los instrumentos
const STUDY_LABELS: Record<string, string> = {
  ibse:        "Bienestar socioemocional escolar (IBSE)",
  "duke-eas":  "Apoyo social funcional (DUKE-EAS)",
  "predimed-eas": "Adherencia a dieta mediterránea (PREDIMED-EAS)",
  "sf12-eas":  "Salud percibida (SF-12 EAS)",
  "sueno-eas": "Sueño (Sueño-EAS)",
  "cage-eas":  "Consumo de alcohol (CAGE-EAS)",
};

// Valores de referencia disponibles en el sistema (D4-01)
const DUKE_REF: NHSReference | null = (() => {
  const rv = DUKE_EAS_MODULE.interpretation?.referenceValues;
  if (!rv?.mean) return null;
  return { value: rv.mean, population: rv.population, source: rv.source };
})();

const PREDIMED_REF: NHSReference | null = (() => {
  const rv = PREDIMED_EAS_MODULE.interpretation?.referenceValues;
  if (!rv?.mean) return null;
  return { value: rv.mean, population: rv.population, source: rv.source };
})();

// SF-12: misma referencia nacional para PCS y MCS (Vilagut et al. 2008)
const SF12_REF: NHSReference | null = (() => {
  const rv = SF12_EAS_MODULE.interpretation?.referenceValues;
  if (!rv?.mean) return null;
  return { value: rv.mean, population: rv.population, source: rv.source };
})();

// ── Tipos públicos ────────────────────────────────────────────────────────────

export interface CompileNHSHealthProfileInput {
  psl: LocalHealthProfile;
  workspace: MunicipalityWorkspace;
  compiledBy?: string;
  municipalityName: string;
  municipalityProvince: string;
  existingArtifactCount: number;
}

export interface NHSCompilationViolation {
  gate: string;
  message: string;
}

export type NHSCompilationResult =
  | { ok: true; artifact: NHSHealthProfileArtifact }
  | { ok: false; violations: NHSCompilationViolation[] };

// ── Validación de precondiciones (gates) ─────────────────────────────────────

export function validateNHSCompilationPreconditions(
  psl: LocalHealthProfile
): NHSCompilationViolation[] {
  const violations: NHSCompilationViolation[] = [];

  // G-NHS-1: PSL debe estar validado o aprobado
  if (psl.status !== "validated" && psl.status !== "approved") {
    violations.push({
      gate: "G-NHS-1",
      message: `El PSL debe estar en estado "validated" o "approved". Estado actual: "${psl.status}".`,
    });
  }

  // G-NHS-2: al menos un estudio complementario
  if (psl.complementaryStudyCount < 1) {
    violations.push({
      gate: "G-NHS-2",
      message: "El PSL no tiene estudios complementarios. Se requiere al menos 1 para generar el PSL-NHS.",
    });
  }

  return violations;
}

// ── Cálculo de posición relativa ──────────────────────────────────────────────

function computePosition(
  value: number,
  reference: NHSReference,
  positiveDirection: "higher-is-better" | "lower-is-better"
): NHSPosition {
  const relDiff = Math.abs(value - reference.value) / reference.value;
  if (relDiff <= SIMILAR_THRESHOLD) return "similar";
  if (positiveDirection === "higher-is-better") {
    return value > reference.value ? "above" : "below";
  } else {
    return value < reference.value ? "above" : "below";
  }
}

// ── Construcción de filas de indicadores ─────────────────────────────────────

function makeRow(
  label: string,
  instrumentId: string,
  value: number,
  unit: string,
  positiveDirection: "higher-is-better" | "lower-is-better",
  validN: number,
  reference: NHSReference | null
): NHSIndicatorRow {
  return {
    label,
    instrumentId,
    value,
    unit,
    positiveDirection,
    reference,
    position: reference !== null ? computePosition(value, reference, positiveDirection) : null,
    smallSampleWarning: validN < SMALL_SAMPLE_THRESHOLD,
    validN,
  };
}

// ── Compilador principal ──────────────────────────────────────────────────────

export function compileNHSHealthProfile(
  input: CompileNHSHealthProfileInput
): NHSCompilationResult {
  const { psl, workspace, compiledBy, municipalityName, municipalityProvince, existingArtifactCount } = input;

  const violations = validateNHSCompilationPreconditions(psl);
  if (violations.length > 0) {
    return { ok: false, violations };
  }

  const compiledAt = new Date().toISOString();
  const artifactVersion = `PSL-NHS/v${existingArtifactCount + 1}`;
  const year = new Date(psl.validatedAt ?? compiledAt).getFullYear();

  // ── Dominio A — Bienestar y salud comunitaria ─────────────────────────────
  const bienestarRows: NHSIndicatorRow[] = [];

  if (workspace.ibseStudy) {
    const agg = workspace.ibseStudy.aggregates;
    bienestarRows.push(makeRow(
      "Bienestar socioemocional escolar",
      "ibse",
      agg.meanTotal,
      "puntos (0–100)",
      "higher-is-better",
      agg.nValid,
      null, // Sin referencia externa disponible (contrato §5.2)
    ));
  }

  if (workspace.dukeStudy) {
    const agg = workspace.dukeStudy.aggregates;
    bienestarRows.push(makeRow(
      "Apoyo social funcional",
      "duke-eas",
      agg.meanGlobal,
      "puntos (0–55)",
      "higher-is-better",
      agg.nValidGlobal,
      DUKE_REF,
    ));
  }

  // ── Dominio B — Conductas y estilos de vida ───────────────────────────────
  const conductasRows: NHSIndicatorRow[] = [];

  if (workspace.predimedStudy) {
    const agg = workspace.predimedStudy.aggregates;
    conductasRows.push(makeRow(
      "Adherencia a dieta mediterránea",
      "predimed-eas",
      agg.meanScore,
      "puntos (0–14)",
      "higher-is-better",
      agg.nValid,
      PREDIMED_REF,
    ));
  }

  if (workspace.suenoStudy) {
    const agg = workspace.suenoStudy.aggregates;
    conductasRows.push(makeRow(
      "Sueño de duración insuficiente",
      "sueno-eas",
      agg.pctInsufficientSleep,
      "%",
      "lower-is-better",
      agg.nValidP33R,
      null, // Sin referencia disponible
    ));
  }

  if (workspace.cageStudy) {
    const agg = workspace.cageStudy.aggregates;
    conductasRows.push(makeRow(
      "Consumo de riesgo de alcohol",
      "cage-eas",
      agg.pctRisk,
      "%",
      "lower-is-better",
      agg.nValidCAGER,
      null, // Sin referencia disponible
    ));
  }

  // ── Dominio C — Salud percibida ────────────────────────────────────────────
  const saludPercibidaRows: NHSIndicatorRow[] = [];

  if (workspace.sf12Study) {
    const agg = workspace.sf12Study.aggregates;
    saludPercibidaRows.push(makeRow(
      "Salud física percibida",
      "sf12-eas",
      agg.meanPCS,
      "puntos (0–100)",
      "higher-is-better",
      agg.nValidPCS,
      SF12_REF,
    ));
    saludPercibidaRows.push(makeRow(
      "Salud mental percibida",
      "sf12-eas",
      agg.meanMCS,
      "puntos (0–100)",
      "higher-is-better",
      agg.nValidMCS,
      SF12_REF,
    ));
  }

  // ── Ensamblar dominios (solo los no vacíos, en orden canónico) ─────────────
  const dominios: NHSDomain[] = [];

  if (bienestarRows.length > 0) {
    dominios.push({
      id: "bienestar",
      label: "Bienestar y salud comunitaria",
      indicators: bienestarRows,
    });
  }

  if (conductasRows.length > 0) {
    dominios.push({
      id: "conductas",
      label: "Conductas y estilos de vida",
      indicators: conductasRows,
    });
  }

  if (saludPercibidaRows.length > 0) {
    dominios.push({
      id: "salud-percibida",
      label: "Salud percibida",
      indicators: saludPercibidaRows,
    });
  }

  // ── Contar indicadores con referencia (para G-NHS-3 advisory) ─────────────
  const allIndicators = dominios.flatMap((d) => d.indicators);
  const indicatorsWithRef = allIndicators.filter((r) => r.reference !== null).length;
  const fewComparatorsWarning = indicatorsWithRef < 3;

  // ── Participación ciudadana (Parte III) ────────────────────────────────────
  let participacionCiudadana: NHSParticipacion | null = null;
  const tp = workspace.thematicPrioritisation;
  if (tp !== undefined) {
    participacionCiudadana = {
      realizada: tp.selectedTopicIds.length > 0,
      tematicasCount: tp.selectedTopicIds.length,
    };
  }

  // ── Alcance del diagnóstico (Parte IV — obligatoria) ──────────────────────
  const allStudyIds: Array<[string, boolean]> = [
    ["ibse",         !!workspace.ibseStudy],
    ["duke-eas",     !!workspace.dukeStudy],
    ["predimed-eas", !!workspace.predimedStudy],
    ["sf12-eas",     !!workspace.sf12Study],
    ["sueno-eas",    !!workspace.suenoStudy],
    ["cage-eas",     !!workspace.cageStudy],
  ];

  const availableStudies: NHSStudyEntry[] = allStudyIds
    .filter(([, present]) => present)
    .map(([id]) => ({ instrumentId: id, label: STUDY_LABELS[id] ?? id }));

  const missingStudies: NHSStudyEntry[] = allStudyIds
    .filter(([, present]) => !present)
    .map(([id]) => ({ instrumentId: id, label: STUDY_LABELS[id] ?? id }));

  const indicatorsWithoutReference = allIndicators
    .filter((r) => r.reference === null)
    .map((r) => ({
      label: r.label,
      reason: r.instrumentId === "ibse"
        ? "Sin referencia provincial o nacional disponible para este instrumento"
        : "Referencia no definida en el sistema para este instrumento",
    }));

  const alcance: NHSAlcance = {
    availableStudies,
    missingStudies,
    indicatorsWithoutReference,
    fewComparatorsWarning,
    cautela: CAUTELA_ALCANCE,
  };

  // ── Portada (Parte I) ──────────────────────────────────────────────────────
  const portada: NHSPortada = {
    municipalityName,
    municipalityProvince,
    year,
    complementaryStudyCount: psl.complementaryStudyCount,
    validatedAt: psl.validatedAt,
    validatedBy: psl.validatedBy,
    fewComparatorsWarning,
  };

  // ── Artefacto ──────────────────────────────────────────────────────────────
  const artifact: NHSHealthProfileArtifact = {
    id: crypto.randomUUID(),
    municipalityId: psl.municipalityId,
    artifactVersion,
    compiledAt,
    compiledBy,

    sourcePSLId: psl.id,
    sourcePSLVersion: psl.version,
    sourcePSLEvidenceStoreVersion: psl.evidenceStoreVersion,

    portada,
    dominios,
    participacionCiudadana,
    alcance,

    isCongealed: true,
  };

  return { ok: true, artifact };
}
