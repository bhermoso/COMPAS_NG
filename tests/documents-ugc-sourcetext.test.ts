/**
 * tests/documents-ugc-sourcetext.test.ts
 *
 * Incremento 5A — persistencia del texto íntegro de los informes clínico-
 * asistenciales por UGC (Vigía) como documento fuente consultable y trazable,
 * SIN atomizar ni interpretar.
 *
 * Fija:
 *   (a) el extractor DOCX es determinista, en Node, y conserva acentos;
 *   (b) los dos documentos `territorial-documentation` del export vigente 56/92
 *       llevan `sourceText` íntegro + metadatos documentales (Opción A);
 *   (c) el cuerpo sobrevive al ciclo real export → restauración → reexport;
 *   (d) los invariantes del piloto (20 docs / 92 evidencias / 56 Localiza / 0
 *       evidencias nuevas) permanecen intactos;
 *   (e) el fichero sigue siendo 100 % ASCII y vigente == MANUAL byte a byte.
 */

import { describe, it, expect, beforeAll } from "vitest";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  loadWorkspaceFromLocalStorage,
  saveWorkspaceToLocalStorage,
} from "../src/infrastructure/persistence/local-storage";
import { extractDocxText } from "../src/application/document-ingestion";
import { buildGranadaZaidinWorkspace } from "../scripts/demo/buildGranadaZaidinWorkspace";
import type { MunicipalityWorkspace } from "../src/domain/workspace";
import type { MunicipalDocument } from "../src/domain/repository";

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

const here = dirname(fileURLToPath(import.meta.url));
const EXPORT_PATH = resolve(
  here,
  "../municipalities/granada-zaidin/exports/compas-ng-workspace-granada-zaidin.json"
);
const MANUAL_PATH = resolve(
  here,
  "../municipalities/granada-zaidin/exports/compas-ng-workspace-granada-zaidin-MANUAL-56-92.json"
);
const DOCX_DIR = resolve(
  here,
  "../docs/source-material/territorial-cases/granada-zaidin"
);
const KEY = "compas-ng:workspace:granada-zaidin";

function toArrayBuffer(path: string): ArrayBuffer {
  const buf = readFileSync(path);
  return buf.buffer.slice(
    buf.byteOffset,
    buf.byteOffset + buf.byteLength
  ) as ArrayBuffer;
}

let raw: string;
let ws: MunicipalityWorkspace;
let territorial: MunicipalDocument[];
let centroEste: MunicipalDocument;
let sur: MunicipalDocument;

beforeAll(() => {
  raw = readFileSync(EXPORT_PATH, "utf8");
  store.set(KEY, raw);
  const loaded = loadWorkspaceFromLocalStorage("granada-zaidin");
  if (loaded === null) throw new Error("El export vigente no rehidrata");
  ws = loaded;
  territorial = ws.repository.documents.filter(
    (d) => d.kind === "territorial-documentation"
  );
  centroEste = territorial.find((d) =>
    /Centro Este/i.test(d.title)
  ) as MunicipalDocument;
  sur = territorial.find((d) => /\bSur\b/i.test(d.title)) as MunicipalDocument;
}, 60000);

describe("Extractor DOCX — determinista y Node-safe (conserva acentos)", () => {
  it("extrae el texto del informe Centro-Este con acentos y sin XML", async () => {
    const text = await extractDocxText(
      toArrayBuffer(resolve(DOCX_DIR, "Informe Zaidin Centro Este.docx"))
    );
    expect(text.length).toBeGreaterThan(10000);
    expect(text).toContain("VIGILANCIA INTEGRAL DE LA SALUD");
    expect(text).toContain("Zaidín Centro-Este");
    expect(text).not.toContain("<w:t");
  });

  it("es determinista: dos extracciones del mismo DOCX coinciden", async () => {
    const path = toArrayBuffer(resolve(DOCX_DIR, "Informe Zaidin Sur.docx"));
    const a = await extractDocxText(path);
    const b = await extractDocxText(
      toArrayBuffer(resolve(DOCX_DIR, "Informe Zaidin Sur.docx"))
    );
    expect(a).toBe(b);
    expect(a).toContain("Zaidín Sur");
  });

  it("preserva la estructura de áreas del informe (5 ÁREA)", async () => {
    const text = await extractDocxText(
      toArrayBuffer(resolve(DOCX_DIR, "Informe Zaidin Centro Este.docx"))
    );
    expect((text.match(/ÁREA:/g) ?? []).length).toBe(5);
    expect(text).toContain("SELECCIÓN DE INDICADORES");
  });
});

describe("Export vigente 56/92 — sourceText íntegro persistido", () => {
  it("hay exactamente 2 documentos territoriales", () => {
    expect(territorial.length).toBe(2);
    expect(centroEste).toBeTruthy();
    expect(sur).toBeTruthy();
  });

  it("ambos tienen sourceText no vacío (el cuerpo no es null)", () => {
    for (const d of territorial) {
      expect(typeof d.sourceText).toBe("string");
      expect((d.sourceText ?? "").length).toBeGreaterThan(10000);
      // El campo body de dominio nunca existió aquí; nunca debe aparecer null.
      expect((d as { body?: unknown }).body ?? null).toBeNull();
    }
  });

  it("el sourceText de Centro-Este es el texto real de su UGC", () => {
    expect(centroEste.sourceText).toContain("VIGILANCIA INTEGRAL DE LA SALUD");
    expect(centroEste.sourceText).toContain(
      "Unidad de Gestión Clínica: Zaidín Centro-Este"
    );
    expect((centroEste.sourceText!.match(/Indicador:/g) ?? []).length).toBe(192);
  });

  it("el sourceText de Sur es el texto real de su UGC (distinto de Centro-Este)", () => {
    expect(sur.sourceText).toContain(
      "Unidad de Gestión Clínica: Zaidín Sur"
    );
    expect(sur.sourceText).not.toBe(centroEste.sourceText);
  });
});

describe("Metadatos documentales (Opción A) — sin atomizar ni interpretar", () => {
  it("documentNature = informe clínico-asistencial por UGC", () => {
    for (const d of territorial) {
      expect(d.documentNature).toBe("ugc-clinical-assistance-report");
    }
  });

  it("territorialScale = unidad-gestion-clinica (UGC ≠ distrito)", () => {
    for (const d of territorial) {
      expect(d.territorialScale).toBe("unidad-gestion-clinica");
    }
  });

  it("contentMode = full-text-non-atomized", () => {
    for (const d of territorial) {
      expect(d.contentMode).toBe("full-text-non-atomized");
    }
  });

  it("ugc se lee del propio texto: Centro-Este y Sur", () => {
    expect(centroEste.ugc).toBe("Zaidín Centro-Este");
    expect(sur.ugc).toBe("Zaidín Sur");
  });

  it("source.system declara texto íntegro no atomizado", () => {
    for (const d of territorial) {
      expect(d.source.system).toContain("texto íntegro persistido");
      expect(d.source.system).toContain("no atomizado");
    }
  });

  it("no habilitan generación de evidencia (canGenerateEvidence:false)", () => {
    for (const d of territorial) {
      expect(d.canGenerateEvidence).toBe(false);
    }
  });
});

describe("Ciclo de persistencia — el cuerpo sobrevive export → restore → reexport", () => {
  it("reexportar y rehidratar conserva sourceText y metadatos", () => {
    const store2 = new Map<string, string>();
    (globalThis as { localStorage?: unknown }).localStorage = {
      getItem: (k: string) => store2.get(k) ?? null,
      setItem: (k: string, v: string) => {
        store2.set(k, v);
      },
      removeItem: (k: string) => store2.delete(k),
      clear: () => store2.clear(),
      key: (i: number) => [...store2.keys()][i] ?? null,
      get length() {
        return store2.size;
      },
    };
    expect(saveWorkspaceToLocalStorage(ws)).toBe(true);
    const reloaded = loadWorkspaceFromLocalStorage("granada-zaidin");
    expect(reloaded).not.toBeNull();
    const td = reloaded!.repository.documents.filter(
      (d) => d.kind === "territorial-documentation"
    );
    expect(td.length).toBe(2);
    for (const d of td) {
      expect((d.sourceText ?? "").length).toBeGreaterThan(10000);
      expect(d.documentNature).toBe("ugc-clinical-assistance-report");
      expect(d.territorialScale).toBe("unidad-gestion-clinica");
      expect(d.contentMode).toBe("full-text-non-atomized");
    }
  });
});

describe("Invariantes del piloto — 5A no altera la línea 56/92", () => {
  it("20 documentos, 1 informe, 2 territoriales, 3 marcos, 1 Localiza", () => {
    const docs = ws.repository.documents;
    expect(docs.length).toBe(20);
    expect(docs.filter((d) => d.kind === "health-report").length).toBe(1);
    expect(docs.filter((d) => d.kind === "territorial-documentation").length).toBe(2);
    expect(docs.filter((d) => d.kind === "strategic-framework").length).toBe(3);
    expect(docs.filter((d) => d.kind === "localiza-salud").length).toBe(1);
  });

  it("92 evidencias, 56 de Localiza Salud, 0 derivadas de los territoriales", () => {
    const atoms = ws.evidenceStore.atoms;
    expect(atoms.length).toBe(92);
    expect(
      atoms.filter((a) => a.provenance.origin === "localiza-salud").length
    ).toBe(56);
    const territorialIds = new Set(territorial.map((d) => d.id));
    expect(
      atoms.filter(
        (a) =>
          a.provenance.documentId !== undefined &&
          territorialIds.has(a.provenance.documentId)
      ).length
    ).toBe(0);
  });
});

describe("Reconstrucción — el build registra los territoriales con sourceText", () => {
  it("buildGranadaZaidinWorkspace persiste el texto y metadatos por UGC", async () => {
    const { workspace } = await buildGranadaZaidinWorkspace();
    const td = workspace.repository.documents.filter(
      (d) => d.kind === "territorial-documentation"
    );
    expect(td.length).toBe(2);
    for (const d of td) {
      expect((d.sourceText ?? "").length).toBeGreaterThan(10000);
      expect(d.documentNature).toBe("ugc-clinical-assistance-report");
      expect(d.territorialScale).toBe("unidad-gestion-clinica");
      expect(d.contentMode).toBe("full-text-non-atomized");
      expect(d.canGenerateEvidence).toBe(false);
    }
    expect(td.map((d) => d.ugc).sort()).toEqual([
      "Zaidín Centro-Este",
      "Zaidín Sur",
    ]);
    // La reconstrucción no atomiza los territoriales: no generan evidencia.
    const tdIds = new Set(td.map((d) => d.id));
    expect(
      workspace.evidenceStore.atoms.filter(
        (a) =>
          a.provenance.documentId !== undefined &&
          tdIds.has(a.provenance.documentId)
      ).length
    ).toBe(0);
  }, 60000);
});

describe("Integridad del fichero — ASCII y copia MANUAL idéntica", () => {
  it("el export vigente es 100 % ASCII (acentos \\u-escapados)", () => {
    expect(/^[\x00-\x7F]*$/.test(raw)).toBe(true);
    expect(raw).toContain("Zaid\\u00edn");
    expect(raw).toContain("VIGILANCIA INTEGRAL DE LA SALUD");
  });

  it("vigente y MANUAL-56-92 son idénticos byte a byte", () => {
    const manual = readFileSync(MANUAL_PATH, "utf8");
    expect(manual).toBe(raw);
  });

  it("las tildes rehidratan correctamente (Zaidín, Gestión Clínica)", () => {
    const texto = JSON.stringify(JSON.parse(raw));
    expect(texto).toContain("Granada-Zaidín");
    expect(texto).toContain("Gestión Clínica");
  });
});
