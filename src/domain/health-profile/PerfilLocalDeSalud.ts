import type { MunicipalityId } from "../municipality";

// ── Espacios funcionales del Perfil ───────────────────────────────────────────
// Los 8 espacios de trabajo del técnico, derivados de la Arquitectura Funcional.

export type ProfileSpace =
  | "contexto-territorial"
  | "situacion-salud"
  | "determinantes"
  | "desigualdades"
  | "activos"
  | "sintesis"
  | "preguntas-abiertas"
  | "preparacion-deliberativa";

// ── HealthProfileInterpretation ───────────────────────────────────────────────
// Afirmación de autoría técnica sobre el significado, relaciones o causas de la
// situación de salud del Territorio.
//
// Invariantes (Modelo Conceptual):
//   - Siempre tiene autor humano identificado.
//   - Siempre tiene al menos una evidencia de sustento (evidenciaIds).
//   - Nunca se elimina: status pasa a "superada" cuando se revisa.
//   - No puede convertirse en Evidencia: la categoría epistémica es permanente.

export type InterpretationCerteza = "alta" | "moderada" | "provisional";
export type InterpretationStatus   = "activa" | "superada";

export interface HealthProfileInterpretation {
  id:              string;
  municipalityId:  MunicipalityId;
  espacio:         ProfileSpace;
  enunciado:       string;          // máx. 500 caracteres
  certeza:         InterpretationCerteza;
  evidenciaIds:    string[];        // IDs de EvidenceAtom que la sustentan
  razonamiento?:   string;          // razonamiento explícito; máx. 1000 caracteres
  autorNombre:     string;
  formuladaEn:     string;          // ISO timestamp
  status:          InterpretationStatus;
  supersededById?: string;          // ID de la interpretación que la supera
}

// ── HealthProfileHypothesis ───────────────────────────────────────────────────
// Afirmación provisional de autoría técnica. El técnico la considera plausible
// pero carece de evidencia suficiente para sostenerla como Interpretación.
//
// Invariantes:
//   - Siempre tiene autor humano identificado.
//   - Tiene al menos un indicio que la hace plausible.
//   - Nunca se elimina: status cambia cuando se resuelve o descarta.

export type HypothesisPlausibilidad = "alta" | "moderada" | "especulativa";
export type HypothesisStatus =
  | "activa"
  | "resuelta-como-interpretacion"
  | "descartada"
  | "preservada";

export interface HealthProfileHypothesis {
  id:                   string;
  municipalityId:       MunicipalityId;
  espacio:              ProfileSpace;
  enunciado:            string;             // máx. 500 caracteres
  plausibilidad:        HypothesisPlausibilidad;
  indicios:             string[];           // evidencias que la sugieren sin confirmarla
  preguntasResolutoras: string[];           // qué información resolvería la hipótesis
  autorNombre:          string;
  formuladaEn:          string;             // ISO timestamp
  status:               HypothesisStatus;
  resolvedById?:        string;             // ID de la Interpretación que la resolvió
  discardedMotivo?:     string;             // motivo del descarte; solo presente cuando status="descartada"
}

// ── HealthProfileOpenQuestion ─────────────────────────────────────────────────
// Laguna de conocimiento reconocida explícitamente por el técnico.
// Representa la ausencia de información relevante para el diagnóstico.
//
// Invariantes:
//   - No es una afirmación: no tiene dirección propuesta (eso sería Hipótesis).
//   - Nunca se elimina: status cambia cuando se resuelve.
//   - Su existencia es información positiva, no un defecto del Perfil.

export type OpenQuestionUrgencia = "alta" | "media" | "baja";
export type OpenQuestionStatus   = "abierta" | "resuelta" | "preservada";

export interface HealthProfileOpenQuestion {
  id:               string;
  municipalityId:   MunicipalityId;
  espacio:          ProfileSpace;
  formulacion:      string;           // descripción de la laguna de conocimiento
  relevancia:       string;           // por qué importa responder esta pregunta
  urgencia:         OpenQuestionUrgencia;
  viasResolucion:   string[];          // cómo podría responderse
  creadaEn:         string;            // ISO timestamp
  status:           OpenQuestionStatus;
  resolucionNota?:  string;            // descripción de cómo se resolvió
}

// ── PerfilLocalDeSalud ────────────────────────────────────────────────────────
// Objeto raíz del espacio de trabajo interpretativo del Perfil Local de Salud.
//
// Distinto del LocalHealthProfile existente:
//   - LocalHealthProfile es generado automáticamente por el pipeline MIT.
//   - PerfilLocalDeSalud es construido progresivamente por el técnico.
//
// Persiste en MunicipalityWorkspace.perfilLocalDeSalud (campo opcional).
// La ausencia del campo es válida: workspaces anteriores no lo tienen.

export interface PerfilLocalDeSalud {
  id:               string;
  municipalityId:   MunicipalityId;
  interpretaciones: HealthProfileInterpretation[];
  hipotesis:        HealthProfileHypothesis[];
  preguntasAbiertas: HealthProfileOpenQuestion[];
  sintesisTexto?:   string;   // síntesis narrativa de autoría técnica; máx. 3000 caracteres
  createdAt:        string;
  updatedAt:        string;
}
