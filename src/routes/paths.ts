export const PATHS = {
  home: '/',
  detalle: '/libro/:id',
  listaDeseos: '/lista-deseos',
  historial: '/historial',
  contacto: '/contacto',
} as const

export const detallePath = (id: string | number) => `/libro/${id}`
