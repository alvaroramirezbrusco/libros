// *Vista principal de la aplicación.*
// *Muestra el buscador, las categorías, los resultados y la paginación.*

import PageHeader from '../../components/layout/PageHeader'
import Search from '../../components/search/Search'
import BookSection from '../../components/books/BookSection'
import BookList from '../../components/books/BookList'
import Pagination from '../../components/books/Pagination'
import Loader from '../../components/ui/Loader'

import { useHome } from '../../hooks/useHome'
import { CATEGORIAS } from '../../constants/categorias'

import './Home.css'

export default function Home() {
  const {
    libros,
    librosPorCategoria,
    cargando,
    cargandoCategorias,
    error,
    buscando,
    pagina,
    totalPaginas,
    handleBuscar,
    irAnterior,
    irSiguiente,
  } = useHome()

  return (
    <section className="page page-home">

      <PageHeader
        titulo="BookWeb"
        volver={false}
      />

      <div className="home-content">

        <Search onBuscar={handleBuscar} />

        {/* Página principal con categorías */}
        {!buscando && (
          <>
            {cargandoCategorias ? (
              <Loader />
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

        {/* Cargando resultados de búsqueda */}
        {cargando && <Loader />}

        {/* Error */}
        {error && (
          <p className="home-status home-status--error">
            {error}
          </p>
        )}

        {/* Resultados de búsqueda */}
        {buscando &&
          !cargando &&
          !error &&
          libros.length > 0 && (
            <>
              <section className="book-section">

                <div className="book-section__header">
                  <h2 className="book-section__title">
                    Resultados
                  </h2>
                </div>

                <BookList libros={libros} />

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