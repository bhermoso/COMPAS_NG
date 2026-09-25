import type { MunicipalityId } from "../municipality";

// ── Tipo de tensión estratégica ───────────────────────────────────────────────
// "evidencia" — derivada de conflictos o tensiones ya identificados en el PSL
// "marco"     — detectada en divergencias entre instrumentos estratégicos
//               para el mismo ámbito del escenario

export type TipoTensionEstrategica = "evidencia" | "marco";

// ── Nivel estructural del elemento institucional referenciado ─────────────────

export type NivelEstrategico =
  | "linea"
  | "objetivo"
  | "programa"
  | "eje"
  | "accion";

// ── TensionEstrategica ────────────────────────────────────────────────────────
// Fricción identificada en el escenario que requiere deliberación humana.
// El sistema identifica tensiones; nunca las resuelve (I-SC-4).

export interface TensionEstrategica {
  tipo: TipoTensionEstrategica;
  descripcion: string;
  origenPSL?: string;         // ID del PSLConflicto o PSLTension de origen, si aplica
  requiereDeliberacion: true; // invariante: siempre true; no puede cambiar de valor
}

// ── ReferenciaInstitucional ───────────────────────────────────────────────────
// Correspondencia entre el contenido de un escenario y un elemento verificable
// del conocimiento estratégico institucional disponible.
// Apunta al elemento y lo cita; no añade interpretación (I-SC-3).

export interface ReferenciaInstitucional {
  marcoId: string;       // ID del marco (p. ej. "EPVSA", "ESCA", "MAYORES")
  elementoId: string;    // ID único del elemento dentro del marco
  elementoLabel: string; // etiqueta del elemento tal como está en la fuente
  nivel: NivelEstrategico;
  sourceTrace: string;   // cita completa y verificable del documento fuente
}

// ── EscenarioEstrategico ──────────────────────────────────────────────────────
// Entidad canónica del dominio COMPÁS NG (CONTRACT-STRATEGIC-SCENARIO v1.0).
//
// Representa la forma explícita de una coherencia estratégica identificada
// en la intersección del diagnóstico territorial certificado y el conocimiento
// estratégico institucional disponible.
//
// Principio de Objetividad: el escenario no interpreta, no valora, no decide.
// Hace explícito el conocimiento que ya existe latente en el diagnóstico.

export interface EscenarioEstrategico {
  id: string;

  // Etiqueta derivada de los títulos de areasOrigen tal como están en el PSL.
  // Una área: su título exacto. Varias áreas: títulos separados por " · ".
  // Nunca sintetizado ni generado de forma autónoma (I-SC-2).
  tema: string;

  areasOrigen: string[];      // IDs de PSLAreaIntervencion que componen el escenario
  evidenciaOrigen: string[];  // IDs de EvidenceAtom de las áreas de origen (trazabilidad)

  // Cautelas metodológicas heredadas de PSLAreaIntervencion.cautions.
  // Reorganización del PSL; el escenario no genera cautelas propias.
  cautelasOriginales: string[];

  // IDs de EvidenceAtom de kind "asset" presentes en evidenciaOrigen.
  // Vacío en la primera implementación (limitación MTE-L2 — requiere EvidenceStore).
  activosRelacionados: string[];

  // Correspondencias con el conocimiento estratégico institucional disponible.
  // Vacío cuando sinCoberturaMarcal es true.
  referenciasInstitucionales: ReferenciaInstitucional[];

  tensiones: TensionEstrategica[];

  // true cuando referenciasInstitucionales está vacío (I-SC-7).
  // Señal al Producto 6: no existe instrumento institucional disponible
  // para este escenario en el conocimiento estratégico consultado.
  sinCoberturaMarcal: boolean;
}

// ── VacioInstitucional ────────────────────────────────────────────────────────
// Área del PSL para la que no fue posible construir ningún escenario.
// Presente en sinCobertura del artefacto raíz.

export interface VacioInstitucional {
  areaId: string;    // ID de la PSLAreaIntervencion del PSL
  areaTitle: string; // título del área tal como está en el PSL
  nota: string;      // explicación de por qué no se construyó escenario
}

// ── MetodologiaMTE ────────────────────────────────────────────────────────────
// Trazabilidad del proceso de identificación y explicitación de escenarios.
// Documenta qué conocimiento estratégico se consultó y cómo operó el motor.

export interface MetodologiaMTE {
  instrumentosConsultados: string[];      // IDs de los marcos estratégicos consultados
  criterioDeAgrupacion: string;           // criterio por el que áreas forman un escenario
  mecanismoDeCorrespondencia: string;     // cómo se identificaron las referencias institucionales
  versionConocimientoEstrategico: string; // versión del conocimiento estratégico consultado
}

// ── LecturaEstrategicaLocal ───────────────────────────────────────────────────
// Artefacto raíz del Producto 5 — Motor de Traducción Estratégica.
// Producido por el MTE desde un LocalHealthProfile validado.
// Consumido por los Productos 6, 7, 8 y 9.
//
// Hace explícitas las coherencias estratégicas latentes en la intersección
// del diagnóstico territorial certificado y el conocimiento estratégico
// institucional disponible. No interpreta: organiza en clave estratégica.

export interface LecturaEstrategicaLocal {

  // ── Identidad y trazabilidad ─────────────────────────────────────────────
  id: string;
  municipalityId: MunicipalityId;
  generatedAt: string;             // ISO timestamp
  sourcePSLId: string;
  sourcePSLVersion: string;
  knowledgeBaseVersion: string;    // versión del conocimiento estratégico consultado

  // true cuando el PSL tenía áreas de intervención procesables (G-MTE-2).
  // false indica que el artefacto es válido pero sin contenido traducible.
  hasTranslatableContent: boolean;

  // ── Contenido ─────────────────────────────────────────────────────────────
  escenarios: EscenarioEstrategico[];  // vacío cuando hasTranslatableContent es false
  sinCobertura: VacioInstitucional[];  // áreas sin escenario posible

  // Cuatro cautelas invariables del motor (CONTRACT-MTE §6.4).
  cautelas: string[];

  metodologia: MetodologiaMTE;

  // ── Invariante de validación humana ──────────────────────────────────────
  requiresHumanValidation: true;
}
