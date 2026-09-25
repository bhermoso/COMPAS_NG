import type { EvidenceAtom } from "./EvidenceAtom";

/**
 * Síntesis automática derivada.
 *
 * Una «síntesis automática derivada» es un átomo que el sistema CALCULA a partir de
 * otros datos del mismo estudio (no un conocimiento primario, cualitativo ni
 * participativo). El ejemplo canónico es `IBSE_RESUMEN`: un texto que resume los
 * factores IBSE, generado por `ibseStudyToEvidenceAtoms`. Aunque su `kind` sea
 * `qualitative-observation`, NO es experiencia vivida ni conocimiento ciudadano y
 * por tanto **no debe contar como hallazgo cualitativo ni como participación**.
 *
 * La única marca formal disponible hoy es el tag `ibse-derived`. Se enumera de forma
 * EXPLÍCITA: no se generaliza a «cualquier tag terminado en -derived» (eso exigiría
 * auditar toda la taxonomía de tags). Al añadir nuevas síntesis derivadas en el
 * futuro, márquense con su tag y regístrese aquí.
 */

/** Tag que marca la síntesis interpretativa automática del IBSE (`IBSE_RESUMEN`). */
export const IBSE_DERIVED_TAG = "ibse-derived";

/** Conjunto explícito de marcadores de «síntesis automática derivada». */
const DERIVED_SYNTHESIS_TAGS: ReadonlySet<string> = new Set([IBSE_DERIVED_TAG]);

/**
 * ¿El átomo es una síntesis automática derivada (no conocimiento primario)?
 * Predicado semántico centralizado — no compara el título ni el id visible del átomo.
 */
export function isDerivedSynthesisAtom(atom: EvidenceAtom): boolean {
  return atom.tags.some((tag) => DERIVED_SYNTHESIS_TAGS.has(tag));
}
