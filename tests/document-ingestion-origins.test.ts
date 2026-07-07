/**
 * tests/document-ingestion-origins.test.ts
 *
 * Verifica que los DocumentKind territorial-documentation y qualitative-material
 * producen EvidenceAtom con el EvidenceOrigin semántico correcto (no "other"),
 * y que el EvidenceStoreIntegrityGuard acepta ambos nuevos orígenes.
 *
 * Cubre los tests A, B y C del incremento mínimo del selector documental.
 */

import { describe, it, expect } from "vitest";
import { ingestManualDocument } from "../src/application/document-ingestion";
import { runEvidenceStoreIntegrityGuard } from "../src/application/evidence";
import { createMunicipalDocumentRepository } from "../src/domain/repository";
import { createEvidenceStore, createEvidenceAtom } from "../src/domain/evidence";

// ── Fixtures ──────────────────────────────────────────────────────────────────

const MUN_ID = "test-municipality-01";

function makeRepository() {
  return createMunicipalDocumentRepository({ municipalityId: MUN_ID });
}

function makeStore() {
  return createEvidenceStore(MUN_ID);
}

const SAMPLE_TEXT = [
  "Indicador: tasa de pobreza relativa 28,3 %.",
  "El territorio presenta alta concentración de renta baja en el sector norte.",
  "Determinante: condición de vivienda deficiente en un 14 % de los hogares.",
].join("\n");

// ── Test A: territorial-documentation → origin "territorial-documentation" ───

describe('ingestManualDocument — kind "territorial-documentation"', () => {
  it('produce átomos con provenance.origin === "territorial-documentation"', () => {
    const result = ingestManualDocument({
      repository: makeRepository(),
      evidenceStore: makeStore(),
      kind: "territorial-documentation",
      title: "Informe socioeconómico municipal 2024",
      plainText: SAMPLE_TEXT,
    });

    expect(result).not.toBeNull();
    expect(result!.atomsCreated).toBeGreaterThan(0);

    for (const atom of result!.evidenceStore.atoms) {
      expect(atom.provenance.origin).toBe("territorial-documentation");
    }
  });

  it("provenance.documentId está fijado en todos los átomos", () => {
    const result = ingestManualDocument({
      repository: makeRepository(),
      evidenceStore: makeStore(),
      kind: "territorial-documentation",
      title: "Datos padrón 2024",
      plainText: SAMPLE_TEXT,
    });

    expect(result).not.toBeNull();
    const docId = result!.document.id;
    for (const atom of result!.evidenceStore.atoms) {
      expect(atom.provenance.documentId).toBe(docId);
    }
  });

  it("el documento registrado tiene kind territorial-documentation", () => {
    const result = ingestManualDocument({
      repository: makeRepository(),
      evidenceStore: makeStore(),
      kind: "territorial-documentation",
      title: "Datos padrón 2024",
      plainText: SAMPLE_TEXT,
    });

    expect(result).not.toBeNull();
    expect(result!.document.kind).toBe("territorial-documentation");
  });
});

// ── Test B: qualitative-material → origin "qualitative-material" ──────────────

describe('ingestManualDocument — kind "qualitative-material"', () => {
  it('produce átomos con provenance.origin === "qualitative-material"', () => {
    const result = ingestManualDocument({
      repository: makeRepository(),
      evidenceStore: makeStore(),
      kind: "qualitative-material",
      title: "Acta Grupo Motor — sesión 1",
      plainText: [
        "Los participantes identificaron la falta de espacios verdes como problema principal.",
        "Se mencionó la soledad de las personas mayores como preocupación comunitaria.",
        "El grupo propuso ampliar el programa de actividad física en el polideportivo.",
      ].join("\n"),
    });

    expect(result).not.toBeNull();
    expect(result!.atomsCreated).toBeGreaterThan(0);

    for (const atom of result!.evidenceStore.atoms) {
      expect(atom.provenance.origin).toBe("qualitative-material");
    }
  });

  it("provenance.documentId está fijado en todos los átomos", () => {
    const result = ingestManualDocument({
      repository: makeRepository(),
      evidenceStore: makeStore(),
      kind: "qualitative-material",
      title: "Formulario necesidades sentidas",
      plainText: "La comunidad percibe falta de atención sociosanitaria coordinada.",
    });

    expect(result).not.toBeNull();
    const docId = result!.document.id;
    for (const atom of result!.evidenceStore.atoms) {
      expect(atom.provenance.documentId).toBe(docId);
    }
  });

  it("el documento registrado tiene kind qualitative-material", () => {
    const result = ingestManualDocument({
      repository: makeRepository(),
      evidenceStore: makeStore(),
      kind: "qualitative-material",
      title: "Acta GRUSE sesión 2",
      plainText: "Participación activa de asociaciones vecinales en el proceso.",
    });

    expect(result).not.toBeNull();
    expect(result!.document.kind).toBe("qualitative-material");
  });
});

// ── Test C: IntegrityGuard acepta los dos nuevos orígenes ────────────────────

describe('EvidenceStoreIntegrityGuard — nuevos orígenes', () => {
  function makeAtomWithOrigin(
    origin: "territorial-documentation" | "qualitative-material",
    id: string
  ) {
    return createEvidenceAtom({
      id,
      municipalityId: MUN_ID,
      kind: "qualitative-observation",
      title: `Átomo de prueba (${origin})`,
      content: "Contenido de prueba para validación de origen.",
      provenance: {
        origin,
        documentId: `doc-${id}`,
        extractedAt: new Date().toISOString(),
      },
    });
  }

  it('acepta origin "territorial-documentation" sin errores', () => {
    const store = {
      ...makeStore(),
      atoms: [makeAtomWithOrigin("territorial-documentation", "td-atom-01")],
    };
    const result = runEvidenceStoreIntegrityGuard(store);

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
    expect(result.sanitizedStore.atoms).toHaveLength(1);
    expect(result.sanitizedStore.atoms[0].provenance.origin).toBe(
      "territorial-documentation"
    );
  });

  it('acepta origin "qualitative-material" sin errores', () => {
    const store = {
      ...makeStore(),
      atoms: [makeAtomWithOrigin("qualitative-material", "qm-atom-01")],
    };
    const result = runEvidenceStoreIntegrityGuard(store);

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
    expect(result.sanitizedStore.atoms).toHaveLength(1);
    expect(result.sanitizedStore.atoms[0].provenance.origin).toBe(
      "qualitative-material"
    );
  });

  it("acepta ambos orígenes en el mismo store sin errores", () => {
    const store = {
      ...makeStore(),
      atoms: [
        makeAtomWithOrigin("territorial-documentation", "td-atom-02"),
        makeAtomWithOrigin("qualitative-material", "qm-atom-02"),
      ],
    };
    const result = runEvidenceStoreIntegrityGuard(store);

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
    expect(result.sanitizedStore.atoms).toHaveLength(2);
  });

  it('los nuevos orígenes son no gobernados: admiten cualquier kind válido', () => {
    const atom = createEvidenceAtom({
      id: "td-indicator-01",
      municipalityId: MUN_ID,
      kind: "indicator",
      title: "Tasa de pobreza relativa",
      content: "28,3 % de la población bajo el umbral de pobreza relativa.",
      provenance: {
        origin: "territorial-documentation",
        documentId: "doc-td-01",
        extractedAt: new Date().toISOString(),
      },
    });

    const store = { ...makeStore(), atoms: [atom] };
    const result = runEvidenceStoreIntegrityGuard(store);

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('origin "other" sigue siendo válido (fallback interno preservado)', () => {
    const atom = createEvidenceAtom({
      id: "other-atom-01",
      municipalityId: MUN_ID,
      kind: "qualitative-observation",
      title: "Documento sin clasificar",
      content: "Contenido sin clasificación específica.",
      provenance: {
        origin: "other",
        documentId: "doc-other-01",
        extractedAt: new Date().toISOString(),
      },
    });

    const store = { ...makeStore(), atoms: [atom] };
    const result = runEvidenceStoreIntegrityGuard(store);

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });
});

// ── Regresión: los cambios no afectan al flujo de community-asset ─────────────

describe("regresión — community-asset sigue produciendo origin community-assets", () => {
  it('kind "community-asset" → origin "community-assets" (sin cambio)', () => {
    const result = ingestManualDocument({
      repository: makeRepository(),
      evidenceStore: makeStore(),
      kind: "community-asset",
      title: "Mapa de activos Atarfe",
      plainText: [
        "## Centro Cívico Municipal",
        "Espacio polivalente en el centro del municipio para actividades culturales y deportivas.",
        "## Asociación de Mayores Las Encinas",
        "Asociación activa con programas de envejecimiento activo y acompañamiento.",
      ].join("\n"),
    });

    expect(result).not.toBeNull();
    expect(result!.atomsCreated).toBeGreaterThan(0);

    for (const atom of result!.evidenceStore.atoms) {
      expect(atom.provenance.origin).toBe("community-assets");
    }
  });
});
