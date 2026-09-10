import { useState } from 'react'

export function usePagination(totalPages: number = 1) {

  const [page, setPage] = useState(1)

  function goToPreviousPage() {
    setPage(current =>
      Math.max(1, current - 1)
    )
  }

  function goToNextPage() {
    setPage(current =>
      Math.min(totalPages, current + 1)
    )
  }

  function goToPage(newPage: number) {
    if (
      newPage >= 1 &&
      newPage <= totalPages
    ) {
      setPage(newPage)
    }
  }

  function reset() {
    setPage(1)
  }

  return {
    page,
    goToPreviousPage,
    goToNextPage,
    goToPage,
    reset,
  }
}