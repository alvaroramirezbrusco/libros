// *Gestiona la búsqueda de libros en Open Library.*
// *Se encarga de realizar las consultas, transformar los resultados*
// *y controlar el estado de carga, errores, filtros y paginación.*

import { useState } from 'react'

import type { BookPreview } from '../types/book'

const API_URL = 'https://openlibrary.org/search.json'

const LIMITE = 10

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

function convertirLibro(doc: OpenLibraryDoc): BookPreview {
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

  const [librosPorCategoria, setLibrosPorCategoria] = useState<Record<string, BookPreview[]>>({})

  const [cargando, setCargando] = useState(true)

  async function cargarCategoria(subject: string) {
    const query = new URLSearchParams()

    query.set('subject', subject)
    query.set('limit', String(LIMITE))

    query.set(
      'fields',
      'key,title,author_name,cover_i,ratings_average,ratings_count'
    )

    try {
      const respuesta = await fetch(
        `${API_URL}?${query.toString()}`
      )

      if (!respuesta.ok) {
        throw new Error(`HTTP ${respuesta.status}`)
      }

      const datos: OpenLibraryResponse =
        await respuesta.json()

      const resultado =
        datos.docs.map(convertirLibro)

      setLibrosPorCategoria(actual => ({
        ...actual,
        [subject]: resultado
      }))
    } catch (e) {
      console.error(
        `Error cargando categoría ${subject}:`,
        e
      )
    }
  }

  async function cargarCategorias(
    categorias: { subject: string }[]
  ) {
    setCargando(true)

    await Promise.all(
      categorias.map(categoria =>
        cargarCategoria(categoria.subject)
      )
    )
    setCargando(false)
  }

  return {
    librosPorCategoria,
    cargando,
    cargarCategoria,
    cargarCategorias
  }
}