import { NavLink } from 'react-router-dom'
import { PATHS } from '../../routes/paths'
import './Footer.css'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer__content">
        <section className="footer__brand" aria-labelledby="footer-brand-title">
          <h2 id="footer-brand-title">BookWeb</h2>
          <p>
            Descubrí nuevas historias, guardá tus próximos libros y llevá el
            control de lo que ya exploraste.
          </p>
        </section>

        <nav className="footer__group" aria-label="Navegación del pie de página">
          <h3>Explorar</h3>
          <ul className="footer__links">
            <li><NavLink to={PATHS.home} end>Inicio</NavLink></li>
            <li><NavLink to={PATHS.listaDeseos}>Lista de deseos</NavLink></li>
            <li><NavLink to={PATHS.historial}>Historial</NavLink></li>
          </ul>
        </nav>

        <section className="footer__group" aria-labelledby="footer-community-title">
          <h3 id="footer-community-title">La comunidad lectora</h3>
          <p>
            Encontrá tu próxima lectura y compartí el entusiasmo por los
            libros.
          </p>
          <ul className="footer__links">
            <li><NavLink to={PATHS.contacto}>Contacto</NavLink></li>
          </ul>
        </section>
      </div>

      <div className="footer__bottom">
        <p>© {year} BookWeb</p>
        <p>Hecho para quienes siempre tienen una historia pendiente.</p>
      </div>
    </footer>
  )
}
