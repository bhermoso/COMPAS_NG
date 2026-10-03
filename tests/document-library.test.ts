import { describe, expect, it } from "vitest";
import {
  assignLibraryDocumentToWorkspace,
  collectCompasDocumentLibrary,
  libraryDocumentAssignmentId,
} from "../src/application/document-library";
import {
  addEvidenceAtom,
  createEvidenceAtom,
  createEvidenceStore,
} from "../src/domain/evidence";
import { createMunicipalityContext } from "../src/domain/municipality";
import {
  addMunicipalDocument,
  createMunicipalDocumentRepository,
  type DocumentKind,
  type MunicipalDocument,
} from "../src/domain/repository";
import {
  createMunicipalityWorkspace,
  type MunicipalityWorkspace,
} from "../src/domain/workspace";

function makeWorkspace(
  municipalityId: string,
  municipalityName: string
): MunicipalityWorkspace {
  return createMunicipalityWorkspace(
    createMunicipalityContext({
      id: municipalityId,
      name: municipalityName,
      province: "Granada",
    }),
    createMunicipalDocumentRepository({ municipalityId }),
    createEvidenceStore(municipalityId)
  );
}

function addDocument(
  workspace: MunicipalityWorkspace,
  input: {
    id: string;
    kind: DocumentKind;
    title: string;
    sourceText?: string;
    canGenerateEvidence?: boolean;
    tags?: string[];
  }
): { workspace: MunicipalityWorkspace; document: MunicipalDocument } {
  const repository = addMunicipalDocument(workspace.repository, {
    id: input.id,
    kind: input.kind,
    title: input.title,
    source: {
      system: "Expediente origen de prueba",
      collectedAt: "2026-01-01T00:00:00.000Z",
    },
    sourceText: input.sourceText,
    canGenerateEvidence: input.canGenerateEvidence,
    tags: input.tags ?? [input.kind],
  });
  const document = repository.documents.find((doc) => doc.id === input.id);
  if (document === undefined) throw new Error("Documento de prueba no creado");
  return {
    workspace: { ...workspace, repository },
    document,
  };
}

describe("Biblioteca documental COMPAS", () => {
  it("permite consultar todos los documentos de otros expedientes y marca los asignables", () => {
    let source = makeWorkspace("granada-zaidin", "Granada-Zaidín");
    const strategic = addDocument(source, {
      id: "epvsa",
      kind: "strategic-framework",
      title: "EPVSA 2024-2030",
      sourceText: "Linea estrategica de salud comunitaria.",
    });
    source = strategic.workspace;
    const healthReport = addDocument(source, {
      id: "health-report",
      kind: "health-report",
      title: "Informe de Salud Granada-Zaidín",
      sourceText: "Texto no reutilizable como extra intermunicipal.",
      canGenerateEvidence: false,
      tags: ["health-report"],
    });
    source = healthReport.workspace;

    const library = collectCompasDocumentLibrary(
      [source, makeWorkspace("alfacar", "Alfacar")],
      "alfacar"
    );

    expect(library.map((item) => item.document.id)).toEqual([
      "health-report",
      "epvsa",
    ]);
    expect(library.find((item) => item.document.id === "epvsa")?.canAssign).toBe(
      true
    );
    expect(
      library.find((item) => item.document.id === "health-report")?.canAssign
    ).toBe(false);
  });

  it("asigna una copia local y reescribe los atomos derivados hacia el municipio destino", () => {
    let source = makeWorkspace("granada-zaidin", "Granada-Zaidín");
    const added = addDocument(source, {
      id: "plan-estrategico",
      kind: "strategic-framework",
      title: "Plan estrategico complementario",
      sourceText: "Prioridad: promover envejecimiento activo.",
    });
    source = added.workspace;
    const atom = createEvidenceAtom({
      id: "source-atom-1",
      municipalityId: "granada-zaidin",
      kind: "strategic-priority",
      title: "Promover envejecimiento activo",
      content: "Prioridad: promover envejecimiento activo.",
      provenance: {
        origin: "strategic-framework",
        documentId: added.document.id,
        sourceLabel: added.document.title,
        extractedAt: "2026-01-01T00:00:00.000Z",
      },
      tags: ["strategic-framework"],
    });
    source = {
      ...source,
      evidenceStore: addEvidenceAtom(source.evidenceStore, atom),
    };
    const target = makeWorkspace("alfacar", "Alfacar");
    const item = collectCompasDocumentLibrary([source, target], "alfacar")[0];

    const result = assignLibraryDocumentToWorkspace({
      workspace: target,
      sourceMunicipalityId: item.sourceMunicipalityId,
      sourceMunicipalityName: item.sourceMunicipalityName,
      document: item.document,
      atoms: item.atoms,
    });

    const targetDocumentId = libraryDocumentAssignmentId(
      "granada-zaidin",
      "plan-estrategico"
    );
    expect(result.status).toBe("assigned");
    expect(source.repository.documents).toHaveLength(1);
    expect(result.workspace.repository.documents).toHaveLength(1);
    const copiedDocument = result.workspace.repository.documents[0];
    expect(copiedDocument.id).toBe(targetDocumentId);
    expect(copiedDocument.municipalityId).toBe("alfacar");
    expect(copiedDocument.tags).toContain("compas-library-assigned");
    expect(copiedDocument.tags).toContain("source-municipality:granada-zaidin");
    expect(copiedDocument.tags).toContain("source-document:plan-estrategico");

    expect(result.atomsCreated).toHaveLength(1);
    const copiedAtom = result.workspace.evidenceStore.atoms[0];
    expect(copiedAtom.municipalityId).toBe("alfacar");
    expect(copiedAtom.provenance.documentId).toBe(targetDocumentId);
    expect(copiedAtom.tags).toContain("compas-library-assigned");
    expect(copiedAtom.methodology.limitations.join(" ")).toContain(
      "aplicabilidad"
    );
  });

  it("es idempotente: asignar dos veces el mismo origen no duplica documentos ni atomos", () => {
    let source = makeWorkspace("granada-zaidin", "Granada-Zaidín");
    const added = addDocument(source, {
      id: "epvsa",
      kind: "strategic-framework",
      title: "EPVSA",
      sourceText: "Linea 1: accion local en salud.",
    });
    source = added.workspace;
    const target = makeWorkspace("alfacar", "Alfacar");
    const item = collectCompasDocumentLibrary([source, target], "alfacar")[0];
    const first = assignLibraryDocumentToWorkspace({
      workspace: target,
      sourceMunicipalityId: item.sourceMunicipalityId,
      sourceMunicipalityName: item.sourceMunicipalityName,
      document: item.document,
      atoms: item.atoms,
    });
    const second = assignLibraryDocumentToWorkspace({
      workspace: first.workspace,
      sourceMunicipalityId: item.sourceMunicipalityId,
      sourceMunicipalityName: item.sourceMunicipalityName,
      document: item.document,
      atoms: item.atoms,
    });

    expect(first.status).toBe("assigned");
    expect(second.status).toBe("already-assigned");
    expect(second.workspace.repository.documents).toHaveLength(1);
    expect(second.workspace.evidenceStore.atoms).toHaveLength(1);
  });

  it("genera evidencia desde sourceText si el origen no tenia atomos derivados", () => {
    let source = makeWorkspace("granada-zaidin", "Granada-Zaidín");
    const added = addDocument(source, {
      id: "informe-territorial",
      kind: "territorial-documentation",
      title: "Informe territorial complementario",
      sourceText: "Tasa de envejecimiento superior a la media provincial.",
    });
    source = added.workspace;
    const target = makeWorkspace("alfacar", "Alfacar");
    const item = collectCompasDocumentLibrary([source, target], "alfacar")[0];

    const result = assignLibraryDocumentToWorkspace({
      workspace: target,
      sourceMunicipalityId: item.sourceMunicipalityId,
      sourceMunicipalityName: item.sourceMunicipalityName,
      document: item.document,
      atoms: item.atoms,
    });

    expect(result.status).toBe("assigned");
    expect(result.atomsCreated.length).toBeGreaterThan(0);
    expect(result.atomsCreated[0].municipalityId).toBe("alfacar");
    expect(result.atomsCreated[0].tags).toContain("compas-library-assigned");
  });

  it("no copia automaticamente tipos no reutilizables como health-report", () => {
    let source = makeWorkspace("granada-zaidin", "Granada-Zaidín");
    const added = addDocument(source, {
      id: "health-report",
      kind: "health-report",
      title: "Informe de Salud Granada-Zaidín",
      sourceText: "Contenido sanitario local.",
      canGenerateEvidence: false,
      tags: ["health-report"],
    });
    source = added.workspace;
    const target = makeWorkspace("alfacar", "Alfacar");
    const item = collectCompasDocumentLibrary([source, target], "alfacar")[0];

    const result = assignLibraryDocumentToWorkspace({
      workspace: target,
      sourceMunicipalityId: item.sourceMunicipalityId,
      sourceMunicipalityName: item.sourceMunicipalityName,
      document: item.document,
      atoms: item.atoms,
    });

    expect(result.status).toBe("not-assignable");
    expect(result.workspace.repository.documents).toHaveLength(0);
  });
});
