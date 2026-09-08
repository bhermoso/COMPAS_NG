/**
 * tests/granada-zaidin-vigente-56-92.test.ts
 *
 * PROTECCIÓN DE LA LÍNEA VIGENTE Granada-Zaidín 56/92.
 *
 * Rehidrata el export versionado de trabajo:
 *   municipalities/granada-zaidin/exports/compas-ng-workspace-granada-zaidin.json
 * con los servicios reales de persistencia, y fija:
 *   (a) la composición del expediente (20 docs / 92 evidencias / 36 estudios /
 *       56 Localiza Salud / 2 territoriales / 3 marcos / 1 informe / distrito);
 *   (b) la integridad del fichero (ASCII, sin mojibake CP850/CP1252);
 *   (c) los invariantes narrativos del Perfil generado sobre la línea real.
 *
 * Si este test falla porque el export cambió a 15/51, NO "corregir" el test:
 * el export vigente ha sido pisado por la reconstrucción mínima histórica y
 * debe restaurarse desde …-MANUAL-56-92.json.
 */

import { describe, it, expect, beforeAll } from "vitest";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { loadWorkspaceFromLocalStorage } from "../src/infrastructure/persistence/local-storage";
import { createMunicipalityRuntime } from "../src/application/runtime";
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

const STUDY_KEYS = [
  "ibseStudy",
  "dukeStudy",
  "predimedStudy",
  "sf12Study",
  "suenoStudy",
  "cageStudy",
  "auditcStudy",
  "ipaqStudy",
  "ghq12Study",
  "phq9Study",
  "psqiStudy",
  "fagerstromStudy",
  "sbqStudy",
] as const;

let raw: string;
let ws: MunicipalityWorkspace;
let psl: LocalHealthProfile;

beforeAll(() => {
  raw = readFileSync(EXPORT_PATH, "utf8");
  store.set("compas-ng:workspace:granada-zaidin", raw);
  const loaded = loadWorkspaceFromLocalStorage("granada-zaidin");
  if (loaded === null) throw new Error("El export vigente no rehidrata");
  ws = loaded;
  psl = createMunicipalityRuntime({ workspace: ws }).psl;
}, 60000);

describe("Línea vigente 56/92 — integridad del fichero exportado", () => {
  it("es 100 % ASCII, sin patrones de corrupción CP850/CP1252", () => {
    expect(/^[\x00-\x7F]*$/.test(raw)).toBe(true);
    for (const mojibake of ["├¡", "Ã­", "ÔÇö", "Ã©", "┬"]) {
      expect(raw.includes(mojibake), mojibake).toBe(false);
    }
  });

  it("el contenido parseado conserva tildes correctas", () => {
    const texto = JSON.stringify(JSON.parse(raw));
    expect(texto).toContain("Granada-Zaidín");
    expect(texto).toContain("Andalucía");
  });
});

describe("Línea vigente 56/92 — composición del expediente", () => {
  it("identidad: granada-zaidin, distrito, sin INE propio", () => {
    expect(ws.municipality.identity.id).toBe("granada-zaidin");
    expect(ws.municipality.identity.territorialType).toBe("distrito");
    expect(ws.municipality.identity.ineCode).toBeUndefined();
  });

  it("20 documentos: 1 informe, 13 estudios, 1 Localiza, 2 territoriales, 3 marcos", () => {
    const docs = ws.repository.documents;
    expect(docs.length).toBe(20);
    expect(docs.filter((d) => d.kind === "health-report").length).toBe(1);
    expect(docs.filter((d) => d.kind === "territorial-documentation").length).toBe(2);
    expect(docs.filter((d) => d.kind === "strategic-framework").length).toBe(3);
    expect(docs.filter((d) => d.kind === "localiza-salud").length).toBe(1);
  });

  it("92 evidencias: 36 de estudios (30 + 6 IBSE) y 56 de Localiza Salud", () => {
    const atoms = ws.evidenceStore.atoms;
    expect(atoms.length).toBe(92);
    const estudios = atoms.filter(
      (a) => a.provenance.origin === "complementary-study" || a.provenance.origin === "ibse"
    );
    expect(estudios.length).toBe(36);
    expect(atoms.filter((a) => a.provenance.origin === "localiza-salud").length).toBe(56);
  });

  it("13/13 estudios definidos; informe con canGenerateEvidence=false y 0 átomos; 0 átomos de marcos", () => {
    for (const key of STUDY_KEYS) {
      expect(ws[key], key).toBeDefined();
    }
    const hr = ws.repository.documents.find((d) => d.kind === "health-report");
    expect(hr!.canGenerateEvidence).toBe(false);
    expect(
      ws.evidenceStore.atoms.some((a) => a.provenance.origin === "health-report")
    ).toBe(false);
    expect(
      ws.evidenceStore.atoms.some((a) => a.provenance.origin === "strategic-framework")
    ).toBe(false);
  });

  it("la rehidratación no pierde nada respecto al fichero", () => {
    const crudo = JSON.parse(raw);
    expect(ws.repository.documents.length).toBe(crudo.repository.documents.length);
    expect(ws.evidenceStore.atoms.length).toBe(crudo.evidenceStore.atoms.length);
  });
});

describe("Línea vigente 56/92 — invariantes narrativos del Perfil", () => {
  it("genera los seis capítulos en orden", () => {
    const texto = psl.conclusiones.content;
    const capitulos = [
      "I. Alcance, fuentes y escala de la evidencia",
      "II. Contexto territorial y sociodemográfico",
      "III. Situación de salud y desigualdades",
      "IV. Determinantes sociales, comunitarios y ambientales",
      "V. Activos, capacidades territoriales e incertidumbres",
      "VI. Conclusiones técnicas para la priorización",
    ];
    let anterior = -1;
    for (const capitulo of capitulos) {
      const posicion = texto.indexOf(capitulo);
      expect(posicion, capitulo).toBeGreaterThan(anterior);
      anterior = posicion;
    }
  });

  it("el capítulo I no domina el documento (sin volcado de cautelas)", () => {
    const texto = psl.conclusiones.content;
    const finCapI = texto.indexOf("II. Contexto territorial");
    expect(finCapI).toBeGreaterThan(0);
    // Intención de producto: Cap. I compacto, nunca mayoritario.
    expect(finCapI / texto.length).toBeLessThan(0.45);
  });

  it("la muestra de activos del capítulo V prioriza los identificables del Zaidín", () => {
    const texto = psl.conclusiones.content;
    const capV = texto.slice(texto.indexOf("V. Activos"), texto.indexOf("VI. Conclusiones"));
    const primerEjemplo = capV.split("entre ellos: ")[1]?.split(";")[0] ?? "";
    expect(primerEjemplo.toLowerCase()).toContain("zaid");
    expect(capV).toContain("se identifican expresamente con el distrito");
    expect(capV).toContain("municipio matriz");
    // La cifra total no se reduce
    expect(capV).toContain("56 activos");
  });

  it("distrito como término preferente; «municipio» solo para el municipio matriz", () => {
    const textos = [
      psl.territorialSummary,
      psl.conclusiones.content,
      psl.conclusiones.authorshipNote,
      psl.cierreInterpretativo.content,
      psl.priorizacion.deliberacionNota,
      psl.longitudinalNote,
    ].join("\n");
    const admisible = textos.split("municipio matriz").join("");
    expect(admisible).not.toMatch(/\bmunicipios?\b/i);
    expect(textos).toContain("distrito");
  });

  it("estudios como proxy/contexto y Localiza con cautela inframunicipal", () => {
    const texto = psl.conclusiones.content;
    expect(texto).toContain("contexto exploratorio");
    expect(texto).toMatch(/no constituyen? (una )?estimación específica del distrito/);
    expect(texto).toContain("Localiza Salud");
    expect(psl.cierreInterpretativo.content).toContain("inframunicipal");
  });

  it("marcos estratégicos fuera de las conclusiones diagnósticas", () => {
    const textos = psl.conclusiones.content + "\n" + psl.cierreInterpretativo.content;
    expect(textos).not.toContain("EPVSA");
    expect(textos).not.toContain("ESCA");
    expect(textos).not.toContain("Personas Mayores en Andalucía");
  });

  it("sin recomendaciones, programas, actuaciones ni lenguaje de sistema", () => {
    const textos = psl.conclusiones.content + "\n" + psl.cierreInterpretativo.content;
    expect(textos).not.toMatch(
      /se recomienda|recomendamos|debe implantarse|proponemos|línea estratégica|actuaciones a desarrollar/i
    );
    expect(textos).not.toMatch(/pipeline|dashboard|scaffold|prototipo|inteligencia artificial/i);
    expect(psl.conclusiones.content).toContain("no formula recomendaciones");
    expect(psl.requiresHumanValidation).toBe(true);
  });
});
