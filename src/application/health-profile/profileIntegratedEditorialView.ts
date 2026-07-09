import type { DiagnosticAnswers } from "./diagnosticAnswers";
import {
  buildIntegratedProfileSignals,
  type IntegratedHealthProfileSignal,
} from "./integratedProfileSignals";
import {
  buildDiagnosticVisuals,
  type EvidenceVariant,
  type GrupoMotorCard,
  type TrazadorRow,
} from "./profileDiagnosticVisuals";
import {
  buildMatrizAnexo,
  buildProfileSynthesis,
  type MatrizAnexo,
} from "./profileSynthesisView";

export interface ProfileIntegratedEditorialHeader {
  title: string;
  territory: string;
  status: string;
  scale: string;
  sources: string[];
  generatedDate?: string;
}

export interface ProfileIntegratedEditorialOverviewMessage {
  id: string;
  title: string;
  text: string;
  signal: string;
  source: string;
  variant: EvidenceVariant;
}

export interface ProfileIntegratedEditorialSourceBlock {
  id: "informe" | "estudios" | "activos";
  title: string;
  whatItAdds: string;
  whatItDoesNotAllow: string;
  variant: EvidenceVariant;
}

export interface ProfileIntegratedEditorialReadingBlock {
  id: string;
  title: string;
  signal: string;
  source: string;
  scale: string;
  reading: string;
  mechanism: string;
  exclusion: string;
  groupMotorQuestion: string;
  variant: EvidenceVariant;
}

export interface ProfileIntegratedEditorialClosingColumn {
  id: "sabemos" | "contrastar" | "no-confundir";
  title: string;
  items: string[];
}

export interface ProfileIntegratedEditorialTechnicalAnnex {
  title: string;
  summary: string;
  tracerRows: TrazadorRow[];
  matrix: MatrizAnexo;
}

export interface ProfileIntegratedEditorialView {
  header: ProfileIntegratedEditorialHeader;
  overview: ProfileIntegratedEditorialOverviewMessage[];
  sourceBlocks: ProfileIntegratedEditorialSourceBlock[];
  territorialReadings: ProfileIntegratedEditorialReadingBlock[];
  tracerTable: TrazadorRow[];
  groupMotorAgenda: GrupoMotorCard[];
  closing: ProfileIntegratedEditorialClosingColumn[];
  technicalAnnex: ProfileIntegratedEditorialTechnicalAnnex;
}

export interface BuildProfileIntegratedEditorialViewOptions {
  territory: string;
  status: string;
  informeTitulo?: string;
  generatedDate?: string;
}

interface ReadingDefinition {
  id: string;
  title: string;
  variant: EvidenceVariant;
  signalMatches: string[];
  agendaMatches: string[];
  frame: string;
}

const READING_DEFINITIONS: ReadingDefinition[] = [
  {
    id: "salud-sanitaria-partida",
    title: "Salud sanitaria de partida",
    variant: "informe",
    signalMatches: ["informe-"],
    agendaMatches: ["desigualdad"],
    frame:
      "La entrada sanitaria ordena la primera mirada del Perfil: muestra que el expediente ya trae una agenda de salud que debe leerse con su escala propia.",
  },
  {
    id: "sueno-malestar-vida-cotidiana",
    title: "Sueño, malestar y vida cotidiana",
    variant: "estudio",
    signalMatches: ["sueno", "sf12", "ghq", "phq", "malestar"],
    agendaMatches: ["sueno", "malestar"],
    frame:
      "El descanso, el malestar y la salud percibida conectan la medición sanitaria con las rutinas que organizan la vida diaria.",
  },
  {
    id: "actividad-sedentarismo-entorno",
    title: "Actividad física, sedentarismo y entorno urbano",
    variant: "estudio",
    signalMatches: ["actividad", "sedentarismo", "ipaq", "sbq", "entorno"],
    agendaMatches: ["sedentarismo", "entorno", "actividad"],
    frame:
      "El movimiento cotidiano no se interpreta solo como conducta individual: depende de seguridad, tiempos, accesibilidad y usos reales del espacio.",
  },
  {
    id: "apoyo-social-soledad-envejecimiento",
    title: "Apoyo social, soledad y envejecimiento",
    variant: "activo",
    signalMatches: ["apoyo", "duke", "soledad", "envejecimiento"],
    agendaMatches: ["soledad", "envejecimiento", "apoyo"],
    frame:
      "La red social y los recursos de cuidado ayudan a leer quién sostiene la vida cotidiana y quién puede quedar menos visible.",
  },
  {
    id: "alimentacion-consumos-condiciones",
    title: "Alimentación, consumos y condiciones materiales",
    variant: "estudio",
    signalMatches: ["aliment", "consumo", "predimed", "audit", "cage"],
    agendaMatches: ["consumo", "aliment"],
    frame:
      "La alimentación y los consumos permiten mirar hábitos, precios, disponibilidad y condiciones materiales sin convertirlos en juicio individual.",
  },
];

const OVERVIEW_TITLES: Record<string, string> = {
  "hilo-sanitario": "Agenda sanitaria de partida",
  "vida-cotidiana": "Vida cotidiana",
  "apoyo-envejecimiento": "Apoyo y envejecimiento",
  "bienestar-escolar": "Bienestar escolar",
  capacidades: "Capacidades comunitarias",
  "equidad-abierta": "Equidad pendiente",
};

function unique(values: string[]): string[] {
  return [...new Set(values.filter((v) => v.trim().length > 0))];
}

function normalized(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function includesAny(text: string, matches: string[]): boolean {
  const value = normalized(text);
  return matches.some((match) => value.includes(normalized(match)));
}

function signalText(signal: IntegratedHealthProfileSignal): string {
  return [
    signal.id,
    signal.senal,
    signal.fuente,
    signal.escala,
    signal.valor,
    signal.mecanismoPlausible ?? "",
    signal.activoRelacionado ?? "",
  ].join(" ");
}

function agendaText(card: GrupoMotorCard): string {
  return [card.id, card.tema, card.senal, card.mecanismo].join(" ");
}

function signalVariant(signal: IntegratedHealthProfileSignal): EvidenceVariant {
  if (signal.esMencionTextual) return "informe";
  if (signal.esProxy) return "proxy";
  if (signal.activoRelacionado !== undefined) return "activo";
  if (signal.desigualdad.distribucion === "desconocida-sin-desagregacion") {
    return "estudio";
  }
  return "equidad";
}

function pickSignal(
  signals: IntegratedHealthProfileSignal[],
  used: Set<string>,
  definition: ReadingDefinition
): IntegratedHealthProfileSignal | undefined {
  const preferred = signals.find(
    (signal) =>
      !used.has(signal.id) &&
      includesAny(signalText(signal), definition.signalMatches)
  );
  if (preferred !== undefined) return preferred;
  return signals.find((signal) => !used.has(signal.id));
}

function pickAgenda(
  cards: GrupoMotorCard[],
  definition: ReadingDefinition
): GrupoMotorCard | undefined {
  return cards.find((card) => includesAny(agendaText(card), definition.agendaMatches));
}

function readingText(
  definition: ReadingDefinition,
  signal: IntegratedHealthProfileSignal,
  mechanism: string,
  exclusion: string
): string {
  return (
    `${definition.frame} La señal disponible es «${signal.senal}» y procede de ` +
    `${signal.fuente}. Su valor declarado es ${signal.valor}; la escala real es ` +
    `${signal.escala}. La lectura territorial no convierte ese dato en mandato: lo ` +
    `usa para preguntar cómo se manifiesta en el municipio, qué condiciones pueden ` +
    `explicarlo y qué voces faltan. El mecanismo a contrastar es: ${mechanism}. ` +
    `La principal zona ciega es: ${exclusion}.`
  );
}

function buildReadingBlock(
  definition: ReadingDefinition,
  signal: IntegratedHealthProfileSignal,
  agenda?: GrupoMotorCard
): ProfileIntegratedEditorialReadingBlock {
  const mechanism =
    signal.mecanismoPlausible ??
    agenda?.mecanismo ??
    "mecanismo no formulado todavía en las capas diagnósticas disponibles";
  const exclusion = agenda?.oculto ?? signal.desigualdad.nota;
  return {
    id: definition.id,
    title: definition.title,
    signal: signal.senal,
    source: signal.fuente,
    scale: signal.escala,
    reading: readingText(definition, signal, mechanism, exclusion),
    mechanism,
    exclusion,
    groupMotorQuestion: agenda?.pregunta ?? signal.preguntaGrupoMotor,
    variant: agenda?.variant ?? signalVariant(signal) ?? definition.variant,
  };
}

function buildOverviewTitle(id: string, index: number): string {
  return OVERVIEW_TITLES[id] ?? `Mensaje ${index + 1}`;
}

export function buildProfileIntegratedEditorialView(
  answers: DiagnosticAnswers,
  opts: BuildProfileIntegratedEditorialViewOptions
): ProfileIntegratedEditorialView {
  const synthesis = buildProfileSynthesis(answers, {
    informeTitulo: opts.informeTitulo,
    scopeNoun: "territorio",
  });
  const visuals = buildDiagnosticVisuals(answers, {
    informeTitulo: opts.informeTitulo,
  });
  const matrix = buildMatrizAnexo(answers);
  const signals = buildIntegratedProfileSignals(answers);
  const usedSignals = new Set<string>();

  const overview = synthesis.mensajes.slice(0, 3).map((message, index) => {
    const signal = signals[index];
    return {
      id: message.id,
      title: buildOverviewTitle(message.id, index),
      text: message.texto,
      signal: signal?.senal ?? synthesis.senalesPrincipales[index]?.senal ?? message.id,
      source: signal?.fuente ?? synthesis.senalesPrincipales[index]?.fuente ?? "Perfil de Salud Local",
      variant: signal !== undefined ? signalVariant(signal) : "estudio",
    };
  });

  const territorialReadings = READING_DEFINITIONS.flatMap((definition) => {
    const signal = pickSignal(signals, usedSignals, definition);
    if (signal === undefined) return [];
    usedSignals.add(signal.id);
    return [buildReadingBlock(definition, signal, pickAgenda(visuals.grupoMotorCards, definition))];
  });

  const sourceBlocks: ProfileIntegratedEditorialSourceBlock[] = [
    {
      id: "informe",
      title: "Informe de salud",
      whatItAdds:
        synthesis.senalesPrincipales.find((row) => row.grupo.includes("Informe"))
          ?.lectura ?? "agenda sanitaria de partida y magnitudes del documento fuente",
      whatItDoesNotAllow:
        "no mide por sí solo prevalencia local ni distribución interna de desigualdad",
      variant: "informe",
    },
    {
      id: "estudios",
      title: "Estudios complementarios",
      whatItAdds:
        `${answers.estudios.totalStudies} estudio(s) y ${visuals.tablaTrazadores.length} trazador(es) con valores comparables cuando existe referencia equivalente`,
      whatItDoesNotAllow:
        "no sustituyen la lectura municipal ni convierten una muestra o proxy en verdad territorial completa",
      variant: "estudio",
    },
    {
      id: "activos",
      title: "Activos y capacidades",
      whatItAdds:
        `${answers.salutogenica.totalAssets} recurso(s) comunitario(s) inventariado(s) como capacidades potenciales`,
      whatItDoesNotAllow:
        "no acreditan cobertura, uso efectivo ni acceso real sin contraste comunitario",
      variant: "activo",
    },
  ];

  const closing: ProfileIntegratedEditorialClosingColumn[] = [
    {
      id: "sabemos",
      title: "Qué sabemos",
      items: synthesis.mensajes.slice(0, 3).map((message) => message.texto),
    },
    {
      id: "contrastar",
      title: "Qué falta contrastar",
      items: visuals.grupoMotorCards.slice(0, 3).map((card) => card.pregunta),
    },
    {
      id: "no-confundir",
      title: "Qué no debe confundirse",
      items: unique([
        synthesis.notaEscala,
        ...matrix.notasBloque,
        "Los activos son capacidades potenciales: necesitan validación de acceso, uso y reconocimiento.",
      ]).slice(0, 3),
    },
  ];

  return {
    header: {
      title: "Vista editorial integrada",
      territory: opts.territory,
      status: opts.status,
      scale: "escala territorial declarada por cada fuente",
      sources: unique([
        opts.informeTitulo ?? "Informe de salud",
        ...synthesis.senalesPrincipales.map((row) => row.fuente),
      ]).slice(0, 6),
      generatedDate: opts.generatedDate,
    },
    overview,
    sourceBlocks,
    territorialReadings,
    tracerTable: visuals.tablaTrazadores,
    groupMotorAgenda: visuals.grupoMotorCards,
    closing,
    technicalAnnex: {
      title: "Lectura territorial ampliada y anexo técnico",
      summary:
        `${visuals.tablaTrazadores.length} trazador(es), ` +
        `${matrix.filas.length} fila(s) de matriz y ` +
        `${matrix.notasBloque.length} nota(s) metodológica(s) comunes.`,
      tracerRows: visuals.tablaTrazadores,
      matrix,
    },
  };
}
