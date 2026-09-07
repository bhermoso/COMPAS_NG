import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { MunicipalityWorkspace } from "../src/domain/workspace";
import {
  removeNonObservedZaidinStudies,
  ZAIDIN_NON_OBSERVED_STUDIES_REMOVAL_MARKER,
} from "../src/application/workspace";

const seed = JSON.parse(readFileSync(
  resolve(process.cwd(), "public/seeds/compas-ng-workspace-granada-zaidin.json"),
  "utf8"
)) as MunicipalityWorkspace;

const studyKeys = [
  "ibseStudy", "dukeStudy", "predimedStudy", "sf12Study", "suenoStudy",
  "cageStudy", "auditcStudy", "ipaqStudy", "ghq12Study", "phq9Study",
  "psqiStudy", "fagerstromStudy", "sbqStudy",
] as const;

describe("Granada-Zaidín — ningún resultado sin aplicación observada", () => {
  it("el seed conserva las fuentes reales y no publica resultados de fixtures", () => {
    expect(seed.repository.documents).toHaveLength(7);
    expect(seed.evidenceStore.atoms).toHaveLength(56);
    expect(seed.evidenceStore.atoms.every((atom) => atom.kind === "asset")).toBe(true);
    for (const key of studyKeys) expect(seed[key], key).toBeUndefined();
    expect(seed.appliedSeedMigrations).toContain(ZAIDIN_NON_OBSERVED_STUDIES_REMOVAL_MARKER);
  });

  it("limpia un expediente antiguo, invalida derivados y conserva trabajo ciudadano", () => {
    const legacy = {
      ...seed,
      appliedSeedMigrations: [],
      repository: {
        ...seed.repository,
        documents: [...seed.repository.documents, {
          id: "doc-ghq12",
          kind: "redcap-export" as const,
          title: "GHQ-12 — fixture",
          source: { system: "fixture" },
          tags: ["ghq12"],
        }],
      },
      evidenceStore: {
        ...seed.evidenceStore,
        atoms: [...seed.evidenceStore.atoms, {
          id: "fake-ghq12",
          municipalityId: "granada-zaidin",
          kind: "indicator" as const,
          title: "Resultado sintético",
          content: "26,3 %",
          observedAt: "2026-07-02",
          provenance: { origin: "complementary-study" as const, documentId: "doc-ghq12" },
          tags: ["ghq12"],
        }],
      },
      ghq12Study: { sourceFileName: "ghq12-municipal.csv" } as MunicipalityWorkspace["ghq12Study"],
      thematicPrioritisation: {
        municipalityId: "granada-zaidin",
        selectedTopicIds: ["bienestar-emocional"],
        updatedAt: "2026-09-01T00:00:00.000Z",
      },
      compiledProfiles: [{}] as MunicipalityWorkspace["compiledProfiles"],
    } satisfies MunicipalityWorkspace;

    const cleaned = removeNonObservedZaidinStudies(legacy);
    expect(cleaned.repository.documents.some((doc) => doc.id === "doc-ghq12")).toBe(false);
    expect(cleaned.evidenceStore.atoms.some((atom) => atom.id === "fake-ghq12")).toBe(false);
    expect(cleaned.ghq12Study).toBeUndefined();
    expect(cleaned.compiledProfiles).toBeUndefined();
    expect(cleaned.thematicPrioritisation).toEqual(legacy.thematicPrioritisation);
    expect(removeNonObservedZaidinStudies(cleaned)).toBe(cleaned);
  });
});
