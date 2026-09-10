import { useMemo, useState } from 'react'

import PageHeader from '../../components/layout/PageHeader'

import WishCard from '../../components/wishes/WishCard'
import WishFilters from '../../components/wishes/WishFilters'

import Pagination from '../../components/books/Pagination'

import ConfirmAlert from '../../components/ui/ConfirmAlert'
import EmptyState from '../../components/ui/EmptyState'

import Toast from '../../components/ui/Toast'

import type { ItemDeseo } from '../../types/wish'
import { LABELS } from '../../constants/formWish'

import {
  leerListaDeseos,
  eliminarListaDeseos,
} from '../../services/wishList'

import { usePagination } from '../../hooks/usePagination'

import './WishList.css'

const WISHES_PER_PAGE = 10

export default function WishList() {

  const [items, setItems] = useState<ItemDeseo[]>(
    () => leerListaDeseos()
  )

  const [wishToDelete, setWishToDelete] =
    useState<ItemDeseo | null>(null)

  const [isToastVisible, setIsToastVisible] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [selectedPriorities, setSelectedPriorities] = useState<number[]>([])
  const [selectedLabels, setSelectedLabels] = useState<string[]>([])

  const labels = useMemo(() => (
    Array.from(new Set([
      ...LABELS,
      ...items.map((item) => item.etiqueta),
    ]))
  ), [items])

  const filteredWishes = useMemo(() => (
    items.filter((item) => {
      const matchesPriority = selectedPriorities.length === 0
        || selectedPriorities.includes(item.prioridad)
      const matchesLabel = selectedLabels.length === 0
        || selectedLabels.includes(item.etiqueta)

      return matchesPriority && matchesLabel
    })
  ), [items, selectedPriorities, selectedLabels])

  const totalPaginas = Math.max(
    1,
    Math.ceil(filteredWishes.length / WISHES_PER_PAGE)
  )

  const {
    pagina,
    irAnterior,
    irSiguiente,
    reiniciar,
  } = usePagination(totalPaginas)

  const paginatedWishes = useMemo(() => {
    const inicio =
      (pagina - 1) * WISHES_PER_PAGE

    const fin =
      inicio + WISHES_PER_PAGE

    return filteredWishes.slice(inicio, fin)
  }, [filteredWishes, pagina])

  function togglePriority(priority: number) {
    reiniciar()
    setSelectedPriorities((selected) => (
      selected.includes(priority)
        ? selected.filter((current) => current !== priority)
        : [...selected, priority]
    ))
  }

  function toggleLabel(label: string) {
    reiniciar()
    setSelectedLabels((selected) => (
      selected.includes(label)
        ? selected.filter((current) => current !== label)
        : [...selected, label]
    ))
  }

  function handleDelete() {
    if (!wishToDelete) return

    eliminarListaDeseos(wishToDelete.id)

    setItems(leerListaDeseos())

    setWishToDelete(null)

    setToastMessage('Quitado de tu lista de deseos.')
    setIsToastVisible(true)
  }

  return (
    <section className="page page-wish-list">

      <PageHeader
        titulo="BookWeb"
        volver={false}
      />

      {isToastVisible && (
        <Toast
          message={toastMessage}
          onClose={() =>
            setIsToastVisible(false)
          }
        />
      )}

      <main className="page-content page-content--wide">

        <nav className="wish-filters-nav">
          <h2>Lista de deseos</h2>
          <WishFilters
            selectedPriorities={selectedPriorities}
            selectedLabels={selectedLabels}
            labels={labels}
            onTogglePriority={togglePriority}
            onToggleLabel={toggleLabel}
          />
        </nav>

        <section>
          {items.length === 0 ? (
            <EmptyState message="Tu lista de deseos está vacía." />
          ) : filteredWishes.length === 0 ? (
            <EmptyState message="No hay deseos que coincidan con los filtros seleccionados." />
          ) : (
            <>
              <div className="wish-list__items">

                {paginatedWishes.map((item) => (
                  <WishCard
                    key={item.id}
                    item={item}
                    onDelete={() =>
                      setWishToDelete(item)
                    }
                  />
                ))}

              </div>

              <Pagination
                currentPage={pagina}
                totalPages={totalPaginas}
                onPrevious={irAnterior}
                onNext={irSiguiente}
              />
            </>
          )}
        </section>

      </main>

      {wishToDelete && (
        <ConfirmAlert
          mensaje="¿Querés quitar este libro de tu lista de deseos?"
          onCancelar={() =>
            setWishToDelete(null)
          }
          onConfirmar={handleDelete}
        />
      )}

    </section>
  )
}
