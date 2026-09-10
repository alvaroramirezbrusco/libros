import type { BookDetail } from '../types/book'
import type { HistoryItem } from '../types/history'

const STORAGE_KEY = 'historial'

export function clearHistory() {
  localStorage.removeItem(STORAGE_KEY)
}

interface LegacyHistoryItem {
  libro: BookDetail
  visitados: number
}

export function readHistory(): HistoryItem[] {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) return []

  try {
    const items = JSON.parse(stored) as Array<HistoryItem | LegacyHistoryItem>
    return items.map((item) => {
      if ('book' in item) return item

      return {
        book: item.libro,
        visitedAt: item.visitados,
      }
    })
  } catch {
    return []
  }
}

export function recordVisit(book: BookDetail) {
  const currentItems = readHistory()
  const withoutDuplicate = currentItems.filter(
    (item) => item.book.id !== book.id
  )
  const newItem: HistoryItem = {
    book,
    visitedAt: Date.now()
  }
  const history = [newItem, ...withoutDuplicate]
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(history)
  )
}
