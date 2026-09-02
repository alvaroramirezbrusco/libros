import { useState } from 'react'

import { Link } from 'react-router-dom'

import type { ItemDeseo } from '../../types/deseo'

import './DeseoCard.css'

interface Props {
  item: ItemDeseo
  onEliminar: () => void
}

export default function DeseoCard({
  item,
  onEliminar,
}: Props) {

  const [expandida, setExpandida] = useState(false)

  // *Determina si el contenido necesita poder expandirse.*
  const necesitaExpandir =
    item.etiqueta.length > 60 ||
    (item.nota?.length ?? 0) > 100

  return (
    <article className="deseo-card">

      {/* *Portada + información principal* */}

      <div className="deseo-card__principal">

        <div className="deseo-card__cover">

          {item.cover ? (
            <img
              src={item.cover}
              alt={`Portada de ${item.title}`}
            />
          ) : (
            <div className="deseo-card__no-cover">
              Sin portada
            </div>
          )}

        </div>

        <div className="deseo-card__info">

          <h2 className="deseo-card__title">
            {item.title}
          </h2>

          <p className="deseo-card__author">
            de {item.authors.join(', ')}
          </p>

          <p className="deseo-card__priority">
            Prioridad: {item.prioridad}
          </p>

        </div>

      </div>

      {/* *Etiqueta y nota* */}

      <div
        className={`deseo-card__details ${
          expandida
            ? 'deseo-card__details--expanded'
            : ''
        }`}
      >

        <p className="deseo-card__text">
          <strong>Etiqueta:</strong> {item.etiqueta}
        </p>

        {item.nota && (
          <p className="deseo-card__text">
            <strong>Nota:</strong> {item.nota}
          </p>
        )}

      </div>

      {/* *Solo aparece si la etiqueta o la nota son largas.* */}

      {necesitaExpandir && (
        <button
          type="button"
          className="deseo-card__more"
          onClick={() =>
            setExpandida((actual) => !actual)
          }
          aria-expanded={expandida}
        >
          {expandida ? '− Menos' : '+ Más'}
        </button>
      )}

      {/* *Acciones: siempre visibles.* */}

      <div className="deseo-card__actions">

        <Link
          to={`/libro/${item.id}`}
          className="deseo-card__button deseo-card__button--details"
        >
          Detalles
        </Link>

        <button
          type="button"
          className="deseo-card__button deseo-card__button--delete"
          onClick={onEliminar}
        >
          Eliminar
        </button>

      </div>

    </article>
  )
}
