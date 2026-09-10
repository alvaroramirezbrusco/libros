import PageHeader from '../../components/layout/PageHeader'
import Search from '../../components/search/Search'
import BookSection from '../../components/books/BookSection'
import BookList from '../../components/books/BookList'
import Pagination from '../../components/books/Pagination'
import Loader from '../../components/ui/Loader'
import EmptyState from '../../components/ui/EmptyState'

import { useHome } from '../../hooks/useHome'
import { CATEGORIES } from '../../constants/categories'

import './Home.css'

export default function Home() {
  const {
    books,
    booksByCategory,
    loading,
    loadingCategories,
    error,
    searching,
    page: currentPage,
    totalPages,
    handleSearch,
    goToPreviousPage,
    goToNextPage,
  } = useHome()

  return (
    <section className="page home-page">

      <PageHeader
        title="BookWeb"
        showBack={false}
      />

      <div className="page-content page-content--wide">

        <Search onSearch={handleSearch} />

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
                    title={category.titulo}
                    books={categoryBooks}
                  />
                )
              })
            )}
          </>
        )}

        {loading && <Loader />}

        {error && (
          <p className="home-message home-message--error">
            {error}
          </p>
        )}

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

                <BookList books={books} />

              </section>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPrevious={goToPreviousPage}
                onNext={goToNextPage}
              />
            </>
          )}

        {searching &&
          !loading &&
          !error &&
          books.length === 0 && (
            <EmptyState
              message="No se encontraron resultados."
            />
          )}

      </div>

    </section>
  )
}
