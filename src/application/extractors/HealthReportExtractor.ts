// NOT YET INTEGRATED — extrae hacia EvidenceGraph, no hacia EvidenceStore.
// Candidato a migrar a EvidenceStore cuando se defina el pipeline de extracción estructurada.
import type { MunicipalDocument } from "../../domain/repository";
import type {
  EvidenceGraph,
  EvidenceNode,
} from "../../domain/evidence";

import { addEvidenceNode } from "../../domain/evidence";

export interface ExtractHealthReportInput {
  graph: EvidenceGraph;
  document: MunicipalDocument;
  plainText: string;
}

export interface ExtractHealthReportResult {
  graph: EvidenceGraph;
  nodesCreated: number;
}

export function extractHealthReport(
  input: ExtractHealthReportInput
): ExtractHealthReportResult {

  const lines = input.plainText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  let graph = input.graph;
  let created = 0;

  for (let i = 0; i < lines.length; i++) {

    const node: EvidenceNode = {
      id: `${input.document.id}-line-${i + 1}`,
      municipalityId: graph.municipalityId,
      kind: "qualitative-finding",
      label: `Extracto ${i + 1}`,
      summary: lines[i],
      strength: "medium",
      provenance: [
        {
          documentId: input.document.id,
          extractedAt: new Date().toISOString(),
        },
      ],
      tags: ["health-report"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    graph = addEvidenceNode(graph, {
      id: node.id,
      kind: node.kind,
      label: node.label,
      summary: node.summary,
      strength: node.strength,
      provenance: node.provenance,
      tags: node.tags,
    });

    created++;
  }

  return {
    graph,
    nodesCreated: created,
  };
}
