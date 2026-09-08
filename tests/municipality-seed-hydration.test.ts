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
  resolveSeedMigration,
  applySeedDocumentMigration,
  backfillSeedMigrationMarker,
  INCREMENTAL_SEED_MIGRATIONS,
} from "../src/appWorkspaceHydration";
import {
  saveWorkspaceToLocalStorage,
  parseWorkspaceJSON,
} from "../src/infrastructure/persistence/local-storage";
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
// Municipio SIN seed (Alfacar no tiene export canónico): comprueba el camino vacío.
const ALFACAR_INPUT = {
  id: "alfacar",
  name: "Alfacar",
  province: "Granada",
  ineCode: "18011",
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
    expect(hasMunicipalitySeed("alfacar")).toBe(false);
    const result = loadOrCreateMunicipalityWorkspace("alfacar", ALFACAR_INPUT);
    expect(result.seedPending).toBe(false);
    expect(result.workspace.repository.documents.length).toBe(0);
    expect(result.workspace.evidenceStore.atoms.length).toBe(0);
    // Y el loader de seed lo rechaza aunque se le pase contenido.
    await expect(
      loadMunicipalitySeed("alfacar", { baseUrl: "/", fetchImpl: okFetch(SEED_RAW) })
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

// ── Migración incremental de activos Localiza para Atarfe (marca versionada) ────

const ATARFE_SEED_PATH = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../public/seeds/compas-ng-workspace-atarfe.json"
);
const ATARFE_SEED_RAW = readFileSync(ATARFE_SEED_PATH, "utf8");
const ATARFE_MARKER = "atarfe-localiza-v1";
const ATARFE_MIGRATION = INCREMENTAL_SEED_MIGRATIONS.find(
  (m) => m.municipalityId === "atarfe"
)!;
const ATARFE_INPUT = {
  id: "atarfe",
  name: "Atarfe",
  province: "Granada",
  ineCode: "18022",
  createdBy: "test",
};

/** Seed real de Atarfe (3 docs / 11 átomos, con la marca aplicada). */
function atarfeSeed(): MunicipalityWorkspace {
  return parseWorkspaceJSON(ATARFE_SEED_RAW)!;
}

/** Copia sin la marca de migración (simula un expediente previo a esta feature). */
function stripMigrationMarker(ws: MunicipalityWorkspace): MunicipalityWorkspace {
  const clone: MunicipalityWorkspace = { ...ws };
  delete clone.appliedSeedMigrations;
  return clone;
}

/** Atarfe "legacy" previo a la feature: sin Localiza, sin marca (2 docs / 6 átomos). */
function legacyAtarfeWithoutLocaliza(): MunicipalityWorkspace {
  const seed = atarfeSeed();
  return {
    ...stripMigrationMarker(seed),
    repository: {
      ...seed.repository,
      documents: seed.repository.documents.filter(
        (d) => d.id !== ATARFE_MIGRATION.documentId
      ),
    },
    evidenceStore: {
      ...seed.evidenceStore,
      atoms: seed.evidenceStore.atoms.filter(
        (a) => a.provenance.documentId !== ATARFE_MIGRATION.documentId
      ),
    },
  };
}

describe("migración incremental de activos Localiza para Atarfe", () => {
  it("M0. la marca del registro coincide con la del seed y el builder", () => {
    expect(ATARFE_MIGRATION.marker).toBe(ATARFE_MARKER);
    expect(ATARFE_MIGRATION.documentId).toBe("doc-localiza-atarfe");
    expect(atarfeSeed().appliedSeedMigrations).toEqual([ATARFE_MARKER]);
  });

  it("M1. legacy sin marca y sin Localiza → download-and-merge → 3/11 + marca (atómico)", () => {
    const legacy = legacyAtarfeWithoutLocaliza();
    expect(legacy.repository.documents.length).toBe(2);
    expect(legacy.evidenceStore.atoms.length).toBe(6);
    expect(resolveSeedMigration(legacy)).toEqual({
      kind: "download-and-merge",
      migration: ATARFE_MIGRATION,
    });

    const migrated = applySeedDocumentMigration(legacy, atarfeSeed(), ATARFE_MIGRATION);
    expect(migrated.repository.documents.length).toBe(3);
    expect(migrated.evidenceStore.atoms.length).toBe(11);
    expect(
      migrated.repository.documents.some((d) => d.id === "doc-localiza-atarfe")
    ).toBe(true);
    expect(
      migrated.evidenceStore.atoms.filter(
        (a) => a.provenance.origin === "localiza-salud"
      )
    ).toHaveLength(5);
    // Marca estampada atómicamente con la fusión.
    expect(migrated.appliedSeedMigrations).toContain(ATARFE_MARKER);
  });

  it("M2. preserva íntegramente el trabajo del usuario (docs y átomos ajenos)", () => {
    const legacy = legacyAtarfeWithoutLocaliza();
    const userDoc = {
      ...legacy.repository.documents[0],
      id: "doc-usuario-propio",
      title: "Documento propio del usuario",
    };
    const userAtom = {
      ...legacy.evidenceStore.atoms[0],
      id: "atom-usuario-propio",
    };
    const withUserWork: MunicipalityWorkspace = {
      ...legacy,
      repository: {
        ...legacy.repository,
        documents: [...legacy.repository.documents, userDoc],
      },
      evidenceStore: {
        ...legacy.evidenceStore,
        atoms: [...legacy.evidenceStore.atoms, userAtom],
      },
    };

    const migrated = applySeedDocumentMigration(withUserWork, atarfeSeed(), ATARFE_MIGRATION);
    // El trabajo propio permanece intacto.
    expect(migrated.repository.documents.some((d) => d.id === "doc-usuario-propio")).toBe(true);
    expect(migrated.evidenceStore.atoms.some((a) => a.id === "atom-usuario-propio")).toBe(true);
    // Y solo se añadieron el documento Localiza y sus 5 átomos.
    expect(migrated.repository.documents.length).toBe(withUserWork.repository.documents.length + 1);
    expect(migrated.evidenceStore.atoms.length).toBe(withUserWork.evidenceStore.atoms.length + 5);
  });

  it("M3. idempotente: aplicar dos veces no duplica ni cambia (mismo objeto)", () => {
    const legacy = legacyAtarfeWithoutLocaliza();
    const once = applySeedDocumentMigration(legacy, atarfeSeed(), ATARFE_MIGRATION);
    const twice = applySeedDocumentMigration(once, atarfeSeed(), ATARFE_MIGRATION);
    // Segunda pasada = no-op por marca (identidad referencial).
    expect(twice).toBe(once);
    expect(twice.repository.documents.length).toBe(3);
    expect(twice.evidenceStore.atoms.length).toBe(11);
    // Sin ids de átomo duplicados.
    const ids = twice.evidenceStore.atoms.map((a) => a.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("M4. BORRADO POSTERIOR: marca presente y documento borrado → no se repone", () => {
    // Estado tras migrar y luego borrar Localiza con «Eliminar» (doc + átomos fuera,
    // marca conservada).
    const migrated = applySeedDocumentMigration(
      legacyAtarfeWithoutLocaliza(),
      atarfeSeed(),
      ATARFE_MIGRATION
    );
    const afterDelete: MunicipalityWorkspace = {
      ...migrated,
      repository: {
        ...migrated.repository,
        documents: migrated.repository.documents.filter(
          (d) => d.id !== "doc-localiza-atarfe"
        ),
      },
      evidenceStore: {
        ...migrated.evidenceStore,
        atoms: migrated.evidenceStore.atoms.filter(
          (a) => a.provenance.documentId !== "doc-localiza-atarfe"
        ),
      },
    };
    expect(afterDelete.appliedSeedMigrations).toContain(ATARFE_MARKER);
    expect(
      afterDelete.repository.documents.some((d) => d.id === "doc-localiza-atarfe")
    ).toBe(false);
    // La marca gana a la ausencia del documento: nada que hacer.
    expect(resolveSeedMigration(afterDelete)).toEqual({ kind: "none" });
    // Y aplicar la migración es un no-op (no repone el documento borrado).
    const reapplied = applySeedDocumentMigration(afterDelete, atarfeSeed(), ATARFE_MIGRATION);
    expect(reapplied).toBe(afterDelete);
    expect(
      reapplied.repository.documents.some((d) => d.id === "doc-localiza-atarfe")
    ).toBe(false);
  });

  it("M5. BACKFILL: contiene Localiza pero sin marca → estampa marca, sin descargar ni duplicar", () => {
    // Hidratación limpia entre despliegues: doc presente, marca ausente.
    const cleanNoMarker = stripMigrationMarker(atarfeSeed());
    expect(cleanNoMarker.repository.documents.length).toBe(3);
    expect(resolveSeedMigration(cleanNoMarker)).toEqual({
      kind: "backfill-marker",
      migration: ATARFE_MIGRATION,
    });
    const stamped = backfillSeedMigrationMarker(cleanNoMarker, ATARFE_MIGRATION);
    expect(stamped.appliedSeedMigrations).toContain(ATARFE_MARKER);
    // No duplica documentos ni átomos.
    expect(stamped.repository.documents.length).toBe(3);
    expect(stamped.evidenceStore.atoms.length).toBe(11);
    // Tras el backfill ya no hay nada que hacer.
    expect(resolveSeedMigration(stamped)).toEqual({ kind: "none" });
  });

  it("M6. marca presente y documento presente → none (sin descarga)", () => {
    expect(resolveSeedMigration(atarfeSeed())).toEqual({ kind: "none" });
  });

  it("M7. reemplazo completo desde el seed queda marcado como aplicado", async () => {
    // Placeholder vacío de Atarfe → seedPending, sin migración incremental.
    const placeholder = createCompleteMunicipalityWorkspace(ATARFE_INPUT);
    expect(saveWorkspaceToLocalStorage(placeholder)).toBe(true);
    const result = loadOrCreateMunicipalityWorkspace("atarfe", ATARFE_INPUT);
    expect(result.seedPending).toBe(true);
    expect(result.seedMigration).toEqual({ kind: "none" });

    // El seed que reemplaza YA lleva la marca → estado final marcado.
    const seed = await loadMunicipalitySeed("atarfe", {
      baseUrl: "/",
      fetchImpl: okFetch(ATARFE_SEED_RAW),
    });
    const hydrated = shouldReplaceWithSeed(result.workspace, "atarfe") ? seed : result.workspace;
    expect(hydrated?.appliedSeedMigrations).toContain(ATARFE_MARKER);
    expect(resolveSeedMigration(hydrated!)).toEqual({ kind: "none" });
  });

  it("M8. fallo de descarga → la marca NO se registra (se reintenta)", async () => {
    // Sembrar un Atarfe legacy persistido → loadOrCreate resuelve download-and-merge.
    expect(saveWorkspaceToLocalStorage(legacyAtarfeWithoutLocaliza())).toBe(true);
    const result = loadOrCreateMunicipalityWorkspace("atarfe", ATARFE_INPUT);
    expect(result.seedMigration).toEqual({
      kind: "download-and-merge",
      migration: ATARFE_MIGRATION,
    });
    // La descarga falla → seed null → no se aplica la migración → sin marca.
    const seed = await loadMunicipalitySeed("atarfe", {
      baseUrl: "/",
      fetchImpl: notOkFetch(),
    });
    expect(seed).toBeNull();
    // El expediente legacy sigue sin marca: la próxima carga volverá a proponerla.
    const stillLegacy = result.workspace;
    expect((stillLegacy.appliedSeedMigrations ?? [])).not.toContain(ATARFE_MARKER);
    expect(resolveSeedMigration(stillLegacy).kind).toBe("download-and-merge");
  });

  it("M9. otros municipios no migran (Granada-Zaidín)", () => {
    const zaidin = JSON.parse(SEED_RAW) as MunicipalityWorkspace;
    expect(resolveSeedMigration(zaidin)).toEqual({ kind: "none" });
  });

  it("M10. compatibilidad de esquema: legacy sin appliedSeedMigrations parsea; no-array se descarta", () => {
    // (a) Legacy sin el campo → parsea con schemaVersion intacto, campo ausente.
    const legacy = legacyAtarfeWithoutLocaliza();
    const parsedLegacy = parseWorkspaceJSON(JSON.stringify(legacy))!;
    expect(parsedLegacy).not.toBeNull();
    expect(parsedLegacy.schemaVersion).toBe("1.0.0");
    expect(parsedLegacy.appliedSeedMigrations).toBeUndefined();

    // (b) Valor corrupto no-array → coerción defensiva lo descarta.
    const corrupt = { ...atarfeSeed(), appliedSeedMigrations: "atarfe-localiza-v1" };
    const parsedCorrupt = parseWorkspaceJSON(JSON.stringify(corrupt))!;
    expect(parsedCorrupt.appliedSeedMigrations).toBeUndefined();
  });

  it("M11. loadOrCreate: un Atarfe ya migrado (con marca) no propone migración", () => {
    expect(saveWorkspaceToLocalStorage(atarfeSeed())).toBe(true);
    const result = loadOrCreateMunicipalityWorkspace("atarfe", ATARFE_INPUT);
    expect(result.seedPending).toBe(false);
    expect(result.seedMigration).toEqual({ kind: "none" });
  });
});
