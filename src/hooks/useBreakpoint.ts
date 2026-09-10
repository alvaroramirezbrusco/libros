import { useEffect, useState } from 'react'

export type Breakpoint = 'mobile' | 'tablet' | 'laptop'

const MEDIA_QUERIES: Array<{ bp: Breakpoint; query: string }> = [
  { bp: 'laptop', query: '(min-width: 1024px)' },
  { bp: 'tablet', query: '(min-width: 768px)' },
]

function getBreakpoint(): Breakpoint {
  if (typeof window === 'undefined') return 'mobile'

  const match = MEDIA_QUERIES.find(
    ({ query }) => window.matchMedia(query).matches
  )

  return match ? match.bp : 'mobile'
}

export function useBreakpoint(): Breakpoint {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>(
    getBreakpoint
  )

  useEffect(() => {
    const mediaQueries = MEDIA_QUERIES.map(
      ({ query }) => window.matchMedia(query)
    )

    const updateBreakpoint = () =>
      setBreakpoint(getBreakpoint())

    mediaQueries.forEach((mediaQuery) =>
      mediaQuery.addEventListener('change', updateBreakpoint)
    )

    return () => {
      mediaQueries.forEach((mediaQuery) =>
        mediaQuery.removeEventListener('change', updateBreakpoint)
      )
    }
  }, [])

  return breakpoint
}
