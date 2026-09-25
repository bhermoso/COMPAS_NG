import { describe, it, expect } from 'vitest';
import {
  createThematicPrioritisation,
  THEMATIC_TOPICS,
} from '../src/domain/thematic-prioritisation';
import { thematicPrioritisationToEvidenceAtoms } from '../src/application/thematic-prioritisation';
import {
  addMunicipalDocument,
  createMunicipalDocumentRepository,
  type MunicipalDocumentRepository,
} from '../src/domain/repository';
import type { EvidenceAtom } from '../src/domain/evidence';

const THEMATIC_PRIORITISATION_DOCUMENT_TAG = 'thematic-prioritisation';
const MUNICIPALITY_ID = 'test-traceability';

function emptyRepository(): MunicipalDocumentRepository {
  return createMunicipalDocumentRepository({ municipalityId: MUNICIPALITY_ID });
}

function attachDocumentIdToAtoms(atoms: EvidenceAtom[], documentId: string): EvidenceAtom[] {
  return atoms.map((a) => ({ ...a, provenance: { ...a.provenance, documentId } }));
}

describe('ThematicPrioritisation — trazabilidad de átomos', () => {
  const prioritisation = createThematicPrioritisation(MUNICIPALITY_ID, [
    'alimentacion',
    'actividad-fisica',
  ]);

  it('los átomos brutos no llevan documentId', () => {
    const atoms = thematicPrioritisationToEvidenceAtoms(prioritisation, THEMATIC_TOPICS);
    expect(atoms).toHaveLength(2);
    for (const atom of atoms) {
      expect(atom.provenance.documentId).toBeUndefined();
      expect(atom.provenance.origin).toBe('citizen-participation');
    }
  });

  it('sin documento previo — el documento manual creado porta los átomos con su documentId', () => {
    const documentId = 'manual-tp-doc-001';
    const repository = addMunicipalDocument(emptyRepository(), {
      id: documentId,
      kind: 'other',
      title: 'Priorización temática — Selección manual',
      source: {
        system: 'Selección manual COMPÁS NG',
        collectedAt: new Date().toISOString(),
      },
      tags: [THEMATIC_PRIORITISATION_DOCUMENT_TAG],
    });

    const atoms = attachDocumentIdToAtoms(
      thematicPrioritisationToEvidenceAtoms(prioritisation, THEMATIC_TOPICS),
      documentId
    );

    const doc = repository.documents.find((d) =>
      d.tags.includes(THEMATIC_PRIORITISATION_DOCUMENT_TAG)
    );
    expect(doc).toBeDefined();
    expect(doc!.id).toBe(documentId);
    expect(doc!.kind).toBe('other');
    expect(repository.documents).toHaveLength(1);

    for (const atom of atoms) {
      expect(atom.provenance.documentId).toBe(documentId);
      expect(atom.provenance.origin).toBe('citizen-participation');
    }
  });

  it('con documento previo (CSV) — los átomos heredan el documentId existente sin crear uno nuevo', () => {
    const existingId = 'csv-tp-doc-001';
    const repository = addMunicipalDocument(emptyRepository(), {
      id: existingId,
      kind: 'redcap-export',
      title: 'Priorización temática - papeletas.csv',
      source: {
        system: 'Importación REDCap Priorización temática',
        collectedAt: new Date().toISOString(),
      },
      sourceFileName: 'papeletas.csv',
      tags: ['redcap-export', THEMATIC_PRIORITISATION_DOCUMENT_TAG],
    });

    const existing = repository.documents.find((d) =>
      d.tags.includes(THEMATIC_PRIORITISATION_DOCUMENT_TAG)
    );
    expect(existing).toBeDefined();

    const atoms = attachDocumentIdToAtoms(
      thematicPrioritisationToEvidenceAtoms(prioritisation, THEMATIC_TOPICS),
      existing!.id
    );

    expect(repository.documents).toHaveLength(1);
    for (const atom of atoms) {
      expect(atom.provenance.documentId).toBe(existingId);
    }
  });

  it('todos los átomos tienen origin citizen-participation y kind strategic-priority', () => {
    const documentId = 'doc-kind-check';
    const atoms = attachDocumentIdToAtoms(
      thematicPrioritisationToEvidenceAtoms(prioritisation, THEMATIC_TOPICS),
      documentId
    );
    for (const atom of atoms) {
      expect(atom.kind).toBe('strategic-priority');
      expect(atom.provenance.origin).toBe('citizen-participation');
      expect(atom.methodology.requiresHumanValidation).toBe(true);
    }
  });
});
