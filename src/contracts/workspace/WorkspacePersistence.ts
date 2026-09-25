import type { MunicipalityId } from "../../domain/municipality";
import type { MunicipalityWorkspace } from "../../domain/workspace";

export interface WorkspacePersistence {
  save(workspace: MunicipalityWorkspace): Promise<void>;
  load(municipalityId: MunicipalityId): Promise<MunicipalityWorkspace | null>;
  exists(municipalityId: MunicipalityId): Promise<boolean>;
}
