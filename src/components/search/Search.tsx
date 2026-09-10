import { useState } from 'react'
import './Search.css'

// Lo que Search entrega a Home al enviar: los tres campos son opcionales.
export interface BusquedaParams {
  title?: string
  author?: string
  subject?: string
}

// Home pasa qué hacer al enviar; Search solo junta lo escrito y lo entrega.
interface Props {
  onBuscar: (params: BusquedaParams) => void
}

export default function Search({ onBuscar }: Props) {
  const [abierto, setAbierto] = useState(false)

  // Un estado por campo (controlled inputs): el input siempre refleja estas variables.
  const [titulo, setTitulo] = useState('')
  const [autor, setAutor] = useState('')
  const [categoria, setCategoria] = useState('')

  // Lista de mensajes de error de validación. Vacía = formulario OK.
  const [errores, setErrores] = useState<string[]>([])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const t = titulo.trim()
    const a = autor.trim()

    // Validaciones del lado del cliente.
    const nuevosErrores: string[] = []

    if (!t && !a && !categoria) {
      nuevosErrores.push('Completá al menos un campo para buscar.')
    }
    
    if (t && t.length < 2) {
      nuevosErrores.push('El título debe tener al menos 2 caracteres.')
    }
    if (a && a.length < 2) {
      nuevosErrores.push('El autor debe tener al menos 2 caracteres.')
    }
    
    if (a && /\d/.test(a)) {
      nuevosErrores.push('El autor no puede contener números.')
    }

    setErrores(nuevosErrores)

    // Si hay errores, cortamos acá: no se hace la búsqueda.
    if (nuevosErrores.length > 0) return

    // Mandamos solo los campos con algo escrito (undefined evita strings vacíos en la API).
    onBuscar({
      title: t || undefined,
      author: a || undefined,
      subject: categoria || undefined,
    })
    setAbierto(false)   // cerrar el menú tras una búsqueda válida
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

          {/* Mensajes de validación (si los hay) */}
          {errores.length > 0 && (
            <ul className="search-errores">
              {errores.map((msg) => (
                <li key={msg}>{msg}</li>
              ))}
            </ul>
          )}

          <div className="search-field">
            <label htmlFor="titulo">
              Título
            </label>

            <input
              id="titulo"
              type="text"
              placeholder="Cyberspace"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
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
              value={autor}
              onChange={(e) => setAutor(e.target.value)}
            />
          </div>


          <div className="search-field">
            <label htmlFor="categoria">
              Categoría
            </label>

            <select
              id="categoria"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
            >
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

              <option value="science_fiction">
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
