import { useParams } from 'react-router-dom'
import './Detalle.css'

export default function Detalle() {
  const { id } = useParams<{ id: string }>()

  return (
    <section className="page page-detalle">
      <h1>Detalle</h1>
      <p>id: {id}</p>
    </section>
  )
}
