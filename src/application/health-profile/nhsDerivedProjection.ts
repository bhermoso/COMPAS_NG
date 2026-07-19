/**
 * nhsDerivedProjection
 *
 * Proyección BREVE derivada del Perfil de Salud Local canónico (GOV-P4-01 · PR-D).
 *
 * Reoriginación del antiguo «Perfil de Salud tipo NHS»: la vista breve deja de
 * consumir el artefacto autónomo `NHSHealthProfileArtifact` y pasa a proyectarse
 * MECÁNICAMENTE desde el documento canónico sellado. Fuente primaria única:
 * `editorialView.tracerTable`.
 *
 * Doctrina (CONTRACT-NHS §0; Fundamentos del Perfil único):
 *  - `computePosition` está descartado. Esta proyección NO emite posición
 *    municipio↔referencia (`above`/`below`/`similar`), ni «mejor»/«peor», ni
 *    ranking, ni ningún veredicto: presenta los datos del trazador y deja la
 *    interpretación al lector.
 *  - Preserva `esProxy`. La condición de proxy contextual depende EXCLUSIVAMENTE
 *    del booleano `esProxy`; nunca se infiere del texto de `escala`.
 *  - No fabrica identidad: el trazador canónico (`TrazadorRow`) NO tiene ID de
 *    fila. La identidad de proyección es POSICIONAL + textual (`bloque`,
 *    `indicador`). No se une con `technicalSpace.comparativeReferences` ni se
 *    construye ninguna tabla local de correspondencia.
 *  - `lectura` (prosa comparativa entre referencias) queda EXCLUIDA del contrato
 *    breve.
 *
 * Capa pura: no importa workspace, estudios, agregados, módulos metodológicos,
 * el compilador NHS ni los tipos `NHS*`. No contiene umbrales ni aritmética.
 */

import type { CanonicalProfileDocument } from "./canonicalProfileDocument";

/**
 * Fila derivada: paso-a-través literal de una fila del trazador canónico.
 * Los campos son cadenas ya formateadas por el canónico (la unidad va embebida
 * en `valor`/referencias); la aritmética comparativa es imposible por construcción.
 */
export interface NHSDerivedRow {
  bloque: string;
  indicador: string;
  valor: string;
  /** Referencia provincial (o el literal canónico "no disponible"). */
  refGranada: string;
  /** Referencia andaluza (o el literal canónico "no disponible"). */
  refAndalucia: string;
  esProxy: boolean;
  /** Etiqueta canónica de escala; paso-a-través literal (no se analiza su texto). */
  escala: string;
}

/**
 * Resultado de proyección:
 *  - `available: true`  → hay documento canónico; `rows` refleja el trazador
 *    (puede ser un array vacío: proyección vacía válida, sin fabricar filas).
 *  - `available: false` → documento ausente, legacy o incompleto. NUNCA se
 *    recurre al artefacto NHS como fallback.
 */
export type NHSDerivedProjection =
  | { available: true; rows: NHSDerivedRow[] }
  | { available: false };

/**
 * Proyecta el documento canónico sellado a la representación breve derivada.
 *
 * `null` — tal como lo devuelve `readSealedCanonicalDocument` ante un sello
 * inexistente, legacy o incompleto — ⇒ estado «no disponible» tipado.
 *
 * Proyección 1:1 por posición: preserva el orden y la identidad textual de cada
 * fila del trazador, sin reordenar, agrupar por dominio, comparar ni clasificar.
 */
export function projectNHSDerived(
  doc: CanonicalProfileDocument | null
): NHSDerivedProjection {
  if (doc === null) return { available: false };
  const rows: NHSDerivedRow[] = doc.editorialView.tracerTable.map((r) => ({
    bloque: r.bloque,
    indicador: r.indicador,
    valor: r.valor,
    refGranada: r.refGranada,
    refAndalucia: r.refAndalucia,
    esProxy: r.esProxy,
    escala: r.escala,
  }));
  return { available: true, rows };
}
