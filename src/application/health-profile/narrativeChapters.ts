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

import type { DiagnosticAnswers, SpaceKnowledge } from "./diagnosticAnswers";
import type { ProfileSpace } from "../../domain/health-profile";

export interface NarrativeChapter {
  numeral: string;
  title: string;
  content: string;
}

export interface NarrativeChaptersInput {
  /** Sustantivo del ámbito: "distrito" | "municipio" | "ámbito territorial". */
  scopeNoun: string;
  /** Provincia del ámbito, para situarlo territorialmente. */
  province?: string;
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
  /** Títulos de los indicadores disponibles (para selección comentada). */
  indicatorTitles: string[];
  determinantCount: number;
  determinantTitles: string[];
  assetCount: number;
  assetTitles: string[];
  /**
   * Subconjunto de assetTitles cuyos activos se identifican expresamente con
   * el ámbito (p. ej., contienen su nombre). Prioridad en la muestra del Cap. V.
   */
  scopeMatchedAssetTitles: string[];
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

  /**
   * Respuestas diagnósticas (capa de conocimiento). Opcional: sin ella, los
   * capítulos se generan solo desde la evidencia agregada.
   */
  answers?: DiagnosticAnswers;
}

// ── Conocimiento del técnico: redacción por espacio ──────────────────────────
// Prioridad epistémica: interpretación (afirmación con certeza) > hipótesis
// (explicación candidata) > laguna (incertidumbre declarada).

function redactarConocimiento(
  answers: DiagnosticAnswers | undefined,
  espacios: ProfileSpace[]
): string[] {
  if (!answers) return [];
  const partes: string[] = [];
  for (const espacio of espacios) {
    const k: SpaceKnowledge | undefined = answers.porEspacio[espacio];
    if (!k) continue;
    for (const i of k.interpretaciones) {
      partes.push(
        `Lectura del equipo técnico (certeza ${i.certeza}): ${i.enunciado}`
      );
    }
    for (const h of k.hipotesis) {
      const resolutoras =
        h.preguntasResolutoras.length > 0
          ? ` La resolverían: ${h.preguntasResolutoras.join("; ")}.`
          : "";
      partes.push(
        `Hipótesis diagnóstica del equipo (plausibilidad ${h.plausibilidad}, ` +
        `pendiente de confirmación): ${h.enunciado}.${resolutoras}`
      );
    }
  }
  return partes;
}

function redactarLagunas(answers: DiagnosticAnswers | undefined): string[] {
  if (!answers) return [];
  const lagunas = Object.values(answers.porEspacio)
    .flatMap((k) => k?.lagunas ?? [])
    .sort((a, b) => (a.urgencia === "alta" ? -1 : b.urgencia === "alta" ? 1 : 0));
  return lagunas
    .slice(0, MAX_EJEMPLOS)
    .map(
      (l) =>
        `Laguna de conocimiento declarada (urgencia ${l.urgencia}): ` +
        `${l.formulacion} Importa porque ${l.relevancia}`
    );
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

    // El bloque de alcance es compacto: una cautela principal literal y el
    // resto sintetizado. El detalle instrumento a instrumento vive en los
    // paneles de cada estudio y en el capítulo IV del Perfil, no aquí.
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
      const principal =
        input.studyCautions.find((c) => /proxy|contexto exploratorio/i.test(c)) ??
        input.studyCautions[0];
      const restantes = input.studyCautions.filter((c) => c !== principal).length;
      alcance.push(`Cautela principal declarada por los estudios: ${principal}`);
      if (restantes > 0) {
        alcance.push(
          `Constan además ${restantes} cautelas metodológicas específicas de ` +
          `instrumento (muestras, recodificaciones y límites de cada escala), ` +
          `consultables en el panel de cada estudio.`
        );
      }
    }

    chapters.push({
      numeral: "I",
      title: "Alcance, fuentes y escala de la evidencia",
      content: [...fuentes, alcance.join(" ")].join("\n\n"),
    });
  }

  // ── II. Contexto territorial y sociodemográfico ───────────────────────────
  {
    const esDistrito = scopeNoun === "distrito";
    const provincia = input.province ? ` de la provincia de ${input.province}` : "";
    const partes: string[] = [
      esDistrito
        ? `La lectura se realiza a escala de distrito: un ámbito inframunicipal ` +
          `que se inscribe en su municipio matriz${provincia}. Buena parte del ` +
          `conocimiento oficial se produce a escala de ciudad, de zona básica de ` +
          `salud o de provincia, y desciende al distrito solo como contexto; esta ` +
          `asimetría de escalas condiciona todo el capítulo de situación de salud.`
        : `La lectura se realiza a escala de ${scopeNoun}${provincia}.`,
      `La caracterización sociodemográfica específica debe tomarse de la fuente ` +
      `diagnóstica primaria${
        input.healthReportTitle ? ` («${input.healthReportTitle}»)` : ""
      } y de las fuentes oficiales de referencia; este capítulo no la sustituye.`,
    ];
    if (input.territorialDocTitles.length > 0) {
      partes.push(
        `La documentación territorial disponible (${muestra(input.territorialDocTitles)}) ` +
        `aporta la mirada de zona básica de salud y de entorno urbano: es el material ` +
        `con mayor proximidad territorial al ${scopeNoun} y el punto de partida para ` +
        `contrastar la evidencia contextual de mayor escala.`
      );
    }
    // Lectura sustantiva del Informe de Salud: qué cubre (secciones parseadas).
    if (input.answers?.healthReport.present && input.answers.healthReport.temas.length > 0) {
      partes.push(
        `La fuente diagnóstica primaria cubre la base oficial del diagnóstico en: ` +
        `${input.answers.healthReport.temas.join("; ")}. Esta lectura sitúa el ` +
        `punto de partida sociodemográfico y epidemiológico; su detalle debe ` +
        `consultarse en el documento original, preservado íntegro.`
      );
    }
    partes.push(...redactarConocimiento(input.answers, ["contexto-territorial"]));
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
      const seleccion = input.indicatorTitles.slice(0, 4);
      partes.push(
        `La evidencia cuantitativa disponible reúne ${input.indicatorCount} ` +
        `indicadores de salud y bienestar procedentes de los estudios complementarios.` +
        (seleccion.length > 0
          ? ` Entre las señales que ordenan la lectura: ${seleccion.join("; ")}` +
            (input.indicatorTitles.length > seleccion.length
              ? `; entre otras (${input.indicatorTitles.length} en total).`
              : ".") +
            ` Estas señales proceden de la evidencia contextual descrita en el ` +
            `capítulo I: orientan sobre patrones plausibles de salud y estilos de ` +
            `vida, pero no miden el ${scopeNoun} ni permiten inferencia directa ` +
            `sobre su población.`
          : "")
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
    // Señales que ordenan la situación de salud (desde la capa de respuestas).
    if ((input.answers?.senalesPresentes.length ?? 0) > 0) {
      partes.push(
        `El diagnóstico apunta a una situación de salud caracterizada, en la ` +
        `evidencia contextual disponible, por señales en: ` +
        `${input.answers!.senalesPresentes.join("; ")}. Estas señales dibujan un ` +
        `patrón de salud percibida, hábitos y bienestar que constituye el punto ` +
        `de partida de la interpretación, siempre dentro de la cautela de escala ` +
        `declarada en el capítulo I.`
      );
    }
    partes.push(...redactarConocimiento(input.answers, ["situacion-salud", "desigualdades"]));
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
        `comunitarios o ambientales específicos del ${scopeNoun} de forma directa. ` +
        `Esta carencia condiciona la lectura, pero no impide la interpretación: ` +
        `la epidemiología social permite formular hipótesis diagnósticas prudentes ` +
        `a partir del patrón de señales disponible.`
      );
    }

    // Lectura desde la epidemiología social: documentado / plausible /
    // no evaluable / a contrastar. Hipótesis, nunca causalidad demostrada.
    const lecturas = input.answers?.determinantes ?? [];
    const plausibles = lecturas.filter((d) => d.kind === "plausible");
    const aContrastar = lecturas.filter((d) => d.kind === "a-contrastar");
    const noEvaluables = lecturas.filter((d) => d.kind === "no-evaluable");
    if (plausibles.length > 0) {
      partes.push(
        `Lectura desde la epidemiología social. La evidencia disponible sugiere, ` +
        `como hipótesis diagnósticas plausibles y pendientes de contraste, que en ` +
        `el patrón observado pueden estar operando: ` +
        plausibles
          .map((d) => `${d.enunciado} (${d.base})`)
          .join("; ") +
        `. Ninguna de estas lecturas constituye causalidad demostrada: son ` +
        `hipótesis trazables que el Grupo Motor y las fuentes territoriales ` +
        `deben contrastar.`
      );
    }
    if (aContrastar.length > 0) {
      partes.push(
        `Determinantes a contrastar: ` +
        aContrastar.map((d) => `${d.enunciado} — ${d.base}`).join("; ") + `.`
      );
    }
    if (noEvaluables.length > 0) {
      partes.push(
        `Determinantes no evaluables con la evidencia actual: ` +
        noEvaluables
          .map((d) => `${d.enunciado} (${d.base})`)
          .join("; ") + `.`
      );
    }
    partes.push(...redactarConocimiento(input.answers, ["determinantes"]));
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
      // Muestra curada: primero los activos que se identifican expresamente con
      // el ámbito; después, los del municipio matriz o del entorno funcional.
      const propios = input.scopeMatchedAssetTitles;
      const resto = input.assetTitles.filter((t) => !propios.includes(t));
      const ordenados = [...propios, ...resto];
      const seleccion = ordenados.slice(0, MAX_EJEMPLOS).join("; ");
      const sufijo =
        ordenados.length > MAX_EJEMPLOS
          ? `; entre otros (${ordenados.length} en total)`
          : "";
      const identificacion =
        propios.length > 0
          ? ` De ellos, ${propios.length} se identifican expresamente con el ` +
            `${scopeNoun}; el resto corresponde al municipio matriz o al entorno ` +
            `funcional, sin que el inventario permita atribuirlos con precisión.`
          : "";
      partes.push(
        `El territorio dispone de ${input.assetCount} activos y recursos para la ` +
        `salud identificados; entre ellos: ${seleccion}${sufijo}.${identificacion} ` +
        `La lectura salutogénica del territorio no se agota en sus déficits: ` +
        `estas capacidades son punto de partida del proceso comunitario.`
      );
      // Lectura salutogénica mínima: capacidades por ámbito, derivadas del
      // contenido real de los activos. Capacidades potenciales, no soluciones.
      const grupos = input.answers?.salutogenica.grupos ?? [];
      if (grupos.length > 0) {
        const top = grupos.slice(0, 4);
        partes.push(
          `La lectura salutogénica identifica concentraciones de capacidad ` +
          `comunitaria en: ` +
          top
            .map((g) => `${g.ambito} (${g.count} recursos; p. ej., ${g.ejemplos.join(", ")})`)
            .join("; ") +
          (grupos.length > top.length || (input.answers?.salutogenica.sinClasificar ?? 0) > 0
            ? `; junto a otros recursos de clasificación menos directa.`
            : `.`) +
          ` Estas concentraciones describen capacidades potenciales del tejido ` +
          `territorial —no prueban cobertura ni resultado— y dialogan con las ` +
          `hipótesis del capítulo IV: allí donde el patrón sugiere ejes de ` +
          `atención, el mapa de activos indica con qué capacidades podría ` +
          `trabajarse en la fase comunitaria.`
        );
      }
      if (input.hasLocalizaAssets) {
        partes.push(
          `Los activos proceden de la consulta de Localiza Salud. ` +
          `En un ámbito inframunicipal pueden incluir recursos del municipio matriz ` +
          `o del entorno funcional más amplio: requieren validación territorial ` +
          `antes de interpretarse como activos propios del ${scopeNoun}.`
        );
      }
      partes.push(...redactarConocimiento(input.answers, ["activos"]));
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
    // Lagunas de conocimiento declaradas por el técnico: información positiva.
    partes.push(...redactarLagunas(input.answers));

    chapters.push({
      numeral: "V",
      title: "Activos, capacidades territoriales e incertidumbres",
      content: partes.join("\n\n"),
    });
  }

  // ── VI. Conclusiones técnicas para la priorización ────────────────────────
  {
    const partes: string[] = [];

    // Síntesis del técnico, si existe: encabeza y modula el cierre diagnóstico.
    if (input.answers?.sintesisTexto) {
      partes.push(
        `Síntesis diagnóstica del equipo técnico. ${input.answers.sintesisTexto}`
      );
    }

    // Conclusión técnica generada: sustantiva, trazable y sin recomendaciones.
    const conclusion: string[] = [];
    if ((input.answers?.senalesPresentes.length ?? 0) > 0) {
      conclusion.push(
        `El diagnóstico apunta a un ${scopeNoun} cuya situación de salud, leída ` +
        `desde la evidencia contextual disponible, se ordena en torno a ` +
        `${input.answers!.senalesPresentes.slice(0, 4).join(", ")}` +
        `${input.answers!.senalesPresentes.length > 4 ? ", entre otras señales" : ""}.`
      );
    }
    const plausiblesVI = (input.answers?.determinantes ?? []).filter(
      (d) => d.kind === "plausible" || d.kind === "a-contrastar"
    );
    if (plausiblesVI.length > 0) {
      conclusion.push(
        `La lectura epidemiológico-social permite formular como hipótesis que ` +
        `en ese patrón pueden estar operando ` +
        plausiblesVI.slice(0, 3).map((d) => d.enunciado).join("; ") +
        `.`
      );
    }
    const gruposVI = input.answers?.salutogenica.grupos ?? [];
    if (gruposVI.length > 0) {
      conclusion.push(
        `Las capacidades territoriales se concentran en ` +
        gruposVI.slice(0, 3).map((g) => g.ambito).join(", ") +
        `, y constituyen la base salutogénica del proceso comunitario.`
      );
    }
    if (input.hasProxyScale) {
      conclusion.push(
        `La principal tensión interpretativa es de escala: buena parte de la ` +
        `evidencia es contextual (provincial u origen externo) y queda pendiente ` +
        `de contraste territorial.`
      );
    }
    if (conclusion.length > 0) {
      partes.push(conclusion.join(" "));
    }

    // Líneas prioritarias diagnósticas: ámbitos que pasan a deliberación.
    const lineas: string[] = [];
    for (const area of input.areasReales) lineas.push(area);
    for (const d of plausiblesVI.slice(0, 2)) {
      lineas.push(`contraste territorial de la hipótesis sobre ${d.enunciado}`);
    }
    if (input.hasProxyScale) {
      lineas.push(
        `construcción de evidencia propia del ${scopeNoun} que confirme o matice el patrón contextual`
      );
    }
    if (lineas.length > 0) {
      partes.push(
        `Ámbitos diagnósticos que pasan a deliberación como prioridades ` +
        `diagnósticas potenciales: ` +
        lineas.map((l, i) => `${i + 1}) ${l}`).join("; ") +
        `. Son candidaturas para la deliberación con el Grupo Motor, ` +
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
    partes.push(...redactarConocimiento(input.answers, ["sintesis", "preparacion-deliberativa"]));

    // Cierre único: frontera de fase y validación. (Única mención a la autoría
    // pendiente en todo el documento: el Grupo Motor valida y prioriza, no
    // redacta el diagnóstico desde cero.)
    partes.push(
      "Este capítulo cierra el diagnóstico: no formula recomendaciones, " +
      "actuaciones ni programas. La traducción a prioridades y acciones " +
      "corresponde a las fases posteriores del proceso de planificación. " +
      "Corresponde al equipo técnico validar, matizar y asumir la autoría de " +
      "esta síntesis; al Grupo Motor, contrastarla y priorizar."
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

/**
 * Operación inversa de renderNarrativeChapters: recupera los capítulos desde
 * el texto del documento (generado o de autoría humana que conserve la
 * estructura). Si el texto no tiene estructura de capítulos reconocible,
 * devuelve una lista vacía y quien llama debe usar el texto íntegro.
 */
export function parseNarrativeChapters(text: string): NarrativeChapter[] {
  const segments = text.split("\n\n\n");
  const chapters: NarrativeChapter[] = [];
  for (const segment of segments) {
    const headerEnd = segment.indexOf("\n\n");
    if (headerEnd === -1) return [];
    const header = segment.slice(0, headerEnd).trim();
    const match = /^([IVX]+)\.\s+(.+)$/.exec(header);
    if (match === null) return [];
    chapters.push({
      numeral: match[1],
      title: match[2],
      content: segment.slice(headerEnd + 2).trim(),
    });
  }
  return chapters.length >= 2 ? chapters : [];
}
