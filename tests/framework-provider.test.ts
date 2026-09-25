/**
 * framework-provider.test.ts — Unidad 4
 *
 * Verifica el contrato de la infraestructura de acceso al conocimiento
 * estratégico institucional (FrameworkProvider + StaticFrameworkProvider).
 *
 * No depende del MTE ni del dominio del Producto 5 (strategic-scenario).
 * No depende de LocalHealthProfile, EvidenceStore ni municipios reales.
 */

import { describe, expect, it } from "vitest";
import type { StrategicElement } from "../src/domain/strategy";
import type { FrameworkProvider } from "../src/application/mte";
import { StaticFrameworkProvider } from "../src/application/mte";
import { getAllStrategicElements } from "../src/domain/strategy";

// ── Fixtures mínimos ──────────────────────────────────────────────────────────
// Tres elementos de dos marcos distintos. Deterministas, sin dependencias.

const EL_EPVSA_LE1: StrategicElement = {
  framework: "EPVSA",
  level: "line",
  id: "EPVSA-LE1",
  label: "LE1 · Acción local en salud y comunidad",
  sourceTrace: "EPVSA 2024–2030, Línea Estratégica 1.",
};

const EL_EPVSA_LE2: StrategicElement = {
  framework: "EPVSA",
  level: "line",
  id: "EPVSA-LE2",
  label: "LE2 · Entornos y estilos de vida saludables",
  sourceTrace: "EPVSA 2024–2030, Línea Estratégica 2.",
};

const EL_ESCA_L1: StrategicElement = {
  framework: "ESCA",
  level: "line",
  id: "ESCA-L1",
  label: "Reorientación del sistema sanitario hacia la salud comunitaria",
  sourceTrace: "ESCA — Línea 1.",
};

const ELEMENTOS_TEST: readonly StrategicElement[] = [EL_EPVSA_LE1, EL_EPVSA_LE2, EL_ESCA_L1];
const VERSION_TEST = "1.0.0-test";

// ── Bloque 1 — Contrato de la interfaz ───────────────────────────────────────

describe("Bloque 1 — Contrato FrameworkProvider", () => {

  it("StaticFrameworkProvider satisface la interfaz FrameworkProvider", () => {
    const provider: FrameworkProvider = new StaticFrameworkProvider(ELEMENTOS_TEST, VERSION_TEST);
    expect(typeof provider.getElements).toBe("function");
    expect(typeof provider.getVersion).toBe("function");
  });

  it("getElements() devuelve exactamente los elementos recibidos en construcción", () => {
    const provider = new StaticFrameworkProvider(ELEMENTOS_TEST, VERSION_TEST);
    expect(provider.getElements()).toBe(ELEMENTOS_TEST);
  });

  it("getVersion() devuelve exactamente la versión recibida en construcción", () => {
    const provider = new StaticFrameworkProvider(ELEMENTOS_TEST, VERSION_TEST);
    expect(provider.getVersion()).toBe(VERSION_TEST);
  });

  it("proveedor con array vacío devuelve array vacío", () => {
    const provider = new StaticFrameworkProvider([], "0.0.0");
    expect(provider.getElements()).toHaveLength(0);
    expect(provider.getVersion()).toBe("0.0.0");
  });

  it("getElements() es estable: llamadas sucesivas devuelven la misma referencia", () => {
    const provider = new StaticFrameworkProvider(ELEMENTOS_TEST, VERSION_TEST);
    expect(provider.getElements()).toBe(provider.getElements());
  });

  it("getVersion() es estable: llamadas sucesivas devuelven la misma cadena", () => {
    const provider = new StaticFrameworkProvider(ELEMENTOS_TEST, VERSION_TEST);
    expect(provider.getVersion()).toBe(provider.getVersion());
  });

  it("distintos proveedores son completamente independientes entre sí", () => {
    const p1 = new StaticFrameworkProvider([EL_EPVSA_LE1], "1.0.0");
    const p2 = new StaticFrameworkProvider([EL_ESCA_L1], "2.0.0");
    expect(p1.getElements()).toHaveLength(1);
    expect(p2.getElements()).toHaveLength(1);
    expect(p1.getElements()[0].id).toBe("EPVSA-LE1");
    expect(p2.getElements()[0].id).toBe("ESCA-L1");
    expect(p1.getVersion()).toBe("1.0.0");
    expect(p2.getVersion()).toBe("2.0.0");
  });

  it("los elementos conservan su estructura completa (framework, id, level, label, sourceTrace)", () => {
    const provider = new StaticFrameworkProvider(ELEMENTOS_TEST, VERSION_TEST);
    const elementos = provider.getElements();
    expect(elementos[0].framework).toBe("EPVSA");
    expect(elementos[0].id).toBe("EPVSA-LE1");
    expect(elementos[0].level).toBe("line");
    expect(elementos[0].label.trim().length).toBeGreaterThan(0);
    expect(elementos[0].sourceTrace.trim().length).toBeGreaterThan(0);
    expect(elementos[2].framework).toBe("ESCA");
    expect(elementos[2].id).toBe("ESCA-L1");
  });

  it("elementos con campo opcional (description) conservan ese campo", () => {
    const conDescripcion: StrategicElement = {
      ...EL_EPVSA_LE1,
      description: "Descripción de prueba",
    };
    const provider = new StaticFrameworkProvider([conDescripcion], VERSION_TEST);
    expect(provider.getElements()[0].description).toBe("Descripción de prueba");
  });
});

// ── Bloque 2 — Desacoplamiento del dominio del MTE ───────────────────────────

describe("Bloque 2 — Desacoplamiento del dominio del Producto 5", () => {

  it("los elementos del proveedor son StrategicElement, no objetos del dominio MTE", () => {
    const provider = new StaticFrameworkProvider(ELEMENTOS_TEST, VERSION_TEST);
    for (const el of provider.getElements()) {
      expect(typeof el.framework).toBe("string");
      expect(typeof el.id).toBe("string");
      expect(typeof el.label).toBe("string");
      expect(typeof el.sourceTrace).toBe("string");
      // No contiene atributos del dominio strategic-scenario (Producto 5)
      const cast = el as Record<string, unknown>;
      expect(cast["areasOrigen"]).toBeUndefined();
      expect(cast["tensiones"]).toBeUndefined();
      expect(cast["sinCoberturaMarcal"]).toBeUndefined();
      expect(cast["requiresHumanValidation"]).toBeUndefined();
      expect(cast["escenarios"]).toBeUndefined();
    }
  });

  it("el proveedor no introduce interpretación ni transformación sobre los elementos", () => {
    const proveedor = new StaticFrameworkProvider(ELEMENTOS_TEST, VERSION_TEST);
    const elementos = proveedor.getElements();
    // Sin modificación: los ids son exactamente los recibidos
    expect(elementos.map((e) => e.id)).toEqual(["EPVSA-LE1", "EPVSA-LE2", "ESCA-L1"]);
    // Sin ordenación: el orden es el recibido en construcción
    expect(elementos[0].framework).toBe("EPVSA");
    expect(elementos[2].framework).toBe("ESCA");
  });
});

// ── Bloque 3 — Integración con el StrategicFrameworkRegistry existente ────────

describe("Bloque 3 — Integración con el registro de conocimiento estratégico real", () => {

  it("puede envolver el StrategicFrameworkRegistry completo sin modificación", () => {
    const provider = new StaticFrameworkProvider(getAllStrategicElements(), "1.0.0");
    expect(provider.getElements().length).toBeGreaterThan(0);
    expect(provider.getVersion()).toBe("1.0.0");
  });

  it("los marcos EPVSA, ESCA, MAYORES, BUENA_EDAD y RELAS están representados", () => {
    const provider = new StaticFrameworkProvider(getAllStrategicElements(), "1.0.0");
    const marcos = new Set(provider.getElements().map((e) => e.framework));
    expect(marcos.has("EPVSA")).toBe(true);
    expect(marcos.has("ESCA")).toBe(true);
    expect(marcos.has("MAYORES")).toBe(true);
    expect(marcos.has("BUENA_EDAD")).toBe(true);
    expect(marcos.has("RELAS")).toBe(true);
  });

  it("todos los elementos del registro conservan sourceTrace no vacío", () => {
    const provider = new StaticFrameworkProvider(getAllStrategicElements(), "1.0.0");
    for (const el of provider.getElements()) {
      expect(el.sourceTrace.trim().length, `${el.id} debe tener sourceTrace`).toBeGreaterThan(0);
    }
  });

  it("el proveedor con el registro completo puede sustituirse por uno de test sin cambiar interfaz", () => {
    // Ambas variables cumplen FrameworkProvider: el tipo garantiza la sustitución
    const produccion: FrameworkProvider = new StaticFrameworkProvider(getAllStrategicElements(), "1.0.0");
    const prueba: FrameworkProvider = new StaticFrameworkProvider(ELEMENTOS_TEST, VERSION_TEST);
    expect(produccion.getElements().length).toBeGreaterThan(prueba.getElements().length);
    expect(typeof produccion.getVersion()).toBe(typeof prueba.getVersion());
  });
});
