import { Link } from 'react-router-dom'
import { PRIORITY } from '../../constants/formWish'
import type { WishItem } from '../../types/wish'

import './WishCard.css'

interface Props {
  item: WishItem
  onDelete: () => void
}

export default function WishCard({
  item,
  onDelete,
}: Props) {

  const priority = PRIORITY.find(
    ({ value }) => value === item.priority
  )

  return (
    <article className="wish-card">
      <div className="wish-card__main">
        <div className="wish-card__cover">
          {item.cover ? (
            <img
              src={item.cover}
              alt={`Portada de ${item.title}`}
            />
          ) : (
            <div className="wish-card__no-cover">
              Sin portada
            </div>
          )}
        </div>

        <div className="wish-card__info">
          <h2 className="wish-card__title">
            {item.title}
          </h2>
          <p className="wish-card__author">
            de {item.authors.join(', ')}
          </p>

          <div className="wish-card__badges">
            {priority && (
              <span className={`wish-card__badge wish-card__badge--priority priority-${priority.value}`}>
                {priority.text}
              </span>
            )}

            <span className="wish-card__badge wish-card__badge--label">
              {item.label}
            </span>
          </div>
        </div>
      </div>

      <div className="wish-card__details">
        {item.note ? (
          <p className="wish-card__note">
            <strong>Nota:</strong> {item.note}
          </p>
        ) : (
          <p className="wish-card__note">
            <strong>Nota:</strong> Sin nota
          </p>
        )}
      </div>

      <div className="wish-card__actions">
        <Link
          to={`/libro/${item.id}`}
          className="wish-card__button wish-card__button--details"
        >
          Detalles
        </Link>

        <button
          type="button"
          className="wish-card__button wish-card__button--delete"
          onClick={onDelete}
        >
          Eliminar
        </button>
      </div>
    </article>
  )
}
