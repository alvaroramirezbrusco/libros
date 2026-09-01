import { useState } from 'react'
import PageHeader from '../../components/layout/PageHeader'
import type { ItemDeseo } from '../../types/deseo'
import { leerListaDeseos, eliminarListaDeseos } from '../../services/listaDeseos'
import './ListaDeseos.css'

export default function ListaDeseos() {
  // Los ítems guardados. La función se ejecuta una sola vez, al crear
  // el estado: lee lo que haya en localStorage al abrir la página.
  const [items, setItems] = useState<ItemDeseo[]>(() => leerListaDeseos())

  // Borra el ítem del localStorage y vuelve a leer para refrescar la vista.
  function handleEliminar(id: string) {
    eliminarListaDeseos(id)
    setItems(leerListaDeseos())
  }

  return (
    <section className="page page-lista-deseos">
      <PageHeader titulo="Lista de deseos" volver={true} />

      {items.length === 0 ? (
        <p className="lista-deseos__vacia">Tu lista de deseos está vacía.</p>
      ) : (
        <ul className="lista-deseos__items">
          {items.map((item) => (
            <li key={item.id} className="lista-deseos__item">
              <div className="lista-deseos__cover">
                {item.cover ? (
                  <img src={item.cover} alt={`Portada de ${item.title}`} />
                ) : (
                  <div className="lista-deseos__no-cover">Sin portada</div>
                )}
              </div>

              <div className="lista-deseos__info">
                <h2 className="lista-deseos__titulo">{item.title}</h2>

                <p className="lista-deseos__autor">
                  de {item.authors.join(', ')}
                </p>

                <p className="lista-deseos__dato">
                  Prioridad: {item.prioridad}
                </p>
                <p className="lista-deseos__dato">
                  Etiqueta: {item.etiqueta}
                </p>

                {item.nota && (
                  <p className="lista-deseos__nota">{item.nota}</p>
                )}

                <button
                  type="button"
                  className="lista-deseos__eliminar"
                  onClick={() => handleEliminar(item.id)}
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
