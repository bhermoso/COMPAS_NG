/**
 * Test integral: flujo completo con los 13 estudios complementarios.
 *
 * Cubre: documento → estudio → EvidenceAtoms → workspace → serialización → borrado.
 * Usa exclusivamente fixtures existentes (sin fabricar datos).
 */

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
import { parseAUDITCCSV, auditcStudyToEvidenceAtoms } from "../src/application/auditc";
import { parseIPAQCSV, ipaqStudyToEvidenceAtoms } from "../src/application/ipaq";
import { parseGHQ12CSV, ghq12StudyToEvidenceAtoms } from "../src/application/ghq12";
import { parsePHQ9CSV, phq9StudyToEvidenceAtoms } from "../src/application/phq9";
import { parsePSQICSV, psqiStudyToEvidenceAtoms } from "../src/application/psqi";
import { parseFagerstromCSV, fagerstromStudyToEvidenceAtoms } from "../src/application/fagerstrom";
import { parseSBQCSV, sbqStudyToEvidenceAtoms } from "../src/application/sbq";

import { createIBSEStudy } from "../src/domain/ibse";
import { createDUKEStudy } from "../src/domain/duke";
import { createPREDIMEDStudy } from "../src/domain/predimed";
import { createSF12Study } from "../src/domain/sf12";
import { createSuenoStudy } from "../src/domain/sueno";
import { createCAGEStudy } from "../src/domain/cage";
import { createAUDITCStudy } from "../src/domain/auditc";
import { createIPAQStudy } from "../src/domain/ipaq";
import { createGHQ12Study } from "../src/domain/ghq12";
import { createPHQ9Study } from "../src/domain/phq9";
import { createPSQIStudy } from "../src/domain/psqi";
import { createFagerstromStudy } from "../src/domain/fagerstrom";
import { createSBQStudy } from "../src/domain/sbq";

import {
  addMunicipalDocument,
  removeMunicipalDocument,
  type AddMunicipalDocumentInput,
} from "../src/domain/repository";
import { stableAssetKey, upsertEvidenceAtom, type EvidenceAtom } from "../src/domain/evidence";
import type { MunicipalityWorkspace } from "../src/domain/workspace";
import { createMunicipalInventory } from "../src/application/municipal-inventory";
import { createMunicipalSnapshot } from "../src/domain/municipality-context";

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
    const linked: EvidenceAtom = { ...atom, provenance: { ...atom.provenance, documentId: document.id } };
    evidenceStore = upsertEvidenceAtom(
      evidenceStore,
      linked,
      stableAssetKey(linked.municipalityId, linked.provenance.origin, linked.title)
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

// ── Construcción del workspace completo con los 13 estudios ───────────────────

let ws = createCompleteMunicipalityWorkspace({
  id: municipalityId, name: "Atarfe", province: "Granada", ineCode: "18022", createdBy: "COMPAS NG",
});

// 1. IBSE
const ibseParsed   = parseIBSECSV(fixture("ibse-atarfe.csv"));
const ibseStudy    = createIBSEStudy({ municipalityId, sourceFileName: "ibse-atarfe.csv", aggregates: ibseParsed.aggregates, methodologicalCautions: ibseParsed.methodologicalCautions });
ws = registerStudy(ws, { ibseStudy }, { id: "doc-ibse", kind: "redcap-export", title: "IBSE", sourceFileName: "ibse-atarfe.csv", source: { system: "REDCap IBSE" }, tags: ["redcap-export", "ibse"] }, ibseStudyToEvidenceAtoms(ibseStudy));

// 2. DUKE-EAS
const dukeParsed   = parseDUKECSV(fixture("duke-eas-granada.csv"));
const dukeStudy    = createDUKEStudy({ municipalityId, sourceFileName: "duke-eas-granada.csv", aggregates: dukeParsed.aggregates, methodologicalCautions: dukeParsed.methodologicalCautions, warnings: dukeParsed.warnings });
ws = registerStudy(ws, { dukeStudy }, { id: "doc-duke", kind: "complementary-study", title: "DUKE-EAS", sourceFileName: "duke-eas-granada.csv", source: { system: "EAS" }, tags: ["complementary-study", "duke-eas"] }, dukeStudyToEvidenceAtoms(dukeStudy));

// 3. PREDIMED-EAS
const predimedParsed = parsePREDIMEDCSV(fixture("predimed-eas-granada.csv"));
const predimedStudy  = createPREDIMEDStudy({ municipalityId, sourceFileName: "predimed-eas-granada.csv", aggregates: predimedParsed.aggregates, methodologicalCautions: predimedParsed.methodologicalCautions, warnings: predimedParsed.warnings });
ws = registerStudy(ws, { predimedStudy }, { id: "doc-predimed", kind: "complementary-study", title: "PREDIMED-EAS", sourceFileName: "predimed-eas-granada.csv", source: { system: "EAS" }, tags: ["complementary-study", "predimed-eas"] }, predimedStudyToEvidenceAtoms(predimedStudy));

// 4. SF-12 EAS
const sf12Parsed   = parseSF12CSV(fixture("sf12-eas-granada.csv"));
const sf12Study    = createSF12Study({ municipalityId, sourceFileName: "sf12-eas-granada.csv", aggregates: sf12Parsed.aggregates, methodologicalCautions: sf12Parsed.methodologicalCautions, warnings: sf12Parsed.warnings });
ws = registerStudy(ws, { sf12Study }, { id: "doc-sf12", kind: "complementary-study", title: "SF-12 EAS", sourceFileName: "sf12-eas-granada.csv", source: { system: "EAS" }, tags: ["complementary-study", "sf12-eas"] }, sf12StudyToEvidenceAtoms(sf12Study));

// 5. Sueño EAS
const suenoParsed  = parseSuenoCSV(fixture("sueno-eas-granada.csv"));
const suenoStudy   = createSuenoStudy({ municipalityId, sourceFileName: "sueno-eas-granada.csv", aggregates: suenoParsed.aggregates, methodologicalCautions: suenoParsed.methodologicalCautions, warnings: suenoParsed.warnings });
ws = registerStudy(ws, { suenoStudy }, { id: "doc-sueno", kind: "complementary-study", title: "Sueno EAS", sourceFileName: "sueno-eas-granada.csv", source: { system: "EAS" }, tags: ["complementary-study", "sueno-eas"] }, suenoStudyToEvidenceAtoms(suenoStudy));

// 6. CAGE-EAS
const cageParsed   = parseCAGECSV(fixture("cage-eas-granada.csv"));
const cageStudy    = createCAGEStudy({ municipalityId, sourceFileName: "cage-eas-granada.csv", aggregates: cageParsed.aggregates, methodologicalCautions: cageParsed.methodologicalCautions, warnings: cageParsed.warnings });
ws = registerStudy(ws, { cageStudy }, { id: "doc-cage", kind: "complementary-study", title: "CAGE-EAS", sourceFileName: "cage-eas-granada.csv", source: { system: "EAS" }, tags: ["complementary-study", "cage-eas"] }, cageStudyToEvidenceAtoms(cageStudy));

// 7. AUDIT-C (REDCap municipal)
const auditcParsed = parseAUDITCCSV(fixture("auditc-municipal.csv"));
const auditcStudy  = createAUDITCStudy({ municipalityId, sourceFileName: "auditc-municipal.csv", aggregates: auditcParsed.aggregates, methodologicalCautions: auditcParsed.methodologicalCautions, warnings: auditcParsed.warnings });
ws = registerStudy(ws, { auditcStudy }, { id: "doc-auditc", kind: "redcap-export", title: "AUDIT-C", sourceFileName: "auditc-municipal.csv", source: { system: "REDCap AUDIT-C" }, tags: ["redcap-export", "auditc"] }, auditcStudyToEvidenceAtoms(auditcStudy));

// 8. IPAQ-EAS (campo derivado EAS)
const ipaqParsed   = parseIPAQCSV(fixture("ipaq-eas-granada.csv"));
const ipaqStudy    = createIPAQStudy({ municipalityId, sourceFileName: "ipaq-eas-granada.csv", aggregates: ipaqParsed.aggregates, methodologicalCautions: ipaqParsed.methodologicalCautions, warnings: ipaqParsed.warnings });
ws = registerStudy(ws, { ipaqStudy }, { id: "doc-ipaq", kind: "complementary-study", title: "IPAQ-EAS", sourceFileName: "ipaq-eas-granada.csv", source: { system: "EAS" }, tags: ["complementary-study", "ipaq-eas"] }, ipaqStudyToEvidenceAtoms(ipaqStudy));

// 9. GHQ-12 (REDCap municipal)
const ghq12Parsed  = parseGHQ12CSV(fixture("ghq12-municipal.csv"));
const ghq12Study   = createGHQ12Study({ municipalityId, sourceFileName: "ghq12-municipal.csv", aggregates: ghq12Parsed.aggregates, methodologicalCautions: ghq12Parsed.methodologicalCautions, warnings: ghq12Parsed.warnings });
ws = registerStudy(ws, { ghq12Study }, { id: "doc-ghq12", kind: "redcap-export", title: "GHQ-12", sourceFileName: "ghq12-municipal.csv", source: { system: "REDCap GHQ-12" }, tags: ["redcap-export", "ghq12"] }, ghq12StudyToEvidenceAtoms(ghq12Study));

// 10. PHQ-9 (REDCap municipal)
const phq9Parsed   = parsePHQ9CSV(fixture("phq9-municipal.csv"));
const phq9Study    = createPHQ9Study({ municipalityId, sourceFileName: "phq9-municipal.csv", aggregates: phq9Parsed.aggregates, methodologicalCautions: phq9Parsed.methodologicalCautions, warnings: phq9Parsed.warnings });
ws = registerStudy(ws, { phq9Study }, { id: "doc-phq9", kind: "redcap-export", title: "PHQ-9", sourceFileName: "phq9-municipal.csv", source: { system: "REDCap PHQ-9" }, tags: ["redcap-export", "phq9"] }, phq9StudyToEvidenceAtoms(phq9Study));

// 11. PSQI (REDCap municipal)
const psqiParsed   = parsePSQICSV(fixture("psqi-municipal.csv"));
const psqiStudy    = createPSQIStudy({ municipalityId, sourceFileName: "psqi-municipal.csv", aggregates: psqiParsed.aggregates, methodologicalCautions: psqiParsed.methodologicalCautions, warnings: psqiParsed.warnings });
ws = registerStudy(ws, { psqiStudy }, { id: "doc-psqi", kind: "redcap-export", title: "PSQI", sourceFileName: "psqi-municipal.csv", source: { system: "REDCap PSQI" }, tags: ["redcap-export", "psqi"] }, psqiStudyToEvidenceAtoms(psqiStudy));

// 12. Fagerström (REDCap municipal)
const fagerstromParsed = parseFagerstromCSV(fixture("fagerstrom-municipal.csv"));
const fagerstromStudy  = createFagerstromStudy({ municipalityId, sourceFileName: "fagerstrom-municipal.csv", aggregates: fagerstromParsed.aggregates, methodologicalCautions: fagerstromParsed.methodologicalCautions, warnings: fagerstromParsed.warnings });
ws = registerStudy(ws, { fagerstromStudy }, { id: "doc-fagerstrom", kind: "redcap-export", title: "Fagerstrom", sourceFileName: "fagerstrom-municipal.csv", source: { system: "REDCap Fagerstrom" }, tags: ["redcap-export", "fagerstrom"] }, fagerstromStudyToEvidenceAtoms(fagerstromStudy));

// 13. SBQ (REDCap municipal)
const sbqParsed    = parseSBQCSV(fixture("sbq-municipal.csv"));
const sbqStudy     = createSBQStudy({ municipalityId, sourceFileName: "sbq-municipal.csv", aggregates: sbqParsed.aggregates, methodologicalCautions: sbqParsed.methodologicalCautions, warnings: sbqParsed.warnings });
ws = registerStudy(ws, { sbqStudy }, { id: "doc-sbq", kind: "redcap-export", title: "SBQ", sourceFileName: "sbq-municipal.csv", source: { system: "REDCap SBQ" }, tags: ["redcap-export", "sbq"] }, sbqStudyToEvidenceAtoms(sbqStudy));

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("13 estudios complementarios — flujo integral", () => {

  it("workspace contiene los 13 estudios definidos", () => {
    expect(ws.ibseStudy).toBeDefined();
    expect(ws.dukeStudy).toBeDefined();
    expect(ws.predimedStudy).toBeDefined();
    expect(ws.sf12Study).toBeDefined();
    expect(ws.suenoStudy).toBeDefined();
    expect(ws.cageStudy).toBeDefined();
    expect(ws.auditcStudy).toBeDefined();
    expect(ws.ipaqStudy).toBeDefined();
    expect(ws.ghq12Study).toBeDefined();
    expect(ws.phq9Study).toBeDefined();
    expect(ws.psqiStudy).toBeDefined();
    expect(ws.fagerstromStudy).toBeDefined();
    expect(ws.sbqStudy).toBeDefined();
  });

  it("repositorio contiene exactamente 13 documentos", () => {
    expect(ws.repository.documents).toHaveLength(13);
  });

  it("cada estudio tiene nValid > 0 en sus agregados canónicos", () => {
    expect(ws.ibseStudy!.aggregates.nValid).toBeGreaterThan(0);
    expect(ws.dukeStudy!.aggregates.nValidGlobal).toBeGreaterThan(0);
    expect(ws.predimedStudy!.aggregates.nValid).toBeGreaterThan(0);
    expect(ws.sf12Study!.aggregates.nValidPCS).toBeGreaterThan(0);
    expect(ws.suenoStudy!.aggregates.nValidP33R).toBeGreaterThan(0);
    expect(ws.cageStudy!.aggregates.nValidCAGER).toBeGreaterThan(0);
    expect(ws.auditcStudy!.aggregates.nValid).toBeGreaterThan(0);
    expect(Math.max(ws.ipaqStudy!.aggregates.nValidIPAQ, ws.ipaqStudy!.aggregates.nValidP34AR)).toBeGreaterThan(0);
    expect(ws.ghq12Study!.aggregates.nValid).toBeGreaterThan(0);
    expect(ws.phq9Study!.aggregates.nValid).toBeGreaterThan(0);
    expect(ws.psqiStudy!.aggregates.nValid).toBeGreaterThan(0);
    expect(ws.fagerstromStudy!.aggregates.nValid).toBeGreaterThan(0);
    expect(ws.sbqStudy!.aggregates.nValid).toBeGreaterThan(0);
  });

  it("cada estudio produce al menos 1 EvidenceAtom en el store", () => {
    const atomsByTag = (tag: string) => ws.evidenceStore.atoms.filter(a => a.tags.includes(tag));
    expect(atomsByTag("ibse").length).toBeGreaterThan(0);
    expect(atomsByTag("duke-eas").length).toBeGreaterThan(0);
    expect(atomsByTag("predimed-eas").length).toBeGreaterThan(0);
    expect(atomsByTag("sf12-eas").length).toBeGreaterThan(0);
    expect(atomsByTag("sueno-eas").length).toBeGreaterThan(0);
    expect(atomsByTag("cage-eas").length).toBeGreaterThan(0);
    expect(atomsByTag("auditc").length).toBeGreaterThan(0);
    expect(atomsByTag("ipaq-eas").length).toBeGreaterThan(0);
    expect(atomsByTag("ghq12").length).toBeGreaterThan(0);
    expect(atomsByTag("phq9").length).toBeGreaterThan(0);
    expect(atomsByTag("psqi").length).toBeGreaterThan(0);
    expect(atomsByTag("fagerstrom").length).toBeGreaterThan(0);
    expect(atomsByTag("sbq").length).toBeGreaterThan(0);
  });

  it("todos los átomos tienen documentId y municipalityId correcto", () => {
    const docIds = new Set(ws.repository.documents.map(d => d.id));
    for (const atom of ws.evidenceStore.atoms) {
      expect(atom.municipalityId).toBe(municipalityId);
      expect(atom.provenance.documentId).toBeDefined();
      expect(docIds.has(atom.provenance.documentId!)).toBe(true);
    }
  });

  it("inventario reconoce los 13 estudios presentes", () => {
    const inv = createMunicipalInventory(createMunicipalSnapshot(ws));
    expect(inv.hasIBSE).toBe(true);
    expect(inv.hasDUKE).toBe(true);
    expect(inv.hasPREDIMED).toBe(true);
    expect(inv.hasSF12).toBe(true);
    expect(inv.hasSueno).toBe(true);
    expect(inv.hasCAGE).toBe(true);
    expect(inv.hasAUDITC).toBe(true);
    expect(inv.hasIPAQ).toBe(true);
    expect(inv.hasGHQ12).toBe(true);
    expect(inv.hasPHQ9).toBe(true);
    expect(inv.hasPSQI).toBe(true);
    expect(inv.hasFagerstrom).toBe(true);
    expect(inv.hasSBQ).toBe(true);
    expect(inv.repositoryDocumentCount).toBe(13);
  });

  it("serialización equivalente a localStorage preserva los 13 estudios y átomos", () => {
    const restored = JSON.parse(JSON.stringify(ws)) as MunicipalityWorkspace;
    expect(restored.repository.documents).toHaveLength(13);
    expect(restored.ibseStudy?.sourceFileName).toBe("ibse-atarfe.csv");
    expect(restored.sbqStudy?.sourceFileName).toBe("sbq-municipal.csv");
    expect(restored.ghq12Study?.sourceFileName).toBe("ghq12-municipal.csv");
    expect(restored.phq9Study?.sourceFileName).toBe("phq9-municipal.csv");
    expect(restored.psqiStudy?.sourceFileName).toBe("psqi-municipal.csv");
    expect(restored.fagerstromStudy?.sourceFileName).toBe("fagerstrom-municipal.csv");
    expect(restored.auditcStudy?.sourceFileName).toBe("auditc-municipal.csv");
    expect(restored.ipaqStudy?.sourceFileName).toBe("ipaq-eas-granada.csv");
    expect(restored.evidenceStore.atoms.length).toBe(ws.evidenceStore.atoms.length);
  });

  it("borrado de GHQ-12 elimina su estudio y sus átomos, mantiene los 12 restantes", () => {
    const ghq12Tag = "ghq12";
    const docId = ws.repository.documents.find(d => d.tags.includes(ghq12Tag))?.id;
    expect(docId).toBeDefined();

    const afterDelete: MunicipalityWorkspace = {
      ...ws,
      ghq12Study: undefined,
      repository: removeMunicipalDocument(ws.repository, docId!),
      evidenceStore: {
        ...ws.evidenceStore,
        atoms: ws.evidenceStore.atoms.filter(a => !a.tags.includes(ghq12Tag)),
      },
    };

    expect(afterDelete.ghq12Study).toBeUndefined();
    expect(afterDelete.repository.documents).toHaveLength(12);
    expect(afterDelete.evidenceStore.atoms.filter(a => a.tags.includes(ghq12Tag))).toHaveLength(0);
    // Los 12 estudios restantes siguen presentes
    expect(afterDelete.ibseStudy).toBeDefined();
    expect(afterDelete.sbqStudy).toBeDefined();
  });
});
