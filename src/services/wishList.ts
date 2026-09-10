import type { WishItem } from '../types/wish'

const STORAGE_KEY = 'listaDeseos'

interface LegacyWishItem {
  id: string
  title: string
  cover: string | null
  authors: string[]
  prioridad: number
  etiqueta: string
  nota?: string
}

export function readWishList(): WishItem[] {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) return []

  try {
    const items = JSON.parse(stored) as Array<WishItem | LegacyWishItem>
    return items.map((item) => {
      if ('priority' in item) return item

      return {
        id: item.id,
        title: item.title,
        cover: item.cover,
        authors: item.authors,
        priority: item.prioridad,
        label: item.etiqueta,
        note: item.nota,
      }
    })
  } catch {
    return []
  }
}

export function addWish(item: WishItem) {
  const currentItems = readWishList()
  const withoutDuplicate = currentItems.filter((current) => current.id !== item.id)
  withoutDuplicate.push(item)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(withoutDuplicate))
}

export function isInWishList(id: string): boolean {
  return readWishList().some((item) => item.id === id)
}

export function removeWish(id: string) {
  const currentItems = readWishList()
  const remainingItems = currentItems.filter((item) => item.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(remainingItems))
}
