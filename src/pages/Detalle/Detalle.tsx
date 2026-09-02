import PageHeader from '../../components/layout/PageHeader'
import { useLocation, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import './Detalle.css'

import type { BookDetail } from '../../types/book'
import type { ItemDeseo } from '../../types/deseo'

import { agregarListaDeseos, eliminarListaDeseos, estaEnListaDeseos } from '../../services/listaDeseos'
import FormularioDeseo from '../../components/deseos/FormularioDeseo'
import  {registrarVisita } from '../../services/historial'

interface OpenLibraryWork {
  title?: string
  description?: string | { value: string }
  covers?: number[]
  subjects?: string[]
  authors?: {
    author?: {
      key?: string
    }
  }[]
}

export default function Detalle() {
  const { id } = useParams<{ id: string }>()
  const location = useLocation()

  const estadoHome = location.state?.estadoHome
  
  
  const [libro, setLibro] = useState<BookDetail | null>(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)
 const [enLista, setEnLista] = useState(false)
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
    setEnLista(true)
  }
    useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  
  useEffect(() => {
    async function cargarLibro() {
      if (!id) {
        setError('No se encontró el ID del libro.')
        setCargando(false)
        return
      }

      try {
        setCargando(true)
        setError(null)

        const [respuestaWork, respuestaEdiciones] = await Promise.all([
          fetch(`https://openlibrary.org/works/${id}.json`),

          fetch(
            `https://openlibrary.org/works/${id}/editions.json?limit=1`
          ),
        ])

        if (!respuestaWork.ok) {
          throw new Error(`Error obteniendo el Work: HTTP ${respuestaWork.status}`)
        }

        if (!respuestaEdiciones.ok) {
          throw new Error(
            `Error obteniendo las ediciones: HTTP ${respuestaEdiciones.status}`
          )
        }

        const datosWork: OpenLibraryWork = await respuestaWork.json()
        const datosEdiciones = await respuestaEdiciones.json()

        const edicion = datosEdiciones.entries?.[0]

        // Descripción
        const descripcion =
          typeof datosWork.description === 'string'
            ? datosWork.description
            : datosWork.description?.value ?? null

        // Autores
        const autores = datosWork.authors ?? []

        const nombresAutores: string[] = []

        for (const autor of autores) {
          if (!autor.author?.key) continue

          const respuestaAutor = await fetch(
            `https://openlibrary.org${autor.author.key}.json`
          )

          if (respuestaAutor.ok) {
            const datosAutor = await respuestaAutor.json()

            if (datosAutor.name) {
              nombresAutores.push(datosAutor.name)
            }
          }
        }

        const libroDetalle: BookDetail = {
          id,
          title: datosWork.title ?? '',
          authors: nombresAutores,
          cover: datosWork.covers?.[0]
            ? `https://covers.openlibrary.org/b/id/${datosWork.covers[0]}-L.jpg`
            : null,
          rating: null,
          ratingCount: null,
          description: descripcion,
          year: edicion?.publish_date
            ? Number(edicion.publish_date.match(/\d{4}/)?.[0]) || null
            : null,
          publisher: edicion?.publishers?.[0] ?? null,
          publishers: edicion?.publishers ?? [],
          categories: [
            ...new Set(
              (datosWork.subjects ?? [])
                .flatMap((categoria) => categoria.split(','))
                .map((categoria) => categoria.trim())
                .filter(Boolean)
            )
          ].slice(0, 10),
          pages: edicion?.number_of_pages ?? null,
          language:
            edicion?.languages?.map(
              (idioma: { key: string }) =>
                idioma.key.split('/').pop() ?? ''
            ) ?? [],
        }

        setLibro(libroDetalle)
        setEnLista(estaEnListaDeseos(id))
      } catch (error) {
        console.error('Error obteniendo el libro:', error)
        setError('No se pudo cargar el libro.')
      } finally {
        setCargando(false)
      }
    }

    cargarLibro()
  }, [id])

  if (cargando) {
    return (
      <section className="page page-detalle">
        <PageHeader
          titulo="Detalle"
          volver={true}
          estadoHome={estadoHome}
        />
        <p className="book-detail__status">Cargando libro...</p>
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
                className="book-detail__favorite"
                aria-label={enLista ? "Quitar de la lista de deseos" : "Agregar a la lista de deseos"}
                onClick={() => {
                  if (enLista) {
                    eliminarListaDeseos(libro.id)
                    setEnLista(false)
                    setConfirmado(false)
                  } else {
                    
                    setFormAbierto(true)
                  }
                 
                }}
              >
                {enLista ? 'Quitar de la lista de deseos' : 'Agregar a la lista de deseos'}
              </button>
            </div>

            {/* Información principal */}
            <div className="book-detail__title">

              <h1>{libro.title}</h1>

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
          <FormularioDeseo
            onConfirmar={handleConfirmar}
            onCancelar={() => setFormAbierto(false)}
          />
        )}

        {confirmado && (
          <p className="book-detail__confirmacion">
             Agregado a tu lista de deseos.
          </p>
        )}

        {/* Descripción */}
        <section className="book-detail__info">
          <div className="book-detail__block">
            <strong>Descripción</strong>
            <p>
              {libro.description ?? 'No disponible'}
            </p>
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