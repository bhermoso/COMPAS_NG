import type { MunicipalityWorkspace } from "../../domain/workspace";
import { parseWorkspaceJSON } from "../persistence/local-storage";

/**
 * municipalitySeeds
 *
 * Hidratación inicial de expedientes municipales desde seeds canónicos
 * desplegables. Un seed es una copia REAL y rehidratable de un expediente
 * (mismo formato que el export/localStorage). No fabrica datos: registrar un
 * municipio aquí exige un fichero de expediente real desplegado en `public/seeds/`.
 */

export interface MunicipalitySeed {
  municipalityId: string;
  /** Nombre institucional esperado — verifica la identidad del expediente. */
  expectedName: string;
  /** Ruta del seed RELATIVA a `import.meta.env.BASE_URL` (sin barra inicial). */
  path: string;
}

/**
 * Registro genérico de seeds canónicos. SOLO se registran municipios con un export
 * real vigente y rehidratable.
 *
 * Estado (2026-07-16): expedientes canónicos cargables = Granada-Zaidín (20
 * documentos, 92 evidencias) y Atarfe (Informe de Salud + IBSE municipal: 2
 * documentos, 6 evidencias). Alfacar, Churriana de la Vega y Zagra NO tienen
 * export real: se abren vacíos hasta que exista uno (no se inventa contenido; las
 * fixtures sintéticas o provinciales NO se promueven a datos de producción).
 */
export const MUNICIPALITY_SEEDS: Readonly<Record<string, MunicipalitySeed>> = {
  "granada-zaidin": {
    municipalityId: "granada-zaidin",
    expectedName: "Granada-Zaidín",
    path: "seeds/compas-ng-workspace-granada-zaidin.json",
  },
  atarfe: {
    municipalityId: "atarfe",
    expectedName: "Atarfe",
    path: "seeds/compas-ng-workspace-atarfe.json",
  },
};

export function hasMunicipalitySeed(municipalityId: string): boolean {
  return Object.prototype.hasOwnProperty.call(MUNICIPALITY_SEEDS, municipalityId);
}

/**
 * URL absoluta del seed bajo el `base` de despliegue. En GitHub Pages
 * `import.meta.env.BASE_URL` es `/COMPAS_NG/`; en dev/test es `/`. Vite garantiza
 * que BASE_URL termina en `/`, de modo que no se duplica la barra.
 */
export function municipalitySeedUrl(
  seed: MunicipalitySeed,
  baseUrl: string
): string {
  return `${baseUrl}${seed.path}`;
}

export interface LoadMunicipalitySeedOptions {
  /** Base de despliegue; normalmente `import.meta.env.BASE_URL`. */
  baseUrl: string;
  /** Inyectable para tests. Por defecto, el `fetch` global. */
  fetchImpl?: typeof fetch;
}

/**
 * Carga y valida el seed canónico de un municipio. Devuelve `null` de forma segura
 * ante CUALQUIER fallo: sin seed registrado, error de red, HTTP no-ok, JSON
 * inválido, esquema o colecciones básicas incorrectas, o identidad municipal que
 * no concuerda con la solicitada. Nunca lanza. No toca `localStorage`: la decisión
 * de si sobreescribir un expediente local es del llamador.
 */
export async function loadMunicipalitySeed(
  municipalityId: string,
  options: LoadMunicipalitySeedOptions
): Promise<MunicipalityWorkspace | null> {
  const seed = MUNICIPALITY_SEEDS[municipalityId];
  if (seed === undefined) return null;
  const doFetch = options.fetchImpl ?? fetch;
  try {
    const response = await doFetch(municipalitySeedUrl(seed, options.baseUrl));
    if (!response.ok) return null;
    const raw = await response.text();
    const workspace = parseWorkspaceJSON(raw);
    if (workspace === null) return null;
    // Identidad municipal: el seed debe corresponder EXACTAMENTE al municipio pedido.
    const identity = workspace.municipality.identity;
    if (identity.id !== seed.municipalityId) return null;
    if (identity.name !== seed.expectedName) return null;
    return workspace;
  } catch {
    return null;
  }
}
