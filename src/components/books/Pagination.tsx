import './Pagination.css'

interface Props {
  currentPage: number
  totalPages: number
  onPrevious: () => void
  onNext: () => void
}

export default function Pagination({
  currentPage,
  totalPages,
  onPrevious,
  onNext,
}: Props) {
  return (
    <nav className="pagination" aria-label="Pagination results">
      <button
        type="button"
        className="pagination__btn"
        onClick={onPrevious}
        disabled={currentPage <= 1}
      >
        ‹
      </button>

      <span className="pagination__info">
        Page {currentPage} of {totalPages}
      </span>

      <button
        type="button"
        className="pagination__btn"
        onClick={onNext}
        disabled={currentPage >= totalPages}
      >
        ›
      </button>
    </nav>
  )
}
