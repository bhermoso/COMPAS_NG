/**
 * pslcCanonicalDocument
 *
 * Documento canónico congelado del Perfil de Salud Local (esquema 2).
 *
 * GOV-SALIDA-01: el contrato canónico (lectura editorial + espacio técnico
 * hermano, contexto vivo único, sellado y normalización) vive en la capa
 * `health-profile` (`canonicalProfileDocument`). Este módulo re-exporta ese
 * contrato con los nombres históricos que consumen el compilador, la vista y los
 * tests, sin duplicar lógica.
 *
 * - `editorialView` contiene EXCLUSIVAMENTE la lectura editorial; el material
 *   técnico vive en el hermano `technicalSpace` (nunca anidado en la lectura).
 * - `readingStatus` es un campo de `editorialView`, no de la raíz del documento.
 */

export {
  PSLC_CANONICAL_SCHEMA_VERSION,
  PRIORITIZATION_PENDING_DECLARATION,
  CANONICAL_FRONTIER_STATEMENT,
  CANONICAL_INSTITUTIONAL_CAUTION_NOTE,
  pslStatusLabel,
  formatCanonicalDate,
  buildPSLCCanonicalDocument,
  buildCanonicalBuildContext,
  buildCanonicalEditorialView,
  buildCanonicalTechnicalSpace,
  buildCanonicalProfileDocumentFromPSL,
  assembleCanonicalProfileDocument,
  buildAuthoredClosing,
  buildInstitutionalBoundary,
  buildMethodologicalCautions,
  buildDocumentaryBase,
  buildKnowledgeState,
  sealCanonicalProfileDocument,
  sealCanonicalProfileDocument as sealCanonicalDocument,
  buildSealedCanonicalProfileDocument,
  buildSealedCanonicalProfileDocument as buildSealedCanonicalDocument,
  readSealedCanonicalDocument,
  normalizeSealedCanonicalProfileDocument,
  isLegacyEditorialView,
  CANONICAL_READING_ORDER,
  CANONICAL_TECHNICAL_ORDER,
} from "../health-profile/canonicalProfileDocument";

export type {
  PSLCReadingStatus,
  PSLCReadingContext,
  PSLCCanonicalDocumentProvenance,
  CanonicalProfileDocument,
  CanonicalProfileDocument as PSLCCanonicalDocument,
  CanonicalEditorialView,
  CanonicalTechnicalSpace,
  CanonicalBuildContext,
  CanonicalReadingCounters,
  CanonicalAuthoredClosing,
  CanonicalInstitutionalBoundary,
  CanonicalDocumentaryBase,
  CanonicalMethodologicalCaution,
  CanonicalKnowledgeState,
  CanonicalComparativeReference,
  CanonicalEpistemicMatrixRow,
  CanonicalReadingSectionId,
  CanonicalTechnicalSectionId,
  SealedCanonicalProfileDocumentV2,
  NormalizedCanonicalProfileDocument,
  LegacyEditorialView,
  CanonicalNormalizationResult,
  BuildPSLCCanonicalDocumentInput,
  BuildCanonicalBuildContextInput,
} from "../health-profile/canonicalProfileDocument";
