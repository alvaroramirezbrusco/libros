import { useLocation, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useBook } from '../../hooks/useBook'
import { useTranslation } from '../../hooks/useTranslation'

import './BookDetail.css'
import Loader from '../../components/ui/Loader'
import Toast from '../../components/ui/Toast'
import ConfirmAlert from '../../components/ui/ConfirmAlert'

import PageHeader from '../../components/layout/PageHeader'

import type { WishItem } from '../../types/wish'
import { addWish, removeWish, isInWishList as checkWishList } from '../../services/wishList'
import WishForm from '../../components/wishes/WishForm'
import { recordVisit } from '../../services/history'

export default function BookDetail() {
  const { id } = useParams<{ id: string }>()
  const location = useLocation()

  const homeState = location.state?.estadoHome

  const {
    book,
    loading,
    error
  } = useBook(id)

  const titleTranslation = useTranslation(book?.title ?? null)
  const descriptionTranslation = useTranslation(book?.description ?? null)

  const displayedTitle = titleTranslation.text
  const displayedDescription = descriptionTranslation.text

  const isTranslated =
    titleTranslation.translated || descriptionTranslation.translated
  const isTranslating =
    titleTranslation.loading || descriptionTranslation.loading
  const translationError =
    titleTranslation.error ?? descriptionTranslation.error

  function toggleTranslation() {
    titleTranslation.toggle()
    descriptionTranslation.toggle()
  }

  const [isInWishList, setIsInWishList] = useState(false)
  const [isWishFormOpen, setIsWishFormOpen] = useState(false)
  const [isToastVisible, setIsToastVisible] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false)
  
  useEffect(() => {
    if (book) {
      recordVisit(book)
    }
  }, [book])
  
  function handleWishConfirm(data: { priority: number; label: string; note?: string }) {
    if (!book) return

    const item: WishItem = {
      id: book.id,
      title: book.title,
      cover: book.cover,
      authors: book.authors,
      priority: data.priority,
      label: data.label,
      note: data.note,
    }
    
    addWish(item)

    setIsWishFormOpen(false)
    setIsInWishList(true)

    setToastMessage('Agregado a tu lista de deseos.')
    setIsToastVisible(true)
  }

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    if (id) {
      setIsInWishList(checkWishList(id))
    }
  }, [id])

  if (loading) {
    return (
      <section className="page page-detail">
        <PageHeader
          title="Detalle"
          showBack={true}
          homeState={homeState}
        />

        <Loader />
      </section>
    )
  }

  if (error || !book) {
    return (
      <section className="page page-detail">
        <PageHeader
          title="Detalle"
          showBack={true}
          homeState={homeState}
        />
        <p className="book-detail__status">
          {error ?? 'No se encontró el libro.'}
        </p>
      </section>
    )
  }

  return (
    <section className="page page-detail">
      <PageHeader
        title="Detalle"
        showBack={true}
        homeState={homeState}
      />

      {isToastVisible && (
        <Toast
          message={toastMessage}
          onClose={() => setIsToastVisible(false)}
        />
      )}

      {isDeleteConfirmationOpen && (
        <ConfirmAlert
          message="¿Querés quitar este libro de tu lista de deseos?"
          onCancel={() => setIsDeleteConfirmationOpen(false)}
          onConfirm={() => {
            removeWish(book.id)

            setIsInWishList(false)
            setIsDeleteConfirmationOpen(false)

            setToastMessage('Quitado de tu lista de deseos.')
            setIsToastVisible(true)
          }}
        />
      )}

      <article className="book-detail">

        <header className="book-detail__header">

          {book.cover && (
            <div
              className="book-detail__background"
              style={{
                backgroundImage: `url(${book.cover})`,
              }}
              aria-hidden="true"
            />
          )}

          <div className="book-detail__content">

            <div className="book-detail__cover-container">
              <div className="book-detail__cover">
                {book.cover ? (
                  <img
                    src={book.cover}
                    alt={`Portada de ${book.title}`}
                  />
                ) : (
                  <div className="book-detail__no-cover">
                    Sin portada
                  </div>
                )}
              </div>

              <button
                type="button"
                className={`book-detail__favorite ${
                  isInWishList ? 'book-detail__favorite--remove' : ''
                }`}
                aria-label={isInWishList ? "Quitar de la lista de deseos" : "Agregar a la lista de deseos"}
                onClick={() => {
                  if (isInWishList) {
                    setIsDeleteConfirmationOpen(true)
                  } else {
                    setIsWishFormOpen(true)
                  }
                }}
              >
                {isInWishList
                  ? 'Quitar de la lista de deseos'
                  : 'Agregar a la lista de deseos'}
              </button>
            </div>

            <div className="book-detail__title">

              <h2>{displayedTitle ?? book.title}</h2>

              <p className="book-detail__author">
                de {book.authors.join(', ') || 'Autor desconocido'}
              </p>

              {book.rating !== null && (
                <div className="book-detail__rating">
                  <span aria-hidden="true">★</span>
                  <span>{book.rating.toFixed(1)}</span>
                </div>
              )}

            </div>
          </div>
        </header>

        {isWishFormOpen && (
          <WishForm
            onConfirm={handleWishConfirm}
            onCancel={() => setIsWishFormOpen(false)}
          />
        )}

        <section className="book-detail__info">
          <div className="book-detail__block">
            <div className="book-detail__block-header">
              <strong>Descripción</strong>

              {(book.title || book.description) && (
                <button
                  type="button"
                  className="book-detail__translate"
                  onClick={toggleTranslation}
                  disabled={isTranslating}
                >
                  {isTranslating
                    ? 'Traduciendo…'
                    : isTranslated
                      ? 'Ver original'
                      : 'Ver en español'}
                </button>
              )}
            </div>

            <p className="book-detail__description">
              {displayedDescription ?? 'No disponible'}
            </p>

            {translationError && (
              <p className="book-detail__translate-error">
                {translationError}
              </p>
            )}
          </div>
        </section>

        {(
          book.year !== null ||
          book.publisher !== null ||
          book.pages !== null ||
          book.language.length > 0 ||
          book.categories.length > 0
        ) && (
          <section className="book-detail__info">
            <div className="book-detail__block">

              <strong>Información</strong>

              {book.year !== null && (
                <p>
                  Año:{' '}
                  <span className="book-detail__block-span">
                    {book.year}
                  </span>
                </p>
              )}

              {book.publisher !== null && (
                <p>
                  Editorial:{' '}
                  <span className="book-detail__block-span">
                    {book.publisher}
                  </span>
                </p>
              )}

              {book.pages !== null && (
                <p>
                  Páginas:{' '}
                  <span className="book-detail__block-span">
                    {book.pages}
                  </span>
                </p>
              )}

              {book.language.length > 0 && (
                <p>
                  Idiomas:{' '}
                  <span className="book-detail__block-span">
                    {book.language.join(', ')}
                  </span>
                </p>
              )}

              {book.categories.length > 0 && (
                <p>
                  Categorías:{' '}
                  <span className="book-detail__block-span">
                    {book.categories.join(', ')}
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
