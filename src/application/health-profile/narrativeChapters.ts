/**
 * narrativeChapters
 *
 * Organización narrativa del Perfil Local de Salud por determinantes.
 * Funciones puras y testeables: reciben datos ya calculados y devuelven
 * los capítulos del borrador institucional del Perfil.
 *
 * Reglas de producto que este módulo garantiza:
 *  - El Perfil concluye, pero no recomienda: ningún capítulo formula
 *    actuaciones, programas ni objetivos estratégicos.
 *  - La evidencia se selecciona y comenta, no se vuelca íntegra.
 *  - Las ausencias (determinantes, desagregaciones) se declaran como
 *    incertidumbres del diagnóstico, nunca se rellenan con contenido inventado.
 *  - El vocabulario territorial procede del ámbito (distrito / municipio /
 *    ámbito territorial), nunca se presupone "municipio".
 */

export interface NarrativeChapter {
  numeral: string;
  title: string;
  content: string;
}

export interface NarrativeChaptersInput {
  /** Sustantivo del ámbito: "distrito" | "municipio" | "ámbito territorial". */
  scopeNoun: string;
  /** Cautelas metodológicas declaradas por los estudios (deduplicadas). */
  studyCautions: string[];
  /** Hay cautelas de escala provincial / proxy / origen externo. */
  hasProxyScale: boolean;

  healthReportTitle?: string;
  complementaryStudyCount: number;
  /** Títulos de la documentación territorial diagnóstica (p. ej., Informes Vigía). */
  territorialDocTitles: string[];

  ibse?: { meanTotal: number; nValid: number; isProxy: boolean };

  indicatorCount: number;
  determinantCount: number;
  determinantTitles: string[];
  assetCount: number;
  assetTitles: string[];
  hasLocalizaAssets: boolean;
  qualitativeCount: number;
  cautionCount: number;

  longitudinalNote: string;

  tensionesEscaladas: number;
  tensionesNoEscaladas: number;
  conflictos: number;
  limitacionesDiagnosticas: string[];

  /** Títulos de áreas con evidencia suficiente (no huecos analíticos). */
  areasReales: string[];
}

const MAX_EJEMPLOS = 5;

function muestra(titles: string[]): string {
  const seleccion = titles.slice(0, MAX_EJEMPLOS).join("; ");
  return titles.length > MAX_EJEMPLOS
    ? `${seleccion}; entre otros (${titles.length} en total)`
    : seleccion;
}

export function buildNarrativeChapters(input: NarrativeChaptersInput): NarrativeChapter[] {
  const { scopeNoun } = input;
  const chapters: NarrativeChapter[] = [];

  // ── I. Alcance, fuentes y escala de la evidencia ──────────────────────────
  {
    const fuentes: string[] = [];
    if (input.healthReportTitle) {
      fuentes.push(
        `«${input.healthReportTitle}» actúa como fuente diagnóstica primaria del territorio.`
      );
    }
    if (input.complementaryStudyCount > 0) {
      fuentes.push(
        `El diagnóstico se apoya en ${input.complementaryStudyCount} estudios ` +
        `complementarios y en ${input.assetCount} activos y recursos identificados.`
      );
    }
    if (input.territorialDocTitles.length > 0) {
      fuentes.push(
        `La documentación territorial diagnóstica incorpora: ${muestra(input.territorialDocTitles)}.`
      );
    }

    const alcance: string[] = ["Alcance y escala de la evidencia disponible."];
    if (input.hasProxyScale) {
      alcance.push(
        `Parte de la evidencia de los estudios complementarios procede de ámbitos ` +
        `más amplios que el ${scopeNoun} (escala provincial u origen externo) ` +
        `y se incorpora como contexto exploratorio para orientar la interpretación: ` +
        `no constituye estimación específica del ${scopeNoun} y queda ` +
        `pendiente de contraste territorial.`
      );
    }
    if (input.studyCautions.length > 0) {
      alcance.push(
        `Cautelas metodológicas declaradas por los estudios: ` +
        input.studyCautions.join(" · ")
      );
    }

    chapters.push({
      numeral: "I",
      title: "Alcance, fuentes y escala de la evidencia",
      content: [...fuentes, alcance.join(" ")].join("\n\n"),
    });
  }

  // ── II. Contexto territorial y sociodemográfico ───────────────────────────
  {
    const partes: string[] = [
      `La lectura se realiza a escala de ${scopeNoun}. ` +
      `La caracterización sociodemográfica específica debe tomarse de la fuente ` +
      `diagnóstica primaria y de las fuentes oficiales de referencia; este capítulo ` +
      `no la sustituye.`,
    ];
    if (input.territorialDocTitles.length > 0) {
      partes.push(
        `La documentación territorial disponible aporta contexto de zona básica ` +
        `de salud y de entorno urbano para la interpretación del ${scopeNoun}.`
      );
    }
    partes.push(input.longitudinalNote);

    chapters.push({
      numeral: "II",
      title: "Contexto territorial y sociodemográfico",
      content: partes.join("\n\n"),
    });
  }

  // ── III. Situación de salud y desigualdades ───────────────────────────────
  {
    const partes: string[] = [];
    if (input.indicatorCount > 0) {
      partes.push(
        `La evidencia cuantitativa disponible reúne ${input.indicatorCount} ` +
        `indicadores de salud y bienestar procedentes de los estudios complementarios.`
      );
    }
    if (input.ibse && Number.isFinite(input.ibse.meanTotal)) {
      const valorBase =
        `El bienestar socioemocional escolar (IBSE) se sitúa en ` +
        `${input.ibse.meanTotal.toFixed(1)} sobre 100 en una muestra de ` +
        `${input.ibse.nValid} escolares.`;
      partes.push(
        input.ibse.isProxy
          ? `${valorBase} Este valor procede de evidencia contextual de ámbito ` +
            `provincial u origen externo, incorporada como referencia exploratoria: ` +
            `no constituye una estimación específica del ${scopeNoun} y ` +
            `requiere contraste territorial.`
          : `${valorBase} Este dato debe interpretarse en relación con el contexto ` +
            `socioeconómico y los determinantes familiares y comunitarios del territorio.`
      );
    }
    partes.push(
      `Con la evidencia disponible no es posible caracterizar desigualdades internas ` +
      `del ${scopeNoun}: los agregados no están desagregados por sexo, edad ni ` +
      `condición socioeconómica. Esta ausencia es una incertidumbre del diagnóstico, ` +
      `no un indicio de equidad.`
    );

    chapters.push({
      numeral: "III",
      title: "Situación de salud y desigualdades",
      content: partes.join("\n\n"),
    });
  }

  // ── IV. Determinantes sociales, comunitarios y ambientales ────────────────
  {
    const partes: string[] = [];
    if (input.determinantCount > 0) {
      partes.push(
        `Se han documentado ${input.determinantCount} determinantes de la salud ` +
        `en el territorio; entre ellos: ${muestra(input.determinantTitles)}. ` +
        `Su interpretación corresponde al equipo técnico y al Grupo Motor en su ` +
        `contexto local.`
      );
    } else {
      partes.push(
        `La base de evidencia actual no documenta determinantes sociales, ` +
        `comunitarios o ambientales específicos del ${scopeNoun}. ` +
        `Esta carencia condiciona la lectura del conjunto del diagnóstico y debe ` +
        `tenerse presente en la deliberación.`
      );
    }
    if (input.limitacionesDiagnosticas.length > 0) {
      partes.push(input.limitacionesDiagnosticas.join(" "));
    }

    chapters.push({
      numeral: "IV",
      title: "Determinantes sociales, comunitarios y ambientales",
      content: partes.join("\n\n"),
    });
  }

  // ── V. Activos, capacidades territoriales e incertidumbres ────────────────
  {
    const partes: string[] = [];
    if (input.assetCount > 0) {
      partes.push(
        `El territorio dispone de ${input.assetCount} activos y recursos para la ` +
        `salud identificados; entre ellos: ${muestra(input.assetTitles)}. ` +
        `La lectura salutogénica del territorio no se agota en sus déficits: ` +
        `estas capacidades son punto de partida del proceso comunitario.`
      );
      if (input.hasLocalizaAssets) {
        partes.push(
          `Los activos proceden de la consulta de Localiza Salud. ` +
          `En un ámbito inframunicipal pueden incluir recursos del municipio matriz ` +
          `o del entorno funcional más amplio: requieren validación territorial ` +
          `antes de interpretarse como activos propios del ${scopeNoun}.`
        );
      }
    } else {
      partes.push(
        `No se han incorporado todavía activos ni capacidades comunitarias al ` +
        `diagnóstico del ${scopeNoun}.`
      );
    }

    const incertidumbres: string[] = [];
    if (input.cautionCount > 0) {
      incertidumbres.push(
        `${input.cautionCount} cautelas metodológicas condicionan la interpretación.`
      );
    }
    const noConvergentes = input.tensionesNoEscaladas + input.conflictos;
    if (noConvergentes > 0) {
      incertidumbres.push(
        `Las fuentes ofrecen lecturas no plenamente convergentes en ` +
        `${noConvergentes} aspecto(s), que señalan dónde el conocimiento ` +
        `disponible es más incierto.`
      );
    }
    if (input.hasProxyScale) {
      incertidumbres.push(
        `La escala de parte de la evidencia (contexto provincial u origen externo) ` +
        `es la principal incertidumbre del diagnóstico y queda pendiente de ` +
        `contraste territorial.`
      );
    }
    if (incertidumbres.length > 0) {
      partes.push(`Incertidumbres del diagnóstico. ${incertidumbres.join(" ")}`);
    }

    chapters.push({
      numeral: "V",
      title: "Activos, capacidades territoriales e incertidumbres",
      content: partes.join("\n\n"),
    });
  }

  // ── VI. Conclusiones técnicas para la priorización ────────────────────────
  {
    const partes: string[] = [];
    if (input.areasReales.length > 0) {
      const lista = input.areasReales.map((t, i) => `${i + 1}. ${t}`).join("; ");
      partes.push(
        `La información disponible apunta a ${input.areasReales.length} ` +
        `área(s) territorial(es) que merecen atención preferente: ${lista}. ` +
        `Estas áreas son candidaturas para la deliberación con el Grupo Motor, ` +
        `no decisiones definitivas.`
      );
    } else {
      partes.push(
        `La evidencia disponible no permite todavía formular candidaturas ` +
        `territoriales específicas: la deliberación con el Grupo Motor debe ` +
        `partir del contraste de la evidencia contextual y de la ampliación ` +
        `de la base diagnóstica propia del ${scopeNoun}.`
      );
    }
    if (input.tensionesEscaladas > 0) {
      partes.push(
        "El diagnóstico identifica aspectos del territorio donde las fuentes " +
        "disponibles ofrecen lecturas que conviene contrastar con el Grupo Motor " +
        "antes de trasladarlas a prioridades de planificación."
      );
    }
    partes.push(
      `El equipo técnico debe redactar aquí la síntesis diagnóstica del ${scopeNoun}. ` +
      "Las conclusiones deben responder a: ¿cuál es el estado de salud del territorio " +
      "y qué lo caracteriza?, ¿qué determinantes parecen estar operando?, " +
      "¿con qué activos y capacidades cuenta el territorio?, " +
      "¿qué aporta la perspectiva ciudadana que los datos no capturan?, " +
      "¿qué incertidumbres críticas permanecen abiertas?"
    );
    partes.push(
      "Este capítulo cierra el diagnóstico: no formula recomendaciones, " +
      "actuaciones ni programas. La traducción a prioridades y acciones " +
      "corresponde a las fases posteriores del proceso de planificación."
    );

    chapters.push({
      numeral: "VI",
      title: "Conclusiones técnicas para la priorización",
      content: partes.join("\n\n"),
    });
  }

  return chapters;
}

export function renderNarrativeChapters(chapters: NarrativeChapter[]): string {
  return chapters
    .map((c) => `${c.numeral}. ${c.title}\n\n${c.content}`)
    .join("\n\n\n");
}
