import { useState } from 'react'
import { PRIORITY, LABELS, NOTE_LIMIT } from '../../constants/formWish'
import './WishForm.css'

interface WishFormProps {
  onConfirm: (data: { priority: number; label: string; note?: string }) => void
  onCancel: () => void
}

export default function WishForm({ onConfirm, onCancel }: WishFormProps) {
  const [priority, setPriority] = useState<number | null>(null)
  const [label, setLabel] = useState('')
  const [note, setNote] = useState('')
  const [errors, setErrors] = useState<string[]>([])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const newErrors: string[] = []
    if (priority === null) {
      newErrors.push('Elegí una prioridad.')
    }
    if (!label.trim()) {
      newErrors.push('La categoría/etiqueta es obligatoria.')
    }
    setErrors(newErrors)
    if (newErrors.length > 0 || priority === null) return

    onConfirm({
      priority,
      label: label.trim(),
      note: note.trim() || undefined,
    })
  }

  return (
    <div className="form-wish-overlay" onClick={onCancel}>
      <div
        className="form-wish-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="form-wish-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="form-wish__header">
          <h2 id="form-wish-title" className="form-wish__title">
            Agregar a la lista de deseos
          </h2>

          <button
            type="button"
            className="form-wish__close"
            onClick={onCancel}
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>

        <form className="form-wish" onSubmit={handleSubmit} noValidate>
          {errors.length > 0 && (
            <ul className="form-wish__errors">
              {errors.map((message) => <li key={message}>{message}</li>)}
            </ul>
          )}

          <div className="form-wish__field">
            <label id="priority-label">Prioridad</label>

            <div className="form-wish-row-helper">
              <span className="form-wish-helper-low">Bajo</span>
              <span className="form-wish-helper-high">Alto</span>
            </div>
            <div className="form-wish-row-priority" role="radiogroup" aria-labelledby="priority-label">
                {PRIORITY.map((item) => (
                  <div key={item.value} className="form-wish-priority-item">
                      <div
                        className={`form-wish-priority-decoration priority-${item.value} ${
                          priority === item.value ? 'is-selected' : ''
                        }`}
                      />
                      <button
                        key={item.value}
                        type="button"
                        className={`form-wish-priority-button ${
                          priority === item.value ? 'is-selected' : ''
                        }`}
                        onClick={() => setPriority(item.value)}
                        role="radio"
                        aria-checked={priority === item.value}
                        aria-label={`Prioridad ${item.value}: ${item.text}`}
                      >
                        <span>{item.value}</span><small>{item.text}</small>
                      </button>
                  </div>
                ))}
            </div>
          </div>

          <div className="form-wish__field">
            <label id="form-wish-label">Etiqueta</label>
            <div className="form-wish-row-labels" role="radiogroup" aria-labelledby="form-wish-label">
              {LABELS.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`form-wish-label-button ${label === option ? 'is-selected' : ''}`}
                  onClick={() => setLabel(option)}
                  role="radio"
                  aria-checked={label === option}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="form-wish__field">
            <label htmlFor="note">Nota (opcional)</label>
            <textarea
              id="note"
              placeholder="Mi nota sobre este libro..."
              value={note}
              onChange={(event) => setNote(event.target.value)}
              maxLength={NOTE_LIMIT}
            />
            <span className="form-wish__counter">
              {note.length}/{NOTE_LIMIT}
            </span>
          </div>

          <div className="form-wish__actions">
            <button type="button" onClick={onCancel}>
              Cancelar
            </button>
            <button 
              type="submit"
              disabled={priority === null || !label.trim() || note.length > NOTE_LIMIT}
            >
              Agregar a mi lista
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
