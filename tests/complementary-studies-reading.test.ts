/**
 * tests/complementary-studies-reading.test.ts
 *
 * Lectura sustantiva de los estudios complementarios: el Perfil debe
 * demostrar que ha LEÍDO los 13 estudios, no que los ha contado.
 *
 * Protege:
 *   - La agrupación de indicadores en bloques diagnósticos interpretables.
 *   - Que cada bloque queda sostenido por instrumentos reales, sin inventar.
 *   - Que los bloques alimentan las hipótesis epidemiológico-sociales.
 *   - Que los capítulos III y VI devuelven una lectura organizada.
 *   - Que la delegación de redacción desde cero ha desaparecido del producto.
 *   - La línea vigente Granada-Zaidín 56/92.
 */

import { describe, it, expect, beforeAll } from "vitest";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { loadWorkspaceFromLocalStorage } from "../src/infrastructure/persistence/local-storage";
import { createMunicipalityRuntime } from "../src/application/runtime";
import {
  buildComplementaryStudiesReading,
  HIPOTESIS_PSICOSOCIAL,
  HIPOTESIS_ENTORNO_URBANO,
  HIPOTESIS_CONSUMOS,
} from "../src/application/health-profile";
import type { ComplementaryStudiesReading } from "../src/application/health-profile";
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
let lectura: ComplementaryStudiesReading;

beforeAll(() => {
  store.set(
    "compas-ng:workspace:granada-zaidin",
    readFileSync(EXPORT_PATH, "utf8")
  );
  const loaded = loadWorkspaceFromLocalStorage("granada-zaidin");
  if (loaded === null) throw new Error("El export vigente no rehidrata");
  ws = loaded;
  psl = createMunicipalityRuntime({ workspace: ws }).psl;
  lectura = buildComplementaryStudiesReading({
    workspace: ws,
    indicatorTitles: ws.evidenceStore.atoms
      .filter((a) => a.kind === "indicator")
      .map((a) => a.title),
  });
}, 60000);

// ══════════════════════════════════════════════════════════════════════════════
// 1-2. La lectura produce más que un conteo: bloques diagnósticos
// ══════════════════════════════════════════════════════════════════════════════

describe("lectura de estudios — bloques diagnósticos, no conteo", () => {
  it("con 13 estudios y 23 indicadores produce bloques con sustancia", () => {
    expect(lectura.totalStudies).toBe(13);
    expect(lectura.totalIndicators).toBe(23);
    expect(lectura.diagnosticBlocks.length).toBeGreaterThan(0);
    for (const b of lectura.diagnosticBlocks) {
      expect(b.summary.length).toBeGreaterThan(20);
      expect(b.supportingStudies.length).toBeGreaterThan(0);
      expect(b.territorialReading.length).toBeGreaterThan(20);
      expect(b.contrastQuestions.length).toBeGreaterThan(0);
    }
  });

  it("agrupa las señales en al menos 4 bloques diagnósticos", () => {
    expect(lectura.diagnosticBlocks.length).toBeGreaterThanOrEqual(4);
    // Todos los indicadores del vigente clasifican; si dejaran de hacerlo,
    // la limitación queda declarada, no oculta.
    const clasificados = lectura.diagnosticBlocks.reduce(
      (n, b) => n + b.supportingIndicators.length,
      0
    );
    expect(clasificados + lectura.unclassifiedIndicators.length).toBe(23);
    expect(clasificados).toBeGreaterThan(lectura.unclassifiedIndicators.length);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// 3. IBSE alimenta un bloque específico
// ══════════════════════════════════════════════════════════════════════════════

describe("bienestar socioemocional escolar — bloque propio", () => {
  it("IBSE sostiene su bloque y no queda perdido en «entre otras»", () => {
    const ibse = lectura.diagnosticBlocks.find(
      (b) => b.id === "bienestar-socioemocional-escolar"
    );
    expect(ibse).toBeDefined();
    expect(ibse!.supportingStudies).toContain("IBSE");
    expect(ibse!.supportingIndicators.length).toBeGreaterThanOrEqual(4);
    // Y aparece nombrado en la lectura por bloques del capítulo III
    expect(psl.conclusiones.content).toContain(
      "bienestar socioemocional escolar, sostenido por IBSE"
    );
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// 4-6. Los bloques alimentan las hipótesis epidemiológico-sociales
// ══════════════════════════════════════════════════════════════════════════════

describe("bloques → hipótesis de determinantes", () => {
  it("salud mental/sueño y apoyo social alimentan la hipótesis psicosocial", () => {
    const saludMental = lectura.diagnosticBlocks.find(
      (b) => b.id === "salud-mental-sueno-malestar"
    );
    const apoyo = lectura.diagnosticBlocks.find(
      (b) => b.id === "apoyo-social-vinculo-comunitario"
    );
    expect(saludMental!.relatedDeterminantHypotheses).toContain(
      HIPOTESIS_PSICOSOCIAL
    );
    expect(apoyo!.relatedDeterminantHypotheses).toContain(HIPOTESIS_PSICOSOCIAL);
    expect(psl.conclusiones.content).toContain(
      "Los bloques diagnósticos del capítulo III sostienen esta lectura"
    );
    expect(psl.conclusiones.content).toContain(
      "salud mental, sueño y malestar percibido"
    );
  });

  it("actividad física/sedentarismo alimenta la hipótesis de entorno y vida activa", () => {
    const bloque = lectura.diagnosticBlocks.find(
      (b) => b.id === "actividad-fisica-sedentarismo-entorno"
    );
    expect(bloque!.relatedDeterminantHypotheses).toContain(
      HIPOTESIS_ENTORNO_URBANO
    );
    expect(bloque!.supportingStudies).toEqual(
      expect.arrayContaining(["IPAQ", "SBQ"])
    );
  });

  it("consumos/alimentación alimenta la hipótesis de contextos de consumo", () => {
    const bloque = lectura.diagnosticBlocks.find(
      (b) => b.id === "consumos-alimentacion-habitos"
    );
    expect(bloque!.relatedDeterminantHypotheses).toContain(HIPOTESIS_CONSUMOS);
    expect(bloque!.supportingStudies).toEqual(
      expect.arrayContaining(["CAGE", "AUDIT-C", "Fagerström", "PREDIMED"])
    );
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// 7-8. Capítulos III y VI devuelven la lectura organizada
// ══════════════════════════════════════════════════════════════════════════════

describe("narrativa — capítulos III y VI leen los estudios", () => {
  it("el capítulo III menciona bloques diagnósticos, no solo el número de indicadores", () => {
    const texto = psl.conclusiones.content;
    expect(texto).toContain("no aportan solo 23 indicadores aislados");
    expect(texto).toContain("bloques interpretables de salud y bienestar");
    expect(texto).toContain("El primero se refiere a");
  });

  it("el capítulo VI reconoce la aportación de los estudios como organización del diagnóstico", () => {
    const texto = psl.conclusiones.content;
    expect(texto).toContain(
      "La principal aportación de los estudios complementarios es ordenar el diagnóstico"
    );
    expect(texto).toContain("pasar de indicadores dispersos a hipótesis contrastables");
    expect(texto).toContain("Preguntas de contraste territorial");
  });

  it("las líneas prioritarias no encabezan con el área genérica participativa", () => {
    const texto = psl.conclusiones.content;
    const inicio = texto.indexOf("prioridades diagnósticas potenciales: 1)");
    expect(inicio).toBeGreaterThan(-1);
    const primeraLinea = texto.slice(inicio, texto.indexOf("; 2)", inicio));
    expect(primeraLinea).toContain("contraste territorial de la hipótesis");
    expect(primeraLinea).not.toMatch(/participativ/i);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// 9-11. Frontera de producto: sin delegación, sin causalidad
// ══════════════════════════════════════════════════════════════════════════════

describe("frontera de producto", () => {
  it("la delegación de redacción desde cero ha desaparecido del producto", () => {
    const textos = [
      psl.conclusiones.content,
      psl.conclusiones.authorshipNote,
      psl.cierreInterpretativo.content,
      psl.cierreInterpretativo.authorshipNote,
      psl.priorizacion.deliberacionNota,
    ].join("\n");
    expect(textos).not.toContain("El equipo técnico debe redactar aquí");
    expect(textos).not.toContain(
      "Este capítulo no puede ser completado por el sistema"
    );
    expect(textos).not.toContain("Requiere autoría humana");
    // Lo permitido: revisión y validación, no redacción desde cero.
    expect(textos).toMatch(/revisa, matiza y valida|revisarlo, matizarlo/);
  });

  it("las hipótesis siguen sin causalidad demostrada ni recomendaciones", () => {
    const texto = psl.conclusiones.content;
    expect(texto).toContain("Ninguna de estas lecturas constituye causalidad demostrada");
    expect(texto).not.toMatch(
      /demuestra que|causa directa|se recomienda|recomendamos|debe implantarse|programa de/i
    );
    for (const b of lectura.diagnosticBlocks) {
      expect(b.summary).not.toMatch(/demuestra|causa|se recomienda/i);
    }
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// 12. Línea vigente 56/92 intacta
// ══════════════════════════════════════════════════════════════════════════════

describe("línea vigente", () => {
  it("el expediente 56/92 permanece intacto tras la lectura de estudios", () => {
    expect(ws.repository.documents.length).toBe(20);
    expect(ws.evidenceStore.atoms.length).toBe(92);
    expect(
      ws.evidenceStore.atoms.filter(
        (a) => a.provenance.origin === "localiza-salud"
      ).length
    ).toBe(56);
  });
});
