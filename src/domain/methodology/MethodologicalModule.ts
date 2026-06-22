// Dominio: Biblioteca Metodológica Canónica
// Fuente de verdad para todos los módulos metodológicos del sistema.
// Los adaptadores (REDCap, SAV, parsers, motores, IA) derivan de esta definición.

// ─── Identidad y ciclo de vida ────────────────────────────────────────────────

export type ModuleId = string;

export type ModuleStatus = "draft" | "validated" | "deprecated";

export type ModuleCategory =
  | "eas-sociodemographic"       // variables de clasificación sociodemográfica de la EAS
  | "eas-official-block"         // bloque oficial completo de la VI Encuesta Andaluza de Salud
  | "validated-scale"            // escala psicométrica con validación publicada
  | "municipal-module"           // módulo propio de proyecto o municipio
  | "external-official-module"   // módulo externo excepcional (INE, IECA, CIS) con justificación
  | "custom";                    // uso específico no encuadrable en las anteriores

export interface ModuleIdentity {
  id: ModuleId;
  version: string;           // semver — "1.0.0"
  status: ModuleStatus;
  category: ModuleCategory;
  name: string;
  shortName: string;
  description: string;
  purpose: string;           // qué dimensión de salud o realidad mide
  targetPopulation?: string;
  createdAt: string;         // ISO — fecha de formalización de esta versión
}

// ─── Fuente y autoridad ───────────────────────────────────────────────────────

export interface MethodologicalSource {
  authors: string;
  year?: number;
  title?: string;
  source?: string;           // revista, libro, organismo
  doi?: string;
  url?: string;
  accessDate?: string;
  institutionalBody?: string;
  notes?: string;
}

// ─── Ítems ────────────────────────────────────────────────────────────────────

export type ResponseType =
  | "likert"
  | "binary"
  | "categorical"
  | "numeric"
  | "text";

export interface ResponseOption {
  value: number | string;
  label: string;
}

export interface RedcapFormField {
  fieldName: string;
  formName?: string;
  fieldType?: string;
  fieldLabel?: string;
  fieldNote?: string;
  choicesOrCalculations?: string;
  validationType?: string;
  validationMin?: string;
  validationMax?: string;
  identifier?: boolean;
  branchingLogic?: string;
  required?: boolean;
  customAlignment?: string;
  questionNumber?: string;
  matrixGroupName?: string;
  matrixRanking?: boolean;
  fieldAnnotation?: string;
}

export interface Item {
  id: string;
  text: string;
  dimensionId: string;
  responseType: ResponseType;
  responseOptions?: ResponseOption[];
  reverseScored?: boolean;
  redcapFormField?: RedcapFormField;
  notes?: string;
}

// ─── Dimensiones ─────────────────────────────────────────────────────────────

export interface Dimension {
  id: string;
  name: string;
  description?: string;
  itemIds: string[];         // ítems que componen la dimensión
  outputField: string;       // nombre canónico del campo producido ("meanFactorVinculo")
  isComposite?: boolean;     // true para índices calculados sobre otras dimensiones
}

// ─── Algoritmo ────────────────────────────────────────────────────────────────

export type AlgorithmType =
  | "item-mean"
  | "item-weighted-mean"
  | "item-sum"
  | "factor-mean"
  | "distribution"
  | "irt"
  | "custom";

export type InputLevel =
  | "individual-responses"   // entrada canónica: una fila por participante, respuestas crudas
  | "pre-aggregated"         // valores calculados por fuente externa (ej. REDCap) por participante
  | "aggregated-counts";     // conteos o frecuencias ya agregados

export interface AlgorithmStep {
  order: number;
  description: string;
}

export interface Algorithm {
  type: AlgorithmType;
  inputLevel: InputLevel;    // nivel de entrada del algoritmo canónico
  steps: AlgorithmStep[];
  aggregationLevel: "municipal" | "group" | "individual";
  completionCriteria?: string;
  notes?: string;            // limitaciones de la implementación actual respecto al canónico
}

// ─── Interpretación ───────────────────────────────────────────────────────────

export interface ScaleDefinition {
  min: number;
  max: number;
  direction: "higher-is-better" | "lower-is-better" | "neutral";
}

export interface InterpretationThreshold {
  min: number;
  max: number;
  label: string;
  description?: string;
}

export interface ReferenceValues {
  population: string;
  mean?: number;
  sd?: number;
  source: string;
}

export interface Interpretation {
  scale: ScaleDefinition;
  thresholds?: InterpretationThreshold[];
  referenceValues?: ReferenceValues;
  contextualNotes: string[];
}

// ─── Bibliografía ─────────────────────────────────────────────────────────────

export interface BibliographicReference {
  authors: string;
  year?: number;
  title?: string;
  source?: string;
  doi?: string;
  url?: string;
  notes?: string;
}

// ─── Adaptadores externos ─────────────────────────────────────────────────────
// Cada adaptador describe cómo un sistema externo se mapea a la definición canónica.
// Son optativos: el módulo existe sin ellos.

export interface RedcapColumnMapping {
  outputField: string;       // campo canónico del módulo
  redcapColumn: string;      // columna en la exportación REDCap
  isComputed: boolean;       // true si REDCap calcula este valor (no es respuesta directa)
  notes?: string;
}

export interface RedcapAdapter {
  instrument?: string;       // nombre del instrumento dentro del proyecto REDCap
  completedColumn: string;
  completedValue: string;
  columns: RedcapColumnMapping[];
  notes?: string;
}

export interface SavValueLabel {
  value: number;
  label: string;
}

export interface WaveCompatibility {
  since?: string;            // versión o año de introducción
  until?: string;            // versión o año de deprecación
  notes?: string;
}

export interface SavVariableMapping {
  outputField: string;       // campo canónico del módulo
  savVariable: string;       // nombre de variable en el fichero .sav
  label: string;             // etiqueta de variable SPSS
  valueLabels?: SavValueLabel[];
  missingValues?: number[];
  measurementLevel?: "nominal" | "ordinal" | "scale";
  derivation?: string;       // fórmula o descripción del cómputo
  filterCondition?: string;  // condición de filtro aplicada antes del cálculo
  waveCompatibility?: WaveCompatibility;
}

export interface SavAdapter {
  referenceFile?: string;    // fichero .sav de referencia
  variables: SavVariableMapping[];
}

export interface ModuleAdapters {
  redcap?: RedcapAdapter;
  sav?: SavAdapter;
}

// ─── Módulo Metodológico ──────────────────────────────────────────────────────

export interface MethodologicalModule {
  identity: ModuleIdentity;
  source: MethodologicalSource;
  items: Item[];
  dimensions: Dimension[];
  algorithm: Algorithm;
  interpretation: Interpretation;
  limitations: string[];
  bibliography: BibliographicReference[];
  adapters?: ModuleAdapters;
}
