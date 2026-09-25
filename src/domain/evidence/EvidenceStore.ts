import type { MunicipalityId } from "../municipality";
import type {
  EvidenceAtom,
  EvidenceAtomKind,
  EvidenceConfidence,
  EvidenceOrigin,
} from "./EvidenceAtom";

export interface EvidenceStore {
  municipalityId: MunicipalityId;
  atoms: EvidenceAtom[];
  createdAt: string;
  updatedAt: string;
}

export function createEvidenceStore(
  municipalityId: MunicipalityId
): EvidenceStore {
  const now = new Date().toISOString();

  return {
    municipalityId,
    atoms: [],
    createdAt: now,
    updatedAt: now,
  };
}

export function addEvidenceAtom(
  store: EvidenceStore,
  atom: EvidenceAtom
): EvidenceStore {
  return {
    ...store,
    atoms: [...store.atoms, atom],
    updatedAt: new Date().toISOString(),
  };
}

export function getEvidenceAtomsByKind(
  store: EvidenceStore,
  kind: EvidenceAtomKind
): EvidenceAtom[] {
  return store.atoms.filter((atom) => atom.kind === kind);
}

export function getEvidenceAtomsByOrigin(
  store: EvidenceStore,
  origin: EvidenceOrigin
): EvidenceAtom[] {
  return store.atoms.filter((atom) => atom.provenance.origin === origin);
}

export function getEvidenceAtomsByConfidence(
  store: EvidenceStore,
  confidence: EvidenceConfidence
): EvidenceAtom[] {
  return store.atoms.filter((atom) => atom.confidence === confidence);
}

export function getEvidenceAtomsRequiringValidation(
  store: EvidenceStore
): EvidenceAtom[] {
  return store.atoms.filter(
    (atom) => atom.methodology.requiresHumanValidation
  );
}

export function searchEvidenceAtomsByTag(
  store: EvidenceStore,
  tag: string
): EvidenceAtom[] {
  return store.atoms.filter((atom) => atom.tags.includes(tag));
}

// Clave semántica estable para activos: reproducible entre recargas del mismo listado.
export type EvidenceAtomStableKey = string;

export function stableAssetKey(
  municipalityId: string,
  origin: EvidenceOrigin,
  title: string
): EvidenceAtomStableKey {
  const normalized = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return `${origin}:${municipalityId}:${normalized}`;
}

export function upsertEvidenceAtom(
  store: EvidenceStore,
  incoming: EvidenceAtom,
  key: EvidenceAtomStableKey
): EvidenceStore {
  const now = new Date().toISOString();
  const existingIndex = store.atoms.findIndex(
    (a) => stableAssetKey(a.municipalityId, a.provenance.origin, a.title) === key
  );

  if (existingIndex === -1) {
    return { ...store, atoms: [...store.atoms, incoming], updatedAt: now };
  }

  const existing = store.atoms[existingIndex];
  const updated: EvidenceAtom = {
    ...existing,
    content: incoming.content,
    provenance: incoming.provenance,
    updatedAt: now,
  };
  const atoms = store.atoms.map((a, i) => (i === existingIndex ? updated : a));
  return { ...store, atoms, updatedAt: now };
}
