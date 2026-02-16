import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/v2/',
  server: {
    port: 3000,
  },
  build: {
    outDir: '../src/main/resources/static/v2',
    emptyOutDir: true,
  },
})
