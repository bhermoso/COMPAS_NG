/**
 * tests/informe-hilo-sanitario.test.ts
 *
 * El Informe de salud de El Zaidín como HILO SANITARIO del Perfil.
 *
 * Protege:
 *   - Denominación institucional visible (nunca «estilo Atarfe» ni nombres
 *     técnicos de archivo).
 *   - Lectura sustantiva del cuerpo del Informe por presencia real de
 *     señales sanitarias (nada inventado; magnitudes en el documento).
 *   - El Perfil comenta salud antes de ampliar hacia vida cotidiana; los
 *     estudios amplían el hilo, no lo sustituyen; BADEA queda detrás.
 *   - Las cautelas existen pero no dominan (recorte de redundancia).
 */

import { describe, it, expect, beforeAll } from "vitest";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { loadWorkspaceFromLocalStorage } from "../src/infrastructure/persistence/local-storage";
import { createMunicipalityRuntime } from "../src/application/runtime";
import {
  buildHealthReportSanitaryReading,
  institutionalHealthReportTitle,
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
let texto: string;

beforeAll(() => {
  store.set(
    "compas-ng:workspace:granada-zaidin",
    readFileSync(EXPORT_PATH, "utf8")
  );
  const loaded = loadWorkspaceFromLocalStorage("granada-zaidin");
  if (loaded === null) throw new Error("El export vigente no rehidrata");
  ws = loaded;
  psl = createMunicipalityRuntime({ workspace: ws }).psl;
  texto = psl.conclusiones.content;
}, 60000);

// ══════════════════════════════════════════════════════════════════════════════
// Denominación institucional del Informe
// ══════════════════════════════════════════════════════════════════════════════

describe("Informe de salud — denominación institucional", () => {
  it("el título visible es «Informe de salud de El Zaidín»", () => {
    expect(psl.healthReportTitle).toBe("Informe de salud de El Zaidín");
    expect(texto).toContain("Informe de salud de El Zaidín");
  });

  it("no aparecen nombres técnicos ni etiquetas históricas", () => {
    for (const salida of [texto, psl.healthReportTitle ?? ""]) {
      expect(salida).not.toContain("estilo Atarfe");
      expect(salida).not.toContain("Abril2023");
      expect(salida).not.toMatch(/\.docx/i);
    }
  });

  it("el saneado genérico funciona para municipios sin denominación registrada", () => {
    expect(
      institutionalHealthReportTitle("otro-municipio", "Informe de Salud de Otro estilo Atarfe.docx")
    ).toBe("Informe de Salud de Otro");
    expect(
      institutionalHealthReportTitle("otro-municipio", "Informe Local 2024.pdf")
    ).toBe("Informe Local 2024");
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// Lectura sanitaria por presencia real
// ══════════════════════════════════════════════════════════════════════════════

describe("Informe de salud — lectura sanitaria sustantiva", () => {
  it("el cuerpo del Informe está extraído y produce señales reales", () => {
    const lectura = buildHealthReportSanitaryReading(ws.healthReport);
    expect(lectura.present).toBe(true);
    expect(lectura.charCount).toBeGreaterThan(50000);
    const dimensiones = lectura.senales.map((s) => s.dimension);
    // Presencia verificada en el texto real del Informe del Zaidín
    expect(dimensiones).toContain("cáncer y tumores");
    expect(dimensiones).toContain("mortalidad y esperanza de vida");
    expect(dimensiones).toContain("prevención y vacunación");
    expect(dimensiones).toContain(
      "enfermedades crónicas (diabetes, hipertensión, cardiovascular)"
    );
    // Trazabilidad: cada señal lleva términos presentes y conteo > 0
    for (const s of lectura.senales) {
      expect(s.terminos.length).toBeGreaterThan(0);
      expect(s.menciones).toBeGreaterThan(0);
    }
    // Ordenadas por peso
    for (let i = 1; i < lectura.senales.length; i++) {
      expect(lectura.senales[i - 1].menciones).toBeGreaterThanOrEqual(
        lectura.senales[i].menciones
      );
    }
  });

  it("sin Informe, la lectura declara ausencia sin inventar", () => {
    const vacia = buildHealthReportSanitaryReading(undefined);
    expect(vacia.present).toBe(false);
    expect(vacia.senales).toEqual([]);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// El hilo sanitario gobierna el capítulo de situación
// ══════════════════════════════════════════════════════════════════════════════

describe("narrativa — hilo sanitario", () => {
  it("el Perfil comenta contenido sanitario sustantivo del Informe", () => {
    expect(texto).toContain("gobierna el hilo sanitario");
    expect(texto).toContain("cáncer y tumores");
    expect(texto).toContain("mortalidad y esperanza de vida");
    expect(texto).toContain("con atención destacada a");
  });

  it("el Informe no queda reducido a documento consultable", () => {
    expect(texto).not.toContain("debe consultarse en el documento original");
    expect(texto).toContain("preservado íntegro");
    expect(texto).toContain("las magnitudes concretas constan en el propio Informe");
  });

  it("orden del capítulo: hilo sanitario → vida cotidiana → bloques de estudios", () => {
    const hilo = texto.indexOf("gobierna el hilo sanitario");
    const vida = texto.indexOf(
      "La situación de salud se lee aquí como expresión de la vida cotidiana"
    );
    const bloques = texto.indexOf("no aportan solo");
    expect(hilo).toBeGreaterThan(-1);
    expect(hilo).toBeLessThan(vida);
    expect(vida).toBeLessThan(bloques);
  });

  it("los estudios amplían el hilo sanitario sin sustituirlo; BADEA queda detrás", () => {
    expect(texto).toContain(
      "amplían este hilo hacia la vida cotidiana y el bienestar, sin sustituirlo"
    );
    const hilo = texto.indexOf("gobierna el hilo sanitario");
    const badea = texto.indexOf("Contexto municipal de referencia (BADEA/IECA");
    expect(badea).toBeGreaterThan(-1);
    // El hilo sanitario del Cap. III llega tras el contexto del Cap. II, pero
    // el Informe (fuente primaria, Cap. I-II) precede siempre a BADEA.
    expect(texto.indexOf("Informe de salud de El Zaidín")).toBeLessThan(badea);
    expect(hilo).toBeGreaterThan(-1);
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// Cautelas presentes pero sin dominar
// ══════════════════════════════════════════════════════════════════════════════

describe("narrativa — cautela sin redundancia", () => {
  it("la cautela de escala se declara pocas veces y se referencia después", () => {
    const repeticiones = texto.match(/estimación específica del/g) ?? [];
    expect(repeticiones.length).toBeGreaterThanOrEqual(2); // Cap. I + BADEA
    expect(repeticiones.length).toBeLessThanOrEqual(3);
    // Las demás apariciones remiten a la cautela ya declarada
    expect(texto).toContain("cautela de escala del capítulo I");
  });

  it("las secciones sustantivas no abren por limitaciones", () => {
    // El capítulo de situación abre por el hilo sanitario, no por cautelas
    const hilo = texto.indexOf("gobierna el hilo sanitario");
    const primeraCautelaCapIII = texto.indexOf("cautela de escala del capítulo I");
    expect(hilo).toBeLessThan(primeraCautelaCapIII);
  });

  it("fronteras intactas: sin recomendaciones ni Plan de Acción", () => {
    expect(texto).not.toMatch(
      /se recomienda|recomendamos|debe implantarse|programa de|plan de acci[óo]n/i
    );
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
