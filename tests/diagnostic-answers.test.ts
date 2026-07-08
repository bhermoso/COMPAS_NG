/**
 * tests/diagnostic-answers.test.ts
 *
 * Sustancia diagnóstica del Perfil: la capa de respuestas diagnósticas
 * conecta el espacio de conocimiento, el Informe de Salud, la epidemiología
 * social y la salutogénesis con los capítulos narrativos.
 *
 * Protege el principio de producto: el Perfil produce una síntesis diagnóstica
 * sustantiva (concluye) sin recomendar, y no delega la redacción del
 * diagnóstico en el Grupo Motor.
 */

import { describe, it, expect, beforeAll } from "vitest";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { loadWorkspaceFromLocalStorage } from "../src/infrastructure/persistence/local-storage";
import { createMunicipalityRuntime } from "../src/application/runtime";
import {
  buildDiagnosticAnswers,
  buildSalutogenicReading,
} from "../src/application/health-profile";
import {
  createPerfilLocalDeSalud,
  addInterpretation,
  addHypothesis,
  addOpenQuestion,
  updateSynthesis,
} from "../src/application/health-profile";
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

let ws: MunicipalityWorkspace;
let psl: LocalHealthProfile;

beforeAll(() => {
  store.set(
    "compas-ng:workspace:granada-zaidin",
    readFileSync(EXPORT_PATH, "utf8")
  );
  const loaded = loadWorkspaceFromLocalStorage("granada-zaidin");
  if (loaded === null) throw new Error("El export vigente no rehidrata");
  ws = loaded;
  psl = createMunicipalityRuntime({ workspace: ws }).psl;
}, 60000);

/** Workspace vigente + un espacio de conocimiento poblado por el técnico. */
function workspaceConConocimiento(): MunicipalityWorkspace {
  let perfil = createPerfilLocalDeSalud("granada-zaidin");
  perfil = addInterpretation(perfil, {
    espacio: "determinantes",
    enunciado:
      "La presión del envejecimiento sobre las redes de cuidado condiciona la salud del distrito.",
    certeza: "moderada",
    evidenciaIds: ["localiza-atom-1"],
    autorNombre: "Equipo técnico",
  });
  perfil = addHypothesis(perfil, {
    espacio: "situacion-salud",
    enunciado:
      "El malestar emocional detectado se concentra en población cuidadora.",
    plausibilidad: "moderada",
    indicios: ["señales de salud mental y apoyo social en la evidencia contextual"],
    preguntasResolutoras: ["Explotación desagregada de GHQ-12 por rol de cuidado"],
    autorNombre: "Equipo técnico",
  });
  perfil = addOpenQuestion(perfil, {
    espacio: "desigualdades",
    formulacion:
      "No se conoce la distribución interna de renta y vivienda del distrito.",
    relevancia: "condiciona la lectura de desigualdades en salud.",
    urgencia: "alta",
    viasResolucion: ["Sección censal INE", "URBAN Audit"],
  });
  perfil = updateSynthesis(
    perfil,
    "El distrito combina un patrón contextual de malestar psicosocial con un tejido comunitario denso orientado a mayores."
  );
  return { ...ws, perfilLocalDeSalud: perfil };
}

// ══════════════════════════════════════════════════════════════════════════════
// A. Conexión conocimiento → narrativa
// ══════════════════════════════════════════════════════════════════════════════

describe("conexión conocimiento → narrativa", () => {
  it("interpretaciones, hipótesis, lagunas y síntesis del técnico aparecen en sus capítulos", () => {
    const conPerfil = workspaceConConocimiento();
    const texto = createMunicipalityRuntime({ workspace: conPerfil }).psl
      .conclusiones.content;

    // Interpretación (espacio determinantes → Cap. IV), con su certeza
    expect(texto).toContain("Lectura del equipo técnico (certeza moderada)");
    expect(texto).toContain("redes de cuidado");

    // Hipótesis como hipótesis, no como hecho, con vías de resolución
    expect(texto).toContain("Hipótesis diagnóstica del equipo");
    expect(texto).toContain("pendiente de confirmación");
    expect(texto).toContain("La resolverían");

    // Laguna como incertidumbre positiva (Cap. V)
    expect(texto).toContain("Laguna de conocimiento declarada (urgencia alta)");
    expect(texto).toContain("renta y vivienda");

    // Síntesis encabezando el cierre (Cap. VI), sin sustituir el documento
    expect(texto).toContain("Síntesis diagnóstica del equipo técnico.");
    expect(texto).toContain("tejido comunitario denso orientado a mayores");
    expect(texto).toContain("I. Alcance, fuentes y escala de la evidencia");
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// B. No-delegación y sustancia por capítulo
// ══════════════════════════════════════════════════════════════════════════════

describe("no-delegación — el Perfil concluye en lugar de pedir redacción", () => {
  it("no contiene «debe redactar aquí» y la autoría pendiente queda en una sola mención", () => {
    const texto = psl.conclusiones.content;
    expect(texto).not.toContain("debe redactar aquí");
    const menciones = texto.match(/asumir la autoría/g) ?? [];
    expect(menciones.length).toBe(1);
  });

  it("cada capítulo aporta afirmación sustantiva o laguna concreta", () => {
    const texto = psl.conclusiones.content;
    // III: señala un patrón, no solo un conteo
    expect(texto).toContain("situación de salud caracterizada");
    // IV: formula hipótesis diagnósticas en lugar de cerrarse en la carencia
    expect(texto).toContain("hipótesis diagnósticas plausibles");
    // VI: concluye técnicamente
    expect(texto).toContain("El diagnóstico apunta a un distrito");
    expect(texto).toContain("prioridades diagnósticas potenciales");
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// C. Informe de Salud leído sustantivamente
// ══════════════════════════════════════════════════════════════════════════════

describe("Informe de Salud — lectura sustantiva sin atomizar", () => {
  it("los temas de las secciones parseadas aparecen en el documento", () => {
    const texto = psl.conclusiones.content;
    expect(texto).toContain("cubre la base oficial del diagnóstico en");
    expect(texto.toLowerCase()).toContain("análisis epidemiológico");
  });

  it("D-HR-01 intacta: sin átomos del informe y canGenerateEvidence=false", () => {
    expect(
      ws.evidenceStore.atoms.some((a) => a.provenance.origin === "health-report")
    ).toBe(false);
    const hrDoc = ws.repository.documents.find((d) => d.kind === "health-report");
    expect(hrDoc!.canGenerateEvidence).toBe(false);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// D. Epidemiología social
// ══════════════════════════════════════════════════════════════════════════════

describe("epidemiología social — determinantes plausibles con cautela", () => {
  it("distingue documentado / plausible / no evaluable / a contrastar", () => {
    const answers = buildDiagnosticAnswers({
      workspace: ws,
      determinantTitles: [],
      assets: ws.evidenceStore.atoms
        .filter((a) => a.kind === "asset")
        .map((a) => ({ title: a.title, content: a.content })),
    });
    const kinds = new Set(answers.determinantes.map((d) => d.kind));
    expect(kinds.has("plausible")).toBe(true);
    expect(kinds.has("no-evaluable")).toBe(true);
    expect(kinds.has("a-contrastar")).toBe(true);
  });

  it("formula hipótesis sin causalidad fuerte ni recomendaciones", () => {
    const texto = psl.conclusiones.content;
    expect(texto).toContain("Lectura desde la epidemiología social");
    expect(texto).toContain("pueden estar operando");
    expect(texto).toContain("Ninguna de estas lecturas constituye causalidad demostrada");
    expect(texto).toContain("Determinantes no evaluables");
    expect(texto).not.toMatch(/demuestra que|causa directa|se recomienda|debe implantarse/i);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// E. Salutogénesis analítica
// ══════════════════════════════════════════════════════════════════════════════

describe("salutogénesis — capacidades por ámbito, no solo recuento", () => {
  it("clasifica los 56 activos vigentes en ámbitos de capacidad", () => {
    const assets = ws.evidenceStore.atoms
      .filter((a) => a.provenance.origin === "localiza-salud")
      .map((a) => ({ title: a.title, content: a.content }));
    const lectura = buildSalutogenicReading(assets);
    expect(lectura.totalAssets).toBe(56);
    expect(lectura.grupos.length).toBeGreaterThanOrEqual(3);
    const clasificados = lectura.grupos.reduce((n, g) => n + g.count, 0);
    expect(clasificados + lectura.sinClasificar).toBe(56);
    expect(clasificados).toBeGreaterThan(lectura.sinClasificar);
  });

  it("la narrativa presenta concentraciones de capacidad con cautela, sin soluciones", () => {
    const texto = psl.conclusiones.content;
    expect(texto).toContain("concentraciones de capacidad");
    expect(texto).toContain("capacidades potenciales");
    expect(texto).toContain("no prueban cobertura ni resultado");
    expect(texto).toContain("municipio matriz"); // cautela inframunicipal intacta
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// F. Frontera de fase + G. línea 56/92
// ══════════════════════════════════════════════════════════════════════════════

describe("frontera de fase y línea vigente", () => {
  it("sin recomendaciones, programas, actuaciones ni marcos como evidencia", () => {
    const texto = psl.conclusiones.content + "\n" + psl.cierreInterpretativo.content;
    expect(texto).not.toMatch(
      /se recomienda|recomendamos|debe ponerse en marcha|programa de|actuación|línea estratégica|indicador de seguimiento/i
    );
    expect(texto).not.toContain("EPVSA");
    expect(texto).not.toContain("ESCA");
    expect(texto).not.toContain("Personas Mayores en Andalucía");
  });

  it("el expediente 56/92 permanece intacto tras generar el Perfil", () => {
    expect(ws.repository.documents.length).toBe(20);
    expect(ws.evidenceStore.atoms.length).toBe(92);
    expect(
      ws.evidenceStore.atoms.filter((a) => a.provenance.origin === "localiza-salud").length
    ).toBe(56);
  });
});
