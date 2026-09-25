import type { StrategicElement } from "../../domain/strategy";
import type { FrameworkProvider } from "./FrameworkProvider";

/**
 * Implementación estática del FrameworkProvider.
 *
 * Recibe el conocimiento estratégico en construcción y lo expone sin modificación.
 * No accede a repositorios, servicios ni APIs.
 * Sustituible por cualquier otra implementación de FrameworkProvider
 * sin necesidad de modificar el Motor de Traducción Estratégica.
 */
export class StaticFrameworkProvider implements FrameworkProvider {
  private readonly _elements: readonly StrategicElement[];
  private readonly _version: string;

  constructor(elements: readonly StrategicElement[], version: string) {
    this._elements = elements;
    this._version = version;
  }

  getElements(): readonly StrategicElement[] {
    return this._elements;
  }

  getVersion(): string {
    return this._version;
  }
}
