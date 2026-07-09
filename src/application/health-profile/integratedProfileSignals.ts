/**
 * integratedProfileSignals
 *
 * Capa epistemológica intermedia del Perfil: cada señal de salud se
 * representa con su cadena completa (marco científico del Perfil):
 *
 *   señal → fuente → escala → desigualdad (conocida/desconocida) →
 *   mecanismo social plausible → activo/capacidad relacionada →
 *   estatus causal prudente → pregunta para el Grupo Motor.
 *
 * NO crea datos: consume estructuras ya existentes (lectura sanitaria del
 * Informe, bloques diagnósticos, referencias de indicadores, lectura
 * epidemiológico-social, salutogénesis, contexto BADEA) y las integra.
 *
 * Reglas del marco (profileScientificFramework):
 *   - Menciones del Informe = presencia textual, nunca prevalencia.
 *   - Proxy = contexto, nunca estimación distrital.
 *   - Activos = capacidades potenciales, nunca resultados.
 *   - Sin desagregación ⇒ desigualdad DESCONOCIDA (incertidumbre de equidad).
 *   - Validación comunitaria pendiente mientras no haya material cualitativo
 *     o deliberación registrada (Popay).
 */

import type { DiagnosticAnswers } from "./diagnosticAnswers";
import type { CausalStatus } from "./profileScientificFramework";
import { formatIndicatorValue } from "./complementaryIndicatorReferences";

// ── Tipos ─────────────────────────────────────────────────────────────────────

export type DistribucionDesigualdad =
  | "conocida"
  | "desconocida-sin-desagregacion";

export interface IntegratedHealthProfileSignal {
  id: string;
  /** Señal sanitaria o de bienestar. */
  senal: string;
  fuente: string;
  /** Escala real del dato (con su naturaleza proxy si procede). */
  escala: string;
  /** Valor medido o presencia textual (trazabilidad). */
  valor: string;
  /** true cuando el "valor" es presencia textual en el Informe. */
  esMencionTextual: boolean;
  /** true cuando el dato es proxy/contexto de escala superior. */
  esProxy: boolean;
  desigualdad: { distribucion: DistribucionDesigualdad; nota: string };
  /** Mecanismo social plausible (hipótesis trazable), si existe. */
  mecanismoPlausible?: string;
  /** Ámbito de capacidad comunitaria relacionado, si existe. */
  activoRelacionado?: string;
  /** Popay: pendiente hasta material cualitativo/deliberación registrada. */
  validacionComunitariaPendiente: boolean;
  estatusCausal: CausalStatus;
  preguntaGrupoMotor: string;
}

// ── Correspondencias conservadoras (por identidad de estructuras existentes) ──

const DESIGUALDAD_DESCONOCIDA = {
  distribucion: "desconocida-sin-desagregacion" as const,
  nota:
    "sin desagregación por sexo, edad ni condición socioeconómica: " +
    "incertidumbre de equidad, no ausencia de desigualdad",
};

// dimensión sanitaria del Informe → clave de mecanismo (enunciados reales de
// la lectura epidemiológico-social, enlazados por búsqueda de subcadena).
const DIMENSION_A_MECANISMO: Array<{ match: string; mecanismoIncluye: string }> = [
  { match: "salud mental", mecanismoIncluye: "psicosociales" },
  { match: "actividad física", mecanismoIncluye: "entorno urbano" },
  { match: "consumos", mecanismoIncluye: "consumo y alimentación" },
  { match: "alimentación", mecanismoIncluye: "consumo y alimentación" },
  { match: "envejecimiento", mecanismoIncluye: "envejecimiento" },
];

// dimensión/bloque → ámbito salutogénico relacionado (si existe en el mapa).
const A_AMBITO: Array<{ match: string; ambitoIncluye: string }> = [
  { match: "salud mental", ambitoIncluye: "salud mental" },
  { match: "envejecimiento", ambitoIncluye: "mayores" },
  { match: "actividad física", ambitoIncluye: "vida activa" },
  { match: "consumos", ambitoIncluye: "adicciones" },
  { match: "escolar", ambitoIncluye: "educación" },
  { match: "apoyo social", ambitoIncluye: "tejido vecinal" },
];

function buscarMecanismo(
  texto: string,
  answers: DiagnosticAnswers
): string | undefined {
  const clave = DIMENSION_A_MECANISMO.find((m) =>
    texto.toLowerCase().includes(m.match)
  );
  if (!clave) return undefined;
  return answers.determinantes.find(
    (d) =>
      (d.kind === "plausible" || d.kind === "a-contrastar") &&
      d.enunciado.includes(clave.mecanismoIncluye)
  )?.enunciado;
}

function buscarAmbito(
  texto: string,
  answers: DiagnosticAnswers
): string | undefined {
  const clave = A_AMBITO.find((m) => texto.toLowerCase().includes(m.match));
  if (!clave) return undefined;
  return answers.salutogenica.grupos.find((g) =>
    g.ambito.includes(clave.ambitoIncluye)
  )?.ambito;
}

// ── Constructor ───────────────────────────────────────────────────────────────

export function buildIntegratedProfileSignals(
  answers: DiagnosticAnswers
): IntegratedHealthProfileSignal[] {
  const signals: IntegratedHealthProfileSignal[] = [];

  // 1. Señales sanitarias del Informe: presencia textual, nunca prevalencia.
  for (const s of answers.sanitaria.senales) {
    signals.push({
      id: `informe-${s.dimension.replace(/[^a-záéíóúñ]+/gi, "-").toLowerCase()}`,
      senal: s.dimension,
      fuente: "Informe de salud (fuente diagnóstica primaria)",
      escala: "ámbito del Informe, sin desagregación distrital",
      valor: `presencia textual: ${s.menciones} mención(es) [${s.terminos.join(", ")}]`,
      esMencionTextual: true,
      esProxy: false,
      desigualdad: DESIGUALDAD_DESCONOCIDA,
      mecanismoPlausible: buscarMecanismo(s.dimension, answers),
      activoRelacionado: buscarAmbito(s.dimension, answers),
      validacionComunitariaPendiente: true,
      estatusCausal: "presencia-textual",
      preguntaGrupoMotor:
        `¿Cómo se expresa «${s.dimension}» en la vida cotidiana del barrio y ` +
        `en qué grupos pesa más?`,
    });
  }

  // 2. Indicadores trazadores de los estudios complementarios.
  const bloquePorId = new Map(
    answers.estudios.diagnosticBlocks.map((b) => [b.id, b])
  );
  for (const r of answers.referencias.references) {
    if (r.tracerPriority === undefined || r.territorialValue === undefined) {
      continue;
    }
    const bloque = bloquePorId.get(r.diagnosticBlockId);
    const mecanismo = bloque?.relatedDeterminantHypotheses[0];
    signals.push({
      id: `trazador-${r.indicatorId}`,
      senal: r.narrativeLabel,
      fuente: `${r.instrument} — ${r.source}`,
      escala: r.demoProxy
        ? "escala municipal/provincial usada como proxy contextual del ámbito"
        : "muestra territorial/demo declarada",
      valor: formatIndicatorValue(r.territorialValue, r.unit),
      esMencionTextual: false,
      esProxy: r.demoProxy,
      desigualdad: DESIGUALDAD_DESCONOCIDA,
      mecanismoPlausible: mecanismo,
      activoRelacionado: buscarAmbito(bloque?.title ?? r.narrativeLabel, answers),
      validacionComunitariaPendiente: true,
      estatusCausal: mecanismo !== undefined ? "hipotesis-plausible" : "descriptivo",
      preguntaGrupoMotor:
        bloque?.contrastQuestions[0] ??
        `¿Qué condiciones de vida del ámbito producen el patrón de ${r.narrativeLabel}?`,
    });
  }

  // 3. Contexto BADEA (si existe): descriptivo, proxy, secundario.
  const badea = answers.badeaContexto;
  if (badea !== undefined) {
    const grado = badea.indicadores.find((i) => typeof i.valor === "string");
    if (grado !== undefined) {
      signals.push({
        id: "badea-grado-urbanizacion",
        senal: "grado de urbanización del municipio de referencia",
        fuente: `BADEA/IECA, consulta ${grado.consulta} (${grado.actividad})`,
        escala: badea.esProxyMunicipioMatriz
          ? `municipal (${badea.territorio}), contexto del municipio matriz — no estimación distrital`
          : `municipal (${badea.territorio})`,
        valor: `«${String(grado.valor)}» (${grado.anio})`,
        esMencionTextual: false,
        esProxy: badea.esProxyMunicipioMatriz,
        desigualdad: DESIGUALDAD_DESCONOCIDA,
        mecanismoPlausible: buscarMecanismo("actividad física", answers),
        activoRelacionado: undefined,
        validacionComunitariaPendiente: true,
        estatusCausal: "descriptivo",
        preguntaGrupoMotor:
          "¿Cómo se vive el entorno urbano del barrio (espacio público, " +
          "accesibilidad, usos cotidianos) frente a este contexto municipal?",
      });
    }
  }

  return signals;
}

/**
 * Matriz integrada mínima (señal → fuente → escala → desigualdad → mecanismo
 * → activo/capacidad → estatus causal → pregunta): filas listas para tabla o
 * matriz deliberativa. Proyección textual de las señales integradas.
 */
export interface IntegratedMatrixRow {
  senal: string;
  fuente: string;
  escala: string;
  desigualdad: string;
  mecanismo: string;
  activoCapacidad: string;
  estatusCausal: CausalStatus;
  pregunta: string;
}

export function buildIntegratedMatrix(
  answers: DiagnosticAnswers
): IntegratedMatrixRow[] {
  return buildIntegratedProfileSignals(answers).map((s) => ({
    senal: s.senal,
    fuente: s.fuente,
    escala: s.escala,
    desigualdad:
      s.desigualdad.distribucion === "conocida"
        ? s.desigualdad.nota
        : `desconocida — ${s.desigualdad.nota}`,
    mecanismo: s.mecanismoPlausible ?? "sin mecanismo formulado todavía",
    activoCapacidad:
      s.activoRelacionado !== undefined
        ? `${s.activoRelacionado} (capacidad potencial, pendiente de validación comunitaria)`
        : "sin capacidad asociada en el mapa actual",
    estatusCausal: s.estatusCausal,
    pregunta: s.preguntaGrupoMotor,
  }));
}
