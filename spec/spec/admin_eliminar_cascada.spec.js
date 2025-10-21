import {
  initDB, crearUsuario, crearMascota,
  eliminarUsuarioYMascotas, listarUsuarios, listarMascotasDelUsuario
} from '../src/data/tiendaDB';

describe('Admin eliminar en cascada', () => {
  beforeEach(() => { localStorage.clear(); initDB(); });

  it('borra usuario y todas sus mascotas', () => {
    const u = crearUsuario({ email:'x@x' });
    crearMascota({ usuarioId:u.id, nombre:'Kira' });
    crearMascota({ usuarioId:u.id, nombre:'Nico' });

    eliminarUsuarioYMascotas(u.id);

    expect(listarUsuarios().some(x=>x.id===u.id)).toBeFalse();
    expect(listarMascotasDelUsuario(u.id).length).toBe(0);
  });
});
