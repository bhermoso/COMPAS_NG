/**
 * institutionalProfileModel
 *
 * Modelo puro de la pantalla institucional «Perfil de Salud Local».
 * Deriva del LocalHealthProfile la composición VISIBLE del documento, con la
 * estructura principal de seis capítulos narrativos por determinantes.
 *
 * Reglas de producto que este modelo garantiza en la capa visible:
 *  - La estructura principal del documento son los seis capítulos narrativos,
 *    no la carcasa heredada (Marco estratégico / Diagnóstico / Interpretación /
 *    Priorización).
 *  - La priorización es fase posterior: sus materiales se presentan como
 *    espacio de trabajo, nunca como capítulo del Perfil.
 *  - Las «áreas de intervención» internas se expresan en lenguaje diagnóstico:
 *    cuestiones que requieren contraste técnico y comunitario.
 *  - El Perfil concluye, pero no recomienda.
 */

import type { LocalHealthProfile } from "../../domain/health-profile";
import { parseNarrativeChapters, type NarrativeChapter } from "./narrativeChapters";
import {
  institutionalHealthReportTitle,
  sanitizeHealthReportTitleInText,
} from "./healthReportSanitaryReading";

// ── Índice de navegación del documento institucional ─────────────────────────
// Fuente única de verdad del índice visible: la vista lo importa de aquí.

export const INSTITUTIONAL_NAV = [
  { href: "#psl-resumen", label: "Resumen" },
  { href: "#psl-cap-i", label: "I · Alcance y fuentes" },
  { href: "#psl-cap-ii", label: "II · Contexto territorial" },
  { href: "#psl-cap-iii", label: "III · Situación de salud" },
  { href: "#psl-cap-iv", label: "IV · Determinantes" },
  { href: "#psl-cap-v", label: "V · Activos e incertidumbres" },
  { href: "#psl-cap-vi", label: "VI · Conclusiones técnicas" },
  { href: "#psl-anexo", label: "Trazabilidad" },
] as const;

// ── Lenguaje diagnóstico para los objetos internos de área ───────────────────

export const CONTRAST_TOPICS_LABEL =
  "Cuestiones que requieren contraste técnico y comunitario";

export const PENDING_CONTRAST_LABEL = "Aspectos pendientes de contraste";

export interface ContrastTopic {
  id: string;
  title: string;
  rationale: string;
  cautions: string[];
}

export interface InstitutionalProfileViewModel {
  /** Capítulos del documento principal (seis en condiciones normales). */
  chapters: NarrativeChapter[];
  /** Texto íntegro de reserva cuando no hay estructura de capítulos. */
  fallbackContent: string;
  /** El documento sigue siendo borrador asistido (sin autoría humana). */
  isDraft: boolean;
  primarySource: { present: boolean; title?: string };
  /** Áreas internas con evidencia, expresadas como cuestiones de contraste. */
  contrastTopics: ContrastTopic[];
  /** Huecos analíticos: pendientes metodológicos, no conclusiones. */
  pendingContrasts: Array<{ id: string; title: string; rationale: string }>;
  citizenTopics: string[];
}

export function buildInstitutionalProfileViewModel(
  psl: LocalHealthProfile
): InstitutionalProfileViewModel {
  // Saneado defensivo: los PSL validados con generaciones anteriores pueden
  // arrastrar el título técnico histórico del Informe dentro del texto y en
  // healthReportTitle. La presentación siempre usa la denominación
  // institucional; el dato persistido no se modifica.
  const content = sanitizeHealthReportTitleInText(
    psl.conclusiones.content,
    psl.municipalityId
  );
  const chapters = parseNarrativeChapters(content);

  const reales = psl.areasDeIntervencion.filter((a) => !a.isAnalyticalGap);
  const gaps = psl.areasDeIntervencion.filter((a) => a.isAnalyticalGap);

  return {
    chapters,
    fallbackContent: content,
    isDraft: psl.conclusiones.status !== "authored",
    primarySource: {
      present: psl.healthReportTitle !== undefined,
      title:
        psl.healthReportTitle !== undefined
          ? institutionalHealthReportTitle(psl.municipalityId, psl.healthReportTitle)
          : undefined,
    },
    contrastTopics: reales.map((a) => ({
      id: a.id,
      title: a.title,
      rationale: a.rationale,
      cautions: [...a.cautions],
    })),
    pendingContrasts: gaps.map((a) => ({
      id: a.id,
      title: a.title,
      rationale: a.rationale,
    })),
    citizenTopics: [...psl.priorizacion.tematicasSeleccionadasLabels],
  };
}
