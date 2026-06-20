import {
  createMunicipalityContext,
  type CreateMunicipalityContextInput,
} from "../../domain/municipality";

import {
  createMunicipalDocumentRepository,
} from "../../domain/repository";

import {
  createEvidenceStore,
} from "../../domain/evidence";

import {
  createMunicipalityWorkspace,
  type MunicipalityWorkspace,
} from "../../domain/workspace";

export function createCompleteMunicipalityWorkspace(
  input: CreateMunicipalityContextInput
): MunicipalityWorkspace {
  const municipality = createMunicipalityContext(input);

  const repository = createMunicipalDocumentRepository({
    municipalityId: municipality.identity.id,
  });

  const evidenceStore = createEvidenceStore(municipality.identity.id);

  return createMunicipalityWorkspace(
    municipality,
    repository,
    evidenceStore
  );
}
