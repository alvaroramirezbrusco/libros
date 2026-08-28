import { useState } from 'react'
import './Search.css'

export default function Search() {
  const [abierto, setAbierto] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Más adelante conectaremos esto con Open Library
    // Las opciones de búsqueda se deben cambiar por datos de la API
    console.log('Buscando...')
  }

  return (
    <section className={`search ${abierto ? 'search--open' : 'search--closed'}`}>

      <button
        type="button"
        className="search-header"
        onClick={() => setAbierto(!abierto)}
        aria-expanded={abierto}
      >
        <span>
          {abierto ? 'Ocultar menú' : 'Mostrar menú'}
        </span>

        <span className="search-arrow">
          {abierto ? '▲' : '▼'}
        </span>
      </button>
      
        <form
          className={`search-form ${
            abierto
              ? 'search-form--open'
              : 'search-form--closed'
          }`}
          onSubmit={handleSubmit}
        >

          <div className="search-field">
            <label htmlFor="titulo">
              Título
            </label>

            <input
              id="titulo"
              type="text"
              placeholder="Cyberspace"
            />
          </div>


          <div className="search-field">
            <label htmlFor="autor">
              Autor
            </label>

            <input
              id="autor"
              type="text"
              placeholder="Miachel Benedikt"
            />
          </div>


          <div className="search-field">
            <label htmlFor="categoria">
              Categoría
            </label>

            <select id="categoria">
              <option value="">
                Todos
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

              <option value="science-fiction">
                Ciencia ficción
              </option>
            </select>
          </div>


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
