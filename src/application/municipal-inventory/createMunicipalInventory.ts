import type { MunicipalSnapshot } from "../../domain/municipality-context";

/**
 * Responde exclusivamente a hechos observables del snapshot.
 * No calcula calidad. No calcula suficiencia. No infiere nada.
 */
export interface MunicipalInventory {
  hasHealthReport: boolean;
  hasIBSE: boolean;
  hasAssets: boolean;

  repositoryDocumentCount: number;
  evidenceAtomCount: number;
  ibseValidRecordCount: number;

  hasThematicPrioritisation: boolean;
  hasStrategicPrioritisation: boolean;
  hasMunicipalEnrichment: boolean;

  warnings: string[];
}

export function createMunicipalInventory(
  snapshot: MunicipalSnapshot
): MunicipalInventory {
  const hasHealthReport = snapshot.healthReport !== undefined;
  const hasIBSE        = snapshot.ibseStudy !== undefined;
  const hasAssets      = snapshot.evidenceStore.atoms.some(
    (atom) => atom.kind === "asset"
  );

  const repositoryDocumentCount = snapshot.repository.documents.length;
  const evidenceAtomCount       = snapshot.evidenceStore.atoms.length;
  const ibseValidRecordCount    = snapshot.ibseStudy?.aggregates.nValid ?? 0;

  const hasThematicPrioritisation  = snapshot.thematicPrioritisation !== undefined;
  const hasStrategicPrioritisation = snapshot.strategicPrioritisation !== undefined;
  const hasMunicipalEnrichment     = snapshot.municipalEnrichment !== undefined;

  const warnings: string[] = [];

  if (hasIBSE && ibseValidRecordCount === 0) {
    warnings.push("IBSE cargado sin registros completos.");
  }

  if (evidenceAtomCount > 0 && repositoryDocumentCount === 0) {
    warnings.push("Evidencias presentes sin documentos en el repositorio.");
  }

  return {
    hasHealthReport,
    hasIBSE,
    hasAssets,
    repositoryDocumentCount,
    evidenceAtomCount,
    ibseValidRecordCount,
    hasThematicPrioritisation,
    hasStrategicPrioritisation,
    hasMunicipalEnrichment,
    warnings,
  };
}
