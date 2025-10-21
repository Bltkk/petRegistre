import {
  initDB, crearUsuario, listarUsuarios
} from '../src/data/tiendaDB';

describe('Usuarios', () => {
  beforeEach(() => { localStorage.clear(); initDB(); });

  it('crea usuario y aparece en la lista', () => {
    const u = crearUsuario({ email: 'ana@cl', nombre: 'Ana' });
    const all = listarUsuarios();
    expect(all.some(x => x.id === u.id && x.email === 'ana@cl')).toBeTrue();
  });

  it('dos usuarios diferentes', () => {
    crearUsuario({ email: 'a@a', nombre: 'A' });
    crearUsuario({ email: 'b@b', nombre: 'B' });
    expect(listarUsuarios().length).toBe(2);
  });
});
