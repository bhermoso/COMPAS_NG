import type { MunicipalityWorkspace } from "../../../domain/workspace";

const KEY_PREFIX = "compas-ng:workspace";
const SCHEMA_VERSION = "1.0.0";

export function buildWorkspaceStorageKey(municipalityId: string): string {
  return `${KEY_PREFIX}:${municipalityId}`;
}

// Tipos documentales canónicos: una sola versión activa por municipio.
// Se aplica al hidratar desde localStorage para sanear datos anteriores
// al commit que introdujo replaceMunicipalDocumentByKind.
const CANONICAL_SINGLE_KINDS = ["health-report", "community-asset"] as const;

// Elimina duplicados de tipos canónicos conservando el documento con
// createdAt más reciente (lexicográfico ISO 8601). En caso de empate,
// prevalece el último del array. Tipos acumulables no se modifican.
function normalizeCanonicalDocuments(
  workspace: MunicipalityWorkspace
): MunicipalityWorkspace {
  const docs = workspace.repository.documents;
  let deduped = [...docs];
  let changed = false;

  for (const kind of CANONICAL_SINGLE_KINDS) {
    const ofKind = deduped.filter((d) => d.kind === kind);
    if (ofKind.length <= 1) continue;

    const toKeep = ofKind.reduce((best, curr) =>
      curr.createdAt >= best.createdAt ? curr : best
    );
    deduped = deduped.filter((d) => d.kind !== kind || d.id === toKeep.id);
    changed = true;
  }

  // Purgar átomos huérfanos: su documentId no existe en el repositorio post-deduplicación.
  const docIds = new Set(deduped.map((d) => d.id));
  const prunedAtoms = workspace.evidenceStore.atoms.filter(
    (a) => a.provenance.documentId === undefined || docIds.has(a.provenance.documentId)
  );
  const atomsChanged = prunedAtoms.length !== workspace.evidenceStore.atoms.length;

  if (!changed && !atomsChanged) return workspace;

  return {
    ...workspace,
    repository: {
      ...workspace.repository,
      documents: deduped,
      updatedAt: new Date().toISOString(),
    },
    evidenceStore: atomsChanged
      ? {
          ...workspace.evidenceStore,
          atoms: prunedAtoms,
          updatedAt: new Date().toISOString(),
        }
      : workspace.evidenceStore,
  };
}

// Elimina originalHtml y bodyHtml antes de serializar para no superar la cuota
// de localStorage (~5 MB). bodyText se preserva; HealthReportViewer lo usa como
// fallback cuando bodyHtml es undefined.
function stripHtmlFields(workspace: MunicipalityWorkspace): MunicipalityWorkspace {
  if (!workspace.healthReport) return workspace;
  const hr = workspace.healthReport;
  return {
    ...workspace,
    healthReport: {
      ...hr,
      body: { ...hr.body, originalHtml: undefined },
      sections: hr.sections.map((sec) => ({
        ...sec,
        bodyHtml: sec.bodyHtml?.includes("<table") ? sec.bodyHtml : undefined,
      })),
    },
  };
}

export function saveWorkspaceToLocalStorage(
  workspace: MunicipalityWorkspace
): void {
  try {
    const key = buildWorkspaceStorageKey(workspace.municipality.identity.id);
    localStorage.setItem(key, JSON.stringify(stripHtmlFields(workspace)));
  } catch {
    // localStorage puede estar deshabilitado o lleno (modo incógnito, cuota)
  }
}

export function loadWorkspaceFromLocalStorage(
  municipalityId: string
): MunicipalityWorkspace | null {
  try {
    const key = buildWorkspaceStorageKey(municipalityId);
    const raw = localStorage.getItem(key);
    if (!raw) return null;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const parsed = JSON.parse(raw) as any;

    // Descartar datos de versiones de esquema distintas
    if (parsed.schemaVersion !== SCHEMA_VERSION) return null;

    // Migrar formato anterior healthReports[] → healthReport singular
    if (Array.isArray(parsed.healthReports)) {
      parsed.healthReport = parsed.healthReports[0] ?? undefined;
      delete parsed.healthReports;
    }

    // Normalizar IBSEStudy: campo añadido en b66193a — rellenar en workspaces anteriores
    if (parsed.ibseStudy && !Array.isArray(parsed.ibseStudy.methodologicalCautions)) {
      parsed.ibseStudy.methodologicalCautions = [];
    }

    return normalizeCanonicalDocuments(parsed as MunicipalityWorkspace);
  } catch {
    return null;
  }
}

export function clearWorkspaceFromLocalStorage(municipalityId: string): void {
  try {
    localStorage.removeItem(buildWorkspaceStorageKey(municipalityId));
  } catch {
    // ignorar
  }
}
