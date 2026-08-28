import { Link } from 'react-router-dom'
import type { Book } from '../../types/book'
import './BookCard.css'

interface Props {
  libro: Book
}

export default function BookCard({ libro }: Props) {
  return (
    <Link
      to={`/libro/${libro.id}`}
      className="book-card"
    >
      {/* Portada */}
      <div className="book-card__cover">
        {libro.cover ? (
          <img
            src={libro.cover}
            alt={`Portada de ${libro.title}`}
          />
        ) : (
          <div className="book-card__no-cover">
            Sin portada
          </div>
        )}
      </div>

      {/* Información */}
      <div className="book-card__info">

        <h3 className="book-card__title">
          {libro.title}
        </h3>

        <p className="book-card__author">
          de {libro.authors.join(', ')}
        </p>

        {libro.rating !== null && (
          <div className="book-card__rating">
            <span aria-hidden="true">★</span>
            <span>{libro.rating.toFixed(1)}</span>
          </div>
        )}

      </div>
    </Link>
  )
}