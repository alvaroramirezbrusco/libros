import { useMemo, useState } from 'react'

import PageHeader from '../../components/layout/PageHeader'

import DeseoCard from '../../components/deseos/DeseoCard'

import Pagination from '../../components/books/Pagination'

import ConfirmAlert from '../../components/ui/ConfirmAlert'

import Toast from '../../components/ui/Toast'

import type { ItemDeseo } from '../../types/deseo'

import {
  leerListaDeseos,
  eliminarListaDeseos,
} from '../../services/listaDeseos'

import { usePagination } from '../../hooks/usePagination'

import './ListaDeseos.css'

const DESEOS_POR_PAGINA = 10

export default function ListaDeseos() {

  // *Lee los deseos guardados al abrir la página.*
  const [items, setItems] = useState<ItemDeseo[]>(
    () => leerListaDeseos()
  )

  // *Guarda el deseo que el usuario quiere eliminar.*
  const [deseoAEliminar, setDeseoAEliminar] =
    useState<ItemDeseo | null>(null)

  // *Controla el mensaje que aparece después de eliminar.*
  const [toastVisible, setToastVisible] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  const totalPaginas = Math.max(
    1,
    Math.ceil(items.length / DESEOS_POR_PAGINA)
  )

  const {
    pagina,
    irAnterior,
    irSiguiente,
  } = usePagination(totalPaginas)

  // *Obtiene solamente los deseos de la página actual.*
  const itemsPagina = useMemo(() => {
    const inicio =
      (pagina - 1) * DESEOS_POR_PAGINA

    const fin =
      inicio + DESEOS_POR_PAGINA

    return items.slice(inicio, fin)
  }, [items, pagina])

  // *Elimina el deseo después de confirmar.*
  function handleEliminar() {
    if (!deseoAEliminar) return

    eliminarListaDeseos(deseoAEliminar.id)

    setItems(leerListaDeseos())

    setDeseoAEliminar(null)

    // *Muestra un mensaje confirmando la eliminación.*
    setToastMessage('Quitado de tu lista de deseos.')
    setToastVisible(true)
  }

  return (
    <section className="page page-lista-deseos">

      <PageHeader
        titulo="Lista de deseos"
        volver={true}
      />

      {toastVisible && (
        <Toast
          message={toastMessage}
          onClose={() =>
            setToastVisible(false)
          }
        />
      )}

      <section className="lista-deseos-content">

        {items.length === 0 ? (
          <p className="lista-deseos__vacia">
            Tu lista de deseos está vacía.
          </p>
        ) : (
          <>
            <div className="lista-deseos__items">

              {itemsPagina.map((item) => (
                <DeseoCard
                  key={item.id}
                  item={item}
                  onEliminar={() =>
                    setDeseoAEliminar(item)
                  }
                />
              ))}

            </div>

            <Pagination
              pagina={pagina}
              totalPaginas={totalPaginas}
              onAnterior={irAnterior}
              onSiguiente={irSiguiente}
            />
          </>
        )}

      </section>

      {/* *Modal de confirmación de eliminación.* */}

      {deseoAEliminar && (
        <ConfirmAlert
          mensaje="¿Querés quitar este libro de tu lista de deseos?"
          onCancelar={() =>
            setDeseoAEliminar(null)
          }
          onConfirmar={handleEliminar}
        />
      )}

    </section>
  )
}
