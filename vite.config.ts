import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/COMPAS_NG/',
  plugins: [react()],
})
