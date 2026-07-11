/**
 * scripts/demo/inject-ugc-sourcetext.gen.ts
 *
 * Incremento 5A — persiste el texto íntegro de los dos informes clínico-
 * asistenciales por UGC (Vigía) dentro del EXPORT VIGENTE (56/92) y su copia
 * MANUAL, SIN atomizar ni interpretar.
 *
 * Determinista y reproducible: lee los DOCX fuente con mammoth (sin dependencia
 * de Word, sin texto hardcodeado en TypeScript), inyecta `sourceText` + metadatos
 * documentales (Opción A) en los documentos `territorial-documentation` que
 * coinciden por `sourceFileName`, y reescribe el JSON en 100 % ASCII (acentos
 * `\u`-escapados) con indentación de 2 espacios — el mismo formato del vigente.
 *
 * Se ejecuta con: npm run inject:ugc-sourcetext
 * (config vitest.rebuild.config.ts — NO forma parte de `npm test`).
 *
 * Tras ejecutarlo hay que regenerar el fragmento de consola: npm run restore:zaidin
 */

import { describe, it, expect } from "vitest";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { extractDocxText } from "../../src/application/document-ingestion";
import { extractUgcLabel } from "./buildGranadaZaidinWorkspace";

const here = dirname(fileURLToPath(import.meta.url));
const exportsDir = resolve(here, "../../municipalities/granada-zaidin/exports");
const docxDir = resolve(
  here,
  "../../docs/source-material/territorial-cases/granada-zaidin"
);

const EXPORT_FILES = [
  "compas-ng-workspace-granada-zaidin.json",
  "compas-ng-workspace-granada-zaidin-MANUAL-56-92.json",
];

const UGC_SOURCE_SYSTEM =
  "Informe clínico-asistencial por UGC (Vigilancia Integral de la Salud) — " +
  "texto íntegro persistido, no atomizado ni interpretado";

const NON_ASCII = new RegExp("[^\\x00-\\x7F]", "g");

/** Serializa a JSON 2-espacios forzando ASCII puro (acentos `\uXXXX`). */
function serializeAscii(value: unknown): string {
  return (
    JSON.stringify(value, null, 2).replace(
      NON_ASCII,
      (ch) => "\\u" + ch.charCodeAt(0).toString(16).padStart(4, "0")
    ) + "\n"
  );
}

function toArrayBuffer(path: string): ArrayBuffer {
  const buf = readFileSync(path);
  return buf.buffer.slice(
    buf.byteOffset,
    buf.byteOffset + buf.byteLength
  ) as ArrayBuffer;
}

describe("Generador — inyecta sourceText íntegro por UGC en el export 56/92", () => {
  it("persiste el texto de los dos informes Vigía sin atomizar", async () => {
    // 1. Extraer el texto íntegro de cada DOCX (determinista, con acentos).
    const textByFile: Record<string, string> = {};
    for (const fileName of [
      "Informe Zaidin Centro Este.docx",
      "Informe Zaidin Sur.docx",
    ]) {
      const text = await extractDocxText(
        toArrayBuffer(resolve(docxDir, fileName))
      );
      expect(text.length).toBeGreaterThan(1000);
      textByFile[fileName] = text;
    }

    const rendered: Record<string, string> = {};

    for (const file of EXPORT_FILES) {
      const raw = readFileSync(resolve(exportsDir, file), "utf8");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const ws: any = JSON.parse(raw);

      let patched = 0;
      ws.repository.documents = ws.repository.documents.map(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (doc: any) => {
          if (doc.kind !== "territorial-documentation") return doc;
          const sourceText = textByFile[doc.sourceFileName];
          if (!sourceText) return doc;
          patched += 1;
          return {
            ...doc,
            sourceText,
            source: { ...doc.source, system: UGC_SOURCE_SYSTEM },
            documentNature: "ugc-clinical-assistance-report",
            territorialScale: "unidad-gestion-clinica",
            ugc: extractUgcLabel(sourceText),
            contentMode: "full-text-non-atomized",
          };
        }
      );

      // Invariantes del piloto: nada más puede cambiar.
      expect(patched).toBe(2);
      expect(ws.repository.documents.length).toBe(20);
      expect(ws.evidenceStore.atoms.length).toBe(92);
      expect(
        ws.evidenceStore.atoms.filter(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (a: any) => a.provenance.origin === "localiza-salud"
        ).length
      ).toBe(56);
      // Ningún cuerpo territorial queda vacío.
      for (const doc of ws.repository.documents) {
        if (doc.kind === "territorial-documentation") {
          expect(typeof doc.sourceText).toBe("string");
          expect(doc.sourceText.length).toBeGreaterThan(1000);
          expect(doc.body ?? null).toBeNull();
        }
      }

      const out = serializeAscii(ws);
      expect(/^[\x00-\x7F]*$/.test(out)).toBe(true);
      rendered[file] = out;
    }

    // Vigente y MANUAL deben seguir siendo idénticos byte a byte.
    expect(rendered[EXPORT_FILES[0]]).toBe(rendered[EXPORT_FILES[1]]);

    for (const file of EXPORT_FILES) {
      writeFileSync(resolve(exportsDir, file), rendered[file], "utf8");
    }

    process.stdout.write(
      `\nsourceText UGC inyectado en ${EXPORT_FILES.length} exports · ` +
        `20 docs · 92 evidencias · 56 Localiza · 2 informes Vigía persistidos\n`
    );
  }, 60000);
});
