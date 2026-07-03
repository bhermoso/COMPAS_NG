import type { CAGEAggregates } from "../../domain/cage";
import type { DUKEAggregates } from "../../domain/duke";
import type { IBSEAggregates } from "../../domain/ibse";
import type { IPAQAggregates } from "../../domain/ipaq";
import type { PREDIMEDAggregates } from "../../domain/predimed";
import type { SF12Aggregates } from "../../domain/sf12";
import type { SuenoAggregates } from "../../domain/sueno";
import { parseCAGECSV } from "../cage";
import { parseDUKECSV } from "../duke";
import { parseIBSECSV } from "../ibse";
import { parseIPAQCSV } from "../ipaq";
import { parsePREDIMEDCSV } from "../predimed";
import { parseSF12CSV } from "../sf12";
import { parseSuenoCSV } from "../sueno";

export interface GranadaTerritorialReferences {
  ibse: IBSEAggregates;
  duke: DUKEAggregates;
  predimed: PREDIMEDAggregates;
  sf12: SF12Aggregates;
  sueno: SuenoAggregates;
  cage: CAGEAggregates;
  ipaq: IPAQAggregates;
}

export type TerritorialDirection = "higher-is-favourable" | "lower-is-favourable";

export interface TerritorialMetric {
  label: string;
  municipalityValue: number;
  granadaValue: number | null;
  andaluciaValue: number | null;
  unit: string;
  direction: TerritorialDirection;
  tolerance?: number;
}

export interface TerritorialComparison {
  municipalityName: string;
  metrics: TerritorialMetric[];
  source: string | null;
  methodologicalNote?: string;
}

let referencesPromise: Promise<GranadaTerritorialReferences> | undefined;

/**
 * Calcula las referencias con los mismos parsers usados por la importación municipal.
 * Los CSV se cargan en chunks separados para no penalizar la carga inicial de la app.
 */
export function loadGranadaTerritorialReferences(): Promise<GranadaTerritorialReferences> {
  referencesPromise ??= Promise.all([
    import("../../../fixtures/ibse-granada-provincia.csv?raw"),
    import("../../../fixtures/duke-eas-granada.csv?raw"),
    import("../../../fixtures/predimed-eas-granada.csv?raw"),
    import("../../../fixtures/sf12-eas-granada.csv?raw"),
    import("../../../fixtures/sueno-eas-granada.csv?raw"),
    import("../../../fixtures/cage-eas-granada.csv?raw"),
    import("../../../fixtures/ipaq-eas-granada.csv?raw"),
  ]).then(([ibse, duke, predimed, sf12, sueno, cage, ipaq]) => ({
    ibse: parseIBSECSV(ibse.default).aggregates,
    duke: parseDUKECSV(duke.default).aggregates,
    predimed: parsePREDIMEDCSV(predimed.default).aggregates,
    sf12: parseSF12CSV(sf12.default).aggregates,
    sueno: parseSuenoCSV(sueno.default).aggregates,
    cage: parseCAGECSV(cage.default).aggregates,
    ipaq: parseIPAQCSV(ipaq.default).aggregates,
  }));

  return referencesPromise;
}

function position(value: number, reference: number, tolerance: number): "above" | "similar" | "below" {
  const difference = value - reference;
  if (Math.abs(difference) <= tolerance) return "similar";
  return difference > 0 ? "above" : "below";
}

function positionText(
  value: number,
  reference: number,
  tolerance: number,
  direction: TerritorialDirection,
): string {
  const result = position(value, reference, tolerance);
  if (result === "similar") return "es similar";
  const favourable =
    (result === "above" && direction === "higher-is-favourable") ||
    (result === "below" && direction === "lower-is-favourable");
  return favourable ? "es más favorable" : "es menos favorable";
}

/** Genera una lectura descriptiva mediante reglas explícitas, sin IA generativa. */
export function interpretTerritorialMetric(metric: TerritorialMetric): string {
  const tolerance = metric.tolerance ?? Math.max(0.1, Math.abs(metric.municipalityValue) * 0.01);
  const comparisons: string[] = [];

  if (metric.granadaValue !== null) {
    comparisons.push(
      `${positionText(metric.municipalityValue, metric.granadaValue, tolerance, metric.direction)} que la referencia de Granada`,
    );
  }
  if (metric.andaluciaValue !== null) {
    comparisons.push(
      `${positionText(metric.municipalityValue, metric.andaluciaValue, tolerance, metric.direction)} que la referencia de Andalucía`,
    );
  }

  if (comparisons.length === 0) {
    return `No existe una referencia territorial metodológicamente equivalente para interpretar ${metric.label.toLowerCase()}.`;
  }

  return `El resultado municipal de ${metric.label.toLowerCase()} ${comparisons.join(" y ")}.`;
}
