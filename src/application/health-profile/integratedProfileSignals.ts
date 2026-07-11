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

/**
 * Laguna de equidad de una señal. El marco científico exige declararla como
 * laguna ESPECÍFICA (no una fórmula genérica repetida): qué ejes de
 * desagregación faltan y qué no puede saberse de esta señal en concreto.
 */
export interface DesigualdadNoObservable {
  distribucion: DistribucionDesigualdad;
  /** Ejes de desagregación ausentes para esta señal. */
  ejesAusentes: string[];
  /** Lo que esta señal, así medida, no permite saber. */
  loQueNoSeSabe: string;
  /** Declaración completa (matriz y anexo). */
  nota: string;
}

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
  /** true cuando es una medición sobre muestra local del propio ámbito. */
  esLocal: boolean;
  /** Dimensión temática fina (para agrupar sin fusionar señales distintas). */
  dimension: string;
  /** Bloque diagnóstico de procedencia (ámbito). */
  ambito: string;
  /** Tamaño de muestra válida, si el estudio lo expone. */
  tamanoMuestra?: number;
  /** Muestra local pequeña: señal orientativa, no estimación poblacional. */
  caracterExploratorio: boolean;
  /** Prioridad editorial como trazador (NO filtra la existencia de la señal). */
  tracerPriority?: number;
  desigualdad: DesigualdadNoObservable;
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

// ── Laguna de equidad específica por señal ────────────────────────────────────
// Marco científico (Whitehead/Graham/Borrell/Benach/Bambra + Ruiz Cantero/
// García-Calvente): la ausencia de desagregación se declara como incertidumbre
// de equidad —jamás como ausencia de desigualdad— y como laguna ESPECÍFICA, no
// como fórmula genérica idéntica en todas las señales. La carga de cuidados es
// un eje propio cuando la señal interpela descanso, apoyo, soledad o
// envejecimiento.

const EJES_BASE = ["sexo", "edad", "posición socioeconómica"];

function sinTildes(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

function ejesAusentesDe(senal: string): string[] {
  const s = sinTildes(senal);
  const interpelaCuidados =
    /sueno|apoyo|soledad|envejec|cuidad|mental|malestar|depend/.test(s);
  return interpelaCuidados ? [...EJES_BASE, "carga de cuidados"] : [...EJES_BASE];
}

function enumerar(items: string[]): string {
  if (items.length <= 1) return items[0] ?? "";
  return `${items.slice(0, -1).join(", ")} ni ${items[items.length - 1]}`;
}

type TipoSenal = "informe" | "trazador" | "contexto";

function desigualdadNoObservable(
  senal: string,
  tipo: TipoSenal
): DesigualdadNoObservable {
  const ejesAusentes = ejesAusentesDe(senal);
  // Forma breve, para la prosa: el hilo ya ha nombrado la señal.
  const loQueNoSeSabe =
    tipo === "informe"
      ? "en qué grupos del territorio pesa"
      : tipo === "contexto"
        ? "cómo se distribuye dentro del distrito"
        : "quién la presenta en peor situación";
  const sujeto =
    tipo === "informe"
      ? "el Informe no desagrega esta dimensión"
      : tipo === "contexto"
        ? "el contexto municipal no informa de la distribución interna"
        : "la medición no está desagregada";
  return {
    distribucion: "desconocida-sin-desagregacion",
    ejesAusentes,
    loQueNoSeSabe,
    // Forma completa, para matriz y anexo: nombra la señal.
    nota:
      `${sujeto} por ${enumerar(ejesAusentes)}: no puede saberse ` +
      `${loQueNoSeSabe} («${senal}»). Incertidumbre de equidad, ` +
      `no ausencia de desigualdad`,
  };
}

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
      esLocal: false,
      dimension: "informe-presencia-textual",
      ambito: "informe",
      caracterExploratorio: false,
      desigualdad: desigualdadNoObservable(s.dimension, "informe"),
      mecanismoPlausible: buscarMecanismo(s.dimension, answers),
      activoRelacionado: buscarAmbito(s.dimension, answers),
      validacionComunitariaPendiente: true,
      estatusCausal: "presencia-textual",
      preguntaGrupoMotor:
        `¿Cómo se expresa «${s.dimension}» en la vida cotidiana del barrio y ` +
        `en qué grupos pesa más?`,
    });
  }

  // 2. Señales de los estudios complementarios.
  //    Toda referencia con valor se convierte en señal: `tracerPriority` es
  //    jerarquía EDITORIAL (qué destaca la tabla), no un filtro de conocimiento.
  //    Perder señales locales por no tener prioridad codificada era el defecto.
  const bloquePorId = new Map(
    answers.estudios.diagnosticBlocks.map((b) => [b.id, b])
  );
  for (const r of answers.referencias.references) {
    if (r.territorialValue === undefined) continue;
    const bloque = bloquePorId.get(r.diagnosticBlockId);
    const mecanismo = bloque?.relatedDeterminantHypotheses[0];
    const muestraStr =
      r.sampleSize !== undefined ? `n=${r.sampleSize}` : "muestra declarada";
    const escala = r.esLocal
      ? `muestra local exploratoria del ámbito (${muestraStr}), no representativa`
      : r.demoProxy
        ? "escala municipal/provincial usada como proxy contextual del ámbito"
        : "muestra territorial/demo declarada";
    signals.push({
      id: `trazador-${r.indicatorId}`,
      senal: r.narrativeLabel,
      fuente: `${r.instrument} — ${r.source}`,
      escala,
      valor: formatIndicatorValue(r.territorialValue, r.unit),
      esMencionTextual: false,
      esProxy: r.demoProxy,
      esLocal: r.esLocal,
      dimension: r.dimension,
      ambito: r.diagnosticBlockId,
      tamanoMuestra: r.sampleSize,
      caracterExploratorio: r.esLocal,
      tracerPriority: r.tracerPriority,
      desigualdad: desigualdadNoObservable(r.narrativeLabel, "trazador"),
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
        esLocal: false,
        dimension: "contexto-urbano",
        ambito: "badea",
        caracterExploratorio: false,
        desigualdad: desigualdadNoObservable(
          "grado de urbanización del municipio de referencia",
          "contexto"
        ),
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

// ── Conjuntos de señales por dimensión (selección editorial trazable) ─────────
//
// Separa lo que hasta ahora estaba mezclado: conocimiento disponible ≠ señal
// principal ≠ señales corroborantes ≠ contexto comparativo. La selección
// principal favorece la evidencia LOCAL cuando existe; los proxies pasan a
// contexto. Nada se descarta: `all` conserva todas las señales de la dimensión,
// y la vista decide después cuánto muestra.

export interface IntegratedSignalSet {
  dimension: string;
  ambito: string;
  /** Señal principal: local si la hay; si no, el proxy más informativo. */
  primary: IntegratedHealthProfileSignal;
  /** Señales del mismo carácter que la principal, con medida distinta. */
  corroborating: IntegratedHealthProfileSignal[];
  /** Señales de contexto (proxy/provincial) cuando la principal es local. */
  contextual: IntegratedHealthProfileSignal[];
  /** Todas las señales de la dimensión, sin descartar ninguna. */
  all: IntegratedHealthProfileSignal[];
}

// Señales de estudios complementarios: excluye Informe (presencia textual) y
// BADEA (contexto municipal), que no compiten por primacía de dimensión.
function esSenalDeEstudio(s: IntegratedHealthProfileSignal): boolean {
  return !s.esMencionTextual && s.ambito !== "badea";
}

/** Ordena candidatas a principal: local primero; dentro, mayor prioridad. */
function ordenPrimacia(
  a: IntegratedHealthProfileSignal,
  b: IntegratedHealthProfileSignal
): number {
  if (a.esLocal !== b.esLocal) return a.esLocal ? -1 : 1;
  const pa = a.tracerPriority ?? 99;
  const pb = b.tracerPriority ?? 99;
  return pa - pb;
}

export function buildIntegratedSignalSets(
  answers: DiagnosticAnswers
): IntegratedSignalSet[] {
  const signals = buildIntegratedProfileSignals(answers).filter(esSenalDeEstudio);

  const porDimension = new Map<string, IntegratedHealthProfileSignal[]>();
  for (const s of signals) {
    const grupo = porDimension.get(s.dimension) ?? [];
    grupo.push(s);
    porDimension.set(s.dimension, grupo);
  }

  const sets: IntegratedSignalSet[] = [];
  for (const [dimension, grupo] of porDimension) {
    const ordenadas = [...grupo].sort(ordenPrimacia);
    const primary = ordenadas[0];
    const resto = ordenadas.slice(1);
    // Corroborantes: mismo carácter (local↔local, proxy↔proxy) que la principal
    // y medida distinta — se conservan sin fusionarse. Contexto: distinto
    // carácter (proxies que contextualizan una principal local).
    const corroborating = resto.filter((s) => s.esLocal === primary.esLocal);
    const contextual = resto.filter((s) => s.esLocal !== primary.esLocal);
    sets.push({
      dimension,
      ambito: primary.ambito,
      primary,
      corroborating,
      contextual,
      all: grupo,
    });
  }

  return sets;
}
