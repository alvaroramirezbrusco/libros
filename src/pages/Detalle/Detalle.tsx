import PageHeader from '../../components/layout/PageHeader'   
import { useParams } from 'react-router-dom'
import './Detalle.css'

export default function Detalle() {
  const { id } = useParams<{ id: string }>()

  return (
    <section className="page page-detalle">
      <PageHeader titulo="Detalle" volver={true} />
      <h1>Detalle</h1>
      <p>id: {id}</p>
    </section>
  )
}
