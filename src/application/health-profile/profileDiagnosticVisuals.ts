/**
 * profileDiagnosticVisuals
 *
 * Visuales diagnósticos SEGUROS del Perfil (contrato visual): gráficos de
 * barras sin dependencias (CSS), tabla diagnóstica central de trazadores y
 * tarjetas «Qué debe discutir el Grupo Motor». Capa pura y testeable.
 *
 * Reglas del contrato:
 *   - Cada visual responde una pregunta diagnóstica y declara
 *     Fuente · Escala · Cautela (visualCaption).
 *   - Las menciones del Informe son PESO TEXTUAL, nunca prevalencia.
 *   - Los proxies se etiquetan como contexto, nunca estimación distrital.
 *   - Los activos son capacidades potenciales, nunca cobertura o resultado.
 *   - Sin recomendaciones ni Plan de Acción.
 */

import type { DiagnosticAnswers } from "./diagnosticAnswers";
import { formatIndicatorValue } from "./complementaryIndicatorReferences";
import { visualCaption } from "./profileVisualContract";

// ── Gramática visual semántica ────────────────────────────────────────────────

/** Tipo de evidencia → variante de color/estilo (CSS: .pv--{variant}). */
export type EvidenceVariant =
  | "informe"
  | "estudio"
  | "proxy"
  | "activo"
  | "equidad";

export const EVIDENCE_VARIANT_LABEL: Record<EvidenceVariant, string> = {
  informe: "Informe de salud (presencia textual)",
  estudio: "estudios complementarios",
  proxy: "proxy contextual",
  activo: "activos y capacidades",
  equidad: "incertidumbre de equidad",
};

// ── Tipos de visual ───────────────────────────────────────────────────────────

export interface BarChartItem {
  etiqueta: string;
  valor: number;
  variant: EvidenceVariant;
}

export interface DiagnosticBarChart {
  id: string;
  titulo: string;
  /** Qué mide el valor (para el Informe: peso textual, no prevalencia). */
  unidad: string;
  items: BarChartItem[];
  maxValor: number;
  caption: string;
}

export interface TrazadorRow {
  bloque: string;
  indicador: string;
  valor: string;
  refGranada: string;
  refAndalucia: string;
  /** Badge de escala (proxy contextual / muestra local). */
  escala: string;
  esProxy: boolean;
  lectura: string;
}

export interface GrupoMotorCard {
  id: string;
  tema: string;
  senal: string;
  mecanismo: string;
  pregunta: string;
  variant: EvidenceVariant;
}

export interface DiagnosticVisuals {
  informeChart?: DiagnosticBarChart;
  bloquesChart?: DiagnosticBarChart;
  activosChart?: DiagnosticBarChart;
  tablaTrazadores: TrazadorRow[];
  grupoMotorCards: GrupoMotorCard[];
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function refDe(answers: DiagnosticAnswers, id: string) {
  return answers.referencias.references.find(
    (r) => r.indicatorId === id && r.territorialValue !== undefined
  );
}

function valorDe(answers: DiagnosticAnswers, id: string): string | undefined {
  const r = refDe(answers, id);
  return r ? formatIndicatorValue(r.territorialValue, r.unit) : undefined;
}

// ── Constructor ───────────────────────────────────────────────────────────────

export interface BuildDiagnosticVisualsOptions {
  informeTitulo?: string;
}

export function buildDiagnosticVisuals(
  answers: DiagnosticAnswers,
  opts: BuildDiagnosticVisualsOptions = {}
): DiagnosticVisuals {
  const informe = opts.informeTitulo ?? "el Informe de salud";

  // ── Gráfico 1: peso textual de las dimensiones sanitarias del Informe ─────
  let informeChart: DiagnosticBarChart | undefined;
  if (answers.sanitaria.present && answers.sanitaria.senales.length > 0) {
    const items = answers.sanitaria.senales.map((s) => ({
      etiqueta: s.dimension,
      valor: s.menciones,
      variant: "informe" as const,
    }));
    informeChart = {
      id: "informe-peso-textual",
      titulo: "De qué habla el Informe de salud",
      unidad: "menciones — peso textual en el Informe, no prevalencia",
      items,
      maxValor: Math.max(...items.map((i) => i.valor)),
      caption: visualCaption(
        informe,
        "cuerpo íntegro del documento",
        "el peso textual señala la atención del Informe, no magnitud epidemiológica"
      ),
    };
  }

  // ── Gráfico 2: soporte cuantitativo por bloque diagnóstico ────────────────
  let bloquesChart: DiagnosticBarChart | undefined;
  if (answers.estudios.diagnosticBlocks.length > 0) {
    const items = answers.estudios.diagnosticBlocks.map((b) => ({
      etiqueta: b.title,
      valor: b.supportingIndicators.length,
      variant: "estudio" as const,
    }));
    bloquesChart = {
      id: "indicadores-por-bloque",
      titulo: "Qué áreas tienen más soporte cuantitativo",
      unidad: "indicadores disponibles",
      items,
      maxValor: Math.max(...items.map((i) => i.valor)),
      caption: visualCaption(
        String(answers.estudios.totalStudies) + " estudios complementarios",
        "muestras provinciales y locales usadas como contexto",
        "cuenta indicadores disponibles, no resultados de salud"
      ),
    };
  }

  // ── Gráfico 3: activos por ámbito de capacidad (clasificación real) ───────
  let activosChart: DiagnosticBarChart | undefined;
  if (answers.salutogenica.grupos.length > 0) {
    const items = answers.salutogenica.grupos.map((g) => ({
      etiqueta: g.ambito,
      valor: g.count,
      variant: "activo" as const,
    }));
    activosChart = {
      id: "activos-por-capacidad",
      titulo: "Dónde se concentran las capacidades potenciales",
      unidad: "recursos/capacidades potenciales",
      items,
      maxValor: Math.max(...items.map((i) => i.valor)),
      caption: visualCaption(
        "Localiza Salud",
        "inventario municipal, validación territorial pendiente",
        "capacidades potenciales: no acreditan cobertura, uso ni resultado"
      ),
    };
  }

  // ── Tabla diagnóstica central: indicadores trazadores ─────────────────────
  const bloquePorId = new Map(
    answers.estudios.diagnosticBlocks.map((b) => [b.id, b.title])
  );
  const tablaTrazadores: TrazadorRow[] = answers.referencias.references
    .filter(
      (r) => r.tracerPriority !== undefined && r.territorialValue !== undefined
    )
    .map((r) => ({
      bloque: bloquePorId.get(r.diagnosticBlockId) ?? r.diagnosticBlockId,
      indicador: r.narrativeLabel.replace(/^el |^la |^los |^las /, ""),
      valor: formatIndicatorValue(r.territorialValue, r.unit),
      refGranada:
        r.provinceReference !== undefined
          ? formatIndicatorValue(r.provinceReference, r.unit)
          : "no disponible",
      refAndalucia:
        r.andalusiaReference !== undefined
          ? formatIndicatorValue(r.andalusiaReference, r.unit)
          : "no disponible",
      escala: r.demoProxy ? "proxy contextual" : "muestra local",
      esProxy: r.demoProxy,
      lectura: r.demoProxy
        ? "coincide con la referencia provincial (comportamiento demo)"
        : "medición de la muestra local del expediente",
    }));

  // ── Tarjetas: qué debe discutir el Grupo Motor ────────────────────────────
  const mecanismoDe = (incluye: string): string | undefined =>
    answers.determinantes.find(
      (d) =>
        (d.kind === "plausible" || d.kind === "a-contrastar") &&
        d.enunciado.includes(incluye)
    )?.enunciado;
  const preguntaDeBloque = (id: string): string | undefined =>
    answers.estudios.diagnosticBlocks.find((b) => b.id === id)
      ?.contrastQuestions[0];

  const grupoMotorCards: GrupoMotorCard[] = [];

  grupoMotorCards.push({
    id: "desigualdad",
    tema: "Desigualdad y distribución desconocida",
    senal:
      "ningún dato del expediente está desagregado por sexo, edad o renta",
    mecanismo:
      "distribución desigual de recursos, exposiciones y poder que los agregados ocultan",
    pregunta:
      "¿Qué grupos del territorio concentran el malestar y cuáles quedan fuera de los datos?",
    variant: "equidad",
  });

  const envejecimiento = mecanismoDe("envejecimiento");
  const dukeVal = valorDe(answers, "duke-apoyo-global");
  if (envejecimiento !== undefined && dukeVal !== undefined) {
    grupoMotorCards.push({
      id: "soledad-envejecimiento",
      tema: "Soledad, envejecimiento y apoyo social",
      senal:
        "apoyo social medio alto (" +
        dukeVal +
        ") junto a una fuerte concentración de recursos para mayores",
      mecanismo: envejecimiento,
      pregunta:
        "¿A quién no llega la red de apoyo y qué papel juega la soledad no deseada?",
      variant: "activo",
    });
  }

  const psicosocial = mecanismoDe("psicosociales");
  const suenoVal = valorDe(answers, "sueno-insuficiente");
  if (psicosocial !== undefined && suenoVal !== undefined) {
    grupoMotorCards.push({
      id: "sueno-malestar",
      tema: "Sueño, malestar y vida cotidiana",
      senal: "un " + suenoVal + " de la muestra duerme menos de lo recomendado",
      mecanismo: psicosocial,
      pregunta:
        preguntaDeBloque("salud-mental-sueno-malestar") ??
        "¿Qué condiciones de vida están detrás del descanso insuficiente?",
      variant: "estudio",
    });
  }

  const entorno = mecanismoDe("entorno urbano");
  const inactVal = valorDe(answers, "ipaq-inactividad");
  if (entorno !== undefined && inactVal !== undefined) {
    grupoMotorCards.push({
      id: "sedentarismo-entorno",
      tema: "Sedentarismo y entorno urbano",
      senal: "inactividad en tiempo libre del " + inactVal,
      mecanismo: entorno,
      pregunta:
        preguntaDeBloque("actividad-fisica-sedentarismo-entorno") ??
        "¿El entorno cotidiano facilita o dificulta la vida activa?",
      variant: "estudio",
    });
  }

  const consumos = mecanismoDe("consumo y alimentación");
  const predimedVal = valorDe(answers, "predimed-adherencia");
  if (consumos !== undefined && predimedVal !== undefined) {
    grupoMotorCards.push({
      id: "consumos-alimentacion",
      tema: "Consumos y alimentación",
      senal: "adherencia mediterránea media de " + predimedVal,
      mecanismo: consumos,
      pregunta:
        preguntaDeBloque("consumos-alimentacion-habitos") ??
        "¿Qué contextos de consumo y alimentación operan en el territorio?",
      variant: "estudio",
    });
  }

  if (answers.salutogenica.totalAssets > 0) {
    grupoMotorCards.push({
      id: "accesibilidad-activos",
      tema: "Accesibilidad y uso real de los activos",
      senal:
        String(answers.salutogenica.totalAssets) +
        " recursos inventariados, sin validación de acceso y uso",
      mecanismo:
        "un recurso solo se convierte en capacidad si es conocido, accesible y usado por quien lo necesita",
      pregunta: "¿Cuáles de estos recursos funcionan hoy de verdad y para quién?",
      variant: "activo",
    });
  }

  return {
    informeChart,
    bloquesChart,
    activosChart,
    tablaTrazadores,
    grupoMotorCards: grupoMotorCards.slice(0, 6),
  };
}
