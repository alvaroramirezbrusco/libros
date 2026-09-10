import type { Book } from '../../types/book'
import BookCard from './BookCard'
import './BookList.css'

interface Props {
  books: Book[]
}

export default function BookList({ books }: Props) {
  return (
    <div className="book-list">
      {books.map((book) => (
        <BookCard
          key={book.id}
          book={book}
        />
      ))}
    </div>
  )
}