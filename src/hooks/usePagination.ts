// Maneja la página actual y la navegación; reutilizable en cualquier vista paginada.

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

  function reiniciar() {
    setPagina(1)
  }

  return {
    pagina,
    irAnterior,
    irSiguiente,
    irPagina,
    reiniciar,
  }
}