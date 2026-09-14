import type { MunicipalDocument } from "../../domain/repository";

export interface DocumentReferenceTarget {
  documentId?: string;
  fileName?: string;
}

// Un ID explícito nunca cae a un documento de nombre parecido.
export function resolveDocumentReference(
  documents: MunicipalDocument[],
  reference: DocumentReferenceTarget
): MunicipalDocument[] {
  if (reference.documentId) return documents.filter((document) => document.id === reference.documentId);
  if (reference.fileName) return documents.filter((document) => document.sourceFileName === reference.fileName);
  return [];
}
