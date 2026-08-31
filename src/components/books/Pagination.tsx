import './Pagination.css'

// Controles de paginación. No sabe nada de la API: solo avisa
// al padre (Home) cuando el usuario quiere ir a otra página.
interface Props {
  pagina: number         // página actual
  totalPaginas: number   // cuántas páginas hay en total
  onAnterior: () => void
  onSiguiente: () => void
}

export default function Pagination({
  pagina,
  totalPaginas,
  onAnterior,
  onSiguiente,
}: Props) {
  return (
    <nav className="pagination" aria-label="Paginación de resultados">

      <button
        type="button"
        className="pagination__btn"
        onClick={onAnterior}
        disabled={pagina <= 1}
      >
        ‹
      </button>

      <span className="pagination__info">
        Página {pagina} de {totalPaginas}
      </span>

      <button
        type="button"
        className="pagination__btn"
        onClick={onSiguiente}
        disabled={pagina >= totalPaginas}
      >
        ›
      </button>

    </nav>
  )
}
