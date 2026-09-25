// Suite metodológica histórica sobre el fixture sintético Granada-Zaidín 56/92.
// Se mantiene fuera de `npm test` hasta realinear expectativas de Perfil 2.0.
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: [
      "tests/badea-municipal-context.test.ts",
      "tests/complementary-indicator-references.test.ts",
      "tests/complementary-studies-reading.test.ts",
      "tests/diagnostic-answers.test.ts",
      "tests/informe-cobertura-prioritaria.test.ts",
      "tests/informe-hilo-sanitario.test.ts",
      "tests/integrated-profile-signals.test.ts",
      "tests/perfil-fuentes-enriquecimiento.test.tsx",
      "tests/perfil-interpretacion-integrada.test.ts",
      "tests/perfil-lote-d.test.ts",
      "tests/perfil-salud-en-sintesis.test.tsx",
      "tests/perfil-senales-locales.test.ts",
      "tests/perfil-vista-editorial-integrada.test.tsx",
      "tests/perfil-visualizaciones.test.tsx",
      "tests/profile-writing-contract.test.ts",
      "tests/psl-c-documento-visual.test.tsx",
      "tests/ugc-assistance-questions.test.ts",
    ],
  },
});
