/**
 * Vista editorial integrada del Perfil de Salud Local.
 *
 * Verifica que la lectura canónica se construye desde capas puras ya
 * existentes, aparece antes del espacio técnico del Perfil y no reintroduce
 * lenguaje de decisión, objetivos o actuación.
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

function readingById(id: string) {
  const block = editorialView.territorialReadings.find((item) => item.id === id);
  if (block === undefined) {
    throw new Error(`No existe el bloque territorial ${id}`);
  }
  return block;
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
    html.indexOf("Lectura territorial del diagnóstico"),
    html.indexOf("Espacio técnico del Perfil")
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
    expect(editorialView.header.title).toBe("Perfil de Salud Local");
    expect(editorialView.header.subtitle).toBe("Lectura territorial del diagnóstico");
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
      expect(words, block.id).toBeLessThanOrEqual(150);
    }
  });

  it("retira la plantilla metodológica repetida de los bloques integrados", () => {
    const serialized = JSON.stringify(editorialView.territorialReadings);
    for (const oldPattern of [
      "La señal disponible es",
      "Su valor declarado es",
      "La escala real es",
      "El mecanismo a contrastar es",
      "La principal zona ciega es",
    ]) {
      expect(serialized).not.toContain(oldPattern);
      expect(html).not.toContain(oldPattern);
    }
  });

  it("usa sueño insuficiente como lectura de vida cotidiana, no como presencia textual", () => {
    const block = readingById("sueno-malestar-vida-cotidiana");
    const text = normalized(block.reading);

    expect(block.reading).toContain("32.8 %");
    expect(text).toContain("descanso");
    expect(text).toContain("vida diaria");
    expect(text).toMatch(/turnos|cuidados nocturnos|vivienda|ruido|tiempo/);
    expect(text).toMatch(/contexto|referencia|no como estimacion/);
    expect(text).not.toContain("presencia textual");
  });

  it("usa actividad física como lectura de entorno y no hereda la zona ciega del sueño", () => {
    const block = readingById("actividad-sedentarismo-entorno");
    const text = normalized(block.reading + " " + block.exclusion);

    expect(block.reading).toContain("34.2 %");
    expect(text).toContain("espacio publico");
    expect(text).toMatch(/seguridad|accesibilidad|autonomia/);
    expect(text).toMatch(/contexto|referencia|no como medicion/);
    expect(text).not.toContain("cuida de noche");
    expect(text).not.toContain("turnos");
    expect(text).not.toContain("vivienda sin descanso");
  });

  it("lee DUKE, soledad y envejecimiento como tensión territorial abierta", () => {
    const block = readingById("apoyo-social-soledad-envejecimiento");
    const text = normalized(block.reading);

    expect(block.reading).toContain("49.2/55");
    expect(text).toContain("tension territorial");
    expect(text).toContain("soledad");
    expect(text).toContain("envejecimiento");
    expect(text).toContain("capacidad comunitaria");
    expect(text).toContain("personas mayores");
  });

  it("presenta activos como capacidad potencial y desigualdad como incertidumbre central", () => {
    const serialized = normalized(JSON.stringify(editorialView));

    expect(serialized).toContain("capacidad potencial");
    expect(serialized).toContain("no cobertura ni resultado");
    expect(serialized).toContain("incertidumbre de equidad");
    expect(serialized).toContain("no estan desagregados");
  });

  it("no formula recomendaciones, objetivos ni actuaciones", () => {
    expect(JSON.stringify(editorialView)).not.toMatch(FORBIDDEN_EDITORIAL_RE);
  });
});

describe("render — perfil de salud local canónico", () => {
  it("usa título documental y retira la síntesis autónoma y el desarrollo capitular", () => {
    // Título documental, no etiqueta de sistema
    expect(html).toContain("Lectura territorial del diagnóstico");
    expect(html).not.toContain("Vista editorial integrada");
    expect(html).not.toContain("Propuesta de composición del Perfil de Salud Local");
    // La resolución editorial retira la sección autónoma «Salud en síntesis»
    // y el desarrollo capitular largo de la experiencia principal.
    expect(html).not.toContain("Salud en síntesis");
    expect(html).not.toContain("I · Alcance y fuentes");
    // La composición canónica precede al espacio técnico de trabajo.
    expect(html.indexOf("Lectura territorial del diagnóstico")).toBeLessThan(
      html.indexOf("Espacio técnico del Perfil")
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
    expect(html).toContain(
      "Validación, compilación, enriquecimiento y trazabilidad interna. No forma parte de la lectura canónica del Perfil."
    );
  });

  it("la lectura canónica precede al espacio técnico", () => {
    const editorialPos = html.indexOf("Lectura territorial del diagnóstico");
    const technicalPos = html.indexOf("Espacio técnico del Perfil");
    expect(editorialPos).toBeGreaterThan(-1);
    expect(technicalPos).toBeGreaterThan(-1);
    expect(editorialPos).toBeLessThan(technicalPos);
  });

  it("el espacio técnico queda cerrado por defecto", () => {
    const technicalDetailsPos = html.indexOf('<details class="psl-technical-space"');
    expect(technicalDetailsPos).toBeGreaterThan(-1);
    const technicalDetailsTag = html.slice(
      technicalDetailsPos,
      html.indexOf(">", technicalDetailsPos)
    );
    expect(technicalDetailsTag).not.toContain("open");
  });

  it("Resumen, PSL-C y enriquecimiento no aparecen antes del espacio técnico", () => {
    const technicalPos = html.indexOf("Espacio técnico del Perfil");
    expect(technicalPos).toBeGreaterThan(-1);
    const beforeTechnical = html.slice(0, technicalPos);

    expect(beforeTechnical).not.toContain(">Resumen<");
    expect(beforeTechnical).not.toContain("Elementos de diagnóstico");
    expect(beforeTechnical).not.toContain("Crear documento institucional PSL-C");
    expect(beforeTechnical).not.toContain("Perfiles de Salud Local Compilados");
    expect(beforeTechnical).not.toContain("PSL-C/v1");
    expect(beforeTechnical).not.toContain("Descargar DOCX");
    expect(beforeTechnical).not.toContain("Descargar PDF");
    expect(beforeTechnical).not.toContain("Ver documento institucional completo");
    expect(beforeTechnical).not.toContain("Enriquecimiento de fuentes del Perfil");
    expect(beforeTechnical).not.toContain("Enriquecimiento interpretativo");
  });

  it("los bloques técnicos quedan después de la lectura canónica", () => {
    const editorialPos = html.indexOf("Lectura territorial del diagnóstico");
    // La ruta operativa y el espacio de trabajo no deben preceder a la lectura canónica
    const compilacionPos = html.indexOf("Crear documento institucional PSL-C");
    const espacioPos = html.indexOf("Espacio de trabajo del equipo técnico");
    // Si aparecen, deben ser después de la lectura canónica
    if (compilacionPos >= 0) expect(compilacionPos).toBeGreaterThan(editorialPos);
    if (espacioPos >= 0) expect(espacioPos).toBeGreaterThan(editorialPos);
  });

  it("mantiene ausentes PslChapterNav y el desarrollo capitular largo", () => {
    expect(html).not.toContain("Capítulos del perfil");
    expect(html).not.toContain("I · Alcance y fuentes");
  });
});

describe("calidad documental — textura y formularios", () => {
  it("la lectura canónica tiene título documental y no etiqueta de sistema", () => {
    const beforeTechnical = html.slice(0, html.indexOf("Espacio técnico del Perfil"));
    expect(beforeTechnical).toContain("Perfil de Salud Local");
    expect(beforeTechnical).toContain("Lectura territorial del diagnóstico");
    expect(beforeTechnical).not.toContain("Vista editorial integrada");
    expect(beforeTechnical).not.toContain("Propuesta de composición del Perfil de Salud Local");
  });

  it("la lectura canónica no contiene nombres de fichero CSV", () => {
    const beforeTechnical = html.slice(0, html.indexOf("Espacio técnico del Perfil"));
    expect(beforeTechnical).not.toMatch(/\.csv\b/);
  });

  it("la lectura canónica no contiene el campo Fuente y escala: como etiqueta de plantilla", () => {
    const beforeTechnical = html.slice(0, html.indexOf("Espacio técnico del Perfil"));
    expect(beforeTechnical).not.toContain("Fuente y escala:");
  });

  it("la nota de equidad no se repite más de dos veces en la lectura canónica", () => {
    const beforeTechnical = html.slice(0, html.indexOf("Espacio técnico del Perfil"));
    const matches = beforeTechnical.match(/no est[aá]n desagregados/gi) ?? [];
    expect(matches.length).toBeLessThanOrEqual(2);
  });

  it("la lectura canónica no contiene el formulario de validación técnica", () => {
    const beforeTechnical = html.slice(0, html.indexOf("Espacio técnico del Perfil"));
    expect(beforeTechnical).not.toContain("Validar técnicamente");
  });

  it("conserva las señales cuantitativas clave en la lectura canónica", () => {
    const beforeTechnical = html.slice(0, html.indexOf("Espacio técnico del Perfil"));
    expect(beforeTechnical).toContain("32.8 %");
    expect(beforeTechnical).toContain("34.2 %");
    expect(beforeTechnical).toContain("49.2/55");
    expect(beforeTechnical).toContain("56");
  });

  it("los bloques de lectura no superan 150 palabras (contrato de densidad)", () => {
    for (const block of editorialView.territorialReadings) {
      const words = block.reading.trim().split(/\s+/).length;
      expect(words, block.id).toBeLessThanOrEqual(150);
      expect(words, block.id).toBeGreaterThanOrEqual(60);
    }
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

describe("CSS pantalla — lectura documental del Perfil", () => {
  const css = readFileSync(
    resolve(dirname(fileURLToPath(import.meta.url)), "../src/App.css"),
    "utf8"
  );

  it("la lectura territorial usa columna única en pantalla", () => {
    const gridRule = css.match(/\.pie-reading-grid\s*\{([^}]*)\}/s)?.[1] ?? "";
    expect(gridRule).toContain("1fr");
    expect(gridRule).not.toContain("auto-fit");
  });

  it("la prosa de lectura tiene anchura de línea limitada", () => {
    expect(css).toContain(".pie-reading-card > p:");
    expect(css).toMatch(/max-width\s*:\s*\d+ch/);
  });

  it("el espacio técnico tiene estilo de separador, no de contenido principal", () => {
    expect(css).toContain(".psl-technical-space__label");
    expect(css).toContain(".psl-technical-space__summary");
  });
});

describe("CSS impresión — lectura canónica del Perfil", () => {
  const css = readFileSync(
    resolve(dirname(fileURLToPath(import.meta.url)), "../src/App.css"),
    "utf8"
  );

  it("contiene un bloque @media print para la lectura canónica del Perfil", () => {
    const lastPrintBlock = css.slice(css.lastIndexOf("@media print"));
    expect(lastPrintBlock).toContain(".pie-preview");
    expect(lastPrintBlock).toContain(".app-nav");
  });

  it("oculta el espacio técnico en impresión normal del Perfil", () => {
    const lastPrintBlock = css.slice(css.lastIndexOf("@media print"));
    expect(lastPrintBlock).toContain(".psl-technical-space");
    expect(lastPrintBlock).toMatch(/display\s*:\s*none/);
  });

  it("incluye break-inside:avoid para tarjetas de lectura en impresión", () => {
    const lastPrintBlock = css.slice(css.lastIndexOf("@media print"));
    expect(lastPrintBlock).toContain(".pie-reading-card");
    expect(lastPrintBlock).toContain("break-inside: avoid");
  });

  it("oculta la barra de navegación en impresión", () => {
    const lastPrintBlock = css.slice(css.lastIndexOf("@media print"));
    expect(lastPrintBlock).toContain(".app-nav");
    expect(lastPrintBlock).toMatch(/display\s*:\s*none/);
  });

  it("oculta el anexo técnico colapsado en impresión", () => {
    const lastPrintBlock = css.slice(css.lastIndexOf("@media print"));
    expect(lastPrintBlock).toContain(".pie-annex");
    expect(lastPrintBlock).toMatch(/display\s*:\s*none/);
  });

  it("asegura lectura en blanco y negro: preguntas sin azul", () => {
    const lastPrintBlock = css.slice(css.lastIndexOf("@media print"));
    expect(lastPrintBlock).toContain(".pie-reading-card__question");
    expect(lastPrintBlock).toContain("color: #000");
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
