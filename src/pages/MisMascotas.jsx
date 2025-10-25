import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

// Constantes y utilidades
const NOMBRE_REGEX = /^[A-Za-zÁÉÍÓÚÑáéíóúñ ]{2,40}$/
const truncate = (str, max) => (str || '').trim().slice(0, max)
const FORM_INICIAL = { nombre: '', edad: '', vacuna: '', raza: '', tipo: '', descripcion: '' }

export default function MisMascotas() {
  const { usuarioActual, obtenerMisMascotas, agregarMascota, editarMascota, borrarMascota } = useApp()
  const navigate = useNavigate()
  
  // Estados
  const [lista, setLista] = useState([])
  const [form, setForm] = useState(FORM_INICIAL)
  const [editId, setEditId] = useState(null)
  const [errores, setErrores] = useState({})
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  // Efectos
  useEffect(() => {
    if (!usuarioActual) {
      navigate('/login')
      return
    }
    setLista(obtenerMisMascotas())
  }, [usuarioActual, navigate, obtenerMisMascotas])

  // Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    
    // Limpiar errores
    if (error) setError('')
    if (success) setSuccess('')
    if (errores[name]) setErrores(prev => ({ ...prev, [name]: '' }))
  }

  const validarFormulario = () => {
    const erroresTemp = {}
    const nombre = truncate(form.nombre, 40)
    
    if (!nombre) {
      erroresTemp.nombre = '🐾 El nombre es obligatorio'
      setError('🐾 Por favor, ingresa el nombre de tu mascota')
    } else if (!NOMBRE_REGEX.test(nombre)) {
      erroresTemp.nombre = '🐾 Solo letras y espacios (2-40 caracteres)'
      setError('🐾 El nombre solo puede contener letras y espacios')
    }
    
    if (form.edad && (+form.edad < 0 || +form.edad > 40)) {
      erroresTemp.edad = '📅 Edad entre 0 y 40 años'
      setError('📅 La edad debe estar entre 0 y 40 años')
    }
    
    if (truncate(form.vacuna, 40) !== form.vacuna) {
      erroresTemp.vacuna = '💉 Máximo 40 caracteres'
    }
    
    if (truncate(form.raza, 40) !== form.raza) {
      erroresTemp.raza = '🦴 Máximo 40 caracteres'
    }
    
    if (truncate(form.descripcion, 200) !== form.descripcion) {
      erroresTemp.descripcion = '📝 Máximo 200 caracteres'
    }
    
    return erroresTemp
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    
    const erroresValidacion = validarFormulario()
    setErrores(erroresValidacion)
    
    if (Object.keys(erroresValidacion).length > 0) {
      setLoading(false)
      return
    }

    try {
      const payload = {
        nombre: truncate(form.nombre, 40),
        edad: form.edad === '' ? 0 : Number(form.edad),
        vacuna: truncate(form.vacuna, 40),
        raza: truncate(form.raza, 40),
        tipo: truncate(form.tipo, 40),
        descripcion: truncate(form.descripcion, 200)
      }

      if (editId) {
        editarMascota(editId, payload)
        setSuccess('✅ Mascota actualizada exitosamente!')
        setEditId(null)
      } else {
        agregarMascota(payload)
        setSuccess('🎉 Mascota registrada exitosamente!')
      }

      setForm(FORM_INICIAL)
      setErrores({})
      setLista(obtenerMisMascotas())
      
    } catch (err) {
      setError('❌ Error inesperado. Intenta nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleEditar = (mascota) => {
    setEditId(mascota.id)
    setForm({
      nombre: mascota.nombre || '',
      edad: mascota.edad == null ? '' : String(mascota.edad),
      vacuna: mascota.vacuna || '',
      raza: mascota.raza || '',
      tipo: mascota.tipo || '',
      descripcion: mascota.descripcion || ''
    })
    limpiarAlertas()
  }

  const handleEliminar = (id) => {
    if (!confirm('🗑️ ¿Eliminar esta mascota?')) return
    
    try {
      borrarMascota(id)
      setLista(obtenerMisMascotas())
      setSuccess('🗑️ Mascota eliminada correctamente')
    } catch (error) {
      setError('❌ Error al eliminar la mascota. Intenta nuevamente.')
    }
  }

  const limpiarAlertas = () => {
    setError('')
    setSuccess('')
  }

  // Deshabilitar validaciones HTML del navegador
  useEffect(() => {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
      form.setAttribute('novalidate', 'true');
    });
  }, []);

  if(!usuarioActual) return null

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>🐾 Mis Mascotas</h3>
        <div className="badge bg-primary">{lista.length} mascota{lista.length !== 1 ? 's' : ''}</div>
      </div>

      {/* Alerta de éxito */}
      {success && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          <strong>{success}</strong>
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setSuccess('')}
            aria-label="Cerrar"
          ></button>
        </div>
      )}

      {/* Alerta de error general */}
      {error && (
        <div className="alert alert-warning alert-dismissible fade show" role="alert">
          <strong>{error}</strong>
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setError('')}
            aria-label="Cerrar"
          ></button>
        </div>
      )}

      <div className="card mb-4">
        <div className="card-header">
          <h5 className="mb-0">
            {editId ? '✏️ Editar Mascota' : '➕ Agregar Nueva Mascota'}
          </h5>
        </div>
        <div className="card-body">
          <form className="row g-3" onSubmit={handleSubmit} noValidate>
            <div className="col-sm-6 col-md-4">
              <label className="form-label">
                Nombre <span className="text-danger">*</span>
              </label>
              <input 
                className={`form-control ${errores.nombre?'is-invalid':''}`}
                name="nombre" 
                value={form.nombre} 
                onChange={handleInputChange}
                placeholder="Ej: Firulais"
                disabled={loading}
              />
              {errores.nombre && <div className="invalid-feedback">{errores.nombre}</div>}
            </div>
            
            <div className="col-sm-6 col-md-2">
              <label className="form-label">Edad (años)</label>
              <input 
                className={`form-control ${errores.edad?'is-invalid':''}`}
                type="number" 
                name="edad" 
                value={form.edad} 
                onChange={handleInputChange}
                placeholder="Ej: 3"
                disabled={loading}
              />
              {errores.edad && <div className="invalid-feedback">{errores.edad}</div>}
            </div>
            
            <div className="col-sm-6 col-md-3">
              <label className="form-label">Tipo</label>
              <select 
                className="form-select" 
                name="tipo" 
                value={form.tipo} 
                onChange={handleInputChange}
                disabled={loading}
              >
                <option value="">Seleccionar...</option>
                <option value="Perro">🐕 Perro</option>
                <option value="Gato">🐱 Gato</option>
                <option value="Pájaro">🦜 Pájaro</option>
                <option value="Conejo">🐰 Conejo</option>
                <option value="Otro">🐾 Otro</option>
              </select>
            </div>
            
            <div className="col-sm-6 col-md-3">
              <label className="form-label">Raza</label>
              <input 
                className={`form-control ${errores.raza?'is-invalid':''}`}
                name="raza" 
                value={form.raza} 
                onChange={handleInputChange}
                placeholder="Ej: Golden Retriever"
                disabled={loading}
              />
              {errores.raza && <div className="invalid-feedback">{errores.raza}</div>}
            </div>
            
            <div className="col-sm-6 col-md-6">
              <label className="form-label">Vacuna</label>
              <input 
                className={`form-control ${errores.vacuna?'is-invalid':''}`}
                name="vacuna" 
                value={form.vacuna} 
                onChange={handleInputChange}
                placeholder="Ej: Antirrábica"
                disabled={loading}
              />
              {errores.vacuna && <div className="invalid-feedback">{errores.vacuna}</div>}
            </div>
            
            <div className="col-12">
              <label className="form-label">Descripción</label>
              <textarea 
                className={`form-control ${errores.descripcion?'is-invalid':''}`}
                name="descripcion" 
                rows="2" 
                value={form.descripcion} 
                onChange={handleInputChange}
                placeholder="Información adicional sobre tu mascota..."
                disabled={loading}
              />
              {errores.descripcion && <div className="invalid-feedback">{errores.descripcion}</div>}
            </div>
            
            <div className="col-12">
              <button 
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    {editId ? 'Guardando...' : 'Agregando...'}
                  </>
                ) : (
                  editId ? '💾 Guardar cambios' : '➕ Agregar mascota'
                )}
              </button>
              
              {editId && (
                <button 
                  type="button" 
                  className="btn btn-secondary ms-2"
                  onClick={()=>{ 
                    setEditId(null)
                    setForm(FORM_INICIAL)
                    setErrores({})
                    setError('')
                    setSuccess('')
                  }}
                  disabled={loading}
                >
                  ❌ Cancelar
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h5 className="mb-0">📋 Lista de Mascotas</h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>🐾 Nombre</th>
                  <th>🔖 Tipo</th>
                  <th>📅 Edad</th>
                  <th>💉 Vacuna</th>
                  <th>🦴 Raza</th>
                  <th>📝 Descripción</th>
                  <th>⚙️ Acciones</th>
                </tr>
              </thead>
              <tbody>
                {lista.map(m=>(
                  <tr key={m.id}>
                    <td><strong>{m.nombre}</strong></td>
                    <td>{m.tipo||'-'}</td>
                    <td>{m.edad||'-'}</td>
                    <td>{m.vacuna||'-'}</td>
                    <td>{m.raza||'-'}</td>
                    <td className="text-truncate" style={{maxWidth: '150px'}}>{m.descripcion||'-'}</td>
                    <td className="text-nowrap">
                      <button 
                        className="btn btn-sm btn-outline-primary me-2" 
                        onClick={()=>handleEditar(m)}
                        title="Editar mascota"
                      >
                        ✏️ Editar
                      </button>
                      <button 
                        className="btn btn-sm btn-outline-danger" 
                        onClick={()=>handleEliminar(m.id)}
                        title="Eliminar mascota"
                      >
                        🗑️ Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
                {lista.length===0 && (
                  <tr>
                    <td colSpan="7" className="text-center py-4">
                      <div className="text-muted">
                        <h5>🐾 No tienes mascotas registradas aún</h5>
                        <p>¡Agrega tu primera mascota usando el formulario de arriba!</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
