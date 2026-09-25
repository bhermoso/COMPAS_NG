/**
 * Motor de Interpretación Territorial (MIT)
 *
 * Único motor del Nivel 2 del sistema COMPÁS NG.
 *
 * Integra:
 *  - Dimensión diagnóstica (antes LT1): clasificación y lectura de evidencias
 *  - Dimensión longitudinal: evolución temporal del territorio (antes "LONGI")
 *  - Áreas de Intervención Territorial (antes "OIT"): traducción diagnóstica
 *  - Marcos interpretativos (EPVSA, ESCA, RELAS…): guías de lectura, no módulos
 *  - Tensiones estructurales: contradicciones detectadas entre fuentes
 *
 * Produce:
 *  - EstadoTerritorialEvolutivo: estado versionado del municipio
 *
 * LT1 y OIT permanecen como sub-rutinas internas de este motor.
 * No son etapas de pipeline independientes ni sistemas computacionales separados.
 * EPVSA/ESCA son marcos interpretativos, no motores ejecutables.
 */

import { generateLT1, type LT1Result } from "../lt1";
import { generateOIT, type OITResult } from "../oit";
import type { EvidenceStore } from "../../domain/evidence";
import type { StrategicElement } from "../../domain/strategy";
import type { TerritorialStateRecord } from "../../domain/workspace";

// ── Dimensión longitudinal ─────────────────────────────────────────────────
// La evolución temporal del municipio es una dimensión interna del análisis,
// no un módulo independiente con pipeline propio.

export interface DimensionLongitudinal {
  activa: boolean;
  nota: string;
  evidenciasLongitudinales: number;
}

// ── Estado Territorial Evolutivo ───────────────────────────────────────────
// Salida canónica del Motor de Interpretación Territorial.
// Versionada con cada ejecución, acumulativa en concepto.

export interface EstadoTerritorialEvolutivo {
  // Versionado
  version: string;          // ISO timestamp de esta ejecución
  municipalityId: string;

  // Dimensión diagnóstica — resultados internos del sub-motor LT1
  // Expuesta para compatibilidad con paneles de visualización.
  dimensionDiagnostica: LT1Result;

  // Áreas de Intervención Territorial — resultados internos del sub-motor OIT
  // Semántica: "Áreas de Intervención" reemplaza "Oportunidades de Intervención".
  // El tipo OITResult se mantiene para compatibilidad con el motor de Priorización.
  areasDeIntervencion: OITResult;

  // Dimensión longitudinal — contexto de evolución temporal del municipio
  dimensionLongitudinal: DimensionLongitudinal;

  // Tensiones estructurales detectadas entre fuentes de evidencia (territoriales reales).
  // Solo tensiones con significado territorial entran aquí; las observaciones sobre
  // calidad de la base documental van a limitacionesDiagnosticas.
  tensionesEstructurales: string[];

  // Limitaciones y observaciones metodológicas sobre la base documental.
  // No representan tensiones territoriales: no pueden escalar a áreas de intervención.
  limitacionesDiagnosticas: string[];

  // Marcos interpretativos aplicados (EPVSA, ESCA, RELAS…)
  // Son guías de lectura, no módulos computacionales.
  marcosAplicados: ReadonlyArray<{ framework: string; elementCount: number }>;

  // Estadísticas del estado
  totalEvidencias: number;
  origenesPresentes: string[];

  requiresHumanValidation: true;
}

// ── Input ──────────────────────────────────────────────────────────────────

export interface CreateEstadoTerritorialInput {
  evidenceStore: EvidenceStore;             // ya sanitizado por el IntegrityGuard
  strategicFrameworks: readonly StrategicElement[];
}

// ── Motor ──────────────────────────────────────────────────────────────────

export function createEstadoTerritorialEvolutivo(
  input: CreateEstadoTerritorialInput
): EstadoTerritorialEvolutivo {
  const { evidenceStore, strategicFrameworks } = input;

  // Sub-rutinas internas (no son etapas de pipeline independientes)
  const lt1 = generateLT1(evidenceStore);
  const oit = generateOIT(lt1);

  const dimensionLongitudinal = buildDimensionLongitudinal(evidenceStore);
  const limitaciones = detectLimitacionesDiagnosticas(lt1, oit);
  const marcos = buildMarcosAplicados(strategicFrameworks);
  const origenesPresentes = [...new Set(
    evidenceStore.atoms.map((a) => a.provenance.origin)
  )].sort();

  return {
    // version reflects WHEN the evidence changed, not when the engine ran.
    // Deterministic: stable across re-renders as long as EvidenceStore is unchanged.
    version: evidenceStore.updatedAt,
    municipalityId: evidenceStore.municipalityId,
    dimensionDiagnostica: lt1,
    areasDeIntervencion: oit,
    dimensionLongitudinal,
    tensionesEstructurales: [],       // tensiones territoriales reales (ninguna detectada aún)
    limitacionesDiagnosticas: limitaciones,
    marcosAplicados: marcos,
    totalEvidencias: evidenceStore.atoms.length,
    origenesPresentes,
    requiresHumanValidation: true,
  };
}

// ── Dimensión longitudinal ─────────────────────────────────────────────────

function buildDimensionLongitudinal(
  store: EvidenceStore
): DimensionLongitudinal {
  const longiAtoms = store.atoms.filter(
    (a) => a.provenance.origin === "longi"
  );

  if (longiAtoms.length > 0) {
    return {
      activa: true,
      evidenciasLongitudinales: longiAtoms.length,
      nota:
        `${longiAtoms.length} evidencia(s) longitudinal(es) integrada(s). ` +
        "La evolución temporal está disponible para orientar la interpretación.",
    };
  }

  return {
    activa: false,
    evidenciasLongitudinales: 0,
    nota:
      "Sin evidencia longitudinal disponible. La interpretación se basa en el " +
      "estado actual del territorio sin contexto histórico comparativo.",
  };
}

// ── Detección de limitaciones diagnósticas ────────────────────────────────
// Observaciones sobre la calidad de la base documental.
// NO son tensiones territoriales: nunca pueden escalar a áreas de intervención.

function detectLimitacionesDiagnosticas(
  lt1: LT1Result,
  oit: OITResult
): string[] {
  const tensiones: string[] = [];

  if (
    lt1.methodologicalCautions.length > 0 &&
    lt1.determinants.length === 0
  ) {
    tensiones.push(
      "Base documental con cautelas metodológicas y sin determinantes identificados. La interpretación territorial es fragmentaria."
    );
  }

  if (lt1.assets.length > 0 && lt1.determinants.length === 0) {
    tensiones.push(
      "Activos comunitarios presentes pero sin determinantes documentados. El análisis de necesidades puede estar incompleto."
    );
  }

  if (lt1.qualitativeFindings.length > 0 && lt1.indicators.length === 0) {
    tensiones.push(
      "Hallazgos participativos sin respaldo de indicadores cuantitativos. Riesgo de sesgo en la priorización."
    );
  }

  if (
    oit.opportunities.length === 1 &&
    oit.opportunities[0].id === "oit-expand-evidence-base"
  ) {
    tensiones.push(
      "Base documental insuficiente para articular áreas de intervención específicas. Se requiere ampliar la evidencia antes de planificar."
    );
  }

  return tensiones;
}

// ── Marcos interpretativos ─────────────────────────────────────────────────

function buildMarcosAplicados(
  frameworks: readonly StrategicElement[]
): ReadonlyArray<{ framework: string; elementCount: number }> {
  const counts = new Map<string, number>();
  for (const el of frameworks) {
    counts.set(el.framework, (counts.get(el.framework) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([framework, elementCount]) => ({ framework, elementCount }))
    .sort((a, b) => b.elementCount - a.elementCount);
}

// ── EstadoTerritorialResumen (lightweight snapshot for history) ────────────
// Re-exported alias kept for semantic clarity in consuming code.
export type EstadoTerritorialResumen = TerritorialStateRecord;

/**
 * Builds a compact, localStorage-safe snapshot of an EstadoTerritorialEvolutivo.
 * Stores counts and summaries instead of full EvidenceAtom arrays.
 * Called by App.tsx to append to MunicipalityWorkspace.historialEstadosTerritorial.
 */
export function buildEstadoResumen(
  mit: EstadoTerritorialEvolutivo
): TerritorialStateRecord {
  const lt1 = mit.dimensionDiagnostica;
  return {
    version: mit.version,
    municipalityId: mit.municipalityId,
    generadoEn: new Date().toISOString(),
    totalEvidencias: mit.totalEvidencias,
    cuentasDiagnosticas: {
      determinantes: lt1.determinants.length,
      activos: lt1.assets.length,
      indicadores: lt1.indicators.length,
      hallazgosParticipativos: lt1.qualitativeFindings.length,
      cautelasMetodologicas: lt1.methodologicalCautions.length,
    },
    resumenTerritorial: lt1.summary,
    origenesPresentes: mit.origenesPresentes,
    longitudinalActiva: mit.dimensionLongitudinal.activa,
    longitudinalNota: mit.dimensionLongitudinal.nota,
    longitudinalEvidencias: mit.dimensionLongitudinal.evidenciasLongitudinales,
    tensionesEstructurales: mit.tensionesEstructurales,
    limitacionesDiagnosticas: mit.limitacionesDiagnosticas,
    marcosAplicados: [...mit.marcosAplicados],
    totalAreasIntervencion: mit.areasDeIntervencion.opportunities.length,
  };
}
