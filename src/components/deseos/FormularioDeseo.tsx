import { useState } from 'react'
import './FormularioDeseo.css'

interface Props {
  onConfirmar: (datos: { prioridad: number; etiqueta: string; nota?: string }) => void
  onCancelar: () => void
}

const LIMITE_NOTA = 200

export default function FormularioDeseo({ onConfirmar, onCancelar }: Props) {
  const [prioridad, setPrioridad] = useState('')
  const [etiqueta, setEtiqueta] = useState('')
  const [nota, setNota] = useState('')
  const [errores, setErrores] = useState<string[]>([])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const nuevosErrores: string[] = []
    const numeroPrioridad = Number(prioridad)

    if (!prioridad || isNaN(numeroPrioridad) || numeroPrioridad <= 0) {
      nuevosErrores.push('La prioridad debe ser un número mayor a 0.')
    }
    if (!etiqueta.trim()) {
      nuevosErrores.push('La categoría/etiqueta es obligatoria.')
    }
    if (nota.length > LIMITE_NOTA) {
      nuevosErrores.push(`La nota no puede superar los ${LIMITE_NOTA} caracteres.`)
    }

    setErrores(nuevosErrores)
    if (nuevosErrores.length > 0) return

    onConfirmar({
      prioridad: numeroPrioridad,
      etiqueta: etiqueta.trim(),
      nota: nota.trim() || undefined,
    })
  }

  return (
    // Fondo oscuro: al hacer click afuera del recuadro, se cierra.
    <div className="form-deseo-overlay" onClick={onCancelar}>
      <div
        className="form-deseo-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="form-deseo-titulo"
        // Frenamos el click acá para que no llegue al overlay y cierre el modal.
        onClick={(e) => e.stopPropagation()}
      >
        <div className="form-deseo__header">
          <h2 id="form-deseo-titulo" className="form-deseo__titulo">
            Agregar a la lista de deseos
          </h2>

          <button
            type="button"
            className="form-deseo__cerrar"
            onClick={onCancelar}
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>

        <form className="form-deseo" onSubmit={handleSubmit} noValidate>
          {errores.length > 0 && (
            <ul className="form-deseo__errores">
              {errores.map((msg) => <li key={msg}>{msg}</li>)}
            </ul>
          )}

          <div className="form-deseo__campo">
            <label htmlFor="prioridad">Prioridad</label>
            <input
              id="prioridad"
              type="number"
              value={prioridad}
              onChange={(e) => setPrioridad(e.target.value)}
            />
          </div>

          <div className="form-deseo__campo">
            <label htmlFor="etiqueta">Etiqueta</label>
            <input
              id="etiqueta"
              type="text"
              placeholder="Para leer en vacaciones"
              value={etiqueta}
              onChange={(e) => setEtiqueta(e.target.value)}
            />
          </div>

          <div className="form-deseo__campo">
            <label htmlFor="nota">Nota (opcional)</label>
            <textarea
              id="nota"
              placeholder="Mi nota sobre este libro..."
              value={nota}
              onChange={(e) => setNota(e.target.value)}
            />
            <span className="form-deseo__contador">
              {nota.length}/{LIMITE_NOTA}
            </span>
          </div>

          <div className="form-deseo__botones">
            <button type="button" onClick={onCancelar}>
              Cancelar
            </button>
            <button type="submit">Agregar a mi lista</button>
          </div>
        </form>
      </div>
    </div>
  )
}
