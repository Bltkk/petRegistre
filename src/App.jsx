
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import { useApp } from './context/AppContext'
import Login from './pages/Login'
import MisMascotas from './pages/MisMascotas'
import Admin from './pages/Admin'
import RequiereSesion from './router/RequiereSesion.jsx' 


if (!RequiereSesion) {
  throw new Error('Import error: "./router/RequiereSesion.jsx" no cargado. Verifica src/router/RequiereSesion.jsx y mayúsculas/minúsculas.')
}

function Home(){
  const nav = useNavigate()
  return (
    <div className="container py-5">
      <h2 className="mb-3">Libreta digital de mascotas</h2>
      <p className="mb-4">Registra y gestiona las mascotas de tu cuenta.</p>
      <div className="d-flex gap-2">
        <button className="btn btn-primary" onClick={()=>nav('/login')}>Ingresar / Crear cuenta</button>
        <button className="btn btn-outline-secondary" onClick={()=>nav('/mis-mascotas')}>Ir a Mis Mascotas</button>
      </div>
    </div>
  )
}

export default function App(){
  const { usuarioActual, logout } = useApp()
  return (
    <>
      <nav className="navbar navbar-expand-lg bg-light px-3">
        <Link className="navbar-brand" to="/">PetControl</Link>
        <div className="navbar-nav">
          <Link className="nav-link" to="/mis-mascotas">Mis Mascotas</Link>
          <Link className="nav-link" to="/admin">Administrador</Link>
        </div>
        <div className="ms-auto">
          {usuarioActual
            ? <button className="btn btn-outline-secondary btn-sm" onClick={logout}>
                Salir ({usuarioActual.email})
              </button>
            : <Link className="btn btn-primary btn-sm" to="/login">Ingresar</Link>}
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/mis-mascotas" element={
          <RequiereSesion><MisMascotas/></RequiereSesion>
        } />
        <Route path="/admin" element={
          <RequiereSesion>
            {usuarioActual && usuarioActual.email === 'admin@admin.cl' ? <Admin/> : <div className="container py-5"><h3>Acceso denegado</h3><p>Solo administradores pueden acceder a esta sección.</p></div>}
          </RequiereSesion>
        } />
      </Routes>
    </>
  )
}

