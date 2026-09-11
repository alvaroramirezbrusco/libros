import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'   
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  //  GitHub Pages sirve el sitio en /libros/, no en la raíz.
  base: '/libros/',
  
  plugins: [react(), svgr()],
})
