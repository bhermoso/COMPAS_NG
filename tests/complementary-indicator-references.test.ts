/**
 * tests/complementary-indicator-references.test.ts
 *
 * Referencias comparativas y citación diagnóstica: cada indicador de los
 * estudios complementarios queda asociado a bloque, instrumento, valor
 * territorial/demo, referencia provincial, referencia autonómica declarada,
 * procedencia y cautela; y la narrativa cita indicadores trazadores.
 *
 * Corrección conceptual protegida: las referencias comparativas NO están
 * contenidas en los estudios complementarios — proceden de cálculos derivados
 * de microdatos EAS (o del monitor provincial IBSE). En demo, el valor
 * territorial coincide con la referencia provincial (demoProxy explícito) y
 * no constituye estimación específica del distrito. Andalucía se declara
 * calculable/pendiente, nunca se inventa.
 */

import { describe, it, expect, beforeAll } from "vitest";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { loadWorkspaceFromLocalStorage } from "../src/infrastructure/persistence/local-storage";
import { createMunicipalityRuntime } from "../src/application/runtime";
import {
  buildIndicatorComparisonReferences,
  interpretIndicatorComparison,
} from "../src/application/health-profile";
import type { ComplementaryIndicatorReferencesReading } from "../src/application/health-profile";
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
let lectura: ComplementaryIndicatorReferencesReading;

beforeAll(() => {
  store.set(
    "compas-ng:workspace:granada-zaidin",
    readFileSync(EXPORT_PATH, "utf8")
  );
  const loaded = loadWorkspaceFromLocalStorage("granada-zaidin");
  if (loaded === null) throw new Error("El export vigente no rehidrata");
  ws = loaded;
  psl = createMunicipalityRuntime({ workspace: ws }).psl;
  lectura = buildIndicatorComparisonReferences({ workspace: ws });
}, 60000);

// ══════════════════════════════════════════════════════════════════════════════
// 1-2. Estructura de referencia para los 23 indicadores
// ══════════════════════════════════════════════════════════════════════════════

describe("estructura de referencias comparativas", () => {
  it("los 23 indicadores reciben estructura de referencia comparativa", () => {
    expect(lectura.coverage.total).toBe(23);
    expect(lectura.coverage.conValorTerritorial).toBe(23);
  });

  it("cada indicador queda asociado a bloque, instrumento y procedencia", () => {
    for (const r of lectura.references) {
      expect(r.diagnosticBlockId.length).toBeGreaterThan(0);
      expect(r.diagnosticBlockTitle.length).toBeGreaterThan(0);
      expect(r.instrument.length).toBeGreaterThan(0);
      expect(r.source.length).toBeGreaterThan(0);
      expect(r.scaleCaution.length).toBeGreaterThan(0);
      expect(r.comparisonReading.length).toBeGreaterThan(0);
      // El título es el del átomo real de la evidencia, no un nombre inventado
      expect(
        ws.evidenceStore.atoms.some((a) => a.title === r.indicatorTitle)
      ).toBe(true);
    }
  });

  it("la cobertura declara lo que existe y lo que queda pendiente", () => {
    // 16 indicadores de instrumentos EAS/monitor provincial tienen referencia
    // provincial (coincidente en demo); el resto queda declarado pendiente.
    expect(lectura.coverage.conReferenciaProvincial).toBe(16);
    expect(lectura.coverage.conReferenciaAndalucia).toBe(0);
    expect(lectura.coverage.pendientesDeReferencia).toBe(7);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// 3-4. Proxy demo explícito y Andalucía declarada, no inventada
// ══════════════════════════════════════════════════════════════════════════════

describe("proxy demo y referencia autonómica honesta", () => {
  it("el proxy Granada/provincia en demo queda marcado explícitamente", () => {
    const conProxy = lectura.references.filter((r) => r.demoProxy);
    expect(conProxy.length).toBe(16);
    for (const r of conProxy) {
      expect(r.provinceReference).toBe(r.territorialValue);
      expect(r.comparisonReading).toContain("demo/proxy");
      expect(r.comparisonReading).toContain(
        "no constituye una estimación específica"
      );
    }
    // Los instrumentos municipales no fingen referencia provincial
    const auditc = lectura.references.find((r) => r.indicatorId === "auditc-positivo");
    expect(auditc!.demoProxy).toBe(false);
    expect(auditc!.provinceReference).toBeUndefined();
  });

  it("Andalucía aparece como calculable/pendiente, nunca como dato", () => {
    for (const r of lectura.references) {
      expect(r.andalusiaReference).toBeUndefined();
      expect(r.andalusiaLabel.length).toBeGreaterThan(0);
    }
    const duke = lectura.references.find((r) => r.indicatorId === "duke-apoyo-global");
    expect(duke!.andalusiaLabel).toContain("calculable desde microdatos EAS");
    expect(duke!.andalusiaLabel).toContain("pendiente");
  });

  it("la lectura comparativa general no sobredimensiona diferencias pequeñas", () => {
    // Fuera de demo: comparación prudente con tolerancia, sin causalidad.
    const similar = interpretIndicatorComparison({
      territorialValue: 49.3,
      provinceReference: 49.5,
      demoProxy: false,
      unit: "/100",
    });
    expect(similar).toContain("similar a");
    expect(similar).toContain("no implica causalidad");
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// 5-9. La narrativa cita indicadores, referencias y cautelas
// ══════════════════════════════════════════════════════════════════════════════

describe("narrativa — citación diagnóstica", () => {
  it("el Cap. III menciona indicadores trazadores con valor, no solo instrumentos", () => {
    const texto = psl.conclusiones.content;
    expect(texto).toContain("Indicadores trazadores por bloque");
    expect(texto).toContain("el índice total de bienestar socioemocional (IBSE) se sitúa en 76.2/100");
    expect(texto).toContain("el apoyo social funcional global (DUKE) se sitúa en 49.2/55");
    expect(texto).toContain("la inactividad en tiempo libre (IPAQ) se sitúa en 34.2 %");
  });

  it("el Cap. III menciona la referencia provincial/proxy de Granada y su cautela", () => {
    const texto = psl.conclusiones.content;
    expect(texto).toContain(
      "el valor territorial demo coincide con la referencia provincial de Granada"
    );
    expect(texto).toContain("comportamiento demo/proxy");
    expect(texto).toMatch(/no constituye una estimación específica del distrito/);
    expect(texto).toContain(
      "La referencia autonómica de Andalucía es calculable desde los mismos microdatos EAS"
    );
  });

  it("el Cap. IV ancla las hipótesis a indicadores trazadores citados", () => {
    const texto = psl.conclusiones.content;
    expect(texto).toContain(
      "Las hipótesis quedan ancladas a indicadores trazadores concretos"
    );
    expect(texto).toContain(
      "la hipótesis sobre condiciones psicosociales del entorno cotidiano se ancla en"
    );
    expect(texto).toContain("la salud mental percibida (SF-12, componente mental)");
  });

  it("el Cap. VI cita instrumentos concretos de los cinco bloques", () => {
    const texto = psl.conclusiones.content;
    const desde = texto.indexOf("apoyadas en indicadores trazadores concretos");
    expect(desde).toBeGreaterThan(-1);
    const cita = texto.slice(desde, desde + 700);
    expect(cita).toContain("IBSE");
    expect(cita).toContain("SF-12");
    expect(cita).toContain("DUKE");
    expect(cita).toContain("IPAQ");
    expect(cita).toContain("PREDIMED");
    expect(cita).toContain("cautela de escala");
  });

  it("el Cap. I declara la procedencia EAS de las referencias comparativas", () => {
    const texto = psl.conclusiones.content;
    expect(texto).toContain(
      "las referencias comparativas provincial y autonómica no forman parte de esos estudios"
    );
    expect(texto).toContain("proceden de cálculos derivados de microdatos EAS");
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// 10-13. Frontera de producto
// ══════════════════════════════════════════════════════════════════════════════

describe("frontera de producto", () => {
  it("no se atribuye a los estudios lo que procede de microdatos EAS", () => {
    const texto = psl.conclusiones.content + "\n" + psl.cierreInterpretativo.content;
    expect(texto).not.toContain("contenidos en los estudios complementarios");
    expect(texto).not.toContain("contenidas en los estudios complementarios");
  });

  it("sin causalidad demostrada, recomendaciones, actuaciones ni programas", () => {
    const texto = psl.conclusiones.content;
    expect(texto).toContain("Ninguna de estas lecturas constituye causalidad demostrada");
    expect(texto).not.toMatch(
      /demuestra que|causa directa|se recomienda|recomendamos|debe implantarse|programa de/i
    );
    for (const r of lectura.references) {
      expect(r.comparisonReading).not.toMatch(/demuestra|causa|se recomienda/i);
    }
  });

  it("la delegación de redacción desde cero sigue fuera del producto", () => {
    const textos = [
      psl.conclusiones.content,
      psl.cierreInterpretativo.content,
      psl.priorizacion.deliberacionNota,
    ].join("\n");
    expect(textos).not.toContain("El equipo técnico debe redactar aquí");
    expect(textos).not.toContain("Este capítulo no puede ser completado por el sistema");
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// 14. Línea vigente 56/92 intacta
// ══════════════════════════════════════════════════════════════════════════════

describe("línea vigente", () => {
  it("el expediente 56/92 permanece intacto tras las referencias comparativas", () => {
    expect(ws.repository.documents.length).toBe(20);
    expect(ws.evidenceStore.atoms.length).toBe(92);
    expect(
      ws.evidenceStore.atoms.filter(
        (a) => a.provenance.origin === "localiza-salud"
      ).length
    ).toBe(56);
  });
});
