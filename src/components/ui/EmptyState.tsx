import HeartIcon from '../../assets/icons/heart.svg?react'
import SearchIcon from '../../assets/icons/search.svg?react'
import './EmptyState.css'

interface Props {
  message: string
  icon?: 'heart' | 'search'
}

export default function EmptyState({ message, icon = 'heart' }: Props) {
  const Icon = icon === 'search' ? SearchIcon : HeartIcon

  return (
    <div className="empty-state" role="status">
      <p className="empty-state__message">{message}</p>
      <Icon className="empty-state__icon" aria-hidden="true" />
    </div>
  )
}