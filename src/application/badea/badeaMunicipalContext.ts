/**
 * badeaMunicipalContext
 *
 * Primer contexto BADEA/IECA REAL incorporado a COMPÁS NG: consulta 19824
 * («Porcentaje de población según tipología de celda y grado de urbanización
 * por municipio», IECA, 2024), con los valores verificados en las ejecuciones
 * documentadas del piloto (2026-07-07):
 *   - Granada (capital), INE 18087: «Ciudades», 96,6 % en centros urbanos.
 *   - Atarfe, INE 18022: «Zona de densidad intermedia», 0,0 / 94,3 / 5,7 %.
 *
 * El fixture fixtures/badea-19824-contexto-municipal.json es la transcripción
 * auditable; este módulo es el contrato tipado que consumen el Perfil y la
 * UI, sincronizado por test contra el fixture. Ningún valor es inventado.
 *
 * DOCTRINA DE ESCALA (BADEA-IECA-TERRITORIAL-SCOPE-MAPPING.md):
 *   - BADEA no tiene ámbito de distrito. Granada-Zaidín NO es un municipio
 *     BADEA: todo dato BADEA asociado al distrito es contexto municipal de
 *     referencia del municipio matriz (Granada capital, 18087), etiquetado
 *     como proxy, nunca estimación distrital.
 *   - Capa NO evidencial: no crea documentos ni EvidenceAtoms (el expediente
 *     56/92 no cambia). La ingesta evidencial (cmi-indicator, pipeline del
 *     piloto) es un paso posterior con decisión expresa del responsable y
 *     deduplicación idempotente pendiente.
 *   - Sin recomendaciones, sin causalidad, sin API en runtime.
 */

// ── Modelo del indicador BADEA (Tarea 3 del encargo) ──────────────────────────

export type BadeaEscala = "municipio" | "provincia" | "andalucia" | "otra";

export type BadeaDimensionDiagnostica =
  | "contexto-sociodemografico"
  | "determinantes-sociales"
  | "desigualdades";

export interface BadeaIndicadorContexto {
  fuente: "BADEA/IECA";
  consulta: number;
  actividad: string;
  indicador: string;
  /** Valor numérico o categoría literal (grado de urbanización). */
  valor: number | string;
  unidad?: string;
  anio: string;
  territorio: string;
  codigoINE: string;
  escala: BadeaEscala;
  dimension: BadeaDimensionDiagnostica;
  cautelas: string[];
}

export interface BadeaMunicipalContext {
  /** Territorio BADEA del que proceden los datos. */
  territorio: string;
  codigoINE: string;
  anio: string;
  /**
   * true cuando el ámbito COMPÁS no es el municipio BADEA (p. ej., distrito):
   * los datos son contexto municipal de referencia del municipio matriz.
   */
  esProxyMunicipioMatriz: boolean;
  indicadores: BadeaIndicadorContexto[];
  accessedAt: string;
}

// ── Registros verificados (transcripción del fixture) ─────────────────────────

export const BADEA_CONSULTA_19824 = {
  consulta: 19824,
  actividad: "Clasificación del grado de urbanización",
  accessedAt: "2026-07-07",
} as const;

const CAUTELAS_BASE: string[] = [
  "Dato de escala municipal: no permite inferencia sobre subdivisiones internas.",
  "Describe contexto poblacional/territorial; no es un indicador de salud ni permite inferencia causal.",
  "No aporta desagregación interna por sexo, edad ni condición socioeconómica.",
];

function indicadoresGranada(): BadeaIndicadorContexto[] {
  const base = {
    fuente: "BADEA/IECA" as const,
    consulta: BADEA_CONSULTA_19824.consulta,
    actividad: BADEA_CONSULTA_19824.actividad,
    anio: "2024",
    territorio: "Granada (capital)",
    codigoINE: "18087",
    escala: "municipio" as const,
    dimension: "contexto-sociodemografico" as const,
    cautelas: CAUTELAS_BASE,
  };
  return [
    {
      ...base,
      indicador: "Grado de urbanización según tipología de celda",
      valor: "Ciudades",
    },
    {
      ...base,
      indicador: "Porcentaje de población en centros urbanos",
      valor: 96.6,
      unidad: "%",
    },
  ];
}

function indicadoresAtarfe(): BadeaIndicadorContexto[] {
  const base = {
    fuente: "BADEA/IECA" as const,
    consulta: BADEA_CONSULTA_19824.consulta,
    actividad: BADEA_CONSULTA_19824.actividad,
    anio: "2024",
    territorio: "Atarfe",
    codigoINE: "18022",
    escala: "municipio" as const,
    dimension: "contexto-sociodemografico" as const,
    cautelas: CAUTELAS_BASE,
  };
  return [
    {
      ...base,
      indicador: "Grado de urbanización según tipología de celda",
      valor: "Zona de densidad intermedia",
    },
    {
      ...base,
      indicador: "Porcentaje de población en centros urbanos",
      valor: 0.0,
      unidad: "%",
    },
    {
      ...base,
      indicador: "Porcentaje de población en agrupaciones urbanas",
      valor: 94.3,
      unidad: "%",
    },
    {
      ...base,
      indicador: "Porcentaje de población en celdas de malla rurales",
      valor: 5.7,
      unidad: "%",
    },
  ];
}

// ── Resolución por ámbito COMPÁS ──────────────────────────────────────────────
// Asociación EXPLÍCITA por id de municipio COMPÁS. Granada-Zaidín no es
// municipio BADEA: recibe el contexto de su municipio matriz como proxy.

export function getBadeaMunicipalContext(
  municipalityId: string
): BadeaMunicipalContext | undefined {
  switch (municipalityId) {
    case "granada-zaidin":
      return {
        territorio: "Granada (capital)",
        codigoINE: "18087",
        anio: "2024",
        esProxyMunicipioMatriz: true,
        indicadores: indicadoresGranada(),
        accessedAt: BADEA_CONSULTA_19824.accessedAt,
      };
    case "atarfe":
      return {
        territorio: "Atarfe",
        codigoINE: "18022",
        anio: "2024",
        esProxyMunicipioMatriz: false,
        indicadores: indicadoresAtarfe(),
        accessedAt: BADEA_CONSULTA_19824.accessedAt,
      };
    default:
      return undefined;
  }
}
