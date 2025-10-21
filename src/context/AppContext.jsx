
import { createContext, useContext, useEffect, useState } from 'react'
import {
  initDB, crearUsuario, obtenerUsuarioPorEmail,
  crearMascota, listarMascotasPorUsuario, actualizarMascota, eliminarMascota
} from '../data/tiendaDB'

const Ctx = createContext()

export function AppProvider({ children }){
  const [usuarioActual, setUsuarioActual] = useState(null)
  const [carrito, setCarrito] = useState([])

  useEffect(()=>{ initDB() }, [])

  // ===== Sesión simple =====
  function login(email, nombre=''){
    const u = obtenerUsuarioPorEmail(email) || crearUsuario({email, nombre})
    setUsuarioActual(u)
    return u
  }
  function logout(){ setUsuarioActual(null) }

  // ===== Carrito (ya existente) =====
  const agregarAlCarrito = (prod, qty=1)=> setCarrito(c=>{
    const i=c.findIndex(x=>x.id===prod.id)
    if(i>=0){ const n=[...c]; n[i]={...n[i], cantidad:n[i].cantidad+qty}; return n }
    return [...c, {id:prod.id, nombre:prod.nombre, precio:prod.precio, cantidad:qty}]
  })
  const quitarDelCarrito = id => setCarrito(c=>c.filter(x=>x.id!==id))
  const vaciarCarrito = () => setCarrito([])

  // ===== Mascotas por usuario =====
  function obtenerMisMascotas(){
    if (!usuarioActual) return []
    return listarMascotasPorUsuario(usuarioActual.id)
  }
  function agregarMascota(datos){
    if (!usuarioActual) throw new Error('Debes iniciar sesión')
    return crearMascota({ ...datos, usuarioId: usuarioActual.id })
  }
  function editarMascota(id, patch){
    if (!usuarioActual) throw new Error('Debes iniciar sesión')
    return actualizarMascota(id, patch)
  }
  function borrarMascota(id){
    if (!usuarioActual) throw new Error('Debes iniciar sesión')
    eliminarMascota(id)
  }

  return (
    <Ctx.Provider value={{
      usuarioActual, login, logout,
      carrito, agregarAlCarrito, quitarDelCarrito, vaciarCarrito,
      obtenerMisMascotas, agregarMascota, editarMascota, borrarMascota
    }}>
      {children}
    </Ctx.Provider>
  )
}

export const useApp = ()=> useContext(Ctx)
