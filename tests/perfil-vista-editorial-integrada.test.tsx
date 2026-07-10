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

function normalized(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function overviewById(id: string) {
  const message = editorialView.overview.find((item) => item.id === id);
  if (message === undefined) {
    throw new Error(`No existe el mensaje de overview ${id}`);
  }
  return message;
}

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
    html.indexOf('id="psl-resumen"')
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

  it("alinea Vida cotidiana con sueño e inactividad, no con señales sanitarias del Informe", () => {
    const vida = overviewById("vida-cotidiana");
    const signal = normalized(vida.signal);
    const source = normalized(vida.source);

    expect(signal).not.toContain("prevencion y vacunacion");
    expect(source).not.toContain("informe de salud");
    expect(signal).toMatch(/sueno|inactividad/);
    expect(source).toMatch(/sueno|ipaq|eas/);
  });

  it("alinea Apoyo y envejecimiento con DUKE, soledad y capacidad comunitaria", () => {
    const apoyo = overviewById("apoyo-envejecimiento");
    const signal = normalized(apoyo.signal);
    const source = normalized(apoyo.source);

    expect(signal).not.toContain("enfermedades cronicas");
    expect(signal).toMatch(/apoyo social|envejecimiento|soledad|recursos comunitarios/);
    expect(source).toMatch(/duke|localiza salud/);
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

describe("render — vista editorial integrada canónica", () => {
  it("es la lectura canónica: retira la síntesis autónoma y el desarrollo capitular", () => {
    expect(html).toContain("Vista editorial integrada");
    expect(html).toContain("Propuesta de composición del Perfil de Salud Local");
    // La resolución editorial retira la sección autónoma «Salud en síntesis»
    // y el desarrollo capitular largo de la experiencia principal.
    expect(html).not.toContain("Salud en síntesis");
    expect(html).not.toContain("I · Alcance y fuentes");
    // La composición canónica precede al anexo técnico de trazabilidad.
    expect(html.indexOf("Vista editorial integrada")).toBeLessThan(
      html.indexOf("Trazabilidad técnica del diagnóstico")
    );
  });

  it("concentra las piezas centrales en una sola composición, sin duplicarlas", () => {
    expect(html).toContain("Indicadores trazadores: valores y referencias");
    expect(html).toContain("Qué debe discutir el Grupo Motor");
    // Cada pieza aparece una sola vez: no hay dos composiciones compitiendo.
    expect(
      html.match(/Indicadores trazadores: valores y referencias/g)
    ).toHaveLength(1);
    expect(html.match(/Qué debe discutir el Grupo Motor/g)).toHaveLength(1);
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

describe("separación lectura canónica / espacio técnico", () => {
  it("el espacio técnico existe y está separado de la lectura canónica", () => {
    expect(html).toContain("Espacio técnico del Perfil");
  });

  it("la vista editorial integrada precede al espacio técnico", () => {
    const editorialPos = html.indexOf("Vista editorial integrada");
    const technicalPos = html.indexOf("Espacio técnico del Perfil");
    expect(editorialPos).toBeGreaterThan(-1);
    expect(technicalPos).toBeGreaterThan(-1);
    expect(editorialPos).toBeLessThan(technicalPos);
  });

  it("Resumen y PSL-C quedan dentro del espacio técnico, no antes", () => {
    const technicalPos = html.indexOf("Espacio técnico del Perfil");
    // ">Resumen<" porque la cadena aparece como texto de span, no como id
    const resumenPos = html.indexOf(">Resumen<");
    expect(technicalPos).toBeGreaterThan(-1);
    expect(resumenPos).toBeGreaterThan(-1);
    expect(resumenPos).toBeGreaterThan(technicalPos);
  });

  it("los bloques técnicos no aparecen antes de la vista editorial integrada", () => {
    const editorialPos = html.indexOf("Vista editorial integrada");
    // La ruta operativa y el espacio de trabajo no deben preceder a la lectura canónica
    const compilacionPos = html.indexOf("Crear documento institucional PSL-C");
    const espacioPos = html.indexOf("Espacio de trabajo del equipo técnico");
    // Si aparecen, deben ser después de la vista editorial
    if (compilacionPos >= 0) expect(compilacionPos).toBeGreaterThan(editorialPos);
    if (espacioPos >= 0) expect(espacioPos).toBeGreaterThan(editorialPos);
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
