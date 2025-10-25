

import {
  initDB,
  crearUsuario,
  listarUsuarios
} from '../src/data/tiendaDB.js';

describe('Pruebas de Usuarios', () => {

  beforeEach(() => {
    localStorage.clear();
    initDB();
  });

  describe('dos usuarios diferentes', () => {

    it('debe poder crear dos usuarios y listarlos', () => {

      crearUsuario({ email: 'user1@test.com', nombre: 'User 1' });
      crearUsuario({ email: 'user2@test.com', nombre: 'User 2' });

      const usuarios = listarUsuarios();

      expect(usuarios.length).toBe(2);
      expect(usuarios[0].email).toBe('user1@test.com');
      expect(usuarios[1].email).toBe('user2@test.com');
    });

  });

  describe('sanity', () => {
    it('suma', () => {
      expect(1 + 2).toBe(3);
    });
  });

});
