/**
 * tests/ugc-clinical-assistance.test.ts
 *
 * Incremento 5B — N1b: señales clínico-asistenciales documentadas por UGC.
 *
 * Verifica que la lectura N1b se construye desde el workspace real (usando el
 * `sourceText` persistido en 5A), que produce 192 señales por UGC (384 en total)
 * conservando orden, área, UGC y fragmento fuente, con clasificación conservadora
 * y SIN inventar valores/periodos/denominadores/dirección, sin fijar el distrito
 * sanitario, sin agregar UGCs ni generar rankings; y que N1a, N3 y el Perfil
 * visible no cambian ni se crean EvidenceAtoms.
 */

import { describe, it, expect, beforeAll } from "vitest";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { loadWorkspaceFromLocalStorage } from "../src/infrastructure/persistence/local-storage";
import {
  buildUGCClinicalAssistanceReading,
  classifyUGCIndicator,
} from "../src/application/ugc-clinical-assistance";
import type { UGCClinicalAssistanceReading } from "../src/application/ugc-clinical-assistance";
import {
  buildDiagnosticAnswers,
  buildIntegratedInterpretation,
  buildProfileIntegratedEditorialView,
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

const AREAS = [
  "Atención durante toda la vida",
  "Atención a los Crónicos",
  "Información Municipal",
  "Información Usuarios BDU",
  "Mortalidad",
];

let ws: MunicipalityWorkspace;
let reading: UGCClinicalAssistanceReading;
let centroEste: UGCClinicalAssistanceReading["documents"][number];
let sur: UGCClinicalAssistanceReading["documents"][number];

beforeAll(() => {
  store.set("compas-ng:workspace:granada-zaidin", readFileSync(EXPORT_PATH, "utf8"));
  const loaded = loadWorkspaceFromLocalStorage("granada-zaidin");
  if (loaded === null) throw new Error("El export vigente no rehidrata");
  ws = loaded;
  reading = buildUGCClinicalAssistanceReading(ws);
  centroEste = reading.documents.find((d) => /Centro-?Este/i.test(d.ugc))!;
  sur = reading.documents.find((d) => /\bSur\b/i.test(d.ugc))!;
}, 60000);

describe("N1b — construcción desde el workspace real (integración)", () => {
  it("1-2. lee los dos documentos reales usando su sourceText", () => {
    expect(reading.present).toBe(true);
    expect(reading.documents.length).toBe(2);
    expect(centroEste).toBeTruthy();
    expect(sur).toBeTruthy();
    // Los documentos de origen son los territoriales, nunca el Informe (N1a).
    const territorialIds = new Set(
      ws.repository.documents
        .filter((d) => d.kind === "territorial-documentation")
        .map((d) => d.id)
    );
    for (const s of reading.signals) {
      expect(territorialIds.has(s.documentId)).toBe(true);
    }
  });

  it("3-4. extrae 192 señales de Centro-Este y 192 de Sur (384 en total)", () => {
    expect(centroEste.signalCount).toBe(192);
    expect(sur.signalCount).toBe(192);
    expect(reading.signals.length).toBe(384);
  });

  it("5. reconoce las cinco áreas en ambos documentos", () => {
    expect(centroEste.areas).toEqual(AREAS);
    expect(sur.areas).toEqual(AREAS);
    expect(centroEste.signalCountByArea).toEqual({
      "Atención durante toda la vida": 103,
      "Atención a los Crónicos": 75,
      "Información Municipal": 8,
      "Información Usuarios BDU": 5,
      Mortalidad: 1,
    });
  });

  it("6. conserva el orden documental (ordinal 1..192 consecutivo)", () => {
    const ordinals = centroEste.signals.map((s) => s.ordinal);
    expect(ordinals).toEqual([...Array(192)].map((_, i) => i + 1));
    // El primer indicador documental es el primero del texto.
    expect(centroEste.signals[0].indicatorName).toBe(
      "% Usuarios hiperfrecuentadores de Enfermería de Familia"
    );
  });

  it("7-9. conserva documentId, UGC y fragmento fuente literal", () => {
    const s = centroEste.signals[0];
    expect(s.documentId).toBe(centroEste.documentId);
    expect(s.ugc).toBe("Zaidín Centro-Este");
    expect(sur.signals[0].ugc).toBe("Zaidín Sur");
    expect(s.sourceFragment).toBe(
      "Indicador: % Usuarios hiperfrecuentadores de Enfermería de Familia"
    );
  });
});

describe("N1b — señal documental, no dato epidemiológico", () => {
  it("10. 'A mejorar' se conserva como clasificación documental (no interpretación)", () => {
    for (const s of reading.signals) {
      expect(s.documentClassification).toBe("a-mejorar");
      expect(s.documentClassificationStatus).toBe(
        "document-authored-classification"
      );
    }
  });

  it("11-14. no infiere dirección, ni valores, ni periodos, ni denominadores", () => {
    for (const s of reading.signals.slice(0, 50)) {
      const raw = s as unknown as Record<string, unknown>;
      expect("direction" in raw).toBe(false);
      expect("value" in raw).toBe(false);
      expect("referenceValue" in raw).toBe(false);
      expect("period" in raw).toBe(false);
      expect("exactDenominator" in raw).toBe(false);
    }
  });

  it("15-16. escala UGC; el Distrito queda como distrito sanitario no identificado", () => {
    for (const s of reading.signals) {
      expect(s.territorialScale).toBe("ugc");
      expect(s.referenceScope).toBe("unknown-sanitary-district");
      // La UGC no se convierte en distrito municipal / barrio / distrito sanitario.
      expect(["district", "municipality", "neighbourhood", "health-district"]).not.toContain(
        s.territorialScale as string
      );
    }
    expect(centroEste.ugc).not.toBe(ws.municipality.identity.name);
  });

  it("comparabilidad no evaluable en todas las señales", () => {
    for (const s of reading.signals) {
      expect(s.comparability).toBe("not-evaluable");
    }
  });
});

describe("N1b — clasificación conservadora por familias", () => {
  it("clasifica indicadores de distintas familias de forma reproducible", () => {
    const cases: Array<[string, string, string]> = [
      ["% Usuarios hiperfrecuentadores de Pediatría", "Atención durante toda la vida", "service-utilization"],
      ["Cobertura Medicina de Familia (UGC)", "Atención durante toda la vida", "care-process"],
      ["Calidad en la Toma de Muestra Prueba del talón", "Atención durante toda la vida", "care-quality"],
      ["Tasa Bruta Neo Pulmón (x 100.000 hab)", "Atención a los Crónicos", "registered-health-status"],
      ["Nº de personas con TAO en seguimiento", "Atención a los Crónicos", "administrative-record"],
      ["Índice de vejez", "Información Usuarios BDU", "assigned-population"],
      ["Centros Educativos Primaria", "Información Municipal", "municipal-context"],
      ["Tasa Bruta de Mortalidad Intrahospitalaria por Ictus", "Mortalidad", "assistance-mortality"],
    ];
    for (const [name, area, expected] of cases) {
      expect(classifyUGCIndicator(name, area).nature, name).toBe(expected);
    }
  });

  it("ante la duda devuelve unknown (no fuerza familia)", () => {
    const r = classifyUGCIndicator("Nº de partes Violencia de género", "Atención durante toda la vida");
    expect(r.nature).toBe("unknown");
    expect(r.denominatorType).toBe("unknown");
    expect(r.basis).toBe("default");
    // Un nombre inequívocamente sin patrón también es unknown.
    expect(classifyUGCIndicator("Indicador sin patrón reconocible", "Zona X").nature).toBe("unknown");
  });

  it("cada señal declara la regla de clasificación aplicada (auditable)", () => {
    for (const s of reading.signals) {
      expect(typeof s.classificationBasis).toBe("string");
      expect(s.classificationBasis.length).toBeGreaterThan(0);
    }
  });

  it("las familias reales presentes incluyen varias, no solo el total", () => {
    const natures = new Set(reading.signals.map((s) => s.indicatorNature));
    for (const fam of [
      "service-utilization",
      "care-process",
      "registered-health-status",
      "municipal-context",
      "assigned-population",
      "assistance-mortality",
    ]) {
      expect(natures.has(fam as never), fam).toBe(true);
    }
  });
});

describe("N1b — sin agregación cuantitativa entre UGCs", () => {
  it("17. Centro-Este y Sur no se agregan: 384 señales distintas conservadas", () => {
    const ids = new Set(reading.signals.map((s) => s.id));
    expect(ids.size).toBe(384);
    // Las dos UGCs conservan su propia colección de 192.
    expect(centroEste.signals.length + sur.signals.length).toBe(384);
    // Cada señal pertenece a una única UGC identificada.
    expect(new Set(reading.signals.map((s) => s.ugc))).toEqual(
      new Set(["Zaidín Centro-Este", "Zaidín Sur"])
    );
  });

  it("18-19. coincidencias solo nominales; ni ranking ni prevalencia", () => {
    // Ambos informes comparten la lista auditada -> 192 coincidencias nominales.
    expect(reading.nominalCoincidences.length).toBe(192);
    for (const c of reading.nominalCoincidences) {
      expect(c.ugcs.sort()).toEqual(["Zaidín Centro-Este", "Zaidín Sur"]);
    }
    // La lectura no expone rankings, prevalencias ni severidad agregada.
    const raw = reading as unknown as Record<string, unknown>;
    for (const forbidden of ["ranking", "prevalence", "prevalencia", "severity", "gravedad", "score"]) {
      expect(forbidden in raw).toBe(false);
    }
  });
});

describe("N1b — separación de N1a/N3/N4 y no creación de evidencias", () => {
  it("20. los indicadores clínico-asistenciales no entran en N1a (base epidemiológica)", () => {
    const answers = buildDiagnosticAnswers({
      workspace: ws,
      determinantTitles: [],
      assets: ws.evidenceStore.atoms
        .filter((a) => a.kind === "asset")
        .map((a) => ({ title: a.title, content: a.content })),
    });
    const base = answers.sanitaria.baseEpidemiologica;
    const baseText = JSON.stringify(base ?? {});
    for (const token of [
      "% Usuarios hiperfrecuentadores de Pediatría",
      "Cobertura Enfermería de Familia >74 (UGC)",
      "Calidad en la Toma de Muestra Prueba del talón",
    ]) {
      expect(baseText.includes(token), token).toBe(false);
    }
  });

  it("21-22. N3 y el Perfil visible no incorporan las señales UGC", () => {
    const answers = buildDiagnosticAnswers({
      workspace: ws,
      determinantTitles: [],
      assets: ws.evidenceStore.atoms
        .filter((a) => a.kind === "asset")
        .map((a) => ({ title: a.title, content: a.content })),
    });
    const interp = JSON.stringify(buildIntegratedInterpretation(answers));
    const view = JSON.stringify(
      buildProfileIntegratedEditorialView(answers, {
        territory: ws.municipality.identity.name,
        status: "Documento de trabajo",
        informeTitulo: "Informe de salud de El Zaidín",
      })
    );
    for (const token of [
      "% Usuarios hiperfrecuentadores de Pediatría",
      "Cobertura Enfermería de Familia >74 (UGC)",
      "Razón Trasplantados Renales / Diabéticos en PAI",
    ]) {
      expect(interp.includes(token), `N3: ${token}`).toBe(false);
      expect(view.includes(token), `N4: ${token}`).toBe(false);
    }
  });

  it("23. construir N1b no crea EvidenceAtoms ni muta el workspace", () => {
    const before = ws.evidenceStore.atoms.length;
    buildUGCClinicalAssistanceReading(ws);
    expect(ws.evidenceStore.atoms.length).toBe(before);
    // Ninguna evidencia procede de los documentos territoriales.
    const territorialIds = new Set(
      ws.repository.documents
        .filter((d) => d.kind === "territorial-documentation")
        .map((d) => d.id)
    );
    expect(
      ws.evidenceStore.atoms.filter(
        (a) =>
          a.provenance.documentId !== undefined &&
          territorialIds.has(a.provenance.documentId)
      ).length
    ).toBe(0);
  });

  it("24-26. invariantes del piloto: 20 docs / 92 evidencias / 56 Localiza", () => {
    expect(ws.repository.documents.length).toBe(20);
    expect(ws.evidenceStore.atoms.length).toBe(92);
    expect(
      ws.evidenceStore.atoms.filter((a) => a.provenance.origin === "localiza-salud").length
    ).toBe(56);
  });
});
