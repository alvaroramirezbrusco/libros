import PageHeader from '../../components/layout/PageHeader'
import './Historial.css'

export default function Historial() {
  return (
    <section className="page page-historial">
      <PageHeader titulo="Historial" volver={true} />
      <h1>Historial</h1>
    </section>
  )
}
