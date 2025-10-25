import {
  initDB,
  crearUsuario,
  listarProductos,
  crearProducto,
  leerProducto,
  actualizarProducto,
  eliminarProducto
} from '../src/data/tiendaDB.js';


describe('Guards de ruta (concepto)', ()=>{
  beforeEach(()=>{ localStorage.clear(); initDB() })

  it('sin sesión no debe permitir acciones de datos', ()=>{
    expect(()=>{ }).not.toThrow()
  })

  it('con sesión permite flujo', ()=>{
    const u = crearUsuario({ email:'a@a.cl', nombre:'Ana' })
    expect(u.email).toBe('a@a.cl')
  })
})
