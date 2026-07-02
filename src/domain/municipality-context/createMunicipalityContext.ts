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
    healthReport:            workspace.healthReport,
    ibseStudy:               workspace.ibseStudy,
    dukeStudy:               workspace.dukeStudy,
    predimedStudy:           workspace.predimedStudy,
    sf12Study:               workspace.sf12Study,
    suenoStudy:              workspace.suenoStudy,
    cageStudy:               workspace.cageStudy,
    auditcStudy:             workspace.auditcStudy,
    ipaqStudy:               workspace.ipaqStudy,
    ghq12Study:              workspace.ghq12Study,
    phq9Study:               workspace.phq9Study,
    psqiStudy:               workspace.psqiStudy,
    fagerstromStudy:         workspace.fagerstromStudy,
    thematicPrioritisation:       workspace.thematicPrioritisation,
    thematicPrioritisationStudy:  workspace.thematicPrioritisationStudy,
    evidenceStore:                workspace.evidenceStore,
  };
}
