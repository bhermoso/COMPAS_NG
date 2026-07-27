/**
 * validatedAnswersSnapshot (CONV-A)
 *
 * Frontera de (de)serialización del snapshot de answers validado. El dominio
 * persiste `MunicipalityWorkspace.validatedAnswersSnapshot` como STRING OPACO
 * (igual que `PSLCSealedCanonicalDocument.payload`); aquí —y solo aquí, en la capa
 * de aplicación— se serializa y se deserializa+valida estructuralmente hacia
 * `DiagnosticAnswers`. Así se preserva `domain ↛ application` y el estatuto
 * transitorio de `DiagnosticAnswers` (el dominio nunca ve la estructura tipada).
 *
 * Regla rectora: un payload ausente, ilegible o estructuralmente inválido NO se
 * recombina con answers vivos como si fuera validado — `parse` devuelve `null` y
 * la capa superior trata la previsualización como borrador no institucional
 * (revalidación requerida).
 */

import type { DiagnosticAnswers } from "./diagnosticAnswers";

/** Serializa las answers a payload opaco (determinista, round-trip estable). */
export function serializeValidatedAnswers(answers: DiagnosticAnswers): string {
  return JSON.stringify(answers);
}

/**
 * Deserializa y valida ESTRUCTURALMENTE el payload opaco.
 * Devuelve `null` si está ausente, es ilegible (JSON inválido) o no presenta la
 * forma mínima de `DiagnosticAnswers`. Nunca lanza.
 */
export function parseValidatedAnswersSnapshot(
  payload: string | undefined | null
): DiagnosticAnswers | null {
  if (payload === undefined || payload === null || payload.length === 0) {
    return null;
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(payload);
  } catch {
    return null;
  }
  return isDiagnosticAnswersShape(parsed) ? (parsed as DiagnosticAnswers) : null;
}

/** Guarda estructural mínima: presencia y tipo de los campos requeridos. */
function isDiagnosticAnswersShape(value: unknown): boolean {
  if (typeof value !== "object" || value === null) return false;
  const o = value as Record<string, unknown>;
  const isObj = (v: unknown) => typeof v === "object" && v !== null;
  return (
    isObj(o.porEspacio) &&
    Array.isArray(o.determinantes) &&
    isObj(o.salutogenica) &&
    isObj(o.estudios) &&
    isObj(o.referencias) &&
    isObj(o.sanitaria) &&
    isObj(o.territorial) &&
    Array.isArray(o.ugcAssistanceQuestions)
  );
}
