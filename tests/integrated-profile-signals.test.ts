/**
 * tests/integrated-profile-signals.test.ts
 *
 * Matriz epistemológica del Perfil (marco científico: Popay como eje;
 * determinantes/desigualdades; salutogénesis y activos; lugar; género y
 * cuidados; inferencia causal prudente) y contrato visual.
 *
 * Verifica sobre datos REALES del expediente vigente 56/92 que cada señal
 * integrada lleva su cadena completa: fuente → escala → desigualdad →
 * mecanismo → capacidad → estatus causal → pregunta para el Grupo Motor.
 */

import { describe, it, expect, beforeAll } from "vitest";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { loadWorkspaceFromLocalStorage } from "../src/infrastructure/persistence/local-storage";
import {
  buildDiagnosticAnswers,
  buildIntegratedProfileSignals,
  buildIntegratedMatrix,
  SCIENTIFIC_PRINCIPLES,
  CAUSAL_STATUS_LABEL,
  VISUAL_CONTRACT_RULES,
  VISUAL_PROHIBITIONS,
  visualCaption,
} from "../src/application/health-profile";
import type { IntegratedHealthProfileSignal } from "../src/application/health-profile";
import type { MunicipalityWorkspace } from "../src/domain/workspace";

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
let signals: IntegratedHealthProfileSignal[];

beforeAll(() => {
  store.set(
    "compas-ng:workspace:granada-zaidin",
    readFileSync(EXPORT_PATH, "utf8")
  );
  const loaded = loadWorkspaceFromLocalStorage("granada-zaidin");
  if (loaded === null) throw new Error("El export vigente no rehidrata");
  ws = loaded;
  const answers = buildDiagnosticAnswers({
    workspace: ws,
    determinantTitles: [],
    assets: ws.evidenceStore.atoms
      .filter((a) => a.kind === "asset")
      .map((a) => ({ title: a.title, content: a.content })),
  });
  signals = buildIntegratedProfileSignals(answers);
}, 60000);

// ══════════════════════════════════════════════════════════════════════════════
// Marco científico operativo
// ══════════════════════════════════════════════════════════════════════════════

describe("marco científico — reglas operativas", () => {
  it("recoge los nueve ejes del marco con regla operativa verificable", () => {
    expect(SCIENTIFIC_PRINCIPLES).toHaveLength(9);
    const marcos = SCIENTIFIC_PRINCIPLES.map((p) => p.marco).join(" | ");
    for (const autor of [
      "Popay",
      "Marmot",
      "Dahlgren-Whitehead",
      "Krieger",
      "Borrell",
      "Bambra",
      "Antonovsky",
      "Cofiño",
      "Cassetti",
      "Ruiz Cantero",
      "García-Calvente",
      "Macintyre",
      "Segura del Pozo",
      "Hernán/Robins",
    ]) {
      expect(marcos).toContain(autor);
    }
    for (const p of SCIENTIFIC_PRINCIPLES) {
      expect(p.reglaOperativa.length).toBeGreaterThan(40);
    }
  });

  it("la taxonomía de estatus causal es cerrada y prudente", () => {
    expect(Object.keys(CAUSAL_STATUS_LABEL)).toEqual([
      "presencia-textual",
      "descriptivo",
      "hipotesis-plausible",
      "a-contrastar",
      "no-evaluable",
    ]);
    expect(CAUSAL_STATUS_LABEL["presencia-textual"]).toContain("no prevalencia");
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// Señales integradas: cadena epistemológica completa
// ══════════════════════════════════════════════════════════════════════════════

describe("señales integradas — cadena completa por señal", () => {
  it("integra señales del Informe, trazadores y contexto BADEA", () => {
    expect(signals.length).toBeGreaterThanOrEqual(15);
    expect(signals.some((s) => s.id.startsWith("informe-"))).toBe(true);
    expect(signals.some((s) => s.id.startsWith("trazador-"))).toBe(true);
    expect(signals.some((s) => s.id === "badea-grado-urbanizacion")).toBe(true);
  });

  it("cada señal tiene fuente, escala, valor y pregunta para el Grupo Motor", () => {
    for (const s of signals) {
      expect(s.fuente.length).toBeGreaterThan(3);
      expect(s.escala.length).toBeGreaterThan(3);
      expect(s.valor.length).toBeGreaterThan(0);
      expect(s.preguntaGrupoMotor).toMatch(/^¿.+\?$/);
    }
  });

  it("cada señal declara desigualdad conocida o desconocida; la ausencia de desagregación es incertidumbre", () => {
    for (const s of signals) {
      expect(["conocida", "desconocida-sin-desagregacion"]).toContain(
        s.desigualdad.distribucion
      );
    }
    // En el expediente actual no hay desagregaciones: todas desconocidas,
    // y la nota lo expresa como incertidumbre de equidad, no como equidad.
    const desconocidas = signals.filter(
      (s) => s.desigualdad.distribucion === "desconocida-sin-desagregacion"
    );
    expect(desconocidas.length).toBe(signals.length);
    for (const s of desconocidas) {
      expect(s.desigualdad.nota).toContain("no ausencia de desigualdad");
    }
  });

  it("cada señal tiene estatus causal prudente y válido", () => {
    for (const s of signals) {
      expect(Object.keys(CAUSAL_STATUS_LABEL)).toContain(s.estatusCausal);
    }
    // Ninguna señal reclama causalidad demostrada (no existe en la taxonomía)
    const texto = JSON.stringify(signals);
    expect(texto).not.toMatch(/causalidad demostrada|causa directa|demuestra que/i);
  });

  it("las menciones del Informe son presencia textual, nunca prevalencia", () => {
    const informe = signals.filter((s) => s.esMencionTextual);
    expect(informe.length).toBeGreaterThanOrEqual(8);
    for (const s of informe) {
      expect(s.estatusCausal).toBe("presencia-textual");
      expect(s.valor).toContain("presencia textual");
      expect(s.valor).not.toMatch(/%|prevalencia/i);
    }
  });

  it("los proxies quedan declarados como contexto, no estimación distrital", () => {
    const proxies = signals.filter((s) => s.esProxy);
    expect(proxies.length).toBeGreaterThan(0);
    for (const s of proxies) {
      expect(s.escala).toMatch(/proxy|contexto/);
      // Si menciona la estimación distrital, solo puede ser para negarla
      expect(s.escala).not.toMatch(/(?<!no )estimación distrital/);
    }
    const badea = signals.find((s) => s.id === "badea-grado-urbanizacion")!;
    expect(badea.escala).toContain("no estimación distrital");
  });

  it("los activos aparecen como capacidades potenciales con validación pendiente (Popay)", () => {
    const conActivo = signals.filter((s) => s.activoRelacionado !== undefined);
    expect(conActivo.length).toBeGreaterThan(0);
    for (const s of signals) {
      expect(s.validacionComunitariaPendiente).toBe(true);
    }
    // La matriz lo hace explícito por fila
    const answers = buildDiagnosticAnswers({
      workspace: ws,
      determinantTitles: [],
      assets: ws.evidenceStore.atoms
        .filter((a) => a.kind === "asset")
        .map((a) => ({ title: a.title, content: a.content })),
    });
    const matriz = buildIntegratedMatrix(answers);
    expect(matriz.length).toBe(signals.length);
    for (const fila of matriz) {
      expect(fila.senal.length).toBeGreaterThan(0);
      expect(fila.pregunta).toMatch(/^¿.+\?$/);
      if (!fila.activoCapacidad.startsWith("sin capacidad")) {
        expect(fila.activoCapacidad).toContain("capacidad potencial");
        expect(fila.activoCapacidad).toContain("pendiente de validación comunitaria");
      }
    }
  });

  it("las señales con mecanismo lo toman de las hipótesis reales, trazables", () => {
    const conMecanismo = signals.filter((s) => s.mecanismoPlausible !== undefined);
    expect(conMecanismo.length).toBeGreaterThan(0);
    for (const s of conMecanismo) {
      expect(s.mecanismoPlausible!.length).toBeGreaterThan(20);
    }
  });

  it("sin recomendaciones, actuaciones ni Plan de Acción en la capa integrada", () => {
    const texto = JSON.stringify(signals);
    expect(texto).not.toMatch(
      /se recomienda|recomendamos|debe implantarse|programa de|plan de acci[óo]n|actuaciones previstas/i
    );
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// Contrato visual
// ══════════════════════════════════════════════════════════════════════════════

describe("contrato visual — permitido y prohibido", () => {
  it("toda regla visual responde una pregunta diagnóstica y declara fuente de datos", () => {
    expect(VISUAL_CONTRACT_RULES.length).toBeGreaterThanOrEqual(6);
    for (const r of VISUAL_CONTRACT_RULES) {
      expect(r.pregunta).toMatch(/^¿.+\?$/);
      expect(r.fuenteDatos.length).toBeGreaterThan(3);
      expect(r.destino.length).toBeGreaterThan(0);
    }
    const ids = VISUAL_CONTRACT_RULES.map((r) => r.id);
    expect(ids).toContain("tabla-senales-informe");
    expect(ids).toContain("tabla-trazadores");
    expect(ids).toContain("matriz-deliberativa");
    // BADEA: ficha secundaria en anexo, nunca protagonista
    const badea = VISUAL_CONTRACT_RULES.find((r) => r.id === "ficha-badea")!;
    expect(badea.forma).toBe("ficha-secundaria");
    expect(badea.destino).toEqual(["anexo"]);
  });

  it("las prohibiciones cubren prevalencia falsa, proxy, series, desagregaciones, cobertura y BADEA", () => {
    const ids = VISUAL_PROHIBITIONS.map((p) => p.id);
    expect(ids).toEqual(
      expect.arrayContaining([
        "menciones-como-prevalencia",
        "proxy-como-hallazgo",
        "series-temporales",
        "desagregaciones-inexistentes",
        "activos-como-resultado",
        "badea-protagonista",
      ])
    );
  });

  it("el pie obligatorio compone fuente, escala y cautela", () => {
    const pie = visualCaption(
      "DUKE — duke-eas-granada.csv",
      "provincial (proxy contextual)",
      "no constituye estimación específica del distrito"
    );
    expect(pie).toContain("Fuente:");
    expect(pie).toContain("Escala:");
    expect(pie).toContain("Cautela:");
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// Línea vigente
// ══════════════════════════════════════════════════════════════════════════════

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
