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
} from "../health-profile";

// ── Tipos del modelo ──────────────────────────────────────────────────────────

export interface PSLCDocumentSection {
  /** Título de la sección (principal o subsección del anexo). */
  title: string;
  /** 1 = sección principal; 2 = subsección. */
  level: 1 | 2;
  paragraphs: string[];
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

export function buildPSLCDocumentModel(
  artifact: LocalHealthProfileArtifact
): PSLCDocumentModel {
  const sections: PSLCDocumentSection[] = [];
  const ekc = artifact.ekcSnapshot;

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
