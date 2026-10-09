import type { EvidenceAtom, EvidenceStore } from "../domain/evidence";
import {
  addMunicipalDocument,
  type DocumentKind,
  type MunicipalDocument,
} from "../domain/repository";
import type { MunicipalityWorkspace } from "../domain/workspace";
import { transformDocumentToEvidence } from "./evidence-pipeline";

export const COMPAS_LIBRARY_ASSIGNED_TAG = "compas-library-assigned";
export const COMPAS_LIBRARY_SOURCE_MUNICIPALITY_TAG_PREFIX =
  "source-municipality:";
export const COMPAS_LIBRARY_SOURCE_DOCUMENT_TAG_PREFIX = "source-document:";

export const COMPAS_LIBRARY_ASSIGNABLE_KINDS: readonly DocumentKind[] = [
  "strategic-framework",
];

const LIBRARY_LIMITATION =
  "Copia documental reutilizada desde otro expediente COMPAS; requiere revisar su aplicabilidad al ambito activo.";

export interface CompasLibraryDocument {
  id: string;
  sourceMunicipalityId: string;
  sourceMunicipalityName: string;
  document: MunicipalDocument;
  atoms: EvidenceAtom[];
  canAssign: boolean;
  alreadyAssigned: boolean;
}

export type AssignLibraryDocumentStatus =
  | "assigned"
  | "already-assigned"
  | "not-assignable"
  | "same-municipality";

export interface AssignLibraryDocumentInput {
  workspace: MunicipalityWorkspace;
  sourceMunicipalityId: string;
  sourceMunicipalityName: string;
  document: MunicipalDocument;
  atoms?: EvidenceAtom[];
}

export interface AssignLibraryDocumentResult {
  status: AssignLibraryDocumentStatus;
  workspace: MunicipalityWorkspace;
  targetDocumentId: string;
  document?: MunicipalDocument;
  atomsCreated: EvidenceAtom[];
}

function uniq(values: string[]): string[] {
  return Array.from(new Set(values.filter((value) => value.trim().length > 0)));
}

function sanitizeIdPart(value: string): string {
  return (
    value
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "doc"
  );
}

function sourceMunicipalityTag(sourceMunicipalityId: string): string {
  return `${COMPAS_LIBRARY_SOURCE_MUNICIPALITY_TAG_PREFIX}${sourceMunicipalityId}`;
}

function sourceDocumentTag(sourceDocumentId: string): string {
  return `${COMPAS_LIBRARY_SOURCE_DOCUMENT_TAG_PREFIX}${sourceDocumentId}`;
}

function libraryDocumentKey(
  sourceMunicipalityId: string,
  sourceDocumentId: string
): string {
  return `${sourceMunicipalityId}::${sourceDocumentId}`;
}

export function libraryDocumentAssignmentId(
  sourceMunicipalityId: string,
  sourceDocumentId: string
): string {
  return `library-${sanitizeIdPart(sourceMunicipalityId)}-${sanitizeIdPart(
    sourceDocumentId
  )}`;
}

export function isLibraryAssignableDocument(
  document: MunicipalDocument
): boolean {
  return (
    COMPAS_LIBRARY_ASSIGNABLE_KINDS.includes(document.kind) &&
    document.status !== "archived" &&
    document.status !== "rejected"
  );
}

function isCompasLibraryVisibleDocument(document: MunicipalDocument): boolean {
  return isLibraryAssignableDocument(document);
}

function hasAssignedSourceDocument(
  workspace: MunicipalityWorkspace | undefined,
  sourceMunicipalityId: string,
  sourceDocumentId: string
): boolean {
  if (workspace === undefined) return false;
  const targetDocumentId = libraryDocumentAssignmentId(
    sourceMunicipalityId,
    sourceDocumentId
  );
  const sourceMuniTag = sourceMunicipalityTag(sourceMunicipalityId);
  const sourceDocTag = sourceDocumentTag(sourceDocumentId);
  return workspace.repository.documents.some(
    (document) =>
      document.id === targetDocumentId ||
      (document.tags.includes(COMPAS_LIBRARY_ASSIGNED_TAG) &&
        document.tags.includes(sourceMuniTag) &&
        document.tags.includes(sourceDocTag))
  );
}

function sourceAtomsForDocument(
  workspace: MunicipalityWorkspace,
  document: MunicipalDocument
): EvidenceAtom[] {
  return workspace.evidenceStore.atoms.filter(
    (atom) =>
      atom.municipalityId === workspace.municipality.identity.id &&
      atom.provenance.documentId === document.id
  );
}

export function collectCompasDocumentLibrary(
  workspaces: MunicipalityWorkspace[],
  targetMunicipalityId: string
): CompasLibraryDocument[] {
  const targetWorkspace = workspaces.find(
    (workspace) => workspace.municipality.identity.id === targetMunicipalityId
  );
  const byKey = new Map<string, CompasLibraryDocument>();

  for (const workspace of workspaces) {
    const sourceMunicipalityId = workspace.municipality.identity.id;
    if (sourceMunicipalityId === targetMunicipalityId) continue;

    for (const document of workspace.repository.documents) {
      if (!isCompasLibraryVisibleDocument(document)) continue;

      const key = libraryDocumentKey(sourceMunicipalityId, document.id);
      if (byKey.has(key)) continue;
      const alreadyAssigned = hasAssignedSourceDocument(
        targetWorkspace,
        sourceMunicipalityId,
        document.id
      );
      byKey.set(key, {
        id: key,
        sourceMunicipalityId,
        sourceMunicipalityName: workspace.municipality.identity.name,
        document,
        atoms: sourceAtomsForDocument(workspace, document),
        canAssign: isLibraryAssignableDocument(document) && !alreadyAssigned,
        alreadyAssigned,
      });
    }
  }

  return Array.from(byKey.values()).sort((a, b) => {
    const sourceCompare = a.sourceMunicipalityName.localeCompare(
      b.sourceMunicipalityName,
      "es"
    );
    if (sourceCompare !== 0) return sourceCompare;
    const kindCompare = a.document.kind.localeCompare(b.document.kind, "es");
    if (kindCompare !== 0) return kindCompare;
    return a.document.title.localeCompare(b.document.title, "es");
  });
}

function cloneLibraryAtom(
  atom: EvidenceAtom,
  index: number,
  input: AssignLibraryDocumentInput,
  targetDocumentId: string,
  now: string
): EvidenceAtom {
  return {
    ...atom,
    id: `${targetDocumentId}-atom-${index + 1}`,
    municipalityId: input.workspace.municipality.identity.id,
    provenance: {
      ...atom.provenance,
      documentId: targetDocumentId,
      sourceLabel: `${atom.provenance.sourceLabel ?? input.document.title} (copia documental desde ${input.sourceMunicipalityName})`,
      extractedAt: now,
    },
    methodology: {
      ...atom.methodology,
      limitations: uniq([...atom.methodology.limitations, LIBRARY_LIMITATION]),
    },
    tags: uniq([
      ...atom.tags,
      COMPAS_LIBRARY_ASSIGNED_TAG,
      sourceMunicipalityTag(input.sourceMunicipalityId),
      sourceDocumentTag(input.document.id),
    ]),
    createdAt: now,
    updatedAt: now,
  };
}

function markGeneratedAtomsAsLibraryCopies(
  store: EvidenceStore,
  atomsCreated: EvidenceAtom[],
  input: AssignLibraryDocumentInput,
  targetDocumentId: string,
  now: string
): { store: EvidenceStore; atomsCreated: EvidenceAtom[] } {
  if (atomsCreated.length === 0) return { store, atomsCreated };

  const enrichedById = new Map(
    atomsCreated.map((atom) => {
      const enriched: EvidenceAtom = {
        ...atom,
        provenance: {
          ...atom.provenance,
          documentId: targetDocumentId,
          sourceLabel: `${input.document.title} (copia documental desde ${input.sourceMunicipalityName})`,
          extractedAt: now,
        },
        methodology: {
          ...atom.methodology,
          limitations: uniq([
            ...atom.methodology.limitations,
            LIBRARY_LIMITATION,
          ]),
        },
        tags: uniq([
          ...atom.tags,
          COMPAS_LIBRARY_ASSIGNED_TAG,
          sourceMunicipalityTag(input.sourceMunicipalityId),
          sourceDocumentTag(input.document.id),
        ]),
        updatedAt: now,
      };
      return [atom.id, enriched] as const;
    })
  );

  return {
    store: {
      ...store,
      atoms: store.atoms.map((atom) => enrichedById.get(atom.id) ?? atom),
      updatedAt: now,
    },
    atomsCreated: Array.from(enrichedById.values()),
  };
}

export function assignLibraryDocumentToWorkspace(
  input: AssignLibraryDocumentInput
): AssignLibraryDocumentResult {
  const targetDocumentId = libraryDocumentAssignmentId(
    input.sourceMunicipalityId,
    input.document.id
  );

  if (input.sourceMunicipalityId === input.workspace.municipality.identity.id) {
    return {
      status: "same-municipality",
      workspace: input.workspace,
      targetDocumentId,
      atomsCreated: [],
    };
  }

  if (!isLibraryAssignableDocument(input.document)) {
    return {
      status: "not-assignable",
      workspace: input.workspace,
      targetDocumentId,
      atomsCreated: [],
    };
  }

  if (
    hasAssignedSourceDocument(
      input.workspace,
      input.sourceMunicipalityId,
      input.document.id
    )
  ) {
    const document = input.workspace.repository.documents.find(
      (candidate) => candidate.id === targetDocumentId
    );
    return {
      status: "already-assigned",
      workspace: input.workspace,
      targetDocumentId,
      document,
      atomsCreated: [],
    };
  }

  const now = new Date().toISOString();
  const sourceSystemParts = [
    "Biblioteca documental COMPAS",
    `copia desde ${input.sourceMunicipalityName}`,
    input.document.source.system ? `origen: ${input.document.source.system}` : "",
  ];
  const repository = addMunicipalDocument(input.workspace.repository, {
    id: targetDocumentId,
    kind: input.document.kind,
    title: input.document.title,
    source: {
      ...input.document.source,
      system: sourceSystemParts.filter(Boolean).join(" - "),
      collectedAt: input.document.source.collectedAt ?? now,
    },
    sourceFileName: input.document.sourceFileName,
    sourceText: input.document.sourceText,
    canGenerateEvidence: input.document.canGenerateEvidence,
    tags: uniq([
      ...input.document.tags,
      COMPAS_LIBRARY_ASSIGNED_TAG,
      sourceMunicipalityTag(input.sourceMunicipalityId),
      sourceDocumentTag(input.document.id),
    ]),
    documentNature: input.document.documentNature,
    territorialScale: input.document.territorialScale,
    ugc: input.document.ugc,
    contentMode: input.document.contentMode,
  });
  const document = repository.documents.find(
    (candidate) => candidate.id === targetDocumentId
  );

  if (document === undefined) {
    return {
      status: "not-assignable",
      workspace: input.workspace,
      targetDocumentId,
      atomsCreated: [],
    };
  }

  let evidenceStore = input.workspace.evidenceStore;
  let atomsCreated: EvidenceAtom[] = [];
  const atomsToClone = (input.atoms ?? []).filter(
    (atom) => atom.provenance.documentId === input.document.id
  );

  if (atomsToClone.length > 0) {
    atomsCreated = atomsToClone.map((atom, index) =>
      cloneLibraryAtom(atom, index, input, targetDocumentId, now)
    );
    evidenceStore = {
      ...evidenceStore,
      atoms: [...evidenceStore.atoms, ...atomsCreated],
      updatedAt: now,
    };
  } else if (
    document.sourceText !== undefined &&
    document.sourceText.trim().length > 0 &&
    document.canGenerateEvidence !== false
  ) {
    const transformed = transformDocumentToEvidence({
      store: evidenceStore,
      document,
      plainText: document.sourceText,
    });
    const marked = markGeneratedAtomsAsLibraryCopies(
      transformed.store,
      transformed.atomsCreated,
      input,
      targetDocumentId,
      now
    );
    evidenceStore = marked.store;
    atomsCreated = marked.atomsCreated;
  }

  return {
    status: "assigned",
    workspace: {
      ...input.workspace,
      repository,
      evidenceStore,
      updatedAt: now,
    },
    targetDocumentId,
    document,
    atomsCreated,
  };
}
