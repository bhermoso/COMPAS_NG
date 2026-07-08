import type { LocalHealthProfile } from "../../domain/health-profile";
import type { PerfilLocalDeSalud } from "../../domain/health-profile";

/**
 * Proyecta sintesisTexto del PerfilLocalDeSalud sobre las conclusiones (Cap. V) del PSL.
 *
 * ESTADO DE LA CONEXIÓN (2026-07-08): la síntesis del técnico llega al
 * documento narrativo por la capa de respuestas diagnósticas
 * (diagnosticAnswers → capítulo VI del borrador de seis capítulos), que la
 * ENCABEZA sin sustituir el documento completo. Esta función conserva la
 * semántica original de sustitución íntegra + authored y queda reservada para
 * un uso deliberado de anulación total del borrador; no se invoca en el
 * runtime porque reemplazaría los seis capítulos por un texto plano.
 *
 * Invariantes:
 *   - Si sintesisTexto tiene contenido no vacío: popula conclusiones.content y
 *     marca conclusiones.status = "authored".
 *   - Si sintesisTexto está ausente o vacío: devuelve el PSL sin cambios.
 *   - No modifica cierreInterpretativo.
 *   - No modifica priorizacion.
 *   - No muta ninguno de los dos inputs.
 */
export function populatePSLFromPerfil(
  psl: LocalHealthProfile,
  perfil: PerfilLocalDeSalud
): LocalHealthProfile {
  if (!perfil.sintesisTexto?.trim()) return psl;

  return {
    ...psl,
    conclusiones: {
      ...psl.conclusiones,
      content: perfil.sintesisTexto,
      status: "authored",
    },
  };
}
