import { useState } from 'react'
import type { Book } from '../../types/book'
import BookList from './BookList'
import './BookSection.css'

interface Props {
  titulo: string
  libros: Book[]
}

export default function BookSection({
  titulo,
  libros
}: Props) {

  const [indice, setIndice] = useState(0)

  const librosVisibles = libros.slice(
    indice,
    indice + 2
  )

  const puedeRetroceder = indice > 0

  const puedeAvanzar = indice + 2 < libros.length

  const anterior = () => {
    if (puedeRetroceder) {
      setIndice(indice - 2)
    }
  }

  const siguiente = () => {
    if (puedeAvanzar) {
      setIndice(indice + 2)
    }
  }

  return (
    <section className="book-section">

      <div className="book-section__header">

        <h2 className="book-section__title">
          {titulo}
        </h2>

        <div className="book-section__controls">

          <button
            type="button"
            className="book-section__button"
            onClick={anterior}
            disabled={!puedeRetroceder}
            aria-label={`Libros anteriores de ${titulo}`}
          >
            ‹
          </button>

          <button
            type="button"
            className="book-section__button"
            onClick={siguiente}
            disabled={!puedeAvanzar}
            aria-label={`Más libros de ${titulo}`}
          >
            ›
          </button>

        </div>

      </div>

      <BookList libros={librosVisibles} />

    </section>
  )
}
