import { NavLink } from 'react-router-dom'


// Navbar.tsx — Barra de navegación inferior (estilo movil despues trabajareemos en responsive)


// Cada botón es un <NavLink> de react-router:
//   - cambia la URL sin recargar la web -- nos avisa si su ruta es la "activa" para pintarla distinto


// Importamos cada SVG como COMPONENTE gracias al sufijo "?react" (lo procesa vite-plugin-svgr). Sin "?react" 
import HomeIcon   from '../../assets/icons/home.svg?react'
import HeartIcon  from '../../assets/icons/heart.svg?react'
import ClockIcon  from '../../assets/icons/clock.svg?react'
import MailIcon   from '../../assets/icons/email.svg?react'

import { PATHS } from '../../routes/paths'
import './Navbar.css'

// Los ítems como array: así no repetimos el mismo JSX cantidad de paginas ,
// lo recorremos con .map()
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
          // `end` solo en "/" : sin esto "Inicio" quedaría activo
          // en todas las rutas (todas empiezan con "/")
          end={to === PATHS.home}
          // className puede ser función: react-router pasa { isActive }.
          // Agregamos "--activo" solo cuando esa es la pantalla actual.
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

