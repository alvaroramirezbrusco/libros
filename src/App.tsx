import { Routes, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Home from './pages/Home/Home'
import Detalle from './pages/Detalle/Detalle'
import ListaDeseos from './pages/ListaDeseos/ListaDeseos'
import Historial from './pages/Historial/Historial'
import Contacto from './pages/Contacto/Contacto'
import { PATHS } from './routes/paths'
import './App.css'

export default function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="app-main">
        <Routes>
          <Route path={PATHS.home} element={<Home />} />
          <Route path={PATHS.detalle} element={<Detalle />} />
          <Route path={PATHS.listaDeseos} element={<ListaDeseos />} />
          <Route path={PATHS.historial} element={<Historial />} />
          <Route path={PATHS.contacto} element={<Contacto />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
