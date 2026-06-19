import type { MunicipalityId } from "../../../domain/municipality";
import type { MunicipalityWorkspace } from "../../../domain/workspace";
import type { WorkspacePersistence } from "../../../contracts/workspace";

export class InMemoryWorkspacePersistence implements WorkspacePersistence {
  private readonly workspaces = new Map<MunicipalityId, MunicipalityWorkspace>();

  async save(workspace: MunicipalityWorkspace): Promise<void> {
    this.workspaces.set(workspace.municipality.identity.id, workspace);
  }

  async load(
    municipalityId: MunicipalityId
  ): Promise<MunicipalityWorkspace | null> {
    return this.workspaces.get(municipalityId) ?? null;
  }

  async exists(municipalityId: MunicipalityId): Promise<boolean> {
    return this.workspaces.has(municipalityId);
  }
}
