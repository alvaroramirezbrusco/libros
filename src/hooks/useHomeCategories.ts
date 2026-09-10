import { useState } from 'react'

import type { Book } from '../types/book'

const API_URL = 'https://openlibrary.org/search.json'

const PAGE_SIZE = 12

interface OpenLibraryDoc {
  key: string
  title: string
  author_name?: string[]
  cover_i?: number
  ratings_average?: number
  ratings_count?: number
}

interface OpenLibraryResponse {
  docs: OpenLibraryDoc[]
}

function mapBook(doc: OpenLibraryDoc): Book {
  return {
    id: doc.key.replace('/works/', ''),
    title: doc.title,
    authors: doc.author_name ?? [],
    cover: doc.cover_i
      ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
      : null,
    rating: doc.ratings_average ?? null,
    ratingCount: doc.ratings_count ?? null,
  }
}

export function useHomeCategories() {

  const [booksByCategory, setBooksByCategory] = useState<Record<string, Book[]>>({})

  const [loading, setLoading] = useState(true)

  async function loadCategory(subject: string) {
    const query = new URLSearchParams()

    query.set('subject', subject)
    query.set('limit', String(PAGE_SIZE))

    query.set(
      'fields',
      'key,title,author_name,cover_i,ratings_average,ratings_count'
    )

    try {
      const response = await fetch(
        `${API_URL}?${query.toString()}`
      )

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const data: OpenLibraryResponse =
        await response.json()

      const result =
        data.docs.map(mapBook)

      setBooksByCategory(current => ({
        ...current,
        [subject]: result
      }))
    } catch (e) {
      console.error(
        `Error cargando categoría ${subject}:`,
        e
      )
    }
  }

  async function loadCategories(
    categories: { subject: string }[]
  ) {
    setLoading(true)

    await Promise.all(
      categories.map(category =>
        loadCategory(category.subject)
      )
    )
    setLoading(false)
  }

  return {
    booksByCategory,
    loading,
    loadCategory,
    loadCategories
  }
}