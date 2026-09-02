import './ConfirmAlert.css'

interface Props {
  mensaje: string
  onConfirmar: () => void
  onCancelar: () => void
}

export default function ConfirmAlert({
  mensaje,
  onConfirmar,
  onCancelar,
}: Props) {
  return (
    <div
      className="confirm-alert__overlay"
      onClick={onCancelar}
    >
      <div
        className="confirm-alert"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-alert-mensaje"
        onClick={(e) => e.stopPropagation()}
      >
        <p
          id="confirm-alert-mensaje"
          className="confirm-alert__mensaje"
        >
          {mensaje}
        </p>

        <div className="confirm-alert__acciones">
          <button
            type="button"
            className="confirm-alert__cancelar"
            onClick={onCancelar}
          >
            Cancelar
          </button>

          <button
            type="button"
            className="confirm-alert__confirmar"
            onClick={onConfirmar}
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  )
}