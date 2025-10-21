import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function Login(){
  const { login } = useApp()
  const nav = useNavigate()
  const [email,setEmail] = useState('')
  const [nombre,setNombre] = useState('')
  const [errores,setErrores] = useState({})

  function validar(){
    const e = {}
    if(!email.trim()) e.email = 'Ingresa tu correo'
    else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Correo inválido'
    if(nombre && !/^[A-Za-zÁÉÍÓÚÑáéíóúñ ]{2,40}$/.test(nombre.trim())) e.nombre = 'Solo letras, 2–40'
    return e
  }

  function onSubmit(ev){
    ev.preventDefault()
    const e = validar()
    setErrores(e)
    if(Object.keys(e).length>0) return
    login(email.trim(), nombre.trim())
    nav('/mis-mascotas')
  }

  return (
    <div className="container py-4">
      <h3>Iniciar sesión / Crear cuenta</h3>
      <form className="col-12 col-md-6 p-0" onSubmit={onSubmit} noValidate>
        <div className="mb-2">
          <label className="form-label">Correo</label>
          <input className={`form-control ${errores.email?'is-invalid':''}`}
                 value={email} onChange={e=>setEmail(e.target.value)} />
          {errores.email && <div className="invalid-feedback">{errores.email}</div>}
        </div>
        <div className="mb-3">
          <label className="form-label">Nombre</label>
          <input className={`form-control ${errores.nombre?'is-invalid':''}`}
                 value={nombre} onChange={e=>setNombre(e.target.value)} />
          {errores.nombre && <div className="invalid-feedback">{errores.nombre}</div>}
        </div>
        <button className="btn btn-primary">Ingresar</button>
      </form>
    </div>
  )
}
