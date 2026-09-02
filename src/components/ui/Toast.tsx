import { useEffect } from 'react'
import './Toast.css'

interface Props {
  message: string
  onClose: () => void
}

export default function Toast({ message, onClose }: Props) {

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 3000)

    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className="toast" role="alert">
      <span className="toast__message">
        {message}
      </span>
    </div>
  )
}