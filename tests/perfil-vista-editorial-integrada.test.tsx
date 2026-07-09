/**
 * Vista editorial integrada del Perfil de Salud Local.
 *
 * Verifica que el prototipo editorial se construye desde capas puras ya
 * existentes, aparece antes de la lectura vigente "Salud en síntesis" y no
 * reintroduce lenguaje de decisión, objetivos o actuación.
 */

import { describe, it, expect, beforeAll } from "vitest";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { renderToStaticMarkup } from "react-dom/server";
import App from "../src/App";
import { loadWorkspaceFromLocalStorage } from "../src/infrastructure/persistence/local-storage";
import { createMunicipalityRuntime } from "../src/application/runtime";
import {
  buildDiagnosticAnswers,
  buildProfileIntegratedEditorialView,
} from "../src/application/health-profile";
import type {
  DiagnosticAnswers,
  ProfileIntegratedEditorialView,
} from "../src/application/health-profile";
import { LocalHealthProfileView } from "../src/ui/components/LocalHealthProfileView";
import type { MunicipalityWorkspace } from "../src/domain/workspace";
import type { LocalHealthProfile } from "../src/domain/health-profile";

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
  "../municipalities/granada-zaidin/exports/compas-ng-workspace-granada-zaidin.json"
);

const FORBIDDEN_EDITORIAL_RE =
  /se recomienda|recomendamos|debe implantarse|programa de|objetivo estrat[ée]gico|actuaciones previstas|plan de acci[óo]n|resulta relevante|se pone de manifiesto|desde una perspectiva integral/i;

let ws: MunicipalityWorkspace;
let psl: LocalHealthProfile;
let answers: DiagnosticAnswers;
let editorialView: ProfileIntegratedEditorialView;
let html: string;
let proposalHtml: string;

beforeAll(() => {
  store.set(
    "compas-ng:workspace:granada-zaidin",
    readFileSync(EXPORT_PATH, "utf8")
  );
  const loaded = loadWorkspaceFromLocalStorage("granada-zaidin");
  if (loaded === null) throw new Error("El export vigente no rehidrata");
  ws = loaded;
  psl = createMunicipalityRuntime({ workspace: ws }).psl;
  answers = buildDiagnosticAnswers({
    workspace: ws,
    determinantTitles: [],
    assets: ws.evidenceStore.atoms
      .filter((a) => a.kind === "asset")
      .map((a) => ({ title: a.title, content: a.content })),
  });
  editorialView = buildProfileIntegratedEditorialView(answers, {
    territory: ws.municipality.identity.name,
    status: "Documento de trabajo",
    informeTitulo: "Informe de salud de El Zaidín",
    generatedDate: "1 de enero de 2027",
  });
  html = renderToStaticMarkup(
    <LocalHealthProfileView
      psl={psl}
      pslIsStale={false}
      municipalityName={ws.municipality.identity.name}
      diagnosticAnswers={answers}
      onValidate={() => {}}
      onInvalidate={() => {}}
    />
  );
  proposalHtml = html.slice(
    html.indexOf("Vista editorial integrada"),
    html.indexOf("Salud en síntesis")
  );
}, 60000);

describe("navegación principal visible", () => {
  it("retira el ítem principal de Perfil Ejecutivo y mantiene el flujo hasta Perfil de Salud Local", () => {
    const appHtml = renderToStaticMarkup(<App />);
    const navStart = appHtml.indexOf("<nav");
    const navEnd = appHtml.indexOf("</nav>", navStart);
    const navHtml = appHtml.slice(navStart, navEnd);

    expect(navHtml).toContain("Inicio");
    expect(navHtml).toContain("Diagnóstico territorial");
    expect(navHtml).toContain("Perfil de Salud Local");
    expect(navHtml).not.toContain("Perfil Ejecutivo de Salud Local");
  });
});

describe("modelo puro — Vista editorial integrada", () => {
  it("devuelve la estructura editorial completa", () => {
    expect(editorialView.header.territory).toBe("Granada-Zaidín");
    expect(editorialView.header.title).toBe("Vista editorial integrada");
    expect(editorialView.overview).toHaveLength(3);
    expect(editorialView.sourceBlocks).toHaveLength(3);
    expect(editorialView.territorialReadings).toHaveLength(5);
    expect(editorialView.tracerTable.length).toBeGreaterThan(0);
    expect(editorialView.groupMotorAgenda.length).toBeGreaterThan(0);
    expect(editorialView.closing).toHaveLength(3);
    expect(editorialView.technicalAnnex.matrix.filas.length).toBeGreaterThan(0);
  });

  it("cada lectura integrada incluye señal, fuente, escala, mecanismo, exclusión y pregunta", () => {
    for (const block of editorialView.territorialReadings) {
      expect(block.signal.length).toBeGreaterThan(3);
      expect(block.source.length).toBeGreaterThan(3);
      expect(block.scale.length).toBeGreaterThan(3);
      expect(block.mechanism.length).toBeGreaterThan(10);
      expect(block.exclusion.length).toBeGreaterThan(10);
      expect(block.groupMotorQuestion).toMatch(/^¿.+\?$/);
      const words = block.reading.trim().split(/\s+/).length;
      expect(words).toBeGreaterThanOrEqual(60);
      expect(words).toBeLessThanOrEqual(150);
    }
  });

  it("no formula recomendaciones, objetivos ni actuaciones", () => {
    expect(JSON.stringify(editorialView)).not.toMatch(FORBIDDEN_EDITORIAL_RE);
  });
});

describe("render — propuesta editorial integrada", () => {
  it("aparece antes de Salud en síntesis y antes del desarrollo capitular", () => {
    expect(html).toContain("Vista editorial integrada");
    expect(html).toContain("Propuesta de composición del Perfil de Salud Local");
    expect(html).toContain("Salud en síntesis");
    expect(html).toContain("I · Alcance y fuentes");

    expect(html.indexOf("Vista editorial integrada")).toBeLessThan(
      html.indexOf("Salud en síntesis")
    );
    expect(html.indexOf("Vista editorial integrada")).toBeLessThan(
      html.indexOf("I · Alcance y fuentes")
    );
  });

  it("mantiene la sección vigente y sus piezas centrales", () => {
    expect(html).toContain("Salud en síntesis");
    expect(html).toContain("Indicadores trazadores: valores y referencias");
    expect(html).toContain("Qué debe discutir el Grupo Motor");
  });

  it("subordina la lectura ampliada y el anexo técnico en details", () => {
    expect(proposalHtml).toContain("<details");
    expect(proposalHtml).toContain("Lectura territorial ampliada y anexo técnico");
    expect(proposalHtml.indexOf("Cierre interpretativo")).toBeLessThan(
      proposalHtml.indexOf("<details")
    );
  });

  it("el fragmento editorial no usa lenguaje de decisión ni fórmulas de plantilla", () => {
    expect(proposalHtml).not.toMatch(FORBIDDEN_EDITORIAL_RE);
  });
});

describe("CSS pie-* — paleta COMPÁS", () => {
  const css = readFileSync(
    resolve(dirname(fileURLToPath(import.meta.url)), "../src/App.css"),
    "utf8"
  );
  const sinComentarios = css.replace(/\/\*[\s\S]*?\*\//g, "");
  const reglasPie = [...sinComentarios.matchAll(/([^{}]+)\{([^{}]*)\}/g)]
    .filter(([, selector]) => selector.includes(".pie-"))
    .map(([, selector, cuerpo]) => selector.trim() + " { " + cuerpo.trim() + " }");

  it("existen reglas pie-* y no usan colores heredados prohibidos", () => {
    expect(reglasPie.length).toBeGreaterThanOrEqual(20);
    const bloque = reglasPie.join("\n").toLowerCase();
    for (const prohibido of [
      "#1d4ed8",
      "#cbd5e1",
      "#475569",
      "#33404e",
      "#94a3b8",
      "#b45309",
      "#15803d",
      "#7e22ce",
      "#ff6600",
    ]) {
      expect(bloque).not.toContain(prohibido);
    }
  });

  it("usa los tokens COMPÁS básicos", () => {
    const bloque = reglasPie.join("\n").toLowerCase();
    for (const token of ["#0074c8", "#e2e8f0", "#1e293b", "#64748b", "#ffffff"]) {
      expect(bloque).toContain(token);
    }
  });
});

describe("línea vigente", () => {
  it("el expediente 56/92 permanece intacto", () => {
    expect(ws.repository.documents.length).toBe(20);
    expect(ws.evidenceStore.atoms.length).toBe(92);
    expect(
      ws.evidenceStore.atoms.filter(
        (a) => a.provenance.origin === "localiza-salud"
      ).length
    ).toBe(56);
  });
});
