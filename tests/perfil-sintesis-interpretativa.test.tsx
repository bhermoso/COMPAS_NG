import { describe, it, expect, beforeAll } from "vitest";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { renderToStaticMarkup } from "react-dom/server";
import {
  buildDiagnosticAnswers,
  buildProfileIntegratedEditorialView,
  checkProfileWritingContract,
} from "../src/application/health-profile";
import type { ProfileIntegratedEditorialView } from "../src/application/health-profile";
import { loadWorkspaceFromLocalStorage } from "../src/infrastructure/persistence/local-storage";
import { ProfileIntegratedEditorialPreview } from "../src/ui/components/ProfileIntegratedEditorialPreview";

const store = new Map<string, string>();
(globalThis as { localStorage?: unknown }).localStorage = {
  getItem: (k: string) => store.get(k) ?? null,
  setItem: (k: string, v: string) => {
    store.set(k, v);
  },
  removeItem: (k: string) => {
    store.delete(k);
  },
  clear: () => store.clear(),
  key: (i: number) => [...store.keys()][i] ?? null,
  get length() {
    return store.size;
  },
};

const EXPORT_PATH = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../fixtures/workspaces/granada-zaidin-synthetic-test.json"
);

const FORBIDDEN_EDITORIAL_RE =
  /se recomienda|recomendamos|debe implantarse|programa de|objetivo estrat[ée]gico|actuaciones previstas|plan de acci[óo]n|resulta relevante|se pone de manifiesto|desde una perspectiva integral/i;

let view: ProfileIntegratedEditorialView;

beforeAll(() => {
  store.set(
    "compas-ng:workspace:granada-zaidin",
    readFileSync(EXPORT_PATH, "utf8")
  );
  const ws = loadWorkspaceFromLocalStorage("granada-zaidin");
  if (ws === null) throw new Error("El export vigente no rehidrata");
  const answers = buildDiagnosticAnswers({
    workspace: ws,
    determinantTitles: [],
    assets: ws.evidenceStore.atoms
      .filter((a) => a.kind === "asset")
      .map((a) => ({ title: a.title, content: a.content })),
  });
  view = buildProfileIntegratedEditorialView(answers, {
    territory: ws.municipality.identity.name,
    status: "Documento de trabajo",
    informeTitulo: "Informe de salud de El Zaidín",
    generatedDate: "1 de enero de 2027",
  });
});

describe("síntesis interpretativa del Perfil", () => {
  it("convierte los hilos integrados en una tesis trazable, no en recuento de términos", () => {
    const synthesis = view.diagnosticSynthesis;
    expect(synthesis.title).toBe("Síntesis interpretativa del Perfil");
    expect(synthesis.thesis).toContain("no se limita a contar menciones");
    expect(synthesis.traceability.unitIds).toEqual(
      view.interpretation.units.map((unit) => unit.id)
    );
    expect(synthesis.traceability.localSignalIds.length).toBeGreaterThan(0);
    expect(synthesis.contrastQuestions.length).toBeGreaterThan(0);
    expect(checkProfileWritingContract(JSON.stringify(synthesis))).toEqual([]);
    expect(JSON.stringify(synthesis)).not.toMatch(FORBIDDEN_EDITORIAL_RE);
  });

  it("se renderiza entre la lectura territorial y el soporte tabular", () => {
    const html = renderToStaticMarkup(
      <ProfileIntegratedEditorialPreview view={view} />
    );
    expect(html).toContain("Síntesis interpretativa del Perfil");
    expect(html).toContain("no se limita a contar menciones");
    expect(html.indexOf("Lectura integrada del territorio")).toBeLessThan(
      html.indexOf("Síntesis interpretativa del Perfil")
    );
    expect(html.indexOf("Síntesis interpretativa del Perfil")).toBeLessThan(
      html.indexOf("Indicadores trazadores: valores y referencias")
    );
  });
});
