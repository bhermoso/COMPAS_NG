import type {
  HealthReportSection,
  HealthReportSectionKey,
} from "../../domain/health-report";

// ── Filtro de entradas de índice (TOC) ────────────────────────────────────
// Las líneas del índice incluyen tabulación seguida de número de página.
// Se excluyen para que no actúen como falsos encabezados de sección.
const TOC_LINE_RE = /\t\d+\s*$/;

// ── Patrones de encabezado ────────────────────────────────────────────────
// Formato A — "N.- Título"    (Atarfe, Informe de Situación de Salud)
const NDASH_RE = /^(\d+)\.-\s+(.+)$/;

// Formato B — "N. TÍTULO"     (Zagra RELAS — secciones arábigo all-caps)
// Requiere que el título sea predominantemente mayúsculas para no confundir
// con "1.4 ESTRUCTURA..." (subsección) ni con datos de tabla.
const NDOT_CAPS_RE = /^(\d+)\.\s+(.{3,})$/;

// Formato C — "X. TÍTULO"     (Zagra RELAS — secciones romano all-caps)
// Mismo criterio: título all-caps distingue de etiquetas CIE-10 mixed-case.
const ROMAN_CAPS_RE = /^([IVXLC]+)\.\s+(.{3,})$/;

// ── Vocabulario semántico ──────────────────────────────────────────────────
// Relaciona palabras clave del título con HealthReportSectionKey.
// Orden de evaluación: del más específico al más general.
const SEMANTIC_MAP: Array<{ test: RegExp; key: HealthReportSectionKey }> = [
  { test: /diagn[oó]stico de salud/i,                              key: "resultados"  },
  { test: /resultado/i,                                            key: "resultados"  },
  { test: /mortalidad/i,                                           key: "mortalidad"  },
  { test: /morbilidad/i,                                           key: "morbilidad"  },
  { test: /c[aá]ncer/i,                                            key: "cancer"      },
  { test: /edo|enfermedades de declaraci[oó]n|its|transmisi[oó]n/i, key: "edo-its"   },
  { test: /vacuna|cribado|coberturas? prevent/i,                   key: "vacunacion-cribados" },
  { test: /discusi[oó]n/i,                                         key: "discusion"   },
  { test: /conclusi/i,                                             key: "conclusiones" },
  { test: /objetivo/i,                                             key: "objetivo"    },
  { test: /metodolog/i,                                            key: "metodologia" },
  { test: /introduc|marco (legal|normativo|conceptual|actuac)/i,  key: "introduccion" },
  { test: /justificac/i,                                           key: "introduccion" },
  { test: /demograf/i,                                             key: "demografia"  },
  { test: /autor[ií]a|autoría|firmante|epidemi[oó]log/i,          key: "autores"     },
];

function resolveKey(title: string): HealthReportSectionKey {
  for (const { test, key } of SEMANTIC_MAP) {
    if (test.test(title)) return key;
  }
  return "other";
}

// ── Detección de capitalización predominante ───────────────────────────────
// Una línea es "all-caps" si más del 70% de sus letras son mayúsculas.
// Permite distinguir "MARCO DE ACTUACIÓN" (sección real) de
// "Enfermedades del sistema circulatorio" (etiqueta CIE-10 en tabla).
function isPredominantlyUppercase(text: string): boolean {
  const letters = text.replace(/[^a-záéíóúñA-ZÁÉÍÓÚÑ]/g, "");
  if (letters.length < 3) return false;
  const upper = letters.replace(/[^A-ZÁÉÍÓÚÑ]/g, "");
  return upper.length / letters.length >= 0.70;
}

// ── Formatos reconocidos ───────────────────────────────────────────────────
type DocFormat = "nDash" | "relas" | "unknown";

interface HeadingHit {
  lineIndex: number;
  title: string;
  key: HealthReportSectionKey;
}

// ── Detección de formato ───────────────────────────────────────────────────
// Lee las primeras 200 líneas no vacías y no-TOC para determinar el patrón dominante.
function detectFormat(nonTocLines: string[]): DocFormat {
  const sample = nonTocLines.slice(0, 200);
  const nDash = sample.filter(l => NDASH_RE.test(l.trim())).length;
  const nDotCaps = sample.filter(l => {
    const m = NDOT_CAPS_RE.exec(l.trim());
    return m !== null && isPredominantlyUppercase(m[2]);
  }).length;
  const romanCaps = sample.filter(l => {
    const m = ROMAN_CAPS_RE.exec(l.trim());
    return m !== null && isPredominantlyUppercase(m[2]);
  }).length;

  if (nDash >= 3) return "nDash";
  if (nDotCaps >= 2 || romanCaps >= 1) return "relas";
  return "unknown";
}

// ── Extracción de encabezados según formato ────────────────────────────────
function extractHitsNDash(lines: string[]): HeadingHit[] {
  const hits: HeadingHit[] = [];
  for (let i = 0; i < lines.length; i++) {
    const m = NDASH_RE.exec(lines[i].trim());
    if (m) {
      hits.push({ lineIndex: i, title: m[2].trim(), key: resolveKey(m[2]) });
    }
  }
  return hits;
}

function extractHitsRelas(lines: string[]): HeadingHit[] {
  const hits: HeadingHit[] = [];
  for (let i = 0; i < lines.length; i++) {
    const t = lines[i].trim();
    if (TOC_LINE_RE.test(lines[i])) continue;

    // Encabezado romano all-caps
    const mRoman = ROMAN_CAPS_RE.exec(t);
    if (mRoman && isPredominantlyUppercase(mRoman[2])) {
      hits.push({ lineIndex: i, title: mRoman[2].trim(), key: resolveKey(mRoman[2]) });
      continue;
    }

    // Encabezado arábigo all-caps (solo nivel 1: "N. TÍTULO", no "N.N TÍTULO")
    const mDot = NDOT_CAPS_RE.exec(t);
    if (mDot && isPredominantlyUppercase(mDot[2]) && !/^\d+\.\d+/.test(t)) {
      hits.push({ lineIndex: i, title: mDot[2].trim(), key: resolveKey(mDot[2]) });
    }
  }
  return hits;
}

// ── Sección de autoría ──────────────────────────────────────────────────────
// Detecta el bloque de firmantes al final del documento.
// Compatible con el formato "Nombre. Epidemiólogo/a..." (Atarfe).
const AUTHOR_SIGNATURE_RE = /[.,]\s*Epidemiólog/i;

function findAuthorLine(lines: string[], fromIndex: number): number {
  for (let i = fromIndex; i < lines.length; i++) {
    if (AUTHOR_SIGNATURE_RE.test(lines[i])) return i;
  }
  return -1;
}

// ── Segmentación de secciones ──────────────────────────────────────────────
function buildSections(
  allLines: string[],
  hits: HeadingHit[],
  html: string | undefined,
  hasAuthorSignature: boolean
): HealthReportSection[] {
  if (hits.length === 0) return [];

  const lastHit = hits[hits.length - 1];
  const authorLine = hasAuthorSignature
    ? findAuthorLine(allLines, lastHit.lineIndex + 1)
    : -1;

  const sections: HealthReportSection[] = [];
  let order = 0;

  // Portada: texto previo al primer encabezado detectado
  const titleText = allLines.slice(0, hits[0].lineIndex).join("\n").trim();
  if (titleText.length > 0) {
    sections.push({
      key: "title-page",
      title: "Portada",
      bodyText: titleText,
      bodyHtml: html !== undefined ? htmlSlice(html, null, hits[0].title) : undefined,
      sortOrder: order++,
      isAuthoritative: true,
    });
  }

  // Secciones principales
  for (let i = 0; i < hits.length; i++) {
    const hit = hits[i];
    const nextHit = hits[i + 1] ?? null;
    const endLine =
      nextHit !== null ? nextHit.lineIndex
      : authorLine !== -1 ? authorLine
      : allLines.length;

    sections.push({
      key: hit.key,
      title: hit.title,
      bodyText: allLines.slice(hit.lineIndex, endLine).join("\n").trim(),
      bodyHtml: html !== undefined
        ? htmlSlice(html, hit.title, nextHit?.title ?? null)
        : undefined,
      sortOrder: order++,
      isAuthoritative: true,
    });
  }

  // Sección de autoría
  if (authorLine !== -1) {
    const authorText = allLines.slice(authorLine).join("\n").trim();
    if (authorText.length > 0) {
      sections.push({
        key: "autores",
        title: "Autoría",
        bodyText: authorText,
        bodyHtml: undefined,
        sortOrder: order,
        isAuthoritative: true,
      });
    }
  }

  return sections;
}

// ── Interfaz pública ───────────────────────────────────────────────────────
export interface ParseHealthReportSectionsInput {
  text: string;
  html?: string;
}

export function parseHealthReportSections(
  input: ParseHealthReportSectionsInput
): HealthReportSection[] {
  const rawLines = input.text.split("\n");

  // Separar líneas sin TOC para detección de formato y extracción de encabezados
  const cleanLines = rawLines.map(l => (TOC_LINE_RE.test(l) ? "" : l));

  const format = detectFormat(cleanLines.filter(l => l.trim()));
  let hits: HeadingHit[];

  switch (format) {
    case "nDash":
      hits = extractHitsNDash(cleanLines);
      break;
    case "relas":
      hits = extractHitsRelas(cleanLines);
      break;
    default:
      // Formato desconocido: fallback a sección única
      return [fallbackSection(input.text, input.html)];
  }

  if (hits.length < 2) {
    // Demasiado pocas secciones: no merece segmentar
    return [fallbackSection(input.text, input.html)];
  }

  // Detección de autoría solo en formato nDash (Atarfe); en RELAS no se usa
  const hasAuthorSignature = format === "nDash";

  const sections = buildSections(cleanLines, hits, input.html, hasAuthorSignature);
  return sections.length > 0 ? sections : [fallbackSection(input.text, input.html)];
}

// ── Fallback ───────────────────────────────────────────────────────────────
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

// ── Segmentación HTML ──────────────────────────────────────────────────────
// Extrae la porción de HTML entre dos anclas textuales (título de sección).
// Si el ancla no está en el HTML, devuelve undefined (el viewer usa bodyText).
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
