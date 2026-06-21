import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    // pdfjs-dist usa ESM puro con top-level await; excluirlo del pre-bundling
    // evita errores de transformación de Vite con módulos ESM complejos.
    exclude: ['pdfjs-dist'],
  },
})
