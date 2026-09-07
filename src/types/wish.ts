// Lo que guardamos en localStorage por cada libro agregado a la lista de
// deseos: un "resumen" del libro (no el Book completo) + los datos del
// formulario (Variante B).

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
