import type { MethodologicalModule, ModuleId } from "./MethodologicalModule";
import { IBSE_MODULE } from "./definitions/ibse";

// Catálogo declarativo de módulos metodológicos.
// Para incorporar un módulo nuevo: añadir una entrada al array inicial del Map.
// No contiene estado mutable ni lógica de negocio.

const REGISTRY = new Map<ModuleId, MethodologicalModule>([
  [IBSE_MODULE.identity.id, IBSE_MODULE],
]);

export function getMethodologicalModule(id: ModuleId): MethodologicalModule | undefined {
  return REGISTRY.get(id);
}

export function getAllMethodologicalModules(): MethodologicalModule[] {
  return Array.from(REGISTRY.values());
}
