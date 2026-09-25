import type { MunicipalityWorkspace } from "../../domain/workspace";

export const ZAIDIN_NON_OBSERVED_STUDIES_REMOVAL_MARKER =
  "granada-zaidin-remove-non-observed-studies-v1";

const SEEDED_STUDY_DOCUMENT_IDS = new Set([
  "doc-ibse", "doc-duke", "doc-predimed", "doc-sf12", "doc-sueno",
  "doc-cage", "doc-auditc", "doc-ipaq", "doc-ghq12", "doc-phq9",
  "doc-psqi", "doc-fagerstrom", "doc-sbq",
]);

/**
 * Retira exclusivamente los resultados sembrados como fixtures en
 * Granada-Zaidín. Los instrumentos y sus importadores siguen disponibles:
 * instrumento disponible no equivale a estudio realizado.
 *
 * Las importaciones posteriores usan otros identificadores documentales y no
 * se ven afectadas. La marca vuelve la limpieza idempotente.
 */
export function removeNonObservedZaidinStudies(
  workspace: MunicipalityWorkspace
): MunicipalityWorkspace {
  if (workspace.municipality.identity.id !== "granada-zaidin") return workspace;
  if ((workspace.appliedSeedMigrations ?? []).includes(
    ZAIDIN_NON_OBSERVED_STUDIES_REMOVAL_MARKER
  )) return workspace;

  const now = new Date().toISOString();
  const cleaned = { ...workspace };
  const fixtureStudies = [
    ["ibseStudy", "ibse-granada-provincia.csv"],
    ["dukeStudy", "duke-eas-granada.csv"],
    ["predimedStudy", "predimed-eas-granada.csv"],
    ["sf12Study", "sf12-eas-granada.csv"],
    ["suenoStudy", "sueno-eas-granada.csv"],
    ["cageStudy", "cage-eas-granada.csv"],
    ["auditcStudy", "auditc-municipal.csv"],
    ["ipaqStudy", "ipaq-eas-granada.csv"],
    ["ghq12Study", "ghq12-municipal.csv"],
    ["phq9Study", "phq9-municipal.csv"],
    ["psqiStudy", "psqi-municipal.csv"],
    ["fagerstromStudy", "fagerstrom-municipal.csv"],
    ["sbqStudy", "sbq-municipal.csv"],
  ] as const;
  for (const [key, sourceFileName] of fixtureStudies) {
    if (cleaned[key]?.sourceFileName === sourceFileName) delete cleaned[key];
  }

  const seededContentWasPresent =
    workspace.repository.documents.some((document) => SEEDED_STUDY_DOCUMENT_IDS.has(document.id)) ||
    workspace.evidenceStore.atoms.some((atom) =>
      SEEDED_STUDY_DOCUMENT_IDS.has(atom.provenance.documentId ?? "")
    ) ||
    fixtureStudies.some(([key, sourceFileName]) => workspace[key]?.sourceFileName === sourceFileName);

  if (seededContentWasPresent) {
    // Capturar antes de retirar cualquier producto vigente. El JSON opaco no
    // alimenta el pipeline y conserva decisiones, autoría y fuentes originales.
    cleaned.nonObservedStudiesArchive = {
      status: "historical-not-valid",
      migrationId: ZAIDIN_NON_OBSERVED_STUDIES_REMOVAL_MARKER,
      archivedAt: now,
      reason: "Resultados no observados retirados. Productos y decisiones anteriores requieren nueva revisión; no son vigentes.",
      workspaceJSON: JSON.stringify(workspace),
    };
    delete cleaned.validatedPSL;
    delete cleaned.validatedAnswersSnapshot;
    delete cleaned.compiledProfiles;
    delete cleaned.pslApproval;
    delete cleaned.formalValidations;
    delete cleaned.deliberativePrioritySelection;
    delete cleaned.actionPlanModuleReviews;
    delete cleaned.historialEstadosTerritorial;
  }

  return {
    ...cleaned,
    repository: {
      ...workspace.repository,
      documents: workspace.repository.documents.filter(
        (document) => !SEEDED_STUDY_DOCUMENT_IDS.has(document.id)
      ),
      updatedAt: now,
    },
    evidenceStore: {
      ...workspace.evidenceStore,
      atoms: workspace.evidenceStore.atoms.filter(
        (atom) => !SEEDED_STUDY_DOCUMENT_IDS.has(atom.provenance.documentId ?? "")
      ),
      updatedAt: now,
    },
    appliedSeedMigrations: [
      ...(workspace.appliedSeedMigrations ?? []),
      ZAIDIN_NON_OBSERVED_STUDIES_REMOVAL_MARKER,
    ],
    updatedAt: now,
  };
}
