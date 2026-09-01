import PageHeader from '../../components/layout/PageHeader'
import { useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import './Detalle.css'
import type { Book } from '../../types/book'
import type { ItemDeseo } from '../../types/deseo'
import { agregarListaDeseos } from '../../services/listaDeseos'
import FormularioDeseo from '../../components/deseos/FormularioDeseo'
import  {registrarVisita } from '../../services/historial'

export default function Detalle() {
  const location = useLocation()

  const libro = location.state?.libro as Book | undefined
  const estadoHome = location.state?.estadoHome
  const [formAbierto, setFormAbierto] = useState(false)
  const [confirmado, setConfirmado] = useState(false)
//registramos automaticamente la visita al libro en el historial de visitas
  useEffect(() => {
    if (libro) {
      registrarVisita(libro)
    }
  }, [libro])
  
  function handleConfirmar(datos: { prioridad: number; etiqueta: string; nota?: string }) {
    if (!libro) return

    const item:ItemDeseo = {
      id: libro.id,
      title: libro.title,
      cover: libro.cover,
      authors: libro.authors,
      prioridad: datos.prioridad,
      etiqueta: datos.etiqueta,
      nota: datos.nota,
    }
    
    agregarListaDeseos(item)
    setFormAbierto(false)
    setConfirmado(true)
  }
    useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  
  return (
    <section className="page page-detalle">
      <PageHeader
        titulo="Detalle"
        volver={true}
        estadoHome={estadoHome}
      />

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
                aria-label="Agregar a la lista de deseos"
                onClick={() => {
                  setConfirmado(false)
                  setFormAbierto(true)
                }}
              >
                Agregar a la lista de deseos
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

        {formAbierto && (
          <FormularioDeseo
            onConfirmar={handleConfirmar}
            onCancelar={() => setFormAbierto(false)}
          />
        )}

        {confirmado && (
          <p className="book-detail__confirmacion">
            ✓ Agregado a tu lista de deseos.
          </p>
        )}

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