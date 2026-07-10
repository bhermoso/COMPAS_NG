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
  preferredSignalIds?: string[];
  preferredAgendaId?: string;
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
    preferredSignalIds: ["trazador-sueno-insuficiente"],
    preferredAgendaId: "sueno-malestar",
    signalMatches: ["sueno", "sf12", "ghq", "phq", "malestar"],
    agendaMatches: ["sueno", "malestar"],
    frame:
      "El descanso, el malestar y la salud percibida conectan la medición sanitaria con las rutinas que organizan la vida diaria.",
  },
  {
    id: "actividad-sedentarismo-entorno",
    title: "Actividad física, sedentarismo y entorno urbano",
    variant: "estudio",
    preferredSignalIds: ["trazador-ipaq-inactividad", "trazador-sbq-sedentarismo"],
    preferredAgendaId: "sedentarismo-entorno",
    signalMatches: ["actividad", "sedentarismo", "ipaq", "sbq", "entorno"],
    agendaMatches: ["sedentarismo", "entorno", "actividad"],
    frame:
      "El movimiento cotidiano no se interpreta solo como conducta individual: depende de seguridad, tiempos, accesibilidad y usos reales del espacio.",
  },
  {
    id: "apoyo-social-soledad-envejecimiento",
    title: "Apoyo social, soledad y envejecimiento",
    variant: "activo",
    preferredSignalIds: ["trazador-duke-apoyo-global"],
    preferredAgendaId: "soledad-envejecimiento",
    signalMatches: ["apoyo", "duke", "soledad", "envejecimiento"],
    agendaMatches: ["soledad", "envejecimiento", "apoyo"],
    frame:
      "La red social y los recursos de cuidado ayudan a leer quién sostiene la vida cotidiana y quién puede quedar menos visible.",
  },
  {
    id: "alimentacion-consumos-condiciones",
    title: "Alimentación, consumos y condiciones materiales",
    variant: "estudio",
    preferredSignalIds: ["trazador-predimed-adherencia", "trazador-cage-r"],
    preferredAgendaId: "consumos-alimentacion",
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

function readingText(
  definition: ReadingDefinition,
  signal: IntegratedHealthProfileSignal,
  _mechanism: string,
  exclusion: string
): string {
  const src = humanSource(signal.fuente);

  if (definition.id === "salud-sanitaria-partida") {
    return (
      `${definition.frame} En este expediente, «${signal.senal}» abre la ` +
      `conversación sanitaria como ${signal.valor}; no funciona como prevalencia ` +
      `local ni como orden de intervención. El dato procede del ${src}, documento ` +
      `de ámbito amplio, sin desagregación distrital. Leída junto al resto del ` +
      `expediente, esa agenda desplaza la pregunta hacia las condiciones que producen ` +
      `salud o malestar en el territorio. Los datos no están desagregados por sexo, ` +
      `edad ni renta: la desigualdad queda como incertidumbre central, no como ` +
      `ausencia demostrada.`
    );
  }

  if (definition.id === "sueno-malestar-vida-cotidiana") {
    return (
      `${definition.frame} El ${signal.valor} asociado a «${signal.senal}» ` +
      `permite leer el descanso y el malestar como parte de la organización ` +
      `cotidiana del tiempo, no como una conducta individual aislada. El dato ` +
      `proviene de ${src} y se usa como referencia de contexto provincial, no ` +
      `como medición cerrada del ámbito. La lectura debe preguntarse por turnos, ` +
      `cuidados nocturnos, vivienda, ruido, preocupación económica y control real ` +
      `sobre el tiempo de las personas.`
    );
  }

  if (definition.id === "actividad-sedentarismo-entorno") {
    return (
      `${definition.frame} El ${signal.valor} vinculado a «${signal.senal}» ` +
      `sitúa la actividad física en la relación entre rutinas, cuidados, horarios ` +
      `y espacio público. El dato proviene de ${src} y se usa como referencia de ` +
      `contexto, no como medición específica del territorio. No basta con nombrar ` +
      `inactividad o sedentarismo: el Perfil debe leer seguridad, accesibilidad, ` +
      `autonomía, tiempos disponibles y facilidad para moverse en la vida diaria.`
    );
  }

  if (definition.id === "apoyo-social-soledad-envejecimiento") {
    return (
      `${definition.frame} El valor ${signal.valor} en «${signal.senal}» abre una ` +
      `tensión territorial entre red declarada, soledad, envejecimiento y capacidad ` +
      `comunitaria. El dato proviene de ${src}, escala de contexto provincial. ` +
      `Los activos son capacidad potencial, no cobertura ni resultado: importa ` +
      `quién los conoce, quién puede llegar y quién queda fuera. La pregunta ` +
      `crítica es qué personas mayores, cuidadoras o aisladas no aparecen en los ` +
      `registros disponibles.`
    );
  }

  if (definition.id === "alimentacion-consumos-condiciones") {
    return (
      `${definition.frame} El ${signal.valor} observado en «${signal.senal}» debe ` +
      `leerse junto a precio, disponibilidad, renta, hogares con menos margen y ` +
      `contextos de consumo. El dato proviene de ${src}, escala de contexto ` +
      `provincial. La lectura no convierte alimentación o consumos en juicio ` +
      `individual: los sitúa en condiciones materiales que pueden facilitar o ` +
      `limitar opciones reales. La zona a contrastar es qué hogares deciden desde ` +
      `la restricción y qué prácticas no aparecen en el indicador agregado: ${exclusion}.`
    );
  }

  return (
    `${definition.frame} «${signal.senal}» aporta ${signal.valor} desde ${src}. ` +
    `El dato debe leerse como señal territorial prudente, vinculada a condiciones ` +
    `de vida, con incertidumbre explícita sobre su alcance territorial. ` +
    `Debe contrastarse quién queda fuera del agregado: ${exclusion}.`
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
    source: humanSource(signal.fuente),
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
    return {
      id: message.id,
      title,
      text: message.texto,
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
      text: message.texto,
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
      text: message.texto,
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
