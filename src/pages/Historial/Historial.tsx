import { useMemo, useState } from 'react'

import PageHeader from '../../components/layout/PageHeader'
import BookList from '../../components/books/BookList'
import Pagination from '../../components/books/Pagination'

import { leerHistorial } from '../../services/historial'

import { usePagination } from '../../hooks/usePagination'

import './Historial.css'

const LIBROS_POR_PAGINA = 10

export default function Historial() {
  // *Lee el historial una sola vez al crear el estado.*
  // *El service ya devuelve los libros ordenados del más reciente al más antiguo.*
  const [items] = useState(() => leerHistorial())

  const totalPaginas = Math.max(
    1,
    Math.ceil(items.length / LIBROS_POR_PAGINA)
  )

  const {
    pagina,
    irAnterior,
    irSiguiente,
  } = usePagination(totalPaginas)

  // *Obtiene solamente los libros correspondientes a la página actual.*
  const librosPagina = useMemo(() => {
    const inicio = (pagina - 1) * LIBROS_POR_PAGINA
    const fin = inicio + LIBROS_POR_PAGINA

    return items
      .slice(inicio, fin)
      .map((item) => item.libro)
  }, [items, pagina])

  return (
    <section className="page page-historial">

      <PageHeader
        titulo="Historial"
        volver={true}
      />

      <section className="historial-content">

        {items.length === 0 ? (
          <p className="historial__vacio">
            Todavía no visitaste ningún libro.
          </p>
        ) : (
          <>
            <BookList libros={librosPagina} />

            <Pagination
              pagina={pagina}
              totalPaginas={totalPaginas}
              onAnterior={irAnterior}
              onSiguiente={irSiguiente}
            />
          </>
        )}

      </section>

    </section>
  )
}