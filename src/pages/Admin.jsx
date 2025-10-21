import { useEffect, useState } from 'react'
import { listarUsuarios, listarTodasLasMascotas, listarMascotasDeUsuario, eliminarUsuarioYMasculino } from '../data/tiendaDB'

export default function Admin(){
  const [usuarios,setUsuarios]=useState([])
  const [mascotas,setMascotas]=useState([])
  const [seleccion,setSeleccion]=useState(null) // usuarioId seleccionado

  useEffect(()=>{ setUsuarios(listarUsuarios()); setMascotas(listarTodasLasMascotas()) },[])

  function verMascotas(u){ setSeleccion(u.id) }
  function borrarUsuario(u){
    if(!confirm(`Eliminar cuenta de ${u.email} y sus mascotas?`)) return
    eliminarUsuarioYMasculino(u.id)
    setUsuarios(listarUsuarios())
    setMascotas(listarTodasLasMascotas())
    if(seleccion===u.id) setSeleccion(null)
  }

  const mascotasDe = seleccion ? listarMascotasDeUsuario(seleccion) : []

  return (
    <div className="container py-4">
      <h3>Administrador</h3>

      <div className="row g-4">
        <div className="col-12 col-lg-6">
          <h5 className="mb-2">Usuarios ({usuarios.length})</h5>
          <div className="table-responsive">
            <table className="table table-striped align-middle">
              <thead><tr><th>Correo</th><th>Nombre</th><th>Fecha</th><th></th></tr></thead>
              <tbody>
                {usuarios.map(u=>(
                  <tr key={u.id}>
                    <td>{u.email}</td><td>{u.nombre||'-'}</td><td>{u.creadoEn?.slice(0,10)||'-'}</td>
                    <td className="text-nowrap">
                      <button className="btn btn-sm btn-outline-primary me-2" onClick={()=>verMascotas(u)}>Ver mascotas</button>
                      <button className="btn btn-sm btn-outline-danger" onClick={()=>borrarUsuario(u)}>Eliminar</button>
                    </td>
                  </tr>
                ))}
                {usuarios.length===0 && <tr><td colSpan="4">Sin usuarios.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        <div className="col-12 col-lg-6">
          <h5 className="mb-2">Mascotas {seleccion && `(usuario seleccionado)`}</h5>
          <div className="table-responsive">
            <table className="table table-striped align-middle">
              <thead><tr><th>Nombre</th><th>Edad</th><th>Vacuna</th><th>Raza</th></tr></thead>
              <tbody>
                {(seleccion ? mascotasDe : mascotas).map(m=>(
                  <tr key={m.id}>
                    <td>{m.nombre}</td><td>{m.edad||'-'}</td><td>{m.vacuna||'-'}</td><td>{m.raza||'-'}</td>
                  </tr>
                ))}
                {(seleccion ? mascotasDe : mascotas).length===0 && <tr><td colSpan="4">Sin mascotas.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}