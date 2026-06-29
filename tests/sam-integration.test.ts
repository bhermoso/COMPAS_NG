/**
 * Tests de integración SAM — verifica que el motor SAM evalúa correctamente
 * los seis instrumentos complementarios usando sus Fuentes Poblacionales de Referencia.
 *
 * Datos de referencia verificados:
 *   Atarfe adultos ≥16 (INE 2022):   N=15.472 → nTheoretical=375
 *   Atarfe escolar 6–17 (MTI-BDU 2025): N=2.847  → nTheoretical=339
 *
 * nObserved por instrumento (valores de los fixtures EAS Granada / IBSE Atarfe):
 *   DUKE:     nValidGlobal=3028 | PREDIMED: nValid=712
 *   SF-12:    nValidPCS=3047    | Sueño:    nValidP33R=3004
 *   CAGE:     nValidCAGER=2513  | IBSE:     nValid=811
 */

import { describe, expect, it } from "vitest";
import {
  assessDUKEStudy,
  assessPREDIMEDStudy,
  assessSF12Study,
  assessSuenoStudy,
  assessCAGEStudy,
  assessIBSEStudy16Plus,
  assessIBSEStudyFull,
} from "../src/application/sam";
import { createDUKEStudy } from "../src/domain/duke";
import { createPREDIMEDStudy } from "../src/domain/predimed";
import { createSF12Study } from "../src/domain/sf12";
import { createSuenoStudy } from "../src/domain/sueno";
import { createCAGEStudy } from "../src/domain/cage";
import { createIBSEStudy } from "../src/domain/ibse";
import type { PopulationReference } from "../src/domain/sam";

// ── Fuentes Poblacionales de Referencia ──────────────────────────────────────

const ATARFE_ADULTS: PopulationReference = {
  municipalityId: "18022",
  municipalityCode: "18022",
  source: "Padrón Municipal de Habitantes — INE, 1 de enero de 2022",
  year: 2022,
  populationTotal: 15_472,
  ageGroupLabel: "16 años y más",
  extractedAt: "2026-06-29",
};

const ATARFE_SCHOOL: PopulationReference = {
  municipalityId: "18022",
  municipalityCode: "18022",
  source: "MTI-BDU — Poblaciones por Edad, 31 de diciembre de 2025",
  year: 2025,
  populationTotal: 2_847,
  ageGroupLabel: "6 a 17 años (universo escolar)",
  extractedAt: "2026-06-29",
};

const MUNICIPALITY_ID = "18022";

// ── Estudios sintéticos con valores de los fixtures EAS Granada / IBSE Atarfe ─

function makeDUKEStudy(nValidGlobal = 3028) {
  return createDUKEStudy({
    municipalityId: MUNICIPALITY_ID,
    sourceFileName: "duke-eas-granada.csv",
    aggregates: {
      n: 3064,
      nValidGlobal,
      nValidConfidential: 3000,
      nValidAffective: 3000,
      meanGlobal: 42.1,
      meanConfidential: 21.0,
      meanAffective: 21.1,
      lowGlobalCount: 500,
      lowConfidentialCount: 250,
      lowAffectiveCount: 250,
      normalGlobalCount: 2528,
      normalConfidentialCount: 2750,
      normalAffectiveCount: 2750,
      incompleteGlobalCount: 36,
      incompleteConfidentialCount: 64,
      incompleteAffectiveCount: 64,
      lowGlobalPercentage: 16.5,
      lowConfidentialPercentage: 8.3,
      lowAffectivePercentage: 8.3,
    },
    methodologicalCautions: [],
  });
}

function makePREDIMEDStudy(nValid = 712) {
  return createPREDIMEDStudy({
    municipalityId: MUNICIPALITY_ID,
    sourceFileName: "predimed-eas-granada.csv",
    aggregates: {
      n: 3064,
      nValid,
      meanScore: 7.63,
      lowCount: 256,
      mediumCount: 186,
      highCount: 270,
      lowPercentage: 36.0,
      mediumPercentage: 26.1,
      highPercentage: 37.9,
      incompleteCount: 2352,
    },
    methodologicalCautions: [],
  });
}

function makeSF12Study(nValidPCS = 3047) {
  return createSF12Study({
    municipalityId: MUNICIPALITY_ID,
    sourceFileName: "sf12-eas-granada.csv",
    aggregates: {
      n: 3064,
      nValidPCS,
      nValidMCS: 3046,
      meanPCS: 49.55,
      meanMCS: 51.14,
      missingPCS: 17,
      missingMCS: 18,
    },
    methodologicalCautions: [],
  });
}

function makeSuenoStudy(nValidP33R = 3004) {
  return createSuenoStudy({
    municipalityId: MUNICIPALITY_ID,
    sourceFileName: "sueno-eas-granada.csv",
    aggregates: {
      n: 3064,
      nValidP33R,
      missingP33R: 60,
      nInsufficientSleep: 871,
      pctInsufficientSleep: 29.0,
      nValidP33A: 2300,
      missingP33A: 764,
      nNoRest: 690,
      pctNoRest: 30.0,
    },
    methodologicalCautions: [],
  });
}

function makeCAGEStudy(nValidCAGER = 2513) {
  return createCAGEStudy({
    municipalityId: MUNICIPALITY_ID,
    sourceFileName: "cage-eas-granada.csv",
    aggregates: {
      n: 3064,
      nValidCAGER,
      missingCAGER: 551,
      nRisk: 134,
      pctRisk: 5.3,
      nValidCAGE: 2513,
      nCAGE1: 1900,
      nCAGE2: 479,
      nCAGE3: 100,
      nCAGE4: 34,
    },
    methodologicalCautions: [],
  });
}

function makeIBSEStudy(nValid = 811) {
  return createIBSEStudy({
    municipalityId: MUNICIPALITY_ID,
    sourceFileName: "ibse-atarfe.csv",
    aggregates: {
      n: 909,
      nValid,
      meanTotal: 63.2,
      meanFactorVinculo: 68.5,
      meanFactorSituacion: 60.1,
      meanFactorControl: 55.8,
      meanFactorPersona: 72.3,
    },
    methodologicalCautions: [],
  });
}

// ── 1. Integración EAS — cinco estudios ──────────────────────────────────────

describe("SAM integración — DUKE-EAS", () => {
  it("genera SampleQualityAssessment con instrumentId correcto", () => {
    const result = assessDUKEStudy(makeDUKEStudy(), ATARFE_ADULTS);
    expect(result.instrumentId).toBe("duke-eas");
  });

  it("usa nValidGlobal como nObserved (3028)", () => {
    const result = assessDUKEStudy(makeDUKEStudy(), ATARFE_ADULTS);
    expect(result.nObserved).toBe(3028);
  });

  it("calidad HIGH: n=3028 >> nTheoretical=375 → cobertura 807 %", () => {
    const result = assessDUKEStudy(makeDUKEStudy(), ATARFE_ADULTS);
    expect(result.sampleQuality).toBe("high");
    expect(result.nTheoretical).toBe(375);
    expect(result.coverageGlobal).toBeCloseTo(807.5, 0);
  });

  it("municipalityId proviene del estudio", () => {
    const result = assessDUKEStudy(makeDUKEStudy(), ATARFE_ADULTS);
    expect(result.municipalityId).toBe(MUNICIPALITY_ID);
  });
});

describe("SAM integración — PREDIMED-EAS", () => {
  it("genera SampleQualityAssessment con instrumentId correcto", () => {
    const result = assessPREDIMEDStudy(makePREDIMEDStudy(), ATARFE_ADULTS);
    expect(result.instrumentId).toBe("predimed-eas");
  });

  it("usa nValid como nObserved (712)", () => {
    const result = assessPREDIMEDStudy(makePREDIMEDStudy(), ATARFE_ADULTS);
    expect(result.nObserved).toBe(712);
  });

  it("calidad HIGH: n=712 > nTheoretical=375 → cobertura 189 %", () => {
    const result = assessPREDIMEDStudy(makePREDIMEDStudy(), ATARFE_ADULTS);
    expect(result.sampleQuality).toBe("high");
    expect(result.coverageGlobal).toBeCloseTo(189.9, 0);
  });
});

describe("SAM integración — SF-12 EAS", () => {
  it("genera SampleQualityAssessment con instrumentId correcto", () => {
    const result = assessSF12Study(makeSF12Study(), ATARFE_ADULTS);
    expect(result.instrumentId).toBe("sf12-eas");
  });

  it("usa nValidPCS como nObserved (3047) — campo canónico primario", () => {
    const result = assessSF12Study(makeSF12Study(), ATARFE_ADULTS);
    expect(result.nObserved).toBe(3047);
  });

  it("calidad HIGH: n=3047 >> nTheoretical=375", () => {
    const result = assessSF12Study(makeSF12Study(), ATARFE_ADULTS);
    expect(result.sampleQuality).toBe("high");
  });
});

describe("SAM integración — Sueño EAS", () => {
  it("genera SampleQualityAssessment con instrumentId correcto", () => {
    const result = assessSuenoStudy(makeSuenoStudy(), ATARFE_ADULTS);
    expect(result.instrumentId).toBe("sueno-eas");
  });

  it("usa nValidP33R como nObserved (3004) — campo canónico primario", () => {
    const result = assessSuenoStudy(makeSuenoStudy(), ATARFE_ADULTS);
    expect(result.nObserved).toBe(3004);
  });

  it("calidad HIGH: n=3004 >> nTheoretical=375", () => {
    const result = assessSuenoStudy(makeSuenoStudy(), ATARFE_ADULTS);
    expect(result.sampleQuality).toBe("high");
  });
});

describe("SAM integración — CAGE-EAS", () => {
  it("genera SampleQualityAssessment con instrumentId correcto", () => {
    const result = assessCAGEStudy(makeCAGEStudy(), ATARFE_ADULTS);
    expect(result.instrumentId).toBe("cage-eas");
  });

  it("usa nValidCAGER como nObserved (2513) — campo canónico primario", () => {
    const result = assessCAGEStudy(makeCAGEStudy(), ATARFE_ADULTS);
    expect(result.nObserved).toBe(2513);
  });

  it("calidad HIGH: n=2513 >> nTheoretical=375", () => {
    const result = assessCAGEStudy(makeCAGEStudy(), ATARFE_ADULTS);
    expect(result.sampleQuality).toBe("high");
    expect(result.coverageGlobal).toBeCloseTo(670.1, 0);
  });
});

// ── 2. Integración IBSE — dos evaluaciones independientes ─────────────────────

describe("SAM integración — IBSE (dos evaluaciones independientes)", () => {
  it("IBSE 16+: instrumentId='ibse-16plus'", () => {
    const result = assessIBSEStudy16Plus(makeIBSEStudy(), ATARFE_ADULTS);
    expect(result.instrumentId).toBe("ibse-16plus");
  });

  it("IBSE full: instrumentId='ibse-full'", () => {
    const result = assessIBSEStudyFull(makeIBSEStudy(), ATARFE_SCHOOL);
    expect(result.instrumentId).toBe("ibse-full");
  });

  it("IBSE 16+: usa nValid=811 como nObserved", () => {
    const result = assessIBSEStudy16Plus(makeIBSEStudy(), ATARFE_ADULTS);
    expect(result.nObserved).toBe(811);
  });

  it("IBSE full: usa nValid=811 como nObserved", () => {
    const result = assessIBSEStudyFull(makeIBSEStudy(), ATARFE_SCHOOL);
    expect(result.nObserved).toBe(811);
  });

  it("IBSE 16+: referencia adultos N=15.472 → nTheoretical=375", () => {
    const result = assessIBSEStudy16Plus(makeIBSEStudy(), ATARFE_ADULTS);
    expect(result.nTheoretical).toBe(375);
    expect(result.populationReference.populationTotal).toBe(15_472);
  });

  it("IBSE full: referencia escolar N=2.847 → nTheoretical=339", () => {
    const result = assessIBSEStudyFull(makeIBSEStudy(), ATARFE_SCHOOL);
    expect(result.nTheoretical).toBe(339);
    expect(result.populationReference.populationTotal).toBe(2_847);
  });

  it("IBSE 16+: calidad HIGH → cobertura 216 %", () => {
    const result = assessIBSEStudy16Plus(makeIBSEStudy(), ATARFE_ADULTS);
    expect(result.sampleQuality).toBe("high");
    expect(result.coverageGlobal).toBeCloseTo(216.3, 0);
  });

  it("IBSE full: calidad HIGH → cobertura 239 %", () => {
    const result = assessIBSEStudyFull(makeIBSEStudy(), ATARFE_SCHOOL);
    expect(result.sampleQuality).toBe("high");
    expect(result.coverageGlobal).toBeCloseTo(239.2, 0);
  });

  it("las dos evaluaciones IBSE difieren únicamente en la referencia poblacional", () => {
    const study = makeIBSEStudy();
    const r16 = assessIBSEStudy16Plus(study, ATARFE_ADULTS);
    const rFull = assessIBSEStudyFull(study, ATARFE_SCHOOL);

    expect(r16.nObserved).toBe(rFull.nObserved);
    expect(r16.municipalityId).toBe(rFull.municipalityId);
    expect(r16.nTheoretical).not.toBe(rFull.nTheoretical);
    expect(r16.populationReference.populationTotal).not.toBe(
      rFull.populationReference.populationTotal
    );
  });

  it("las dos evaluaciones IBSE son objetos independientes (sin estado compartido)", () => {
    const study = makeIBSEStudy();
    const r16 = assessIBSEStudy16Plus(study, ATARFE_ADULTS);
    const rFull = assessIBSEStudyFull(study, ATARFE_SCHOOL);
    expect(r16).not.toBe(rFull);
    expect(r16.instrumentId).toBe("ibse-16plus");
    expect(rFull.instrumentId).toBe("ibse-full");
  });
});

// ── 3. Ausencia de modificación de cálculos existentes ───────────────────────

describe("SAM integración — no modifica algoritmos existentes", () => {
  it("assessDUKEStudy no muta el objeto DUKEStudy", () => {
    const study = makeDUKEStudy();
    const before = JSON.stringify(study.aggregates);
    assessDUKEStudy(study, ATARFE_ADULTS);
    expect(JSON.stringify(study.aggregates)).toBe(before);
  });

  it("assessPREDIMEDStudy no muta el objeto PREDIMEDStudy", () => {
    const study = makePREDIMEDStudy();
    const before = JSON.stringify(study.aggregates);
    assessPREDIMEDStudy(study, ATARFE_ADULTS);
    expect(JSON.stringify(study.aggregates)).toBe(before);
  });

  it("assessSF12Study no muta el objeto SF12Study", () => {
    const study = makeSF12Study();
    const before = JSON.stringify(study.aggregates);
    assessSF12Study(study, ATARFE_ADULTS);
    expect(JSON.stringify(study.aggregates)).toBe(before);
  });

  it("assessSuenoStudy no muta el objeto SuenoStudy", () => {
    const study = makeSuenoStudy();
    const before = JSON.stringify(study.aggregates);
    assessSuenoStudy(study, ATARFE_ADULTS);
    expect(JSON.stringify(study.aggregates)).toBe(before);
  });

  it("assessCAGEStudy no muta el objeto CAGEStudy", () => {
    const study = makeCAGEStudy();
    const before = JSON.stringify(study.aggregates);
    assessCAGEStudy(study, ATARFE_ADULTS);
    expect(JSON.stringify(study.aggregates)).toBe(before);
  });

  it("assessIBSEStudy16Plus no muta el objeto IBSEStudy", () => {
    const study = makeIBSEStudy();
    const before = JSON.stringify(study.aggregates);
    assessIBSEStudy16Plus(study, ATARFE_ADULTS);
    expect(JSON.stringify(study.aggregates)).toBe(before);
  });

  it("assessIBSEStudyFull no muta el objeto IBSEStudy", () => {
    const study = makeIBSEStudy();
    const before = JSON.stringify(study.aggregates);
    assessIBSEStudyFull(study, ATARFE_SCHOOL);
    expect(JSON.stringify(study.aggregates)).toBe(before);
  });
});

// ── 4. Ausencia de nuevos tipos de EvidenceAtom ───────────────────────────────

describe("SAM integración — no genera EvidenceAtom", () => {
  it("assessDUKEStudy devuelve SampleQualityAssessment, no EvidenceAtom", () => {
    const result = assessDUKEStudy(makeDUKEStudy(), ATARFE_ADULTS);
    expect(result).not.toHaveProperty("kind");
    expect(result).not.toHaveProperty("content");
    expect(result).not.toHaveProperty("provenance");
    expect(result).toHaveProperty("sampleQuality");
    expect(result).toHaveProperty("coverageGlobal");
  });

  it("assessIBSEStudy16Plus devuelve SampleQualityAssessment, no EvidenceAtom", () => {
    const result = assessIBSEStudy16Plus(makeIBSEStudy(), ATARFE_ADULTS);
    expect(result).not.toHaveProperty("kind");
    expect(result).toHaveProperty("nTheoretical");
    expect(result).toHaveProperty("requiresHumanValidation");
  });

  it("ninguna evaluación tiene kind='sample-quality' (no es EvidenceAtom)", () => {
    const studies = [
      assessDUKEStudy(makeDUKEStudy(), ATARFE_ADULTS),
      assessPREDIMEDStudy(makePREDIMEDStudy(), ATARFE_ADULTS),
      assessSF12Study(makeSF12Study(), ATARFE_ADULTS),
      assessSuenoStudy(makeSuenoStudy(), ATARFE_ADULTS),
      assessCAGEStudy(makeCAGEStudy(), ATARFE_ADULTS),
      assessIBSEStudy16Plus(makeIBSEStudy(), ATARFE_ADULTS),
      assessIBSEStudyFull(makeIBSEStudy(), ATARFE_SCHOOL),
    ];
    for (const s of studies) {
      expect(s).not.toHaveProperty("kind");
      expect(s).toHaveProperty("sampleQuality");
    }
  });
});

// ── 5. Estabilidad del comportamiento funcional ───────────────────────────────

describe("SAM integración — estabilidad funcional", () => {
  it("todos los instrumentos EAS producen SampleQualityAssessment válido", () => {
    const assessments = [
      assessDUKEStudy(makeDUKEStudy(), ATARFE_ADULTS),
      assessPREDIMEDStudy(makePREDIMEDStudy(), ATARFE_ADULTS),
      assessSF12Study(makeSF12Study(), ATARFE_ADULTS),
      assessSuenoStudy(makeSuenoStudy(), ATARFE_ADULTS),
      assessCAGEStudy(makeCAGEStudy(), ATARFE_ADULTS),
    ];
    for (const a of assessments) {
      expect(a.requiresHumanValidation).toBe(true);
      expect(a.sampleQuality).toBe("high");
      expect(a.coverageGlobal).toBeGreaterThan(100);
      expect(a.methodologicalCautions.length).toBeGreaterThan(0);
      expect(a.nTheoretical).toBe(375);
    }
  });

  it("IBSE genera exactamente 2 evaluaciones con la misma muestra observada", () => {
    const study = makeIBSEStudy();
    const r16 = assessIBSEStudy16Plus(study, ATARFE_ADULTS);
    const rFull = assessIBSEStudyFull(study, ATARFE_SCHOOL);
    expect(r16.nObserved).toBe(811);
    expect(rFull.nObserved).toBe(811);
    expect(r16.sampleQuality).toBe("high");
    expect(rFull.sampleQuality).toBe("high");
  });

  it("el motor SAM permanece único: todas las funciones delegan en computeSampleQualityAssessment", () => {
    // Verificación estructural: todas las funciones producen el mismo tipo de objeto
    const all = [
      assessDUKEStudy(makeDUKEStudy(), ATARFE_ADULTS),
      assessPREDIMEDStudy(makePREDIMEDStudy(), ATARFE_ADULTS),
      assessSF12Study(makeSF12Study(), ATARFE_ADULTS),
      assessSuenoStudy(makeSuenoStudy(), ATARFE_ADULTS),
      assessCAGEStudy(makeCAGEStudy(), ATARFE_ADULTS),
      assessIBSEStudy16Plus(makeIBSEStudy(), ATARFE_ADULTS),
      assessIBSEStudyFull(makeIBSEStudy(), ATARFE_SCHOOL),
    ];
    const requiredFields = [
      "instrumentId", "municipalityId", "nObserved", "nTheoretical",
      "coverageGlobal", "sampleQuality", "methodologicalCautions",
      "capabilities", "requiresHumanValidation", "computedAt",
    ];
    for (const a of all) {
      for (const field of requiredFields) {
        expect(a).toHaveProperty(field);
      }
    }
  });
});
