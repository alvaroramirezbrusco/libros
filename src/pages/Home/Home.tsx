import PageHeader from '../../components/layout/PageHeader'
import './Home.css'

export default function Home() {
  return (
    <section className="page page-home">
      <PageHeader titulo="BookWeb" volver={false} />
      {/* ...resto de la pantalla... */}
    </section>
  )
}
