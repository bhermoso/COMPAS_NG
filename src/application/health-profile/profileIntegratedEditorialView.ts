import type { DiagnosticAnswers } from "./diagnosticAnswers";
import type { ProfileSpace } from "../../domain/health-profile";
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
import { DIAGNOSTIC_ENGINE_QUESTIONS } from "./profileWritingContract";

export interface ProfileIntegratedEditorialHeader {
  title: string;
  subtitle: string;
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
  motorQuestion: string;
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
  spaces: ProfileSpace[];
  motorQuestionIndexes: number[];
  preferredSignalIds?: string[];
  preferredAgendaId?: string;
  capacityMatches: string[];
  signalMatches: string[];
  agendaMatches: string[];
  territorialImplication: string;
  mechanismFallback: string;
  capacityFrame: string;
  diagnosticConclusion: string;
}

interface HumanKnowledgeSelection {
  interpretation?: {
    enunciado: string;
    certeza: string;
    autorNombre: string;
  };
  hypothesis?: {
    enunciado: string;
    plausibilidad: string;
    preguntasResolutoras: string[];
  };
  openQuestion?: {
    formulacion: string;
    relevancia: string;
    urgencia: string;
  };
}

interface TerritorialDiagnosticReasoning {
  id: string;
  title: string;
  motorQuestion: string;
  signal: IntegratedHealthProfileSignal;
  source: string;
  scale: string;
  value: string;
  mechanism: string;
  exclusion: string;
  groupMotorQuestion: string;
  human: HumanKnowledgeSelection;
  territorialImplication: string;
  capacity?: string;
  capacityFrame: string;
  diagnosticConclusion: string;
  variant: EvidenceVariant;
}

const READING_DEFINITIONS: ReadingDefinition[] = [
  {
    id: "salud-sanitaria-partida",
    title: "Salud sanitaria de partida",
    variant: "informe",
    spaces: ["situacion-salud", "contexto-territorial"],
    motorQuestionIndexes: [0, 1, 3],
    signalMatches: ["informe-"],
    agendaMatches: ["desigualdad"],
    capacityMatches: ["cuidados", "atencion sanitaria", "salud mental"],
    territorialImplication:
      "El Informe sostiene el objeto salud del Perfil y coloca la conversación en torno a problemas, factores y necesidades sanitarias antes de abrir la explicación social.",
    mechanismFallback:
      "relación entre los problemas tratados por el Informe y las condiciones cotidianas que pueden modular bienestar o malestar",
    capacityFrame:
      "Las capacidades sanitarias y comunitarias solo entran aquí como soporte posible del diagnóstico",
    diagnosticConclusion:
      "el hilo sanitario queda fijado como punto de partida, no como prevalencia local ni como mandato de intervención",
  },
  {
    id: "sueno-malestar-vida-cotidiana",
    title: "Sueño, malestar y vida cotidiana",
    variant: "estudio",
    spaces: ["situacion-salud", "determinantes", "desigualdades"],
    motorQuestionIndexes: [2, 4, 5, 7],
    preferredSignalIds: ["trazador-sueno-insuficiente"],
    preferredAgendaId: "sueno-malestar",
    capacityMatches: ["salud mental", "bienestar emocional", "cuidados"],
    signalMatches: ["sueno", "sf12", "ghq", "phq", "malestar"],
    agendaMatches: ["sueno", "malestar"],
    territorialImplication:
      "El descanso insuficiente desplaza la lectura desde la conducta individual hacia la organización cotidiana del tiempo, los cuidados, el trabajo y la vivienda.",
    mechanismFallback:
      "cargas psicosociales, tiempos de cuidado y condiciones residenciales que pueden afectar al descanso",
    capacityFrame:
      "Los recursos de bienestar emocional o cuidados serían capacidad potencial si son conocidos, accesibles y usados",
    diagnosticConclusion:
      "el descanso queda como señal de vida diaria que necesita experiencia territorial para entender a quién afecta y por qué",
  },
  {
    id: "actividad-sedentarismo-entorno",
    title: "Actividad física, sedentarismo y entorno urbano",
    variant: "estudio",
    spaces: ["contexto-territorial", "determinantes", "desigualdades"],
    motorQuestionIndexes: [2, 4, 5, 7],
    preferredSignalIds: ["trazador-ipaq-inactividad", "trazador-sbq-sedentarismo"],
    preferredAgendaId: "sedentarismo-entorno",
    capacityMatches: ["vida activa", "actividad fisica", "tejido vecinal"],
    signalMatches: ["actividad", "sedentarismo", "ipaq", "sbq", "entorno"],
    agendaMatches: ["sedentarismo", "entorno", "actividad"],
    territorialImplication:
      "La inactividad en tiempo libre lleva la pregunta al entorno: seguridad, accesibilidad, autonomía, horarios y posibilidad real de usar el espacio público.",
    mechanismFallback:
      "entorno urbano, tiempos disponibles y barreras de movilidad que pueden limitar la vida activa",
    capacityFrame:
      "Los activos de vida activa importan como capacidad potencial, no como prueba de que el entorno sea accesible",
    diagnosticConclusion:
      "el movimiento cotidiano queda formulado como relación entre cuerpo, tiempo y lugar, pendiente de contraste comunitario",
  },
  {
    id: "apoyo-social-soledad-envejecimiento",
    title: "Apoyo social, soledad y envejecimiento",
    variant: "activo",
    spaces: ["activos", "determinantes", "desigualdades", "preparacion-deliberativa"],
    motorQuestionIndexes: [3, 6, 7, 8],
    preferredSignalIds: ["trazador-duke-apoyo-global"],
    preferredAgendaId: "soledad-envejecimiento",
    capacityMatches: ["mayores", "envejecimiento", "tejido vecinal", "participacion"],
    signalMatches: ["apoyo", "duke", "soledad", "envejecimiento"],
    agendaMatches: ["soledad", "envejecimiento", "apoyo"],
    territorialImplication:
      "Un apoyo social agregado alto puede convivir con soledad no observada; esa tensión territorial cruza red, envejecimiento, cuidados y accesibilidad real a recursos.",
    mechanismFallback:
      "envejecimiento y riesgo de soledad no deseada como eje territorial que necesita contraste",
    capacityFrame:
      "Los recursos para mayores o tejido comunitario son capacidad potencial mientras no se conozca acceso, uso y reconocimiento",
    diagnosticConclusion:
      "el apoyo social no cierra la cuestión: mantiene como hipótesis la relación entre red declarada, aislamiento posible y capacidad comunitaria",
  },
  {
    id: "alimentacion-consumos-condiciones",
    title: "Alimentación, consumos y condiciones materiales",
    variant: "estudio",
    spaces: ["determinantes", "desigualdades", "situacion-salud"],
    motorQuestionIndexes: [2, 4, 5, 7],
    preferredSignalIds: ["trazador-predimed-adherencia", "trazador-cage-r"],
    preferredAgendaId: "consumos-alimentacion",
    capacityMatches: ["adicciones", "educacion", "promocion"],
    signalMatches: ["aliment", "consumo", "predimed", "audit", "cage"],
    agendaMatches: ["consumo", "aliment"],
    territorialImplication:
      "Alimentación y consumos conectan hábitos con precio, disponibilidad, renta, redes domésticas y margen real de elección.",
    mechanismFallback:
      "condiciones materiales de consumo y alimentación que pueden facilitar o restringir opciones saludables",
    capacityFrame:
      "Los recursos educativos o preventivos solo son capacidad si llegan a los hogares y grupos que afrontan más restricción",
    diagnosticConclusion:
      "el hilo queda como lectura material de hábitos y consumos, no como juicio sobre decisiones individuales",
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

function humanSource(fuente: string): string {
  return fuente.replace(/\s+—\s+\S+\.csv\b/g, "").trim();
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
  const preferredById = definition.preferredSignalIds
    ?.map((id) => signals.find((signal) => signal.id === id && !used.has(signal.id)))
    .find((signal): signal is IntegratedHealthProfileSignal => signal !== undefined);
  if (preferredById !== undefined) return preferredById;

  if (definition.variant !== "informe") {
    const quantitative = signals.find(
      (signal) =>
        !used.has(signal.id) &&
        !signal.esMencionTextual &&
        includesAny(signalText(signal), definition.signalMatches)
    );
    if (quantitative !== undefined) return quantitative;
  }

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
  if (definition.preferredAgendaId !== undefined) {
    const preferred = cards.find((card) => card.id === definition.preferredAgendaId);
    if (preferred !== undefined) return preferred;
  }
  return cards.find((card) => includesAny(agendaText(card), definition.agendaMatches));
}

function shortText(text: string, maxLength = 220): string {
  const compact = text.trim().replace(/\s+/g, " ");
  if (compact.length <= maxLength) return compact;
  return compact.slice(0, maxLength - 1).replace(/\s+\S*$/, "") + "…";
}

function pickHumanKnowledge(
  answers: DiagnosticAnswers,
  spaces: ProfileSpace[]
): HumanKnowledgeSelection {
  const knowledge = spaces.map((space) => answers.porEspacio[space]).filter(Boolean);
  return {
    interpretation: knowledge.flatMap((item) => item?.interpretaciones ?? [])[0],
    hypothesis: knowledge.flatMap((item) => item?.hipotesis ?? [])[0],
    openQuestion: knowledge.flatMap((item) => item?.lagunas ?? [])[0],
  };
}

function pickCapacity(
  definition: ReadingDefinition,
  signal: IntegratedHealthProfileSignal,
  answers: DiagnosticAnswers
): string | undefined {
  for (const match of definition.capacityMatches) {
    const group = answers.salutogenica.grupos.find((candidate) =>
      normalized(candidate.ambito).includes(normalized(match))
    );
    if (group !== undefined) return group.ambito;
  }
  if (signal.activoRelacionado !== undefined) return signal.activoRelacionado;
  return undefined;
}

function firstMotorQuestion(definition: ReadingDefinition): string {
  const question = definition.motorQuestionIndexes
    .map((index) => DIAGNOSTIC_ENGINE_QUESTIONS[index])
    .find((item) => item !== undefined);
  return question ?? "¿Qué queda preparado para deliberar?";
}

function buildReasoning(
  definition: ReadingDefinition,
  signal: IntegratedHealthProfileSignal,
  agenda: GrupoMotorCard | undefined,
  answers: DiagnosticAnswers
): TerritorialDiagnosticReasoning {
  const human = pickHumanKnowledge(answers, definition.spaces);
  const mechanism =
    human.hypothesis?.enunciado ??
    signal.mecanismoPlausible ??
    definition.mechanismFallback ??
    agenda?.mecanismo;
  const exclusion =
    human.openQuestion?.relevancia ??
    agenda?.oculto ??
    signal.desigualdad.nota;
  const groupMotorQuestion =
    human.openQuestion?.formulacion ??
    agenda?.pregunta ??
    signal.preguntaGrupoMotor;

  return {
    id: definition.id,
    title: definition.title,
    motorQuestion: firstMotorQuestion(definition),
    signal,
    source: humanSource(signal.fuente),
    scale: signal.escala,
    value: signal.valor,
    mechanism,
    exclusion,
    groupMotorQuestion,
    human,
    territorialImplication: definition.territorialImplication,
    capacity: pickCapacity(definition, signal, answers),
    capacityFrame: definition.capacityFrame,
    diagnosticConclusion: definition.diagnosticConclusion,
    variant: agenda?.variant ?? signalVariant(signal) ?? definition.variant,
  };
}

function evidenceSentence(reasoning: TerritorialDiagnosticReasoning): string {
  const signal = reasoning.signal;
  const value = reasoning.value.replace(/\s+\[[^\]]+\]/, "");
  if (signal.esMencionTextual) {
    return (
      `El expediente local parte del Informe de salud: «${signal.senal}» figura ` +
      `como ${value}. Es presencia textual, no prevalencia ni distribución interna.`
    );
  }
  const scale = signal.esProxy ? "proxy contextual" : "muestra declarada";
  return (
    `El expediente incorpora «${signal.senal}» (${value}) desde ` +
    `${reasoning.source}. Su escala es ${scale}: contextualiza el análisis y ` +
    `no sustituye una medición local ausente.`
  );
}

function knowledgeSentence(reasoning: TerritorialDiagnosticReasoning): string {
  const { human } = reasoning;
  if (human.interpretation !== undefined) {
    return (
      `La interpretación activa del equipo técnico (${human.interpretation.certeza}, ` +
      `${human.interpretation.autorNombre}) orienta este hilo: ` +
      `${shortText(human.interpretation.enunciado)}.`
    );
  }
  if (human.hypothesis !== undefined) {
    return (
      `La hipótesis activa del equipo se incorpora como posibilidad a contrastar, ` +
      `no como hecho: ${shortText(human.hypothesis.enunciado)}.`
    );
  }
  return (
    `${reasoning.territorialImplication} Mecanismo plausible, sin causalidad ` +
    `demostrada: ${shortText(reasoning.mechanism, 170)}.`
  );
}

function capacitySentence(reasoning: TerritorialDiagnosticReasoning): string {
  const capacity =
    reasoning.capacity !== undefined
      ? `${reasoning.capacity} es capacidad potencial, no cobertura ni resultado; acceso/uso pendientes.`
      : `${reasoning.capacityFrame}; aún no hay recurso concreto vinculado a esta señal.`;
  return (
    `Sin distribución por sexo, edad, género o renta: incertidumbre de equidad. ${capacity}`
  );
}

function questionSentence(reasoning: TerritorialDiagnosticReasoning): string {
  if (reasoning.human.openQuestion !== undefined) {
    return (
      `La pregunta abierta del equipo entra en la lectura: ${shortText(reasoning.groupMotorQuestion, 140)}`
    );
  }
  return (
    `La pregunta deriva de esa incertidumbre y del mecanismo: ` +
    `${shortText(reasoning.groupMotorQuestion, 140)}`
  );
}

function composeReading(reasoning: TerritorialDiagnosticReasoning): string {
  return [
    evidenceSentence(reasoning),
    knowledgeSentence(reasoning),
    capacitySentence(reasoning),
    questionSentence(reasoning),
    `Conclusión diagnóstica: ${reasoning.diagnosticConclusion}.`,
  ].join(" ");
}

function buildReadingBlock(
  definition: ReadingDefinition,
  signal: IntegratedHealthProfileSignal,
  agenda: GrupoMotorCard | undefined,
  answers: DiagnosticAnswers
): ProfileIntegratedEditorialReadingBlock {
  const reasoning = buildReasoning(definition, signal, agenda, answers);
  return {
    id: reasoning.id,
    title: reasoning.title,
    signal: reasoning.signal.senal,
    source: reasoning.source,
    scale: reasoning.scale,
    reading: composeReading(reasoning),
    mechanism: reasoning.mechanism,
    exclusion: reasoning.exclusion,
    groupMotorQuestion: reasoning.groupMotorQuestion,
    motorQuestion: reasoning.motorQuestion,
    variant: reasoning.variant,
  };
}

function buildOverviewTitle(id: string, index: number): string {
  return OVERVIEW_TITLES[id] ?? `Mensaje ${index + 1}`;
}

function findSignalById(
  signals: IntegratedHealthProfileSignal[],
  id: string
): IntegratedHealthProfileSignal | undefined {
  return signals.find((signal) => signal.id === id);
}

function joinLabels(values: Array<string | undefined>, fallback: string): string {
  const labels = unique(values.filter((value): value is string => value !== undefined));
  return labels.length > 0 ? labels.join(" + ") : fallback;
}

function overviewFromMessage(
  message: { id: string; texto: string },
  index: number,
  context: {
    signals: IntegratedHealthProfileSignal[];
    visuals: ReturnType<typeof buildDiagnosticVisuals>;
    synthesis: ReturnType<typeof buildProfileSynthesis>;
    informeTitulo?: string;
    totalAssets: number;
  }
): ProfileIntegratedEditorialOverviewMessage {
  const title = buildOverviewTitle(message.id, index);

  if (message.id === "hilo-sanitario") {
    const informeRow = context.synthesis.senalesPrincipales.find((row) =>
      row.grupo.includes("Informe")
    );
    const informeSignal = context.signals.find((signal) => signal.esMencionTextual);
    return {
      id: message.id,
      title,
      text:
        `${context.informeTitulo ?? "El Informe de salud"} sostiene el hilo ` +
        `sanitario del Perfil: ${informeRow?.senal ?? informeSignal?.senal ?? "sus dimensiones principales"} ` +
        `aparecen como presencia textual del documento. Esa entrada fija el objeto ` +
        `salud, pero no convierte menciones en prevalencia ni sustituye la lectura ` +
        `de estudios, activos y contraste comunitario.`,
      signal: informeRow?.senal ?? "dimensiones sanitarias principales del Informe",
      source: context.informeTitulo ?? informeRow?.fuente ?? "Informe de salud",
      variant: "informe",
    };
  }

  if (message.id === "vida-cotidiana") {
    const sueno = findSignalById(context.signals, "trazador-sueno-insuficiente");
    const inactividad = findSignalById(context.signals, "trazador-ipaq-inactividad");
    return {
      id: message.id,
      title,
      text:
        `La vida cotidiana entra por señales incorporadas al proceso: ` +
        `${sueno?.valor ?? "sueño insuficiente"} en descanso y ` +
        `${inactividad?.valor ?? "inactividad"} en tiempo libre. Su escala ` +
        `contextual no reemplaza el dato local ausente; orienta preguntas sobre ` +
        `tiempos, cuidados, vivienda, seguridad y uso real del entorno.`,
      signal: joinLabels(
        [sueno?.senal, inactividad?.senal],
        "sueño insuficiente e inactividad en tiempo libre"
      ),
      source: humanSource(joinLabels(
        [sueno?.fuente, inactividad?.fuente],
        "Sueño (EAS) + IPAQ"
      )),
      variant: "estudio",
    };
  }

  if (message.id === "apoyo-envejecimiento") {
    const apoyo = findSignalById(context.signals, "trazador-duke-apoyo-global");
    const agenda = context.visuals.grupoMotorCards.find((card) =>
      card.id === "soledad-envejecimiento"
    );
    const activos =
      context.totalAssets > 0
        ? `${context.totalAssets} recursos comunitarios`
        : undefined;
    return {
      id: message.id,
      title,
      text:
        `El apoyo social agregado (${apoyo?.valor ?? "DUKE"}) se lee junto al ` +
        `envejecimiento, la soledad posible y ${context.totalAssets} recursos ` +
        `comunitarios inventariados. La cuestión no es si hay red en abstracto, ` +
        `sino quién puede quedar fuera de los vínculos y capacidades disponibles.`,
      signal: joinLabels(
        [apoyo?.senal, agenda?.tema, activos],
        "apoyo social funcional, envejecimiento y soledad"
      ),
      source: humanSource(joinLabels(
        [apoyo?.fuente, context.totalAssets > 0 ? "Localiza Salud" : undefined],
        "DUKE + Localiza Salud"
      )),
      variant: "activo",
    };
  }

  const signal = context.signals.find((candidate) =>
    includesAny(signalText(candidate), [message.id, title, message.texto])
  );
  return {
    id: message.id,
    title,
    text: message.texto,
    signal:
      signal?.senal ?? context.synthesis.senalesPrincipales[index]?.senal ?? message.id,
    source: humanSource(
      signal?.fuente ??
      context.synthesis.senalesPrincipales[index]?.fuente ??
      "Perfil de Salud Local"
    ),
    variant: signal !== undefined ? signalVariant(signal) : "estudio",
  };
}

function firstHumanOpenQuestion(answers: DiagnosticAnswers): string | undefined {
  return Object.values(answers.porEspacio)
    .flatMap((knowledge) => knowledge?.lagunas ?? [])
    .map((question) => question.formulacion)
    .find((question) => question.trim().length > 0);
}

function buildClosingColumns(input: {
  answers: DiagnosticAnswers;
  synthesis: ReturnType<typeof buildProfileSynthesis>;
  matrix: MatrizAnexo;
  territorialReadings: ProfileIntegratedEditorialReadingBlock[];
}): ProfileIntegratedEditorialClosingColumn[] {
  const { answers, synthesis, matrix, territorialReadings } = input;
  const sanitarySignal = synthesis.senalesPrincipales.find((row) =>
    row.grupo.includes("Informe")
  );
  const humanQuestion = firstHumanOpenQuestion(answers);
  const assetsText =
    answers.salutogenica.totalAssets > 0
      ? `${answers.salutogenica.totalAssets} recursos comunitarios quedan como capacidades potenciales, pendientes de acceso, uso y reconocimiento.`
      : "El expediente no incorpora todavía un mapa de activos suficiente para leer capacidades.";

  return [
    {
      id: "sabemos",
      title: "Qué imagen puede sostenerse",
      items: unique([
        answers.sintesisTexto !== undefined
          ? `Síntesis técnica incorporada: ${shortText(answers.sintesisTexto, 240)}`
          : undefined,
        sanitarySignal !== undefined
          ? `El Informe de salud fija el hilo sanitario mediante presencia textual de ${sanitarySignal.senal}; no aporta por sí solo distribución interna.`
          : "El hilo sanitario necesita Informe de salud incorporado para sostener la apertura.",
        `Los estudios trazadores aportan ${synthesis.senalesPrincipales.length} señales para leer vida cotidiana, apoyo, hábitos y entorno con cautela de escala.`,
      ].filter((item): item is string => item !== undefined)).slice(0, 3),
    },
    {
      id: "contrastar",
      title: "Qué hipótesis merecen contraste",
      items: unique([
        humanQuestion !== undefined
          ? `Pregunta abierta del equipo: ${humanQuestion}`
          : undefined,
        ...territorialReadings.map((block) => block.groupMotorQuestion),
      ].filter((item): item is string => item !== undefined)).slice(0, 3),
    },
    {
      id: "no-confundir",
      title: "Qué no debe confundirse",
      items: unique([
        "Las menciones del Informe son presencia textual y no prevalencia local.",
        "Las referencias provinciales, autonómicas o proxy contextualizan; no son medición distrital.",
        assetsText,
        ...matrix.notasBloque,
      ]).slice(0, 3),
    },
  ];
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

  const overview = synthesis.mensajes.slice(0, 3).map((message, index) =>
    overviewFromMessage(message, index, {
      signals,
      visuals,
      synthesis,
      informeTitulo: opts.informeTitulo,
      totalAssets: answers.salutogenica.totalAssets,
    })
  );

  const territorialReadings = READING_DEFINITIONS.flatMap((definition) => {
    const signal = pickSignal(signals, usedSignals, definition);
    if (signal === undefined) return [];
    usedSignals.add(signal.id);
    return [
      buildReadingBlock(
        definition,
        signal,
        pickAgenda(visuals.grupoMotorCards, definition),
        answers
      ),
    ];
  });

  const sourceBlocks: ProfileIntegratedEditorialSourceBlock[] = [
    {
      id: "informe",
      title: "Informe de salud",
      whatItAdds:
        "agenda sanitaria de partida, temas tratados y trazabilidad textual del documento fuente",
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

  const closing = buildClosingColumns({
    answers,
    synthesis,
    matrix,
    territorialReadings,
  });

  return {
    header: {
      title: "Perfil de Salud Local",
      subtitle: "Lectura territorial del diagnóstico",
      territory: opts.territory,
      status: opts.status,
      scale: "escala territorial declarada por cada fuente",
      sources: unique([
        opts.informeTitulo ?? "Informe de salud",
        ...synthesis.senalesPrincipales.map((row) => humanSource(row.fuente)),
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
      matrix: {
        ...matrix,
        filas: matrix.filas.map((f) => ({ ...f, fuente: humanSource(f.fuente) })),
      },
    },
  };
}
