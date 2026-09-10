// Barra superior azul: flecha "volver" (navigate(-1)) + título; desde 768px hospeda la <Navbar />.

import { useNavigate } from 'react-router-dom'
import ArrowLeftIcon from '../../assets/icons/arrow-left.svg?react'
import Navbar from './Navbar'
import './PageHeader.css'
import { PATHS } from '../../routes/paths'

interface Props {
  titulo: string          // texto al lado de la flecha
  volver?: boolean        // ¿mostrar la flecha? por defecto sí
  estadoHome?: {          // estado del Home para restaurarlo al volver
  pagina: number
  filtros: {
    title?: string
    author?: string
    subject?: string
    }
  }
}

export default function PageHeader({ titulo, volver = true, estadoHome }: Props) {
  const navigate = useNavigate()

  function volverPagina() {
    if (estadoHome) {
      navigate(PATHS.home, {
        state: {
          restaurarHome: estadoHome
        }
      })
    } else {
      navigate(-1)
    }
  }

  return (
    <header className="page-header">
      {/* El botón solo se renderiza si volver es true */}
      {volver && (
        <button
          type="button"
          className="page-header__volver"
          onClick={volverPagina}
          aria-label="Volver"
        >
          <ArrowLeftIcon className="page-header__icono" aria-hidden="true" />
        </button>
      )}
      <h1 className="page-header__titulo">{titulo}</h1>

      {/* Móvil: fija abajo (position:fixed). Desde 768px: fila aquí. */}
      <Navbar />
    </header>
  )
}
