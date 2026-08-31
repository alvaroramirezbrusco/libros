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
  const [botonActivo, setBotonActivo] = useState<'anterior' | 'siguiente' | null>(null)
  const [direccion, setDireccion] = useState<'izquierda' | 'derecha' | null>(null)

  const librosVisibles = libros.slice(
    indice,
    indice + 2
  )

  const puedeRetroceder = indice > 0

  const puedeAvanzar = indice + 2 < libros.length

  const anterior = () => {
    if (puedeRetroceder) {
      setDireccion('derecha')
      setIndice(indice - 2)
      setBotonActivo('anterior')

      setTimeout(() => {
        setBotonActivo(null)
      }, 300)
    }
  }

  const siguiente = () => {
    if (puedeAvanzar) {
      setDireccion('izquierda')
      setIndice(indice + 2)
      setBotonActivo('siguiente')

      setTimeout(() => {
        setBotonActivo(null)
      }, 300)
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
            className={`book-section__button ${
              botonActivo === 'anterior' ? 'book-section__button--active' : ''
            }`}
            onClick={anterior}
            disabled={!puedeRetroceder}
            aria-label={`Libros anteriores de ${titulo}`}
          >
            ‹
          </button>

          <button
            type="button"
            className={`book-section__button ${
              botonActivo === 'siguiente' ? 'book-section__button--active' : ''
            }`}
            onClick={siguiente}
            disabled={!puedeAvanzar}
            aria-label={`Más libros de ${titulo}`}
          >
            ›
          </button>

        </div>

      </div>

      <div className="book-section__carousel">
        <div
          key={indice}
          className={`book-section__carousel-content book-section__carousel-content--${direccion ?? ''}`}
        >
          <BookList libros={librosVisibles} />
        </div>
      </div>

    </section>
  )
}
