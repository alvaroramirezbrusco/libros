// ============================================================
// PageHeader.tsx — Barra superior azul de cada pantalla
// ------------------------------------------------------------
// Es el "topbar"  flecha para volver + título.
// Cada página lo usa así:  <PageHeader titulo="Contacto" />
//
// La flecha llama a navigate(-1), que es "ir atrás" en el
// historial del navegador (como el botón ◀ del navegador).
// ------------------------------------------------------------

import { useNavigate } from 'react-router-dom'
import ArrowLeftIcon from '../../assets/icons/arrow-left.svg?react'
import './PageHeader.css'
import { PATHS } from '../../routes/paths'

// Props que recibe el componente:
interface Props {
  titulo: string          // texto que se muestra al lado de la flecha
  volver?: boolean         // ¿mostrar la flecha? por defecto sí.
  estadoHome?: {              //   en Home la ocultamos con volver={false}
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
      {/* Solo renderizamos el botón si volver es true */}
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
    </header>
  )
}
