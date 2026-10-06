import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

function read(path: string): string {
  return readFileSync(path, "utf8");
}

describe("alcance real de la persistencia del expediente municipal", () => {
  it("el expediente completo se guarda en el navegador, no en Firebase", () => {
    const app = read("src/App.tsx");
    const indexedDb = read("src/infrastructure/persistence/indexed-db-workspace.ts");
    const relas = read("src/infrastructure/relas/RelasClient.ts");

    expect(app).toContain("saveWorkspaceToLocalStorage(workspace)");
    expect(app).toContain("saveWorkspaceToIndexedDB(workspace)");
    expect(indexedDb).toContain('const DB_NAME = "compas-ng-workspaces"');
    expect(indexedDb).toContain('const STORE_NAME = "workspaces"');

    expect(relas).toContain("'relas_scopes'");
    expect(relas).toContain("'drafts'");
    expect(relas).toContain("'reviews'");
    expect(relas).toContain("PlanPreparationDraft");
    expect(relas).toContain("PlanPreparationReview");
    expect(relas).not.toContain("MunicipalityWorkspace");
    expect(relas).not.toContain("saveWorkspace");
  });

  it("el contrato distingue expediente local, seeds canonicos y RELAS", () => {
    const contract = read("docs/contracts/CONTRACT-PERSISTENCE.md");
    const seedRegistry = read("src/infrastructure/seeds/municipalitySeeds.ts");

    expect(contract).toContain("Firebase/Firestore no guarda `MunicipalityWorkspace` completos");
    expect(contract).toContain("RELAS puede guardar borradores y revisiones de Plan de Acción");
    expect(contract).toContain("Granada-Zaidín, Atarfe y Alfacar reaparecen en instalaciones limpias");
    expect(contract).toContain("Churriana de la Vega, Zagra o ámbitos personalizados");

    expect(seedRegistry).toContain('"granada-zaidin"');
    expect(seedRegistry).toContain("compas-ng-workspace-granada-zaidin.json");
    expect(seedRegistry).toContain("compas-ng-workspace-alfacar.json");
    expect(seedRegistry).toContain("Alfacar");
    expect(seedRegistry).toContain("Churriana de la Vega y Zagra");
    expect(seedRegistry).toContain("NO tienen");
  });
});
