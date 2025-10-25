// Este es el archivo: spec/mascota_crud.spec.js

import {
  initDB,
  crearUsuario,
  crearMascota,
  eliminarMascota,
  listarMascotasPorUsuario,
  listarTodasLasMascotas
} from '../src/data/tiendaDB.js';

describe('CRUD de mascota', () => {

  let usuario; 

  
  beforeEach(() => {
   
    localStorage.removeItem('petcontrolDB');
    
    initDB(); 
    usuario = crearUsuario({ email: 'user@test.com', nombre: 'Test User' });
  });

  it('elimina mascota específica', () => {
    
    const mascota1 = crearMascota({ usuarioId: usuario.id, nombre: 'Mascota 1' });
    const mascota2 = crearMascota({ usuarioId: usuario.id, nombre: 'Mascota 2' });

 
    let mascotas = listarMascotasPorUsuario(usuario.id);
    expect(mascotas.length).toBe(2); 

    
    eliminarMascota(mascota1.id);

    
    let mascotasFinales = listarMascotasPorUsuario(usuario.id);

  
    expect(mascotasFinales.length).toBe(1); 
    
    
    expect(mascotasFinales[0].nombre).toBe('Mascota 2'); 
    expect(mascotasFinales[0].id).toBe(mascota2.id); 
  });

});