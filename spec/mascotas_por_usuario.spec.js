// Este es el archivo: spec/mascotas_por_usuario.spec.js

import {
  initDB,
  crearUsuario,             
  crearMascota,             
  listarMascotasPorUsuario  
} from '../src/data/tiendaDB.js'; 

describe('Mascotas por usuario', () => {


  it('filtra por usuario correcto', () => {
    
    
    initDB(); 
    
    const usuarioA = crearUsuario({ email: 'usuarioA@test.com', nombre: 'Usuario A' });
    const usuarioB = crearUsuario({ email: 'usuarioB@test.com', nombre: 'Usuario B' });

    crearMascota({ usuarioId: usuarioA.id, nombre: 'Perro de A' });
    crearMascota({ usuarioId: usuarioA.id, nombre: 'Gato de A' });
    
    crearMascota({ usuarioId: usuarioB.id, nombre: 'Pez de B' }); 
   
    const mascotasDeA = listarMascotasPorUsuario(usuarioA.id);

    expect(mascotasDeA.length).toBe(2);
    
    expect(mascotasDeA[0].nombre).toBe('Perro de A');
    expect(mascotasDeA[1].nombre).toBe('Gato de A');

    
    const mascotasDeB = listarMascotasPorUsuario(usuarioB.id);
    expect(mascotasDeB.length).toBe(1);
    expect(mascotasDeB[0].nombre).toBe('Pez de B');
  });

});