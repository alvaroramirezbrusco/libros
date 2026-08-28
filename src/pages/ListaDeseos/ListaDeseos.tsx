import PageHeader from '../../components/layout/PageHeader' 
import './ListaDeseos.css'

export default function ListaDeseos() {
  return (
    <section className="page page-lista-deseos">
      <PageHeader titulo="Lista de deseos" volver={true} />
      <h1>Lista de deseos</h1>
    </section>
  )
}
