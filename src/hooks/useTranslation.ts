import { useEffect, useState } from 'react'
import { traducirTexto } from '../services/translate'

interface TranslationState {
  text: string | null
  translated: boolean
  loading: boolean
  error: string | null
  toggle: () => void
}

export function useTranslation(
  original: string | null,
  destino = 'es'
): TranslationState {
  const [translation, setTranslation] = useState<string | null>(null)
  const [translated, setTranslated] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setTranslation(null)
    setTranslated(false)
    setLoading(false)
    setError(null)
  }, [original])

  function toggle() {
    if (!original) return

    if (translated) {
      setTranslated(false)
      return
    }

    if (translation) {
      setTranslated(true)
      return
    }

    setLoading(true)
    setError(null)

    traducirTexto(original, destino)
      .then((resultado) => {
        setTranslation(resultado)
        setTranslated(true)
      })
      .catch((e) => {
        console.error('Error traduciendo el texto:', e)
        setError('No se pudo traducir el texto.')
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return {
    text: translated ? translation : original,
    translated,
    loading,
    error,
    toggle,
  }
}
