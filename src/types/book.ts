export interface Book {
  id: string
  title: string
  authors: string[]
  cover: string | null
  rating: number | null
  ratingCount: number | null
}

export interface BookDetail {
  id: string
  title: string
  authors: string[]
  description: string | null
  cover: string | null
  year: number | null
  publisher: string | null
  publishers: string[]
  categories: string[]
  rating: number | null
  ratingCount: number | null
  pages: number | null
  language: string[]
}