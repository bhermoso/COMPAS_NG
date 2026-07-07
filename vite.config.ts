import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/COMPAS_NG/',
  // Puerto fijo: si 5173 está ocupado, `npm run dev` falla en lugar de saltar
  // a 5174. localStorage se aísla por origen (puerto incluido); un salto
  // silencioso de puerto hace que el expediente municipal "desaparezca"
  // (incidente de persistencia del 2026-07-07).
  server: { port: 5173, strictPort: true },
  preview: { port: 4173, strictPort: true },
  plugins: [react()],
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
  },
})
