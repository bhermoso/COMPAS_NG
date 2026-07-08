/**
 * pslcDocumentModel
 *
 * Modelo documental PURO del export institucional del PSL-C: estructura
 * intermedia (títulos + párrafos) construida desde el artefacto congelado,
 * independiente del formato final (DOCX hoy; PDF en el futuro).
 *
 * Estructura institucional cerrada que este modelo garantiza:
 *   - Seis capítulos narrativos canónicos I–VI. Sin capítulo VII.
 *   - Portada, base documental, cierre interpretativo, estado del
 *     conocimiento (EKC), cautelas, frontera con el Plan de Acción y
 *     trazabilidad como BLOQUES INSTITUCIONALES NO CAPITULARES.
 *   - No exporta espacios de trabajo internos ni textos de ayuda de la UI.
 *   - No inventa campos ausentes: "no disponible", con sobriedad.
 *   - El Perfil concluye, no recomienda: el modelo solo transporta el
 *     contenido compilado; no genera texto nuevo de acción.
 */

import type { LocalHealthProfileArtifact } from "../../domain/health-profile-artifact";
import { parseNarrativeChapters } from "../health-profile";

// ── Tipos del modelo ──────────────────────────────────────────────────────────

export interface PSLCDocumentSection {
  /** Título de la sección (capítulo numerado o bloque institucional). */
  title: string;
  /** 1 = sección principal; 2 = subsección. */
  level: 1 | 2;
  paragraphs: string[];
}

export interface PSLCDocumentModel {
  /** Título del documento (portada). */
  title: string;
  subtitle: string;
  /** Párrafos de la portada (metadatos institucionales y trazabilidad). */
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

// ── Constructor del modelo ────────────────────────────────────────────────────

export function buildPSLCDocumentModel(
  artifact: LocalHealthProfileArtifact
): PSLCDocumentModel {
  const sections: PSLCDocumentSection[] = [];

  // ── Portada institucional (bloque no capitular) ───────────────────────────
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
    `Trazabilidad (hash del PSL fuente): ${artifact.sourceHash}`,
    `Documento fuente: PSL ${artifact.sourcePSLId}`,
  ];

  // ── Base documental (bloque no capitular) ─────────────────────────────────
  const base: string[] = [
    "Este documento procede de la compilación institucional del diagnóstico " +
      "validado; recoge conclusiones interpretativas y no contiene " +
      "recomendaciones.",
    `Base de evidencia: ${artifact.baseDocumental.totalEvidenceAtoms} elementos ` +
      `de evidencia y ${artifact.baseDocumental.complementaryStudyCount} ` +
      `estudios complementarios.`,
    artifact.informeSalud.title
      ? `Fuente diagnóstica primaria: «${artifact.informeSalud.title}» ` +
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
  if (artifact.lecturaTerritorial.territorialSummary) {
    base.push(artifact.lecturaTerritorial.territorialSummary);
  }
  sections.push({ title: "Base documental", level: 1, paragraphs: base });

  // ── Seis capítulos narrativos canónicos ───────────────────────────────────
  const capitulos = parseNarrativeChapters(artifact.conclusiones.content);
  if (capitulos.length > 0) {
    for (const c of capitulos) {
      sections.push({
        title: `${c.numeral}. ${c.title}`,
        level: 1,
        paragraphs: parrafos(c.content),
      });
    }
  } else {
    sections.push({
      title: "Documento del Perfil",
      level: 1,
      paragraphs: parrafos(artifact.conclusiones.content),
    });
  }

  // ── Cierre interpretativo (bloque no capitular) ───────────────────────────
  if (artifact.cierreInterpretativo.content.trim().length > 0) {
    sections.push({
      title: "Cierre interpretativo",
      level: 1,
      paragraphs: parrafos(artifact.cierreInterpretativo.content),
    });
  }

  // ── Estado del conocimiento (bloque no capitular) ─────────────────────────
  const ekc = artifact.ekcSnapshot;
  const conocimiento: string[] = [];
  if (ekc === null) {
    conocimiento.push(
      "Esta compilación no registró espacio de conocimiento del equipo " +
        "técnico (EKC no disponible)."
    );
  } else {
    conocimiento.push(
      `Interpretaciones activas: ${ekc.interpretacionesActivas} ` +
        `(${ekc.interpretacionesSuperadas} superadas). ` +
        `Hipótesis en estudio: ${ekc.hipotesisActivas} ` +
        `(${ekc.hipotesisResueltas} resueltas; ${ekc.hipotesisDescartadas} descartadas). ` +
        `Preguntas abiertas: ${ekc.preguntasAbiertas} ` +
        `(${ekc.preguntasResueltas} resueltas).`,
      `Síntesis del equipo técnico: ${
        ekc.tieneSintesis
          ? "incorporada al capítulo de conclusiones"
          : "no disponible"
      }.`
    );
  }
  for (const h of artifact.hipotesisActivas) {
    conocimiento.push(
      `Hipótesis diagnóstica en estudio: ${h.enunciado} — plausibilidad ` +
        `${h.plausibilidad}, pendiente de contraste (${h.autorNombre}).`
    );
  }
  for (const q of artifact.preguntasAbiertas) {
    conocimiento.push(
      `Pregunta abierta (urgencia ${q.urgencia}): ${q.formulacion} — ${q.relevancia}`
    );
  }
  sections.push({
    title: "Estado del conocimiento",
    level: 1,
    paragraphs: conocimiento,
  });

  // ── Cautelas metodológicas (bloque no capitular) ──────────────────────────
  sections.push({
    title: "Cautelas metodológicas",
    level: 1,
    paragraphs: [
      artifact.cautelasMetodologicas.nota +
        (artifact.cautelasMetodologicas.hasCautelas
          ? ` (${artifact.cautelasMetodologicas.integrityWarnings} aviso(s) de ` +
            `integridad registrados.)`
          : ""),
    ],
  });

  // ── Frontera institucional (bloque no capitular) ──────────────────────────
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
    level: 1,
    paragraphs: frontera,
  });

  // ── Trazabilidad (bloque no capitular) ────────────────────────────────────
  sections.push({
    title: "Trazabilidad",
    level: 1,
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
