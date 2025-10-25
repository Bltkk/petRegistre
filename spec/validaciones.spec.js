
import {
  initDB,
  listarProductos,
  crearProducto,
  leerProducto,
  actualizarProducto,
  eliminarProducto
} from '../src/data/tiendaDB.js';

const reNombre = /^[A-Za-zÁÉÍÓÚÑáéíóúñ ]{2,40}$/

describe('Validaciones de mascota (reglas)', ()=>{
  beforeEach(()=>{ localStorage.clear(); initDB() })

  it('nombre inválido (1 caracter)', ()=>{
    expect(reNombre.test('A')).toBeFalse()
  })

  it('nombre válido (2–40 letras y espacios)', ()=>{
    expect(reNombre.test('Luna')).toBeTrue()
  })

  it('edad fuera de rango', ()=>{
    const ok = (e)=> e>=0 && e<=40
    expect(ok(-1)).toBeFalse()
    expect(ok(41)).toBeFalse()
    expect(ok(10)).toBeTrue()
  })
})
