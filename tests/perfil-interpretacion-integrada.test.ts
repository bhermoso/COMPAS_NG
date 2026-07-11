/**
 * tests/perfil-interpretacion-integrada.test.ts
 *
 * Nivel 3 — interpretación integrada. Cruza la agenda sanitaria del Informe
 * (N1, baseEpidemiológica) con las señales locales y contextuales de los
 * estudios (N2, signal sets), determinantes plausibles, desigualdades y
 * capacidades. Debe conservar trazabilidad, dar primacía local, mantener los
 * proxies como contexto, no fusionar señales distintas, no reenumerar el
 * Informe y no convertir hipótesis en hechos. La vista editorial (N4) consume
 * esta interpretación.
 */

import { describe, it, expect, beforeAll } from "vitest";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { loadWorkspaceFromLocalStorage } from "../src/infrastructure/persistence/local-storage";
import { createMunicipalityRuntime } from "../src/application/runtime";
import {
  buildDiagnosticAnswers,
  buildIntegratedInterpretation,
  buildIntegratedSignalSets,
  buildProfileIntegratedEditorialView,
  checkProfileWritingContract,
} from "../src/application/health-profile";
import type {
  DiagnosticAnswers,
  IntegratedInterpretation,
  IntegratedInterpretationUnit,
} from "../src/application/health-profile";
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
let answers: DiagnosticAnswers;
let interp: IntegratedInterpretation;

function unit(id: string): IntegratedInterpretationUnit {
  const u = interp.units.find((x) => x.id === id);
  if (u === undefined) throw new Error(`Sin unidad ${id}`);
  return u;
}

function localIds(u: IntegratedInterpretationUnit): string[] {
  return u.localSignals.map((s) => s.id);
}
function contextIds(u: IntegratedInterpretationUnit): string[] {
  return u.contextualSignals.map((s) => s.id);
}
function allSignalIds(u: IntegratedInterpretationUnit): string[] {
  return [
    ...u.localSignals,
    ...u.corroboratingSignals,
    ...u.contextualSignals,
  ].map((s) => s.id);
}

beforeAll(() => {
  store.set(
    "compas-ng:workspace:granada-zaidin",
    readFileSync(EXPORT_PATH, "utf8")
  );
  const loaded = loadWorkspaceFromLocalStorage("granada-zaidin");
  if (loaded === null) throw new Error("El export vigente no rehidrata");
  ws = loaded;
  answers = buildDiagnosticAnswers({
    workspace: ws,
    determinantTitles: [],
    assets: ws.evidenceStore.atoms
      .filter((a) => a.kind === "asset")
      .map((a) => ({ title: a.title, content: a.content })),
  });
  interp = buildIntegratedInterpretation(answers);
}, 60000);

// ══════════════════════════════════════════════════════════════════════════════
// N1 y N2 se consumen conjuntamente; nada queda huérfano
// ══════════════════════════════════════════════════════════════════════════════

describe("N3 consume N1 y N2", () => {
  it("1+2. cruza la base epidemiológica (N1) con las señales (N2)", () => {
    expect(interp.units.length).toBeGreaterThanOrEqual(6);
    // N1 deja de estar huérfana: hay unidades con hallazgos del Informe.
    expect(
      interp.units.some((u) => u.traceability.sanitaryFindingIds.length > 0)
    ).toBe(true);
    // N2 deja de estar huérfano: hay unidades con señales de estudios.
    expect(interp.units.some((u) => allSignalIds(u).length > 0)).toBe(true);
  });

  it("3. buildIntegratedSignalSets alimenta la interpretación (no queda huérfano)", () => {
    const setDims = new Set(
      buildIntegratedSignalSets(answers).map((s) => s.dimension)
    );
    const usadas = new Set(
      interp.units.flatMap((u) => allSignalIds(u).map((id) => id))
    );
    // Las señales locales de N2 aparecen en la interpretación.
    expect(usadas.size).toBeGreaterThan(0);
    expect(setDims.size).toBeGreaterThan(0);
    expect(interp.unmappedLocalSignalIds).toHaveLength(0);
  });

  it("4. no copia la epidemiología del Informe como segundo informe", () => {
    for (const u of interp.units) {
      // La agenda se resume (temas + magnitud), no como listado exhaustivo.
      expect(u.sanitaryAgenda.topics.length).toBeLessThanOrEqual(6);
      if (u.sanitaryAgenda.magnitudeNote !== undefined) {
        // La magnitud es una frase corta, no una tabla volcada.
        expect(u.sanitaryAgenda.magnitudeNote.length).toBeLessThan(220);
      }
    }
    // Trazabilidad preserva los ids de hallazgo aunque no se enumeren en prosa.
    const cron = unit("cronicidad-condiciones-de-vida");
    expect(cron.traceability.sanitaryFindingIds.length).toBeGreaterThan(3);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// Primacía local y contexto
// ══════════════════════════════════════════════════════════════════════════════

describe("primacía local y contexto", () => {
  it("5. una señal local desplaza al proxy como evidencia principal", () => {
    const sm = unit("salud-mental-infravalorada");
    expect(localIds(sm)[0]).toBe("trazador-ghq12-positivo");
    // El proxy (SF-12 MCS, Sueño EAS) queda como contexto, no como principal.
    expect(contextIds(sm)).toContain("trazador-sf12-mcs");
    expect(localIds(sm)).not.toContain("trazador-sf12-mcs");
  });

  it("6. el proxy se conserva como contexto declarado, no se descarta", () => {
    const sm = unit("salud-mental-infravalorada");
    for (const s of sm.contextualSignals) {
      expect(s.esLocal).toBe(false);
      expect(s.caution).toContain("contexto");
    }
    expect(sm.contextualSignals.length).toBeGreaterThan(0);
  });

  it("13. las muestras pequeñas conservan su cautela exploratoria", () => {
    const consumos = unit("consumos-tabaco-alcohol");
    for (const s of consumos.localSignals) {
      expect(s.sampleSize).toBeGreaterThan(0);
      expect(s.caution).toContain("no representativa");
      expect(s.caution).toContain("requiere contraste comunitario");
    }
  });

  it("11. Fagerström no se convierte en prevalencia distrital", () => {
    const consumos = unit("consumos-tabaco-alcohol");
    const fager = [...consumos.localSignals, ...consumos.corroboratingSignals].find(
      (s) => s.id === "trazador-fagerstrom-positivo"
    );
    expect(fager).toBeDefined();
    expect(fager!.scale).toContain("muestra local exploratoria");
    expect(fager!.scale).not.toMatch(/prevalencia|estimación distrital/i);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// Señales distintas no se fusionan
// ══════════════════════════════════════════════════════════════════════════════

describe("señales distintas no se fusionan", () => {
  it("7. GHQ-12 y PHQ-9 conviven distintas en salud mental", () => {
    const ids = allSignalIds(unit("salud-mental-infravalorada"));
    expect(ids).toContain("trazador-ghq12-positivo");
    expect(ids).toContain("trazador-phq9-positivo");
    expect(ids.filter((id) => id === "trazador-ghq12-positivo")).toHaveLength(1);
  });

  it("8. PSQI y Sueño EAS no se fusionan (local principal, EAS contexto)", () => {
    const sm = unit("salud-mental-infravalorada");
    const ids = allSignalIds(sm);
    expect(ids).toContain("trazador-psqi-positivo");
    expect(ids).toContain("trazador-sueno-insuficiente");
    // PSQI es local; Sueño EAS es contexto: no la misma cifra.
    expect(contextIds(sm)).toContain("trazador-sueno-insuficiente");
    expect(localIds(sm).concat(sm.corroboratingSignals.map((s) => s.id))).toContain(
      "trazador-psqi-positivo"
    );
  });

  it("9. SBQ e IPAQ no se fusionan (dimensiones distintas)", () => {
    const cron = unit("cronicidad-condiciones-de-vida");
    const ids = allSignalIds(cron);
    expect(ids).toContain("trazador-sbq-sedentario"); // local principal
    expect(ids).toContain("trazador-ipaq-inactividad"); // contexto
    expect(localIds(cron)).toContain("trazador-sbq-sedentario");
    expect(contextIds(cron)).toContain("trazador-ipaq-inactividad");
  });

  it("10. AUDIT-C y CAGE no se fusionan (local principal, CAGE contexto)", () => {
    const consumos = unit("consumos-tabaco-alcohol");
    expect(localIds(consumos)).toContain("trazador-auditc-positivo");
    expect(contextIds(consumos)).toContain("trazador-cage-riesgo");
  });

  it("12. PREDIMED no desplaza los consumos locales (dimensiones separadas)", () => {
    const consumos = unit("consumos-tabaco-alcohol");
    // AUDIT-C y Fagerström locales encabezan; PREDIMED no está en este cruce.
    expect(localIds(consumos)).toContain("trazador-auditc-positivo");
    expect(allSignalIds(consumos)).not.toContain("trazador-predimed-adherencia");
    // PREDIMED aparece como contexto en su propia dimensión (alimentación).
    const alim = unit("alimentacion-sobrepeso");
    expect(contextIds(alim)).toContain("trazador-predimed-adherencia");
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// Determinantes, desigualdades, capacidades
// ══════════════════════════════════════════════════════════════════════════════

describe("determinantes, desigualdades y capacidades", () => {
  it("16. los determinantes se formulan como plausibles, no como causales", () => {
    for (const u of interp.units) {
      const r = u.reasoning.toLowerCase();
      if (u.plausibleDeterminants.length > 0) {
        expect(r).toMatch(
          /mecanismo plausible|hipótesis a contrastar|por contrastar/
        );
      }
    }
    // Sin causalidad fuerte en toda la interpretación.
    expect(checkProfileWritingContract(JSON.stringify(interp))).toEqual([]);
    expect(JSON.stringify(interp)).not.toMatch(
      /demuestra que|causa directa|relación causal confirmada/i
    );
  });

  it("15. la ausencia de desagregación es incertidumbre central, no marginal", () => {
    expect(interp.centralUncertainty.toLowerCase()).toMatch(
      /barrios|unidades asistenciales|desagregaci/
    );
    // Cada unidad declara al menos una incertidumbre sustantiva.
    for (const u of interp.units) {
      expect(u.inequalitiesOrUncertainties.length).toBeGreaterThan(0);
    }
    // Las unidades a escala municipal citan la limitación de escala del Informe.
    const mort = unit("mortalidad-escala-desigualdad");
    expect(mort.inequalitiesOrUncertainties.join(" ").toLowerCase()).toMatch(
      /barrios|unidades asistenciales|escala/
    );
  });

  it("17. las capacidades salutogénicas no se presentan como resultados probados", () => {
    for (const u of interp.units) {
      if (u.salutogenicCapacities.length > 0) {
        expect(u.reasoning).toMatch(
          /potenciales mientras no se conozca su acceso, uso y resultado/
        );
      }
    }
    // Nunca se afirma cobertura/uso/resultado efectivos.
    expect(JSON.stringify(interp)).not.toMatch(
      /cobertura garantizada|uso acreditado|resultado probado/i
    );
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// Trazabilidad y estatus epistemológico
// ══════════════════════════════════════════════════════════════════════════════

describe("trazabilidad y estatus", () => {
  it("18. cada interpretación conserva trazabilidad al Informe y a las señales", () => {
    for (const u of interp.units) {
      const t = u.traceability;
      // Origen: o hay hallazgos del Informe, o señales de estudio (o ambos).
      expect(
        t.sanitaryFindingIds.length + allSignalIds(u).length
      ).toBeGreaterThan(0);
      // La naturaleza de la afirmación consta.
      expect([
        "integrated-interpretation",
        "plausible-hypothesis",
        "open-question",
      ]).toContain(u.epistemicStatus);
    }
    // El estatus de nivel de hallazgo (N1) se conserva en la trazabilidad.
    const cron = unit("cronicidad-condiciones-de-vida");
    expect(cron.traceability.sanitaryFindingStatuses.length).toBeGreaterThan(0);
  });

  it("salud mental sale como open-question: el Informe apenas la nombra", () => {
    const sm = unit("salud-mental-infravalorada");
    expect(sm.sanitaryAgenda.presence).toBe("textual-only");
    expect(sm.epistemicStatus).toBe("open-question");
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// El Perfil (N4) consume N3
// ══════════════════════════════════════════════════════════════════════════════

describe("el Perfil consume N3", () => {
  it("19. la vista editorial expone la interpretación y deriva sus hilos de ella", () => {
    const view = buildProfileIntegratedEditorialView(answers, {
      territory: ws.municipality.identity.name,
      status: "Documento de trabajo",
      informeTitulo: "Informe de salud de El Zaidín",
    });
    expect(view.interpretation.units.length).toBe(interp.units.length);
    // Los hilos territoriales SON las unidades de interpretación.
    expect(view.territorialReadings.map((b) => b.id)).toEqual(
      view.interpretation.units.map((u) => u.id)
    );
    // Cada hilo lleva el estatus del cruce (Nivel 3).
    for (const block of view.territorialReadings) {
      expect(block.epistemicStatus).toBeDefined();
    }
  });

  it("20. la lectura no depende ya de cinco preferredSignalId por tema", () => {
    const source = readFileSync(
      resolve(
        dirname(fileURLToPath(import.meta.url)),
        "../src/application/health-profile/profileIntegratedEditorialView.ts"
      ),
      "utf8"
    );
    // La construcción principal de hilos usa la interpretación integrada.
    expect(source).toContain("buildIntegratedInterpretation");
    expect(source).toContain("interpretation.units.map");
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// Fronteras
// ══════════════════════════════════════════════════════════════════════════════

describe("fronteras", () => {
  it("21. el expediente 56/92 permanece intacto", () => {
    expect(ws.repository.documents.length).toBe(20);
    expect(ws.evidenceStore.atoms.length).toBe(92);
    expect(
      ws.evidenceStore.atoms.filter(
        (a) => a.provenance.origin === "localiza-salud"
      ).length
    ).toBe(56);
  });

  it("22. BADEA sigue siendo contexto, no protagoniza ninguna unidad", () => {
    for (const u of interp.units) {
      expect(allSignalIds(u)).not.toContain("badea-grado-urbanizacion");
    }
  });

  it("23. Localiza Salud (activos) no se reprocesa: solo lectura salutogénica prudente", () => {
    // Las capacidades citadas son ámbitos ya disponibles, sin cobertura afirmada.
    const conCapacidad = interp.units.filter(
      (u) => u.salutogenicCapacities.length > 0
    );
    expect(conCapacidad.length).toBeGreaterThan(0);
    expect(JSON.stringify(interp)).not.toMatch(
      /56 activos (cubren|garantizan|aseguran)/i
    );
  });
});
