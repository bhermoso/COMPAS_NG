import type { MunicipalityId } from "../municipality";

export type DocumentId = string;

export type DocumentKind =
  | "health-report"
  | "complementary-study"
  | "eas-variable"
  | "cmi-indicator"
  | "community-asset"
  | "localiza-salud"
  | "strategic-framework"
  | "redcap-export"
  | "territorial-documentation"
  | "qualitative-material"
  | "longitudinal-evidence"
  | "other";

export type DocumentStatus =
  | "uploaded"
  | "validated"
  | "rejected"
  | "archived";

export interface DocumentSource {
  organization?: string;
  system?: string;
  url?: string;
  collectedAt?: string;
}

export interface MunicipalDocument {
  id: DocumentId;
  municipalityId: MunicipalityId;
  kind: DocumentKind;
  title: string;
  status: DocumentStatus;
  source: DocumentSource;
  sourceFileName?: string;
  sourceText?: string;
  canGenerateEvidence?: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface MunicipalDocumentRepository {
  municipalityId: MunicipalityId;
  documents: MunicipalDocument[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateMunicipalDocumentRepositoryInput {
  municipalityId: MunicipalityId;
}

export interface AddMunicipalDocumentInput {
  id: DocumentId;
  kind: DocumentKind;
  title: string;
  source?: DocumentSource;
  sourceFileName?: string;
  sourceText?: string;
  canGenerateEvidence?: boolean;
  tags?: string[];
}

function defaultCanGenerateEvidence(kind: DocumentKind): boolean {
  return kind !== "health-report";
}

export function createMunicipalDocumentRepository(
  input: CreateMunicipalDocumentRepositoryInput
): MunicipalDocumentRepository {
  const now = new Date().toISOString();

  return {
    municipalityId: input.municipalityId,
    documents: [],
    createdAt: now,
    updatedAt: now,
  };
}

export function addMunicipalDocument(
  repository: MunicipalDocumentRepository,
  input: AddMunicipalDocumentInput
): MunicipalDocumentRepository {
  const now = new Date().toISOString();

  const document: MunicipalDocument = {
    id: input.id,
    municipalityId: repository.municipalityId,
    kind: input.kind,
    title: input.title,
    status: "uploaded",
    source: input.source ?? {},
    sourceFileName: input.sourceFileName,
    sourceText: input.sourceText,
    canGenerateEvidence:
      input.canGenerateEvidence ?? defaultCanGenerateEvidence(input.kind),
    tags: input.tags ?? [],
    createdAt: now,
    updatedAt: now,
  };

  return {
    ...repository,
    documents: [...repository.documents, document],
    updatedAt: now,
  };
}

// Para tipos documentales canónicos (una sola versión activa por municipio):
// elimina todas las entradas previas del mismo tipo y registra la nueva.
export function replaceMunicipalDocumentByKind(
  repository: MunicipalDocumentRepository,
  input: AddMunicipalDocumentInput
): MunicipalDocumentRepository {
  const now = new Date().toISOString();
  const withoutPrior: MunicipalDocumentRepository = {
    ...repository,
    documents: repository.documents.filter((doc) => doc.kind !== input.kind),
    updatedAt: now,
  };
  return addMunicipalDocument(withoutPrior, input);
}

export function validateMunicipalDocument(
  repository: MunicipalDocumentRepository,
  documentId: DocumentId
): MunicipalDocumentRepository {
  const now = new Date().toISOString();

  return {
    ...repository,
    documents: repository.documents.map((document) =>
      document.id === documentId
        ? { ...document, status: "validated", updatedAt: now }
        : document
    ),
    updatedAt: now,
  };
}

export function removeMunicipalDocument(
  repository: MunicipalDocumentRepository,
  documentId: DocumentId
): MunicipalDocumentRepository {
  const now = new Date().toISOString();
  return {
    ...repository,
    documents: repository.documents.filter((d) => d.id !== documentId),
    updatedAt: now,
  };
}

export function archiveMunicipalDocument(
  repository: MunicipalDocumentRepository,
  documentId: DocumentId
): MunicipalDocumentRepository {
  const now = new Date().toISOString();

  return {
    ...repository,
    documents: repository.documents.map((document) =>
      document.id === documentId
        ? { ...document, status: "archived", updatedAt: now }
        : document
    ),
    updatedAt: now,
  };
}

export function getDocumentsByKind(
  repository: MunicipalDocumentRepository,
  kind: DocumentKind
): MunicipalDocument[] {
  return repository.documents.filter((document) => document.kind === kind);
}

export function getValidatedDocuments(
  repository: MunicipalDocumentRepository
): MunicipalDocument[] {
  return repository.documents.filter(
    (document) => document.status === "validated"
  );
}
