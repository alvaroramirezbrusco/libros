// Información completa de un libro, la idea es modificarlo para tener
// diferentes interfaces según que necesite (simple o detalles)

export interface Book {
  id: string

  // Información principal
  title: string
  subtitle: string | null
  authors: string[]
  description: string | null

  // Portada
  cover: string | null

  // Publicación
  year: number | null
  publisher: string | null
  publishers: string[]
  isbn10: string[]
  isbn13: string[]

  // Clasificación
  categories: string[]
  subjects: string[]

  // Métricas
  rating: number | null
  ratingCount: number | null

  // Información adicional
  pages: number | null
  language: string[]
}
