/**
 * tests/document-ingestion-origins.test.ts
 *
 * Verifica que los DocumentKind territorial-documentation, qualitative-material
 * y strategic-framework producen EvidenceAtom con el EvidenceOrigin semántico
 * correcto (no "other"), y que el EvidenceStoreIntegrityGuard acepta los orígenes.
 *
 * También verifica el contrato del selector documental visible:
 *  - "community-asset" no es una opción visible (usa Localiza Salud en su lugar).
 *  - "localiza-salud" sí es una opción visible y genera origin correcto.
 *  - "strategic-framework" sí es una opción visible y genera origin correcto.
 *  - La ingesta de localiza-salud y community-asset no se rompe.
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

// ── Test C: strategic-framework → origin "strategic-framework" ───────────────

describe('ingestManualDocument — kind "strategic-framework"', () => {
  const EPVSA_TEXT = [
    "Línea 1 EPVSA — Alimentación saludable y actividad física.",
    "Línea 2 EPVSA — Bienestar emocional y salud mental.",
    "Línea 3 EPVSA — Prevención de consumos perjudiciales.",
    "Línea 4 EPVSA — Entornos y entornos saludables.",
  ].join("\n");

  it('produce átomos con provenance.origin === "strategic-framework"', () => {
    const result = ingestManualDocument({
      repository: makeRepository(),
      evidenceStore: makeStore(),
      kind: "strategic-framework",
      title: "EPVSA 2024–2030 — Líneas estratégicas",
      plainText: EPVSA_TEXT,
    });

    expect(result).not.toBeNull();
    expect(result!.atomsCreated).toBeGreaterThan(0);

    for (const atom of result!.evidenceStore.atoms) {
      expect(atom.provenance.origin).toBe("strategic-framework");
      expect(atom.provenance.origin).not.toBe("other");
    }
  });

  it('produce átomos de kind "strategic-priority"', () => {
    const result = ingestManualDocument({
      repository: makeRepository(),
      evidenceStore: makeStore(),
      kind: "strategic-framework",
      title: "ESCA — Principios rectores",
      plainText: [
        "Equidad en salud como principio rector de la planificación.",
        "Intersectorialidad en la acción sobre determinantes sociales.",
      ].join("\n"),
    });

    expect(result).not.toBeNull();
    for (const atom of result!.evidenceStore.atoms) {
      expect(atom.kind).toBe("strategic-priority");
    }
  });

  it("el documento registrado tiene kind strategic-framework", () => {
    const result = ingestManualDocument({
      repository: makeRepository(),
      evidenceStore: makeStore(),
      kind: "strategic-framework",
      title: "Guías RELAS",
      plainText: "Marco metodológico RELAS — diagnóstico participativo territorial.",
    });

    expect(result).not.toBeNull();
    expect(result!.document.kind).toBe("strategic-framework");
  });

  it("provenance.documentId está fijado en todos los átomos", () => {
    const result = ingestManualDocument({
      repository: makeRepository(),
      evidenceStore: makeStore(),
      kind: "strategic-framework",
      title: "En Buena Edad — objetivos municipales",
      plainText: [
        "Objetivo 1: Promover el envejecimiento activo en entornos comunitarios.",
        "Objetivo 2: Reducir el aislamiento de personas mayores.",
      ].join("\n"),
    });

    expect(result).not.toBeNull();
    const docId = result!.document.id;
    for (const atom of result!.evidenceStore.atoms) {
      expect(atom.provenance.documentId).toBe(docId);
    }
  });

  it("múltiples marcos en el mismo store no generan conflictos", () => {
    const store = makeStore();
    const repo = makeRepository();

    const r1 = ingestManualDocument({
      repository: repo,
      evidenceStore: store,
      kind: "strategic-framework",
      title: "EPVSA 2024–2030",
      plainText: "Línea 1 EPVSA — Alimentación saludable.",
    });

    const r2 = ingestManualDocument({
      repository: r1!.repository,
      evidenceStore: r1!.evidenceStore,
      kind: "strategic-framework",
      title: "ESCA Andalucía",
      plainText: "Objetivo ESCA — Equidad en salud.",
    });

    expect(r2).not.toBeNull();
    expect(r2!.evidenceStore.atoms.length).toBe(2);

    for (const atom of r2!.evidenceStore.atoms) {
      expect(atom.provenance.origin).toBe("strategic-framework");
    }
  });
});

// ── Test D: IntegrityGuard acepta los tres orígenes ──────────────────────────

describe("EvidenceStoreIntegrityGuard — orígenes del selector documental", () => {
  type TestedOrigin =
    | "territorial-documentation"
    | "qualitative-material"
    | "strategic-framework";

  function makeAtomWithOrigin(origin: TestedOrigin, id: string) {
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
    expect(result.sanitizedStore.atoms[0].provenance.origin).toBe("territorial-documentation");
  });

  it('acepta origin "qualitative-material" sin errores', () => {
    const store = {
      ...makeStore(),
      atoms: [makeAtomWithOrigin("qualitative-material", "qm-atom-01")],
    };
    const result = runEvidenceStoreIntegrityGuard(store);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
    expect(result.sanitizedStore.atoms[0].provenance.origin).toBe("qualitative-material");
  });

  it('acepta origin "strategic-framework" sin errores', () => {
    const atom = createEvidenceAtom({
      id: "sf-atom-01",
      municipalityId: MUN_ID,
      kind: "strategic-priority",
      title: "Línea 1 EPVSA",
      content: "Alimentación saludable y actividad física como eje prioritario.",
      provenance: {
        origin: "strategic-framework",
        documentId: "doc-epvsa-01",
        extractedAt: new Date().toISOString(),
      },
    });
    const store = { ...makeStore(), atoms: [atom] };
    const result = runEvidenceStoreIntegrityGuard(store);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
    expect(result.sanitizedStore.atoms[0].provenance.origin).toBe("strategic-framework");
  });

  it("acepta los tres orígenes en el mismo store sin errores", () => {
    const store = {
      ...makeStore(),
      atoms: [
        makeAtomWithOrigin("territorial-documentation", "td-atom-02"),
        makeAtomWithOrigin("qualitative-material", "qm-atom-02"),
        makeAtomWithOrigin("strategic-framework", "sf-atom-02"),
      ],
    };
    const result = runEvidenceStoreIntegrityGuard(store);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
    expect(result.sanitizedStore.atoms).toHaveLength(3);
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

// ── Test E: contrato del selector visible ─────────────────────────────────────
// Verifica invariantes del selector via pipeline (no via UI React).

describe("contrato del selector documental visible — invariantes de ingesta", () => {
  it('localiza-salud genera origin "localiza-salud", no "other" ni "community-assets"', () => {
    const result = ingestManualDocument({
      repository: makeRepository(),
      evidenceStore: makeStore(),
      kind: "localiza-salud",
      title: "Localiza Salud — Atarfe",
      plainText: [
        "Centro Cívico Municipal | Espacio cultural y deportivo | C/ Mayor 1",
        "Polideportivo Municipal | Instalación deportiva | Av. Deportes s/n",
      ].join("\n"),
    });
    expect(result).not.toBeNull();
    for (const atom of result!.evidenceStore.atoms) {
      expect(atom.provenance.origin).toBe("localiza-salud");
      expect(atom.provenance.origin).not.toBe("other");
      expect(atom.provenance.origin).not.toBe("community-assets");
    }
  });

  it('localiza-salud genera atoms de kind "asset"', () => {
    const result = ingestManualDocument({
      repository: makeRepository(),
      evidenceStore: makeStore(),
      kind: "localiza-salud",
      title: "Localiza Salud — Activos municipales",
      plainText: "Asociación de Vecinos La Vega | Actividades comunitarias | C/ Real 5",
    });
    expect(result).not.toBeNull();
    for (const atom of result!.evidenceStore.atoms) {
      expect(atom.kind).toBe("asset");
    }
  });

  it('strategic-framework nunca genera origin "other"', () => {
    const result = ingestManualDocument({
      repository: makeRepository(),
      evidenceStore: makeStore(),
      kind: "strategic-framework",
      title: "Plan Estratégico de Mayores de Andalucía",
      plainText: [
        "Eje 1 — Envejecimiento activo y participación social.",
        "Eje 2 — Atención sociosanitaria integrada.",
        "Eje 3 — Entornos favorables para las personas mayores.",
      ].join("\n"),
    });
    expect(result).not.toBeNull();
    for (const atom of result!.evidenceStore.atoms) {
      expect(atom.provenance.origin).not.toBe("other");
    }
  });

  it('territorial-documentation no genera origin "other"', () => {
    const result = ingestManualDocument({
      repository: makeRepository(),
      evidenceStore: makeStore(),
      kind: "territorial-documentation",
      title: "Análisis socioeconómico",
      plainText: "El municipio tiene una tasa de paro del 18 % en 2024.",
    });
    expect(result).not.toBeNull();
    for (const atom of result!.evidenceStore.atoms) {
      expect(atom.provenance.origin).not.toBe("other");
    }
  });

  it('qualitative-material no genera origin "other"', () => {
    const result = ingestManualDocument({
      repository: makeRepository(),
      evidenceStore: makeStore(),
      kind: "qualitative-material",
      title: "Entrevistas comunitarias",
      plainText: "Los vecinos señalan la falta de transporte como barrera para la salud.",
    });
    expect(result).not.toBeNull();
    for (const atom of result!.evidenceStore.atoms) {
      expect(atom.provenance.origin).not.toBe("other");
    }
  });
});

// ── Test F: regresión — flujos existentes no se rompen ───────────────────────

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

  it('localiza-salud sigue siendo la ruta principal de activos comunitarios visibles', () => {
    const locResult = ingestManualDocument({
      repository: makeRepository(),
      evidenceStore: makeStore(),
      kind: "localiza-salud",
      title: "Localiza Salud Atarfe — completo",
      plainText: [
        "Centro de Salud Atarfe | Atención primaria | C/ Salud 1",
        "Polideportivo | Deporte | Av. Deportes",
      ].join("\n"),
    });
    expect(locResult).not.toBeNull();
    expect(locResult!.atomsCreated).toBeGreaterThan(0);

    for (const atom of locResult!.evidenceStore.atoms) {
      expect(atom.kind).toBe("asset");
      expect(atom.provenance.origin).toBe("localiza-salud");
    }
  });
});
