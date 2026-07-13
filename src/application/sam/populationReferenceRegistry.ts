import type { PopulationReference } from "../../domain/sam";
import { ATARFE_POPULATION_2022 } from "../../../fixtures/population/atarfe-population-2022";
import { ATARFE_SCHOOL_POPULATION_2025 } from "../../../fixtures/population/atarfe-school-population-2025";

export interface PopulationReferenceSet {
  /** Adultos ≥16 años — instrumentos EAS (DUKE, PREDIMED, SF-12, Sueño, CAGE, IPAQ). */
  adult?: PopulationReference;
  /** Población escolar 6–17 años — instrumento IBSE. */
  school?: PopulationReference;
}

/**
 * Registro de Fuentes Poblacionales de Referencia verificadas por municipio.
 *
 * Solo se registra un municipio cuando existe una fuente verificada (Padrón
 * INE, MTI-BDU o equivalente con suma auditada). No se añaden estimaciones.
 * La ausencia de entrada indica que SAM no puede ejecutarse para ese municipio.
 */
const REGISTRY: Readonly<Record<string, PopulationReferenceSet>> = {
  "18022": {
    adult: ATARFE_POPULATION_2022,
    school: ATARFE_SCHOOL_POPULATION_2025,
  },
};

/** Devuelve las referencias poblacionales disponibles para un municipio, o {} si no existen. */
export function getPopulationReferenceSet(municipalityId: string): PopulationReferenceSet {
  return REGISTRY[municipalityId] ?? {};
}
