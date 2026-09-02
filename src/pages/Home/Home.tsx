import { useEffect, useState } from 'react'
import PageHeader from '../../components/layout/PageHeader'
import Search from '../../components/search/Search'
import type { BusquedaParams } from '../../components/search/Search'
import BookSection from '../../components/books/BookSection'
import BookList from '../../components/books/BookList'
import Pagination from '../../components/books/Pagination'
import type { BookPreview } from '../../types/book'
import './Home.css'

const API_URL = 'https://openlibrary.org/search.json' // URL del endpoint de búsqueda de Open Library.
                                                    // Doc: https://openlibrary.org/dev/docs/api/search

const LIMITE = 10      // libros por página de resultados
const MAX_PAGINAS = 10 // la API trea maa, pero solo se pido 10 

const CATEGORIAS = [
  { titulo: 'Fantasía', subject: 'fantasy' },
  { titulo: 'Ciencia ficción', subject: 'science_fiction' },
  { titulo: 'Romance', subject: 'romance' },
  { titulo: 'Misterio', subject: 'mystery' },
  { titulo: 'Ficción', subject: 'fiction' },
]

// Forma (parcial) de cada libro que devuelve Open Library.
// Solo listamos los campos que usamos; todos opcionales porque
// la API no garantiza que cada libro los tenga.
interface OpenLibraryDoc {
  key: string
  title: string
  author_name?: string[]
  cover_i?: number
  ratings_average?: number
  ratings_count?: number
}

// Forma de la respuesta completa del endpoint de búsqueda.
interface OpenLibraryResponse {
  numFound: number // total de resultados que matchean (lo usamos para el total de páginas)
  docs: OpenLibraryDoc[]
}

// Convierte el formato de Open Library a nuestro formato Book
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

export default function Home() {
  //  Estado de la pantalla 
  const [libros, setLibros] = useState<BookPreview[]>([]) // resultados
  
  const [librosPorCategoria, setLibrosPorCategoria] =
    useState<Record<string, BookPreview[]>>({})

  const [cargandoCategorias, setCargandoCategorias] = useState(true)

  const [cargando, setCargando] = useState(false) // true mientras esperamos la API
  const [error, setError] = useState<string | null>(null) // mensaje si algo falla

  //  Estado de la paginacion
  const [pagina, setPagina] = useState(1)           // pagina actual
  const [totalPaginas, setTotalPaginas] = useState(1)
  const [filtros, setFiltros] = useState<BusquedaParams>({ subject: 'fantasy' }) // ultima busqueda hecha

  const [buscando, setBuscando] = useState(false)
  const [restaurando, setRestaurando] = useState(true)

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

    query.set(
      'fields',
      'key,title,author_name,cover_i,ratings_average,ratings_count'
    )

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
      const resultado: BookPreview[] = datos.docs.map(convertirLibro)

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

  async function cargarCategoria(subject: string) {
    const query = new URLSearchParams()

    query.set('subject', subject)
    query.set('limit', '10')

    query.set(
      'fields',
      'key,title,author_name,cover_i,ratings_average,ratings_count'
    )

    try {
      const respuesta = await fetch(`${API_URL}?${query.toString()}`)

      if (!respuesta.ok) {
        throw new Error(`HTTP ${respuesta.status}`)
      }

      const datos: OpenLibraryResponse = await respuesta.json()

      const resultado: BookPreview[] = datos.docs.map(convertirLibro)

      setLibrosPorCategoria((actual) => ({
        ...actual,
        [subject]: resultado
      }))
    } catch (e) {
      console.error(`Error cargando categoría ${subject}:`, e)
    }
  }

  // Buscar desde el formulario = búsqueda nueva → siempre arranca en página 1.
  function handleBuscar(params: BusquedaParams) {
    setBuscando(true)
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
    const estadoGuardado = sessionStorage.getItem('estadoHome')

    async function cargarInicial() {
      if (estadoGuardado) {
        const estado = JSON.parse(estadoGuardado)

        setBuscando(true)

        await buscarLibros(
          estado.filtros,
          estado.pagina
        )

        setRestaurando(false)

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            window.scrollTo({
              top: estado.scrollY,
              behavior: 'instant'
            })
          })
        })

        return
      }

      // Entrada normal a Home
      setCargandoCategorias(true)

      await Promise.all(
        CATEGORIAS.map((categoria) =>
          cargarCategoria(categoria.subject)
        )
      )

      setCargandoCategorias(false)
      setRestaurando(false)
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

        {!buscando && (
          <>
            {cargandoCategorias ? (
              <p className="home-status">
                Cargando categorías…
              </p>
            ) : (
              CATEGORIAS.map((categoria) => {
                const librosCategoria =
                  librosPorCategoria[categoria.subject] ?? []

                return (
                  <BookSection
                    key={categoria.subject}
                    titulo={categoria.titulo}
                    libros={librosCategoria}
                  />
                )
              })
            )}
          </>
        )}

        {/* --- Estados de la búsqueda --- */}

        {cargando && (
          <p className="home-status">Cargando libros…</p>
        )}

        {error && (
          <p className="home-status home-status--error">{error}</p>
        )}
{/*
        {!cargando && !error && libros.length === 0 && (
          <p className="home-status">No se encontraron libros.</p>
        )}
*/}
        {buscando && !cargando && !error && libros.length > 0 && (
          <>
            <section className="book-section">

              <div className="book-section__header">
                <h2 className="book-section__title">
                  Resultados
                </h2>
              </div>

              <BookList
                libros={libros}
              />

            </section>

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
