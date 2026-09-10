import { Link } from 'react-router-dom'
import type { Book } from '../../types/book'
import './BookCard.css'

interface Props {
  book: Book
}

export default function BookCard({ book }: Props) {
  return (
    <Link
      to={`/libro/${book.id}`}
      state={{ book }}
      className="book-card"
    >
      <article className="book-card__body">
        <div className="book-card__cover">
          {book.cover ? (
            <img
              src={book.cover}
              alt={`Portada de ${book.title}`}
            />
          ) : (
            <div className="book-card__no-cover">
              Sin portada
            </div>
          )}
        </div>

        <div className="book-card__info">
          <div className="book-card__info-box">
            <h3 className="book-card__title">
              {book.title}
            </h3>

            <p className="book-card__author">
              de {book.authors.join(', ')}
            </p>
          </div>

          {book.rating !== null && (
            <div className="book-card__rating">
              <span aria-hidden="true">★</span>
              <span>{book.rating.toFixed(1)}</span>
            </div>
          )}
        </div>
      </article>
    </Link>
  )
}