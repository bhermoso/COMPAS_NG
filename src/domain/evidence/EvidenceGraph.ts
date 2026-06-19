import type { DocumentId } from "../repository";
import type { MunicipalityId } from "../municipality";

export type EvidenceNodeId = string;
export type EvidenceRelationshipId = string;

export type EvidenceNodeKind =
  | "determinant"
  | "indicator"
  | "complementary-study-result"
  | "community-asset"
  | "participation-finding"
  | "qualitative-finding"
  | "territorial-context"
  | "longitudinal-observation"
  | "other";

export type EvidenceRelationshipKind =
  | "supports"
  | "contradicts"
  | "contextualizes"
  | "derives-from"
  | "is-associated-with"
  | "requires-caution";

export type EvidenceStrength =
  | "low"
  | "medium"
  | "high";

export interface EvidenceProvenance {
  documentId: DocumentId;
  excerpt?: string;
  page?: number;
  field?: string;
  extractedAt: string;
}

export interface EvidenceNode {
  id: EvidenceNodeId;
  municipalityId: MunicipalityId;
  kind: EvidenceNodeKind;
  label: string;
  summary: string;
  strength: EvidenceStrength;
  provenance: EvidenceProvenance[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface EvidenceRelationship {
  id: EvidenceRelationshipId;
  municipalityId: MunicipalityId;
  kind: EvidenceRelationshipKind;
  fromNodeId: EvidenceNodeId;
  toNodeId: EvidenceNodeId;
  rationale: string;
  createdAt: string;
}

export interface EvidenceGraph {
  municipalityId: MunicipalityId;
  nodes: EvidenceNode[];
  relationships: EvidenceRelationship[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateEvidenceGraphInput {
  municipalityId: MunicipalityId;
}

export interface AddEvidenceNodeInput {
  id: EvidenceNodeId;
  kind: EvidenceNodeKind;
  label: string;
  summary: string;
  strength?: EvidenceStrength;
  provenance: EvidenceProvenance[];
  tags?: string[];
}

export interface AddEvidenceRelationshipInput {
  id: EvidenceRelationshipId;
  kind: EvidenceRelationshipKind;
  fromNodeId: EvidenceNodeId;
  toNodeId: EvidenceNodeId;
  rationale: string;
}

export function createEvidenceGraph(
  input: CreateEvidenceGraphInput
): EvidenceGraph {
  const now = new Date().toISOString();

  return {
    municipalityId: input.municipalityId,
    nodes: [],
    relationships: [],
    createdAt: now,
    updatedAt: now,
  };
}

export function addEvidenceNode(
  graph: EvidenceGraph,
  input: AddEvidenceNodeInput
): EvidenceGraph {
  const now = new Date().toISOString();

  const node: EvidenceNode = {
    id: input.id,
    municipalityId: graph.municipalityId,
    kind: input.kind,
    label: input.label,
    summary: input.summary,
    strength: input.strength ?? "medium",
    provenance: input.provenance,
    tags: input.tags ?? [],
    createdAt: now,
    updatedAt: now,
  };

  return {
    ...graph,
    nodes: [...graph.nodes, node],
    updatedAt: now,
  };
}

export function addEvidenceRelationship(
  graph: EvidenceGraph,
  input: AddEvidenceRelationshipInput
): EvidenceGraph {
  const now = new Date().toISOString();

  const relationship: EvidenceRelationship = {
    id: input.id,
    municipalityId: graph.municipalityId,
    kind: input.kind,
    fromNodeId: input.fromNodeId,
    toNodeId: input.toNodeId,
    rationale: input.rationale,
    createdAt: now,
  };

  return {
    ...graph,
    relationships: [...graph.relationships, relationship],
    updatedAt: now,
  };
}

export function getEvidenceNodesByKind(
  graph: EvidenceGraph,
  kind: EvidenceNodeKind
): EvidenceNode[] {
  return graph.nodes.filter((node) => node.kind === kind);
}

export function getEvidenceRelationshipsForNode(
  graph: EvidenceGraph,
  nodeId: EvidenceNodeId
): EvidenceRelationship[] {
  return graph.relationships.filter(
    (relationship) =>
      relationship.fromNodeId === nodeId || relationship.toNodeId === nodeId
  );
}
