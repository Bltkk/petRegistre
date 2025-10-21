import {
  initDB, crearUsuario, crearMascota, actualizarMascota, eliminarMascota, listarMascotasDelUsuario
} from '../src/data/tiendaDB';

describe('CRUD de mascota', () => {
  beforeEach(() => { localStorage.clear(); initDB(); });

  it('actualiza campos de mascota', () => {
    const u = crearUsuario({ email:'c@c' });
    const m = crearMascota({ usuarioId:u.id, nombre:'Lolo', edad:1, raza:'mestizo' });
    const upd = actualizarMascota(m.id, { edad:2, vacunas:['antirrábica'] });
    expect(upd.edad).toBe(2);
    expect(upd.vacunas).toEqual(['antirrábica']);
  });

  it('elimina mascota específica', () => {
    const u = crearUsuario({ email:'d@d' });
    const m1 = crearMascota({ usuarioId:u.id, nombre:'A' });
    const m2 = crearMascota({ usuarioId:u.id, nombre:'B' });
    eliminarMascota(m1.id);
    const list = listarMascotasDelUsuario(u.id).map(x=>x.nombre);
    expect(list).toEqual(['B']);
  });
});
