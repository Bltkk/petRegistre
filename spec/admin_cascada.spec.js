
import {
  initDB,
  crearUsuario,
  crearMascota,
  eliminarUsuarioYMascotas,
  listarUsuarios,
  listarMascotasDeUsuario
} from '../src/data/tiendaDB.js';

describe('Admin: eliminación en cascada', ()=>{
  beforeEach(()=>{ localStorage.clear(); initDB() })

  it('elimina usuario y sus mascotas', ()=>{
    const u = crearUsuario({ email:'x@x.cl' })
    crearMascota({ usuarioId:u.id, nombre:'Kira' })
    crearMascota({ usuarioId:u.id, nombre:'Nico' })
    eliminarUsuarioYMascotas(u.id)
    expect(listarUsuarios().some(x=>x.id===u.id)).toBeFalse()
    expect(listarMascotasDeUsuario(u.id).length).toBe(0)
  })
})
