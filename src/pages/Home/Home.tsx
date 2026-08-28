import PageHeader from '../../components/layout/PageHeader'
import Search from '../../components/search/Search'
import BookSection from '../../components/books/BookSection'
import type { Book } from '../../types/book'
import './Home.css'

// DATOS DE PRUEBA
// Reemplazar por datos reales de la API

const librosPrueba: Book[] = [
  {
    id: '1',
    title: 'El Hobbit',
    subtitle: null,
    authors: ['J. R. R. Tolkien'],
    description: null,
    cover: null,
    year: 1937,
    publisher: null,
    publishers: ['George Allen & Unwin'],
    isbn10: [],
    isbn13: [],
    categories: ['Fantasía'],
    subjects: ['Dragones', 'Aventuras'],
    rating: 4.5,
    ratingCount: 100,
    pages: 310,
    language: ['spa']
  },
  {
    id: '2',
    title: 'Harry Potter y la piedra filosofal',
    subtitle: null,
    authors: ['J. K. Rowling'],
    description: null,
    cover: null,
    year: 1997,
    publisher: null,
    publishers: ['Bloomsbury'],
    isbn10: [],
    isbn13: [],
    categories: ['Fantasía'],
    subjects: ['Magia', 'Aventuras'],
    rating: 4.7,
    ratingCount: 200,
    pages: 223,
    language: ['spa']
  },
  {
    id: '3',
    title: 'Las crónicas de Narnia',
    subtitle: null,
    authors: ['C. S. Lewis'],
    description: null,
    cover: null,
    year: 1950,
    publisher: null,
    publishers: [],
    isbn10: [],
    isbn13: [],
    categories: ['Fantasía'],
    subjects: ['Magia', 'Aventuras'],
    rating: 4.4,
    ratingCount: 150,
    pages: 767,
    language: ['spa']
  },
  {
    id: '4',
    title: 'Alicia en el país de las maravillas',
    subtitle: null,
    authors: ['Lewis Carroll'],
    description: null,
    cover: null,
    year: 1865,
    publisher: null,
    publishers: [],
    isbn10: [],
    isbn13: [],
    categories: ['Fantasía'],
    subjects: ['Fantasía', 'Aventuras'],
    rating: 4.3,
    ratingCount: 120,
    pages: 200,
    language: ['spa']
  }
]

export default function Home() {
  return (
    <section className="page page-home">
      <PageHeader titulo="BookWeb" volver={false} />


        <main className="home-content">

          <Search />

          <BookSection
            titulo="Fantasía"
            libros={librosPrueba}
          />

        </main>
      {/* ...resto de la pantalla... */}
    </section>
  )
}
