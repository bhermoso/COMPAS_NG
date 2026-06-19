import {
  createMunicipalityContext,
  type CreateMunicipalityContextInput,
} from "../../domain/municipality";

import {
  createMunicipalDocumentRepository,
} from "../../domain/repository";

import {
  createEvidenceGraph,
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

  const evidence = createEvidenceGraph({
    municipalityId: municipality.identity.id,
  });

  return createMunicipalityWorkspace(
    municipality,
    repository,
    evidence
  );
}
