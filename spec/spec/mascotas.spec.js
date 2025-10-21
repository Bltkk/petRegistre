 import {
  initDB, crearUsuario, crearMascota,
  listarMascotasPorUsuario, actualizarMascota, eliminarMascota
} from '../src/data/tiendaDB';

describe('Mascotas', () => {
  beforeEach(() => { localStorage.clear(); initDB(); });

  it('crea y lista por usuario', () => {
    const u = crearUsuario({ email: 'a@a.cl', nombre: 'Ana' });
    crearMascota({ usuarioId: u.id, nombre: 'Luna', edad: 3 });
    const l = listarMascotasPorUsuario(u.id);
    expect(l.length).toBe(1);
    expect(l[0].nombre).toBe('Luna');
  });

  it('actualiza mascota', () => {
    const u = crearUsuario({ email: 'b@b.cl' });
    const m = crearMascota({ usuarioId: u.id, nombre: 'Tobi', edad: 1 });
    const upd = actualizarMascota(m.id, { edad: 2 });
    expect(upd.edad).toBe(2);
  });

  it('elimina mascota', () => {
    const u = crearUsuario({ email: 'c@c.cl' });
    const m = crearMascota({ usuarioId: u.id, nombre: 'Kira' });
    eliminarMascota(m.id);
    expect(listarMascotasPorUsuario(u.id).length).toBe(0);
  });
});
