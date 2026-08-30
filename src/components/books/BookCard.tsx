import { Link } from 'react-router-dom'
import type { Book } from '../../types/book'
import './BookCard.css'

interface Props {
  libro: Book
}

export default function BookCard({ libro }: Props) {
  return (
    // El <Link> es solo el envoltorio clickeable; <article> es el
    // contenido semántico que se pide en el tp(cada libro = un artículo independiente) Aca agregue el 
    <Link
      to={`/libro/${libro.id}`}
      state={{libro}} //mandamos el libro completo al detalle para no tener que buscarlo de nuevo en la lista
      
      className="book-card"
    >
      <article className="book-card__body">

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

      </article>
    </Link>
  )
}