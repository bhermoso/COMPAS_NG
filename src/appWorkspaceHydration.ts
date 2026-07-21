import type { MunicipalityWorkspace } from "./domain/workspace";
import type { CreateMunicipalityContextInput } from "./domain/municipality";
import {
  createCompleteMunicipalityWorkspace,
  isEmptyWorkspaceForPersistenceGuard,
} from "./application/workspace";
import {
  loadWorkspaceFromLocalStorage,
  hasWorkspaceInLocalStorage,
} from "./infrastructure/persistence/local-storage";
import { hasMunicipalitySeed } from "./infrastructure/seeds";

/**
 * appWorkspaceHydration
 *
 * Composición a nivel de aplicación: decide cómo cargar el expediente de un
 * municipio (localStorage prioritario → seed canónico → placeholder vacío) y el
 * guard de persistencia que evita la carrera de la hidratación asíncrona.
 * Vive fuera de `App.tsx` para ser testable sin renderizar el componente (los
 * tests SSR no ejecutan efectos) y sin disparar `react-refresh/only-export-components`.
 */

/**
 * Migración incremental de un documento de seed a un expediente ya persistido.
 * A diferencia del reemplazo completo (`shouldReplaceWithSeed`), añade ÚNICAMENTE
 * el documento indicado y sus átomos derivados cuando faltan, preservando todo el
 * trabajo del usuario. Se controla con una marca versionada (`marker`) en
 * `MunicipalityWorkspace.appliedSeedMigrations`, de modo que un borrado deliberado
 * posterior mediante «Eliminar» se respeta (la marca gana a la ausencia del doc).
 */
export interface SeedDocumentMigration {
  municipalityId: string;
  documentId: string;
  marker: string;
}

/**
 * Lista blanca CERRADA de migraciones incrementales autorizadas. No es una
 * reconciliación genérica del seed: solo se migra exactamente lo declarado aquí.
 */
export const INCREMENTAL_SEED_MIGRATIONS: readonly SeedDocumentMigration[] = [
  {
    municipalityId: "atarfe",
    documentId: "doc-localiza-atarfe",
    marker: "atarfe-localiza-v1",
  },
];

/**
 * Acción de migración incremental resuelta para un expediente:
 *   - none               → nada que hacer (marca presente, u otro municipio).
 *   - backfill-marker     → ya contiene el documento pero falta la marca: se estampa
 *                           localmente, sin descargar el seed ni duplicar nada.
 *   - download-and-merge  → falta marca y documento: hay que descargar el seed,
 *                           fusionar el doc + sus átomos y estampar la marca (atómico).
 */
export type SeedMigrationAction =
  | { kind: "none" }
  | { kind: "backfill-marker"; migration: SeedDocumentMigration }
  | { kind: "download-and-merge"; migration: SeedDocumentMigration };

export interface WorkspaceLoadResult {
  workspace: MunicipalityWorkspace;
  protectExistingStorage: boolean;
  /**
   * true cuando NO hay expediente local válido pero existe un seed canónico para
   * el municipio: el workspace devuelto es un placeholder vacío que debe hidratarse
   * de forma asíncrona desde el seed. Mientras esté pendiente, el placeholder NO se
   * persiste (evita la carrera que guarda un expediente vacío antes de la carga).
   */
  seedPending: boolean;
  /**
   * Migración incremental pendiente para un expediente CON CONTENIDO (no vacío).
   * Mutuamente excluyente con `seedPending`: si el expediente se va a reemplazar
   * entero por el seed, no procede migración incremental. `{ kind: "none" }` cuando
   * no hay nada que migrar.
   */
  seedMigration: SeedMigrationAction;
}

/**
 * Resuelve la migración incremental aplicable a un expediente. Predicado puro:
 * la marca versionada tiene prioridad absoluta sobre la presencia del documento,
 * de modo que un borrado deliberado posterior (doc ausente, marca presente) NO
 * reintroduce el documento.
 */
export function resolveSeedMigration(
  current: MunicipalityWorkspace
): SeedMigrationAction {
  const id = current.municipality.identity.id;
  for (const migration of INCREMENTAL_SEED_MIGRATIONS) {
    if (migration.municipalityId !== id) continue;
    const hasMarker = (current.appliedSeedMigrations ?? []).includes(
      migration.marker
    );
    if (hasMarker) return { kind: "none" };
    const hasDoc = current.repository.documents.some(
      (d) => d.id === migration.documentId
    );
    if (hasDoc) return { kind: "backfill-marker", migration };
    return { kind: "download-and-merge", migration };
  }
  return { kind: "none" };
}

/** Añade una marca de migración al expediente (idempotente). Puro. */
function withMarker(
  workspace: MunicipalityWorkspace,
  marker: string
): MunicipalityWorkspace {
  const current = workspace.appliedSeedMigrations ?? [];
  if (current.includes(marker)) return workspace;
  return { ...workspace, appliedSeedMigrations: [...current, marker] };
}

/**
 * Caso `backfill-marker`: el expediente ya contiene el documento (p. ej. tras una
 * hidratación limpia previa a esta versión). Solo registra la marca; no descarga
 * ni duplica. Puro.
 */
export function backfillSeedMigrationMarker(
  current: MunicipalityWorkspace,
  migration: SeedDocumentMigration
): MunicipalityWorkspace {
  return withMarker(current, migration.marker);
}

/**
 * Caso `download-and-merge`: fusiona el documento del seed y sus átomos derivados
 * (los que apuntan a `documentId`) en el expediente actual, y estampa la marca —
 * TODO en un único objeto devuelto (atómico al persistir). Preserva íntegramente
 * documentos, evidencias y trabajo del usuario. Determinista: usa el sello canónico
 * del documento del seed (no `new Date()`). Idempotente por marca y por id de átomo.
 */
export function applySeedDocumentMigration(
  current: MunicipalityWorkspace,
  seed: MunicipalityWorkspace,
  migration: SeedDocumentMigration
): MunicipalityWorkspace {
  // Ya aplicada: no-op (idempotencia por marca).
  if ((current.appliedSeedMigrations ?? []).includes(migration.marker)) {
    return current;
  }
  const seedDoc = seed.repository.documents.find(
    (d) => d.id === migration.documentId
  );
  // Defensivo: si el seed no trae el documento, NO se marca (permite reintentar).
  if (seedDoc === undefined) return current;

  const existingAtomIds = new Set(current.evidenceStore.atoms.map((a) => a.id));
  const atomsToAdd = seed.evidenceStore.atoms.filter(
    (a) =>
      a.provenance.documentId === migration.documentId &&
      !existingAtomIds.has(a.id)
  );
  const alreadyHasDoc = current.repository.documents.some(
    (d) => d.id === migration.documentId
  );
  const stamp = seedDoc.updatedAt;

  const merged: MunicipalityWorkspace = {
    ...current,
    repository: alreadyHasDoc
      ? current.repository
      : {
          ...current.repository,
          documents: [...current.repository.documents, seedDoc],
          updatedAt: stamp,
        },
    evidenceStore:
      atomsToAdd.length === 0
        ? current.evidenceStore
        : {
            ...current.evidenceStore,
            atoms: [...current.evidenceStore.atoms, ...atomsToAdd],
            updatedAt: stamp,
          },
  };
  return withMarker(merged, migration.marker);
}

/**
 * Decide si el efecto de persistencia debe OMITIR el guardado. Se omite (a) durante
 * la hidratación asíncrona del seed del municipio —no persistir el placeholder
 * vacío evita la carrera que dejaría el expediente vacío permanente— o (b) cuando
 * el guard protege un expediente vacío sobre datos locales que no rehidrataron.
 * Predicado puro y testable.
 */
export function shouldSkipPersistence(params: {
  workspaceMunicipalityId: string;
  pendingSeedId: string | null;
  protectedEmptyWorkspaceId: string | null;
  isEmpty: boolean;
}): boolean {
  if (params.pendingSeedId === params.workspaceMunicipalityId) return true;
  if (
    params.protectedEmptyWorkspaceId === params.workspaceMunicipalityId &&
    params.isEmpty
  ) {
    return true;
  }
  return false;
}

/**
 * Decide si el placeholder actual puede sustituirse por el seed canónico. SOLO se
 * sustituye cuando el workspace en memoria es del municipio del seed y está VACÍO
 * según la definición canónica `isEmptyWorkspaceForPersistenceGuard` (sin
 * documentos, evidencias, estudios, priorización, perfiles compilados ni ningún
 * otro contenido humano). Nunca sobreescribe contenido real. Predicado puro.
 */
export function shouldReplaceWithSeed(
  current: MunicipalityWorkspace,
  seedMunicipalityId: string
): boolean {
  return (
    current.municipality.identity.id === seedMunicipalityId &&
    isEmptyWorkspaceForPersistenceGuard(current)
  );
}

/**
 * Carga el expediente de un municipio. Prioridad:
 *   1. Un expediente local válido y CON CONTENIDO real gana SIEMPRE (no se toca).
 *   2. Un expediente local válido pero PRÍSTINO/VACÍO es un placeholder de la
 *      versión anterior (creado por `createCompleteMunicipalityWorkspace`); si el
 *      municipio tiene seed canónico, se marca `seedPending` para sustituirlo.
 *   3. Sin ninguna entrada local y con seed → placeholder vacío + `seedPending`.
 *   4. Entrada local presente pero que no rehidrata (esquema anterior/corrupta) →
 *      se protege y NO se hidrata (hay trabajo del usuario que no debe pisarse).
 * La sustitución efectiva la realiza el llamador de forma asíncrona (ver
 * `shouldReplaceWithSeed`), nunca sobre contenido real.
 */
export function loadOrCreateMunicipalityWorkspace(
  municipalityId: string,
  input: CreateMunicipalityContextInput
): WorkspaceLoadResult {
  const loaded = loadWorkspaceFromLocalStorage(municipalityId);
  if (loaded !== null) {
    // Placeholder vacío de la versión anterior: sustituible por el seed. Un
    // expediente con contenido real conserva seedPending=false y prevalece.
    const isReplaceablePlaceholder =
      isEmptyWorkspaceForPersistenceGuard(loaded) &&
      hasMunicipalitySeed(municipalityId);
    return {
      workspace: loaded,
      protectExistingStorage: false,
      seedPending: isReplaceablePlaceholder,
      // La migración incremental solo aplica a un expediente CON contenido que no
      // se va a reemplazar entero. Si es placeholder reemplazable, el seed completo
      // (que ya trae el documento y su marca) lo cubre.
      seedMigration: isReplaceablePlaceholder
        ? { kind: "none" }
        : resolveSeedMigration(loaded),
    };
  }

  // Hay entrada local pero no rehidrata (esquema anterior/corrupta): se protege y
  // NO se hidrata seed —hay trabajo del usuario que no debe pisarse—.
  const hasCorruptLocal = hasWorkspaceInLocalStorage(municipalityId);

  return {
    workspace: createCompleteMunicipalityWorkspace(input),
    protectExistingStorage: hasCorruptLocal,
    // Solo se hidrata desde seed cuando no existe NINGUNA entrada local.
    seedPending: !hasCorruptLocal && hasMunicipalitySeed(municipalityId),
    seedMigration: { kind: "none" },
  };
}
