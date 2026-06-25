import type { MunicipalSnapshot } from "../../domain/municipality-context";

/**
 * Responde exclusivamente a hechos observables del snapshot.
 * No calcula calidad. No calcula suficiencia. No infiere nada.
 */
export interface MunicipalInventory {
  hasHealthReport: boolean;
  hasIBSE: boolean;
  hasDUKE: boolean;
  hasPREDIMED: boolean;
  hasAssets: boolean;

  repositoryDocumentCount: number;
  evidenceAtomCount: number;
  ibseValidRecordCount: number;
  dukeRecordCount: number;
  predimedRecordCount: number;

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
  const hasDUKE        = snapshot.dukeStudy !== undefined;
  const hasPREDIMED    = snapshot.predimedStudy !== undefined;
  const hasAssets      = snapshot.evidenceStore.atoms.some(
    (atom) => atom.kind === "asset"
  );

  const repositoryDocumentCount = snapshot.repository.documents.length;
  const evidenceAtomCount       = snapshot.evidenceStore.atoms.length;
  const ibseValidRecordCount    = snapshot.ibseStudy?.aggregates.nValid ?? 0;
  const dukeRecordCount         = snapshot.dukeStudy?.aggregates.nValidGlobal ?? 0;
  const predimedRecordCount     = snapshot.predimedStudy?.aggregates.nValid ?? 0;

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
    hasDUKE,
    hasPREDIMED,
    hasAssets,
    repositoryDocumentCount,
    evidenceAtomCount,
    ibseValidRecordCount,
    dukeRecordCount,
    predimedRecordCount,
    hasThematicPrioritisation,
    hasStrategicPrioritisation,
    hasMunicipalEnrichment,
    warnings,
  };
}
