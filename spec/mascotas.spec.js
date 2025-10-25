// Este es el archivo: spec/mascotas.spec.js

import {
  initDB,
  crearUsuario,
  crearMascota,
  actualizarMascota,
  eliminarMascota,
  listarMascotasPorUsuario
} from '../src/data/tiendaDB.js';

// -----------------------------------------------------------------

describe('Mascotas', () => {

  let usuario;

  
  beforeEach(() => {
   
    localStorage.removeItem('petcontrolDB');
    
    initDB(); 
    usuario = crearUsuario({ email: 'user@test.com', nombre: 'Test User' });
  });

  
  it('crea y lista por usuario', () => {
    crearMascota({ usuarioId: usuario.id, nombre: 'Mascota 1' });
    crearMascota({ usuarioId: usuario.id, nombre: 'Mascota 2' });

    const mascotas = listarMascotasPorUsuario(usuario.id);

    expect(mascotas.length).toBe(2);
    expect(mascotas[0].nombre).toBe('Mascota 1');
  });

  
  it('actualiza mascota', () => {
    const mascota = crearMascota({ usuarioId: usuario.id, nombre: 'Nombre Viejo', edad: 3 });
    const datosNuevos = { nombre: 'Nombre Nuevo', edad: 4 };
    
    actualizarMascota(mascota.id, datosNuevos);

    const mascotas = listarMascotasPorUsuario(usuario.id);
    expect(mascotas[0].nombre).toBe('Nombre Nuevo');
    expect(mascotas[0].edad).toBe(4);
  });

  
  it('elimina mascota', () => {

    const mascota = crearMascota({ usuarioId: usuario.id, nombre: 'Mascota a borrar' });
    
   
    expect(listarMascotasPorUsuario(usuario.id).length).toBe(1); 

   
    eliminarMascota(mascota.id);


    expect(listarMascotasPorUsuario(usuario.id).length).toBe(0); 
  });

});