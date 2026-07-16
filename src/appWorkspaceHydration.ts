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
  };
}
