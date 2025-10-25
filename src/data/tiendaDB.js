// Este es el archivo: src/data/tiendaDB.js

let _db = { usuarios: [], mascotas: [] };

function flush(){ localStorage.setItem('petcontrolDB', JSON.stringify(_db)); }
function ensureSchema(){
  _db.usuarios = Array.isArray(_db.usuarios) ? _db.usuarios : [];
  _db.mascotas = Array.isArray(_db.mascotas) ? _db.mascotas : [];
  flush();
}

export function initDB(){
  _db = { usuarios: [], mascotas: [] };
  
  const raw = localStorage.getItem('petcontrolDB');
  if (raw){
    try { _db = JSON.parse(raw) || _db; } catch {}
    ensureSchema();
    return;
  }
  ensureSchema();
}

// ===== USUARIOS =====

// MODIFICADO: Ahora acepta y guarda 'password'
export function crearUsuario({email, nombre, password}){
  const existe = _db.usuarios.find(u=>u.email===email);
  if (existe) return existe;
  
  const u = { 
    id: (crypto?.randomUUID?.() ?? String(Date.now())), 
    email, 
    nombre: nombre||'', 
    password: password || '1234', // Añadimos la contraseña
    creadoEn: new Date().toISOString() 
  };
  _db.usuarios.push(u); 
  flush(); 
  return u;
}

export function obtenerUsuarioPorEmail(email){
  return _db.usuarios.find(u=>u.email===email) || null;
}

// NUEVA FUNCIÓN: Necesaria para el login
export function loginUsuario(email, password) {
  const usuario = obtenerUsuarioPorEmail(email);
  
  // Comprueba si el usuario existe y la contraseña coincide
  if (usuario && usuario.password === password) {
    return usuario;
  }
  // Si no, devuelve null
  return null;
}

// ===== MASCOTAS (por usuario) =====
export function crearMascota({usuarioId, nombre, edad, vacuna, raza, tipo, descripcion}){
  const m = {
    id: (crypto?.randomUUID?.() ?? String(Date.now())),
    usuarioId,
    nombre: (nombre||'').trim(),
    edad: Number(edad||0),
    vacuna: (vacuna||'').trim(),
    raza: (raza||'').trim(),
    tipo: (tipo||'').trim(),
    descripcion: (descripcion||'').trim(),
    creadaEn: new Date().toISOString()
  };
  _db.mascotas.push(m); flush(); return m;
}
export function listarMascotasPorUsuario(usuarioId){
  if(!_db?.mascotas) return [];
  return _db.mascotas.filter(m=>m.usuarioId===usuarioId);
}
export function actualizarMascota(id, patch){
  const i = _db.mascotas.findIndex(m=>m.id===id);
  if (i<0) return null;
  _db.mascotas[i] = { ..._db.mascotas[i], ...patch };
  flush(); return _db.mascotas[i];
}
export function eliminarMascota(id){
  _db.mascotas = _db.mascotas.filter(m=>m.id!==id);
  flush();
}

export function listarUsuarios(){ return [..._db.usuarios] }
export function listarTodasLasMascotas(){ return [..._db.mascotas] }
export function listarMascotasDeUsuario(usuarioId){ return _db.mascotas.filter(m=>m.usuarioId===usuarioId) }

export function eliminarUsuarioYMascotas(usuarioId){
  _db.usuarios = _db.usuarios.filter(u=>u.id!==usuarioId)
  _db.mascotas = _db.mascotas.filter(m=>m.usuarioId!==usuarioId)
  flush()
}

// Crear usuario admin por defecto si no existe
if (!obtenerUsuarioPorEmail('admin@admin.cl')) {
  crearUsuario({ email: 'admin@admin.cl', nombre: 'Administrador', password: 'admin.123' });
}
