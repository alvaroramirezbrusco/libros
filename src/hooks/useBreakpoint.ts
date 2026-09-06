// *Devuelve el breakpoint activo segun el ancho de la ventana.*
// *Unico lugar donde viven los cortes 768 / 1024 para la logica JS*
// *(el CSS los repite en sus @media; ver styles/global.css).*

import { useEffect, useState } from 'react'

export type Breakpoint = 'mobile' | 'tablet' | 'laptop'

const CONSULTAS: Array<{ bp: Breakpoint; query: string }> = [
  { bp: 'laptop', query: '(min-width: 1024px)' },
  { bp: 'tablet', query: '(min-width: 768px)' },
]

function calcularBreakpoint(): Breakpoint {
  // *En SSR / tests no hay window: asumimos mobile.*
  if (typeof window === 'undefined') return 'mobile'

  const match = CONSULTAS.find(
    ({ query }) => window.matchMedia(query).matches
  )

  return match ? match.bp : 'mobile'
}

export function useBreakpoint(): Breakpoint {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>(
    calcularBreakpoint
  )

  useEffect(() => {
    const listas = CONSULTAS.map(
      ({ query }) => window.matchMedia(query)
    )

    const actualizar = () =>
      setBreakpoint(calcularBreakpoint())

    listas.forEach((lista) =>
      lista.addEventListener('change', actualizar)
    )

    return () => {
      listas.forEach((lista) =>
        lista.removeEventListener('change', actualizar)
      )
    }
  }, [])

  return breakpoint
}
