import type { MethodologicalModule, ModuleId } from "./MethodologicalModule";
import { IBSE_MODULE } from "./definitions/ibse";
import { DUKE_EAS_MODULE } from "./definitions/duke-eas";
import { PREDIMED_EAS_MODULE } from "./definitions/predimed-eas";
import { SF12_EAS_MODULE } from "./definitions/sf12-eas";
import { SUENO_EAS_MODULE } from "./definitions/sueno-eas";
import { CAGE_EAS_MODULE } from "./definitions/cage-eas";
import { AUDITC_MODULE } from "./definitions/auditc";
import { IPAQ_EAS_MODULE } from "./definitions/ipaq-eas";
import { GHQ12_MODULE } from "./definitions/ghq12";
import { PHQ9_MODULE } from "./definitions/phq9";

// Catálogo declarativo de módulos metodológicos.
// Para incorporar un módulo nuevo: añadir una entrada al array inicial del Map.
// No contiene estado mutable ni lógica de negocio.

const REGISTRY = new Map<ModuleId, MethodologicalModule>([
  [IBSE_MODULE.identity.id, IBSE_MODULE],
  [DUKE_EAS_MODULE.identity.id, DUKE_EAS_MODULE],
  [PREDIMED_EAS_MODULE.identity.id, PREDIMED_EAS_MODULE],
  [SF12_EAS_MODULE.identity.id, SF12_EAS_MODULE],
  [SUENO_EAS_MODULE.identity.id, SUENO_EAS_MODULE],
  [CAGE_EAS_MODULE.identity.id, CAGE_EAS_MODULE],
  [AUDITC_MODULE.identity.id, AUDITC_MODULE],
  [IPAQ_EAS_MODULE.identity.id, IPAQ_EAS_MODULE],
  [GHQ12_MODULE.identity.id, GHQ12_MODULE],
  [PHQ9_MODULE.identity.id, PHQ9_MODULE],
]);

export function getMethodologicalModule(id: ModuleId): MethodologicalModule | undefined {
  return REGISTRY.get(id);
}

export function getAllMethodologicalModules(): MethodologicalModule[] {
  return Array.from(REGISTRY.values());
}
