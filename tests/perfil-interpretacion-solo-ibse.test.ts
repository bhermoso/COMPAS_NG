import { describe, expect, it } from "vitest";
import {
  buildIntegratedInterpretation,
  type DiagnosticAnswers,
} from "../src/application/health-profile";
import type { HealthReportStructuredReading } from "../src/domain/health-report";
import { territorialLexicon } from "../src/application/health-profile/territorialGrammar";

const emptyBase: HealthReportStructuredReading = {
  present: false,
  charCount: 0,
  originalTextAvailable: false,
  sections: [],
  tables: [],
  findings: [],
  territorialCorrespondences: [],
  limitations: [],
  extractionNotes: [],
};

function answersWithOnlyIBSE(): DiagnosticAnswers {
  return {
    porEspacio: {},
    healthReport: { present: false, temas: [] },
    determinantes: [],
    senalesPresentes: ["bienestar socioemocional escolar"],
    salutogenica: { totalAssets: 0, grupos: [], sinClasificar: 0 },
    estudios: {
      totalStudies: 1,
      totalIndicators: 1,
      diagnosticBlocks: [
        {
          id: "bienestar-socioemocional-escolar",
          title: "bienestar socioemocional escolar",
          summary:
            "Reúne indicadores de IBSE sobre bienestar socioemocional escolar.",
          signals: ["bienestar socioemocional escolar"],
          supportingStudies: ["IBSE"],
          supportingIndicators: ["IBSE - Índice total de bienestar socioemocional"],
          cautions: ["muestra exploratoria"],
          territorialReading:
            "Permite una lectura territorial exploratoria del bienestar escolar.",
          relatedDeterminantHypotheses: [],
          contrastQuestions: [
            "¿El patrón de bienestar socioemocional escolar se reproduce en los centros del ámbito?",
          ],
        },
      ],
      unclassifiedIndicators: [],
      crossCuttingCautions: [],
      contrastQuestions: [
        "¿El patrón de bienestar socioemocional escolar se reproduce en los centros del ámbito?",
      ],
    },
    referencias: {
      references: [
        {
          indicatorId: "ibse-indice-total",
          indicatorTitle: "IBSE - Índice total de bienestar socioemocional",
          instrument: "IBSE",
          diagnosticBlockId: "bienestar-socioemocional-escolar",
          diagnosticBlockTitle: "bienestar socioemocional escolar",
          territorialValue: 72,
          territorialLabel: "muestra territorial",
          provinceReference: 72,
          provinceLabel: "Granada",
          andalusiaLabel: "Andalucía",
          unit: "/100",
          source: "ibse-atarfe.csv",
          calculationMethod: "media de los ítems IBSE",
          scaleCaution: "muestra exploratoria",
          demoProxy: true,
          comparisonReading: "valor contextual de referencia",
          narrativeLabel: "el índice total de bienestar socioemocional (IBSE)",
          tracerPriority: 1,
          dimension: "bienestar-socioemocional",
          esLocal: false,
          sampleSize: 40,
        },
      ],
      coverage: {
        total: 1,
        conValorTerritorial: 1,
        conReferenciaProvincial: 1,
        conReferenciaAndalucia: 0,
        pendientesDeReferencia: 0,
      },
    },
    sanitaria: {
      present: false,
      senales: [],
      baseEpidemiologica: emptyBase,
      seccionesSanitarias: [],
      sinResolver: [],
      charCount: 0,
    },
    ugcAssistanceQuestions: [],
    // Léxico territorial requerido por la capa (Lote D): fixture municipal neutro.
    territorial: territorialLexicon({ ineCode: "18000" }),
  };
}

function textForUnit(answers: DiagnosticAnswers, id: string): string {
  const unit = buildIntegratedInterpretation(answers).units.find((u) => u.id === id);
  if (unit === undefined) throw new Error(`No existe la unidad ${id}`);
  return `${unit.question}\n${unit.reasoning}`;
}

describe("interpretación integrada con solo IBSE", () => {
  it("no nombra instrumentos ausentes cuando no hay señal local del tema", () => {
    const interpretation = buildIntegratedInterpretation(answersWithOnlyIBSE());
    const text = JSON.stringify(interpretation);

    expect(text).not.toMatch(
      /\b(AUDIT-C|GHQ-12|PHQ-9|PSQI|Fagerström|Fagerstrom|SBQ|PREDIMED)\b/u
    );
  });

  it("formula salud mental, consumos y alimentación como lagunas de medición local", () => {
    const answers = answersWithOnlyIBSE();

    const saludMental = textForUnit(answers, "salud-mental-señal-local");
    expect(saludMental).toMatch(/información local sobre salud mental y descanso/i);
    expect(saludMental).toMatch(/necesidad de medición local/i);

    const consumos = textForUnit(answers, "consumos-tabaco-alcohol");
    expect(consumos).toMatch(/si no existe cribado local/i);
    expect(consumos).toMatch(/la magnitud queda como laguna/i);

    const alimentacion = textForUnit(answers, "alimentacion-sobrepeso");
    expect(alimentacion).toMatch(/si no existe medición alimentaria local/i);
    expect(alimentacion).toMatch(/pregunta alimentaria que queda abierta/i);
  });
});