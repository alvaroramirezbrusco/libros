import PageHeader from '../../components/layout/PageHeader'
import './Busqueda.css'

export default function Busqueda() {
  return (
    <section className="page page-busqueda">
      <PageHeader titulo="Búsqueda" volver={true} />
      <h1>Búsqueda</h1>
    </section>
  )
}
