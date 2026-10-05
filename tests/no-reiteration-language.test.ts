import { existsSync, readdirSync, readFileSync } from "node:fs";
import { extname, join, relative, sep } from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();
const scannedRoots = ["src", "docs", "tests", "public", "municipalities", "scripts"];
const scannedExtensions = new Set([".css", ".js", ".json", ".md", ".mjs", ".ts", ".tsx"]);

const metaDocumentsAllowedToNameDisallowedLanguage = [
  ["docs", "visual", "references"].join(sep),
  // The style guide names some expressions precisely to prohibit or restrict them.
  // It remains mandatory for COMPAS prose; this scanner targets product prose.
  ["docs", "BLAS_WRITING_STYLE.md"].join(sep),
  ["tests", "no-reiteration-language.test.ts"].join(sep),
];

const disallowedLanguage = [
  ["reiter", "aci[oó]n"].join(""),
  ["reiter", "ar"].join(""),
  ["reiter", "ad"].join(""),
  ["iter", "aci[oó]n"].join(""),
  ["repet", "ici[oó]n"].join(""),
  ["repet", "id"].join(""),
  ["repet", "ir"].join(""),
  ["repet", "idamente"].join(""),
  ["recurrent", "es?"].join(""),
  ["retro", "aliment"].join(""),
  ["perpet", "uar"].join(""),
  ["ciclo", "\\s+", "siguiente"].join(""),
  ["siguiente", "\\s+", "ciclo"].join(""),
  ["nuevo", "s?", "\\s+", "ciclo", "s?"].join(""),
  ["primer", "\\s+", "ciclo"].join(""),
  ["ciclos", "\\s+", "anteriores"].join(""),
  ["entre", "\\s+", "ciclos"].join(""),
  ["ciclo", "\\s+", "diagn[oó]stico"].join(""),
  ["ciclo", "\\s+", "de", "\\s+", "planificaci[oó]n"].join(""),
  ["ciclo", "\\s+", "institucional"].join(""),
  ["ciclo", "\\s+", "activo"].join(""),
  ["este", "\\s+", "ciclo"].join(""),
  ["segundo", "\\s+", "ciclo"].join(""),
  ["cierra", "\\s+", "el", "\\s+", "ciclo"].join(""),
].map((source) => new RegExp(source, "iu"));

function collectFiles(dir: string): string[] {
  if (!existsSync(dir)) return [];

  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const absolutePath = join(dir, entry.name);
    const relativePath = relative(root, absolutePath);

    if (metaDocumentsAllowedToNameDisallowedLanguage.some((fragment) => relativePath.includes(fragment))) {
      return [];
    }

    if (entry.isDirectory()) {
      if ([".git", "coverage", "dist", "node_modules"].includes(entry.name)) return [];
      return collectFiles(absolutePath);
    }

    if (!entry.isFile() || !scannedExtensions.has(extname(entry.name))) return [];
    return [absolutePath];
  });
}

describe("lenguaje doctrinal sin reiteracion", () => {
  it("mantiene fuera de COMPAS el vocabulario de repeticion conceptual", () => {
    const matches = scannedRoots
      .flatMap((dir) => collectFiles(join(root, dir)))
      .flatMap((file) => {
        const text = readFileSync(file, "utf8");
        return disallowedLanguage
          .filter((pattern) => pattern.test(text))
          .map((pattern) => `${relative(root, file)} => ${pattern.source}`);
      });

    expect(matches).toEqual([]);
  });
});
