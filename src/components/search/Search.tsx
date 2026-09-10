import { useState } from 'react'
import './Search.css'

export interface SearchParams {
  title?: string
  author?: string
  subject?: string
}

interface Props {
  onSearch: (params: SearchParams) => void
}

export default function Search({ onSearch }: Props) {
  const [isOpen, setIsOpen] = useState(false)

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [category, setCategory] = useState('')

  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const t = title.trim()
    const a = author.trim()

    if (!t && !a && !category) {
      setErrorMessage('Complete al menos un campo')
      return
    }

    if (t && t.length < 2) {
      setErrorMessage('El título debe tener al menos 2 caracteres.')
      return
    }
    if (a && a.length < 2) {
      setErrorMessage('El autor debe tener al menos 2 caracteres.')
      return
    }

    if (a && /\d/.test(a)) {
      setErrorMessage('El autor no puede contener números.')
      return
    }

    setErrorMessage('')

    onSearch({
      title: t || undefined,
      author: a || undefined,
      subject: category || undefined,
    })
    setIsOpen(false)
  }

  return (
    <section className={`search ${isOpen ? 'search--open' : 'search--closed'}`}>

      <button
        type="button"
        className="search-header"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span>
          {isOpen ? 'Ocultar menú' : 'Mostrar menú'}
        </span>

        <span className="search-arrow">
          {isOpen ? '▲' : '▼'}
        </span>
      </button>

      <form
        className={`search-form ${
          isOpen
            ? 'search-form--open'
            : 'search-form--closed'
        }`}
        onSubmit={handleSubmit}
      >

        <div className="search-field">
          <label htmlFor="title">
            Título
          </label>

          <input
            id="title"
            type="text"
            placeholder="Cyberspace"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="search-field">
          <label htmlFor="author">
            Autor
          </label>

          <input
            id="author"
            type="text"
            placeholder="Miachel Benedikt"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
        </div>

        <div className="search-field">
          <label htmlFor="category">
            Categoría
          </label>

          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">
              Seleccionar
            </option>

            <option value="fantasy">
              Fantasía
            </option>

            <option value="fiction">
              Ficción
            </option>

            <option value="romance">
              Romance
            </option>

            <option value="mystery">
              Misterio
            </option>

            <option value="science_fiction">
              Ciencia ficción
            </option>
          </select>
        </div>

        {errorMessage && <p className="search-error-inline">{errorMessage}</p>}

        <button
          type="submit"
          className="search-button"
        >
          Buscar
        </button>
      </form>
    </section>
  )
}
