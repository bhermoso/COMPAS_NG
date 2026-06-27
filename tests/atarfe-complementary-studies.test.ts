import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { createCompleteMunicipalityWorkspace } from "../src/application/workspace";
import { parseIBSECSV, ibseStudyToEvidenceAtoms } from "../src/application/ibse";
import { parseDUKECSV, dukeStudyToEvidenceAtoms } from "../src/application/duke";
import { parsePREDIMEDCSV, predimedStudyToEvidenceAtoms } from "../src/application/predimed";
import { parseSF12CSV, sf12StudyToEvidenceAtoms } from "../src/application/sf12";
import { parseSuenoCSV, suenoStudyToEvidenceAtoms } from "../src/application/sueno";
import { parseCAGECSV, cageStudyToEvidenceAtoms } from "../src/application/cage";
import { createIBSEStudy } from "../src/domain/ibse";
import { createDUKEStudy } from "../src/domain/duke";
import { createPREDIMEDStudy } from "../src/domain/predimed";
import { createSF12Study } from "../src/domain/sf12";
import { createSuenoStudy } from "../src/domain/sueno";
import { createCAGEStudy } from "../src/domain/cage";
import {
  addMunicipalDocument,
  type AddMunicipalDocumentInput,
} from "../src/domain/repository";
import {
  stableAssetKey,
  upsertEvidenceAtom,
  type EvidenceAtom,
} from "../src/domain/evidence";
import type { MunicipalityWorkspace } from "../src/domain/workspace";
import { createMunicipalSnapshot } from "../src/domain/municipality-context";
import { createMunicipalInventory } from "../src/application/municipal-inventory";

const fixtureDir = resolve(dirname(fileURLToPath(import.meta.url)), "../fixtures");
const municipalityId = "atarfe";

function fixture(name: string): string {
  return readFileSync(resolve(fixtureDir, name), "utf-8");
}

function registerStudy(
  current: MunicipalityWorkspace,
  studyPatch: Partial<MunicipalityWorkspace>,
  document: AddMunicipalDocumentInput,
  atoms: EvidenceAtom[]
): MunicipalityWorkspace {
  const now = new Date().toISOString();
  let evidenceStore = current.evidenceStore;

  for (const atom of atoms) {
    const linkedAtom: EvidenceAtom = {
      ...atom,
      provenance: { ...atom.provenance, documentId: document.id },
    };
    evidenceStore = upsertEvidenceAtom(
      evidenceStore,
      linkedAtom,
      stableAssetKey(linkedAtom.municipalityId, linkedAtom.provenance.origin, linkedAtom.title)
    );
  }

  return {
    ...current,
    ...studyPatch,
    repository: addMunicipalDocument(current.repository, document),
    evidenceStore: { ...evidenceStore, updatedAt: now },
    updatedAt: now,
  };
}

let workspace = createCompleteMunicipalityWorkspace({
  id: municipalityId,
  name: "Atarfe",
  province: "Granada",
  ineCode: "18022",
  createdBy: "COMPAS NG",
});

const ibseParsed = parseIBSECSV(fixture("ibse-atarfe.csv"));
const ibseStudy = createIBSEStudy({
  municipalityId,
  sourceFileName: "ibse-atarfe.csv",
  aggregates: ibseParsed.aggregates,
  methodologicalCautions: ibseParsed.methodologicalCautions,
});
const ibseAtoms = ibseStudyToEvidenceAtoms(ibseStudy);
workspace = registerStudy(
  workspace,
  { ibseStudy },
  {
    id: "ibse-atarfe-fixture",
    kind: "redcap-export",
    title: "IBSE - ibse-atarfe.csv",
    sourceFileName: "ibse-atarfe.csv",
    source: { system: "Importacion REDCap IBSE" },
    tags: ["redcap-export", "ibse"],
  },
  ibseAtoms
);

const dukeParsed = parseDUKECSV(fixture("duke-eas-granada.csv"));
const dukeStudy = createDUKEStudy({
  municipalityId,
  sourceFileName: "duke-eas-granada.csv",
  aggregates: dukeParsed.aggregates,
  methodologicalCautions: dukeParsed.methodologicalCautions,
  warnings: dukeParsed.warnings,
});
const dukeAtoms = dukeStudyToEvidenceAtoms(dukeStudy);
workspace = registerStudy(
  workspace,
  { dukeStudy },
  {
    id: "duke-eas-granada-fixture",
    kind: "complementary-study",
    title: "DUKE-EAS - duke-eas-granada.csv",
    sourceFileName: "duke-eas-granada.csv",
    source: { system: "EAS microdatos - Apoyo social funcional" },
    tags: ["complementary-study", "duke-eas", "eas"],
  },
  dukeAtoms
);

const predimedParsed = parsePREDIMEDCSV(fixture("predimed-eas-granada.csv"));
const predimedStudy = createPREDIMEDStudy({
  municipalityId,
  sourceFileName: "predimed-eas-granada.csv",
  aggregates: predimedParsed.aggregates,
  methodologicalCautions: predimedParsed.methodologicalCautions,
  warnings: predimedParsed.warnings,
});
const predimedAtoms = predimedStudyToEvidenceAtoms(predimedStudy);
workspace = registerStudy(
  workspace,
  { predimedStudy },
  {
    id: "predimed-eas-granada-fixture",
    kind: "complementary-study",
    title: "PREDIMED-EAS - predimed-eas-granada.csv",
    sourceFileName: "predimed-eas-granada.csv",
    source: { system: "EAS microdatos - Adherencia a dieta mediterranea" },
    tags: ["complementary-study", "predimed-eas", "eas"],
  },
  predimedAtoms
);

const sf12Parsed = parseSF12CSV(fixture("sf12-eas-granada.csv"));
const sf12Study = createSF12Study({
  municipalityId,
  sourceFileName: "sf12-eas-granada.csv",
  aggregates: sf12Parsed.aggregates,
  methodologicalCautions: sf12Parsed.methodologicalCautions,
  warnings: sf12Parsed.warnings,
});
const sf12Atoms = sf12StudyToEvidenceAtoms(sf12Study);
workspace = registerStudy(
  workspace,
  { sf12Study },
  {
    id: "sf12-eas-granada-fixture",
    kind: "complementary-study",
    title: "SF-12 EAS - sf12-eas-granada.csv",
    sourceFileName: "sf12-eas-granada.csv",
    source: { system: "EAS microdatos - Salud percibida SF-12" },
    tags: ["complementary-study", "sf12-eas", "eas"],
  },
  sf12Atoms
);

const suenoParsed = parseSuenoCSV(fixture("sueno-eas-granada.csv"));
const suenoStudy = createSuenoStudy({
  municipalityId,
  sourceFileName: "sueno-eas-granada.csv",
  aggregates: suenoParsed.aggregates,
  methodologicalCautions: suenoParsed.methodologicalCautions,
  warnings: suenoParsed.warnings,
});
const suenoAtoms = suenoStudyToEvidenceAtoms(suenoStudy);
workspace = registerStudy(
  workspace,
  { suenoStudy },
  {
    id: "sueno-eas-granada-fixture",
    kind: "complementary-study",
    title: "Sueno EAS - sueno-eas-granada.csv",
    sourceFileName: "sueno-eas-granada.csv",
    source: { system: "EAS microdatos - Sueno" },
    tags: ["complementary-study", "sueno-eas", "eas"],
  },
  suenoAtoms
);

const cageParsed = parseCAGECSV(fixture("cage-eas-granada.csv"));
const cageStudy = createCAGEStudy({
  municipalityId,
  sourceFileName: "cage-eas-granada.csv",
  aggregates: cageParsed.aggregates,
  methodologicalCautions: cageParsed.methodologicalCautions,
  warnings: cageParsed.warnings,
});
const cageAtoms = cageStudyToEvidenceAtoms(cageStudy);
workspace = registerStudy(
  workspace,
  { cageStudy },
  {
    id: "cage-eas-granada-fixture",
    kind: "complementary-study",
    title: "CAGE-EAS - cage-eas-granada.csv",
    sourceFileName: "cage-eas-granada.csv",
    source: { system: "EAS microdatos - Consumo de alcohol" },
    tags: ["complementary-study", "cage-eas", "eas"],
  },
  cageAtoms
);

const inventory = createMunicipalInventory(createMunicipalSnapshot(workspace));

describe("Atarfe - workspace con estudios complementarios", () => {
  it("registra los seis estudios en el workspace y el repositorio", () => {
    expect(workspace.ibseStudy).toBeDefined();
    expect(workspace.dukeStudy).toBeDefined();
    expect(workspace.predimedStudy).toBeDefined();
    expect(workspace.sf12Study).toBeDefined();
    expect(workspace.suenoStudy).toBeDefined();
    expect(workspace.cageStudy).toBeDefined();
    expect(workspace.repository.documents).toHaveLength(6);
  });

  it("procesa las coberturas esperadas de los fixtures", () => {
    expect(workspace.ibseStudy?.aggregates.nValid).toBe(811);
    expect(workspace.dukeStudy?.aggregates.nValidGlobal).toBe(3028);
    expect(workspace.predimedStudy?.aggregates.nValid).toBe(712);
    expect(workspace.sf12Study?.aggregates.nValidPCS).toBe(3047);
    expect(workspace.suenoStudy?.aggregates.nValidP33R).toBe(3004);
    expect(workspace.cageStudy?.aggregates.nValidCAGER).toBe(2513);
  });

  it.each([
    ["ibse", 6],
    ["duke-eas", 4],
    ["predimed-eas", 2],
    ["sf12-eas", 3],
    ["sueno-eas", 3],
    ["cage-eas", 3],
  ])("genera EvidenceAtoms con tag %s", (tag, expected) => {
    expect(workspace.evidenceStore.atoms.filter((atom) => atom.tags.includes(tag))).toHaveLength(expected);
  });

  it("mantiene trazabilidad documental completa y aislamiento municipal", () => {
    const documentIds = new Set(workspace.repository.documents.map((document) => document.id));
    expect(workspace.evidenceStore.atoms).toHaveLength(21);
    expect(
      workspace.evidenceStore.atoms.every(
        (atom) =>
          atom.municipalityId === municipalityId &&
          atom.provenance.documentId !== undefined &&
          documentIds.has(atom.provenance.documentId)
      )
    ).toBe(true);
  });

  it("expone los seis estudios en el inventario municipal", () => {
    expect(inventory.hasIBSE).toBe(true);
    expect(inventory.hasDUKE).toBe(true);
    expect(inventory.hasPREDIMED).toBe(true);
    expect(inventory.hasSF12).toBe(true);
    expect(inventory.hasSueno).toBe(true);
    expect(inventory.hasCAGE).toBe(true);
    expect(inventory.repositoryDocumentCount).toBe(6);
    expect(inventory.evidenceAtomCount).toBe(21);
    expect(inventory.warnings).toEqual([]);
  });

  it("sobrevive a una serializacion equivalente a localStorage", () => {
    const restored = JSON.parse(JSON.stringify(workspace)) as MunicipalityWorkspace;
    expect(restored.repository.documents).toHaveLength(6);
    expect(restored.evidenceStore.atoms).toHaveLength(21);
    expect(restored.ibseStudy?.sourceFileName).toBe("ibse-atarfe.csv");
    expect(restored.cageStudy?.sourceFileName).toBe("cage-eas-granada.csv");
  });
});
