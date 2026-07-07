import type { LocalHealthProfile } from "../../domain/health-profile";
import type { PerfilLocalDeSalud } from "../../domain/health-profile";

/**
 * Proyecta sintesisTexto del PerfilLocalDeSalud sobre las conclusiones (Cap. V) del PSL.
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
