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
    expect(vacia.baseEpidemiologica.present).toBe(false);
  });

  it("conserva el documento original intacto y añade una base epidemiológica derivada", () => {
    const originalText = ws.healthReport!.body.originalText;
    const originalSections = ws.healthReport!.sections.map((s) => ({
      title: s.title,
      bodyText: s.bodyText,
    }));
    const lectura = buildHealthReportSanitaryReading(ws.healthReport);

    expect(ws.healthReport!.body.originalText).toBe(originalText);
    expect(ws.healthReport!.sections.map((s) => ({ title: s.title, bodyText: s.bodyText }))).toEqual(
      originalSections
    );
    expect(lectura.baseEpidemiologica.present).toBe(true);
    expect(lectura.baseEpidemiologica.originalTextAvailable).toBe(true);
    expect(lectura.baseEpidemiologica.charCount).toBe(ws.healthReport!.body.charCount);
    expect(lectura.baseEpidemiologica.documentId).toBe(ws.healthReport!.linkedDocumentId);
  });

  it("recupera secciones sustantivas por anclas sin rellenar las secciones originales vacías", () => {
    const lectura = buildHealthReportSanitaryReading(ws.healthReport);
    const secciones = lectura.baseEpidemiologica.sections;
    expect(secciones.map((s) => s.title)).toEqual(
      expect.arrayContaining([
        "Enfermedades Crónicas",
        "Incidencia de Cáncer",
        "Cribados",
        "Estilos de Vida",
        "Mortalidad",
      ])
    );
    expect(secciones.find((s) => s.title === "Enfermedades Crónicas")!.bodyText.length).toBeGreaterThan(3000);
    expect(
      ws.healthReport!.sections.find((s) => s.title === "ANÁLISIS EPIDEMIOLÓGICO")!.bodyText.length
    ).toBeLessThan(100);
    expect(secciones.every((s) => s.reconstructionStatus === "from-text-anchors")).toBe(true);
  });

  it("reconoce tablas persistidas y extrae escalas de Zaidín Centro y Sur", () => {
    const base = buildHealthReportSanitaryReading(ws.healthReport).baseEpidemiologica;
    expect(base.originalTableCount).toBe(23);
    expect(base.tables.length).toBe(23);
    expect(base.tables.map((t) => t.recognizedTopic)).toEqual(
      expect.arrayContaining([
        "cribado colorrectal: participación",
        "cribado cáncer de mama",
        "cribado cáncer de cérvix",
        "proceso cáncer de próstata/HBP",
      ])
    );

    const colorrectal = base.findings.filter((f) => f.topic === "cribado colorrectal: participación");
    const centro = colorrectal.find((f) => f.geography.label === "U.A. Zaidín Centro");
    const sur = colorrectal.find((f) => f.geography.label === "U.A. Zaidín Sur");
    expect(centro?.value).toBe(43);
    expect(centro?.geography.level).toBe("health-care-unit");
    expect(centro?.geography.isProxyForTargetTerritory).toBe(true);
    expect(sur?.value).toBe(39);
    expect(sur?.geography.level).toBe("health-care-unit");
  });

  it("recupera magnitudes seleccionadas de crónicos, cribados, intervenciones y mortalidad", () => {
    const base = buildHealthReportSanitaryReading(ws.healthReport).baseEpidemiologica;
    const topics = base.findings.map((f) => f.topic);

    expect(topics).toEqual(expect.arrayContaining([
      "insuficiencia cardíaca",
      "hipertensión arterial",
      "diabetes mellitus",
      "EPOC",
      "demencias",
      "atención al paciente pluripatológico",
      "asma infantil",
      "cribado de cáncer de mama",
      "cribado de cáncer de cérvix",
      "proceso cáncer de próstata/HBP",
      "consejo dietético individual en adultos",
      "intervención avanzada individual para dejar el tabaco",
      "mortalidad general",
    ]));

    const epoc = base.findings.find((f) => f.topic === "EPOC")!;
    expect(epoc.kind).toBe("clinical-indicator");
    expect(epoc.interpretationStatus).toBe("document-authored-interpretation");
    expect(epoc.value).toContain("superior");
    expect(epoc.source.tableReference).toContain("EPOC");
    expect(epoc.limitations[0]).toContain("interpretación explícita del Informe");

    const mamaCentro = base.findings.find(
      (f) => f.topic === "cribado de cáncer de mama" && f.geography.label === "UA Zaidín Centro"
    )!;
    expect(mamaCentro.value).toBe(87);
    expect(mamaCentro.unit).toBe("% captación");

    const cervixSur = base.findings.find(
      (f) => f.topic === "cribado de cáncer de cérvix" && f.geography.label === "UA Zaidín Sur"
    )!;
    expect(cervixSur.value).toBeCloseTo(72.6);
    expect(cervixSur.numerator).toBe(6323);
    expect(cervixSur.denominator).toBe(8567);

    const tabacoCentro = base.findings.find(
      (f) => f.topic === "intervención avanzada individual para dejar el tabaco" &&
        f.geography.label === "UA Zaidín Centro"
    )!;
    expect(tabacoCentro.value).toBeCloseTo(10.7);
    expect(tabacoCentro.limitations[0]).toContain("no equivale a activo comunitario");

    const mortalidad = base.findings.find((f) => f.topic === "mortalidad general")!;
    expect(mortalidad.value).toBeCloseTo(10.6);
    expect(mortalidad.numerator).toBe(2444);
    expect(mortalidad.geography.level).toBe("municipality");
  });

  it("vincula las limitaciones declaradas por el Informe a cáncer y mortalidad", () => {
    const base = buildHealthReportSanitaryReading(ws.healthReport).baseEpidemiologica;
    expect(base.limitations.join("\n")).toMatch(/no (hay|existen) estadísticas oficiales/i);

    const cancer = base.findings.find((f) => f.topic === "incidencia de cáncer: Mama")!;
    expect(cancer.geography.level).toBe("municipality");
    expect(cancer.geography.isProxyForTargetTerritory).toBe(true);
    expect(cancer.limitations.join(" ")).toContain("barrios o Unidades Asistenciales");

    const mortalidad = base.findings.find((f) => f.topic === "mortalidad general")!;
    expect(mortalidad.limitations.join(" ")).toContain("barrios o Unidades Asistenciales");

    expect(base.findings.some((f) => f.kind === "declared-limitation")).toBe(true);
  });

  it("distingue mención textual, dato e interpretación explícita del Informe", () => {
    const lectura = buildHealthReportSanitaryReading(ws.healthReport);
    const base = lectura.baseEpidemiologica;

    const mencionCancer = base.findings.find(
      (f) => f.kind === "textual-agenda" && f.topic === "cáncer y tumores"
    )!;
    expect(mencionCancer.interpretationStatus).toBe("textual-presence");
    expect(mencionCancer.unit).toBe("menciones textuales");
    expect(mencionCancer.limitations[0]).toContain("no equivale a prevalencia");

    const datoCancer = base.findings.find((f) => f.topic === "incidencia de cáncer: Mama")!;
    expect(datoCancer.interpretationStatus).toBe("documented-fact");
    expect(datoCancer.unit).toContain("tasa bruta");

    const cronico = base.findings.find((f) => f.topic === "diabetes mellitus")!;
    expect(cronico.interpretationStatus).toBe("document-authored-interpretation");

    expect(base.findings[0].kind).not.toBe("textual-agenda");
    expect(lectura.senales[0].menciones).toBeGreaterThan(0);
  });

  it("la salida estructurada es determinista y no crea EvidenceAtoms ordinarios del Informe", () => {
    const a = buildHealthReportSanitaryReading(ws.healthReport).baseEpidemiologica;
    const b = buildHealthReportSanitaryReading(ws.healthReport).baseEpidemiologica;
    expect(a).toEqual(b);
    expect(ws.evidenceStore.atoms.some((atom) => atom.provenance.origin === "health-report")).toBe(false);
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
