// Información mínima utilizada para listados y tarjetas
export interface BookPreview {
  id: string
  title: string
  authors: string[]
  cover: string | null
  rating: number | null
  ratingCount: number | null
}

// Información completa utilizada en la vista de detalle
export interface BookDetail {
  id: string

  // Información principal
  title: string
  authors: string[]
  description: string | null

  // Portada
  cover: string | null

  // Publicación
  year: number | null
  publisher: string | null
  publishers: string[]

  // Clasificación
  categories: string[]

  // Métricas
  rating: number | null
  ratingCount: number | null

  // Información adicional
  pages: number | null
  language: string[]
}