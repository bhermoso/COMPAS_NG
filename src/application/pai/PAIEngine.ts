/**
 * PAIEngine — Motor de composición del Plan de Acción Inteligente.
 *
 * Toma la LecturaEstrategicaLocal producida por el MTE y compone una propuesta
 * técnica estructurada usando el conocimiento institucional del FrameworkProvider.
 * No genera texto autónomo. Deriva, propaga y justifica desde el conocimiento existente.
 */

import type { LecturaEstrategicaLocal } from "../../domain/strategic-scenario";
import {
  doesDeliberativePrioritySelectionMatchLectura,
  type DeliberativePrioritySelection,
} from "../../domain/deliberative-prioritisation";
import type { FrameworkProvider } from "../mte/FrameworkProvider";

// ── Dominio del PAI ───────────────────────────────────────────────────────────

export interface AlineacionMarco {
  marcoId: string;
  elementoId: string;
  elementoLabel: string;
  nivel: string;
  sourceTrace: string;
  /** Indicadores institucionales del marco para este tipo de intervención. */
  indicadoresDelMarco: string[];
}

export interface ActuacionPropuesta {
  id: string;
  /** Scaffold institucional. Requiere concreción del equipo técnico. */
  descripcion: string;
  objetivoId: string;
  evidenciaOrigen: string[];
  requiresHumanValidation: true;
}

export interface ObjetivoEstrategicoPAI {
  id: string;
  /** Derivado de EscenarioEstrategico.tema. Nunca generado autónomamente. */
  titulo: string;
  escenarioOrigen: string;
  areasOrigen: string[];
  evidenciaOrigen: string[];
  alineaciones: AlineacionMarco[];
  actuaciones: ActuacionPropuesta[];
  tensiones: LecturaEstrategicaLocal["escenarios"][number]["tensiones"];
  cautelasOriginales: string[];
  sinCoberturaMarcal: boolean;
  requiresHumanValidation: true;
}

export interface BorradorPAI {
  id: string;
  municipalityId: string;
  generatedAt: string;
  sourceLecturaId: string;
  sourcePSLId: string;
  sourcePSLVersion: string;
  sourcePrioritySelectionId: string;
  knowledgeBaseVersion: string;
  sinContenidoTraducible: boolean;
  objetivos: ObjetivoEstrategicoPAI[];
  cautelas: string[];
  requiresHumanValidation: true;
}

export type PAIResult =
  | { ok: true; borrador: BorradorPAI }
  | { ok: false; violations: readonly string[] };

// ── Cautelas invariables del PAI ──────────────────────────────────────────────

const CAUTELAS_PAI: readonly string[] = Object.freeze([
  "Este borrador de Plan de Acción es una propuesta técnica inicial. No constituye compromiso institucional ni Plan Local de Salud del municipio.",
  "Cada objetivo, actuación e indicador debe ser concretado, adaptado y validado por el Grupo Motor antes de someterse a aprobación institucional.",
  "La adopción de compromisos, la asignación de responsables y la fijación de plazos y recursos son decisiones exclusivamente humanas.",
  "Las alineaciones con marcos estratégicos institucionales son orientaciones identificadas por el sistema. Su incorporación definitiva al plan es decisión del equipo técnico.",
  "Este borrador requiere validación institucional explícita antes de su uso oficial.",
]);

// ── Motor ─────────────────────────────────────────────────────────────────────

/**
 * @param lectura  LecturaEstrategicaLocal producida por el MTE.
 * @param selection Selección explícita y vigente adoptada por el Grupo Motor.
 * @param provider Acceso al conocimiento estratégico para enriquecimiento de indicadores.
 * @param now      Timestamp inyectable para determinismo en tests.
 */
export function generatePAI(
  lectura: LecturaEstrategicaLocal | null | undefined,
  selection: DeliberativePrioritySelection | null | undefined,
  provider: FrameworkProvider | null | undefined,
  now = new Date().toISOString()
): PAIResult {

  if (lectura == null) {
    return { ok: false, violations: ["G-PAI-1: LecturaEstrategicaLocal no disponible"] };
  }
  if (provider == null) {
    return { ok: false, violations: ["G-PAI-1: FrameworkProvider no disponible"] };
  }
  if (selection == null) {
    return { ok: false, violations: ["G-PAI-2: selección deliberativa del Grupo Motor no disponible"] };
  }
  if (!doesDeliberativePrioritySelectionMatchLectura(selection, lectura)) {
    return { ok: false, violations: ["G-PAI-2: la selección deliberativa no corresponde a la Lectura Estratégica vigente"] };
  }

  const elementos = provider.getElements();

  const base = {
    id: `pai-${lectura.id}`,
    municipalityId: lectura.municipalityId,
    generatedAt: now,
    sourceLecturaId: lectura.id,
    sourcePSLId: lectura.sourcePSLId,
    sourcePSLVersion: lectura.sourcePSLVersion,
    sourcePrioritySelectionId: selection.id,
    knowledgeBaseVersion: lectura.knowledgeBaseVersion,
    cautelas: [...CAUTELAS_PAI],
    requiresHumanValidation: true as const,
  };

  // G-PAI-3: sin contenido traducible
  if (!lectura.hasTranslatableContent || lectura.escenarios.length === 0) {
    return {
      ok: true,
      borrador: { ...base, sinContenidoTraducible: true, objetivos: [] },
    };
  }

  const selectedIds = new Set(selection.selectedScenarioIds);
  const objetivos: ObjetivoEstrategicoPAI[] = lectura.escenarios
    .filter((escenario) => selectedIds.has(escenario.id))
    .map((escenario) => {
    const objetivoId = `objetivo-${lectura.id}-${escenario.id}`;

    // Enriquecer cada referencia con los indicadores del elemento del registro
    const alineaciones: AlineacionMarco[] = escenario.referenciasInstitucionales.map((ref) => {
      const elemento = elementos.find((e) => e.id === ref.elementoId);
      return {
        marcoId: ref.marcoId,
        elementoId: ref.elementoId,
        elementoLabel: ref.elementoLabel,
        nivel: ref.nivel,
        sourceTrace: ref.sourceTrace,
        indicadoresDelMarco: elemento?.indicators ?? [],
      };
    });

    const actuacion: ActuacionPropuesta = {
      id: `actuacion-${lectura.id}-${escenario.id}`,
      descripcion: `Diseñar e implementar intervenciones orientadas a abordar "${escenario.tema}". ` +
        `El equipo técnico definirá las actuaciones concretas, los responsables, ` +
        `los plazos y los recursos necesarios.`,
      objetivoId,
      evidenciaOrigen: [...escenario.evidenciaOrigen],
      requiresHumanValidation: true,
    };

    return {
      id: objetivoId,
      titulo: escenario.tema,                     // I-SC-2: derivado, nunca generado
      escenarioOrigen: escenario.id,
      areasOrigen: [...escenario.areasOrigen],
      evidenciaOrigen: [...escenario.evidenciaOrigen],
      alineaciones,
      actuaciones: [actuacion],
      tensiones: escenario.tensiones,
      cautelasOriginales: [...escenario.cautelasOriginales],
      sinCoberturaMarcal: escenario.sinCoberturaMarcal,
      requiresHumanValidation: true,
    };
  });

  return {
    ok: true,
    borrador: { ...base, sinContenidoTraducible: false, objetivos },
  };
}
