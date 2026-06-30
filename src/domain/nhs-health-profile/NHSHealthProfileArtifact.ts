import type { MunicipalityId } from "../municipality";

// ── Posición relativa al comparador ──────────────────────────────────────────
// "above"  — el valor municipal supera al de referencia en la dirección positiva
// "below"  — el valor municipal es inferior al de referencia en la dirección positiva
// "similar"— diferencia dentro del margen de variación esperado (≤10 % relativo)
//
// null cuando no existe referencia disponible para ese indicador.

export type NHSPosition = "above" | "below" | "similar";

// ── Valor de referencia para comparación ─────────────────────────────────────

export interface NHSReference {
  value: number;
  population: string;     // p. ej. "Adultos ≥16 años, Granada (EAS)"
  source: string;
}

// ── Fila de indicador (una fila en la tabla de cada dominio) ─────────────────

export interface NHSIndicatorRow {
  label: string;                                    // Nombre no técnico del indicador
  instrumentId: string;                             // ID canónico del instrumento fuente
  value: number;
  unit: string;                                     // p. ej. "puntos (0–100)", "%"
  positiveDirection: "higher-is-better" | "lower-is-better";
  reference: NHSReference | null;                   // null si no existe referencia
  position: NHSPosition | null;                     // null si reference es null
  smallSampleWarning: boolean;                      // true si validN < 30
  validN: number;
}

// ── Dominio de indicadores (organización por causalidad, no por instrumento) ─

export type NHSDomainId = "bienestar" | "conductas" | "salud-percibida";

export interface NHSDomain {
  id: NHSDomainId;
  label: string;
  indicators: NHSIndicatorRow[];
}

// ── Parte I — Portada / Marco municipal ──────────────────────────────────────

export interface NHSPortada {
  municipalityName: string;
  municipalityProvince: string;
  year: number;
  complementaryStudyCount: number;    // N de 6 estudios disponibles
  validatedAt?: string;
  validatedBy?: string;
  fewComparatorsWarning: boolean;     // true si < 3 indicadores tienen referencia
}

// ── Parte III — Participación ciudadana (sección opcional) ───────────────────

export interface NHSParticipacion {
  realizada: boolean;
  fecha?: string;
  tematicasCount: number;
}

// ── Parte IV — Alcance del diagnóstico (sección obligatoria) ─────────────────

export interface NHSStudyEntry {
  instrumentId: string;
  label: string;
}

export interface NHSIndicatorWithoutReference {
  label: string;
  reason: string;
}

export interface NHSAlcance {
  availableStudies: NHSStudyEntry[];
  missingStudies: NHSStudyEntry[];
  indicatorsWithoutReference: NHSIndicatorWithoutReference[];
  fewComparatorsWarning: boolean;
  cautela: string;     // Texto fijo establecido en el contrato (P4-I9)
}

// ── NHSHealthProfileArtifact (PSL-NHS) ───────────────────────────────────────
// Artefacto institucional compilado e inmutable del Producto 4.
// Generado por NHSHealthProfileCompiler desde el LocalHealthProfile validado.

export interface NHSHealthProfileArtifact {

  // ── Identidad del artefacto ───────────────────────────────────────────────
  id: string;
  municipalityId: MunicipalityId;
  artifactVersion: string;        // PSL-NHS/vN (N = número secuencial por municipio + 1)
  compiledAt: string;             // ISO timestamp
  compiledBy?: string;

  // ── Trazabilidad ───────────────────────────────────────────────────────────
  sourcePSLId: string;
  sourcePSLVersion: string;
  sourcePSLEvidenceStoreVersion: string;

  // ── Parte I: Marco municipal ───────────────────────────────────────────────
  portada: NHSPortada;

  // ── Parte II: Dominios de indicadores ─────────────────────────────────────
  // Solo dominios con al menos un indicador disponible.
  // Orden canónico: bienestar → conductas → salud-percibida
  dominios: NHSDomain[];

  // ── Parte III: Participación ciudadana ────────────────────────────────────
  // null si no aplica o no está disponible.
  participacionCiudadana: NHSParticipacion | null;

  // ── Parte IV: Alcance del diagnóstico ─────────────────────────────────────
  alcance: NHSAlcance;

  // ── Invariante de congelación (P4-I4) ────────────────────────────────────
  isCongealed: true;
}
