import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'   // convierte archivos .svg en componentes de React
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // El orden no importa acá. svgr solo actúa sobre imports que
  // terminan en ".svg?react" (ver Paso 5); el resto de los .svg
  // se siguen importando como URL normal.
  plugins: [react(), svgr()],
})
