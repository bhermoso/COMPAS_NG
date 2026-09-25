/**
 * strategic-scenario-fixtures.ts
 *
 * Fixtures canónicos del dominio del Producto 5 — Motor de Traducción Estratégica.
 *
 * Propósito: disponer de escenarios perfectamente conocidos para los tests
 * de dominio (Unidad 3) y los tests del motor (Unidad 6).
 * Son independientes del algoritmo que producirá estos objetos en el MTE.
 *
 * No contienen lógica. No validan el motor. Solo representan conocimiento
 * de prueba que satisface todos los invariantes contractuales.
 */

import type {
  EscenarioEstrategico,
  LecturaEstrategicaLocal,
  MetodologiaMTE,
  ReferenciaInstitucional,
  TensionEstrategica,
  VacioInstitucional,
} from "../src/domain/strategic-scenario";

// ── Constantes compartidas ────────────────────────────────────────────────────

/** Las cuatro cautelas invariables del MTE (CONTRACT-MTE §6.4). */
export const CAUTELAS_MTE_INVARIABLES: readonly string[] = Object.freeze([
  "Las correspondencias identificadas son observaciones metodológicas sobre la relación entre el diagnóstico territorial y el conocimiento estratégico institucional disponible. No constituyen orientaciones definitivas ni asignaciones de marcos al Plan Local de Salud.",
  "Un escenario puede corresponder con elementos de más de un marco institucional. La selección de qué marcos incorporar al plan es una decisión del equipo técnico.",
  "La ausencia de cobertura institucional (sinCoberturaMarcal: true) no significa que el problema carezca de importancia o de posibilidad de actuación. Significa que el sistema no ha detectado correspondencia en el conocimiento estratégico disponible.",
  "Este artefacto no establece prioridades entre escenarios. La priorización es una decisión deliberativa que corresponde al equipo técnico y a la ciudadanía.",
]);

/** MetodologíaMTE base para pruebas. */
export const METODOLOGIA_BASE: MetodologiaMTE = {
  instrumentosConsultados: ["EPVSA", "ESCA", "MAYORES", "BUENA_EDAD", "RELAS"],
  criterioDeAgrupacion:
    "1:1 — una área de intervención del PSL por escenario (primera implementación)",
  mecanismoDeCorrespondencia:
    "Correspondencia por palabras clave entre el texto del área y los elementos del conocimiento estratégico institucional",
  versionConocimientoEstrategico: "1.0.0",
};

// ── Componentes: ReferenciaInstitucional ─────────────────────────────────────

export const REF_EPVSA_LE1: ReferenciaInstitucional = {
  marcoId: "EPVSA",
  elementoId: "EPVSA-LE1",
  elementoLabel: "LE1 · Acción local en salud y comunidad",
  nivel: "linea",
  sourceTrace:
    "EPVSA 2024–2030, Línea Estratégica 1. Consejería de Salud y Consumo, Junta de Andalucía.",
};

export const REF_EPVSA_LE2: ReferenciaInstitucional = {
  marcoId: "EPVSA",
  elementoId: "EPVSA-LE2",
  elementoLabel: "LE2 · Entornos y estilos de vida saludables",
  nivel: "linea",
  sourceTrace:
    "EPVSA 2024–2030, Línea Estratégica 2. Consejería de Salud y Consumo, Junta de Andalucía.",
};

export const REF_EPVSA_LE2_OBJ1: ReferenciaInstitucional = {
  marcoId: "EPVSA",
  elementoId: "EPVSA-LE2-OBJ1",
  elementoLabel: "Promover la alimentación saludable en el ámbito comunitario y escolar",
  nivel: "objetivo",
  sourceTrace: "EPVSA 2024–2030, LE2, Objetivo 1.",
};

export const REF_EPVSA_LE2_OBJ3: ReferenciaInstitucional = {
  marcoId: "EPVSA",
  elementoId: "EPVSA-LE2-OBJ3",
  elementoLabel:
    "Mejorar el bienestar emocional y reducir el estigma asociado a la salud mental",
  nivel: "objetivo",
  sourceTrace: "EPVSA 2024–2030, LE2, Objetivo 3.",
};

export const REF_ESCA_L2: ReferenciaInstitucional = {
  marcoId: "ESCA",
  elementoId: "ESCA-L2",
  elementoLabel: "Coordinación sociosanitaria e intersectorial",
  nivel: "linea",
  sourceTrace:
    "ESCA — Línea 2. Coordinación sociosanitaria. Véase ESCA.pdf en repositorio documental.",
};

export const REF_ESCA_L3: ReferenciaInstitucional = {
  marcoId: "ESCA",
  elementoId: "ESCA-L3",
  elementoLabel: "Participación ciudadana y empoderamiento en salud",
  nivel: "linea",
  sourceTrace:
    "ESCA — Línea 3. Participación ciudadana. Véase ESCA.pdf en repositorio documental.",
};

export const REF_RELAS_F3: ReferenciaInstitucional = {
  marcoId: "RELAS",
  elementoId: "RELAS-F3",
  elementoLabel: "Fase 3 · Planificación de la acción",
  nivel: "programa",
  sourceTrace: "Metodología RELAS Granada — Fase 3: Planificación de la acción.",
};

// ── Componentes: TensionEstrategica ──────────────────────────────────────────

/** Tensión de evidencia: conflicto entre fuentes sobre alimentación. */
export const TENSION_EVIDENCIA_ALIMENTACION: TensionEstrategica = {
  tipo: "evidencia",
  descripcion:
    "El informe de salud registra alta prevalencia de consumo de ultraprocesados " +
    "mientras los datos EAS indican adherencia media-alta a la dieta mediterránea. " +
    "Las fuentes son metodológicamente distintas y no directamente comparables.",
  origenPSL: "conflicto-fuente-alimentacion",
  requiereDeliberacion: true,
};

/** Tensión de marco: orientaciones distintas entre EPVSA y ESCA. */
export const TENSION_MARCO_SALUD_MENTAL: TensionEstrategica = {
  tipo: "marco",
  descripcion:
    "EPVSA-LE2 orienta hacia intervención de estilo de vida individual " +
    "mientras ESCA-L2 orienta hacia coordinación sociosanitaria sistémica. " +
    "Ambos marcos son pertinentes pero sugieren estrategias de entrada distintas " +
    "que requieren deliberación técnica antes de diseñar el plan.",
  requiereDeliberacion: true,
};

// ── Componentes: VacioInstitucional ──────────────────────────────────────────

export const VACIO_CONSUMO_ALCOHOL: VacioInstitucional = {
  areaId: "area-cage-001",
  areaTitle: "Consumo de riesgo de alcohol",
  nota:
    "No se identificó correspondencia en el conocimiento estratégico institucional " +
    "disponible para el contenido de esta área.",
};

// ── Fixture 1 — Escenario mínimo ──────────────────────────────────────────────
// Información imprescindible para cumplir todos los invariantes (I-SC-1 a I-SC-8).
// Un área, una referencia, sin tensiones, sin activos, sin cautelas propias.

export const ESCENARIO_MINIMO: EscenarioEstrategico = {
  id: "escenario-minimo-001",
  tema: "Apoyo social funcional",
  areasOrigen: ["area-duke-001"],
  evidenciaOrigen: ["evidencia-001"],
  cautelasOriginales: [],
  activosRelacionados: [],
  referenciasInstitucionales: [REF_EPVSA_LE1],
  tensiones: [],
  sinCoberturaMarcal: false,
};

// ── Fixture 2 — Escenario con múltiples referencias institucionales ────────────
// Tres referencias: dos de EPVSA (línea y objetivo) y una de ESCA.
// Permite probar la correspondencia multi-marco.

export const ESCENARIO_CON_REFERENCIAS: EscenarioEstrategico = {
  id: "escenario-referencias-001",
  tema: "Bienestar socioemocional escolar",
  areasOrigen: ["area-ibse-001"],
  evidenciaOrigen: ["evidencia-002", "evidencia-003"],
  cautelasOriginales: [
    "Instrumento aplicado a escolares; resultados no extrapolables a población adulta.",
  ],
  activosRelacionados: [],
  referenciasInstitucionales: [REF_EPVSA_LE2, REF_EPVSA_LE2_OBJ3, REF_ESCA_L3],
  tensiones: [],
  sinCoberturaMarcal: false,
};

// ── Fixture 3 — Escenario sin cobertura institucional ────────────────────────
// referenciasInstitucionales vacío → sinCoberturaMarcal: true (I-SC-7).
// Señal al Producto 6 de que no existe instrumento disponible.

export const ESCENARIO_SIN_COBERTURA: EscenarioEstrategico = {
  id: "escenario-sin-cobertura-001",
  tema: "Sueño de duración insuficiente",
  areasOrigen: ["area-sueno-001"],
  evidenciaOrigen: ["evidencia-004"],
  cautelasOriginales: [
    "Sin referencia provincial o nacional disponible para este indicador.",
  ],
  activosRelacionados: [],
  referenciasInstitucionales: [],
  tensiones: [],
  sinCoberturaMarcal: true,
};

// ── Fixture 4 — Escenario con tensión de evidencia ───────────────────────────
// Contiene una tensión tipo "evidencia" derivada de un conflicto del PSL.
// origenPSL permite trazar la tensión hasta su fuente diagnóstica.

export const ESCENARIO_TENSION_EVIDENCIA: EscenarioEstrategico = {
  id: "escenario-tension-evidencia-001",
  tema: "Adherencia a la dieta mediterránea",
  areasOrigen: ["area-predimed-001"],
  evidenciaOrigen: ["evidencia-005", "evidencia-006"],
  cautelasOriginales: [],
  activosRelacionados: [],
  referenciasInstitucionales: [REF_EPVSA_LE2_OBJ1],
  tensiones: [TENSION_EVIDENCIA_ALIMENTACION],
  sinCoberturaMarcal: false,
};

// ── Fixture 5 — Escenario con tensión de marco ────────────────────────────────
// Dos referencias de marcos con orientaciones distintas para el mismo escenario.
// La tensión tipo "marco" no tiene origenPSL: emerge del contraste entre referencias.

export const ESCENARIO_TENSION_MARCO: EscenarioEstrategico = {
  id: "escenario-tension-marco-001",
  tema: "Salud mental y bienestar emocional",
  areasOrigen: ["area-salud-mental-001"],
  evidenciaOrigen: ["evidencia-007", "evidencia-008"],
  cautelasOriginales: [],
  activosRelacionados: [],
  referenciasInstitucionales: [REF_EPVSA_LE2_OBJ3, REF_ESCA_L2],
  tensiones: [TENSION_MARCO_SALUD_MENTAL],
  sinCoberturaMarcal: false,
};

// ── Fixture 6 — LecturaEstrategicaLocal mínima ───────────────────────────────
// Un único escenario, sin vacíos, con las cuatro cautelas invariables.

export const LECTURA_MINIMA: LecturaEstrategicaLocal = {
  id: "lectura-minima-001",
  municipalityId: "municipio-test",
  generatedAt: "2026-06-30T10:00:00.000Z",
  sourcePSLId: "psl-test-001",
  sourcePSLVersion: "2026-06-30T09:00:00.000Z",
  knowledgeBaseVersion: "1.0.0",
  hasTranslatableContent: true,
  escenarios: [ESCENARIO_MINIMO],
  sinCobertura: [],
  cautelas: [...CAUTELAS_MTE_INVARIABLES],
  metodologia: METODOLOGIA_BASE,
  requiresHumanValidation: true,
};

// ── Fixture 7 — LecturaEstrategicaLocal compleja ─────────────────────────────
// Cinco escenarios con características distintas:
//   - Escenario mínimo (referencia, sin tensiones)
//   - Escenario con múltiples referencias
//   - Escenario sin cobertura (sinCoberturaMarcal: true)
//   - Escenario con tensión de evidencia
//   - Escenario con tensión de marco
// Un vacío institucional en sinCobertura.
// Completamente determinista.

export const LECTURA_COMPLEJA: LecturaEstrategicaLocal = {
  id: "lectura-compleja-001",
  municipalityId: "municipio-test",
  generatedAt: "2026-06-30T10:00:00.000Z",
  sourcePSLId: "psl-test-002",
  sourcePSLVersion: "2026-06-30T09:30:00.000Z",
  knowledgeBaseVersion: "1.0.0",
  hasTranslatableContent: true,
  escenarios: [
    ESCENARIO_MINIMO,
    ESCENARIO_CON_REFERENCIAS,
    ESCENARIO_SIN_COBERTURA,
    ESCENARIO_TENSION_EVIDENCIA,
    ESCENARIO_TENSION_MARCO,
  ],
  sinCobertura: [VACIO_CONSUMO_ALCOHOL],
  cautelas: [...CAUTELAS_MTE_INVARIABLES],
  metodologia: METODOLOGIA_BASE,
  requiresHumanValidation: true,
};

// ── Fixture 8 — LecturaEstrategicaLocal sin contenido traducible ──────────────
// Caso G-MTE-2: PSL sin áreas de intervención.
// hasTranslatableContent: false; escenarios: [].

export const LECTURA_SIN_CONTENIDO: LecturaEstrategicaLocal = {
  id: "lectura-sin-contenido-001",
  municipalityId: "municipio-test",
  generatedAt: "2026-06-30T10:00:00.000Z",
  sourcePSLId: "psl-test-003",
  sourcePSLVersion: "2026-06-30T09:00:00.000Z",
  knowledgeBaseVersion: "1.0.0",
  hasTranslatableContent: false,
  escenarios: [],
  sinCobertura: [],
  cautelas: [...CAUTELAS_MTE_INVARIABLES],
  metodologia: METODOLOGIA_BASE,
  requiresHumanValidation: true,
};
