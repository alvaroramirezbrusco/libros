import './Loader.css'

interface Props {
  texto?: string
}

export default function Loader({ texto }: Props) {
  return (
    <div className="loader" role="status" aria-label="Cargando">
      <div className="loader__spinner"></div>

      {texto && (
        <span className="loader__text">
          {texto}
        </span>
      )}
    </div>
  )
}