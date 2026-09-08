/**
 * tests/badea-municipal-context.test.ts
 *
 * Primer contexto BADEA/IECA real incorporado (consulta 19824, valores
 * verificados en las ejecuciones documentadas del piloto 2026-07-07).
 *
 * Protege:
 *   - Sincronía contrato TS ↔ fixture auditable (ningún valor inventado).
 *   - Doctrina de escala: Granada-Zaidín NO es municipio BADEA; sus datos
 *     son contexto del municipio matriz (Granada capital, INE 18087), proxy.
 *   - El Perfil narra el contexto con cautela y sin reducir incertidumbres.
 *   - Capa no evidencial: el expediente 56/92 no cambia.
 */

import { describe, it, expect, beforeAll } from "vitest";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { loadWorkspaceFromLocalStorage } from "../src/infrastructure/persistence/local-storage";
import { createMunicipalityRuntime } from "../src/application/runtime";
import {
  getBadeaMunicipalContext,
  BADEA_CONSULTA_19824,
} from "../src/application/badea";
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

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const EXPORT_PATH = resolve(
  ROOT,
  "municipalities/granada-zaidin/exports/compas-ng-workspace-granada-zaidin.json"
);
const FIXTURE_PATH = resolve(ROOT, "fixtures/badea-19824-contexto-municipal.json");

interface FixtureMedida {
  indicador: string;
  valor: number;
  unidad: string;
}
interface FixtureRecord {
  territorio: string;
  ine: string;
  anio: string;
  escala: string;
  gradoUrbanizacion: string;
  medidas: FixtureMedida[];
}
interface Fixture {
  consulta: number;
  source: string;
  accessedAt: string;
  records: FixtureRecord[];
  cautelas: string[];
}

let fixture: Fixture;
let ws: MunicipalityWorkspace;
let psl: LocalHealthProfile;

beforeAll(() => {
  fixture = JSON.parse(readFileSync(FIXTURE_PATH, "utf8")) as Fixture;
  store.set(
    "compas-ng:workspace:granada-zaidin",
    readFileSync(EXPORT_PATH, "utf8")
  );
  const loaded = loadWorkspaceFromLocalStorage("granada-zaidin");
  if (loaded === null) throw new Error("El export vigente no rehidrata");
  ws = loaded;
  psl = createMunicipalityRuntime({ workspace: ws }).psl;
}, 60000);

describe("contexto BADEA — contrato sincronizado con el fixture auditable", () => {
  it("el fixture real se localiza y parsea con la consulta y fuente esperadas", () => {
    expect(fixture.consulta).toBe(19824);
    expect(fixture.source).toBe("IECA");
    expect(fixture.accessedAt).toBe(BADEA_CONSULTA_19824.accessedAt);
    expect(fixture.records).toHaveLength(2);
  });

  it("los valores del contrato coinciden con el fixture: nada inventado", () => {
    const granadaFixture = fixture.records.find((r) => r.ine === "18087")!;
    const atarfeFixture = fixture.records.find((r) => r.ine === "18022")!;
    expect(granadaFixture.gradoUrbanizacion).toBe("Ciudades");
    expect(granadaFixture.medidas).toEqual([
      expect.objectContaining({
        indicador: "Porcentaje de población en centros urbanos",
        valor: 96.6,
        unidad: "%",
      }),
    ]);
    expect(atarfeFixture.gradoUrbanizacion).toBe("Zona de densidad intermedia");
    expect(atarfeFixture.medidas.map((m) => m.valor)).toEqual([0.0, 94.3, 5.7]);

    const granada = getBadeaMunicipalContext("granada-zaidin")!;
    const valores = new Map(
      granada.indicadores.map((i) => [i.indicador, i.valor])
    );
    expect(valores.get("Grado de urbanización según tipología de celda")).toBe(
      granadaFixture.gradoUrbanizacion
    );
    expect(valores.get("Porcentaje de población en centros urbanos")).toBe(
      granadaFixture.medidas[0].valor
    );
    const atarfe = getBadeaMunicipalContext("atarfe")!;
    expect(
      atarfe.indicadores
        .filter((i) => typeof i.valor === "number")
        .map((i) => i.valor)
    ).toEqual(atarfeFixture.medidas.map((m) => m.valor));
  });

  it("conserva fuente, escala, año, unidad, territorio y código INE", () => {
    const ctx = getBadeaMunicipalContext("granada-zaidin")!;
    for (const i of ctx.indicadores) {
      expect(i.fuente).toBe("BADEA/IECA");
      expect(i.consulta).toBe(19824);
      expect(i.anio).toBe("2024");
      expect(i.territorio).toBe("Granada (capital)");
      expect(i.codigoINE).toBe("18087");
      expect(i.escala).toBe("municipio");
      expect(i.dimension).toBe("contexto-sociodemografico");
      expect(i.cautelas.length).toBeGreaterThan(0);
    }
  });
});

describe("contexto BADEA — doctrina de escala territorial", () => {
  it("Granada-Zaidín no se trata como municipio BADEA: proxy del municipio matriz", () => {
    const ctx = getBadeaMunicipalContext("granada-zaidin")!;
    expect(ctx.esProxyMunicipioMatriz).toBe(true);
    expect(ctx.territorio).toBe("Granada (capital)");
    expect(ctx.codigoINE).toBe("18087");
    // Atarfe sí es municipio BADEA directo
    expect(getBadeaMunicipalContext("atarfe")!.esProxyMunicipioMatriz).toBe(false);
    // Ámbitos sin ejecución verificada: sin contexto, sin inventar
    expect(getBadeaMunicipalContext("zagra")).toBeUndefined();
    expect(getBadeaMunicipalContext("desconocido")).toBeUndefined();
  });
});

describe("contexto BADEA — impacto en el Perfil", () => {
  it("el capítulo II narra el contexto municipal con su cautela de escala", () => {
    const texto = psl.conclusiones.content;
    expect(texto).toContain(
      "Contexto municipal de referencia (BADEA/IECA, consulta 19824, año 2024)"
    );
    expect(texto).toContain("Granada (capital) (INE 18087)");
    expect(texto).toContain("«Ciudades»");
    expect(texto).toContain("96.6 %");
    expect(texto).toContain("municipio matriz");
    expect(texto).toContain(
      "no constituye una estimación específica del distrito"
    );
    // El dato municipal no reduce la incertidumbre de desagregación
    expect(texto).toContain("ni resuelve la falta de desagregación interna");
    expect(texto).toContain("no un indicio de equidad");
  });

  it("sin recomendaciones ni causalidad en la narrativa con BADEA", () => {
    expect(psl.conclusiones.content).not.toMatch(
      /se recomienda|recomendamos|debe implantarse|programa de|causa directa|demuestra que/i
    );
  });

  it("capa no evidencial: el expediente 56/92 permanece intacto", () => {
    expect(ws.repository.documents.length).toBe(20);
    expect(ws.evidenceStore.atoms.length).toBe(92);
    expect(
      ws.evidenceStore.atoms.filter(
        (a) => a.provenance.origin === "localiza-salud"
      ).length
    ).toBe(56);
  });
});
