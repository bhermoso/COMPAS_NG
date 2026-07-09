/**
 * tests/perfil-espacio-interpretativo.test.tsx
 *
 * Contextualización del espacio interpretativo del Perfil Local de Salud:
 * el panel se presenta como «Enriquecimiento interpretativo del Perfil»,
 * explica su papel (lectura humana que se incorpora al PSL-C, opcional,
 * sin recomendaciones) y no ocupa la pantalla con bloques vacíos.
 */

import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { PerfilLocalDeSaludPanel } from "../src/ui/components/health-profile/PerfilLocalDeSaludPanel";
import {
  createPerfilLocalDeSalud,
  addInterpretation,
  addHypothesis,
  addOpenQuestion,
  updateSynthesis,
} from "../src/application/health-profile";
import type { PerfilLocalDeSalud } from "../src/domain/health-profile";

function render(perfil?: PerfilLocalDeSalud): string {
  return renderToStaticMarkup(
    <PerfilLocalDeSaludPanel
      perfil={perfil}
      municipalityId="granada-zaidin"
      municipalityName="Granada-Zaidín"
      onUpdatePerfil={() => {}}
    />
  );
}

function perfilConContenido(): PerfilLocalDeSalud {
  let perfil = createPerfilLocalDeSalud("granada-zaidin");
  perfil = addInterpretation(perfil, {
    espacio: "determinantes",
    enunciado: "El envejecimiento condiciona las redes de cuidado.",
    certeza: "moderada",
    evidenciaIds: ["atom-1"],
    autorNombre: "Equipo técnico",
  });
  perfil = addHypothesis(perfil, {
    espacio: "situacion-salud",
    enunciado: "El malestar emocional se concentra en población cuidadora.",
    plausibilidad: "moderada",
    indicios: ["señales GHQ-12"],
    preguntasResolutoras: ["Desagregación por rol de cuidado"],
    autorNombre: "Equipo técnico",
  });
  perfil = addOpenQuestion(perfil, {
    espacio: "desigualdades",
    formulacion: "No se conoce la distribución interna de renta.",
    relevancia: "condiciona la lectura de desigualdades.",
    urgencia: "alta",
    viasResolucion: ["Sección censal INE"],
  });
  perfil = updateSynthesis(perfil, "Síntesis de prueba del equipo técnico.");
  return perfil;
}

describe("espacio interpretativo — vacío", () => {
  it("se presenta contextualizado y compacto, sin cuatro bloques largos abiertos", () => {
    const html = render(undefined);
    expect(html).toContain("Enriquecimiento interpretativo del Perfil");
    expect(html).toContain("Espacio de trabajo del equipo técnico");
    // Explica su papel y su relación con el PSL-C
    expect(html).toContain("se incorporan al PSL-C");
    expect(html).toContain("No son recomendaciones ni actuaciones");
    expect(html).toContain("no es un requisito para compilar");
    expect(html).toContain(
      "declara la ausencia de espacio interpretativo técnico registrado"
    );
    // Estado vacío: las secciones quedan dentro de un plegable cerrado
    expect(html).toContain("Sin lectura técnica registrada todavía");
    expect(html).toContain("<details");
    expect(html).not.toContain("<details open");
    // No aparece resumen de conteos inexistentes
    expect(html).not.toContain("Lectura técnica registrada:");
  });

  it("mantiene los botones de creación con microcopy claro", () => {
    const html = render(undefined);
    expect(html).toContain("Añadir interpretación técnica");
    expect(html).toContain("Añadir hipótesis de contraste");
    expect(html).toContain("Añadir pregunta abierta");
    expect(html).toContain("Redactar síntesis interpretativa");
  });
});

describe("espacio interpretativo — con contenido", () => {
  it("muestra el resumen de conteos y las secciones editables desplegadas", () => {
    const html = render(perfilConContenido());
    expect(html).toContain("Lectura técnica registrada:");
    expect(html).toContain("1 interpretación(es) activa(s)");
    expect(html).toContain("1 hipótesis en estudio");
    expect(html).toContain("1 pregunta(s) abierta(s)");
    expect(html).toContain("síntesis redactada");
    // Sin plegable: el contenido está visible y editable
    expect(html).not.toContain("Sin lectura técnica registrada todavía");
    expect(html).toContain("El envejecimiento condiciona las redes de cuidado.");
    expect(html).toContain("Editar síntesis interpretativa");
  });

  it("no introduce recomendaciones ni lenguaje de plan de acción", () => {
    const html = render(perfilConContenido());
    expect(html).not.toMatch(
      /se recomienda|recomendamos|debe implantarse|programa de|plan de acci[óo]n como contenido/i
    );
  });
});
