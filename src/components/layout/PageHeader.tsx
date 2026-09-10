import { useNavigate } from 'react-router-dom'
import ArrowLeftIcon from '../../assets/icons/arrow-left.svg?react'
import Navbar from './Navbar'
import './PageHeader.css'
import { PATHS } from '../../routes/paths'

interface Props {
  title: string
  showBack?: boolean
  homeState?: {
  pagina: number
  filtros: {
    title?: string
    author?: string
    subject?: string
    }
  }
}

export default function PageHeader({ title, showBack = true, homeState }: Props) {
  const navigate = useNavigate()

  function goBack() {
    if (homeState) {
      navigate(PATHS.home, {
        state: {
          restaurarHome: homeState
        }
      })
    } else {
      navigate(-1)
    }
  }

  return (
    <header className="page-header">
      {showBack && (
        <button
          type="button"
          className="page-header__volver"
          onClick={goBack}
          aria-label="Back"
        >
          <ArrowLeftIcon className="page-header__icono" aria-hidden="true" />
        </button>
      )}
      <h1 className="page-header__titulo">{title}</h1>

      <Navbar />
    </header>
  )
}
