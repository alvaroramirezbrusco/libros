import { useState } from 'react'

import type { BusquedaParams } from '../components/search/Search'
import type { BookPreview } from '../types/book'

import { usePagination } from './usePagination'

const API_URL = 'https://openlibrary.org/search.json'

const LIMITE = 10
const MAX_PAGINAS = 10

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

export function useBookSearch() {

  const [libros, setLibros] = useState<BookPreview[]>([])

  const [totalPaginas, setTotalPaginas] = useState(1)
  const [filtros, setFiltros] = useState<BusquedaParams>({})

  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    pagina,
    irAnterior,
    irSiguiente,
    irPagina
  } = usePagination(totalPaginas)

  async function buscarLibros(
    params: BusquedaParams,
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
    query.set('limit', String(LIMITE))

    query.set(
      'fields',
      'key,title,author_name,cover_i,ratings_average,ratings_count'
    )

    setCargando(true)
    setError(null)

    try {
      const respuesta = await fetch(
        `${API_URL}?${query.toString()}`
      )

      if (!respuesta.ok) {
        throw new Error(`HTTP ${respuesta.status}`)
      }

      const tipo =
        respuesta.headers.get('content-type') ?? ''

      if (!tipo.includes('application/json')) {
        throw new Error(
          'La respuesta no está en formato JSON'
        )
      }

      const datos: OpenLibraryResponse =
        await respuesta.json()

      const resultado =
        datos.docs.map(convertirLibro)

      setLibros(resultado)
      setFiltros(params)

      const paginas =
        Math.ceil(datos.numFound / LIMITE)

      setTotalPaginas(
        Math.min(
          MAX_PAGINAS,
          Math.max(1, paginas)
        )
      )
      irPagina(page)
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
      setLibros([])
    } finally {
      setCargando(false)
    }
  }

  function buscar(params: BusquedaParams) {
    buscarLibros(params, 1)
  }

  function anterior() {
    if (pagina > 1) {
      buscarLibros(filtros, pagina - 1)
    }
  }

  function siguiente() {
    if (pagina < totalPaginas) {
      buscarLibros(filtros, pagina + 1)
    }
  }

  return {
    libros,
    pagina,
    totalPaginas,
    cargando,
    error,
    buscar,
    anterior,
    siguiente,
    buscarLibros
  }
}