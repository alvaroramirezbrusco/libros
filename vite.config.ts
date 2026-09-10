import { readFileSync } from 'node:fs'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'   // convierte archivos .svg en componentes de React
import { defineConfig, type Plugin } from 'vite'

const logoPath = new URL('./src/assets/logo.svg', import.meta.url)

function pwaLogoPlugin(): Plugin {
  return {
    name: 'pwa-logo',
    configureServer(server: { middlewares: { use: Function } }) {
      server.middlewares.use('/logo.svg', (_request: unknown, response: {
        setHeader: (name: string, value: string) => void
        end: (content: Buffer) => void
      }) => {
        response.setHeader('Content-Type', 'image/svg+xml')
        response.end(readFileSync(logoPath))
      })
    },
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'logo.svg',
        source: readFileSync(logoPath),
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), svgr(), pwaLogoPlugin()],
})
