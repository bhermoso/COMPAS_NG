import type {
  HealthReportSection,
  HealthReportSectionKey,
} from "../../domain/health-report";

interface AnchorDef {
  readonly key: HealthReportSectionKey;
  readonly anchor: string;
  readonly title: string;
}

// Anclas textuales exactas tal como aparecen en los informes del Distrito Granada-Metro.
// Las secciones llevan numeración "N.-" seguida del nombre con tilde.
const SECTION_ANCHORS: readonly AnchorDef[] = [
  { key: "introduccion", anchor: "1.- Introducción", title: "1.- Introducción" },
  { key: "objetivo",     anchor: "2.- Objetivo",     title: "2.- Objetivo"     },
  { key: "metodologia",  anchor: "3.- Metodología",  title: "3.- Metodología"  },
  { key: "resultados",   anchor: "4.- Resultados",   title: "4.- Resultados"   },
  { key: "discusion",    anchor: "5.- Discusión",    title: "5.- Discusión"    },
  { key: "conclusiones", anchor: "6.- Conclusiones", title: "6.- Conclusiones" },
];

// Detecta líneas de firma de autoría: "Nombre. Epidemiólogo/a ..."
// El patrón requiere un separador (. o ,) antes de la palabra para evitar
// falsos positivos en texto epidemiológico del cuerpo.
const AUTHOR_SIGNATURE_PATTERN = /[.,]\s*Epidemiólog/i;

export interface ParseHealthReportSectionsInput {
  text: string;
  html?: string;
}

export function parseHealthReportSections(
  input: ParseHealthReportSectionsInput
): HealthReportSection[] {
  const lines = input.text.split("\n");

  // Localizar líneas ancla
  const hits: Array<{ def: AnchorDef; lineIndex: number }> = [];
  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    for (const def of SECTION_ANCHORS) {
      if (trimmed === def.anchor) {
        hits.push({ def, lineIndex: i });
        break;
      }
    }
  }

  // Sin anclas → documento íntegro como sección única
  if (hits.length === 0) {
    return [fallbackSection(input.text, input.html)];
  }

  // Detectar inicio del bloque de autores tras la última sección
  const lastHit = hits[hits.length - 1];
  let authorLine = -1;
  for (let i = lastHit.lineIndex + 1; i < lines.length; i++) {
    if (AUTHOR_SIGNATURE_PATTERN.test(lines[i])) {
      authorLine = i;
      break;
    }
  }

  const sections: HealthReportSection[] = [];
  let order = 0;

  // Portada: texto anterior a la primera ancla
  const titleText = lines.slice(0, hits[0].lineIndex).join("\n").trim();
  if (titleText) {
    sections.push({
      key: "title-page",
      title: "Portada",
      bodyText: titleText,
      bodyHtml: input.html !== undefined
        ? htmlSlice(input.html, null, hits[0].def.anchor)
        : undefined,
      sortOrder: order++,
      isAuthoritative: true,
    });
  }

  // Secciones principales
  for (let i = 0; i < hits.length; i++) {
    const hit = hits[i];
    const endLine =
      i < hits.length - 1
        ? hits[i + 1].lineIndex
        : authorLine !== -1
          ? authorLine
          : lines.length;

    const nextAnchor = i < hits.length - 1 ? hits[i + 1].def.anchor : null;

    sections.push({
      key: hit.def.key,
      title: hit.def.title,
      bodyText: lines.slice(hit.lineIndex, endLine).join("\n").trim(),
      // bodyHtml: segmento desde esta ancla hasta la siguiente en el HTML.
      // Limitación: si la última sección (conclusiones) no tiene ancla de cierre,
      // el slice incluirá el bloque de autores del HTML — bodyText sí está limpio.
      bodyHtml: input.html !== undefined
        ? htmlSlice(input.html, hit.def.anchor, nextAnchor)
        : undefined,
      sortOrder: order++,
      isAuthoritative: true,
    });
  }

  // Sección de autoría
  if (authorLine !== -1) {
    const authorText = lines.slice(authorLine).join("\n").trim();
    if (authorText) {
      sections.push({
        key: "autores",
        title: "Autoría",
        bodyText: authorText,
        // bodyHtml: no se extrae porque la posición HTML de las firmas no es
        // localizable de forma fiable sin conocer los nombres a priori.
        bodyHtml: undefined,
        sortOrder: order++,
        isAuthoritative: true,
      });
    }
  }

  return sections.length > 0 ? sections : [fallbackSection(input.text, input.html)];
}

function fallbackSection(text: string, html?: string): HealthReportSection {
  return {
    key: "other",
    title: "Documento completo",
    bodyText: text,
    bodyHtml: html,
    sortOrder: 0,
    isAuthoritative: true,
  };
}

// Extrae la porción de HTML comprendida entre dos anclas textuales.
// Retrocede al <p> o <div> más cercano antes del ancla para no cortar en mitad de una etiqueta.
// Si no puede localizar el ancla, devuelve undefined.
function htmlSlice(
  html: string,
  startAnchor: string | null,
  endAnchor: string | null
): string | undefined {
  const start = startAnchor === null ? 0 : htmlTagStart(html, startAnchor);
  if (startAnchor !== null && start === -1) return undefined;

  if (endAnchor === null) {
    const slice = html.slice(start).trim();
    return slice || undefined;
  }

  const end = htmlTagStart(html, endAnchor);
  const slice = (end === -1 ? html.slice(start) : html.slice(start, end)).trim();
  return slice || undefined;
}

function htmlTagStart(html: string, anchor: string): number {
  const idx = html.indexOf(anchor);
  if (idx === -1) return -1;
  const pIdx = html.lastIndexOf("<p", idx);
  const divIdx = html.lastIndexOf("<div", idx);
  const tagIdx = Math.max(pIdx, divIdx);
  return tagIdx !== -1 ? tagIdx : idx;
}
