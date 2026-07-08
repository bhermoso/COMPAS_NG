/**
 * diagnosticAnswers
 *
 * Capa pura de RESPUESTAS DIAGNÓSTICAS del Perfil Local de Salud.
 * Traduce la base disponible (espacio de conocimiento del técnico, Informe de
 * Salud parseado, señales de los estudios, activos y determinantes documentados)
 * en material sustantivo que los capítulos narrativos pueden redactar.
 *
 * Prioridad epistémica de cada respuesta:
 *   1. Interpretaciones activas del técnico (con certeza y trazabilidad).
 *   2. Hipótesis activas (explicaciones candidatas, nunca hechos).
 *   3. Lectura generada desde evidencia (señales, Informe, activos).
 *   4. Preguntas abiertas (lagunas positivas del conocimiento).
 *   5. Síntesis del técnico (modula el cierre; no sustituye el documento).
 *
 * Reglas:
 *   - El Perfil concluye, pero no recomienda: esta capa no formula actuaciones,
 *     programas ni líneas estratégicas.
 *   - La lectura epidemiológico-social produce determinantes PLAUSIBLES con
 *     cautela expresa, distinguiendo documentado / plausible / no evaluable /
 *     a contrastar. Nunca causalidad demostrada.
 *   - El Informe de Salud se lee (títulos y temas de sus secciones parseadas),
 *     no se atomiza ni se modifica (D-HR-01 intacta).
 */

import type { MunicipalityWorkspace } from "../../domain/workspace";
import type {
  PerfilLocalDeSalud,
  ProfileSpace,
  HealthProfileInterpretation,
  HealthProfileHypothesis,
  HealthProfileOpenQuestion,
} from "../../domain/health-profile";

// ── Tipos de la capa ──────────────────────────────────────────────────────────

export type DeterminantReadingKind =
  | "documentado"
  | "plausible"
  | "no-evaluable"
  | "a-contrastar";

export interface DiagnosticDeterminantReading {
  kind: DeterminantReadingKind;
  /** Enunciado del determinante, en lenguaje diagnóstico. */
  enunciado: string;
  /** Base que lo sustenta (señales, evidencia) o motivo de no evaluabilidad. */
  base: string;
}

export interface HealthReportReading {
  present: boolean;
  title?: string;
  /** Temas cubiertos por el Informe (títulos de secciones parseadas). */
  temas: string[];
}

export interface SalutogenicGroup {
  ambito: string;
  count: number;
  ejemplos: string[];
}

export interface SalutogenicReading {
  totalAssets: number;
  grupos: SalutogenicGroup[];
  sinClasificar: number;
}

export interface SpaceKnowledge {
  interpretaciones: Array<{ enunciado: string; certeza: string; autorNombre: string }>;
  hipotesis: Array<{ enunciado: string; plausibilidad: string; preguntasResolutoras: string[] }>;
  lagunas: Array<{ formulacion: string; relevancia: string; urgencia: string }>;
}

export interface DiagnosticAnswers {
  /** Conocimiento del técnico agrupado por espacio funcional. */
  porEspacio: Partial<Record<ProfileSpace, SpaceKnowledge>>;
  healthReport: HealthReportReading;
  /** Lectura epidemiológico-social de determinantes. */
  determinantes: DiagnosticDeterminantReading[];
  /** Señales presentes en la evidencia (para redactar la situación de salud). */
  senalesPresentes: string[];
  salutogenica: SalutogenicReading;
  /** Síntesis narrativa del técnico, si existe. */
  sintesisTexto?: string;
}

export interface BuildDiagnosticAnswersInput {
  workspace: MunicipalityWorkspace;
  /** Determinantes documentados (títulos de átomos kind "determinant"). */
  determinantTitles: string[];
  /** Activos disponibles (título + contenido) para la lectura salutogénica. */
  assets: Array<{ title: string; content: string }>;
}

// ── Utilidades ────────────────────────────────────────────────────────────────

function normalize(value: string): string {
  const decomposed = value.normalize("NFD").toLowerCase();
  let out = "";
  for (let i = 0; i < decomposed.length; i++) {
    const code = decomposed.charCodeAt(i);
    const keep =
      (code >= 48 && code <= 57) || (code >= 97 && code <= 122) || code === 32;
    if (keep) out += decomposed[i];
  }
  return out;
}

function toSentenceCase(title: string): string {
  const clean = title.trim().replace(/\s+/g, " ");
  if (clean.length === 0) return clean;
  const lower = clean.toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

// ── Lectura del Informe de Salud (sustantiva, sin atomizar) ──────────────────

const NON_THEMATIC_SECTION_RE = /portada|indice|índice|autores/i;

function readHealthReport(workspace: MunicipalityWorkspace): HealthReportReading {
  const hr = workspace.healthReport;
  if (!hr) return { present: false, temas: [] };
  const temas = (hr.sections ?? [])
    .filter((s) => s.title && !NON_THEMATIC_SECTION_RE.test(s.title))
    .map((s) => toSentenceCase(s.title))
    .slice(0, 6);
  return { present: true, title: hr.title, temas };
}

// ── Señales de los estudios y lectura epidemiológico-social ──────────────────

interface Senal {
  presente: boolean;
  etiqueta: string;
  claveDeterminante: string;
}

function detectarSenales(workspace: MunicipalityWorkspace): Senal[] {
  return [
    {
      presente: workspace.dukeStudy !== undefined,
      etiqueta: "apoyo social funcional",
      claveDeterminante: "redes",
    },
    {
      presente:
        workspace.ghq12Study !== undefined ||
        workspace.phq9Study !== undefined ||
        workspace.sf12Study !== undefined,
      etiqueta: "salud mental y salud percibida",
      claveDeterminante: "psicosocial",
    },
    {
      presente: workspace.suenoStudy !== undefined || workspace.psqiStudy !== undefined,
      etiqueta: "calidad y suficiencia del sueño",
      claveDeterminante: "psicosocial",
    },
    {
      presente: workspace.ipaqStudy !== undefined || workspace.sbqStudy !== undefined,
      etiqueta: "actividad física y sedentarismo",
      claveDeterminante: "entorno-urbano",
    },
    {
      presente:
        workspace.cageStudy !== undefined ||
        workspace.auditcStudy !== undefined ||
        workspace.fagerstromStudy !== undefined,
      etiqueta: "consumos de alcohol y tabaco",
      claveDeterminante: "consumos",
    },
    {
      presente: workspace.predimedStudy !== undefined,
      etiqueta: "alimentación",
      claveDeterminante: "entorno-alimentario",
    },
    {
      presente: workspace.ibseStudy !== undefined,
      etiqueta: "bienestar socioemocional escolar",
      claveDeterminante: "educativo-familiar",
    },
  ];
}

/**
 * Lectura desde la epidemiología social: determinantes plausibles inferidos
 * con cautela del patrón de señales realmente presente. No afirma causalidad;
 * no recomienda; distingue documentado / plausible / no evaluable / a contrastar.
 */
export function inferSocialEpidemiologyDeterminants(
  workspace: MunicipalityWorkspace,
  determinantTitles: string[],
  salutogenica: SalutogenicReading
): DiagnosticDeterminantReading[] {
  const lecturas: DiagnosticDeterminantReading[] = [];
  const senales = detectarSenales(workspace).filter((s) => s.presente);
  const etiqueta = (clave: string): string[] =>
    senales.filter((s) => s.claveDeterminante === clave).map((s) => s.etiqueta);

  // 1. Documentados
  for (const titulo of determinantTitles.slice(0, 5)) {
    lecturas.push({
      kind: "documentado",
      enunciado: titulo,
      base: "determinante documentado directamente en la evidencia del repositorio",
    });
  }

  // 2. Plausibles (solo si la señal correspondiente existe)
  const redes = etiqueta("redes");
  const psicosocial = etiqueta("psicosocial");
  if (redes.length > 0 || psicosocial.length > 0) {
    lecturas.push({
      kind: "plausible",
      enunciado:
        "condiciones psicosociales del entorno cotidiano (redes de apoyo, " +
        "convivencia y carga de malestar emocional)",
      base:
        `patrón compatible con las señales de ${[...redes, ...psicosocial].join(", ")} ` +
        `presentes en la evidencia contextual`,
    });
  }
  const urbano = etiqueta("entorno-urbano");
  if (urbano.length > 0) {
    lecturas.push({
      kind: "plausible",
      enunciado:
        "características del entorno urbano y oportunidades de vida activa " +
        "(espacio público, accesibilidad, usos cotidianos)",
      base: `patrón compatible con las señales de ${urbano.join(", ")}`,
    });
  }
  const consumos = etiqueta("consumos");
  const alimentario = etiqueta("entorno-alimentario");
  if (consumos.length > 0 || alimentario.length > 0) {
    lecturas.push({
      kind: "plausible",
      enunciado:
        "condiciones socioeconómicas y contextos de consumo y alimentación",
      base:
        `patrón compatible con las señales de ${[...consumos, ...alimentario].join(", ")}`,
    });
  }

  // 3. A contrastar: envejecimiento, si los activos lo sugieren
  const grupoMayores = salutogenica.grupos.find((g) =>
    g.ambito.includes("mayores")
  );
  if (grupoMayores !== undefined && grupoMayores.count >= 3) {
    lecturas.push({
      kind: "a-contrastar",
      enunciado:
        "envejecimiento y riesgo de soledad no deseada como eje territorial",
      base:
        `la concentración de activos orientados a personas mayores ` +
        `(${grupoMayores.count} recursos) sugiere un peso demográfico y ` +
        `comunitario de este eje que el Grupo Motor debe contrastar`,
    });
  }

  // 4. No evaluables con la evidencia disponible
  lecturas.push({
    kind: "no-evaluable",
    enunciado:
      "desigualdades internas por sexo, edad o condición socioeconómica",
    base:
      "los agregados disponibles no están desagregados; la ausencia de dato " +
      "no equivale a ausencia de desigualdad",
  });
  lecturas.push({
    kind: "no-evaluable",
    enunciado: "condiciones materiales de vivienda, renta y empleo del ámbito",
    base: "no constan fuentes directas de escala suficiente en el expediente actual",
  });

  return lecturas;
}

// ── Lectura salutogénica mínima ───────────────────────────────────────────────

const SALUTOGENIC_TAXONOMY: Array<{ ambito: string; claves: string[] }> = [
  { ambito: "personas mayores y envejecimiento activo", claves: ["mayores", "envejec", "jubil"] },
  { ambito: "salud mental y bienestar emocional", claves: ["salud mental", "psicolog", "emocional"] },
  { ambito: "prevención de adicciones y consumos", claves: ["adicc", "drogo", "alcohol", "tabaco", "proyecto hombre"] },
  { ambito: "tejido vecinal y participación comunitaria", claves: ["vecin", "particip", "comunitar", "asociacion cultural"] },
  { ambito: "vida activa y actividad física", claves: ["deport", "baile", "fisica", "swing"] },
  { ambito: "cuidados y atención sanitaria", claves: ["centro de salud", "hospital", "enfermer", "cardiac", "diabet", "pacientes", "sanitar", "cuidados"] },
  { ambito: "servicios sociales e inclusión", claves: ["servicios sociales", "inclusion", "cmss", "eracis", "vulnerab", "cruz roja"] },
  { ambito: "educación y promoción de la salud", claves: ["escuela", "educa", "formaci", "promocion de la salud", "prevencion"] },
];

export function buildSalutogenicReading(
  assets: Array<{ title: string; content: string }>
): SalutogenicReading {
  const grupos: SalutogenicGroup[] = SALUTOGENIC_TAXONOMY.map((g) => ({
    ambito: g.ambito,
    count: 0,
    ejemplos: [],
  }));
  let sinClasificar = 0;

  for (const asset of assets) {
    const texto = normalize(`${asset.title} ${asset.content}`);
    const grupo = SALUTOGENIC_TAXONOMY.findIndex((g) =>
      g.claves.some((clave) => texto.includes(normalize(clave)))
    );
    if (grupo === -1) {
      sinClasificar++;
      continue;
    }
    grupos[grupo].count++;
    if (grupos[grupo].ejemplos.length < 2) grupos[grupo].ejemplos.push(asset.title);
  }

  return {
    totalAssets: assets.length,
    grupos: grupos.filter((g) => g.count > 0).sort((a, b) => b.count - a.count),
    sinClasificar,
  };
}

// ── Conocimiento del técnico por espacio ──────────────────────────────────────

function knowledgeBySpace(
  perfil: PerfilLocalDeSalud | undefined
): Partial<Record<ProfileSpace, SpaceKnowledge>> {
  if (!perfil) return {};
  const resultado: Partial<Record<ProfileSpace, SpaceKnowledge>> = {};

  const ensure = (espacio: ProfileSpace): SpaceKnowledge => {
    if (!resultado[espacio]) {
      resultado[espacio] = { interpretaciones: [], hipotesis: [], lagunas: [] };
    }
    return resultado[espacio]!;
  };

  for (const i of perfil.interpretaciones.filter(
    (x: HealthProfileInterpretation) => x.status === "activa"
  )) {
    ensure(i.espacio).interpretaciones.push({
      enunciado: i.enunciado,
      certeza: i.certeza,
      autorNombre: i.autorNombre,
    });
  }
  for (const h of perfil.hipotesis.filter(
    (x: HealthProfileHypothesis) => x.status === "activa"
  )) {
    ensure(h.espacio).hipotesis.push({
      enunciado: h.enunciado,
      plausibilidad: h.plausibilidad,
      preguntasResolutoras: [...h.preguntasResolutoras],
    });
  }
  for (const q of perfil.preguntasAbiertas.filter(
    (x: HealthProfileOpenQuestion) => x.status === "abierta"
  )) {
    ensure(q.espacio).lagunas.push({
      formulacion: q.formulacion,
      relevancia: q.relevancia,
      urgencia: q.urgencia,
    });
  }
  return resultado;
}

// ── Punto de entrada ──────────────────────────────────────────────────────────

export function buildDiagnosticAnswers(
  input: BuildDiagnosticAnswersInput
): DiagnosticAnswers {
  const { workspace } = input;
  const salutogenica = buildSalutogenicReading(input.assets);
  const senalesPresentes = detectarSenales(workspace)
    .filter((s) => s.presente)
    .map((s) => s.etiqueta);

  return {
    porEspacio: knowledgeBySpace(workspace.perfilLocalDeSalud),
    healthReport: readHealthReport(workspace),
    determinantes: inferSocialEpidemiologyDeterminants(
      workspace,
      input.determinantTitles,
      salutogenica
    ),
    senalesPresentes,
    salutogenica,
    sintesisTexto: workspace.perfilLocalDeSalud?.sintesisTexto?.trim() || undefined,
  };
}
