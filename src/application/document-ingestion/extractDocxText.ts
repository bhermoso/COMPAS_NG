import { extractRawText } from "mammoth";

/**
 * Extrae texto plano de un ArrayBuffer de fichero DOCX via mammoth.
 * No genera HTML ni secciones estructuradas — solo texto lineal para ingesta documental.
 * Uso exclusivo para tipos documentales distintos de health-report (D-HR-01).
 *
 * La API node de mammoth acepta { buffer }; la de navegador, { arrayBuffer }. Se
 * elige según el entorno (Buffer vía globalThis, sin requerir tipos de Node en el
 * build del navegador) para que el mismo helper funcione en la app y en los
 * generadores demo (scripts/demo, vitest en Node).
 */
export async function extractDocxText(arrayBuffer: ArrayBuffer): Promise<string> {
  const nodeBuffer = (globalThis as {
    Buffer?: { from(data: ArrayBuffer): unknown };
  }).Buffer;
  const mammothInput = (nodeBuffer !== undefined
    ? { buffer: nodeBuffer.from(arrayBuffer) }
    : { arrayBuffer }) as { arrayBuffer: ArrayBuffer };
  const result = await extractRawText(mammothInput);
  return result.value.trim();
}
