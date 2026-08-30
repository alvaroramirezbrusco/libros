// Rutas de la aplicación centralizadas para no repetir strings.
export const PATHS = {
  home: '/',
  detalle: '/libro/:id',
  listaDeseos: '/lista-deseos',
  historial: '/historial',
  contacto: '/contacto',
} as const

// Helper para construir la ruta de detalle con un id concreto.
export const detallePath = (id: string | number) => `/libro/${id}`
