import { useEffect, useState } from 'react'
import PageHeader from '../../components/layout/PageHeader'
import Search from '../../components/search/Search'
import type { BusquedaParams } from '../../components/search/Search'
import BookSection from '../../components/books/BookSection'
import Pagination from '../../components/books/Pagination'
import type { Book } from '../../types/book'
import './Home.css'


const API_URL = 'https://openlibrary.org/search.json' // URL del endpoint de búsqueda de Open Library.
                                                    // Doc: https://openlibrary.org/dev/docs/api/search

const LIMITE = 10      // libros por página carrusel
const MAX_PAGINAS = 10 // la API trea maa, pero solo se pido 10 

// Forma (parcial) de cada libro que devuelve Open Library.
// Solo listamos los campos que usamos; todos opcionales porque
// la API no garantiza que cada libro los tenga.
interface OpenLibraryDoc {
  key: string
  title: string
  subtitle?: string
  author_name?: string[]
  first_publish_year?: number
  cover_i?: number
  publisher?: string[]
  subject?: string[]
  language?: string[]
  number_of_pages_median?: number
  ratings_average?: number
  ratings_count?: number
}

// Forma de la respuesta completa del endpoint de búsqueda.
interface OpenLibraryResponse {
  numFound: number // total de resultados que matchean (lo usamos para el total de páginas)
  docs: OpenLibraryDoc[]
}

export default function Home() {
  //  Estado de la pantalla 
  const [libros, setLibros] = useState<Book[]>([]) // resultados
  const [cargando, setCargando] = useState(false) // true mientras esperamos la API
  const [error, setError] = useState<string | null>(null) // mensaje si algo falla

  //  Estado de la paginacion
  const [pagina, setPagina] = useState(1)           // pagina actual
  const [totalPaginas, setTotalPaginas] = useState(1)
  const [filtros, setFiltros] = useState<BusquedaParams>({ subject: 'fantasy' }) // ultima busqueda hecha

  // Función que llama a la API con fetch.
  // `page` = qué página de resultados pedir (por defecto, la 1).
  async function buscarLibros(params: BusquedaParams, page = 1) {
    // Armamos la query string (?title=...&author=...&page=...)    
    const query = new URLSearchParams()// URLSearchParams codifica espacios y tildes por nosotros.
    if (params.title) query.set('title', params.title)
    if (params.author) query.set('author', params.author)
    if (params.subject) query.set('subject', params.subject)
    query.set('page', String(page))
    query.set('limit', String(LIMITE))

    setCargando(true)
    setError(null)

    try {
      // Pedimos los datos. `await` porque fetch es asíncrono.
      const respuesta = await fetch(`${API_URL}?${query.toString()}`)

      // fetch NO lanza error si el servidor responde 404, 500, etc.
      // Solo lanza si NO llegó al servidor (sin internet, DNS, CORS).
      // Por eso el error HTTP lo revisamos a mano y lo lanzamos nosotros.
      if (!respuesta.ok) {
        throw new Error(`HTTP ${respuesta.status}`)
      }

      // Nos aseguramos de que la respuesta venga en formato JSON.
      // Si no, `respuesta.json()` fallaría con un error poco claro.
      const tipo = respuesta.headers.get('content-type') ?? ''
      if (!tipo.includes('application/json')) {
        throw new Error('La respuesta no está en formato JSON')
      }

      // Convertimos el cuerpo de la respuesta (texto) en objeto JS.
      const datos: OpenLibraryResponse = await respuesta.json()

      // La API devuelve sus campos con otros nombres (doc.author_name,
      // doc.cover_i, etc). Acá los pasamos a nuestro tipo `Book`.
      const resultado: Book[] = datos.docs.map((doc) => ({
        id: doc.key.replace('/works/', ''),
        title: doc.title,
        subtitle: doc.subtitle ?? null,
        authors: doc.author_name ?? [],
        description: null, // la búsqueda no trae descripción larga
        cover: doc.cover_i
          ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
          : null,
        year: doc.first_publish_year ?? null,
        publisher: doc.publisher?.[0] ?? null,
        publishers: doc.publisher ?? [],
        isbn10: [],
        isbn13: [],
        categories: (doc.subject ?? []).slice(0, 5),
        subjects: doc.subject ?? [],
        rating: doc.ratings_average ?? null,
        ratingCount: doc.ratings_count ?? null,
        pages: doc.number_of_pages_median ?? null,
        language: doc.language ?? [],
      }))

      setLibros(resultado)
      setPagina(page)      // recordamos en qué página quedamos
      setFiltros(params)   // y con qué filtros, para "anterior/siguiente"

      // numFound = total de resultados. Dividido por LIMITE = cuántas páginas hay.
      // Lo topeamos en MAX_PAGINAS porque la API no pagina bien tan profundo.
      const paginas = Math.ceil(datos.numFound / LIMITE)
      setTotalPaginas(Math.min(MAX_PAGINAS, Math.max(1, paginas)))
    } catch (e) {
      console.error(e)

      if (e instanceof TypeError) {
        // fetch tira TypeError cuando NO llegó al servidor

        setError('No hay conexión con el servidor. Revisá tu internet.')
      } else {
        // el Error que lanzamos por el código HTTP: error del SERVIDOR.
        setError('El servidor respondió con un error. Intentá más tarde.')
      }

      setLibros([])
    } finally {
      // Se ejecuta siempre, haya salido bien o mal.
      setCargando(false)
    }
  }

  // Buscar desde el formulario = búsqueda nueva → siempre arranca en página 1.
  function handleBuscar(params: BusquedaParams) {
    buscarLibros(params, 1)
  }

  // Navegación entre páginas: repiten la última búsqueda (`filtros`) con otra página.
  function irAnterior() {
    if (pagina > 1) buscarLibros(filtros, pagina - 1)
  }

  function irSiguiente() {
    if (pagina < totalPaginas) buscarLibros(filtros, pagina + 1)
  }

  // Carga inicial aca al abrir la Home traemos algo de fantasía que podemos cambiar luego. Esto es solo para que la Home no aparezca vacía.
  
  useEffect(() => {
    // La llamada va dentro de una función async interna: es el patrón
    // recomendado para traer datos al montar y evita el aviso de
    // "setState síncrono dentro del effect".
    async function cargarInicial() {
      await buscarLibros({ subject: 'fantasy' })
    }
    cargarInicial()
  }, [])

  return (
    <section className="page page-home">
      <PageHeader titulo="BookWeb" volver={false} />

      {/* El <main> ya lo pone App.tsx (uno por página). Acá va un div. */}
      <div className="home-content">

        {/* Al enviar el formulario, Search llama a handleBuscar
            con { title?, author?, subject? } → busca en página 1 */}
        <Search onBuscar={handleBuscar} />

        {/* --- Estados de la búsqueda --- */}

        {cargando && (
          <p className="home-status">Cargando libros…</p>
        )}

        {error && (
          <p className="home-status home-status--error">{error}</p>
        )}

        {!cargando && !error && libros.length === 0 && (
          <p className="home-status">No se encontraron libros.</p>
        )}

        {!cargando && !error && libros.length > 0 && (
          <>
            {/* key={pagina}: al cambiar de página, el carrusel interno
                de BookSection se reinicia (vuelve al primer libro). */}
            <BookSection key={pagina} titulo="Resultados" libros={libros} />

            <Pagination
              pagina={pagina}
              totalPaginas={totalPaginas}
              onAnterior={irAnterior}
              onSiguiente={irSiguiente}
            />
          </>
        )}

      </div>
    </section>
  )
}
