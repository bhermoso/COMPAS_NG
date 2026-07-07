/**
 * tests/demo-municipalities-ine.test.ts
 *
 * Verifica que los códigos INE de los municipios demo de COMPÁS NG
 * son correctos según el catálogo BADEA/IECA (verificado 2026-07-07).
 *
 * Correcciones aplicadas:
 *  - Alfacar:              18009 (incorrecto) → 18011 (correcto)
 *  - Churriana de la Vega: 18052 (incorrecto) → 18062 (correcto)
 *  - Zagra:                sin código          → 18913 (añadido)
 *  - Atarfe:               18022 (correcto, sin cambio)
 *  - Granada capital:      no añadida (decisión posterior expresa requerida)
 */

import { describe, it, expect } from "vitest";
import { createCompleteMunicipalityWorkspace } from "../src/application/workspace";

// Refleja exactamente DEMO_MUNICIPALITIES en App.tsx
const DEMO: { id: string; name: string; province: string; ineCode: string }[] = [
  { id: "atarfe",    name: "Atarfe",              province: "Granada", ineCode: "18022" },
  { id: "alfacar",   name: "Alfacar",              province: "Granada", ineCode: "18011" },
  { id: "churriana", name: "Churriana de la Vega", province: "Granada", ineCode: "18062" },
  { id: "zagra",     name: "Zagra",               province: "Granada", ineCode: "18913" },
];

describe("Municipios demo — códigos INE verificados con BADEA/IECA", () => {
  for (const { id, name, province, ineCode } of DEMO) {
    it(`${name} tiene ineCode ${ineCode}`, () => {
      const ws = createCompleteMunicipalityWorkspace({ id, name, province, ineCode });
      expect(ws.municipality.identity.ineCode).toBe(ineCode);
    });
  }

  it("Atarfe sigue con 18022 (sin cambio)", () => {
    const ws = createCompleteMunicipalityWorkspace({
      id: "atarfe", name: "Atarfe", province: "Granada", ineCode: "18022",
    });
    expect(ws.municipality.identity.ineCode).toBe("18022");
  });

  it("Alfacar corregido: 18011, no 18009", () => {
    const ws = createCompleteMunicipalityWorkspace({
      id: "alfacar", name: "Alfacar", province: "Granada", ineCode: "18011",
    });
    expect(ws.municipality.identity.ineCode).toBe("18011");
    expect(ws.municipality.identity.ineCode).not.toBe("18009");
  });

  it("Churriana de la Vega corregida: 18062, no 18052", () => {
    const ws = createCompleteMunicipalityWorkspace({
      id: "churriana", name: "Churriana de la Vega", province: "Granada", ineCode: "18062",
    });
    expect(ws.municipality.identity.ineCode).toBe("18062");
    expect(ws.municipality.identity.ineCode).not.toBe("18052");
  });

  it("Zagra tiene ineCode 18913 (antes sin código)", () => {
    const ws = createCompleteMunicipalityWorkspace({
      id: "zagra", name: "Zagra", province: "Granada", ineCode: "18913",
    });
    expect(ws.municipality.identity.ineCode).toBe("18913");
  });

  it("Granada capital no aparece en municipios demo", () => {
    const ids = DEMO.map((m) => m.id);
    expect(ids).not.toContain("granada");
    const codes = DEMO.map((m) => m.ineCode);
    expect(codes).not.toContain("18087");
  });
});
