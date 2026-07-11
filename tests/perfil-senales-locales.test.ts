/**
 * tests/perfil-senales-locales.test.ts
 *
 * Recuperación de las señales locales de los estudios complementarios.
 *
 * Antes, `tracerPriority` actuaba como filtro de conocimiento: solo 8 de 23
 * indicadores llegaban al modelo integrado, y cuatro estudios LOCALES (GHQ-12,
 * PHQ-9, PSQI, Fagerström) desaparecían sin explicación. Ahora toda referencia
 * con valor se convierte en señal; `tracerPriority` es jerarquía editorial de la
 * tabla, no un filtro. La selección de señal principal por dimensión favorece la
 * evidencia local y conserva los proxies como contexto, sin fusionar señales
 * distintas ni presentar muestras exploratorias como estimaciones distritales.
 */

import { describe, it, expect, beforeAll } from "vitest";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { loadWorkspaceFromLocalStorage } from "../src/infrastructure/persistence/local-storage";
import {
  buildDiagnosticAnswers,
  buildIntegratedProfileSignals,
  buildIntegratedSignalSets,
  buildProfileIntegratedEditorialView,
  checkProfileWritingContract,
} from "../src/application/health-profile";
import type {
  DiagnosticAnswers,
  IntegratedHealthProfileSignal,
  IntegratedSignalSet,
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

const LOCAL_STUDY_SIGNAL_IDS = [
  "trazador-auditc-positivo",
  "trazador-ghq12-positivo",
  "trazador-phq9-positivo",
  "trazador-psqi-positivo",
  "trazador-fagerstrom-positivo",
  "trazador-sbq-sedentario",
];

let ws: MunicipalityWorkspace;
let answers: DiagnosticAnswers;
let signals: IntegratedHealthProfileSignal[];
let sets: IntegratedSignalSet[];

function setForDimension(dimension: string): IntegratedSignalSet {
  const set = sets.find((s) => s.dimension === dimension);
  if (set === undefined) throw new Error(`Sin conjunto para ${dimension}`);
  return set;
}

function signalById(id: string): IntegratedHealthProfileSignal | undefined {
  return signals.find((s) => s.id === id);
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
  signals = buildIntegratedProfileSignals(answers);
  sets = buildIntegratedSignalSets(answers);
}, 60000);

// ══════════════════════════════════════════════════════════════════════════════
// Los estudios locales llegan al modelo y conservan su carácter
// ══════════════════════════════════════════════════════════════════════════════

describe("estudios locales — llegan al modelo integrado", () => {
  it("1. los seis estudios locales generan señal integrada", () => {
    for (const id of LOCAL_STUDY_SIGNAL_IDS) {
      const s = signalById(id);
      expect(s, id).toBeDefined();
      expect(s!.esLocal, id).toBe(true);
    }
    // Antes solo AUDIT-C y SBQ llegaban (tenían tracerPriority); ahora los seis.
    expect(signals.filter((s) => s.esLocal)).toHaveLength(6);
  });

  it("2. cada señal local conserva escala, muestra y cautela", () => {
    const refPorId = new Map(
      answers.referencias.references.map((r) => [`trazador-${r.indicatorId}`, r])
    );
    for (const id of LOCAL_STUDY_SIGNAL_IDS) {
      const s = signalById(id)!;
      expect(s.escala, id).toContain("muestra local");
      expect(s.tamanoMuestra, id).toBeGreaterThan(0);
      expect(s.caracterExploratorio, id).toBe(true);
      const ref = refPorId.get(id)!;
      expect(ref.esLocal).toBe(true);
      expect(ref.sampleSize).toBeGreaterThan(0);
      expect(ref.scaleCaution).toContain("no representativa");
    }
  });

  it("14. una muestra local exploratoria no se presenta como prevalencia distrital", () => {
    for (const id of LOCAL_STUDY_SIGNAL_IDS) {
      const s = signalById(id)!;
      expect(s.escala).not.toMatch(/prevalencia|estimación distrital|toda la población/i);
      expect(s.escala).toContain("no representativa");
    }
  });

  it("15. todas las referencias con valor están disponibles como señal (nada se descarta)", () => {
    const conValor = answers.referencias.references.filter(
      (r) => r.territorialValue !== undefined
    );
    for (const r of conValor) {
      expect(signalById(`trazador-${r.indicatorId}`), r.indicatorId).toBeDefined();
    }
    // El conjunto conserva todas las señales de cada dimensión.
    for (const set of sets) {
      const enPartes =
        1 + set.corroborating.length + set.contextual.length;
      expect(set.all.length, set.dimension).toBe(enPartes);
    }
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// Primacía local: el proxy no desplaza la medición local
// ══════════════════════════════════════════════════════════════════════════════

describe("primacía local — el proxy no desplaza lo local", () => {
  it("3. PSQI local es principal de «sueño»; Sueño EAS queda como contexto", () => {
    const sueno = setForDimension("sueno");
    expect(sueno.primary.id).toBe("trazador-psqi-positivo");
    expect(sueno.primary.esLocal).toBe(true);
    const contextIds = sueno.contextual.map((s) => s.id);
    expect(contextIds).toContain("trazador-sueno-insuficiente");
    expect(contextIds).toContain("trazador-sueno-no-descansa");
  });

  it("4. SBQ local es su propia dimensión, no lo absorbe IPAQ", () => {
    const sedentarismo = setForDimension("sedentarismo");
    expect(sedentarismo.primary.id).toBe("trazador-sbq-sedentario");
    const actividad = setForDimension("actividad-fisica");
    // IPAQ (actividad/inactividad) y SBQ (tiempo sedentario) no se mezclan.
    expect(actividad.all.map((s) => s.id)).not.toContain("trazador-sbq-sedentario");
    expect(actividad.dimension).not.toBe(sedentarismo.dimension);
  });

  it("13. la señal principal favorece lo local cuando la dimensión tiene local", () => {
    for (const set of sets) {
      if (set.all.some((s) => s.esLocal)) {
        expect(set.primary.esLocal, set.dimension).toBe(true);
      }
    }
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// Cada ámbito recibe sus estudios sin fusiones indebidas
// ══════════════════════════════════════════════════════════════════════════════

describe("ámbitos — receptores reales, sin fusión", () => {
  it("5. GHQ-12 y PHQ-9 llegan a salud mental, distintos entre sí", () => {
    const mental = setForDimension("salud-mental");
    const ids = mental.all.map((s) => s.id);
    expect(ids).toContain("trazador-ghq12-positivo");
    expect(ids).toContain("trazador-phq9-positivo");
    // Distintos: uno principal, otro corroborante; nunca fundidos en una cifra.
    expect(mental.primary.id).not.toBe(
      mental.corroborating[0]?.id ?? mental.primary.id
    );
  });

  it("6. Fagerström llega a consumos (tabaco), separado del alcohol", () => {
    const tabaco = setForDimension("tabaco");
    expect(tabaco.primary.id).toBe("trazador-fagerstrom-positivo");
    expect(tabaco.ambito).toBe("consumos-alimentacion-habitos");
    // No se mezcla tabaco con alcohol.
    expect(tabaco.dimension).not.toBe("alcohol");
  });

  it("7. AUDIT-C llega a consumos (alcohol) como señal principal local", () => {
    const alcohol = setForDimension("alcohol");
    expect(alcohol.primary.id).toBe("trazador-auditc-positivo");
    expect(alcohol.ambito).toBe("consumos-alimentacion-habitos");
    // CAGE (provincial) queda como contexto, no se fusiona con AUDIT-C.
    expect(alcohol.contextual.map((s) => s.id)).toContain("trazador-cage-riesgo");
  });

  it("8. IBSE dispone de receptor real, con el factor Vínculo conservado", () => {
    const ibse = setForDimension("bienestar-socioemocional");
    expect(ibse.primary.id).toBe("trazador-ibse-indice-total");
    const disponibles = ibse.all.map((s) => s.id);
    expect(disponibles).toContain("trazador-ibse-factor-vinculo");
  });

  it("9. SF-12 MCS sigue disponible como contexto de salud mental", () => {
    const mental = setForDimension("salud-mental");
    expect(mental.all.map((s) => s.id)).toContain("trazador-sf12-mcs");
    // Con primary local, el proxy SF-12 MCS es contexto.
    expect(mental.contextual.map((s) => s.id)).toContain("trazador-sf12-mcs");
  });

  it("12. instrumentos distintos son señales distintas (no se fusionan)", () => {
    const consumos = sets.filter(
      (s) => s.ambito === "consumos-alimentacion-habitos"
    );
    const dims = new Set(consumos.map((s) => s.dimension));
    // Alcohol, tabaco y alimentación son dimensiones distintas del bloque.
    expect(dims.has("alcohol")).toBe(true);
    expect(dims.has("tabaco")).toBe(true);
    expect(dims.has("alimentacion")).toBe(true);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// Los proxies contextualizan; nunca estimación distrital
// ══════════════════════════════════════════════════════════════════════════════

describe("proxies — contexto, no estimación distrital", () => {
  it("10. las señales provinciales se etiquetan como proxy contextual", () => {
    const sueno = setForDimension("sueno");
    for (const s of sueno.contextual) {
      expect(s.esProxy).toBe(true);
      expect(s.escala).toContain("proxy contextual");
    }
  });

  it("11. ningún proxy se presenta como estimación específica del distrito", () => {
    for (const s of signals.filter((x) => x.esProxy)) {
      // Nunca afirma ser una estimación del distrito…
      expect(s.escala, s.id).not.toMatch(/estimación (específica )?del distrito(?! —| ni)/i);
      // …y declara explícitamente su carácter de contexto (proxy o municipio
      // matriz), cada fuente con su redacción honesta.
      expect(s.escala, s.id).toMatch(/proxy contextual|contexto del municipio|no estimación distrital/);
    }
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// Fronteras e integridad
// ══════════════════════════════════════════════════════════════════════════════

describe("fronteras e integridad", () => {
  it("17. BADEA sigue presente como contexto municipal, sin alterar", () => {
    const badea = signalById("badea-grado-urbanizacion");
    expect(badea).toBeDefined();
    expect(badea!.esProxy).toBe(true);
    expect(badea!.ambito).toBe("badea");
    // BADEA no compite por primacía de dimensión de estudio.
    expect(sets.some((set) => set.all.includes(badea!))).toBe(false);
  });

  it("18. las señales del Informe siguen siendo presencia textual", () => {
    const informe = signals.filter((s) => s.esMencionTextual);
    expect(informe.length).toBeGreaterThanOrEqual(5);
    for (const s of informe) {
      expect(s.valor).toContain("presencia textual");
      expect(s.esProxy).toBe(false);
      expect(s.esLocal).toBe(false);
    }
  });

  it("19. la vista canónica sigue sin violaciones del contrato de escritura", () => {
    const view = buildProfileIntegratedEditorialView(answers, {
      territory: ws.municipality.identity.name,
      status: "Documento de trabajo",
      informeTitulo: "Informe de salud de El Zaidín",
    });
    expect(checkProfileWritingContract(JSON.stringify(view))).toEqual([]);
    // Correctitud: el recuento de trazadores del cierre es el real (8), no 6.
    const contrastar = view.closing.find((c) => c.id === "sabemos");
    const texto = contrastar!.items.join(" ");
    expect(texto).toContain("8 indicadores trazadores");
  });

  it("16. el expediente 56/92 permanece intacto", () => {
    expect(ws.repository.documents.length).toBe(20);
    expect(ws.evidenceStore.atoms.length).toBe(92);
    expect(
      ws.evidenceStore.atoms.filter(
        (a) => a.provenance.origin === "localiza-salud"
      ).length
    ).toBe(56);
  });
});
