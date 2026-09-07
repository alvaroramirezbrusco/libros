import { Routes, Route } from 'react-router-dom'
import Footer from './components/layout/Footer'
import Home from './pages/Home/Home'
import BookDetail from './pages/BookDetail/BookDetail'
import WishList from './pages/WishList/WishList'
import History from './pages/History/History'
import Contact from './pages/Contact/Contact'
import { PATHS } from './routes/paths'
import './App.css'

export default function App() {
  return (
    <div className="app">
      {/* La navegación vive dentro de <PageHeader /> (una por página) */}
      <main className="app-main">
        <Routes>
          <Route path={PATHS.home} element={<Home />} />
          <Route path={PATHS.detalle} element={<BookDetail />} />
          <Route path={PATHS.listaDeseos} element={<WishList />} />
          <Route path={PATHS.historial} element={<History />} />
          <Route path={PATHS.contacto} element={<Contact />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
