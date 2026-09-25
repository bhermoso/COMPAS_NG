/**
 * strategic-scenario-domain.test.ts — Unidad 3
 *
 * Tests contractuales del dominio del Producto 5.
 * Verifica que los fixtures canónicos satisfacen todos los invariantes de
 * CONTRACT-STRATEGIC-SCENARIO v1.0. No valida ningún algoritmo; no depende
 * del MTE ni del FrameworkProvider.
 */

import { describe, expect, it } from "vitest";
import type {
  EscenarioEstrategico,
  LecturaEstrategicaLocal,
  NivelEstrategico,
  TipoTensionEstrategica,
} from "../src/domain/strategic-scenario";
import {
  CAUTELAS_MTE_INVARIABLES,
  ESCENARIO_CON_REFERENCIAS,
  ESCENARIO_MINIMO,
  ESCENARIO_SIN_COBERTURA,
  ESCENARIO_TENSION_EVIDENCIA,
  ESCENARIO_TENSION_MARCO,
  LECTURA_COMPLEJA,
  LECTURA_MINIMA,
  LECTURA_SIN_CONTENIDO,
  METODOLOGIA_BASE,
  REF_EPVSA_LE1,
  REF_EPVSA_LE2,
  REF_EPVSA_LE2_OBJ1,
  REF_EPVSA_LE2_OBJ3,
  REF_ESCA_L2,
  REF_ESCA_L3,
  REF_RELAS_F3,
  TENSION_EVIDENCIA_ALIMENTACION,
  TENSION_MARCO_SALUD_MENTAL,
  VACIO_CONSUMO_ALCOHOL,
} from "./strategic-scenario-fixtures";

// Colecciones de fixtures para tests que iteran sobre todos
const TODOS_LOS_ESCENARIOS: readonly EscenarioEstrategico[] = [
  ESCENARIO_MINIMO,
  ESCENARIO_CON_REFERENCIAS,
  ESCENARIO_SIN_COBERTURA,
  ESCENARIO_TENSION_EVIDENCIA,
  ESCENARIO_TENSION_MARCO,
];

const TODAS_LAS_LECTURAS: readonly LecturaEstrategicaLocal[] = [
  LECTURA_MINIMA,
  LECTURA_COMPLEJA,
  LECTURA_SIN_CONTENIDO,
];

// ── Bloque 1 — Invariantes contractuales ─────────────────────────────────────

describe("Bloque 1 — Invariantes contractuales (CONTRACT-STRATEGIC-SCENARIO v1.0)", () => {

  describe("I-SC-1: trazabilidad obligatoria al diagnóstico", () => {
    it("ESCENARIO_MINIMO tiene al menos un areaOrigen", () => {
      expect(ESCENARIO_MINIMO.areasOrigen.length).toBeGreaterThanOrEqual(1);
    });

    it("todos los fixtures de escenario tienen al menos un areaOrigen", () => {
      for (const e of TODOS_LOS_ESCENARIOS) {
        expect(e.areasOrigen.length, `${e.id} debe tener areasOrigen`).toBeGreaterThanOrEqual(1);
      }
    });

    it("todos los areaOrigen son strings no vacíos", () => {
      for (const e of TODOS_LOS_ESCENARIOS) {
        for (const id of e.areasOrigen) {
          expect(typeof id).toBe("string");
          expect(id.trim().length).toBeGreaterThan(0);
        }
      }
    });
  });

  describe("I-SC-2: tema derivado, no generado", () => {
    it("el tema de cada fixture es un string no vacío", () => {
      for (const e of TODOS_LOS_ESCENARIOS) {
        expect(e.tema.trim().length, `${e.id} debe tener tema`).toBeGreaterThan(0);
      }
    });

    it("el tema de ESCENARIO_MINIMO es exactamente el título del área de origen", () => {
      expect(ESCENARIO_MINIMO.tema).toBe("Apoyo social funcional");
      expect(ESCENARIO_MINIMO.areasOrigen.length).toBe(1);
    });
  });

  describe("I-SC-3: referencias institucionales citables", () => {
    it("todos los componentes ReferenciaInstitucional tienen sourceTrace no vacío", () => {
      const todosLosComponentes = [
        REF_EPVSA_LE1, REF_EPVSA_LE2, REF_EPVSA_LE2_OBJ1,
        REF_EPVSA_LE2_OBJ3, REF_ESCA_L2, REF_ESCA_L3, REF_RELAS_F3,
      ];
      for (const ref of todosLosComponentes) {
        expect(ref.sourceTrace.trim().length, `${ref.elementoId} debe tener sourceTrace`).toBeGreaterThan(0);
      }
    });

    it("todas las referencias en escenarios con cobertura tienen sourceTrace", () => {
      const conCobertura = [
        ESCENARIO_MINIMO,
        ESCENARIO_CON_REFERENCIAS,
        ESCENARIO_TENSION_EVIDENCIA,
        ESCENARIO_TENSION_MARCO,
      ];
      for (const e of conCobertura) {
        for (const ref of e.referenciasInstitucionales) {
          expect(ref.sourceTrace.trim().length, `ref ${ref.elementoId} en ${e.id}`).toBeGreaterThan(0);
        }
      }
    });

    it("todas las referencias tienen marcoId, elementoId y elementoLabel no vacíos", () => {
      for (const e of TODOS_LOS_ESCENARIOS) {
        for (const ref of e.referenciasInstitucionales) {
          expect(ref.marcoId.trim().length).toBeGreaterThan(0);
          expect(ref.elementoId.trim().length).toBeGreaterThan(0);
          expect(ref.elementoLabel.trim().length).toBeGreaterThan(0);
        }
      }
    });
  });

  describe("I-SC-4: tensiones restringidas a tipos válidos y requiereDeliberacion: true", () => {
    const TIPOS_VALIDOS: TipoTensionEstrategica[] = ["evidencia", "marco"];

    it("TENSION_EVIDENCIA_ALIMENTACION tiene tipo 'evidencia'", () => {
      expect(TENSION_EVIDENCIA_ALIMENTACION.tipo).toBe("evidencia");
    });

    it("TENSION_MARCO_SALUD_MENTAL tiene tipo 'marco'", () => {
      expect(TENSION_MARCO_SALUD_MENTAL.tipo).toBe("marco");
    });

    it("todos los tipos de tensión en fixtures son 'evidencia' o 'marco'", () => {
      for (const e of TODOS_LOS_ESCENARIOS) {
        for (const t of e.tensiones) {
          expect(TIPOS_VALIDOS, `tensión en ${e.id}`).toContain(t.tipo);
        }
      }
    });

    it("requiereDeliberacion es true en todas las tensiones", () => {
      for (const e of TODOS_LOS_ESCENARIOS) {
        for (const t of e.tensiones) {
          expect(t.requiereDeliberacion, `tensión en ${e.id}`).toBe(true);
        }
      }
    });

    it("tensión de evidencia puede tener origenPSL", () => {
      expect(TENSION_EVIDENCIA_ALIMENTACION.origenPSL).toBeDefined();
      expect(typeof TENSION_EVIDENCIA_ALIMENTACION.origenPSL).toBe("string");
    });

    it("tensión de marco puede no tener origenPSL", () => {
      expect(TENSION_MARCO_SALUD_MENTAL.origenPSL).toBeUndefined();
    });
  });

  describe("I-SC-5: inmutabilidad de los objetos de dominio", () => {
    it("modificar una copia del escenario no altera el fixture original", () => {
      const copia: EscenarioEstrategico = { ...ESCENARIO_MINIMO };
      copia.id = "id-modificado";
      copia.tema = "tema-modificado";
      expect(ESCENARIO_MINIMO.id).toBe("escenario-minimo-001");
      expect(ESCENARIO_MINIMO.tema).toBe("Apoyo social funcional");
    });

    it("spread de CAUTELAS_MTE_INVARIABLES no altera el array original", () => {
      const copia = [...CAUTELAS_MTE_INVARIABLES];
      copia.push("cautela ajena");
      expect(CAUTELAS_MTE_INVARIABLES).toHaveLength(4);
    });

    it("iterar LECTURA_COMPLEJA no modifica su contenido", () => {
      const cantidadAntes = LECTURA_COMPLEJA.escenarios.length;
      const ids = LECTURA_COMPLEJA.escenarios.map((e) => e.id);
      expect(ids).toHaveLength(cantidadAntes);
      expect(LECTURA_COMPLEJA.escenarios.length).toBe(cantidadAntes);
    });
  });

  describe("I-SC-6: ausencia de atributos prohibidos", () => {
    it("EscenarioEstrategico no contiene campos de planificación prohibidos", () => {
      const e = ESCENARIO_MINIMO as unknown as Record<string, unknown>;
      expect(e["actuaciones"]).toBeUndefined();
      expect(e["objetivos"]).toBeUndefined();
      expect(e["responsables"]).toBeUndefined();
      expect(e["plazos"]).toBeUndefined();
      expect(e["presupuesto"]).toBeUndefined();
      expect(e["recomendaciones"]).toBeUndefined();
      expect(e["prioridad"]).toBeUndefined();
      expect(e["cronograma"]).toBeUndefined();
    });

    it("LecturaEstrategicaLocal no contiene campos de planificación prohibidos", () => {
      const l = LECTURA_COMPLEJA as unknown as Record<string, unknown>;
      expect(l["actuaciones"]).toBeUndefined();
      expect(l["objetivos"]).toBeUndefined();
      expect(l["plazos"]).toBeUndefined();
      expect(l["responsables"]).toBeUndefined();
    });
  });

  describe("I-SC-7: coherencia sinCoberturaMarcal ↔ referenciasInstitucionales", () => {
    it("ESCENARIO_SIN_COBERTURA: sinCoberturaMarcal:true con referencias vacías", () => {
      expect(ESCENARIO_SIN_COBERTURA.sinCoberturaMarcal).toBe(true);
      expect(ESCENARIO_SIN_COBERTURA.referenciasInstitucionales).toHaveLength(0);
    });

    it("ESCENARIO_MINIMO: sinCoberturaMarcal:false con referencia presente", () => {
      expect(ESCENARIO_MINIMO.sinCoberturaMarcal).toBe(false);
      expect(ESCENARIO_MINIMO.referenciasInstitucionales.length).toBeGreaterThan(0);
    });

    it("coherencia I-SC-7 verificada en todos los fixtures de escenario", () => {
      for (const e of TODOS_LOS_ESCENARIOS) {
        if (e.sinCoberturaMarcal) {
          expect(e.referenciasInstitucionales, `${e.id}: cobertura declarada sin referencias`).toHaveLength(0);
        } else {
          expect(e.referenciasInstitucionales.length, `${e.id}: sin cobertura pero con referencias`).toBeGreaterThan(0);
        }
      }
    });
  });

  describe("I-SC-8: requiresHumanValidation en LecturaEstrategicaLocal", () => {
    it("LECTURA_MINIMA porta requiresHumanValidation: true", () => {
      expect(LECTURA_MINIMA.requiresHumanValidation).toBe(true);
    });

    it("todas las lecturas portan requiresHumanValidation: true", () => {
      for (const l of TODAS_LAS_LECTURAS) {
        expect(l.requiresHumanValidation, `${l.id}`).toBe(true);
      }
    });
  });
});

// ── Bloque 2 — Tipos ─────────────────────────────────────────────────────────

describe("Bloque 2 — Tipos del dominio", () => {

  it("EscenarioEstrategico: todos los campos requeridos presentes", () => {
    const e = ESCENARIO_MINIMO;
    expect(typeof e.id).toBe("string");
    expect(typeof e.tema).toBe("string");
    expect(Array.isArray(e.areasOrigen)).toBe(true);
    expect(Array.isArray(e.evidenciaOrigen)).toBe(true);
    expect(Array.isArray(e.cautelasOriginales)).toBe(true);
    expect(Array.isArray(e.activosRelacionados)).toBe(true);
    expect(Array.isArray(e.referenciasInstitucionales)).toBe(true);
    expect(Array.isArray(e.tensiones)).toBe(true);
    expect(typeof e.sinCoberturaMarcal).toBe("boolean");
  });

  it("ReferenciaInstitucional: todos los campos requeridos presentes", () => {
    const ref = REF_EPVSA_LE1;
    expect(typeof ref.marcoId).toBe("string");
    expect(typeof ref.elementoId).toBe("string");
    expect(typeof ref.elementoLabel).toBe("string");
    expect(typeof ref.nivel).toBe("string");
    expect(typeof ref.sourceTrace).toBe("string");
  });

  it("NivelEstrategico: los valores de nivel en fixtures son del tipo correcto", () => {
    const nivelesValidos: NivelEstrategico[] = ["linea", "objetivo", "programa", "eje", "accion"];
    const nivelesEnFixtures = [
      REF_EPVSA_LE1.nivel,
      REF_EPVSA_LE2.nivel,
      REF_EPVSA_LE2_OBJ1.nivel,
      REF_EPVSA_LE2_OBJ3.nivel,
      REF_ESCA_L2.nivel,
      REF_ESCA_L3.nivel,
      REF_RELAS_F3.nivel,
    ];
    for (const nivel of nivelesEnFixtures) {
      expect(nivelesValidos, `nivel "${nivel}" debe ser válido`).toContain(nivel);
    }
  });

  it("TensionEstrategica: todos los campos requeridos presentes", () => {
    const t = TENSION_EVIDENCIA_ALIMENTACION;
    expect(typeof t.tipo).toBe("string");
    expect(typeof t.descripcion).toBe("string");
    expect(t.requiereDeliberacion).toBe(true);
  });

  it("TensionEstrategica evidencia tiene origenPSL; marco puede no tenerlo", () => {
    expect(TENSION_EVIDENCIA_ALIMENTACION.origenPSL).toBeDefined();
    expect(TENSION_MARCO_SALUD_MENTAL.origenPSL).toBeUndefined();
  });

  it("VacioInstitucional: todos los campos requeridos presentes", () => {
    const v = VACIO_CONSUMO_ALCOHOL;
    expect(typeof v.areaId).toBe("string");
    expect(typeof v.areaTitle).toBe("string");
    expect(typeof v.nota).toBe("string");
    expect(v.areaId.trim().length).toBeGreaterThan(0);
    expect(v.nota.trim().length).toBeGreaterThan(0);
  });

  it("MetodologiaMTE: todos los campos requeridos presentes y no vacíos", () => {
    const m = METODOLOGIA_BASE;
    expect(Array.isArray(m.instrumentosConsultados)).toBe(true);
    expect(m.instrumentosConsultados.length).toBeGreaterThan(0);
    expect(typeof m.criterioDeAgrupacion).toBe("string");
    expect(m.criterioDeAgrupacion.trim().length).toBeGreaterThan(0);
    expect(typeof m.mecanismoDeCorrespondencia).toBe("string");
    expect(m.mecanismoDeCorrespondencia.trim().length).toBeGreaterThan(0);
    expect(typeof m.versionConocimientoEstrategico).toBe("string");
    expect(m.versionConocimientoEstrategico.trim().length).toBeGreaterThan(0);
  });

  it("LecturaEstrategicaLocal: todos los campos requeridos presentes", () => {
    const l = LECTURA_MINIMA;
    expect(typeof l.id).toBe("string");
    expect(typeof l.municipalityId).toBe("string");
    expect(typeof l.generatedAt).toBe("string");
    expect(typeof l.sourcePSLId).toBe("string");
    expect(typeof l.sourcePSLVersion).toBe("string");
    expect(typeof l.knowledgeBaseVersion).toBe("string");
    expect(typeof l.hasTranslatableContent).toBe("boolean");
    expect(Array.isArray(l.escenarios)).toBe(true);
    expect(Array.isArray(l.sinCobertura)).toBe(true);
    expect(Array.isArray(l.cautelas)).toBe(true);
    expect(typeof l.metodologia).toBe("object");
    expect(l.requiresHumanValidation).toBe(true);
  });

  it("CAUTELAS_MTE_INVARIABLES: exactamente 4 cautelas no vacías", () => {
    expect(CAUTELAS_MTE_INVARIABLES).toHaveLength(4);
    for (const c of CAUTELAS_MTE_INVARIABLES) {
      expect(typeof c).toBe("string");
      expect(c.trim().length).toBeGreaterThan(0);
    }
  });
});

// ── Bloque 3 — Serialización ─────────────────────────────────────────────────

describe("Bloque 3 — Serialización JSON sin pérdida", () => {

  it("EscenarioEstrategico: serializa y restaura sin pérdida", () => {
    const original = ESCENARIO_MINIMO;
    const restored = JSON.parse(JSON.stringify(original)) as EscenarioEstrategico;
    expect(restored.id).toBe(original.id);
    expect(restored.tema).toBe(original.tema);
    expect(restored.areasOrigen).toEqual(original.areasOrigen);
    expect(restored.evidenciaOrigen).toEqual(original.evidenciaOrigen);
    expect(restored.cautelasOriginales).toEqual(original.cautelasOriginales);
    expect(restored.sinCoberturaMarcal).toBe(original.sinCoberturaMarcal);
    expect(restored.referenciasInstitucionales).toHaveLength(
      original.referenciasInstitucionales.length
    );
  });

  it("LecturaEstrategicaLocal mínima: serializa y restaura sin pérdida", () => {
    const original = LECTURA_MINIMA;
    const restored = JSON.parse(JSON.stringify(original)) as LecturaEstrategicaLocal;
    expect(restored.id).toBe(original.id);
    expect(restored.sourcePSLId).toBe(original.sourcePSLId);
    expect(restored.hasTranslatableContent).toBe(original.hasTranslatableContent);
    expect(restored.requiresHumanValidation).toBe(true);
    expect(restored.escenarios).toHaveLength(original.escenarios.length);
    expect(restored.cautelas).toHaveLength(4);
  });

  it("LecturaEstrategicaLocal compleja: todos los escenarios sobreviven al round-trip", () => {
    const original = LECTURA_COMPLEJA;
    const restored = JSON.parse(JSON.stringify(original)) as LecturaEstrategicaLocal;
    expect(restored.escenarios).toHaveLength(original.escenarios.length);
    expect(restored.sinCobertura).toHaveLength(original.sinCobertura.length);
    for (let i = 0; i < original.escenarios.length; i++) {
      expect(restored.escenarios[i].id).toBe(original.escenarios[i].id);
      expect(restored.escenarios[i].sinCoberturaMarcal).toBe(
        original.escenarios[i].sinCoberturaMarcal
      );
    }
  });

  it("tensiones y referencias sobreviven al round-trip", () => {
    const conTensiones = { ...LECTURA_MINIMA, escenarios: [ESCENARIO_TENSION_EVIDENCIA, ESCENARIO_TENSION_MARCO] };
    const restored = JSON.parse(JSON.stringify(conTensiones)) as LecturaEstrategicaLocal;
    expect(restored.escenarios[0].tensiones[0].tipo).toBe("evidencia");
    expect(restored.escenarios[0].tensiones[0].requiereDeliberacion).toBe(true);
    expect(restored.escenarios[1].tensiones[0].tipo).toBe("marco");
    expect(restored.escenarios[1].referenciasInstitucionales).toHaveLength(2);
    expect(restored.escenarios[1].referenciasInstitucionales[0].sourceTrace.length).toBeGreaterThan(0);
  });
});

// ── Bloque 4 — Inmutabilidad ─────────────────────────────────────────────────

describe("Bloque 4 — Los fixtures se usan como datos de referencia inmutables", () => {

  it("copia superficial del escenario mínimo: original intacto tras modificación de la copia", () => {
    const copia: EscenarioEstrategico = { ...ESCENARIO_MINIMO };
    copia.id = "id-modificado";
    copia.tema = "tema-modificado";
    expect(ESCENARIO_MINIMO.id).toBe("escenario-minimo-001");
    expect(ESCENARIO_MINIMO.tema).toBe("Apoyo social funcional");
    expect(ESCENARIO_MINIMO.sinCoberturaMarcal).toBe(false);
  });

  it("copia superficial de lectura: original intacto tras cambiar id de la copia", () => {
    const copia: LecturaEstrategicaLocal = { ...LECTURA_MINIMA };
    copia.id = "id-copia";
    expect(LECTURA_MINIMA.id).toBe("lectura-minima-001");
    expect(LECTURA_MINIMA.requiresHumanValidation).toBe(true);
  });

  it("CAUTELAS_MTE_INVARIABLES: push a spread no altera el original", () => {
    const spread = [...CAUTELAS_MTE_INVARIABLES];
    spread.push("cautela ajena al contrato");
    expect(CAUTELAS_MTE_INVARIABLES).toHaveLength(4);
    expect(CAUTELAS_MTE_INVARIABLES).not.toContain("cautela ajena al contrato");
  });

  it("mapear ids de LECTURA_COMPLEJA no altera la lectura", () => {
    const idsAntes = LECTURA_COMPLEJA.escenarios.map((e) => e.id);
    expect(LECTURA_COMPLEJA.escenarios.length).toBe(idsAntes.length);
    expect(LECTURA_COMPLEJA.requiresHumanValidation).toBe(true);
  });
});

// ── Bloque 5 — Estados válidos ───────────────────────────────────────────────

describe("Bloque 5 — Todos los estados del dominio son contractualmente válidos", () => {

  it("escenario mínimo: una área, una referencia, sin tensiones", () => {
    expect(ESCENARIO_MINIMO.areasOrigen).toHaveLength(1);
    expect(ESCENARIO_MINIMO.referenciasInstitucionales).toHaveLength(1);
    expect(ESCENARIO_MINIMO.tensiones).toHaveLength(0);
    expect(ESCENARIO_MINIMO.sinCoberturaMarcal).toBe(false);
    expect(ESCENARIO_MINIMO.activosRelacionados).toHaveLength(0);
  });

  it("escenario con cobertura: múltiples referencias de distintos marcos", () => {
    expect(ESCENARIO_CON_REFERENCIAS.referenciasInstitucionales.length).toBe(3);
    expect(ESCENARIO_CON_REFERENCIAS.sinCoberturaMarcal).toBe(false);
    const marcoIds = ESCENARIO_CON_REFERENCIAS.referenciasInstitucionales.map((r) => r.marcoId);
    expect(new Set(marcoIds).size).toBeGreaterThan(1); // más de un marco distinto
  });

  it("escenario sin cobertura: referencias vacías, sinCoberturaMarcal: true", () => {
    expect(ESCENARIO_SIN_COBERTURA.referenciasInstitucionales).toHaveLength(0);
    expect(ESCENARIO_SIN_COBERTURA.sinCoberturaMarcal).toBe(true);
    expect(ESCENARIO_SIN_COBERTURA.areasOrigen.length).toBeGreaterThanOrEqual(1);
  });

  it("escenario con tensión de evidencia: tipo correcto, trazabilidad al PSL", () => {
    const t = ESCENARIO_TENSION_EVIDENCIA.tensiones[0];
    expect(t.tipo).toBe("evidencia");
    expect(t.requiereDeliberacion).toBe(true);
    expect(t.origenPSL).toBeDefined();
    expect(ESCENARIO_TENSION_EVIDENCIA.sinCoberturaMarcal).toBe(false);
  });

  it("escenario con tensión de marco: tipo correcto, dos marcos distintos", () => {
    const t = ESCENARIO_TENSION_MARCO.tensiones[0];
    expect(t.tipo).toBe("marco");
    expect(t.requiereDeliberacion).toBe(true);
    expect(t.origenPSL).toBeUndefined(); // tensión de marco no tiene origenPSL
    expect(ESCENARIO_TENSION_MARCO.referenciasInstitucionales.length).toBe(2);
    const marcoIds = ESCENARIO_TENSION_MARCO.referenciasInstitucionales.map((r) => r.marcoId);
    expect(new Set(marcoIds).size).toBe(2); // exactamente dos marcos distintos
  });

  it("lectura mínima: estructura completa con un escenario", () => {
    expect(LECTURA_MINIMA.hasTranslatableContent).toBe(true);
    expect(LECTURA_MINIMA.escenarios).toHaveLength(1);
    expect(LECTURA_MINIMA.sinCobertura).toHaveLength(0);
    expect(LECTURA_MINIMA.cautelas).toHaveLength(4);
    expect(LECTURA_MINIMA.requiresHumanValidation).toBe(true);
  });

  it("lectura compleja: cinco escenarios con características distintas y un vacío", () => {
    expect(LECTURA_COMPLEJA.hasTranslatableContent).toBe(true);
    expect(LECTURA_COMPLEJA.escenarios).toHaveLength(5);
    expect(LECTURA_COMPLEJA.sinCobertura).toHaveLength(1);
    const conCobertura = LECTURA_COMPLEJA.escenarios.filter((e) => !e.sinCoberturaMarcal);
    const sinCobertura = LECTURA_COMPLEJA.escenarios.filter((e) => e.sinCoberturaMarcal);
    expect(conCobertura.length).toBeGreaterThan(0);
    expect(sinCobertura.length).toBeGreaterThan(0);
  });

  it("lectura sin contenido (G-MTE-2): hasTranslatableContent: false, escenarios vacíos", () => {
    expect(LECTURA_SIN_CONTENIDO.hasTranslatableContent).toBe(false);
    expect(LECTURA_SIN_CONTENIDO.escenarios).toHaveLength(0);
    expect(LECTURA_SIN_CONTENIDO.sinCobertura).toHaveLength(0);
    expect(LECTURA_SIN_CONTENIDO.requiresHumanValidation).toBe(true);
    expect(LECTURA_SIN_CONTENIDO.cautelas).toHaveLength(4);
  });
});

// ── Bloque 6 — Estados imposibles ────────────────────────────────────────────

describe("Bloque 6 — Los estados imposibles no aparecen en los fixtures", () => {

  it("imposible: sinCoberturaMarcal:true con referencias presentes", () => {
    // Verificar que ningún fixture presenta este estado prohibido
    for (const e of TODOS_LOS_ESCENARIOS) {
      const estadoImposible = e.sinCoberturaMarcal && e.referenciasInstitucionales.length > 0;
      expect(estadoImposible, `${e.id}: sinCoberturaMarcal:true con referencias`).toBe(false);
    }
  });

  it("imposible: sinCoberturaMarcal:false con referencias vacías", () => {
    for (const e of TODOS_LOS_ESCENARIOS) {
      if (!e.sinCoberturaMarcal) {
        expect(
          e.referenciasInstitucionales.length,
          `${e.id}: sinCoberturaMarcal:false debe tener referencias`
        ).toBeGreaterThan(0);
      }
    }
  });

  it("imposible: tipo de tensión fuera del contrato", () => {
    const tiposPermitidos = new Set<TipoTensionEstrategica>(["evidencia", "marco"]);
    for (const e of TODOS_LOS_ESCENARIOS) {
      for (const t of e.tensiones) {
        expect(tiposPermitidos.has(t.tipo), `tipo "${t.tipo}" fuera del contrato`).toBe(true);
      }
    }
  });

  it("imposible: requiresHumanValidation distinto de true en lecturas", () => {
    for (const l of TODAS_LAS_LECTURAS) {
      expect(l.requiresHumanValidation, `${l.id}`).toBe(true);
      expect(l.requiresHumanValidation).not.toBe(false);
      expect(l.requiresHumanValidation).not.toBeUndefined();
    }
  });

  it("imposible: referencia sin sourceTrace en cualquier fixture", () => {
    for (const e of TODOS_LOS_ESCENARIOS) {
      for (const ref of e.referenciasInstitucionales) {
        expect(ref.sourceTrace, `ref ${ref.elementoId} en ${e.id}`).toBeTruthy();
        expect(ref.sourceTrace.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it("imposible: lectura sin cautelas", () => {
    for (const l of TODAS_LAS_LECTURAS) {
      expect(l.cautelas.length, `${l.id} debe tener cautelas`).toBeGreaterThan(0);
    }
  });

  it("imposible: lectura con escenarios pero hasTranslatableContent: false", () => {
    // LECTURA_COMPLEJA tiene escenarios y hasTranslatableContent: true
    expect(LECTURA_COMPLEJA.escenarios.length).toBeGreaterThan(0);
    expect(LECTURA_COMPLEJA.hasTranslatableContent).toBe(true);
    // LECTURA_SIN_CONTENIDO no tiene escenarios y hasTranslatableContent: false
    expect(LECTURA_SIN_CONTENIDO.escenarios.length).toBe(0);
    expect(LECTURA_SIN_CONTENIDO.hasTranslatableContent).toBe(false);
    // La combinación escenarios no vacíos + hasTranslatableContent:false no aparece
    const estadoImposible =
      LECTURA_SIN_CONTENIDO.hasTranslatableContent === false &&
      LECTURA_SIN_CONTENIDO.escenarios.length > 0;
    expect(estadoImposible).toBe(false);
  });
});
