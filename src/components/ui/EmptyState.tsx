import { FiAlertCircle } from 'react-icons/fi'
import './EmptyState.css'

interface Props {
  message: string
}

export default function EmptyState({ message }: Props) {
  return (
    <div className="empty-state" role="status">
      <p className="empty-state__message">{message}</p>
      <FiAlertCircle className="empty-state__icon" aria-hidden="true" />
    </div>
  )
}