

import {
  initDB,
  crearUsuario,
  crearMascota,
  eliminarUsuarioYMascotas,
  listarTodasLasMascotas,
  listarUsuarios
} from '../src/data/tiendaDB.js';

describe('Admin: eliminación en cascada', () => {

  beforeEach(() => {
    localStorage.clear();
    initDB();
  });

  it('elimina usuario y sus mascotas', () => {

    const usuario1 = crearUsuario({ email: 'a@a.cl', nombre: 'Test User 1' });
    const usuario2 = crearUsuario({ email: 'otro@test.com', nombre: 'Test User 2' });

    crearMascota({ usuarioId: usuario1.id, nombre: 'Mascota 1' });
    crearMascota({ usuarioId: usuario2.id, nombre: 'Mascota 3' });

    eliminarUsuarioYMascotas(usuario1.id);

    const usuariosFinales = listarUsuarios();

    expect(usuariosFinales.length).toBe(1);
    expect(usuariosFinales[0].email).toBe('otro@test.com');
  });

});
