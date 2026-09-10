import { useEffect, useState } from 'react'
import type { BookDetail } from '../types/book'

interface OpenLibraryWork {
  title?: string
  description?: string | { value: string }
  covers?: number[]
  subjects?: string[]
  authors?: {
    author?: {
      key?: string
    }
  }[]
}

export function useBook(id: string | undefined) {
  const [book, setBook] = useState<BookDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadBook() {
      if (!id) {
        setError('No se encontró el ID del libro.')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        const [workResponse, editionsResponse] = await Promise.all([
          fetch(`https://openlibrary.org/works/${id}.json`),

          fetch(
            `https://openlibrary.org/works/${id}/editions.json?limit=1`
          ),
        ])

        if (!workResponse.ok) {
          throw new Error(
            `Error obteniendo el Work: HTTP ${workResponse.status}`
          )
        }

        if (!editionsResponse.ok) {
          throw new Error(
            `Error obteniendo las ediciones: HTTP ${editionsResponse.status}`
          )
        }

        const workData: OpenLibraryWork =
          await workResponse.json()

        const editionsData =
          await editionsResponse.json()

        const edition = editionsData.entries?.[0]

        const description =
          typeof workData.description === 'string'
            ? workData.description
            : workData.description?.value ?? null

        const authors = workData.authors ?? []
        const authorNames: string[] = []

        for (const author of authors) {
          if (!author.author?.key) continue

          const authorResponse = await fetch(
            `https://openlibrary.org${author.author.key}.json`
          )

          if (authorResponse.ok) {
            const authorData = await authorResponse.json()

            if (authorData.name) {
              authorNames.push(authorData.name)
            }
          }
        }

        const categories = [
          ...new Set(
            (workData.subjects ?? [])
              .flatMap((category) => category.split(','))
              .map((category) => category.trim())
              .filter(Boolean)
          )
        ]

        const filteredCategories = categories.filter(
          (category) =>
            category.toLowerCase() !== 'fiction'
        )

        const bookDetails: BookDetail = {
          id,
          title: workData.title ?? '',
          authors: authorNames,

          cover: workData.covers?.[0]
            ? `https://covers.openlibrary.org/b/id/${workData.covers[0]}-L.jpg`
            : null,

          rating: null,
          ratingCount: null,

          description,

          year: edition?.publish_date
            ? Number(
                edition.publish_date.match(/\d{4}/)?.[0]
              ) || null
            : null,

          publisher: edition?.publishers?.[0] ?? null,

          publishers: edition?.publishers ?? [],

          categories: filteredCategories.slice(0, 10),

          pages: edition?.number_of_pages ?? null,

          language:
            edition?.languages?.map(
              (language: { key: string }) =>
                language.key.split('/').pop() ?? ''
            ) ?? [],
        }

        setBook(bookDetails)
      } catch (error) {
        console.error('Error obteniendo el libro:', error)
        setError('No se pudo cargar el libro.')
      } finally {
        setLoading(false)
      }
    }

    loadBook()
  }, [id])

  return {
    book,
    loading,
    error
  }
}
