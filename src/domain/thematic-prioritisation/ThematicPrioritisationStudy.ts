// Resultado estadístico de un proceso de participación ciudadana (REDCap).
// Es independiente de ThematicPrioritisation (la decisión técnica).
// La decisión técnica puede derivarse del estudio, pero no está acoplada a él.

export interface ThematicTopicVoteResult {
  topicId: string;        // ID del catálogo COMPÁS NG (ej. "bienestar-emocional")
  redcapColumn: string;   // Columna REDCap (ej. "temas___3")
  label: string;          // Etiqueta del formulario
  votes: number;          // Papeletas completas que lo marcaron
  pct: number;            // Porcentaje sobre papeletas completas (1 decimal)
  rank: number;           // Posición en el ranking (1 = más votado)
}

export interface ThematicPrioritisationStudy {
  municipalityId: string;
  sourceFileName: string;
  importedAt: string;             // ISO timestamp
  totalRecords: number;           // Todos los registros del CSV
  completeRecords: number;        // Solo papeleta_pri_tematica_complete === "2"
  ranking: ThematicTopicVoteResult[];  // 10 temas ordenados de más a menos votado
  topFiveTopicIds: string[];      // IDs de los 5 temas más votados
  methodologicalCautions: string[];
}
