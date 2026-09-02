// *Gestiona la carga de información completa de un libro.*
// *Obtiene los datos del Work, su edición y sus autores desde Open Library.*

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

export function useLibro(id: string | undefined) {
  const [libro, setLibro] = useState<BookDetail | null>(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function cargarLibro() {
      if (!id) {
        setError('No se encontró el ID del libro.')
        setCargando(false)
        return
      }

      try {
        setCargando(true)
        setError(null)

        const [respuestaWork, respuestaEdiciones] = await Promise.all([
          fetch(`https://openlibrary.org/works/${id}.json`),

          fetch(
            `https://openlibrary.org/works/${id}/editions.json?limit=1`
          ),
        ])

        if (!respuestaWork.ok) {
          throw new Error(
            `Error obteniendo el Work: HTTP ${respuestaWork.status}`
          )
        }

        if (!respuestaEdiciones.ok) {
          throw new Error(
            `Error obteniendo las ediciones: HTTP ${respuestaEdiciones.status}`
          )
        }

        const datosWork: OpenLibraryWork =
          await respuestaWork.json()

        const datosEdiciones =
          await respuestaEdiciones.json()

        const edicion = datosEdiciones.entries?.[0]

        // Descripción
        const descripcion =
          typeof datosWork.description === 'string'
            ? datosWork.description
            : datosWork.description?.value ?? null

        // Autores
        const autores = datosWork.authors ?? []
        const nombresAutores: string[] = []

        for (const autor of autores) {
          if (!autor.author?.key) continue

          const respuestaAutor = await fetch(
            `https://openlibrary.org${autor.author.key}.json`
          )

          if (respuestaAutor.ok) {
            const datosAutor = await respuestaAutor.json()

            if (datosAutor.name) {
              nombresAutores.push(datosAutor.name)
            }
          }
        }

        // Categorías
        const categorias = [
          ...new Set(
            (datosWork.subjects ?? [])
              .flatMap((categoria) => categoria.split(','))
              .map((categoria) => categoria.trim())
              .filter(Boolean)
          )
        ]

        const categoriasFiltradas = categorias.filter(
          (categoria) =>
            categoria.toLowerCase() !== 'fiction'
        )

        const libroDetalle: BookDetail = {
          id,
          title: datosWork.title ?? '',
          authors: nombresAutores,

          cover: datosWork.covers?.[0]
            ? `https://covers.openlibrary.org/b/id/${datosWork.covers[0]}-L.jpg`
            : null,

          rating: null,
          ratingCount: null,

          description: descripcion,

          year: edicion?.publish_date
            ? Number(
                edicion.publish_date.match(/\d{4}/)?.[0]
              ) || null
            : null,

          publisher: edicion?.publishers?.[0] ?? null,

          publishers: edicion?.publishers ?? [],

          categories: categoriasFiltradas.slice(0, 10),

          pages: edicion?.number_of_pages ?? null,

          language:
            edicion?.languages?.map(
              (idioma: { key: string }) =>
                idioma.key.split('/').pop() ?? ''
            ) ?? [],
        }

        setLibro(libroDetalle)
      } catch (error) {
        console.error('Error obteniendo el libro:', error)
        setError('No se pudo cargar el libro.')
      } finally {
        setCargando(false)
      }
    }

    cargarLibro()
  }, [id])

  return {
    libro,
    cargando,
    error
  }
}