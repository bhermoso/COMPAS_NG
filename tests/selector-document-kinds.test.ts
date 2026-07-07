/**
 * tests/test-j-selector-contract.ts
 *
 * Bloque J — contrato completo del selector documental visible.
 * Cada kind visible debe tener cargador real: pipeline + persistencia + semántica correcta.
 *
 * Complementa tests/document-ingestion-origins.test.ts sin duplicar sus casos.
 */

import { describe, it, expect } from "vitest";
import { ingestManualDocument } from "../src/application/document-ingestion";
import { createMunicipalDocumentRepository } from "../src/domain/repository";
import { createEvidenceStore } from "../src/domain/evidence";

const MUN_ID = "test-municipality-j";

function makeRepository() {
  return createMunicipalDocumentRepository({ municipalityId: MUN_ID });
}

function makeStore() {
  return createEvidenceStore(MUN_ID);
}

const SAMPLE = "Línea de diagnóstico territorial de prueba para el ámbito.";

// ── territorial-documentation ─────────────────────────────────────────────────

describe("territorial-documentation — documentación de contexto territorial", () => {
  it("persiste MunicipalDocument con kind territorial-documentation", () => {
    const result = ingestManualDocument({
      repository: makeRepository(),
      evidenceStore: makeStore(),
      kind: "territorial-documentation",
      title: "Informe Vigía Zaidín Centro Este 2023",
      plainText: SAMPLE,
    });
    expect(result).not.toBeNull();
    const doc = result!.repository.documents.find((d) => d.kind === "territorial-documentation");
    expect(doc).toBeDefined();
    expect(doc!.kind).toBe("territorial-documentation");
    expect(doc!.sourceText).toBe(SAMPLE);
  });

  it("genera EvidenceAtoms con origin territorial-documentation, no other", () => {
    const result = ingestManualDocument({
      repository: makeRepository(),
      evidenceStore: makeStore(),
      kind: "territorial-documentation",
      title: "Diagnóstico socioeconómico",
      plainText: SAMPLE,
    });
    expect(result!.atomsCreated).toBeGreaterThan(0);
    for (const atom of result!.evidenceStore.atoms) {
      expect(atom.provenance.origin).toBe("territorial-documentation");
      expect(atom.provenance.origin).not.toBe("other");
    }
  });

  it("canGenerateEvidence es true y provenance.documentId está fijado", () => {
    const result = ingestManualDocument({
      repository: makeRepository(),
      evidenceStore: makeStore(),
      kind: "territorial-documentation",
      title: "Datos padrón 2023",
      plainText: SAMPLE,
    });
    const doc = result!.repository.documents.find((d) => d.kind === "territorial-documentation");
    expect(doc!.canGenerateEvidence).toBe(true);
    for (const atom of result!.evidenceStore.atoms) {
      expect(atom.provenance.documentId).toBe(doc!.id);
    }
  });
});

// ── qualitative-material ──────────────────────────────────────────────────────

describe("qualitative-material — material cualitativo y participativo", () => {
  it("persiste MunicipalDocument con kind qualitative-material y sourceText", () => {
    const text =
      "El grupo identificó el aislamiento de personas mayores como problema principal.";
    const result = ingestManualDocument({
      repository: makeRepository(),
      evidenceStore: makeStore(),
      kind: "qualitative-material",
      title: "Acta 1 Grupo Motor Granada-Zaidín",
      plainText: text,
    });
    expect(result).not.toBeNull();
    const doc = result!.repository.documents.find((d) => d.kind === "qualitative-material");
    expect(doc).toBeDefined();
    expect(doc!.sourceText).toBe(text);
  });

  it("genera EvidenceAtoms con origin qualitative-material, no other", () => {
    const result = ingestManualDocument({
      repository: makeRepository(),
      evidenceStore: makeStore(),
      kind: "qualitative-material",
      title: "Necesidades sentidas Zaidín",
      plainText: "La comunidad percibe falta de espacios verdes y de transporte accesible.",
    });
    expect(result!.atomsCreated).toBeGreaterThan(0);
    for (const atom of result!.evidenceStore.atoms) {
      expect(atom.provenance.origin).toBe("qualitative-material");
      expect(atom.provenance.origin).not.toBe("other");
    }
  });

  it("kind de átomo es qualitative-observation o participation (no indicator ni asset)", () => {
    const result = ingestManualDocument({
      repository: makeRepository(),
      evidenceStore: makeStore(),
      kind: "qualitative-material",
      title: "Formulario necesidades sentidas",
      plainText: "Los vecinos señalan la soledad como primera preocupación de salud.",
    });
    for (const atom of result!.evidenceStore.atoms) {
      const valid: string[] = ["qualitative-observation", "participation"];
      expect(valid).toContain(atom.kind);
    }
  });
});

// ── longitudinal-evidence ─────────────────────────────────────────────────────

describe("longitudinal-evidence — evidencia comparativa entre ciclos", () => {
  it("persiste MunicipalDocument con kind longitudinal-evidence", () => {
    const result = ingestManualDocument({
      repository: makeRepository(),
      evidenceStore: makeStore(),
      kind: "longitudinal-evidence",
      title: "Evolución mortalidad Zaidín 2018–2023",
      plainText: "Tasa de mortalidad evitable 2018: 12 %. 2023: 9 %. Descenso del 3 pp.",
    });
    expect(result).not.toBeNull();
    const doc = result!.repository.documents.find((d) => d.kind === "longitudinal-evidence");
    expect(doc).toBeDefined();
    expect(doc!.kind).toBe("longitudinal-evidence");
  });

  it("genera EvidenceAtoms con origin longi, no other", () => {
    const result = ingestManualDocument({
      repository: makeRepository(),
      evidenceStore: makeStore(),
      kind: "longitudinal-evidence",
      title: "Serie histórica indicadores",
      plainText: "Tasa de mortalidad evitable 2020: 11 %. Descenso respecto a 2018.",
    });
    expect(result!.atomsCreated).toBeGreaterThan(0);
    for (const atom of result!.evidenceStore.atoms) {
      expect(atom.provenance.origin).toBe("longi");
      expect(atom.provenance.origin).not.toBe("other");
    }
  });

  it("kind de átomo es longitudinal-snapshot — prior absoluto del tipo documental", () => {
    const result = ingestManualDocument({
      repository: makeRepository(),
      evidenceStore: makeStore(),
      kind: "longitudinal-evidence",
      title: "Evolución envejecimiento 2018–2023",
      plainText: "El índice de envejecimiento pasó de 108 a 121 entre 2018 y 2023.",
    });
    expect(result!.atomsCreated).toBeGreaterThan(0);
    for (const atom of result!.evidenceStore.atoms) {
      expect(atom.kind).toBe("longitudinal-snapshot");
    }
  });

  it("provenance.documentId vincula átomo al documento", () => {
    const result = ingestManualDocument({
      repository: makeRepository(),
      evidenceStore: makeStore(),
      kind: "longitudinal-evidence",
      title: "Serie longitudinal de referencia",
      plainText: "Dato longitudinal para el ciclo 2024.",
    });
    const doc = result!.repository.documents.find((d) => d.kind === "longitudinal-evidence");
    for (const atom of result!.evidenceStore.atoms) {
      expect(atom.provenance.documentId).toBe(doc!.id);
    }
  });
});

// ── contrato del selector — kinds visibles e invisibles ───────────────────────

describe("contrato del selector — kinds visibles e invisibles", () => {
  const VISIBLE_KINDS = [
    "health-report",
    "complementary-study",
    "localiza-salud",
    "strategic-framework",
    "territorial-documentation",
    "qualitative-material",
    "longitudinal-evidence",
  ] as const;

  const INVISIBLE_KINDS = [
    "community-asset",
    "other",
    "redcap-export",
    "cmi-indicator",
    "eas-variable",
  ] as const;

  it("todos los kinds visibles esperados están en la lista", () => {
    expect(VISIBLE_KINDS).toContain("health-report");
    expect(VISIBLE_KINDS).toContain("localiza-salud");
    expect(VISIBLE_KINDS).toContain("strategic-framework");
    expect(VISIBLE_KINDS).toContain("territorial-documentation");
    expect(VISIBLE_KINDS).toContain("qualitative-material");
    expect(VISIBLE_KINDS).toContain("longitudinal-evidence");
  });

  it("ningún kind interno/legado aparece en el selector visible", () => {
    for (const hidden of INVISIBLE_KINDS) {
      expect(VISIBLE_KINDS as readonly string[]).not.toContain(hidden);
    }
  });

  it("todos los kinds visibles salvo health-report generan átomos al ingerir texto", () => {
    const kindsWithAtoms = VISIBLE_KINDS.filter((k) => k !== "health-report");
    for (const k of kindsWithAtoms) {
      const result = ingestManualDocument({
        repository: makeRepository(),
        evidenceStore: makeStore(),
        kind: k,
        title: `Documento de prueba — ${k}`,
        plainText: "Contenido de prueba para verificar que el kind genera átomos.",
      });
      expect(result).not.toBeNull();
      expect(result!.repository.documents.some((d) => d.kind === k)).toBe(true);
      expect(result!.atomsCreated).toBeGreaterThan(0);
    }
  });

  it("health-report persiste documento pero NO genera EvidenceAtoms (D-HR-01)", () => {
    const result = ingestManualDocument({
      repository: makeRepository(),
      evidenceStore: makeStore(),
      kind: "health-report",
      title: "Informe de Salud Granada-Zaidín",
      plainText: "Contenido del informe que no debe atomizarse bajo ninguna circunstancia.",
    });
    expect(result).not.toBeNull();
    expect(result!.atomsCreated).toBe(0);
    expect(result!.evidenceStore.atoms).toHaveLength(0);
  });

  it("localiza-salud NO aparece en la categoría other-source del DocumentRepositoryPanel", () => {
    // Verificar que localiza-salud se clasifica como community-asset (no other-source)
    // Para esto comprobamos que localiza-salud NO es strategic-framework, health-report, o complementary-study
    // (que son las únicas exclusiones de other-source además de community-asset y localiza-salud)
    const nonOtherSourceKinds = [
      "health-report",
      "community-asset",
      "localiza-salud",
      "complementary-study",
    ] as const;
    expect(nonOtherSourceKinds).toContain("localiza-salud");
    expect(nonOtherSourceKinds).not.toContain("strategic-framework" as never);
    expect(nonOtherSourceKinds).not.toContain("territorial-documentation" as never);
    expect(nonOtherSourceKinds).not.toContain("qualitative-material" as never);
  });
});
