import { useState } from 'react'
import type { Book } from '../../types/book'
import BookList from './BookList'
import { useBreakpoint } from '../../hooks/useBreakpoint'
import './BookSection.css'

interface Props {
  title: string
  books: Book[]
}

export default function BookSection({
  title,
  books
}: Props) {

  const booksPerView = useBreakpoint() === 'mobile' ? 2 : 4

  const [index, setIndex] = useState(0)
  const [activeButton, setActiveButton] = useState<'previous' | 'next' | null>(null)
  const [direction, setDirection] = useState<'left' | 'right' | null>(null)

  const visibleBooks = books.slice(
    index,
    index + booksPerView
  )

  const canGoBack = index > 0

  const canGoNext = index + booksPerView < books.length

  const previous = () => {
    if (canGoBack) {
      setDirection('right')
      setIndex(index - booksPerView)
      setActiveButton('previous')

      setTimeout(() => {
        setActiveButton(null)
      }, 300)
    }
  }

  const next = () => {
    if (canGoNext) {
      setDirection('left')
      setIndex(index + booksPerView)
      setActiveButton('next')

      setTimeout(() => {
        setActiveButton(null)
      }, 300)
    }
  }

  return (
    <section className="book-section">

      <div className="book-section__header">

        <h2 className="book-section__title">
          {title}
        </h2>

        <div className="book-section__controls">

          <button
            type="button"
            className={`book-section__button ${
              activeButton === 'previous' ? 'book-section__button--active' : ''
            }`}
            onClick={previous}
            disabled={!canGoBack}
            aria-label={`Libros anteriores de ${title}`}
          >
            ‹
          </button>

          <button
            type="button"
            className={`book-section__button ${
              activeButton === 'next' ? 'book-section__button--active' : ''
            }`}
            onClick={next}
            disabled={!canGoNext}
            aria-label={`Más libros de ${title}`}
          >
            ›
          </button>

        </div>

      </div>

      <div className="book-section__carousel">
        <div
          key={index}
          className={`book-section__carousel-content book-section__carousel-content--${direction ?? ''}`}
        >
          <BookList books={visibleBooks} />
        </div>
      </div>

    </section>
  )
}
