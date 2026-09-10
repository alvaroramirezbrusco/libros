import { useEffect, useState } from 'react'

import type { SearchParams } from '../components/search/Search'

import { useBookSearch } from './useBookSearch'
import { useHomeCategories } from './useHomeCategories'

import { CATEGORIES } from '../constants/categories'

export function useHome() {

  const [searching, setSearching] = useState(false)
  const [restoring, setRestoring] = useState(true)

  const {
    books,
    page,
    totalPages,
    loading,
    error,
    search,
    previous,
    next,
    searchBooks
  } = useBookSearch()

  const {
    booksByCategory,
    loading: loadingCategories,
    loadCategories
  } = useHomeCategories()

  function handleSearch(params: SearchParams) {
    setSearching(true)
    search(params)
  }

  useEffect(() => {
    const savedState =
      sessionStorage.getItem('estadoHome')
    async function loadInitial() {

      if (savedState) {
        const state =
          JSON.parse(savedState)

        setSearching(true)

        await searchBooks(
          state.filtros,
          state.pagina
        )

        setRestoring(false)
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            window.scrollTo({
              top: state.scrollY,
              behavior: 'instant'
            })
          })
        })
        return
      }
      await loadCategories(CATEGORIES)
      setRestoring(false)
    }
    loadInitial()
  }, [])

  return {
    books,
    booksByCategory,

    loading,
    loadingCategories,
    error,

    searching,
    restoring,

    page,
    totalPages,

    handleSearch,
    goToPreviousPage: previous,
    goToNextPage: next
  }
}
