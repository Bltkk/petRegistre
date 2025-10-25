import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import { loginUsuario, crearUsuario, obtenerUsuarioPorEmail } from '../data/tiendaDB.js'

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [modo, setModo] = useState('login')
  const [tipoUsuario, setTipoUsuario] = useState('usuario')
  
  const { login } = useApp()
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (error) setError('')
  }

  const validarFormulario = () => {
    if (!formData.email.trim()) {
      setError('Por favor, ingresa tu email')
      return false
    }
    if (!formData.email.includes('@')) {
      setError('Por favor, ingresa un email válido')
      return false
    }
    if (!formData.password.trim()) {
      setError('Por favor, ingresa tu contraseña')
      return false
    }
    if (formData.password.length < 3) {
      setError('La contraseña debe tener al menos 3 caracteres')
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!validarFormulario()) {
      setLoading(false)
      return
    }

    try {
      const email = formData.email.trim().toLowerCase()
      const password = formData.password

      if (modo === 'login') {
        const usuario = loginUsuario(email, password)
        if (usuario) {
          login(usuario)
          const redirectTo = tipoUsuario === 'admin' && usuario.email === 'admin@admin.cl' 
            ? '/admin' 
            : '/mis-mascotas'
          setTimeout(() => navigate(redirectTo), 500)
        } else {
          setError('⚠️ Email o contraseña incorrectos')
        }
      } else {
        if (obtenerUsuarioPorEmail(email)) {
          setError('⚠️ Este email ya está registrado')
        } else {
          const nuevoUsuario = crearUsuario({ email, nombre: '', password })
          login(nuevoUsuario)
          setTimeout(() => navigate('/mis-mascotas'), 500)
        }
      }
    } catch (err) {
      setError('❌ Error inesperado. Intenta nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  const cambiarModo = () => {
    setModo(modo === 'login' ? 'registro' : 'login')
    setError('')
    setFormData({ email: '', password: '' })
  }

  return (
    <div className="container" style={{ maxWidth: '500px' }}>
      <div className="card my-5">
        <div className="card-body">
          <h2 className="card-title text-center mb-4">
            {modo === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </h2>
          
          {modo === 'login' && (
            <>
              <div className="alert alert-info small mb-3">
                <strong>Admin:</strong> admin@admin.cl / admin.123
              </div>
              
              <div className="mb-3">
                <label className="form-label">Tipo de Usuario</label>
                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className={`btn btn-sm ${tipoUsuario === 'usuario' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setTipoUsuario('usuario')}
                    disabled={loading}
                  >
                    Usuario
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm ${tipoUsuario === 'admin' ? 'btn-warning' : 'btn-outline-warning'}`}
                    onClick={() => setTipoUsuario('admin')}
                    disabled={loading}
                  >
                    Administrador
                  </button>
                </div>
              </div>
            </>
          )}

          {error && (
            <div className="alert alert-danger alert-dismissible fade show">
              <strong>{error}</strong>
              <button type="button" className="btn-close" onClick={() => setError('')}></button>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input 
                type="text"
                className="form-control"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                placeholder="tu@email.com"
              />
            </div>
            
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Contraseña</label>
              <input 
                type="password"
                className="form-control"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                placeholder="Tu contraseña"
              />
            </div>

            <div className="d-grid">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    {modo === 'login' ? 'Ingresando...' : 'Registrando...'}
                  </>
                ) : (
                  modo === 'login' ? 'Ingresar' : 'Registrarse'
                )}
              </button>
            </div>
          </form>

          <div className="text-center mt-3">
            <p>
              {modo === 'login' ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}{' '}
              <button className="btn btn-link p-0" onClick={cambiarModo} disabled={loading}>
                {modo === 'login' ? 'Regístrate aquí' : 'Inicia sesión'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}