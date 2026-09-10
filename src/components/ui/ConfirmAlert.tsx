import './ConfirmAlert.css'

interface Props {
  message: string
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmAlert({
  message,
  onConfirm,
  onCancel,
}: Props) {
  return (
    <div
      className="confirm-alert__overlay"
      onClick={onCancel}
    >
      <div
        className="confirm-alert"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-alert-message"
        onClick={(e) => e.stopPropagation()}
      >
        <p
          id="confirm-alert-message"
          className="confirm-alert__message"
        >
          {message}
        </p>

        <div className="confirm-alert__actions">
          <button
            type="button"
            className="confirm-alert__cancel"
            onClick={onCancel}
          >
            Cancelar
          </button>

          <button
            type="button"
            className="confirm-alert__confirm"
            onClick={onConfirm}
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  )
}