import { jsPDF } from "jspdf";
import type { CanonicalProfileDocument } from "./canonicalProfileDocument";
import {
  projectNHSDerived,
  type NHSDerivedAgendaItem,
  type NHSDerivedProjection,
  type NHSDerivedRow,
  type NHSDerivedTerritorialReading,
} from "./nhsDerivedProjection";

const PAGE = { width: 210, height: 297 };
const MARGIN = { top: 18, bottom: 18, left: 18, right: 18 };
const WIDTH = PAGE.width - MARGIN.left - MARGIN.right;
const FOOTER_Y = PAGE.height - 9;

interface Cursor {
  y: number;
}

function toPdfText(text: string): string {
  return text
    .replace(/≥/g, ">=")
    .replace(/≤/g, "<=")
    .replace(/≈/g, "~")
    .replace(/[–—]/g, "-")
    .replace(/→/g, "->")
    .replace(/…/g, "...")
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
  const size = opts.size ?? 9.5;
  const lineHeight = size * 0.45;
  doc.setFont("helvetica", opts.bold ? "bold" : opts.italic ? "italic" : "normal");
  doc.setFontSize(size);
  doc.setTextColor(...(opts.color ?? [35, 47, 62]));
  const lines = doc.splitTextToSize(toPdfText(text), opts.width ?? WIDTH) as string[];
  ensureSpace(doc, cursor, lines.length * lineHeight + 1);
  doc.text(lines, opts.x ?? MARGIN.left, cursor.y, { baseline: "top" });
  cursor.y += lines.length * lineHeight + (opts.spacingAfter ?? 2.5);
}

function addSectionTitle(doc: jsPDF, cursor: Cursor, eyebrow: string, title: string): void {
  ensureSpace(doc, cursor, 16);
  cursor.y += 2;
  addText(doc, cursor, eyebrow.toUpperCase(), {
    size: 7.5,
    bold: true,
    color: [0, 116, 200],
    spacingAfter: 1,
  });
  addText(doc, cursor, title, {
    size: 13,
    bold: true,
    color: [20, 57, 91],
    spacingAfter: 4,
  });
}

function addMetricRow(
  doc: jsPDF,
  cursor: Cursor,
  metrics: Array<{ value: string; label: string }>
): void {
  ensureSpace(doc, cursor, 22);
  const gap = 4;
  const cardW = (WIDTH - gap * (metrics.length - 1)) / metrics.length;
  const top = cursor.y;
  metrics.forEach((metric, index) => {
    const x = MARGIN.left + index * (cardW + gap);
    doc.setDrawColor(199, 223, 243);
    doc.setFillColor(248, 251, 255);
    doc.roundedRect(x, top, cardW, 18, 2, 2, "FD");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(0, 116, 200);
    doc.text(toPdfText(metric.value), x + 3, top + 6.5);
    doc.setFontSize(7.2);
    doc.setTextColor(82, 96, 112);
    const label = doc.splitTextToSize(toPdfText(metric.label), cardW - 6) as string[];
    doc.text(label.slice(0, 2), x + 3, top + 11.5);
  });
  cursor.y += 23;
}

function shorten(text: string, max = 360): string {
  if (text.length <= max) return text;
  const base = text.slice(0, max);
  const stop = Math.max(base.lastIndexOf("."), base.lastIndexOf(";"), base.lastIndexOf(","));
  return `${base.slice(0, stop > 180 ? stop : max).trim()}...`;
}

function statusLabel(status: string): string {
  if (status === "integrated") return "lectura territorial integrada";
  if (status === "prioritization-pending") return "lectura territorial pendiente";
  return "lectura declarada";
}

function addBarRanking(
  doc: jsPDF,
  cursor: Cursor,
  ranking: NonNullable<Extract<NHSDerivedProjection, { available: true }>["informeSignalRanking"]>
): void {
  addSectionTitle(doc, cursor, "Mapa de temas del Informe", "Peso textual de los asuntos sanitarios");
  const labelW = 72;
  const barMax = WIDTH - labelW - 18;
  for (const item of ranking.items) {
    ensureSpace(doc, cursor, 7);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(35, 47, 62);
    const label = doc.splitTextToSize(toPdfText(item.etiqueta), labelW - 3) as string[];
    doc.text(label[0] ?? "", MARGIN.left, cursor.y + 3.6);
    const barW = Math.max(2, (item.valor / Math.max(1, item.max)) * barMax);
    doc.setFillColor(0, 116, 200);
    doc.roundedRect(MARGIN.left + labelW, cursor.y + 0.8, barW, 3.8, 1.6, 1.6, "F");
    doc.setFont("helvetica", "bold");
    doc.text(String(item.valor), MARGIN.left + labelW + barW + 2, cursor.y + 3.7);
    cursor.y += 6.5;
  }
  addText(doc, cursor, ranking.caption, { size: 8, italic: true, color: [100, 116, 139], spacingAfter: 1.5 });
  addText(doc, cursor, ranking.unidad, { size: 8, color: [100, 116, 139] });
}

function addIndicatorRows(doc: jsPDF, cursor: Cursor, rows: NHSDerivedRow[]): void {
  addSectionTitle(doc, cursor, "Indicadores comparables", "Valores territoriales y referencias");
  for (const row of rows) {
    ensureSpace(doc, cursor, 22);
    addText(doc, cursor, row.indicador, { size: 9.5, bold: true, spacingAfter: 1 });
    addText(
      doc,
      cursor,
      `Territorio: ${row.valor} | Provincia: ${row.refGranada} | Andalucía: ${row.refAndalucia} | ${row.esProxy ? "proxy contextual" : "muestra local"}`,
      { size: 8.2, color: [82, 96, 112], spacingAfter: 2 }
    );
    doc.setDrawColor(220, 232, 244);
    doc.line(MARGIN.left, cursor.y, MARGIN.left + WIDTH, cursor.y);
    cursor.y += 2.5;
  }
}

function addReadings(
  doc: jsPDF,
  cursor: Cursor,
  readings: NHSDerivedTerritorialReading[]
): void {
  addSectionTitle(doc, cursor, "Lecturas territoriales", "Lo que el expediente permite formular");
  for (const reading of readings.slice(0, 6)) {
    addText(doc, cursor, reading.title, { size: 10, bold: true, spacingAfter: 1 });
    addText(doc, cursor, shorten(reading.reading), { size: 8.7, spacingAfter: 1.3 });
    addText(doc, cursor, reading.groupMotorQuestion, {
      size: 8.5,
      italic: true,
      color: [20, 57, 91],
      spacingAfter: 4,
    });
  }
}

function addAgenda(doc: jsPDF, cursor: Cursor, agenda: NHSDerivedAgendaItem[]): void {
  addSectionTitle(doc, cursor, "Conversación pública", "Preguntas que abren desigualdad y acceso real");
  for (const item of agenda) {
    addText(doc, cursor, item.tema, { size: 10, bold: true, color: [20, 57, 91], spacingAfter: 1 });
    addText(doc, cursor, `Señal: ${item.senal}`, { size: 8.8, spacingAfter: 1 });
    addText(doc, cursor, `Mecanismo plausible: ${item.mecanismo}`, { size: 8.8, spacingAfter: 1 });
    addText(doc, cursor, `Puede quedar fuera: ${item.oculto}`, {
      size: 8.8,
      color: [127, 29, 29],
      spacingAfter: 1,
    });
    addText(doc, cursor, item.pregunta, { size: 8.8, italic: true, spacingAfter: 4 });
  }
}

function addFooter(doc: jsPDF): void {
  const total = doc.getNumberOfPages();
  for (let page = 1; page <= total; page++) {
    doc.setPage(page);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
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
    addText(pdf, cursor, "Perfil de Salud Local tipo Local Health Profiles", {
      size: 17,
      bold: true,
      color: [20, 57, 91],
      spacingAfter: 6,
    });
    addText(pdf, cursor, "No hay documento canónico sellado disponible para exportar.", { size: 10 });
    addFooter(pdf);
    return pdf;
  }

  addText(pdf, cursor, "Perfil de Salud Local tipo Local Health Profiles", {
    size: 17,
    bold: true,
    color: [20, 57, 91],
    spacingAfter: 2,
  });
  addText(pdf, cursor, `${projection.territory}: salud, capacidades y datos pendientes`, {
    size: 13,
    bold: true,
    color: [0, 116, 200],
    spacingAfter: 4,
  });
  addText(
    pdf,
    cursor,
    `Ficha breve derivada del Perfil canónico. ${statusLabel(projection.readingStatus)}. ${projection.generatedDateLabel}`,
    { size: 9, italic: true, color: [82, 96, 112], spacingAfter: 7 }
  );

  addMetricRow(pdf, cursor, [
    { value: String(projection.documentaryBase?.evidenceAtoms ?? "—"), label: "evidencias" },
    { value: String(projection.rows.length), label: "indicadores comparables" },
    { value: String(projection.territorialReadings.length), label: "lecturas territoriales" },
    { value: String(projection.groupMotorAgenda.length), label: "preguntas públicas" },
  ]);

  if (projection.overview.length > 0) {
    addSectionTitle(pdf, cursor, "Lectura para todos los públicos", "Mensajes de entrada");
    for (const item of projection.overview) {
      addText(pdf, cursor, item.title, { size: 10.5, bold: true, spacingAfter: 1 });
      addText(pdf, cursor, item.signal, { size: 9, bold: true, color: [35, 47, 62], spacingAfter: 1 });
      addText(pdf, cursor, item.text, { size: 8.8, color: [82, 96, 112], spacingAfter: 4 });
    }
  }

  if (projection.sourceBlocks.length > 0) {
    addSectionTitle(pdf, cursor, "Fuentes y alcance", "Qué aporta cada base de información");
    for (const block of projection.sourceBlocks) {
      addText(pdf, cursor, block.title, { size: 10, bold: true, spacingAfter: 1 });
      addText(pdf, cursor, `Aporta: ${block.whatItAdds}`, { size: 8.7, spacingAfter: 0.8 });
      addText(pdf, cursor, `No permite leer: ${block.whatItDoesNotAllow}`, {
        size: 8.7,
        color: [82, 96, 112],
        spacingAfter: 3.5,
      });
    }
  }

  if (projection.rows.length > 0) {
    addIndicatorRows(pdf, cursor, projection.rows);
  } else {
    addSectionTitle(pdf, cursor, "Indicadores comparables", "No hay trazador cuantitativo sellado");
    addText(
      pdf,
      cursor,
      "La ficha no fabrica indicadores comparables donde el documento canónico no los contiene. Usa el Informe, los activos, las lecturas territoriales y las preguntas de contraste para declarar lo que sí puede leerse.",
      { size: 9 }
    );
  }

  if (projection.informeSignalRanking !== null) {
    addBarRanking(pdf, cursor, projection.informeSignalRanking);
  }
  if (projection.territorialReadings.length > 0) {
    addReadings(pdf, cursor, projection.territorialReadings);
  }
  if (projection.groupMotorAgenda.length > 0) {
    addAgenda(pdf, cursor, projection.groupMotorAgenda);
  }

  const gaps = [
    ...(projection.pendingDeclaration !== null ? [projection.pendingDeclaration] : []),
    ...(projection.documentaryBase?.scaleWarnings ?? []),
    ...projection.methodologicalCautions.map((c) => c.text),
  ];
  if (gaps.length > 0) {
    addSectionTitle(pdf, cursor, "Alcance honesto", "Qué no debe prometer esta ficha");
    for (const gap of gaps.slice(0, 6)) {
      addText(pdf, cursor, `• ${gap}`, { size: 8.8, color: [75, 85, 99], spacingAfter: 2 });
    }
  }

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
