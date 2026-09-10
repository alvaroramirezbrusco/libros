import type { BookDetail } from './book'

export interface HistoryItem {
    book: BookDetail
    visitedAt: number
}