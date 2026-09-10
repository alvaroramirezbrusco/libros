// Vista de detalle de un libro: su info y alta/baja en la lista de deseos.

import { useLocation, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useBook } from '../../hooks/useBook'
import { useTranslation } from '../../hooks/useTranslation'

import './BookDetail.css'
import Loader from '../../components/ui/Loader'
import Toast from '../../components/ui/Toast'
import ConfirmAlert from '../../components/ui/ConfirmAlert'

import PageHeader from '../../components/layout/PageHeader'

import type { ItemDeseo } from '../../types/wish'
import { agregarListaDeseos, eliminarListaDeseos, estaEnListaDeseos } from '../../services/wishList'
import WishForm from '../../components/wishes/WishForm'
import  {registrarVisita } from '../../services/history'

export default function BookDetail() {
  const { id } = useParams<{ id: string }>()
  const location = useLocation()

  const estadoHome = location.state?.estadoHome

  const {
    libro,
    cargando,
    error
  } = useBook(id)

  const traduccionTitulo = useTranslation(libro?.title ?? null)
  const traduccionDescripcion = useTranslation(libro?.description ?? null)

  const tituloMostrado = traduccionTitulo.texto
  const descripcionMostrada = traduccionDescripcion.texto

  // Un mismo botón traduce título y descripción a la vez.
  const traducido =
    traduccionTitulo.traducido || traduccionDescripcion.traducido
  const traduciendo =
    traduccionTitulo.cargando || traduccionDescripcion.cargando
  const errorTraduccion =
    traduccionTitulo.error ?? traduccionDescripcion.error

  function alternarTraduccion() {
    traduccionTitulo.alternar()
    traduccionDescripcion.alternar()
  }

  const [enLista, setEnLista] = useState(false)
  const [formAbierto, setFormAbierto] = useState(false)
  const [toastVisible, setToastVisible] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [confirmarEliminar, setConfirmarEliminar] = useState(false)
  
  // Registra automáticamente la visita al libro en el historial.
  useEffect(() => {
    if (libro) {
      registrarVisita(libro)
    }
  }, [libro])
  
  function handleWishConfirm(data: { prioridad: number; etiqueta: string; nota?: string }) {
    if (!libro) return

    const item:ItemDeseo = {
      id: libro.id,
      title: libro.title,
      cover: libro.cover,
      authors: libro.authors,
      prioridad: data.prioridad,
      etiqueta: data.etiqueta,
      nota: data.nota,
    }
    
    agregarListaDeseos(item)

    setFormAbierto(false)
    setEnLista(true)

    //Mensaje de confirmación para el usuario
    setToastMessage('Agregado a tu lista de deseos.')
    setToastVisible(true)
  }

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    if (id) {
      setEnLista(estaEnListaDeseos(id))
    }
  }, [id])

  if (cargando) {
    return (
      <section className="page page-detalle">
        <PageHeader
          titulo="Detalle"
          volver={true}
          estadoHome={estadoHome}
        />

        <Loader />
      </section>
    )
  }

  if (error || !libro) {
    return (
      <section className="page page-detalle">
        <PageHeader
          titulo="Detalle"
          volver={true}
          estadoHome={estadoHome}
        />
        <p className="book-detail__status">
          {error ?? 'No se encontró el libro.'}
        </p>
      </section>
    )
  }

  return (
    <section className="page page-detalle">
      <PageHeader
        titulo="Detalle"
        volver={true}
        estadoHome={estadoHome}
      />

      {toastVisible && (
        <Toast
          message={toastMessage}
          onClose={() => setToastVisible(false)}
        />
      )}

      {confirmarEliminar && (
        <ConfirmAlert
          mensaje="¿Querés quitar este libro de tu lista de deseos?"
          onCancelar={() => setConfirmarEliminar(false)}
          onConfirmar={() => {
            eliminarListaDeseos(libro.id)

            setEnLista(false)
            setConfirmarEliminar(false)

            setToastMessage('Quitado de tu lista de deseos.')
            setToastVisible(true)
          }}
        />
      )}

      <article className="book-detail">

        {/* Header del libro */}
        <header className="book-detail__header">

          {/* Imagen utilizada como fondo */}
          {libro.cover && (
            <div
              className="book-detail__background"
              style={{
                backgroundImage: `url(${libro.cover})`,
              }}
              aria-hidden="true"
            />
          )}

          <div className="book-detail__content">

            {/* Portada */}
            <div className="book-detail__cover-container">
              <div className="book-detail__cover">
                {libro.cover ? (
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

              {/* Lista de deseos */}
              <button
                type="button"
                className={`book-detail__favorite ${
                  enLista ? 'book-detail__favorite--remove' : ''
                }`}
                aria-label={enLista ? "Quitar de la lista de deseos" : "Agregar a la lista de deseos"}
                onClick={() => {
                  if (enLista) {
                    setConfirmarEliminar(true)
                  } else {
                    setFormAbierto(true)
                  }
                }}
              >
                {enLista
                  ? 'Quitar de la lista de deseos'
                  : 'Agregar a la lista de deseos'}
              </button>
            </div>

            {/* Información principal */}
            <div className="book-detail__title">

              <h2>{tituloMostrado ?? libro.title}</h2>

              <p className="book-detail__author">
                de {libro.authors.join(', ') || 'Autor desconocido'}
              </p>

              {/* Calificación */}
              {libro.rating !== null && (
                <div className="book-detail__rating">
                  <span aria-hidden="true">★</span>
                  <span>{libro.rating.toFixed(1)}</span>
                </div>
              )}

            </div>
          </div>
        </header>

        {/* Formulario lista de deseos */}
        {formAbierto && (
          <WishForm
            onConfirm={handleWishConfirm}
            onCancel={() => setFormAbierto(false)}
          />
        )}

        {/* Descripción */}
        <section className="book-detail__info">
          <div className="book-detail__block">
            <div className="book-detail__block-header">
              <strong>Descripción</strong>

              {(libro.title || libro.description) && (
                <button
                  type="button"
                  className="book-detail__translate"
                  onClick={alternarTraduccion}
                  disabled={traduciendo}
                >
                  {traduciendo
                    ? 'Traduciendo…'
                    : traducido
                      ? 'Ver original'
                      : 'Ver en español'}
                </button>
              )}
            </div>

            <p className="book-detail__description">
              {descripcionMostrada ?? 'No disponible'}
            </p>

            {errorTraduccion && (
              <p className="book-detail__translate-error">
                {errorTraduccion}
              </p>
            )}
          </div>
        </section>

        {/* Información del libro */}
        {(
          libro.year !== null ||
          libro.publisher !== null ||
          libro.pages !== null ||
          libro.language.length > 0 ||
          libro.categories.length > 0
        ) && (
          <section className="book-detail__info">
            <div className="book-detail__block">

              <strong>Información</strong>

              {libro.year !== null && (
                <p>
                  Año:{' '}
                  <span className="book-detail__block-span">
                    {libro.year}
                  </span>
                </p>
              )}

              {libro.publisher !== null && (
                <p>
                  Editorial:{' '}
                  <span className="book-detail__block-span">
                    {libro.publisher}
                  </span>
                </p>
              )}

              {libro.pages !== null && (
                <p>
                  Páginas:{' '}
                  <span className="book-detail__block-span">
                    {libro.pages}
                  </span>
                </p>
              )}

              {libro.language.length > 0 && (
                <p>
                  Idiomas:{' '}
                  <span className="book-detail__block-span">
                    {libro.language.join(', ')}
                  </span>
                </p>
              )}

              {libro.categories.length > 0 && (
                <p>
                  Categorías:{' '}
                  <span className="book-detail__block-span">
                    {libro.categories.join(', ')}
                  </span>
                </p>
              )}

            </div>
          </section>
        )}

      </article>
    </section>
  )
}
