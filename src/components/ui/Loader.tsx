import './Loader.css'

interface Props {
  text?: string
}

export default function Loader({ text }: Props) {
  return (
    <div className="loader" role="status" aria-label="Cargando">
      <div className="loader__spinner"></div>

      {text && (
        <span className="loader__text">
          {text}
        </span>
      )}
    </div>
  )
}