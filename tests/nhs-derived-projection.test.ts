/**
 * nhs-derived-projection.test.ts (GOV-P4-01 · PR-D)
 *
 * La vista breve NHS es una PROYECCIÓN PURA del documento canónico. Se verifica:
 *  1. Paridad 1:1 por posición con `editorialView.tracerTable` (el trazador NO
 *     tiene ID de fila: la identidad es posicional + textual, no se inventa).
 *  2. Rastreabilidad total: toda celda procede del trazador; el módulo no importa
 *     workspace, `NHS*`, el compilador NHS ni módulos metodológicos.
 *  3. Ausencia de semántica fabricada: sin `position`, `above/below/similar`,
 *     «mejor/peor», ranking, diferencia, umbral ni `lectura`.
 *  4. Ausencias (refs, valor sintético defensivo, trazador vacío, doc null/legacy).
 *  5. Proxy: `esProxy` se preserva y manda; no se infiere del texto de `escala`.
 *  6. Frontera N+1: el proyector solo depende del trazador; el renderer no emite
 *     veredictos (comprobación estática).
 */

import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  projectNHSDerived,
  type NHSDerivedProjection,
} from "../src/application/health-profile/nhsDerivedProjection";
import type { CanonicalProfileDocument } from "../src/application/health-profile/canonicalProfileDocument";
import type { TrazadorRow } from "../src/application/health-profile/profileDiagnosticVisuals";

const SRC = resolve(dirname(fileURLToPath(import.meta.url)), "..", "src");
const readSrc = (rel: string) => readFileSync(resolve(SRC, rel), "utf8");

// ── Fixtures ──────────────────────────────────────────────────────────────────
// El proyector solo lee `editorialView.tracerTable`; el resto del documento se
// omite deliberadamente (cast) para probar que NADA más influye en la salida.

function docWith(
  tracerTable: TrazadorRow[],
  extraEditorial: Record<string, unknown> = {}
): CanonicalProfileDocument {
  return {
    editorialView: { tracerTable, ...extraEditorial },
  } as unknown as CanonicalProfileDocument;
}

function row(overrides: Partial<TrazadorRow> = {}): TrazadorRow {
  return {
    bloque: "Salud mental, sueño y malestar",
    indicador: "sueño de duración insuficiente",
    valor: "31,4 %",
    refGranada: "28,0 %",
    refAndalucia: "27,1 %",
    escala: "muestra local",
    esProxy: false,
    lectura: "referencia provincial por encima de la andaluza (27,1 %)",
    ...overrides,
  };
}

const SAMPLE: TrazadorRow[] = [
  row({ bloque: "A", indicador: "apoyo social funcional", valor: "48,0", refGranada: "49,2", refAndalucia: "no disponible", esProxy: false }),
  row({ bloque: "A", indicador: "adherencia mediterránea", valor: "7,2 / 14", refGranada: "7,6", refAndalucia: "7,5", esProxy: true }),
  row({ bloque: "B", indicador: "sueño insuficiente", valor: "31,4 %", refGranada: "no disponible", refAndalucia: "no disponible", esProxy: false }),
];

function rowsOf(p: NHSDerivedProjection) {
  if (!p.available) throw new Error("proyección no disponible");
  return p.rows;
}

// ── 1 · Paridad por fila ──────────────────────────────────────────────────────
describe("PR-D · paridad 1:1 con el trazador canónico", () => {
  it("mismo número de filas y mismo orden; identidad posicional, sin ID inventado", () => {
    // El trazador canónico (`TrazadorRow`) NO tiene ID de fila. La paridad se
    // prueba por índice y por igualdad exacta de los campos textuales; NO se
    // asevera «mismo ID» porque el canónico no lo proporciona ni se fabrica.
    const rows = rowsOf(projectNHSDerived(docWith(SAMPLE)));
    expect(rows).toHaveLength(SAMPLE.length);
    rows.forEach((r, i) => {
      expect(r.bloque).toBe(SAMPLE[i].bloque);
      expect(r.indicador).toBe(SAMPLE[i].indicador);
      expect(r.valor).toBe(SAMPLE[i].valor);
      expect(r.refGranada).toBe(SAMPLE[i].refGranada);
      expect(r.refAndalucia).toBe(SAMPLE[i].refAndalucia);
      expect(r.esProxy).toBe(SAMPLE[i].esProxy);
    });
  });

  it("preserva el orden exacto (no reordena como ranking)", () => {
    const rows = rowsOf(projectNHSDerived(docWith(SAMPLE)));
    expect(rows.map((r) => r.indicador)).toEqual(SAMPLE.map((r) => r.indicador));
  });
});

// ── 2 · Rastreabilidad total ──────────────────────────────────────────────────
describe("PR-D · rastreabilidad: toda celda procede del trazador", () => {
  it("cada fila derivada tiene exactamente las claves del contrato y coinciden con el trazador", () => {
    const rows = rowsOf(projectNHSDerived(docWith(SAMPLE)));
    rows.forEach((r, i) => {
      expect(new Set(Object.keys(r))).toEqual(
        new Set(["bloque", "indicador", "valor", "refGranada", "refAndalucia", "esProxy", "escala"])
      );
      expect(r.escala).toBe(SAMPLE[i].escala);
    });
  });

  it("el módulo proyector no importa workspace, NHS*, compilador NHS ni módulos metodológicos", () => {
    const importLines = readSrc("application/health-profile/nhsDerivedProjection.ts")
      .split("\n")
      .filter((l) => /^\s*import\b/.test(l))
      .join("\n");
    expect(importLines).not.toMatch(/workspace/i);
    expect(importLines).not.toMatch(/NHSHealthProfileArtifact/);
    expect(importLines).not.toMatch(/nhs-health-profile/);
    expect(importLines).not.toMatch(/domain\/methodology/);
    expect(importLines).not.toMatch(/domain\/nhs-health-profile/);
  });
});

// ── 3 · Sin semántica fabricada ───────────────────────────────────────────────
describe("PR-D · sin semántica nueva ni veredicto", () => {
  it("la salida no contiene position, lectura, ni tokens de veredicto", () => {
    const p = projectNHSDerived(docWith(SAMPLE));
    rowsOf(p).forEach((r) => {
      expect(r).not.toHaveProperty("position");
      expect(r).not.toHaveProperty("lectura");
    });
    const json = JSON.stringify(p);
    expect(json).not.toMatch(/\babove\b/);
    expect(json).not.toMatch(/\bbelow\b/);
    expect(json).not.toMatch(/\bsimilar\b/);
    expect(json.toLowerCase()).not.toContain("mejor");
    expect(json.toLowerCase()).not.toContain("peor");
    // `lectura` (prosa "…por encima de la andaluza…") queda excluida: su texto no
    // aparece en la salida.
    expect(json).not.toContain("encima");
  });
});

// ── 4 · Ausencias ─────────────────────────────────────────────────────────────
describe("PR-D · comportamiento ante ausencia", () => {
  it("referencia provincial ausente: literal canónico 'no disponible'", () => {
    const rows = rowsOf(projectNHSDerived(docWith([row({ refGranada: "no disponible" })])));
    expect(rows[0].refGranada).toBe("no disponible");
  });

  it("referencia andaluza ausente: literal canónico 'no disponible'", () => {
    const rows = rowsOf(projectNHSDerived(docWith([row({ refAndalucia: "no disponible" })])));
    expect(rows[0].refAndalucia).toBe("no disponible");
  });

  it("ambas referencias ausentes", () => {
    const rows = rowsOf(projectNHSDerived(docWith([row({ refGranada: "no disponible", refAndalucia: "no disponible" })])));
    expect(rows[0].refGranada).toBe("no disponible");
    expect(rows[0].refAndalucia).toBe("no disponible");
  });

  it("valor territorial ausente — prueba DEFENSIVA con fila sintética", () => {
    // El builder canónico de `tracerTable` filtra las filas con
    // `territorialValue === undefined`, así que `valor` vacío NO es un estado
    // producible en producción. Se prueba solo la robustez del proyector.
    const rows = rowsOf(projectNHSDerived(docWith([row({ valor: "" })])));
    expect(rows[0].valor).toBe("");
  });

  it("trazador vacío: proyección vacía válida, sin fabricar filas", () => {
    const p = projectNHSDerived(docWith([]));
    expect(p.available).toBe(true);
    expect(rowsOf(p)).toHaveLength(0);
  });

  it("documento null/legacy/incompleto: no disponible, sin fallback al artefacto NHS", () => {
    const p = projectNHSDerived(null);
    expect(p.available).toBe(false);
    expect(p).not.toHaveProperty("rows");
  });
});

// ── 5 · Proxy ─────────────────────────────────────────────────────────────────
describe("PR-D · preservación de esProxy", () => {
  it("esProxy=true se conserva", () => {
    const rows = rowsOf(projectNHSDerived(docWith([row({ esProxy: true })])));
    expect(rows[0].esProxy).toBe(true);
  });

  it("esProxy manda: no se infiere del texto de 'escala'", () => {
    // escala dice "proxy contextual" pero esProxy=false → la proyección respeta
    // el booleano canónico, no el texto.
    const rows = rowsOf(projectNHSDerived(docWith([row({ esProxy: false, escala: "proxy contextual" })])));
    expect(rows[0].esProxy).toBe(false);
  });
});

// ── 6 · Frontera N+1 y renderer sin veredicto ─────────────────────────────────
describe("PR-D · frontera N+1 y renderer", () => {
  it("el proyector solo depende del trazador: ignora readingStatus y no cuenta evidencia", () => {
    const a = projectNHSDerived(docWith(SAMPLE, { readingStatus: "integrated", pendingDeclaration: null }));
    const b = projectNHSDerived(docWith(SAMPLE, { readingStatus: "prioritization-pending", pendingDeclaration: "pendiente" }));
    expect(a).toEqual(b);
  });

  it("NHSHealthProfileView no contiene POSITION_LABEL, columna Posición ni etiquetas Mejor/Peor/Similar", () => {
    const view = readSrc("ui/components/NHSHealthProfileView.tsx");
    expect(view).not.toContain("POSITION_LABEL");
    expect(view).not.toContain("Posición");
    expect(view).not.toContain("Mejor que referencia");
    expect(view).not.toContain("Peor que referencia");
    expect(view).not.toContain("Similar a referencia");
    expect(view).not.toMatch(/nhs-pos-pill|nhs-pos--/);
    // No IMPORTA el artefacto ni la rama de dominio NHS (la mención en el
    // comentario de cabecera es explicativa y legítima).
    const viewImports = view
      .split("\n")
      .filter((l) => /^\s*import\b/.test(l))
      .join("\n");
    expect(viewImports).not.toMatch(/NHSHealthProfileArtifact/);
    expect(viewImports).not.toMatch(/domain\/nhs-health-profile/);
  });

  it("el estado de trazador vacío es estrictamente observacional (sin inferir causa)", () => {
    // Un trazador vacío solo demuestra ausencia de filas proyectables, no
    // ausencia de indicadores con referencia: la redacción no debe fabricar esa
    // inferencia no contenida en el canónico.
    const view = readSrc("ui/components/NHSHealthProfileView.tsx");
    expect(view).toContain("no contiene filas disponibles para esta representación");
    expect(view).not.toContain("no contiene indicadores con referencia");
  });
});
