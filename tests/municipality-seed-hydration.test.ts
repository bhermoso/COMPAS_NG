/**
 * Hidratación inicial de expedientes municipales desde seeds canónicos (Paso post-4).
 *
 * Prioridad: localStorage válido → seed canónico → placeholder vacío. Nunca se
 * sobreescribe trabajo local; nunca se persiste el placeholder vacío durante la
 * hidratación asíncrona; solo se hidratan municipios con export real.
 */

import { describe, it, expect, beforeEach } from "vitest";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  loadMunicipalitySeed,
  municipalitySeedUrl,
  hasMunicipalitySeed,
  MUNICIPALITY_SEEDS,
} from "../src/infrastructure/seeds";
import {
  loadOrCreateMunicipalityWorkspace,
  shouldSkipPersistence,
  shouldReplaceWithSeed,
} from "../src/appWorkspaceHydration";
import { saveWorkspaceToLocalStorage } from "../src/infrastructure/persistence/local-storage";
import {
  createCompleteMunicipalityWorkspace,
  isEmptyWorkspaceForPersistenceGuard,
} from "../src/application/workspace";
import type { MunicipalityWorkspace } from "../src/domain/workspace";

// ── localStorage mínimo ───────────────────────────────────────────────────────
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

// Seed desplegable REAL (el fichero que Vite copia a dist/).
const SEED_PATH = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../public/seeds/compas-ng-workspace-granada-zaidin.json"
);
const SEED_RAW = readFileSync(SEED_PATH, "utf8");

// Export canónico de origen: el seed desplegable debe ser una copia byte a byte.
const CANONICAL_EXPORT_PATH = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../municipalities/granada-zaidin/exports/compas-ng-workspace-granada-zaidin.json"
);

const GRANADA_SEED_INPUT = {
  id: "granada-zaidin",
  name: "Granada-Zaidín",
  province: "Granada",
  territorialType: "distrito",
  createdBy: "test",
};

// ── fetch mocks ───────────────────────────────────────────────────────────────
function okFetch(body: string, onUrl?: (url: string) => void): typeof fetch {
  return (async (url: string) => {
    onUrl?.(url);
    return { ok: true, status: 200, text: async () => body };
  }) as unknown as typeof fetch;
}
function notOkFetch(): typeof fetch {
  return (async () => ({ ok: false, status: 404, text: async () => "" })) as unknown as typeof fetch;
}
function throwingFetch(): typeof fetch {
  return (async () => {
    throw new Error("network down");
  }) as unknown as typeof fetch;
}

const GRANADA_INPUT = {
  id: "granada-zaidin",
  name: "Granada-Zaidín",
  province: "Granada",
  territorialType: "distrito",
  createdBy: "test",
};
const ATARFE_INPUT = {
  id: "atarfe",
  name: "Atarfe",
  province: "Granada",
  ineCode: "18022",
  createdBy: "test",
};

beforeEach(() => {
  store.clear();
});

describe("hidratación de expedientes municipales desde seed", () => {
  it("1. localStorage vacío: un municipio con seed carga el expediente canónico", async () => {
    const ws = await loadMunicipalitySeed("granada-zaidin", {
      baseUrl: "/",
      fetchImpl: okFetch(SEED_RAW),
    });
    expect(ws).not.toBeNull();
    expect(ws?.municipality.identity.id).toBe("granada-zaidin");
    expect(ws?.municipality.identity.name).toBe("Granada-Zaidín");
  });

  it("2. Granada-Zaidín carga exactamente 20 documentos y 92 evidencias", async () => {
    const ws = await loadMunicipalitySeed("granada-zaidin", {
      baseUrl: "/",
      fetchImpl: okFetch(SEED_RAW),
    });
    expect(ws?.repository.documents.length).toBe(20);
    expect(ws?.evidenceStore.atoms.length).toBe(92);
  });

  it("3. un workspace local existente prevalece sobre el seed", () => {
    // Sembrar un expediente local con contenido para granada-zaidin.
    const localWs = JSON.parse(SEED_RAW) as MunicipalityWorkspace;
    expect(saveWorkspaceToLocalStorage(localWs)).toBe(true);

    const result = loadOrCreateMunicipalityWorkspace("granada-zaidin", GRANADA_INPUT);
    // El seed NO se hidrata (no hay carrera): gana el local.
    expect(result.seedPending).toBe(false);
    expect(result.workspace.repository.documents.length).toBe(20);
    expect(result.workspace.evidenceStore.atoms.length).toBe(92);
  });

  it("4a. seed con schemaVersion incorrecto → rechazado (null)", async () => {
    const bad = JSON.stringify({ ...JSON.parse(SEED_RAW), schemaVersion: "9.9.9" });
    const ws = await loadMunicipalitySeed("granada-zaidin", {
      baseUrl: "/",
      fetchImpl: okFetch(bad),
    });
    expect(ws).toBeNull();
  });

  it("4b. seed con identidad municipal que no concuerda → rechazado (null)", async () => {
    const parsed = JSON.parse(SEED_RAW);
    parsed.municipality.identity.id = "otro-municipio";
    const ws = await loadMunicipalitySeed("granada-zaidin", {
      baseUrl: "/",
      fetchImpl: okFetch(JSON.stringify(parsed)),
    });
    expect(ws).toBeNull();
  });

  it("4c. HTTP no-ok o error de red → rechazado (null), sin lanzar", async () => {
    expect(
      await loadMunicipalitySeed("granada-zaidin", { baseUrl: "/", fetchImpl: notOkFetch() })
    ).toBeNull();
    expect(
      await loadMunicipalitySeed("granada-zaidin", { baseUrl: "/", fetchImpl: throwingFetch() })
    ).toBeNull();
  });

  it("5. un municipio sin seed crea un workspace vacío", async () => {
    expect(hasMunicipalitySeed("atarfe")).toBe(false);
    const result = loadOrCreateMunicipalityWorkspace("atarfe", ATARFE_INPUT);
    expect(result.seedPending).toBe(false);
    expect(result.workspace.repository.documents.length).toBe(0);
    expect(result.workspace.evidenceStore.atoms.length).toBe(0);
    // Y el loader de seed lo rechaza aunque se le pase contenido.
    await expect(
      loadMunicipalitySeed("atarfe", { baseUrl: "/", fetchImpl: okFetch(SEED_RAW) })
    ).resolves.toBeNull();
  });

  it("5b. granada-zaidin sin expediente local → seedPending true con placeholder vacío", () => {
    const result = loadOrCreateMunicipalityWorkspace("granada-zaidin", GRANADA_INPUT);
    expect(result.seedPending).toBe(true);
    expect(result.workspace.repository.documents.length).toBe(0);
    expect(result.workspace.evidenceStore.atoms.length).toBe(0);
  });

  it("6. no se persiste el placeholder vacío durante la hidratación asíncrona", () => {
    // Mientras pendingSeedId apunta al municipio actual → OMITE el guardado.
    expect(
      shouldSkipPersistence({
        workspaceMunicipalityId: "granada-zaidin",
        pendingSeedId: "granada-zaidin",
        protectedEmptyWorkspaceId: null,
        isEmpty: true,
      })
    ).toBe(true);
    // Tras terminar la hidratación (pendingSeedId liberado) → SÍ persiste.
    expect(
      shouldSkipPersistence({
        workspaceMunicipalityId: "granada-zaidin",
        pendingSeedId: null,
        protectedEmptyWorkspaceId: null,
        isEmpty: false,
      })
    ).toBe(false);
    // Comprobación de extremo a extremo del efecto: con seedPending y guardado
    // omitido, localStorage permanece vacío (no se guarda el placeholder).
    store.clear();
    const result = loadOrCreateMunicipalityWorkspace("granada-zaidin", GRANADA_INPUT);
    const skip = shouldSkipPersistence({
      workspaceMunicipalityId: result.workspace.municipality.identity.id,
      pendingSeedId: result.seedPending
        ? result.workspace.municipality.identity.id
        : null,
      protectedEmptyWorkspaceId: null,
      isEmpty: true,
    });
    if (!skip) saveWorkspaceToLocalStorage(result.workspace);
    expect(store.has("compas-ng:workspace:granada-zaidin")).toBe(false);
  });

  it("7. la URL del seed funciona con el BASE_URL de GitHub Pages", async () => {
    const seed = MUNICIPALITY_SEEDS["granada-zaidin"];
    expect(municipalitySeedUrl(seed, "/COMPAS_NG/")).toBe(
      "/COMPAS_NG/seeds/compas-ng-workspace-granada-zaidin.json"
    );
    // El loader pide EXACTAMENTE esa URL bajo el base de Pages.
    let requested = "";
    await loadMunicipalitySeed("granada-zaidin", {
      baseUrl: "/COMPAS_NG/",
      fetchImpl: okFetch(SEED_RAW, (u) => {
        requested = u;
      }),
    });
    expect(requested).toBe("/COMPAS_NG/seeds/compas-ng-workspace-granada-zaidin.json");
  });

  it("8. el seed desplegable existe en public/ (Vite lo copia a dist) y es válido", () => {
    const parsed = JSON.parse(SEED_RAW);
    expect(parsed.schemaVersion).toBe("1.0.0");
    expect(parsed.municipality.identity.id).toBe("granada-zaidin");
    expect(parsed.municipality.identity.name).toBe("Granada-Zaidín");
    expect(parsed.repository.documents.length).toBe(20);
    expect(parsed.evidenceStore.atoms.length).toBe(92);
    // La ruta registrada coincide con el fichero desplegable.
    expect(MUNICIPALITY_SEEDS["granada-zaidin"].path).toBe(
      "seeds/compas-ng-workspace-granada-zaidin.json"
    );
  });

  it("8b. el seed desplegable es copia BYTE A BYTE del export canónico de municipalities/", () => {
    // Detecta cualquier divergencia futura entre la copia desplegable (public/) y el
    // export canónico de origen (municipalities/…/exports/).
    const seedBuf = readFileSync(SEED_PATH);
    const canonicalBuf = readFileSync(CANONICAL_EXPORT_PATH);
    expect(seedBuf.equals(canonicalBuf)).toBe(true);
  });

  // ── Migración: placeholder vacío de la versión anterior → seed canónico ────────

  it("6b. MIGRACIÓN: localStorage con Granada-Zaidín válido pero prístino → al arrancar carga el seed (20/92)", async () => {
    // Un navegador de la versión anterior guardó un expediente VÁLIDO pero VACÍO
    // (creado por createCompleteMunicipalityWorkspace). Debe considerarse placeholder.
    const placeholder = createCompleteMunicipalityWorkspace(GRANADA_SEED_INPUT);
    expect(isEmptyWorkspaceForPersistenceGuard(placeholder)).toBe(true);
    expect(saveWorkspaceToLocalStorage(placeholder)).toBe(true);

    // Arranque: se detecta el placeholder y se marca la hidratación del seed.
    const result = loadOrCreateMunicipalityWorkspace("granada-zaidin", GRANADA_INPUT);
    expect(result.seedPending).toBe(true);
    expect(result.workspace.repository.documents.length).toBe(0);
    expect(shouldReplaceWithSeed(result.workspace, "granada-zaidin")).toBe(true);

    // Hidratación asíncrona (misma decisión que el efecto de App).
    const seed = await loadMunicipalitySeed("granada-zaidin", {
      baseUrl: "/",
      fetchImpl: okFetch(SEED_RAW),
    });
    const hydrated = shouldReplaceWithSeed(result.workspace, "granada-zaidin")
      ? seed
      : result.workspace;
    expect(hydrated?.repository.documents.length).toBe(20);
    expect(hydrated?.evidenceStore.atoms.length).toBe(92);
  });

  it("7b. un workspace local NO vacío prevalece: no se sustituye por el seed", () => {
    // Expediente local con contenido humano real (priorización ciudadana).
    const local: MunicipalityWorkspace = {
      ...createCompleteMunicipalityWorkspace(GRANADA_SEED_INPUT),
      thematicPrioritisation: {
        municipalityId: "granada-zaidin",
        selectedTopicIds: ["bienestar-emocional"],
        updatedAt: "2026-07-01T00:00:00.000Z",
      },
    };
    expect(isEmptyWorkspaceForPersistenceGuard(local)).toBe(false);
    expect(saveWorkspaceToLocalStorage(local)).toBe(true);

    const result = loadOrCreateMunicipalityWorkspace("granada-zaidin", GRANADA_INPUT);
    // No es placeholder: prevalece y NO se hidrata el seed.
    expect(result.seedPending).toBe(false);
    expect(shouldReplaceWithSeed(result.workspace, "granada-zaidin")).toBe(false);
    expect(result.workspace.thematicPrioritisation?.selectedTopicIds).toEqual([
      "bienestar-emocional",
    ]);
    // No se ha sustituido por el seed 20/92.
    expect(result.workspace.repository.documents.length).toBe(0);
  });
});
