import type { MunicipalityWorkspace } from "../../../domain/workspace";
import type { HealthReportDocument } from "../../../domain/health-report";

const KEY_PREFIX = "compas-ng:workspace";
const SCHEMA_VERSION = "1.0.0";

export function buildWorkspaceStorageKey(municipalityId: string): string {
  return `${KEY_PREFIX}:${municipalityId}`;
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
        sections: hr.sections.map((sec) => ({ ...sec, bodyHtml: undefined })),
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
    return parsed;
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
