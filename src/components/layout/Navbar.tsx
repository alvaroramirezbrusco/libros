import { NavLink } from 'react-router-dom'
import { NAVBAR_ITEMS } from '../../constants/navbar'
import './Navbar.css'

export default function Navbar() {
  return (
    <nav className="navbar">
      {NAVBAR_ITEMS.map(({ to, Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          end={to === NAVBAR_ITEMS[0].to}
          className={({ isActive }) =>
            isActive ? 'navbar__item navbar__item--activo' : 'navbar__item'
          }
        >
          <Icon className="navbar__icono" aria-hidden="true" />
          <span className="navbar__label">{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}

