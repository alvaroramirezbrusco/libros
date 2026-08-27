import { NavLink } from 'react-router-dom'
import { PATHS } from '../../routes/paths'

export default function Navbar() {
  return (
    <nav className="navbar">
      <NavLink to={PATHS.home}>Inicio</NavLink>
      <NavLink to={PATHS.busqueda}>Búsqueda</NavLink>
      <NavLink to={PATHS.listaDeseos}>Lista de deseos</NavLink>
      <NavLink to={PATHS.historial}>Historial</NavLink>
      <NavLink to={PATHS.contacto}>Contacto</NavLink>
    </nav>
  )
}
