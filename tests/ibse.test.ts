import { describe, expect, it } from "vitest";
import { ibseStudyToEvidenceAtoms } from "../src/application/ibse";
import { createIBSEStudy } from "../src/domain/ibse";

const MUNICIPALITY_ID = "test-municipality";

function makeStudy(overrides: Partial<Parameters<typeof createIBSEStudy>[0]> = {}) {
  return createIBSEStudy({
    municipalityId: MUNICIPALITY_ID,
    sourceFileName: "test.csv",
    aggregates: {
      n: 100,
      nValid: 80,
      meanTotal: 63.5,
      meanFactorVinculo: 71.2,
      meanFactorSituacion: 58.4,
      meanFactorControl: 49.6,
      meanFactorPersona: 74.8,
    },
    methodologicalCautions: [],
    ...overrides,
  });
}

describe("IBSEStudyToEvidenceAtoms — escala 0–100", () => {
  it("produce 6 átomos para una muestra válida (5 factores + 1 resumen)", () => {
    const atoms = ibseStudyToEvidenceAtoms(makeStudy());
    expect(atoms).toHaveLength(6);
  });

  it("los átomos de factores incluyen 'Escala 0–100' en su descripción", () => {
    const atoms = ibseStudyToEvidenceAtoms(makeStudy());
    const factorAtoms = atoms.filter((a) => a.kind === "indicator");
    expect(factorAtoms).toHaveLength(5);
    for (const atom of factorAtoms) {
      expect(atom.content).toContain("0–100");
      // "Escala 0–10[^0]" detecta la escala incorrecta sin falso positivo con "0–100"
      expect(atom.content).not.toMatch(/Escala 0[–-]10[^0]/);
    }
  });

  it("el átomo resumen expresa puntuaciones sobre 100, no sobre 10", () => {
    const atoms = ibseStudyToEvidenceAtoms(makeStudy());
    const resumen = atoms.find((a) => a.kind === "qualitative-observation");
    expect(resumen).toBeDefined();
    expect(resumen!.content).toContain("/100");
    expect(resumen!.content).not.toContain("/10 ");
  });

  it("la clasificación de nivel usa umbrales 0–100 (≥75 alto, 60–74 medio, 50–59 medio-bajo, <50 bajo)", () => {
    const atoms = ibseStudyToEvidenceAtoms(makeStudy());
    const resumen = atoms.find((a) => a.kind === "qualitative-observation");
    // meanTotal = 63.5 → debe clasificar como 'medio'
    expect(resumen!.content).toMatch(/63\.5\/100.*medio/);
  });

  it("la dispersión interfactorial alta se detecta a partir de 20 puntos, no de 2", () => {
    // Rango = max(74.8) - min(49.6) = 25.2 → dispersión alta
    const atoms = ibseStudyToEvidenceAtoms(makeStudy());
    const resumen = atoms.find((a) => a.kind === "qualitative-observation");
    expect(resumen!.content).toContain("alta");
    expect(resumen!.content).toContain("20 puntos");
  });

  it("no detecta dispersión alta cuando el rango es de 10 puntos (escala 0–100)", () => {
    // meanTotal y factores muy próximos — sin dispersión alta
    const study = makeStudy({
      aggregates: {
        n: 50,
        nValid: 45,
        meanTotal: 65.0,
        meanFactorVinculo: 67.0,
        meanFactorSituacion: 65.0,
        meanFactorControl: 63.0,
        meanFactorPersona: 68.0,
      },
    });
    const atoms = ibseStudyToEvidenceAtoms(study);
    const resumen = atoms.find((a) => a.kind === "qualitative-observation");
    // rango = 68 - 63 = 5 → dispersión baja
    expect(resumen!.content).not.toContain("[Regla del sistema] Dispersión interfactorial alta");
  });

  it("produce 0 átomos cuando nValid es 0", () => {
    const study = makeStudy({
      aggregates: {
        n: 10,
        nValid: 0,
        meanTotal: 0,
        meanFactorVinculo: 0,
        meanFactorSituacion: 0,
        meanFactorControl: 0,
        meanFactorPersona: 0,
      },
    });
    expect(ibseStudyToEvidenceAtoms(study)).toHaveLength(0);
  });

  it("aplica confianza 'low' cuando nValid < 30", () => {
    const study = makeStudy({
      aggregates: {
        n: 25,
        nValid: 20,
        meanTotal: 60.0,
        meanFactorVinculo: 58.0,
        meanFactorSituacion: 62.0,
        meanFactorControl: 59.0,
        meanFactorPersona: 61.0,
      },
    });
    const atoms = ibseStudyToEvidenceAtoms(study);
    expect(atoms.every((a) => a.confidence === "low")).toBe(true);
  });

  it("aplica confianza 'medium' cuando nValid >= 30", () => {
    const atoms = ibseStudyToEvidenceAtoms(makeStudy()); // nValid = 80
    expect(atoms.every((a) => a.confidence === "medium")).toBe(true);
  });

  it("methodology.limitations del resumen usa el umbral correcto >20 puntos, no >2 puntos", () => {
    const atoms = ibseStudyToEvidenceAtoms(makeStudy());
    const resumen = atoms.find((a) => a.kind === "qualitative-observation");
    expect(resumen).toBeDefined();
    const limitations = resumen!.methodology.limitations;
    const alertaDispersion = limitations.find((l) => l.includes("dispersión interfactorial"));
    expect(alertaDispersion).toBeDefined();
    expect(alertaDispersion).toContain(">20 puntos");
    expect(alertaDispersion).not.toMatch(/>2 puntos[^0-9]/);
  });
});
