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

// Props que recibe el componente:
interface Props {
  titulo: string          // texto que se muestra al lado de la flecha
  volver?: boolean         // ¿mostrar la flecha? por defecto sí.
                           //   en Home la ocultamos con volver={false}
}

export default function PageHeader({ titulo, volver = true }: Props) {
  const navigate = useNavigate()

  return (
    <header className="page-header">
      {/* Solo renderizamos el botón si volver es true */}
      {volver && (
        <button
          type="button"
          className="page-header__volver"
          onClick={() => navigate(-1)}
          aria-label="Volver"
        >
          <ArrowLeftIcon className="page-header__icono" aria-hidden="true" />
        </button>
      )}
      <span className="page-header__titulo">{titulo}</span>
    </header>
  )
}
