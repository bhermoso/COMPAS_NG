/**
 * profileOperations
 *
 * Funciones puras para operar sobre el PerfilLocalDeSalud dentro del workspace.
 *
 * Contratos invariantes (Modelo Conceptual):
 *   - Ninguna función elimina afirmaciones existentes.
 *   - Toda interpretación nueva nace con status "activa".
 *   - Toda hipótesis nueva nace con status "activa".
 *   - Toda pregunta abierta nueva nace con status "abierta".
 *   - El autor de interpretaciones e hipótesis es siempre humano (nunca vacío).
 *   - Ninguna interpretación puede existir sin evidencias referenciadas.
 *   - Una hipótesis nunca se convierte automáticamente en interpretación.
 *   - Toda sustitución conserva trazabilidad mediante supersededById / resolvedById.
 *   - Ninguna función genera contenido automático.
 */

import type {
  PerfilLocalDeSalud,
  HealthProfileInterpretation,
  HealthProfileHypothesis,
  HealthProfileOpenQuestion,
  ProfileSpace,
  InterpretationCerteza,
  HypothesisPlausibilidad,
  OpenQuestionUrgencia,
} from "../../domain/health-profile";
import type { MunicipalityId } from "../../domain/municipality";

// ── Helpers internos ──────────────────────────────────────────────────────────

function requireFound<T extends { id: string }>(
  items: T[],
  id: string,
  typeName: string
): T {
  const found = items.find(item => item.id === id);
  if (!found) throw new Error(`${typeName} con id "${id}" no existe en el Perfil.`);
  return found;
}

// ── createPerfilLocalDeSalud ──────────────────────────────────────────────────

export function createPerfilLocalDeSalud(
  municipalityId: MunicipalityId
): PerfilLocalDeSalud {
  const now = new Date().toISOString();
  return {
    id:                crypto.randomUUID(),
    municipalityId,
    interpretaciones:  [],
    hipotesis:         [],
    preguntasAbiertas: [],
    createdAt:         now,
    updatedAt:         now,
  };
}

// ── addInterpretation ─────────────────────────────────────────────────────────
// Invariante: toda interpretación debe referenciar al menos una Evidencia.
// Fundamento — Modelo Conceptual: "Toda Interpretación tiene al menos
// una Evidencia de sustento."

export interface AddInterpretationInput {
  espacio:       ProfileSpace;
  enunciado:     string;
  certeza:       InterpretationCerteza;
  evidenciaIds:  string[];
  razonamiento?: string;
  autorNombre:   string;
}

export function addInterpretation(
  perfil: PerfilLocalDeSalud,
  input: AddInterpretationInput
): PerfilLocalDeSalud {
  if (input.evidenciaIds.length === 0) {
    throw new Error(
      "Una Interpretación debe referenciar al menos una Evidencia. " +
      "Invariante del Modelo Conceptual: ninguna interpretación puede existir sin evidencias."
    );
  }
  const now = new Date().toISOString();
  const nueva: HealthProfileInterpretation = {
    id:             crypto.randomUUID(),
    municipalityId: perfil.municipalityId,
    espacio:        input.espacio,
    enunciado:      input.enunciado,
    certeza:        input.certeza,
    evidenciaIds:   [...input.evidenciaIds],
    razonamiento:   input.razonamiento,
    autorNombre:    input.autorNombre,
    formuladaEn:    now,
    status:         "activa",
  };
  return {
    ...perfil,
    interpretaciones: [...perfil.interpretaciones, nueva],
    updatedAt:        now,
  };
}

// ── updateInterpretation ──────────────────────────────────────────────────────
// Actualiza campos de refinamiento de una interpretación existente (certeza,
// razonamiento, evidenciaIds) sin crear una nueva versión.
// Para cambiar el enunciado (la afirmación en sí) usar supersedeInterpretation.

export interface UpdateInterpretationInput {
  certeza?:      InterpretationCerteza;
  razonamiento?: string;
  evidenciaIds?: string[];
}

export function updateInterpretation(
  perfil: PerfilLocalDeSalud,
  id: string,
  changes: UpdateInterpretationInput
): PerfilLocalDeSalud {
  requireFound(perfil.interpretaciones, id, "Interpretación");
  if (changes.evidenciaIds !== undefined && changes.evidenciaIds.length === 0) {
    throw new Error(
      "No se puede dejar una Interpretación sin evidencias. " +
      "Invariante del Modelo Conceptual."
    );
  }
  const now = new Date().toISOString();
  return {
    ...perfil,
    interpretaciones: perfil.interpretaciones.map(interp =>
      interp.id !== id ? interp : {
        ...interp,
        certeza:      changes.certeza      ?? interp.certeza,
        razonamiento: changes.razonamiento ?? interp.razonamiento,
        evidenciaIds: changes.evidenciaIds !== undefined
          ? [...changes.evidenciaIds]
          : interp.evidenciaIds,
      }
    ),
    updatedAt: now,
  };
}

// ── supersedeInterpretation ───────────────────────────────────────────────────
// Crea una nueva interpretación que reemplaza a una existente.
// La interpretación sustituida permanece con status="superada" y trazabilidad
// completa al sucesor mediante supersededById.

export function supersedeInterpretation(
  perfil: PerfilLocalDeSalud,
  idToSupersede: string,
  newInput: AddInterpretationInput
): PerfilLocalDeSalud {
  requireFound(perfil.interpretaciones, idToSupersede, "Interpretación");
  if (newInput.evidenciaIds.length === 0) {
    throw new Error(
      "La nueva interpretación debe referenciar al menos una Evidencia."
    );
  }
  const now = new Date().toISOString();
  const newId = crypto.randomUUID();
  const nueva: HealthProfileInterpretation = {
    id:             newId,
    municipalityId: perfil.municipalityId,
    espacio:        newInput.espacio,
    enunciado:      newInput.enunciado,
    certeza:        newInput.certeza,
    evidenciaIds:   [...newInput.evidenciaIds],
    razonamiento:   newInput.razonamiento,
    autorNombre:    newInput.autorNombre,
    formuladaEn:    now,
    status:         "activa",
  };
  return {
    ...perfil,
    interpretaciones: [
      ...perfil.interpretaciones.map(interp =>
        interp.id !== idToSupersede ? interp : {
          ...interp,
          status:          "superada" as const,
          supersededById:  newId,
        }
      ),
      nueva,
    ],
    updatedAt: now,
  };
}

// ── addHypothesis ─────────────────────────────────────────────────────────────

export interface AddHypothesisInput {
  espacio:              ProfileSpace;
  enunciado:            string;
  plausibilidad:        HypothesisPlausibilidad;
  indicios:             string[];
  preguntasResolutoras: string[];
  autorNombre:          string;
}

export function addHypothesis(
  perfil: PerfilLocalDeSalud,
  input: AddHypothesisInput
): PerfilLocalDeSalud {
  const now = new Date().toISOString();
  const nueva: HealthProfileHypothesis = {
    id:                   crypto.randomUUID(),
    municipalityId:       perfil.municipalityId,
    espacio:              input.espacio,
    enunciado:            input.enunciado,
    plausibilidad:        input.plausibilidad,
    indicios:             [...input.indicios],
    preguntasResolutoras: [...input.preguntasResolutoras],
    autorNombre:          input.autorNombre,
    formuladaEn:          now,
    status:               "activa",
  };
  return {
    ...perfil,
    hipotesis:  [...perfil.hipotesis, nueva],
    updatedAt:  now,
  };
}

// ── updateHypothesis ──────────────────────────────────────────────────────────
// Actualiza campos de una hipótesis activa. Las hipótesis son más provisionales
// que las interpretaciones: se permite actualizar también el enunciado.

export interface UpdateHypothesisInput {
  enunciado?:            string;
  plausibilidad?:        HypothesisPlausibilidad;
  indicios?:             string[];
  preguntasResolutoras?: string[];
}

export function updateHypothesis(
  perfil: PerfilLocalDeSalud,
  id: string,
  changes: UpdateHypothesisInput
): PerfilLocalDeSalud {
  requireFound(perfil.hipotesis, id, "Hipótesis");
  const now = new Date().toISOString();
  return {
    ...perfil,
    hipotesis: perfil.hipotesis.map(hip =>
      hip.id !== id ? hip : {
        ...hip,
        enunciado:            changes.enunciado            ?? hip.enunciado,
        plausibilidad:        changes.plausibilidad        ?? hip.plausibilidad,
        indicios:             changes.indicios !== undefined
          ? [...changes.indicios]
          : hip.indicios,
        preguntasResolutoras: changes.preguntasResolutoras !== undefined
          ? [...changes.preguntasResolutoras]
          : hip.preguntasResolutoras,
      }
    ),
    updatedAt: now,
  };
}

// ── resolveHypothesisAsInterpretation ─────────────────────────────────────────
// Resuelve una hipótesis creando la Interpretación que la confirma.
// La hipótesis original no se modifica en su contenido: solo cambia su status
// y adquiere resolvedById apuntando a la nueva interpretación.
// Fundamento — Modelo Conceptual: "una hipótesis nunca se convierte
// automáticamente en interpretación". Este acto es explícito y deliberado.

export function resolveHypothesisAsInterpretation(
  perfil: PerfilLocalDeSalud,
  hypothesisId: string,
  interpretationInput: AddInterpretationInput
): PerfilLocalDeSalud {
  requireFound(perfil.hipotesis, hypothesisId, "Hipótesis");
  if (interpretationInput.evidenciaIds.length === 0) {
    throw new Error(
      "La interpretación resultante de la resolución debe referenciar al menos una Evidencia."
    );
  }
  const now = new Date().toISOString();
  const newInterpId = crypto.randomUUID();
  const nuevaInterp: HealthProfileInterpretation = {
    id:             newInterpId,
    municipalityId: perfil.municipalityId,
    espacio:        interpretationInput.espacio,
    enunciado:      interpretationInput.enunciado,
    certeza:        interpretationInput.certeza,
    evidenciaIds:   [...interpretationInput.evidenciaIds],
    razonamiento:   interpretationInput.razonamiento,
    autorNombre:    interpretationInput.autorNombre,
    formuladaEn:    now,
    status:         "activa",
  };
  return {
    ...perfil,
    interpretaciones: [...perfil.interpretaciones, nuevaInterp],
    hipotesis: perfil.hipotesis.map(hip =>
      hip.id !== hypothesisId ? hip : {
        ...hip,
        status:      "resuelta-como-interpretacion" as const,
        resolvedById: newInterpId,
      }
    ),
    updatedAt: now,
  };
}

// ── discardHypothesis ─────────────────────────────────────────────────────────
// Descarta una hipótesis conservando su contenido íntegro.
// La hipótesis permanece en el array con status="descartada" y el motivo.

export function discardHypothesis(
  perfil: PerfilLocalDeSalud,
  id: string,
  motivo: string
): PerfilLocalDeSalud {
  requireFound(perfil.hipotesis, id, "Hipótesis");
  const now = new Date().toISOString();
  return {
    ...perfil,
    hipotesis: perfil.hipotesis.map(hip =>
      hip.id !== id ? hip : {
        ...hip,
        status:           "descartada" as const,
        discardedMotivo:  motivo,
      }
    ),
    updatedAt: now,
  };
}

// ── addOpenQuestion ───────────────────────────────────────────────────────────

export interface AddOpenQuestionInput {
  espacio:        ProfileSpace;
  formulacion:    string;
  relevancia:     string;
  urgencia:       OpenQuestionUrgencia;
  viasResolucion: string[];
}

export function addOpenQuestion(
  perfil: PerfilLocalDeSalud,
  input: AddOpenQuestionInput
): PerfilLocalDeSalud {
  const now = new Date().toISOString();
  const nueva: HealthProfileOpenQuestion = {
    id:             crypto.randomUUID(),
    municipalityId: perfil.municipalityId,
    espacio:        input.espacio,
    formulacion:    input.formulacion,
    relevancia:     input.relevancia,
    urgencia:       input.urgencia,
    viasResolucion: [...input.viasResolucion],
    creadaEn:       now,
    status:         "abierta",
  };
  return {
    ...perfil,
    preguntasAbiertas: [...perfil.preguntasAbiertas, nueva],
    updatedAt:         now,
  };
}

// ── updateOpenQuestion ────────────────────────────────────────────────────────

export interface UpdateOpenQuestionInput {
  formulacion?:    string;
  relevancia?:     string;
  urgencia?:       OpenQuestionUrgencia;
  viasResolucion?: string[];
}

export function updateOpenQuestion(
  perfil: PerfilLocalDeSalud,
  id: string,
  changes: UpdateOpenQuestionInput
): PerfilLocalDeSalud {
  requireFound(perfil.preguntasAbiertas, id, "Pregunta Abierta");
  const now = new Date().toISOString();
  return {
    ...perfil,
    preguntasAbiertas: perfil.preguntasAbiertas.map(pq =>
      pq.id !== id ? pq : {
        ...pq,
        formulacion:    changes.formulacion    ?? pq.formulacion,
        relevancia:     changes.relevancia     ?? pq.relevancia,
        urgencia:       changes.urgencia       ?? pq.urgencia,
        viasResolucion: changes.viasResolucion !== undefined
          ? [...changes.viasResolucion]
          : pq.viasResolucion,
      }
    ),
    updatedAt: now,
  };
}

// ── resolveOpenQuestion ───────────────────────────────────────────────────────
// Marca una pregunta como resuelta. La pregunta permanece en el array con
// status="resuelta" y la nota de resolución. Nunca desaparece.

export function resolveOpenQuestion(
  perfil: PerfilLocalDeSalud,
  id: string,
  resolucionNota: string
): PerfilLocalDeSalud {
  requireFound(perfil.preguntasAbiertas, id, "Pregunta Abierta");
  const now = new Date().toISOString();
  return {
    ...perfil,
    preguntasAbiertas: perfil.preguntasAbiertas.map(pq =>
      pq.id !== id ? pq : {
        ...pq,
        status:         "resuelta" as const,
        resolucionNota,
      }
    ),
    updatedAt: now,
  };
}

// ── updateSynthesis ───────────────────────────────────────────────────────────
// Almacena la síntesis interpretativa elaborada por el técnico.
// No genera contenido: solo guarda el texto que el profesional ha escrito.

export function updateSynthesis(
  perfil: PerfilLocalDeSalud,
  texto: string
): PerfilLocalDeSalud {
  return {
    ...perfil,
    sintesisTexto: texto,
    updatedAt:     new Date().toISOString(),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// ESTADO DEL CONOCIMIENTO — computePerfilEstadoGlobal
//
// Cálculo derivado, puro y no persistido del estado del Perfil.
//
// El Estado del Conocimiento:
//   - describe el estado del Perfil;
//   - no interpreta el municipio;
//   - no valora prioridades;
//   - no genera hipótesis ni conclusiones;
//   - no corrige automáticamente;
//   - no modifica el Perfil.
// ─────────────────────────────────────────────────────────────────────────────

// ── Tipos del Estado del Conocimiento ────────────────────────────────────────

/** Grado de cobertura de un espacio funcional. Solo criterios estructurales. */
export type PerfilSpaceCoverage =
  | "vacio"               // sin ningún contenido
  | "iniciado"            // tiene hipótesis o preguntas pero ninguna interpretación activa
  | "pendiente-revision"  // tiene interpretaciones activas pero todas con certeza="provisional"
  | "desarrollado";       // tiene al menos una interpretación activa con certeza alta o moderada

/** Tipos de alerta estructural. No reflejan calidad sustantiva del diagnóstico. */
export type PerfilAlertaTipo =
  | "interpretacion-sin-evidencias"       // interpretación activa sin evidenciaIds
  | "hipotesis-sin-indicios"              // hipótesis activa sin indicios
  | "pregunta-alta-urgencia-sin-via"      // pregunta urgencia=alta sin viasResolucion
  | "sintesis-ausente"                    // no hay síntesis y hay interpretaciones activas
  | "sintesis-con-preguntas-criticas"     // hay síntesis pero también preguntas urgencia=alta abiertas
  | "elemento-superado-sin-trazabilidad"; // interpretación superada sin supersededById

export interface PerfilAlertaMetodologica {
  tipo:         PerfilAlertaTipo;
  elementoId?:  string;        // ID del elemento que genera la alerta
  espacio?:     ProfileSpace;  // espacio funcional del elemento, si aplica
  descripcion:  string;
}

export interface PerfilSpaceEstado {
  espacio:                 ProfileSpace;
  interpretacionesActivas: number;
  hipotesisActivas:        number;
  preguntasAbiertas:       number;
  cobertura:               PerfilSpaceCoverage;
  alertas:                 PerfilAlertaMetodologica[];
}

export interface PerfilEstadoGlobal {
  // Conteos globales
  interpretacionesActivas:   number;
  interpretacionesSuperadas: number;
  hipotesisActivas:          number;
  hipotesisResueltas:        number;
  hipotesisDescartadas:      number;
  preguntasAbiertas:         number;
  preguntasResueltas:        number;
  // Estado de la síntesis
  tieneSintesis:             boolean;
  // Metadatos
  ultimaActualizacion:       string;
  // Descomposición por espacio
  espacios:                  PerfilSpaceEstado[];
  // Alertas estructurales que afectan al perfil global
  alertasGlobales:           PerfilAlertaMetodologica[];
}

// ── Constantes internas ───────────────────────────────────────────────────────

const ALL_PROFILE_SPACES: ProfileSpace[] = [
  "contexto-territorial",
  "situacion-salud",
  "determinantes",
  "desigualdades",
  "activos",
  "sintesis",
  "preguntas-abiertas",
  "preparacion-deliberativa",
];

// ── Helpers internos ──────────────────────────────────────────────────────────

function trunc(text: string, max = 60): string {
  return text.length > max ? `${text.slice(0, max)}…` : text;
}

function computeSpaceCoverage(
  interpActivas: HealthProfileInterpretation[],
  hipotesisActivas: number,
  preguntasAbiertas: number
): PerfilSpaceCoverage {
  const total = interpActivas.length + hipotesisActivas + preguntasAbiertas;
  if (total === 0) return "vacio";
  if (interpActivas.length === 0) return "iniciado";
  const todasProvisionales = interpActivas.every(i => i.certeza === "provisional");
  return todasProvisionales ? "pendiente-revision" : "desarrollado";
}

// ── computePerfilEstadoGlobal ─────────────────────────────────────────────────

export function computePerfilEstadoGlobal(
  perfil: PerfilLocalDeSalud
): PerfilEstadoGlobal {

  // ── Conteos globales ──────────────────────────────────────────────────────
  const interpretacionesActivas   = perfil.interpretaciones.filter(i => i.status === "activa").length;
  const interpretacionesSuperadas = perfil.interpretaciones.filter(i => i.status === "superada").length;
  const hipotesisActivas          = perfil.hipotesis.filter(h => h.status === "activa").length;
  const hipotesisResueltas        = perfil.hipotesis.filter(h => h.status === "resuelta-como-interpretacion").length;
  const hipotesisDescartadas      = perfil.hipotesis.filter(h => h.status === "descartada").length;
  const preguntasAbiertas         = perfil.preguntasAbiertas.filter(pq => pq.status === "abierta").length;
  const preguntasResueltas        = perfil.preguntasAbiertas.filter(pq => pq.status === "resuelta").length;

  // ── Estado por espacio ────────────────────────────────────────────────────
  const espacios: PerfilSpaceEstado[] = ALL_PROFILE_SPACES.map(espacio => {
    const interpActivasEnEspacio = perfil.interpretaciones.filter(
      i => i.espacio === espacio && i.status === "activa"
    );
    const hipActivasEnEspacio = perfil.hipotesis.filter(
      h => h.espacio === espacio && h.status === "activa"
    );
    const pqAbiertasEnEspacio = perfil.preguntasAbiertas.filter(
      pq => pq.espacio === espacio && pq.status === "abierta"
    );

    const cobertura = computeSpaceCoverage(
      interpActivasEnEspacio,
      hipActivasEnEspacio.length,
      pqAbiertasEnEspacio.length
    );

    const alertas: PerfilAlertaMetodologica[] = [];

    for (const interp of interpActivasEnEspacio) {
      if (interp.evidenciaIds.length === 0) {
        alertas.push({
          tipo:        "interpretacion-sin-evidencias",
          elementoId:  interp.id,
          espacio,
          descripcion: `Interpretación sin evidencias referenciadas: "${trunc(interp.enunciado)}".`,
        });
      }
    }

    for (const hip of hipActivasEnEspacio) {
      if (hip.indicios.length === 0) {
        alertas.push({
          tipo:        "hipotesis-sin-indicios",
          elementoId:  hip.id,
          espacio,
          descripcion: `Hipótesis sin indicios de sustento: "${trunc(hip.enunciado)}".`,
        });
      }
    }

    for (const pq of pqAbiertasEnEspacio) {
      if (pq.urgencia === "alta" && pq.viasResolucion.length === 0) {
        alertas.push({
          tipo:        "pregunta-alta-urgencia-sin-via",
          elementoId:  pq.id,
          espacio,
          descripcion: `Pregunta de alta urgencia sin vía de resolución: "${trunc(pq.formulacion)}".`,
        });
      }
    }

    return {
      espacio,
      interpretacionesActivas:  interpActivasEnEspacio.length,
      hipotesisActivas:         hipActivasEnEspacio.length,
      preguntasAbiertas:        pqAbiertasEnEspacio.length,
      cobertura,
      alertas,
    };
  });

  // ── Alertas globales ──────────────────────────────────────────────────────
  const alertasGlobales: PerfilAlertaMetodologica[] = [];

  if (!perfil.sintesisTexto && interpretacionesActivas > 0) {
    alertasGlobales.push({
      tipo:        "sintesis-ausente",
      descripcion: `El perfil tiene ${interpretacionesActivas} interpretación(es) activa(s) pero no tiene síntesis.`,
    });
  }

  if (perfil.sintesisTexto) {
    const criticas = perfil.preguntasAbiertas.filter(
      pq => pq.urgencia === "alta" && pq.status === "abierta"
    );
    if (criticas.length > 0) {
      alertasGlobales.push({
        tipo:        "sintesis-con-preguntas-criticas",
        descripcion: `La síntesis coexiste con ${criticas.length} pregunta(s) abierta(s) de alta urgencia.`,
      });
    }
  }

  for (const interp of perfil.interpretaciones.filter(i => i.status === "superada")) {
    if (!interp.supersededById) {
      alertasGlobales.push({
        tipo:        "elemento-superado-sin-trazabilidad",
        elementoId:  interp.id,
        descripcion: `Interpretación superada sin trazabilidad (supersededById ausente): "${trunc(interp.enunciado)}".`,
      });
    }
  }

  return {
    interpretacionesActivas,
    interpretacionesSuperadas,
    hipotesisActivas,
    hipotesisResueltas,
    hipotesisDescartadas,
    preguntasAbiertas,
    preguntasResueltas,
    tieneSintesis:       !!perfil.sintesisTexto,
    ultimaActualizacion: perfil.updatedAt,
    espacios,
    alertasGlobales,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// ESTADO DEL CONOCIMIENTO — computeEstadoDelConocimiento
//
// Cálculo de nivel superior construido sobre computePerfilEstadoGlobal().
// No duplica lógica: delega el cálculo estructural íntegramente en esa función
// y añade sobre su resultado:
//   - Nivel de estado global (PerfilEstadoNivel).
//   - Criterios de cobertura mínima explícitos y consumibles por React.
//
// Invariantes: no modifica el perfil; no interpreta el municipio;
// determinista e inmutable.
// ─────────────────────────────────────────────────────────────────────────────

/** Estado global del Perfil — derivado exclusivamente de criterios estructurales. */
export type PerfilEstadoNivel =
  | "vacio"                     // sin ningún contenido registrado
  | "en-construccion"           // tiene contenido pero no cumple la cobertura mínima
  | "cobertura-minima"          // cumple todos los criterios mínimos; puede tener alertas globales
  | "estructuralmente-completo"; // cobertura mínima + sin alertas globales

/** Criterio estructural evaluado — id estable, consumible como key en React. */
export interface CriterioEstructural {
  id:          string;
  descripcion: string;
  cumplido:    boolean;
}

/** Estado del Conocimiento: cálculo estructural completo del Perfil Local de Salud. */
export interface EstadoDelConocimiento {
  /** Resultado de computePerfilEstadoGlobal() reutilizado sin duplicar lógica. */
  base:                    PerfilEstadoGlobal;
  /** Nivel de estado global derivado de reglas estructurales puras. */
  nivelEstado:             PerfilEstadoNivel;
  /** Criterios de cobertura mínima: cumplidos y pendientes. */
  criteriosCobertura:      CriterioEstructural[];
  /** true cuando todos los criterios de cobertura mínima están cumplidos. */
  coberturaMinimaCumplida: boolean;
}

// ── computeEstadoDelConocimiento ──────────────────────────────────────────────

export function computeEstadoDelConocimiento(
  perfil: PerfilLocalDeSalud
): EstadoDelConocimiento {

  const base = computePerfilEstadoGlobal(perfil);

  // ── Criterios de cobertura mínima ─────────────────────────────────────────
  const criteriosCobertura: CriterioEstructural[] = [
    {
      id:          "tiene-interpretacion-activa",
      descripcion: "Existe al menos una interpretación activa en el Perfil.",
      cumplido:    base.interpretacionesActivas > 0,
    },
    {
      id:          "tiene-sintesis",
      descripcion: "El Perfil dispone de una síntesis narrativa elaborada por el técnico.",
      cumplido:    base.tieneSintesis,
    },
    {
      id:          "tiene-espacio-desarrollado",
      descripcion: "Al menos un espacio funcional tiene cobertura 'desarrollado'.",
      cumplido:    base.espacios.some(s => s.cobertura === "desarrollado"),
    },
  ];

  const coberturaMinimaCumplida = criteriosCobertura.every(c => c.cumplido);

  // ── Nivel de estado global ────────────────────────────────────────────────
  const hayContenido =
    base.interpretacionesActivas > 0 ||
    base.hipotesisActivas        > 0 ||
    base.preguntasAbiertas       > 0;

  let nivelEstado: PerfilEstadoNivel;
  if (!hayContenido) {
    nivelEstado = "vacio";
  } else if (!coberturaMinimaCumplida) {
    nivelEstado = "en-construccion";
  } else if (base.alertasGlobales.length > 0) {
    nivelEstado = "cobertura-minima";
  } else {
    nivelEstado = "estructuralmente-completo";
  }

  return { base, nivelEstado, criteriosCobertura, coberturaMinimaCumplida };
}

// ── Métricas epistémicas del Perfil ───────────────────────────────────────────
// Proyección compacta y estable del estado del conocimiento, pensada para
// contadores e indicadores de proceso (KPI). No introduce semántica nueva:
// reutiliza computePerfilEstadoGlobal / computeEstadoDelConocimiento y solo
// selecciona. Sin narrativa institucional y sin recomendaciones.

export interface PerfilEpistemicMetrics {
  /** Interpretaciones activas (lecturas afirmadas por el técnico). */
  interpretaciones:          number;
  interpretacionesSuperadas: number;
  /** Hipótesis en estudio (status "activa"). */
  hipotesisAbiertas:         number;
  hipotesisResueltas:        number;
  hipotesisDescartadas:      number;
  preguntasAbiertas:         number;
  preguntasResueltas:        number;
  tieneSintesis:             boolean;
  /** Estado general EKC-compatible (computeEstadoDelConocimiento). */
  nivelEstado:               PerfilEstadoNivel;
  coberturaMinimaCumplida:   boolean;
}

export function computePerfilEpistemicMetrics(
  perfil: PerfilLocalDeSalud
): PerfilEpistemicMetrics {
  const ekc = computeEstadoDelConocimiento(perfil);
  const base = ekc.base;
  return {
    interpretaciones:          base.interpretacionesActivas,
    interpretacionesSuperadas: base.interpretacionesSuperadas,
    hipotesisAbiertas:         base.hipotesisActivas,
    hipotesisResueltas:        base.hipotesisResueltas,
    hipotesisDescartadas:      base.hipotesisDescartadas,
    preguntasAbiertas:         base.preguntasAbiertas,
    preguntasResueltas:        base.preguntasResueltas,
    tieneSintesis:             base.tieneSintesis,
    nivelEstado:               ekc.nivelEstado,
    coberturaMinimaCumplida:   ekc.coberturaMinimaCumplida,
  };
}
