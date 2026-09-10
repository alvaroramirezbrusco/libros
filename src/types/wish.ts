// Lo que se guarda en localStorage por deseo: resumen del libro + datos del formulario.

export interface ItemDeseo {
  // Resumen del libro
  id: string
  title: string
  cover: string | null
  authors: string[]

  // Datos del formulario (Variante B)
  prioridad: number // valor numérico mayor a 0
  etiqueta: string // etiqueta que escribe el usuario
  nota?: string // comentario opcional del usuario
}
