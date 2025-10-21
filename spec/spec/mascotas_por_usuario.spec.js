import {
  initDB, crearUsuario, crearMascota, listarMascotasDelUsuario
} from '../src/data/tiendaDB';

describe('Mascotas por usuario', () => {
  beforeEach(() => { localStorage.clear(); initDB(); });

  it('filtra por usuario correcto', () => {
    const u1 = crearUsuario({ email:'u1@cl' });
    const u2 = crearUsuario({ email:'u2@cl' });
    crearMascota({ usuarioId: u1.id, nombre:'Luna' });
    crearMascota({ usuarioId: u2.id, nombre:'Tobi' });

    const m1 = listarMascotasDelUsuario(u1.id);
    const m2 = listarMascotasDelUsuario(u2.id);

    expect(m1.map(x=>x.nombre)).toEqual(['Luna']);
    expect(m2.map(x=>x.nombre)).toEqual(['Tobi']);
  });
});
