import PageHeader from '../../components/layout/PageHeader'
import Search from '../../components/search/Search'
import BookSection from '../../components/books/BookSection'
import BookList from '../../components/books/BookList'
import Pagination from '../../components/books/Pagination'
import Loader from '../../components/ui/Loader'
import EmptyState from '../../components/ui/EmptyState'

import { useHome } from '../../hooks/useHome'
import { CATEGORIAS as CATEGORIES } from '../../constants/categories'

import './Home.css'

export default function Home() {
  const {
    libros: books,
    librosPorCategoria: booksByCategory,
    cargando: loading,
    cargandoCategorias: loadingCategories,
    error,
    buscando: searching,
    pagina: currentPage,
    totalPaginas: totalPages,
    handleBuscar: handleSearch,
    irAnterior: goToPreviousPage,
    irSiguiente: goToNextPage,
  } = useHome()

  return (
    <section className="page home-page">

      <PageHeader
        titulo="BookWeb"
        volver={false}
      />

      <div className="page-content page-content--wide">

        <Search onBuscar={handleSearch} />

        {/* Página principal con categorías */}
        {!searching && (
          <>
            {loadingCategories ? (
              <Loader />
            ) : (
              CATEGORIES.map((category) => {
                const categoryBooks =
                  booksByCategory[category.subject] ?? []

                return (
                  <BookSection
                    key={category.subject}
                    titulo={category.titulo}
                    libros={categoryBooks}
                  />
                )
              })
            )}
          </>
        )}

        {/* Cargando resultados de búsqueda */}
        {loading && <Loader />}

        {/* Error */}
        {error && (
          <p className="home-message home-message--error">
            {error}
          </p>
        )}

        {/* Resultados de búsqueda */}
        {searching &&
          !loading &&
          !error &&
          books.length > 0 && (
            <>
              <section className="book-section">

                <div className="book-section__header">
                  <h2 className="book-section__title">
                    Resultados
                  </h2>
                </div>

                <BookList libros={books} />

              </section>

              <Pagination
                pagina={currentPage}
                totalPaginas={totalPages}
                onAnterior={goToPreviousPage}
                onSiguiente={goToNextPage}
              />
            </>
          )}

        {searching &&
          !loading &&
          !error &&
          books.length === 0 && (
            <EmptyState
              message="No se encontraron resultados."
              icon="search"
            />
          )}

      </div>

    </section>
  )
}
