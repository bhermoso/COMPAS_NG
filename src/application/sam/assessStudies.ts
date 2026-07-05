// SAM cubre 6 estudios con evaluación implementada:
// IBSE (2 evaluaciones), DUKE-EAS, PREDIMED-EAS, SF-12 EAS, Sueño EAS, CAGE-EAS.
//
// IPAQ-EAS también procede de la Encuesta Andaluza de Salud pero no tiene función
// SAM implementada todavía (pendiente de definir la referencia poblacional adecuada).
//
// Los 6 estudios de administración propia vía REDCap municipal (AUDIT-C, GHQ-12,
// PHQ-9, PSQI, Fagerström, SBQ) no tienen evaluación SAM: carecen de referencia
// poblacional EAS metodológicamente equivalente.

import type { IBSEStudy } from "../../domain/ibse";
import type { DUKEStudy } from "../../domain/duke";
import type { PREDIMEDStudy } from "../../domain/predimed";
import type { SF12Study } from "../../domain/sf12";
import type { SuenoStudy } from "../../domain/sueno";
import type { CAGEStudy } from "../../domain/cage";
import type { PopulationReference } from "../../domain/sam/PopulationReference";
import type { SampleQualityAssessment } from "../../domain/sam/SampleQualityAssessment";
import { computeSampleQualityAssessment } from "./computeSampleQualityAssessment";

// ── EAS — Encuesta Andaluza de Salud (adultos ≥16) ──────────────────────────

export function assessDUKEStudy(
  study: DUKEStudy,
  ref: PopulationReference
): SampleQualityAssessment {
  return computeSampleQualityAssessment({
    instrumentId: "duke-eas",
    municipalityId: study.municipalityId,
    nObserved: study.aggregates.nValidGlobal,
    populationReference: ref,
  });
}

export function assessPREDIMEDStudy(
  study: PREDIMEDStudy,
  ref: PopulationReference
): SampleQualityAssessment {
  return computeSampleQualityAssessment({
    instrumentId: "predimed-eas",
    municipalityId: study.municipalityId,
    nObserved: study.aggregates.nValid,
    populationReference: ref,
  });
}

export function assessSF12Study(
  study: SF12Study,
  ref: PopulationReference
): SampleQualityAssessment {
  // nValidPCS es el campo canónico primario del SF-12 EAS.
  // Se usa como estimador del tamaño muestral efectivo del instrumento.
  return computeSampleQualityAssessment({
    instrumentId: "sf12-eas",
    municipalityId: study.municipalityId,
    nObserved: study.aggregates.nValidPCS,
    populationReference: ref,
  });
}

export function assessSuenoStudy(
  study: SuenoStudy,
  ref: PopulationReference
): SampleQualityAssessment {
  // nValidP33R es el campo canónico primario del módulo Sueño EAS (~98 % cobertura).
  return computeSampleQualityAssessment({
    instrumentId: "sueno-eas",
    municipalityId: study.municipalityId,
    nObserved: study.aggregates.nValidP33R,
    populationReference: ref,
  });
}

export function assessCAGEStudy(
  study: CAGEStudy,
  ref: PopulationReference
): SampleQualityAssessment {
  // nValidCAGER es el campo canónico primario del CAGE EAS (~82 % cobertura).
  return computeSampleQualityAssessment({
    instrumentId: "cage-eas",
    municipalityId: study.municipalityId,
    nObserved: study.aggregates.nValidCAGER,
    populationReference: ref,
  });
}

// ── IBSE — dos evaluaciones independientes ───────────────────────────────────

// Evaluación IBSE 16+: compara la muestra IBSE con la población adulta (≥16).
// Permite la comparación metodológica con los estudios EAS de población adulta.
// Referencia poblacional: población municipal ≥16 años.
export function assessIBSEStudy16Plus(
  study: IBSEStudy,
  ref16Plus: PopulationReference
): SampleQualityAssessment {
  return computeSampleQualityAssessment({
    instrumentId: "ibse-16plus",
    municipalityId: study.municipalityId,
    nObserved: study.aggregates.nValid,
    populationReference: ref16Plus,
  });
}

// Evaluación IBSE muestra completa: evalúa la representatividad real del
// estudio IBSE como instrumento escolar sobre su universo de referencia.
// Referencia poblacional: población en edad escolar (6–17 años).
// No fusionar con assessIBSEStudy16Plus — son dictámenes metodológicos distintos.
export function assessIBSEStudyFull(
  study: IBSEStudy,
  refFull: PopulationReference
): SampleQualityAssessment {
  return computeSampleQualityAssessment({
    instrumentId: "ibse-full",
    municipalityId: study.municipalityId,
    nObserved: study.aggregates.nValid,
    populationReference: refFull,
  });
}
