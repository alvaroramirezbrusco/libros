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
      state={{ libro }}
      className="book-card"
    >
      <article className="book-card__body">
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

        <div className="book-card__info">
          <div className="book-card__info-box">
            <h3 className="book-card__title">
              {libro.title}
            </h3>

            <p className="book-card__author">
              de {libro.authors.join(', ')}
            </p>
          </div>

          {libro.rating !== null && (
            <div className="book-card__rating">
              <span aria-hidden="true">★</span>
              <span>{libro.rating.toFixed(1)}</span>
            </div>
          )}
        </div>
      </article>
    </Link>
  )
}