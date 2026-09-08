/**
 * tests/informe-cobertura-prioritaria.test.ts
 *
 * Incremento 4 — ampliación selectiva y trazable de la cobertura epidemiológica
 * estructurada del Informe (N1). Recupera, por prioridad y sin inventar cifras:
 * envejecimiento/estructura demográfica (municipal-proxy), desigualdad material
 * (recuentos municipales), correspondencia territorial, EDO/brotes (recuentos
 * absolutos) y filas de cáncer antes omitidas. Verifica que no se confunden
 * escalas, que los recuentos no se convierten en tasas, que las tablas no
 * estructurables quedan registradas, y que N3 sigue funcionando y declarando
 * cobertura parcial.
 */

import { describe, it, expect, beforeAll } from "vitest";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { loadWorkspaceFromLocalStorage } from "../src/infrastructure/persistence/local-storage";
import {
  buildDiagnosticAnswers,
  buildIntegratedInterpretation,
  buildIntegratedSignalSets,
} from "../src/application/health-profile";
import type { DiagnosticAnswers } from "../src/application/health-profile";
import type { HealthReportStructuredReading } from "../src/domain/health-report";
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
let base: HealthReportStructuredReading;

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
  base = answers.sanitaria.baseEpidemiologica;
});

const findingsByKind = (kind: string) =>
  base.findings.filter((f) => f.kind === kind);

// ══════════════════════════════════════════════════════════════════════════════
// Auditoría y estructuración de tablas
// ══════════════════════════════════════════════════════════════════════════════

describe("auditoría y estructuración de tablas", () => {
  it("1+12. cada tabla tiene estado de estructuración; las no interpretables quedan registradas con motivo", () => {
    for (const t of base.tables) {
      expect(t.structuringStatus).toBeDefined();
      if (t.structuringStatus === "detected-not-structured") {
        expect(t.notStructuredReason, t.tableReference).toBeTruthy();
      }
    }
    // Hay tablas de las tres clases (detectar ≠ reconocer ≠ estructurar).
    const status = base.tables.map((t) => t.structuringStatus);
    expect(status).toContain("structured");
    expect(status).toContain("detected-not-structured");
  });

  it("15+16. structuredTableCount sube solo con hallazgos; recognized ≠ structured", () => {
    const c = buildIntegratedInterpretation(answers).coverage;
    expect(c.detectedTableCount).toBe(23);
    expect(c.recognizedTableCount).toBeGreaterThan(c.structuredTableCount);
    // Cada tabla estructurada tiene realmente un hallazgo que la referencia.
    const refs = new Set(
      base.findings.map((f) => f.source.tableReference).filter(Boolean)
    );
    for (const t of base.tables) {
      if (t.structuringStatus === "structured") {
        expect(refs.has(t.tableReference), t.tableReference).toBe(true);
      }
    }
  });

  it("14. la cobertura se recalcula desde datos reales y sigue siendo parcial", () => {
    const c = buildIntegratedInterpretation(answers).coverage;
    expect(c.structuredFindingCount).toBe(
      base.findings.filter((f) => f.kind !== "textual-agenda").length
    );
    expect(c.completeness).toBe("partial");
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// Prioridad 1-2: demografía y desigualdad material (escala municipal proxy)
// ══════════════════════════════════════════════════════════════════════════════

describe("demografía y desigualdad material", () => {
  it("2. el envejecimiento se estructura desde dato verificable", () => {
    const env = findingsByKind("demographic-indicator").find((f) =>
      f.topic.includes("envejecimiento")
    );
    expect(env).toBeDefined();
    expect(typeof env!.value).toBe("number");
    expect(env!.source.tableReference).toBeTruthy();
    expect(env!.source.textExcerpt).toBeTruthy();
  });

  it("3. los datos demográficos declaran escala municipal (proxy), no distrital", () => {
    const demo = findingsByKind("demographic-indicator");
    expect(demo.length).toBeGreaterThanOrEqual(2);
    for (const f of demo) {
      expect(f.geography.level).toBe("municipality");
      expect(f.geography.isProxyForTargetTerritory).toBe(true);
      expect(f.limitations.join(" ")).toMatch(/municipal|proxy/);
    }
  });

  it("4. la desigualdad material se estructura desde tabla, no se infiere de menciones", () => {
    const ineq = findingsByKind("material-inequality-indicator");
    expect(ineq.length).toBeGreaterThan(0);
    for (const f of ineq) {
      expect(f.interpretationStatus).toBe("documented-fact");
      expect(f.interpretationStatus).not.toBe("textual-presence");
      expect(f.source.tableReference).toBeTruthy();
      // Recuento absoluto o índice, nunca presentado como tasa.
      expect(f.unit).not.toMatch(/tasa|‰|por 100\.?000/i);
    }
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// Reglas de escala
// ══════════════════════════════════════════════════════════════════════════════

describe("reglas de escala", () => {
  it("5. una Unidad Asistencial no se convierte en distrito", () => {
    for (const f of base.findings) {
      const label = f.geography.label.toLowerCase();
      if (/u\.?\s*a\.?\s*zaid|zaid[ií]n centro|zaid[ií]n sur/.test(label)) {
        expect(f.geography.level, f.geography.label).toBe("health-care-unit");
      }
    }
  });

  it("6. un barrio/municipio no se confunde: la demografía es Granada capital, no una barriada", () => {
    for (const f of findingsByKind("demographic-indicator")) {
      // El municipio de referencia es Granada capital, no una barriada.
      expect(f.geography.level).toBe("municipality");
    }
    // Las barriadas viven como correspondencia territorial, no como hallazgo con valor.
    const barriadaComoHallazgo = base.findings.some((f) =>
      /barriada|albaic[ií]n|sacromonte/i.test(f.geography.label)
    );
    expect(barriadaComoHallazgo).toBe(false);
  });

  it("7. el distrito sanitario no se confunde con el distrito municipal/censal", () => {
    // La correspondencia territorial usa distrito censal; los eventos EDO usan
    // el distrito (Zaidín-Vergeles). El distrito sanitario (DS Granada-Metrop.)
    // NO se toma como fila demográfica del municipio.
    for (const f of findingsByKind("demographic-indicator")) {
      expect(f.geography.label.toLowerCase()).not.toMatch(/ds granada|distrito sanitario|provincia/);
    }
    // La correspondencia territorial existe y relaciona centro de salud y distrito censal.
    expect(base.territorialCorrespondences.length).toBeGreaterThan(0);
    expect(
      base.territorialCorrespondences.some(
        (c) => c.censusDistrict !== undefined && c.neighbourhoods.length > 0
      )
    ).toBe(true);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// Prioridad 4: EDO y brotes (recuentos absolutos, nunca tasas)
// ══════════════════════════════════════════════════════════════════════════════

describe("EDO, alertas y brotes", () => {
  it("8. la EDO se estructura solo cuando es interpretable (eventos, territorio, periodo)", () => {
    const events = findingsByKind("epidemiological-event");
    expect(events.length).toBeGreaterThan(0);
    for (const f of events) {
      expect(typeof f.value).toBe("number");
      expect(f.value as number).toBeGreaterThan(0);
      expect(f.period).toBeTruthy();
      expect(f.geography.label).toBeTruthy();
    }
  });

  it("9+10. los casos absolutos no se convierten en tasas y declaran ausencia de denominador", () => {
    for (const f of findingsByKind("epidemiological-event")) {
      expect(f.unit).toMatch(/recuento absoluto|eventos/);
      expect(f.unit).not.toMatch(/tasa|‰|por 100\.?000/i);
      expect(f.limitations.join(" ").toLowerCase()).toMatch(
        /sin denominador|no comparable|recuento absoluto/
      );
    }
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// Prioridad 5: cáncer restante con trazabilidad
// ══════════════════════════════════════════════════════════════════════════════

describe("cobertura restante de cáncer", () => {
  it("11. las filas de cáncer nuevas se estructuran con trazabilidad completa", () => {
    const cancer = base.findings.filter((f) =>
      f.topic.startsWith("incidencia de cáncer:")
    );
    // Antes eran 4 (Mama, Colón-Recto, Próstata, Total); ahora más filas.
    expect(cancer.length).toBeGreaterThan(4);
    for (const f of cancer) {
      expect(f.source.tableReference).toBeTruthy();
      expect(f.source.textExcerpt).toBeTruthy();
      expect(f.unit).toMatch(/por 100\.?000|estandarizada/);
    }
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// N1: separación de estatus; N3: sigue funcionando y declara no exhaustividad
// ══════════════════════════════════════════════════════════════════════════════

describe("estatus epistemológico y continuidad de N3", () => {
  it("13. la presencia textual no se eleva a documented-fact", () => {
    const textual = findingsByKind("textual-agenda");
    expect(textual.length).toBeGreaterThan(0);
    for (const f of textual) {
      expect(f.interpretationStatus).toBe("textual-presence");
      expect(f.interpretationStatus).not.toBe("documented-fact");
    }
    // Y ningún hallazgo estructurado nuevo es textual-presence.
    for (const kind of [
      "demographic-indicator",
      "material-inequality-indicator",
      "epidemiological-event",
    ]) {
      for (const f of findingsByKind(kind)) {
        expect(f.interpretationStatus).toBe("documented-fact");
      }
    }
  });

  it("17+18. N3 sigue funcionando y declara la cobertura como parcial y no exhaustiva", () => {
    const interp = buildIntegratedInterpretation(answers);
    expect(interp.units.length).toBeGreaterThanOrEqual(6);
    expect(interp.coverage.completeness).toBe("partial");
    expect(interp.nonExhaustiveNotice.toLowerCase()).toMatch(
      /no son una reproducción exhaustiva|parcial/
    );
    // El scope refleja los dominios recuperados.
    const scope = interp.coverage.extractionScope.join(" ").toLowerCase();
    expect(scope).toMatch(/demográfica|demografica/);
    expect(scope).toMatch(/desigualdad material/);
    expect(scope).toMatch(/edo|brotes/);
  });

  it("19. la primacía local de los estudios no cambia", () => {
    const sets = buildIntegratedSignalSets(answers);
    const sueno = sets.find((s) => s.dimension === "sueno")!;
    expect(sueno.primary.id).toBe("trazador-psqi-positivo");
    expect(sueno.primary.esLocal).toBe(true);
    const alcohol = sets.find((s) => s.dimension === "alcohol")!;
    expect(alcohol.primary.id).toBe("trazador-auditc-positivo");
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// Fronteras
// ══════════════════════════════════════════════════════════════════════════════

describe("fronteras", () => {
  it("20. el expediente 56/92 permanece intacto", () => {
    expect(ws.repository.documents.length).toBe(20);
    expect(ws.evidenceStore.atoms.length).toBe(92);
    expect(
      ws.evidenceStore.atoms.filter(
        (a) => a.provenance.origin === "localiza-salud"
      ).length
    ).toBe(56);
  });

  it("21+22. BADEA y Localiza Salud no cambian", () => {
    // BADEA sigue siendo contexto en las señales integradas.
    expect(answers.badeaContexto).toBeDefined();
    // Localiza Salud (activos): 56 átomos intactos.
    expect(
      ws.evidenceStore.atoms.filter(
        (a) => a.provenance.origin === "localiza-salud"
      ).length
    ).toBe(56);
  });
});
