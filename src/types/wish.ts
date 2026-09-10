export interface WishItem {
  id: string
  title: string
  cover: string | null
  authors: string[]
  priority: number
  label: string
  note?: string
}
