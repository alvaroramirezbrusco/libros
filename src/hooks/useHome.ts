// Coordina la lógica del Home: búsqueda, categorías y restauración de estado al volver.

import { useEffect, useState } from 'react'

import type { BusquedaParams } from '../components/search/Search'

import { useBookSearch } from './useBookSearch'
import { useHomeCategories } from './useHomeCategories'

import { CATEGORIAS } from '../constants/categories'

export function useHome() {

  const [buscando, setBuscando] = useState(false)
  const [restaurando, setRestaurando] = useState(true)

  const {
    libros,
    pagina,
    totalPaginas,
    cargando,
    error,
    buscar,
    anterior,
    siguiente,
    buscarLibros
  } = useBookSearch()

  const {
    librosPorCategoria,
    cargando: cargandoCategorias,
    cargarCategorias
  } = useHomeCategories()

  function handleBuscar(params: BusquedaParams) {
    setBuscando(true)
    buscar(params)
  }

  useEffect(() => {
    const estadoGuardado =
      sessionStorage.getItem('estadoHome')
    async function cargarInicial() {

      if (estadoGuardado) {
        const estado =
          JSON.parse(estadoGuardado)

        setBuscando(true)

        await buscarLibros(
          estado.filtros,
          estado.pagina
        )

        setRestaurando(false)
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            window.scrollTo({
              top: estado.scrollY,
              behavior: 'instant'
            })
          })
        })
        return
      }
      await cargarCategorias(CATEGORIAS)
      setRestaurando(false)
    }
    cargarInicial()
  }, [])

  return {
    libros,
    librosPorCategoria,

    cargando,
    cargandoCategorias,
    error,

    buscando,
    restaurando,

    pagina,
    totalPaginas,

    handleBuscar,
    irAnterior: anterior,
    irSiguiente: siguiente
  }
}
