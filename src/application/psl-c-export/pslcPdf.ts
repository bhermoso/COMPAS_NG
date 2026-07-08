/**
 * pslcPdf
 *
 * Serialización PDF del modelo documental institucional del PSL-C.
 * La estructura y el contenido proceden ÍNTEGRAMENTE de
 * buildPSLCDocumentModel (la misma capa pura que alimenta el DOCX):
 * aquí solo se maqueta con paginación básica y numeración de páginas.
 *
 * PDF institucional sobrio: A4, tipografía estándar, portada + secciones.
 * No usa el DOM como fuente; no exporta nada que no esté en el modelo.
 */

import { jsPDF } from "jspdf";
import type { LocalHealthProfileArtifact } from "../../domain/health-profile-artifact";
import type { PSLCDocumentModel } from "./pslcDocumentModel";
import { buildPSLCDocumentModel, pslcDocxFileName } from "./pslcDocumentModel";

// ── Nombre de archivo estable ─────────────────────────────────────────────────

export function pslcPdfFileName(artifact: LocalHealthProfileArtifact): string {
  return pslcDocxFileName(artifact).replace(/\.docx$/, ".pdf");
}

// ── Maquetación ───────────────────────────────────────────────────────────────

const PAGE = { width: 210, height: 297 };       // A4 en mm
const MARGIN = { top: 22, bottom: 20, left: 22, right: 22 };
const CONTENT_WIDTH = PAGE.width - MARGIN.left - MARGIN.right;
const FOOTER_Y = PAGE.height - 10;

// Las fuentes estándar del PDF usan WinAnsi (CP1252): los caracteres del
// español y «» — · caben; se sustituyen los símbolos matemáticos frecuentes
// de las cautelas metodológicas que quedan fuera.
function toWinAnsi(text: string): string {
  return text
    .replace(/≥/g, ">=")
    .replace(/≤/g, "<=")
    .replace(/≈/g, "~")
    .replace(/ /g, " ");
}

interface Cursor {
  y: number;
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
    size: number;
    bold?: boolean;
    italic?: boolean;
    align?: "left" | "center";
    spacingAfter?: number;
  }
): void {
  const style = opts.bold ? "bold" : opts.italic ? "italic" : "normal";
  doc.setFont("helvetica", style);
  doc.setFontSize(opts.size);
  const lineHeight = opts.size * 0.47; // mm por línea, aproximación sobria
  const lines: string[] = doc.splitTextToSize(toWinAnsi(text), CONTENT_WIDTH);
  ensureSpace(doc, cursor, lines.length * lineHeight);
  const x = opts.align === "center" ? PAGE.width / 2 : MARGIN.left;
  doc.text(lines, x, cursor.y, {
    align: opts.align ?? "left",
    baseline: "top",
  });
  cursor.y += lines.length * lineHeight + (opts.spacingAfter ?? 2);
}

export function buildPSLCPdf(model: PSLCDocumentModel): jsPDF {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const cursor: Cursor = { y: MARGIN.top + 30 };

  // ── Portada institucional ─────────────────────────────────────────────────
  addText(doc, cursor, model.title, {
    size: 18,
    bold: true,
    align: "center",
    spacingAfter: 4,
  });
  addText(doc, cursor, model.subtitle, {
    size: 12,
    italic: true,
    align: "center",
    spacingAfter: 10,
  });
  for (const p of model.portada) {
    addText(doc, cursor, p, { size: 9, align: "center", spacingAfter: 3 });
  }

  // ── Secciones: capítulos I–VI y bloques institucionales ──────────────────
  doc.addPage();
  cursor.y = MARGIN.top;
  for (const section of model.sections) {
    ensureSpace(doc, cursor, 18);
    cursor.y += 4;
    addText(doc, cursor, section.title, {
      size: section.level === 1 ? 13 : 11,
      bold: true,
      spacingAfter: 3,
    });
    for (const p of section.paragraphs) {
      addText(doc, cursor, p, { size: 10, spacingAfter: 2.5 });
    }
  }

  // ── Numeración de páginas ─────────────────────────────────────────────────
  const total = doc.getNumberOfPages();
  for (let page = 1; page <= total; page++) {
    doc.setPage(page);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text(`${page} / ${total}`, PAGE.width / 2, FOOTER_Y, {
      align: "center",
    });
  }

  return doc;
}

// ── API de exportación ────────────────────────────────────────────────────────

/** Serializa el artefacto congelado a un Blob PDF (navegador). */
export async function exportPSLCArtifactToPdfBlob(
  artifact: LocalHealthProfileArtifact
): Promise<{ blob: Blob; fileName: string }> {
  const model = buildPSLCDocumentModel(artifact);
  const doc = buildPSLCPdf(model);
  const blob = doc.output("blob");
  return { blob, fileName: pslcPdfFileName(artifact) };
}

/** Serializa el artefacto congelado a Uint8Array (Node: tests, scripts). */
export async function exportPSLCArtifactToPdfBuffer(
  artifact: LocalHealthProfileArtifact
): Promise<Uint8Array> {
  const model = buildPSLCDocumentModel(artifact);
  const doc = buildPSLCPdf(model);
  return new Uint8Array(doc.output("arraybuffer"));
}
