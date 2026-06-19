import {
  type MunicipalDocument,
} from "../../domain/repository";

import {
  type EvidenceGraph,
  addEvidenceNode,
} from "../../domain/evidence";

export interface IngestionResult {
  evidenceGraph: EvidenceGraph;
  nodesCreated: number;
}

export function ingestDocument(
  evidenceGraph: EvidenceGraph,
  document: MunicipalDocument
): IngestionResult {
  const updatedGraph = addEvidenceNode(evidenceGraph, {
    id: `doc-${document.id}`,
    kind: "other",
    label: document.title,
    summary: `Documento ingerido: ${document.title}`,
    provenance: [
      {
        documentId: document.id,
        extractedAt: new Date().toISOString(),
      },
    ],
    tags: document.tags,
  });

  return {
    evidenceGraph: updatedGraph,
    nodesCreated: 1,
  };
}
