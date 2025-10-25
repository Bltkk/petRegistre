import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import {
  listarUsuarios,
  listarTodasLasMascotas,
  eliminarUsuarioYMascotas,
  listarMascotasDeUsuario
} from '../data/tiendaDB.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Admin() {
  const { usuarioActual } = useApp();
  const [usuarios, setUsuarios] = useState([]);
  const [mascotas, setMascotas] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [mascotasUsuario, setMascotasUsuario] = useState([]);
  const [mostrarGrafico, setMostrarGrafico] = useState(false);

  const cargarDatos = () => {
    setUsuarios(listarUsuarios());
    setMascotas(listarTodasLasMascotas());
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleEliminarUsuario = (usuarioId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario y todas sus mascotas?')) {
      eliminarUsuarioYMascotas(usuarioId);
      cargarDatos();
      if (usuarioSeleccionado && usuarioSeleccionado.id === usuarioId) {
        setUsuarioSeleccionado(null);
        setMascotasUsuario([]);
      }
    }
  };

  const verMascotasUsuario = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setMascotasUsuario(listarMascotasDeUsuario(usuario.id));
  };

  // Función para generar datos del gráfico
  const generarDatosGrafico = () => {
    const tipos = {};
    mascotas.forEach(mascota => {
      const tipo = mascota.tipo || 'Sin tipo';
      tipos[tipo] = (tipos[tipo] || 0) + 1;
    });

    const labels = Object.keys(tipos);
    const data = Object.values(tipos);

    return {
      labels,
      datasets: [
        {
          label: 'Cantidad de Mascotas',
          data,
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  const opcionesGrafico = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Distribución de Tipos de Mascotas',
      },
    },
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">Panel de Administración</h2>
      <p className="text-muted">Sesión: {usuarioActual?.email}</p>

      <div className="row">
        {/* Columna de Usuarios */}
        <div className="col-md-6">
          <h3>Total de Usuarios ({usuarios.length})</h3>
          <div className="list-group">
            {usuarios.map(usuario => (
              <li key={usuario.id} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <strong>{usuario.nombre || 'Sin nombre'}</strong>
                  <br />
                  <small className="text-muted">{usuario.email}</small>
                </div>
                <div>
                  <button
                    className="btn btn-info btn-sm me-2"
                    onClick={() => verMascotasUsuario(usuario)}
                  >
                    Ver Mascotas
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleEliminarUsuario(usuario.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </div>
        </div>

        {/* Columna de Mascotas del Usuario Seleccionado */}
        <div className="col-md-6">
          {usuarioSeleccionado ? (
            <>
              <h3>Mascotas de {usuarioSeleccionado.nombre || usuarioSeleccionado.email}</h3>
              <div className="list-group">
                {mascotasUsuario.length > 0 ? (
                  mascotasUsuario.map(mascota => (
                    <li key={mascota.id} className="list-group-item">
                      <>
                        <strong>{mascota.nombre || 'Sin nombre'}</strong>
                        <br />
                        <small className="text-muted">
                          Tipo: {mascota.tipo || 'N/A'} | Raza: {mascota.raza || 'N/A'} | Edad: {mascota.edad || 'N/A'}
                        </small>
                        {mascota.descripcion && (
                          <>
                            <br />
                            <small className="text-muted">{mascota.descripcion}</small>
                          </>
                        )}
                      </>
                    </li>
                  ))
                ) : (
                  <li className="list-group-item text-muted">Este usuario no tiene mascotas registradas.</li>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-5">
              <h4>Selecciona un usuario</h4>
              <p className="text-muted">Haz clic en "Ver Mascotas" para ver las mascotas de un usuario específico.</p>
            </div>
          )}
        </div>
      </div>

      {/* Estadísticas Generales */}
      <div className="row mt-4">
        <div className="col-12">
          <h4>Estadísticas Generales</h4>
          <div className="row">
            <div className="col-md-3">
              <div className="card text-center">
                <div className="card-body">
                  <h5 className="card-title">{usuarios.length}</h5>
                  <p className="card-text">Usuarios Registrados</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-center">
                <div className="card-body">
                  <h5 className="card-title">{mascotas.length}</h5>
                  <p className="card-text">Mascotas Totales</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-center">
                <div className="card-body">
                  <h5 className="card-title">
                    {mascotas.length > 0 ? (mascotas.length / usuarios.length).toFixed(1) : 0}
                  </h5>
                  <p className="card-text">Mascotas por Usuario</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-center">
                <div className="card-body">
                  <h5 className="card-title">
                    {mascotas.filter(m => m.tipo === 'Perro').length}
                  </h5>
                  <p className="card-text">Perros Registrados</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gráfico de Mascotas */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4>Gráfico de Mascotas</h4>
            <button
              className="btn btn-primary"
              onClick={() => setMostrarGrafico(!mostrarGrafico)}
            >
              {mostrarGrafico ? 'Ocultar Gráfico' : 'Mostrar Gráfico'}
            </button>
          </div>
          {mostrarGrafico && (
            <div className="card">
              <div className="card-body">
                <Bar data={generarDatosGrafico()} options={opcionesGrafico} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
