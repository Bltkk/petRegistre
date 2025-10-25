import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { loginUsuario, crearUsuario, obtenerUsuarioPorEmail } from '../data/tiendaDB.js';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [modo, setModo] = useState('login'); // 'login' o 'registro'
  const [tipoUsuario, setTipoUsuario] = useState('usuario'); // 'usuario' o 'admin'
  
  const { login } = useApp(); // Función del context para "iniciar sesión"
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(''); // Limpia errores

    if (modo === 'login') {
      // --- Lógica de Login ---
      const usuario = loginUsuario(email, password);

      if (usuario) {
        login(usuario); // Guarda el usuario en el context
        if (tipoUsuario === 'admin') {
          navigate('/admin'); // Redirige a Admin si seleccionó administrador
        } else {
          navigate('/mis-mascotas'); // Redirige a "Mis Mascotas"
        }
      } else {
        setError('Email o contraseña incorrectos.');
      }

    } else {
      // --- Lógica de Registro ---
      if (obtenerUsuarioPorEmail(email)) {
        setError('Este email ya está registrado.');
        return;
      }

      const nuevoUsuario = crearUsuario({ email: email, nombre: '', password: password });
      login(nuevoUsuario); // Inicia sesión automáticamente
      navigate('/mis-mascotas'); // Redirige
    }
  };

  return (
    <div className="container" style={{ maxWidth: '500px' }}>
      <div className="card my-5">
        <div className="card-body">
          <h2 className="card-title text-center mb-4">
            {modo === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </h2>
          {modo === 'login' && (
            <div className="alert alert-info small mb-3">
              <strong>Admin:</strong> admin@admin.cl / admin.123
            </div>
          )}

          {modo === 'login' && (
            <div className="mb-3">
              <label className="form-label">Tipo de Usuario</label>
              <div className="d-flex gap-2">
                <button
                  type="button"
                  className={`btn ${tipoUsuario === 'usuario' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setTipoUsuario('usuario')}
                >
                  Usuario
                </button>
                <button
                  type="button"
                  className={`btn ${tipoUsuario === 'admin' ? 'btn-warning' : 'btn-outline-warning'}`}
                  onClick={() => setTipoUsuario('admin')}
                >
                  Administrador
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input 
                type="email" 
                className="form-control" 
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Contraseña</label>
              <input 
                type="password" 
                className="form-control" 
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
            
            {error && <div className="alert alert-danger p-2">{error}</div>}

            <div className="d-grid">
              <button type="submit" className="btn btn-primary">
                {modo === 'login' ? 'Ingresar' : 'Registrarse'}
              </button>
            </div>
          </form>

          <div className="text-center mt-3">
            {modo === 'login' ? (
              <p>
                ¿No tienes cuenta?{' '}
                <button 
                  className="btn btn-link p-0" 
                  onClick={() => { setModo('registro'); setError(''); }}
                >
                  Regístrate aquí
                </button>
              </p>
            ) : (
              <p>
                ¿Ya tienes cuenta?{' '}
                <button 
                  className="btn btn-link p-0" 
                  onClick={() => { setModo('login'); setError(''); }}
                >
                  Inicia sesión
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}