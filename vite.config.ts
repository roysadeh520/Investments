import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/Investments/',
  build: {
    outDir: 'dist', // ודא שהתוצר הולך לתיקייה שה-YAML מחפש
  }
})