import { NavLink } from 'react-router-dom'

// Barra de navegación inferior: cada ítem es un <NavLink> (SVG importado como componente vía ?react).
import HomeIcon   from '../../assets/icons/home.svg?react'
import HeartIcon  from '../../assets/icons/heart.svg?react'
import ClockIcon  from '../../assets/icons/clock.svg?react'
import MailIcon   from '../../assets/icons/email.svg?react'

import { PATHS } from '../../routes/paths'
import './Navbar.css'

// Ítems como array para recorrerlos con .map() y no repetir JSX.
const items = [
  { to: PATHS.home,        Icono: HomeIcon,   label: 'Inicio' },
  { to: PATHS.listaDeseos, Icono: HeartIcon,  label: 'Deseos' },
  { to: PATHS.historial,   Icono: ClockIcon,  label: 'Historial' },
  { to: PATHS.contacto,    Icono: MailIcon,   label: 'Contacto' },
]

export default function Navbar() {
  return (
    <nav className="navbar">
      {items.map(({ to, Icono, label }) => (
        <NavLink
          key={to}
          to={to}
          // end solo en "/": evita que "Inicio" quede activo en todas las rutas.
          end={to === PATHS.home}
          // className como función: react-router pasa { isActive } para marcar la pantalla actual.
          className={({ isActive }) =>
            isActive ? 'navbar__item navbar__item--activo' : 'navbar__item'
          }
        >
          <Icono className="navbar__icono" aria-hidden="true" />
          <span className="navbar__label">{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}

