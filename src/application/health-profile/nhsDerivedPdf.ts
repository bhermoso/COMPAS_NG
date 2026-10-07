import { jsPDF } from "jspdf";
import type { CanonicalProfileDocument } from "./canonicalProfileDocument";
import {
  projectNHSDerived,
  type NHSDerivedAgendaItem,
  type NHSDerivedInformeRanking,
  type NHSDerivedProjection,
  type NHSDerivedRow,
  type NHSDerivedSourceBlock,
  type NHSDerivedTerritorialReading,
} from "./nhsDerivedProjection";

const PAGE = { width: 210, height: 297 };
const MARGIN = { top: 16, bottom: 16, left: 16, right: 16 };
const WIDTH = PAGE.width - MARGIN.left - MARGIN.right;
const FOOTER_Y = PAGE.height - 8;

const BLUE: [number, number, number] = [0, 116, 200];
const DARK_BLUE: [number, number, number] = [20, 57, 91];
const TEAL: [number, number, number] = [0, 166, 166];
const AMBER: [number, number, number] = [255, 182, 27];
const RED: [number, number, number] = [220, 20, 60];
const TEXT: [number, number, number] = [35, 47, 62];
const MUTED: [number, number, number] = [82, 96, 112];
const LINE: [number, number, number] = [214, 226, 238];

interface Cursor {
  y: number;
}

type Projection = Extract<NHSDerivedProjection, { available: true }>;

function toPdfText(text: string): string {
  return text
    .replace(/≥/g, ">=")
    .replace(/≤/g, "<=")
    .replace(/≈/g, "~")
    .replace(/[–—]/g, "-")
    .replace(/→/g, "->")
    .replace(/…/g, "...")
    .replace(/•/g, "-")
    .replace(/\u00a0/g, " ");
}

function ensureSpace(doc: jsPDF, cursor: Cursor, needed: number): void {
  if (cursor.y + needed > PAGE.height - MARGIN.bottom) {
    doc.addPage();
    cursor.y = MARGIN.top;
  }
}

function addText(
  doc: jsPDF,
  cursor: Cursor,
  text: string,
  opts: {
    size?: number;
    bold?: boolean;
    italic?: boolean;
    color?: [number, number, number];
    spacingAfter?: number;
    width?: number;
    x?: number;
  } = {}
): void {
  const size = opts.size ?? 9.2;
  const lineHeight = size * 0.45;
  doc.setFont("helvetica", opts.bold ? "bold" : opts.italic ? "italic" : "normal");
  doc.setFontSize(size);
  doc.setTextColor(...(opts.color ?? TEXT));
  const lines = doc.splitTextToSize(toPdfText(text), opts.width ?? WIDTH) as string[];
  ensureSpace(doc, cursor, lines.length * lineHeight + 1);
  doc.text(lines, opts.x ?? MARGIN.left, cursor.y, { baseline: "top" });
  cursor.y += lines.length * lineHeight + (opts.spacingAfter ?? 2.4);
}

function writeWrappedAt(
  doc: jsPDF,
  text: string,
  x: number,
  y: number,
  width: number,
  opts: {
    size?: number;
    bold?: boolean;
    italic?: boolean;
    color?: [number, number, number];
    maxLines?: number;
  } = {}
): number {
  const size = opts.size ?? 8.5;
  const lineHeight = size * 0.45;
  doc.setFont("helvetica", opts.bold ? "bold" : opts.italic ? "italic" : "normal");
  doc.setFontSize(size);
  doc.setTextColor(...(opts.color ?? TEXT));
  const lines = doc.splitTextToSize(toPdfText(text), width) as string[];
  const visible = opts.maxLines === undefined ? lines : lines.slice(0, opts.maxLines);
  if (opts.maxLines !== undefined && lines.length > visible.length && visible.length > 0) {
    visible[visible.length - 1] = `${visible[visible.length - 1].replace(/[.,;:]?$/, "")}...`;
  }
  doc.text(visible, x, y, { baseline: "top" });
  return visible.length * lineHeight;
}

function addRule(doc: jsPDF, y: number, color: [number, number, number] = LINE): void {
  doc.setDrawColor(...color);
  doc.setLineWidth(0.25);
  doc.line(MARGIN.left, y, MARGIN.left + WIDTH, y);
}

function addPageKicker(
  doc: jsPDF,
  cursor: Cursor,
  section: string,
  title: string,
  note?: string
): void {
  ensureSpace(doc, cursor, 18);
  doc.setFillColor(...BLUE);
  doc.rect(MARGIN.left, cursor.y, 20, 1.4, "F");
  cursor.y += 4;
  addText(doc, cursor, section.toUpperCase(), {
    size: 7.3,
    bold: true,
    color: BLUE,
    spacingAfter: 1,
  });
  addText(doc, cursor, title, {
    size: 14,
    bold: true,
    color: DARK_BLUE,
    spacingAfter: note === undefined ? 5 : 2,
  });
  if (note !== undefined) {
    addText(doc, cursor, note, { size: 8.2, color: MUTED, spacingAfter: 5 });
  }
}

function addCard(
  doc: jsPDF,
  x: number,
  y: number,
  w: number,
  h: number,
  tone: [number, number, number],
  title: string,
  body: string,
  label?: string
): void {
  doc.setDrawColor(210, 226, 240);
  doc.setFillColor(248, 251, 255);
  doc.roundedRect(x, y, w, h, 2, 2, "FD");
  doc.setFillColor(...tone);
  doc.rect(x, y, w, 2.3, "F");
  let ty = y + 6;
  if (label !== undefined) {
    writeWrappedAt(doc, label.toUpperCase(), x + 3, ty, w - 6, {
      size: 6.6,
      bold: true,
      color: tone,
      maxLines: 1,
    });
    ty += 4.4;
  }
  ty += writeWrappedAt(doc, title, x + 3, ty, w - 6, {
    size: 9,
    bold: true,
    color: DARK_BLUE,
    maxLines: 2,
  }) + 1.5;
  writeWrappedAt(doc, body, x + 3, ty, w - 6, {
    size: 7.8,
    color: MUTED,
    maxLines: Math.max(2, Math.floor((h - (ty - y) - 4) / 3.7)),
  });
}

function addMetricGrid(doc: jsPDF, cursor: Cursor, metrics: Array<{ value: string; label: string }>): void {
  ensureSpace(doc, cursor, 25);
  const gap = 3;
  const w = (WIDTH - gap * (metrics.length - 1)) / metrics.length;
  const y = cursor.y;
  metrics.forEach((metric, index) => {
    const x = MARGIN.left + index * (w + gap);
    doc.setDrawColor(199, 223, 243);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(x, y, w, 21, 1.8, 1.8, "FD");
    writeWrappedAt(doc, metric.value, x + 3, y + 4, w - 6, {
      size: metric.value.length > 16 ? 7.8 : 12.5,
      bold: true,
      color: BLUE,
      maxLines: 2,
    });
    writeWrappedAt(doc, metric.label, x + 3, y + 13, w - 6, {
      size: 7,
      bold: true,
      color: MUTED,
      maxLines: 2,
    });
  });
  cursor.y += 26;
}

function shorten(text: string, max = 300): string {
  if (text.length <= max) return text;
  const base = text.slice(0, max);
  const stop = Math.max(base.lastIndexOf("."), base.lastIndexOf(";"), base.lastIndexOf(","));
  return `${base.slice(0, stop > 150 ? stop : max).trim()}...`;
}

function statusLabel(status: string): string {
  if (status === "integrated") return "lectura territorial integrada";
  if (status === "prioritization-pending") return "lectura territorial pendiente";
  return "lectura declarada";
}

function parseNumber(value: string): number | null {
  const match = value.replace(",", ".").match(/-?\d+(?:\.\d+)?/);
  if (match === null) return null;
  const parsed = Number(match[0]);
  return Number.isFinite(parsed) ? parsed : null;
}

function spinePoints(row: NHSDerivedRow): Array<{ label: string; value: number; color: [number, number, number] }> {
  const local = parseNumber(row.valor);
  const province = parseNumber(row.refGranada);
  const andalusia = parseNumber(row.refAndalucia);
  return [
    ...(local === null ? [] : [{ label: "Territorio", value: local, color: BLUE }]),
    ...(province === null ? [] : [{ label: "Provincia", value: province, color: TEAL }]),
    ...(andalusia === null ? [] : [{ label: "Andalucía", value: andalusia, color: AMBER }]),
  ];
}

function addLegend(doc: jsPDF, cursor: Cursor): void {
  ensureSpace(doc, cursor, 9);
  const items = [
    { label: "Territorio", color: BLUE },
    { label: "Provincia", color: TEAL },
    { label: "Andalucía", color: AMBER },
  ] as const;
  let x = MARGIN.left;
  for (const item of items) {
    doc.setFillColor(...item.color);
    doc.circle(x + 1.5, cursor.y + 2.2, 1.5, "F");
    writeWrappedAt(doc, item.label, x + 5, cursor.y, 33, { size: 7.3, bold: true, color: MUTED, maxLines: 1 });
    x += 41;
  }
  cursor.y += 8;
}

function addIndicatorSpine(doc: jsPDF, cursor: Cursor, rows: NHSDerivedRow[]): void {
  addPageKicker(
    doc,
    cursor,
    "Health summary",
    "Indicadores comparables y spine chart adaptado",
    "Cada fila muestra los valores declarados en el trazador canónico. La espina coloca valores; no interpreta por sí sola si una cifra es favorable o desfavorable."
  );
  addLegend(doc, cursor);

  const headerY = cursor.y;
  doc.setFillColor(241, 247, 253);
  doc.rect(MARGIN.left, headerY, WIDTH, 8, "F");
  writeWrappedAt(doc, "Indicador", MARGIN.left + 2, headerY + 2, 61, { size: 7.2, bold: true, color: DARK_BLUE });
  writeWrappedAt(doc, "Valor", MARGIN.left + 66, headerY + 2, 23, { size: 7.2, bold: true, color: DARK_BLUE });
  writeWrappedAt(doc, "Referencia", MARGIN.left + 92, headerY + 2, 32, { size: 7.2, bold: true, color: DARK_BLUE });
  writeWrappedAt(doc, "Spine chart", MARGIN.left + 128, headerY + 2, 45, { size: 7.2, bold: true, color: DARK_BLUE });
  cursor.y += 10;

  for (const row of rows) {
    ensureSpace(doc, cursor, 18);
    const y = cursor.y;
    writeWrappedAt(doc, row.indicador, MARGIN.left + 2, y, 60, {
      size: 7.4,
      bold: true,
      color: TEXT,
      maxLines: 2,
    });
    writeWrappedAt(doc, row.valor, MARGIN.left + 66, y, 22, { size: 7.3, color: TEXT, maxLines: 2 });
    writeWrappedAt(doc, `${row.refGranada} / ${row.refAndalucia}`, MARGIN.left + 92, y, 32, {
      size: 7,
      color: MUTED,
      maxLines: 2,
    });
    const points = spinePoints(row);
    const railX = MARGIN.left + 130;
    const railY = y + 4.5;
    const railW = 42;
    doc.setDrawColor(199, 211, 225);
    doc.setLineWidth(1.1);
    doc.line(railX, railY, railX + railW, railY);
    if (points.length >= 2) {
      const values = points.map((p) => p.value);
      const min = Math.min(...values);
      const max = Math.max(...values);
      for (const point of points) {
        const pos = max === min ? 0.5 : (point.value - min) / (max - min);
        doc.setFillColor(...point.color);
        doc.circle(railX + pos * railW, railY, 1.8, "F");
      }
    } else {
      writeWrappedAt(doc, "sin valores numéricos", railX, y + 1.2, railW, {
        size: 6.5,
        color: MUTED,
        maxLines: 1,
      });
    }
    cursor.y += 14;
    addRule(doc, cursor.y - 1.3, [230, 236, 244]);
  }
}

function addEvidenceSpine(doc: jsPDF, cursor: Cursor, ranking: NHSDerivedInformeRanking | null): void {
  addPageKicker(
    doc,
    cursor,
    "Health summary",
    "Sin spine chart cuantitativo: espina de evidencia disponible",
    "El documento no contiene indicadores comparables con territorio, provincia y Andalucía. En su lugar se muestra el peso textual de los asuntos del Informe, como orientación pública y no como prevalencia."
  );
  if (ranking === null || ranking.items.length === 0) {
    addText(doc, cursor, "No hay ranking textual del Informe disponible en el sello canónico.", { size: 9 });
    return;
  }
  const labelW = 72;
  const barW = WIDTH - labelW - 22;
  for (const item of ranking.items) {
    ensureSpace(doc, cursor, 8);
    writeWrappedAt(doc, item.etiqueta, MARGIN.left, cursor.y + 0.4, labelW - 3, {
      size: 7.8,
      bold: true,
      color: TEXT,
      maxLines: 1,
    });
    doc.setFillColor(232, 240, 248);
    doc.roundedRect(MARGIN.left + labelW, cursor.y + 1.2, barW, 4, 1.5, 1.5, "F");
    doc.setFillColor(...BLUE);
    doc.roundedRect(
      MARGIN.left + labelW,
      cursor.y + 1.2,
      Math.max(2, (item.valor / Math.max(1, item.max)) * barW),
      4,
      1.5,
      1.5,
      "F"
    );
    writeWrappedAt(doc, String(item.valor), MARGIN.left + labelW + barW + 3, cursor.y + 0.5, 14, {
      size: 7.8,
      bold: true,
      color: BLUE,
      maxLines: 1,
    });
    cursor.y += 7;
  }
  addText(doc, cursor, ranking.caption, { size: 7.8, italic: true, color: MUTED, spacingAfter: 1.4 });
  addText(doc, cursor, ranking.unidad, { size: 7.8, color: MUTED });
}

function addSourceTable(doc: jsPDF, cursor: Cursor, blocks: NHSDerivedSourceBlock[]): void {
  addPageKicker(
    doc,
    cursor,
    "Evidence base",
    "Fuentes, alcance y límites de lectura",
    "Los perfiles británicos reúnen información existente; aquí se declara qué existe en COMPÁS y qué no puede leerse todavía."
  );
  for (const block of blocks) {
    ensureSpace(doc, cursor, 22);
    addText(doc, cursor, block.title, { size: 10, bold: true, color: DARK_BLUE, spacingAfter: 1 });
    addText(doc, cursor, `Aporta: ${block.whatItAdds}`, { size: 8.4, spacingAfter: 0.8 });
    addText(doc, cursor, `No permite leer: ${block.whatItDoesNotAllow}`, {
      size: 8.4,
      color: MUTED,
      spacingAfter: 3.2,
    });
  }
}

function addOverviewCards(doc: jsPDF, cursor: Cursor, projection: Projection): void {
  if (projection.overview.length === 0) return;
  addPageKicker(doc, cursor, "At a glance", "Tres mensajes de entrada");
  const gap = 4;
  const cardW = (WIDTH - gap * 2) / 3;
  const y = cursor.y;
  projection.overview.slice(0, 3).forEach((item, index) => {
    const tone = item.variant === "activo" ? TEAL : item.variant === "equidad" ? RED : BLUE;
    addCard(doc, MARGIN.left + index * (cardW + gap), y, cardW, 58, tone, item.title, item.text, item.source);
  });
  cursor.y += 64;
}

function addReadings(doc: jsPDF, cursor: Cursor, readings: NHSDerivedTerritorialReading[]): void {
  if (readings.length === 0) return;
  addPageKicker(
    doc,
    cursor,
    "Local story",
    "Lecturas territoriales y preguntas de contraste",
    "La salida conserva el tono de conversación pública: indica asuntos, mecanismos plausibles y preguntas que conviene contrastar con población y servicios."
  );
  for (const reading of readings.slice(0, 5)) {
    ensureSpace(doc, cursor, 25);
    addText(doc, cursor, reading.title, { size: 10, bold: true, color: DARK_BLUE, spacingAfter: 1 });
    addText(doc, cursor, shorten(reading.reading, 270), { size: 8.4, color: TEXT, spacingAfter: 1 });
    addText(doc, cursor, reading.groupMotorQuestion, {
      size: 8.3,
      italic: true,
      color: BLUE,
      spacingAfter: 3.5,
    });
  }
}

function addAgenda(doc: jsPDF, cursor: Cursor, agenda: NHSDerivedAgendaItem[]): void {
  if (agenda.length === 0) return;
  addPageKicker(doc, cursor, "For discussion", "Preguntas que abren desigualdad y acceso real");
  const gap = 4;
  const cardW = (WIDTH - gap) / 2;
  let x = MARGIN.left;
  let y = cursor.y;
  agenda.slice(0, 4).forEach((item, index) => {
    if (index > 0 && index % 2 === 0) {
      x = MARGIN.left;
      y += 55;
    }
    addCard(doc, x, y, cardW, 50, item.variant === "equidad" ? RED : AMBER, item.tema, item.pregunta, item.senal);
    x += cardW + gap;
  });
  cursor.y = y + 57;
}

function addGaps(doc: jsPDF, cursor: Cursor, projection: Projection): void {
  const gaps = [
    ...(projection.pendingDeclaration !== null ? [projection.pendingDeclaration] : []),
    ...(projection.documentaryBase?.scaleWarnings ?? []),
    ...projection.methodologicalCautions.map((c) => c.text),
  ];
  if (gaps.length === 0) return;
  addPageKicker(doc, cursor, "Data notes", "Qué no debe prometer esta ficha");
  for (const gap of gaps.slice(0, 5)) {
    addText(doc, cursor, `- ${gap}`, { size: 8.3, color: [75, 85, 99], spacingAfter: 2 });
  }
}

function addFooter(doc: jsPDF): void {
  const total = doc.getNumberOfPages();
  for (let page = 1; page <= total; page++) {
    doc.setPage(page);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(`COMPÁS NG · Perfil LHP · ${page} / ${total}`, PAGE.width / 2, FOOTER_Y, {
      align: "center",
    });
  }
}

function slug(text: string): string {
  const clean = text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return clean || "territorio";
}

function addCover(doc: jsPDF, cursor: Cursor, projection: Projection): void {
  doc.setFillColor(...BLUE);
  doc.rect(0, 0, PAGE.width, 12, "F");
  cursor.y = MARGIN.top + 4;
  addText(doc, cursor, "Local Health Profile", {
    size: 19,
    bold: true,
    color: DARK_BLUE,
    spacingAfter: 1,
  });
  addText(doc, cursor, projection.territory, {
    size: 16,
    bold: true,
    color: BLUE,
    spacingAfter: 2,
  });
  addText(
    doc,
    cursor,
    "Ficha breve inspirada en los Local Authority Health Profiles de OHID/Fingertips, adaptada a la evidencia sellada en COMPÁS NG.",
    { size: 9, italic: true, color: MUTED, spacingAfter: 7 }
  );
  addMetricGrid(doc, cursor, [
    { value: String(projection.documentaryBase?.evidenceAtoms ?? "-"), label: "evidencias selladas" },
    { value: String(projection.rows.length), label: "indicadores comparables" },
    { value: String(projection.sourceBlocks.length), label: "familias de fuente" },
    { value: statusLabel(projection.readingStatus), label: projection.generatedDateLabel || "fecha no disponible" },
  ]);
  addOverviewCards(doc, cursor, projection);
}

export function nhsDerivedPdfFileName(doc: CanonicalProfileDocument | null): string {
  const projection = projectNHSDerived(doc);
  if (!projection.available) return "perfil-lhp.pdf";
  return `perfil-lhp-${slug(projection.territory)}.pdf`;
}

export function buildNHSDerivedPdf(doc: CanonicalProfileDocument | null): jsPDF {
  const projection = projectNHSDerived(doc);
  const pdf = new jsPDF({ unit: "mm", format: "a4" });
  const cursor: Cursor = { y: MARGIN.top };

  if (!projection.available) {
    addText(pdf, cursor, "Local Health Profile", {
      size: 18,
      bold: true,
      color: DARK_BLUE,
      spacingAfter: 4,
    });
    addText(pdf, cursor, "No hay documento canónico sellado disponible para exportar.", { size: 10 });
    addFooter(pdf);
    return pdf;
  }

  addCover(pdf, cursor, projection);

  pdf.addPage();
  cursor.y = MARGIN.top;
  if (projection.rows.length > 0) {
    addIndicatorSpine(pdf, cursor, projection.rows);
  } else {
    addEvidenceSpine(pdf, cursor, projection.informeSignalRanking);
  }

  pdf.addPage();
  cursor.y = MARGIN.top;
  addSourceTable(pdf, cursor, projection.sourceBlocks);
  addGaps(pdf, cursor, projection);

  pdf.addPage();
  cursor.y = MARGIN.top;
  addReadings(pdf, cursor, projection.territorialReadings);
  addAgenda(pdf, cursor, projection.groupMotorAgenda);

  addFooter(pdf);
  return pdf;
}

export function exportNHSDerivedPdfToBlob(
  doc: CanonicalProfileDocument | null
): { blob: Blob; fileName: string } {
  const pdf = buildNHSDerivedPdf(doc);
  return { blob: pdf.output("blob"), fileName: nhsDerivedPdfFileName(doc) };
}

export function exportNHSDerivedPdfToBuffer(doc: CanonicalProfileDocument | null): Uint8Array {
  return new Uint8Array(buildNHSDerivedPdf(doc).output("arraybuffer"));
}

export function downloadNHSDerivedPdf(doc: CanonicalProfileDocument | null): void {
  const exported = exportNHSDerivedPdfToBlob(doc);
  const url = URL.createObjectURL(exported.blob);
  const link = globalThis.document.createElement("a");
  link.href = url;
  link.download = exported.fileName;
  globalThis.document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
