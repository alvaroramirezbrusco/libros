import HomeIcon from '../assets/icons/home.svg?react'
import HeartIcon from '../assets/icons/heart.svg?react'
import ClockIcon from '../assets/icons/clock.svg?react'
import MailIcon from '../assets/icons/email.svg?react'
import { PATHS } from '../routes/paths'

export const NAVBAR_ITEMS = [
  { to: PATHS.home, Icon: HomeIcon, label: 'Inicio' },
  { to: PATHS.listaDeseos, Icon: HeartIcon, label: 'Deseos' },
  { to: PATHS.historial, Icon: ClockIcon, label: 'Historial' },
  { to: PATHS.contacto, Icon: MailIcon, label: 'Contacto' },
]
