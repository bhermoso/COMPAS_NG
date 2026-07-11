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
  buildIntegratedProfileSignals,
  buildProfileIntegratedEditorialView,
  checkProfileWritingContract,
} from "../src/application/health-profile";
import type {
  DiagnosticAnswers,
  ProfileIntegratedEditorialView,
} from "../src/application/health-profile";
import { LocalHealthProfileView } from "../src/ui/components/LocalHealthProfileView";
import type { MunicipalityWorkspace } from "../src/domain/workspace";
import type {
  LocalHealthProfile,
  PerfilLocalDeSalud,
} from "../src/domain/health-profile";

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

/**
 * Densidad de un hilo: un párrafo de lectura, nunca un capítulo.
 *
 * Con la interpretación integrada (Nivel 3) cada hilo cruza agenda sanitaria,
 * señal local con su cautela, contexto, conocimiento humano cuando existe,
 * mecanismo plausible, incertidumbre y capacidad. Ese cruce es más denso que un
 * hilo de señal aislada; el tope se fija en 235 palabras. La brevedad se protege
 * por jerarquía documental (la trazabilidad extensa vive en el anexo) y por el
 * recorte de listas de señales corroborantes/contextuales, no mutilando la
 * declaración de equidad. La edición final de la prosa es un incremento posterior.
 */
const DENSIDAD_MAX_PALABRAS = 235;

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
let humanEditorialView: ProfileIntegratedEditorialView;
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

  const perfilConocimientoHumano: PerfilLocalDeSalud = {
    id: "perfil-humano-test",
    municipalityId: ws.municipality.identity.id,
    interpretaciones: [
      {
        id: "interp-entorno-test",
        municipalityId: ws.municipality.identity.id,
        espacio: "contexto-territorial",
        enunciado:
          "El equipo técnico interpreta que la autonomía para usar el espacio público condiciona la vida activa cotidiana.",
        certeza: "moderada",
        evidenciaIds: [],
        autorNombre: "Equipo técnico",
        formuladaEn: "2027-01-01T00:00:00.000Z",
        status: "activa",
      },
    ],
    hipotesis: [
      {
        id: "hip-activos-test",
        municipalityId: ws.municipality.identity.id,
        espacio: "activos",
        enunciado:
          "La soledad no deseada puede concentrarse en personas mayores que no acceden a los recursos inventariados.",
        plausibilidad: "moderada",
        indicios: [],
        preguntasResolutoras: [
          "Contraste con Grupo Motor y entidades de mayores.",
        ],
        autorNombre: "Equipo técnico",
        formuladaEn: "2027-01-01T00:00:00.000Z",
        status: "activa",
      },
    ],
    preguntasAbiertas: [
      {
        id: "preg-desigualdad-test",
        municipalityId: ws.municipality.identity.id,
        espacio: "desigualdades",
        formulacion:
          "¿Qué grupos viven peor el descanso, la movilidad cotidiana y el acceso a los recursos?",
        relevancia:
          "La evidencia agregada no muestra distribución interna ni barreras de acceso.",
        urgencia: "alta",
        viasResolucion: ["Grupo Motor", "contraste comunitario"],
        creadaEn: "2027-01-01T00:00:00.000Z",
        status: "abierta",
      },
    ],
    sintesisTexto:
      "La lectura técnica prioriza contrastar la relación entre apoyo social, descanso y autonomía cotidiana.",
    createdAt: "2027-01-01T00:00:00.000Z",
    updatedAt: "2027-01-01T00:00:00.000Z",
  };
  const humanWorkspace: MunicipalityWorkspace = {
    ...ws,
    perfilLocalDeSalud: perfilConocimientoHumano,
  };
  const humanAnswers = buildDiagnosticAnswers({
    workspace: humanWorkspace,
    determinantTitles: [],
    assets: ws.evidenceStore.atoms
      .filter((a) => a.kind === "asset")
      .map((a) => ({ title: a.title, content: a.content })),
  });
  humanEditorialView = buildProfileIntegratedEditorialView(humanAnswers, {
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
    // Los hilos los gobierna ahora la interpretación integrada (Nivel 3).
    expect(editorialView.territorialReadings.length).toBeGreaterThanOrEqual(6);
    expect(editorialView.territorialReadings.length).toBe(
      editorialView.interpretation.units.length
    );
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
      expect(words, block.id).toBeLessThanOrEqual(DENSIDAD_MAX_PALABRAS);
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

  it("cruza salud mental de forma defendible: base estructurada escasa vs señal local (open-question)", () => {
    const block = readingById("salud-mental-señal-local");
    const text = normalized(block.reading);
    expect(block.epistemicStatus).toBe("open-question");
    // Señal local principal (GHQ-12), corroborantes distintas (PSQI, PHQ-9).
    expect(text).toMatch(/ghq-12|malestar psicologico/);
    expect(block.reading).toContain("26.3 %");
    // Regla 4: NO se infiere infravaloración del conteo textual; se dice que la
    // base estructurada ofrece poca información y que el conteo ≠ cobertura.
    expect(text).toContain("base estructurada disponible ofrece poca informacion");
    expect(text).toMatch(/no mide cobertura|conteo de menciones/);
    expect(text).not.toContain("infravalora");
    // El proxy (SF-12 / Sueño EAS) queda como contexto, no como medición local.
    expect(text).toContain("como contexto, no como medicion distrital");
    // La señal local se declara exploratoria, no prevalencia distrital.
    expect(text).toContain("no prevalencia distrital");
  });

  it("cruza cronicidad con condiciones de vida usando el sedentarismo local (SBQ)", () => {
    const block = readingById("cronicidad-condiciones-de-vida");
    const text = normalized(block.reading);
    expect(block.epistemicStatus).toBe("integrated-interpretation");
    // Evidencia local principal SBQ; IPAQ provincial como contexto.
    expect(text).toMatch(/sedentario|sbq/);
    expect(block.reading).toContain("29.4 %");
    expect(text).toContain("como contexto, no como medicion distrital");
    // No reenumera la epidemiología del Informe: cita temas + una magnitud.
    expect(text).toContain("a su escala, sin desagregacion distrital");
  });

  it("cruza apoyo social y envejecimiento; DUKE provincial queda como contexto", () => {
    const block = readingById("apoyo-social-soledad-envejecimiento");
    const text = normalized(block.reading);
    expect(text).toContain("envejecimiento");
    expect(text).toMatch(/apoyo social|duke/);
    // DUKE es proxy: contexto, no medición local del distrito.
    expect(block.reading).toContain("49.2/55");
    expect(text).toContain("como contexto, no como medicion distrital");
  });

  it("presenta activos como capacidad potencial y desigualdad como incertidumbre central", () => {
    const serialized = normalized(JSON.stringify(editorialView));

    expect(serialized).toMatch(/capacidad(es)? potencial(es)?/);
    expect(serialized).toMatch(/no cobertura ni resultado|acceso, uso y resultado/);
    expect(serialized).toContain("incertidumbre de equidad");
    expect(serialized).toMatch(/no est[aá] desagregada|sin desagregacion/);
    // La incertidumbre de escala/desagregación es sustantiva, no marginal.
    expect(normalized(editorialView.interpretation.centralUncertainty)).toMatch(
      /barrios|unidades asistenciales|desagregaci/
    );
  });

  it("no formula recomendaciones, objetivos ni actuaciones", () => {
    expect(JSON.stringify(editorialView)).not.toMatch(FORBIDDEN_EDITORIAL_RE);
  });

  it("mantiene la escritura dentro del contrato narrativo", () => {
    const violations = checkProfileWritingContract(JSON.stringify(editorialView));
    expect(violations).toEqual([]);
  });

  it("gobierna cada hilo con una pregunta motor existente", () => {
    for (const block of editorialView.territorialReadings) {
      expect(block.motorQuestion).toMatch(/^¿.+\?$/);
    }
  });

  it("cada hilo lleva su pregunta de razonamiento y su estatus del cruce (N3)", () => {
    for (const block of editorialView.territorialReadings) {
      expect(block.groupMotorQuestion, block.id).toMatch(/^¿.+\?$/);
      expect(
        ["integrated-interpretation", "plausible-hypothesis", "open-question"],
        block.id
      ).toContain(block.epistemicStatus);
    }
  });

  it("la interpretación del técnico llega al hilo con su estatus de autoría", () => {
    const cron = humanEditorialView.interpretation.units.find(
      (u) => u.id === "cronicidad-condiciones-de-vida"
    )!;
    expect(cron.documentAuthoredInterpretations.length).toBeGreaterThan(0);
    const text = normalized(cron.reasoning);
    expect(text).toContain("la lectura del equipo tecnico orienta este hilo");
    expect(text).toContain("autonomia para usar el espacio publico");
  });

  it("la hipótesis del técnico modula la lectura sin convertirse en hecho ni en mecanismo", () => {
    const apoyo = humanEditorialView.interpretation.units.find(
      (u) => u.id === "apoyo-social-soledad-envejecimiento"
    )!;
    expect(apoyo.plausibleHypotheses.length).toBeGreaterThan(0);
    const text = normalized(apoyo.reasoning);
    expect(text).toContain("hipotesis a contrastar, no como hecho");
    // La hipótesis nunca ocupa la ranura de mecanismo del hilo.
    for (const block of humanEditorialView.territorialReadings) {
      expect(normalized(block.mechanism), block.id).not.toContain(
        "soledad no deseada"
      );
    }
  });

  it("la pregunta abierta humana gobierna la unidad correspondiente y no se pierde", () => {
    const unit = humanEditorialView.interpretation.units.find((u) =>
      u.openHumanQuestions.length > 0
    );
    expect(unit).toBeDefined();
    expect(normalized(unit!.question)).toContain(
      "que grupos viven peor el descanso"
    );
    // Cada pieza de conocimiento humano se consume una sola vez (sin repetición).
    const interps = humanEditorialView.interpretation.units.flatMap(
      (u) => u.documentAuthoredInterpretations
    );
    expect(new Set(interps).size).toBe(interps.length);
  });

  it("el conocimiento humano no se repite mecánicamente entre hilos", () => {
    const preguntas = editorialView.territorialReadings.map(
      (b) => b.groupMotorQuestion
    );
    const mecanismos = editorialView.territorialReadings.map((b) => b.mechanism);
    // Cada hilo formula su propia pregunta (temas distintos).
    expect(new Set(preguntas).size).toBe(preguntas.length);
    // Los mecanismos pueden converger, pero no colapsar en uno solo.
    expect(new Set(mecanismos).size).toBeGreaterThan(1);
  });

  it("quién puede quedar fuera es una cuestión de equidad, no la relevancia de una laguna", () => {
    for (const block of humanEditorialView.territorialReadings) {
      expect(normalized(block.exclusion), block.id).not.toContain(
        "condiciona la lectura"
      );
    }
  });

  it("la laguna de equidad es específica por señal, no una fórmula idéntica", () => {
    const signals = buildIntegratedProfileSignals(answers);
    const notas = new Set(signals.map((s) => s.desigualdad.nota));
    expect(notas.size).toBeGreaterThan(1);
    for (const s of signals) {
      expect(s.desigualdad.nota).toContain("no ausencia de desigualdad");
      expect(s.desigualdad.ejesAusentes).toContain("sexo");
      expect(s.desigualdad.loQueNoSeSabe.length).toBeGreaterThan(10);
    }
    // Ruiz Cantero / García-Calvente: la carga de cuidados es eje propio cuando
    // la señal la interpela (descanso, apoyo, soledad, envejecimiento).
    const sueno = signals.find((s) => s.id === "trazador-sueno-insuficiente");
    expect(sueno!.desigualdad.ejesAusentes).toContain("carga de cuidados");
    const alimentacion = signals.find((s) => s.id === "trazador-predimed-adherencia");
    expect(alimentacion!.desigualdad.ejesAusentes).not.toContain("carga de cuidados");
  });

  it("la interpretación no reenumera el Informe como segunda epidemiología", () => {
    // Ninguna unidad copia tablas/tasas del Informe: cita el tema + una
    // magnitud y explica la lectura territorial (regla: epidemiología una vez).
    for (const unit of editorialView.interpretation.units) {
      // La agenda se resume por temas/magnitud, no por listado exhaustivo.
      expect(unit.sanitaryAgenda.topics.length).toBeLessThanOrEqual(6);
    }
    // El mensaje de apertura mantiene el hilo sanitario sin volverlo prevalencia.
    const apertura = editorialView.overview.find((m) => m.id === "hilo-sanitario");
    expect(apertura!.text).toContain("agenda sanitaria de partida");
    expect(apertura!.text).toMatch(/no permite conocer prevalencia|no convierte menciones/);
  });

  it("Popay: la experiencia comunitaria ausente se declara pendiente, no se inventa", () => {
    const contrastar = editorialView.closing.find((c) => c.id === "contrastar");
    const texto = contrastar!.items.join(" ");
    expect(texto).toContain("pendiente de incorporación");
    expect(texto).toContain("conocimiento pendiente, no ausencia de conocimiento");
    // No se fabrica testimonio ni percepción vecinal.
    expect(normalized(JSON.stringify(editorialView))).not.toMatch(
      /los vecinos declaran|segun la comunidad|las personas mayores senalan que/
    );
  });

  it("la síntesis técnica modula el cierre interpretativo", () => {
    const closing = normalized(JSON.stringify(humanEditorialView.closing));
    expect(closing).toContain("sintesis tecnica incorporada");
    expect(closing).toContain("autonomia cotidiana");
  });

  it("sin conocimiento humano registrado no inventa experiencia comunitaria", () => {
    const readings = normalized(JSON.stringify(editorialView.territorialReadings));
    expect(readings).not.toContain("testimonio");
    expect(readings).not.toContain("vecindario confirma");
    expect(readings).not.toContain("grupo motor confirma");
  });

  it("la proyección editorial no depende de cinco ramas extensas por tema", () => {
    const source = readFileSync(
      resolve(
        dirname(fileURLToPath(import.meta.url)),
        "../src/application/health-profile/profileIntegratedEditorialView.ts"
      ),
      "utf8"
    );
    expect(source).not.toMatch(/if\s*\(\s*definition\.id\s*===/);
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

describe("composición documental — estructura editorial", () => {
  it("los hilos son las unidades de interpretación integrada (Nivel 3)", () => {
    const ids = editorialView.territorialReadings.map((b) => b.id);
    expect(ids).toEqual(editorialView.interpretation.units.map((u) => u.id));
    // Cruces esperables del expediente vigente.
    expect(ids).toContain("cronicidad-condiciones-de-vida");
    expect(ids).toContain("salud-mental-señal-local");
    expect(ids).toContain("consumos-tabaco-alcohol");
    expect(ids).toContain("apoyo-social-soledad-envejecimiento");
    expect(ids).toContain("mortalidad-escala-desigualdad");
  });

  it("los hilos están presentes en el HTML canónico con título y pregunta", () => {
    const beforeTechnical = html.slice(0, html.indexOf("Espacio técnico del Perfil"));
    for (const block of editorialView.territorialReadings) {
      expect(beforeTechnical).toContain(block.title);
      expect(beforeTechnical).toContain(block.groupMotorQuestion);
    }
  });

  it("conserva las preguntas del Grupo Motor en la agenda deliberativa", () => {
    const beforeTechnical = html.slice(0, html.indexOf("Espacio técnico del Perfil"));
    expect(editorialView.groupMotorAgenda.length).toBeGreaterThanOrEqual(5);
    for (const card of editorialView.groupMotorAgenda) {
      expect(beforeTechnical).toContain(card.pregunta);
    }
  });

  it("conserva las cifras clave en la lectura canónica", () => {
    const beforeTechnical = html.slice(0, html.indexOf("Espacio técnico del Perfil"));
    expect(beforeTechnical).toContain("32.8 %");
    expect(beforeTechnical).toContain("34.2 %");
    expect(beforeTechnical).toContain("49.2/55");
    expect(beforeTechnical).toContain("56");
  });

  it("conserva la tabla de indicadores trazadores", () => {
    const beforeTechnical = html.slice(0, html.indexOf("Espacio técnico del Perfil"));
    expect(beforeTechnical).toContain("Indicadores trazadores: valores y referencias");
    expect(beforeTechnical).toContain("<table");
    // Tabla de trazadores no duplicada
    expect(
      beforeTechnical.match(/Indicadores trazadores: valores y referencias/g)
    ).toHaveLength(1);
  });

  it("conserva límites epistemológicos: fuente, escala, mecanismo y exclusión en los hilos", () => {
    const beforeTechnical = html.slice(0, html.indexOf("Espacio técnico del Perfil"));
    // Fuente y escala siguen presentes (en los hilos, no como etiqueta "Fuente y escala:")
    expect(beforeTechnical).not.toContain("Fuente y escala:");
    expect(beforeTechnical).toContain("proxy contextual");
    // El razonamiento integrado (Nivel 3) se lee como progresión continua:
    // mecanismo plausible (no causal), incertidumbre de equidad y contexto.
    expect(beforeTechnical).toContain("mecanismo plausible, no una causa demostrada");
    expect(beforeTechnical.toLowerCase()).toContain("incertidumbre de equidad");
    expect(beforeTechnical.toLowerCase()).toContain(
      "como contexto, no como medición distrital"
    );
    // No como lista de campos repetida hilo a hilo (mecanismo/exclusión sueltos).
    expect(beforeTechnical).not.toContain("pie-hilo__mechanism");
    expect(beforeTechnical).not.toContain("pie-hilo__exclusion");
  });

  it("los rótulos repetitivos no dominan como etiquetas fijas en todos los hilos", () => {
    const beforeTechnical = html.slice(0, html.indexOf("Espacio técnico del Perfil"));
    // "Señal" y "Zona ciega" no aparecen como etiquetas de campo repetidas
    const zonaCiegaMatches = (beforeTechnical.match(/Zona ciega:/g) ?? []).length;
    const senalMatches = (beforeTechnical.match(/class="[^"]*signal[^"]*"/g) ?? []).length;
    // Zona ciega no debe ser el rótulo repetido en todos los bloques (sí puede aparecer en deliberación)
    expect(zonaCiegaMatches).toBeLessThanOrEqual(editorialView.groupMotorAgenda.length);
    // Las clases de señal están en los hilos territoriales, no en un grid de fichas idénticas
    expect(senalMatches).toBeGreaterThan(0);
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

  it("cada hilo es un párrafo, no un capítulo (contrato de densidad)", () => {
    for (const block of editorialView.territorialReadings) {
      const words = block.reading.trim().split(/\s+/).length;
      expect(words, block.id).toBeLessThanOrEqual(DENSIDAD_MAX_PALABRAS);
      expect(words, block.id).toBeGreaterThanOrEqual(60);
    }
    // Jerarquía documental: la trazabilidad extensa vive en el anexo, no en el
    // cuerpo de lectura (el anexo supera con creces cualquier hilo).
    expect(editorialView.technicalAnnex.matrix.filas.length).toBeGreaterThan(
      editorialView.territorialReadings.length
    );
  });

  it("ninguna lectura generada queda mutilada por recorte", () => {
    // La brevedad nunca se consigue truncando: ni elipsis a mitad de frase, ni
    // paréntesis sin cerrar. La pregunta de razonamiento va en su propio campo.
    for (const block of editorialView.territorialReadings) {
      expect(block.reading, block.id).not.toContain("…");
      expect(block.reading, block.id).not.toMatch(/[.…]\s*\./);
      const abre = (block.reading.match(/\(/g) ?? []).length;
      const cierra = (block.reading.match(/\)/g) ?? []).length;
      expect(abre, block.id).toBe(cierra);
      expect(block.groupMotorQuestion, block.id).toContain("?");
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
