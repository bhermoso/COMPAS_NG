/**
 * Motor de Reconciliación Interpretativa
 *
 * Procesamiento situado entre el Estado Territorial Evolutivo (MIT, Nivel 2)
 * y la Priorización (Nivel 3).
 *
 * Pipeline interno:
 *   tensionesEstructurales (MIT)
 *     → Filtro de Relevancia (≥2 de 3 criterios)
 *         PASA  → elegible para escalado
 *         FALLA → clasificado como "ruido-estructural" (no escala)
 *     → Criterios de Escalado a OIT (los 3 deben cumplirse)
 *         PASA  → Área de Intervención Territorial
 *         FALLA → tensión no escalada
 *
 * Principio invariante:
 *   ConflictoInterpretativo.resolucion = "no-resuelta" siempre.
 *   El sistema detecta y estructura — no resuelve.
 */

import type { EstadoTerritorialEvolutivo } from "../territorial-interpretation";
import type { TerritorialStateRecord } from "../../domain/workspace";
import type { OITOpportunity } from "../oit";

// ── Tipos ──────────────────────────────────────────────────────────────────

export type TipoConflicto =
  | "tendencia"
  | "fuente"
  | "escala"
  | "temporal"
  | "interpretativo";

export interface ConflictoInterpretativo {
  id: string;
  tipo: TipoConflicto;
  descripcion: string;
  fuentesImplicadas: string[];
  resolucion: "no-resuelta";
}

// ── Filtro de Relevancia ──────────────────────────────────────────────────
// Una tensión es relevante si cumple ≥2 de los 3 criterios.
// Si no, se clasifica como ruido estructural y no se escala.

export interface CriteriosRelevancia {
  impactoEstructuralPotencial: boolean;      // afecta determinantes, desigualdad o activos
  persistenciaInterpretativa: boolean;       // ≥2 estados históricos o ≥2 fuentes
  divergenciaFuenteSignificativa: boolean;   // contradicción cuanti/cuali o escalas distintas
  criteriosCumplidos: number;                // 0–3
  esRelevante: boolean;                      // ≥2 cumplidos
}

// ── Criterios de Escalado ─────────────────────────────────────────────────
// Solo se evalúan si la tensión pasó el Filtro de Relevancia.

export interface CriteriosEscalado {
  persistenciaTemporal: boolean;
  convergenciaFuentes: boolean;
  coherenciaEstructural: boolean;
  escalado: boolean;
}

// ── Tensión Analizada ─────────────────────────────────────────────────────

export type ClasificacionTension =
  | "escalada"
  | "no-escalada"
  | "ruido-estructural";

export interface TensionAnalizada {
  tension: string;
  relevancia: CriteriosRelevancia;
  criterios?: CriteriosEscalado;     // undefined si clasificacion = "ruido-estructural"
  clasificacion: ClasificacionTension;
}

// ── Resultado de Reconciliación ───────────────────────────────────────────

export interface ReconciliacionResult {
  conflictos: ConflictoInterpretativo[];
  tensionesEscaladas: TensionAnalizada[];
  tensionesNoEscaladas: TensionAnalizada[];
  ruidoEstructural: TensionAnalizada[];       // no superaron filtro de relevancia
  areasIntervencionEscaladas: OITOpportunity[];
  requiresHumanValidation: true;
}

// ── Entry point ────────────────────────────────────────────────────────────

export function runReconciliacionInterpretativa(
  mit: EstadoTerritorialEvolutivo,
  historial: TerritorialStateRecord[]
): ReconciliacionResult {
  // 1. Detectar conflictos entre estados, fuentes y escalas (sin resolver)
  const conflictos: ConflictoInterpretativo[] = [
    ...detectarConflictosTendencia(mit, historial),
    ...detectarConflictosFuente(mit),
    ...detectarConflictosEscala(mit),
    ...detectarConflictosTemporales(mit, historial),
    ...detectarConflictosInterpretativos(mit),
  ];

  // 2. Analizar cada tensión estructural del MIT:
  //    Filtro de Relevancia → (si pasa) → Criterios de Escalado
  const tensionesAnalizadas: TensionAnalizada[] = mit.tensionesEstructurales.map(
    (tension) => analizarTension(tension, mit, historial)
  );

  const tensionesEscaladas   = tensionesAnalizadas.filter((t) => t.clasificacion === "escalada");
  const tensionesNoEscaladas = tensionesAnalizadas.filter((t) => t.clasificacion === "no-escalada");
  const ruidoEstructural     = tensionesAnalizadas.filter((t) => t.clasificacion === "ruido-estructural");

  const areasIntervencionEscaladas = tensionesEscaladas.map((t, i) =>
    buildAreaEscalada(t.tension, i)
  );

  return {
    conflictos,
    tensionesEscaladas,
    tensionesNoEscaladas,
    ruidoEstructural,
    areasIntervencionEscaladas,
    requiresHumanValidation: true,
  };
}

// ── Análisis de tensión individual ────────────────────────────────────────

function analizarTension(
  tension: string,
  mit: EstadoTerritorialEvolutivo,
  historial: TerritorialStateRecord[]
): TensionAnalizada {
  // PASO 1: Filtro de Relevancia
  const relevancia = evaluarRelevancia(tension, mit, historial);

  if (!relevancia.esRelevante) {
    return { tension, relevancia, clasificacion: "ruido-estructural" };
  }

  // PASO 2: Criterios de Escalado (solo si pasó el filtro)
  const criterios = evaluarCriteriosEscalado(tension, mit, historial);
  return {
    tension,
    relevancia,
    criterios,
    clasificacion: criterios.escalado ? "escalada" : "no-escalada",
  };
}

// ── Filtro de Relevancia ───────────────────────────────────────────────────

// Vocabulario de impacto estructural (criterio 1)
const STRUCTURAL_IMPACT_STEMS = [
  "determinante", "activo", "desigualdad", "inequidad", "vulnerabilidad",
  "territorio", "estructura", "longitudinal", "participati",
];

// Orígenes gobernados válidos para persistencia interpretativa (criterio 2)
const GOVERNED_ORIGINS = new Set([
  "ibse", "health-report", "citizen-participation", "manual-entry",
  "community-assets", "localiza-salud", "eas", "cmi", "redcap", "longi",
]);

function evaluarRelevancia(
  tension: string,
  mit: EstadoTerritorialEvolutivo,
  historial: TerritorialStateRecord[]
): CriteriosRelevancia {
  const tensionLC = tension.toLowerCase();

  // Criterio 1: Impacto estructural potencial
  const impactoEstructuralPotencial = STRUCTURAL_IMPACT_STEMS.some(
    (stem) => tensionLC.includes(stem)
  );

  // Criterio 2: Persistencia interpretativa
  // ≥2 estados históricos con tensión conceptualmente similar, o ≥2 orígenes gobernados
  const historialesConTension = historial.filter((h) =>
    h.tensionesEstructurales.some((t) => comparteConcept(t, tension))
  ).length;
  const origenesGobernados = mit.origenesPresentes.filter((o) =>
    GOVERNED_ORIGINS.has(o)
  ).length;
  const persistenciaInterpretativa = historialesConTension >= 2 || origenesGobernados >= 2;

  // Criterio 3: Divergencia de fuente significativa
  // Contradicción entre tipos de evidencia (cuantitativa vs. cualitativa, escalas distintas)
  const origenes = mit.origenesPresentes;
  const lt1 = mit.dimensionDiagnostica;
  const divergenciaFuenteSignificativa =
    (origenes.includes("ibse") && origenes.includes("health-report")) ||
    (origenes.includes("citizen-participation") && lt1.indicators.length > 0) ||
    (lt1.qualitativeFindings.length > 0 && lt1.indicators.length > 0);

  const criteriosCumplidos = [
    impactoEstructuralPotencial,
    persistenciaInterpretativa,
    divergenciaFuenteSignificativa,
  ].filter(Boolean).length;

  return {
    impactoEstructuralPotencial,
    persistenciaInterpretativa,
    divergenciaFuenteSignificativa,
    criteriosCumplidos,
    esRelevante: criteriosCumplidos >= 2,
  };
}

// ── Criterios de Escalado ─────────────────────────────────────────────────

// Stems para detectar estructura conceptual compartida entre tensiones
const STRUCTURAL_STEMS = [
  "determinante", "activo", "indicador", "participati", "metodológic",
  "longitudinal", "fragmen", "incompleto", "cuantitativo", "insuficiente",
  "desigualdad", "vulnerabilidad",
];

function evaluarCriteriosEscalado(
  tension: string,
  mit: EstadoTerritorialEvolutivo,
  historial: TerritorialStateRecord[]
): CriteriosEscalado {
  // Persistencia temporal: tensión conceptualmente similar en ≥2 registros históricos
  const persistenciaTemporal =
    historial.filter((h) =>
      h.tensionesEstructurales.some((t) => comparteConcept(t, tension))
    ).length >= 2;

  // Convergencia de fuentes: ≥2 orígenes gobernados presentes
  const convergenciaFuentes =
    mit.origenesPresentes.filter((o) => GOVERNED_ORIGINS.has(o)).length >= 2;

  // Coherencia estructural: tensión sobre estructura sanitaria fundamental
  const tensionLC = tension.toLowerCase();
  const coherenciaEstructural =
    STRUCTURAL_STEMS.some((stem) => tensionLC.includes(stem)) &&
    !tensionLC.startsWith("base documental insuficiente");

  return {
    persistenciaTemporal,
    convergenciaFuentes,
    coherenciaEstructural,
    escalado: persistenciaTemporal && convergenciaFuentes && coherenciaEstructural,
  };
}

function comparteConcept(a: string, b: string): boolean {
  const aLC = a.toLowerCase();
  const bLC = b.toLowerCase();
  return STRUCTURAL_STEMS.some((stem) => aLC.includes(stem) && bLC.includes(stem));
}

// ── Detección de conflictos ────────────────────────────────────────────────
// Cada detector identifica una clase de conflicto sin resolverla.

function detectarConflictosTendencia(
  mit: EstadoTerritorialEvolutivo,
  historial: TerritorialStateRecord[]
): ConflictoInterpretativo[] {
  if (!mit.dimensionLongitudinal.activa) return [];
  if (!historial.some((h) => h.longitudinalActiva)) return [];

  return [
    {
      id: "conflicto-tendencia-longi",
      tipo: "tendencia",
      descripcion:
        `Dimensión longitudinal activa (${mit.dimensionLongitudinal.evidenciasLongitudinales} evidencia(s)). ` +
        "La evolución temporal puede contradecir la lectura sincrónica actual.",
      fuentesImplicadas: ["longi"],
      resolucion: "no-resuelta",
    },
  ];
}

function detectarConflictosFuente(
  mit: EstadoTerritorialEvolutivo
): ConflictoInterpretativo[] {
  const conflictos: ConflictoInterpretativo[] = [];
  const origenes = mit.origenesPresentes;

  if (origenes.includes("ibse") && origenes.includes("health-report")) {
    conflictos.push({
      id: "conflicto-fuente-ibse-informe",
      tipo: "fuente",
      descripcion:
        "Coexistencia de IBSE (bienestar individual escolar) e Informe de Salud " +
        "(epidemiología poblacional). Fuentes con escalas y poblaciones distintas.",
      fuentesImplicadas: ["ibse", "health-report"],
      resolucion: "no-resuelta",
    });
  }

  if (
    origenes.includes("citizen-participation") &&
    origenes.some((o) => ["health-report", "ibse", "cmi", "eas"].includes(o))
  ) {
    conflictos.push({
      id: "conflicto-fuente-ciudadania-tecnica",
      tipo: "fuente",
      descripcion:
        "Coexistencia de prioridades ciudadanas y evidencia técnico-epidemiológica. " +
        "Las percepciones comunitarias pueden divergir de los indicadores estructurales.",
      fuentesImplicadas: [
        "citizen-participation",
        ...origenes.filter((o) => ["health-report", "ibse", "cmi", "eas"].includes(o)),
      ],
      resolucion: "no-resuelta",
    });
  }

  return conflictos;
}

function detectarConflictosEscala(
  mit: EstadoTerritorialEvolutivo
): ConflictoInterpretativo[] {
  const conflictos: ConflictoInterpretativo[] = [];
  const origenes = mit.origenesPresentes;
  const lt1 = mit.dimensionDiagnostica;

  // El conflicto multiescala requiere indicadores POBLACIONALES de OTRA procedencia
  // distinta del IBSE. Los indicadores del propio IBSE son sus agregados (misma
  // fuente, misma muestra): contarlos como una segunda escala poblacional duplicaría
  // la misma fuente e inventaría una tensión inexistente (caso Atarfe: solo IBSE).
  const indicadoresNoIbse = lt1.indicators.filter(
    (a) => a.provenance.origin !== "ibse"
  );
  if (origenes.includes("ibse") && indicadoresNoIbse.length > 0) {
    conflictos.push({
      id: "conflicto-escala-individual-poblacional",
      tipo: "escala",
      descripcion:
        `IBSE (muestra individual participante) + ${indicadoresNoIbse.length} indicador(es) ` +
        "poblacional(es) de otra procedencia. La integración multi-escala requiere " +
        "decisiones metodológicas explícitas.",
      fuentesImplicadas: [
        "ibse",
        ...origenes.filter((o) => ["cmi", "eas", "health-report"].includes(o)),
      ],
      resolucion: "no-resuelta",
    });
  }

  return conflictos;
}

function detectarConflictosTemporales(
  mit: EstadoTerritorialEvolutivo,
  historial: TerritorialStateRecord[]
): ConflictoInterpretativo[] {
  const conflictos: ConflictoInterpretativo[] = [];
  if (historial.length < 1) return conflictos;

  const anterior = historial[historial.length - 1];

  if (
    anterior.cuentasDiagnosticas.determinantes > 0 &&
    mit.dimensionDiagnostica.determinants.length === 0
  ) {
    conflictos.push({
      id: "conflicto-temporal-perdida-determinantes",
      tipo: "temporal",
      descripcion:
        `Estado anterior: ${anterior.cuentasDiagnosticas.determinantes} determinante(s). ` +
        "Estado actual: ninguno. Posible pérdida documental o cambio metodológico.",
      fuentesImplicadas: ["historical-state"],
      resolucion: "no-resuelta",
    });
  }

  if (anterior.totalEvidencias > 0) {
    // Solo un DESCENSO significativo de evidencia es un conflicto interpretativo
    // (posible pérdida documental o cambio metodológico). Un AUMENTO aditivo —
    // incluida la incorporación de nuevas fuentes, p. ej. 6→11 al añadir los activos
    // Localiza— es evolución documental esperada, no una tensión que reconciliar.
    const descenso = anterior.totalEvidencias - mit.totalEvidencias;
    if (descenso > 0 && descenso / anterior.totalEvidencias > 0.5) {
      conflictos.push({
        id: "conflicto-temporal-cambio-volumen",
        tipo: "temporal",
        descripcion:
          `Descenso en volumen de evidencia: ${anterior.totalEvidencias} → ${mit.totalEvidencias} ` +
          "EvidenceAtom (>50%). Posible pérdida documental o cambio metodológico.",
        fuentesImplicadas: ["evidence-volume"],
        resolucion: "no-resuelta",
      });
    }
  }

  return conflictos;
}

function detectarConflictosInterpretativos(
  mit: EstadoTerritorialEvolutivo
): ConflictoInterpretativo[] {
  const conflictos: ConflictoInterpretativo[] = [];
  const lt1 = mit.dimensionDiagnostica;

  if (mit.tensionesEstructurales.length > 0) {
    conflictos.push({
      id: "conflicto-interpretativo-tensiones",
      tipo: "interpretativo",
      descripcion:
        `${mit.tensionesEstructurales.length} tensión(es) estructural(es) detectadas. ` +
        "Admiten lecturas interpretativas distintas; requieren deliberación humana.",
      fuentesImplicadas: mit.origenesPresentes,
      resolucion: "no-resuelta",
    });
  }

  if (lt1.assets.length > 0 && lt1.determinants.length === 0) {
    conflictos.push({
      id: "conflicto-interpretativo-activos-sin-determinantes",
      tipo: "interpretativo",
      descripcion:
        "Activos comunitarios sin determinantes estructurales. " +
        "Las perspectivas salutogénica y de déficit no están integradas.",
      fuentesImplicadas: mit.origenesPresentes.filter((o) =>
        ["community-assets", "localiza-salud"].includes(o)
      ),
      resolucion: "no-resuelta",
    });
  }

  return conflictos;
}

// ── Construcción de Áreas de Intervención Escaladas ──────────────────────

function buildAreaEscalada(tension: string, index: number): OITOpportunity {
  const label = tension.length > 80 ? `${tension.slice(0, 80)}…` : tension;
  return {
    id: `oit-escalada-${index + 1}`,
    title: `Área de intervención territorial escalada: ${label}`,
    rationale:
      `Aspecto territorial con convergencia de evidencia entre múltiples fuentes disponibles. ` +
      `Requiere contraste con el equipo técnico y el Grupo Motor. ` +
      `Tensión de origen: «${tension}»`,
    relatedEvidenceIds: [],
    cautions: [
      "Requiere validación técnica antes de traducirse a actuaciones.",
      "La convergencia de evidencia no implica causalidad ni establece prioridad.",
      "La resolución es competencia del equipo técnico y la ciudadanía.",
    ],
    requiresHumanValidation: true,
  };
}
