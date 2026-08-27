// Modelo base de un libro. Ajustar campos cuando se defina la API/fuente de datos.
export interface Libro {
  id: string
  titulo: string
  autor: string
  descripcion: string
  portada: string
  precio: number
  anio: number
}
