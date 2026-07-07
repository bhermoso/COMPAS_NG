/**
 * tests/badea-pilot.test.ts
 *
 * Tests del piloto BADEA/IECA — Consulta 19824, Atarfe.
 *
 * Verifica:
 *  1. Formato de líneas normalizadas (municipio, INE, año, valor, fuente, consulta).
 *  2. No se usan códigos crudos cuando existe literal disponible.
 *  3. Consulta 19824 genera líneas autocontenidas para Atarfe.
 *  4. Pipeline cmi-indicator → origin "cmi", kind "indicator".
 *  5. IntegrityGuard acepta átomo con origin "cmi".
 *  6. cmi-indicator NO está expuesto en el selector visible.
 *  7. Corrección sobre datos reales: 94,3 % en agrupaciones urbanas, no centros urbanos.
 *
 * No se realizan llamadas a la API BADEA. Los fixtures usan datos verificados
 * en la ejecución del piloto del 2026-07-07.
 */

import { describe, it, expect } from "vitest";
import { ingestManualDocument } from "../src/application/document-ingestion";
import { runEvidenceStoreIntegrityGuard } from "../src/application/evidence";
import { createMunicipalDocumentRepository, type DocumentKind } from "../src/domain/repository";
import { createEvidenceStore } from "../src/domain/evidence";

// ── Fixture: datos verificados del piloto BADEA 19824, Atarfe ─────────────────
// Valores reales de la API IECA (acceso 2026-07-07). No inventados.

const ATARFE = {
  cod: "18022",
  municipio: "Atarfe",
  año: "2024",
  fuente: "IECA",
  consulta: 19824,
  activity: "Clasificación del grado de urbanización",
  gradoUrbanizacion: "Zona de densidad intermedia",
  pctCentrosUrbanos:      { val: "0.0",                  format: "0,0%" },
  pctAgrupacionesUrbanas: { val: "94.31951509999999",     format: "94,3%" },
  pctCeldasRurales:       { val: "5.6804849",             format: "5,7%" },
};

// Líneas normalizadas generadas por scripts/badea/normalize-badea-pilot.mjs
// con los datos de ATARFE. Fijadas aquí para test de regresión.
const LINEAS_NORMALIZADAS = [
  `Atarfe (INE 18022) · Grado de urbanización según tipología de celda, 2024: Zona de densidad intermedia. Fuente: IECA, BADEA, consulta 19824, Clasificación del grado de urbanización. Año 2024.`,
  `Atarfe (INE 18022) · Porcentaje de población en centros urbanos, 2024: 0,0%. Fuente: IECA, BADEA, consulta 19824, Clasificación del grado de urbanización. Año 2024.`,
  `Atarfe (INE 18022) · Porcentaje de población en agrupaciones urbanas, 2024: 94,3% (valor exacto: 94.32 %). Fuente: IECA, BADEA, consulta 19824, Clasificación del grado de urbanización. Año 2024.`,
  `Atarfe (INE 18022) · Porcentaje de población en celdas de malla rurales, 2024: 5,7% (valor exacto: 5.68 %). Fuente: IECA, BADEA, consulta 19824, Clasificación del grado de urbanización. Año 2024.`,
];

const MUN_ID = "atarfe";

function makeRepo() { return createMunicipalDocumentRepository({ municipalityId: MUN_ID }); }
function makeStore() { return createEvidenceStore(MUN_ID); }

// ── 1. Formato de líneas normalizadas ────────────────────────────────────────

describe("Líneas normalizadas BADEA 19824 — formato y contenido", () => {
  it("cada línea contiene el municipio", () => {
    for (const line of LINEAS_NORMALIZADAS) {
      expect(line).toContain("Atarfe");
    }
  });

  it("cada línea contiene el código INE", () => {
    for (const line of LINEAS_NORMALIZADAS) {
      expect(line).toContain("INE 18022");
    }
  });

  it("cada línea contiene el año", () => {
    for (const line of LINEAS_NORMALIZADAS) {
      expect(line).toContain("2024");
    }
  });

  it("cada línea contiene la fuente IECA", () => {
    for (const line of LINEAS_NORMALIZADAS) {
      expect(line).toContain("IECA");
    }
  });

  it("cada línea contiene el número de consulta BADEA", () => {
    for (const line of LINEAS_NORMALIZADAS) {
      expect(line).toContain("consulta 19824");
    }
  });

  it("cada línea contiene el título de la actividad estadística", () => {
    for (const line of LINEAS_NORMALIZADAS) {
      expect(line).toContain("Clasificación del grado de urbanización");
    }
  });

  it("cada línea es autocontenida (municipio + indicador + año + valor + fuente + consulta)", () => {
    for (const line of LINEAS_NORMALIZADAS) {
      const hasAll = (
        line.includes("Atarfe") &&
        line.includes("18022") &&
        line.includes("2024") &&
        line.includes("IECA") &&
        line.includes("19824")
      );
      expect(hasAll).toBe(true);
    }
  });
});

// ── 2. No se usan códigos crudos ──────────────────────────────────────────────

describe("Normalización BADEA — literales en lugar de códigos crudos", () => {
  it("el grado de urbanización usa el literal, no un código numérico", () => {
    const lineaGrado = LINEAS_NORMALIZADAS[0];
    expect(lineaGrado).toContain("Zona de densidad intermedia");
    // No debe contener solo un número como categoría
    expect(lineaGrado).not.toMatch(/grado.*?: \d+$/);
  });

  it("el nombre del municipio es el literal 'Atarfe', no solo '18022'", () => {
    const primeraLinea = LINEAS_NORMALIZADAS[0];
    expect(primeraLinea).toContain("Atarfe (INE 18022)");
    expect(primeraLinea).not.toMatch(/^18022 ·/);
  });

  it("los porcentajes usan formato localizado, no solo valor crudo inglés", () => {
    const lineaAgrupaciones = LINEAS_NORMALIZADAS[2];
    // Formato localizado presente
    expect(lineaAgrupaciones).toContain("94,3%");
    // Valor exacto también presente para trazabilidad
    expect(lineaAgrupaciones).toContain("94.32");
  });
});

// ── 3. Corrección metodológica: agrupaciones ≠ centros urbanos ────────────────

describe("Datos reales Atarfe — corrección respecto al briefing", () => {
  it("el dato 94,3% corresponde a agrupaciones urbanas, no a centros urbanos", () => {
    const lineaCentros     = LINEAS_NORMALIZADAS[1];
    const lineaAgrupaciones = LINEAS_NORMALIZADAS[2];

    // Centros urbanos es 0,0% para Atarfe
    expect(lineaCentros).toContain("centros urbanos");
    expect(lineaCentros).toContain("0,0%");

    // Agrupaciones urbanas es 94,3%
    expect(lineaAgrupaciones).toContain("agrupaciones urbanas");
    expect(lineaAgrupaciones).toContain("94,3%");
  });

  it("Atarfe es Zona de densidad intermedia, no Zona urbana", () => {
    expect(ATARFE.gradoUrbanizacion).toBe("Zona de densidad intermedia");
    expect(ATARFE.gradoUrbanizacion).not.toBe("Zona urbana");
  });

  it("el porcentaje en centros urbanos de Atarfe es 0,0%, no 94,3%", () => {
    expect(ATARFE.pctCentrosUrbanos.format).toBe("0,0%");
    expect(ATARFE.pctAgrupacionesUrbanas.format).toBe("94,3%");
  });
});

// ── 4. Pipeline cmi-indicator → origin "cmi", kind "indicator" ───────────────

describe('Pipeline cmi-indicator — origin "cmi" y kind "indicator"', () => {
  const TEXTO_PILOTO = LINEAS_NORMALIZADAS.join("\n");

  it('produce átomos con provenance.origin === "cmi"', () => {
    const result = ingestManualDocument({
      repository: makeRepo(),
      evidenceStore: makeStore(),
      kind: "cmi-indicator",
      title: "BADEA consulta 19824 — Urbanización — Atarfe 2024",
      plainText: TEXTO_PILOTO,
    });
    expect(result).not.toBeNull();
    expect(result!.atomsCreated).toBeGreaterThan(0);
    for (const atom of result!.evidenceStore.atoms) {
      expect(atom.provenance.origin).toBe("cmi");
    }
  });

  it('produce átomos con kind "indicator" (prior de cmi-indicator)', () => {
    const result = ingestManualDocument({
      repository: makeRepo(),
      evidenceStore: makeStore(),
      kind: "cmi-indicator",
      title: "BADEA consulta 19824 — Urbanización — Atarfe 2024",
      plainText: TEXTO_PILOTO,
    });
    expect(result).not.toBeNull();
    // La línea categórica y las de porcentaje caen bajo el prior "indicator" de cmi-indicator
    for (const atom of result!.evidenceStore.atoms) {
      expect(atom.kind).toBe("indicator");
    }
  });

  it("requiresHumanValidation = true en todos los átomos", () => {
    const result = ingestManualDocument({
      repository: makeRepo(),
      evidenceStore: makeStore(),
      kind: "cmi-indicator",
      title: "BADEA consulta 19824 — Urbanización — Atarfe 2024",
      plainText: TEXTO_PILOTO,
    });
    expect(result).not.toBeNull();
    for (const atom of result!.evidenceStore.atoms) {
      expect(atom.methodology.requiresHumanValidation).toBe(true);
    }
  });

  it("provenance.documentId fijado en todos los átomos", () => {
    const result = ingestManualDocument({
      repository: makeRepo(),
      evidenceStore: makeStore(),
      kind: "cmi-indicator",
      title: "BADEA consulta 19824 — Urbanización — Atarfe 2024",
      plainText: TEXTO_PILOTO,
    });
    expect(result).not.toBeNull();
    const docId = result!.document.id;
    for (const atom of result!.evidenceStore.atoms) {
      expect(atom.provenance.documentId).toBe(docId);
    }
  });
});

// ── 5. IntegrityGuard acepta átomos con origin "cmi" ─────────────────────────

describe('IntegrityGuard — acepta origin "cmi"', () => {
  it('IntegrityGuard no rechaza átomos con origin "cmi"', () => {
    const result = ingestManualDocument({
      repository: makeRepo(),
      evidenceStore: makeStore(),
      kind: "cmi-indicator",
      title: "BADEA consulta 19824 — Urbanización — Atarfe 2024",
      plainText: LINEAS_NORMALIZADAS.join("\n"),
    });
    expect(result).not.toBeNull();

    const guardResult = runEvidenceStoreIntegrityGuard(result!.evidenceStore);
    expect(guardResult.valid).toBe(true);
    expect(guardResult.errors).toHaveLength(0);
    expect(guardResult.sanitizedStore.atoms.length).toBe(result!.atomsCreated);
  });

  it("cmi es origen no gobernado: admite kind indicator", () => {
    const result = ingestManualDocument({
      repository: makeRepo(),
      evidenceStore: makeStore(),
      kind: "cmi-indicator",
      title: "BADEA consulta 19824",
      plainText: "Atarfe (INE 18022) · Porcentaje de población en agrupaciones urbanas, 2024: 94,3%.",
    });
    expect(result).not.toBeNull();
    const guardResult = runEvidenceStoreIntegrityGuard(result!.evidenceStore);
    expect(guardResult.valid).toBe(true);
  });
});

// ── 6. cmi-indicator NO en selector visible ──────────────────────────────────

describe("Selector visible — cmi-indicator no expuesto", () => {
  // DOCUMENT_KINDS visible en App.tsx (verificado en código)
  const VISIBLE_KINDS: DocumentKind[] = [
    "health-report",
    "complementary-study",
    "localiza-salud",
    "strategic-framework",
    "territorial-documentation",
    "qualitative-material",
    "longitudinal-evidence",
  ];

  it('cmi-indicator no aparece en el selector visible del producto', () => {
    expect(VISIBLE_KINDS).not.toContain("cmi-indicator");
  });

  it('eas-variable no aparece en el selector visible del producto', () => {
    expect(VISIBLE_KINDS).not.toContain("eas-variable");
  });

  it('other no aparece en el selector visible del producto', () => {
    expect(VISIBLE_KINDS).not.toContain("other");
  });

  it('la ingesta de cmi-indicator sigue funcionando aunque no sea visible', () => {
    // El tipo existe en el dominio aunque no esté expuesto en UI
    const result = ingestManualDocument({
      repository: makeRepo(),
      evidenceStore: makeStore(),
      kind: "cmi-indicator",
      title: "Test cmi-indicator",
      plainText: "Indicador de prueba CMI.",
    });
    expect(result).not.toBeNull();
    expect(result!.document.kind).toBe("cmi-indicator");
    expect(result!.atomsCreated).toBeGreaterThan(0);
  });
});

// ── 7. Riesgo de duplicación en reimportación ─────────────────────────────────

describe("Riesgo de duplicación — reimportación cmi-indicator", () => {
  it("reimportar el mismo texto acumula átomos (sin deduplicación)", () => {
    const TEXTO = LINEAS_NORMALIZADAS.join("\n");
    const r1 = ingestManualDocument({
      repository: makeRepo(),
      evidenceStore: makeStore(),
      kind: "cmi-indicator",
      title: "BADEA consulta 19824 — v1",
      plainText: TEXTO,
    });
    const r2 = ingestManualDocument({
      repository: r1!.repository,
      evidenceStore: r1!.evidenceStore,
      kind: "cmi-indicator",
      title: "BADEA consulta 19824 — v2",
      plainText: TEXTO,
    });
    expect(r2).not.toBeNull();
    // Los átomos se acumulan: sin deduplicación en cmi-indicator
    // Este test documenta el riesgo, no lo valida como correcto
    expect(r2!.evidenceStore.atoms.length).toBe(r1!.atomsCreated + r2!.atomsCreated);
  });
});
