// *Maneja la página actual y la navegación entre páginas.*
// *Es reutilizable en cualquier vista que necesite paginación.*

import { useState } from 'react'

export function usePagination(totalPaginas: number = 1) {

  const [pagina, setPagina] = useState(1)

  function irAnterior() {
    setPagina(actual =>
      Math.max(1, actual - 1)
    )
  }

  function irSiguiente() {
    setPagina(actual =>
      Math.min(totalPaginas, actual + 1)
    )
  }

  function irPagina(nuevaPagina: number) {
    if (
      nuevaPagina >= 1 &&
      nuevaPagina <= totalPaginas
    ) {
      setPagina(nuevaPagina)
    }
  }

  return {
    pagina,
    irAnterior,
    irSiguiente,
    irPagina
  }
}