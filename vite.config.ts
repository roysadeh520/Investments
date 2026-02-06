import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/Investments/', // שם הריפוזיטורי שלך בין סלאשים
  plugins: [react()], // או מה שיש לך שם
})
