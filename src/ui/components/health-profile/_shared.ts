// Shared constants, helpers, and internal types.
// Internal to src/ui/components/health-profile/ — not exported outside.

import type {
  ProfileSpace,
  InterpretationCerteza,
  HypothesisPlausibilidad,
} from "../../../domain/health-profile";
import type { PerfilEstadoNivel, PerfilSpaceCoverage } from "../../../application/health-profile";

// ── Label maps ────────────────────────────────────────────────────────────────

export const NIVEL_LABEL: Record<PerfilEstadoNivel, string> = {
  "vacio":                     "Vacío",
  "en-construccion":           "En construcción",
  "cobertura-minima":          "Cobertura mínima",
  "estructuralmente-completo": "Estructuralmente completo",
};

export const SPACE_LABEL: Record<ProfileSpace, string> = {
  "contexto-territorial":     "Contexto territorial",
  "situacion-salud":          "Situación de salud",
  "determinantes":            "Determinantes",
  "desigualdades":            "Desigualdades",
  "activos":                  "Activos",
  "sintesis":                 "Síntesis",
  "preguntas-abiertas":       "Preguntas abiertas",
  "preparacion-deliberativa": "Preparación deliberativa",
};

export const COVERAGE_LABEL: Record<PerfilSpaceCoverage, string> = {
  "vacio":              "Vacío",
  "iniciado":           "Iniciado",
  "pendiente-revision": "Pendiente revisión",
  "desarrollado":       "Desarrollado",
};

export const CERTEZA_LABEL: Record<InterpretationCerteza, string> = {
  "alta":        "Alta",
  "moderada":    "Moderada",
  "provisional": "Provisional",
};

export const PLAUSIBILIDAD_LABEL: Record<HypothesisPlausibilidad, string> = {
  "alta":         "Alta",
  "moderada":     "Moderada",
  "especulativa": "Especulativa",
};

export const SPACE_OPTIONS: Array<{ value: ProfileSpace; label: string }> = [
  { value: "contexto-territorial",     label: "Contexto territorial" },
  { value: "situacion-salud",          label: "Situación de salud" },
  { value: "determinantes",            label: "Determinantes" },
  { value: "desigualdades",            label: "Desigualdades" },
  { value: "activos",                  label: "Activos" },
  { value: "sintesis",                 label: "Síntesis" },
  { value: "preguntas-abiertas",       label: "Preguntas abiertas" },
  { value: "preparacion-deliberativa", label: "Preparación deliberativa" },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

export function parseEvidenciaIds(raw: string): string[] {
  return raw.split(/[\n,;]+/).map(s => s.trim()).filter(Boolean);
}

// Indicios and preguntasResolutoras are free text — only split by newline.
export function parseTextLines(raw: string): string[] {
  return raw.split(/\n+/).map(s => s.trim()).filter(Boolean);
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("es-ES", {
    year: "numeric", month: "short", day: "numeric",
  });
}

// ── Internal types ────────────────────────────────────────────────────────────

export type ActiveForm =
  | null
  | { type: "create" }
  | { type: "edit";        id: string }
  | { type: "supersede";   id: string }
  | { type: "create-hip" }
  | { type: "edit-hip";    id: string }
  | { type: "resolve-hip"; id: string }
  | { type: "discard-hip"; id: string };

// Interpretation form drafts

export interface InterpretacionFormDraft {
  espacio:         ProfileSpace;
  enunciado:       string;
  certeza:         InterpretationCerteza;
  autorNombre:     string;
  razonamiento:    string;
  evidenciaIdsRaw: string;
}

export interface EditFormDraft {
  certeza:         InterpretationCerteza;
  razonamiento:    string;
  evidenciaIdsRaw: string;
}

export const INIT_FORM_DRAFT: InterpretacionFormDraft = {
  espacio:         "situacion-salud",
  enunciado:       "",
  certeza:         "moderada",
  autorNombre:     "",
  razonamiento:    "",
  evidenciaIdsRaw: "",
};

// Hypothesis form drafts

export interface HipotesisFormDraft {
  espacio:              ProfileSpace;
  enunciado:            string;
  plausibilidad:        HypothesisPlausibilidad;
  indicios:             string;   // newline-separated free text
  preguntasResolutoras: string;   // newline-separated free text
  autorNombre:          string;
}

export interface EditHipotesisFormDraft {
  enunciado:            string;
  plausibilidad:        HypothesisPlausibilidad;
  indicios:             string;
  preguntasResolutoras: string;
}

export const INIT_HIPOTESIS_FORM_DRAFT: HipotesisFormDraft = {
  espacio:              "determinantes",
  enunciado:            "",
  plausibilidad:        "moderada",
  indicios:             "",
  preguntasResolutoras: "",
  autorNombre:          "",
};
