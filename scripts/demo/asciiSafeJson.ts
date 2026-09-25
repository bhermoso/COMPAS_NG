/**
 * scripts/demo/asciiSafeJson.ts
 *
 * Escape 100 % ASCII para exports canónicos. Fuente ÚNICA de la serialización a
 * disco: la usan el generador (`rebuild-*.gen.ts`) y las pruebas de igualdad
 * byte a byte, de modo que ambos produzcan exactamente los mismos bytes.
 *
 * Todo carácter no ASCII se emite como `\uXXXX` (escape JSON válido). Sobrevive a
 * cualquier canal de copia y evita mojibake (incidente 2026-07-07). Se define en
 * un módulo plano (no `.gen.ts`) para poder importarse desde `tests/` sin arrastrar
 * bloques `describe/it`.
 */

/** Escapa todo carácter no ASCII de un texto JSON como `\uXXXX`. */
export function toAsciiSafeJson(jsonText: string): string {
  let out = "";
  for (let i = 0; i < jsonText.length; i++) {
    const code = jsonText.charCodeAt(i);
    out += code < 0x80 ? jsonText[i] : "\\u" + code.toString(16).padStart(4, "0");
  }
  return out;
}
