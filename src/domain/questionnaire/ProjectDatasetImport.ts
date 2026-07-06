/**
 * Metadata ligera de una importación de dataset de proyecto REDCap.
 * No contiene el CSV bruto — sólo trazabilidad del acto de importación.
 */
export interface ProjectDatasetImport {
  id: string;
  projectId: string;
  projectName: string;
  fileName: string;
  importedAt: string;          // ISO timestamp
  rowCount: number;            // filas de datos (excluye cabecera)
  detectedModules: string[];   // módulos cuya completedColumn estaba en la cabecera
  processedModules: string[];  // detectedModules con nValid > 0
  skippedModules: string[];    // de los solicitados: sin adaptador REDCap, sin columnas o sin registros válidos
}
