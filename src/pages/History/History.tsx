import { useMemo, useState } from 'react'

import PageHeader from '../../components/layout/PageHeader'
import BookList from '../../components/books/BookList'
import Pagination from '../../components/books/Pagination'
import HistoryHeader from '../../components/history/HistoryHeader'

import EmptyState from '../../components/ui/EmptyState'
import ConfirmAlert from '../../components/ui/ConfirmAlert'
import Toast from '../../components/ui/Toast'

import { clearHistory, readHistory } from '../../services/history'

import { usePagination } from '../../hooks/usePagination'

import './History.css'

const BOOKS_PER_PAGE = 10

export default function History() {
  const [historyItems, setHistoryItems] = useState(() => readHistory())
  const [isConfirmVisible, setIsConfirmVisible] = useState(false)
  const [isToastVisible, setIsToastVisible] = useState(false)

  const totalPages = Math.max(
    1,
    Math.ceil(historyItems.length / BOOKS_PER_PAGE)
  )

  const {
    page: currentPage,
    goToPreviousPage,
    goToNextPage,
  } = usePagination(totalPages)

  const paginatedBooks = useMemo(() => {
    const start = (currentPage - 1) * BOOKS_PER_PAGE
    const end = start + BOOKS_PER_PAGE

    return historyItems
      .slice(start, end)
      .map((item) => item.book)
  }, [historyItems, currentPage])

  function requestClearHistory() {
    setIsConfirmVisible(true)
  }

  function handleClearHistory() {
    clearHistory()
    setHistoryItems([])
    setIsConfirmVisible(false)
    setIsToastVisible(true)
  }

  return (
    <section className="page page-history">

      <PageHeader
        title="BookWeb"
        showBack={false}
      />

      {isToastVisible && (
        <Toast
          message="El historial fue vaciado."
          onClose={() => setIsToastVisible(false)}
        />
      )}

      <section className="page-content page-content--wide">

        <HistoryHeader
          hasHistory={historyItems.length > 0}
          onClearHistory={requestClearHistory}
        />

        {historyItems.length === 0 ? (
          <EmptyState message="Historial vacío" />
        ) : (
          <>
            <BookList books={paginatedBooks} />

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPrevious={goToPreviousPage}
              onNext={goToNextPage}
            />
          </>
        )}

      </section>

      {isConfirmVisible && (
        <ConfirmAlert
          message="¿Estás seguro de que querés vaciar el historial?"
          onCancel={() => setIsConfirmVisible(false)}
          onConfirm={handleClearHistory}
        />
      )}

    </section>
  )
}
