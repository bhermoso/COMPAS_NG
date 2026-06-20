import type { MunicipalityWorkspace } from "../workspace";
import type { MunicipalSnapshot } from "./MunicipalityContext";

/**
 * Construye el snapshot canónico a partir del workspace actual.
 * Solo copia/referencia. No transforma, no infiere, no valida.
 *
 * Pipeline objetivo:
 *   MunicipalityWorkspace
 *     └─▶ createMunicipalSnapshot()
 *           └─▶ MunicipalSnapshot
 *                 ├─▶ Perfil de Salud Local (futuro)
 *                 ├─▶ LT1 (futuro)
 *                 ├─▶ OIT (futuro)
 *                 ├─▶ Priorización (futuro)
 *                 ├─▶ Plan de Acción (futuro)
 *                 └─▶ IA asistente (futuro)
 */
export function createMunicipalSnapshot(
  workspace: MunicipalityWorkspace
): MunicipalSnapshot {
  return {
    municipality:            workspace.municipality,
    repository:              workspace.repository,
    healthReport:            workspace.healthReports?.[0],
    ibseStudy:               workspace.ibseStudy,
    thematicPrioritisation:  workspace.thematicPrioritisation,
    evidenceStore:           workspace.evidenceStore,
  };
}
