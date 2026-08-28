import type { Book } from '../../types/book'
import BookCard from './BookCard'
import './BookList.css'

interface Props {
  libros: Book[]
}

export default function BookList({ libros }: Props) {
  return (
    <div className="book-list">
      {libros.map((libro) => (
        <BookCard
          key={libro.id}
          libro={libro}
        />
      ))}
    </div>
  )
}
