import PageHeader from '../../components/layout/PageHeader'
import { useLocation } from 'react-router-dom'
import './Detalle.css'
import type { Book } from '../../types/book'

export default function Detalle() {
  const location = useLocation()

  const libro = location.state?.libro as Book | undefined

  return (
    <section className="page page-detalle">
      <PageHeader titulo="Detalle" volver={true} />

      <article className="book-detail">

        <header className="book-detail__header">

          {/* Imagen utilizada como fondo */}
          {libro?.cover && (
            <div
              className="book-detail__background"
              style={{
                backgroundImage: `url(${libro.cover})`,
              }}
              aria-hidden="true"
            />
          )}

          {/* Contenido del header */}
          <div className="book-detail__content">

            <div className="book-detail__cover-container">

              <div className="book-detail__cover">
                {libro?.cover ? (
                  <img
                    src={libro.cover}
                    alt={`Portada de ${libro.title}`}
                  />
                ) : (
                  <div className="book-detail__no-cover">
                    Sin portada
                  </div>
                )}
              </div>

              <button
                type="button"
                className="book-detail__favorite"
                aria-label="Agregar a favoritos"
              >
                Agregar a favoritos
              </button>

            </div>

            <div className="book-detail__title">

              <h1>{libro?.title}</h1>

              {libro?.subtitle && (
                <p className="book-detail__subtitle">
                  {libro.subtitle}
                </p>
              )}

              <p className="book-detail__author">
                de {libro?.authors?.join(', ')}
              </p>

            </div>

          </div>

        </header>

        <section className="book-detail__info">
          <h2>Descripción</h2>

          <p>
            {libro?.description || 'Sin descripción disponible.'}
          </p>
        </section>

        <section className="book-detail__data">
          <h2>Información</h2>

          <p>Año: {libro?.year}</p>
          <p>Editorial: {libro?.publisher}</p>
          <p>ISBN-10: {libro?.isbn10.join(', ')}</p>
          <p>ISBN-13: {libro?.isbn13.join(', ')}</p>
          <p>Categorías: {libro?.categories.join(', ')}</p>
          <p>Temas: {libro?.subjects.join(', ')}</p>
          <p>Páginas: {libro?.pages}</p>
          <p>Idioma: {libro?.language.join(', ')}</p>
        </section>

      </article>
    </section>
  )
}