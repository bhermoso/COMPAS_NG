import type { StrategicElement } from "../../domain/strategy";

/**
 * Abstracción mínima de acceso al conocimiento estratégico institucional.
 *
 * El Motor de Traducción Estratégica consultará exclusivamente esta interfaz.
 * El origen del conocimiento es completamente transparente para el motor.
 * Una implementación distinta puede sustituir a otra sin modificar el MTE.
 */
export interface FrameworkProvider {
  /** Devuelve todos los elementos estratégicos disponibles. */
  getElements(): readonly StrategicElement[];

  /** Versión del conjunto de conocimiento estratégico consultado. */
  getVersion(): string;
}
