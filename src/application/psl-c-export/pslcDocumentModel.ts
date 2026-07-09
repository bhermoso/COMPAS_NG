/**
 * pslcDocumentModel
 *
 * Modelo documental PURO del export institucional del PSL-C: estructura
 * intermedia (títulos + párrafos) construida desde el artefacto congelado,
 * independiente del formato final (visor, DOCX, PDF).
 *
 * CONTRATO DE LECTURA (documento principal + anexo técnico):
 *
 *   A. Documento principal — lectura territorial jerarquizada:
 *      1. Lectura ejecutiva territorial
 *      2. Situación de salud y bienestar
 *      3. Desafíos diagnósticos del territorio
 *      4. Capacidades y oportunidades comunitarias
 *      5. Incertidumbres críticas
 *      6. Conclusiones para la deliberación (+ cierre y frontera)
 *
 *   B. Anexo técnico — expediente: alcance metodológico, base documental,
 *      cautelas completas, estado del conocimiento y trazabilidad/hash.
 *
 * Reglas:
 *   - NADA se inventa: cada párrafo procede del contenido compilado del
 *     artefacto. Este modelo redistribuye y selecciona; no redacta evidencia.
 *   - Los seis capítulos narrativos canónicos I–VI siguen intactos en
 *     artifact.conclusiones.content (contrato del artefacto); aquí su
 *     contenido se integra en la lectura principal sin crear capítulo VII.
 *   - La trazabilidad y el hash no se eliminan: se desplazan al anexo.
 *   - Las cautelas no se eliminan: se sintetizan en el principal (párrafos
 *     de incertidumbre del propio documento) y se desarrollan en el anexo.
 *   - Sin recomendaciones, programas, actuaciones ni causalidad demostrada.
 *   - Si no hay espacio interpretativo técnico (EKC), se declara con
 *     sobriedad dentro de «Incertidumbres críticas», no como bloque vacío.
 */

import type { LocalHealthProfileArtifact } from "../../domain/health-profile-artifact";
import {
  parseNarrativeChapters,
  institutionalHealthReportTitle,
  sanitizeHealthReportTitleInText,
  buildProfileSynthesis,
  buildDiagnosticVisuals,
  buildMatrizAnexo,
  formatIndicatorValue,
} from "../health-profile";
import type { DiagnosticAnswers } from "../health-profile";

// ── Tipos del modelo ──────────────────────────────────────────────────────────

/** Tipo de sección del documento: textual o estructurada (contrato visual). */
export type PSLCSectionKind =
  | "text"
  | "summaryCards"
  | "table"
  | "barRanking"
  | "compactSignalList"
  | "groupMotorAgenda";

export interface PSLCSummaryCard {
  destacado: boolean;
  texto: string;
}

export interface PSLCTableData {
  headers: string[];
  rows: string[][];
  nota?: string;
}

export interface PSLCRankingItem {
  etiqueta: string;
  valor: number;
  max: number;
}

export interface PSLCSignalListItem {
  grupo: string;
  senal: string;
  fuente: string;
  pregunta: string;
}

export interface PSLCAgendaEntry {
  tema: string;
  senal: string;
  mecanismo: string;
  oculto: string;
  pregunta: string;
}

export interface PSLCDocumentSection {
  /** Título de la sección (principal o subsección del anexo). */
  title: string;
  /** 1 = sección principal; 2 = subsección. */
  level: 1 | 2;
  paragraphs: string[];
  /** "text" por defecto; el resto lleva su carga estructurada. */
  kind?: PSLCSectionKind;
  cards?: PSLCSummaryCard[];
  table?: PSLCTableData;
  ranking?: PSLCRankingItem[];
  signalList?: PSLCSignalListItem[];
  agenda?: PSLCAgendaEntry[];
}

export interface PSLCDocumentModel {
  /** Título del documento (portada). */
  title: string;
  subtitle: string;
  /** Párrafos de la portada (metadatos institucionales, sin hash). */
  portada: string[];
  sections: PSLCDocumentSection[];
  fileName: string;
}

// ── Utilidades ────────────────────────────────────────────────────────────────

function fecha(iso: string | undefined): string {
  if (!iso) return "no disponible";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "no disponible";
  return d.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function parrafos(content: string): string[] {
  return content
    .split("\n\n")
    .map((p) => p.trim())
    .filter((p) => p.length > 0);
}

/** Nombre de archivo estable y seguro para el export. */
export function pslcDocxFileName(artifact: LocalHealthProfileArtifact): string {
  const slug = artifact.municipalityId
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `psl-c-${slug}-2027-2030.docx`;
}

// Prefijos estables (fijados por los tests contractuales de la narrativa) que
// permiten redistribuir párrafos sin reescribirlos.
const PREFIJOS_EJECUTIVOS = [
  "Síntesis diagnóstica del equipo técnico.",
  "El diagnóstico apunta a",
];
const PREFIJOS_INCERTIDUMBRE = [
  "Incertidumbres del diagnóstico.",
  "Laguna de conocimiento declarada",
];

const empiezaPor = (p: string, prefijos: string[]): boolean =>
  prefijos.some((pre) => p.startsWith(pre));

// ── Constructor del modelo ────────────────────────────────────────────────────

export interface BuildPSLCDocumentModelOptions {
  /**
   * Respuestas diagnósticas del expediente: activan las secciones
   * visual-narrativas (síntesis, ranking del Informe, tabla de trazadores,
   * agenda del Grupo Motor y anexos estructurados). Sin ellas, el documento
   * se genera en su forma textual clásica.
   */
  answers?: DiagnosticAnswers;
}

export function buildPSLCDocumentModel(
  artifact: LocalHealthProfileArtifact,
  opts: BuildPSLCDocumentModelOptions = {}
): PSLCDocumentModel {
  const sections: PSLCDocumentSection[] = [];
  const ekc = artifact.ekcSnapshot;
  const informeTitulo = artifact.informeSalud.title
    ? institutionalHealthReportTitle(
        artifact.municipalityId,
        artifact.informeSalud.title
      )
    : undefined;
  const sintesis = opts.answers
    ? buildProfileSynthesis(opts.answers, { informeTitulo })
    : undefined;
  const visuales = opts.answers
    ? buildDiagnosticVisuals(opts.answers, { informeTitulo })
    : undefined;
  const matriz = opts.answers ? buildMatrizAnexo(opts.answers) : undefined;

  // ── Portada institucional (sin hash: la trazabilidad vive en el anexo) ────
  const provincia = artifact.portada.municipalityProvince
    ? ` (${artifact.portada.municipalityProvince})`
    : "";
  const portada: string[] = [
    `Versión ${artifact.portada.artifactVersion} · compilado el ` +
      `${fecha(artifact.compiledAt)}` +
      (artifact.compiledBy ? ` · por ${artifact.compiledBy}` : ""),
    "Artefacto institucional congelado: representa el estado del diagnóstico " +
      "en el momento de su compilación y no admite edición.",
    `Validación técnica: ${artifact.notaValidacion.pslValidatedBy ?? "no disponible"}` +
      (artifact.notaValidacion.pslValidatedAt
        ? ` · ${fecha(artifact.notaValidacion.pslValidatedAt)}`
        : ""),
    "La trazabilidad completa (hash, identificadores y fuentes) consta en el " +
      "anexo técnico.",
  ];

  // ── Documento principal ───────────────────────────────────────────────────
  // Saneado defensivo para artefactos congelados anteriores: la etiqueta y
  // el texto exportados usan la denominación institucional del Informe; el
  // artefacto almacenado conserva su contenido histórico exacto.
  const conclusionesSaneadas = sanitizeHealthReportTitleInText(
    artifact.conclusiones.content,
    artifact.municipalityId
  );
  const capitulos = parseNarrativeChapters(conclusionesSaneadas);
  const cap = (numeral: string): string[] => {
    const c = capitulos.find((x) => x.numeral === numeral);
    return c ? parrafos(c.content) : [];
  };

  // ── Salud en síntesis + visuales (identidad del Perfil integrado) ─────────
  if (sintesis !== undefined && sintesis.mensajes.length >= 4) {
    sections.push({
      title: "Salud en síntesis",
      level: 1,
      kind: "summaryCards",
      cards: sintesis.mensajes.map((m, i) => ({
        destacado: i < 3,
        texto: m.texto,
      })),
      paragraphs: [sintesis.notaEscala],
    });
  }
  if (visuales?.informeChart !== undefined) {
    const g = visuales.informeChart;
    sections.push({
      title: "Señales sanitarias del Informe de salud",
      level: 1,
      kind: "barRanking",
      ranking: g.items.map((i) => ({
        etiqueta: i.etiqueta,
        valor: i.valor,
        max: g.maxValor,
      })),
      paragraphs: [g.unidad + ".", g.caption],
    });
  }
  if (visuales !== undefined && visuales.tablaTrazadores.length > 0) {
    sections.push({
      title: "Indicadores trazadores: valores y referencias",
      level: 1,
      kind: "table",
      table: {
        headers: [
          "Bloque",
          "Indicador",
          "Valor",
          "Granada",
          "Andalucía",
          "Escala",
          "Lectura",
        ],
        rows: visuales.tablaTrazadores.map((f) => [
          f.bloque,
          f.indicador,
          f.valor,
          f.refGranada,
          f.refAndalucia,
          f.esProxy ? "proxy contextual — no estimación distrital" : "muestra local",
          f.lectura,
        ]),
        nota:
          "Los 23 indicadores completos, con procedencia y cautelas, constan " +
          "en el anexo técnico.",
      },
      paragraphs: [],
    });
  }
  if (sintesis !== undefined && sintesis.senalesPrincipales.length >= 4) {
    sections.push({
      title: "Señales principales para deliberación",
      level: 1,
      kind: "compactSignalList",
      signalList: sintesis.senalesPrincipales.map((r) => ({
        grupo: r.grupo,
        senal: r.senal,
        fuente: r.fuente,
        pregunta: r.pregunta,
      })),
      paragraphs: [],
    });
  }

  if (capitulos.length > 0) {
    // 1. Lectura ejecutiva territorial: imagen general + síntesis del técnico
    //    + conclusión diagnóstica (señales, desafíos, capacidades y tensión
    //    de escala), extraídas del capítulo VI por sus prefijos estables.
    const capVI = cap("VI");
    const ejecutivos = capVI.filter((p) => empiezaPor(p, PREFIJOS_EJECUTIVOS));
    const restoVI = capVI.filter((p) => !empiezaPor(p, PREFIJOS_EJECUTIVOS));
    const lectura: string[] = [];
    if (artifact.lecturaTerritorial.territorialSummary) {
      lectura.push(artifact.lecturaTerritorial.territorialSummary);
    }
    lectura.push(...(ejecutivos.length > 0 ? ejecutivos : capVI.slice(0, 1)));
    sections.push({
      title: "Lectura ejecutiva territorial",
      level: 1,
      paragraphs: lectura,
    });

    // 2. Situación de salud y bienestar: contexto territorial + situación
    //    con indicadores trazadores interpretados (capítulos II y III).
    sections.push({
      title: "Situación de salud y bienestar",
      level: 1,
      paragraphs: [...cap("II"), ...cap("III")],
    });

    // 3. Desafíos diagnósticos: la lectura epidemiológico-social del
    //    capítulo IV (hipótesis plausibles, a contrastar y no evaluables)
    //    más las hipótesis del equipo técnico en estudio.
    const desafios = [...cap("IV")];
    for (const h of artifact.hipotesisActivas) {
      desafios.push(
        `Hipótesis del equipo técnico en estudio: ${h.enunciado} — ` +
          `plausibilidad ${h.plausibilidad}, pendiente de contraste ` +
          `(${h.autorNombre}).`
      );
    }
    sections.push({
      title: "Desafíos diagnósticos del territorio",
      level: 1,
      paragraphs: desafios,
    });

    // 4. Capacidades y oportunidades comunitarias: los activos y la lectura
    //    salutogénica del capítulo V, sin sus párrafos de incertidumbre.
    const capV = cap("V");
    sections.push({
      title: "Capacidades y oportunidades comunitarias",
      level: 1,
      paragraphs: capV.filter((p) => !empiezaPor(p, PREFIJOS_INCERTIDUMBRE)),
    });

    // 5. Incertidumbres críticas: incertidumbres y lagunas declaradas del
    //    capítulo V + preguntas abiertas del equipo + estado del espacio
    //    interpretativo cuando no está registrado.
    const incertidumbres = capV.filter((p) =>
      empiezaPor(p, PREFIJOS_INCERTIDUMBRE)
    );
    for (const q of artifact.preguntasAbiertas) {
      incertidumbres.push(
        `Pregunta abierta (urgencia ${q.urgencia}): ${q.formulacion} — ${q.relevancia}`
      );
    }
    if (ekc === null) {
      incertidumbres.push(
        "No consta espacio interpretativo técnico registrado en esta " +
          "compilación (EKC no disponible): la lectura se apoya en la " +
          "evidencia compilada y queda pendiente del enriquecimiento " +
          "interpretativo del equipo (interpretaciones, hipótesis propias y " +
          "síntesis)."
      );
    }
    if (incertidumbres.length === 0) {
      incertidumbres.push(
        "Las incertidumbres metodológicas del diagnóstico constan en las " +
          "cautelas del anexo técnico."
      );
    }
    sections.push({
      title: "Incertidumbres críticas",
      level: 1,
      paragraphs: incertidumbres,
    });

    // 6. Conclusiones para la deliberación: el resto del capítulo VI
    //    (aportación de los estudios, ámbitos que pasan a deliberación,
    //    preguntas de contraste y cierre de frontera).
    sections.push({
      title: "Conclusiones para la deliberación",
      level: 1,
      paragraphs: restoVI.length > 0 ? restoVI : capVI,
    });
  } else {
    // Autoría humana sin estructura de capítulos: texto íntegro.
    sections.push({
      title: "Documento del Perfil",
      level: 1,
      paragraphs: parrafos(conclusionesSaneadas),
    });
  }

  // ── Agenda del Grupo Motor (conversación territorial, no recomendaciones) ─
  if (visuales !== undefined && visuales.grupoMotorCards.length >= 4) {
    sections.push({
      title: "Agenda para el Grupo Motor",
      level: 1,
      kind: "groupMotorAgenda",
      agenda: visuales.grupoMotorCards.map((c) => ({
        tema: c.tema,
        senal: c.senal,
        mecanismo: c.mecanismo,
        oculto: c.oculto,
        pregunta: c.pregunta,
      })),
      paragraphs: [
        "Cada entrada conecta una señal con su mecanismo social plausible, " +
          "con quién puede quedar fuera de los datos y con la pregunta que el " +
          "Grupo Motor puede responder mejor que ningún dato. Son materiales " +
          "de deliberación, no decisiones.",
      ],
    });
  }

  // Cierre interpretativo: comprensión integrada disponible (acompaña a las
  // conclusiones como bloque propio).
  if (artifact.cierreInterpretativo.content.trim().length > 0) {
    sections.push({
      title: "Cierre interpretativo",
      level: 2,
      paragraphs: parrafos(
        sanitizeHealthReportTitleInText(
          artifact.cierreInterpretativo.content,
          artifact.municipalityId
        )
      ),
    });
  }

  // Frontera institucional: qué es —y qué no es— este documento.
  const frontera: string[] = [
    "Este Perfil de Salud Local concluye el diagnóstico: no formula " +
      "recomendaciones, actuaciones, programas ni objetivos estratégicos. La " +
      "traducción a prioridades y acciones corresponde al Plan de Acción, que " +
      "es una fase posterior del proceso de planificación y se elabora con el " +
      "Grupo Motor a partir de este documento.",
  ];
  if (artifact.priorizacion.candidaturasTecnicas.length > 0) {
    frontera.push(
      `El documento deja preparadas ` +
        `${artifact.priorizacion.candidaturasTecnicas.length} candidatura(s) ` +
        `técnica(s) para esa deliberación posterior: ` +
        artifact.priorizacion.candidaturasTecnicas
          .map((c) => c.title)
          .join("; ") +
        `. ${artifact.priorizacion.deliberacionNota}`
    );
  }
  frontera.push(
    `Consenso del Grupo Motor documentado: ` +
      `${artifact.priorizacion.consensoDocumentado ? "sí" : "no disponible"}.`
  );
  sections.push({
    title: "Frontera institucional",
    level: 2,
    paragraphs: frontera,
  });

  // ── Anexo técnico ─────────────────────────────────────────────────────────
  sections.push({
    title: "Anexo técnico",
    level: 1,
    paragraphs: [
      "Expediente técnico del documento institucional: alcance metodológico, " +
        "base documental, cautelas y trazabilidad. Sustenta la lectura " +
        "principal sin interrumpirla.",
    ],
  });

  // Alcance, fuentes y escala (capítulo I del documento narrativo: método).
  const capI = cap("I");
  if (capI.length > 0) {
    sections.push({
      title: "Alcance, fuentes y escala de la evidencia",
      level: 2,
      paragraphs: capI,
    });
  }

  // Base documental y declaración de preservación.
  const base: string[] = [
    "Este documento procede de la compilación institucional del diagnóstico " +
      "validado; recoge conclusiones interpretativas y no contiene " +
      "recomendaciones.",
    `Base de evidencia: ${artifact.baseDocumental.totalEvidenceAtoms} elementos ` +
      `de evidencia y ${artifact.baseDocumental.complementaryStudyCount} ` +
      `estudios complementarios.`,
    artifact.informeSalud.title
      ? `Fuente diagnóstica primaria: «${institutionalHealthReportTitle(
          artifact.municipalityId,
          artifact.informeSalud.title
        )}» ` +
        `(${artifact.informeSalud.sectionCount} secciones). El Informe de Salud ` +
        `se preserva íntegro y se referencia sin atomizar.`
      : "Fuente diagnóstica primaria: no disponible.",
  ];
  if ((artifact.lecturaTerritorial.limitacionesDiagnosticas?.length ?? 0) > 0) {
    base.push(
      "Advertencia de escala: " +
        artifact.lecturaTerritorial.limitacionesDiagnosticas!.join(" ")
    );
  }
  sections.push({ title: "Base documental", level: 2, paragraphs: base });

  // Cautelas metodológicas completas.
  sections.push({
    title: "Cautelas metodológicas",
    level: 2,
    paragraphs: [
      artifact.cautelasMetodologicas.nota +
        (artifact.cautelasMetodologicas.hasCautelas
          ? ` (${artifact.cautelasMetodologicas.integrityWarnings} aviso(s) de ` +
            `integridad registrados.)`
          : ""),
    ],
  });

  // Estado del conocimiento técnico (solo cuando está registrado; su ausencia
  // se declara en «Incertidumbres críticas» del documento principal).
  if (ekc !== null) {
    sections.push({
      title: "Estado del conocimiento",
      level: 2,
      paragraphs: [
        `Interpretaciones activas: ${ekc.interpretacionesActivas} ` +
          `(${ekc.interpretacionesSuperadas} superadas). ` +
          `Hipótesis en estudio: ${ekc.hipotesisActivas} ` +
          `(${ekc.hipotesisResueltas} resueltas; ${ekc.hipotesisDescartadas} descartadas). ` +
          `Preguntas abiertas: ${ekc.preguntasAbiertas} ` +
          `(${ekc.preguntasResueltas} resueltas).`,
        `Síntesis del equipo técnico: ${
          ekc.tieneSintesis
            ? "incorporada a la lectura ejecutiva del documento"
            : "no disponible"
        }.`,
      ],
    });
  }

  // Referencias comparativas completas (23 indicadores) — estructuradas.
  if (opts.answers !== undefined) {
    const refs = opts.answers.referencias.references;
    sections.push({
      title: "Referencias comparativas de los indicadores",
      level: 2,
      kind: "table",
      table: {
        headers: ["Indicador", "Valor", "Granada", "Andalucía", "Escala"],
        rows: refs.map((r) => [
          r.indicatorTitle,
          formatIndicatorValue(r.territorialValue, r.unit),
          r.provinceReference !== undefined
            ? formatIndicatorValue(r.provinceReference, r.unit)
            : "no disponible",
          r.andalusiaReference !== undefined
            ? formatIndicatorValue(r.andalusiaReference, r.unit)
            : "no disponible",
          r.demoProxy ? "proxy contextual" : "muestra local",
        ]),
        nota:
          "Procedencia y cautelas completas por indicador en la capa de " +
          "referencias comparativas del expediente.",
      },
      paragraphs: [],
    });
  }
  if (matriz !== undefined && matriz.filas.length > 0) {
    sections.push({
      title: "Matriz epistemológica",
      level: 2,
      kind: "table",
      table: {
        headers: ["Señal", "Escala", "Estatus causal", "Pregunta"],
        rows: matriz.filas.map((f) => [
          f.senal,
          f.escala,
          f.estatusCausal,
          f.pregunta,
        ]),
      },
      paragraphs: [...matriz.notasBloque],
    });
  }

  // Trazabilidad: hash e identificadores del artefacto congelado.
  sections.push({
    title: "Trazabilidad",
    level: 2,
    paragraphs: [
      `Hash del PSL fuente: ${artifact.sourceHash}.`,
      `Identificador del artefacto: ${artifact.id} · versión ` +
        `${artifact.portada.artifactVersion}.`,
      `PSL fuente: ${artifact.sourcePSLId} (versión ${artifact.sourcePSLVersion}; ` +
        `evidencia ${artifact.sourcePSLEvidenceStoreVersion}).`,
      `Elementos de evidencia congelados: ${artifact.evidenceAtomIds.length}.`,
    ],
  });

  return {
    title: `Perfil de Salud Local de ${artifact.portada.municipalityName}${provincia}`,
    subtitle: "Documento institucional compilado (PSL-C)",
    portada,
    sections,
    fileName: pslcDocxFileName(artifact),
  };
}
