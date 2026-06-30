/**
 * nhs-institutional-quality.test.ts
 *
 * Principio arquitectónico: "Ningún artefacto institucional puede exponer
 * detalles internos de implementación."
 *
 * Este test opera en dos niveles:
 *   1. Módulo metodológico — verifica que referenceValues.population y .source
 *      sean etiquetas institucionales, no notas técnicas de desarrollo.
 *   2. Artefacto compilado — verifica que ningún NHSReference.population ni
 *      .source del artefacto institucional contenga rutas, ficheros o marcadores
 *      de implementación, independientemente de su origen.
 *
 * CONTRACT: NHSReference.population y .source son campos institucionales visibles
 * en el artefacto PSL-NHS. Nunca deben contener paths, fixtures, scripts ni
 * cualquier detalle interno de implementación.
 */

import { describe, it, expect } from "vitest";
import { DUKE_EAS_MODULE }     from "../src/domain/methodology/definitions/duke-eas";
import { PREDIMED_EAS_MODULE } from "../src/domain/methodology/definitions/predimed-eas";
import { SF12_EAS_MODULE }     from "../src/domain/methodology/definitions/sf12-eas";
import { compileNHSHealthProfile } from "../src/application/nhs-health-profile-compiler";
import type { LocalHealthProfile } from "../src/domain/health-profile";
import type { MunicipalityWorkspace } from "../src/domain/workspace";
import type { NHSReference } from "../src/domain/nhs-health-profile";

// ── Patrones prohibidos en campos institucionales ─────────────────────────────
// Lista canónica: cualquier nueva entrada requiere actualizar también los módulos.

const FORBIDDEN_IN_INSTITUTIONAL_FIELDS = [
  "fixture",
  "fixtures/",
  "script",
  "scripts/",
  ".csv",
  ".mjs",
] as const;

function firstForbiddenMatch(text: string): string | null {
  const lower = text.toLowerCase();
  for (const forbidden of FORBIDDEN_IN_INSTITUTIONAL_FIELDS) {
    if (lower.includes(forbidden)) return forbidden;
  }
  return null;
}

function assertCleanReference(ref: NHSReference, context: string): void {
  const popHit = firstForbiddenMatch(ref.population);
  expect(
    popHit,
    `[${context}] population contiene "${popHit}": "${ref.population}"`
  ).toBeNull();

  const srcHit = firstForbiddenMatch(ref.source);
  expect(
    srcHit,
    `[${context}] source contiene "${srcHit}": "${ref.source}"`
  ).toBeNull();
}

// ── Fixtures de prueba (mínimos, sin dependencias externas) ──────────────────

function basePSL(extras: Partial<LocalHealthProfile> = {}): LocalHealthProfile {
  return {
    id: "psl-quality-test",
    municipalityId: "test",
    status: "validated",
    version: "2026-06-30T00:00:00.000Z",
    evidenceStoreVersion: "2026-06-30T00:00:00.000Z",
    strategicFrameworkSectionIds: [],
    healthReportSectionCount: 0,
    healthReportAtomCount: 0,
    totalEvidenceAtoms: 5,
    integrityErrors: 0,
    integrityWarnings: 0,
    atomsByOrigin: {},
    atomsByKind: {},
    evidenceAtomIds: [],
    originsSummary: [],
    ibsePresent: false,
    dukePresent: false,
    predimedPresent: false,
    sf12Present: false,
    suenoPresent: false,
    cagePresent: false,
    thematicPrioritisationPresent: false,
    complementaryStudyCount: 1,
    territorialSummary: "",
    determinantCount: 0,
    assetCount: 0,
    indicatorCount: 0,
    qualitativeFindingCount: 0,
    methodologicalCautionCount: 0,
    preliminaryOpportunities: [],
    longitudinalActive: false,
    longitudinalNote: "",
    longitudinalEvidenceCount: 0,
    marcosAplicados: [],
    tensionesEstructurales: [],
    conflictos: [],
    tensionesEscaladas: [],
    tensionesNoEscaladas: [],
    ruidoEstructural: [],
    areasDeIntervencion: [],
    conclusiones: { content: "Conclusiones.", status: "authored", authorshipNote: "" },
    cierreInterpretativo: { content: "Cierre.", status: "authored", authorshipNote: "" },
    priorizacion: {
      candidaturasTecnicas: [],
      hasTechnicalCandidatures: false,
      tematicasSeleccionadasIds: [],
      tematicasSeleccionadasLabels: [],
      hasParticipatorySelection: false,
      deliberacionNota: "pendiente",
      consensoDocumentado: false,
    },
    priorizacionStatus: "scaffold",
    generatedAt: "2026-06-30T00:00:00.000Z",
    validatedAt: "2026-06-30T00:00:00.000Z",
    validatedBy: "Técnica de salud pública",
    requiresHumanValidation: true,
    ...extras,
  };
}

function baseWorkspace(): MunicipalityWorkspace {
  return {
    municipality: {
      identity: { id: "test", name: "Municipio de Prueba", province: "Granada" },
      metadata: { createdAt: "2026-06-30T00:00:00.000Z", updatedAt: "2026-06-30T00:00:00.000Z" },
    },
    repository: { documents: [], municipalityId: "test" },
    evidenceStore: { atoms: [], municipalityId: "test", updatedAt: "2026-06-30T00:00:00.000Z" },
  };
}

const DUKE_AGG = {
  n: 120, nValidGlobal: 112, nValidConfidential: 112, nValidAffective: 112,
  meanGlobal: 47.3, meanConfidential: 28.1, meanAffective: 19.2,
  lowGlobalCount: 30, lowConfidentialCount: 28, lowAffectiveCount: 25,
  normalGlobalCount: 82, normalConfidentialCount: 84, normalAffectiveCount: 87,
  incompleteGlobalCount: 8, incompleteConfidentialCount: 8, incompleteAffectiveCount: 8,
  lowGlobalPercentage: 26.8, lowConfidentialPercentage: 25.0, lowAffectivePercentage: 22.3,
};

const PREDIMED_AGG = {
  n: 200, nValid: 190,
  meanScore: 8.1,
  lowCount: 50, mediumCount: 60, highCount: 80,
  lowPercentage: 26.3, mediumPercentage: 31.6, highPercentage: 42.1,
  incompleteCount: 10,
};

const SF12_AGG = {
  n: 200, nValidPCS: 195, nValidMCS: 195,
  meanPCS: 48.5, meanMCS: 44.2,
  missingPCS: 5, missingMCS: 5,
};

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("Principio arquitectónico: ningún artefacto institucional expone contenido técnico interno", () => {

  // ── Nivel módulo metodológico ────────────────────────────────────────────────

  describe("Módulos metodológicos — referenceValues.population", () => {
    it("DUKE: population es etiqueta institucional limpia", () => {
      const rv = DUKE_EAS_MODULE.interpretation.referenceValues!;
      const hit = firstForbiddenMatch(rv.population);
      expect(hit, `population contiene "${hit}": "${rv.population}"`).toBeNull();
    });

    it("DUKE: source es referencia institucional limpia", () => {
      const rv = DUKE_EAS_MODULE.interpretation.referenceValues!;
      const hit = firstForbiddenMatch(rv.source);
      expect(hit, `source contiene "${hit}": "${rv.source}"`).toBeNull();
    });

    it("PREDIMED: population es etiqueta institucional limpia", () => {
      const rv = PREDIMED_EAS_MODULE.interpretation.referenceValues!;
      const hit = firstForbiddenMatch(rv.population);
      expect(hit, `population contiene "${hit}": "${rv.population}"`).toBeNull();
    });

    it("PREDIMED: source es referencia institucional limpia", () => {
      const rv = PREDIMED_EAS_MODULE.interpretation.referenceValues!;
      const hit = firstForbiddenMatch(rv.source);
      expect(hit, `source contiene "${hit}": "${rv.source}"`).toBeNull();
    });

    it("SF-12: population es etiqueta institucional limpia", () => {
      const rv = SF12_EAS_MODULE.interpretation.referenceValues!;
      const hit = firstForbiddenMatch(rv.population);
      expect(hit, `population contiene "${hit}": "${rv.population}"`).toBeNull();
    });

    it("SF-12: source es referencia institucional limpia", () => {
      const rv = SF12_EAS_MODULE.interpretation.referenceValues!;
      const hit = firstForbiddenMatch(rv.source);
      expect(hit, `source contiene "${hit}": "${rv.source}"`).toBeNull();
    });
  });

  // ── Nivel artefacto compilado ────────────────────────────────────────────────

  describe("NHSHealthProfileArtifact — NHSReference.population y .source en artefacto compilado", () => {
    it("DUKE: reference.population y .source en artefacto sin contenido técnico", () => {
      const result = compileNHSHealthProfile({
        psl: basePSL({ dukePresent: true, complementaryStudyCount: 1 }),
        workspace: {
          ...baseWorkspace(),
          dukeStudy: {
            id: "d1", municipalityId: "test", sourceFileName: "duke.csv",
            aggregates: DUKE_AGG, methodologicalCautions: [], warnings: [],
            createdAt: "", updatedAt: "",
          },
        },
        municipalityName: "Test", municipalityProvince: "Granada",
        existingArtifactCount: 0,
      });
      expect(result.ok).toBe(true);
      if (result.ok) {
        const row = result.artifact.dominios
          .flatMap((d) => d.indicators)
          .find((r) => r.instrumentId === "duke-eas")!;
        expect(row.reference).not.toBeNull();
        assertCleanReference(row.reference!, "DUKE artefacto");
      }
    });

    it("PREDIMED: reference.population y .source en artefacto sin contenido técnico", () => {
      const result = compileNHSHealthProfile({
        psl: basePSL({ predimedPresent: true, complementaryStudyCount: 1 }),
        workspace: {
          ...baseWorkspace(),
          predimedStudy: {
            id: "p1", municipalityId: "test", sourceFileName: "predimed.csv",
            aggregates: PREDIMED_AGG, methodologicalCautions: [],
            createdAt: "", updatedAt: "",
          },
        },
        municipalityName: "Test", municipalityProvince: "Granada",
        existingArtifactCount: 0,
      });
      expect(result.ok).toBe(true);
      if (result.ok) {
        const row = result.artifact.dominios
          .flatMap((d) => d.indicators)
          .find((r) => r.instrumentId === "predimed-eas")!;
        expect(row.reference).not.toBeNull();
        assertCleanReference(row.reference!, "PREDIMED artefacto");
      }
    });

    it("SF-12 PCS: reference.population y .source en artefacto sin contenido técnico", () => {
      const result = compileNHSHealthProfile({
        psl: basePSL({ sf12Present: true, complementaryStudyCount: 1 }),
        workspace: {
          ...baseWorkspace(),
          sf12Study: {
            id: "s1", municipalityId: "test", sourceFileName: "sf12.csv",
            aggregates: SF12_AGG, createdAt: "", updatedAt: "",
          },
        },
        municipalityName: "Test", municipalityProvince: "Granada",
        existingArtifactCount: 0,
      });
      expect(result.ok).toBe(true);
      if (result.ok) {
        const saludDom = result.artifact.dominios.find((d) => d.id === "salud-percibida")!;
        expect(saludDom).toBeDefined();
        for (const row of saludDom.indicators) {
          expect(row.reference).not.toBeNull();
          assertCleanReference(row.reference!, `SF-12 ${row.label}`);
        }
      }
    });

    it("artefacto completo (DUKE + PREDIMED + SF-12): ningún NHSReference contiene contenido técnico", () => {
      const result = compileNHSHealthProfile({
        psl: basePSL({
          dukePresent: true, predimedPresent: true, sf12Present: true,
          complementaryStudyCount: 3,
        }),
        workspace: {
          ...baseWorkspace(),
          dukeStudy: {
            id: "d1", municipalityId: "test", sourceFileName: "duke.csv",
            aggregates: DUKE_AGG, methodologicalCautions: [], warnings: [],
            createdAt: "", updatedAt: "",
          },
          predimedStudy: {
            id: "p1", municipalityId: "test", sourceFileName: "predimed.csv",
            aggregates: PREDIMED_AGG, methodologicalCautions: [],
            createdAt: "", updatedAt: "",
          },
          sf12Study: {
            id: "s1", municipalityId: "test", sourceFileName: "sf12.csv",
            aggregates: SF12_AGG, createdAt: "", updatedAt: "",
          },
        },
        municipalityName: "Test", municipalityProvince: "Granada",
        existingArtifactCount: 0,
      });
      expect(result.ok).toBe(true);
      if (result.ok) {
        const allRefs = result.artifact.dominios
          .flatMap((d) => d.indicators)
          .filter((r) => r.reference !== null)
          .map((r) => r.reference!);

        // Debe haber exactamente 4 referencias: DUKE, PREDIMED, PCS, MCS
        expect(allRefs).toHaveLength(4);

        for (const ref of allRefs) {
          assertCleanReference(ref, `ref(${ref.population})`);
        }
      }
    });
  });
});
