import { describe, expect, it } from "vitest";
import {
  buildHealthDeterminantFrameSummary,
  findHealthDeterminantFrames,
} from "../src/application/health-profile";

function normalized(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

describe("marcos de determinantes sanitarios", () => {
  it("lee diabetes con edad, herencia, estilos de vida y contexto sin ordenar pesos locales", () => {
    const frame = buildHealthDeterminantFrameSummary(
      "diabetes tipo 2, obesidad, sedentarismo y control metabolico"
    );
    expect(frame).toBeDefined();
    const text = normalized(`${frame!.statement} ${frame!.caution}`);
    expect(text).toContain("edad");
    expect(text).toMatch(/susceptibilidad familiar o genetica/);
    expect(text).toContain("alimentacion");
    expect(text).toContain("actividad fisica");
    expect(text).toContain("condiciones materiales");
    expect(text).toContain("no permite ordenar el peso local");
  });

  it("distingue cancer como problema multicausal sin atribuir una causa local", () => {
    const frame = buildHealthDeterminantFrameSummary("cancer y tumores");
    expect(frame).toBeDefined();
    const text = normalized(`${frame!.statement} ${frame!.mechanism}`);
    expect(text).toContain("tabaco");
    expect(text).toContain("alcohol");
    expect(text).toContain("exposiciones ambientales");
    expect(text).toContain("cribado");
    expect(normalized(frame!.caution)).toContain("atribuir el patron a uno de ellos");
  });

  it("mantiene un registro cerrado de marcos reconocidos", () => {
    const frames = findHealthDeterminantFrames(
      "salud mental, sueño, apoyo social, alimentación, tabaco y cribados"
    );
    expect(frames.map((frame) => frame.id)).toEqual(
      expect.arrayContaining([
        "mental-sleep",
        "ageing-care",
        "nutrition-metabolic",
        "substance-use",
        "prevention-access",
      ])
    );
  });
});
