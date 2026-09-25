/**
 * documentPreviewContext (CONV-A)
 *
 * Selección PURA del snapshot semántico que gobierna la previsualización
 * documental canónica. Encapsula la regla rectora del invariante temporal
 * (vivo ≡ sellado): la previsualización solo se considera VALIDADA cuando existen
 * atómicamente `validatedPSL` Y un payload de answers deserializable y
 * estructuralmente válido. En cualquier otro caso —incluido `validatedPSL` con
 * payload ausente/ilegible/inválido— se trata como BORRADOR VIVO no institucional
 * (revalidación requerida): NUNCA se recombina `validatedPSL` con answers vivos.
 */

import type { LocalHealthProfile } from "../../domain/health-profile";
import type { DiagnosticAnswers } from "./diagnosticAnswers";
import { parseValidatedAnswersSnapshot } from "./validatedAnswersSnapshot";

export interface DocumentPreviewContext {
  /** PSL que gobierna la previsualización (validado si lo hay; si no, el vivo). */
  previewPSL: LocalHealthProfile;
  /** Answers del MISMO snapshot que `previewPSL` (nunca answers vivos si validado). */
  previewAnswers: DiagnosticAnswers;
  /** true solo si el snapshot validado (psl + payload válido) está completo. */
  isValidatedPreview: boolean;
}

export function selectDocumentPreviewContext(input: {
  validatedPSL: LocalHealthProfile | undefined;
  validatedAnswersSnapshot: string | undefined;
  livePSL: LocalHealthProfile;
  liveAnswers: DiagnosticAnswers;
}): DocumentPreviewContext {
  const validatedAnswers = parseValidatedAnswersSnapshot(
    input.validatedAnswersSnapshot
  );
  if (input.validatedPSL !== undefined && validatedAnswers !== null) {
    return {
      previewPSL: input.validatedPSL,
      previewAnswers: validatedAnswers,
      isValidatedPreview: true,
    };
  }
  // Sin snapshot completo (o payload roto junto a validatedPSL): borrador vivo
  // no institucional. No se recombina validatedPSL con answers vivos.
  return {
    previewPSL: input.livePSL,
    previewAnswers: input.liveAnswers,
    isValidatedPreview: false,
  };
}
