/**
 * profileWritingContract
 *
 * Contrato de escritura del Perfil Local de Salud (versión operativa de
 * docs/architecture/PROFILE-WRITING-CONTRACT.md). Pequeño y puro: constantes
 * y un verificador de fronteras que los tests y la narrativa pueden usar.
 *
 * Fórmula de escritura: señal de salud → mecanismo social plausible →
 * determinante → desigualdad (observable o no) → activo/capacidad →
 * pregunta de contraste comunitario → conclusión diagnóstica sin
 * recomendación.
 */

// ── Dimensiones obligatorias de lectura ───────────────────────────────────────

export const PROFILE_READING_DIMENSIONS = [
  "situación de salud",
  "condiciones de vida y determinantes",
  "desigualdades visibles o no visibles",
  "activos y capacidades",
  "experiencia y contraste comunitario",
  "incertidumbres",
  "preguntas para la deliberación",
] as const;

// ── Preguntas-motor de la narrativa (Tarea 5 del encargo) ─────────────────────
// La generación narrativa se gobierna por estas preguntas; no es necesario
// que el documento sea un índice de preguntas, pero cada una debe tener
// respuesta o ausencia declarada en el texto.

export const DIAGNOSTIC_ENGINE_QUESTIONS = [
  "¿Qué imagen de situación de salud ofrece el expediente?",
  "¿Qué aporta el Informe de Salud?",
  "¿Qué añaden los estudios complementarios?",
  "¿Qué señales convergen?",
  "¿Qué condiciones de vida podrían estar detrás?",
  "¿Qué desigualdades no podemos ver todavía?",
  "¿Qué activos pueden ser capacidades reales?",
  "¿Qué sabe o debe contrastar la comunidad?",
  "¿Qué queda preparado para deliberar?",
] as const;

// ── Fronteras: expresiones prohibidas en el documento del Perfil ──────────────
// Patrones conservadores: cazan afirmaciones prescriptivas o causales, no
// sus negaciones legítimas («no formula recomendaciones…»).

export interface WritingContractViolation {
  id: string;
  motivo: string;
  match: string;
}

const FORBIDDEN_WRITING_PATTERNS: Array<{
  id: string;
  motivo: string;
  pattern: RegExp;
}> = [
  {
    id: "recomendacion",
    motivo: "El Perfil concluye, no recomienda (las recomendaciones son del Plan de Acción).",
    pattern:
      /se recomienda|recomendamos|es recomendable|debe implantarse|debe ponerse en marcha|proponemos|se propone implantar/i,
  },
  {
    id: "actuacion-programa",
    motivo: "Actuaciones, programas y objetivos estratégicos pertenecen a fases posteriores.",
    pattern:
      /programa de intervención|actuaciones previstas|objetivo estratégico|línea estratégica|objetivo operativo|cartera de servicios propuesta/i,
  },
  {
    id: "causalidad-falsa",
    motivo: "Solo mecanismos e hipótesis plausibles; nunca causalidad demostrada sin sustento.",
    pattern:
      /demuestra que|queda demostrado|causa directa|relación causal confirmada|prueba de forma concluyente/i,
  },
];

/** Devuelve las violaciones de frontera encontradas en el texto (vacío = OK). */
export function checkProfileWritingContract(
  texto: string
): WritingContractViolation[] {
  const violations: WritingContractViolation[] = [];
  for (const regla of FORBIDDEN_WRITING_PATTERNS) {
    const match = texto.match(regla.pattern);
    if (match !== null) {
      violations.push({ id: regla.id, motivo: regla.motivo, match: match[0] });
    }
  }
  return violations;
}

// ── Criterios positivos (verificables sobre el texto generado) ───────────────

export const POSITIVE_WRITING_CRITERIA = [
  "conecta señales con mecanismos sociales plausibles",
  "formula preguntas de contraste comunitario",
  "diferencia evidencia directa, proxy/contexto y ausencia de dato",
  "interpreta los activos como capacidades potenciales conectadas con desafíos",
  "reconoce la experiencia comunitaria como conocimiento (pendiente de incorporación si no hay material cualitativo)",
] as const;
