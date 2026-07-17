/**
 * Conformidad documental — Fundamentos del Perfil único (Intervención 2026-07-17).
 *
 * Verifica que los contratos fijan las decisiones doctrinales del Perfil único:
 * producto único, arquitectura adaptativa (sin recuento obligatorio de capítulos),
 * equivalencia semántica entre salidas y clases de conocimiento. Solo lee los
 * `.md`; no valida comportamiento de código (eso vive en los tests del Perfil).
 *
 * Las frases se comprueban sobre una versión con los espacios en blanco colapsados
 * (`flat`) para no depender del ajuste de línea del markdown.
 */

import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const DOCS = resolve(dirname(fileURLToPath(import.meta.url)), "..", "docs");
const readRaw = (rel: string) => readFileSync(resolve(DOCS, rel), "utf8");
const flatten = (s: string) => s.replace(/\s+/g, " ");

describe("Fundamentos del Perfil único — CONTRACT-INDEX", () => {
  const raw = readRaw("contracts/CONTRACT-INDEX.md");
  const idx = flatten(raw);

  it("declara el producto único institucional", () => {
    expect(idx).toContain("Fundamentos del Perfil único");
    expect(idx).toContain("El único producto institucional del Perfil es el **Perfil");
    expect(idx).toContain("deja de definirse como producto autónomo");
    expect(idx).toContain("segunda fuente de verdad");
  });

  it("declara la arquitectura adaptativa sin recuento obligatorio de capítulos", () => {
    expect(idx).toContain("única lectura institucional canónica");
    expect(idx).toContain("dependen de la riqueza y la solidez del expediente");
    expect(idx).toContain("abrirse, comprimirse o no aparecer");
    expect(idx).toContain("mera presencia textual no obliga");
    expect(idx).toContain("No puede coexistir una «lectura larga» alternativa");
    expect(idx).toContain("derogada toda rigidez numérica");
  });

  it("declara la equivalencia SEMÁNTICA (no de apariencia) entre salidas", () => {
    expect(idx).toContain("mismo modelo semántico canónico");
    expect(idx).toContain("no se exige identidad de píxeles, CSS");
  });

  it("declara las clases de conocimiento sin umbral numérico de menciones", () => {
    expect(idx).toContain("síntesis automática derivada");
    expect(idx).toContain("no eleva por sí sola una presencia textual a evidencia");
  });

  it("registra las deudas resueltas por doctrina y las migraciones pendientes", () => {
    expect(idx).toContain("GOV-SALIDA-01");
    expect(idx).toContain("rigidez numérica derogada");
    expect(idx).toContain("candidato a representación derivada");
  });
});

describe("Fundamentos del Perfil único — CONTRACT-NHS-HEALTH-PROFILE", () => {
  const nhs = flatten(readRaw("contracts/CONTRACT-NHS-HEALTH-PROFILE.md"));

  it("deroga el estatuto de producto autónomo del PSL-NHS", () => {
    expect(nhs).toContain("Estatuto revisado");
    expect(nhs).toContain("deja de definirse como producto autónomo");
    expect(nhs).toContain("no puede constituir una segunda fuente de verdad");
  });

  it("registra computePosition como capacidad candidata, no garantizada", () => {
    expect(nhs).toContain("capacidad candidata a evaluación");
    expect(nhs).toContain("no fabrica rankings");
    expect(nhs).toContain("no presenta proxy como dato local");
  });

  it("registra la migración de código NHS como pendiente (no ejecutada)", () => {
    expect(nhs).toContain("Migración pendiente");
    expect(nhs).toContain("el código NHS permanece intacto");
  });
});

describe("Fundamentos del Perfil único — arquitectura adaptativa y salida canónica", () => {
  it("CONTRACT-MIT-PSL deroga la rigidez de capítulos y fija clases de conocimiento", () => {
    const raw = readRaw("contracts/CONTRACT-MIT-PSL.md");
    const mit = flatten(raw);
    expect(mit).toContain("Arquitectura adaptativa de la lectura canónica");
    expect(mit).toContain("derogada toda rigidez numérica");
    expect(mit).toContain("Clases de conocimiento");
    expect(mit).toContain("no eleva por sí sola una presencia textual a evidencia territorial");
    expect(mit).toContain("Cobertura conceptual");
    // Se retira el encabezado que fijaba el recuento obligatorio.
    expect(raw).not.toContain("### 6.2 Estructura: siete capítulos");
  });

  it("CONTRACT-PSL-COMPAS deroga la estructura congelada de siete capítulos", () => {
    const raw = readRaw("contracts/CONTRACT-PSL-COMPAS.md");
    expect(raw).not.toContain("La estructura de siete capítulos está implementada y congelada");
    expect(raw).not.toMatch(/siete cap[ií]tulos/);
    expect(flatten(raw)).toContain("No hay recuento obligatorio de capítulos");
  });

  it("PROFILE-VISUAL-CONTRACT fija salida canónica única y espacio técnico separado", () => {
    const vis = flatten(readRaw("architecture/PROFILE-VISUAL-CONTRACT.md"));
    expect(vis).toContain("Salida canónica única");
    expect(vis).toContain("mismo modelo semántico");
    expect(vis).toContain("Sin lectura larga alternativa");
    expect(vis).toContain("Espacio técnico después del documento");
    expect(vis).toContain("no se exige identidad de píxeles");
  });
});
