import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../../components/layout/PageHeader'
import { leerHistorial } from '../../services/historial'
import { detallePath } from '../../routes/paths'
import './Historial.css'

export default function Historial() {
  // La función se ejecuta una sola vez, al crear el estado: lee lo que
  // haya guardado en localStorage. El service ya lo devuelve ordenado
  // con el más reciente primero.
  const [items] = useState(() => leerHistorial())

  return (
    <section className="page page-historial">
      <PageHeader titulo="Historial" volver={true} />

      {items.length === 0 ? (
        <p className="historial__vacio">Todavía no visitaste ningún libro.</p>
      ) : (
        <ul className="historial__items">
          {items.map((item) => (
            <li key={item.libro.id} className="historial__item">
              <Link
                to={detallePath(item.libro.id)}
                state={{ libro: item.libro }}
                className="historial__link"
              >
                <div className="historial__cover">
                  {item.libro.cover ? (
                    <img
                      src={item.libro.cover}
                      alt={`Portada de ${item.libro.title}`}
                    />
                  ) : (
                    <div className="historial__no-cover">Sin portada</div>
                  )}
                </div>

                <div className="historial__info">
                  <h2 className="historial__titulo">{item.libro.title}</h2>
                  <p className="historial__autor">
                    de {item.libro.authors.join(', ')}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
