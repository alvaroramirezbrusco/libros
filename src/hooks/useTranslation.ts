// *Gestiona la traducción de un texto bajo demanda y el toggle original / español.*

import { useEffect, useState } from 'react'
import { traducirTexto } from '../services/translate'

interface EstadoTraduccion {
  // *Texto que se debe mostrar según el toggle.*
  texto: string | null
  // *True cuando se está mostrando la versión traducida.*
  traducido: boolean
  cargando: boolean
  error: string | null
  // *Alterna entre el texto original y el traducido (traduce la primera vez).*
  alternar: () => void
}

export function useTranslation(
  original: string | null,
  destino = 'es'
): EstadoTraduccion {
  const [traduccion, setTraduccion] = useState<string | null>(null)
  const [traducido, setTraducido] = useState(false)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // *Si cambia el texto original (otro libro), se reinicia todo.*
  useEffect(() => {
    setTraduccion(null)
    setTraducido(false)
    setCargando(false)
    setError(null)
  }, [original])

  function alternar() {
    if (!original) return

    // *Si ya está traducido, volvemos al original.*
    if (traducido) {
      setTraducido(false)
      return
    }

    // *Si ya lo tradujimos antes en esta vista, solo cambiamos el toggle.*
    if (traduccion) {
      setTraducido(true)
      return
    }

    setCargando(true)
    setError(null)

    traducirTexto(original, destino)
      .then((resultado) => {
        setTraduccion(resultado)
        setTraducido(true)
      })
      .catch((e) => {
        console.error('Error traduciendo el texto:', e)
        setError('No se pudo traducir el texto.')
      })
      .finally(() => {
        setCargando(false)
      })
  }

  return {
    texto: traducido ? traduccion : original,
    traducido,
    cargando,
    error,
    alternar,
  }
}
