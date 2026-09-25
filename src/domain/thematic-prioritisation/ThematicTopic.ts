export interface ThematicTopic {
  id: string;
  label: string;
}

export const MAX_SELECTED_TOPICS = 5;

// Catálogo canónico del formulario REDCap "papeleta_pri_tematica"
// temas___1 … temas___10 · @MAXCHECKED=5
// Fuente: PriorizacinCiudadanaZagra_DataDictionary_2026-06-20.csv
export const THEMATIC_TOPICS: readonly ThematicTopic[] = [
  { id: "alimentacion",          label: "Alimentación" },
  { id: "actividad-fisica",      label: "Actividad física" },
  { id: "bienestar-emocional",   label: "Bienestar emocional y salud mental" },
  { id: "pantallas-redes",       label: "Uso de pantallas y redes sociales" },
  { id: "sueno-descanso",        label: "Sueño y descanso" },
  { id: "tabaco-alcohol-drogas", label: "Tabaco, vapeadores, alcohol y otras drogas" },
  { id: "sexualidad-salud",      label: "Sexualidad y salud" },
  { id: "violencia-genero",      label: "Violencia de género" },
  { id: "medioambiente",         label: "Medioambiente y municipio" },
  { id: "accidentes",            label: "Accidentes en el hogar y la vía pública" },
];
