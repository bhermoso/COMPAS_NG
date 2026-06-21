import type { MunicipalityWorkspace } from "../../../domain/workspace";
import type { HealthReportDocument } from "../../../domain/health-report";

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

  // Normalizar también healthReports[] si tiene más de una entrada
  const healthReports =
    workspace.healthReports && workspace.healthReports.length > 1
      ? [
          workspace.healthReports.reduce((best, curr) =>
            curr.createdAt >= best.createdAt ? curr : best
          ),
        ]
      : workspace.healthReports;

  const healthChanged =
    healthReports !== workspace.healthReports;

  if (!changed && !healthChanged) return workspace;

  return {
    ...workspace,
    healthReports,
    repository: {
      ...workspace.repository,
      documents: deduped,
      updatedAt: new Date().toISOString(),
    },
  };
}

// Elimina originalHtml y bodyHtml antes de serializar para no superar la cuota
// de localStorage (~5 MB). bodyText se preserva; HealthReportViewer lo usa como
// fallback cuando bodyHtml es undefined.
function stripHtmlFields(workspace: MunicipalityWorkspace): MunicipalityWorkspace {
  if (!workspace.healthReports || workspace.healthReports.length === 0) {
    return workspace;
  }
  return {
    ...workspace,
    healthReports: workspace.healthReports.map(
      (hr): HealthReportDocument => ({
        ...hr,
        body: { ...hr.body, originalHtml: undefined },
        sections: hr.sections.map((sec) => ({
          ...sec,
          bodyHtml: sec.bodyHtml?.includes("<table") ? sec.bodyHtml : undefined,
        })),
      })
    ),
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
    const parsed = JSON.parse(raw) as MunicipalityWorkspace;
    // Descartar datos de versiones de esquema distintas
    if (parsed.schemaVersion !== SCHEMA_VERSION) return null;
    // Sanear duplicados de tipos canónicos persistidos antes de 3ad377b
    return normalizeCanonicalDocuments(parsed);
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
