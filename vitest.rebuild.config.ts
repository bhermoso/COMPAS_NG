// Configuración dedicada del generador de expedientes demo.
// No forma parte de `npm test` (vite.config.ts solo incluye tests/**/*.test.ts).
// Uso: npm run rebuild:zaidin
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["scripts/demo/**/*.gen.ts"],
  },
});
