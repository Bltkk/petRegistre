import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

const reNombre = /^[A-Za-zÁÉÍÓÚÑáéíóúñ ]{2,40}$/
const cap = (s,max)=> (s||'').trim().slice(0,max)

export default function MisMascotas(){
  const { usuarioActual, obtenerMisMascotas, agregarMascota, editarMascota, borrarMascota } = useApp()
  const nav = useNavigate()
  const [lista, setLista] = useState([])
  const [form, setForm] = useState({ nombre:'', edad:'', vacuna:'', raza:'', tipo:'', descripcion:'' })
  const [editId, setEditId] = useState(null)
  const [errores, setErrores] = useState({})

  useEffect(()=>{
    if(!usuarioActual){ nav('/login'); return }
    setLista(obtenerMisMascotas())
  },[usuarioActual])

  function onChange(e){
    const {name,value} = e.target
    setForm(f=>({...f, [name]: value}))
  }

  function validar(){
    const e={}
    const nombre = cap(form.nombre,40)
    if(!nombre) e.nombre = 'Nombre obligatorio'
    else if(!reNombre.test(nombre)) e.nombre = 'Solo letras, 2–40'
    if(form.edad !== '' && (+form.edad<0 || +form.edad>40)) e.edad = 'Edad 0–40'
    if(cap(form.vacuna,40)!==form.vacuna) e.vacuna = 'Máx 40 caracteres'
    if(cap(form.raza,40)!==form.raza) e.raza = 'Máx 40 caracteres'
    if(cap(form.descripcion,200)!==form.descripcion) e.descripcion = 'Máx 200 caracteres'
    return e
  }

  function onSubmit(e){
    e.preventDefault()
    const eVal = validar()
    setErrores(eVal)
    if(Object.keys(eVal).length>0) return

    const payload = {
      nombre: cap(form.nombre,40),
      edad: form.edad === '' ? 0 : Number(form.edad),
      vacuna: cap(form.vacuna,40),
      raza: cap(form.raza,40),
      tipo: cap(form.tipo,40),
      descripcion: cap(form.descripcion,200)
    }

    if(editId){ editarMascota(editId, payload); setEditId(null) }
    else{ agregarMascota(payload) }

    setForm({ nombre:'', edad:'', vacuna:'', raza:'', descripcion:'' })
    setErrores({})
    setLista(obtenerMisMascotas())
  }

  function onEditar(m){
    setEditId(m.id)
    setForm({
      nombre: m.nombre||'',
      edad: m.edad==null? '' : String(m.edad),
      vacuna: m.vacuna||'',
      raza: m.raza||'',
      tipo: m.tipo||'',
      descripcion: m.descripcion||''
    })
    setErrores({})
  }

  function onEliminar(id){
    if(!confirm('¿Eliminar esta mascota?')) return
    borrarMascota(id)
    setLista(obtenerMisMascotas())
  }

  if(!usuarioActual) return null

  return (
    <div className="container py-4">
      <h3>Mis Mascotas</h3>

      <form className="row g-2 mb-4" onSubmit={onSubmit} noValidate>
        <div className="col-sm-6 col-md-3">
          <label className="form-label">Nombre</label>
          <input className={`form-control ${errores.nombre?'is-invalid':''}`}
                 name="nombre" value={form.nombre} onChange={onChange} />
          {errores.nombre && <div className="invalid-feedback">{errores.nombre}</div>}
        </div>
        <div className="col-sm-6 col-md-2">
          <label className="form-label">Edad</label>
          <input className={`form-control ${errores.edad?'is-invalid':''}`}
                 type="number" name="edad" value={form.edad} onChange={onChange} />
          {errores.edad && <div className="invalid-feedback">{errores.edad}</div>}
        </div>
        <div className="col-sm-6 col-md-3">
          <label className="form-label">Vacuna</label>
          <input className={`form-control ${errores.vacuna?'is-invalid':''}`}
                 name="vacuna" value={form.vacuna} onChange={onChange} />
          {errores.vacuna && <div className="invalid-feedback">{errores.vacuna}</div>}
        </div>
        <div className="col-sm-6 col-md-2">
          <label className="form-label">Raza</label>
          <input className={`form-control ${errores.raza?'is-invalid':''}`}
                 name="raza" value={form.raza} onChange={onChange} />
          {errores.raza && <div className="invalid-feedback">{errores.raza}</div>}
        </div>
        <div className="col-sm-6 col-md-2">
          <label className="form-label">Tipo</label>
          <select className="form-control" name="tipo" value={form.tipo} onChange={onChange}>
            <option value="">Seleccionar...</option>
            <option value="Perro">Perro</option>
            <option value="Gato">Gato</option>
            <option value="Pájaro">Pájaro</option>
            <option value="Conejo">Conejo</option>
            <option value="Otro">Otro</option>
          </select>
        </div>
        <div className="col-12">
          <label className="form-label">Descripción</label>
          <textarea className={`form-control ${errores.descripcion?'is-invalid':''}`}
                    name="descripcion" rows="2" value={form.descripcion} onChange={onChange} />
          {errores.descripcion && <div className="invalid-feedback">{errores.descripcion}</div>}
        </div>
        <div className="col-12">
          <button className="btn btn-primary">{editId ? 'Guardar cambios' : 'Agregar mascota'}</button>
          {editId && <button type="button" className="btn btn-secondary ms-2"
                             onClick={()=>{ setEditId(null); setForm({ nombre:'', edad:'', vacuna:'', raza:'', descripcion:'' }); setErrores({}) }}>
                        Cancelar
                      </button>}
        </div>
      </form>

      <div className="table-responsive">
        <table className="table table-striped align-middle">
          <thead><tr>
            <th>Nombre</th><th>Tipo</th><th>Edad</th><th>Vacuna</th><th>Raza</th><th>Descripción</th><th></th>
          </tr></thead>
          <tbody>
            {lista.map(m=>(
              <tr key={m.id}>
                <td>{m.nombre}</td><td>{m.tipo||'-'}</td><td>{m.edad||'-'}</td><td>{m.vacuna||'-'}</td><td>{m.raza||'-'}</td><td>{m.descripcion||'-'}</td>
                <td className="text-nowrap">
                  <button className="btn btn-sm btn-outline-primary me-2" onClick={()=>onEditar(m)}>Editar</button>
                  <button className="btn btn-sm btn-outline-danger" onClick={()=>onEliminar(m.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
            {lista.length===0 && <tr><td colSpan="7">Sin mascotas aún.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}
