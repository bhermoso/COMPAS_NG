import { extractRawText } from "mammoth";

/**
 * Extrae texto plano de un ArrayBuffer de fichero DOCX via mammoth.
 * No genera HTML ni secciones estructuradas — solo texto lineal para ingesta documental.
 * Uso exclusivo para tipos documentales distintos de health-report (D-HR-01).
 */
export async function extractDocxText(arrayBuffer: ArrayBuffer): Promise<string> {
  const result = await extractRawText({ arrayBuffer });
  return result.value.trim();
}
