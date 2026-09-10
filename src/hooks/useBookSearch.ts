import { useState } from 'react'

import type { SearchParams } from '../components/search/Search'
import type { Book } from '../types/book'

import { usePagination } from './usePagination'

const API_URL = 'https://openlibrary.org/search.json'

const PAGE_SIZE = 10
const MAX_PAGES = 10

interface OpenLibraryDoc {
  key: string
  title: string
  author_name?: string[]
  cover_i?: number
  ratings_average?: number
  ratings_count?: number
}

interface OpenLibraryResponse {
  numFound: number
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

export function useBookSearch() {

  const [books, setBooks] = useState<Book[]>([])

  const [totalPages, setTotalPages] = useState(1)
  const [filters, setFilters] = useState<SearchParams>({})

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    page,
    goToPage
  } = usePagination(totalPages)

  async function searchBooks(
    params: SearchParams,
    page = 1
  ) {

    const query = new URLSearchParams()

    if (params.title) {
      query.set('title', params.title)
    }

    if (params.author) {
      query.set('author', params.author)
    }

    if (params.subject) {
      query.set('subject', params.subject)
    }

    query.set('page', String(page))
    query.set('limit', String(PAGE_SIZE))

    query.set(
      'fields',
      'key,title,author_name,cover_i,ratings_average,ratings_count'
    )

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(
        `${API_URL}?${query.toString()}`
      )

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const tipo =
        response.headers.get('content-type') ?? ''

      if (!tipo.includes('application/json')) {
        throw new Error(
          'La respuesta no está en formato JSON'
        )
      }

      const data: OpenLibraryResponse =
        await response.json()

      const result =
        data.docs.map(mapBook)

      setBooks(result)
      setFilters(params)

      const pages =
        Math.ceil(data.numFound / PAGE_SIZE)

      setTotalPages(
        Math.min(
          MAX_PAGES,
          Math.max(1, pages)
        )
      )
      goToPage(page)
    } catch (e) {
      console.error(e)
      if (e instanceof TypeError) {
        setError(
          'No hay conexión con el servidor. Revisá tu internet.'
        )
      } else {
        setError(
          'El servidor respondió con un error. Intentá más tarde.'
        )
      }
      setBooks([])
    } finally {
      setLoading(false)
    }
  }

  function search(params: SearchParams) {
    searchBooks(params, 1)
  }

  function previous() {
    if (page > 1) {
      searchBooks(filters, page - 1)
    }
  }

  function next() {
    if (page < totalPages) {
      searchBooks(filters, page + 1)
    }
  }

  return {
    books,
    page,
    totalPages,
    loading,
    error,
    search,
    previous,
    next,
    searchBooks
  }
}