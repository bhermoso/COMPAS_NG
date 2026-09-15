// Suite de reconstrucción reproducible. Requiere fuentes DOCX privadas que no
// viajan en el repositorio público.
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/granada-zaidin-reconstruction.test.ts"],
  },
});
